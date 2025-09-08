// db.js
import sql from 'msnodesqlv8';
import bcrypt from "bcrypt";

const connectionString = 
  "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-J5J3UPJ\\SQL;Database=Users;Trusted_Connection=Yes;";

  function checkUserCredentials(username, password, callback) {
    sql.open(connectionString, (err, conn) => {
      if (err) {
        return callback(err);
      }
      const query = `SELECT PersonID, username, password FROM dbo.person WHERE username = ?`;
      conn.query(query, [username], async (err, rows) => {
        conn.close();
        if (err) {
          return callback(err);
        }
        if (rows.length == 0) {
          return callback(null, null); // kullanıcı bulunamadı
        }
  
        const user = rows[0]; // { id, username, password, email }
        try {
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return callback(null, null); // şifre yanlış
          }
          // şifre doğru → user objesini döndür
          callback(null, {
            PersonID: user.PersonID,
            username: user.username,
           
          });
        } catch (error) {
          callback(error);
        }
      });
    });
  }
  

function saveUser(user, callback) {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      return callback(err);
    }
    const checkQuery = `SELECT COUNT(*) AS count FROM dbo.person WHERE username = ?`;
    conn.query(checkQuery, [user.username], (err, rows) => {
      if (err) {
        conn.close();
        return callback(err);
      }
      if (rows[0].count > 0) {
        conn.close();
        return callback(new Error("Kullanıcı adı zaten mevcut!"));
      }
      const query = `INSERT INTO dbo.person (username, password, email) VALUES (?, ?, ?)`;
      conn.query(query, [user.username, user.password, user.email], (err) => {
        conn.close();
        if (err) {
          return callback(err);
        }
        callback(null, true);
      });
    });
  });
}

function updatePassword(username, oldPassword, newPassword, callback) {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      return callback(err);
    }
    const findUserQuery = `SELECT password FROM dbo.person WHERE username = ?`;
    conn.query(findUserQuery, [username], async (err, rows) => {
      if (err) {
        conn.close();
        return callback(err);
      }
      if (rows.length === 0) {
        conn.close();
        return callback(null, { success: false, message: "Kullanıcı bulunamadı" });
      }
      const hashedPassword = rows[0].password;
      try {
        const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
        if (!isMatch) {
          conn.close();
          return callback(null, { success: false, message: "Eski şifre hatalı" });
        }
        if (newPassword.length < 8) {
          conn.close();
          return callback(null, { success: false, message: "Yeni şifre en az 8 karakter olmalıdır" });
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = `UPDATE dbo.person SET password = ? WHERE username = ?`;
        conn.query(updateQuery, [newHashedPassword, username], (err) => {
          conn.close();
          if (err) {
            return callback(err);
          }
          callback(null, { success: true, message: "Şifre başarıyla güncellendi" });
        });
      } catch (error) {
        conn.close();
        return callback(error);
      }
    });
  });
}

export { checkUserCredentials, saveUser, updatePassword };
