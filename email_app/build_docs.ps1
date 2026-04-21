$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$docs = @(
  @{ In = 'START_HERE.md'; Out = 'START_HERE.html'; Css = 'styles.css' },
  @{ In = 'simple_setup_steps.md'; Out = 'simple_setup_steps.html'; Css = 'styles.css' },
  @{ In = 'student_enquiry_workflow_spec.md'; Out = 'student_enquiry_workflow_spec.html'; Css = 'styles.css' },
  @{ In = 'build_plan.md'; Out = 'build_plan.html'; Css = 'styles.css' },
  @{ In = 'flows/version_1_flow_logic.md'; Out = 'flows/version_1_flow_logic.html'; Css = '../styles.css' },
  @{ In = 'flows/power_automate_expressions.md'; Out = 'flows/power_automate_expressions.html'; Css = '../styles.css' },
  @{ In = 'templates/microsoft_form_questions.md'; Out = 'templates/microsoft_form_questions.html'; Css = '../styles.css' }
)

foreach ($doc in $docs) {
  & pandoc $doc.In -s -c $doc.Css -o $doc.Out
}

& pandoc templates/student_enquiry_form_import.md -o templates/student_enquiry_form_import.docx
& pandoc templates/student_enquiry_form_import.md -s -c styles.css -o templates/student_enquiry_form_import.pdf --pdf-engine=pdflatex
& pandoc templates/microsoft_form_questions.md -o templates/microsoft_form_questions.docx

@'
import csv
from pathlib import Path
from openpyxl import Workbook
from openpyxl.worksheet.table import Table, TableStyleInfo

root = Path(r".")
csv_path = root / "templates" / "student_lookup_schema.csv"
xlsx_path = root / "templates" / "student_lookup_template.xlsx"

with csv_path.open(newline="", encoding="utf-8") as f:
    rows = list(csv.reader(f))

wb = Workbook()
ws = wb.active
ws.title = "Lookup"

for row in rows:
    ws.append(row)

end_col = chr(ord("A") + len(rows[0]) - 1)
end_row = len(rows)
table = Table(displayName="StudentLookup", ref=f"A1:{end_col}{end_row}")
style = TableStyleInfo(
    name="TableStyleMedium2",
    showFirstColumn=False,
    showLastColumn=False,
    showRowStripes=True,
    showColumnStripes=False,
)
table.tableStyleInfo = style
ws.add_table(table)

for column_cells in ws.columns:
    max_length = max(len(str(cell.value or "")) for cell in column_cells)
    ws.column_dimensions[column_cells[0].column_letter].width = min(max_length + 2, 40)

wb.save(xlsx_path)
'@ | python -

& pandoc START_HERE.md -s -c styles.css -o START_HERE.pdf --pdf-engine=pdflatex
