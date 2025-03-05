
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Verify from "./pages/Verify"; 
import Register from "./pages/Register"; 
import { FacePage } from "./pages/FacePage";

const App = () => {
  return (
    <Router>
      <div>
        <nav className="flex space-x-4 p-4 bg-gray-200">
          <Link to="/verify" className="text-blue-600">Verify</Link>
          <Link to="/register" className="text-blue-600">Register</Link>
        </nav>

        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/face/verify" element={<FacePage/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
