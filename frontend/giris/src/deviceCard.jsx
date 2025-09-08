import React, { useState, useEffect } from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './deviceCard.css';

function DeviceCard({ device, isCartPage = false, removeFromCart }) {
  const [showAlert, setShowAlert] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find(item => item.name === device.name);
    setQuantity(cartItem ? cartItem.quantity : 1);
    
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some(item => item.name === device.name));
  }, [device.name]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isFavorite) {
      const updated = favorites.filter(item => item.name !== device.name);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(device);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
    window.dispatchEvent(new Event("storage"));
  };

  const addToCart = (e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.name === device.name);
  
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.push({ ...device, price_tl: Number(device.price_tl) || 0, quantity });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    setShowAlert(true);
    window.dispatchEvent(new Event("storage"));
  };

  const updateQuantity = (newQty) => {
    if (newQty < 1) {
      if (isCartPage && removeFromCart) {
        removeFromCart(device.name);
      }
      return;
    }
  
    setQuantity(newQty);
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.name === device.name);
  
    if (existingItem) {
      existingItem.quantity = newQty;
    } else {
      cart.push({ ...device, price_tl: Number(device.price_tl) || 0, quantity: newQty });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    updateQuantity(quantity + 1);
  };
  
  const handleSubtract = (e) => {
    e.stopPropagation();
    updateQuantity(quantity - 1);
  };

  return (
    <div className="card">
      <div className="image-container">
        {isCartPage && removeFromCart && (
          <button onClick={(e) => { e.stopPropagation(); removeFromCart(device.name); }} className="btn remove-btn">
            <i className="bi bi-x-lg"></i>
          </button>
        )}

        {!isCartPage && (
            <button onClick={toggleFavorite} className="btn favorite-btn">
                <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"}></i>
            </button>
        )}

        <img src={device.cover} className="card-img-top" alt={device.name} />
      </div>

      <div className="card-body">
        <h5 className="card-title">{device.name}</h5>
        <ul className="device-specs">
          <li><strong>Ekran:</strong> {device.screen}</li>
          <li><strong>Hafıza:</strong> {device.memory}</li>
          <li><strong>İşlemci:</strong> {device.cpu}</li>
          <li><strong>İşletim Sistemi:</strong> {device.os}</li>
          <li><strong>Fiyat:</strong> {device.price_tl} TL</li>
        </ul>
      </div>

      <div className="card-footer">
        {!isCartPage && (
          <>
            <div className="quantity-controls">
              <button className="quantity-btn" onClick={handleSubtract}>-</button>
              <span className="quantity-display">{quantity}</span>
              <button className="quantity-btn" onClick={handleAdd}>+</button>
            </div>
            
            {showAlert ? (
              <button className="btn add-to-cart-btn success" disabled>
                <i className="bi bi-check-circle-fill me-2"></i>Sepete Eklendi!
              </button>
            ) : (
              <button className="btn add-to-cart-btn" onClick={addToCart}>
                <i className="bi bi-cart-plus-fill me-2"></i>Sepete Ekle
              </button>
            )}
          </>
        )}
        {isCartPage && (
            <div className="quantity-controls mx-auto">
              <button className="quantity-btn" onClick={handleSubtract}>-</button>
              <span className="quantity-display">{quantity}</span>
              <button className="quantity-btn" onClick={handleAdd}>+</button>
            </div>
        )}
      </div>
    </div>
  );
}

export default DeviceCard;