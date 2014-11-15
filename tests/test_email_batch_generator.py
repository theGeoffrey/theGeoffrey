from geoffrey.services.mailchimp import batch_emails_mailchimp, MailChimpConfigError
from unittest import TestCase


class TestEmailBatchGenerator(TestCase):

    def test_create_batch_emails(self):
        emails = [{"email":
                   {"email": "email@nospam.com",
                    "email_type": "text"}},
                  {"email":
                   {"email": "anouk@nospam.com",
                    "email_type": "text"}},
                  {"email":
                   {"email": "ben@nospam.com",
                    "email_type": "text"}}]

        emails_names = [{"email":
                         {"email": "email@nospam.com",
                          "email_type": "text",
                          "merge_vars":
                          {"FNAME": "spammy", "LNAME": "spammerson"}}},
                        {"email":
                         {"email": "anouk@nospam.com",
                          "email_type": "text",
                          "merge_vars":
                          {"FNAME": "An", "LNAME": "Annie"}}}]

        emails_partial_name = [{"email":
                                {"email": "anouk@nospam.com",
                                 "email_type": "text",
                                 "merge_vars":
                                 {"LNAME": "Annie"}}},
                               {"email":
                                {"email": "else@nospam.com",
                                 "email_type": "text",
                                 "merge_vars":
                                 {"FNAME": "Else"}}}]

        self.assertEquals(
            batch_emails_mailchimp({"email": "email@nospam.com"},
                                   {"email": "anouk@nospam.com"},
                                   {"email": "ben@nospam.com"}), emails)

        self.assertEquals(
            batch_emails_mailchimp({"email": "email@nospam.com",
                                    "first_name": "spammy",
                                    "last_name": "spammerson"},
                                   {"email": "anouk@nospam.com",
                                    "first_name": "An",
                                    "last_name": "Annie"}), emails_names)

        self.assertEquals(
            batch_emails_mailchimp({"email": "anouk@nospam.com",
                                    "last_name": "Annie"},
                                   {"email": "else@nospam.com",
                                    "first_name": "Else"}),
            emails_partial_name)

