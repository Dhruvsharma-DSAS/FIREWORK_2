import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Explorer from "./pages/Explorer.jsx"
import Calendar from "./pages/Calendar.jsx"
import ComingSoon from "./pages/ComingSoon.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explorer />} />
      <Route path="/calendar/:region" element={<Calendar />} />
      <Route path="/sensors" element={<ComingSoon active="Sensor Lab" batch="2" />} />
      <Route path="/studio" element={<ComingSoon active="Data Studio" batch="2" />} />
      <Route path="/formulas/:id" element={<ComingSoon active="Formulas" batch="2" />} />
      <Route path="/validation" element={<ComingSoon active="Validation" batch="2" />} />
      <Route path="/sources" element={<ComingSoon active="Sources" batch="2" />} />
      <Route path="/blind-spot" element={<ComingSoon active="Blind Spot" batch="2" />} />
      <Route path="/learn" element={<ComingSoon active="Learn" batch="3" />} />
      <Route path="/me" element={<ComingSoon active="Home" batch="3" />} />
      <Route path="/brief/:id" element={<ComingSoon active="" batch="3" />} />
      <Route path="/sources/health" element={<ComingSoon active="Sources" batch="3" />} />
      <Route path="*" element={<ComingSoon active="" batch="" />} />
    </Routes>
  )
}

export default App
