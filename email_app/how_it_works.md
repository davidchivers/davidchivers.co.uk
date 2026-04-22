# Student Enquiry Intake v1 — How It Works

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

## Flow Actions — Full Sequence

### Step 1: Trigger — When a new response is submitted
- Connector: Microsoft Forms
- Fires when a student submits the form
- Provides: `resourceData/responseId`

### Step 2: Get response details
- Connector: Microsoft Forms — GetFormResponseById
- Form ID: `i9hQcmhLKUW-RNWaLYpvlHSQXty3KytLj5av1xnWvfJUQUdKMFQyTFVWSlk1RTBBMjA5RDNBUEdXRC4u`
- Uses: `responseId` from trigger
- Returns: all form field values plus metadata (submit date, responder email)
- Key fields in output body:
  - `body/responder` — respondent email (from Microsoft 365 identity)
  - `body/submitDate` — submission timestamp
  - `body/rf6fd996f97c24dec8d088691b367882e` — "Enquiry type" question response
  - `body/r9c50673ec02847bbb4505805c460a917` — "Other enquiry type" question response
  - `body/r[MESSAGE_FIELD_ID]` — "Message" question response (**TODO: discover field ID from first test run — see testing section**)

### Steps 3–8: Email normalisation

| Action | Expression | Purpose |
|--------|-----------|---------|
| Compose_RecordedResponderEmail | `outputs('Get_response_details')?['body/responder']` | Raw email from Forms |
| Compose_NormalizedResponderEmail | `toLower(trim(outputs('Compose_RecordedResponderEmail')))` | Lowercase + trimmed for lookup |
| Compose_SelectedUsername | `first(split(outputs('Compose_NormalizedResponderEmail'),'@'))` | Username part (before @) |
| Compose_SelectedStudentEmail | `if(not(empty(...)),outputs('Compose_NormalizedResponderEmail'),'')` | Clean email or empty |
| Compose_ResponseId | `triggerOutputs()?['body/resourceData/responseId']` | Raw response ID |
| Compose_ReferenceNumber | `concat('DEPT-',formatDateTime(utcNow(),'yyyy'),'-',padLeft(string(outputs('Compose_ResponseId')),6,'0'))` | e.g. DEPT-2026-000042 |

### Steps 9–19: Initialise variables

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

### Step 20: Scope — Lookup student
- Contains one action: **Get a row** (Excel Online Business)
- Workbook: `student_lookup_template.xlsx` on OneDrive (hfnt93)
- Table: `StudentLookup`
- Key column: `UniversityEmailNormalized`
- Key value: `outputs('Compose_NormalizedResponderEmail')`
- Succeeds if the email is found in the table; fails/times-out if not found

### Step 21: Scope — On lookup match
- **Run after:** Lookup student — is successful
- Sets all student variables from the Excel row:
  - `lookup_matched` → true
  - `student_name`, `student_id`, `resolved_programme`, `resolved_stage`, `resolved_year`
  - `academic_advisor`, `banner_link`, `banner_code`
  - `lookup_status` → "Matched"

### Step 22: Scope — On lookup miss
- **Run after:** Lookup student — has failed / has timed out / is skipped
- Sets fallback values:
  - `lookup_matched` → false
  - `student_name`, `student_id`, `academic_advisor`, `banner_link`, `banner_code` → "Not found"
  - `resolved_programme`, `resolved_stage`, `resolved_year` → (empty)
  - `lookup_status` → "Not matched"

### Steps 23–25: Enquiry type composes

| Action | Expression |
|--------|-----------|
| Compose_EnquiryType | `outputs('Get_response_details')?['body/rf6fd996f97c24dec8d088691b367882e']` |
| Compose_OtherEnquiryType | `outputs('Get_response_details')?['body/r9c50673ec02847bbb4505805c460a917']` |
| Compose_ResolvedEnquiryType | `if(equals(outputs('Compose_EnquiryType'),'Other'), outputs('Compose_OtherEnquiryType'), outputs('Compose_EnquiryType'))` |

`Compose_ResolvedEnquiryType` is the canonical enquiry type used in all downstream actions. It substitutes the specific free-text type when the student chose "Other".

### Step 26: Switch — suggested owner
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

### Steps 27–29: Tag composes

| Action | Expression | Output example |
|--------|-----------|---------------|
| Compose_StageTag | If Undergraduate → "UG", if Taught postgraduate → "PGT", else "Unknown" | UG |
| Compose_YearTag | If resolved_year is set → `[Year 2]`, else empty | [Year 2] |
| Compose_LookupTag | If lookup_matched → "Matched", else "Unmatched" | Matched |

