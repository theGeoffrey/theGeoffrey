import pystache
from pystache import render

feedback = u'''{{#title}}#Feedback: {{title}} {{/title}}
{{^title}}#{{information.fname}} {{information.lname}}
{{/title}}

  {{#information}}
   **Poster**
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
