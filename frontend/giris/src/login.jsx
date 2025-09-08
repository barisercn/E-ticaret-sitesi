import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function LoginForm() {
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
        const handleLogin = async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('/api/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();

                if (data.success) {
                    // Token'ı localStorage'a kaydet
                    console.log("Login response:", data);

                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('PersonID', data.PersonID);
                    console.log("LocalStorage PersonID:", localStorage.getItem('PersonID')); // <<< burası 30 mu bakconsole.log("data.PersonID:", data.PersonID);
                  
                    navigate("/anasayfa");
                    setError("");
                } else {
                    setError(data.message || "kullanici adi veya şifre hatalı");
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                }
            } catch (err) {
                setError("Sunucuya bağlanılamadı");
                setTimeout(() => setError(""), 3000);
            }
        };


        return (
            <div className="container mt-5">
                <form id="Form" onSubmit={handleLogin} autoComplete="off">
                    <div className="d-flex flex-column align-items-center mb-4">
                        <h2 className="mb-4">Giriş Yapınız.</h2>

                        <div className="input-group mb-3" style={{ maxWidth: "440px" }}>
                            <span className="input-group-text">
                                <i className="bi bi-person-fill"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Kullanıcı Adı"
                                aria-label="Username"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group mb-3" style={{ maxWidth: "440px" }}>
                            <span className="input-group-text">
                                <i className="bi bi-lock-fill"></i>
                            </span>
                            <input
                                placeholder="Şifre"
                                type="password"
                                className="form-control"
                                id="exampleInputPassword1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div
                                className="alert alert-danger text-center align-items-center"
                                role="alert"
                                style={{ width: "440px" }}
                            >
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Giriş Yap
                        </button>
                        
                        {/* Register linki ekleyin */}
                        <div className="mt-3">
                            <span>Hesabınız yok mu? </span>
                            <a href="/register" className="text-primary text-decoration-none">
                                Kayıt Ol
                            </a>
                        </div>

                    </div>
                    
                </form>
            </div>
        );
    }

    export default LoginForm;
