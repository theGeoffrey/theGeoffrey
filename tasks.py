from celery import Celery
from txcelery.defer import CeleryClient
from twisted.internet import defer
import config
import mailchimp

app = Celery('tasks', broker=config.BROKER_URL)

@CeleryClient
@app.task
def add(app_config, payload):
	return mailchimp.add

#app_config: api_key, dc, list_id
#payload: 