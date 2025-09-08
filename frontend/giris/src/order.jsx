import React, { useState } from 'react';
import './order.css';
import Navbar from './navbar.jsx';

const Order = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
   // sepetteki ürünler
   const handleSubmit = async (e) => {
    e.preventDefault();       // Sayfa yenilenmesini engelle
    setIsLoading(true);       // Loading spinner göster
  
    // localStorage'dan gerekli verileri al
    const personId = localStorage.getItem('PersonID');   
    const customerId = localStorage.getItem('CustomerID'); 
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Eğer sepet boşsa uyarı göster
    if(cartItems.length === 0) {
      alert('Sepetiniz boş!');
      setIsLoading(false);
      return;
    }
  
    // Backend’e gönderilecek JSON hazırlanıyor
    const orderData = {
      PersonID: personId,
      deliveryInfo: formData,   // formdaki bilgiler
      items: cartItems.map(item => ({
        phone_name: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price_tl),
        subtotal: Number(item.price_tl) * item.quantity
      })),
      total_price: cartItems.reduce((sum, item) => sum + Number(item.price_tl) * item.quantity, 0)
    };
    console.log("Gönderilecek sipariş verisi:", orderData);
    try {
      const response = await fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)   // form + sepet + personId + customerId
      });
  
      if (!response.ok) throw new Error('Sipariş gönderilemedi!');
  
      const result = await response.json();
      console.log('Backend Response:', result);
  
      // Başarılıysa formu ve sepeti temizle
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: ''
      });
      localStorage.removeItem('cart');  // Sepeti temizle
  
    } catch (error) {
      console.error('Hata:', error);
      alert('Sipariş gönderilemedi, lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="order-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Sipariş Alındı!</h2>
          <p>Siparişiniz başarıyla kaydedildi. En kısa sürede sizinle iletişime geçeceğiz.</p>
          <button onClick={resetForm} className="new-order-btn">
            Yeni Sipariş Ver
          </button>
        </div>
      </div>
    );
  }

  return (
    <> 
    <Navbar />
    <div className="order-container">
      <div className="order-header">
        <div className="header-icon">🛒</div>
        <h1>Sipariş Ver</h1>
        <p>Bilgilerinizi doldurun ve siparişinizi tamamlayın</p>
      </div>

      <div className="order-card">
        <div className="card-header">
          <h3>👤 Kişisel Bilgiler</h3>
          <p>Siparişinizi teslim edebilmemiz için gerekli bilgileri doldurun</p>
        </div>
        
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Ad *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Adınızı girin"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Soyad *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Soyadınızı girin"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">📞 Telefon Numarası *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0555 123 45 67"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">📧 E-posta Adresi *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">📍 Teslimat Adresi *</label>
            <textarea
              id="address"
              name="address"
              placeholder="Tam adresinizi yazın (mahalle, sokak, bina no, daire no vb.)"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-content">
                <div className="spinner"></div>
                Sipariş Gönderiliyor...
              </div>
            ) : (
              <div className="submit-content">
                🛒 Siparişi Tamamla
              </div>
            )}
          </button>
        </form>
      </div>

      <div className="order-footer">
        <p>Güvenli sipariş sistemi ile bilgileriniz korunmaktadır.</p>
      </div>
    </div>
    </>
  );
};

export default Order;
