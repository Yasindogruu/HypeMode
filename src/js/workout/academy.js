/* ===== Egzersiz Akademisi ===== */
const ACX=()=>XDB.concat(typeof XDB_EXTRA!=='undefined'?XDB_EXTRA.filter(x=>!XBY[x[0]]):[]);
const ACLVL=[[1,'Başlangıç','Beginner','#3ee6a0'],[2,'Orta','Intermediate','#ffb547'],[3,'İleri','Advanced','#ff5f7a']];
const AClvOf=l=>ACLVL.find(x=>x[0]===l)||ACLVL[0];
const acName=x=>LANG()==='en'?x[0]:x[1];
const acSlug=x=>encodeURIComponent(x[0]);
const ACSTEPS=[
 [/plank|hollow|wall sit|dead hang|l-sit|hold/i,['Başlangıç pozisyonuna geç; omuzlar dirseklerin/ellerin tam üstünde.','Karnını ve kalçanı sık, başından topuğuna düz bir çizgi oluştur.','Normal nefes alıp vererek pozisyonu süre boyunca koru.','Form bozulmaya başladığında seti bitir; kaliteli süre, uzun süreden iyidir.'],['Kalçanın düşmesi ya da havaya kalkması','Nefesi tutmak']],
 [/push ?up|bench|chest press|floor press|dip/i,['Elleri/barı omuz genişliğinden biraz geniş kavra, kürek kemiklerini geriye-aşağı sık.','Ağırlığı kontrollü şekilde göğüs hizasına indir; dirsekler gövdeyle ~45° açı yapsın.','Altta bir an dur, göğsünü sıkarak yukarı it.','Üstte dirsekleri tam kilitlemeden bir sonraki tekrara geç.'],['Dirsekleri 90° yana açmak','Kalçayı sehpadan kaldırmak','Ağırlığı göğüsten sektirmek']],
 [/overhead|shoulder press|military|arnold|pike|push press/i,['Ağırlığı omuz hizasında tut, karnını ve kalçanı sık.','Ağırlığı başının üstüne doğru düz bir çizgide it.','Üstte kollar kulak hizasına gelsin, omuzları kulağa çekme.','Kontrollü şekilde omuz hizasına geri indir.'],['Beli aşırı kavislendirmek','Ağırlığı öne doğru itmek']],
 [/pull ?up|chin ?up|pulldown|lat pull/i,['Barı omuz genişliğinden biraz geniş kavra, kollar tam uzun başla.','Önce kürek kemiklerini aşağı çek, sonra dirsekleri kalçana doğru götür.','Göğsünü bara yaklaştır, çene barın üstüne çıksın.','Kontrollü şekilde kolları tam uzatarak in.'],['Sallanarak çekmek','Yarım tekrar yapmak']],
 [/row|pull ?apart|face pull|reverse fly|rear delt/i,['Gövdeni sabitle; sırt düz, göğüs açık.','Hareketi kürek kemiklerini birbirine yaklaştırarak başlat.','Dirsekleri vücudun arkasına doğru çek, sonda 1 saniye sık.','Ağırlığı kontrollü şekilde başlangıca bırak, sırtın esnediğini hisset.'],['Gövdeyi sallamak','Omuzları kulağa doğru kaldırmak']],
 [/curl/i,['Dirsekleri gövdenin yanına sabitle, avuçlar yukarı ya da hareketin tutuşuna göre.','Sadece dirsekten bükerek ağırlığı omuza doğru kaldır.','Üstte bicepsi 1 saniye sık.','2–3 saniyede kontrollü şekilde kolları tam uzatarak indir.'],['Gövdeyle sallanmak','Dirsekleri öne kaydırmak']],
 [/tricep|pushdown|skull|kickback|extension.*(arm|tri)|close grip/i,['Dirsekleri sabitle; sadece önkol hareket edecek.','Kolu tam uzatarak tricepsi sık.','Ağırlığı kontrollü şekilde başlangıç noktasına geri bırak.','Dirseklerin yana açılmasına izin verme.'],['Dirsekleri yana açmak','Gövdeyle itmek']],
 [/lateral raise|front raise|y raise|upright/i,['Ağırlıkları yanda tut, dirsekler hafif bükük.','Kolları omuz hizasına kadar kaldır; hareketi dirsekler yönetsin.','Üstte 1 saniye bekle.','Yavaşça indir, gerginliği altta da koru.'],['Ağır ağırlıkla sallamak','Omuzları kulağa kaldırmak']],
 [/fly|crossover|pec deck/i,['Kolları hafif bükük ve sabit tut.','Göğsü açarak kolları geniş bir yay çizerek aç; göğüste gerilme hisset.','Göğsünü sıkarak kolları önde birleştir.','Kontrollü şekilde tekrar aç.'],['Dirsekleri bükerek preslemek','Çok derine inip omzu zorlamak']],
 [/swing/i,['Ayaklar omuz genişliğinde, kettlebell önünde.','Kalçadan menteşe yap, kettlebelli bacaklarının arasından geriye savur.','Kalçanı patlayıcı şekilde öne iterek kettlebelli göğüs hizasına kaldır.','Kollar sadece tutar, güç kalçadan gelir; kontrollü şekilde tekrar geriye savur.'],['Squat gibi çömelmek','Kollarla kaldırmak']],
 [/hip thrust|glute bridge|bridge/i,['Üst sırtın sehpada/yerde, ayaklar dizlerin altında.','Topuklardan iterek kalçayı yukarı kaldır.','Üstte kalçayı 1–2 saniye sık; gövde ve uyluk düz çizgi olsun.','Kontrollü şekilde indir, kalça yere değmeden tekrar et.'],['Beli aşırı kavislendirmek','Dizleri içe düşürmek']],
 [/kickback|abduct|clamshell|fire hydrant|donkey/i,['Gövdeni sabitle, karın sıkı.','Bacağı kontrollü şekilde hareket yönüne götür.','Hareketin sonunda kalçayı 1 saniye sık.','Yavaşça başlangıca dön.'],['Bel ile hareket etmek','Hızlı ve kontrolsüz yapmak']],
 [/leg curl|nordic/i,['Makineye ya da pozisyona yerleş; diz eksenle hizalı.','Topuğu kalçaya doğru çek, arka bacağı sık.','Üstte 1 saniye bekle.','2–3 saniyede kontrollü şekilde bırak.'],['Kalçayı kaldırmak','Ağırlığı düşürmek']],
 [/leg extension/i,['Sırt dayalı otur, diz makinenin dönme noktasıyla hizalı.','Bacağı tamamen uzatarak ön bacağı sık.','Üstte 1 saniye bekle.','Kontrollü şekilde indir.'],['Sallanarak kaldırmak']],
 [/calf|heel raise/i,['Ayak ucunun önü bir basamakta/yerde, topuklar serbest.','Topuğunu aşağı indirip baldırı esnet.','Parmak ucunda yükselerek baldırı sık, üstte 1–2 saniye bekle.','Yavaşça indir.'],['Sektirerek hızlı yapmak','Yarım hareket']],
 [/crunch|sit ?up|leg raise|knee raise|v ?up|toe|russian|twist|bicycle|flutter|ab /i,['Belini nötr tut, karnını içe çek.','Hareketi karın kaslarıyla başlat; boyundan çekme.','Hareketin sonunda karnı 1 saniye sık.','Kontrollü şekilde başlangıca dön.'],['Boyundan çekmek','Momentumla sallanmak']],
 [/shrug/i,['Ağırlıkları yanında tut, kollar düz.','Omuzlarını kulaklarına doğru yukarı kaldır.','Üstte 1–2 saniye sık.','Yavaşça indir; omuzları döndürme.'],['Omuzları döndürmek']],
 [/stretch|circle|mobility|rotation|cat|cobra|child/i,['Rahat ve dengeli bir pozisyon al.','Hareketi yavaş ve kontrollü yap, gerilmeyi hisset.','Her pozisyonda 20–30 saniye kal ya da tekrarları sakin yap.','Ağrı değil, hafif gerilme hissi olmalı.'],['Sektirmek','Nefesi tutmak']]];
const ACSTEP_GEN={chest:ACSTEPS[1],back:ACSTEPS[4],shoulders:ACSTEPS[2],biceps:ACSTEPS[5],triceps:ACSTEPS[6],quads:[['Ayaklar omuz genişliğinde, karın sıkı.','Kalça ve dizleri birlikte bükerek kontrollü in.','Dizler ayak parmaklarıyla aynı yönde olsun.','Topuklardan iterek yukarı kalk.'],['Dizlerin içe çökmesi','Topukların kalkması']],hamstrings:[['Dizler hafif bükük, sırt düz.','Kalçayı geriye iterek gövdeyi öne eğ.','Arka bacakta gerilme hissedince dur.','Kalçayı öne iterek başlangıca dön.'],['Beli yuvarlamak']],glutes:ACSTEPS[10],calves:ACSTEPS[14],core:ACSTEPS[15]};
function acGuide(x){const f=formOf(x[0]);if(f&&f.cues&&f.cues.length)return{steps:f.cues,err:f.err||[]};
  const t=ACSTEPS.find(([re])=>re.test(x[0]));let s=t?t.slice(1):ACSTEP_GEN[x[2]]||ACSTEPS[1].slice(1);if(s[0] instanceof RegExp)s=s.slice(1);return{steps:s[0],err:s[1]||[]}}
function acRx(x){const t=x[5],l=x[4],bw=x[3]==='bodyweight'||x[3]==='band';
  if(t==='t')return [l>=3?'3–4':'3',l>=2?'30–60 sn':'20–40 sn','45–60 sn'];
  if(t==='c')return bw?['3–4','8–15','60–90 sn']:[l>=3?'4':'3–4',l>=3?'5–8':'6–10','2–3 dk'];
  return ['3',bw?'12–20':'10–15','60–90 sn']}
const acVidTR=x=>'https://www.youtube.com/results?search_query='+encodeURIComponent(x[1]+' nasıl yapılır');
const acVidEN=x=>'https://www.youtube.com/results?search_query='+encodeURIComponent(x[0]+' exercise proper form');
const ACAC_MUS=['chest','back','shoulders','biceps','triceps','core','quads','hamstrings','glutes','calves'];
function acFiltered(){const a=ui.ac||{},qn=ingNorm(a.q||'');
  return ACX().filter(x=>(!a.m||x[2]===a.m)&&(!a.eq||x[3]===a.eq)&&(!a.lv||x[4]===a.lv)&&(!qn||ingNorm(x[0]).includes(qn)||ingNorm(x[1]).includes(qn)))
   .sort((p,q)=>p[4]-q[4]||acName(p).localeCompare(acName(q),'tr'))}
