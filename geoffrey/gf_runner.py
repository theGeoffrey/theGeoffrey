from __future__ import absolute_imports

import geventreactor; geventreactor.install()
import gevent
from .tasks import *


def _run_worker():
    worker(app=app).run(loglevel='info', pool_cls='gevent')


def main():
    geventreactor.deferToGreenlet(_run_worker)
    reactor.run()


if __name__ == '__main__':
    main()

