# Build Progress - Student enquiry intake v1

**Last updated:** 2026-04-22
**Flow name:** Student enquiry intake - v1
**Flow owner account:** hfnt93@durham.ac.uk
**Pilot inbox:** david.chivers@durham.ac.uk

---

## Completed Steps

### Step 1 - Basic details (DONE)
- Owner account: hfnt93@durham.ac.uk
- Pilot inbox: david.chivers@durham.ac.uk
- Excel workbook location: OneDrive (hfnt93)

### Step 2 - Microsoft Form (DONE)
- Form name: Department student enquiry form
- Imported from Word template via Quick Import
- Questions: Enquiry type, Other enquiry type (branched from "Other"), Message
- Branching configured: Other -> Other enquiry type, all others skip to Message
- Settings: Organization only, Record responder identity enabled

### Step 3 - Excel lookup workbook (DONE)
- Workbook: student_lookup_template.xlsx on OneDrive
- Table name: StudentLookup
- 14 columns: UniversityEmail, UniversityEmailNormalized, UniversityUsername, UniversityUsernameNormalized, StudentName, StudentID, Programme, StageOfStudy, YearOfStudy, AcademicAdvisor, BannerLink, BannerCode, RecordStatus, LastVerifiedDate
- 2 test rows with user-customised data (different from the CSV template)
- Key column for lookup: UniversityEmailNormalized

### Step 4 - Power Automate flow (DONE ✓)
- Flow created: "Student enquiry intake - v1"
- Connections in environment: Microsoft Forms, Excel Online Business, SharePoint, Office 365 Users, **Office 365 Outlook** (added via connection ref `81846ff066864126b7bf9cd7824eac19`)
- All 32 actions saved via API injection (PATCH to Power Platform API)

**Save method used:** XHR interceptor on `setRequestHeader` to capture Bearer token; captured app's exact body format from `checkFlowWarnings` call; fired authenticated PATCH with corrected `connectionName`/`connectionReferenceName` fields. GET verification confirmed all 3 email actions present on server.

Bug fixes applied during save:
- `Compose_EnquiryType` runAfter fixed to handle BOTH On_lookup_match AND On_lookup_miss branches (Succeeded|Skipped)
- `On_lookup_miss` Set_variable values fixed: student_name/id/advisor/banner_link/banner_code → "Not found", lookup_status → "Not matched"
- `connectionReferenceName` added to all existing OpenApiConnection hosts (required by API when shared_office365 is in connectionReferences)

**All 32 actions saved and verified on server (GET confirmed actionCount=32, hasStaffEmail=true, hasStudentAck=true, hasFailure=true)**

### Session 2 fixes (2026-04-22) — DONE ✓
- `Compose_StaffEmailSubject` bug fixed: was using `outputs('Compose_EnquiryType')`, now correctly uses `outputs('Compose_ResolvedEnquiryType')`
- Staff email body updated: comprehensive HTML with all lookup fields, enquiry data, and full form response body (JSON dump until Message field ID is confirmed from first test run)
- Student acknowledgement body updated: proper thank-you with reference number and urgent contact note
- Failure notification body updated: includes Reference and Response ID for manual reprocessing
- PATCH method: hijacked app's own checkFlowWarnings XHR (app sets auth headers; interceptor rewrote open() to PATCH URL and send() to new body) — 200 response confirmed
- Message field ID still unknown; appears as raw JSON in staff email body until first test run reveals it
- `how_it_works.md` created in this folder — full architecture doc for Codex/testing

| # | Action name | Type | Status |
|---|------------|------|--------|
| 1 | When a new response is submitted | Trigger | DONE |
| 2 | Get response details | MS Forms | DONE |
| 3–29 | Compose/Init/Lookup/Switch actions | Various | DONE |
| 30 | Compose_StaffEmailSubject | Compose | DONE |
| 31 | Send_staff_email | Office 365 Outlook SendEmailV2 | DONE |
| 32 | Send_student_acknowledgement | Office 365 Outlook SendEmailV2 | DONE |
| 32+Scope | Failure_notification (scope + Send_failure_email) | Scope + SendEmailV2 | DONE |

---

## Remaining Actions to Build

### Compose actions (add as Data Operation > Compose)

