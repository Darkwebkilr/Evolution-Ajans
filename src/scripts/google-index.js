import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your Google Service Account key (placed in root directory)
const KEY_FILE = path.join(__dirname, "../../service-account.json");
const SITE_URL = "https://evolutionajans.com";

// Direct list of URLs to index (all key pages)
const urls = [
  SITE_URL,
  `${SITE_URL}/basari`,
  `${SITE_URL}/blog`,
  `${SITE_URL}/hakkimizda`,
  `${SITE_URL}/iletisim`,
  // Services
  `${SITE_URL}/hizmetler/kurumsal-web-tasarimi`,
  `${SITE_URL}/hizmetler/seo-hizmeti`,
  `${SITE_URL}/hizmetler/sosyal-medya-yonetimi`,
  `${SITE_URL}/hizmetler/afis-tasarimi`,
  `${SITE_URL}/hizmetler/reklam-yonetimi`,
  `${SITE_URL}/hizmetler/dijital-pazarlama`,
];

async function indexUrls() {
  if (!fs.existsSync(KEY_FILE)) {
    console.error("================================================================");
    console.error("HATA: 'service-account.json' dosyası bulunamadı!");
    console.error("Lütfen Google Cloud Console'dan indirdiğiniz Service Account");
    console.error("JSON anahtarını projenizin kök dizinine (Evolution-Ajans/)");
    console.error("yerleştirin ve ismini 'service-account.json' yapın.");
    console.error("================================================================");
    process.exit(1);
  }

  // Load auth client
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const authClient = await auth.getClient();
  const indexing = google.indexing({
    version: "v3",
    auth: authClient,
  });

  console.log(`${urls.length} adet URL Google Indexing API'ye gönderiliyor...\n`);

  for (const url of urls) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: "URL_UPDATED",
        },
      });
      console.log(`✅ Gönderildi: ${url} (${res.statusText || "OK"})`);
    } catch (error) {
      console.error(`❌ Hata: ${url}`);
      console.error(`   Detay: ${error.message}`);
    }
  }

  console.log("\nTüm URL'ler bildirildi!");
}

indexUrls().catch(console.error);
