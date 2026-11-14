# HypeMode iOS uygulaması

Web uygulamasını yerel bir iOS kabuğunda çalıştırır ve web'in yapamadığı şeyleri ekler:

- **Apple Sağlık (HealthKit):** nabız, uyku, adım, kalori, HRV, SpO₂, solunum, VO₂max, kilo, boy ve antrenmanları okur; öğün, su, kafein, antrenman ve kiloyu yazar.
- **Canlı nabız:** bileklikten Bluetooth (Heart Rate 0x180D) ile anlık nabız ve pil seviyesi.
- **Akıllı uyandırma:** uyku döngüsüne göre yerel bildirim.
- Kamera ve galeri erişimi.

Uygulama `https://yasindogruu.github.io/HypeMode/` adresini yüklediği için web'e gönderilen her güncelleme uygulamaya da anında gelir. Web ile uygulama arasındaki köprü `window.webkit.messageHandlers.hm` üzerinden çalışır.

| Dosya | Görevi |
|---|---|
| `HypeMode/HypeModeApp.swift` | Uygulama girişi |
| `HypeMode/WebView.swift` | WKWebView, JS köprüsü, izinler, bildirimler |
| `HypeMode/Health.swift` | HealthKit okuma/yazma |
| `HypeMode/HRM.swift` | CoreBluetooth canlı nabız ve pil |

## Kurulum (kişisel cihaz, ücretsiz)

1. `HypeModeApp/HypeMode.xcodeproj` dosyasını Xcode ile aç.
2. TARGETS → HypeMode → Signing & Capabilities → **Team**: kendi Apple ID'n (Personal Team).
3. Cihazı kabloyla bağla, üstten seç ve ▶'ye bas.
4. Cihazda Ayarlar → Genel → VPN ve Cihaz Yönetimi → geliştirici sertifikasına **Güven**.

Ücretsiz hesapla yüklenen uygulama 7 gün geçerlidir; süre dolunca ▶ ile yeniden yükle.
