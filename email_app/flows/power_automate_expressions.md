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
  padLeft(string(outputs('Compose_ResponseId')), 6, '0')
)
```

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

```text
if(
  equals(variables('resolved_stage'),'Undergraduate'),
  'UG',
  'PGT'
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
  '[Enquiry][',
  outputs('Compose_EnquiryType'),
  '][',
  outputs('Compose_StageTag'),
  ']',
  outputs('Compose_YearTag'),
  '[',
  outputs('Compose_LookupTag'),
  '] ',
  outputs('Compose_ReferenceNumber'),
  ' - ',
  if(
    empty(outputs('Compose_SelectedUsername')),
    outputs('Compose_SelectedStudentEmail'),
    outputs('Compose_SelectedUsername')
  )
)
```

## 10. blank-safe year display

```text
if(
  empty(variables('resolved_year')),
  'Not applicable',
  variables('resolved_year')
)
```

## 11. blank-safe other enquiry type display

```text
if(
  empty(outputs('Compose_OtherEnquiryType')),
  'None',
  outputs('Compose_OtherEnquiryType')
)
```

## Implementation note

For suggested owner, use a `Switch` action rather than a long nested `if()` expression. It is easier to maintain and safer for non-technical admins to update later.
