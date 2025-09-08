import fetch from "node-fetch";

export async function convertPricesToTL(devices) {
    const response = await fetch("http://hasanadiguzel.com.tr/api/kurgetir");
    const data = await response.json();

    const usdKur = data.TCMB_AnlikKurBilgileri.find(
        k => k.CurrencyName === "US DOLLAR" || k.Isim === "ABD DOLARI"
    );

    if (!usdKur) {
        throw new Error("USD kuru bulunamadı!");
    }

    const kur = parseFloat(usdKur.ForexSelling);

    // TL fiyatını ekle, DB’deki price USD
    return devices.map(d => ({
        ...d,
        price_tl: Math.round(d.price * kur * 100) / 100  // price (USD) -> TL
    }));
}
