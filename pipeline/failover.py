import json
import os
import time


def fetch_with_fallback(fetchers, cache_path=None, max_cache_age_hours=24):
    errors = []
    for name, fetch in fetchers:
        try:
            data = fetch()
        except Exception as exc:
            errors.append(name + ": " + str(exc))
            continue
        if data is None or len(data) == 0:
            errors.append(name + ": empty")
            continue
        if cache_path is not None:
            with open(cache_path, "w") as f:
                json.dump({"saved_at": time.time(), "source": name, "data": data}, f)
        return {"data": data, "meta": {"data_source": "live", "provider": name, "errors": errors}}
    if cache_path is not None and os.path.exists(cache_path):
        with open(cache_path) as f:
            saved = json.load(f)
        age_hours = (time.time() - saved["saved_at"]) / 3600.0
        if age_hours <= max_cache_age_hours:
            return {"data": saved["data"], "meta": {"data_source": "cached", "provider": saved["source"], "errors": errors}}
    return {"data": None, "meta": {"data_source": "unavailable", "provider": None, "errors": errors}}
