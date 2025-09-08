import jwt from "jsonwebtoken";

const JWT_SECRET = "gizli anahtar";
const JWT_EXPIRES_IN = "1"; // 24 saat

function generateToken(user) {
  const payload = { 
    sub: user.PersonID,   // JWT standardında subject (sub) genellikle user id için kullanılır
    username: user.username,
    PersonID: user.PersonID  // frontend’de localStorage’a kaydetmek için eklenebilir
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
    issuer: "my-app",
    audience: "my-app-users"
  });
}


function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET, {
        issuer: "my-app",
        audience: "my-app-users"
      });
}

export { generateToken, verifyToken };
