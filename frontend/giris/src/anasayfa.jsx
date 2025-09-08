import React from "react";
import Navbar from "./navbar";
import "./anasayfa.css";

function Anasayfa() {
  return (
    <>
      <Navbar />

      {/* Modern Banner Alanı */}
      <div className="banner-container">
        <img 
          src="/resimler/preview.webp" 
          alt="Akıllı telefon kampanyaları" 
          className="banner-image" 
        />
      </div>

      {/* Buradan sonra sayfanızın diğer içerikleri gelebilir */}
      <div className="container my-5">
        {/* Örnek içerik alanı */}
        <h2>Öne Çıkan Ürünler</h2>
        <p>Sayfanızın geri kalanı buraya gelecek...</p>
      </div>
    </>
  );
}

export default Anasayfa;
