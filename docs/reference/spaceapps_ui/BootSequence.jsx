import { useEffect, useState } from "react";

const LINES = [
  "> linking FIRMS archive ............ OK",
  "> MODIS 2000-2026 / VIIRS 2012-2026 . OK",
  "> harmonising to VIIRS-equivalent .. OK",
  "> seam test (2012 jump) ............ see Methods",
  "> blind-spot check (Punjab) ........ WARNING",
];

function BootSequence(props) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= LINES.length) {
      props.onDone();
      return;
    }
    const timer = setTimeout(() => {
      setShown(shown + 1);
    }, 320);
    return () => clearTimeout(timer);
  }, [shown]);

  const visible = LINES.filter((line, index) => index < shown);

  let cursorClass = "cursor";
  if (shown >= LINES.length) {
    cursorClass = "cursor cursor-done";
  }

  return (
    <div className="boot" aria-live="polite">
      {visible.map((line) => {
        let lineClass = "line";
        if (line.includes("WARNING")) {
          lineClass = "line warn";
        }
        return (
          <p key={line} className={lineClass}>
            {line}
          </p>
        );
      })}
      <span className={cursorClass}>_</span>
    </div>
  );
}

export default BootSequence;
