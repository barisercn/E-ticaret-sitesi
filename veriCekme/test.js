import axios from "axios";

const CLONE_API = "http://localhost:8080";
const TEST_BRANDS = ["xiaomi", "huawei", "oppo"];

async function testBrand(brand) {
  try {
    const { data } = await axios.get(`${CLONE_API}/gsm/brand/${brand}`, { timeout: 60000 });
    console.log(`✓ ${brand}: ${data.length} cihaz`);
    data.forEach((device, i) => {
      console.log(`  ${i + 1}. ${device.name} - ${device.price || "Fiyat yok"}`);
    });
  } catch (err) {
    console.error(`✗ ${brand} çekilemedi:`, err.response?.data || err.message);
  }
}

(async () => {
  for (const brand of TEST_BRANDS) {
    await testBrand(brand);
  }
})();
