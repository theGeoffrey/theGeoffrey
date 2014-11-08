#Documentation Geoffrey - Mailchimp plugin

##mailchimp.py

###add_addresses_to_mailchimp_list
_addresses_ parameter takes an array of e-mail, formatted as follows:

	"batch": [{"email": "email": "example email", email_type: "html", merge_vars:{"FNAME":"first", "LNAME": "last"}}, {"email": "email": "example email", email_type: "text", merge_vars:{"FNAME":"first", "LNAME": "last"}}]