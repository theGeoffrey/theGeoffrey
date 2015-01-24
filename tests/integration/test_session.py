
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
            url = '/session/{}/{}/confirm'

            return self._make_request(url.format(self.get_public_key(),
                                                 session_id), params=payload
                                      ).addCallback(confirm_true)

        def check_session_attributes(session):
            self.assertNotIn("permanent", session)
            self.assertIn("valid_until", session)
            return session['_id']

        def check(result):
            self.assertEquals(result['success'], True)
            self.assertIn("id", result)

            return result['id']

        dfr = self._make_request('/session/create?',
                                 method='POST',
                                 data=json.dumps(payload),
                                 _is_json=True, _append_api_key=True)
        dfr.addCallback(check)
        dfr.addCallback(self.get_document)
        dfr.addCallback(check_session_attributes)
        dfr.addCallback(confirm)
        return dfr

    @deferred(timeout=5.0)
    def test_session_permanent_creation_and_query(self):
        payload = {'username': 'michael@two', "permanent": True, "chatname": 1234}

        def confirm_true(res):
            self.assertEquals(res, "true")

        def confirm(session_id):
            url = '/session/{}/{}/confirm'

            return self._make_request(url.format(self.get_public_key(),
                                                 session_id), params=payload
                                      ).addCallback(confirm_true)

        def check_session_attributes(session):
            self.assertTrue(session["permanent"])
            self.assertNotIn("valid_until", session)
            return session['_id']

        def check(result):
            self.assertEquals(result['success'], True)
            self.assertIn("id", result)

            return result['id']

        dfr = self._make_request('/session/create?',
                                 method='POST',
                                 data=json.dumps(payload),
                                 _is_json=True, _append_api_key=True)
        dfr.addCallback(check)
        dfr.addCallback(self.get_document)
        dfr.addCallback(check_session_attributes)
        dfr.addCallback(confirm)
        return dfr

    @deferred(timeout=5.0)
    def test_session_without_username_fails(self):
        payload = {"somestate": "asd", "chatname": 1234}

        return self._make_request('/session/create?',
                                  method='POST',
                                  data=json.dumps(payload),
                                  _accepted_codes=[400],
                                  # we expect a 400 Error
                                  _is_json=False, _append_api_key=True)

    @deferred(timeout=5.0)
    def test_session_try_evil_attr(self):
        payload = {"_id": "test", "username": "asd", "chatname": 1234}

        return self._make_request('/session/create?',
                                  method='POST',
                                  data=json.dumps(payload),
                                  _accepted_codes=[400],
                                  # we expect a 400 Error
                                  _is_json=False, _append_api_key=True)
