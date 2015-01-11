from geoffrey import config
from geoffrey.utils import get_params

import logging
import treq
import json
import time
import random


logger = logging.getLogger("Services:Twitter")
TWITTER_BASE_URL = "https://api.twitter.com/1.1/{}.json"
TWITTER_TOKEN = ""
TWITTER_SECRET = ""
TWITTER_VERSION = "1.0"
TWITTER_SIGN_METHOD = "HMAC-SHA1"


class TwitterApiError(Exception):
    pass


class TwitterConfigError(Exception):
    pass


def _query_twitter(ckey, csecret, timestamp, nonce, signature, method, payload):

    def _read_response(response):
        logger.info("Received Data: %s", response)
        if response.code != 200:
            logger.info("Received Data with error")
            raise TwitterApiError("{}".format(response.phrase))

        return treq.text_content(response).addCallback(json.loads)

    def _check_for_error(response):
        logger.info("Received Data: %s", response)
        if "error" in response:
            raise TwitterApiError("{}:{}".format(response["name"],
                                                 response["error"]))
        return response

    logger.info("STARTING QUERY TWITTER WITH PAYLOAD {}".format(payload))

    dfr = treq.request("POST",
                       TWITTER_BASE_URL.format(method).encode("utf-8"),
                       data=json.dumps(payload),
                       headers={"Content-Type": "application/json",
                                "Authorization": "OAUTH",
                                "oauth_consumer_key": ckey,
                                "oauth_token": TWITTER_TOKEN,
                                "oauth_nonce": nonce,
                                "oauth_version": TWITTER_VERSION,
                                "oauth_signature_method": TWITTER_SIGN_METHOD,
                                "oauth_timestamp": timestamp,
                                "oauth_signature": signature})

    return dfr.addCallback(_read_response).addCallback(_check_for_error)


def post_tweet(ckey, csecret, message, link, title=None):

    def _create_tweet(message, link, title):
        count = 120 - len(message)
        tweet = "{} {} {}".format(message, title[:count], link)
        return tweet

    timestamp = time.time()
    nonce = int(random.random()*80000000)

    if title:
        tweet = _create_tweet(message, link, title)
    else:
        tweet = "{} {}".format(message, link)


    return _query_twitter(key, secret, timestamp, nonce,
                          _get_signature(ckey, tweet,
                                         timestamp, nonce),
                          'statuses/update',
                          {"status": tweet.encode("utf-8")})


    def _get_signature(ckey, tweet, timestamp, nonce):
        return ""
