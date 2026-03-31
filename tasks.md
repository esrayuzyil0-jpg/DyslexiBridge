### 1. Mimari ve Proje Kurulumu
- [ ] **1.1. Depo ve temel yapı**
  - [ ] Proje için Git deposu oluştur.
  - [ ] README taslağını oluştur (kısa proje açıklaması, teknoloji yığını, çalışma talimatı).
- [ ] **1.2. Teknoloji yığını kararı**
  - [ ] Frontend için React.js mi Next.js mi kullanılacağına karar ver.
  - [ ] Backend için Node.js (Express) mi yoksa Python (FastAPI) mi kullanılacağına karar ver.
  - [ ] Auth için Firebase Auth mı Auth0 mı kullanılacağını netleştir.
- [ ] **1.3. Monorepo / ayrı repo kararı**
  - [ ] Frontend ve backend tek repoda mı (monorepo) yoksa ayrı mı tutulacak, karar ver.

### 2. Backend Temeli
- [ ] **2.1. Backend projesi oluşturma**
  - [ ] Seçilen teknoloji ile temel backend iskeletini oluştur (API, health check endpoint).
  - [ ] Ortam değişkenleri yapısını belirle (.env, config).
- [ ] **2.2. Veritabanı tasarımı (PostgreSQL)**
  - [ ] Kullanıcılar tablosu (öğretmen, veli, admin rolleri).
  - [ ] Öğrenciler tablosu ve kullanıcılarla ilişki.
  - [ ] Ödevler tablosu (akademik açıklama, hedef beceriler vb.).
  - [ ] Oyun/etkinlik önerileri tablosu veya JSON alanı (AI çıktıları için).
  - [ ] Geri bildirimler tablosu (veli geri bildirimleri, tarih, zorluk, eğlenme skoru vb.).
  - [ ] Öğrenci gelişim metrikleri için özet veya metrik tablosu (haftalık skorlar, yüzdeler).
- [ ] **2.3. Auth entegrasyonu (Firebase Auth / Auth0)**
  - [ ] Backend tarafında kullanıcı kimlik doğrulama doğrulamalarını ekle (middleware).
  - [ ] Rol bazlı yetkilendirme kurgusunu oluştur (öğretmen, veli, admin).

### 3. AI Entegrasyonu Tasarımı
- [ ] **3.1. OpenAI / Anthropic entegrasyonu**
  - [ ] Hangi AI servisinin kullanılacağına karar ver (OpenAI GPT-4o veya Claude).
  - [ ] API anahtarlarının güvenli saklanması için yapılandırma yap.
  - [ ] Ortak bir AI servis katmanı tasarla (istek oluşturma, hata yönetimi, rate limit vs.).
- [ ] **3.2. AI kullanım senaryolarının API tasarımı**
  - [ ] Akademik metni sadeleştiren endpoint tasarla (Basitleştirme).
  - [ ] Ödev için oyun/etkinlik senaryosu üreten endpoint tasarla (Yaratıcı içerik).
  - [ ] Veli geri bildirimlerinden özet rapor çıkaran endpoint tasarla (Veri analizi).

### 4. Öğretmen Modülü (Backend)
- [ ] **4.1. Ödev yönetimi API'leri**
  - [ ] Ödev oluşturma (akademik metin girişi, hedef beceriler).
  - [ ] Ödev listeleme (öğretmene göre filtreli).
  - [ ] Ödev güncelleme / silme.
  - [ ] Ödev için AI tabanlı sadeleştirme tetikleme (isteğe bağlı veya otomatik).
- [ ] **4.2. Gelişim paneli verileri**
  - [ ] Öğrenci/ödev geri bildirimlerinden haftalık performans metriklerini hesaplayan servis.
  - [ ] Haftalık grafik verisini dönen endpoint (tarih + metrik serileri).
- [ ] **4.3. Veli onay takibi**
  - [ ] Velinin ödevi gördüğünü/okuduğunu işaretlemesini takip eden alanı tasarla.
  - [ ] İlgili endpointler (durum güncelleme, öğretmene listeleme).

### 5. Veli Modülü (Backend)
- [ ] **5.1. Akıllı ödev akışı API'leri**
  - [ ] Veliye atanmış aktif ödevleri dönen endpoint.
  - [ ] Her ödev için AI sadeleştirilmiş talimatları dönen endpoint.
- [ ] **5.2. Oyun kütüphanesi API'leri**
  - [ ] Her ödev için AI tarafından üretilen en az 3 oyun senaryosunu dönen endpoint.
  - [ ] Gerekirse oyun senaryolarını yeniden üretme/yenileme endpointi.
- [ ] **5.3. Geri bildirim API'leri**
  - [ ] Basit geri bildirim formu modelini tanımla (tamamlandı, zorlandı, eğlendi vb.).
  - [ ] Geri bildirim oluşturma endpointi.
  - [ ] Geri bildirimleri öğretmene/öğrenci bazında listeleyen endpoint.

### 6. Admin Modülü (Backend)
- [ ] **6.1. Kullanıcı ve rol yönetimi**
  - [ ] Öğretmen, veli, admin kullanıcılarının yönetim endpointleri.
  - [ ] Roller ve izinlerin yönetimi (sadece admin).
