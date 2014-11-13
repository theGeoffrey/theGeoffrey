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
