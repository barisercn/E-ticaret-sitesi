import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './brands.css';
import Navbar from "./navbar.jsx";

function Brands() {

  // Marka ID mapping
  const brandData = [
    { id: 1, name: "Apple", img: "/resimler/Applejpg.webp", desc: "" },
    { id: 2, name: "Samsung", img: "/resimler/Samsung_Logo.svg.png", desc: "" },
    { id: 3, name: "Oppo", img: "/resimler/oppo.png", desc: "" },
    { id: 4, name: "Huawei", img: "/resimler/Huawei-logo.webp", desc: "" },
    { id: 5, name: "Xiaomi", img: "/resimler/xiaomi.jpg", desc: "" },
  ];

  return (
    <>
    <Navbar />
    <div style={{ backgroundColor: "#e28743", minHeight: "100vh" }}>
      <div className="container p-0 pt-4 pb-4">
        <div className="row g-4">
          {brandData.map((brand) => (
            <div className="col-md-4" key={brand.id}>
              <Link to={`/brand/${brand.id}`} className="text-decoration-none text-dark">
                <div className="card text-center h-100 d-flex flex-column">
                  <img src={brand.img} className="card-img-top p-3" alt={brand.name} />
                  <div className="card-body flex-grow-1">
                    <h5 className="card-title">{brand.name}</h5>
                    <p className="card-text">{brand.desc}</p>
                  </div>
  
                  {/* Butonlar */}
               
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