- [ ] **6.2. Öğretmen-veli-öğrenci eşleşmeleri**
  - [ ] Eşleştirme modeli tasarımı (hangi veli hangi öğrenci/öğretmen ile ilişkili).
  - [ ] Eşleştirme oluşturma/güncelleme/görüntüleme endpointleri.
- [ ] **6.3. Sistem denetimi ve güvenlik**
  - [ ] Temel loglama (kritik aksiyonlar).
  - [ ] Basit audit trail gereksinimleri (kim ne zaman hangi veriyi güncelledi).

### 7. Frontend Temeli
- [ ] **7.1. Frontend projesi oluşturma**
  - [ ] React veya Next ile temel proje iskeletini oluştur.
  - [ ] Global stil ve tema sistemini kur (ör. Tailwind, MUI veya benzeri).
  - [ ] Ortak layout (header, sidebar, responsive yapı) tasarlama.
- [ ] **7.2. Auth entegrasyonu (Frontend)**
  - [ ] Firebase/Auth0 ile giriş/çıkış akışını uygulama.
  - [ ] Rol bazlı yönlendirme (öğretmen, veli, admin için farklı dashboard).

### 8. Öğretmen Arayüzleri (Frontend)
- [ ] **8.1. Öğretmen dashboard**
  - [ ] Öğrenci listesi ve özet metrik kartları.
  - [ ] Son ödevler ve velilerden gelen son geri bildirimler.
- [ ] **8.2. Ödev oluşturma/özelleştirme ekranı**
  - [ ] Akademik metin giriş formu.
  - [ ] Hedef beceri/alan seçimi (ör. fonolojik farkındalık, görsel algı).
  - [ ] "AI ile sadeleştir" butonu ve sonuç önizleme alanı.
- [ ] **8.3. Gelişim paneli ekranı**
  - [ ] Haftalık performans grafikleri (çizgi/grafik bileşenleri).
  - [ ] Öne çıkan AI özetleri (ör. "Bu hafta görsel algıda %30 daha hızlıydı").
- [ ] **8.4. Veli onay takibi ekranı**
  - [ ] Hangi velinin ödevi gördüğü/uyguladığı durum listesi.

### 9. Veli Arayüzleri (Frontend)
- [ ] **9.1. Veli dashboard**
  - [ ] Çocuğa atanmış aktif ödevlerin listesi.
  - [ ] Özet ilerleme bilgisi (basit ve anlaşılır kartlar).
- [ ] **9.2. Akıllı ödev akışı ekranı**
  - [ ] Adım adım uygulanabilir, sadeleştirilmiş talimat kartları.
  - [ ] "Adımı tamamladım" gibi hızlı aksiyon butonları.
- [ ] **9.3. Oyun kütüphanesi ekranı**
  - [ ] Evdeki basit materyallerle yapılabilecek oyun listesi (en az 3 öneri).
  - [ ] Oyun detay modalı veya sayfası (gerekli malzemeler, adımlar, süre).
- [ ] **9.4. Geri bildirim formu ekranı**
  - [ ] "Ödev yapıldı", "Çok zorlandı", "Eğlendi" gibi seçenekli form.
  - [ ] İsteğe bağlı kısa not alanı.

### 10. Admin Arayüzleri (Frontend)
- [ ] **10.1. Kullanıcı yönetimi ekranı**
  - [ ] Kullanıcı listesi (filtreleme ve arama).
  - [ ] Rol atama/değiştirme arayüzü.
- [ ] **10.2. Eşleşme yönetimi ekranı**
  - [ ] Öğretmen-öğrenci-veli ilişkilerini görselleştiren liste/tablolar.
  - [ ] Yeni eşleşme oluşturma ve düzenleme formları.

### 11. Raporlama ve KPI Takibi
- [ ] **11.1. Kullanım metrikleri**
  - [ ] Haftalık ödev tamamlama oranını hesaplayan backend servisleri.
  - [ ] Öğretmen dashboard'unda bu oranların gösterimi.
- [ ] **11.2. Zaman tasarrufu ve memnuniyet**
  - [ ] Öğretmenlerin rapor hazırlama süresiyle ilgili basit anket/ölçüm alanı (opsiyonel).
  - [ ] Ebeveyn "ödevleri anlama" skorları için basit anket bileşeni.

### 12. Test, Güvenlik ve Yayına Hazırlık
- [ ] **12.1. Otomatik testler**
  - [ ] Kritik backend servisleri için birim testleri yaz.
  - [ ] Kritik UI akışları için temel e2e veya component testleri.
- [ ] **12.2. Güvenlik ve gizlilik**
  - [ ] Rol bazlı erişim kontrollerini gözden geçir.
  - [ ] Kişisel verilerin loglarda maskelemesini kontrol et.
- [ ] **12.3. CI/CD ve ortamlar**
  - [ ] Temel CI pipeline'ı (test + build).
  - [ ] Staging ve production ortam stratejisi belirleme.

### 13. Fazlama ve MVP Tanımı
- [ ] **13.1. MVP kapsamını işaretle**
  - [ ] Yukarıdaki maddelerden MVP'ye girecek olanları işaretle (örn. sadece öğretmen + veli temel akışı, admin modülünün minimum hali).
  - [ ] MVP sonrası Faz 2/3 özelliklerini belirle (ör. gelişmiş raporlama, daha zengin oyun kütüphanesi).



