import sql from 'mssql';
import { getPool } from "../db2.js"; 


export const getOrdersByCustomer = async (personIdParam) => {
  const personId = Number(personIdParam);

  
  
  const pool = await getPool();

  // 1️⃣ PersonID ile customer_id al
  const customerResult = await pool.request()
    .input("personId", sql.Int, personId)
    .query(`SELECT customer_id FROM customers WHERE PersonID = @personId`);

  if (customerResult.recordset.length === 0) {
    throw new Error("PersonID için customer_id bulunamadı");
  }

  const customerId = customerResult.recordset[0].customer_id;

  // 2️⃣ Orders sorgusu
  const result = await pool.request()
    .input("customerId", sql.Int, customerId)
    .query(`
      SELECT 
           o.order_id,
    o.order_date,
    o.total_price,
    i.phone_name,
    i.quantity,
    i.unit_price,
    i.subtotal,
    p.screen,
    p.os,
    p.memory,
    p.os,
    p.cover
FROM orders o
LEFT JOIN order_items i ON o.order_id = i.order_id
LEFT JOIN phones p ON i.phone_name = p.name
WHERE o.customer_id = @customerId
ORDER BY o.order_date DESC;
    `);

  return result.recordset; // Array olarak döner
};



