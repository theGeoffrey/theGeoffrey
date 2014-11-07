from geoffrey.utils import get_params, MisConfiguredError

from unittest import TestCase


class TestGetParamsHelper(TestCase):

    def test_list_getter(self):

        self.assertEquals(get_params({"a": 0, "b": 5, "d": 8}, "a", "b"), (0, 5))

        self.assertEquals(get_params({"app": {
            "mailchimp": {
                "api_key": "ABCDE"
                }
            }}, "app.mailchimp.api_key"), tuple(['ABCDE']))

        # self.assertEquals(get_params({"app" : {
        #         "mailchimp": {"api_key": "ABS"},
        #         "twitter": {"a" : "b", "b" : "c"}
        #         }
        #     }, "app.mailchimp.api_key", "twitter"),
        #     ("ABS", {"a": "b", "b": "c"}))

    # def test_fails_properly(self):
    #     self.assertRaises(MisConfiguredError, get_params, {"app": {
    #         "mailchimp": {
    #             "apiKey": "jop"
    #             }
    #         }}, "app.mailchimp.api_key")

    #     self.assertRaises(MisConfiguredError, get_params, {"app": {
    #         "mailchimp": {
    #             "api_key": "ABCDE"
    #             }
    #         }}, "app.mailchimp.api_key", "error.not_found")

    # def test_dict_getter(self):
    #     self.assertEquals(get_params({
    #                         "services": {
    #                             "twitter": {"a" : "b"}
    #                             },
    #                         "domain": "opentechschool.org"
    #                         },
    #                         domain="domain",
    #                         twitter_key="services.twitter.a"),
    #         {"domain": "opentechschool.org", "twitter_key": "b"})


