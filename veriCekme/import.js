import { getPool } from "./db.js";
import fs from "fs";
import sql from "mssql";
const BRAND_MAP = {
    apple: 1,
    samsung: 2,
    xiaomi: 3,
    oppo: 4,
    huawei: 5
  };
  async function importData() {
    const rawData = fs.readFileSync("brands-sample.json", "utf8");
    const devices = JSON.parse(rawData);
  
    const pool = await getPool();
  
    for (const d of devices) {
      const brandId = BRAND_MAP[d.brand.toLowerCase()] || null;
      if (!brandId) {
        console.warn(`⚠ Marka bulunamadı: ${d.brand}`);
        continue;
      }
  
      try {
        // Önce kaydın var olup olmadığını kontrol et
        const exists = await pool.request()
          .input("name", sql.NVarChar, d.name)
          .query("SELECT 1 FROM dbo.phones WHERE name = @name");
      
        if (exists.recordset.length === 0) {
          // Kayıt yoksa ekle
          await pool.request()
            .input("name", sql.NVarChar, d.name)
            .input("cover", sql.NVarChar, d.cover)
            .input("screen", sql.NVarChar, d.screen)
            .input("memory", sql.NVarChar, d.memory)
            .input("cpu", sql.NVarChar, d.cpu)
            .input("os", sql.NVarChar, d.os)
            .input("brand_id", sql.Int, brandId)
            .query(`
              INSERT INTO dbo.phones(name, cover, screen, memory, cpu, os, brand_id)
              VALUES (@name, @cover, @screen, @memory, @cpu, @os, @brand_id)
            `);
          console.log(`✅ Eklendi: ${d.name}`);
        } else {
          console.log(`⚠️ Zaten var: ${d.name}, eklenmedi`);
        }
        console.log(`✅ Eklendi: ${d.name}`);
      } catch (err) {
        console.error(`❌ Eklenemedi: ${d.name}`, err.message);
      }
    }
  
    pool.close();
  }
  
  importData();