import pystache
from pystache import render

feedback = u'''{{#title}}#Feedback: {{title}} {{/title}}
{{^title}}#{{fname}} {{lname}}
{{/title}}

   **Poster**
   **Email**: {{email}}
   **First name**: {{fname}}
   **Last name**: {{lname}}

   {{^fname}}
   **Poster:** Anonymous
   {{/fname}}

   Message: {{body}}
'''

contact = u'''#New contact: {{information.fname}} {{information.lname}}

   **Email**: {{information.email}}
   **First name**: {{information.fname}}
   **Last name**: {{information.lname}}
   **Phone**: {{information.phone}}

   Message: {{#message}}
   {{message.body}}
   {{/message}}

   {{^message}}
   Empty
   {{/message}}
'''
