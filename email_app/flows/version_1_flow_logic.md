# Version 1 flow logic

## Flow name

`Student enquiry intake - v1`

## Connectors

- Microsoft Forms
- Excel Online
- Office 365 Outlook

## Recommended action sequence

1. Trigger: `When a new response is submitted`
2. Action: `Get response details`
3. Action: `Compose_RecordedResponderEmail`
4. Action: `Compose_NormalizedResponderEmail`
5. Action: `Compose_SelectedUsername`
6. Action: `Compose_SelectedStudentEmail`
7. Action: `Compose_ResponseId`
8. Action: `Compose_ReferenceNumber`
9. Action: `Initialize variable lookup_matched` = `false`
10. Action: `Initialize variable student_name`
11. Action: `Initialize variable student_id`
12. Action: `Initialize variable resolved_programme`
13. Action: `Initialize variable resolved_stage`
14. Action: `Initialize variable resolved_year`
15. Action: `Initialize variable academic_advisor`
16. Action: `Initialize variable banner_link`
17. Action: `Initialize variable banner_code`
18. Action: `Initialize variable lookup_status`
19. Action: `Initialize variable suggested_owner`
20. Scope: `Lookup student`
21. Scope: `On lookup match`
22. Scope: `On lookup miss`
23. Action: `Compose_EnquiryType`
24. Action: `Compose_OtherEnquiryType`
25. Action: `Compose_ResolvedEnquiryType`
26. Action: `Switch - suggested owner`
27. Action: `Compose_StageTag`
28. Action: `Compose_YearTag`
29. Action: `Compose_LookupTag`
30. Action: `Compose_StaffEmailSubject`
31. Action: `Send an email (V2)` to pilot inbox, or `Send an email from a shared mailbox (V2)` later
32. Action: `Send acknowledgement email`
33. Scope or branch: `Failure notification`

## Email source selection

Recommended priority:

1. Use recorded responder email from Forms if the form is restricted to organization users and `Record name` is enabled
2. Normalize that email
3. Derive `selected_username` from the email prefix:
   - if the responder email is `hfnt93@university.ac.uk`, use `hfnt93`
4. Use the recorded responder email as `selected_student_email`
5. If your tenant exposes CIS username directly, you can use that instead of deriving it from email
6. If testing shows recorded responder email is unavailable in the tenant, add a separate required `University email address` field

Optional pilot safeguard:

- if both direct username and responder email are available, compare them and include an `Identity check` note in the staff email

## Lookup student scope

Use Excel `Get a row` with:

- File: lookup workbook
- Table: `StudentLookup`
- Key column: `UniversityEmailNormalized`
- Key value: normalized responder email

This is preferable to filtering the whole table in version 1 because the design is cleaner and the key is explicit.

Operational note:

- the flow connection account must have access to the workbook
- avoid having the workbook heavily edited during testing or busy periods

## On lookup match scope

Configure `Run after` so this scope runs only if `Lookup student` succeeds.

Set:

- `lookup_matched = true`
- `student_name` from Excel
- `student_id` from Excel
- `resolved_programme` from Excel
- `resolved_stage` from Excel
- `resolved_year` from Excel
- `academic_advisor` from Excel
- `banner_link` from Excel
- `banner_code` from Excel
- `lookup_status = Matched`

## On lookup miss scope

Configure `Run after` so this scope runs if `Lookup student` fails, times out, or is skipped.

Set:

- `lookup_matched = false`
- `student_name = Not found`
- `student_id = Not found`
- `resolved_programme` from form answer
- `resolved_stage` from form answer
- `resolved_year` from form answer or blank
- `academic_advisor = Not found`
- `banner_link = Not found`
- `banner_code = Not found`
- `lookup_status = Not matched`

The flow should continue normally.

## Suggested owner logic

Use a `Switch` on enquiry type, not a complex nested expression.

Recommended role labels:

- Module enquiry -> `module support`
- Academic advisor -> `advisor admin`
- Assessment query -> `assessment admin`
- Extension -> `assessment admin`
- Mitigating circumstances -> `student support or formal process check`
- Attendance -> `attendance admin`
- Timetable -> `timetable admin`
- IT / systems access -> `department IT`
- Fees / finance -> `student finance liaison`
- Other -> `general triage`

Keep the result advisory only.

## Staff email payload

Include:

- reference number
- submitted timestamp
- lookup status
- suggested owner
- recorded responder email
- derived username
- student name
- student email
- student ID
- stage of study
- year of study
- programme of study
- enquiry type
- other enquiry type
- academic advisor
- banner link
- banner code
- student message

## Student acknowledgement payload

Include:

- greeting
- confirmation of receipt
- reference number
- brief follow-up note
- department signature

## Failure notification

Recommended minimum:

- if the flow fails before the staff email is sent, notify the form/flow owner mailbox
- include the Forms response ID and timestamp in the failure email

## Notes for later upgrades

- Replace Excel with another source by swapping only the lookup block.
- Move send actions to the shared mailbox after pilot sign-off.
- Add mailbox categories or reporting after the intake flow is stable.
