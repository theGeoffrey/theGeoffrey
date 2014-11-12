from geoffrey.utils import get_active_services_for_api
from geoffrey.tasks import mailchimp_subscribe as chimpy
from unittest import TestCase
from geoffrey import tasks


class TestAddUserApiCall(TestCase):

    def test_find_active_services(self):
        config = {"api_key": "mykey",
                  "enabled_services": ["mailchimp_subscribe"]}

        res = get_active_services_for_api(config,
                                          "add_user", tasks)

        self.assertEquals([chimpy], [func for func in res])
