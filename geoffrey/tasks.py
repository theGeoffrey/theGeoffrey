from twisted.internet import reactor
from eventlet.twistedutil import join_reactor, callInGreenThread
from celery import Celery
from txcelery.defer import CeleryClient
from twisted.internet import defer
from twisted.python import log
from pystache import render
# from pprint import pprint
from geoffrey.services import forms
from geoffrey import config
from geoffrey.utils import get_params
from geoffrey.services import mailchimp
from geoffrey import discourse as dc
from celery.bin.worker import worker
import logging
import eventlet
from kombu import serialization

logger = logging.getLogger("Tasks")

eventlet.hubs.use_hub('twistedr')

app = Celery('tasks')
app.conf.update(config.CONFIG.CELERY)
serialization.registry._decoders.pop("application/x-python-serialize")


@app.task
def mailchimp_subscribe(app_config, payload):

    email = get_params(payload, 'email')
    api_key, data_center, list_id = get_params(app_config,
                                               'apps.mailchimp.API_KEY',
                                               'apps.mailchimp.DATA_CENTER',
                                               'apps.mailchimp.TEST_LIST_ID')

    dfr = mailchimp.add_single_user_to_mailchimp_list(email, api_key,
                                                      data_center, list_id)
    
    dfr.addErrback(log.err)
    return dfr


@app.task
def mailchimp_batch_subscribe(app_config, payload):
    return


@app.task
def post_form(app_config, payload):
    title, body = get_params(payload, 'title', 'form')
    form_body = render(forms.feedback, body)
    host, api_key, username = get_params(app_config,
                                         'apps.forms.HOST',
                                         'apps.forms.API_KEY',
                                         'apps.forms.USERNAME')

    dfr = dc.create_topic(host, api_key, username, title, form_body)
    dfr.addErrback(log.err)
    return dfr


mailchimp_subscribe.reacts_on_api_calls = ["add_user"]
mailchimp_batch_subscribe.reacts_on_api_calls = ["add_batch"]
post_form.reacts_on_api_calls = ["add_form"]
