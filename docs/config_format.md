# The Config Dictionary has the following format:

```CONFIG = {
    "_id": "239074uu7521asd",
    "discourse_url": "http://discourse.opentechschool.org",
    "api_key": "Discourse_API_KEY",
    "contact_account": "ben",
    "apps": {
        "twitter": {
            "session_token": "XXXX",
            "session_key": "ZXY",
        },
        "mailchimp": {
            "apikey" : "4567890",
            "datacenter": "us8",
            "listId": "12456",
            "group_lists": {
                "admins": "1245",
                "alumni": "whatever"
            }
        }
    },
    "enabled_services": ["post_to_twitter", "mailchimp_subscribe", "mailchimp_group_subscribe"]
}
```

Allowing for easy traver

# NEW-USER-PUSH:


example for post request test mailchimp:


{"CONFIG": {"api_key":"yay", 
             "apps: {"mailchimp": {"api_key": "4f34ea944dd1e33a5452550789042f9c-us9", 
                                   "data_center": "us9", 
                                   "list_id": "f4b255a33a"}}}}

{"PAYLOAD" : {
    "email": "1234@gmail.com",
}}

#FORM DATA:
User creates a form and saves this as a template, which will be saved in config. When form data is posted, we will use it to complete the form and post it to discourse.
  - We need to figure out how to identify user without api_key

FOR NOW:
 - feedback form with title
 - post as topic to discourse


 APP_KEY: APP_KEY_XXXX
PUBLIC_KEY: XXXXX
APP_SECRET: 

DC_DOMAIN: HACKERSHIP

apps:
  twitter:
     XXX
     YYY
  forms:
    feedback_form:
      template: XYZ
      post_as_reply: 10


----

DC_DOMAIN: OTS
PUBLIC_KEY: OTS_KEY_PUB

apps:
  twitter:
     XXX
     YYY
  forms:
    feedback_form:
      template: feedback
      post_as_reply: 10

    feedback_form2:
      form_type: feedback
      template: feedback
      post_new_topic: true
      post_in_category: team

<form id='feedback-for-ots' method="POST" action='http://geoffrey.co/forms/OTS_KEY_PUB/feedback_form2'>


<form id='feedback-for-hs' method="POST" action='http://geoffrey.co/forms/add/APP_KEY_XXXX'>

