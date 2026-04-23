# Student Enquiry Intake v1 â€” How It Works

**Last updated:** 2026-04-22
**Flow name:** Student enquiry intake - v1
**Flow owner account:** hfnt93@durham.ac.uk
**Pilot inbox:** david.chivers@durham.ac.uk
**Environment:** Durham University (Default-7250d88b-4b68-4529-be44-d59a2d8a6f94)
**Flow ID:** eda14061-b269-4106-97d0-7ff0b6ea6ed7

---

## Overview

This is a Power Automate flow that handles inbound student enquiries submitted via a Microsoft Form. When a student submits the form:

1. The flow reads the form response
2. Looks up the student in an Excel workbook by email address
3. Determines the enquiry type and routes a suggested owner
4. Sends a formatted notification email to the staff inbox
5. Sends an acknowledgement email to the student
6. On failure, sends an alert email to the pilot inbox

The system is designed for pilot testing. In v1, the staff notification goes to a single pilot inbox (david.chivers@durham.ac.uk). In production (Step 9), this would switch to a shared mailbox.

---

## Architecture

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Microsoft Form | hfnt93@durham.ac.uk's Forms | Student-facing intake form |
| Power Automate flow | Default environment | Orchestration and logic |
| Excel lookup workbook | OneDrive (hfnt93) | Student database lookup |
| Staff email (v1) | david.chivers@durham.ac.uk | Staff notification during pilot |
| Student acknowledgement | Student's university email | Confirms receipt |
| Failure alert | david.chivers@durham.ac.uk | Flow error notification |

### Trigger

The flow is triggered by **"When a new response is submitted"** (Microsoft Forms connector). It fires once per form submission, in real time.

---

## Flow Actions â€” Full Sequence

### Step 1: Trigger â€” When a new response is submitted
- Connector: Microsoft Forms
- Fires when a student submits the form
- Provides: `resourceData/responseId`

### Step 2: Get response details
- Connector: Microsoft Forms â€” GetFormResponseById
- Form ID: `i9hQcmhLKUW-RNWaLYpvlHSQXty3KytLj5av1xnWvfJUQUdKMFQyTFVWSlk1RTBBMjA5RDNBUEdXRC4u`
- Uses: `responseId` from trigger
- Returns: all form field values plus metadata (submit date, responder email)
- Key fields in output body:
  - `body/responder` â€” respondent email (from Microsoft 365 identity)
  - `body/submitDate` â€” submission timestamp
  - `body/rf6fd996f97c24dec8d088691b367882e` â€” "Enquiry type" question response
  - `body/r9c50673ec02847bbb4505805c460a917` â€” "Other enquiry type" question response
  - `body/r7ab4bdb1e6974415bb9e604ade29bd13` â€” "Message" question response

### Steps 3â€“8: Email normalisation

| Action | Expression | Purpose |
|--------|-----------|---------|
| Compose_RecordedResponderEmail | `outputs('Get_response_details')?['body/responder']` | Raw email from Forms |
| Compose_NormalizedResponderEmail | `toLower(trim(outputs('Compose_RecordedResponderEmail')))` | Lowercase + trimmed for lookup |
| Compose_SelectedUsername | `first(split(outputs('Compose_NormalizedResponderEmail'),'@'))` | Username part (before @) |
| Compose_SelectedStudentEmail | `if(not(empty(...)),outputs('Compose_NormalizedResponderEmail'),'')` | Clean email or empty |
| Compose_ResponseId | `triggerOutputs()?['body/resourceData/responseId']` | Raw response ID |
| Compose_ReferenceNumber | `concat('DEPT-',formatDateTime(utcNow(),'yyyy'),'-',substring(concat('000000',string(outputs('Compose_ResponseId'))),sub(length(concat('000000',string(outputs('Compose_ResponseId')))),6),6))` | e.g. DEPT-2026-000042 |

### Steps 9â€“19: Initialise variables

All variables are initialised to empty string or false before the lookup runs.

| Variable | Type | Initial value | Purpose |
|----------|------|--------------|---------|
| lookup_matched | Boolean | false | Whether lookup succeeded |
| student_name | String | (empty) | From Excel |
| student_id | String | (empty) | From Excel |
| resolved_programme | String | (empty) | From Excel |
| resolved_stage | String | (empty) | Undergraduate / Taught PG |
| resolved_year | String | (empty) | Year of study |
| academic_advisor | String | (empty) | Advisor name |
| banner_link | String | (empty) | URL to Banner record |
| banner_code | String | (empty) | Banner identifier |
| lookup_status | String | (empty) | "Matched" or "Not matched" |
| suggested_owner | String | (empty) | Routing recommendation |

