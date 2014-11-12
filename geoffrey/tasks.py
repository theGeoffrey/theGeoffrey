from celery import Celery
from txcelery.defer import CeleryClient
from twisted.internet import defer

from geoffrey import config
from geoffrey.services import mailchimp

app = Celery('tasks', broker=config.CONFIG.BROKER_URL)


@CeleryClient
@app.task
def mailchimp_subscribe(app_config, payload):
    return mailchimp.add


@CeleryClient
@app.task
def mailchimp_batch_subscribe(app_config, payload):
    return mailchimp.add

mailchimp_subscribe.reacts_on_api_calls = ["add_user"]
mailchimp_batch_subscribe.reacts_on_api_calls = ["add_batch"]
