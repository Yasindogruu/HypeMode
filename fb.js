// HypeMode – Firebase bağlantısı
// Uygulama, Claude yapıtındaki claude.use('db'|'user') arayüzünü bekliyor.
// Bu dosya aynı arayüzü Firebase Auth (e-posta/şifre) + Firestore ile sağlar.
const C = window.HM_CONFIG || {};
const SDK = 'https://www.gstatic.com/firebasejs/' + (C.sdkVersion || '13.2.0') + '/';
const APP_KEY = 'pulse-coach-v1';
const ready = window.__hmResolve || (() => {});
let B = null, ME = null, ovl = null, pushState = '';

/* ---------- arka uç (Firebase ya da test için sahte) ---------- */
async function loadBackend() {
  if (window.__HM_MOCK) return window.__HM_MOCK;
  const [{ initializeApp }, A, F] = await Promise.all([
    import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')]);
  const app = initializeApp(C.firebase);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);
  if (C.emulator) { A.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true }); F.connectFirestoreEmulator(db, '127.0.0.1', 8085) }
  // Okumalar her zaman sunucudan: çevrimdışıyken boş önbellek "veri yok" sanılıp bulut ezilmesin
  A.getRedirectResult(auth).catch(e => { window.__hmRedirErr = e });
  const rows = q => q.docs.map(d => ({ id: d.id, data: d.data() }));
  return {
    onAuth: cb => A.onAuthStateChanged(auth, u => cb(u ? { uid: u.uid, email: u.email } : null)),
    signIn: (e, p) => A.signInWithEmailAndPassword(auth, e, p),
    signUp: (e, p) => A.createUserWithEmailAndPassword(auth, e, p),
    reset: e => A.sendPasswordResetEmail(auth, e),
    signOut: () => A.signOut(auth),
    google: async () => {
      const pr = new A.GoogleAuthProvider(); pr.setCustomParameters({ prompt: 'select_account' });
      try { return await A.signInWithPopup(auth, pr) }
      catch (e) { if (/popup-blocked|operation-not-supported|web-storage-unsupported/.test(String(e && e.code))) return A.signInWithRedirect(auth, pr); throw e }
    },
    get: async path => { const s = await F.getDocFromServer(F.doc(db, path)); return s.exists() ? s.data() : null },
    set: (path, data) => F.setDoc(F.doc(db, path), data),
    del: path => F.deleteDoc(F.doc(db, path)),
    list: async col => rows(await F.getDocsFromServer(F.collection(db, col))),
    where: async (col, f, v) => rows(await F.getDocsFromServer(F.query(F.collection(db, col), F.where(f, '==', v))))
  };
}

