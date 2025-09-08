import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from './navbar';
import DeviceCard from './deviceCard';
function favorites() {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    // localStorage'dan veriyi al
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);

    // storage event fonksiyonu
    const updateFavorites = () => {
      const updated = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(updated);
    };

    // storage event dinle
    window.addEventListener("storage", updateFavorites);

    // cleanup
    return () => window.removeEventListener("storage", updateFavorites);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#e28743", minHeight: "100vh" }}>
        {favorites.length === 0 ? (
          <p className="text-center text-white">Henüz favori ürününüz yok.</p>
        ) : (
          <div className="row g-4 mt-2 my-2">
            {favorites.map((device, index) => (
              <div className="col-md-4" key={index}>
                <DeviceCard 
                  device={device} 
                  isCartPage={false} // cart sayfası değil
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default favorites