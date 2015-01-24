
from base_mixin import ServerTestMixin

from unittest import TestCase


class SmokeTest(ServerTestMixin, TestCase):

    def test_ping(self):
        return self._make_request('/ping', _append_api_key=True)