function acCard(x){const lv=AClvOf(x[4]),eq=EQ.find(e=>e[0]===x[3]);
  return `<button class="ac-c" onclick="A.exd('${ja(x[0])}')"><span class="ac-top"><span class="ac-lv" style="--lc:${lv[3]}">${TT(lv[1],lv[2])}</span><span class="ac-mus">${MUSCLES[x[2]]||''}</span></span><span class="ac-n">${esc(acName(x))}</span><span class="ac-en">${esc(LANG()==='en'?x[1]:x[0])}</span><span class="ac-eq">${eq?eq[1]+' '+eq[2]:''}${x[5]==='t'?' · ⏱':''}</span></button>`}
function acList(){const L=acFiltered(),n=(ui.ac&&ui.ac.n)||36;
  return `<div class="ac-cnt">${L.length} ${TT('hareket','exercises')}</div><div class="ac-grid">${L.slice(0,n).map(acCard).join('')}</div>${L.length>n?`<button class="btn ghost" style="margin-top:14px" onclick="A.acMore()">${TT('Daha fazla göster','Show more')} (${L.length-n})</button>`:''}${!L.length?`<div class="empty">${TT('Bu filtrelere uyan hareket yok.','No exercises match these filters.')}</div>`:''}`}
function academyV(){ui.ac=ui.ac||{};const a=ui.ac,lvSel={};if(a.m)lvSel[a.m]=1;
  const chip=(k,v,l)=>`<button class="${a[k]===v?'on':''}" onclick="A.acF('${k}',${typeof v==='number'?v:`'${v}'`})">${l}</button>`;
  return `<div class="st-hero"><div class="st-top" style="padding:14px 20px 4px"><button class="back" onclick="A.go('programs')" aria-label="Geri">‹</button><div class="st-title">${TT('Egzersiz Akademisi','Exercise Academy')}</div><span style="width:36px"></span></div>
   <div class="lbl" style="padding:0 20px 12px;text-align:center">${ACX().length} ${TT('hareket · adım adım anlatım, sık hatalar ve video. Vücut haritasından kas seçebilirsin.','exercises · step-by-step guides, common mistakes and video. Pick a muscle on the body map.')}</div></div>
  <div class="ac-wrap dkfull">
   <div class="ac-side">
    <div class="ac-body">${bodySvg(lvSel,{click:1,cls:'acb'})}<div class="lbl" style="text-align:center;margin-top:6px">${a.m?`<b style="color:var(--txt)">${MUSCLES[a.m]}</b> · <button class="link" style="display:inline;padding:0" onclick="A.acF('m','${a.m}')">${TT('temizle','clear')}</button>`:TT('Bir kasa dokun','Tap a muscle')}</div></div>
   </div>
   <div class="ac-main">
    <div class="ac-search"><input id="acq" placeholder="${TT('Hareket ara… (ör. squat, şınav, curl)','Search exercise… (e.g. squat, push up, curl)')}" value="${esc(a.q||'')}" oninput="A.acQ(this.value)"></div>
    <div class="ac-chips">${ACAC_MUS.map(m=>chip('m',m,MUSCLES[m])).join('')}</div>
    <div class="ac-chips">${EQ.map(e=>chip('eq',e[0],e[1]+' '+e[2])).join('')}</div>
    <div class="ac-chips">${ACLVL.map(l=>chip('lv',l[0],TT(l[1],l[2]))).join('')}</div>
    <div id="acl">${acList()}</div>
   </div></div>`}
function exdV(){const x=XBY[ui.exd]||ACX().find(r=>r[0]===ui.exd);if(!x){ui.view='academy';return academyV()}
  const lv=AClvOf(x[4]),eq=EQ.find(e=>e[0]===x[3]),emv=exMus(x[0],x[2])||{},sec=Object.keys(emv).filter(k=>k!==x[2]&&emv[k]<1&&MUSC2[k]),g=acGuide(x),rx=acRx(x);
  const lvm=emv;
  const hist=S.sessions.flatMap(s=>s.sets.filter(t=>t.ex===x[0]).map(t=>({...t,d:s.date})));
  const best=hist.length?(x[5]==='t'||hist.every(h=>!(h.kg>0))?Math.max(...hist.map(h=>h.reps||0))+(x[5]==='t'?' sn':' tekrar'):fmt(Math.max(...hist.map(h=>h.kg)))+' kg'):null;
  const sim=ACX().filter(r=>r[2]===x[2]&&r[0]!==x[0]).sort((p,q)=>(p[3]===x[3]?0:1)-(q[3]===x[3]?0:1)||Math.abs(p[4]-x[4])-Math.abs(q[4]-x[4])).slice(0,6);
  return `<div class="st-hero"><div class="st-top" style="padding:14px 20px 4px"><button class="back" onclick="A.go('academy')" aria-label="Geri">‹</button><div class="ac-bc">${TT('Akademi','Academy')} › ${MUSCLES[x[2]]}</div><span style="width:36px"></span></div></div>
  <div class="exd dkfull">
   <div class="exd-head"><div class="exd-info"><span class="ac-lv" style="--lc:${lv[3]}">${TT(lv[1],lv[2])}</span><h1 class="exd-t">${esc(acName(x))}</h1><div class="ac-en">${esc(LANG()==='en'?x[1]:x[0])}</div>
     <div class="exd-tags"><span><small>${TT('Hedef kas','Target')}</small><b>${MUSCLES[x[2]]}</b></span>${sec.length?`<span><small>${TT('Yardımcı','Secondary')}</small><b>${sec.map(k=>MUSC2&&MUSC2[k]||MUSCLES[k]||k).join(', ')}</b></span>`:''}<span><small>${TT('Ekipman','Equipment')}</small><b>${eq?eq[1]+' '+eq[2]:'-'}</b></span><span><small>${TT('Tip','Type')}</small><b>${x[5]==='c'?TT('Çok eklemli','Compound'):x[5]==='t'?TT('Süreli','Timed'):TT('Tek eklemli','Isolation')}</b></span></div></div>
    <div class="exd-map">${bodySvg(lvm,{cls:'acb'})}</div></div>
   ${m3dBox({name:x[0],en:x[1],muscle:x[2]})}<a class="ytb" href="${acVidTR(x)}" target="_blank" rel="noopener" aria-label="YouTube'da izle"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M23 12s0-3.6-.46-5.3a2.8 2.8 0 0 0-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.6.5a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.3a2.8 2.8 0 0 0 2 2c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.8 2.8 0 0 0 2-2C23 15.6 23 12 23 12z" fill="#ff0033"/><path d="M9.8 15.4V8.6l5.9 3.4z" fill="#fff"/></svg>YouTube</a>
   <div class="exd-grid">
    <div class="card exd-c"><b>${TT('Nasıl yapılır?','How to do it')}</b><ol class="exd-steps">${g.steps.map((s,i)=>`<li><span>${i+1}</span><p>${esc(s)}</p></li>`).join('')}</ol>${x[6]?`<div class="exd-tip"><b>💡 ${TT('İpucu','Tip')}</b> ${esc(x[6])}</div>`:''}</div>
    <div class="exd-col">
     <div class="card exd-c"><b>${TT('Önerilen','Suggested')}</b><div class="exd-rx"><div><small>${TT('Set','Sets')}</small><b>${rx[0]}</b></div><div><small>${x[5]==='t'?TT('Süre','Time'):TT('Tekrar','Reps')}</small><b>${rx[1]}</b></div><div><small>${TT('Dinlenme','Rest')}</small><b>${rx[2]}</b></div></div>
      <div class="lbl" style="margin-top:8px">${TT('Son 1–3 tekrar zorlayıcı olmalı (RPE 7–9). Hedef aralığın üstüne çıkınca ağırlığı artır.','The last 1–3 reps should be hard (RPE 7–9). Add weight once you pass the top of the range.')}</div></div>
     ${g.err&&g.err.length?`<div class="card exd-c"><b>${TT('Sık yapılan hatalar','Common mistakes')}</b>${g.err.map(e=>`<div class="exd-err">✕ ${esc(e)}</div>`).join('')}</div>`:''}
     ${best?`<div class="card exd-c"><b>${TT('Senin geçmişin','Your history')}</b><div class="exd-rx"><div><small>${TT('Set','Sets')}</small><b>${hist.length}</b></div><div><small>${TT('En iyi','Best')}</small><b>${best}</b></div></div><button class="link" onclick="A.exInfo('${encodeURIComponent(x[0])}')">${TT('Detaylı ilerleme','Detailed progress')} ›</button></div>`:''}
    </div></div>
   <div class="exd-act"><button class="btn" onclick="A.acTry('${ja(x[0])}')">⚡ ${TT('Hemen antrenman yap','Train it now')}</button><button class="btn ghost" onclick="A.acAdd('${ja(x[0])}')">＋ ${TT('Şablona ekle','Add to template')}</button></div>
   ${sim.length?`<div class="exd-sim"><b>${TT('Benzer egzersizler','Similar exercises')}</b><div class="ac-grid">${sim.map(acCard).join('')}</div></div>`:''}
  </div>`}

/* ---------- 3D hareket önizlemesi (m3d.js, Three.js) ---------- */
let M3D=null;const M3I=[];
function m3dBox(e,h){return `<div class="m3d" style="${h?'height:'+h:''}" data-n="${esc(e.name+' | '+(e.en||(i18nDict()[e.name])||''))}" data-m="${esc(e.muscle||'')}"><div class="m3d-ld"><div class="spin"></div></div></div>`}
function m3dScan(){for(let i=M3I.length-1;i>=0;i--){if(!document.body.contains(M3I[i].el)){try{M3I[i].h&&M3I[i].h.destroy()}catch(e){}M3I.splice(i,1)}}
  const els=[...document.querySelectorAll('.m3d:not([data-on])')];if(!els.length)return;
  M3D=M3D||import('./m3d.js?v=5').catch(e=>{M3D=null;throw e});
  els.forEach(el=>{el.dataset.on=1;const rec={el,h:null};M3I.push(rec);
    M3D.then(m=>{if(!document.body.contains(el))return;rec.h=m.mount(el,{name:el.dataset.n,muscle:el.dataset.m,accent:getComputedStyle(document.documentElement).getPropertyValue('--gA').trim()||'#ff3b30'});el.classList.add('rdy')}).catch(()=>{el.classList.add('err');el.querySelector('.m3d-ld').innerHTML=`<small>${TT('3D önizleme yüklenemedi','3D preview could not load')}</small>`})})}
