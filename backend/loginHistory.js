import sql from 'msnodesqlv8';

const connectionString = 
  "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-J5J3UPJ\\SQL;Database=Users;Trusted_Connection=Yes;";

function saveLoginHistory(username, token, callback) {
    // Veritabanına bağlan
    sql.open(connectionString, (err, conn) => {
      if (err) {
        return callback(err);
      }
  
      // 1. PersonID'yi bul
      const findPersonQuery = `SELECT PersonID FROM dbo.person WHERE [username] = ?`;
      
      conn.query(findPersonQuery, [username], (err, personRows) => {
        if (err) {
          conn.close();
          return callback(err);
        }
  
        if (personRows.length === 0) {
          conn.close();
          return callback(new Error('Kullanıcı bulunamadı'));
        }
  
        const personID = personRows[0].PersonID;
  
        // 2. LoginHistory'ye kaydet
        const insertQuery = `
          INSERT INTO dbo.LoginHistory (PersonID, Username, Token, LoginDate)
          VALUES (?, ?, ?, GETDATE())
        `;
  
        conn.query(insertQuery, [personID, username, token], (err, result) => {
          conn.close();
          
          if (err) {
            return callback(err);
          }
          
          callback(null, true);
        });
      });
    });
  }

  export { saveLoginHistory};