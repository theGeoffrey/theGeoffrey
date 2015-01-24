import treq


class CouchdbConnectionError(Exception):
    pass


class CouchdbConnection(object):

    def __init__(self, database, user=None, password=None,
                 base_url="http://localhost:5984", defaults=None):

        self.auth = None
        self.defaults = defaults or dict()
        self.db_name = database
        if user:
            self.auth = (user, password)

        if not base_url.endswith('/'):
            base_url += "/"

        self.url = base_url + database

    def _parse_response(self, response, expect_ok=False,
                        accepted_codes=[200, 201],
                        _method=None, _document=None):

        def render_error(err_data):
            msg = "Error {} when trying to {} {}: {}"
            raise CouchdbConnectionError(msg.format(response.code,
                                                    _method, _document,
                                                    err_data))

        if response.code not in accepted_codes:
            return response.text().addCallback(render_error)

        def _is_ok(content):
            assert content["ok"]
            return content

        dfr = response.json()
        if expect_ok:
            dfr.addCallback(_is_ok)
        return dfr

    def _update_kwargs(self, args):
        kwargs = self.defaults.copy()
        kwargs.update(args)
        if self.auth:
            if not 'auth' in kwargs:
                kwargs['auth'] = self.auth

        headers = kwargs.get('headers', {})
        headers.update({'Content-Type': ['application/json']})
        kwargs['headers'] = headers
        return kwargs

    def createDB(self, **kwargs):
        return treq.put(self.url, **self._update_kwargs(kwargs)
                        ).addCallback(self._parse_response, expect_ok=True)

    def deleteDB(self, **kwargs):
        return treq.delete(self.url, **self._update_kwargs(kwargs)
                           ).addCallback(self._parse_response, expect_ok=True)

    def get(self, document="", **kwargs):
        return self.raw_get(document, **kwargs
                            ).addCallback(self._parse_response,
                                          _method="GET",
                                          _document=document)

    def raw_get(self, document="", **kwargs):
        return treq.get("{}/{}".format(self.url, document),
                        **self._update_kwargs(kwargs)
                        )

    def post(self, document="", **kwargs):
        return self.raw_post(document, **kwargs
                             ).addCallback(self._parse_response,
                                           expect_ok=True,
                                           _method="POST",
                                           _document=document)

    def raw_post(self, document="", **kwargs):
        return treq.post("{}/{}".format(self.url, document),
                         **self._update_kwargs(kwargs))

    def put(self, document="", **kwargs):
        return self.raw_put(document, **kwargs
                            ).addCallback(self._parse_response,
                                          expect_ok=True,
                                          _method="PUT",
                                          _document=document)

    def raw_put(self, document, **kwargs):
        return treq.put("{}/{}".format(self.url, document),
                        **self._update_kwargs(kwargs))

    def delete(self, document="", **kwargs):
        return self.raw_delete(document, **kwargs
                               ).addCallback(self._parse_response,
                                             _method="DELETE",
                                             _document=document)

    def raw_delete(self, document, **kwargs):
        return treq.delete("{}/{}".format(self.url, document),
                           **self._update_kwargs(kwargs)
                           )

    def infoDB(self):
        return self.get('', params={"descr": 'infoDB'})
