# Staff notification to Email Drafter workflow

This is the enhancement for connecting the first staff notification email to the existing Email Drafter app. The drafter link belongs in the form-submission notification that staff receive, not inside the student reply draft.

## Current working pattern

Staff currently:

1. Open the staff notification email.
2. Click `Reply to [student]`.
3. Open the Email Drafter.
4. Pick a suitable template.
5. Click `Copy`.
6. Paste the copied response into Outlook.
7. Edit/check/send manually.

This is acceptable for version 1 because it keeps staff in control and avoids auto-sending.

## Why this works technically

The current Email Drafter copy buttons already copy both:

- `text/html`
- `text/plain`

That means Outlook can usually preserve links, line breaks, and basic formatting when staff paste into the reply.

## Recommended future improvement

Add an `Open Email Drafter` link to the staff notification email, on the same first action line as `Reply to [student]`.

The link should open the drafter and pass enough context for search/pre-filtering, for example:

```text
https://davidchivers.co.uk/drafter/?type=Extension&student=Jane%20Smith&ref=DEPT-2026-12
```

The drafter could then:

- pre-fill the search box using the enquiry type
- show likely templates first
- show a small context banner with student name, reference number, and enquiry type
- keep the existing copy button as the final action

## Recommended staff email section

```html
<p>
  <strong><a href="{{ReplyLink}}">Reply to {{DisplayNameForStaff}}</a></strong>
  &nbsp;|&nbsp;
  <a href="{{DrafterLink}}">Open Email Drafter</a>
</p>
```

The Outlook reply link should only prepare the student reply: recipient, subject, `Dear [name],`, and blank space for staff to write. Do not put the drafter controls inside the reply email.

## What not to do yet

- Do not automatically choose and paste a template.
- Do not auto-send a response.
- Do not make the drafter responsible for policy decisions.
- Do not put large template text into the staff notification email by default.

## Later refinement

If staff want this smoother, the drafter can grow an enquiry-context mode:

1. Staff click `Open Email Drafter` from the first form-submission email.
2. Drafter opens filtered to the enquiry type.
3. Staff choose a template.
4. Drafter can optionally insert:
   - `Dear [student name],`
   - reference number
   - standard closing
5. Staff copy the final response and paste into Outlook.
