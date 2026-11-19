/* ===== Kalıcı depolama: IndexedDB ana kayıt, localStorage hızlı açılış kopyası, günlük yedek ===== */
const IDB={db:null,ok:false,ready:false,t:null,p:null,bakDay:null};
const idbReq=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
function idbOpen(){if(IDB.p)return IDB.p;IDB.p=new Promise((ok,no)=>{try{if(!window.indexedDB)return no(new Error('no idb'));const r=indexedDB.open('hypemode',1);
  r.onupgradeneeded=()=>{const d=r.result;['kv','bak'].forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n)})};
  r.onsuccess=()=>{IDB.db=r.result;IDB.ok=true;ok(r.result)};r.onerror=()=>no(r.error);r.onblocked=()=>no(new Error('blocked'))}catch(e){no(e)}});return IDB.p}
async function idbGet(st,k){const d=await idbOpen();return idbReq(d.transaction(st).objectStore(st).get(k))}
async function idbPut(st,k,v){const d=await idbOpen();return idbReq(d.transaction(st,'readwrite').objectStore(st).put(v,k))}
async function idbKeys(st){const d=await idbOpen();return idbReq(d.transaction(st).objectStore(st).getAllKeys())}
async function idbDel(st,k){const d=await idbOpen();return idbReq(d.transaction(st,'readwrite').objectStore(st).delete(k))}
function idbClone(o){try{return structuredClone(o)}catch(e){return JSON.parse(JSON.stringify(o))}}
function idbSaveSoon(){if(!IDB.ready)return;clearTimeout(IDB.t);IDB.t=setTimeout(idbFlush,400)}
async function idbFlush(){clearTimeout(IDB.t);if(!IDB.ready||!IDB.ok)return;const t0=performance.now();
  try{const snap=idbClone(S);await idbPut('kv','state',snap);PERF.idbMs=Math.round(performance.now()-t0);
    const day=dkey();if(IDB.bakDay!==day){IDB.bakDay=day;const ks=(await idbKeys('bak')).sort();if(!ks.includes(day)){await idbPut('bak',day,{ts:Date.now(),s:snap});ks.push(day)}
      for(const k of ks.slice(0,-5))await idbDel('bak',k)}}catch(e){console.warn('idb',e);PERF.err('idb: '+(e&&e.message||e))}}
/* localStorage'a sığdırılan hafif kopya: fotoğraflar ve dakika nabzı IndexedDB'de kalır */
function slimState(){const o={...S};o.photos=(S.photos||[]).map(p=>p&&p.img?{...p,img:''}:p);const h={};Object.entries(S.health||{}).forEach(([d,v])=>{if(v&&v.hr1){const{hr1,...r}=v;h[d]=r}else h[d]=v});o.health=h;o._slim=1;return o}
/* açılışta: IndexedDB'deki tam kayıt ile localStorage kopyasını birleştir, hiçbir veri kaybolmasın */
async function idbBoot(){const t0=performance.now();
  try{await idbOpen();const st=await idbGet('kv','state');
    if(st&&st.settings&&st.plans){
      if(!CL.loaded&&((st._ts||0)>=(S._ts||0)||FRESH||window.__bootFresh)){S=st;FRESH=false;window.__bootFresh=false;delete S._slim;DV++}
      else{/* yerel kopya daha yeni: eksik ağır alanları IndexedDB'den tamamla */
        const im=new Map((st.photos||[]).filter(p=>p&&p.img).map(p=>[p.id,p.img]));(S.photos||[]).forEach(p=>{if(p&&!p.img&&im.has(p.id))p.img=im.get(p.id)});
        Object.entries(st.health||{}).forEach(([d,v])=>{if(v&&v.hr1&&S.health&&S.health[d]&&!S.health[d].hr1)S.health[d].hr1=v.hr1});delete S._slim}
      IDB.ready=true;render(true)}
    else{IDB.ready=true;if(S._slim){/* localStorage hafif kopyası var ama IndexedDB boş: dokunma, tam veriyi kaybetmemek için yazma */delete S._slim}idbFlush()}
    PERF.idbBoot=Math.round(performance.now()-t0)}
  catch(e){IDB.ok=false;IDB.ready=false;PERF.err('idb boot: '+(e&&e.message||e))}}
addEventListener('pagehide',()=>{try{idbFlush()}catch(e){}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){try{idbFlush();if(CL.db&&CL.status==='synced')pushAll()}catch(e){}}});
async function bakList(){try{return (await idbKeys('bak')).sort().reverse()}catch(e){return []}}
async function bakRestore(k){const b=await idbGet('bak',k);if(!b||!b.s)return toast(TT('Yedek bulunamadı','Backup not found'));await idbPut('bak','before-restore',{ts:Date.now(),s:idbClone(S)});S=b.s;delete S._slim;save();render(true);toast(TT('Yedek geri yüklendi','Backup restored'))}
let DV=0;

