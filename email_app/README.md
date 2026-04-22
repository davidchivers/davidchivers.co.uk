# Email app

## Purpose

Prototype a first-version student enquiry workflow for a department using Microsoft Forms, Power Automate, Excel lookup data, and email.

## Current status

The version 1 pilot now exists and is in testing.

- Microsoft Form: built
- Excel lookup workbook: built
- Power Automate flow: built
- staff notification destination during pilot: `david.chivers@durham.ac.uk`
- production handoff path: repoint the inbox or switch to a shared mailbox after testing passes

The current pilot inbox is a testing destination, not a design constraint. The same model should be portable to another personal inbox or a department shared mailbox without rebuilding the form or lookup logic.

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
3. `how_it_works.md`
4. `build_progress.md`
5. `START_HERE.pdf`
6. `simple_setup_steps.md`

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
- `build_progress.md`: current build and testing status for the live pilot
- `how_it_works.md`: full architecture and testing notes for the current flow
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

1. Run the first clean end-to-end tests, capture the Forms Message field ID, and replace the temporary JSON dump in the staff email with the dedicated message field.
2. Repoint the pilot inbox from `david.chivers@durham.ac.uk` to the target inbox or shared mailbox once testing passes.
3. Keep the website and handover pages aligned with the tested pilot model and the mailbox-porting steps.

## Packaging note

This folder is intended to work as a standalone handover pack. If you need to send it to someone else, keep the whole `other/email_app` folder together so the relative links keep working.
