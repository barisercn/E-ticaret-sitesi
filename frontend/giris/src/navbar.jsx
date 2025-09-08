import React, { useState, useRef, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import "./improved-navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const profileRef = useRef(null);

  // Çıkış fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    navigate('/login');
  };

  // Sepet sayısını ve toplam fiyatı güncelle
  useEffect(() => {
    const updateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce(
        (sum, item) => sum + (Number(item.price_tl) * Number(item.quantity)),
        0
      );

      const formattedPrice = total.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      setCartTotal(formattedPrice);
    };

    updateCartTotal();

    window.addEventListener("storage", updateCartTotal);
    return () => {
      window.removeEventListener("storage", updateCartTotal);
    };
  }, []);

  // Dropdown dışına tıklayınca kapanması - Düzeltilmiş versiyon
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Sadece dropdown açıkken kontrol et
      if (open && profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Sadece dropdown açıkken event listener ekle
    if (open) {
      // Kısa bir gecikme ile ekle ki mevcut click event'i tamamlansın
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  // Debug için console log
  console.log("Dropdown open state:", open);

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Sol taraf - Ana menü öğeleri */}
        <div className="navbar-left">
          <div className="nav-item" onClick={() => navigate("/anasayfa")}>
            <i className="bi bi-house-door-fill"></i>
            <span>Anasayfa</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/brands")}>
            <i className="bi bi-phone-fill"></i>
            <span>Markalar</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/myOrders")}>
            <i className="bi bi-box-seam-fill"></i>
            <span>Siparişlerim</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/favorites")}>
            <i className="bi bi-heart-fill"></i>
            <span>Favorilerim</span>
          </div>
        </div>

        {/* Sağ taraf - Sepet ve profil */}
        <div className="navbar-right">
          <div className="cart-item" onClick={() => navigate("/basket")}>
            <i className="bi bi-basket-fill"></i>
            <span className="cart-text">
              Sepetim <span className="cart-total">{cartTotal} TL</span>
            </span>
          </div>

          <div className="profile-container" ref={profileRef}>
            <div
              className="profile-item"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Profile clicked, current state:", open);
                setOpen(!open);
              }}
            >
              <i className="bi bi-person-circle"></i>
              <span>Profilim</span>
              <i className={`bi bi-chevron-${open ? 'up' : 'down'} chevron-icon`}></i>
            </div>

            {/* Dropdown menü - Koşullu render */}
            {open && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div 
                  className="dropdown-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Profil tıklandı");
                    setOpen(false);
                  }}
                >
                  <i className="bi bi-person"></i>
                  <span>Profil</span>
                </div>
                <div 
                  className="dropdown-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    navigate("/sifredegistir");
                  }}
                >
                  <i className="bi bi-key"></i>
                  <span>Şifre Değiştir</span>
                </div>
                <div 
                  className="dropdown-item logout-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Çıkış</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
