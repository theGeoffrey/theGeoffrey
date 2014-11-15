
# from twisted.internet import defer
# from pprint import pprint
from geoffrey import config
from geoffrey.utils import get_params

import logging
import treq
import json


logger = logging.getLogger("Services:Mailchimp")
MAILCHIMP_BASE_URL = "https://{dc}.api.mailchimp.com/2.0/{section}/{name}"


class MailChimpApiError(Exception):
    pass

class MailChimpConfigError(Exception):
    pass

def _query_mailchimp(data_center, method_section, method_name, payload):

    def _read_response(response):
        logger.info("Received Data: %s", response)
        if response.code != 200:
            logger.info("Received Data with error")
            raise MailChimpApiError("{}".format(response.phrase))

        return treq.text_content(response).addCallback(json.loads)

    def _check_for_error(response):
        logger.info("Received Data: %s", response)
        if "error" in response:
            raise MailChimpApiError("{}:{}".format(response["name"],
                                                   response["error"]))
        return response

    logger.info("STARTING QUERY MAICHIMP WITH PAYLOAD {}".format(payload))

    dfr = treq.request("POST",
                       MAILCHIMP_BASE_URL.format(dc=data_center,
                                                 section=method_section,
                                                 name=method_name).encode("utf-8"),
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


def add_single_user_to_mailchimp_list(email, api_key, data_center, list_id,
                                      update=True, double_optin=False,
                                      replace_interests=True):
    return _query_mailchimp(data_center,
                            "lists", "subscribe",
                            {"apikey": api_key,
                             "id": list_id,
                             "email": {"email": email},
                             "double_optin": double_optin
                             })


def ping_mailchimp():
    return _query_mailchimp(config.DATA_CENTER,
                            "helper", "ping",
                            {"apikey": config.API_KEY,
                             })


def batch_emails_mailchimp(*args):
    batch = []

    def _get_merge_vars(arg):
        merge_vars = {}
        first = arg.get('first_name', None)
        last = arg.get('last_name', None)

        if first:
            merge_vars['FNAME'] = first
        if last:
            merge_vars['LNAME'] = last
        return merge_vars

    def _has_merge_vars(arg):
        if arg.get('first_name', None) or arg.get('last_name', None):
            return True
        else:
            return False

    for arg in args:
        email = get_params(arg, "email")

        if _has_merge_vars(arg):
            email_dict = {"email": {"email": email,
                                    "email_type": "text",
                                    "merge_vars": _get_merge_vars(arg)}}
        else:
            email_dict = {"email": {"email": email,
                                    "email_type": "text"}}
        batch.append(email_dict)
    return batch
