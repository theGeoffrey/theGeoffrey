
from base_mixin import ServerTestMixin, deferred

from unittest import TestCase

import json


class TestSession(ServerTestMixin, TestCase):

    @deferred(timeout=5.0)
    def test_session_creation_and_query(self):
        payload = {'username': 'michael super star',
                   "chatname": 1234}

        def confirm_true(res):
            self.assertEquals(res, "true")

        def confirm(session_id):
            url = '/session/{}/{}/confirm/username/michael%20super%20star'

            return self._make_request(url.format(self._get_public_key(),
                                                 session_id)
                                      ).addCallback(confirm_true)

        def check(result):
            self.assertEquals(result['success'], True)
            self.assertIn("id", result)

            return result['id']

        dfr = self._make_request('/session/create?',
                                 method='POST',
                                 data=json.dumps(payload),
                                 _is_json=True, _append_api_key=True)
        dfr.addCallback(check)
        dfr.addCallback(confirm)
        return dfr
