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


def _create_url(self, method, params=None):
        url_string = TWITTER_API_URL.format(method)
        if params:
            for param in params:
                url_string += '?{}'.format(param)
        logger.info("HELLO URL: {}".format(url_string))
        return 'https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=2'


class TwitterClient(object):

    def __init__(self, token_key, token_secret, consumer_key=TWITTER_CKEY,
                 consumer_secret=TWITTER_CSECRET,
                 api_url=TWITTER_API_URL):
        self._token_key = token_key
        self._token_secret = token_secret
        self._consumer_key = consumer_key
        self._consumer_secret = consumer_secret
        self._api_url = api_url

    def _oauth_client(self):
        return oauth1.Client(self._consumer_key,
                             client_secret=self._consumer_secret,
                             resource_owner_key=self._token_key,
                             resource_owner_secret=self._token_secret,
                             encoding='utf-8',
                             decoding='utf-8')
   
    def _request(self, http_method, url, payload=None):
        def _raise_error(txt):
            logger.info("ERROR: %s", txt)
            raise TwitterApiError(txt)

        def _print_response(response):
            logger.info("RESPONSE: ", response)
            return response

        def _read_response(response):
            if response.code != 200:
                return response.text().addCallback(_raise_error)

            return treq.content().addCallback(json.loads)

        headers = {}
        body = None
        client = self._oauth_client()

        if payload:
            body = urlencode(payload)
            headers = {'Content-Type': 'application/x-www-form-urlencoded'}

        xx, headers, body = client.sign(url, http_method=http_method,
                                        headers=headers, body=body)

        dfr = treq.request(http_method, url, headers=headers,
                           data=body)

        return dfr.addCallback(_read_response)

    def post_tweet(self, message, link, title=None):
        def _create_tweet(message, link, title):
            count = 120 - len(message)
            tweet = "{} {} {}".format(message, title[:count], link)
            return tweet

        if title:
            tweet = _create_tweet(message, link, title)
        else:
            tweet = "{} {}".format(message, link)

        return self._request('POST', _create_url('statuses/update'),
                             {"status": tweet.encode('utf8')})

    def get_mentions(self, count, since_id=None):
        def parse_mentions(mentions):
            #Get the tweet, sender username, sender link, date per tweet
            return mentions
        
        def f(x=None):
            return x if x is not None

        params = [count, since_id]
        params = (filter f, params)

        count = 'count={}'.format(count) if count
        since_id = 'since_id={}'.format(since_id) if since_id 
        params.append(count, since_id)

        return self._request('GET', _create_url('statuses/mentions_timeline', params)).addCallback(parse_mentions)
