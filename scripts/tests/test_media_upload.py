import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('uploader', Path(__file__).parents[1] / 'media_upload.py')
uploader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(uploader)


class UploadTests(unittest.TestCase):
    def test_quota_boundary(self):
        uploader.check_quota(uploader.MAX_STORAGE - 1, 1)
        with self.assertRaises(ValueError):
            uploader.check_quota(uploader.MAX_STORAGE, 1)

    def test_pagination_counts_every_page(self):
        pages = {
            None: {'result': [{'key': 'a', 'size': 10}], 'result_info': {'cursor': 'next', 'is_truncated': True}},
            'next': {'result': [{'key': 'b', 'size': 20}]},
        }
        self.assertEqual(uploader.inventory(pages.__getitem__), (30, {'a', 'b'}))

    def test_ambiguous_listing_fails_closed(self):
        bad_pages = [
            {'result': [], 'result_info': {'is_truncated': True}},
            {'result': [{'key': 'x', 'size': -1}]},
            {'result': [{'key': 'x', 'size': 1}, {'key': 'x', 'size': 1}]},
            {'result': {}},
            {'result': [{'key': 'x', 'size': 1}], 'result_info': {'per_page': 1}},
            {'result': [], 'result_info': {'delimited': ['hidden/']}},
        ]
        for page in bad_pages:
            with self.subTest(page=page), self.assertRaises(ValueError):
                uploader.inventory(lambda _cursor: page)

    def test_looping_cursor_fails_closed(self):
        with self.assertRaises(ValueError):
            uploader.inventory(lambda _: {'result': [], 'result_info': {'cursor': 'same'}})

    def test_type_signature_and_size(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'test.mp3'
            path.write_bytes(b'ID3test')
            self.assertEqual(uploader.validate(path), (7, 'audio', 'audio/mpeg'))
            path.write_bytes(b'not an mp3')
            with self.assertRaises(ValueError):
                uploader.validate(path)
            path.write_bytes(b'')
            with self.assertRaises(ValueError):
                uploader.validate(path)
            with path.open('wb') as f:
                f.truncate(uploader.MAX_FILE + 1)
            with self.assertRaises(ValueError):
                uploader.validate(path)

    def test_local_lock_rejects_second_uploader(self):
        with uploader.upload_lock():
            with self.assertRaises(ValueError):
                with uploader.upload_lock():
                    pass

    def test_upload_and_dry_run_keep_publication_separate(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / 'test.mp3'
            source.write_bytes(b'ID3test')
            manifest = root / 'creative.json'
            worker = root / 'worker'
            with patch.object(uploader, 'MANIFEST', manifest), patch.object(uploader, 'WORKER', worker), patch.object(uploader, 'inventory', return_value=(0, set())), patch.object(uploader.subprocess, 'run') as upload:
                argv = ['upload', str(source), '--title', 'Test']
                with patch.object(uploader.sys, 'argv', argv + ['--dry-run']):
                    uploader.main()
                upload.assert_not_called()
                self.assertFalse(manifest.exists())
                with patch.object(uploader.sys, 'argv', argv):
                    uploader.main()
                upload.assert_called_once()
                self.assertTrue(manifest.exists())
                self.assertFalse((worker / 'src/assets.json').exists())
                with patch.object(uploader.sys, 'argv', ['upload', '--prepare-publish']):
                    uploader.main()
                self.assertTrue((worker / 'src/assets.json').exists())
                upload.assert_called_once()  # Preparing publication never deploys.

    def test_atomic_metadata(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'data.json'
            uploader.save_json(path, [{'title': 'First'}])
            uploader.save_json(path, [{'title': 'Second'}])
            self.assertEqual(uploader.json.loads(path.read_text()), [{'title': 'Second'}])


if __name__ == '__main__':
    unittest.main()
