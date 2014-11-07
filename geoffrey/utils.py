from pprint import pprint


class MisConfiguredError(Exception):
    pass


def get_params(config, *args, **kwargs):
    pprint("config {}".format(config))
    pprint("args: {}".format(args))
    pprint("kwargs: {}".format(kwargs))

    results = []

    for arg in args:
        arg_list = arg.split('.')
        pprint("argsss: {}".format(arg_list))

        dict_value = config
        while len(arg_list) > 0:
            pprint("ARG_LIST:{}, for count:{}".format(arg_list, len(arg_list)))
            dict_value = dict_value[arg_list.pop(0)]
            pprint("DICTVAL {}".format(dict_value))

        results.append(dict_value)
        pprint(tuple(results))

    return tuple(results)
