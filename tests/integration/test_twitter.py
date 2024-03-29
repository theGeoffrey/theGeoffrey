from base_mixin import IntegrationTestMixin, deferred
from unittest import TestCase
from geoffrey.services.twitter import TwitterClient

import os


class TestTweet(IntegrationTestMixin, TestCase):

    ENVIRONMENT_KEYS = IntegrationTestMixin.ENVIRONMENT_KEYS + ["TWITTER_KEY"] + ["TWITTER_SECRET"] + ["TWEET"]

    def setUp(self):
        key = os.environ.get('KEY')
        secret = os.environ.get('SECRET')
        self.client = TwitterClient(key, secret)
        self.tweet = os.environ.get('TWEET')

    @deferred(timeout=5.0)
    def test_tweet(self):
        return self.client.post_tweet(self.tweet, '/xyz', 'new topic', persistent=False)


    # @classmethod
    # def tearDownClass(cls):
    # 	treq.close_all_connections()


class TestMentions(IntegrationTestMixin, TestCase):

    ENVIRONMENT_KEYS = IntegrationTestMixin.ENVIRONMENT_KEYS + ["TWITTER_KEY"] + ["TWITTER_SECRET"] + ["COUNT"]

    def setUp(self):
        key = os.environ.get('KEY')
        secret = os.environ.get('SECRET')
        self.client = TwitterClient(key, secret)
        self.count = os.environ.get('COUNT')

    def test_mention(self):
        return self.client.get_mentions(self.count)

