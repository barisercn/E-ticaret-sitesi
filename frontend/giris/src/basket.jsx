import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar.jsx';
import DeviceCard from './deviceCard.jsx'; // Sepet için kart componenti

function Basket() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
    };
  
    fetchCart(); 
    window.addEventListener("storage", fetchCart); // sepete ekleme olursa çalışsın
  
    return () => window.removeEventListener("storage", fetchCart);
  }, []);
  const removeFromCart = (name) => {
    const updatedCart = cartItems.filter(item => item.name !== name); // seçileni çıkar
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // localStorage güncelle
    window.dispatchEvent(new Event("storage")); // Navbar’ı güncelle
  };

  // Toplam fiyat hesaplama
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (Number(item.price_tl) || 0) * (Number(item.quantity) || 0),
    0
  );
  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    setCartItems([]);
    window.dispatchEvent(new Event("storage"));
  };
  const formattedPrice = totalPrice.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <>
      <Navbar />

      <div style={{ backgroundColor: "#e28743", minHeight: "100vh" }}>
        <div className="container pt-4">
          <div className="row"> <h2 className="text-center text-white fw-bold mb-2" style={{fontSize: "2rem" , backgroundColor: "#e28743" }} >Sepetim</h2></div>
         
          <div className="row g-4">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div className="col-md-4" key={item.name}>
                  <DeviceCard device={item} isCartPage={true}
                 removeFromCart={removeFromCart} 
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-white fs-5">Sepetiniz boş.</p>
            )}
          </div>

          {cartItems.length > 0 && (
            <>
             <div class="d-grid gap-2 col-6 mx-auto">
             <button 
  className="btn btn-primary mt-3" 
  type="button" 
  onClick={() => navigate('/order')}
>
  Sipariş Ver Tutar: {formattedPrice} TL
</button>
  <button class="btn btn-danger mt-1" type="button" onClick={clearCart}>sepeti boşalt</button>
</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Basket;
