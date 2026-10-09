# Seminars

Public route: https://davidchivers.co.uk/seminars/

GitHub Pages serves the four client assets. They read the public programme from
https://economics-seminar-demo.silkyangel64.chatgpt.site/api/programme.
That service reads the dedicated published Outlook calendar. It exposes
`/calendar/external.ics`, `/calendar/coffee.ics`, and `/calendar/all.ics`.
Filtering preserves the original event IDs and timezone definitions. No organiser
email addresses, travel details, private notes or workbook contents are served.

Publishing the Excel programme updates the dedicated Outlook source calendar.
The website reads that publication; programme edits do not require a GitHub push.
Outlook subscription refresh timing is controlled by Microsoft.

Internal seminars have no source spreadsheet or feed connected yet and are
explicitly marked as coming later. Do not reuse the external feed for them.

Current publisher source and deployment project:
`E:\AI_tasks\2026-10-09\seminar_demo\site`,
Sites project `appgprj_6ac8d5c8621c8191bd22766e9e203296`.
Checks: `check-feeds.mjs` and `check-programme.mjs`; 17 external seminars and 17
coffee events, unchanged original event components, retained timezones.
