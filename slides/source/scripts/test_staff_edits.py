"""Regression checks for saved staff copies and conflict-safe master imports."""
import base64
import gzip
import json
from pathlib import Path
import tempfile
import unittest

import staff_edits as editor


DOCUMENT = '''<!doctype html><html><body><section id="intro"><h2>Welcome</h2></section>
<script id="durham-staff-edits" type="application/json">{}</script>
<script id="durham-staff-template" type="application/octet-stream"></script>
<script id="durham-staff-editor-code">/* fixture */</script></body></html>'''


class StaffEditsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.project = Path(self.tmp.name)
        self.output = self.project / 'slides.html'
        self.output.write_text(DOCUMENT, encoding='utf-8')
        editor.pack(self.output, self.project)
        self.store = self.project / 'staff-edits/slides.json'

    def state(self):
        return json.loads(self.store.read_text(encoding='utf-8'))

    def edited_copy(self, text='Welcome — 2026/27'):
        state = self.state()
        state['fields']['intro/h2/1'] = {'before': 'Welcome', 'after': text}
        copy = self.project / 'edited.html'
        copy.write_text(editor.replace_script(self.output.read_text(encoding='utf-8'), editor.STATE_ID, editor.safe_json(state)), encoding='utf-8')
        return copy

    def test_repack_does_not_nest_or_grow(self):
        before = self.output.read_bytes()
        editor.pack(self.output, self.project)
        self.assertEqual(before, self.output.read_bytes())
        document = self.output.read_text(encoding='utf-8')
        payload = document.split('id="durham-staff-template" type="application/octet-stream">')[1].split('</script>')[0]
        pristine = gzip.decompress(base64.b64decode(payload)).decode()
        self.assertIn('id="durham-staff-template" type="application/octet-stream"></script>', pristine)

    def test_import_survives_rebuild_and_is_idempotent(self):
        copy = self.edited_copy()
        editor.import_edits(copy, self.project)
        self.output.write_text(DOCUMENT, encoding='utf-8')
        editor.pack(self.output, self.project)
        parser = editor.StateParser(); parser.feed(self.output.read_text(encoding='utf-8'))
        self.assertEqual(json.loads(''.join(parser.parts))['fields']['intro/h2/1']['after'], 'Welcome — 2026/27')
        before = self.store.read_bytes()
        editor.import_edits(copy, self.project)
        self.assertEqual(before, self.store.read_bytes())

    def test_rejects_stale_staff_copy_without_overwriting(self):
        old = self.edited_copy('First staff copy').read_text(encoding='utf-8')
        editor.import_edits(self.edited_copy('A newer master edit'), self.project)
        copy = self.project / 'stale.html'; copy.write_text(old, encoding='utf-8')
        before = self.store.read_bytes()
        with self.assertRaisesRegex(ValueError, 'newer staff edits'):
            editor.import_edits(copy, self.project)
        self.assertEqual(before, self.store.read_bytes())

    def test_rejects_other_deck_and_escapes_script_termination(self):
        copy = self.edited_copy('</script><script>example</script>')
        self.assertIn('\\u003c/script>', copy.read_text(encoding='utf-8'))
        state = self.state(); state['deck_id'] = 'other-deck'
        copy.write_text(editor.replace_script(DOCUMENT, editor.STATE_ID, editor.safe_json(state)), encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'match exactly one deck'):
            editor.import_edits(copy, self.project)


if __name__ == '__main__':
    unittest.main()
