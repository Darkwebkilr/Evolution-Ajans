import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const SITEMAP_PATH =
    process.env.SITEMAP_PATH ||
    (fs.existsSync("./dist/sitemap-0.xml")
        ? "./dist/sitemap-0.xml"
        : "./dist/sitemap-index.xml");

// Kimlik bilgilerini güvenli şekilde al (.env GOOGLE_CREDENTIALS_JSON veya service-account.json)
function getCredentials() {
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
        try {
            return JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
        } catch (e) {
            throw new Error(".env dosyasındaki GOOGLE_CREDENTIALS_JSON geçerli bir JSON değil!");
        }
    }

    // Alternatif olarak service-account.json dosyasından oku
    if (fs.existsSync("./service-account.json")) {
        return JSON.parse(fs.readFileSync("./service-account.json", "utf-8"));
    }

    throw new Error(
        "Google kimlik bilgileri bulunamadı! Lütfen .env dosyasına GOOGLE_CREDENTIALS_JSON ekleyin veya kök dizine service-account.json dosyasını koyun."
    );
}

// XML dosyasından URL'leri ayrıştıran yardımcı fonksiyon
async function extractUrlsFromSitemap(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Sitemap dosyası bulunamadı: ${filePath}`);
    }

    const xmldata = fs.readFileSync(filePath, "utf-8");
    const result = await parseStringPromise(xmldata);
    const urls = [];

    // Standart urlset içeren sitemap ise (<url><loc>...</loc></url>)
    if (result.urlset && Array.isArray(result.urlset.url)) {
        for (const item of result.urlset.url) {
            const loc = Array.isArray(item.loc) ? item.loc[0] : item.loc;
            if (loc) urls.push(loc.trim());
        }
    }

    // Eğer sitemap index ise (<sitemap><loc>...</loc></sitemap>)
    if (result.sitemapindex && Array.isArray(result.sitemapindex.sitemap)) {
        const sitemapDir = path.dirname(filePath);
        for (const sitemapItem of result.sitemapindex.sitemap) {
            const sitemapLoc = Array.isArray(sitemapItem.loc)
                ? sitemapItem.loc[0]
                : sitemapItem.loc;

            // Yerel dosya adını tespit et (örn: sitemap-0.xml)
            const filename = path.basename(new URL(sitemapLoc).pathname);
            const localSubSitemap = path.join(sitemapDir, filename);

            if (fs.existsSync(localSubSitemap)) {
                const subUrls = await extractUrlsFromSitemap(localSubSitemap);
                urls.push(...subUrls);
            }
        }
    }

    return [...new Set(urls)]; // Tekrar edenleri temizle
}

async function startIndexing() {
    try {
        const credentials = getCredentials();

        // 1. Sitemap Okuma
        console.log(`🔍 Sitemap taranıyor: ${SITEMAP_PATH}`);
        const allUrls = await extractUrlsFromSitemap(SITEMAP_PATH);

        if (allUrls.length === 0) {
            console.log("ℹ️ Sitemaptan taranacak URL bulunamadı. İşlem durduruldu.");
            return;
        }

        console.log(`📊 Toplam Gönderilecek URL: ${allUrls.length}`);
        console.log("🚀 Google Indexing API gönderimi başlatılıyor...\n");

        // 2. Auth Yapılandırması
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/indexing"],
        });
        const authClient = await auth.getClient();
        const indexing = google.indexing("v3");

        let successCount = 0;
        let failCount = 0;

        // 3. URL'leri Doğrudan Gönder (DB / Geçmiş kaydı tutulmaz)
        for (let i = 0; i < allUrls.length; i++) {
            const url = allUrls[i];
            try {
                await indexing.urlNotifications.publish({
                    auth: authClient,
                    requestBody: {
                        url: url,
                        type: "URL_UPDATED",
                    },
                });

                console.log(`✅ [${i + 1}/${allUrls.length}] OK: ${url}`);
                successCount++;
            } catch (error) {
                console.log(
                    `❌ [${i + 1}/${allUrls.length}] Hata (${url}): ${error.response?.data?.error?.message || error.message
                    }`
                );
                failCount++;

                // Eğer günlük kota dolduysa döngüyü sonlandır
                if (error.response?.status === 429) {
                    console.log("⚠️ Günlük kota doldu (429 Quota Exceeded)!");
                    break;
                }
            }

            // API limitlerini zorlamamak için kısa bekleme (100ms)
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log("\n------------------------------------------------");
        console.log(`🏁 İşlem tamamlandı.`);
        console.log(`✅ Başarılı: ${successCount}`);
        console.log(`❌ Hatalı: ${failCount}`);
        console.log("------------------------------------------------");
    } catch (error) {
        console.log(`💥 Kritik Hata: ${error.message}`);
    }
}

startIndexing();
