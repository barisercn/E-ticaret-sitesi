import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './login.css'; // CSS dosyasını import et

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
                console.log("Login response:", data);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', username);
                localStorage.setItem('PersonID', data.PersonID);
                console.log("LocalStorage PersonID:", localStorage.getItem('PersonID'));
                console.log("data.PersonID:", data.PersonID);
              
                navigate("/anasayfa");
                setError("");
            } else {
                setError(data.message || "Kullanıcı adı veya şifre hatalı");
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
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <h2>Giriş Yap</h2>
                <p className="text-muted mb-4">Hesabınıza erişmek için bilgilerinizi girin.</p>
                <form id="Form" onSubmit={handleLogin} autoComplete="off">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label"></label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                placeholder="Kullanıcı adınız"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
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
                                placeholder="Şifreniz"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger text-center mt-3" role="alert">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary">
                        Giriş Yap
                    </button>

                    <div className="extra-links">
                        <span>Hesabın yok mu? </span>
                        <a href="/register" className="text-primary text-decoration-none">
                            Kayıt Ol
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
