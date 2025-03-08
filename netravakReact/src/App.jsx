
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./pages/Register"; 
import { FacePage } from "./pages/FacePage";
import { VoicePage } from "./pages/VoicePage";
import { LoginPage } from "./pages/LoginPage";
import { UploadPage } from "./pages/UploadPage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/face/verify" element={<FacePage/>}/>
          <Route path="/voice/verify" element={<VoicePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/upload" element={<UploadPage/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
