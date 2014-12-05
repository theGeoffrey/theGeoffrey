import treq


class CouchdbConnection(object):

    def __init__(self, database, user=None, password=None,
                 base_url="http://localhost:5984"):

        self.auth = None
        if user:
            self.auth = (user, password)

        if not base_url.endswith('/'):
            base_url += "/"

        self.url = base_url + database

    def _parse_response(self, response, expect_ok=False, accepted_codes=[200, 201]):
        assert response.code in accepted_codes, "Error in response:{}".format(response.code)

        def _is_ok(content):
            assert content["ok"]
            return content

        dfr = response.json()
        if expect_ok:
            dfr.addCallback(_is_ok)
        return dfr

    def _update_kwargs(self, kwargs):
        if self.auth:
            if not 'auth' in kwargs:
                kwargs['auth'] = self.auth

        headers = kwargs.get('headers', {})
        headers.update({'Content-Type': ['application/json']})
        kwargs['headers'] = headers
        return kwargs

    def get(self, document="", **kwargs):
        return treq.get("{}/{}".format(self.url, document),
                        **self._update_kwargs(kwargs)
                        ).addCallback(self._parse_response)

    def post(self, document="", **kwargs):
        return treq.post("{}/{}".format(self.url, document),
                         **self._update_kwargs(kwargs)
                         ).addCallback(self._parse_response, expect_ok=True)

    def put(self, document="", **kwargs):
        return treq.put("{}/{}".format(self.url, document),
                        **self._update_kwargs(kwargs)
                        ).addCallback(self._parse_response, expect_ok=True)

    def delete(self, document="", *args, **kwargs):
        return treq.delete("{}/{}".format(self.url, document),
                           **self._update_kwargs(kwargs)
                           ).addCallback(self._parse_response)