function secOrder(){try{secOrder0()}finally{$app.querySelectorAll('.secw').forEach(w=>w.replaceWith(...w.childNodes))}}
function secOrder0(){const kind=ui.view==='home'?'home':ui.view==='food'?'food':ui.view==='programs'?'pg':null;if(!kind)return;const ord=(S.settings.ord||{})[kind]||(kind==='home'?HDEF:null);if(!ord||!ord.length)return;
  const groups=new Map();$app.querySelectorAll('.secw[data-sec]').forEach(el=>{const p=el.parentNode;if(!groups.has(p))groups.set(p,[]);groups.get(p).push(el)});
  groups.forEach(els=>{if(els.length<2)return;const pos=els.map(e=>{const m=document.createComment('s');e.parentNode.insertBefore(m,e);return m});
    const sorted=els.slice().sort((a,b)=>{const x=ord.indexOf(a.dataset.sec),y=ord.indexOf(b.dataset.sec);return (x<0?999:x)-(y<0?999:y)});
    sorted.forEach((e,i)=>pos[i].parentNode.replaceChild(e,pos[i]))})}
/* Sade görünüm: metin içindeki emojileri temizle (tek başına simge olanlar kalır) */
const EMOX=/\s?(?:[☀-➿⬀-⯿⌚⌛⏩-⏺▶◀]|\p{Extended_Pictographic})[\u{1F3FB}-\u{1F3FF}]?️?(?:‍(?:\p{Extended_Pictographic}|[☀-➿])[\u{1F3FB}-\u{1F3FF}]?️?)*\s?/gu,EMO1=/[☀-➿⬀-⯿⌚⌛⏩-⏺▶◀]|\p{Extended_Pictographic}/u;
const EKEEP=new Set([...'✓✔✕✖✗✘↔↩↪→←↑↓⬅➡⬆©®™★☆●○■□▪▫◆◇▲▼•✚']);
const EIP={flame:'<path d="M12 3c1 3 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-2.2 1.2-3.5 2.2-4.5 0 2 1 3 2.3 3.2C11 8.5 12.2 6 12 3z"/>',drop:'<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',heart:'<path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 0 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1z"/>',pen:'<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7.5 18.5 3 20l1.5-4.5z"/>',fork:'<path d="M5 3v6.5a2.5 2.5 0 0 0 5 0V3M7.5 3v18M18.5 21V3C16 3 14.5 5.5 14.5 9v5h4"/>',moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',dumb:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',pill:'<path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7zM7.5 10.5l6 6"/>',cam:'<path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',cloud:'<path d="M7 18.5a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 10a4.3 4.3 0 0 1-.5 8.5z"/>',phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',ring:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',alert:'<path d="M10.3 4 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0zM12 9.5v4M12 17h.01"/>',trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5.5a2.5 2.5 0 0 0 2.6 3.5M16 6h2.5a2.5 2.5 0 0 1-2.6 3.5M12 13v4M8.5 20.5h7M10 17h4v3.5h-4z"/>',clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',bars:'<path d="M5 20v-6M12 20V5M19 20v-9M3 20.5h18"/>',spark:'<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9zM19 16v4M17 18h4"/>',cup:'<path d="M5 8.5h11v5.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5v2M12.5 3.5v2"/>',bolt:'<path d="M13 2.5 4.5 14H11l-1 7.5L18.5 10H12z"/>',scale:'<path d="M12 4v16.5M7.5 20.5h9M5 7.5h14M5 7.5l-2.7 6.5a2.9 2.9 0 0 0 5.4 0zM19 7.5l-2.7 6.5a2.9 2.9 0 0 0 5.4 0z"/>',bell:'<path d="M6 16.5v-5.5a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 21h4"/>',cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.8l2.4 12h11.5L21.5 7H6.2"/>',bot:'<rect x="4" y="8" width="16" height="12" rx="3.5"/><path d="M12 4v4M9 13.5v1M15 13.5v1M2 13v3M22 13v3"/>',book:'<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/>',walk:'<circle cx="13" cy="4.5" r="1.8"/><path d="M9.5 21l2.2-6.2-2.7-2.8 1.8-4.5 3.7 2.7h3M8.5 12.5 6.5 15.5"/>',target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',msg:'<path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z"/>',clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V4M9 10.5h6M9 14.5h4"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2.2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',home:'<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>',watch:'<rect x="6.5" y="6" width="11" height="12" rx="3"/><path d="M9 6l.8-3.5h4.4L15 6M9 18l.8 3.5h4.4L15 18M12 9.5V12l1.5 1"/>',play:'<path d="M7.5 4.5v15l12-7.5z" fill="currentColor"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.4.8 2.4h6c0-1 .3-1.8.9-2.4A6 6 0 0 0 12 3z"/>',sync:'<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3.5V8h4.5M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20.5V16h-4.5"/>',down:'<path d="M12 4v11.5M6.5 10.5l5.5 5.5 5.5-5.5M5 20.5h14"/>',star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',leaf:'<path d="M5.5 19.5c-.5-9 5-15 15-15 0 10-6 15.5-14.5 15M5.5 19.5l7.5-7.5"/>',medal:'<circle cx="12" cy="15" r="5.5"/><path d="M8.5 3.5l2 6.5M15.5 3.5l-2 6.5M12 13v3.5"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',pulse:'<path d="M3 12h4l2.5-6 4 12 2.5-6h5"/>',img:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 16l-5-5L5 19.5"/>',link:'<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4L11.5 6M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5"/>',save:'<path d="M5 3.5h11l3.5 3.5v12.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1zM8 3.5v5h7v-5M7.5 20.5v-6h9v6"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',hand:'<path d="M7 11.5V6a1.5 1.5 0 0 1 3 0v4.5M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V11M16 9a1.5 1.5 0 0 1 3 0v4.5a7.5 7.5 0 0 1-7.5 7.5h-.4a7 7 0 0 1-5.4-2.6L3 14.5a1.6 1.6 0 0 1 2.4-2.1L7 14"/>',check:'<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',rock:'<path d="M4 18l3-8 5-4 5 3 3 9z"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.3-4.3"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',build:'<path d="M4 21V5.5L10 3v18M10 8h7.5a1 1 0 0 1 1 1v12M3 21h18M7 8v.01M7 12v.01M7 16v.01M14 12v.01M14 16v.01"/>',hour:'<path d="M6.5 3h11M6.5 21h11M7.5 3v3.5L12 12l4.5-5.5V3M7.5 21v-3.5L12 12l4.5 5.5V21"/>',dna:'<path d="M7 3c0 6 10 6 10 12v6M17 3c0 6-10 6-10 12v6M8 7h8M8 17h8"/>',lungs:'<path d="M12 4v7M12 11c-1 1-2 1.5-3 1.5M12 11c1 1 2 1.5 3 1.5M8.5 7C6 7 3.5 11 3.5 16c0 2.5 1.5 3.5 3.5 3.5s2.5-1.5 2.5-4V8zM15.5 7c2.5 0 5 4 5 9 0 2.5-1.5 3.5-3.5 3.5s-2.5-1.5-2.5-4V8z"/>'};
const EMAP={};(s=>s.split(' ').forEach(p=>{const[k,v]=p.split(':');[...v].forEach(c=>{if(c!=='️')EMAP[c]=k})}))('flame:🔥 drop:💧🩸🫧💦 heart:♥❤💓💚🤍💜💙🧡💛🖤❣💗💖 pen:✎✏✍📝🖊 fork:🍴🍽🍳🥗🥘🍲🍛🍝🍚🥣🥪🌯🍗🍖🥩🐟🍣🥞🥑🫐🥒🥬🍎🍏🥛🍯🥚🥜🍰🍉🧂🍵🧃🥤🍞🥐🧀🍌🍓🍇🥕🥦🌽🍠🥔🍤🍜🍱🥙🌮🍕🍔🍟🍫🍪🍩🍦🧁🍷🍺🥂🥫🫘🫒🌰 moon:🌙😴☾🛌🛋💤🌛 dumb:🏋💪⚒🦾 pill:💊💉🧪🩹 cam:📷📸📹🎥 cloud:☁⛅🌤 phone:📱📲 ring:🌸⭕🔴🟢🟡🔵🟠🟣⚪⚫🌀➰ user:🧑👤👥🧍🧘👩👨🧔👧👦🙋 alert:⚠🚨❗❓⛔🚫 trophy:🏆🏅🎖 medal:🥇🥈🥉 clock:⏱⏰⏲🕐🕘🕰⌛ hour:⏳ bars:📊📈📉 spark:✨🎉🎊🥳⭐🌟💫 cup:☕🍶 bolt:⚡🔋 scale:⚖📏 bell:🔔🔕📣📢 cart:🛒🛍 bot:🤖🧠 book:📘📚📖📗📙📕📓🎓 walk:🚶🏃👟🚴🏊🚣🏄⛹🤸🪜🧗 target:🎯 msg:💬🗨💭 clip:📋🗒📄📑🧾 lock:🔒🔐🔓🔑 sun:☀🌞🌅🌄 home:🏠🏡 build:🏢🏬🏫 watch:⌚ play:▶⏯⏸⏩ bulb:💡 sync:🔄🔁🔃♻ down:⬇📥 leaf:🌱🌿🍃🌳🌲🍀 eye:👁👀 pulse:🩺🫀 lungs:🫁🌬 img:🖼🌄 link:🔗 save:💾 gear:⚙🔧🛠 cal:📅📆🗓 hand:👏👋🤝👊👍✌🙌🙏✋ check:✅☑✔ flag:⚑🚩🏁 rock:🪨 search:🔍🔎 globe:🌍🌎🌏🌐 dna:🧬 star:⭐');
EMAP['⭐']='star';
const eiSvg=k=>`<svg class="ei ei-${k}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${EIP[k]}</svg>`;
function emoKey(m){const c=[...m.replace(/\s|️/g,'')];if(!c.length)return null;if(EKEEP.has(c[0])&&c.length===1)return '';for(const ch of c.slice().reverse()){if(EMAP[ch])return EMAP[ch]}const cp=c[0].codePointAt(0);if((cp>=0x1F32D&&cp<=0x1F37F)||(cp>=0x1F950&&cp<=0x1F96F)||(cp>=0x1F9C0&&cp<=0x1F9CB)||(cp>=0x1FAD0&&cp<=0x1FADB))return 'fork';return null}
/* emoji → tek tip çizgi ikon (metin düğümlerinde); bilinmeyenler kaldırılır */
function emoText(s){return s.replace(EMOX,m=>{const k=emoKey(m);if(k==='')return m;return /^\s/.test(m)&&/\s$/.test(m)?' ':m.trim()===m?'':' '})}
function stripEmo(root){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||!EMO1.test(n.nodeValue))return NodeFilter.FILTER_REJECT;if(p.closest('input,textarea,select,option,script,style,[data-emo],.fp-cap,.fp-cm,.pn-cap,.qsp,.dsp,.fc-ml,svg'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}}),L=[];
  while(w.nextNode())L.push(w.currentNode);
  L.forEach(n=>{const s=n.nodeValue;EMOX.lastIndex=0;let out='',last=0,any=false,m;const parts=[];
    while((m=EMOX.exec(s))){const k=emoKey(m[0]);if(k==='')continue;parts.push(s.slice(last,m.index));const pre=/^\s/.test(m[0]),post=/\s$/.test(m[0]);
      if(k&&EIP[k]){parts.push({k,pre,post});any=true}else parts.push(pre&&post?' ':'');last=m.index+m[0].length}
    if(!parts.length)return;parts.push(s.slice(last));
    if(!any){const t=parts.join('').replace(/\s{2,}/g,' ');n.nodeValue=t;return}
    const f=document.createDocumentFragment(),tmp=document.createElement('template');
    parts.forEach((p,i)=>{if(typeof p==='string'){if(p)f.appendChild(document.createTextNode(p));return}
      const prevTxt=parts.slice(0,i).some(q=>typeof q==='string'?q.trim():true),nextTxt=parts.slice(i+1).some(q=>typeof q==='string'?q.trim():true);
      if(p.pre&&prevTxt)f.appendChild(document.createTextNode(' '));tmp.innerHTML=eiSvg(p.k);const sv=tmp.content.firstChild;if(!prevTxt&&!nextTxt)sv.classList.add('solo');f.appendChild(sv);if(nextTxt)f.appendChild(document.createTextNode(' '))});
    n.parentNode.replaceChild(f,n)})}
