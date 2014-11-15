from pprint import pprint


class MisConfiguredError(Exception):
    pass


class ProgrammingError(MisConfiguredError):
    pass


def get_params(config, *args, **kwargs):

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

    if args and kwargs:
        raise ProgrammingError("get params for args OR kwargs")
        pass

    elif args:
        list_results = []
        for arg in args:
            list_results.append(get_value_for_key(arg))

        if len(list_results) > 1:
            return list_results
        else:
            return list_results[0]

    elif kwargs:
        dict_result = {}
        for key, value in kwargs.iteritems():
            dict_result[key] = get_value_for_key(value)
        return dict_result

    else:
        pass


def get_active_services_for_api(config, api_call, module):
    services = get_params(config, 'enabled_services')

    for service in services:

        func = getattr(module, service)

        if api_call in func.reacts_on_api_calls:
            yield func