/* ---------- claude.use('db') uyumlu katman ---------- */
// Firestore iç içe dizileri desteklemediği için gövde JSON metni olarak saklanır;
// sorgu ve güvenlik kuralları için gereken alanlar ayrıca üst seviyeye yazılır.
const IDX = ['username', 'to', 'from', 'uid'];
const enc = b => {
  const o = { j: JSON.stringify(b) }; IDX.forEach(k => { if (b && typeof b[k] === 'string') o[k] = b[k] });
  if (b && Array.isArray(b.fr)) o.fr = b.fr.filter(x => typeof x === 'string').slice(0, 300); // güvenlik kuralı için: profili kimler görebilir
  return o;
};
const dec = x => { if (x && typeof x.j === 'string') { try { return JSON.parse(x.j) } catch (e) { return null } } return x };
function errMap(e) {
  const m = String(e && e.message || e || ''); let c = String(e && e.code || '').replace(/^firestore\//, '');
  if (c === 'permission-denied') c = 'not_granted';
  else if (c === 'resource-exhausted') c = 'quota_exceeded';
  else if (c === 'invalid-argument') c = /exceed|too large|maximum|bytes/i.test(m) ? 'quota_exceeded' : 'invalid_argument';
  else if (c === 'deadline-exceeded' || c === 'unavailable' || /offline|network/i.test(m)) c = 'unavailable';
  const err = new Error(m); err.code = c || 'err'; return err;
}
const wrap = p => p.catch(e => { throw errMap(e) });
const snap = (id, d) => ({ id, exists: !!d, data: () => dec(d) });
function makeDb() {
  const col = path => ({
    doc: id => ({
      get: () => wrap(B.get(path + '/' + id).then(d => snap(id, d))),
      set: body => {
        // kullanıcı adı araması için ayrı, sadece ad içeren kayıt (profil detayları sadece arkadaşlara açık)
        if (path === 'social' && body && body.username) B.set('names/' + id, enc({ uid: id, username: body.username, name: String(body.name || '').slice(0, 40) })).catch(() => { });
        return wrap(B.set(path + '/' + id, enc(body)));
      },
      delete: () => wrap(B.del(path + '/' + id))
    }),
    get: () => wrap(B.list(path).then(a => ({ docs: a.map(x => snap(x.id, x.data)) }))),
    where: (f, op, v) => ({
      get: () => {
        const run = c => B.where(c, f, v).then(a => ({ docs: a.map(x => snap(x.id, x.data)) }));
        if (path === 'social' && f === 'username') return wrap(run('names').catch(() => run('social')));
        return wrap(run(path));
      }
    })
  });
  return { collection: col };
}
function makeUser() {
  return { id: async () => ME && ME.uid, isOwner: async () => false, email: async () => ME && ME.email };
}

/* ---------- giriş ekranı ---------- */
const CSS = `
#hmAuth{position:fixed;inset:0;z-index:500;background:var(--bg,#000);color:#fff;overflow:auto;display:flex;flex-direction:column;align-items:center;font-family:Inter,system-ui,sans-serif}
#hmAuth:before{content:'';position:absolute;left:0;right:0;top:0;height:420px;background:radial-gradient(120% 90% at 50% 0%,rgba(var(--a1rgb,255,59,48),.75),rgba(var(--a1rgb,255,59,48),.12) 55%,transparent 80%);pointer-events:none}
#hmAuth .in{position:relative;width:100%;max-width:400px;padding:calc(env(safe-area-inset-top) + 64px) 24px 40px}
#hmAuth .lg{font-family:Unbounded,Inter,sans-serif;font-weight:800;letter-spacing:.14em;font-size:24px;text-align:center}
#hmAuth h1{font-family:Unbounded,Inter,sans-serif;font-size:26px;line-height:1.2;text-align:center;margin:34px 0 8px}
#hmAuth p.s{color:#a1a1aa;text-align:center;font-size:14.5px;line-height:1.5;margin:0 0 26px}
#hmAuth label{display:block;font-size:12.5px;color:#a1a1aa;margin:14px 0 6px}
#hmAuth input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;color:#fff;background:#1c1c1e;border:1px solid #2c2c30;border-radius:14px;padding:14px;outline:none}
#hmAuth input:focus{border-color:var(--a1,#ff3b30)}
#hmAuth .b{width:100%;margin-top:22px;height:54px;border:0;border-radius:999px;font:inherit;font-weight:700;font-size:16px;background:#fff;color:#111;cursor:pointer}
#hmAuth .b:disabled{opacity:.55}
#hmAuth .l{display:block;margin:16px auto 0;background:none;border:0;color:#d4d4d8;font:inherit;font-size:14px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
#hmAuth .er{margin-top:14px;padding:12px 14px;border-radius:14px;background:rgba(255,69,58,.14);border:1px solid rgba(255,69,58,.35);font-size:13.5px;line-height:1.45}
#hmAuth .ok{margin-top:14px;padding:12px 14px;border-radius:14px;background:rgba(48,209,88,.12);border:1px solid rgba(48,209,88,.35);font-size:13.5px;line-height:1.45}
#hmAuth .or{display:flex;align-items:center;gap:12px;margin:22px 0 0;color:#71717a;font-size:12.5px}#hmAuth .or:before,#hmAuth .or:after{content:'';flex:1;height:1px;background:#2c2c30}
#hmAuth .g{width:100%;margin-top:16px;height:52px;border-radius:999px;border:1px solid #3a3a40;background:#151517;color:#fff;font:inherit;font-weight:600;font-size:15.5px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer}
#hmAuth .g:disabled{opacity:.6}
#hmAuth .tip{margin-top:26px;padding:14px;border-radius:16px;background:#151517;border:1px solid #2c2c30;font-size:13px;color:#c7c7cc;line-height:1.5}
#hmAuth .sp{width:34px;height:34px;border-radius:50%;border:3px solid rgba(255,255,255,.15);border-top-color:#fff;animation:hmsp .8s linear infinite;margin:60px auto 0}
@keyframes hmsp{to{transform:rotate(360deg)}}
.hmacc .row2{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.hmacc .row2 .btn{flex:1;min-width:140px}
`;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const NATIVE = () => !!window.HM_NATIVE;
const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const AUTH_ERR = {
  'auth/invalid-credential': 'E-posta ya da şifre hatalı.', 'auth/wrong-password': 'Şifre hatalı.', 'auth/user-not-found': 'Bu e-postayla hesap yok. "Hesap oluştur"a geç.',
  'auth/email-already-in-use': 'Bu e-postayla zaten hesap var. Giriş yap.', 'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
  'auth/invalid-email': 'E-posta adresi geçersiz.', 'auth/missing-password': 'Şifreni yaz.', 'auth/network-request-failed': 'İnternet bağlantısı yok gibi görünüyor.',
  'auth/too-many-requests': 'Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar dene.', 'auth/operation-not-allowed': 'Firebase\'de E-posta/Şifre girişi açık değil (kurulum adımı 3).',
  'auth/unauthorized-domain': 'Google girişi için Firebase → Authentication → Settings → Authorized domains bölümüne bu sitenin adresini ekle.',
  'auth/account-exists-with-different-credential': 'Bu e-posta başka bir yöntemle kayıtlı. E-posta ve şifreyle giriş yap.',
  'auth/internal-error': 'Google girişi açılamadı. Firebase\'de Google girişinin açık olduğundan emin ol ya da e-postayla giriş yap.',
  'auth/popup-closed-by-user': '', 'auth/cancelled-popup-request': '',
  'auth/configuration-not-found': 'Firebase\'de Authentication henüz açılmamış (kurulum adımı 3).', 'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'config.js içindeki Firebase bilgileri hatalı.'
};
let mode = 'in', msg = null;
function ensureOvl() {
  if (!document.getElementById('hmCss')) { const st = document.createElement('style'); st.id = 'hmCss'; st.textContent = CSS; document.head.appendChild(st) }
  if (!ovl) { ovl = document.createElement('div'); ovl.id = 'hmAuth'; document.body.appendChild(ovl) }
  return ovl;
}
function hideOvl() { if (ovl) { ovl.remove(); ovl = null } }
function showLoading() { ensureOvl().innerHTML = `<div class="in"><div class="lg">HYPE〰MODE</div><div class="sp"></div></div>` }
function showError(t, retry) {
  ensureOvl().innerHTML = `<div class="in"><div class="lg">HYPE〰MODE</div><div class="er" style="margin-top:40px">${t}</div>${retry ? '<button class="b" onclick="location.reload()">Tekrar dene</button>' : ''}</div>`;
}
function showLogin() {
  const up = mode === 'up', rs = mode === 'reset';
  ensureOvl().innerHTML = `<div class="in"><div class="lg">HYPE〰MODE</div>
    <h1>${rs ? 'Şifreni sıfırla' : up ? 'Hesap oluştur' : 'Tekrar hoş geldin'}</h1>
    <p class="s">${rs ? 'E-postana sıfırlama bağlantısı gönderelim.' : up ? 'Verilerin hesabında saklanır; telefon, iPad ve bilgisayarında aynı görünür.' : 'Verilerine ve arkadaşlarına ulaşmak için giriş yap.'}</p>
    <form id="hmF" autocomplete="on">
      <label for="hmE">E-posta</label><input id="hmE" type="email" autocomplete="email" inputmode="email" required>
      ${rs ? '' : `<label for="hmP">Şifre${up ? ' (en az 6 karakter)' : ''}</label><input id="hmP" type="password" autocomplete="${up ? 'new-password' : 'current-password'}" required minlength="6">`}
      ${msg ? `<div class="${msg.ok ? 'ok' : 'er'}">${msg.t}</div>` : ''}
      <button class="b" id="hmB" type="submit">${rs ? 'Bağlantı gönder' : up ? 'Hesap oluştur' : 'Giriş yap'}</button>
    </form>
    ${rs || NATIVE() ? '' : `<div class="or"><span>ya da</span></div><button class="g" id="hmG"><svg viewBox="0 0 48 48" width="20" height="20"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Google ile devam et</button>`}
    ${rs ? '<button class="l" data-m="in">← Girişe dön</button>' : up ? '<button class="l" data-m="in">Zaten hesabım var · Giriş yap</button>' : '<button class="l" data-m="up">Hesabın yok mu? Hesap oluştur</button><button class="l" data-m="reset">Şifremi unuttum</button>'}
    ${NATIVE() ? '<div class="tip">📱 iPhone uygulamasında e-posta ve şifreyle giriş yapılır (Google, uygulama içinden girişe izin vermiyor).</div>' : ''}
    ${isIOS() && !standalone() && !NATIVE() ? '<div class="tip">📱 <b>Uygulama gibi kullanmak için:</b> Safari\'de alttaki Paylaş düğmesine (□↑) bas → <b>Ana Ekrana Ekle</b>. Sonra HypeMode\'u ana ekrandaki simgeden aç; bildirimler de ancak böyle çalışır.</div>' : ''}
  </div>`;
  const g = document.getElementById('hmG');
  if (g) g.onclick = async () => {
    g.disabled = true; g.lastChild.textContent = 'Bekle…';
    try { await B.google(); msg = null }
    catch (err) { const c = String(err && err.code || ''); const t = c in AUTH_ERR ? AUTH_ERR[c] : ('Google girişi olmadı: ' + esc(c || err.message || err)); msg = t ? { t } : null; showLogin() }
  };
  ovl.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { mode = b.dataset.m; msg = null; showLogin() });
  const f = document.getElementById('hmF');
  f.onsubmit = async ev => {
    ev.preventDefault(); const e = document.getElementById('hmE').value.trim(), pEl = document.getElementById('hmP'), p = pEl ? pEl.value : '';
    const btn = document.getElementById('hmB'); btn.disabled = true; btn.textContent = 'Bekle…';
    try {
      if (mode === 'reset') { await B.reset(e); msg = { ok: true, t: 'Bağlantı gönderildi. E-postanı (gerekirse spam klasörünü) kontrol et.' }; mode = 'in'; showLogin(); return }
      if (mode === 'up') await B.signUp(e, p); else await B.signIn(e, p);
      msg = null; // giriş onAuth üzerinden devam eder
    } catch (err) {
      const c = String(err && err.code || ''); msg = { t: AUTH_ERR[c] || ('Bir sorun oldu: ' + esc(c || err.message || err)) }; showLogin();
      const ee = document.getElementById('hmE'); if (ee) ee.value = e;
    }
  };
}

