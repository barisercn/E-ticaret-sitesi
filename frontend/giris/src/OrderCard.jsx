import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./orderCard.css";

function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="order-card-group">
      <div className="order-card-header" onClick={toggleExpansion}>
        <div className="header-item">
          <span className="label">Sipariş No</span>
          <span className="value">#{order.orderId}</span>
        </div>
        <div className="header-item">
          <span className="label">Tarih</span>
          <span className="value">{order.orderDate}</span>
        </div>
        <div className="header-item">
          <span className="label">Toplam Tutar</span>
          <span className="value total-price">{order.totalPrice.toLocaleString()} ₺</span>
        </div>
        <div className="header-item toggle-icon-container">
            <div className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                <i className="bi bi-chevron-down"></i>
            </div>
        </div>
      </div>

      {isExpanded && (
        <div className="order-items-container">
          {order.items.map((item, index) => (
            <div className="order-item" key={index}>
              <img src={item.cover} alt={item.name} className="order-item-image" />
              <div className="order-item-details">
                <span className="name">{item.name}</span>
                <span className="info">Adet: {item.quantity}</span>
              </div>
              <div className="order-item-price">
                <span className="value">{(item.price * item.quantity).toLocaleString()} ₺</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderCard;