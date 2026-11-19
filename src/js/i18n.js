/* ===== Dil (TR / EN): ekrana basılan metinler sözlükle anında çevrilir ===== */
const TT=(tr,en)=>LANG()==='en'?en:tr;const LANG=()=>(S&&S.settings&&S.settings.lang)==='en'?'en':'tr';const LOC=()=>LANG()==='en'?'en-US':'tr-TR';
let I18N=null;const TRL=/[A-Za-zÇĞİÖŞÜçğıöşü]/;
function i18nDict(){if(!I18N){try{I18N=JSON.parse(document.getElementById('i18n-en').textContent)}catch(e){I18N={}}}return I18N}
function trOne(t){const D=i18nDict(),nums=[];const k=t.replace(/\d+(?:[.,]\d+)?/g,m=>{nums.push(m);return '#'});const v=D[k];if(v==null)return null;let i=0;return v.replace(/#/g,()=>nums[i++]??'#')}
function trText(t,dp){dp=dp||0;if(dp>3)return null;let r=trOne(t);if(r!=null)return r;
  const m=t.match(/^([^A-Za-zÇĞİÖŞÜçğıöşü0-9"“(%~+#]*)([\s\S]*?)([\s›…:.⌚]*)$/);
  if(m&&(m[1]||m[3])&&m[2]&&m[2]!==t){const c=trText(m[2],dp+1);if(c!=null)return m[1]+c+m[3]}
  if(t.includes(' · ')){const ps=t.split(' · '),tp=ps.map(p=>trText(p.trim(),dp+1));if(tp.some(x=>x!=null))return ps.map((p,i)=>tp[i]??p).join(' · ')}
  if(m&&m[3]&&m[2]){const c=trOne(m[2]);if(c!=null)return (m[1]||'')+c+m[3]}
  for(const[re,f]of TRPAT){const x=t.match(re);if(x){const a=x.slice(1).map(y=>trText(y,dp+1)??y);if(f.includes(': ')&&a.every((y,i)=>y===x[i+1]))continue;return f.replace(/\$(\d)/g,(_,i)=>a[i-1])}}
  if(!dp){const ss=t.split(/(?<=[.!?;])\s+/);if(ss.length>1){const tr=ss.map(x=>trText(x,1));if(tr.some(x=>x!=null))return ss.map((x,i)=>tr[i]??trUnits(x)).join(' ')}}
  return null}
const TRPAT=[[/^Günaydın, (.+)$/,'Good morning, $1'],[/^İyi günler, (.+)$/,'Good afternoon, $1'],[/^İyi akşamlar, (.+)$/,'Good evening, $1'],[/^İyi geceler, (.+)$/,'Good night, $1'],[/^(.+) ile eşleştir$/,'Match with $1'],[/^(.+) antrenmana başladı$/,'$1 started a workout'],[/^(.+) seni arkadaş olarak ekledi(\.?)$/,'$1 added you as a friend$2'],[/^(.+) isteğini kabul etti$/,'$1 accepted your request'],[/^(.+) antrenmanını beğendi(\.?)$/,'$1 liked your workout$2'],[/^(.+) antrenmanına yorum yaptı$/,'$1 commented on your workout'],[/^(.+) artık arkadaşın\.$/,'$1 is now your friend.'],[/^(.+) için tarif$/,'Recipe for $1'],[/^(.+) programları$/,"$1's programs"],[/^(.+) · (\d+) antrenman$/,'$1 · $2 workouts'],[/^(.+) ile ortak antrenman başladı$/,'Joint workout started with $1'],[/^(.+) adıyla ekle$/,'Add as $1'],[/^Sıradaki: (.+)$/,'Up next: $1'],[/^Hoş geldin, (.+)$/,'Welcome, $1'],[/^Hazırsın, (.+)$/,"You're ready, $1"],[/^(\S+) ile$/,'with $1'],[/^([^:]{1,40}): (.+)$/,'$1: $2']];
function trUnits(t){return t.replace(/(\d+)s (\d+)dk/g,'$1h $2m').replace(/(\d+)\s?dk\b/g,'$1 min').replace(/(\d+)\s?sn\b/g,'$1 s').replace(/\btekrar\b/g,'reps').replace(/\bkayıt yok\b/g,'no records')}
function trNode(n){const v=n.nodeValue;if(!v||!TRL.test(v))return;const t=v.trim();if(!t)return;const r=trText(t);const out=r!=null?r:trUnits(t);if(out!==t)n.nodeValue=v.replace(t,out)}
function i18nApply(root){if(LANG()!=='en'||!root)return;if(root.nodeType===3){trNode(root);return}if(root.nodeType!==1)return;
  if(root.closest&&root.closest('script,style,textarea,[data-noi18n]'))return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&&n.parentElement.closest('script,style,textarea,[data-noi18n]')?2:1});let n;const L=[];while(n=w.nextNode())L.push(n);L.forEach(trNode);
  (root.querySelectorAll?[root,...root.querySelectorAll('[placeholder],[title],[aria-label]')]:[]).forEach(e=>{['placeholder','title','aria-label'].forEach(a=>{const v=e.getAttribute&&e.getAttribute(a);if(v&&TRL.test(v)){const r=trText(v.trim());if(r!=null)e.setAttribute(a,r)}})})}
const i18nObs=new MutationObserver(ms=>{if(LANG()!=='en')return;ms.forEach(m=>{m.addedNodes.forEach(i18nApply);if(m.type==='characterData')trNode(m.target)})});
try{i18nObs.observe(document.body,{childList:true,subtree:true})}catch(e){}
['alert','confirm','prompt'].forEach(f=>{const o=window[f].bind(window);window[f]=(m,...r)=>o(LANG()==='en'&&typeof m==='string'?(trText(m.trim())??trUnits(m)):m,...r)});
function themeMode(){const m=(S.settings&&S.settings.mode)||'dark';return m==='auto'?(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):m}
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(S.settings&&S.settings.mode==='auto')render(true)})}catch(e){}
function applyTheme(){const md=themeMode(),de=document.documentElement;if(de.dataset.mode!==md){de.dataset.mode=md;const tc=document.querySelector('meta[name=theme-color]');if(tc)tc.setAttribute('content',md==='light'?'#f4f4f7':'#000000')}
  let t=(S.settings&&S.settings.theme)||'red';if(!THEMES.some(x=>x[0]===t))t='red';if(document.documentElement.dataset.theme!==t){if(t==='red')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t}}
