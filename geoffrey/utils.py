
class MisConfiguredError(Exception): pass

def get_params(config, *args, **kwargs):
    """
    Asked for a list of dot notated
    """
