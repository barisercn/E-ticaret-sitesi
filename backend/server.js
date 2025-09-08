import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { checkUserCredentials, saveUser, updatePassword } from "./db.js";
import { saveLoginHistory} from "./loginHistory.js";
import { generateToken, verifyToken } from "./jwt.js";
import bcrypt from 'bcrypt';
import { authMiddleware } from "./authMiddleware.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import { getPool } from "./db2.js";
import createOrder from "./creatOrder.js";
import { getOrdersByCustomer } from "./controllers/myordercontroller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

// Middleware'ler önce tanımlanmalı
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/giris/dist")));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Eksik alan var' });
  }

  checkUserCredentials(username, password, (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Sunucu hatası: ' + err.message });
    }

    if (user) {
      const token = generateToken(user);
    
      const responseData = {
        success: true,
        message: 'Giriş başarılı',
        token: token,
        PersonID: user.PersonID,    // ✅ Burada key adını PersonID yaptık
        username: user.username
      };
    
      res.json(responseData);
    }else {
      res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' });
    }
  });
});


app.post('/api/register', async(req, res) => {
  const { username, password,confirmPassword, email } = req.body;

if (!username || !password || !email || !confirmPassword) {
  return res.status(400).json({ success: false, message: 'Eksik alan var' });
}
if (password !== confirmPassword) {
  return res.status(400).json({ success: false, message: 'Şifreler eşleşmiyor' });
}
const hashedPassword = await bcrypt.hash(password, 10);
const user = { username, password: hashedPassword, email }; 


saveUser(user, (err, success) => {
  if (err) {
    return res.status(500).json({ success: false, message:err.message });
  }
  res.json({ success: true, message: 'Kullanıcı kaydı başarılı' });
});

});
app.post('/api/sifredegistir',authMiddleware, async(req, res) => {

  const { oldPassword, newPassword } = req.body;
  const username = req.user.username; //req.user.username ile kullanıcı adını alıyoruz

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Eksik alan var' });
  }

  updatePassword(username, oldPassword, newPassword, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Sunucu hatası: ' + err.message });
    }
    
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  });
});

// Token doğrulama endpoint'i
app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token gerekli' });
  }
  
  try {
    // Gerçek JWT doğrulaması yap
    const decoded = verifyToken(token);
    
    if (decoded) {
      res.json({ 
        success: true, 
        message: 'Token geçerli',
        user: decoded.userName 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Token geçersiz' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Token kontrol hatası' 
    });
  }
});

// SPA fallback: /api ile başlamayan tüm path'ler için index.html dön

app.get("/products", async (req, res) => {
  try {
    // Query parametresinden url al
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "url parametresi gerekli" });
    }

    // Amazon ürün bilgisini çek
    const product = await fetchAmazonProduct(url);

    // Kullanıcıya geri döndür
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API hatası" });
  }
});
// Sunucuyu dinle
app.use("/brand", deviceRoutes);


app.post("/order", async (req, res) => {
  try {
    const result = await createOrder(req.body); // createOrder artık promise döndürüyor
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }
    console.log(result);
    res.json({ success: true, orderId: result.orderId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası: ' + err.message });
  }
});

app.post("/myOrders", async (req, res) => {
  const { personId } = req.body;
console.log("req.body:", req.body);
console.log("personId:", personId);

  if (!personId) {
    return res.status(400).json({ error: "PersonID gönderilmedi!" });
  }

  try {
    const orders = await getOrdersByCustomer(personId);
    console.log(personId)
    console.log(orders)
    res.json(orders);
    
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/giris/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});

