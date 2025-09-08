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

let pool;

export const getPool = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("SQL pool oluşturuldu");
    }
    return pool;
  } catch (err) {
    console.error("Veritabanı bağlantı hatası:", err);
    throw err;
  }
};

  