### Step 20: Scope â€” Lookup student
- Contains one action: **Get a row** (Excel Online Business)
- Workbook: `student_lookup_template.xlsx` on OneDrive (hfnt93)
- Table: `StudentLookup`
- Key column: `UniversityEmailNormalized`
- Key value: `outputs('Compose_NormalizedResponderEmail')`
- Succeeds if the email is found in the table; fails/times-out if not found
- Important: the value must exactly match the recorded responder email after lowercasing and trimming. For example, the test account must appear as `hfnt93@durham.ac.uk`, not the old placeholder `hfnt93@university.ac.uk`; otherwise the flow falls back to the username in the staff email.

### Step 21: Scope â€” On lookup match
- **Run after:** Lookup student â€” is successful
- Sets all student variables from the Excel row:
  - `lookup_matched` â†’ true
  - `student_name`, `student_id`, `resolved_programme`, `resolved_stage`, `resolved_year`
  - `academic_advisor`, `banner_link`, `banner_code`
  - `lookup_status` â†’ "Matched"

### Step 22: Scope â€” On lookup miss
- **Run after:** Lookup student â€” has failed / has timed out / is skipped
- Sets fallback values:
  - `lookup_matched` â†’ false
  - `student_name`, `student_id`, `academic_advisor`, `banner_link`, `banner_code` â†’ "Not found"
  - `lookup_status` â†’ "Not matched"
  - `resolved_programme`, `resolved_stage`, `resolved_year` â€” **not set here**; they were initialised to empty string in Step 9â€“19 and are intentionally left as empty on a lookup miss (the new designer rejects Set variable actions with a blank value, so these are omitted).

### Steps 23â€“25: Enquiry type composes

| Action | Expression |
|--------|-----------|
| Compose_EnquiryType | `outputs('Get_response_details')?['body/rf6fd996f97c24dec8d088691b367882e']` |
| Compose_OtherEnquiryType | `outputs('Get_response_details')?['body/r9c50673ec02847bbb4505805c460a917']` |
| Compose_ResolvedEnquiryType | `if(equals(outputs('Compose_EnquiryType'),'Other'), outputs('Compose_OtherEnquiryType'), outputs('Compose_EnquiryType'))` |

`Compose_ResolvedEnquiryType` is the canonical enquiry type used in all downstream actions. It substitutes the specific free-text type when the student chose "Other".

### Step 26: Switch â€” suggested owner
- On: `outputs('Compose_ResolvedEnquiryType')`
- Each case sets `suggested_owner` variable:

| Enquiry type | Suggested owner |
|-------------|----------------|
| Module enquiry | module support |
| Academic advisor | advisor admin |
| Assessment query | assessment admin |
| Extension | assessment admin |
| Mitigating circumstances | student support or formal process check |
| Attendance | attendance admin |
| Timetable | timetable admin |
| IT / systems access | department IT |
| Fees / finance | student finance liaison |
| (default) | general triage |

### Steps 27â€“29: Tag composes

| Action | Expression | Output example |
|--------|-----------|---------------|
| Compose_StageTag | If Undergraduate â†’ "UG", if Taught postgraduate â†’ "PGT", else "Unknown" | UG |
| Compose_YearTag | If resolved_year is set â†’ `[Year 2]`, else empty | [Year 2] |
| Compose_LookupTag | If lookup_matched â†’ "Matched", else "Unmatched" | Matched |

### Steps 30aâ€“30e: Display and reply composes (added 2026-04-23)

| Action | Expression | Purpose |
|--------|-----------|---------|
| Compose_StudentMessage | `outputs('Get_response_details')?['body/r7ab4bdb1e6974415bb9e604ade29bd13']` | Student's message text |
| Compose_DisplayNameForStaff | `if(or(empty(variables('student_name')),equals(variables('student_name'),'Not found')),if(empty(outputs('Compose_SelectedUsername')),outputs('Compose_SelectedStudentEmail'),outputs('Compose_SelectedUsername')),variables('student_name'))` | Best available name for display |
| Compose_GreetingName | `if(or(empty(variables('student_name')),equals(variables('student_name'),'Not found')),'student',first(split(variables('student_name'),' ')))` | First name or fallback "student" |
| Compose_ReplySubject | `concat('RE: ',outputs('Compose_ReferenceNumber'),' \| ',outputs('Compose_ResolvedEnquiryType'))` | Pre-filled reply subject |
| Compose_ReplyLink | `concat('mailto:',outputs('Compose_SelectedStudentEmail'),'?subject=',uriComponent(outputs('Compose_ReplySubject')),'&body=',uriComponent(concat('Dear ',outputs('Compose_GreetingName'),',',decodeUriComponent('%0D%0A%0D%0A'))))` | mailto: URI with To, Subject, greeting |

