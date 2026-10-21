import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Explorer from "./pages/Explorer.jsx"
import Calendar from "./pages/Calendar.jsx"
import SensorLab from "./pages/SensorLab.jsx"
import DataStudio from "./pages/DataStudio.jsx"
import FormulaLab from "./pages/FormulaLab.jsx"
import Validation from "./pages/Validation.jsx"
import Sources from "./pages/Sources.jsx"
import BlindSpot from "./pages/BlindSpot.jsx"
import ComingSoon from "./pages/ComingSoon.jsx"
import BootLoader from "./components/BootLoader.jsx"
import LoadingLayer from "./components/LoadingLayer.jsx"

function App() {
  const [booted, setBooted] = useState(false)

  let loader = <BootLoader onDone={function () { setBooted(true) }} />
  if (booted) {
    loader = <LoadingLayer scope="page" variant="page" />
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explorer />} />
        <Route path="/calendar/:region" element={<Calendar />} />
        <Route path="/sensors" element={<SensorLab />} />
        <Route path="/studio" element={<DataStudio />} />
        <Route path="/formulas/:id" element={<FormulaLab />} />
        <Route path="/validation" element={<Validation />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/blind-spot" element={<BlindSpot />} />
        <Route path="/learn" element={<ComingSoon active="Learn" batch="3" />} />
        <Route path="/me" element={<ComingSoon active="Home" batch="3" />} />
        <Route path="/brief/:id" element={<ComingSoon active="" batch="3" />} />
        <Route path="/sources/health" element={<ComingSoon active="Sources" batch="3" />} />
        <Route path="*" element={<ComingSoon active="" batch="" />} />
      </Routes>
      {loader}
    </div>
  )
}

export default App
