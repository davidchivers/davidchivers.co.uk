---
title: Student enquiry workflow handover
author: Department prototype pack
geometry: margin=1in
colorlinks: true
linkcolor: blue
---

# Student enquiry workflow handover

This folder is the handover pack for the first-version student enquiry workflow using Microsoft Forms, Power Automate, Excel lookup data, and email.

## Recommendation

Use this folder as the main handover format.

- Best for a quick overview of the process: `workflow.html`
- Best for day-to-day use: `START_HERE.html`
- Best for printing or emailing as a summary: `START_HERE.pdf`
- Best for detailed build work: the linked Markdown and template files in this folder

For version 1, this should stay as a local or shared folder, not a separate website. The workflow itself is already online inside Microsoft 365. The documentation does not need another platform yet.

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

## Safest format choice

For this project, the safest setup is:

1. Keep the operational workflow online in Microsoft 365.
2. Keep the handover documentation as this standalone folder.
3. Keep the files together if you need to send the folder to someone else.

That is simpler than building a separate website, and more usable than relying on a PDF alone.

## If you later want an online version

The next step would be a very simple read-only SharePoint or Teams page that links to the same files. That should only happen after the process is stable and the wording has stopped changing.
