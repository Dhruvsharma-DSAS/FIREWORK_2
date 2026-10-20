import runpy
from pathlib import Path

import pytest

TEST_DIR = Path(__file__).parent
SCRIPTS = ["test_harmonize.py", "test_calendar.py", "test_accuracy_tools.py", "test_failover.py"]


@pytest.mark.parametrize("script", SCRIPTS)
def test_script_runs_all_asserts(script: str) -> None:
    runpy.run_path(str(TEST_DIR / script), run_name="__main__")
