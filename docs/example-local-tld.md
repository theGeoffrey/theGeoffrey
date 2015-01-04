A neat and handy feature for development is using local-tld (which is the expected default in the configs unless they are overwritten with environment variables).

Install it globally with npm and edit ~/.local-tld.json:

    npm install -g local-tld
    $EDITOR ~/.local-tld.json

Here is a sane example content for that file (assuming your discourse to be at localhost:4000 on your vagrant):

```
{
  "8091": {
    "name": "geoffrey"
  },

  "4000": {
    "name": "discourse"
  },
   "5984":{
    "name": "geoffrey-db"
   }
}

```