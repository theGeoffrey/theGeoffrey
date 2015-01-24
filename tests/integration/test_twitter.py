from base_mixin import IntegrationTestMixin, deferred
from unittest import TestCase
from geoffrey.services.twitter import TwitterClient

import os


class TestTweet(IntegrationTestMixin, TestCase):

    ENVIRONMENT_KEYS = IntegrationTestMixin.ENVIRONMENT_KEYS + ["KEY"] + ["SECRET"] + ["TWEET"]

    def setUp(self):
        key = os.environ.get('KEY')
        secret = os.environ.get('SECRET')
        self.client = TwitterClient(key, secret)
        self.tweet = os.environ.get('TWEET')

    @deferred(timeout=5.0)
    def test_tweet(self):
        return self.client.post_tweet(self.tweet, '/xyz', 'new topic', persitent=False)