/* Safari'de çok sütunlu (columns) düzen, sütunlara yayılan başlıkla birlikte kartları çift çiziyor: sütunları elle kur */
function dkUnsplit(){$app.querySelectorAll(':scope>.dkc').forEach(g=>{const it=[...g.querySelectorAll(':scope>.dkcol>*')].sort((x,y)=>(+x.dataset.dko||0)-(+y.dataset.dko||0));it.forEach(e=>g.before(e));g.remove()})}
function dkSplit(){dkUnsplit();$app.classList.remove('dkj');return;const n=parseInt(getComputedStyle($app).columnCount)||0;if(n<2)return;
  const kids=[...$app.children].filter(e=>{if(/^(NAV|SCRIPT|STYLE)$/.test(e.tagName))return false;const cs=getComputedStyle(e);return cs.position!=='fixed'&&cs.position!=='absolute'&&cs.display!=='none'});
  $app.classList.add('dkj');let grp=null;
  for(const e of kids){const span=getComputedStyle(e).columnSpan==='all'||e.matches('.hero,.st-hero,.pad,.kgrid,.rc-grid,.tl,.hw-entry,.dkfull,.htg');
    e.dataset.dko=String(kids.indexOf(e));if(span){grp=null;continue}
    if(!grp){grp=document.createElement('div');grp.className='dkc';for(let i=0;i<n;i++){const c=document.createElement('div');c.className='dkcol';grp.appendChild(c)}e.before(grp)}
    const cols=[...grp.children];let best=cols[0];for(const c of cols)if(c.offsetHeight<best.offsetHeight)best=c;best.appendChild(e)}}
function navCam(){const c=document.querySelector('.navcam'),n=document.querySelector('nav.tabs');if(!c||!n)return;if(matchMedia('(min-width:960px) and (pointer:fine)').matches||getComputedStyle(n).display==='none'){c.style.display='none';n.classList.remove('hcam');return}c.style.display='';n.classList.add('hcam');const cw=c.offsetWidth||58,nw=n.offsetWidth,g=8,L=Math.round((innerWidth-(nw+g+cw))/2);n.style.setProperty('left',L+'px','important');n.style.setProperty('transform','none','important');const r=n.getBoundingClientRect();c.style.left=(r.right+g)+'px';c.style.top=(r.top+(r.height-cw)/2)+'px'}
addEventListener('resize',()=>{try{navCam();tabLens._p=null;tabLens()}catch(e){}clearTimeout(window.__dkT);window.__dkT=setTimeout(()=>{try{dkSplit();navCam()}catch(e){}},120)});
try{document.fonts&&document.fonts.ready.then(()=>{try{tabLens._p=null;tabLens()}catch(e){}})}catch(e){}
function tabLens(){const nav=$app.querySelector('nav.tabs');if(!nav||matchMedia('(min-width:960px) and (pointer:fine)').matches)return;const on=nav.querySelector('button.on:not(.dko)');
  if(!nav.__ro&&window.ResizeObserver){nav.__ro=new ResizeObserver(()=>{clearTimeout(nav.__rt);nav.__rt=setTimeout(()=>{try{tabLens()}catch(e){}},30)});nav.querySelectorAll('button').forEach(b=>nav.__ro.observe(b))}let L=nav.querySelector('.tlens');if(!L){L=document.createElement('i');L.className='tlens';L.setAttribute('aria-hidden','true');nav.prepend(L)}nav.classList.add('lz');
  if(!on){L.style.opacity=0;return}const x=on.offsetLeft,w=on.offsetWidth;
  const pv=tabLens._p;L.style.transition='none';L.style.width=w+'px';L.style.transform=`translateX(${pv!=null?pv:x}px)`;L.style.opacity=1;void L.offsetWidth;
  if(pv!=null&&pv!==x){L.style.transition='';L.classList.remove('mv');void L.offsetWidth;L.classList.add('mv');L.style.transform=`translateX(${x}px)`}tabLens._p=x}
function tabs(dkOnly){
  const b=(k,ic,l,on)=>`<button class="${on?'on':''}" onclick="A.go('${k}')" aria-label="${l}" title="${l}"><span>${I[ic]}</span><small>${l}</small></button>`;
  const yv=ui.view==='food'||ui.view==='mealplan';
  return `<nav class="tabs${dkOnly?' dkonly':''}">${b('home','pulse','Bugün',ui.view==='home'||ui.view==='cycle')}${b('programs','dumb','Antrenman',['programs','homewk','academy','exd'].includes(ui.view)||(ui.view==='tool'&&ui.tFrom==='programs'))}${b(ui.yLast||'food','fork','Yemek',yv||(ui.view==='tool'&&ui.tFrom!=='programs'))}<button class="nv-pr ${ui.view==='friends'?'on':''}" onclick="A.go('friends')" aria-label="Profil" title="Profil"><span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></span><small>Profil</small></button><i class="dksp dko"></i><button class="dko ${ui.view==='settings'?'on':''}" onclick="A.go('settings')"><span>${I.gear}</span><small>Ayarlar</small></button></nav>${dkOnly?'':`<button class="navcam" onclick="A.cam()" aria-label="Fotoğraf paylaş"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.6"/></svg></button>`}`;
}
function ySeg(){const v=ui.view;return `<div class="yseg"><button class="${v==='food'?'on':''}" onclick="A.go('food')">🍽️ Günlük</button><button class="${v==='mealplan'?'on':''}" onclick="A.go('mealplan')">📅 Plan</button></div>`;
}

/* ---------- özet (günlük / haftalık / aylık) ---------- */
const AYLAR=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
function periodDays(){const p=ui.stP,off=ui.stOff,t=new Date();t.setHours(12,0,0,0);
  if(p==='day'){t.setDate(t.getDate()-off);return[dkey(t)]}
  if(p==='week'){t.setDate(t.getDate()-off*7);return lastNDays(dkey(t),7).reverse()}
  const m=new Date(t.getFullYear(),t.getMonth()-off,1,12),mo=m.getMonth(),out=[];while(m.getMonth()===mo){const k=dkey(m);if(k<=dkey())out.push(k);m.setDate(m.getDate()+1)}return out}
function periodLbl(days){const p=ui.stP,f=d=>new Date(d+'T12:00');
  if(p==='day')return dayLbl(days[0]);if(p==='month'){const x=f(days[0]);return `${AYLAR[x.getMonth()]} ${x.getFullYear()}`}
  const a=f(days[0]),b=f(days[days.length-1]);return a.getMonth()===b.getMonth()?`${a.getDate()}–${b.getDate()} ${AYLAR[b.getMonth()].slice(0,3)}`:`${a.getDate()} ${AYLAR[a.getMonth()].slice(0,3)} – ${b.getDate()} ${AYLAR[b.getMonth()].slice(0,3)}`}
const avgN=a=>{const v=a.filter(x=>x!=null);return v.length?v.reduce((s2,x)=>s2+x,0)/v.length:null};
function barsSvg(vals,labels,target,colFn,unit){const W=320,H=120,n=vals.length,mx=Math.max(target||0,...vals.map(v=>v||0))*1.12||1,bw=W/n,Y=v=>H-v/mx*H;
  const step=n>14?Math.ceil(n/8):1;
  return `<svg aria-hidden="true" viewBox="0 0 ${W} ${H+16}" class="sbars">${vals.map((v,i)=>`<rect x="${i*bw+Math.max(1,bw*.18)}" y="${v?Y(v):H}" width="${bw*.64}" height="${v?H-Y(v):0}" rx="${bw*.32}" fill="${v?colFn(v):'none'}"><title>${labels[i]}: ${v?Math.round(v)+(unit||''):'—'}</title></rect>${i%step===0?`<text x="${i*bw+bw/2}" y="${H+12}" text-anchor="middle">${labels[i]}</text>`:''}`).join('')}
   ${target?`<line x1="0" x2="${W}" y1="${Y(target)}" y2="${Y(target)}" stroke="rgba(255,255,255,.55)" stroke-dasharray="4 4"/>`:''}</svg>`}
function weekDays(){const s=new Date();s.setHours(12,0,0,0);s.setDate(s.getDate()+ui.mpWeek*7);
  return Array.from({length:7},(_,i)=>{const d=new Date(s);d.setDate(s.getDate()+i);return dkey(d)})}
function planTotals(d){const m=S.mealPlan[d]||{};
  return Object.values(m).reduce((a,x)=>{const r=rec(x.rid);return r?{kcal:a.kcal+r.kcal*x.serv,p:a.p+r.p*x.serv}:a},{kcal:0,p:0})}
