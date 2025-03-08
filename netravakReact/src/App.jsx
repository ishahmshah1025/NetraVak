
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Verify from "./pages/Verify"; 
import Register from "./pages/Register"; 
import { FacePage } from "./pages/FacePage";
import { VoicePage } from "./pages/VoicePage";
import { LoginPage } from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/face/verify" element={<FacePage/>}/>
          <Route path="/voice/verify" element={<VoicePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
