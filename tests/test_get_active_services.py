from geoffrey.utils import get_active_services_for_api
from tasks import add_user_to_mailchimp as chimpy
from unittest import TestCase


class TestAddUserApiCall(TestCase):

    def test_find_active_services(self):

        res = get_active_services_for_api({"api-key": "yaya"},
                                          "add_user", "tasks")

        self.assertEquals([chimpy], [func for func in res])
