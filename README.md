# Geoffrey Discourse Service Bot

## Installation:

1. Fork
2. virtualenv:

   virtualenv -p python2.7 .
   source bin/activate
   pip install -r requirements.txt

3. profit!


## Running Geoffrey

Start the API Server via:

  bin/twistd -n web --class=server.resource

Start the Backend Workers with Celery

   celery -A tasks worker --loglevel=info

Start redis:

 	redis-server