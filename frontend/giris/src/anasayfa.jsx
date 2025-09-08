import React from "react";
import Navbar from "./navbar";   // 🔹 Navbar bileşenini import et
import "./anasayfa.css";

function Anasayfa() {
  return (
    <>
      {/* Navbar burada çağrılıyor */}
      <Navbar />

      {/* 🔹 Hero Section */}
      <div className="hero-section d-flex align-items-center justify-content-center text-center">
        
      </div>
    </>
  );
}

export default Anasayfa;