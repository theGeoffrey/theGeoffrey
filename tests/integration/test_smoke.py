
from base_mixin import ServerTestMixin, deferred

from unittest import TestCase


class TestSmokeTest(ServerTestMixin, TestCase):

    @deferred(timeout=5.0)
    def test_ping(self):
        return self._make_request('/ping', _append_api_key=True)
