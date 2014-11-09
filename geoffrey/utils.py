from pprint import pprint


class MisConfiguredError(Exception):
    pass


def get_params(config, *args, **kwargs):
    list_results = []
    dict_result = {}

    def get_value_for_key(key):
        arg_list = key.split('.')
        dict_value = config
        while len(arg_list) > 0:
            if arg_list[0] in dict_value:
                dict_value = dict_value[arg_list.pop(0)]
            else:
                raise MisConfiguredError(
                    "key {} not found".format(arg_list[0]))
        return dict_value

    for arg in args:
        list_results.append(get_value_for_key(arg))

    for key, value in kwargs.iteritems():
        dict_result[key] = get_value_for_key(value)

    if len(list_results) > 0 and len(dict_result.keys()) > 0:
        return tuple((list_results, dict_result))
    elif len(dict_result.keys()) > 0:
        return dict_result
    else:
        return tuple(list_results)
