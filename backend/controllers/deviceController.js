import { getPool } from "../db2.js"; 
import sql from "mssql";
import { convertPricesToTL } from "../convertPrice.js";

export const getDevicesByBrand = async (req, res) => {
  const { brandid } = req.params;

  try {
    const pool = await getPool();

    const result = await pool.request()
      .input("brandId", sql.Int, parseInt(brandid))
      .query(`
        SELECT *
        FROM dbo.phones
        WHERE brand_id = @brandId
      `);

    let devices = result.recordset || [];

    // TL fiyatını ekle
    const devicesWithTL = await convertPricesToTL(devices);

    // Frontend’e sadece TL fiyatı ile cihazları gönder
    res.json(devicesWithTL);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Veri çekilemedi" });
  }
};
