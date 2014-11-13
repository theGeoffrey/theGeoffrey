from geoffrey.utils import get_params

import yaml


class Config(dict):

    def __getattr__(self, attr):
        return get_params(self, attr)

    def __setstate__(self, state):
        self.update(state)


with open("config.yml", "r") as reader:
    CONFIG = Config(**yaml.load(reader.read()))
