import unittest

from check_publishing_setup import REPOSITORY, validate_context, validate_pages


class PublishingSetupTests(unittest.TestCase):
    def setUp(self):
        self.pages = {
            'cname': 'davidchivers.co.uk',
            'build_type': 'workflow',
            'protected_domain_state': 'verified',
            'https_enforced': True,
            'source': {'branch': 'main', 'path': '/'},
        }

    def test_current_setup_is_accepted(self):
        validate_context(REPOSITORY, 'refs/heads/main')
        validate_pages(self.pages)

    def test_other_repository_branch_or_tag_cannot_publish(self):
        for repository, ref in [
            ('another-owner/another-site', 'refs/heads/main'),
            (REPOSITORY, 'refs/heads/preview'),
            (REPOSITORY, 'refs/tags/main'),
            (None, None),
        ]:
            with self.subTest(repository=repository, ref=ref), self.assertRaises(ValueError):
                validate_context(repository, ref)

    def test_lost_domain_or_changed_hosting_cannot_deploy(self):
        for key, value in [
            ('cname', None),
            ('cname', 'another-site.example'),
            ('build_type', 'legacy'),
            ('protected_domain_state', 'unverified'),
            ('https_enforced', False),
            ('source', {'branch': 'gh-pages', 'path': '/'}),
            ('source', {'branch': 'main', 'path': '/docs'}),
        ]:
            with self.subTest(key=key, value=value), self.assertRaises(ValueError):
                validate_pages({**self.pages, key: value})

    def test_missing_configuration_fails_closed(self):
        for key in self.pages:
            with self.subTest(key=key), self.assertRaises(ValueError):
                validate_pages({k: v for k, v in self.pages.items() if k != key})


if __name__ == '__main__':
    unittest.main()
