# Simple setup steps

This is the shortest version of the build. Follow these steps in order.

## 1. decide the four basics

Before you build anything, decide:

1. Which account owns the Microsoft Form
2. Which inbox gets the staff emails first
3. Which shared mailbox will be used later
4. Where the Excel lookup workbook will live

## 2. create the Microsoft Form

1. Create a form called `Department student enquiry form`.
2. Copy the wording from `templates/microsoft_form_questions.md`.
3. Add these questions:
   - Enquiry type
   - Other enquiry type
   - Message
4. Tell students in the introduction that they must be signed in and do not need to type username or email.
5. Tell students that stable record details such as programme, year, and student ID are checked separately.
6. Add branching:
   - show `Other enquiry type` only when enquiry type is `Other`
7. Set the form so only people in the organization can respond.
8. Turn on recorded responder identity.
9. Set the thank-you message to say the student will receive an acknowledgement email.
10. Do not add stage, year, or programme questions in the preferred build.
11. Only add one checkpoint question later, such as `Programme of study`, if testing shows the lookup is not reliable enough.
12. Only add a separate `University email address` question later if testing shows the flow cannot access the responder's email.

## 3. create the Excel lookup file

1. Create an Excel workbook in OneDrive or SharePoint.
2. Add a table called `StudentLookup`.
3. Use the columns in `templates/student_lookup_schema.csv`.
4. Populate it from a Banner export or another trusted student-record source if you can.
5. Make sure `UniversityEmailNormalized` is lowercase and unique.
6. Add a few real or test student rows.
7. Make sure the Power Automate account can open the workbook.
8. Keep one table for all active department students. Do not split the lookup by year or stage in version 1.
9. Use this workbook as backend lookup data, not as the main staff working screen.

## 4. build the Power Automate flow

1. Create an automated cloud flow.
2. Use the trigger `When a new response is submitted`.
3. Add `Get response details`.
4. Pick the recorded responder email from Forms.
5. Normalize that email.
6. Derive the CIS username from the email prefix if needed.
7. Use the recorded responder email for the acknowledgement.
8. Build the reference number in the format `DEPT-YYYY-######`.
9. Look up the student in Excel using `UniversityEmailNormalized`.
10. If the lookup works, use the Excel data in the staff email.
11. If the lookup fails, still continue and use the recorded responder email and manual Banner checking.
12. Set a `Suggested owner` based on enquiry type.
13. Send the structured staff email to the pilot inbox.
14. Send the acknowledgement email to the student when the flow has an email address to use.

Use these helper files while building:

- `flows/version_1_flow_logic.md`
- `flows/power_automate_expressions.md`
- `templates/staff_email_template.txt`
- `templates/student_acknowledgement_email.txt`

## 5. keep routing simple

For version 1:

- send all staff emails to one inbox
- use subject tags like `[Module enquiry]` and `[Matched]`
- include `Suggested owner` in the body

Do not auto-assign to named people yet.

## 6. test the prototype

Run five tests:

1. A matched undergraduate enquiry
2. A matched taught postgraduate enquiry
3. An unmatched university email
4. An `Other` enquiry type
5. A normal enquiry with no extra checkpoint fields on the form

Check that:

- the reference number appears
- the staff email is readable
- the acknowledgement email is sent
- the flow still works when lookup fails
- staff can still identify the student without asking for programme or year on the form

## 7. move to the shared mailbox

When the pilot works:

1. Change the recipient from the pilot inbox to the shared mailbox.
2. Change the send action if needed to `Send an email from a shared mailbox`.
3. Confirm mailbox permissions.
4. Re-run the tests.

## 8. stop here for version 1

Version 1 is finished once:

- students can submit the form
- staff get one clear email per enquiry
- students get an acknowledgement with a reference number
- lookup success and failure both behave properly

Do not add a case-management database, hard routing, or deep Banner integration yet.
