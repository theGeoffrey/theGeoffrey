
import subprocess
import logging
import os

logger = logging.getLogger("Geoffrey:Version")


def _get_git_version():
    if not os.path.isdir(".git"):
        logger.warn("No .git repo means we don't know the version.")
        return "-UNKNOWN-"
    try:
        p = subprocess.Popen(["git", "describe",
                              "--tags", "--dirty", "--always"],
                             stdout=subprocess.PIPE)
    except EnvironmentError:
        logger.warn("unable to run git, Version unknown")
        return "-GIT-UNKNOWN-"

    stdout = p.communicate()[0]
    if p.returncode != 0:
        logger.warn("unable to run git, Version unknown")
        return "-GIT-UNKNOWN-"

    return stdout.strip()


__version__ = _get_git_version()
