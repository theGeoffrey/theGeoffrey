from geoffrey.config import CONFIG
from geoffrey.couchdb_connection import CouchdbConnection

import json


def get_db_master_config():
    return dict(user=CONFIG.COUCH_USER,
                password=CONFIG.COUCH_PASSWORD,
                url="http://" + CONFIG.COUCHDB_DOMAIN)


def get_database_connection(db, user=None, password=None, base_url=None):
    return CouchdbConnection(db, user=user or CONFIG.COUCH_USER,
                             password=password or CONFIG.COUCH_PASSWORD,
                             base_url=base_url or "http://" + CONFIG.COUCHDB_DOMAIN)


# Decorators

def with_config_environment(func):
    """
    Decorates the function `func` to load the database as given as
    first parameter when called. Adds (and overwrites) the following
    keywords when calling the function:

      - clientLogger: instance of CouchDBLogger for the database
      - dbclient: Database Client instance for the db (admin access)
      - config: the Main-Config of this database
    """

    # logger imports this module, keep this import here
    from geoffrey.logger import CouchdbLogger

    def wrapped(db_name, *args, **kwargs):
        kwargs['clientLogger'] = CouchdbLogger({'database': db_name})
        client = kwargs['dbclient'] = get_database_connection(db_name)

        def _callback(config):
            return func(*args, config=config, **kwargs)

        return client.get('CONFIG').addCallback(_callback)

    wrapped.func_name = func.func_name
    return wrapped


def with_state(docName=None):
    """
    Decorator to load and store a state document for the given function.
    Best used in combination with `with_config_environment` as this expects
    a database connection as keyword argument `dbclient`.

    @docName: the state document to load. If the document isn't found on the
              database, this function creates it and returns the newly create
              document. Can not start with an Undercore or CouchDB will reject
              it.

    If the function returns the same state object received previously, the
    wrapper will try to store it back to the database. This is not
    transaction-save.


    Example::

        @with_config_environment
        @with_state('STATE_TWITTER_MENTIONS_RECENT')
        def stateful_example_client(state, **kwargs):
            "this function will increase the client_id by one"
            print state
            client_state = state.get('client_id', 0)
            print client_state
            state['client_id'] = client_state +1
            return state


    """
    def state_wrap(func):
        doc = docName or "STATE_{}".format(func.func_name)

        def wrapped(*args, **kwargs):
            assert 'dbclient' in kwargs, 'You need to pass a dbclient!'
            client = kwargs['dbclient']

            def recommit_result(result):
                if isinstance(result, dict) and \
                   result.get("_id", None) == doc:
                    return client.put(doc, data=json.dumps(result))
                return result

            def create_doc(err):
                payload = '{{"_id": "{}"}}'.format(doc)
                return client.put(doc, data=payload)

            dfr = client.get(doc)
            dfr.addErrback(create_doc)
            dfr.addCallback(lambda state: func(state=state, *args, **kwargs))
            dfr.addCallback(recommit_result)
            return dfr

        wrapped.func_name = func.func_name
        return wrapped

    return state_wrap
