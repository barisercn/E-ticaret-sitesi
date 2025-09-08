import express from "express";
import axios from "axios";
import fs from "fs";

const PORT = 5000;

// Klon API base URL
const CLONE_API = "http://localhost:8080";

const BRANDS = ["huawei", "oppo"]; // çekmek istediğin markalar

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOneBrand(brand) {
  const url = `${CLONE_API}/gsm/brand/${brand}`;
  console.log(`→ GET ${url}`);
  const { data } = await axios.get(url, { timeout: 30000 });
  return data.map(item => ({ ...item, brand }));
}

async function main() {
  const all = [];

  for (const brand of BRANDS) {
    try {
      const items = await fetchOneBrand(brand);
      console.log(`✓ ${brand}: ${items.length} cihaz`);
      all.push(...items);
      await sleep(500);
    } catch (err) {
      console.error(`✗ ${brand} çekilemedi:`, err.response?.status || err.message);
    }
  }

  // Veriyi dosyaya yaz
  fs.writeFileSync("brands-sample.json", JSON.stringify(all, null, 2), "utf8");
  console.log(`\nToplam cihaz: ${all.length}`);
  console.log(`Kaydedildi: brands-sample.json`);
}

main();
