import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './sifredegistir.css'; // Yeni CSS dosyasını import et
import { useNavigate } from "react-router-dom";

function Sifredegistir() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== newConfirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      setMessage("");
      return;
    }

    if (!oldPassword || !newPassword) {
      setError("Tüm alanları doldurmanız gerekmektedir.");
      setMessage("");
      return;
    }
    
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/sifredegistir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
    
      const data = await response.json();
    
      if (data.success) {
        setMessage("Şifre başarıyla değiştirildi. Yönlendiriliyorsunuz...");
        setError("");
        setOldPassword("");
        setNewPassword("");
        setNewConfirmPassword("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Şifre değiştirilemedi.");
        setMessage("");
      }
    } catch (err) {
      setError("Sunucuya bağlanırken bir hata oluştu.");
      setMessage("");
    }
  };

  return (
    <div className="sifre-degistir-container">
      <div className="sifre-degistir-form">
        <h2 className="text-center">Şifre Değiştir</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-3">
            <label htmlFor="oldPassword" >Eski Şifre</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                id="oldPassword"
                type="password"
                className="form-control"
                placeholder="Eski şifrenizi girin"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword"></label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-key-fill"></i>
              </span>
              <input
                id="newPassword"
                type="password"
                className="form-control"
                placeholder="Yeni şifrenizi oluşturun"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword"></label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-key-fill"></i>
              </span>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Yeni şifrenizi tekrar girin"
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {message && <div className="alert alert-success text-center">{message}</div>}

          <button type="submit" className="btn btn-primary mt-3">
            
          </button>
        </form>
      </div>
    </div>
  );
}

export default Sifredegistir;
