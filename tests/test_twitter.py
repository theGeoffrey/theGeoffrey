from base_mixin import IntegrationTestMixin
from unittest import TestCase


class TestGetParamsHelper(IntegrationTestMixin, TestCase):

    ENVIRONMENT_KEYS = IntegrationTestMixin.ENVIRONMENT_KEYS + ["TWITTER_USER"]

    def test_fetch(self):
        # just a test case
        self.assertEquals(False, 1, "No, it doesn't")
