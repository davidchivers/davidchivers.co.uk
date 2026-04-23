# Microsoft Form question draft

## Form title

`Department student enquiry form`

## Form introduction

Use this form for general department enquiries about modules, academic advising, assessments, attendance, timetables, systems access, and related issues.

You must be signed in with your university account to use this form. The form records your university account details automatically, so you do not need to type your username or email address. Stable record details such as programme, year, and student ID are checked separately by staff systems where possible. If your issue is urgent or relates to a deadline today, contact the department office directly.

If your university uses a separate formal process for extensions or mitigating circumstances, you may still need to complete that process.

Please do not include unnecessary sensitive personal or medical information in the message box.

## Questions

### 1. Enquiry type

- Type: choice
- Required: yes
- Prompt:

`Enquiry type`

- Options:

`Academic advisor`  
`Assessment query`  
`Attendance`  
`Extension`  
`Fees / finance`  
`IT / systems access`  
`Mitigating circumstances`  
`Module enquiry`  
`Timetable`  
`Other`

### 2. Other enquiry type

- Type: text
- Required: yes when shown
- Prompt:

`If you selected Other, please describe the enquiry type`

- Branching:

Show only if `Enquiry type = Other`.

### 3. Message

- Type: long text
- Required: yes
- Prompt:

`Please describe your enquiry`

- Help text:

`Include enough detail for staff to understand the issue and what help you need.`

### 4. Attach files or screenshots

- Type: file upload
- Required: no
- Prompt:

`Attach files or screenshots if relevant`

- Help text:

`Upload screenshots, PDFs, or short supporting documents that help staff understand the issue. Do not upload unnecessary sensitive personal or medical information; use any formal university evidence process where required.`

- Recommended settings:
  - Respondents: only people in the organisation
  - Maximum number of files: 10
  - Single file size limit: 10 MB
  - File types: Image, PDF, Word

- Storage note:
  - For production, make this a group-owned form so uploads live in the group SharePoint site rather than an individual's OneDrive.
  - Staff emails should include links to uploaded files or the enquiry evidence folder, not copies of the files as email attachments.

## Optional checkpoint field

Preferred version 1 build:

- Do not ask for stage, year, or programme on the form.
- Pull stable student facts from the lookup workbook instead.

Fallback if matching later proves unreliable:

- Add one checkpoint question such as `Programme of study`.
- Do not add multiple extra study-detail questions unless testing shows they are needed.

## Branching map

- If `Enquiry type = Other`, show `Other enquiry type`, then `Message`, then `Attach files or screenshots`.
- Otherwise, skip `Other enquiry type` and go to `Message`, then `Attach files or screenshots`.

## Thank-you message

`Thank you. Your enquiry has been submitted. You will receive an acknowledgement email with a reference number.`

## Identity note

- Do not add a `University username` question in the preferred build.
- Do not add a `University email address` question in the preferred build.
- Restrict the form to signed-in university users and turn on recorded responder identity.
- Use the recorded responder email from Forms as the acknowledgement address and as the primary lookup key.
- If your tenant exposes username directly, you can use it as well, but email is the safer version 1 key.
