// HypeMode ayarları
// 1) Firebase bilgilerini aşağıya yapıştır (Firebase konsolu → Proje ayarları → Web uygulaması → firebaseConfig).
window.HM_CONFIG = {
  firebase: {
    apiKey: "AIzaSyCHqXY6MvTVGBWwCfxLU1hzxrbCiemP7Uk",
    authDomain: "hypemode-1b38b.firebaseapp.com",
    projectId: "hypemode-1b38b",
    storageBucket: "hypemode-1b38b.firebasestorage.app",
    messagingSenderId: "937892675224",
    appId: "1:937892675224:web:237ed8d8a32e613adbdaed"
  },
  // Yasal iletişim (aydınlatma metni ve şikayetler için). E-posta eklemen önerilir (KVKK başvuruları için).
  contact: { name: "Yasin Doğru", email: "", github: "https://github.com/Yasindogruu/HypeMode/issues" },
  // 2) İsteğe bağlı: kapalıyken bildirim. Cloudflare Worker adresini "worker" alanına yapıştır.
  push: {
    worker: "https://hypemode-push.ysndogru54.workers.dev",
    vapidPublic: "BFe1JaqO2xMlSi1RFeoNp2brMovGIKPREukddmni8qbIW1-_lvc62L5PX2PA2znY03dVR_BSOackU9CfFsaZcAI",
    key: "FhnWuv7OvX2fIeYEQaqiyTTx"
  }
};
