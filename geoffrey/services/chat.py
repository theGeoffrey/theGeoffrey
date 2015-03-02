
from geoffrey.plugins import manager


def handle_server_settings(settings, request, config):
    if not config.get("chat"):
        settings["chat"] = False
        return

    settings["chat"] = {"domain": config.get("dc_url")}


manager.register_callback("generate_server_settings", handle_server_settings)