function dtText(d){const t=planTotals(d);return t.kcal?`${Math.round(t.kcal).toLocaleString('tr-TR')} / ${S.settings.kcal.toLocaleString('tr-TR')} kcal · Protein ${Math.round(t.p)} g`:'Henüz plan yok'}
function slotH(d,k,lab,pop){const x=(S.mealPlan[d]||{})[k],r=x&&rec(x.rid);
  return `<button class="slot ${r?'f':''} ${pop?'pop':''}" id="sl-${d}-${k}" onclick="A.slot('${d}','${k}')">
   <div class="pl">${r?`<div class="plate" style="background:${r.col}">${r.e}</div>`:'+'}</div>
   <div class="sl">${lab}${x&&x.eaten?' <span class="ok">✓</span>':''}${x&&x.serv!==1?' · ×'+fmt(x.serv):''}</div>
   <div class="nm ${r?'':'e'}">${r?esc(r.n):'Tarif ekle'}</div></button>`}
function dayCard(d){const dd=new Date(d+'T12:00'),open=!ui.mpClosed[d];
  return `<div class="dayc" id="day-${d}"><div class="dh"><div>
    <span class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.06em">${dd.toLocaleDateString(LOC(),{weekday:'short'})}</span> <b>${z(dd.getDate())}</b>${d===dkey()?'<span class="tday">BUGÜN</span>':''}
    <div class="dt" id="dt-${d}">${dtText(d)}</div></div>
    <button class="back" style="transform:rotate(${open?90:-90}deg)" onclick="A.toggleDay('${d}')" aria-label="Aç/kapat">${I.back}</button></div>
    ${open?`<div class="slots">${SLOTS.map(([k,l])=>slotH(d,k,l)).join('')}</div>`:''}</div>`}
function mealplanV(){
  const days=weekDays(),td=dkey(),f=d=>new Date(d+'T12:00'),o={day:'numeric',month:'short'};
  const rng=f(days[0]).toLocaleDateString(LOC(),o)+' – '+f(days[6]).toLocaleDateString(LOC(),o);
  const dis='style="opacity:.3;pointer-events:none"';
  let si=days.indexOf(ui.mpSel&&days.includes(ui.mpSel)?ui.mpSel:(days.includes(td)?td:days[0]));si=Math.min(si,days.length-2);const show=days.slice(si,si+2);
  return `<div class="hero" style="padding-bottom:16px">
   <div class="top"><div class="brand" style="font-size:21px;letter-spacing:0">Yemek Planı</div><button class="pill" onclick="A.groc()">🛒 Alışveriş</button></div>
   ${CL.sample?`<button class="mp-btn" style="margin-top:12px;background:linear-gradient(90deg,#3fd0ff,#ff6a3d);color:#fff" onclick="A.smartSheet()">🤖 Akıllı öneri · kalan makrolarına göre</button>`:''}
   <button class="mp-btn ${ui.mpBusy?'busy':''}" style="margin-top:16px" onclick="A.planWeek()" ${ui.mpBusy?'disabled':''}>✨ ${ui.mpBusy?'Öğünlerin planlanıyor…':'Haftamı planla'}</button>
   <div class="wk"><button class="back" onclick="A.mpWeek(-1)" ${ui.mpWeek<=0?dis:''}>${I.back}</button><span>${rng}</span><button class="back" style="transform:scaleX(-1)" onclick="A.mpWeek(1)" ${ui.mpWeek>=4?dis:''}>${I.back}</button></div>
   <div class="days">${days.map(d=>{const dd=f(d);return `<button class="${d===td?'today':''} ${show.includes(d)?'sel':''} ${Object.keys(S.mealPlan[d]||{}).length?'has':''}" onclick="A.jump('${d}')"><small>${dd.toLocaleDateString(LOC(),{weekday:'short'}).slice(0,2)}</small><b>${z(dd.getDate())}</b><i></i></button>`}).join('')}</div></div>
  ${show.map(dayCard).join('')}
  <div class="pad lbl" style="text-align:center;margin:-2px 0 4px">Diğer günler için yukarıdaki takvimden bir güne dokun.</div>
  <div class="pad grid2" style="margin-top:14px"><button class="btn ghost" onclick="A.guide()">📘 Rehber</button><button class="btn ghost" onclick="A.builder()">＋ Tarif ekle</button></div>
  <div class="pad lbl" style="text-align:center;line-height:1.5;margin:14px 0">"Haftamı planla" geçen haftana bakar: yediğin tarifleri tekrar ekler, yemediklerini çıkarır, kalori ve protein ortalamana ve kilo trendine göre planı ayarlar. Besin değerleri yaklaşıktır.</div>`;
}
function weekInsights(){
  const past=lastNDays(dkey(),8).slice(1).reverse(),liked={},skipped={},notes=[];let planned=0,eaten=0;
  past.forEach(d=>Object.values(S.mealPlan[d]||{}).forEach(x=>{planned++;if(x.eaten){eaten++;liked[x.rid]=(liked[x.rid]||0)+1}else skipped[x.rid]=(skipped[x.rid]||0)+1}));
  const logged=past.filter(d=>dayMeals(d).length);
  const avgK=logged.length?Math.round(logged.reduce((a,d)=>a+dayTotals(d).kcal,0)/logged.length):null,avgP=logged.length?Math.round(logged.reduce((a,d)=>a+dayTotals(d).p,0)/logged.length):null;
  const bw=S.body.filter(b=>b.weight!=null),age=x=>(Date.now()-new Date(x.date+'T12:00').getTime())/864e5,av=a=>a.reduce((s2,x)=>s2+x.weight,0)/a.length;
  const w1=bw.filter(x=>age(x)<7),w0=bw.filter(x=>age(x)>=7&&age(x)<14),dW=w1.length&&w0.length?av(w1)-av(w0):null;
  const pr=S.profile,g=pr.applied?pr.goal:'maintain',tk=rateKg(pr),st=S.settings;let adj=0,pw=0.6;
  const sg=v=>(v>0?'+':'')+fmt(Math.round(v*10)/10);
  if(dW!=null){
    if(g==='cut'&&dW>-tk*0.5){adj=-120;notes.push(`Kilon geçen hafta ${sg(dW)} kg değişti (hedef −${fmt(Math.round(tk*10)/10)} kg). Bu haftanın planını günlük <b>~120 kcal daha düşük</b> kurdum.`)}
    else if(g==='cut'&&dW<-tk*1.6){adj=120;notes.push(`Kilon hedeften hızlı düştü (${sg(dW)} kg). Kas kaybını azaltmak için planı <b>~120 kcal yüksek</b> kurdum.`)}
    else if(g==='bulk'&&dW<tk*0.5){adj=150;notes.push(`Kilon geçen hafta ${sg(dW)} kg değişti, bulk hedefinin altında. Planı <b>~150 kcal yüksek</b> kurdum.`)}
    else if(g==='bulk'&&dW>tk*1.8){adj=-120;notes.push(`Kilon hedeften hızlı arttı (${sg(dW)} kg). Fazla yağlanmamak için planı <b>~120 kcal düşük</b> kurdum.`)}
    else notes.push(`Kilo değişimin (${sg(dW)} kg/hafta) hedefinle uyumlu, kaloriyi aynı tuttum.`)}
  if(avgK!=null)notes.push(`Geçen hafta kayıtlı ${logged.length} günde ortalama <b>${avgK} kcal</b> ve <b>${avgP} g protein</b> aldın (hedef ${st.kcal} kcal, ${st.protein} g).`);
  if(avgP!=null&&avgP<st.protein*0.9){pw=1.3;notes.push('Protein hedefin altında kaldı: bu hafta protein oranı yüksek tarifleri öne aldım.')}
  const lk=Object.entries(liked).sort((a,b)=>b[1]-a[1]).map(([id])=>rec(id)).filter(Boolean).slice(0,3);
  if(lk.length)notes.push(`Yediğin tarifleri tekrar ekledim: ${lk.map(r=>esc(r.n)).join(', ')}.`);
  const sk=Object.keys(skipped).filter(id=>!liked[id]);if(sk.length)notes.push(`Planlanıp yenmeyen ${sk.length} tarifin önceliğini düşürdüm.`);
  if(!planned&&avgK==null&&dW==null)notes.push('Geçen haftadan henüz veri yok: hedefine ve rehber tariflerine göre planladım. Yediklerini "Yedim" ile işaretleyip kilonu girdikçe plan sana göre şekillenecek.');
  return{adj,pw,liked,skipped,notes}}
