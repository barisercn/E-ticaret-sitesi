import React from "react";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "./navbar.jsx";
import OrderCard from "./OrderCard.jsx"
import "./myOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const personId = localStorage.getItem("PersonID");

        if (!personId) {
          setError("PersonID bulunamadı!");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/myOrders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ personId: parseInt(personId) })
        });

        if (!response.ok) {
          throw new Error("Siparişler alınamadı!");
        }

        const data = await response.json();
        console.log("Siparişler:", data);
        setOrders(data);
      } catch (err) {
        console.error("Hata:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="my-orders-page">
        <div className="background-overlay" />
        
        <div className="container my-orders-container">
          <h1 className="page-title">
            <i className="bi bi-box-seam me-3"></i>
            Siparişlerim
          </h1>

          {loading ? (
            <div className="loading-message">
              <div className="spinner-border text-light mb-3" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p>Siparişleriniz yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
              <p>Hata: {error}</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="order-cards-row">
              {orders.map((order, idx) => (
                <div key={idx} className="order-card-col">
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders-message">
              <i className="bi bi-cart-x text-light fs-1 mb-3"></i>
              <p>Henüz hiç siparişiniz bulunmuyor.</p>
              <p className="text-muted">İlk siparişinizi vermek için ürünleri incelemeye başlayın!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyOrders;

