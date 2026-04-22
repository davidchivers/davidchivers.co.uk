---
title: Student enquiry workflow handover
author: Department prototype pack
geometry: margin=1in
colorlinks: true
linkcolor: blue
---

# Student enquiry workflow handover

This folder is the handover pack for the first-version student enquiry workflow using Microsoft Forms, Power Automate, Excel lookup data, and email.

## Current status

The version 1 pilot now exists and is in testing.

- the Microsoft Form has been created
- the Excel lookup workbook has been created
- the Power Automate flow has been built
- the current pilot staff inbox is `david.chivers@durham.ac.uk`
- that pilot inbox is temporary and can be switched to another inbox or a shared mailbox after testing passes

## Recommendation

Use this folder as the main editable source pack.

- Best for a quick overview of the process: `workflow.html`
- Best for day-to-day use: `START_HERE.html`
- Best for the current live build details: `how_it_works.md` and `build_progress.md`
- Best for printing or emailing as a summary: `START_HERE.pdf`
- Best for detailed build work: the linked Markdown and template files in this folder

For testing, there are now two safe views of the same model:

1. the full folder as the editable source pack
2. the website copy as a browser-first guide

The live operational workflow still lives in Microsoft 365. The website and the folder are documentation layers around that workflow, not replacements for it.

The browser-first version of the pack is:

- `workflow.html`
- `build_new_email_app.html`
- `update_email_app.html`
- `how_to_use_app.html` (`Use email app`)
- `START_HERE.html`
- `simple_setup_steps.html`
- `student_enquiry_workflow_spec.html`
- `build_plan.html`
- `flows/version_1_flow_logic.html`
- `flows/power_automate_expressions.html`
- `templates/microsoft_form_questions.html`

## Open these in order

1. [Email App Instructions](workflow.html)
2. [Use email app](how_to_use_app.html)
3. [Update email app](update_email_app.html)
4. [Build new email app](build_new_email_app.html)
5. [Simple setup steps](simple_setup_steps.html)
6. [Full specification](student_enquiry_workflow_spec.html)

## Templates

- [Microsoft Form questions](templates/microsoft_form_questions.html)
- [Student enquiry form import file](templates/student_enquiry_form_import.docx)
- [Staff email template](templates/staff_email_template.txt)
- [Student acknowledgement email](templates/student_acknowledgement_email.txt)
- [Student lookup schema](templates/student_lookup_schema.csv)

## What this prototype does

- takes a student enquiry through Microsoft Forms
- generates a readable reference number
- looks up student details from Excel using university email
- sends a structured staff email
- sends an acknowledgement email to the student

Preferred version 1 rule:

- ask students only for the enquiry itself
- pull stable student facts from Banner export or Excel lookup data
- keep any extra checkpoint question optional

## What this prototype does not do

- full case management
- hard automatic reassignment
- deep Banner integration
- SharePoint-list-based workflow management

## Portability

The current pilot routes staff notifications to `david.chivers@durham.ac.uk`, but that is only for testing.

To port this workflow:

1. change the recipient inbox in the Outlook actions
2. if needed, switch from `Send an email (V2)` to `Send an email from a shared mailbox`
3. retest matched and unmatched cases

The form, lookup workbook, and core flow logic do not need to be redesigned just because the destination mailbox changes.

## Safest format choice

For this project, the safest setup is:

1. Keep the operational workflow online in Microsoft 365.
2. Keep the handover documentation in this folder as the editable source pack.
3. Use the website copy when you want a lighter browser-first route through the same material.
4. Keep the files together if you need to send the folder to someone else.

That keeps the live system simple while still giving you an easy handover layer.

## If you later want a department-owned version

The next step is not a rebuild. It is a handoff:

1. finish pilot testing
2. move the staff email destination from the pilot inbox to the target inbox or shared mailbox
3. republish the same guidance with department-owned links if needed
