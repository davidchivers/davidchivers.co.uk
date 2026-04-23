# Student enquiry workflow specification

## 1. objective

Create a safe first prototype for departmental student enquiries using Microsoft Forms, Power Automate, Excel lookup data, and email.

The workflow should:

- accept enquiries from students through a Microsoft Form
- generate a clear reference number
- attempt to enrich the submission using the recorded responder identity from Forms
- send a structured staff email for handling
- send a simple acknowledgement email to the student

The workflow should not:

- become a full case-management platform
- depend on SharePoint lists as the main operating tool
- rely on hard automatic routing to named individuals
- build deep live Banner integration in version 1

## 2. version 1 design principles

- Keep the intake form short and professional.
- Do not ask students to re-enter stable record facts that the department can pull from Banner export or another lookup source.
- Keep extra checkpoint fields optional and add them only if testing shows the lookup is not reliable enough.
- Continue the process even if lookup fails.
- Keep staff work centered on a normal inbox first and a shared mailbox later.
- Make the design replaceable: Excel lookup now, stronger institutional source later.
- Prefer readable email outputs over complex workflow state tracking.

## 3. recommended architecture

1. A student submits a Microsoft Form.
2. Power Automate reads the response.
3. The flow generates a reference number.
4. The flow reads the recorded responder identity and derives the lookup values it needs.
5. The flow attempts a lookup in an Excel Online table.
6. The flow sends a structured staff email to a pilot inbox or shared mailbox.
7. The flow sends an acknowledgement email to the student.

## 4. recommended Microsoft Form design

### Form settings

- Form title: `Department student enquiry form`
- Audience setting for preferred mode: `Only people in my organization can respond`
- Turn on `Record name`.
- Do not use `One response per person`, because students may need to submit more than one enquiry over time.
- Add a short form introduction explaining what the form is for and when students should use another urgent or formal route.

### Identity handling

Use one of these two patterns:

- Preferred pattern: restrict the form to university sign-in, record responder identity, and do not ask the student to type username or email at all.
- Fallback pattern: if testing shows the flow cannot access recorded responder email, add a required `University email address` field.

For a cautious pilot, use the recorded responder email as the acknowledgement address and as the primary lookup key. Derive the CIS username from the email prefix if needed.

### Questions

| # | Question | Type | Required | Branching / notes |
|---|---|---|---|---|
| 1 | Enquiry type | Choice | Yes | Controlled list for classification |
| 2 | Other enquiry type | Text | Yes when needed | Show only if enquiry type = Other |
| 3 | Message | Long text | Yes | Student describes the issue |

### Enquiry type values

- Academic advisor
- Assessment query
- Attendance
- Extension
- Fees / finance
- IT / systems access
- Mitigating circumstances
- Module enquiry
- Timetable
- Other

### Identity note

Recommended behavior:

- Do not ask for username or email on the form in the preferred build
- Restrict the form to signed-in users and turn on recorded responder identity
- Use the recorded responder email as the acknowledgement address
- Derive the CIS username from the recorded email prefix if needed for lookup, tags, or staff handling
- Only add a separate `University email address` field if testing shows the flow cannot access the responder email

### Stable student facts note

Preferred version 1 rule:

- Ask students only for the enquiry itself.
- Pull stable student facts such as stage, year, programme, student ID, and advisor from Banner export or the lookup workbook.
- Only add one checkpoint field later, such as `Programme of study`, if testing shows matching is unreliable.

### Submission behavior

- After submission, the student sees a short thank-you message on screen.
- The flow sends a separate acknowledgement email that includes the reference number.
- The form should not promise a response time until the department has measured real handling capacity.

### Recommended form wording note

If the university has a separate formal process for extensions or mitigating circumstances, say so in the form introduction and acknowledgement email. The form can still collect these enquiries, but version 1 should not imply that the form itself replaces a formal university process.

## 5. recommended Power Automate flow design

### Trigger and read response

1. Trigger: `When a new response is submitted`
2. Action: `Get response details`

Microsoft's Forms connector currently provides one trigger and one main read action, which is sufficient for this prototype flow.

### Reference number design

Recommended version 1 format:

`DEPT-2026-000123`

Recommended logic:

- Take the Forms `Response Id`
- Pad it to six digits
- Prefix with `DEPT-` and the current year

Example result:

`DEPT-2026-000123`

Why this is the safest version 1 choice:

- no extra counter store is needed
- reference numbers remain readable
- the sequence is increasing within the form
- it avoids Excel write-back or locking risks just to maintain a counter

Important limitation:

