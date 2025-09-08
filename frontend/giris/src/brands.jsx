import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './brands.css'; // Modernized CSS
import Navbar from "./navbar.jsx";

function Brands() {
  const brandData = [
    { id: 1, name: "Apple", img: "/resimler/Applejpg.webp" },
    { id: 2, name: "Samsung", img: "/resimler/Samsung_Logo.svg.png" },
    { id: 3, name: "Oppo", img: "/resimler/oppo.png" },
    { id: 4, name: "Huawei", img: "/resimler/Huawei-logo.webp" },
    { id: 5, name: "Xiaomi", img: "/resimler/xiaomi.jpg" },
  ];

  return (
    <>
      <Navbar />
      <div className="brands-page-background">
        <div className="container">
          <div className="row g-4">
            {brandData.map((brand) => (
              <div className="col-lg-4 col-md-6" key={brand.id}>
                <Link to={`/brand/${brand.id}`} className="brand-card-link">
                  <div className="brand-card">
                    <div className="brand-logo-container">
                      <img src={brand.img} className="brand-logo" alt={`${brand.name} logo`} />
                    </div>
                    <h5 className="card-title">{brand.name}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Brands;