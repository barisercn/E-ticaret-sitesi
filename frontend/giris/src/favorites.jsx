import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import DeviceCard from './deviceCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './favorites.css'; // Import the new CSS

function Favorites() { // Renamed to PascalCase
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);

    const updateFavorites = () => {
      const updated = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(updated);
    };

    window.addEventListener("storage", updateFavorites);

    return () => window.removeEventListener("storage", updateFavorites);
  }, []);

  return (
    <>
      <Navbar />
      <div className="favorites-page-background">
        <div className="container">
          <h1 className="favorites-title">Favorilerim</h1>
          {favorites.length === 0 ? (
            <div className="no-favorites-container">
              <i className="bi bi-heartbreak-fill"></i>
              <p>Henüz favori ürününüz yok.</p>
            </div>
          ) : (
            <div className="row g-4">
              {favorites.map((device, index) => (
                <div className="col-lg-4 col-md-6" key={`${device.name}-${index}`}>
                  <DeviceCard 
                    device={device} 
                    isCartPage={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Favorites;
