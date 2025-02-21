import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom"; // Import useNavigate here
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import ContactUs from "./components/Contactus";
import Login from "./components/Login";
import AboutUs from "./components/Aboutus";
import Main from "./components/Main";

function App() {
  return (
    <div className="hide-scrollbar h-screen overflow-y-scroll">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Main" element={<Main/>} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AboutUs" element={<AboutUs />} />
        
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}


export default App;
