import sql from "mssql";

const config = {
    user: "Test123",
    password: "12131417",
    server: "localhost", // veya localhost\SQLEXPRESS
    database: "Users",    // kendi veritabanın
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log("Bağlantı başarılı!");

    } catch (err) {
        console.error("Bağlantı hatası:", err);
    }
}

connectDB();
export async function getPool() {
    return await sql.connect(config);
  }
  

