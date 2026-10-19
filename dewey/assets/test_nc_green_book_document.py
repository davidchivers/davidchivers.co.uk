"""Tests of the bounded public-document count, not historical truth."""

import unittest

from verify_nc_green_book_document import audit, count_unknown_rows


HEADER = ["County", "Green Book Name", "Address"]


class DocumentCountTests(unittest.TestCase):
    def test_header_not_counted(self):
        self.assertEqual(count_unknown_rows([[HEADER, ["A", "B", "C"]]]), 1)

    def test_wrapped_header(self):
        self.assertEqual(count_unknown_rows([[["County", "Green Book\nName", "Address"],
                                             ["A", "B", "C"]]]), 1)

    def test_other_tables_ignored(self):
        self.assertEqual(count_unknown_rows([[["Other", "Header"]], [HEADER]]), 0)

    def test_missing_table_rejected(self):
        with self.assertRaises(ValueError):
            count_unknown_rows([])

    def test_ambiguous_table_rejected(self):
        with self.assertRaises(ValueError):
            count_unknown_rows([[HEADER], [HEADER]])

    def test_missing_or_extra_cells_rejected(self):
        for row in (["A", "B"], ["A", "B", "C", "D"], ["A", None, "C"],
                    ["A", " ", "C"]):
            with self.subTest(row=row), self.assertRaises(ValueError):
                count_unknown_rows([[HEADER, row]])

    def test_changed_source_rejected_before_pdf_parse(self):
        with self.assertRaisesRegex(ValueError, "PDF changed"):
            audit(b"not the inspected source")


if __name__ == "__main__":
    unittest.main()
