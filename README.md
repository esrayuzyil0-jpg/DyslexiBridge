# 🌟 DyslexiaBridge (Disleksi Köprüsü)

**Disleksi tanılı çocukların eğitim sürecinde öğretmen ve veli arasındaki iletişim kopukluğunu gideren AI destekli platform.**

## 🎯 Projenin Amacı
Disleksili çocukların okulda öğrendiklerini evde doğru pratiklerle pekiştirmesi kritiktir. **DyslexiaBridge**, öğretmenlerin girdiği günlük ders notlarını analiz ederek velilere evde uygulayabilecekleri kişiselleştirilmiş ve eğlenceli etkinlik önerileri sunar.

## 🚀 AI Entegrasyonu (Gemini API)
Bu uygulama, yapılandırılmamış öğretmen notlarını anlamlandırmak için **Google Gemini AI** kullanır. AI, notlardaki zorlukları tespit eder ve çocuğun özel ihtiyaçlarına göre disleksi dostu pratikler üretir.

## ✨ Öne Çıkan Özellikler
* **AI Destekli Analiz:** Öğretmen notlarından otomatik gelişim önerileri üretme.
* **Disleksi Dostu Arayüz:** Tek tuşla aktifleşen "OpenDyslexic" fontu ve göz yormayan özel renk paleti.
* **Veli & Öğretmen Panelleri:** İki tarafın da süreci kolayca takip edebileceği kullanıcı dostu ekranlar.

## 🔗 Önemli Linkler
* **Canlı Uygulama:** [https://dyslexiabridge.lovable.app](https://dyslexiabridge.lovable.app)
* **Demo Videosu:** [Buraya Loom Linkini Yapıştır]



```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
