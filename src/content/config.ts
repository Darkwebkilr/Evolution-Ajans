// Astro'nun içerik yönetim araçlarından gerekli fonksiyonları ve Zod'u import ediyoruz.
import { defineCollection, z } from "astro:content";

// "blog" adında bir koleksiyon tanımlıyoruz.
const blogCollection = defineCollection({
  // type: 'content', // Bu varsayılan değerdir, genellikle belirtmeye gerek yok.

  // schema: Bu koleksiyondaki her bir dosyanın frontmatter'ının uyması gereken kurallar.
  schema: z.object({
    // title alanı zorunludur ve bir metin (string) olmalıdır.
    title: z.string(),

    // description alanı zorunludur ve bir metin olmalıdır.
    // Ayrıca Zod ile ek kurallar da ekleyebiliriz. Mesela maksimum 160 karakter olsun.
    description: z
      .string()
      .max(160, "SEO için açıklama 160 karakterden uzun olmamalıdır!"),

    // pubDate alanı zorunludur ve bir tarih (date) olmalıdır.
    pubDate: z.date(),

    // author alanı zorunludur ve bir metin olmalıdır.
    // .default() ile, eğer yazar belirtilmezse varsayılan olarak "Astro Geliştiricisi" atasın.
    author: z.string().default("Astro Geliştiricisi"),

    // image alanı zorunlu değildir (.optional()). Eğer kullanılırsa, bir metin (resim URL'si) olmalıdır.
    image: z.string().optional(),

    // isDraft (taslak mı?) alanı zorunlu değildir. Boolean (true/false) olmalıdır.
    // Eğer belirtilmezse, varsayılan olarak 'false' yani yayınlanmış kabul edilsin.
    isDraft: z.boolean().default(false),

    // etiketler (tags) alanı zorunlu değildir. Eğer kullanılırsa, metinlerden oluşan bir dizi olmalıdır.
    tags: z.array(z.string()).optional(),
  }),
});

// Tanımladığımız tüm koleksiyonları Astro'ya tanıtmak için export ediyoruz.
// Eğer gelecekte 'projeler' adında bir koleksiyon daha yaparsak, onu da buraya ekleyeceğiz.
export const collections = {
  blog: blogCollection,
};