### Step 30: Compose_StaffEmailSubject
Expression:
```
concat('[Enquiry][',outputs('Compose_ResolvedEnquiryType'),'][',outputs('Compose_StageTag'),']',outputs('Compose_YearTag'),'[',outputs('Compose_LookupTag'),'] ',outputs('Compose_ReferenceNumber'),' - ',if(empty(outputs('Compose_SelectedUsername')),outputs('Compose_SelectedStudentEmail'),outputs('Compose_SelectedUsername')))
```
Example output:
```
[Enquiry][Module enquiry][UG][Year 2][Matched] DEPT-2026-000042 - jsmith
```

### Step 31: Send_staff_email
- Connector: Office 365 Outlook — Send an email (V2)
- **To:** david.chivers@durham.ac.uk (pilot; change to shared mailbox in Step 9)
- **Subject:** `outputs('Compose_StaffEmailSubject')`
- **Body (HTML):** Full structured summary including:
  - Reference number, submission date, lookup status, suggested owner
  - Student email, username, name, ID
  - Stage, year, programme
  - Enquiry type, other enquiry type
  - Academic advisor, Banner link, Banner code
  - Full form response body (includes all fields: message + any others)
  
  > **Note:** The student's message appears as part of `string(outputs('Get_response_details')?['body'])` — a JSON dump of all form response fields. After the first test run, extract the Message field ID from the run history and add a dedicated `<p>` for it. See Testing section below.

### Step 32: Send_student_acknowledgement
- Connector: Office 365 Outlook — Send an email (V2)
- **To:** `outputs('Compose_SelectedStudentEmail')`
- **Subject:** `concat('Your enquiry has been received - ',outputs('Compose_ReferenceNumber'))`
- **Body:** Thank-you message with reference number and note to use urgent contact route if needed

### Step 33: Failure_notification (Scope)
- **Run after:** Send_staff_email — has failed / has timed out / is skipped
- Contains: **Send_failure_email** — Send an email (V2)
  - **To:** david.chivers@durham.ac.uk
  - **Subject:** `Flow failure - Student enquiry intake`
  - **Body:** Error message with Response ID, Reference number, and instruction to check run history

---

## Data Model

### Excel Lookup Table (StudentLookup)

| Column | Type | Description |
|--------|------|-------------|
| UniversityEmail | Text | Raw email (not used for lookup) |
| UniversityEmailNormalized | Text | **Lookup key** — lowercase, trimmed |
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
  1. Enquiry type (choice: Module enquiry, Academic advisor, Assessment query, Extension, Mitigating circumstances, Attendance, Timetable, IT / systems access, Fees / finance, Other)
  2. Other enquiry type (text, only shown if "Other" selected)
  3. Message (long text, shown to all)
- **Branching:** "Other" → shows question 2; all other choices → skip to Message

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

### Test 1 — Matched student (happy path)

1. Open the form as a Durham University user whose email IS in the StudentLookup table
2. Select any enquiry type (e.g. "Module enquiry")
3. Type a test message
4. Submit
5. Wait ~30–60 seconds for the flow to run
6. **Check david.chivers@durham.ac.uk inbox** for a staff notification email:
   - Subject should start with `[Enquiry][Module enquiry][UG]` (or appropriate tags)
   - Body should contain the student's lookup data
   - Reference number should be in format `DEPT-2026-NNNNNN`
7. **Check the student's inbox** for an acknowledgement email with the same reference number
8. In Power Automate, open **My flows → Student enquiry intake - v1 → Run history**
   - Click the most recent run
   - Verify all actions show green (Succeeded)
   - Click **Get_response_details** to see the actual form response body — this will show the Message field ID

### Test 2 — Unmatched student

1. Submit the form from an email that is NOT in the StudentLookup table
2. Check the staff email: lookup status should say "Not matched", student details should say "Not found"
3. Check the student's inbox: acknowledgement should still arrive

### Test 3 — "Other" enquiry type

1. Submit the form selecting "Other" as the enquiry type
2. Fill in the "Other enquiry type" free-text box
3. Verify the staff email subject and body use the free-text value, NOT "Other"

### Discovering the Message field ID

After the first successful test run:
1. Go to Power Automate → My flows → Student enquiry intake - v1 → Run history
2. Click the test run → click **Get_response_details** action → expand **OUTPUTS**
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
| Message field shown as raw JSON, not clean text | Pending first test run to get field ID | v1.1 |
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
| Message | "Message" | **Unknown — discover from first run** |
| Responder | (metadata) | `body/responder` |
| Submit date | (metadata) | `body/submitDate` |

### Variable flow

```
Forms trigger
  → Get response details
  → Normalise email/username (Compose ×4)
  → Generate reference number (Compose ×2)
  → Init all variables (×11)
  → Lookup student (Excel Get a row)
    → On match: set variables from row
    → On miss: set "Not found" defaults
  → Compose enquiry type resolution (×3)
  → Switch: set suggested_owner
  → Compose tags (stage, year, lookup)
  → Compose staff email subject
  → Send staff email
  → Send student acknowledgement
  [On failure] → Send failure alert
```
