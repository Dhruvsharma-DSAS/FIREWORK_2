import os
import time
from datetime import date, timedelta
from io import StringIO

import httpx
import pandas as pd

BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
MAX_DAYS_PER_CALL = 5


def fetch_chunk(map_key, source, bbox, start_day, days):
    url = BASE + "/" + map_key + "/" + source + "/" + bbox + "/" + str(days) + "/" + start_day.isoformat()
    for attempt in range(3):
        try:
            response = httpx.get(url, timeout=30)
            response.raise_for_status()
            text = response.text
            if text.strip() == "":
                return pd.DataFrame()
            return pd.read_csv(StringIO(text))
        except httpx.HTTPError:
            time.sleep(2 ** attempt)
    return pd.DataFrame()


def fetch_range(map_key, source, bbox, first_day, last_day):
    frames = []
    current = first_day
    while current <= last_day:
        remaining = (last_day - current).days + 1
        days = MAX_DAYS_PER_CALL
        if remaining < days:
            days = remaining
        frame = fetch_chunk(map_key, source, bbox, current, days)
        if len(frame) > 0:
            frame["source"] = source
            frames.append(frame)
        current = current + timedelta(days=days)
        time.sleep(0.5)
    if len(frames) == 0:
        return pd.DataFrame()
    return pd.concat(frames, ignore_index=True)


if __name__ == "__main__":
    key = os.environ.get("FIRMS_MAP_KEY", "")
    if key == "":
        print("Set FIRMS_MAP_KEY first")
    else:
        punjab = "73.8,27.6,77.6,32.6"
        df = fetch_range(key, "VIIRS_SNPP_SP", punjab, date(2024, 10, 1), date(2024, 11, 30))
        df.to_parquet("punjab_viirs_2024_octnov.parquet")
        print(len(df), "rows saved")
