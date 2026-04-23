# Future Power App option

This is not needed for version 1, but it is the natural next step if the department wants a more integrated ticketing screen.

## What a Power App would replace

The current version 1 pattern is:

- Microsoft Forms collects the student enquiry.
- Power Automate enriches it and sends emails.
- Staff handle the work in Outlook.
- The Email Drafter helps staff copy/paste standard response text.

A Power App would not just make the email prettier. It would become a staff-facing work screen for enquiries.

## Recommended future shape

1. Keep Microsoft Forms and the current Power Automate flow until the process is stable.
2. Add a SharePoint List or Dataverse table called something like `Student Enquiries`.
3. Have Power Automate create one record per form submission.
4. Store attachments in SharePoint and link them to the enquiry record.
5. Build a Canvas Power App for staff with:
   - inbox/list view
   - enquiry detail screen
   - status, owner, and notes fields
   - links to Banner and uploaded files
   - button/link to open the Email Drafter with enquiry context
6. Optionally add Power Automate buttons for status changes or notifications.

## How hard is it?

Rough effort once the current workflow is stable:

- Light staff screen: 1-2 days if it only lists enquiries and opens details.
- Useful MVP: 1-2 weeks for status, ownership, attachment links, simple filters, and handover.
- Proper service-desk style build: 3-6 weeks if it needs permissions, audit history, dashboards, SLAs, reporting, and durable governance.

## Storage choice

Use SharePoint List if the department wants a simple, low-admin build.

Use Dataverse if it needs stronger permissions, auditability, relationships, reporting, or to become an official operational system.

## Attachment note

Power Apps can work with attachments, but the attachment control is tied to SharePoint/Microsoft Lists or Dataverse forms. That means the storage model should be designed first, rather than bolted on later.

## Recommendation

Do not build the Power App until version 1 has been tested with real enquiries. The current form, flow, email, and drafter setup is the right prototype. The Power App should be the next layer only after the department agrees the workflow and data fields are right.

## Microsoft references

- Create a canvas app from a SharePoint/Microsoft List: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/app-from-sharepoint
- Power Apps attachment control: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-attachments
- Start a Power Automate flow from a canvas app: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/using-logic-flows
