from base_mixin import IntegrationTestMixin
import logging
from twisted.trial.unittest import TestCase
from geoffrey.services.twitter import TwitterClient
import os
from twisted.internet.base import DelayedCall
DelayedCall.debug = True

logger = logging.getLogger("TEST_TwitterAPI")


class TestTweet(IntegrationTestMixin, TestCase):

    ENVIRONMENT_KEYS = IntegrationTestMixin.ENVIRONMENT_KEYS + ["KEY"] + ["SECRET"] + ["TWEET"]

    def setUp(self):
        key = os.environ.get('KEY')
        secret = os.environ.get('SECRET')
        self.client = TwitterClient(key, secret)
        self.tweet = os.environ.get('TWEET')

    def test_tweet(self):
        return self.client.post_tweet(self.tweet, '/xyz', 'new topic')
