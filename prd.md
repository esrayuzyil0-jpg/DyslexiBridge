

## 1. Ürün Özeti (Product Summary)
**dyslexnode**, disleksi tanısı almış öğrencilerin okulda aldıkları eğitimi evde doğru metotlarla pekiştirebilmeleri için tasarlanmış bir **"AI İletişim Köprüsü"**dür. Uygulama, öğretmenin teknik eğitim dilini velinin anlayabileceği pratik oyunlara ve yönergelere dönüştürür; veliden gelen geri bildirimleri ise öğretmen için analiz ederek eğitimde süreklilik sağlar.

---

## 2. Hedef Kullanıcılar ve Problemler
| Kullanıcı | Temel Problem | AI Çözümü |
| :--- | :--- | :--- |
| **Öğretmen** | Her veliye özel, evde uygulanabilir rehber hazırlayacak vaktinin olmaması. | Teknik talimatları saniyeler içinde "veli diline" çevirme. |
| **Veli** | Okuldaki teknik terimleri anlamama ve evde yanlış yöntem uygulama riski. | Adım adım uygulanabilir, basit ve oyunlaştırılmış rehberler. |

---

## 3. Kullanıcı Akışı (User Flow)
1.  **Rol Seçimi:** Kullanıcı uygulamayı açtığında "Öğretmen" veya "Veli" olarak giriş yapar.
2.  **Görev Tanımlama (Öğretmen):** Öğretmen haftalık kazanımı (örn: "Fonolojik farkındalık ve heceleme") sisteme girer.
3.  **AI Dönüşümü (Gemini API):** Yapay zeka metni analiz eder; karmaşık cümleleri basitleştirir ve evde yapılabilecek 3 dakikalık bir etkinlik önerisi ekler.
4.  **Rehber Görüntüleme (Veli):** Veli, disleksi dostu fontlarla (OpenDyslexic) hazırlanmış, AI tarafından optimize edilmiş görevi görür.
5.  **Geri Bildirim Döngüsü:** Veli uygulama sonrası kısa bir not (örn: "b-d harflerini karıştırdı") girer. AI bu notları sentezleyip öğretmene raporlar.

---

## 4. Temel Özellikler (Features)
* **Akıllı Metin Basitleştirici:** Akademik dili günlük ve anlaşılır bir dile çeviren AI motoru.
* **Disleksi Dostu Arayüz:** OpenDyslexic fontu, yüksek kontrastlı renk paleti (açık sarı/krem arka plan) ve geniş harf aralıkları.
* **Haftalık Gelişim Raporu:** Veliden gelen notları analiz eden ve öğretmene "eğilim özeti" sunan AI paneli.
* **Mobil Uyumluluk:** Hem öğretmenlerin hem de velilerin her yerden erişebileceği duyarlı (responsive) tasarım.

---

## 5. Teknoloji Yığını ve AI Araçları (Tech Stack)
Bu proje, kod yazmadan sadece yapay zeka araçlarını yönlendirerek (**Vibe Coding**) geliştirilmiştir:

* **Yapay Zeka (AI):**
    * **Gemini (Google):** Ana AI asistanı; içerik üretimi, kod yazımı ve mantık kurgusu.
    * **Google AI Studio:** Gemini modelini uygulamaya bağlayan API anahtarı yönetimi.
* **Geliştirme Araçları:**
    * **Cursor AI:** Yapay zeka destekli kod editörü; projenin tüm dosyalarını "Agent Mode" ile inşa eder.
    * **Lovable:** Uygulamayı saniyeler içinde internete yayınlayan ve görsel düzenlemeleri yöneten platform.
* **Frontend Teknolojileri (AI Tarafından Üretilen):**
    * **HTML & JavaScript:** Uygulamanın temel iskeleti ve işlevselliği.
    * **Tailwind CSS:** Hızlı, modern ve erişilebilir arayüz tasarımı.

---

## 6. Başarı Kriterleri (Success Metrics)
* Öğretmenin bir ödevi veliye açıklama süresinin **%80 oranında** kısalması.
* Veli geri bildirimlerinin düzenli ve analiz edilebilir bir veri akışına dönüşmesi.
* Öğrencinin okul ve ev arasındaki metot farkından kaynaklı yaşadığı kafa karışıklığının minimize edilmesi.