- this is a form-scoped sequence, not a department-wide enterprise ticket number
- if the live form is replaced or copied later, the sequence may restart and should be treated as a new series

If a stricter cross-form sequence is required later, add a small dedicated counter source such as Dataverse or a utility SharePoint list, while still keeping email as the main workflow channel.

### Lookup logic

Recommended version 1 lookup source:

- Excel Online workbook in OneDrive or SharePoint
- One table only
- Unique key column: `UniversityEmailNormalized`
- Prefer to populate the workbook from Banner export or another trusted student-record extract

Recommended table shape for this department:

- keep one active-student table for the whole department
- include undergraduate and taught postgraduate students in the same table
- do not split the lookup by year, stage, or programme in version 1
- a department-sized lookup of roughly 1,100 students is still reasonable for this exact-match prototype

Recommended lookup steps:

1. Select the recorded responder email from Forms.
2. Normalize the responder email to lowercase and trim spaces.
3. Derive the CIS username from the email prefix if needed.
4. Attempt `Get a row` from the Excel table using `UniversityEmailNormalized`.
5. If the row is found, enrich the output with student details.
6. If the row is not found, continue anyway and mark lookup as `Not matched`.

Preferred resolved fields from lookup:

- StudentName
- StudentID
- Programme
- StageOfStudy
- YearOfStudy
- AcademicAdvisor
- BannerLink
- BannerCode

Recommended resolved-value rule:

- If lookup succeeds, use Excel values as the main staff-facing values.
- If lookup fails, fall back to the recorded responder email and let staff check Banner or the student record manually.
- If lookup fails in the preferred short-form build, do not populate programme, stage, or year from unrelated form answers such as enquiry type. Leave them blank or mark them as `Not matched`.
- Do not rely on the spreadsheet as the normal staff working interface; use it as backend lookup data.

### Soft routing and tagging

Do not hard-route to named individuals in version 1.

Instead:

- add subject-line tags such as `[Module enquiry]`, `[UG]`, `[Year 2]`, `[Matched]`
- include `Suggested owner` in the email body
- optionally map enquiry types to role labels such as `assessment admin` or `department IT`

This keeps staff control in the mailbox while still making triage faster.

### Staff email output

Send one staff email for every submission.

Version 1 recipient:

- a normal monitored inbox

Version 1.1 recipient:

- a shared mailbox using Power Automate's shared mailbox email action

The staff email should include:

- reference number
- lookup status
- suggested owner
- resolved enquiry type in the subject tags when `Other` was selected
- student identity fields
- study context fields
- Banner identifiers or link
- original student message

If stage, year, or programme are unavailable because lookup fails, leave those fields blank or mark them as `Not matched` rather than asking the student to re-enter them in version 1.

### Student acknowledgement email

Send a simple acknowledgement to the student after the staff email step.

The email should:

- confirm receipt
- include the reference number
- avoid promising unrealistic turnaround times
- tell the student to keep the reference number for follow-up

### Failure handling

Recommended minimum failure handling:

- if the Excel lookup fails, continue and send the emails
- if the main flow fails before emails are sent, notify the admin owner mailbox

This keeps version 1 robust without adding a case database.

## 6. suggested Excel lookup schema

### Core columns

| Column | Purpose | Notes |
|---|---|---|
| UniversityEmail | Student university email as provided by source data | Prefer the official institutional address |
| UniversityEmailNormalized | Main lookup key used by flow | Lowercase trimmed value; should be unique |
| UniversityUsername | Student username | Useful for derived tags, staff search, and cross-checking |
| UniversityUsernameNormalized | Secondary helper field | Lowercase trimmed value |
| StudentName | Display name for staff email | Prefer official student record value |
| StudentID | Student identifier | Useful for Banner lookup and staff handling |
| Programme | Programme title | Used to enrich or cross-check form answer |
| StageOfStudy | Undergraduate or Taught postgraduate | Used for context |
| YearOfStudy | Year 1 to Year 4, or blank for PGT where appropriate | Used for context |
| AcademicAdvisor | Advisor or tutor name | Advisory context for staff |
| BannerLink | Direct link to student record if available | Keep as a view link only |
| BannerCode | Banner identifier or code | Alternative when direct links are awkward |

### Recommended optional admin columns

- RecordStatus
- LastVerifiedDate

These are helpful but not required for the prototype.

### Design note

Excel is only the first lookup layer. The flow should be built so that the lookup block can later be replaced by:

- Dataverse
- SQL
- institutional API
- another student-record source

The rest of the flow should stay unchanged if the same output fields are preserved.

