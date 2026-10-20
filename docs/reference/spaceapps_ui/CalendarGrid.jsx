import { useState } from "react";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function cellColor(value, maxValue) {
  if (maxValue === 0) {
    return "var(--heat-0)";
  }
  const share = value / maxValue;
  if (share > 0.75) {
    return "var(--heat-4)";
  } else if (share > 0.5) {
    return "var(--heat-3)";
  } else if (share > 0.25) {
    return "var(--heat-2)";
  } else if (share > 0) {
    return "var(--heat-1)";
  }
  return "var(--heat-0)";
}

function CalendarGrid(props) {
  const [mode, setMode] = useState("harmonised");
  const rows = props.rows.filter((row) => row.mode === mode);

  let maxValue = 0;
  rows.forEach((row) => {
    row.values.forEach((value) => {
      if (value > maxValue) {
        maxValue = value;
      }
    });
  });

  let rawClass = "";
  let harmonisedClass = "on";
  if (mode === "raw") {
    rawClass = "on";
    harmonisedClass = "";
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <span className="panel-title">BURN CALENDAR // {props.regionName}</span>
        <div className="toggle">
          <button className={rawClass} onClick={() => setMode("raw")}>RAW</button>
          <button className={harmonisedClass} onClick={() => setMode("harmonised")}>HARMONISED</button>
        </div>
      </header>
      <div className="cal">
        <div className="cal-row cal-head">
          <span className="cal-year" />
          {MONTHS.map((m, i) => (
            <span key={i} className="cal-month">{m}</span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.year} className="cal-row">
            <span className="cal-year">{row.year}</span>
            {row.values.map((value, i) => (
              <span
                key={i}
                className="cal-cell"
                style={{ background: cellColor(value, maxValue) }}
                title={row.year + "-" + (i + 1) + ": " + value}
                onClick={() => props.onSelect(row.year, i + 1)}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CalendarGrid;
