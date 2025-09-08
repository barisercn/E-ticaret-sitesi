import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './deviceCard.css';
import Navbar from "./navbar.jsx";
import DeviceCard from "./deviceCard.jsx";
import './DevicePage.css';

function DevicePage() {
  const { brandid } = useParams();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/brand/${brandid}`);
        setDevices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Cihazlar çekilemedi:", err);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [brandid]);

  return (
    <>
      <Navbar />  {/* Navbar üstte kalıyor */}
      <div className="device-page-background">
        {/* Overlay için hafif pattern */}
        <div className="background-overlay" />
        
        <div className="container p-0 pt-4 pb-4 device-page-container">
          {loading ? (
            <div className="loading-message">
              <div className="spinner-border text-light mb-3" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p className="text-white fs-5 fw-bold">Cihazlar yükleniyor...</p>
            </div>
          ) : devices.length > 0 ? (
            <div className="row g-4 mt-2 my-2 device-cards-row">
              {devices.map(device => (
                <div className="col-lg-4 col-md-6 col-sm-12" key={device.name}>
                  <DeviceCard device={device} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-device-message">
              <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
              <p className="text-white fs-5 fw-bold">
                Bu markaya ait cihaz bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DevicePage;