function pickRecipe(slot,share,used,avoid,ctx){ctx=ctx||{adj:0,pw:0.6,liked:{},skipped:{}};
  const tgt=(S.settings.kcal+ctx.adj)*share;let best=null;
  const g=S.profile.applied?S.profile.goal:'maintain';
  ALL().filter(r=>r.slot===slot&&phaseOk(r)).forEach(r=>[0.75,1,1.25,1.5].forEach(sv=>{
    if(slot==='s'&&sv<1)return;if(r.phase&&sv!==1&&sv!==1.25)return;
    let sc=Math.abs(r.kcal*sv-tgt)/tgt-(r.p*4/r.kcal)*ctx.pw+(used[r.id]||0)*0.35+(avoid.includes(r.id)?0.8:0)+Math.random()*0.3-(r.phase&&r.phase===g?0.25:0)
      -(ctx.liked[r.id]?0.35:0)+(ctx.skipped[r.id]&&!ctx.liked[r.id]?0.6:0);
    if(!best||sc<best.sc)best={sc,rid:r.id,serv:sv}}));
  used[best.rid]=(used[best.rid]||0)+1;return{rid:best.rid,serv:best.serv};
}
function runPlanner(mode){
  const days=weekDays().filter(d=>d>=dkey()),used={},q=[],ctx=weekInsights();
  days.forEach(d=>Object.values(S.mealPlan[d]||{}).forEach(x=>{if(mode==='empty')used[x.rid]=(used[x.rid]||0)+1}));
  let prev=[];
  days.forEach(d=>{const cur=mode==='all'?{}:{...(S.mealPlan[d]||{})},today=[];
    SLOTS.forEach(([k,,sh])=>{if(cur[k]&&!cur[k].eaten){today.push(cur[k].rid);return}if(cur[k])return;
      const a=pickRecipe(k,sh,used,prev,ctx);today.push(a.rid);q.push([d,k,a])});
    if(mode==='all')S.mealPlan[d]=Object.fromEntries(Object.entries(S.mealPlan[d]||{}).filter(([,x])=>x.eaten));
    prev=today});
  if(!q.length){toast('Bu hafta zaten dolu');return}
  ui.mpBusy=true;ui.mpClosed={};render(true);
  q.forEach(([d,k,a],i)=>setTimeout(()=>{
    (S.mealPlan[d]=S.mealPlan[d]||{})[k]=a;
    const el=document.getElementById(`sl-${d}-${k}`);
    if(el){const lab=SLOTS.find(s2=>s2[0]===k)[1];el.outerHTML=slotH(d,k,lab,true)}
    const dt=document.getElementById('dt-'+d);if(dt)dt.textContent=dtText(d);
    if(i===q.length-1){ui.mpBusy=false;save();setTimeout(()=>{if(ui.view==='mealplan')render(true);
      const avg=Math.round(days.reduce((a2,dd)=>a2+planTotals(dd).kcal,0)/days.length);
      sheet(`<h3>✨ Haftan planlandı</h3><div class="sugg" style="margin:0 0 12px">${days.length} gün · günlük ortalama <b>${avg} kcal</b> (hedef ${S.settings.kcal}${ctx.adj?`, bu hafta ${ctx.adj>0?'+':''}${ctx.adj}`:''})</div>
       <div class="gcat" style="margin-top:0">Geçen haftana göre</div><ul class="rl">${ctx.notes.map(x=>`<li>${x}</li>`).join('')}</ul>
       <button class="btn" style="margin-top:12px" onclick="A.close()">Tamam</button>`)},500)}
  },350+i*90));
}
const nsCol=v=>v>=80?'#34d399':v>=60?'#ffd23f':'#ff7a59';
function nutriScore(r,sv=1){const h=nutriBars(r,sv);const m=h.match(/nbx-s"[^>]*>(\d+)</);return m?+m[1]:0}
function nutriBars(r,sv=1){const lines=(r.full?r.full.map(l=>[l[0],l[1]/(r.serv||1),l[2],l[3]]):r.ing||[]),db=ING();let g=0,veg=0;
  lines.forEach(l=>{const m=lineMac(l);if(!m)return;g+=m.g;if((db[l[0]]||{}).cat==='Sebze & Meyve')veg+=m.g});
  const k=r.kcal||1,P=r.p*4/k,C=r.c*4/k,F=r.f*9/k,cl=v=>Math.max(0,Math.min(100,Math.round(v)));
  const pro=cl(P/.3*100),bal=cl(100-(Math.abs(P-.3)+Math.abs(C-.4)+Math.abs(F-.3))*110),vg=g?cl(veg/g/.35*100):null,per=(S.settings.kcal||2200)/4,fit=cl(100-Math.abs(r.kcal*sv-per)/per*100);
  const bars=[[TT('Protein yoğunluğu','Protein density'),pro],[TT('Makro dengesi','Macro balance'),bal],...(vg!=null?[[TT('Sebze & meyve','Veg & fruit'),vg]]:[]),[TT('Öğün hedefine uyum','Fits your meal target'),fit]];
  const sc=Math.round(bars.reduce((a,b)=>a+b[1],0)/bars.length),lab=sc>=80?TT('Mükemmel denge','Excellent balance'):sc>=60?TT('İyi denge','Good balance'):TT('Geliştirilebilir','Could be better');
  return `<div class="nbx"><div class="nbx-h"><span class="nbx-s" style="${sc<60?'background:rgba(255,122,89,.15);color:#ff7a59':sc<80?'background:rgba(255,210,63,.15);color:#ffd23f':''}">${sc}</span><div><b>${lab}</b><small>${TT('Makro oranları ve malzemelerden hesaplanır.','Calculated from macros and ingredients.')}</small></div></div>
   ${bars.map(([l,v])=>`<div class="nbr"><div class="row between"><span>${l}</span><b>${v}</b></div><i><em style="width:${v}%;background:${v>=70?'#34d399':v>=45?'#ffd23f':'#ff7a59'}"></em></i></div>`).join('')}</div>`}
function recipeSheet(d,k){
  const x=S.mealPlan[d][k],r=rec(x.rid),sv=x.serv;
  const q=(n,u)=>{let v=n*sv;v=(u==='g'||u==='ml')&&v>=20?Math.round(v/5)*5:Math.round(v*4)/4;return fmt(v)+' '+u};
  sheet(`<div class="plate lg" style="background:${r.col}">${r.e}</div>
   <h3 style="text-align:center;margin-bottom:4px">${esc(r.n)}</h3>
   <div class="lbl" style="text-align:center;margin-bottom:12px">${SLOTS.find(s=>s[0]===k)[1]}${r.min?' · ⏱ '+r.min+' dk':''}${r.custom?' · <span class="tag">Benim tarifim</span>':''}${r.phase?` · <span class="tag ph-${r.phase}">${PHASE_LBL[r.phase]} rehberi</span>`:''}</div>
   <div class="stepper"><button onclick="A.serv('${d}','${k}',-0.25)">−</button><b>${fmt(sv)} porsiyon</b><button onclick="A.serv('${d}','${k}',0.25)">+</button></div>
   <div class="macro4"><div><b>${Math.round(r.kcal*sv)}</b><span class="lbl">kcal</span></div><div><b>${Math.round(r.p*sv)}g</b><span class="lbl">protein</span></div><div><b>${Math.round(r.c*sv)}g</b><span class="lbl">karb.</span></div><div><b>${Math.round(r.f*sv)}g</b><span class="lbl">yağ</span></div></div>${nutriBars(r,sv)}
   <b>Malzemeler</b>${(r.full?r.full.map(l=>[l[0],l[1]/(r.serv||1),l[2],l[3]]):r.ing).map(([n,a,u,st])=>{const d=ING()[n],c=stOf(d,st);return `<div class="ing"><span>${esc(n)}${c&&c.y!==1?` <span class="lbl">(${c.n.toLocaleLowerCase('tr-TR')})</span>`:''}</span><span class="muted">${q(a,u)}</span></div>`}).join('')}
   <p class="lbl" style="line-height:1.5;margin:12px 0 16px">${esc(r.how)}</p>
   ${x.eaten?'<div class="tag" style="display:block;text-align:center;padding:10px;margin-bottom:10px">✓ Günlüğe eklendi</div>':`<button class="btn" style="margin-bottom:10px" onclick="A.ate('${d}','${k}')">✓ Yedim, günlüğe ekle</button>`}
   <div class="grid2"><button class="btn ghost" onclick="A.pickSheet('${d}','${k}')">Değiştir</button><button class="btn ghost" onclick="A.unslot('${d}','${k}')">Kaldır</button></div>
   <button class="link" style="color:var(--a3)" onclick="A.builder('${r.id}','${d}','${k}')">✏️ ${r.custom?'Tarifi düzenle':'Kopyala ve kendine göre düzenle'}</button>`);
}
function gauge(v){const r=86,C=2*Math.PI*r,L=C*0.75,pc=v==null?0:v/100;
  return `<svg aria-hidden="true" viewBox="0 0 200 200" class="gauge"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#ffb547"/><stop offset=".55" stop-color="#ff4a36"/><stop offset="1" stop-color="#ff2d55"/></linearGradient></defs>
   <circle cx="100" cy="100" r="${r}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${L} ${C}" transform="rotate(135 100 100)"/>
   ${v==null?'':`<circle cx="100" cy="100" r="${r}" fill="none" stroke="url(#gg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${L*pc} ${C}" transform="rotate(135 100 100)"/>`}</svg>`}
const SUBS=[['rec','Toparlanma','#3ee6a0'],['sleep','Uyku','#a98bff'],['load','Yük','#ffb547'],['activity','Aktivite','#3fd0ff'],['rhythm','Ritim','#ff7aa8']];
function stateTxt(sc){const x=sc.x,b=baseline('hrv',sc.d),parts=[];
  if(x.hrv!=null&&b){const p=Math.round((x.hrv/b.m-1)*100);parts.push(`HRV normalinin <b>%${Math.abs(p)} ${p>=0?'üstünde':'altında'}</b>`)}
  if(x.sleep&&x.sleep.min)parts.push(`<b>${fmtMin(x.sleep.min)}</b> uyudun`);
  const lab=sc.tot>=80?'Vücudun <span style="color:#3ee6a0">hazır</span>.':sc.tot>=60?'Vücudun <span style="color:#3fd0ff">dengeli</span>.':'Vücudun <span style="color:#ffb547">toparlanmaya</span> ihtiyaç duyuyor.';
  const tip=sc.tot>=80?'Ağır bir antrenman için iyi gün.':sc.tot>=60?'Planladığın antrenmanı normal yoğunlukta yapabilirsin.':'Bugün hafif çalış ya da aktif dinlenme yap.';
  return `${lab} ${parts.join(', ')}${parts.length?'.':''} ${tip}`}
/* Editoryal kartlar: hareket, vücut, uyku */
const edHd=(l,r)=>`<div class="ed-hd"><span>${l}</span><span>${r||''}</span></div>`;
const edBar=(l,v,g,txt,on)=>{const f=Math.min(1,(v||0)/(g||1));return `<div class="fz-b"><div class="fz-bt"><span>${l}</span><b>${txt}</b></div><div class="fz-tr"><i class="${on?'on':''}" style="width:${(f*100).toFixed(1)}%"></i></div></div>`};
function edMove(d,x){const st=x.steps||0,act=x.azm!=null?x.azm:(x.active||0),kc=x.kcalAct||0,dist=x.dist,L=n=>(n||0).toLocaleString(LOC());
  return `<div class="card ed">${edHd(TT('hareket','movement')+' · '+new Date(d+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'}),TT('hedef','goal')+' 8.000 '+TT('adım','steps'))}
   <div class="fz-top"><div class="fz-n sm">${L(st)}</div><div class="fz-u"><b>${TT('adım','steps')}</b><span>${dist?fmt(dist)+' km':TT('bugün','today')}</span><em>%${Math.round(Math.min(1,st/8000)*100)}</em></div></div>
   ${edBar(TT('Adım','Steps'),st,8000,`${L(st)} / 8.000`,1)}${edBar(TT('Aktif dakika','Active minutes'),act,30,`${act} / 30 dk`)}${edBar(TT('Aktif kalori','Active calories'),kc,500,`${L(Math.round(kc))} kcal`)}</div>`}
function edBody(d,x){const R=[['hrv',TT('HRV','HRV'),'ms'],['rhr',TT('Dinlenik nabız','Resting HR'),'bpm'],['spo2',TT('Kan oksijeni','Blood oxygen'),'%'],['resp',TT('Solunum','Respiration'),'/dk']].filter(r=>x[r[0]]!=null);
  if(!R.length)return '';let warn=0;
  const rows=R.map(([k,l,u])=>{const v=x[k],b=baseline(k,d),f=t=>k==='resp'?fmt(Math.round(t*10)/10):Math.round(t);if(!b)return `<div class="ed-m"><div class="ed-mt"><span>${l}</span><b>${f(v)} ${u}</b></div></div>`;
    const lo=b.m-b.sd,hi=b.m+b.sd,mn=b.m-3*b.sd,mx=b.m+3*b.sd,P=t=>Math.max(2,Math.min(98,(t-mn)/(mx-mn)*100)),out=v<lo||v>hi;if(out)warn++;
    return `<div class="ed-m"><div class="ed-mt"><span>${l}</span><b>${f(v)} ${u}${out?` <em>${v<lo?TT('düşük','low'):TT('yüksek','high')}</em>`:''}</b></div><div class="ed-rg"><i class="band" style="left:${P(lo)}%;width:${P(hi)-P(lo)}%"></i><i class="dot${out?' out':''}" style="left:${P(v)}%"></i></div></div>`}).join('');
  return `<div class="card ed">${edHd(TT('vücut · gece ölçümleri','body · overnight'),warn?`${warn} ${TT('dikkat','to watch')}`:TT('30 gün normali','30-day normal'))}${rows}<div class="ed-ft">${TT('Bant: senin normal aralığın. Tıbbi teşhis değildir.','Band: your normal range. Not a diagnosis.')}</div></div>`}
function edSleep(d,x){const s2=x.sleep||{};if(!s2.min)return '';const dt=sleepDebt(d),h=Math.floor(s2.min/60),m=s2.min%60;
  return `<div class="card ed" id="c-sleep">${edHd(TT('uyku','sleep')+(s2.bed?' · '+s2.bed+' → '+s2.wake:''),TT('ihtiyaç','need')+' 8 sa')}
   <div class="fz-top"><div class="fz-n sm">${h}:${z(m)}</div><div class="fz-u"><b>${TT('saat','hours')}</b><span>${TT('dün gece','last night')}</span>${s2.eff?`<em>%${s2.eff} ${TT('verim','efficiency')}</em>`:''}</div></div>
   ${s2.deep?`<div class="ed-stg"><i style="flex:${s2.deep}" class="d"></i><i style="flex:${s2.rem}" class="r"></i><i style="flex:${s2.light}" class="l"></i><i style="flex:${s2.awake||0}" class="w"></i></div>
   <div class="ed-rows"><div><span>${TT('Derin','Deep')}</span><b>${fmtMin(s2.deep)}</b></div><div><span>REM</span><b>${fmtMin(s2.rem)}</b></div><div><span>${TT('Hafif','Light')}</span><b>${fmtMin(s2.light)}</b></div><div><span>${TT('Uyanık','Awake')}</span><b>${s2.awake||0} dk</b></div><div><span>${TT('7 günlük borç','7-day debt')}</span><b${dt>120?' class="wr"':''}>${fmtMin(dt)}</b></div></div>`:''}
   <div class="ed-hd" style="margin-top:14px"><span>${TT('son 14 gece','last 14 nights')}</span><span>— 8 sa</span></div>${sleepBars(d)}</div>`}
function vitalRow(k,lab,unit,ic,x,d){const v=x[k],b=baseline(k,d);if(v==null)return '';
  const lo=b?b.m-b.sd:null,hi=b?b.m+b.sd:null,mn=b?b.m-3*b.sd:v-1,mx=b?b.m+3*b.sd:v+1,P=t=>Math.max(0,Math.min(100,(t-mn)/(mx-mn)*100));
  const st=!b?'<span class="muted">Normal aralık için 5+ gün veri gerekli</span>':v<lo?'<span class="warn">Normalin altında</span>':v>hi?'<span class="warn">Normalin üstünde</span>':'<span class="ok">Normal aralıkta</span>';
  const f=t=>k==='resp'?fmt(Math.round(t*10)/10):Math.round(t);
  return `<div class="vit"><div class="row between"><div class="row" style="gap:10px"><span class="vic">${ic}</span><div><b>${lab}</b><div class="lbl">${b?`Normalin ${f(lo)}–${f(hi)} ${unit}`:''}</div></div></div>
    <div style="text-align:right"><b style="font-size:20px">${f(v)}</b> <span class="lbl">${unit}</span><div class="lbl" style="font-size:11px">${st}</div></div></div>
    ${b?`<div class="vbar"><i style="left:${P(lo)}%;width:${P(hi)-P(lo)}%"></i><span style="left:${P(v)}%"></span></div>`:''}</div>`}
function sleepBars(d){const H=HD(),days=lastNDays(d,14).reverse(),mx=600,W=320,Hh=96,bw=W/14;
  return `<svg aria-hidden="true" viewBox="0 0 ${W} ${Hh+16}" class="sbars">${days.map((k,i)=>{const m=((H[k]||{}).sleep||{}).min;const h=m?Math.min(Hh,m/mx*Hh):0;
    return `<rect x="${i*bw+3}" y="${Hh-h}" width="${bw-6}" height="${h}" rx="${(bw-6)/2}" fill="${m&&m>=NEED?'#9b7bff':'rgba(155,123,255,.45)'}"/><text x="${i*bw+bw/2}" y="${Hh+12}" text-anchor="middle">${'PSÇPCCP'[new Date(k+'T12:00').getDay()]}</text>`}).join('')}
    <line x1="0" x2="${W}" y1="${Hh-NEED/mx*Hh}" y2="${Hh-NEED/mx*Hh}" stroke="rgba(255,255,255,.5)" stroke-dasharray="4 4"/></svg>`}
function spark(d,key){const H=HD(),days=lastNDays(d,30).reverse(),vals=days.map(k=>(H[k]||{})[key]).filter(v=>v!=null);if(vals.length<3)return '';
  const b=baseline(key,d),mn=Math.min(...vals,b?b.m-b.sd:Infinity)-2,mx=Math.max(...vals,b?b.m+b.sd:-Infinity)+2,W=320,Hh=70,X=i=>i/(vals.length-1)*W,Y=v=>Hh-(v-mn)/(mx-mn)*Hh,sc=/hr/i.test(key)?SCC.hr:SCC.step;
  return `<svg aria-hidden="true" viewBox="0 0 ${W} ${Hh}" class="spark">${b?`<rect x="0" width="${W}" y="${Y(b.m+b.sd)}" height="${Y(b.m-b.sd)-Y(b.m+b.sd)}" fill="${sc}" fill-opacity=".1"/>`:''}
   <polyline fill="none" stroke="${sc}" stroke-width="2.2" stroke-linejoin="round" points="${vals.map((v,i)=>X(i)+','+Y(v)).join(' ')}"/><circle cx="${X(vals.length-1)}" cy="${Y(vals[vals.length-1])}" r="4" fill="#fff"/></svg>`}
function rings(x){const R3=[[x.steps,8000,SCC.step,'Hareket',v=>`${(v||0).toLocaleString('tr-TR')} / 8.000 adım`],[x.active,30,SCC.kcal,'Aktif',v=>`${v||0} / 30 dk`],[(x.sleep||{}).min,NEED,SCC.sleep,'Uyku',v=>`${fmtMin(v)} / 8s`]];
  return `<div class="row" style="gap:16px"><svg aria-hidden="true" viewBox="0 0 120 120" width="112" height="112">${R3.map(([v,g,c],i)=>{const r=52-i*14,C=2*Math.PI*r,p=Math.min(1,(v||0)/g);
    return `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${c}" stroke-opacity=".18" stroke-width="10"/><circle cx="60" cy="60" r="${r}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C*p} ${C}" transform="rotate(-90 60 60)"/>`}).join('')}</svg>
    <div style="flex:1">${R3.map(([v,g,c,l,f])=>`<div style="margin:6px 0"><div class="lbl" style="color:${c};letter-spacing:.08em;text-transform:uppercase;font-size:10px">● ${l}</div><b style="font-size:14px">${f(v)}</b></div>`).join('')}</div></div>`}
function hrChart(a){const W=320,Hh=110,v=a.map((x,i)=>[i,x]).filter(p=>p[1]!=null);if(v.length<4)return '';
  const mx=Math.max(...v.map(p=>p[1]))+8,mn=Math.min(...v.map(p=>p[1]))-6,X=i=>i/95*W,Y=b=>Hh-(b-mn)/(mx-mn)*Hh,pts=v.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' '),l=v[v.length-1];
  return `<svg aria-hidden="true" viewBox="0 -6 ${W} ${Hh+26}" class="hrc"><defs><linearGradient id="hrg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SCC.hr}" stop-opacity=".35"/><stop offset="1" stop-color="${SCC.hr}" stop-opacity="0"/></linearGradient>
    <filter id="hgl" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
   <polygon fill="url(#hrg)" points="${X(v[0][0])},${Hh} ${pts} ${X(l[0])},${Hh}"/>
   <polyline fill="none" stroke="${SCC.hr}" stroke-width="2" stroke-linejoin="round" filter="url(#hgl)" points="${pts}"/>
   ${l[0]<95?`<line x1="${X(l[0])}" x2="${W}" y1="${Y(l[1])}" y2="${Y(l[1])}" stroke="rgba(255,255,255,.35)" stroke-dasharray="2 4"/>`:''}
   <circle class="hrdot" cx="${X(l[0])}" cy="${Y(l[1])}" r="9" fill="#ff3b30" opacity=".35"/><circle cx="${X(l[0])}" cy="${Y(l[1])}" r="4.5" fill="#fff" stroke="#ff3b30" stroke-width="2"/>
   ${['00:00','06:00','12:00','18:00'].map((t,i)=>`<text x="${i*W/4+2}" y="${Hh+18}">${t}</text>`).join('')}</svg>`}
function heartCard(sc,hv=()=>true){const x=sc.x,H=HD(),y=H[lastNDays(sc.d,2)[1]]||{};let a=x.hr15||[],hrDay=sc.d;
  if(a.filter(v=>v!=null).length<8&&(y.hr15||[]).filter(v=>v!=null).length>=8){a=y.hr15;hrDay=lastNDays(sc.d,2)[1]}
  const li=a.map((v,i)=>[i,v]).filter(p=>p[1]!=null).pop(),t=li?`${z(Math.floor(li[0]/4))}:${z(li[0]%4*15)}`:null;
  const ar=(cur,prev,goodUp)=>cur==null||prev==null||cur===prev?'':`<span style="color:${(cur>prev)===goodUp?'#3ee6a0':'#ff8a7a'}">${cur>prev?'↑':'↓'}${Math.abs(cur-prev)}</span>`;
  const today=sc.d===dkey(),intake=Math.round(dayTotals(sc.d).kcal),burnt=x.kcalOut!=null?Math.round(today?x.kcalOut*Math.min(1,(new Date().getHours()*60+new Date().getMinutes())/1440)+0:x.kcalOut):null;
  return `${burnt!=null&&hv('kcal')?`<div class="card"><div class="row between"><div><div class="kpi">${Math.abs(burnt-intake).toLocaleString('tr-TR')}<small>KCAL</small></div><div class="lbl">${burnt>=intake?'Kalori açığı':'Kalori fazlası'}</div></div><button class="pill" onclick="A.go('food')">Beslenme ›</button></div>
    <div class="grid2" style="margin-top:12px"><div class="ktile"><span>🔥</span><div><b>${burnt.toLocaleString('tr-TR')}</b><small>kcal yakılan</small></div></div><div class="ktile"><span>🍴</span><div><b>${intake.toLocaleString('tr-TR')}</b><small>kcal alınan</small></div></div></div></div>`:''}
  ${li&&hv('heart')?`<div class="card heart"><div class="row between"><span class="hlab"><i class="hbeat">♥</i> KALP</span><span class="lbl">${hrDay===dkey()?'Bugün':hrDay===lastNDays(dkey(),2)[1]?'Dün':new Date(hrDay+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</span></div>
    <div class="row between" style="align-items:flex-end;margin-top:6px"><div><span class="bpm">${li[1]}</span><small class="bpmu">BPM</small>
      <div class="lbl" style="margin-top:2px">${S.healthDemo?'Örnek veri · Fitbit Air':'Fitbit Air'} · ${t}</div></div>
     <div class="hside">${x.hrv!=null?`<div><span>HRV</span> <b>${x.hrv}</b> ms ${ar(x.hrv,y.hrv,true)}</div>`:''}${x.rhr!=null?`<div><span>DİNLENİK</span> <b>${x.rhr}</b> bpm ${ar(x.rhr,y.rhr,false)}</div>`:''}</div></div>
    ${hrChart(a)}</div>`:''}`}
/* Yük (0–21): nabız rezervine dayalı kardiyovasküler yük (Banister TRIMP, WHOOP benzeri logaritmik ölçek) + kuvvet setleri */
function strainParts(d){const x=HD()[d]||{},sets=trainedOn(d).reduce((a,s2)=>a+s2.sets.length,0),act=x.active||0,cl=cDay(d);
  const rh=x.rhr||rhrNow(d),mx=hrMax(),f=S.profile.sex==='f'?[.86,1.67]:[.64,1.92];
  let hr=0,zmin=0,src=0;const tr=(v,m)=>{const r=Math.min(1,(v-rh)/(mx-rh));if(r<.3)return;zmin+=m;hr+=m*r*f[0]*Math.exp(f[1]*r)};
  if(x.hr1&&x.hr1.some(v=>v!=null)){src=1;x.hr1.forEach(v=>{if(v!=null)tr(v,1)})}else if(x.hr15&&x.hr15.some(v=>v!=null)){src=15;x.hr15.forEach(v=>{if(v!=null)tr(v,15)})}
  if(!sets&&!act&&!cl&&!hr&&x.steps==null&&!src)return null;
  const setL=sets*1.2,cardioL=src?0:cl,mv=(x.steps||0)/300+act*.6,moveL=src?Math.max(0,mv-hr):mv;
  const raw=hr+setL+cardioL+moveL,tot=Math.round(21*(1-Math.exp(-raw/100))*10)/10;
  return{tot,hr:Math.round(hr),setL:Math.round(setL),cardioL:Math.round(cardioL),moveL:Math.round(moveL),sets,act,zmin,src,cl}}
function strainOf(d){const p=strainParts(d);return p?p.tot:null}
function stressOf(d){const x=HD()[d]||{},a=(x.hr15||[]).map((v,i)=>[i,v]).filter(p=>p[1]!=null);if(a.length<4||x.rhr==null)return null;
  const l=a.slice(-4),avg=l.reduce((s2,p)=>s2+p[1],0)/4,b=baseline('hrv',d);
  let v=Math.max(0,(avg-x.rhr)/x.rhr*4)+(b&&x.hrv!=null?Math.max(0,(b.m-x.hrv)/b.sd*0.4):0);v=Math.min(3,Math.round(v*10)/10);const li=l[3][0];
  return{v,lab:v<1?'DÜŞÜK':v<2?'ORTA':'YÜKSEK',col:v<1?'#6fa8ff':v<2?'#ffd23f':'#ff6b5e',t:`${z(Math.floor(li/4))}:${z(li%4*15)}`}}
function vitalsInRange(d){const x=HD()[d]||{};let n=0,t=0;['hrv','rhr','spo2','resp'].forEach(k=>{const b=baseline(k,d);if(x[k]==null||!b)return;t++;if(x[k]>=b.m-b.sd&&x[k]<=b.m+b.sd)n++});return t?{n,t}:null}
function streak(){const has=d=>dayMeals(d).length||S.drinks.some(x=>x.date===d)||trainedOn(d).length||S.body.some(b=>b.date===d)||Object.keys(S.suppLog[d]||{}).length;
  let c=0,x=new Date();if(!has(dkey(x)))x.setDate(x.getDate()-1);while(has(dkey(x))&&c<999){c++;x.setDate(x.getDate()-1)}return c}
const recCol=v=>v==null?'#555':v>=67?'#3ee6a0':v>=34?'#ffd23f':'#ff3b30';
function ring3(v,max,col,label,unit,onclick){const r=46,C=2*Math.PI*r,p=v==null?0:Math.min(1,v/max);
  return `<button class="r3" onclick="${onclick}"><div class="r3w"><svg aria-hidden="true" viewBox="0 0 110 110"><circle cx="55" cy="55" r="${r}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="9"/>${v==null?'':`<circle cx="55" cy="55" r="${r}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C*p} ${C}" transform="rotate(-90 55 55)"/>`}</svg>
   <div class="r3v"><b>${v==null?'—':String(v).replace('.',',')}</b>${v!=null&&unit?`<small>${unit}</small>`:''}</div></div><span>${label} ›</span></button>`}
const dayLbl=d=>d===dkey()?'BUGÜN':d===lastNDays(dkey(),2)[1]?'DÜN':new Date(d+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short',weekday:'short'}).toLocaleUpperCase('tr-TR');
function tAgo(t){const d=new Date(t),s=(Date.now()-d)/1000;if(s<60)return 'az önce';if(s<3600)return Math.floor(s/60)+' dk önce';
  return (dkey(d)===dkey()?'bugün ':d.toLocaleDateString(LOC(),{day:'numeric',month:'short'})+' ')+z(d.getHours())+':'+z(d.getMinutes())}
function backupNag(){if(window.HM_DEMO)return '';if(!CL.ready||CL.status==='synced'||CL.status==='loading')return '';
  if(!S.sessions.length&&!S.meals.length)return '';const lb=S.lastBackup?new Date(S.lastBackup).getTime():0;if(Date.now()-lb<7*864e5)return '';
  return `<button class="bnag" onclick="A.syncInfo()">📱 <span><b>Verilerin sadece bu cihazda</b><small>${lb?'Son yedek '+Math.floor((Date.now()-lb)/864e5)+' gün önce':'Henüz yedek almadın'} · dokun, yedeğini indir</small></span>›</button>`}
const FSEC=[['photo','📸','Fotoğrafla yemek ekle'],['cook','🍳','Akıllı öğün / ne pişirsem'],['water','💧','Su & içecekler'],['bal','⚖️','Kalori dengesi']];
const PSEC=[['acad','📚','Egzersiz Akademisi kartı'],['vol','📊','Antrenman hacmi (radar)'],['body','🧍','Çalışan bölgeler (vücut haritası)'],['rec','💪','Kas toparlanması'],['gen','🏠','Evde antrenman oluşturucu'],['cardio','🏃','Kardiyo yükü'],['hist','🕘','Son antrenmanlar']];
const HSEC=[['fore','◎','Hazırlık skoru (enerji eğrisi)'],['hwid','♥','Kalp, adım, uyku, yük kutuları'],['kcal','🔥','Kalori dengesi'],['wtr','⚖','Kilo trendi'],['rings','⭕','Hareket'],['sleep','🌙','Uyku'],['vit','💚','Gece ölçümleri (HRV, nabız)'],['wks','📊','Haftalık özet'],['fat','⚡','Yorgunluk uyarısı'],['sleepperf','😴','Uyku ↔ performans'],['cycle','🌸','Döngü takibi',1]];
const HDEF=HSEC.map(x=>x[0]);
function actCard(d){const days=lastNDays(d,7),A2=(S.cardio||[]).filter(c=>days.includes(c.date)&&(/^gh-/.test(String(c.id))||c.src==='gh')).sort((a,b)=>(b.date+(b.time||'')).localeCompare(a.date+(a.time||'')));
  const tot=A2.reduce((a,c)=>a+(+c.min||0),0),ty=t=>CTYPES.find(x=>x[0]===t)||CTYPES[CTYPES.length-1],dl=k=>k===d?TT('Bugün','Today'):k===lastNDays(d,2)[1]?TT('Dün','Yesterday'):new Date(k+'T12:00').toLocaleDateString(LOC(),{weekday:'short',day:'numeric'});
  return `<div class="card act"><div class="row between"><div><div class="lbl" style="margin:0">${TT('AKTİVİTELER','ACTIVITIES')}</div><small class="muted">${TT('Saatin algıladığı · son 7 gün','Detected by your watch · last 7 days')}</small></div>${tot?`<b class="act-t">${tot}<small> dk</small></b>`:''}</div>
   ${A2.length?`<div class="act-l">${A2.slice(0,6).map(c=>{const T=ty(c.type);return `<div class="act-r"><span class="act-i">${T[1]}</span><div><b>${esc(T[2])}</b><small>${dl(c.date)}${c.time?' · '+c.time:''}</small></div><div class="act-v"><b>${c.min||0}<small> dk</small></b>${c.kcal?`<small>${Math.round(c.kcal)} kcal</small>`:''}</div></div>`}).join('')}</div>`:`<p class="muted" style="margin:10px 0 0;font-size:13px">${TT('Son 7 günde saatin bir yürüyüş, koşu ya da bisiklet algılamadı.','No walks, runs or rides detected in the last 7 days.')}</p>`}</div>`}
