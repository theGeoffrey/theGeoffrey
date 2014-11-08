from geoffrey.services import mailchimp
from geoffrey import config
from twisted.internet import reactor
from twisted.internet import defer
from twisted.python import log
from pprint import pprint
import sys

import logging

logger = logging.getLogger("Geoffrey")


def test():
	emails = [{"email": {"email": "ben@nospam.com"}, 
						"email_type": "text",
						"merge_vars":{"FNAME": "Ben"}
						}]

	# dfr = mailchimp.add_addresses_to_mailchimp_list(emails, config.API_KEY, config.DATA_CENTER, config.TEST_LIST_ID)
	dfr = mailchimp.ping_mailchimp()
	dfr.addErrback(log.err)
	dfr.addBoth(lambda x: reactor.stop())

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    log.startLogging(sys.stdout)
    test()
    reactor.run()