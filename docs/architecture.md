# Geoffrey Architecture


The Geoffrey Architecture consists of a few basic components:

 - exposed API
 - couchDB persistance store
 - Redis
 - Background Processes (using Celery)

On top, Geoffrey has a neat Web-UI, which directly ties into the couchDB backend for configuration assistance as well as logging information.

The main Configuration is stored in the same CouchDB-Database that logging happens to. It has the id "CONFIG".

This infrastrucuture allows the same geoffrey api server and background processes to optionally serve multiple instances of configurations, logs and state – each in their own separated CouchDB Database. It is recommended to disable party-mode in CouchDB.

The architecture looks appropriatly as follows:


+---------------------+         +----------------------+
|                     |         |                      |
|  Geoffrey API       | triggers|  Geoffrey Web-UI     |
|  Server             | <-------+                      |
|                     |         |                      |
+---+------+----------+         +--------+-------------+
    |      |finds config                 | * configure
    |      |     +-----------------+     | * see logs
    |      +-----+    CouchDB      +-----+
    |            +-----------------+
    | Enqueues                ^
    |                         | writes logs
    v                         |
 +----------------------------+-+-----+
 |                              +-----+-------+
 | Celery Background Workers    |   Redis     |
 |                              +-----+-------+
 |                                    |
 +-----------+----------+--+----------+
             | Mailchimp|  |  Forms   |
             +----------+  +----------+


## Flows

### Discourse hook flow

For the common tasks of having a new post, we come to the following flow chart:

+--------------------------------------+
|       Discourse Instance             |
+--+-----------------------------------+
   |  1. POST
   |  /api/posts/new?key=user:pw@gf-db
   |  payload={post_id: 1234, author: ben}
   v
+--------------------+   2. GET user:pw@couchdb/gf-df/CONFIG
|                    |              +-------------+
|  Geoffrey API      +------------->|   CouchdB   |
|  Server            |              +--+----------+
|                    |                 |
|  4. looks up apps  |  <--------------+
|                    |   3. returns config:
+--+-----------------+      {_id: CONFIG, dc_url: XYZ,
   |                         apps: {mailchimp: ... }
   | 5. enqueues:
   |  (app_feature, config, payload)
   v
 +-------------------------------+
 |  Celery Workers               |
 +-------------------------------+

