# Power Automate expressions

These expressions assume you first store important dynamic values in short `Compose` actions so later expressions stay readable.

## 1. normalize the recorded responder email

Create `Compose_RecordedResponderEmail` first using the Forms dynamic value for the responder's email, then use:

```text
toLower(trim(outputs('Compose_RecordedResponderEmail')))
```

## 2. derive the username

If the responder email is `hfnt93@university.ac.uk`, keep only `hfnt93`.

```text
first(split(outputs('Compose_NormalizedResponderEmail'),'@'))
```

## 3. select the best student email

Recommended priority:

1. recorded responder email if available
2. otherwise blank

```text
if(
  not(empty(outputs('Compose_NormalizedResponderEmail'))),
  outputs('Compose_NormalizedResponderEmail'),
  ''
)
```

## 4. padded reference number

Create `Compose - response id` from the Forms `Response Id` dynamic value, then use:

```text
concat(
  'DEPT-',
  formatDateTime(utcNow(),'yyyy'),
  '-',
  substring(
    concat('000000', string(outputs('Compose_ResponseId'))),
    sub(length(concat('000000', string(outputs('Compose_ResponseId')))), 6),
    6
  )
)
```

> **Note:** `padLeft` and `formatNumber` are not valid Power Automate workflow
> expression functions. Use the `substring`/`concat` approach above, which pads
> the response ID to six digits using only supported functions.

## 5. resolved enquiry type

Use the `Other enquiry type` value only when needed:

```text
if(
  equals(outputs('Compose_EnquiryType'),'Other'),
  outputs('Compose_OtherEnquiryType'),
  outputs('Compose_EnquiryType')
)
```

## 6. stage tag

Use `Unknown` when the stage was not resolved so unmatched enquiries are not mislabeled as `PGT`.

```text
if(
  empty(variables('resolved_stage')),
  'Unknown',
  if(
    equals(variables('resolved_stage'),'Undergraduate'),
    'UG',
    if(
      equals(variables('resolved_stage'),'Taught postgraduate'),
      'PGT',
      'Unknown'
    )
  )
)
```

## 7. year tag

```text
if(
  empty(variables('resolved_year')),
  '',
  concat('[', variables('resolved_year'), ']')
)
```

## 8. lookup tag

```text
if(
  variables('lookup_matched'),
  'Matched',
  'Unmatched'
)
```

## 9. staff email subject

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

## 10. drafter link for the staff notification

Add a `Compose_DrafterLink` action before the staff email. Replace the base URL if the drafter is hosted somewhere else.

```text
concat(
  'https://davidchivers.co.uk/drafter/?type=',
  uriComponent(outputs('Compose_ResolvedEnquiryType')),
  '&student=',
  uriComponent(outputs('Compose_DisplayNameForStaff')),
  '&ref=',
  uriComponent(outputs('Compose_ReferenceNumber'))
)
```

Use this only in the first staff notification email. The reply mailto should stay focused on opening a clean Outlook reply to the student.

## 11. blank-safe year display

```text
if(
  empty(variables('resolved_year')),
  'Not applicable',
  variables('resolved_year')
)
```

## 12. blank-safe other enquiry type display

```text
if(
  empty(outputs('Compose_OtherEnquiryType')),
  'None',
  outputs('Compose_OtherEnquiryType')
)
```

## Implementation note

For suggested owner, use a `Switch` action rather than a long nested `if()` expression. It is easier to maintain and safer for non-technical admins to update later.

If the preferred short form is used, do not backfill programme, stage, or year from unrelated answers when lookup misses. Leave those values blank and let the display logic handle them safely.
