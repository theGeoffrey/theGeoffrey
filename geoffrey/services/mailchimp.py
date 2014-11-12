
# from twisted.internet import defer
# from pprint import pprint
from geoffrey import config

import logging
import treq
import json


logger = logging.getLogger("Services:Mailchimp")
MAILCHIMP_BASE_URL = "https://{dc}.api.mailchimp.com/2.0/{section}/{name}"


class MailChimpApiError(Exception):
    pass


def _query_mailchimp(data_center, method_section, method_name, payload):

    def _read_response(response):
        if response.code != 200:
            logger.debug("Received Data: %s", response)
            raise MailChimpApiError("{}".format(response.phrase))

        return treq.text_content(response).addCallback(json.loads)

    def _check_for_error(response):
        logger.debug("Received Data: %s", response)
        if "error" in response:
            raise MailChimpApiError("{}:{}".format(response["name"],
                                                   response["error"]))
        return response

    dfr = treq.request("POST",
                       MAILCHIMP_BASE_URL.format(dc=data_center,
                                                 section=method_section,
                                                 name=method_name),
                       data=json.dumps(payload),
                       headers={"Content-Type": "application/json"})

    return dfr.addCallback(_read_response).addCallback(_check_for_error)


def add_addresses_to_mailchimp_list(addresses, api_key, data_center, list_id,
                                    update=True, double_optin=False,
                                    replace_interests=True):
    return _query_mailchimp(data_center,
                            "lists", "batch-subscribe",
                            {"apikey": api_key,
                             "id": list_id,
                             "batch": addresses,
                             "update_existing": update,
                             "double_optin": double_optin,
                             "replace_interests": replace_interests
                             })


def ping_mailchimp():
    return _query_mailchimp(config.DATA_CENTER,
                            "helper", "ping",
                            {"apikey": config.API_KEY,
                             })
