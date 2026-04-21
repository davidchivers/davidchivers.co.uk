# Build plan

## 1. confirm the prototype boundaries

Confirm four practical choices before building:

1. Form owner account
2. Pilot staff recipient inbox
3. Future shared mailbox address
4. Excel workbook owner and storage location

## 2. create the Microsoft Form

1. Create a new form called `Department student enquiry form`.
2. Use `Quick Import` with `templates/student_enquiry_form_import.docx`.
3. Review the imported form and tidy any question that needs adjustment.
4. Add branching for `Other enquiry type`.
5. Set the thank-you message to say that an acknowledgement email will follow.
6. Make sure the introduction says students must be signed in and do not need to type username or email.
7. Make sure the introduction says stable record details are checked separately and do not need to be typed by the student.

Recommended settings:

- `Only people in my organization can respond`
- `Record name` on
- do not limit to one response per person
- do not ask for stage, year, or programme in the preferred build
- only add one checkpoint field later if matching proves unreliable
- only add a separate `University email address` question if testing shows the flow cannot access the responder email

## 3. create the Excel lookup workbook

1. Create a workbook in OneDrive or SharePoint.
2. Add a table named `StudentLookup`.
3. Use the columns from `templates/student_lookup_schema.csv`.
4. Prefer to populate the workbook from a Banner export or another trusted student-record source.
5. Populate a small clean test set first.
6. Ensure `UniversityEmailNormalized` is unique and lowercase.
7. Make sure the Power Automate connection account has access to the workbook.
8. Keep one lookup table for all active department students. For a department-sized cohort of roughly 1,100 students, do not split the workbook by year or stage in version 1.

Do not use the workbook to log enquiries in version 1. Use it only as backend lookup data.

## 4. build the Power Automate flow

1. Create an automated cloud flow.
2. Trigger on `When a new response is submitted`.
3. Add `Get response details`.
4. Compose the recorded responder email.
5. Derive the username and pick the email address from the recorded identity.
6. Compose the padded reference number.
7. Attempt the Excel `Get a row` lookup on `UniversityEmailNormalized`.
8. Resolve matched and unmatched outputs.
9. If lookup fails, continue with the enquiry and let staff check Banner or the student record separately.
10. Set the suggested owner label based on enquiry type.
11. Send the staff email.
12. Send the student acknowledgement email when the flow has an email address to use.
13. Add a simple admin failure notification path.

Use `flows/version_1_flow_logic.md` and `flows/power_automate_expressions.md` while building.

## 5. configure cautious routing

For version 1:

- keep a single destination inbox
- add subject tags
- include `Suggested owner` in the body

Do not auto-forward to named individuals yet.

## 6. test with a small scenario pack

Run at least these tests:

1. Matched undergraduate module enquiry
2. Matched taught postgraduate IT / systems access enquiry
3. Unmatched university email
4. `Other` enquiry type with free-text subtype
5. Normal enquiry with no checkpoint fields on the form

Check each test for:

- correct reference number format
- correct lookup status
- correct fallback behavior when lookup fails
- readable staff email
- correct acknowledgement email
- enough student context from the lookup without asking the student for programme or year on the form

## 7. move from pilot inbox to shared mailbox

After the tests are stable:

1. Replace the pilot recipient inbox with the shared mailbox.
2. Change send actions to use the shared mailbox where appropriate.
3. Confirm `Send As` or `Send on Behalf` permissions.
4. Re-run the full test pack.

## 8. add mailbox-side admin handling

Keep mailbox handling simple:

- optional Outlook rules based on subject tags
- manual triage by staff
- consistent use of the reference number in replies

This is safer than trying to assign ownership inside the flow too early.

## 9. acceptance criteria for version 1

Version 1 is ready when:

- every test submission produces a reference number
- lookup success and failure both behave correctly
- staff receive a readable structured email
- students receive an acknowledgement email
- the process works from a pilot inbox and from the shared mailbox

## 10. recommended next step after pilot

Once the pilot works:

1. Keep the form short and only add a checkpoint field if testing shows it is needed.
2. Replace Excel only if lookup quality or scale justifies it.
3. Add lightweight reporting from the mailbox or flow run history before adding a new platform.
