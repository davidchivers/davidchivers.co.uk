# Email app

## Purpose

Prototype a first-version student enquiry workflow for a department using Microsoft Forms, Power Automate, Excel lookup data, and email.

This project is intentionally lightweight:

- Microsoft Form for intake
- Power Automate for enrichment and notifications
- Excel Online as the first lookup source
- staff handling through a normal inbox first, then a shared mailbox
- no full case-management platform in version 1

## Recommended version 1

- Use one short department form that asks only for the enquiry itself.
- Pull stable student facts from Banner export or Excel lookup data where possible.
- Keep any extra checkpoint field optional and add it only if testing shows matching is unreliable.
- Generate the enquiry reference from the Forms response ID so version 1 does not need a separate counter store.
- Use an Excel table keyed on normalized university email.
- Send one structured staff email and one student acknowledgement email for every submission.
- Keep routing advisory only through subject tags and a suggested owner field.

## What to open first

1. `workflow.html`
2. `START_HERE.html`
3. `START_HERE.pdf`
4. `simple_setup_steps.md`

## Files in this project

- `START_HERE.md`: source for the handover landing page
- `START_HERE.html`: clickable landing page for local folder use
- `START_HERE.pdf`: printable/shareable overview
- `workflow.html`: Email App Instructions landing page
- `build_new_email_app.html`: first-build handover guide for creating the app from scratch
- `update_email_app.html`: linear step-by-step update instructions
- `how_to_use_app.html`: linear step-by-step operating guide (`Use email app`)
- `instructions.css`: shared styling for the instruction pages
- `styles.css`: shared styling for the browser-first docs
- `build_docs.ps1`: rebuilds the HTML and PDF handover docs
- `student_enquiry_workflow_spec.md`: full written specification
- `simple_setup_steps.md`: one simple step-by-step setup guide
- `build_plan.md`: step-by-step build and test plan
- `flows/version_1_flow_logic.md`: recommended Power Automate structure
- `flows/power_automate_expressions.md`: copy/paste expressions for core actions
- `templates/microsoft_form_questions.md`: draft question wording and branching
- `templates/microsoft_form_questions.docx`: editable Word version of the form master
- `templates/student_enquiry_form_import.docx`: editable Word file to upload into Microsoft Forms by Quick Import
- `templates/staff_email_template.txt`: staff email subject/body draft
- `templates/student_acknowledgement_email.txt`: student acknowledgement draft
- `templates/student_lookup_schema.csv`: starter Excel lookup schema with sample rows
- `templates/student_lookup_template.xlsx`: editable Excel workbook template for lookup data

## Next 3 concrete tasks

1. Confirm the pilot mailbox, eventual shared mailbox, and form owner account.
2. Use the first-build guide to create the form by Quick Import and create the lookup workbook.
3. Build and test the flow with matched and unmatched records before switching to the shared mailbox.

## Packaging note

This folder is intended to work as a standalone handover pack. If you need to send it to someone else, keep the whole `other/email_app` folder together so the relative links keep working.
