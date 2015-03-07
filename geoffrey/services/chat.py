
from geoffrey.plugins import manager


def handle_server_settings(settings, request, config):
    if not config.get("chat"):
        settings["chat"] = False
        return

    chatcfg = config.get("chat");

    settings["chat"] = {
        "domain": config.get("dc_url"),
        "allow_guests": chatcfg.get("allow_guests", False),
        "limit_to_group": chatcfg.get("limit_to_group", False),
        "default_open": chatcfg.get("default_open", False)
        }


manager.register_callback("generate_server_settings", handle_server_settings)
