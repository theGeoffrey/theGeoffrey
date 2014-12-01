from twisted.internet import defer
from geoffrey import config
from geoffrey.utils import get_params

import logging
import treq
import json

logger = logging.getLogger("Services:Discourse")


class DiscourseApiError(Exception):
    pass


class DiscourseConfigError(Exception):
    pass

from pprint import pprint

class DiscourseClient(object):
    def __init__(self, dc_host, dc_key, dc_username):
        self.host = dc_host
        self.api_key = dc_key
        self.api_username = dc_username

    def request(self, request_type, method, payload={}):
        def _read_response(response):
            logger.info("Received Data: %s", response)
            if response.code != 200:
                raise DiscourseApiError("{}".format(response.phrase))

            return response.content().addCallback(lambda x: pprint(x))

        payload.update(dict(api_key=self.api_key,
                            api_username=self.api_username))

        dfr = treq.request(request_type, "{}{}".format(self.host, method),
                           params=payload,
                           headers={"Content-Type": "application/json"})

        return dfr.addCallback(_read_response)


def create_topic(dc_host, dc_key, dc_username, title, topic_body,
                 category='general', skip_val=True, auto_track=False):

    client = DiscourseClient(dc_host, dc_key, dc_username)

    return client.request('POST', '/posts', {'title': title,
                                             'raw': topic_body,
                                             'category': category,
                                             'auto_track': auto_track,
                                             'skip_validations': skip_val})


def ping_dc(dc_host, dc_key, dc_username):
    client = DiscourseClient(dc_host, dc_key, dc_username)
    return client.request('GET', '/latest.json')