/* ---------- hesap kartı (Ayarlar) ---------- */
const pushOk = () => !!(C.push && C.push.worker && C.push.vapidPublic) && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
window.HMAcct = {
  card() {
    let pz = '';
    if (NATIVE()) pz = '<div class="lbl" style="margin-top:8px">📱 iPhone uygulaması: su, yemek, antrenman ve uyku hatırlatmaları kapalıyken de gelir (Ayarlar → Hatırlatmalar). Arkadaş dürtmeleri uygulama kapalıyken sadece ana ekrandaki web sürümüne gelir.</div>';
    else if (!(C.push && C.push.worker)) pz = '<div class="lbl" style="margin-top:8px">Kapalıyken bildirim kurulmamış (kurulum rehberi, isteğe bağlı adım).</div>';
    else if (isIOS() && !standalone()) pz = '<div class="lbl" style="margin-top:8px">🔔 Kapalıyken bildirim için önce Paylaş → <b>Ana Ekrana Ekle</b>, sonra uygulamayı simgeden aç.</div>';
    else if (!pushOk()) pz = '<div class="lbl" style="margin-top:8px">Bu tarayıcı kapalıyken bildirimi desteklemiyor (iPhone için iOS 16.4+ gerekir).</div>';
    else if (Notification.permission === 'granted' && localStorage.getItem('hm-push') === '1') pz = '<div class="lbl" style="margin-top:8px">🔔 Kapalıyken bildirim açık: arkadaşlarının dürtmeleri, istekleri ve yorumları telefonuna gelir.</div><div class="row2"><button class="btn ghost" onclick="HMAcct.pushTest()">Deneme bildirimi</button></div>';
    else if (Notification.permission === 'denied') pz = '<div class="lbl" style="margin-top:8px">Bildirim izni reddedilmiş. iPhone: Ayarlar → Bildirimler → HypeMode → İzin Ver.</div>';
    else pz = '<div class="row2"><button class="btn" onclick="HMAcct.push()">🔔 Kapalıyken bildirimleri aç</button></div>';
    return `<div class="card hmacc"><div class="row between"><b>👤 Hesap</b><span class="lbl">${esc(ME && ME.email || '')}</span></div>${pz}${pushState ? `<div class="lbl" style="margin-top:6px">${esc(pushState)}</div>` : ''}
      <div class="row2"><button class="btn ghost" onclick="HMAcct.out()">Çıkış yap</button></div></div>`;
  },
  async out() {
    if (!confirm('Çıkış yapılsın mı? Verilerin hesabında kalır; bu cihazdaki kopya silinir.')) return;
    try { await unsubscribePush() } catch (e) { }
    try { await B.signOut() } catch (e) { }
    try { localStorage.removeItem(APP_KEY); localStorage.removeItem('hm-uid'); localStorage.removeItem('hm-push') } catch (e) { }
    location.reload();
  },
  async push() { await enablePush(true); rerender() },
  async pushTest() {
    const r = await sendTo(ME.uid, { title: 'HypeMode 🔔', body: 'Bildirimler çalışıyor. Uygulamayı kapatsan da arkadaşlarının dürtmeleri gelecek.' });
    pushState = r ? 'Deneme bildirimi gönderildi; birkaç saniye içinde gelmeli.' : 'Gönderilemedi: bildirim sunucusu ayarını kontrol et.'; rerender();
  }
};
const rerender = () => { try { if (typeof window.render === 'function') window.render(true) } catch (e) { } };

