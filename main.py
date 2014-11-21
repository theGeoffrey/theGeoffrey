from geoffrey.services import mailchimp
from geoffrey import config
from geoffrey.utils import get_params
from twisted.internet import reactor
from twisted.internet import defer
from twisted.python import log
from geoffrey import config 
from pprint import pprint
import sys
from geoffrey.services import forms
import logging
import pystache
from pystache import render
from geoffrey import discourse as dc
from pprint import pprint


logger = logging.getLogger("Geoffrey")


# def test():
#     emails = [{"email": {"email": "ben@nospam.com"}, 
#                         "email_type": "text",
#                         "merge_vars":{"FNAME": "Ben"}
#                         }]

#     # dfr = mailchimp.add_addresses_to_mailchimp_list(emails, config.API_KEY, config.DATA_CENTER, config.TEST_LIST_ID)
#     dfr = mailchimp.ping_mailchimp()
#     dfr.addErrback(log.err)
#     dfr.addBoth(lambda x: reactor.stop())

# if __name__ == "__main__":
#     logging.basicConfig(level=logging.DEBUG)
#     log.startLogging(sys.stdout)
#     test()
#     reactor.run()

def post_new_form_data(app_config, payload):
    title, body = get_params(payload, 'title', 'form')
    form_body = render(forms.feedback, body)
    # form_body = "HELLO I'm a new topic!"
    host, api_key, username = get_params(app_config,
                                         'apps.forms.HOST',
                                         'apps.forms.API_KEY',
                                         'apps.forms.USERNAME')

    dfr = dc.create_topic(host, api_key, username, title, form_body)
    dfr.addErrback(log.err)
    return dfr


def ping(app_config):
    host, api_key, username = get_params(app_config,
                                         'apps.forms.HOST',
                                         'apps.forms.API_KEY',
                                         'apps.forms.USERNAME')
    dfr = dc.ping_dc(host, api_key, username)
    return dfr.addErrback(log.err)

if __name__ == "__main__":

    payload = {'form':
               {'information':
                {'email': 'bob@online.com',
                 'fname': 'Angry',
                 'lname': 'Bob'},
                'message':
                {'body': "I'm angry Bob and i'm angryyyyyyyy."}},
               'title': 'Number 4 post through api'}

    logging.basicConfig(level=logging.DEBUG)
    log.startLogging(sys.stdout)
    post_new_form_data(config.CONFIG, payload).addBoth(lambda x: pprint(x))
    # ping(config.CONFIG).addBoth(lambda x: pprint(x))
    reactor.run()

