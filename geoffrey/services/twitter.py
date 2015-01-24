from twisted.python import log
from twisted.web.http_headers import Headers

import logging
import treq
import json
from urllib import urlencode
from oauthlib import oauth1

TWITTER_API_URL = 'https://api.twitter.com/1.1/{}.json'
TWITTER_STREAM_URL = 'https://stream.twitter.com/1.1/'
TWITTER_USERSTREAM_URL = 'https://userstream.twitter.com/1.1/'

logger = logging.getLogger("Services:Twitter")

TWITTER_CKEY = "rbZIlETSTqBJ7D69IU1lFhgRh"
TWITTER_CSECRET = "18XZ59n4fDHHtlvc2jrWPjOYLLpOLLNvxnbPJJjbY7RSv6ao3t"


class TwitterApiError(Exception):
    pass


class TwitterConfigError(Exception):
    pass


class TwitterClient(object):

    def __init__(self, token_key, token_secret, consumer_key=TWITTER_CKEY,
                 consumer_secret=TWITTER_CSECRET,
                 api_url=TWITTER_API_URL):
        self._token_key = token_key
        self._token_secret = token_secret
        self._consumer_key = consumer_key
        self._consumer_secret = consumer_secret
        self._api_url = api_url

    def request(self, http_method, uri, payload={}, **kwargs):
        def _raise_error(txt):
            logger.info("ERROR: %s", txt)
            raise TwitterApiError(txt)

        def _read_response(response):
            logger.info("Received Data: {}: {}".format(response.code, response.text))
            if response.code != 200:
                return response.text().addCallback(_raise_error)

            return treq.text_content(response).addCallback(json.loads)

        body = urlencode(payload)
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        client = oauth1.Client(self._consumer_key,
                               client_secret=self._consumer_secret,
                               resource_owner_key=self._token_key,
                               resource_owner_secret=self._token_secret,
                               encoding='utf-8',
                               decoding='utf-8')
        url = TWITTER_API_URL.format(uri)
        uri, headers, body = client.sign(url, http_method=http_method,
                                         headers=headers, body=body)

        dfr = treq.request(http_method, url, headers=headers,
                           data=body, **kwargs)

        return dfr.addCallback(_read_response)

    def post_tweet(self, message, link, title=None, **kwargs):
        def _create_tweet(message, link, title):
            count = 120 - len(message)
            tweet = "{} {} {}".format(message, title[:count], link)
            return tweet

        if title:
            tweet = _create_tweet(message, link, title)
        else:
            tweet = "{} {}".format(message, link)

        return self.request('POST', 'statuses/update',
                            {"status": tweet.encode('utf8')}, **kwargs)
