import axios from "axios";
import fs from "fs";

const CLONE_API = "http://localhost:8080";
const BRANDS = ["apple", "samsung", "xiaomi", "huawei", "oppo"];
const DEVICE_LIMIT = 15;
const SLEEP_MS = 1000; // isteğe bağlı bekleme

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Tek bir markayı Rope'dan çek
async function fetchOneBrand(brand) {
  try {
    const { data } = await axios.get(`${CLONE_API}/gsm/brand/${brand}`, { timeout: 60000 });
    console.log(`→ ${brand}: Rope’dan ${data.length} cihaz geldi`);

    // Limit uygula ve brand ekle
    return data.slice(0, DEVICE_LIMIT).map(d => ({ ...d, brand }));
  } catch (err) {
    console.error(`✗ ${brand} çekilemedi:`, err.response?.data || err.message);
    return [];
  }
}

// --- Tüm markaları çek
async function fetchAllBrands() {
  const all = [];

  for (const brand of BRANDS) {
    const items = await fetchOneBrand(brand);
    if (items.length === 0) console.warn(`⚠ ${brand} için cihaz listesi boş`);
    all.push(...items);
    await sleep(SLEEP_MS);
  }

  // JSON dosyasını temizle ve kaydet
  const filePath = "brands-sample.json";
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  fs.writeFileSync(filePath, JSON.stringify(all, null, 2), "utf8");
  console.log(`\nToplam cihaz: ${all.length}`);
  console.log(`Kaydedildi: ${filePath}`);

  return all;
}

// --- Ana fonksiyon
(async () => {
  await fetchAllBrands();
})();