const themePick=(cur,fn)=>`<div class="thm">${THEMES.map(([k,n,c1,c2])=>`<button class="${cur===k?'on':''}" onclick="${fn}('${k}')"><i style="background:linear-gradient(135deg,${c1},${c2})"></i>${n}</button>`).join('')}</div>`;
function snapPrompt(s){const db=ING();return `Sen deneyimli bir diyetisyen ve gıda görüntü analiz uzmanısın. Görevin fotoğraftaki yemeğin kalori ve makrolarını EN DOĞRU şekilde tahmin etmek.
Adımlar:
1) Fotoğraftaki her yiyeceği ve içeceği ayrı ayrı belirle (Türk mutfağı olabilir). Görünmeyen ama muhtemel bileşenleri (pişirme yağı, tereyağı, sos, şeker) ayrı satır olarak ekle.
2) Porsiyonu ölçek referanslarıyla tahmin et: standart yemek tabağı ~26 cm, servis tabağı ~20 cm, kase ~300–400 ml, çatal ~19 cm, yemek kaşığı ~15 ml, avuç içi ~8×9 cm, ekmek dilimi ~25–30 g. Yüksekliği/derinliği ve ${s.imgs.length>1?'iki açıyı birlikte':'açıyı'} kullan. Pişmiş hâldeki ağırlığı gram olarak ver.
3) Her satır için pişmiş/servis edildiği hâldeki 100 g başına kcal, protein, karbonhidrat, yağ değerlerini USDA / TürKomp gibi kaynaklardaki tipik değerlerle ver. kcal ≈ 4×P + 4×K + 9×Y ile tutarlı olsun.
4) Belirsizliği dürüstçe ver: her satır için gram alt ve üst sınırı (lo, hi) ve 0–1 güven.
${s.hint?`Kullanıcının notu (kesin bilgi olarak kabul et): "${s.hint}"\n`:''}Uygulamanın besin listesindeki adlar (eşleşen varsa bu adı aynen kullan): ${Object.keys(db).slice(0,120).join(', ')}
Yemek değilse ya da tanınamıyorsa items boş dönsün ve error alanına nedenini yaz.
SADECE şu JSON'u döndür:
{"dish":"Türkçe kısa ad","items":[{"name":"Türkçe ad","grams":0,"lo":0,"hi":0,"kcal100":0,"p100":0,"c100":0,"f100":0,"conf":0.0,"hidden":false}],"notes":"porsiyon/pişirme hakkında 1 cümle","tips":"daha doğru sonuç için kullanıcıya 1 kısa öneri","error":null}`}
function foodCtx(){const d=ui.view==='food'?ui.foodDay:dkey(),t=dayTotals(d),st=S.settings,pr=S.profile,ms=dayMeals(d);return `Sen HypeMode uygulamasının diyetisyen koçusun. Türkçe, samimi, kısa ve net cevap ver (en fazla ~120 kelime; gerekirse 3–5 madde). Somut miktar (gram/adet) ve yaklaşık kalori/protein ver. Tıbbi teşhis koyma; hastalık, alerji ya da ilaç sorularında doktora/diyetisyene yönlendir. Sadece yemek, beslenme ve tariflerle ilgili konularda yardımcı ol.
Kullanıcı: ${pr.sex==='f'?'kadın':'erkek'}${pr.age?', '+pr.age+' yaş':''}${pr.weight?', '+pr.weight+' kg':''}${pr.height?', '+pr.height+' cm':''}. Hedef: ${GOALTXT()}.
Günlük hedef: ${st.kcal} kcal, P ${st.protein} g, K ${st.carbs} g, Y ${st.fat} g. Bugün yedikleri: ${ms.length?ms.map(m=>`${m.name} (${Math.round(m.kcal)} kcal)`).join(', '):'henüz bir şey yok'} → toplam ${Math.round(t.kcal)} kcal, P ${Math.round(t.p)} g. Bugün antrenman: ${trainedOn(d).length?'yaptı':'yok'}.
Evdeki malzemeler: ${(S.pantry||[]).join(', ')||'belirtilmemiş'}.`}
async function copyTxt(t){try{await navigator.clipboard.writeText(t);return true}catch(e){try{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();return ok}catch(_){return false}}}
const noAI=()=>`<div class="noai"><b>🤖 ${window.HM_PWA?'AI, Claude ile çalışır':'AI bu hesapta kapalı'}</b><p>${window.HM_PWA?'Bu sürümde yapay zekâ için ücretli anahtar kullanılmıyor.':'Yapıtın Claude kullanan kısımları davetle açan kişilerde çalışmıyor.'} Aynı işi Claude sohbetinde yapabilirsin: aşağıdaki düğme talimatı kopyalar, Claude uygulamasında yeni bir sohbete yapıştırırsın.</p></div>`;