### Step 30: Compose_StaffEmailSubject

Expression:
```
concat('[Form submission] ',outputs('Compose_DisplayNameForStaff'),' | ',outputs('Compose_ResolvedEnquiryType'),' | Ref: ',outputs('Compose_ReferenceNumber'))
```
Example output:
```
[Form submission] Jane Smith | Extension | Ref: DEPT-2026-9
```

### Step 31: Send_staff_email
- Connector: Office 365 Outlook â€” Send an email (V2)
- **To:** david.chivers@durham.ac.uk (pilot; change to shared mailbox in Step 9)
- **Subject:** `outputs('Compose_StaffEmailSubject')`
- **Body (HTML):**
  1. **Action row** - blue bold `Reply to [name]` mailto link, plus `Open Email Drafter`
  2. **Reply to [name]** - opens Outlook with To/Subject/`Dear [display name],` and blank reply space pre-filled
  3. **Open Email Drafter** - opens the drafter from the first staff notification with `type`, `student`, and `ref` URL context, for example `/drafter/?type=Extension&student=Jane%20Smith&ref=DEPT-2026-9`
  4. **Student message** - student's actual message (field `r7ab4bdb1e6974415bb9e604ade29bd13`) in a simple message block that preserves line breaks and escapes accidental HTML
  5. **Lookup details** - one compact block with email, username, ID, programme, stage, year, advisor, Banner link, and Banner code

The subject already contains `[Form submission]`, student display name, enquiry type, and reference number, so the body intentionally avoids repeating that same summary line.

Important: `Open Email Drafter` belongs in the first staff notification email. It should not be inserted into the reply draft sent to the student.

### Attachment option

Microsoft Forms can support a file-upload question, but only when the form is restricted to people in the organisation or specific people in the organisation. For individual forms, uploaded files are stored in the form owner's OneDrive for Business; for group forms, uploaded files are stored in the Microsoft 365 group's SharePoint document library.

For this app, the upload question should be included now, but production storage should be group/shared:

- Form question: `Attach files or screenshots if relevant`
- Required: no
- Recommended limits: 10 files, 10 MB each, Image/PDF/Word only
- Staff email: include SharePoint/Forms file links, not email attachments
- Production owner model: move/create the form as a group form so uploads land in group SharePoint

Recommended SharePoint storage pattern:

- Use a dedicated document library or folder such as `Student Enquiry Evidence`.
- Store uploads under folders named by reference number, for example `DEPT-2026-12`.
- Add an `Uploaded files` line to the staff email linking to the file(s) or folder.
- Prefer time-based cleanup, for example delete files older than 180 days, rather than waiting until the storage is "too big".
- Cleanup can be done either with Microsoft 365 retention labels/policies or with a scheduled Power Automate cleanup flow.

### Production ownership and exit plan

The pilot builder should not remain the long-term owner or evidence-file custodian. The intended production pattern is:

1. Move or recreate the Microsoft Form as a group form under the department/shared Microsoft 365 group.
2. Store the lookup workbook in the same group's SharePoint.
3. Ensure file uploads land in group SharePoint, not personal OneDrive.
4. Repoint the Power Automate Excel and Forms connections to the group/shared resources.
5. Use a shared mailbox or department inbox for staff notifications.
6. Add the operational staff as form/flow/SharePoint owners.
7. Run an end-to-end test using the production owners/connections.
8. Remove the pilot builder from form ownership, flow ownership, SharePoint evidence storage, and mailbox access.

Important: do not remove the pilot builder before the production connections have been tested. A flow can appear transferred while still depending on an old owner's connection.

## Future option: AI draft replies

Power Automate can be extended to generate suggested replies using AI Builder prompts. This should be implemented as a staff-assist feature only: AI drafts the response, staff review/edit/send it.

Recommended future shape with the existing Email Drafter:

1. After the student lookup and `Compose_StudentMessage`, send a compact prompt to an AI Builder `Run a prompt` action.
2. Include enquiry type, message, display name, reference number, and any matched student context.
3. Store/pass the AI suggestion to the existing Email Drafter app.
4. Add an `Open in Email Drafter` link to the staff email.
5. Staff review/edit the AI draft in the drafter, then use the existing copy/paste workflow.
6. Keep the normal Outlook reply link for the actual response.
7. Do not auto-send AI-generated text to students.

See `templates/ai_draft_response_future.md` for prompt guardrails and setup requirements.

## Future option: connect staff email to Email Drafter