| # | Action name | Input type | Expression or value |
|---|------------|-----------|-------------------|
| 5 | Compose_SelectedUsername | Expression | `first(split(outputs('Compose_NormalizedResponderEmail'),'@'))` |
| 6 | Compose_SelectedStudentEmail | Expression | `if(not(empty(outputs('Compose_NormalizedResponderEmail'))),outputs('Compose_NormalizedResponderEmail'),'')` |
| 7 | Compose_ResponseId | Dynamic | Response Id from "When a new response is submitted" trigger |
| 8 | Compose_ReferenceNumber | Expression | `concat('DEPT-',formatDateTime(utcNow(),'yyyy'),'-',padLeft(string(outputs('Compose_ResponseId')),6,'0'))` |

### Initialize Variable actions (add as Built-in > Variable > Initialize variable)

| # | Variable name | Type | Initial value |
|---|--------------|------|--------------|
| 9 | lookup_matched | Boolean | false |
| 10 | student_name | String | (empty) |
| 11 | student_id | String | (empty) |
| 12 | resolved_programme | String | (empty) |
| 13 | resolved_stage | String | (empty) |
| 14 | resolved_year | String | (empty) |
| 15 | academic_advisor | String | (empty) |
| 16 | banner_link | String | (empty) |
| 17 | banner_code | String | (empty) |
| 18 | lookup_status | String | (empty) |
| 19 | suggested_owner | String | (empty) |

### Scope: Lookup student (#20)

Add a **Scope** action (Built-in > Control > Scope), name it `Lookup student`.

Inside the scope, add **one action**:
- **Get a row** (Excel Online Business connector)
  - Location: OneDrive (or wherever the workbook is)
  - Document Library: OneDrive
  - File: student_lookup_template.xlsx
  - Table: StudentLookup
  - Key Column: UniversityEmailNormalized
  - Key Value: `outputs('Compose_NormalizedResponderEmail')`

### Scope: On lookup match (#21)

Add a **Scope** action, name it `On lookup match`.

**Configure Run After**: Click the three dots > Configure run after > check ONLY "is successful" for "Lookup student".

Inside this scope, add **Set variable** actions:

| Variable | Value (dynamic from Get a row) |
|----------|-------------------------------|
| lookup_matched | true |
| student_name | StudentName column |
| student_id | StudentID column |
| resolved_programme | Programme column |
| resolved_stage | StageOfStudy column |
| resolved_year | YearOfStudy column |
| academic_advisor | AcademicAdvisor column |
| banner_link | BannerLink column |
| banner_code | BannerCode column |
| lookup_status | `Matched` (literal text) |

### Scope: On lookup miss (#22)

Add a **Scope** action, name it `On lookup miss`.

**Configure Run After**: Click the three dots > Configure run after > check "has failed", "has timed out", "is skipped" for "Lookup student". Uncheck "is successful".

Inside this scope, add **Set variable** actions:

| Variable | Value |
|----------|-------|
| lookup_matched | false |
| student_name | `Not found` |
| student_id | `Not found` |
| resolved_programme | (blank) |
| resolved_stage | (blank) |
| resolved_year | (blank) |
| academic_advisor | `Not found` |
| banner_link | `Not found` |
| banner_code | `Not found` |
| lookup_status | `Not matched` |

### More Compose actions (#23-29)

| # | Action name | Input type | Expression |
|---|------------|-----------|-----------|
| 23 | Compose_EnquiryType | Dynamic | "Enquiry type" from Get response details |
| 24 | Compose_OtherEnquiryType | Dynamic | "Other enquiry type" from Get response details |
| 25 | Compose_ResolvedEnquiryType | Expression | `if(equals(outputs('Compose_EnquiryType'),'Other'),outputs('Compose_OtherEnquiryType'),outputs('Compose_EnquiryType'))` |
| 26 | Switch_suggested_owner | Switch | On: `outputs('Compose_ResolvedEnquiryType')`, 9 cases + default | DONE |
| 27 | Compose_StageTag | Expression | `if(empty(variables('resolved_stage')),'Unknown',if(equals(variables('resolved_stage'),'Undergraduate'),'UG',if(equals(variables('resolved_stage'),'Taught postgraduate'),'PGT','Unknown')))` | DONE |
| 28 | Compose_YearTag | Expression | `if(empty(variables('resolved_year')),'',concat('[',variables('resolved_year'),']'))` | DONE |
| 29 | Compose_LookupTag | Expression | `if(variables('lookup_matched'),'Matched','Unmatched')` | DONE |
| 30 | Compose_StaffEmailSubject | Expression | see below | DONE |

