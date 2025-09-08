import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './navbar.jsx';
import './basket.css';

function Basket() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
    };
  
    fetchCart();
    window.addEventListener("storage", fetchCart);
  
    return () => window.removeEventListener("storage", fetchCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleQuantityChange = (name, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.name === name ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const removeFromCart = (name) => {
    const updatedCart = cartItems.filter(item => item.name !== name);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (Number(item.price_tl) || 0) * (item.quantity || 0),
    0
  );

  const formattedPrice = (price) => price.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <>
      <Navbar />
      <div className="basket-page-background">
        <div className="container">
          <h1 className="basket-title">Sepetim</h1>
          {cartItems.length > 0 ? (
            <div className="basket-content">
              {/* Left Column: Items List */}
              <div className="basket-items-list">
                {cartItems.map(item => (
                  <div className="basket-item" key={item.name}>
                    <img src={item.cover} alt={item.name} className="basket-item-image" />
                    <div className="basket-item-details">
                      <div className="name">{item.name}</div>
                      <div className="basket-item-price">{formattedPrice(Number(item.price_tl) || 0)} TL</div>
                    </div>
                    <div className="basket-item-actions">
                      <div className="quantity-controls">
                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.name, item.quantity - 1)}>-</button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.name, item.quantity + 1)}>+</button>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item.name)}>
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Summary */}
              <div className="order-summary">
                <h3>Sipariş Özeti</h3>
                <div className="summary-row">
                  <span>Ara Toplam</span>
                  <span>{formattedPrice(totalPrice)} TL</span>
                </div>
                <div className="summary-row">
                  <span>Kargo</span>
                  <span>Ücretsiz</span>
                </div>
                <div className="summary-row total">
                  <span>Toplam</span>
                  <span>{formattedPrice(totalPrice)} TL</span>
                </div>
                <div className="order-summary-buttons">
                  <button className="btn btn-primary place-order-btn" onClick={() => navigate('/order')}>
                    Siparişi Ver
                  </button>
                  <button className="btn clear-cart-btn" onClick={clearCart}>
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-basket-container">
              <i className="bi bi-cart-x-fill"></i>
              <p>Sepetinizde ürün bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Basket;