/* ---------- kapalıyken bildirim (Web Push) ---------- */
function b64uToU8(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const r = atob(s), a = new Uint8Array(r.length); for (let i = 0; i < r.length; i++)a[i] = r.charCodeAt(i); return a }
async function enablePush(ask) {
  if (!pushOk() || !ME) return false;
  try {
    let perm = Notification.permission;
    if (perm === 'default' && ask) perm = await Notification.requestPermission();
    if (perm !== 'granted') { pushState = perm === 'denied' ? 'İzin verilmedi.' : ''; return false }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToU8(C.push.vapidPublic) });
    await B.set('push/' + ME.uid, { uid: ME.uid, j: JSON.stringify(sub.toJSON()), at: Date.now() });
    localStorage.setItem('hm-push', '1'); pushState = ask ? '✓ Bildirimler açıldı.' : ''; return true;
  } catch (e) { pushState = 'Bildirim açılamadı: ' + (e && e.message || e); return false }
}
async function unsubscribePush() {
  if (!pushOk()) return; const reg = await navigator.serviceWorker.getRegistration(); const sub = reg && await reg.pushManager.getSubscription();
  if (sub) await sub.unsubscribe(); if (ME) await B.del('push/' + ME.uid);
}
async function sendTo(uid, n) {
  if (!(C.push && C.push.worker) || !B) return false;
  try {
    const d = await B.get('push/' + uid); if (!d || !d.j) return false;
    const r = await fetch(C.push.worker, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: JSON.stringify({ key: C.push.key, sub: JSON.parse(d.j), title: n.title, body: n.body, url: location.origin + location.pathname, tag: n.tag || '' }) });
    return r.ok;
  } catch (e) { return false }
}
window.HMPush = {
  notify(to, o, from) {
    const t = o.type, who = from || 'Arkadaşın';
    const n = t === 'req' ? { title: '🤝 Arkadaşlık isteği', body: `${who} seni arkadaş olarak ekledi.` }
      : t === 'acc' ? { title: '🤝 İstek kabul edildi', body: `${who} artık arkadaşın.` }
        : t === 'like' ? { title: '👏 Beğeni', body: `${who} antrenmanını beğendi.` }
          : t === 'cmt' ? { title: '💬 Yorum', body: `${who}: ${o.msg || ''}` }
            : { title: who, body: o.msg || 'Seni dürttü 👋' };
    n.body = String(n.body).slice(0, 180); n.tag = t + ':' + (o.kind || '');
    sendTo(to, n);
  }
};

