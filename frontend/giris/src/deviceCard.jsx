import React, { useState, useEffect } from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './deviceCard.css';


function DeviceCard({ device, isCartPage = false, removeFromCart }) {
  const [showAlert, setShowAlert] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Component mount: localStorage'den quantity al
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find(item => item.name === device.name);
    setQuantity(cartItem ? cartItem.quantity : 1); // Sepette varsa al, yoksa 1
    
    // Favori durumunu kontrol et
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some(item => item.name === device.name));
  }, [device.name]);

  // Alert'i otomatik olarak kapat
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000); // 2 saniye sonra kapat
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const toggleFavorite = () => {
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

  // Sepete ekle
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.name === device.name);
  
    if (existingItem) {
      // quantity zaten state'de var
      existingItem.quantity = quantity;
    } else {
      // ürün yoksa quantity state'ine göre ekle
      cart.push({ ...device, price_tl: Number(device.price_tl) || 0, quantity });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    setShowAlert(true);
    window.dispatchEvent(new Event("storage"));
  };

  // Quantity butonları
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
      // Sepette varsa quantity güncelle
      existingItem.quantity = newQty;
    } else {
      // Sepette yoksa DevicePage'den artırıyorsa ekle
      cart.push({ ...device, price_tl: Number(device.price_tl) || 0, quantity: newQty });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleAdd = () => updateQuantity(quantity + 1);
  const handleSubtract = () => updateQuantity(quantity - 1);

  return (
    <div className="card h-100 d-flex flex-column position-relative">
      {/* Sepet sayfasında sağ üst çarpı - Sabit pozisyon */}
      {isCartPage && removeFromCart && (
        <button
          onClick={() => removeFromCart(device.name)}
          className="btn btn-sm btn-danger position-absolute remove-btn"
          style={{ 
            top: "10px", 
            right: "10px", 
            zIndex: 10,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0"
          }}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}

      <div className="image-container">
        <img
          src={device.cover}
          className="card-img-top"
          alt={device.name}
        />
      </div>
      
      <div className="card-body flex-grow-1">
        <h5 className="card-title text-center fw-bold">{device.name}</h5>
        <ul className="list-unstyled mb-0">
          <li><strong>Ekran:</strong> {device.screen}</li>
          <li><strong>Hafıza:</strong> {device.memory}</li>
          <li><strong>İşlemci:</strong> {device.cpu}</li>
          <li><strong>İşletim Sistemi:</strong> {device.os}</li>
          <li><strong>Fiyat:</strong> {device.price_tl} TL</li>
        </ul>
      </div>

      <div className="card-footer">
        {/* Sepete eklendi alert */}
        {showAlert && (
          <div className="alert alert-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            {device.name} sepete eklendi!
          </div>
        )}

        {/* Quantity butonları - HER ZAMAN GÖSTER */}
        <div className="quantity-controls">
          <button className="btn btn-outline-secondary quantity-btn" onClick={handleSubtract}>-</button>
          <span className="quantity-display">{quantity}</span>
          <button className="btn btn-outline-secondary quantity-btn" onClick={handleAdd}>+</button>
        </div>

        {/* Sepete Ekle ve Favori butonları - Sadece sepet sayfası değilse göster */}
        {!isCartPage && (
          <div className="action-buttons">
            <button className="btn btn-primary add-to-cart-btn" onClick={addToCart}>
              Sepete Ekle
            </button>
            <button className="btn btn-outline-danger favorite-btn" onClick={toggleFavorite}>
              <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"}></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeviceCard