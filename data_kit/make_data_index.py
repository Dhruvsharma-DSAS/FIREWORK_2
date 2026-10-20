import os
import json
import duckdb

DATA_DIR = "data"
OUT = "DATA_INDEX.json"

con = duckdb.connect()
index = {"about": "One small file that describes every data file, so AI tools read this instead of the full data.", "files": []}

for root, dirs, files in os.walk(DATA_DIR):
    for name in files:
        path = os.path.join(root, name)
        entry = {"path": path, "size_mb": round(os.path.getsize(path) / 1e6, 2)}
        reader = None
        if name.endswith(".parquet"):
            reader = "read_parquet('" + path + "')"
        if name.endswith(".csv"):
            reader = "read_csv_auto('" + path + "')"
        if reader is not None:
            try:
                cols = con.execute("describe select * from " + reader).fetchall()
                entry["columns"] = [[c[0], c[1]] for c in cols]
                entry["rows"] = con.execute("select count(*) from " + reader).fetchone()[0]
                sample = con.execute("select * from " + reader + " limit 3").fetchall()
                entry["sample"] = [[str(v) for v in row] for row in sample]
                names = [c[0] for c in cols]
                for date_col in ["acq_date", "month", "day", "date"]:
                    if date_col in names:
                        lo, hi = con.execute("select min(" + date_col + "), max(" + date_col + ") from " + reader).fetchone()
                        entry["date_range"] = [str(lo), str(hi)]
            except Exception as e:
                entry["error"] = str(e)[:120]
        index["files"].append(entry)

json.dump(index, open(OUT, "w"), indent=2)
print("wrote", OUT, len(index["files"]), "files")
