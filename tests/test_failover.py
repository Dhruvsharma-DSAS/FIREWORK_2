import os
import tempfile
from failover import fetch_with_fallback


def broken():
    raise ConnectionError("HTTP 503")


def empty():
    return []


def good_backup():
    return [{"lat": 30.71, "lon": 75.81, "frp": 6.3}]


cache = os.path.join(tempfile.mkdtemp(), "cache.json")

r1 = fetch_with_fallback([("FIRMS_API", broken), ("FIRMS_ARCHIVE", empty), ("LAADS", good_backup)], cache)
assert r1["meta"]["provider"] == "LAADS"
assert r1["meta"]["data_source"] == "live"
assert len(r1["meta"]["errors"]) == 2

r2 = fetch_with_fallback([("FIRMS_API", broken), ("LAADS", broken)], cache)
assert r2["meta"]["data_source"] == "cached"
assert r2["meta"]["provider"] == "LAADS"
assert r2["data"][0]["frp"] == 6.3

r3 = fetch_with_fallback([("FIRMS_API", broken)], cache, max_cache_age_hours=0)
assert r3["meta"]["data_source"] == "unavailable"
assert r3["data"] is None

print("failover tests passed")
