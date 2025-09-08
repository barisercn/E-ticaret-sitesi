import React from "react";
import {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./orderCard.css"

function OrderCard({ order }) {
  const [quantity, setQuantity] = useState(order.quantity ?? 1);

  return (
    <div className="order-card">
      {/* Cihaz görseli - Yüksek çözünürlük */}
      <div className="order-card-image-container">
        <img
          src={order.cover ?? "https://via.placeholder.com/400x300?text=No+Image"}
          className="order-card-image"
          alt={order.phone_name ?? "Cihaz Adı Yok"}
          loading="lazy"
        />
      </div>

      {/* Cihaz bilgileri */}
      <div className="order-card-body">
        <h5 className="order-card-title">{order.phone_name ?? "Cihaz Adı Yok"}</h5>
        
        {/* Cihaz özellikleri */}
        <div className="order-card-specs">
          <div className="spec-item">
            <span className="spec-label">Ekran:</span>
            <span className="spec-value">{order.screen ?? "-"}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Hafıza:</span>
            <span className="spec-value">{order.memory ?? "-"}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">İşletim Sistemi:</span>
            <span className="spec-value">
              {Array.isArray(order.os) ? order.os.join(", ") : order.os ?? "-"}
            </span>
          </div>
        </div>

        {/* Sipariş bilgileri */}
        <div className="order-card-pricing">
          <div className="pricing-item">
            <span className="pricing-label">Adet:</span>
            <span className="pricing-value quantity">{quantity}</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-label">Birim Fiyat:</span>
            <span className="pricing-value">{(order.unit_price ?? 0).toLocaleString()} ₺</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-label">Ara Toplam:</span>
            <span className="pricing-value">{(order.subtotal ?? 0).toLocaleString()} ₺</span>
          </div>
          <div className="pricing-item total">
            <span className="pricing-label">Toplam:</span>
            <span className="pricing-value total-price">{(order.total_price ?? 0).toLocaleString()} ₺</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;