The existing Email Drafter already supports the important part of the workflow: staff choose a response and click `Copy`, and the app copies both HTML and plain text to the clipboard. Outlook can then preserve links and basic formatting when staff paste.

Recommended future improvement:

1. Keep the staff email simple.
2. Add an `Open Email Drafter` link next to `Reply to [student]` in the first form-submission notification email.
3. Pass enquiry type, student name, and reference number to the drafter via URL parameters.
4. Let the drafter pre-filter or pre-search the relevant template category.
5. Staff still choose, copy, paste, edit, and send manually.

See `templates/drafter_reply_workflow_future.md`.

## Future option: Power Apps staff ticketing screen

If the department later wants a fully integrated system, the next step is a Power App, not a more complicated email. The sensible path is:

1. Keep the current Microsoft Forms + Power Automate + Outlook flow stable first.
2. Add a SharePoint List or Dataverse table for one enquiry record per submission.
3. Let Power Automate create/update those records and store attachment links.
4. Build a Canvas Power App for staff to view, filter, assign, and update enquiries.
5. Keep the Email Drafter link available inside the staff screen.

Rough effort once version 1 is stable: 1-2 days for a light list/detail screen, 1-2 weeks for a useful MVP with status/owner/attachment links, or 3-6 weeks for a proper service-desk style build with audit, dashboards, permissions, and governance.

See `templates/power_app_future.md`.

### Step 32: Send_student_acknowledgement
- Connector: Office 365 Outlook â€” Send an email (V2)
- **To:** `outputs('Compose_SelectedStudentEmail')`
- **Subject:** `concat('Your enquiry has been received - ',outputs('Compose_ReferenceNumber'))`
- **Body:** Thank-you message with reference number and note to use urgent contact route if needed

### Step 33: Failure_notification (Scope)
- **Run after:** Send_staff_email â€” has failed / has timed out / is skipped
- Contains: **Send_failure_email** â€” Send an email (V2)
  - **To:** david.chivers@durham.ac.uk
  - **Subject:** `Flow failure - Student enquiry intake`
  - **Body:** Error message with Response ID, Reference number, and instruction to check run history

---

## Data Model

### Excel Lookup Table (StudentLookup)

| Column | Type | Description |
|--------|------|-------------|
| UniversityEmail | Text | Raw email (not used for lookup) |
| UniversityEmailNormalized | Text | **Lookup key** â€” lowercase, trimmed |
| UniversityUsername | Text | Username part |
| UniversityUsernameNormalized | Text | Lowercase username |
| StudentName | Text | Full name |
| StudentID | Text | University ID number |
| Programme | Text | Programme title |
| StageOfStudy | Text | "Undergraduate" or "Taught postgraduate" |
| YearOfStudy | Text | "Year 1", "Year 2", etc. |
| AcademicAdvisor | Text | Advisor's full name |
| BannerLink | Text | Full URL to student's Banner record |
| BannerCode | Text | Banner code/identifier |
| RecordStatus | Text | "Active" or other |
| LastVerifiedDate | Text | Date record was last checked |

### Microsoft Form

- **Name:** Department student enquiry form
- **Access:** Organisation members only (Durham Microsoft 365)
- **Identity recording:** Enabled (respondent must sign in)
- **Questions:**
  1. Enquiry type (choice: Academic advisor, Assessment query, Attendance, Extension, Fees / finance, IT / systems access, Mitigating circumstances, Module enquiry, Timetable, Other)
  2. Other enquiry type (text, only shown if "Other" selected)
  3. Message (long text, shown to all)
- **Branching:** "Other" â†’ shows question 2; all other choices â†’ skip to Message

---

## Connection References

| Reference key | Connector | Connection name |
|--------------|-----------|----------------|
| shared_microsoftforms | Microsoft Forms | shared-microsoftform-d15f6d5d-... |
| shared_excelonlinebusiness | Excel Online Business | e0c6c9cfd26f4b74aa51a54ee241f837 |
| shared_office365 | Office 365 Outlook | 81846ff066864126b7bf9cd7824eac19 |

---

## How to Test

### Prerequisites
- Flow is turned **On** (check the toggle in Power Automate)
- You have access to the form URL (ask hfnt93@durham.ac.uk for the link)
- The StudentLookup table has at least 2 test rows (one matching your Durham email, one not)

### Test 1 â€” Matched student (happy path)

1. Open the form as a Durham University user whose email IS in the StudentLookup table
2. Select any enquiry type (e.g. "Module enquiry")
3. Type a test message
4. Submit
5. Wait ~30â€“60 seconds for the flow to run
6. **Check david.chivers@durham.ac.uk inbox** for a staff notification email:
   - Subject should start with `[Enquiry][Module enquiry][UG]` (or appropriate tags)
   - Body should contain the student's lookup data
   - Reference number should be in format `DEPT-2026-NNNNNN`