/* ---------- açılış ---------- */
async function boot() {
  if ('serviceWorker' in navigator && !window.__HM_MOCK) navigator.serviceWorker.register('sw.js').catch(() => { });
  if (!window.__HM_MOCK && !(C.firebase && C.firebase.apiKey && !/YAPISTIR|PASTE/.test(C.firebase.apiKey))) {
    showError('<b>Kurulum eksik.</b><br>config.js dosyasına Firebase bilgilerini yapıştırman gerekiyor (kurulum rehberi, adım 4).'); return;
  }
  const known = localStorage.getItem('hm-uid');
  if (!known) showLoading();
  try { B = await loadBackend() } catch (e) {
    showError('<b>Bağlanılamadı.</b><br>İlk açılışta internet gerekiyor. Bağlantını kontrol edip tekrar dene.', true); return;
  }
  B.onAuth(u => {
    if (!u) { ME = null; if (window.__hmRedirErr) { const c = String(window.__hmRedirErr.code || ''); window.__hmRedirErr = null; if (AUTH_ERR[c]) msg = { t: AUTH_ERR[c] } } showLogin(); return }
    // yeni cihaz ya da başka hesap: bu cihazdaki eski kopyayı temizle, buluttan temiz yükle
    if (localStorage.getItem('hm-uid') !== u.uid) {
      localStorage.setItem('hm-uid', u.uid);
      if (localStorage.getItem(APP_KEY)) { localStorage.removeItem(APP_KEY); location.reload(); return }
    }
    ME = u; hideOvl();
    ready({ db: makeDb(), user: makeUser() });
    if (localStorage.getItem('hm-push') === '1') enablePush(false);
  });
}
boot();
