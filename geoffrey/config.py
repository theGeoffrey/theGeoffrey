from geoffrey.utils import get_params

import yaml


class Config(dict):

    def __getattr__(self, attr):
        return get_params(self, attr)[0]


with open("config.yml", "r") as reader:
    CONFIG = Config(**yaml.load(reader.read()))
