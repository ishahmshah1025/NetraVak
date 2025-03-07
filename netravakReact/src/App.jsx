
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Verify from "./pages/Verify"; 
import Register from "./pages/Register"; 
import { FacePage } from "./pages/FacePage";
import { VoicePage } from "./pages/VoicePage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/face/verify" element={<FacePage/>}/>
          <Route path="/voice/verify" element={<VoicePage/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
