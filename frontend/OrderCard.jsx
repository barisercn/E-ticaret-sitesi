import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function OrderCard({ order }) {
  return (
    <div className="card h-100 shadow-sm" style={{ borderRadius: "15px" }}>
      {/* Üstte telefon görseli */}
      <img 
        src={order.cover} 
        className="card-img-top" 
        alt={order.phone_name} 
        style={{ 
          borderTopLeftRadius: "15px", 
          borderTopRightRadius: "15px", 
          maxHeight: "220px", 
          objectFit: "contain" 
        }}
      />

      <div className="card-body d-flex flex-column">
        {/* Telefon Adı */}
        <h5 className="card-title">{order.phone_name}</h5>
        
        {/* Sipariş Bilgileri */}
        <p className="card-text"><strong>Order ID:</strong> {order.order_id}</p>
        <p className="card-text"><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
        <p className="card-text"><strong>Total:</strong> {order.total_price.toLocaleString()} ₺</p>

        {/* Ürün Bilgileri */}
        <p className="card-text"><strong>Quantity:</strong> {order.quantity}</p>
        <p className="card-text"><strong>Unit Price:</strong> {order.unit_price.toLocaleString()} ₺</p>
        <p className="card-text"><strong>Subtotal:</strong> {order.subtotal.toLocaleString()} ₺</p>

        {/* Telefon Özellikleri */}
        <hr />
        <p><strong>Screen:</strong> {order.screen}</p>
        <p><strong>Memory:</strong> {order.memory}</p>

        <p><strong>OS:</strong></p>
        <ul>
          {Array.isArray(order.os) ? (
            order.os.map((osItem, idx) => <li key={idx}>{osItem}</li>)
          ) : (
            <li>{order.os}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default OrderCard;
