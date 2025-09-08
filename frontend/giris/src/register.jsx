import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
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
      return () => clearTimeout(timer); // Component yeniden render olursa eski timer iptal edilir
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const handleRegister = async (e) => {
    e.preventDefault();


    // Şifre eşleşme kontrolü
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setMessage("");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır");
      setMessage("");
      setPassword("");
      setConfirmPassword("");
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
        setMessage("Kullanıcı kaydı başarılı");
        setError("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
      } else {
        setError(data.message);
        setMessage("");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı");
      setMessage("");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="container mt-5">
      <form id="Form" onSubmit={handleRegister}>
        <h4 style={{ textAlign: "center", color: "blue", marginBottom: "30px" }}>
          Kullanıcı Kayıt Formu
        </h4>

        <div className="mb-1" style={{ maxWidth: "450px", margin: "0 auto" }}>
          <label htmlFor="username" className="form-label ms-3">
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-1" style={{ maxWidth: "450px", margin: "0 auto" }}>
          <label htmlFor="password" className="form-label ms-3">
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-1" style={{ maxWidth: "450px", margin: "0 auto" }}>
          <label htmlFor="confirmPassword" className="form-label ms-3">
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Şifre Tekrar"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-1" style={{ maxWidth: "450px", margin: "0 auto" }}>
          <label htmlFor="email" className="form-label ms-3">
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ maxWidth: "450px", margin: "40px auto 0", textAlign: "center" }}>
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Kayıt Ol
          </button>
        </div>
        <div style={{ maxWidth: "450px", margin: "20px auto 0", textAlign: "center" }}>
          <p>
            <a href="/login" className="text-primary" style={{ textDecoration: "none" }}>
              Zaten hesabınız var mı? Giriş yapın
            </a>
          </p>
        </div>
        {error && (
          <div
            className="alert alert-danger mt-3"
            style={{ maxWidth: "450px", margin: "40px auto 0", textAlign: "center" }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            className="alert alert-success mt-3"
            style={{ maxWidth: "450px", margin: "40px auto 0", textAlign: "center" }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default RegisterForm;
