
## 1. Seçilen Teknolojiler (The Stack)

| Bileşen | Teknoloji | Görevi |
| :--- | :--- | :--- |
| **Frontend** | HTML5 & Tailwind CSS | Erişilebilir, disleksi dostu ve hızlı arayüz tasarımı. |
| **Scripting** | Vanilla JavaScript | Uygulama mantığı ve API haberleşmesi. |
| **Yapay Zeka** | Gemini 1.5 Flash | Teknik metinleri pedagojik verilere dönüştüren ana motor. |
| **API Yönetimi** | Google AI Studio | Gemini API anahtarı ve model yapılandırması. |
| **Yayınlama** | Lovable / Replit | Kodun canlıya alınması ve anlık test edilmesi. |

---

## 2. Neden Bu Teknolojileri Seçtik?

* **HTML & Tailwind CSS:** Geleneksel CSS yazmak yerine, Tailwind'in hazır sınıflarıyla disleksi dostu renk paletlerini (#FFFDD0 - Krem) ve OpenDyslexic fontunu saniyeler içinde entegre edebiliyoruz.
* **Gemini 1.5 Flash:** Diğer modellere göre çok daha hızlı ve "eğitici materyal basitleştirme" konusunda yüksek başarı oranına sahip. Ayrıca Google AI Studio üzerinden başlangıç seviyesi için ücretsiz bir kota sunuyor.
* **Kurulumsuz Geliştirme:** Lovable veya Replit kullanarak bilgisayara karmaşık yazılımlar (Node.js, Docker vb.) kurmadan tamamen tarayıcı üzerinden geliştirme yapabiliyoruz.

---

## 3. Kurulum ve Başlangıç Adımları

### Adım 1: Proje Dosyalarını Oluşturma
Uygulama tek bir klasör içinde şu üç dosyadan oluşur:
1.  `index.html`: Arayüzün iskeleti.
2.  `style.css`: Özel font ve renk tanımları.
3.  `script.js`: API çağrıları ve kullanıcı etkileşimleri.

### Adım 2: Tailwind CSS Entegrasyonu
`index.html` dosyasının `<head>` kısmına aşağıdaki satırı ekleyerek herhangi bir kurulum yapmadan Tailwind özelliklerini kullanmaya başlıyoruz:
```html
<script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
