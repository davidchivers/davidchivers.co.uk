# AI draft response option

This is a future enhancement for the student enquiry workflow.

## Goal

Generate a suggested staff reply from the student's enquiry, while keeping a human staff member responsible for checking, editing, and sending the response.

## Recommended principle

AI should draft, not send.

The system should never automatically send an AI-written response to a student. The draft should appear in the staff email or in a draft/approval step where a staff member can review it.

The preferred staff experience is to extend the existing Email Drafter app, because staff already understand the click-to-copy workflow. The staff email can link to the drafter with the enquiry details, and the drafter can show:

- the normal curated response templates
- a suggested AI draft
- a copy button
- clear warning text: `AI draft - check before sending`

## Power Automate shape

Add this after the form response has been parsed and the student lookup has completed:

1. Build a compact prompt input from:
   - enquiry type
   - student message
   - student display name
   - programme/stage/year if available
   - reference number
   - approved department reply style and constraints
2. Run an AI Builder prompt using the Power Automate `Run a prompt` action.
3. Store or pass the generated draft to the Email Drafter.
4. Staff open the drafter, review/edit the AI draft, then use the existing copy/paste workflow.
5. Keep the normal Outlook reply link as the manual send route.

## Integration options

### Option A - simplest

Insert the AI draft directly into the staff notification email under:

`Suggested draft reply - check before sending`

This is easiest but clutters the staff email.

### Option B - recommended

Add an `Open in Email Drafter` link to the staff email. The drafter receives:

- reference number
- enquiry type
- student display name
- student email
- student message
- matched lookup details
- AI suggested draft

This keeps Outlook simple and puts the drafting/review experience in the tool staff already use.

### Option C - later

Have Power Automate create a draft Outlook message in a shared mailbox. This is possible in principle, but it creates more governance and review risk, so it should come after the drafter route works well.

## Prompt guardrails

The prompt should say:

- Do not make policy decisions.
- Do not promise an extension, concession, fee change, grade change, or timetable change.
- Do not give medical, legal, or financial advice.
- If the enquiry mentions urgent risk, safeguarding, severe distress, harassment, discrimination, or a deadline today, tell staff to use the formal escalation route.
- Keep the reply concise and professional.
- Ask for missing information only when necessary.
- Include the reference number.
- Make clear when the student must use a separate formal university process.

## Example output in staff email

```text
Suggested draft reply - check before sending

Dear Jane,

Thank you for your message. We have received your enquiry about your extension request.

Please note that this form does not replace any formal university extension or mitigating circumstances process. If you have not already done so, please complete the relevant formal process and include any required evidence there.

We will review your enquiry and come back to you as soon as possible.

Reference: DEPT-2026-12
```

## Requirements before building

- Confirm AI Builder / Power Platform licensing and capacity.
- Confirm the feature is available in the Durham tenant and region.
- Agree a data-handling position for sending student enquiry text to the approved Microsoft AI service.
- Create and share the prompt under the production owner/group, not a pilot builder's personal account.
- Decide where AI draft records live if they are stored for the drafter: SharePoint list, Dataverse, or another department-owned store.
- Test against real examples and edge cases before enabling.
- Keep human review mandatory.
