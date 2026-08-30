import { google } from "googleapis";
import fs from "fs";
import { districts } from "./src/components/data/districts.js";

const KEY_FILE = "./service-account.json";
const STATE_FILE = "./indexed-urls.json";
const BASE_URL = "https://evolutionajans.com";

// Services lists to generate subpage URLs
const services = ["web-tasarim", "reklam-yonetimi", "google-haritalar-seo", "seo"];

async function main() {
  // 1. Check if Service Account JSON key file exists
  if (!fs.existsSync(KEY_FILE)) {
    console.error("\x1b[31m%s\x1b[0m", "HATA: service-account.json dosyası bulunamadı!");
    console.log("------------------------------------------------------------------");
    console.log("Lütfen Google Cloud Console'dan indirdiğiniz JSON anahtar dosyasını");
    console.log("projenizin kök dizinine (package.json yanına) ekleyin ve adını");
    console.log("service-account.json olarak güncelleyin.");
    console.log("------------------------------------------------------------------");
    process.exit(1);
  }

  // 2. Load previously successfully indexed URLs
  let indexedUrls = [];
  if (fs.existsSync(STATE_FILE)) {
    try {
      indexedUrls = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      if (!Array.isArray(indexedUrls)) {
        indexedUrls = [];
      }
    } catch (e) {
      console.warn("indexed-urls.json dosyası okunamadı, yeni liste oluşturuluyor.");
      indexedUrls = [];
    }
  }

  // 3. Read key file and initialize Google JWT Auth
  const key = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
  const jwtClient = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/indexing"]
  });

  console.log("Google API kimlik doğrulaması yapılıyor...");
  
  jwtClient.authorize(async (err) => {
    if (err) {
      console.error("\x1b[31m%s\x1b[0m", "Kimlik doğrulama başarısız oldu:", err.message);
      return;
    }
    
    console.log("\x1b[32m%s\x1b[0m", "Kimlik doğrulama başarılı! Bağlantılar toplanıyor...\n");

    // 4. Compile all URLs
    const allUrls = [];
    
    // Add Hizmet Bölgeleri main directory page
    allUrls.push(`${BASE_URL}/hizmet-bolgeleri`);

    // Add district landing pages and their specific service subpages
    districts.forEach((dist) => {
      // e.g. https://evolutionajans.com/hizmet-bolgeleri/bornova
      allUrls.push(`${BASE_URL}/hizmet-bolgeleri/${dist.slug}`);
      
      // e.g. https://evolutionajans.com/hizmet-bolgeleri/bornova/seo
      services.forEach((srv) => {
        allUrls.push(`${BASE_URL}/hizmet-bolgeleri/${dist.slug}/${srv}`);
      });
    });

    // 5. Filter out already successfully indexed URLs
    const urlsToSend = allUrls.filter(url => !indexedUrls.includes(url));

    if (urlsToSend.length === 0) {
      console.log("\x1b[32m%s\x1b[0m", "Tebrikler! Tüm bağlantılarınız (151 URL) zaten daha önce başarıyla bildirildi.");
      console.log("Gönderilecek yeni bir bağlantı bulunmamaktadır.");
      return;
    }

    console.log(`Toplam Bağlantı: ${allUrls.length}`);
    console.log(`Daha Önce Başarıyla Gönderilen: ${indexedUrls.length}`);
    console.log(`Yeni Gönderilecek: ${urlsToSend.length} URL`);
    console.log("Gönderim işlemi başlatılıyor (Kota limiti günlük 200 URL'dir)...\n");

    const indexing = google.indexing({
      version: "v3",
      auth: jwtClient
    });

    // 6. Send requests sequentially and update state file in real-time
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < urlsToSend.length; i++) {
      const url = urlsToSend[i];
      try {
        console.log(`[${i + 1}/${urlsToSend.length}] Gönderiliyor: ${url}`);
        await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: "URL_UPDATED"
          }
        });
        console.log(`   \x1b[32m%s\x1b[0m`, `✓ Başarılı`);
        successCount++;
        
        // Save state immediately on success so aborting script doesn't lose progress
        indexedUrls.push(url);
        fs.writeFileSync(STATE_FILE, JSON.stringify(indexedUrls, null, 2), "utf8");
      } catch (apiError) {
        console.error(`   \x1b[31m%s\x1b[0m`, `✗ Hata: ${apiError.message}`);
        failCount++;
      }
      
      // 150ms delay to prevent rate limit limits
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    console.log("\n------------------------------------------------");
    console.log("\x1b[34m%s\x1b[0m", "GÖNDERİM RAPORU:");
    console.log(`Yeni Gönderilen (Başarılı): ${successCount}`);
    console.log(`Hatalı/Gönderilemeyen: ${failCount}`);
    console.log(`Toplam İndekslenen Havuzu: ${indexedUrls.length} / ${allUrls.length}`);
    console.log("------------------------------------------------");
  });
}

main();
