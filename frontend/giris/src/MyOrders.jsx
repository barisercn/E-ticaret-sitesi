import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "./navbar.jsx";
import OrderCard from "./OrderCard.jsx";
import "./myOrders.css";

function MyOrders() {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndGroupOrders = async () => {
      try {
        const personId = localStorage.getItem("PersonID");
        if (!personId) {
          setError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/myOrders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personId: parseInt(personId) })
        });

        if (!response.ok) {
          throw new Error(`Siparişler alınamadı: ${response.statusText}`);
        }

        const data = await response.json();

        // Group orders by OrderID
        const orders = data.reduce((acc, order) => {
          const { orderId, orderDate, total_price } = order; // FIX: Changed to total_price
          if (!acc[orderId]) {
            acc[orderId] = {
              orderId,
              orderDate: new Date(orderDate).toLocaleDateString('tr-TR'),
              totalPrice: total_price || 0, // FIX: Used total_price and added a fallback
              items: []
            };
          }
          acc[orderId].items.push({
            name: order.phone_name,
            quantity: order.quantity,
            price: order.unit_price,
            cover: order.cover
          });
          return acc;
        }, {});

        setGroupedOrders(orders);
      } catch (err) {
        console.error("Hata:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupOrders();
  }, []);

  const sortedOrderIds = Object.keys(groupedOrders).sort((a, b) => b - a);

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
              <div className="spinner-border text-light" role="status"></div>
              <p>Siparişleriniz yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="bi bi-exclamation-triangle text-warning"></i>
              <p>{error}</p>
            </div>
          ) : sortedOrderIds.length > 0 ? (
            <div className="orders-list">
              {sortedOrderIds.map(orderId => (
                <OrderCard key={orderId} order={groupedOrders[orderId]} />
              ))}
            </div>
          ) : (
            <div className="no-orders-message">
              <i className="bi bi-cart-x"></i>
              <p>Henüz hiç siparişiniz bulunmuyor.</p>
              <p className="text-white-50">İlk siparişinizi vermek için ürünleri incelemeye başlayın!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyOrders;
