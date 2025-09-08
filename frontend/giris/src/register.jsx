import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './register.css'; // Yeni CSS dosyasını import et

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        navigate("/login"); // Kayıt başarılı olunca login'e yönlendir
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword, email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        setError("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
      } else {
        setError(data.message || "Kayıt sırasında bir hata oluştu.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı");
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-form-wrapper">
        <h2>Hesap Oluştur</h2>
        <p className="text-muted mb-4">Yeni bir hesap oluşturmak için bilgileri doldurun.</p>
        <form id="Form" onSubmit={handleRegister} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="username" className="form-label"></label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Bir kullanıcı adı seçin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label"></label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label"></label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="En az 8 karakterli bir şifre oluşturun"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label"></label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
          {message && <div className="alert alert-success text-center mt-3">{message}</div>}

          <button type="submit" className="btn btn-primary">
            Kayıt Ol
          </button>

          <div className="login-link">
            <span>Zaten bir hesabın var mı? </span>
            <a href="/login" className="text-primary text-decoration-none">Giriş Yap</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
