# Staff email update - exact Power Automate changes

Use this note when updating the current live flow to the cleaner staff-email format.

## Goal

Replace the old subject/tag-chain and the JSON-heavy body with:

- subject: `[Form submission] Jane Smith | Extension | Ref: DEPT-2026-9`
- top link: `Reply to Jane Smith`
- the student message high up
- one compact student/record block lower down

## Where to put each change

### 1. Add these Compose actions immediately before `Compose_StaffEmailSubject`

These can all be standard **Data Operation > Compose** actions.

#### `Compose_StudentMessage`

Use this exact expression:

```text
outputs('Get_response_details')?['body/r7ab4bdb1e6974415bb9e604ade29bd13']
```

#### `Compose_DisplayNameForStaff`

Use this exact expression:

```text
if(
  or(empty(variables('student_name')), equals(variables('student_name'),'Not found')),
  if(
    empty(outputs('Compose_SelectedUsername')),
    outputs('Compose_SelectedStudentEmail'),
    outputs('Compose_SelectedUsername')
  ),
  variables('student_name')
)
```

#### `Compose_GreetingName`

Use this exact expression:

```text
if(
  or(empty(outputs('Compose_DisplayNameForStaff')), equals(outputs('Compose_DisplayNameForStaff'),'Not found')),
  'student',
  outputs('Compose_DisplayNameForStaff')
)
```

#### `Compose_ReplySubject`

Use this exact expression:

```text
concat(
  'RE: ',
  outputs('Compose_ReferenceNumber'),
  ' | ',
  outputs('Compose_ResolvedEnquiryType')
)
```

#### `Compose_ReplyLink`

Use this exact expression:

```text
concat(
  'mailto:',
  outputs('Compose_SelectedStudentEmail'),
  '?subject=',
  uriComponent(outputs('Compose_ReplySubject')),
  '&body=',
  uriComponent(
    concat(
      'Dear ',
      outputs('Compose_GreetingName'),
      ',',
      decodeUriComponent('%0D%0A%0D%0A%0D%0A')
    )
  )
)
```

### 2. Replace the input in `Compose_StaffEmailSubject`

Open the existing `Compose_StaffEmailSubject` action and replace its input with this exact expression:

```text
concat(
  '[Form submission] ',
  outputs('Compose_DisplayNameForStaff'),
  ' | ',
  outputs('Compose_ResolvedEnquiryType'),
  ' | Ref: ',
  outputs('Compose_ReferenceNumber')
)
```

### 3. Keep `Send_staff_email` subject linked to `Compose_StaffEmailSubject`

In `Send_staff_email`:

- **Subject** = `outputs('Compose_StaffEmailSubject')`

### 4. Replace the HTML body in `Send_staff_email`

In `Send_staff_email`, replace the current body with this HTML:

```html
<p><strong><a href="@{outputs('Compose_ReplyLink')}" style="color:#0563C1;text-decoration:none;">Reply to @{outputs('Compose_DisplayNameForStaff')}</a></strong></p>

<hr>

<p><strong>Student message</strong></p>
<div style="border-left:4px solid #68246D;padding:10px 12px;margin:8px 0 14px 0;background-color:#F7F4F7;">
@{replace(replace(replace(replace(replace(outputs('Compose_StudentMessage'),'&','&amp;'),'<','&lt;'),'>','&gt;'),decodeUriComponent('%0D%0A'),'<br>'),decodeUriComponent('%0A'),'<br>')}
</div>

<hr>

<p><strong>Lookup details</strong><br>
Email: @{outputs('Compose_SelectedStudentEmail')} | Username: @{outputs('Compose_SelectedUsername')} | ID: @{variables('student_id')}<br>
Programme: @{if(empty(variables('resolved_programme')),'Not matched',variables('resolved_programme'))} | Stage: @{if(empty(variables('resolved_stage')),'Not matched',variables('resolved_stage'))} | Year: @{if(empty(variables('resolved_year')),'Not matched',variables('resolved_year'))}<br>
Advisor: @{variables('academic_advisor')}<br>
Banner: @{variables('banner_link')} | Banner code: @{variables('banner_code')}</p>
```

## Notes

- This keeps the `mailto:` reply action simple and Outlook-friendly.
- The reply opens a new message to the student with:
  - subject: `RE: {reference} | {enquiry type}`
  - body starting: `Dear {display name},` followed by blank space to type the reply
- If the student was not matched in the lookup, the reply still works and falls back safely.
- The old JSON dump should be removed once this body is pasted in.
- The subject already contains `[Form submission]`, name, enquiry type, and reference, so the body intentionally does not repeat those as a separate summary line.