Operational note:

- For this first department build, one active student table is simpler and safer than separate year-based tables.
- Splitting the table by year or stage makes maintenance harder and adds avoidable lookup logic.
- If the lookup later grows beyond a simple department roster or needs frequent automated refresh, replace the lookup block rather than adding multiple Excel files.
- Use the spreadsheet to support the flow, not as the normal staff-facing screen.

## 7. draft staff email format

### Subject

`[Form submission] Jane Smith | Extension | Ref: DEPT-2026-000123`

### Body structure

The first line should contain the staff actions:

```html
<p>
  <strong><a href="{{ReplyLink}}">Reply to {{DisplayNameForStaff}}</a></strong>
  &nbsp;|&nbsp;
  <a href="{{DrafterLink}}">Open Email Drafter</a>
</p>
```

Then include:

- student message
- lookup details: email, username, student ID, programme, stage, year, advisor, Banner link/code
- uploaded file links, if the form has attachments

The subject already contains the form-submission marker, student display name, enquiry type, and reference number. Do not repeat those as a second summary line in the body.

`Open Email Drafter` belongs in this first staff notification email. The Outlook reply link should only open a clean reply draft addressed to the student.

## 8. draft student acknowledgement email

### Subject

`Your enquiry has been received - DEPT-2026-000123`

### Body

Dear student,

Thank you for your enquiry. Your message has been received and has been given the reference number `DEPT-2026-000123`.

Please keep this reference number in case you need to follow up.

Best wishes,  
Department team

If the department has a separate urgent or formal process for some enquiry types, add one short line to point the student to that route.

## 9. safest first prototype

The safest first prototype is:

- one Microsoft Form
- one Excel lookup workbook
- one Power Automate cloud flow
- one pilot recipient inbox
- one acknowledgement email
- no automatic reassignment
- no write-back to Excel
- no SharePoint list as the workflow engine

This version is quick to test and easy to replace later.

## 10. practical notes, risks, and assumptions

### Main assumptions

- The form can reliably record responder identity when it is restricted to signed-in university users.
- The department can maintain a Banner export or other trusted lookup extract with stable student facts.
- Banner access is handled by staff permissions outside the flow.

### Main risks

- Excel is acceptable for lookup in version 1, but it is not a high-scale transactional store.
- Email aliases or stale lookup data may cause unmatched or incorrect enrichment.
- If lookup fails, the staff email may contain less study-context detail because the form is intentionally short.
- Sensitive information may be typed into free-text messages.
- A response-ID-based reference number is simple but only sequential within the form.
- If the form is copied or rebuilt, the reference sequence should be treated as a new series.

### Practical controls

- Normalize the recorded responder email before lookup.
- Keep the workbook small and stable.
- Avoid editing the workbook while large tests are running.
- Make the lookup optional, not blocking.
- Keep the staff email structured and consistent.
- Use Outlook categories or mailbox rules later, not hard flow reassignment first.
- Add a warning in the form asking students not to include unnecessary sensitive personal or medical detail.

## 11. practical improvements for later

- Move from a pilot inbox to a shared mailbox once the wording and field set are stable.
- Replace Excel with Dataverse, SQL, or a student-record source without changing the downstream email format.
- Add a tiny counter service only if strict enterprise-wide sequencing becomes necessary.
- Add mailbox reporting on volume by enquiry type.
- Add a controlled list of suggested owners maintained outside the flow.
- Add a follow-up or closure process only after the intake workflow is working reliably.

## 12. Microsoft product notes checked on 2026-03-18

- Microsoft Forms supports branching to later questions and sections: <https://support.microsoft.com/en-us/office/use-branching-logic-in-microsoft-forms-16634fda-eddb-44da-856d-6a8213f0d8bb>
- Microsoft Forms can restrict responses to people in the organization and record respondent name and email: <https://support.microsoft.com/en-au/topic/choose-who-can-fill-out-a-form-or-quiz-c90c641e-6f88-45c5-9cb9-aca2b4083949>
- Power Automate's Forms connector provides the `When a new response is submitted` trigger and `Get response details`: <https://learn.microsoft.com/en-us/power-automate/forms/overview>
- Excel Online connector supports `Get a row` and documents file-locking and freshness limits to keep in mind for a lookup workbook: <https://learn.microsoft.com/en-us/connectors/excelonline/>
- Microsoft recommends moving to shared senders or shared mailboxes as automations become more formalized: <https://learn.microsoft.com/en-us/power-automate/guidance/planning/formalizing-messages-alerts>