7. **Check the student's inbox** for an acknowledgement email with the same reference number
8. In Power Automate, open **My flows â†’ Student enquiry intake - v1 â†’ Run history**
   - Click the most recent run
   - Verify all actions show green (Succeeded)
   - Click **Get_response_details** to see the actual form response body â€” this will show the Message field ID

### Test 2 â€” Unmatched student

1. Submit the form from an email that is NOT in the StudentLookup table
2. Check the staff email: lookup status should say "Not matched", student details should say "Not found"
3. Check the student's inbox: acknowledgement should still arrive

### Test 3 â€” "Other" enquiry type

1. Submit the form selecting "Other" as the enquiry type
2. Fill in the "Other enquiry type" free-text box
3. Verify the staff email subject and body use the free-text value, NOT "Other"

### Discovering the Message field ID

After the first successful test run:
1. Go to Power Automate â†’ My flows â†’ Student enquiry intake - v1 â†’ Run history
2. Click the test run â†’ click **Get_response_details** action â†’ expand **OUTPUTS**
3. The `body` object will show all question responses keyed by `r` + UUID
4. The UUID you don't recognise (not `f6fd996f...` or `9c50673e...`) is the Message field
5. Note the full field ID (e.g. `r3a7f1c2...`)
6. Update the staff email body to add a dedicated message line using that field ID

---

## Reference Numbers

Reference numbers are generated as: `DEPT-{year}-{padded response ID}`

Example: `DEPT-2026-000042`

- Year: current UTC year
- Response ID: the Forms response sequence number, left-padded to 6 digits with zeros
- These are stable and can be used to cross-reference run history

---

## Known Limitations (v1)

| Issue | Status | Fix in |
|-------|--------|--------|
| Message field shown as raw JSON, not clean text | **Fixed 2026-04-23** â€” field ID `r7ab4bdb1e6974415bb9e604ade29bd13` confirmed; dedicated Compose_StudentMessage action added | Done |
| Staff email goes to pilot inbox, not shared mailbox | By design for pilot | Step 9 |
| No duplicate detection | Not in scope for v1 | Future |
| No SLA tracking | Not in scope for v1 | Future |
| Excel lookup is read-only (manual updates) | By design | Future |

---

## Technical Notes (for Codex / developers)

### How the flow was built

The flow was built by direct API injection (PATCH to Power Platform API) rather than through the Power Automate canvas, due to UI limitations with adding email connection references.

**API endpoint:**
```
PATCH https://default7250d88b4b684529be44d59a2d8a6f.94.environment.api.powerplatform.com/powerautomate/flows/eda14061-b269-4106-97d0-7ff0b6ea6ed7?api-version=1
```

**Body format:** `{ "properties": { "definition": { ... }, "connectionReferences": { ... } } }`

**Auth:** Bearer token captured from the app's own XHR calls via a `setRequestHeader` interceptor.

**PATCH body source:** The checkFlowWarnings POST body (same format the app uses for save), with email actions added and connection references updated.

**Key requirement:** All `OpenApiConnection` host objects must include `connectionReferenceName` matching their `connectionName` when `shared_office365` is in `connectionReferences`. The server strips this field after accepting the PATCH (normalisation), so it won't appear in GET responses.

### Form field IDs

Microsoft Forms stores question responses keyed by `r` + 32-char hex UUID:

| Field | Question text | ID |
|-------|-------------|-----|
| Enquiry type | "Enquiry type" | `rf6fd996f97c24dec8d088691b367882e` |
| Other enquiry type | "Other enquiry type" | `r9c50673ec02847bbb4505805c460a917` |
| Message | "Message" | `r7ab4bdb1e6974415bb9e604ade29bd13` |
| Responder | (metadata) | `body/responder` |
| Submit date | (metadata) | `body/submitDate` |

### Variable flow

```
Forms trigger
  â†’ Get response details
  â†’ Normalise email/username (Compose Ã—4)
  â†’ Generate reference number (Compose Ã—2)
  â†’ Init all variables (Ã—11)
  â†’ Lookup student (Excel Get a row)
    â†’ On match: set variables from row
    â†’ On miss: set "Not found" defaults
  â†’ Compose enquiry type resolution (Ã—3)
  â†’ Switch: set suggested_owner
  â†’ Compose tags (stage, year, lookup)
  â†’ Compose staff email subject
  â†’ Send staff email
  â†’ Send student acknowledgement
  [On failure] â†’ Send failure alert
```

