import pystache
from pystache import render

template = u'''
  {{#title}} #Feedback: {{title}} {{/title}}
  {{^title}} #{{information.fname}} {{information.lname}}
  {{/title}}

  {{#information}}
   **Poster:**
   **Email**: {{information.email}}
   **First name**: {{information.fname}}
   **Last name**: {{information.lname}}
   {{/information}}

   {{^information}}
   **Poster:** Anonymous
   {{/information}}

   Message: {{#message}}
   {{message.body}}
   {{/message}}
   
   {{^message}}
   Empty
   {{/message}}
'''

context = {
    'information': {
        'email': 'bob@online.com',
        'fname': 'Angry',
        'lname': 'Bob'
    },
    'message': {
        'body': "I'm angry Bob and i'm angryyyyyyyy."
    },
    'title': 'BOBBBBB'
}

if __name__ == "__main__":
    print render(template, context)

