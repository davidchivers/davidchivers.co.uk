"""Recount two public PDF tables without exporting historical inventory rows."""

import argparse
import hashlib
import io
import json
from pathlib import Path

import pdfplumber


EXPECTED_SHA256 = "c27d3c35b6f368d0623732837819995e0d38f797e8a20ce62c77dd1ece46e303"
EXPECTED_PAGES = 139


def count_unknown_rows(tables):
    candidates = []
    for table in tables:
        if not table or len(table[0]) != 3:
            continue
        header = [" ".join((cell or "").split()) for cell in table[0]]
        if header != ["County", "Green Book Name", "Address"]:
            continue
        if any(len(row) != 3 or any(not str(cell or "").strip() for cell in row)
               for row in table[1:]):
            raise ValueError("Malformed inventory table; inspect source visually")
        candidates.append(len(table) - 1)
    if len(candidates) != 1:
        raise ValueError("Expected one unknown-status table on the inspected page")
    return candidates[0]


def audit(pdf_bytes):
    digest = hashlib.sha256(pdf_bytes).hexdigest()
    if digest != EXPECTED_SHA256:
        raise ValueError("Public PDF changed; no silent transfer of page rules")
    # Read and hash the same immutable byte snapshot, not separate file opens.
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as document:
        if len(document.pages) != EXPECTED_PAGES:
            raise ValueError("Unexpected page census")
        counts = {str(page): count_unknown_rows(document.pages[page - 1].extract_tables())
                  for page in (124, 125)}
    return {
        "stage": "public_document_consistency_check_not_inventory_validation",
        "source_url": "https://www.hpo.nc.gov/survey-and-national-register/green-book-mpdf/open",
        "source_sha256": digest,
        "source_bytes": len(pdf_bytes),
        "source_pages": EXPECTED_PAGES,
        "parser": "pdfplumber",
        "parser_version": pdfplumber.__version__,
        "physical_pages_counted": [124, 125],
        "unknown_table_printed_rows_by_page": counts,
        "unknown_table_printed_rows_total": sum(counts.values()),
        "source_stated_unknown_total": 28,
        "source_stated_total_location": "PDF pp.101,117,124; visually checked",
        "not_a_corrected_resource_count": True,
        "no_inventory_rows_exported": True,
        "restricted_data_accessed": False,
        "interpretation": "Printed-row count disagrees with stated total. Identity, duplicates and correct historical denominator are unresolved.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    result = audit(args.pdf.read_bytes())
    result["verifier_sha256"] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
