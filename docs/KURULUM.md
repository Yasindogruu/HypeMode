# HypeMode'u iPhone ve iPad'de uygulama gibi kullanma

Ücretsiz kurulum. App Store'a yayınlamak ya da ücretli hesap gerekmez. Yaklaşık 20–30 dakika sürer ve **bir kez** yapılır. Arkadaşların bu adımları yapmaz; onlar sadece linki açar.

Bu rehber HypeMode'un kendi kopyasını kurmak isteyenler için. Uygulamayı sadece kullanmak istiyorsan [README](../README.md)'deki 4 adım yeterli.

İhtiyacın olanlar:

- Bu depodaki site dosyaları (kök klasör)
- `firebase/firestore.rules` — veritabanı güvenlik kuralları
- Bildirim sunucusu kodu (`worker.js`) — gizli anahtar içerdiği için bu depoda yok; kendi VAPID anahtarınla oluşturman gerekir (isteğe bağlı)

## Adım 1 — Firebase projesi aç (veritabanı + giriş)

1. https://console.firebase.google.com adresine Google hesabınla gir. **Proje oluştur**'a bas, adı `hypemode` olsun. Google Analytics'i kapatabilirsin.
2. Sol menüden **Build → Authentication → Get started**'a bas. **Sign-in method** sekmesinde **Email/Password**'ü aç ve kaydet.
3. Sol menüden **Build → Firestore Database → Create database**'e bas.
   - Konum olarak Avrupa'yı seç (örneğin `eur3` ya da `europe-west`).
   - **Production mode**'u seç.
4. Firestore'da **Rules** sekmesini aç. İçindekileri tamamen sil, `firebase/firestore.rules` dosyasının içeriğini yapıştır ve **Publish**'e bas.
5. Sol üstteki dişli simgesinden **Project settings**'e gir.
   - **Your apps** bölümünde web simgesine (**</>**) bas, uygulama adı `HypeMode` olsun. Hosting kutusunu işaretleme.
   - Ekranda çıkan `firebaseConfig` içindeki değerleri bir yere kopyala: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

> Ücretsiz plan (Spark) 4–5 kişi için fazlasıyla yeterli. Kart bilgisi istemez.

## Adım 2 — config.js'e Firebase bilgilerini yaz

`config.js` dosyasını bir metin düzenleyiciyle aç. `YAPISTIR` yazan yerlere 1. adımda kopyaladığın değerleri tırnakların içine yaz ve kaydet.

> İstersen bu değerleri Claude'a gönder, dosyayı senin için doldursun. Bu bilgiler gizli değildir; erişimi 1. adımdaki kurallar korur.

## Adım 3 — GitHub Pages'e yükle (ücretsiz web adresi)

1. https://github.com adresinde hesap aç ya da giriş yap.
2. Sağ üstteki **+ → New repository**'ye bas.
   - Adı `hypemode` olsun ve **Public** seç (ücretsiz Pages için gerekli).
   - **Create**'e bas.
3. Açılan sayfada **uploading an existing file** linkine bas. site dosyalarının hepsini sürükleyip bırak, sonra **Commit changes**'e bas.
4. Depoda **Settings → Pages**'e gir. **Branch** olarak `main` ve `/ (root)` seç, **Save**'e bas.
5. 1–2 dakika sonra adresin hazır olur: `https://KULLANICIADIN.github.io/hypemode/`
6. Firebase'e dön: **Authentication → Settings → Authorized domains → Add domain** ile `KULLANICIADIN.github.io` adresini ekle.

## Adım 4 — iPhone ve iPad'e kur (herkes yapar)

1. Linki **Safari** ile aç.
2. Alttaki **Paylaş** düğmesine (□↑) bas, **Ana Ekrana Ekle**'yi seç, sonra **Ekle**'ye bas.
3. Ana ekrandaki **HypeMode** simgesinden aç. Uygulama tam ekran açılır.
4. **Hesap oluştur**'a bas (e-posta + şifre), sonra giriş ekranındaki soruları cevapla. Kullanıcı adı burada seçilir.
5. **Arkadaşlar** bölümünde birbirinizi kullanıcı adıyla ekleyin ve isteği kabul edin.

Aynı hesapla iPad'de ve bilgisayarda da giriş yapabilirsin; veriler her yerde aynı görünür.

### Eski verilerini taşıma (Claude'daki sürümden)

1. Claude'daki HypeMode'da **Ayarlar → Bulut & yedek → Yedeği indir** (ya da **Dışa aktar + kopyala**).
2. Yeni uygulamada **Ayarlar → İçe aktar** kutusuna yapıştır ve **İçe aktar**'a bas.

## Adım 5 (isteğe bağlı) — Uygulama kapalıyken bildirim

Bu adımla arkadaşlarının dürtmeleri, istekleri, beğenileri ve yorumları uygulama kapalıyken de telefona bildirim olarak gelir. iOS 16.4 veya üstü gerekir ve uygulama ana ekrandan açılmış olmalıdır.

1. https://dash.cloudflare.com adresinde ücretsiz hesap aç.
2. **Workers & Pages → Create → Create Worker**'a bas. Adı `hypemode-push` olsun, **Deploy**'a bas.
3. **Edit code**'a bas. Oradaki kodu tamamen sil, `worker.js` dosyasının **tamamını** yapıştır ve **Deploy**'a bas.
4. Worker adresini kopyala (`https://hypemode-push.XXXX.workers.dev`). Adresi tarayıcıda açınca "HypeMode bildirim sunucusu çalışıyor ✓" yazmalı.
5. GitHub'da `config.js` dosyasını aç, kalem simgesine bas. `worker: ""` alanının tırnaklarının içine bu adresi yapıştır ve **Commit changes**'e bas.
6. Telefonda HypeMode'u ana ekrandan aç.
   - **Ayarlar → Hesap → Kapalıyken bildirimleri aç**'a bas ve izin ver.
   - **Deneme bildirimi** ile test et.
   - Her arkadaşın bunu kendi telefonunda bir kez yapmalı.

## Bilmen gerekenler

- **AI özellikleri** (fotoğraftan kalori, Ne pişirsem, AI raporu) ücretli anahtar kullanmaz. Düğme talimatı kopyalar, sen de Claude uygulamasında yeni bir sohbete yapıştırırsın.
- **Su ve yemek hatırlatmaları** uygulama açıkken çalışır. Kapalıyken gelen bildirimler, arkadaşlarından gelenlerdir.
- **Güncelleme:** Claude yeni bir `index.html` verdiğinde GitHub'da eski dosyanın üzerine yüklemen yeterli. Uygulama bir sonraki açılışta güncellenir.
- **Şifreni unutursan** giriş ekranındaki **Şifremi unuttum** bağlantısı e-postana sıfırlama linki gönderir.
- `worker.js` bildirim sunucusunun gizli anahtarını içerir; herkese açık bir depoya koyma.