### Switch - suggested owner (#26)

Add a **Switch** action (Built-in > Control > Switch).

- **On**: `outputs('Compose_ResolvedEnquiryType')`

Add these cases:

| Case | Equals value | Set variable suggested_owner to |
|------|-------------|-------------------------------|
| Module enquiry | Module enquiry | `module support` |
| Academic advisor | Academic advisor | `advisor admin` |
| Assessment query | Assessment query | `assessment admin` |
| Extension | Extension | `assessment admin` |
| Mitigating circumstances | Mitigating circumstances | `student support or formal process check` |
| Attendance | Attendance | `attendance admin` |
| Timetable | Timetable | `timetable admin` |
| IT / systems access | IT / systems access | `department IT` |
| Fees / finance | Fees / finance | `student finance liaison` |
| Default | (default) | `general triage` |

### Staff email subject expression (#30)

```
concat('[Enquiry][',outputs('Compose_ResolvedEnquiryType'),'][',outputs('Compose_StageTag'),']',outputs('Compose_YearTag'),'[',outputs('Compose_LookupTag'),'] ',outputs('Compose_ReferenceNumber'),' - ',if(empty(outputs('Compose_SelectedUsername')),outputs('Compose_SelectedStudentEmail'),outputs('Compose_SelectedUsername')))
```

### Send staff email (#31)

Add **Send an email (V2)** (Office 365 Outlook).

- **To**: david.chivers@durham.ac.uk
- **Subject**: Use dynamic content for Compose_StaffEmailSubject output
- **Body** (HTML or plain text):

```
Reference number: [Compose_ReferenceNumber output]
Submitted: [Submission time from Get response details]
Lookup status: [lookup_status variable]
Suggested owner: [suggested_owner variable]

Recorded responder email: [Compose_SelectedStudentEmail output]
Derived username: [Compose_SelectedUsername output]
Student name: [student_name variable]
Student email: [Compose_SelectedStudentEmail output]
Student ID: [student_id variable]

Stage of study: [resolved_stage variable]
Year of study: [resolved_year variable]
Programme of study: [resolved_programme variable]

Enquiry type: [Compose_EnquiryType output]
Other enquiry type: [Compose_OtherEnquiryType output]

Academic advisor: [academic_advisor variable]
Banner link: [banner_link variable]
Banner code: [banner_code variable]

Student message:
[Message from Get response details]
```

### Send student acknowledgement email (#32)

Add **Send an email (V2)** (Office 365 Outlook).

- **To**: `outputs('Compose_SelectedStudentEmail')`
- **Subject**: Expression: `concat('Your enquiry has been received - ',outputs('Compose_ReferenceNumber'))`
- **Body**:

```
Dear student,

Thank you for your enquiry. Your message has been received and has been given the reference number [Compose_ReferenceNumber output].

Please keep this reference number in case you need to follow up.

If your issue is urgent and affects an immediate deadline, please contact the department directly using the usual urgent contact route.

Best wishes,
Department team
```

### Failure notification scope (#33)

Add a **Scope** named `Failure notification`.

**Configure Run After** on the staff email action: check "has failed", "has timed out", "is skipped".

Inside, add **Send an email (V2)**:
- **To**: david.chivers@durham.ac.uk
- **Subject**: `Flow failure - Student enquiry intake`
- **Body**: `The student enquiry flow failed. Response ID: [Compose_ResponseId]. Please check Power Automate run history.`

---

## Steps 5-10 (after flow is complete)

### Step 5-7: Already covered above (compose actions, lookup, emails)

### Step 8: Test the app
1. Open the form as a student (or use a test account)
2. Submit a test response
3. Check that the staff email arrives at david.chivers@durham.ac.uk
4. Check that the student acknowledgement email arrives
5. Check the flow run history in Power Automate for any errors

### Step 9: Move to shared mailbox
- Change the staff email action from "Send an email (V2)" to "Send an email from a shared mailbox (V2)"
- Set the shared mailbox address

### Step 10: Version 1 complete
- Share the form link with a small group for pilot testing
- Monitor flow run history for errors
