/* ===== Vücut tahmini (Bugün) ===== */
const MONO="ui-monospace,'SF Mono',Menlo,Consolas,monospace";
function foreModel(d,x,sc){const sl=x.sleep||{},w=sl.wake?hm(sl.wake)/60:7.5,bc=sleepCoach(),bedH=(()=>{let b=hm(bc.bed||'23:30')/60;if(b<w+8)b+=24;return b})();
  const sleepS=sc&&sc.sleep!=null?sc.sleep:null,E0=sc&&sc.rec!=null?sc.rec:sleepS!=null?sleepS:62,trained=(S.sessions||[]).some(s2=>dkey(new Date(s2.date))===d);
  const E=h=>{const a=h-w;let v=E0-2.1*Math.max(0,a-6)-9*Math.exp(-((h-14.5)**2)/(2*1.1**2))+4*Math.exp(-((h-17.2)**2)/(2*1.4**2));if(a<1.5)v-=12*(1-Math.max(0,a)/1.5);if(h>bedH-1)v-=14*(h-(bedH-1));if(trained)v-=4;return Math.max(3,Math.min(100,v))};
  return{E,E0,w,bedH,trained,sleepS}}
function foreBlock(d,x,sc,isT){const H=HD(),M=foreModel(d,x,sc),now=new Date(),nh0=now.getHours()+now.getMinutes()/60,tmr=isT&&(nh0>=M.bedH-1.5||nh0<M.w-.5),nh=!isT?12:tmr?M.w:nh0,end=nh+10;
  const prev=lastNDays(d,15).slice(1).map(k=>(H[k]||{}).hrv).filter(v=>v!=null),hb=prev.length?Math.round(prev.reduce((a,b)=>a+b,0)/prev.length):null,hv=x.hrv,dH=hv!=null&&hb!=null?hv-hb:null;
  const N=Math.round(M.E(nh)),pts=[];for(let h=nh;h<=end+1e-6;h+=.25)pts.push([h,M.E(h)]);
  const slope=M.E(nh+3)-M.E(nh),stat=!isT?TT('Geçmiş gün','Past day'):tmr?TT('Yarın','Tomorrow'):slope>4?TT('Yükseliyor','Rising'):slope<-7?TT('Düşüyor','Falling'):TT('Dengeli','Steady');
  const mx=Math.max(...pts.map(p=>p[1])),tb=(()=>{let t=null;pts.forEach(p=>{if(p[0]<=M.bedH-3&&p[1]>=mx*.86)t=p[0]});return t})();
  const lastMeal=(S.meals||[]).filter(m=>m.date===d&&m.time).map(m=>hm(m.time)/60).sort((a,b)=>b-a)[0],prot=isT&&!tmr?Math.max(nh+.5,(lastMeal!=null?lastMeal:nh-4)+4):isT?M.w+.75:null;
  const hh=h=>{const m=Math.round(((h%24)+24)%24*60/15)*15;return z(Math.floor(m/60)%24)+':'+z(m%60)};
  const tip=tmr?(LANG()==='en'?`Time to wind down. ${tb?`Tomorrow, hard training fits <em>before ${hh(tb)}</em>.`:'Tomorrow may be a light day.'}`:`Şimdi dinlenme vakti. Yarın ${tb?`zor antrenman <em>${hh(tb)} öncesine sığar</em>.`:'hafif bir gün olabilir.'}`):!isT?(sc&&sc.rec!=null?TT(`O gün toparlanman %${sc.rec}.`,`Recovery was ${sc.rec}%.`):TT('Bu gün için tahmin yok.','No forecast for this day.'))
    :M.trained?TT('Bugün antrenmanını yaptın. Akşam toparlanmaya odaklan.','You trained today. Focus on recovery tonight.')
    :M.E0<40?TT('Bugün hafif git: yürüyüş ya da mobilite yeterli.','Go easy today: a walk or mobility is enough.')
    :tb?`${slope<-7?TT('Akşama doğru düşüyor.','Fading toward evening.'):TT('Akşama doğru açılıyor.','Clearing toward evening.')} ${LANG()==='en'?`Hard training fits <em>before ${hh(tb)}</em>.`:`Zor antrenman <em>${hh(tb)} öncesine sığar</em>.`}`
    :TT('Bugün için zor antrenman vakti geçti; hafif hareket iyi gelir.','Hard-training window has passed; light movement is fine.');
  const W=320,G=78,X=h=>(h-nh)/10*W,Y=v=>G-4-(v-0)/100*(G-14),path=pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ');
  const mk0=[[nh,tmr?TT('uyanış','wake'):TT('şimdi','now')],...(prot&&prot<end?[[prot,'protein']]:[]),...(tb&&tb>nh+.3&&tb<=end?[[tb,TT('antrenman','train by')]]:[]),...(M.bedH<end?[[M.bedH,TT('yatış','lights out')]]:[])],mk=mk0.sort((a,b)=>a[0]-b[0]).filter((m,i,A2)=>!i||m[0]-A2[i-1][0]>=1.2);
  const ticks=[];for(let h=Math.ceil(nh/2)*2;h<=end;h+=2)ticks.push(h);
  window.__fc={pts,nh,W,X,Y,hh};
  // topo
  const cx=208,cy=58,TP=[];for(let k=0;k<8;k++){const r=11+k*12.5;let dd='';for(let i=0;i<=48;i++){const th=i/48*6.283,rr=r*(1+.13*Math.sin(2*th+k*.7)+.07*Math.sin(3*th+1.3+k*.45));dd+=(i?'L':'M')+(cx+Math.cos(th)*rr*1.55).toFixed(1)+' '+(cy+Math.sin(th)*rr).toFixed(1)}TP.push(dd+'Z')}
  const base=hv!=null?hv:hb!=null?hb:60,lab=k=>Math.round(base-(k)*4+ (k?0:0));
  const topo=`<svg class="fc-topo" viewBox="0 0 320 130" aria-hidden="true">${TP.map((dd,k)=>`<path d="${dd}" class="${k===1?'on':''}" style="animation-delay:${(7-k)*.09}s"/>`).join('')}${[7,6,5,4,3,2].map(k=>`<text x="${(cx-(11+k*12.5)*1.55*0.82).toFixed(0)}" y="${(cy-(11+k*12.5)*.48).toFixed(0)}">${lab(k)}</text>`).join('')}<text class="h" x="${cx}" y="${cy+2}">H</text><text class="hs" x="${cx}" y="${cy+12}">HRV ms</text></svg>`;
  const sl=x.sleep||{},slT=sl.min?(LANG()==='en'?`${Math.floor(sl.min/60)} h ${sl.min%60} min`:`${Math.floor(sl.min/60)} sa ${sl.min%60} dk`):'—';
  return `<div class="fc">${topo}<div class="fc-hd"><span>${new Date(d+'T12:00').toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'})} · ${TT('vücut tahmini','body forecast')}</span><span>${S.settings.ghLast?TT('senkron ','synced ')+new Date(S.settings.ghLast).toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'}):''}</span></div>
   <div class="fc-main"><div class="fc-n" data-v="${tmr?Math.round(M.E(M.w+2)):N}">${isT?(tmr?Math.round(M.E(M.w+2)):N):(sc&&sc.rec!=null?sc.rec:'—')}<sup>%</sup></div><div class="fc-s"><b>${stat}</b><p>${tip}</p></div></div>
   <div class="fc-sub"><span>${tmr?TT('Yarın · 10 saat','Tomorrow · 10 hours'):isT?TT('Sonraki 10 saat','Next 10 hours'):TT('Toparlanma','Recovery')}</span><span>${TT('enerji, tahmini','energy, predicted')}</span></div>
   ${isT?`<div class="fc-g" onpointermove="fcHov(event)" onpointerdown="fcHov(event)" onpointerleave="fcOut()"><svg aria-hidden="true" viewBox="0 0 ${W} ${G+14}" preserveAspectRatio="none"><defs><linearGradient id="fcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
     <path d="${path} L ${W} ${G} L 0 ${G} Z" fill="url(#fcg)"/><path d="${path}" class="fc-l" vector-effect="non-scaling-stroke"/>
     ${mk.map(m=>`<line x1="${X(m[0]).toFixed(1)}" x2="${X(m[0]).toFixed(1)}" y1="${Y(M.E(m[0])).toFixed(1)}" y2="${G}" class="fc-mk" vector-effect="non-scaling-stroke"/>`).join('')}
     <line x1="0" x2="${W}" y1="${G}" y2="${G}" class="fc-ax" vector-effect="non-scaling-stroke"/></svg>
     ${mk.map((m,i)=>`<i class="fc-dot" style="left:${(X(m[0])/W*100).toFixed(2)}%;top:${(Y(M.E(m[0]))/(G+14)*100).toFixed(2)}%"></i><span class="fc-ml${i===mk.length-1&&X(m[0])>W*.8?' r':''}" style="left:${(X(m[0])/W*100).toFixed(2)}%;top:${(Y(M.E(m[0]))/(G+14)*100).toFixed(2)}%">${m[1]}</span>`).join('')}
     <i class="fc-cur" id="fcCur"></i><span class="fc-tip" id="fcTip"></span>
     <div class="fc-x">${ticks.map(h=>`<span style="left:${(X(h)/W*100).toFixed(2)}%">${hh(h)}</span>`).join('')}</div></div>`:''}
   <div class="fc-rows"><div><span>${TT('Kalp atış hızı değişkenliği','Heart rate variability')}</span><b>${hv!=null?hv+' ms':'—'}${dH?` <em>${dH>0?'+':''}${dH}</em>`:''}</b></div>
    <div><span>${TT('Dinlenik nabız','Resting heart rate')}</span><b>${x.rhr!=null?x.rhr+' bpm':'—'}</b></div>
    <div><span>${TT('Uyku, dün gece','Sleep, last night')}</span><b>${slT}</b></div></div></div>`}
window.fcHov=e=>{const c=window.__fc,g=e.currentTarget,r=g.getBoundingClientRect(),f=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),h=c.nh+f*10,p=c.pts.reduce((a,b)=>Math.abs(b[0]-h)<Math.abs(a[0]-h)?b:a);
  const cu=document.getElementById('fcCur'),tp=document.getElementById('fcTip'),lx=c.X(p[0])/c.W*100,ty=c.Y(p[1])/(78+14)*100;if(!cu)return;cu.style.cssText=`display:block;left:${lx}%;top:${ty}%`;tp.style.cssText=`display:block;left:${Math.max(12,Math.min(88,lx))}%;top:${ty}%`;tp.textContent=c.hh(p[0])+' · '+Math.round(p[1])};
window.fcOut=()=>{['fcCur','fcTip'].forEach(i=>{const e=document.getElementById(i);if(e)e.style.display='none'})};
function fcCount(){const el=document.querySelector('.fc-n[data-v]');if(!el||el._done)return;el._done=1;const v=+el.dataset.v;if(isNaN(v))return;const k0=fcCount._last===v;fcCount._last=v;if(k0)return;const sup=el.querySelector('sup'),t0=performance.now(),D=900;
  const f=t=>{const q=Math.min(1,(t-t0)/D),e2=1-Math.pow(1-q,3);el.firstChild.nodeValue=Math.round(v*e2);if(q<1)requestAnimationFrame(f)};el.firstChild.nodeValue='0';requestAnimationFrame(f)}
function homeEdit(){const hid=S.settings.homeHide||[],L=HSEC.filter(x=>!x[3]||cycOn());
  return `<div class="pad" style="margin:18px 0 8px"><button class="hed-b" onclick="A.edSheet('home')">${eiSvg('pen')} Widget'ları düzenle${hid.length?` <small>${hid.length} bölüm gizli</small>`:''}</button></div>`;
  return `<div class="card hed"><div class="row between"><b>✎ Ekranı düzenle</b><button class="pill" onclick="A.homeEd()">Bitti</button></div>
   <div class="lbl" style="margin:4px 0 8px">Görmek istemediğin bölümleri kapat.</div>
   ${L.map(([k,ic,n])=>{const on=!hid.includes(k);return `<button class="hed-r" onclick="A.homeTog('${k}')"><span>${ic}</span><b>${n}</b><i class="sw ${on?'on':''}"></i></button>`}).join('')}
   ${hid.length?`<button class="link" style="margin:8px auto 0" onclick="A.homeShowAll()">Hepsini göster</button>`:''}</div>`}
/* arkadaş bildirimleri: alıcı tercihleri sosyal belgede (nf) yayınlanır, gönderen buna bakar */
const FNK=[['post','Fotoğraf paylaşınca','When a friend posts a photo'],['live','Antrenmana başlayınca','When a friend starts a workout'],['like','Beğeni ve yorumlar','Likes and comments'],['chal','Meydan okuma davetleri','Challenge invites']];
const fnOn=k=>((S.settings.fn||{})[k])!==false;
const fnType=t=>t==='cmt'?'like':t;
function frNotifCard(){const web=!HMN()&&window.HMAcct&&'PushManager' in window,pOn=(()=>{try{return localStorage.getItem('hm-push')==='1'&&Notification.permission==='granted'}catch(e){return false}})();
  return `<div class="card"><b>${TT('Arkadaş bildirimleri','Friend notifications')}</b><div class="lbl" style="margin:4px 0 8px">${TT('Arkadaşların bir şey yapınca sana haber verilsin mi?','Get notified when friends do something?')}</div>
   ${FNK.map(([k,t,e])=>`<div class="row between" style="padding:9px 0;border-top:1px solid var(--line)"><span>${TT(t,e)}</span><button class="sw ${fnOn(k)?'on':''}" role="switch" aria-checked="${fnOn(k)}" aria-label="${TT(t,e)}" onclick="A.fnTog('${k}')"></button></div>`).join('')}
   ${web?`<div class="row between" style="padding:10px 0 2px;border-top:1px solid var(--line)"><span>${TT('Uygulama kapalıyken de bildir','Notify when the app is closed')}<small class="lbl" style="display:block;font-size:11.5px">${TT('iPhone/iPad’de önce Paylaş → Ana Ekrana Ekle','On iPhone/iPad add to Home Screen first')}</small></span>${pOn?`<span class="lbl">${TT('Açık','On')}</span>`:`<button class="pill fin" onclick="A.webPush()">${TT('Aç','Turn on')}</button>`}</div>`:''}</div>`}
/* Apple Sağlık → iOS Kestirmeler: kestirme bu sayfayı #hk=1&d=...&st=... ile açar, veriler buraya yazılır */
function hkNum(v,dec){if(v==null||v==='')return null;let s=String(v).trim();if(!dec)return(s=s.replace(/[^\d]/g,''))?+s:null;
  s=s.replace(/[^\d.,-]/g,'');const lc=Math.max(s.lastIndexOf(','),s.lastIndexOf('.'));if(lc>=0&&s.length-lc-1<=2){s=s.slice(0,lc).replace(/[.,]/g,'')+'.'+s.slice(lc+1)}else s=s.replace(/[.,]/g,'');const n=parseFloat(s);return isNaN(n)?null:n}
function hkUrlImport(){try{const h=location.hash||'';if(!/[#&]hk=/.test(h))return;const q=new URLSearchParams(h.replace(/^#/,''));
  let d=q.get('d')||dkey();if(!/^\d{4}-\d{2}-\d{2}$/.test(d))d=dkey();
  const v={},st=hkNum(q.get('st')),rhr=hkNum(q.get('rhr')),hrv=hkNum(q.get('hrv'),1),kc=hkNum(q.get('kc')),sp=hkNum(q.get('sp'),1),ex=hkNum(q.get('ex'));
  if(st!=null)v.steps=st;if(rhr)v.rhr=Math.round(rhr);if(hrv)v.hrv=Math.round(hrv);if(kc!=null)v.kcalAct=kc;if(ex!=null)v.active=ex;if(sp)v.spo2=Math.round(sp<=1?sp*100:sp);
  let sl=hkNum(q.get('sl'),1);if(sl){if(sl<24)sl=sl*60;else if(sl>1800)sl=sl/60;sl=Math.round(sl);if(sl>60&&sl<1000){const dp=hkNum(q.get('dp'),1),rm=hkNum(q.get('rem'),1),cv=x=>x==null?null:Math.round(x<24?x*60:x>1800?x/60:x);
    v.sleep={...((S.health[d]||{}).sleep||{}),min:sl,...(dp!=null?{deep:cv(dp)}:{}),...(rm!=null?{rem:cv(rm)}:{})};if(v.sleep.deep!=null&&v.sleep.rem!=null)v.sleep.light=Math.max(0,sl-v.sleep.deep-v.sleep.rem)}}
  const w=hkNum(q.get('w'),1);let n=Object.keys(v).length;
  if(n){S.health[d]={...(S.health[d]||{}),...v}}
  if(w&&w>25&&w<350){const b=S.body.find(x=>x.date===d);if(b)b.weight=Math.round(w*10)/10;else S.body.push({date:d,weight:Math.round(w*10)/10,sleep:null});S.profile.weight=Math.round(w*10)/10;n++}
  history.replaceState(null,'',location.pathname+location.search);
  if(!n){toast(TT('Kestirmeden veri gelmedi; Sağlık izinlerini kontrol et','No data from the shortcut; check Health permissions'));return}
  S.healthDemo=false;S.settings.hkSc=Date.now();S.settings.hkScN=(S.settings.hkScN||0)+1;save();render(true);toast(TT('✓ Apple Sağlık verisi alındı','✓ Apple Health data received'))}catch(e){console.warn('hk',e)}}
addEventListener('hashchange',()=>{if(/[#&]hk=/.test(location.hash))hkUrlImport()});
function hkScCard(){const C=window.HM_CONFIG||{},link=C.shortcut||'',last=S.settings.hkSc;
  return `<div class="card"><b>${TT('Apple Sağlık (iPhone Kestirmeler)','Apple Health (iPhone Shortcuts)')}</b>
   <div class="lbl" style="margin:6px 0 10px;line-height:1.5">${TT('Fitbit’in yoksa iPhone’undaki adım, uyku, nabız, HRV ve kilo verini Kestirmeler uygulamasıyla gönderebilirsin. Ücretsiz; uygulama kurmana gerek yok.','No Fitbit? Send steps, sleep, heart rate, HRV and weight from your iPhone with the Shortcuts app.')}</div>
   ${last?`<div class="lbl" style="margin-bottom:10px">${TT('Son gönderim: ','Last sync: ')}<b style="color:var(--txt)">${new Date(last).toLocaleString(LOC(),{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</b></div>`:''}
   ${link?`<a class="btn" href="${esc(link)}" target="_blank" rel="noopener">${TT('Kestirmeyi ekle','Add the shortcut')}</a>`:`<div class="lbl">${TT('Kestirme bağlantısı henüz eklenmedi.','Shortcut link not set yet.')}</div>`}
   <ol class="lbl" style="line-height:1.6;margin:12px 0 0 18px;padding:0"><li>${TT('“Kestirmeyi ekle”ye bas, Kestirmeler’de “Kestirme Ekle” de.','Tap “Add the shortcut”, then “Add Shortcut”.')}</li><li>${TT('Bir kez çalıştır, Sağlık izinlerinin hepsine izin ver.','Run it once and allow all Health permissions.')}</li><li>${TT('Her gün kendiliğinden çalışsın: Kestirmeler → Otomasyon → + → Günün Saati (ör. 09:00 ve 22:00) → HypeMode Sağlık → “Hemen Çalıştır”.','Automate: Shortcuts → Automation → + → Time of Day → HypeMode Health → Run Immediately.')}</li></ol></div>`}
function homeV(){let DR=false;if(S.swake&&S.swake.on&&!S.settings.swOffV1){S.settings.swOffV1=1;S.swake={...S.swake,on:false}}if(!S.settings.homeV2){S.settings.homeV2=1;const o={...(S.settings.ord||{})};delete o.home;S.settings.ord=o}if(!S.settings.foreV1){S.settings.foreV1=1;const h=S.settings.homeHide||[];if(!h.includes('dring'))S.settings.homeHide=[...h,'dring'];}
  const td=dkey(),d=ui.hDay&&ui.hDay<=td?ui.hDay:td,isT=d===td,has=hasHealth(),sc=healthScores(d)||null,x=sc?sc.x:(HD()[d]||{});
  const live=Object.keys(S.health||{}).length>0,devTxt=S.healthDemo?'Demo':live?'Fitbit':'Yok',dot=S.healthDemo||live;
  const stn=strainOf(d),str=stressOf(d),vir=vitalsInRange(d),stk=streak();
  const msgs=isT?[...(sc?[stateTxt(sc)]:[]),...coachNotes()]:[dayHeadline(d,sc,stn)];
  const hv=k=>!['mon','cardio','hrv','heart','dring'].includes(k)&&!(S.settings.homeHide||[]).includes(k);const p=todaysPlan(),wg=waterGoal(d),fl=fluid(d),sp=suppsFor(d),L=S.suppLog[d]||{};
  return `<div class="hero hh">
    <div class="htop"><div class="row" style="gap:8px"><button class="avatar" onclick="ui_setNull();A.go('settings')" aria-label="Ayarlar"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button><span class="streak">${lic('flame',15)} ${stk}</span></div>
     <div class="dnav"><button onclick="A.hDay(-1)" aria-label="Önceki gün">‹</button><b>${dayLbl(d)}</b><button onclick="A.hDay(1)" ${isT?'disabled':''} aria-label="Sonraki gün">›</button></div>
     </div>
    ${(()=>{const L=hrmOn()&&HRM.bpm?{t:Date.now(),v:HRM.bpm}:S.healthDemo?{t:Date.now()-4*6e4,v:(x.hr15||[]).filter(v=>v!=null).slice(-1)[0]||68}:S.settings.ghHR;if(!L||!L.v)return "";const mn=Math.round((Date.now()-L.t)/6e4),hr=(x.hr15||[]).slice(Math.max(0,Math.floor((new Date().getHours()*60+new Date().getMinutes())/15)-12)).filter(v=>v!=null),mx=Math.max(...hr,L.v),mi=Math.min(...hr,L.v),pts=hr.map((v,i)=>`${(i/(Math.max(1,hr.length-1))*60).toFixed(1)},${(18-(v-mi)/((mx-mi)||1)*16).toFixed(1)}`).join(" ");const z2=hrZoneOf(L.v);return `<button class="hrpill" onclick="A.ghSync()"><span class="hrp-h">♥</span><b>${L.v}</b><small>bpm</small>${hr.length>2?`<svg aria-hidden="true" viewBox="0 0 60 20" width="60" height="20"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`:""}<em>${hrmOn()&&HRM.bpm?"canlı":mn<1?"şimdi":mn<60?mn+" dk önce":Math.round(mn/60)+" sa önce"}${z2>=1?" · "+HRZ[z2][1]:""}</em></button>`})()}<div class="logo"><span class="hmb">${HM_LOGO(30)}<span>HYPEMODE</span></span></div>
    ${S.profile.name?`<div class="hgreet">${(h=>h<5?'İyi geceler':h<12?'Günaydın':h<18?'İyi günler':h<22?'İyi akşamlar':'İyi geceler')(new Date().getHours())}, ${esc(S.profile.name)}</div>`:''}
  </div>
  <div class="secw" data-sec="fore"><div class="hfore">${hv('fore')?withDemo(dm=>{const sc2=dm?healthScores(d):sc,x2=dm?(sc2?sc2.x:(HD()[d]||{})):x;return foreBlock(d,x2||{},sc2,isT)}):''}
    ${hv('dring')?withDemo(dm=>{if(!dm&&!sc)return dayRing(d,{},null);const sc2=dm?healthScores(d):sc,x2=dm?(sc2?sc2.x:(HD()[d]||{})):x;return dayRing(d,x2,sc2)}):''}<div class="rings3" style="display:none">${ring3(sc?sc.sleep:null,100,'#8fb0cc','UYKU','%',"A.scrollTo('c-sleep')")}${ring3(sc?sc.rec:null,100,recCol(sc&&sc.rec),'TOPARLANMA','%',"A.scrollTo('c-vit')")}${ring3(stn,21,'#3b8bff','YÜK','',"A.scrollTo('c-heart')")}</div>
    ${!hasHealth()?`<div class="dr-demo"><span>${TT('Örnek veri gösteriliyor','Showing sample data')}</span><button onclick="A.go('settings');setTimeout(()=>A.setSec&&A.setSec('health'),60)">${TT('Fitbit bağla','Connect Fitbit')}</button></div>`:''}${backupNag()}${0&&hv('coach')?`<div class="cmsg cbox"><button class="cb-main" onclick="A.notes('${d}')"><div><b>${isT?(sc?(sc.tot>=80?'Hazırsın':sc.tot>=60?'Dengeli bir gün':'Toparlanma günü'):'Koç'):'Günün özeti'}</b><p>${msgs[0]||'Bugün için not yok.'}</p></div>${msgs.length>1?`<span class="cnt">✓<small>${msgs.length}</small></span>`:''}</button>
     <div class="cb-act"><button onclick="A.dayReview('${d}')">☾ ${isT?'Günün özeti':'O günün özeti'}</button>${isT?`<button onclick="A.report('day')">🤖 AI raporu</button><button onclick="A.report('week')">📅 Haftalık</button>`:''}</div></div>`:''}</div></div>
    <div class="secw" data-sec="mon">${hv('mon')&&(vir||str)?`<div class="grid2" style="margin-top:12px">
     <button class="mon" onclick="A.scrollTo('c-vit')"><div class="row between"><b>SAĞLIK MONİTÖRÜ</b><span>›</span></div>
      ${vir?`<div class="row" style="gap:10px;margin-top:12px"><span class="mbx ${vir.n===vir.t?'ok':'wr'}">${vir.n===vir.t?'✓':'!'}</span><div><b class="${vir.n===vir.t?'ok':'warn'}">${vir.n===vir.t?'ARALIKTA':'DİKKAT'}</b><small>${vir.n}/${vir.t} normal aralıkta</small></div></div>`:'<small class="muted" style="display:block;margin-top:12px">Veri yok</small>'}</button>
     <button class="mon" onclick="A.stressInfo()"><div class="row between"><b>STRES MONİTÖRÜ</b><span>›</span></div>
      ${str?`<div class="row" style="gap:10px;margin-top:12px"><span class="mbx" style="color:${str.col}">${String(str.v).replace('.',',')}</span><div><b style="color:${str.col}">${str.lab}</b><small>${str.t}</small></div></div>`:'<small class="muted" style="display:block;margin-top:12px">Veri yok</small>'}</button></div>`:''}</div>
    <div class="secw" data-sec="cycle">${(()=>{const B=bioAge(d),cs=cardioStat(d),cc=CST[cs.st],sb=false&&hv('bio')&&!B.need,sk=hv('cardio')&&cs.st!=='none';return `${sb||sk?`<div class="grid2" style="margin-top:10px;${sb&&sk?'':'grid-template-columns:1fr'}">`:''}
     ${sb?`<button class="mon" onclick="A.bioInfo()"><div class="row between"><b>BİYOLOJİK YAŞ</b><span>›</span></div>
      ${B.need?'<small class="muted" style="display:block;margin-top:12px">Yaşını gir</small>':`<div class="row" style="gap:10px;margin-top:12px"><span class="mbx" style="color:${B.diff<=0?'#3ee6a0':'#ff8a7a'};width:auto;padding:0 8px">${fmt(B.bio)}</span><div><b style="color:${B.diff<=0?'#3ee6a0':'#ff8a7a'}">${B.diff>0?'+':''}${fmt(B.diff)} YIL</b><small>gerçek yaş ${B.age}</small></div></div>`}</button>
`:''}${sk?`<button class="mon" onclick="A.cardioInfo()"><div class="row between"><b>KARDİYO YÜKÜ</b><span>›</span></div>
      <div class="row" style="gap:10px;margin-top:12px"><span class="mbx" style="color:${cc[1]}">${cs.st==='none'?'—':cs.a7}</span><div><b style="color:${cc[1]};font-size:12px;letter-spacing:.06em">${cc[0].toLocaleUpperCase('tr-TR')}</b><small>${cs.st==='none'?'kayıt yok':'7 günlük yük'}</small></div></div></button>`:''}${sb||sk?'</div>':''}${hv('cycle')?cycTile():''}`})()}</div>
  <div class="secw" data-sec="wks">${isT&&hv('wks')?wkSumCard():''}</div>
  <div class="secw" data-sec="fat">${isT&&hv('fat')?fatigueCard():''}</div>
  <div class="secw" data-sec="wtr">${hv('wtr')?wtCard():''}</div>
  <div class="secw" data-sec="hwid">${hv('hwid')?withDemo(()=>homeTiles(d)):''}</div>
  ${''}
  <div class="secw" data-sec="sleepperf">${isT&&hv('sleepperf')&&has?sleepPerfCard():''}</div>
  ${0&&!has?`<div class="card coach"><h4>⌚ Fitbit Air henüz bağlı değil</h4><p>Saat geldiğinde uyku, HRV, nabız ve adım verilerin halkalarda görünecek, koç antrenman yoğunluğunu bunlara göre ayarlayacak.</p>
    <div class="grid2" style="margin-top:12px"><button class="btn" onclick="A.healthDemo(true)">Örnek veriyle göster</button><button class="btn ghost" onclick="A.go('settings');setTimeout(()=>{const e=document.querySelector('.intg');e&&e.scrollIntoView({behavior:'smooth',block:'center'})},250)">Cihaz bağla</button></div></div>`:''}
  ${S.healthDemo?`<div class="pad"><div class="demo-bar">Örnek veri gösteriliyor, gerçek ölçüm değil. <button onclick="A.healthDemo(false)">Kapat</button></div></div>`:!has?`<div class="pad"><div class="demo-bar nodev">⌚ Fitbit'in yok mu? Uygulamayı örnek verilerle gör. <button onclick="A.healthDemo(true)">Örnek veri göster</button></div></div>`:''}
  <div class="pad row between" style="margin-top:18px" hidden><div class="h2" style="margin:0">${isT?'Günüm':'O gün'}</div>${isT?`<button class="plusb" onclick="A.quickAdd()" aria-label="Ekle">${I.plus}</button>`:''}</div>
  ${(DR=sc&&hv('dring')),''}<div class="secw" data-sec="kcal">${sc&&!DR&&(hv('kcal')||hv('heart'))?`<div id="c-heart">${heartCard(sc,hv)}</div>`:''}</div>
  <div class="secw" data-sec="rings">${sc&&!DR&&hv('rings')?edMove(d,x):''}</div>
  <div class="secw" data-sec="vit">${sc&&!DR&&hv('vit')&&(x.hrv!=null||x.rhr!=null)?`<div id="c-vit">${edBody(d,x)}</div>`:''}</div>
  <div class="secw" data-sec="sleep">${!DR&&hv('sleep')&&x.sleep&&x.sleep.min?edSleep(d,x):''}</div>
  <div class="secw" data-sec="hrv">${sc&&!DR&&hv('hrv')&&x.hrv!=null?`<div class="card"><div class="row between"><b>HRV · 30 gün</b><span class="lbl">yeşil bant: normal aralığın</span></div>${spark(d,'hrv')}</div>`:''}</div>
  ${0&&isT&&hv('today')?`<div class="card"><b>Bugün</b>
   <button class="rlist" onclick="A.go('programs')"><div class="plate sm" style="background:var(--card2);box-shadow:none">🏋️</div><div style="flex:1">${p?esc(p.name):'Program yok'}<small>${p?`${p.exercises.length} egzersiz · sıradaki antrenman`:'Antrenman sekmesinden program ekle'}</small></div><span class="muted">›</span></button>
   <div class="rlist"><div class="plate sm" style="background:var(--card2);box-shadow:none">💧</div><div style="flex:1">${(fl/1000).toFixed(1).replace('.',',')} / ${(wg.goal/1000).toFixed(1).replace('.',',')} L su<small>${sp.length?`Takviye ${sp.filter(y=>L[y.id]).length}/${sp.length}`:'Takviye eklenmedi'}</small></div><button class="pill" onclick="A.drink('su',250)">+250</button></div></div>
  `:''}
  ${homeEdit()}`;
}
function dayHeadline(d,sc,stn){const t=dayTotals(d),ss=trainedOn(d),parts=[];
  if(sc&&sc.sleep!=null)parts.push(`Uyku %${sc.sleep}`);if(sc&&sc.rec!=null)parts.push(`toparlanma %${sc.rec}`);if(stn!=null)parts.push(`yük ${String(stn).replace('.',',')}`);
  if(ss.length)parts.push(`${ss.map(s2=>esc(s2.planName)).join(', ')} antrenmanı`);if(t.kcal)parts.push(`${Math.round(t.kcal)} kcal`);
  return parts.length?parts.join(' · ')+'.':'Bu gün için kayıt yok.'}
function cookCard(){const P=S.pantry||[];
  return `<div class="card aic ckc"><div class="aic-h"><span class="aic-b ckb">🧑‍🍳</span><div><b>Ne pişirsem?</b><div class="lbl">Evdeki malzemelerle tarif önerisi al ya da yemekle ilgili AI'ya soru sor</div></div></div>
   <div class="grid2" style="margin-top:14px"><button class="btn ckc-b" onclick="A.cook('rec')">🍳 Tarif öner</button><button class="btn ghost" onclick="A.cook('ask')">💬 AI'ya sor</button></div>
   ${P.length?`<div class="lbl" style="margin-top:8px;font-size:11.5px">Evde: ${P.slice(0,6).map(esc).join(', ')}${P.length>6?' +'+(P.length-6):''}</div>`:''}</div>`}
function photoCard(d,home){const ph=S.photos.filter(x=>x.date===d&&x.kind!=='body').sort((a,b)=>a.time<b.time?-1:1);
  return `<div class="card aic"><div class="aic-h"><span class="aic-b">✨ AI</span><div><b>AI yemek tahmini</b><div class="lbl">Fotoğrafını çek, kalorisini ve makrolarını yapay zekâ tahmin etsin</div></div></div>
   <div class="grid2" style="margin-top:14px">
    <label class="btn aic-c" style="cursor:pointer">📷 Fotoğraf çek<input type="file" accept="image/*" capture="environment" hidden onchange="A.snapFrom(this,'${d}')"></label>
    <label class="btn ghost" style="cursor:pointer">🖼️ Galeriden seç<input type="file" accept="image/*" hidden onchange="A.snapFrom(this,'${d}')"></label></div>
   <div class="lbl" style="margin-top:8px;font-size:11.5px">İpucu: 45° açıyla çek, yanına çatal ya da elini koy. Sonra gramları kontrol et.</div>
   ${ph.length?`<div class="gcat" style="margin:16px 0 8px">Yemek fotoğraflarım · ${ph.length}</div><div class="pgrid">${ph.map(x=>{const m=x.mealId&&S.meals.find(y=>y.id===x.mealId);return `<button class="pcell" onclick="A.photoView('${x.id}')" style="background-image:url(${x.img})">
     <span class="pt">${x.time}</span>${m?`<span class="pk">${m.kcal} kcal</span>`:'<span class="pk add">✨ hesapla</span>'}</button>`}).join('')}</div>`:''}</div>`}
window.S_note=id=>(S.photos.find(p=>p.id===id)||{}).note||'';
const compress=f=>new Promise((res,rej)=>{const im=new Image(),u=URL.createObjectURL(f);
  im.onload=()=>{const M=380,sc=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',0.65))};im.onerror=rej;im.src=u});
function homeHealth(){const d=dkey(),wg=waterGoal(d),fl=fluid(d),list=suppsFor(d),L=S.suppLog[d]||{},dn=list.filter(s=>L[s.id]).length;
  return `<div class="card"><div class="grid2">
   <div><div class="lbl">💧 Su</div><div style="font-weight:700;font-size:18px;margin:2px 0">${(fl/1000).toFixed(1).replace('.',',')} / ${(wg.goal/1000).toFixed(1).replace('.',',')} L</div><div class="bar"><i style="width:${Math.min(100,fl/wg.goal*100)}%;background:linear-gradient(90deg,#3fd0ff,#3b8bff)"></i></div>
    <button class="pill" style="margin-top:10px" onclick="A.drink('su',250)">+250 ml</button></div>
   <div><div class="lbl">💊 Takviyeler</div><div style="font-weight:700;font-size:18px;margin:2px 0">${list.length?`${dn} / ${list.length}`:'–'}</div><div class="bar"><i style="width:${list.length?dn/list.length*100:0}%;background:linear-gradient(90deg,#3ee6a0,#3fd0ff)"></i></div>
    <button class="pill" style="margin-top:10px" onclick="A.go('food')">${list.length?'İşaretle':'Ekle'}</button></div></div></div>`}
function aiCard(){const d=dkey(),dr=S.reports['d-'+d],wk=Object.keys(S.reports).filter(k=>k.startsWith('w-')).sort().pop(),wr=wk&&S.reports[wk];
  if(!CL.sample)return `<div class="card coach"><h4>🤖 AI Koç</h4><p class="lbl" style="margin:0">AI raporları ve önerileri, uygulama claude.ai üzerinden açıldığında çalışır.</p></div>`;
  return `<div class="card coach"><h4>🤖 AI Koç raporları</h4>
   ${dr?`<p style="margin-top:2px">${esc(dr.summary||'')}</p>`:'<p style="margin-top:2px">Gün sonunda günlük raporunu al: bugünün değerlendirmesi ve yarın için hedefine göre öneriler.</p>'}
   <div class="grid2" style="margin-top:12px"><button class="btn" onclick="A.report('day')">${dr?'Günlük raporu aç':'Günlük rapor'}</button><button class="btn ghost" onclick="A.report('week')">${wr?'Haftalık rapor':'Haftalık rapor'}</button></div></div>`}
function reportView(r,kind){
  const sc=r.score!=null?`<div class="score" style="--v:${Math.max(0,Math.min(100,+r.score||0))}"><b>${Math.round(+r.score||0)}</b><span>puan</span></div>`:'';
  const li=a=>(a||[]).map(x=>`<li>${esc(typeof x==='string'?x:x.text||'')}</li>`).join('');
  const AREA={Antrenman:'🏋️',Beslenme:'🍽️',Toparlanma:'😴',Su:'💧',Takviye:'💊',Kilo:'⚖️'};
  return `<div class="row" style="gap:14px;align-items:center;margin-bottom:10px">${sc}<div style="flex:1"><h3 style="margin:0 0 4px">${esc(r.title||(kind==='week'?'Haftalık rapor':'Günlük rapor'))}</h3><div class="lbl">${esc(r.period||'')}</div></div></div>
   <p style="line-height:1.5;margin:0 0 10px">${esc(r.summary||'')}</p>
   ${r.goalNote?`<div class="sugg" style="margin:0 0 10px">🎯 ${esc(r.goalNote)}</div>`:''}
   ${(r.good||[]).length?`<div class="gcat">İyi gidenler</div><ul class="rl ok-l">${li(r.good)}</ul>`:''}
   ${(r.improve||[]).length?`<div class="gcat">Geliştirilecekler</div><ul class="rl">${li(r.improve)}</ul>`:''}
   ${(r.plan||[]).length?`<div class="gcat">${kind==='week'?'Gelecek hafta için plan':'Yarın için öneriler'}</div>${r.plan.map(x=>`<div class="pl-i"><span>${AREA[x.area]||'•'}</span><div><b>${esc(x.area||'')}</b><div>${esc(x.text||'')}</div></div></div>`).join('')}`:''}
   <div class="lbl" style="margin:14px 0 4px">AI tarafından senin kayıtlarına göre oluşturuldu · ${esc(r.at||'')}. Genel bilgidir, tıbbi tavsiye değildir.</div>`}
function todayMenu(){
  const d=dkey(),m=S.mealPlan[d]||{},ks=SLOTS.filter(([k])=>m[k]&&rec(m[k].rid));
  if(!ks.length)return `<div class="card row between"><div><b>Bugünün menüsü</b><div class="lbl">Henüz yemek planın yok</div></div><button class="pill" onclick="A.go('mealplan')">✨ Planla</button></div>`;
  return `<div class="card"><div class="row between"><b>Bugünün menüsü</b><button class="pill" onclick="A.go('mealplan')">Tümü ›</button></div>
   ${ks.map(([k,l])=>{const r=rec(m[k].rid);return `<button class="rlist" onclick="A.slot('${d}','${k}')"><div class="plate sm" style="background:${r.col}">${r.e}</div><div style="flex:1">${esc(r.n)}<small>${l} · ${Math.round(r.kcal*m[k].serv)} kcal · P ${Math.round(r.p*m[k].serv)} g</small></div>${m[k].eaten?'<span class="ok">✓</span>':''}</button>`}).join('')}</div>`;
}
/* ---------- Güç paneli (Bevel tarzı) ---------- */
const MG=[['chest','Göğüs','#ff5a3c',['chest']],['back','Sırt','#3fd0ff',['back']],['shoulders','Omuz','#ffb547',['shoulders']],['arms','Kol','#b78cff',['biceps','triceps']],['legs','Bacak','#3ee6a0',['quads','hamstrings','glutes','calves']],['core','Core','#ff5fb0',['core']]];
const mgOf=m=>{const g=MG.find(x=>x[3].includes(m));return g?g[0]:null};
const MUSC2={...MUSCLES,forearms:'Ön kol',lowback:'Bel'};
const MGI=Object.fromEntries(MG.map(g=>[g[0],g]));
const sAge=s=>Date.now()-new Date(s.date).getTime();
const ja=s=>encodeURIComponent(s).replace(/'/g,'%27');
const tons=v=>(Math.round(v/100)/10).toFixed(1).replace('.',',');
function ago(d){const t=new Date(d),a=new Date();a.setHours(0,0,0,0);const b=new Date(t);b.setHours(0,0,0,0);const n=Math.round((a-b)/864e5);
  return n<=0?'bugün':n===1?'dün':n<7?n+' gün önce':t.toLocaleDateString(LOC(),{day:'numeric',month:'short'})}
function setsBy(list){const o=Object.fromEntries(MG.map(g=>[g[0],0]));list.forEach(s=>s.sets.forEach(x=>{const g=mgOf(x.muscle);if(g)o[g]++}));return o}
const volOf=s=>s.sets.reduce((a,x)=>a+(x.t?0:(x.kg||0)*(x.reps||0)),0);
function bestE1(name,before){let b=0;const lim=before?new Date(before).getTime():Infinity;
  S.sessions.forEach(s=>{if(new Date(s.date).getTime()>=lim)return;s.sets.forEach(x=>{if(x.ex===name&&!x.t&&x.kg>0)b=Math.max(b,e1rm(x.kg,x.reps))})});return b}
/* Kas yükü (0–100): her set, kişisel en iyiye göre yoğunluğuyla ağırlıklandırılır */
function loadOf(sets,date){let L=0;const c={};
  sets.forEach(x=>{let I=.7;if(!x.t&&x.kg>0){const b=c[x.ex]??(c[x.ex]=bestE1(x.ex,date)||e1rm(x.kg,x.reps));I=Math.min(1.1,e1rm(x.kg,x.reps)/b)}
    if(x.rpe)I*=.7+.03*Math.min(10,x.rpe);L+=.5+.5*I});
  return Math.round(100*(1-Math.exp(-L/16)))}
const loadLbl=v=>v<35?['Hafif','#3fd0ff']:v<60?['Orta','#3ee6a0']:v<80?['Yüksek','#ffb547']:['Çok yüksek','#ff5a3c'];
function recov(){const o=Object.fromEntries(MG.map(g=>[g[0],0]));
  S.sessions.forEach(s=>{const h=sAge(s)/36e5;if(h>120||h<0)return;const k=Math.exp(-h/30);s.sets.forEach(x=>{const g=mgOf(x.muscle);if(g)o[g]+=k})});
  return MG.map(g=>{const p=Math.max(0,Math.min(100,Math.round(100-o[g[0]]*9)));return{k:g[0],n:g[1],c:g[2],p,st:p>=85?'Hazır':p>=55?'Toparlanıyor':'Yorgun',sc:p>=85?'#3ee6a0':p>=55?'#ffb547':'#ff5f7a'}})}
function prEvents(days){const best={},ev=[];
  S.sessions.forEach(s=>{const bs={};s.sets.forEach(x=>{if(x.t||!(x.kg>0))return;const v=e1rm(x.kg,x.reps);if(!bs[x.ex]||v>bs[x.ex].v)bs[x.ex]={v,kg:x.kg,reps:x.reps}});
    Object.entries(bs).forEach(([n,b])=>{const p=best[n];if(p&&b.v>p+.05)ev.push({n,...b,d:s.date,delta:b.v-p});if(!p||b.v>p)best[n]=b.v})});
  const seen=new Set();return ev.filter(e=>Date.now()-new Date(e.d).getTime()<days*864e5).reverse().filter(e=>!seen.has(e.n)&&seen.add(e.n))}
function planGroups(p){const o={};p.exercises.forEach(e=>{const g=mgOf(e.muscle);if(g)o[g]=(o[g]||0)+(+e.sets||0)});return Object.entries(o).sort((a,b)=>b[1]-a[1]).map(x=>x[0])}
const planMin=p=>Math.round(p.exercises.reduce((a,e)=>a+(+e.sets||0)*(e.t?1.3:2.2),0));
const planSets=p=>p.exercises.reduce((a,e)=>a+(+e.sets||0),0);
const lastOfPlan=p=>S.sessions.filter(s=>s.planId===p.id||s.planName===p.name).slice(-1)[0];
const gTags=gs=>gs.map(g=>`<span class="mtag" style="--c:${MGI[g][2]}">${MGI[g][1]}</span>`).join('');
const ini=s=>String(s||'?').replace(/[^\p{L}\p{N} ]/gu,'').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toLocaleUpperCase('tr-TR')||'•';

function radar(vals,max){const W=300,H=272,cx=150,cy=134,R=88,N=vals.length;
  const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/N;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]};
  const poly=r=>vals.map((_,i)=>pt(i,r).map(v=>v.toFixed(1)).join(',')).join(' ');
  const dp=vals.map((v,i)=>pt(i,R*Math.max(.04,Math.min(1.15,v.v/max))));
  return `<svg aria-hidden="true" viewBox="0 0 ${W} ${H}" class="radar"><defs><radialGradient id="rg" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#ff5a3c" stop-opacity=".15"/><stop offset="1" stop-color="#ff2a1e" stop-opacity=".55"/></radialGradient></defs>
   ${[.25,.5,.75,1].map(k=>`<polygon points="${poly(R*k)}" fill="none" stroke="rgba(255,255,255,${k===1?.16:.07})" stroke-width="1"/>`).join('')}
   ${vals.map((_,i)=>{const[x,y]=pt(i,R);return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,.07)"/>`}).join('')}
   <polygon points="${dp.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="url(#rg)" stroke="#ff5a3c" stroke-width="2" stroke-linejoin="round" style="filter:drop-shadow(0 0 10px rgba(255,70,40,.45))"/>
   ${dp.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.6" fill="${vals[i].c}" stroke="#0b0b0d" stroke-width="1.5"/>`).join('')}
   ${vals.map((v,i)=>{const[x,y]=pt(i,R+24);const an=Math.abs(x-cx)<8?'middle':x>cx?'start':'end';return `<text x="${x.toFixed(1)}" y="${(y-2).toFixed(1)}" text-anchor="${an}" fill="#f3f3f5" font-size="12" font-weight="600">${v.n}</text><text x="${x.toFixed(1)}" y="${(y+12).toFixed(1)}" text-anchor="${an}" fill="${v.c}" font-size="11" font-weight="600">${v.v} set</text>`}).join('')}
  </svg>`}
function ring(p,c,sz=44,sw=5,inner=''){const r=(sz-sw)/2,C=2*Math.PI*r;
  return `<span class="rg" style="width:${sz}px;height:${sz}px"><svg aria-hidden="true" width="${sz}" height="${sz}"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" stroke="rgba(255,255,255,.1)" stroke-width="${sw}" fill="none"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-Math.max(0,Math.min(1,p)))}" transform="rotate(-90 ${sz/2} ${sz/2})"/></svg><i>${inner}</i></span>`}
function lineSvg(pts,unit){if(pts.length<2)return `<div class="lbl" style="padding:18px 0;text-align:center">Grafik için en az 2 antrenman gerekli.</div>`;
  const W=320,H=150,pl=8,pr=8,pt=24,pb=22,ys=pts.map(p=>p.y),mn=Math.min(...ys),mx=Math.max(...ys),rg=mx-mn||1;
  const X=i=>pl+i*(W-pl-pr)/(pts.length-1),Y=v=>pt+(H-pt-pb)*(1-(v-mn)/rg);
  const d=pts.map((p,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
  const bi=ys.indexOf(mx);
  return `<svg aria-hidden="true" viewBox="0 0 ${W} ${H}" class="lsvg"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SCC.load}" stop-opacity=".35"/><stop offset="1" stop-color="${SCC.load}" stop-opacity="0"/></linearGradient></defs>
   <path d="${d} L${X(pts.length-1).toFixed(1)},${H-pb} L${X(0).toFixed(1)},${H-pb} Z" fill="url(#lg)"/>
   <path d="${d}" fill="none" stroke="#ff5a3c" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
   ${pts.map((p,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${i===bi?4.5:2.6}" fill="${i===bi?'#ffd166':'#ff5a3c'}"/>`).join('')}
   <text x="${X(bi).toFixed(1)}" y="${(Y(mx)-7).toFixed(1)}" text-anchor="${bi===0?'start':bi===pts.length-1?'end':'middle'}" fill="#ffd166" font-size="11" font-weight="700">${fmt(r1(mx))} ${unit}</text>
   <text x="${pl}" y="${H-5}" fill="#9b9ba4" font-size="10">${new Date(pts[0].d).toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</text>
   <text x="${W-pr}" y="${H-5}" fill="#9b9ba4" font-size="10" text-anchor="end">${new Date(pts[pts.length-1].d).toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</text></svg>`}
function wkPanel(){const t=new Date(),dow=(t.getDay()+6)%7,mon=new Date(t);mon.setDate(t.getDate()-dow);mon.setHours(0,0,0,0);
  const days=Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return dkey(d)}),ss=S.sessions.filter(s=>days.includes(dkey(new Date(s.date)))),cc=(S.cardio||[]).filter(c=>days.includes(c.date));
  const goal=S.settings.wkGoal||3,done=ss.length,min=Math.round(ss.reduce((a,s)=>a+(s.dur||0),0)/60+cc.reduce((a,c)=>a+(c.min||0),0)),sets=ss.reduce((a,s)=>a+s.sets.length,0),vol=ss.reduce((a,s)=>a+volOf(s),0);
  const colOf=s=>{const g={};s.sets.forEach(x=>{const k=mgOf(x.muscle);if(k)g[k]=(g[k]||0)+1});const k=Object.keys(g).sort((a,b)=>g[b]-g[a])[0];return k?MGI[k][2]:'#ff5a3c'};
  const msg=done>=goal?TT('Haftalık hedef tamam 🔥','Weekly goal done 🔥'):done?TT(`Hedefe ${goal-done} antrenman kaldı`,`${goal-done} to go`):TT('Bu hafta henüz antrenman yok','No workouts yet this week');
  return `<div class="wkp"><div class="wkp-h"><div class="wkp-n"><small>${TT('BU HAFTA','THIS WEEK')}</small><b>${done}<span>/${goal}</span></b><em>${msg}</em></div>
    <div class="wkp-s"><div><b>${min}</b><small>dk</small></div><div><b>${sets}</b><small>set</small></div><div><b>${tons(vol)}</b><small>ton</small></div></div></div>
   <button class="wkp-g" onclick="A.wkGoal()" aria-label="${TT('Haftalık hedefi değiştir','Change weekly goal')}">${Array.from({length:goal},(_,i)=>`<i class="${i<done?'on':''}"></i>`).join('')}</button>
   <div class="wkp-d">${days.map((k,i)=>{const dd=new Date(k+'T12:00'),sx=ss.filter(s=>dkey(new Date(s.date))===k),cx=cc.filter(c=>c.date===k);
     return `<div class="wkd${k===dkey()?' today':''}${k>dkey()?' fut':''}"><small>${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][i]}</small><b>${dd.getDate()}</b><div class="wkd-c">${sx.map(s=>`<i style="--c:${colOf(s)}" title="${esc(s.planName||'')}"></i>`).join('')}${cx.map(()=>`<i class="cd"></i>`).join('')}</div></div>`}).join('')}</div>
   <div class="wkp-l">${MG.map(g=>`<span><i style="background:${g[2]}"></i>${g[1]}</span>`).join('')}</div></div>`}
function weekStrip(){const t=new Date(),dow=(t.getDay()+6)%7,mon=new Date(t);mon.setDate(t.getDate()-dow);
  const done=new Set(S.sessions.map(s=>dkey(new Date(s.date))));
  return `<div class="wstrip">${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map((n,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);const k=dkey(d);
    return `<div class="wd ${k===dkey()?'today':''} ${done.has(k)?'on':''}"><small>${n}</small><b>${d.getDate()}</b><i></i></div>`}).join('')}</div>`}
function tplLine(p,n,i){const gs=planGroups(p),last=lastOfPlan(p),c1=gs[0]?MGI[gs[0]][2]:'#ff5a3c',c2=gs[1]?MGI[gs[1]][2]:c1,isN=n&&n.id===p.id;
  return `<div class="tpx-r${isN?' tnx':''}" style="--c1:${c1};--c2:${c2}"><button class="tpx-m" onclick="A.openPlan('${p.id}')"><span class="tpx-n">${z(i+1)}</span><span class="tpx-b"><b>${esc(p.name)}${isN?'<em>SIRADAKİ</em>':''}</b><span class="tpx-g">${gs.map(g=>`<i style="--g:${MGI[g][2]}">${MGI[g][1]}</i>`).join('')}</span><small>${p.exercises.length} egzersiz · ${planSets(p)} set · ~${planMin(p)} dk${last?' · '+ago(last.date):''}</small></span></button><button class="tpx-p" onclick="A.start('${p.id}')" aria-label="Başlat"><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg></button></div>`}
function tplCard(p,n){const gs=planGroups(p),last=lastOfPlan(p),c1=gs[0]?MGI[gs[0]][2]:'#ff5a3c',c2=gs[1]?MGI[gs[1]][2]:c1;
  return `<button class="tcard" style="--c1:${c1};--c2:${c2}" onclick="A.openPlan('${p.id}')">${n&&n.id===p.id?'<span class="tn">Sıradaki</span>':''}<div><div class="tt">${esc(p.name)}</div><div class="tg">${gs.map(g=>`<span>${MGI[g][1]}</span>`).join('')}</div></div><div><small>${p.exercises.length} egzersiz · ${planSets(p)} set · ~${planMin(p)} dk</small><br><small style="opacity:.65">${last?'son: '+ago(last.date):'henüz yapılmadı'}</small></div></button>`}
function tplRow(p,n){const gs=planGroups(p),last=lastOfPlan(p),c1=gs[0]?MGI[gs[0]][2]:'#ff5a3c',c2=gs[1]?MGI[gs[1]][2]:c1;
  return `<button class="tpl" onclick="A.openPlan('${p.id}')"><span class="tpl-ic" style="background:linear-gradient(135deg,${c1},${c2})">${esc(ini(p.name))}</span>
    <span class="tpl-b"><b>${esc(p.name)}${n&&n.id===p.id?' <span class="tag">Sıradaki</span>':''}</b><small>${p.exercises.length} egzersiz · ~${planMin(p)} dk${last?' · '+ago(last.date):''}</small>
    <span class="tpl-g">${gs.map(g=>`<i style="background:${MGI[g][2]}" title="${MGI[g][1]}"></i>`).join('')}</span></span><span class="chev">›</span></button>`}
function sessRow(s){const d=new Date(s.date),by=setsBy([s]),tot=s.sets.length||1,ld=loadOf(s.sets,s.date),L=loadLbl(ld);
  return `<button class="sr" onclick="A.sess('${esc(s.id)}')"><span class="sr-d"><b>${d.getDate()}</b><small>${d.toLocaleDateString(LOC(),{month:'short'})}</small></span>
   <span class="sr-b"><b>${esc(s.planName)}</b><small>${Math.round((s.dur||0)/60)} dk · ${tons(volOf(s))} ton · ${s.sets.length} set${s.prs&&s.prs.length?' · '+s.prs.length+' rekor':''}</small>
    <span class="sr-bar">${MG.filter(g=>by[g[0]]).map(g=>`<i style="flex:${by[g[0]]};background:${g[2]}"></i>`).join('')}</span></span>
   <span class="sr-l">${ring(ld/100,L[1],38,4,ld)}</span></button>`}

/* ---------- 3D kas haritası: nokta bulutu vücut (Canvas 2D, kütüphanesiz) ----------
 parçalar: [anahtar, cx,cy,cz, rx,ry,rz, yüz(f/b/0), yoğunluk, eğim] · cx>0 olanlar sola aynalanır */
const B3P=[['head',0,1.665,0,.082,.103,.093,0,.5],['neck',0,1.54,-.005,.05,.06,.05,0,.6],
 ['back',.08,1.483,-.022,.1,.05,.062,0,1.1,.12],['shoulders',.2,1.402,0,.063,.096,.071,0,1.3,-.22],
 ['chest',.085,1.335,.069,.096,.075,.045,'f',1.4,-.08],['abs',0,1.12,.081,.077,.165,.038,'f',1.45],
 ['core',.118,1.11,.033,.046,.12,.066,0,.9],['back',.117,1.27,-.054,.077,.158,.062,'b',1.3,-.2,.45],
 ['back',.054,1.372,-.084,.056,.076,.035,'b',1.1],['lowback',.037,1.07,-.077,.032,.097,.032,'b',1.15],
 ['torso',0,1.26,0,.148,.215,.105,0,.42,0,.2],['arm',.262,1.24,0,.046,.135,.046,0,.45,.07],
 ['biceps',.266,1.235,.02,.038,.108,.041,'f',1.25,.07],['triceps',.27,1.245,-.028,.043,.12,.042,'b',1.25,.07],
 ['arm',.285,1.105,0,.036,.04,.036,0,.45],['forearms',.298,.985,.008,.038,.13,.037,0,1.1,.05,.3],
 ['hand',.312,.82,.012,.027,.06,.018,0,.5],['glutes',.076,.93,-.064,.087,.09,.068,'b',1.35],
 ['hip',0,.95,0,.148,.08,.096,0,.4],['thigh',.095,.72,0,.08,.235,.074,0,.4,.03,.3],['quads',.096,.73,.03,.075,.2,.068,'f',1.4,.03,.32],
 ['quads',.046,.74,.004,.038,.15,.05,0,.6,.1],['hamstrings',.096,.72,-.035,.069,.19,.058,'b',1.3,.03,.25],
 ['knee',.1,.5,.012,.047,.052,.05,0,.5],['calves',.1,.35,-.03,.05,.12,.05,'b',1.25,0,.25],
 ['shin',.1,.3,.02,.04,.17,.038,0,.42,0,.3],['foot',.1,.045,.045,.04,.03,.095,0,.45]];
const B3K=['chest','back','shoulders','biceps','triceps','forearms','core','lowback','glutes','quads','hamstrings','calves'];
const B3MAIN=['chest','back','shoulders','biceps','triceps','core','quads','hamstrings','glutes','calves'];
let B3G=null;const B3D={};
function b3Cloud(only,N){let sd=only?only.length*97+13:7;const rnd=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const area=(a,b,c)=>4*Math.PI*Math.pow((Math.pow(a*b,1.6)+Math.pow(a*c,1.6)+Math.pow(b*c,1.6))/3,1/1.6),kOf=k=>k==='abs'?'core':k;
  const parts=[];B3P.forEach(p=>{if(only&&kOf(p[0])!==only)return;parts.push({p,s:1});if(p[1]>0)parts.push({p,s:-1})});
  const tot=parts.reduce((a,{p})=>a+area(p[4],p[5],p[6])*p[8]*(p[7]?.55:1),0)||1,X=[],Y=[],Z=[],M=[],Rr=[];
  parts.forEach(({p,s})=>{const[k,cx,cy,cz,rx,ry,rz,face,dn,rot=0,tp=0]=p;let n=Math.round(N*area(rx,ry,rz)*dn*(face?.55:1)/tot),tries=0;
    const mi=B3K.indexOf(kOf(k)),ca=Math.cos(rot*s),sa=Math.sin(rot*s);
    while(n>0&&tries++<n*8){const u=rnd()*2-1,th=rnd()*Math.PI*2,r=Math.sqrt(1-u*u),nx=r*Math.cos(th),ny=u,nz=r*Math.sin(th);
      if(face==='f'&&nz<-.15||face==='b'&&nz>.15)continue;const f=1+tp*ny;
      const ox=rx*nx*f,oy=ry*ny;const x=cx*s+ox*ca-oy*sa,y=cy+ox*sa+oy*ca,z=cz+rz*nz*f;
      if(k==='abs'&&(Math.abs(x)<.007||[1.205,1.135,1.065].some(b=>Math.abs(y-b)<.006)))continue;
      if(k==='chest'&&y>cy+.045&&Math.abs(x)<.03)continue;
      X.push(x);Y.push(y);Z.push(z);M.push(mi<0?(k==='head'?254:255):mi);Rr.push(.55+rnd()*.45);n--}});
  return{x:Float32Array.from(X),y:Float32Array.from(Y),z:Float32Array.from(Z),m:Uint8Array.from(M),r:Float32Array.from(Rr),n:X.length}}
function b3Geo(){return B3G||(B3G=b3Cloud(null,11000))}
function b3Dense(k){return B3D[k]||(B3D[k]=b3Cloud(k,4200))}
const B3H=new WeakMap();
let B3LIVE=null;
function b3dScan(){document.querySelectorAll('canvas.b3c').forEach(cv=>{const h=B3H.get(cv);if(h){if(h.sync){B3LIVE=cv;h.sync()}return}
  /* yeniden çizimde tuval değiştiyse eskisini (WebGL bağlamı ve durumuyla) geri tak: geçiş kesilmez */
  if(B3LIVE&&B3LIVE!==cv&&!document.body.contains(B3LIVE)&&B3H.get(B3LIVE)&&B3H.get(B3LIVE).sync){const old=B3LIVE,gl=old.dataset.gl;cv.replaceWith(old);if(gl)old.parentNode.classList.add('gl');B3H.get(old).sync();return}
  const ph={pending:1};B3H.set(cv,ph);let okGL=false;try{okGL=!!window.WebGLRenderingContext&&S.settings.b3gl!==false}catch(e){}
  const two=c=>{B3H.set(c,b3dMount(c));B3LIVE=c};
  if(!okGL){two(cv);return}
  b3Load().then(D=>{if(!document.body.contains(cv))return;let hh=null;try{hh=b3dMountGL(cv,D)}catch(e){RF&&RF.err&&RF.err('b3gl: '+e.message)}
    if(hh){B3H.set(cv,hh);B3LIVE=cv;cv.dataset.gl=1;cv.parentNode&&cv.parentNode.classList.add('gl')}else{const c=cv.cloneNode();cv.replaceWith(c);two(c)}}).catch(()=>{if(document.body.contains(cv))two(cv)})})}
/* ---------- 3D kas haritası (WebGL): BodyParts3D / Z-Anatomy kas modelinden örneklenmiş nokta bulutu (CC BY-SA) ---------- */
let B3DATA=null;
function b3Load(){return B3DATA||(B3DATA=fetch('./b3d.bin?v=1').then(r=>{if(!r.ok)throw new Error('b3d '+r.status);return r.arrayBuffer()}).then(buf=>{
  const dv=new DataView(buf);if(dv.getUint32(0,true)!==0x33424d48)throw new Error('b3d bad');const n=dv.getUint32(4,true);
  const qi=new Int16Array(buf,8,n*3),pk=new Uint8Array(buf,8+n*6,n),pos=new Float32Array(n*3),g=new Float32Array(n),r=new Float32Array(n),gi=new Uint8Array(n);
  for(let i=0;i<n*3;i++)pos[i]=qi[i]/1e4;for(let i=0;i<n;i++){const k=pk[i]>>4;gi[i]=k>=12?255:k;g[i]=k;r[i]=(pk[i]&15)/15}
  const bb={};for(let i=0;i<n;i++){const k=gi[i];if(k===255)continue;const b=bb[k]||(bb[k]=[9,-9,9,-9,9,-9]),x=pos[i*3],y=pos[i*3+1],z=pos[i*3+2];
    if(x<b[0])b[0]=x;if(x>b[1])b[1]=x;if(y<b[2])b[2]=y;if(y>b[3])b[3]=y;if(z<b[4])b[4]=z;if(z>b[5])b[5]=z}
  return{n,pos,g,r,gi,bb}}).catch(e=>{B3DATA=null;throw e}))}
const B3VS=`attribute vec3 a_p;attribute float a_g;attribute float a_r;uniform mat3 u_rot;uniform vec3 u_c;uniform float u_s;uniform vec2 u_asp;uniform float u_sel;uniform float u_fade;uniform float u_lv[12];uniform float u_ps;varying vec4 v_c;
void main(){vec3 q=u_rot*(a_p-u_c);float pz=1.0/(1.0-q.z*0.32*u_s/(1.0+u_s*0.35));gl_Position=vec4(q.x*u_s*pz*u_asp.x,q.y*u_s*pz*u_asp.y,0.0,1.0);
 float dep=clamp(0.55+q.z*3.2/max(1.0,u_s*0.5),0.15,1.0);vec3 col=vec3(.6,.6,.68);float al=.34;float sz=1.0;
 if(a_g<11.5){float v=0.0;for(int i=0;i<12;i++){if(abs(float(i)-a_g)<0.5)v=u_lv[i];}
  if(v>1.5){float f=v-2.0;if(f<0.01){col=vec3(.66,.66,.76);al=.42;}else{col=f>0.5?mix(vec3(1.0,.7,.25),vec3(1.0,.3,.3),(f-.5)*2.0):mix(vec3(.7,.68,.8),vec3(1.0,.7,.25),f*2.0);al=.6+.4*f;}}
  else if(v<-0.5){col=vec3(1.0,.55,.26);al=.78;}else if(v<0.01){col=vec3(.66,.66,.74);al=.42;}else{col=mix(vec3(.78,.75,.95),vec3(.94,.92,1.0),v);al=.7+.3*v;}}
 else{al=.3;}
 if(u_sel>-0.5){if(abs(a_g-u_sel)<0.5){col=mix(col,vec3(.9,.87,1.0),u_fade);al=mix(al,1.0,u_fade);sz=1.0+.35*u_fade;}else{col=mix(col,vec3(.6,.6,.68),u_fade);al*=mix(1.0,.42,u_fade);}}
 gl_PointSize=u_ps*sz*(0.75+0.45*dep);v_c=vec4(col,al*dep*(0.35+0.65*a_r)*0.85);}`;
const B3FS=`precision mediump float;varying vec4 v_c;void main(){vec2 d=gl_PointCoord-0.5;float r=length(d);if(r>0.5)discard;float a=v_c.a*smoothstep(0.5,0.12,r);gl_FragColor=vec4(v_c.rgb*a,a);}`;
function b3dMountGL(cv,D){const st=ui.b3||(ui.b3={yaw:.35,per:7,sel:null}),dpr=Math.min(2,devicePixelRatio||1);
  const gl=cv.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,preserveDrawingBuffer:false});if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,B3VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,B3FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error('link');gl.useProgram(pr);
  const buf=(arr,name,sz)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,arr,gl.STATIC_DRAW);const l=gl.getAttribLocation(pr,name);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,sz,gl.FLOAT,false,0,0)};
  buf(D.pos,'a_p',3);buf(D.g,'a_g',1);buf(D.r,'a_r',1);
  const U={};['u_rot','u_c','u_s','u_asp','u_sel','u_fade','u_lv','u_ps'].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
  gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
  const CY=.84,HT=1.7;let swc=0,ph=0,sway=false,W=0,H=0,yaw=st.yaw,yawT=null,vel=0,lv=new Float32Array(12),sel=null,fade=0,raf=0,vis=true,drag=null,cam={x:0,y:CY,z:0,s:1},camT={x:0,y:CY,z:0,s:1};
  const calm=()=>document.documentElement.classList.contains('lowpow')||matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;const w=Math.max(1,Math.round(W*dpr)),hh=Math.max(1,Math.round(H*dpr));if(cv.width!==w||cv.height!==hh){cv.width=w;cv.height=hh;gl.viewport(0,0,w,hh)}kick()}
  function sync(){const d=cv.parentNode&&cv.parentNode.querySelector('.b3-data');if(!d)return;let o={};try{o=JSON.parse(d.dataset.lv||'{}')}catch(e){}B3K.forEach((k,i)=>lv[i]=o[k]||0);
    const ns=d.dataset.sel||null;if(ns!==sel){sel=ns;fit();sway=false;ph=0;if(sel)swc=['back','triceps','glutes','hamstrings','calves','lowback'].includes(sel)?Math.PI:0;anim(sel?swc:null)}
    if(st.yawT!=null){const y=st.yawT;st.yawT=null;anim(y)}kick()}
  function fit(){const b=sel&&D.bb[B3K.indexOf(sel)];if(!b){camT={x:0,y:CY,z:0,s:1};return}
    const w=Math.max(b[1]-b[0],.14),h=Math.max(b[3]-b[2],.14);camT={x:(b[0]+b[1])/2,y:(b[2]+b[3])/2,z:(b[4]+b[5])/2,s:Math.max(1.4,Math.min(HT*.58/h,HT*.5/w*(H/Math.max(1,W)),4.2))}}
  function mat(){const cy=Math.cos(yaw),sy=Math.sin(yaw),p=.08,cp=Math.cos(p),sp=Math.sin(p);
    // R = Rx(p) * Ry(yaw); satırlar: [cy,0,sy],[sy*sp,cp,-cy*sp],[-sy*cp,sp,cy*cp]
    const r=[[cy,0,sy],[sy*sp,cp,-cy*sp],[-sy*cp,sp,cy*cp]];return{r,f:new Float32Array([r[0][0],r[1][0],r[2][0],r[0][1],r[1][1],r[2][1],r[0][2],r[1][2],r[2][2]])}}
  function draw(){if(!W||!H)return;const M=mat(),sc=2/HT*.86;gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix3fv(U.u_rot,false,M.f);gl.uniform3f(U.u_c,cam.x,cam.y,cam.z);gl.uniform1f(U.u_s,cam.s);gl.uniform2f(U.u_asp,sc*H/W,sc);
    gl.uniform1f(U.u_sel,sel?B3K.indexOf(sel):-1);gl.uniform1f(U.u_fade,fade);gl.uniform1fv(U.u_lv,lv);gl.uniform1f(U.u_ps,dpr*(1.25+Math.min(1.5,(cam.s-1)*.5)));
    gl.drawArrays(gl.POINTS,0,D.n)}
  let tr=null;const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  function anim(yTo){const dur=calm()?1:950;let y1=yaw;if(yTo!=null){let d=((yTo-yaw)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;y1=yaw+d}
    tr={t0:performance.now(),dur,c0:{...cam},c1:{...camT},f0:fade,f1:sel?1:0,y0:yaw,y1};yawT=null;vel=0;kick()}
  function step(){raf=0;let busy=false;const lerp=(a,b,t)=>a+(b-a)*t;
    if(tr){const k=Math.min(1,(performance.now()-tr.t0)/tr.dur),e=ease(k);['x','y','z','s'].forEach(q=>cam[q]=lerp(tr.c0[q],tr.c1[q],e));fade=lerp(tr.f0,tr.f1,e);yaw=lerp(tr.y0,tr.y1,e);
      if(k>=1){tr=null;if(sel){sway=true;ph=0;swc=yaw}}busy=true;st.yaw=yaw;draw();if(vis)kick();return}
    if(yawT!=null){let d=((yawT-yaw)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(d)<.004){yaw=yawT;yawT=null;if(sel&&ph===0)sway=true}else{yaw+=d*.16;busy=true}}
    else if(!drag&&Math.abs(vel)>.0005){yaw+=vel;vel*=.93;busy=true}
    else if(sel&&sway&&!drag&&!calm()){ph+=.008;yaw=swc+.35*Math.sin(ph);busy=true}
    ['x','y','z','s'].forEach(k=>{if(Math.abs(cam[k]-camT[k])>.0008){cam[k]=lerp(cam[k],camT[k],.13);busy=true}else cam[k]=camT[k]});
    const ft=sel?1:0;if(Math.abs(fade-ft)>.01){fade=lerp(fade,ft,.13);busy=true}else fade=ft;
    st.yaw=yaw;draw();if(busy&&vis)kick()}
  function kick(){if(!raf)raf=requestAnimationFrame(step)}
  function pick(cx,cyp){const rc=cv.getBoundingClientRect(),X=cx-rc.left,Y=cyp-rc.top,M=mat().r,sc=2/HT*.86,ax=sc*H/W,ay=sc;let best=-1,bd=20*20,bz=-9;
    for(let i=0;i<D.n;i++){const k=D.gi[i];if(k===255)continue;const x=D.pos[i*3]-cam.x,y=D.pos[i*3+1]-cam.y,z=D.pos[i*3+2]-cam.z;
      const qx=M[0][0]*x+M[0][1]*y+M[0][2]*z,qy=M[1][0]*x+M[1][1]*y+M[1][2]*z,qz=M[2][0]*x+M[2][1]*y+M[2][2]*z,pz=1/(1-qz*.32*cam.s/(1+cam.s*.35));
      const sx=(qx*cam.s*pz*ax*.5+.5)*W,sy=(.5-qy*cam.s*pz*ay*.5)*H,dx=sx-X,dy=sy-Y,d=dx*dx+dy*dy;if(d<bd&&qz>bz-.04){bd=d;bz=Math.max(bz,qz);best=k}}
    return best<0?null:B3K[best]}
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{sway=false;tr=null;drag={x:e.clientX,y:e.clientY,lx:e.clientX,mv:0};vel=0;yawT=null});
  cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.lx;drag.mv+=Math.abs(dx)+Math.abs(e.clientY-drag.y)*.2;
    if(Math.abs(e.clientX-drag.x)>6&&!drag.cap){try{cv.setPointerCapture(e.pointerId)}catch(_){}drag.cap=1}
    if(drag.cap){yaw+=dx*.011;vel=dx*.011;drag.lx=e.clientX;kick()}});
  const up=e=>{if(!drag)return;const d=drag;drag=null;if(d.mv<7&&e.type==='pointerup'){const k=pick(e.clientX,e.clientY);try{tap()}catch(_){}if(k&&k!==sel)A.b3Sel(k);else if(sel)A.b3Sel(null)}kick()};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('webglcontextlost',e=>{e.preventDefault();B3H.delete(cv)});
  const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)kick()},{threshold:.02});io.observe(cv);
  const ro=new ResizeObserver(size);ro.observe(cv);size();sync();cam={...camT};fade=sel?1:0;draw();
  return{sync}}

function b3dMount(cv){const G=b3Geo(),st=ui.b3||(ui.b3={yaw:.35,per:7,sel:null}),dpr=Math.min(2,devicePixelRatio||1),ctx=cv.getContext('2d');
  let swc=0,ph=0,sway=false,W=0,H=0,yaw=st.yaw,yawT=null,vel=0,lv={},sel=null,fade=0,raf=0,vis=true,drag=null,cam={x:0,y:.87,s:1},camT={x:0,y:.87,s:1};
  const calm=()=>document.documentElement.classList.contains('lowpow')||matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);kick()}
  function sync(){const d=cv.parentNode&&cv.parentNode.querySelector('.b3-data');if(!d)return;try{lv=JSON.parse(d.dataset.lv||'{}')}catch(e){lv={}}
    const ns=d.dataset.sel||null;if(ns!==sel){sel=ns;fit();if(sel){swc=['back','triceps','glutes','hamstrings','calves','lowback'].includes(sel)?Math.PI:0;yawT=swc;ph=0;sway=false}}if(st.yawT!=null){yawT=st.yawT;st.yawT=null}kick()}
  function fit(){if(!sel){camT={x:0,y:.87,s:1};return}const mi=B3K.indexOf(sel);let x0=9,x1=-9,y0=9,y1=-9;
    for(let i=0;i<G.n;i++)if(G.m[i]===mi){const r=Math.hypot(G.x[i],G.z[i]);if(G.x[i]-0<x0)x0=G.x[i];if(G.x[i]>x1)x1=G.x[i];if(G.y[i]<y0)y0=G.y[i];if(G.y[i]>y1)y1=G.y[i]}
    if(x0>x1){camT={x:0,y:.87,s:1};return}const w=Math.max(x1-x0,.12),h=Math.max(y1-y0,.12);camT={x:(x0+x1)/2,y:(y0+y1)/2,s:Math.min(1.8*.62/w,1.8*.62/h,7)}}
  function col(m){if(m===255)return[176,176,196,.5];if(m===254)return[130,130,150,.42];const v=lv[B3K[m]];
    if(v>=1.5){const f=v-2;if(f<.01)return[160,160,182,.42];return f>.5?[255,77+Math.round((1-f)*2*102),77,.95]:[200+Math.round(f*110),190,170-Math.round(f*100),.7+.3*f]}if(v===-1)return[255,138,61,.95];if(!v)return[160,160,182,.42];const t=Math.min(1,v);return[200+30*t|0,192+40*t|0,242+13*t|0,.7+.3*t]}
  function draw(){const g=ctx;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);if(!W||!H)return;
    const base=H*.86/1.8,sc=base*cam.s,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(.1),sp=Math.sin(.1),mi=sel?B3K.indexOf(sel):-1;
    const B=new Map(),dot=(sel?1.6:1.15)*(cam.s>2?1.15:1);
    const D=sel?b3Dense(sel):null;
    const run=(Q,dense)=>{for(let i=0;i<Q.n;i++){const m=Q.m[i];let a=1;if(sel){if(dense)a=fade;else if(m===mi)a=1-fade;else a=1-fade;if(a<.03)continue}
      const x=Q.x[i]-cam.x,y=Q.y[i]-cam.y,z=Q.z[i];const xr=x*cy+z*sy,zr=-x*sy+z*cy,yr=y*cp-zr*sp,zz=y*sp+zr*cp;
      const k=1+zz*.22*cam.s/Math.max(1,cam.s*.6),px=W/2+xr*sc*k,py=H/2-yr*sc*k;if(px<-4||px>W+4||py<-4||py>H+4)continue;
      const c=dense?[226,220,255,.95]:col(m),dep=Math.max(.35,Math.min(1,.62+zz*2.2/Math.max(1,cam.s*.5)));const al=c[3]*dep*a*Q.r[i],key=c[0]+','+c[1]+','+c[2]+','+(Math.round(al*10)/10);
      let L=B.get(key);if(!L)B.set(key,L=[]);L.push(px,py)}};
    run(G,false);if(D)run(D,true);
    B.forEach((L,key)=>{const q=key.split(',');g.fillStyle=`rgba(${q[0]},${q[1]},${q[2]},${q[3]})`;for(let j=0;j<L.length;j+=2)g.fillRect(L[j]-dot/2,L[j+1]-dot/2,dot,dot)})}
  function step(){raf=0;let busy=false;const lerp=(a,b,t)=>a+(b-a)*t;
    if(yawT!=null){let d=((yawT-yaw)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(d)<.004){yaw=yawT;yawT=null;if(sel&&ph===0)sway=true}else{yaw+=d*.16;busy=true}}
    else if(!drag&&Math.abs(vel)>.0005){yaw+=vel;vel*=.93;busy=true}
    else if(sel&&sway&&!drag&&!calm()){ph+=.012;yaw=swc+.45*Math.sin(ph);busy=true}
    ['x','y','s'].forEach(k=>{if(Math.abs(cam[k]-camT[k])>.0008){cam[k]=lerp(cam[k],camT[k],.14);busy=true}else cam[k]=camT[k]});
    const ft=sel?1:0;if(Math.abs(fade-ft)>.01){fade=lerp(fade,ft,.14);busy=true}else fade=ft;
    st.yaw=yaw;draw();if(busy&&vis)kick()}
  function kick(){if(!raf)raf=requestAnimationFrame(step)}
  function pick(cx,cyp){const r=cv.getBoundingClientRect(),X=cx-r.left,Y=cyp-r.top,base=H*.86/1.8,sc=base*cam.s,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(.1),sp=Math.sin(.1);
    let best=null,bd=18*18,bz=-9;for(let i=0;i<G.n;i++){const m=G.m[i];if(m>=B3K.length)continue;const x=G.x[i]-cam.x,y=G.y[i]-cam.y,z=G.z[i],xr=x*cy+z*sy,zr=-x*sy+z*cy,yr=y*cp-zr*sp,zz=y*sp+zr*cp,k=1+zz*.22*cam.s/Math.max(1,cam.s*.6);
      const dx=W/2+xr*sc*k-X,dy=H/2-yr*sc*k-Y,d=dx*dx+dy*dy;if(d<bd&&(d<bd*.5||zz>bz)){bd=d;bz=zz;best=m}}
    return best==null?null:B3K[best]}
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{sway=false;drag={x:e.clientX,y:e.clientY,lx:e.clientX,t:performance.now(),mv:0};vel=0;yawT=null});
  cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.lx;drag.mv+=Math.abs(dx)+Math.abs(e.clientY-drag.y)*.2;
    if(Math.abs(e.clientX-drag.x)>6&&!drag.cap){try{cv.setPointerCapture(e.pointerId)}catch(_){}drag.cap=1}
    if(drag.cap){yaw+=dx*.011;vel=dx*.011;drag.lx=e.clientX;kick()}});
  const up=e=>{if(!drag)return;const d=drag;drag=null;if(d.mv<7&&e.type==='pointerup'){const k=pick(e.clientX,e.clientY);try{tap()}catch(_){}if(k&&k!==sel)A.b3Sel(k);else if(sel)A.b3Sel(null)}kick()};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)kick()},{threshold:.02});io.observe(cv);
  const ro=new ResizeObserver(size);ro.observe(cv);size();sync();cam={...camT};fade=sel?1:0;draw();
  return{sync}}
/* dönem içi set sayıları: ana kas başına; seçili kas için hareket bazında */
/* toparlanma: büyük kaslar 72 sa, küçükler 48 sa; f=kalan yorgunluk (1 → yeni çalışıldı, 0 → hazır) */
function b3Rec(){const now=Date.now(),R={},big=['chest','back','quads','hamstrings','glutes','lowback'];
  S.sessions.filter(s=>sAge(s)<72*36e5).forEach(s=>{const t=+new Date(s.date||0),cnt={};
    s.sets.forEach(x=>{if(!x.muscle||x.muscle==='other')return;const ml=exMus(x.ex,x.muscle);Object.keys(ml).forEach(k=>{cnt[k]=(cnt[k]||0)+(ml[k]>=1?1:.5)})});
    Object.keys(cnt).forEach(k=>{if(!B3K.includes(k)||cnt[k]<2)return;const RH=big.includes(k)?72:48,hs=Math.max(0,(now-t)/36e5),f=Math.max(0,Math.min(1,1-hs/RH))*Math.min(1,.55+cnt[k]/12);
      if(!R[k]||f>R[k].f)R[k]={f:Math.round(f*100)/100,left:Math.max(0,Math.ceil(RH*(f/Math.min(1,.55+cnt[k]/12))-0))}})});
  Object.keys(R).forEach(k=>{if(R[k].f<=0.02){R[k].f=0;R[k].left=0}});return R}
const b3RcCol=f=>f<=0?'#9b95c9':f>.5?'#ff4d4d':'#ffb340';
function b3Card(){const st=ui.b3||(ui.b3={yaw:.35,per:7,sel:null}),per=st.per||7,ms=per*864e5,cur=S.sessions.filter(s=>sAge(s)<ms),sel=st.sel;
  const by={};cur.forEach(s=>s.sets.forEach(x=>{if(x.muscle&&x.muscle!=='other')by[x.muscle]=(by[x.muscle]||0)+1}));
  const bl=bodyLoad(cur,per===7?10:per===30?36:300),lv={},rm=st.mode==='rec',RC=b3Rec();B3K.forEach(k=>{const v=bl.lv[k]||0;lv[k]=rm?2+(RC[k]?RC[k].f:0):v>0?Math.round(v*100)/100:(cur.length>=3&&B3MAIN.includes(k)?-1:0)});
  let rows;if(rm&&!sel)rows=B3MAIN.filter(k=>RC[k]).sort((a,b)=>RC[b].f-RC[a].f).map(k=>[k,RC[k]]);else if(sel){const ex={};cur.forEach(s=>s.sets.forEach(x=>{if(x.muscle===sel||(sel==='lowback'&&exMus(x.ex,x.muscle).lowback>=1)||(sel==='forearms'&&exMus(x.ex,x.muscle).forearms))ex[x.ex]=(ex[x.ex]||0)+1}));
    rows=Object.entries(ex).sort((a,b)=>b[1]-a[1]).slice(0,8)}else rows=B3MAIN.map(k=>[k,by[k]||0]).sort((a,b)=>b[1]-a[1]);
  const tg=per===7?10:per===30?40:480,mx=sel?Math.max(1,...rows.map(r=>r[1])):tg,pl={7:TT('Bu hafta','This week'),30:TT('Son 30 gün','Last 30 days'),365:TT('Son 1 yıl','Last year')}[per];
  const lag=sel?[]:B3MAIN.filter(k=>lv[k]===-1);
  return `<div class="b3card">
   <div class="b3-top"><div><div class="b3-k">${sel?esc(MUSC2[sel]||sel):TT('Kas haritası','Muscle map')}</div><small>${pl} · ${sel?TT('tüm vücut için dokun','tap for full body'):TT('çevirmek için kaydır, kasa dokun','drag to turn, tap a muscle')}</small></div>
    <div class="b3-seg">${[[7,TT('H','W')],[30,TT('A','M')],[365,TT('Y','Y')]].map(([v,l])=>`<button class="${per===v?'on':''}" onclick="A.b3Per(${v})" aria-label="${v} ${TT('gün','days')}">${l}</button>`).join('')}</div></div>
   <div class="b3-stage"><canvas class="b3c" aria-label="${TT('3D kas haritası','3D muscle map')}"></canvas><i class="b3-data" data-lv='${JSON.stringify(lv)}' data-sel="${sel||''}" hidden></i>
    ${sel?`<button class="b3-x" onclick="A.b3Sel(null)" aria-label="${TT('Tüm vücuda dön','Back to full body')}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg></button>`
     :`<div class="b3-fb"><button class="${(st.face||0)===0?'on':''}" onclick="A.b3Face(0)">${TT('Ön','Front')}</button><button class="${st.face===1?'on':''}" onclick="A.b3Face(1)">${TT('Arka','Back')}</button></div>`}
    <div class="b3-md"><button class="${rm?'':'on'}" onclick="A.b3Mode('vol')">${TT('Hacim','Volume')}</button><button class="${rm?'on':''}" onclick="A.b3Mode('rec')">${TT('Toparlanma','Recovery')}</button></div>
    ${rm?`<div class="b3-lag b3-rleg"><i style="background:#ff4d4d"></i>${TT('Yorgun','Fatigued')}<i style="background:#ffb340"></i>${TT('Toparlanıyor','Recovering')}</div>`:lag.length?`<div class="b3-lag"><i></i>${TT('Çalışılmayan','Not trained')}</div>`:''}</div>
   ${sel&&RC[sel]?`<div class="b3-rcn"><i style="background:${b3RcCol(RC[sel].f)}"></i>${RC[sel].f>0?TT(`%${Math.round((1-RC[sel].f)*100)} toparlandı · yaklaşık ${RC[sel].left} saat sonra hazır`,`${Math.round((1-RC[sel].f)*100)}% recovered · ready in ~${RC[sel].left} h`):TT('Toparlandı, çalışmaya hazır','Recovered, ready to train')}</div>`:''}
   ${rm&&!sel?`<div class="b3-lh2"><b>${TT('Toparlanma','Recovery')}</b><small>${TT('son 72 saat','last 72 h')}</small></div><div class="b3-list">${rows.length?(st.all?rows:rows.slice(0,3)).map(([k,r])=>`<button class="b3-r" onclick="A.b3Sel('${k}')"><span class="b3-rh"><b><i class="b3-dot" style="background:${b3RcCol(r.f)}"></i>${esc(MUSC2[k]||k)}</b><em>${r.f>0?TT(`~${r.left} sa`,`~${r.left} h`):TT('hazır','ready')}</em></span><span class="b3-bar b3-rcb"><i style="width:${Math.round((1-r.f)*100)}%"></i></span></button>`).join(''):`<div class="b3-e">${TT('Son 72 saatte çalışılan kas yok; hepsi hazır.','No muscles trained in the last 72 h; all ready.')}</div>`}${rows.length>3?`<button class="b3-more" onclick="A.b3All()">${st.all?TT('Daha az göster','Show less'):TT(`Tümünü göster (${rows.length})`,`Show all (${rows.length})`)}</button>`:''}</div>`:`
   <div class="b3-lh2"><b>${sel?TT('Yaptığın hareketler','Your exercises'):TT('Kas grupları','Muscle groups')}</b><small>${sel?TT('set','sets'):TT(`hedef ${tg} set`,`target ${tg} sets`)}</small></div>
   <div class="b3-list">${rows.length?(sel||st.all?rows:rows.slice(0,3)).map(([k,v])=>`<button class="b3-r${!sel&&!v?' b3-z':''}" ${sel?'':`onclick="A.b3Sel('${k}')"`}><span class="b3-rh"><b>${!sel&&!v&&cur.length>=3?'<i class="b3-dot"></i>':''}${esc(sel?k:(MUSC2[k]||k))}</b><em>${sel?v+' set':`${v} / ${tg} set`}</em></span><span class="b3-bar"><i style="width:${v?Math.max(2,Math.min(100,Math.round(v/mx*100))):0}%"></i></span></button>`).join('')
     :`<div class="b3-e">${sel?TT('Bu dönemde bu kas için set yok.','No sets for this muscle in this period.'):TT('Bu dönemde antrenman yok. Antrenman yaptıkça kaslar parlar.','No workouts in this period. Muscles light up as you train.')}</div>`}
    ${!sel&&rows.length>3?`<button class="b3-more" onclick="A.b3All()">${st.all?TT('Daha az göster','Show less'):TT(`Tümünü göster (${rows.length})`,`Show all (${rows.length})`)}<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(${st.all?180:0}deg)"><path d="m6 9 6 6 6-6"/></svg></button>`:''}</div>`}
   ${sel?(()=>{const mm={lowback:'back',forearms:'biceps'}[sel]||sel,L=XDB.filter(x=>x[2]===mm&&(S.settings.loc!=='home'||homeEq().includes(x[3]))).slice(0,6);
     return L.length?`<div class="b3-lib"><div class="b3-lh"><b>${esc(MUSC2[sel]||sel)} ${TT('hareketleri','exercises')}</b><button onclick="A.acMus('${sel}')">${TT('Tümü','All')} ›</button></div>
      ${L.map(x=>`<button class="b3-x2" onclick="A.exd('${encodeURIComponent(x[0])}')"><span class="b3-xi">${bodyMini(x[0],x[2],26)}</span><span><b>${esc(x[0])}</b><small>${esc(x[1])}</small></span><i>›</i></button>`).join('')}</div>`:''})():''}
   <div class="b3-cr">Model: BodyParts3D (DBCLS), Z-Anatomy · CC BY-SA</div></div>`}

function programsV(){
  const n=todaysPlan(),act=S.plans.filter(x=>!x.archived),arc=S.plans.filter(x=>x.archived),per=ui.stR||7,ms=per*864e5;
  const cur=S.sessions.filter(s=>sAge(s)<ms),prev=S.sessions.filter(s=>sAge(s)>=ms&&sAge(s)<2*ms);
  const vol=cur.reduce((a,s)=>a+volOf(s),0),pvol=prev.reduce((a,s)=>a+volOf(s),0),dv=pvol?Math.round((vol-pvol)/pvol*100):null;
  const sets=cur.reduce((a,s)=>a+s.sets.length,0),dur=cur.reduce((a,s)=>a+(s.dur||0),0),by=setsBy(cur),tgt=per===7?16:64;
  const rc=recov(),hist=S.sessions.slice().reverse(),shown=ui.histAll?hist:hist.slice(0,1);
  const ng=n?planGroups(n):[],nl=n?lastOfPlan(n):null,PH=S.settings.pgHide||['vol'],pv=k=>!PH.includes(k);
  return `<div class="st-hero">
   <div class="st-top"><div class="st-title">Antrenman</div></div>
   ${wkPanel()}
   ${tpEntry()}
   </div>
  <div class="st-hero2">
   <div class="loc-sw"><button class="${S.settings.loc!=='home'?'on':''}" onclick="A.setLoc('gym')">Salon</button><button class="${S.settings.loc==='home'?'on':''}" onclick="A.setLoc('home')">Ev</button></div>
   ${S.settings.loc==='home'?`<button class="loc-eq" onclick="A.locEq()"><span>Evdeki ekipman: <b>${homeEq().filter(x=>x!=='bodyweight').map(k=>(EQ.find(q=>q[0]===k)||[0,0,k])[2]).join(', ')||'sadece vücut ağırlığı'}</b></span><i>Düzenle ›</i></button>`:''}
   <div class="secw" data-sec="acad">${pv('acad')?`<button class="qk-go" onclick="A.go('academy')"><span><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2.5Z"/><path d="M8 7h7"/></svg></span><div><b>Egzersiz Akademisi</b><small>${ACX().length} hareket · adım adım anlatım, video, vücut haritası</small></div><i>›</i></button>`:''}</div>
   ${toolRow(['orm','plaka','nabiz'])}
   <button class="qk-go" onclick="A.quick()"><span><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span><div><b>Hızlı antrenman</b><small>Tek hareket ya da birkaç hareket · ör. bugün 100 şınav</small></div><i>›</i></button>
  </div>
  <div class="secw" data-sec="vol">${pv('vol')?`<div class="st-card pgc-vol">
   <div class="row between" style="align-items:flex-start"><div><div class="st-k">Antrenman hacmi</div><div class="st-big">${tons(vol)}<span> ton</span></div>
     <div class="st-d ${dv==null?'':dv>=0?'up':'dn'}">${dv==null?'Karşılaştırma için veri yok':`${dv>=0?'▲':'▼'} %${Math.abs(dv)} · önceki ${per===7?'7 güne':'30 güne'} göre`}</div></div>
    <div class="mseg"><button class="${per===7?'on':''}" onclick="A.stR(7)">7G</button><button class="${per===30?'on':''}" onclick="A.stR(30)">30G</button></div></div>
   ${radar(MG.map(g=>({n:g[1],v:by[g[0]],c:g[2]})),tgt)}
   <div class="st-kpis"><div><b>${cur.length}</b><small>antrenman</small></div><div><b>${sets}</b><small>set</small></div><div><b>${Math.round(dur/60)}</b><small>dakika</small></div></div>
   <div class="lbl" style="margin-top:12px;line-height:1.5">Radar, kas grubu başına set sayısını gösterir. Dış çizgi ≈ ${tgt} set${per===7?'; kas başına haftada 10–20 set yaygın bir hedeftir':''}.</div></div>`:''}</div>
  <div class="secw" data-sec="body">${pv('body')?b3Card():''}</div>
  <div class="secw" data-sec="rec">${pv('rec')&&rc.some(r=>r.p<100)?`<div class="card ed">${edHd(TT('kas toparlanması','muscle recovery'),TT('tahmini hazır olma','estimated readiness'))}<div style="margin-top:6px">${rc.slice().sort((a,b)=>a.p-b.p).map(r=>`<div class="fz-b"><div class="fz-bt"><span>${r.n}</span><b>${TT('%'+r.p,r.p+'%')}${r.p<100?` <em class="ed-em">${r.st}</em>`:''}</b></div><div class="fz-tr"><i class="${r.p<100?'on':''}" style="width:${r.p}%"></i></div></div>`).join('')}</div></div>`:''}</div>
  <div class="secw" data-sec="gen">${pv('gen')?homeEntry():''}</div>
  <div class="secw" data-sec="cardio">${pv('cardio')?cardioCard():''}</div>
  <div class="secw" data-sec="hist">${pv('hist')&&hist.length?`<div class="pad"><div class="gcat">Son antrenmanlar</div></div><div class="card" style="padding:4px 14px">${shown.map(sessRow).join('')}
    ${hist.length>1?`<button class="link" style="margin:8px auto 10px" onclick="A.histToggle()">${ui.histAll?'Daha az göster':`Tümünü göster (${hist.length})`}</button>`:''}</div>`:''}</div>
  <div class="pad" style="margin:22px 0 8px"><button class="hed-b" onclick="A.edSheet('pg')">Sayfayı düzenle${PH.length?` <small>${PH.length} bölüm gizli</small>`:''}</button></div>`;
}

function planV(){
  const p=plan(ui.planId);if(!p){ui.view='programs';return programsV()}
  const gs=planGroups(p),last=lastOfPlan(p),isN=todaysPlan()&&todaysPlan().id===p.id;
  return `<div class="st-hero" style="padding-bottom:18px">
    <div class="st-top"><button class="back" onclick="A.go('${ui.planBack||'programs'}')">${I.back}</button><button class="icon-btn" onclick="A.editPlan('${p.id}')" aria-label="Düzenle">✎</button></div>
    <div class="nx-k" style="margin-top:14px">${p.archived?'Arşivdeki şablon':isN?'Sıradaki şablon':'Şablon'}</div>
    <div class="pv-t">${esc(p.name)}</div><div class="nx-tags">${gTags(gs)}</div>
    <div class="pv-stats"><div><b>${p.exercises.length}</b><small>egzersiz</small></div><div><b>${planSets(p)}</b><small>set</small></div><div><b>~${planMin(p)}</b><small>dakika</small></div><div><b>${last?ago(last.date):'—'}</b><small>son</small></div></div></div>
  <div class="pad row between"><div class="gcat">Egzersizler</div><span class="lbl">Dokun: gelişim & geçmiş</span></div>
  <div class="card" style="padding:4px 14px">${p.exercises.map((e,i)=>{const l=lastLabel(e.name),g=mgOf(e.muscle),c=g?MGI[g][2]:'#9b9ba4';
    return `<button class="pex" onclick="A.exInfo('${ja(e.name)}')"><span class="gx-b">${bodyMini(e.name,e.muscle,30)}<em>${i+1}</em></span>
     <span class="pex-b"><b>${e.t?'⏱ ':''}${esc(e.name)}</b><small>${e.tr?esc(e.tr)+' · ':''}${MUSCLES[e.muscle]||''}${l?' · son: '+l:''}</small>${e.ss||e.wu||(e.last&&e.last!=='n')?`<span class="ptags">${e.ss?`<i class="ssb">🔗 ${e.ss}</i>`:''}${e.wu?`<i style="--c:${STY.w.c}">${e.wu} ısınma</i>`:''}${e.last&&e.last!=='n'?`<i style="--c:${STY[e.last].c}">son set: ${STY[e.last].n.toLocaleLowerCase('tr-TR')}</i>`:''}</span>`:''}</span><span class="pex-r">${e.sets} × ${rr(e)}</span></button>`}).join('')}</div>
  <div class="pad pv-act">${p.archived?`<button class="pill" onclick="A.arch('${p.id}',false);A.openPlan('${p.id}','${ui.planBack||'programs'}')">Rotasyona al</button>`
    :`<button class="pill" onclick="A.arch('${p.id}',true);A.go('programs')">Arşivle</button>`}
    <button class="pill" onclick="A.editPlan('${p.id}')">Düzenle</button></div>
  <div class="bottom-cta"><button class="btn" onclick="A.start('${p.id}')">▶ Antrenmanı başlat</button></div>`;
}

function nextEx(a){const n=a.ex.findIndex((x,j)=>j>a.idx&&x.sets.some(s=>!s.done));return n>=0?n:a.ex.findIndex(x=>x.sets.some(s=>!s.done))}
function workoutV(){
  const a=S.active;if(!a){ui.view='home';return homeV()}
  const e=a.ex[a.idx],sg=e.sugg,lp=lastPerf(e.name);
  const allDone=e.sets.every(s=>s.done),nextSet=e.sets.findIndex(s=>!s.done),ns=e.sets[nextSet];
  const hd=hold&&hold.ai===a.idx&&hold.i!=null?hold:null,tgt=ns?(num(ns.reps)||e.repMin):0;
  const g=mgOf(e.muscle),gc=g?MGI[g][2]:'#9b9ba4';
  const doneSets=a.ex.flatMap(x=>x.sets.filter(s=>s.done).map(s=>({ex:x.name,muscle:x.muscle,kg:num(s.kg)||0,reps:num(s.reps)||0,rpe:num(s.rpe),t:x.t})));
  const ld=loadOf(doneSets),L=loadLbl(ld),totS=a.ex.reduce((s,x)=>s+x.sets.length,0);
  const lastDone=e.sets.reduce((k,s,i)=>s.done?i:k,-1);
  const nxi=nextEx(a),ssg=ssOf(a.ex,a.idx);
  const ctaText=allDone?(nxi>=0?'Sonraki: '+esc(a.ex[nxi].name)+' →':'✓ Antrenmanı bitir'):
     e.t?(hd?'⏹ Durdur ve kaydet':ui.tInf?`⏱ Set ${nextSet+1} başlat · ∞ sınırsız`:`⏱ Set ${nextSet+1} başlat · ${tFmt(tgt)}${tgt>=60?'':' sn'}`):
     (ns.kg!==''&&ns.kg!=null?`Set ${nextSet+1} tamamla · ${fmt(ns.kg)} kg × ${ns.reps||'?'}`:`Set ${nextSet+1} · kilo seç`);
  const prevTxt=i=>{const p=lp&&wix(e,i)>=0&&lp.sets[wix(e,i)];return p?(p.t?p.reps+' sn':(p.kg?fmt(p.kg)+'×':'')+p.reps):'—'};
  if(S.settings.wfocus&&!e.t&&!hd)return wFocusV(a,e,nextSet,allDone,ctaText,prevTxt);
  const up=(s,i)=>{const p=lp&&wix(e,i)>=0&&lp.sets[wix(e,i)];if(!s.done||!p)return '';const a1=e.t||!(num(s.kg)>0)?num(s.reps):e1rm(num(s.kg),num(s.reps)),b1=p.t||!(p.kg>0)?p.reps:e1rm(p.kg,p.reps);return a1>b1+.01?'<i class="upb">▲</i>':''};
  return `<div class="lw">
  <div class="wk-head"><button class="back" onclick="A.prevEx()">${I.back}</button>
    <div class="lw-c"><small>${esc(a.planName)}</small><span class="wkt" id="wkt">${mmss(Date.now()-a.startedAt)}</span></div>
    <div class="wk-hb">${!e.t?`<button class="pill" onclick="A.wFocus()" aria-label="Odak modu">${eiSvg('target')} Odak</button>`:''}<button class="pill fin" onclick="A.finishAsk()">Bitir</button></div></div>
  <div class="exstrip">${a.ex.map((x,i)=>{const d=x.sets.filter(s=>s.done).length,t=x.sets.length,gg=mgOf(x.muscle),cc=gg?MGI[gg][2]:'#9b9ba4';
    return `<button class="exs ${i===a.idx?'on':''} ${d===t?'ok':''} ${x.ss?'ss':''}" onclick="A.jumpEx(${i})">${ring(d/t,d===t?'#3ee6a0':cc,30,3.5,d===t?'✓':i+1)}<span>${esc(x.name.slice(0,18))}</span>${x.ss?`<i class="ssb">${x.ss}</i>`:''}</button>`}).join('')}</div>
  <div class="lv"><span>Kas yükü</span><div class="lv-bar"><i style="width:${ld}%;background:linear-gradient(90deg,#3fd0ff,${L[1]})"></i></div><b style="color:${L[1]}">${ld}</b><small>${doneSets.length}/${totS} set</small></div>
  <div id="frlive">${frLiveStrip()}</div>
  <div class="lx-head"><div class="lx-top"><div style="flex:1;min-width:0"><span class="mtag" style="--c:${gc}">${MUSCLES[e.muscle]||'Diğer'}</span>
    <div class="lx-t">${esc(e.name)}</div>${e.tr?`<div class="lx-s">${esc(e.tr)}</div>`:''}${e.from?`<div class="lx-s" style="color:var(--a3)">🏠 ${esc(e.from)} yerine</div>`:''}</div><button class="lx-body" onclick="A.exInfo('${ja(e.name)}')">${bodyMini(e.name,e.muscle,58)}</button></div>
    <div class="lx-tools"><button onclick="A.howTo('${ja(e.name)}','${e.muscle||''}')">▶ Video</button><button onclick="A.formInfo('${ja(e.name)}')">🎯 Form</button><button onclick="A.exInfo('${ja(e.name)}')">📈 Geçmiş</button><button onclick="A.swapSheet()">⇄ Değiştir</button>${!e.t?`<button class="${e.sets.some(x=>tyOf(x)==='w')?'on':''}" onclick="A.warm()">🔥 Isınma</button>`:''}<button class="${ssg?'on':''}" onclick="A.ssSheet()">🔗 ${ssg?'Süperset '+e.ss:'Süperset'}</button>${e.alt?`<button class="alt" onclick="A.altSwap()">↔ ${esc(altP(e.alt).en)}</button>`:''}${!e.t?`<button class="${ui.tmrOpen||(hold&&hold.i==null)?'on':''}" onclick="A.tmrToggle()">⏱ Zamanlayıcı</button>`:''}${!e.t&&ns&&num(ns.kg)>0?`<button onclick="A.plates()">🏋️ Plaka</button>`:''}</div></div>
  ${e.goal?(()=>{const dn=e.sets.filter(x=>x.done&&tyOf(x)!=='w').reduce((t,x)=>t+(num(x.reps)||0),0),pc=Math.min(100,Math.round(dn/e.goal*100)),un=e.t?'sn':'tekrar';
    return `<div class="qgoal ${dn>=e.goal?'ok':''}"><div class="row between"><b>🎯 Hedef: ${e.goal} ${un}</b><span>${dn>=e.goal?'🎉 Tamamlandı!':`${dn} / ${e.goal} · kalan ${e.goal-dn}`}</span></div><div class="qg-bar"><i style="width:${pc}%"></i></div>${dn<e.goal&&e.sets.every(x=>x.done)?`<button class="pill" onclick="A.qMore()">+ Kalan ${e.goal-dn} ${un} için set ekle</button>`:''}</div>`})():''}
  ${ssg?`<div class="ssban"><b>🔗 Süperset ${e.ss}</b><div>${ssg.map(j=>`<span class="${j===a.idx?'on':''}">${esc(a.ex[j].name)}</span>`).join('<i>→</i>')}</div><small>Aralarında dinlenme yok; turun son hareketinden sonra dinlen.</small></div>`:''}
  <div class="coachl"><span>🤖</span><div>${sg.why}${e.note?`<small>💡 ${esc(e.note)}</small>`:''}</div></div>
  ${holdCard(e,a,nextSet,allDone)}
   ${S.sessions.length<2&&!lp?`<div class="st-tip">${TT('İpucu: kg ve tekrar kutusuna dokunup kaydırarak seç, seti bitirince ✓\'ye bas. "Önceki" sütunu bir sonraki antrenmanda dolar.','Tip: tap kg and reps to pick, then press ✓ when the set is done. "Previous" fills from your next workout.')}</div>`:''}
  <div class="stbl">
   <div class="st-h"><button class="sth-i" onclick="A.styInfo()">Set ⓘ</button><span>Önceki</span><span>kg</span><span>${e.t?'sn':'Tekrar'}</span><span>✓</span></div>
   ${e.sets.map((s,i)=>`<div class="st-r ${s.done?'done':''} ${i===nextSet?'cur':''}">
    <button class="no sty-${tyOf(s)}" onclick="A.setType(${i})" aria-label="Set türü">${setLbl(e,i)}${up(s,i)}</button>
    <button class="prev" onclick="A.usePrev(${i})" ${lp&&lp.sets[i]&&!s.done?'':'disabled'}>${prevTxt(i)}</button>
    <input inputmode="decimal" placeholder="kg" value="${s.kg??''}" readonly onclick="A.pickSet(${i},'kg')" oninput="A.setVal(${i},'kg',this.value)">
    <input inputmode="numeric" placeholder="${e.t?'sn':'tkr'}" value="${s.reps??''}" readonly onclick="A.pickSet(${i},'reps')" oninput="A.setVal(${i},'reps',this.value)">
    <button class="chk" onclick="A.toggleSet(${i})" aria-label="Seti tamamla">${s.done?I.check:''}</button></div>
    ${s.done&&i===lastDone&&(s.rpe===''||s.rpe==null)&&!e.t?`<div class="rpeq"><span>Nasıldı?</span>${[[6,'Kolay'],[7,''],[8,'2 kaldı'],[9,''],[10,'Tükendi']].map(([v,t])=>`<button onclick="A.rpe(${i},${v})">${v}${t?`<small>${t}</small>`:''}</button>`).join('')}</div>`:''}
    ${s.done&&s.rpe!==''&&s.rpe!=null&&!e.t?`<div class="rpet">RPE ${s.rpe}</div>`:''}`).join('')}
   <div class="st-add"><button onclick="A.addSet()">+ Set ekle</button>${!e.t?`<button onclick="A.addWarm()">+ Isınma</button>`:''}${e.sets.length>1&&!e.sets[e.sets.length-1].done?`<button onclick="A.delSet()">− Son seti sil</button>`:''}</div></div>
  ${wHRCard(a)}
  <div class="bottom-cta"><button class="btn" onclick="if(!A.ctaKg())A.cta()">${ctaText}</button></div></div>`;
}

/* odak modu: yalnızca o anki hareket, set, kilo/tekrar ve dinlenme; tek elle büyük düğmeler */
function wFocusV(a,e,nextSet,allDone,ctaText,prevTxt){const ns=e.sets[nextSet],nxi=nextEx(a),pv=!allDone?prevTxt(nextSet):'—';
  const fld=(k,lab,val)=>`<div class="wf-f"><span>${lab}</span><div class="wf-ctl"><button onclick="A.wfStep(${nextSet},'${k}',-1)" aria-label="${lab} azalt">−</button><b role="button" tabindex="0" onclick="A.pickSet(${nextSet},'${k}')">${val}</b><button onclick="A.wfStep(${nextSet},'${k}',1)" aria-label="${lab} artır">+</button></div></div>`;
  return `<div class="lw wf">
  <div class="wk-head"><button class="back" onclick="A.prevEx()" aria-label="Önceki hareket">${I.back}</button>
    <div class="lw-c"><small>${esc(a.planName)}</small><span class="wkt" id="wkt">${mmss(Date.now()-a.startedAt)}</span></div>
    <div class="wk-hb"><button class="pill" onclick="A.wFocus()">Detay</button><button class="pill fin" onclick="A.finishAsk()">Bitir</button></div></div>
  <div class="wf-prog" aria-hidden="true">${a.ex.map((x,i)=>`<i class="${x.sets.every(s=>s.done)?'ok':i===a.idx?'on':''}"></i>`).join('')}</div>
  <div class="wf-ex"><small>${a.idx+1} / ${a.ex.length}${MUSCLES[e.muscle]?' · '+MUSCLES[e.muscle]:''}</small><h2>${esc(e.name)}</h2></div>
  ${allDone?`<div class="wf-done">${eiSvg('check')}<b>Hareket tamamlandı</b><span>${nxi>=0?'Sıradaki: '+esc(a.ex[nxi].name):'Tüm hareketler bitti'}</span></div>`:`
  <div class="wf-set">Set <b>${nextSet+1}</b> / ${e.sets.length}${tyOf(ns)==='w'?' · ısınma':tyOf(ns)==='d'?' · drop':''}<span>Önceki: ${pv}</span></div>
  <div class="wf-in">${fld('kg','kg',ns.kg!==''&&ns.kg!=null?fmt(ns.kg):'—')}${fld('reps','tekrar',ns.reps||'—')}</div>
  <div class="wf-dots" aria-hidden="true">${e.sets.map((s,i)=>`<i class="${s.done?'ok':i===nextSet?'on':''}"></i>`).join('')}</div>`}
  <div class="bottom-cta wf-cta"><button class="btn" onclick="if(!A.ctaKg())A.cta()">${ctaText}</button></div></div>`}
function summaryV(){
  const s=S.sessions[S.sessions.length-1];if(!s){ui.view='programs';return programsV()}
  const vol=volOf(s),reps=s.sets.reduce((a,x)=>a+(x.t?0:x.reps||0),0),ld=loadOf(s.sets,s.date),L=loadLbl(ld),by=setsBy([s]),tot=s.sets.length||1;
  const g={};s.sets.forEach(x=>(g[x.ex]=g[x.ex]||[]).push(x));
  const prevOf=n=>{for(let i=S.sessions.length-2;i>=0;i--){const xs=S.sessions[i].sets.filter(x=>x.ex===n);if(xs.length)return xs}return null};
  const best=xs=>xs.reduce((b,x)=>{const v=x.t||!(x.kg>0)?x.reps:e1rm(x.kg,x.reps);return !b||v>b.v?{...x,v}:b},null);
  return `<div class="st-hero sm-hero">
    <div class="sm-k">✓ Antrenman tamamlandı</div><div class="pv-t" style="text-align:center">${esc(s.planName)}</div>
    <div class="lbl" style="text-align:center">${new Date(s.date).toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'})}</div>
    <div class="sm-ring">${ring(ld/100,L[1],150,12,`<b>${ld}</b><small>kas yükü</small><em style="color:${L[1]}">${L[0]}</em>`)}</div></div>
  <div class="sm-grid"><div><b>${mmss((s.dur||0)*1000)}</b><small>süre</small></div><div><b>${Math.round(vol).toLocaleString('tr-TR')}</b><small>kg hacim</small></div><div><b>${s.sets.length}</b><small>set</small></div><div><b>${reps}</b><small>tekrar</small></div></div>
  ${s.tpl&&s.tpl.chg?`<div class="card tplc"><div class="row between"><b>📋 ${s.tpl.applied?'Şablon güncellendi':'Şablonda değişiklik var'}</b>${s.tpl.applied?`<button class="pill" onclick="A.tplUndo('${s.id}')">Geri al</button>`:`<button class="pill fin" onclick="A.tplApply('${s.id}')">Şablona uygula</button>`}</div>
    <ul>${s.tpl.chg.map(c=>`<li>${c}</li>`).join('')}</ul><div class="lbl">${s.tpl.applied?'Bir sonraki antrenman bu düzenle başlayacak.':'Otomatik güncelleme kapalı.'} Ayarlardan ${S.settings.autoTpl===false?'açabilirsin':'kapatabilirsin'}.</div></div>`:''}
  ${s.prs&&s.prs.length?`<div class="card sm-pr"><b>🏆 ${s.prs.length} yeni rekor</b>${s.prs.map(p=>`<p>${esc(p)}</p>`).join('')}</div>`:''}
  <div class="card"><b>Kas dağılımı</b><div class="sm-bars">${MG.filter(x=>by[x[0]]).map(x=>`<div class="smb"><span>${x[1]}</span><div><i style="width:${by[x[0]]/tot*100}%;background:${x[2]}"></i></div><em>${by[x[0]]} set</em></div>`).join('')}</div></div>
  <div class="card" style="padding:6px 16px"><div style="padding:10px 0 4px"><b>Egzersizler</b></div>${Object.entries(g).map(([n,xs])=>{const b=best(xs),p=prevOf(n),pb=p&&best(p);
    const dlt=pb?b.v-pb.v:null,unit=b.t?' sn':(b.kg>0?' kg':' tkr');
    return `<button class="smx" onclick="A.exInfo('${ja(n)}')"><span class="pex-b"><b>${esc(n)}</b><small>${xs.length} set · en iyi: ${b.t?b.reps+' sn':(b.kg?fmt(b.kg)+' kg × ':'')+(b.t?'':b.reps)}</small></span>
      <span class="dl ${dlt==null?'':dlt>.05?'up':dlt<-.05?'dn':''}">${dlt==null?'yeni':dlt>.05?'▲ '+fmt(r1(dlt))+unit:dlt<-.05?'▼ '+fmt(r1(-dlt))+unit:'= aynı'}</span></button>`}).join('')}</div>
  ${s.hr&&s.hr.length>=3?`<div class="card"><b>❤️ Nabız ve bölgeler</b>${hrChart(s.hr)}</div>`:''}
  <div class="pad" style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn ghost" onclick="A.go('programs')">Antrenman</button><button class="btn" onclick="A.go('home')">Ana sayfa</button></div>`;
}

function tFmt(sec){sec=Math.max(0,Math.round(sec));return sec>=60?mmss(sec*1000):String(sec)}
function holdCard(e,a,nextSet,allDone){
  const hd=hold&&(hold.ai===a.idx||hold.i==null)?hold:null,set=hd?hd.i!=null:e.t&&!allDone;
  if(!hd&&!set&&!ui.tmrOpen)return '';
  const el=hd?(Date.now()-hd.start)/1000:0,inf=hd?hd.inf:!!ui.tInf;
  const tgt=hd?hd.target:set?(num(e.sets[nextSet].reps)||e.repMin):(ui.ftg||0);
  const shown=hd?(inf?el:tgt-el):(inf?0:tgt);
  const free=!set;
  return `<div class="hold ${hd?'on':''} ${inf?'inf':''}">
    ${free&&!hd?'<button class="hold-x" onclick="A.tmrToggle()" aria-label="Kapat">✕</button>':''}
    <div class="hold-k">${free?'⏱ Zamanlayıcı':`Set ${(hd?hd.i:nextSet)+1} / ${e.sets.length}`}${inf?' · ∞ sınırsız':''}</div>
    <div class="hold-n" id="holdt">${tFmt(shown)}</div><div class="hold-u">${inf?'geçen süre':'saniye'}</div>
    <div class="hold-bar"><i id="holdb" style="width:${hd&&!inf&&tgt?Math.min(100,el*100/tgt):inf&&hd?100:0}%"></i></div>
    <div class="tq">${[[5,'+5'],[10,'+10'],[30,'+30'],[60,'+1 dk']].map(([n,l])=>`<button onclick="A.tAdd(${n})">${l}</button>`).join('')}<button class="${inf?'on':''}" onclick="A.tInf()">∞</button><button onclick="A.tReset()">↺</button></div>
    ${free?`<button class="btn ${hd?'':'ghost'}" style="margin-top:12px" onclick="${hd?'A.holdStop(false)':'A.ftStart()'}">${hd?'⏹ Durdur':'▶ Başlat'}</button>`:''}
    <div class="lbl" style="margin-top:8px">${free?(inf?'Kronometre: Durdur\'a basana kadar sayar.':'Süre ekle ya da ∞ ile sınırsız say.'):hd?(inf?'Sınırsız: Durdur\'a basınca geçen süre kaydedilir.':'Tut! Süre bitince otomatik kaydedilir.'):'+ butonlarıyla süreyi ayarla, ∞ ile sınırsız tut.'}</div></div>`}
const SLOTS4=[['b','Kahvaltı','☀️'],['l','Öğle','🍽️'],['s','Ara öğün','🍎'],['d','Akşam','🌙']];
const mealSlot=m=>{let k=m.slot;if(!k||!'blds'.includes(k)){const h=m.time?+String(m.time).slice(0,2):12;k=h<11?'b':h<15?'l':h>=18?'d':'s'}return k};
function fuelPanel(d,t,KG,ms){const st=S.settings,k=Math.round(t.kcal),g=KG.k,rem=g-k;
  const bar=(l,v,goal,on)=>{const f=Math.min(1,v/(goal||1));return `<div class="fz-b"><div class="fz-bt"><span>${l}</span><b>${Math.round(v)} / ${goal} g</b></div><div class="fz-tr"><i class="${on?'on':''}" style="width:${(f*100).toFixed(1)}%"></i></div></div>`};
  const L=ms.slice().sort((a,b)=>(b.time||'').localeCompare(a.time||''));
  return `<div class="fz"><div class="fz-hd"><span>${new Date(d+'T12:00').toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'})} · ${TT('yakıt','fuel')}</span><span>${TT('hedef','goal')} ${g.toLocaleString(LOC())} kcal${KG.dyn?' ⌚':''}</span></div>
   <div class="fz-top"><div class="fz-n" data-v="${k}">${k.toLocaleString(LOC())}</div><div class="fz-u"><b>kcal</b><span>${TT('bugün yenen','eaten today')}</span><em class="${rem<0?'ov':''}">${rem>=0?`${rem.toLocaleString(LOC())} ${TT('kaldı','left')}`:`${(-rem).toLocaleString(LOC())} ${TT('fazla','over')}`}</em></div></div>
   ${bar(TT('Protein','Protein'),t.p,st.protein,1)}${bar(TT('Karbonhidrat','Carbs'),t.c,st.carbs)}${bar(TT('Yağ','Fat'),t.f,st.fat)}
   </div>`}
function foodV(){
  const d=ui.foodDay,t=dayTotals(d),st=S.settings,ms=dayMeals(d);
  const isToday=d===dkey();const dd=new Date(d+'T12:00');
  const body=S.body.find(b=>b.date===d)||{};
  const KG=kcalGoal(d),pct=Math.min(1,t.kcal/KG.k),R=62,C=2*Math.PI*R;
  const mb=(n,v,g,col)=>`<div class="mbar"><span>${n}</span><div class="bar"><i style="width:${Math.min(100,v/g*100)}%;background:${col}"></i></div><span class="muted" style="text-align:right">${Math.round(v)}</span></div>`;
  return `<div class="hero" style="padding-bottom:12px">
    <div class="top"><button class="back" onclick="A.day(-1)">${I.back}</button><div style="font-weight:600">${isToday?'Bugün':esc(dd.toLocaleDateString(LOC(),{day:'numeric',month:'long',weekday:'short'}))}</div>
    <button class="back" style="transform:scaleX(-1);${isToday?'opacity:.3;pointer-events:none':''}" onclick="A.day(1)">${I.back}</button></div>
    <div style="position:relative;width:160px;height:160px;margin:18px auto 6px;display:none">
      <svg aria-hidden="true" width="160" height="160" style="transform:rotate(-90deg)"><circle cx="80" cy="80" r="${R}" stroke="rgba(255,255,255,.12)" stroke-width="12" fill="none"/>
      <circle cx="80" cy="80" r="${R}" stroke="url(#g)" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}"/>
      <defs><linearGradient id="g"><stop offset="0" stop-color="#3fd0ff"/><stop offset="1" stop-color="#ff6a3d"/></linearGradient></defs></svg>
      <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center"><div><div class="kpi">${Math.round(t.kcal)}</div><div class="lbl">/ ${KG.k} kcal</div>${KG.dyn?`<div class="lbl" style="font-size:10.5px;color:var(--a1)">⌚ ${KG.k>st.kcal?"+":""}${KG.k-st.kcal} harcamana göre</div>`:""}</div></div></div>
  </div>
  ${fuelPanel(d,t,KG,ms)}${npCard()}${medCard(d,ms)}${guideLink('food')}
  <div class="card"><div class="row between"><b>Öğünler</b><button class="pill" onclick="A.mealSheet()">+ Ekle</button></div>${freqRow()}
    ${ms.length?SLOTS4.map(([sk,sn,sic])=>{const g=ms.filter(m=>mealSlot(m)===sk);if(!g.length)return '';return `<div class="msl"><span>${sic} ${sn}</span><b>${Math.round(g.reduce((a,m)=>a+m.kcal,0))} kcal</b></div>`+g.map(m=>{const im=m.photo||(m.photoId&&(S.photos.find(x=>x.id===m.photoId)||{}).img);return `<div class="meal">${im?`<img class="mph" src="${im}" alt="" onclick="A.photo('${m.id}')">`:''}<div style="flex:1">${esc(m.name)}${medTags(m)}<small>${Math.round(m.kcal)} kcal · P ${Math.round(m.p)} · K ${Math.round(m.c)} · Y ${Math.round(m.f)}</small>${m.items?`<small style="opacity:.8">${esc(m.items)}</small>`:''}</div>${m.kcal>0?`<button class="nsc" onclick="A.mealNutri('${m.id}')" aria-label="Besin dengesi ${nutriScore(m)}" style="--c:${nsCol(nutriScore(m))}">${nutriScore(m)}</button>`:''}<button class="x" onclick="A.editMeal('${m.id}')" aria-label="Düzenle / besin ekle" title="Düzenle / besin ekle">✎</button><button class="x" onclick="A.delMeal('${m.id}')">✕</button></div>`}).join('')}).join(''):'<div class="empty" style="padding:16px">Henüz öğün yok</div>'}
  </div>
  ${waterCard(d)}
  ${photoCard(d)}
  ${cookCard()}
  ${calBal()}${suppCard(d)}${toolRow(['kalori','su'])}
`;
}
function planCard(p,n){const isN=n&&n.id===p.id,open=ui.planOpen[p.id];
  const last=S.sessions.filter(s=>s.planId===p.id||s.planName===p.name).slice(-1)[0];
  return `<div class="card"><div class="row between" style="align-items:flex-start"><div><b style="font-size:17px">${esc(p.name)}</b> ${isN?'<span class="tag">Sıradaki</span>':''}
     <div class="lbl">${p.exercises.length} egzersiz · ${p.exercises.reduce((a,e)=>a+e.sets,0)} set${last?` · son: ${new Date(last.date).toLocaleDateString(LOC(),{day:'numeric',month:'short',year:'numeric'})}`:''}</div></div></div>
   <button class="exbtn ${open?'on':''}" onclick="A.planToggle('${p.id}')">💪 Hareketler (${p.exercises.length}) <span>${open?'▴':'▾'}</span></button>
   ${open?`<div class="exl">${p.exercises.map((e,i)=>`<div class="exr"><span class="exn">${i+1}</span><div style="flex:1">${exRowTxt(e)}</div><span class="lbl">${e.sets} × ${rr(e)}</span></div>`).join('')}</div>`:''}
   <div class="row" style="gap:6px;margin-top:12px;flex-wrap:wrap"><button class="pill" onclick="A.openPlan('${p.id}')">▶ Başlat</button>
    ${p.archived?`<button class="pill" onclick="A.arch('${p.id}',false)">Rotasyona al</button>`:`<button class="pill" onclick="A.arch('${p.id}',true)">Arşivle</button>`}
    <button class="pill" onclick="A.editPlan('${p.id}')">Düzenle</button></div></div>`}
function exRowTxt(e){const a=e.alt?altP(e.alt):null;
  return `${e.t?'<span class="tbadge">⏱</span>':''}${e.tr?`<b style="font-weight:600">${esc(e.name)}</b><small>${esc(e.tr)} · ${MUSCLES[e.muscle]||''}${e.t?' · süreli':e.fix?` · ${fmt(e.fix)} kg`:e.fix===0?' · bant/vücut ağ.':''}</small>`:`${esc(e.name)}<small>${MUSCLES[e.muscle]||''}</small>`}${a?`<small class="altl">↔ Alternatif: ${a.t?'⏱ ':''}${esc(a.en)}${a.tr?` <i>(${esc(a.tr)})</i>`:''}</small>`:''}`}
const HW_META={w:['🤸‍♀️','Kadın','Evde','#ff5a3c'],wb:['🧘‍♀️','Kadın','Bant','#ff9f0a'],m:['🏋️','Erkek','10 kg+bant','#ff2d55']};
function hwDone(k){const ids=new Set(S.plans.filter(p=>p.tmpl&&HOME_PROGRAMS[k].plans.some(t=>t.id===p.tmpl)).map(p=>p.id));
  return S.sessions.filter(x=>ids.has(x.planId)&&Date.now()-new Date(x.date).getTime()<7*864e5).length}
function homeEntry(){const g=gp(),G=genOk(g.last)?g.last:null;
  return `<div class="card ed hwe">${edHd(TT('evde antrenman oluşturucu','home workout builder'),XDB.length+' '+TT('hareket','moves'))}
   <button class="hwe-h" onclick="A.homeOpen()"><b>${TT('Kas grubunu seç, antrenman hazır','Pick a muscle group, get a workout')}</b><small>${TT('9 ekipman · 3 seviye · alternatifli','9 equipment types · 3 levels · alternatives')}</small><span>›</span></button>
   <div class="hwe-q">${genPresets().slice(0,4).map(([n])=>`<button onclick="A.homeQuick('${n}')">${n}</button>`).join('')}</div>
   ${G?`<button class="hwe-l" onclick="A.homeOpen()"><span>${TT('son oluşturulan','last created')}</span><b>${esc(G.name)}</b><small>${G.exercises.length} ${TT('hareket','moves')} · ~${planMin(G)} dk</small></button>`:''}</div>`}
/* ---------- Ev antrenmanı oluşturucu: hareket veritabanı ----------
   [İngilizce ad, Türkçe ad, kas, ekipman, seviye(1-3), tür c=çok eklemli / i=izole / t=süreli, not] */
const EQ=[['bodyweight','🧍','Vücut ağırlığı'],['band','🎗️','Bant'],['dumbbell','🏋️','Dumbbell'],['kettlebell','🔔','Kettlebell'],['barbell','➖','Barbell'],['ezbar','〰️','EZ bar'],['plate','⭕','Plaka'],['cable','🔗','Kablo'],['machine','⚙️','Makine']];
const GMUS=[['chest','Göğüs'],['back','Sırt'],['shoulders','Omuz'],['biceps','Biceps'],['triceps','Triceps'],['quads','Ön bacak'],['hamstrings','Arka bacak'],['glutes','Kalça'],['calves','Baldır'],['core','Karın / Core']];
const GPRE=[['Tüm vücut',['chest','back','shoulders','quads','hamstrings','glutes','core']],['Üst vücut',['chest','back','shoulders','biceps','triceps']],['Alt vücut',['quads','hamstrings','glutes','calves']],['İtiş',['chest','shoulders','triceps']],['Çekiş',['back','biceps']],['Kol',['biceps','triceps']],['Karın',['core']]];
const LVL=[['Başlangıç','6 aydan az düzenli antrenman'],['Orta','~6 ay – 2 yıl düzenli antrenman'],['İleri','Yıllardır düzenli antrenman']];
const XDB=[
 // GÖĞÜS
 ['Push Up','Şınav','chest','bodyweight',1,'c','Gövde düz bir tahta gibi; göğüs yere yaklaşsın.'],
 ['Incline Push Up','Eğimli şınav (eller yüksekte)','chest','bodyweight',1,'c','Eller kanepe/masada; şınavın kolay versiyonu.'],
 ['Decline Push Up','Ayaklar yüksekte şınav','chest','bodyweight',2,'c','Üst göğsü daha çok çalıştırır.'],
 ['Deficit Push Up','Derin şınav (kitap üstünde)','chest','bodyweight',3,'c','Eller yükseltide; göğüs ellerin altına insin, derin esneme.'],
 ['Chest Dip','Göğüs dips','chest','bodyweight',3,'c','Hafif öne eğil; omuz ağrırsa yapma.'],
 ['Dumbbell Bench Press','Dumbbell bench press','chest','dumbbell',1,'c','Dirsekler gövdeye ~45°; aşağıda göğüs esnesin.'],
 ['Dumbbell Floor Press','Yerde dumbbell press','chest','dumbbell',1,'c','Sehpa yoksa ideal; dirsek yere değince it.'],
 ['Incline Dumbbell Press','Eğimli dumbbell press','chest','dumbbell',2,'c','30° eğim; üst göğüs.'],
 ['Dumbbell Fly','Dumbbell fly','chest','dumbbell',2,'i','Dirsek hafif bükük; aşağıda esnemeyi hisset.'],
 ['Kettlebell Floor Press','Kettlebell yerde press','chest','kettlebell',1,'c','Tek kolla da yapılabilir.'],
 ['Bench Press (Barbell)','Barbell bench press','chest','barbell',2,'c','Kürek kemikleri sıkı, ayaklar yerde.'],
 ['Incline Bench Press (Barbell)','Eğimli barbell bench','chest','barbell',2,'c','Üst göğüs için.'],
 ['Svend Press (Plate)','Plaka sıkıştırmalı press','chest','plate',1,'i','İki plakayı avuçlarla sıkıştırıp ileri it.'],
 ['Band Chest Press','Bantlı göğüs press','chest','band',1,'c','Bandı sırtından dola, öne it.'],
 ['Band Chest Fly','Bantlı fly','chest','band',1,'i','Bant arkada sabit; kolları önde birleştir.'],
 ['Cable Chest Press','Kablo göğüs press','chest','cable',1,'c','Adım önde, sabit gövde.'],
 ['Cable Crossover','Kablo crossover','chest','cable',2,'i','Hareketin sonunda göğsü sık.'],
 ['Chest Press (Machine)','Makine göğüs press','chest','machine',1,'c','Başlangıç için güvenli ve kolay ilerler.'],
 ['Pec Deck (Machine)','Pec deck (kelebek)','chest','machine',1,'i','Kontrollü aç, tam esne.'],
 // SIRT
 ['Inverted Row','Ters kürek (masa altı)','back','bodyweight',2,'c','Sağlam masa altında; göğsü masaya çek.'],
 ['Pull Up','Barfiks','back','bodyweight',3,'c','Kapı barı gerekir; yapamıyorsan negatif (yavaş iniş) yap.'],
 ['Chin Up','Ters tutuş barfiks','back','bodyweight',3,'c','Biceps de güçlü çalışır.'],
 ['Prone Y-T-W Raise','Yüzüstü Y-T-W kaldırma','back','bodyweight',1,'i','Üst sırt ve duruş için.'],
 ['Superman Hold','Superman tutuş','back','bodyweight',1,'t','Bel kasları; kol ve bacaklar hafif yukarıda.'],
 ['Single Arm Row (Dumbbell)','Tek kol dumbbell row','back','dumbbell',1,'c','Elini sandalyeye daya; dirseği kalçaya çek.'],
 ['Bent Over Row (Dumbbell)','Eğilerek dumbbell row','back','dumbbell',1,'c','Kalçadan menteşe, sırt düz.'],
 ['Chest Supported Row (Dumbbell)','Göğüs destekli dumbbell row','back','dumbbell',1,'c','Eğimli sehpaya yüzüstü yat; beli korur.'],
 ['Dumbbell Pullover','Dumbbell pullover','back','dumbbell',2,'i','Lat kaslarında güçlü esneme.'],
 ['Renegade Row (Dumbbell)','Plankta dumbbell row','back','dumbbell',3,'c','Kalça sallanmasın; core da çalışır.'],
 ['Kettlebell Row','Kettlebell row','back','kettlebell',1,'c','Tek kol, destekli.'],
 ['Bent Over Row (Barbell)','Barbell row','back','barbell',2,'c','Gövde ~45°; barı göbeğe çek.'],
 ['Pendlay Row (Barbell)','Pendlay row','back','barbell',3,'c','Her tekrarda bar yerden başlar.'],
 ['Deadlift (Barbell)','Deadlift','back','barbell',3,'c','Bel nötr; teknik öğrenmeden ağır yükleme.'],
 ['Bent Over Row (Plate)','Plaka ile row','back','plate',1,'c','Plakayı iki elle tut.'],
 ['Band Lat Pulldown','Bantlı lat pulldown','back','band',1,'c','Bandı kapının üstüne sabitle.'],
 ['Band Seated Row','Bantlı oturarak row','back','band',1,'c','Kürek kemiklerini sık, 1 sn bekle.'],
 ['Lat Pulldown (Cable)','Lat pulldown','back','cable',1,'c','Göğsü yukarı, dirsekleri cebe çek.'],
 ['Seated Cable Row','Oturarak kablo row','back','cable',1,'c','Önde tam esne, arkada sık.'],
 ['Straight Arm Pulldown (Cable)','Düz kol pulldown','back','cable',2,'i','Lat izolasyonu.'],
 ['Seated Row (Machine)','Makine row','back','machine',1,'c','Göğüs pede yaslı.'],
 ['Assisted Pull Up (Machine)','Destekli barfiks makinesi','back','machine',1,'c','Barfikse hazırlık.'],
 // OMUZ
 ['Pike Push Up','Pike şınav','shoulders','bodyweight',2,'c','Kalça yukarıda ters V; baş ellerin önüne insin.'],
 ['Wall Handstand Push Up','Duvarda amut şınav','shoulders','bodyweight',3,'c','İleri seviye; güvenli zeminde yap.'],
 ['Shoulder Press (Dumbbell)','Dumbbell omuz press','shoulders','dumbbell',1,'c','Oturarak beli korursun.'],
 ['Arnold Press (Dumbbell)','Arnold press','shoulders','dumbbell',2,'c','Avuçlar dönerek yukarı.'],
 ['Lateral Raise (Dumbbell)','Yana açış','shoulders','dumbbell',1,'i','Yan omuz; hafif ağırlık, kontrollü.'],
 ['Rear Delt Fly (Dumbbell)','Arka omuz fly','shoulders','dumbbell',1,'i','Eğil, kolları yana aç.'],
 ['Kettlebell Press','Kettlebell omuz press','shoulders','kettlebell',2,'c','Tek kol; core sıkı.'],
 ['Overhead Press (Barbell)','Barbell omuz press (OHP)','shoulders','barbell',2,'c','Ayakta; kalça ve karın sıkı.'],
 ['Upright Row (EZ Bar)','EZ bar dik çekiş','shoulders','ezbar',2,'i','Dirsekler omuz hizasını çok geçmesin.'],
 ['Front Raise (Plate)','Plaka öne kaldırma','shoulders','plate',1,'i','Göz hizasına kadar.'],
 ['Band Overhead Press','Bantlı omuz press','shoulders','band',1,'c','Bandın ortasına bas.'],
 ['Lateral Raise (Band)','Bantlı yana açış','shoulders','band',1,'i','Tepede sabit gerilim.'],
 ['Band Pull-Apart','Bant açma','shoulders','band',1,'i','Arka omuz ve duruş.'],
 ['Face Pull (Cable)','Kablo face pull','shoulders','cable',1,'i','İpi alına çek, dirsekler yukarı.'],
 ['Cable Lateral Raise','Kablo yana açış','shoulders','cable',2,'i','Alt noktada da gerilim kalır.'],
 ['Shoulder Press (Machine)','Makine omuz press','shoulders','machine',1,'c','Güvenli ağır yükleme.'],
 ['Reverse Pec Deck (Machine)','Ters pec deck','shoulders','machine',1,'i','Arka omuz.'],
 // BICEPS
 ['Underhand Inverted Row','Ters tutuş ters kürek','biceps','bodyweight',2,'c','Avuçlar yukarı; biceps ağırlıklı.'],
 ['Bicep Curl (Dumbbell)','Dumbbell biceps curl','biceps','dumbbell',1,'i','Dirsek sabit, sallanma yok.'],
 ['Hammer Curl (Dumbbell)','Çekiç curl','biceps','dumbbell',1,'i','Ön kol ve brakialis de çalışır.'],
 ['Incline Dumbbell Curl','Eğimli dumbbell curl','biceps','dumbbell',2,'i','Uzun baş için derin esneme.'],
 ['Concentration Curl (Dumbbell)','Konsantrasyon curl','biceps','dumbbell',1,'i','Dirsek dizin içinde.'],
 ['Kettlebell Curl','Kettlebell curl','biceps','kettlebell',1,'i','Sapı iki elle tut.'],
 ['Barbell Curl','Barbell curl','biceps','barbell',1,'i','Ağır yüklemeye uygun.'],
 ['EZ Bar Curl','EZ bar curl','biceps','ezbar',1,'i','Bileklere daha rahat.'],
 ['Preacher Curl (EZ Bar)','EZ bar preacher curl','biceps','ezbar',2,'i','Altta tam aç, kontrollü in.'],
 ['Plate Curl','Plaka curl','biceps','plate',1,'i','Plakayı yanlardan tut.'],
 ['Bicep Curl (Band)','Bantlı biceps curl','biceps','band',1,'i','Tepede 1 sn sık.'],
 ['Cable Curl','Kablo curl','biceps','cable',1,'i','Sabit gerilim.'],
 ['Bayesian Cable Curl','Bayesian kablo curl','biceps','cable',3,'i','Kablo arkada; derin esneme.'],
 ['Preacher Curl (Machine)','Makine preacher curl','biceps','machine',1,'i','İzolasyon.'],
 // TRICEPS
 ['Bench Dip','Sandalye dips','triceps','bodyweight',1,'c','Omuzlar kulaktan uzak.'],
 ['Diamond Push Up','Elmas şınav','triceps','bodyweight',2,'c','Eller göğüs altında birleşik.'],
 ['Parallel Bar Dip','Paralel bar dips','triceps','bodyweight',3,'c','Gövde dik; triceps ağırlıklı.'],
 ['Overhead Triceps Extension (Dumbbell)','Baş üstü dumbbell triceps','triceps','dumbbell',1,'i','Uzun baş için en iyi seçeneklerden.'],
 ['Skull Crusher (Dumbbell)','Dumbbell skull crusher','triceps','dumbbell',2,'i','Dirsekler sabit.'],
 ['Triceps Kickback (Dumbbell)','Dumbbell kickback','triceps','dumbbell',1,'i','Kol gövdeye paralel.'],
 ['Close Grip Bench Press (Barbell)','Dar tutuş bench press','triceps','barbell',2,'c','Eller omuz genişliğinde.'],
 ['Skull Crusher (EZ Bar)','EZ bar skull crusher','triceps','ezbar',2,'i','Barı alnın arkasına indir.'],
 ['Overhead Extension (Plate)','Plaka baş üstü triceps','triceps','plate',1,'i','İki elle plaka.'],
 ['Triceps Pushdown (Band)','Bantlı pushdown','triceps','band',1,'i','Bant yukarıda sabit.'],
 ['Overhead Extension (Band)','Bantlı baş üstü triceps','triceps','band',1,'i','Bandın ucuna arkadan bas.'],
 ['Triceps Pushdown (Cable)','Kablo pushdown','triceps','cable',1,'i','Dirsekler gövdeye yapışık.'],
 ['Overhead Cable Extension','Baş üstü kablo triceps','triceps','cable',2,'i','Uzun başta derin esneme.'],
 ['Triceps Extension (Machine)','Makine triceps','triceps','machine',1,'i','İzolasyon.'],
 // ÖN BACAK
 ['Bodyweight Squat','Squat','quads','bodyweight',1,'c','Kalça geriye, dizler ayak yönünde.'],
 ['Reverse Lunge','Geri lunge','quads','bodyweight',1,'c','Dizlere daha rahat bir lunge.'],
 ['Step Up','Basamak çıkma','quads','bodyweight',1,'c','Sağlam bir sandalye/basamak.'],
 ['Bulgarian Split Squat','Bulgar split squat','quads','bodyweight',2,'c','Arka ayak sandalyede.'],
 ['Pistol Squat','Tek bacak (pistol) squat','quads','bodyweight',3,'c','Gerekirse kapı kolundan destek al.'],
 ['Wall Sit','Duvarda oturma','quads','bodyweight',1,'t','Dizler 90°.'],
 ['Goblet Squat (Dumbbell)','Goblet squat','quads','dumbbell',1,'c','Dumbbell göğüs önünde.'],
 ['Bulgarian Split Squat (Dumbbell)','Dumbbell Bulgar split squat','quads','dumbbell',2,'c','Ön bacakta derin esneme.'],
 ['Walking Lunge (Dumbbell)','Dumbbell yürüyen lunge','quads','dumbbell',2,'c','Kalça ve ön bacak birlikte.'],
 ['Goblet Squat (Kettlebell)','Kettlebell goblet squat','quads','kettlebell',1,'c','Derin ve dik gövde.'],
 ['Squat (Barbell)','Barbell squat','quads','barbell',2,'c','Bel nötr; derinlik kontrollü.'],
 ['Front Squat (Barbell)','Barbell ön squat','quads','barbell',3,'c','Ön bacak ağırlıklı.'],
 ['Plate Goblet Squat','Plaka goblet squat','quads','plate',1,'c','Plakayı göğüste tut.'],
 ['Squat (Band)','Bantlı squat','quads','band',1,'c','Bandın üstüne bas, uçlar omuzda.'],
 ['Leg Press (Machine)','Leg press','quads','machine',1,'c','Bel pedden kalkmasın.'],
 ['Leg Extension (Machine)','Leg extension','quads','machine',1,'i','Tepede 1 sn sık.'],
 ['Hack Squat (Machine)','Hack squat','quads','machine',2,'c','Ön bacak için en iyilerden.'],
 // ARKA BACAK
 ['Sliding Leg Curl','Havlu ile kaydırmalı leg curl','hamstrings','bodyweight',2,'i','Kalça yukarıda, topukları çek.'],
 ['Nordic Hamstring Curl','Nordic curl','hamstrings','bodyweight',3,'i','Ayaklarını sabitle; yavaş in.'],
 ['Single Leg Romanian Deadlift','Tek bacak Romen deadlift','hamstrings','bodyweight',1,'c','Denge + arka bacak.'],
 ['Romanian Deadlift (Dumbbell)','Dumbbell Romen deadlift','hamstrings','dumbbell',1,'c','Kalçadan menteşe, sırt düz.'],
 ['Single Leg Romanian Deadlift (Dumbbell)','Dumbbell tek bacak RDL','hamstrings','dumbbell',2,'c','Kalça düz kalsın.'],
 ['Kettlebell Swing','Kettlebell swing','hamstrings','kettlebell',2,'c','Güç kalçadan gelir, kollardan değil.'],
 ['Romanian Deadlift (Barbell)','Barbell Romen deadlift','hamstrings','barbell',2,'c','Bar bacağa yakın.'],
 ['Good Morning (Barbell)','Good morning','hamstrings','barbell',3,'c','Hafif başla.'],
 ['Band Good Morning','Bantlı good morning','hamstrings','band',1,'c','Bant boyunda, ayak altında.'],
 ['Lying Leg Curl (Band)','Bantlı yatarak leg curl','hamstrings','band',1,'i','Bant kapı altına sabit.'],
 ['Cable Pull Through','Kablo pull-through','hamstrings','cable',1,'c','Kalça menteşesi öğrenmek için iyi.'],
 ['Lying Leg Curl (Machine)','Yatarak leg curl','hamstrings','machine',1,'i','Kalça pedden kalkmasın.'],
 ['Seated Leg Curl (Machine)','Oturarak leg curl','hamstrings','machine',1,'i','Uzun kas boyunda çalışır; çok etkili.'],
 // KALÇA
 ['Glute Bridge','Köprü','glutes','bodyweight',1,'c','Tepede 1–2 sn sık.'],
 ['Single Leg Glute Bridge','Tek bacak köprü','glutes','bodyweight',2,'c','Kalça düşmesin.'],
 ['Donkey Kick','Donkey kick (geri tekme)','glutes','bodyweight',1,'i','Bel çukurlaşmasın.'],
 ['Fire Hydrant','Fire hydrant','glutes','bodyweight',1,'i','Yan kalça.'],
 ['Frog Pump','Frog pump','glutes','bodyweight',1,'i','Ayak tabanları birleşik köprü.'],
 ['Hip Thrust (Dumbbell)','Dumbbell hip thrust','glutes','dumbbell',1,'c','Sırt kanepeye dayalı.'],
 ['Sumo Deadlift (Dumbbell)','Dumbbell sumo deadlift','glutes','dumbbell',2,'c','Geniş duruş, dik gövde.'],
 ['Kettlebell Sumo Deadlift','Kettlebell sumo deadlift','glutes','kettlebell',1,'c','Kalçayla it.'],
 ['Hip Thrust (Barbell)','Barbell hip thrust','glutes','barbell',2,'c','Kalça için en etkili hareketlerden.'],
 ['Hip Thrust (Plate)','Plakalı hip thrust','glutes','plate',1,'c','Plaka kalçada.'],
 ['Glute Bridge (Band)','Bantlı köprü','glutes','band',1,'c','Bant dizlerin üstünde, dışa it.'],
 ['Lateral Band Walk','Bantlı yan yürüyüş','glutes','band',1,'i','Yarım squat pozisyonunda.'],
 ['Clamshell (Band)','Bantlı clamshell','glutes','band',1,'i','Leğen sabit.'],
 ['Cable Kickback','Kablo geri tekme','glutes','cable',1,'i','Hareket kalçadan.'],
 ['Hip Abduction (Machine)','Abduction makinesi','glutes','machine',1,'i','Hafif öne eğil.'],
 // BALDIR
 ['Standing Calf Raise','Ayakta baldır kaldırma','calves','bodyweight',1,'i','Basamakta, tam aşağı in.'],
 ['Single Leg Calf Raise','Tek bacak baldır kaldırma','calves','bodyweight',2,'i','Altta 1 sn esneme.'],
 ['Calf Raise (Dumbbell)','Dumbbell baldır kaldırma','calves','dumbbell',1,'i','Tek elde dumbbell, diğeri destek.'],
 ['Seated Calf Raise (Dumbbell)','Oturarak baldır (dumbbell)','calves','dumbbell',1,'i','Dumbbell dizlerin üstünde.'],
 ['Calf Raise (Barbell)','Barbell baldır kaldırma','calves','barbell',2,'i','Basamak kullan.'],
 ['Calf Raise (Plate)','Plakalı baldır kaldırma','calves','plate',1,'i','Plakanın kenarında dur.'],
 ['Calf Press (Band)','Bantlı baldır press','calves','band',1,'i','Oturarak bant ayak ucunda.'],
 ['Calf Press (Machine)','Leg press baldır','calves','machine',1,'i','Tam hareket açıklığı.'],
 ['Seated Calf Raise (Machine)','Oturarak baldır makinesi','calves','machine',1,'i','Soleus kası.'],
 // KARIN / CORE
 ['Plank','Plank','core','bodyweight',1,'t','Kalça omuz hizasında.'],
 ['Side Plank','Yan plank','core','bodyweight',1,'t','Her taraf için.'],
 ['Dead Bug','Ölü böcek','core','bodyweight',1,'i','Bel yere yapışık.'],
 ['Bird Dog','Bird dog','core','bodyweight',1,'i','Zıt kol-bacak.'],
 ['Reverse Crunch','Ters mekik','core','bodyweight',1,'i','Kalçayı yerden hafif kaldır.'],
 ['Hollow Body Hold','Hollow tutuş','core','bodyweight',2,'t','Bel yerde, kollar baş üstünde.'],
 ['Hanging Knee Raise','Asılı diz çekme','core','bodyweight',2,'i','Bar gerekir.'],
 ['Hanging Leg Raise','Asılı bacak kaldırma','core','bodyweight',3,'i','Sallanmadan.'],
 ['Dragon Flag','Dragon flag','core','bodyweight',3,'i','Çok ileri seviye; yavaş in.'],
 ['Russian Twist (Dumbbell)','Dumbbell Rus twist','core','dumbbell',1,'i','Tekrar = iki taraf.'],
 ['Dumbbell Side Bend','Dumbbell yana eğilme','core','dumbbell',1,'i','Oblikler.'],
 ['Kettlebell Halo','Kettlebell halo','core','kettlebell',1,'i','Başın etrafında çevir.'],
 ['Barbell Rollout','Barbell rollout','core','barbell',3,'i','Bel çukurlaşmasın.'],
 ['Weighted Plank (Plate)','Plakalı plank','core','plate',2,'t','Plaka sırtta.'],
 ['Pallof Press (Band)','Bantlı Pallof press','core','band',1,'i','Dönmeye direnç.'],
 ['Cable Crunch','Kablo crunch','core','cable',2,'i','Kalça sabit, omurgayı bük.'],
 ['Cable Woodchop','Kablo woodchop','core','cable',2,'i','Gövde dönüşü kontrollü.'],
 ['Ab Crunch (Machine)','Makine crunch','core','machine',1,'i','Kontrollü.']
];
XDB.push(
 ['Wide Push Up','Geniş şınav','chest','bodyweight',1,'c','Eller omuzdan geniş.'],
 ['Knee Push Up','Diz üstü şınav','chest','bodyweight',1,'c','Tam şınava hazırlık; gövde düz.','f'],
 ['Archer Push Up','Okçu şınav','chest','bodyweight',3,'c','Ağırlık bir kola kayar.'],
 ['Banded Push Up','Bantlı şınav','chest','band',2,'c','Bant sırttan, uçlar avuçların altında.','m'],
 ['Band Incline Press','Bantlı eğimli press','chest','band',1,'c','Yukarı-öne doğru it.'],
 ['Squeeze Press (Dumbbell)','Dumbbell sıkıştırma press','chest','dumbbell',1,'c','Dumbbelları birbirine bastırarak it.'],
 ['Decline Dumbbell Press','Ters eğimli dumbbell press','chest','dumbbell',2,'c','Alt göğüs.'],
 ['Incline Dumbbell Fly','Eğimli dumbbell fly','chest','dumbbell',2,'i','Üst göğüste esneme.'],
 ['Kettlebell Squeeze Press','Kettlebell sıkıştırma press','chest','kettlebell',2,'c','Kettlebell göğüs üstünde.'],
 ['Floor Press (Barbell)','Barbell yerde press','chest','barbell',2,'c','Omuz dostu bench alternatifi.'],
 ['Decline Bench Press (Barbell)','Ters eğimli bench press','chest','barbell',2,'c','Alt göğüs.'],
 ['Plate Press-Out','Plaka öne itme','chest','plate',1,'i','Plakayı göğüsten öne it, sık.'],
 ['Low to High Cable Fly','Alttan yukarı kablo fly','chest','cable',2,'i','Üst göğüs.'],
 ['High to Low Cable Fly','Üstten aşağı kablo fly','chest','cable',2,'i','Alt göğüs.'],
 ['Incline Chest Press (Machine)','Eğimli makine press','chest','machine',1,'c','Üst göğüs.'],
 ['Smith Machine Bench Press','Smith makine bench','chest','machine',1,'c','Bar rayda; güvenli.'],
 ['Towel Row','Havlu ile ters kürek (kapı)','back','bodyweight',1,'c','Kapı koluna havlu; geriye yaslan, çek.'],
 ['Negative Pull Up','Negatif barfiks','back','bodyweight',2,'c','Yukarıdan 3–5 sn yavaş in.'],
 ['Scapular Pull Up','Kürek kemiği barfiksi','back','bodyweight',2,'i','Sadece kürek kemiklerini aşağı çek.'],
 ['Reverse Snow Angel','Ters kar meleği','back','bodyweight',1,'i','Yüzüstü, kolları yay gibi aç-kapa.','f'],
 ['Seal Row (Dumbbell)','Seal row','back','dumbbell',2,'c','Sehpaya yüzüstü; bel tamamen destekli.'],
 ['Shrug (Dumbbell)','Dumbbell shrug','back','dumbbell',1,'i','Trapez; tepede 2 sn.','m'],
 ['Shrug (Barbell)','Barbell shrug','back','barbell',1,'i','Trapez.'],
 ['Rack Pull (Barbell)','Rack pull','back','barbell',3,'c','Diz hizasından deadlift.'],
 ['Bent Over Row (EZ Bar)','EZ bar row','back','ezbar',2,'c','Ters tutuşla da olur.'],
 ['Kettlebell Gorilla Row','Kettlebell gorilla row','back','kettlebell',2,'c','İki kettlebell, sırayla çek.'],
 ['Kettlebell High Pull','Kettlebell high pull','back','kettlebell',2,'c','Kalçadan patlayıcı çekiş.'],
 ['Plate Pullover','Plaka pullover','back','plate',1,'i','Lat esnemesi.'],
 ['Band Straight Arm Pulldown','Bantlı düz kol pulldown','back','band',1,'i','Lat izolasyonu.'],
 ['Band Bent Over Row','Bantlı eğilerek row','back','band',1,'c','Bandın ortasına bas.','f'],
 ['Single Arm Cable Row','Tek kol kablo row','back','cable',1,'c','Gövde dönmesin.'],
 ['Close Grip Lat Pulldown','Dar tutuş lat pulldown','back','cable',1,'c','V tutamak.'],
 ['T-Bar Row (Machine)','T-bar row','back','machine',2,'c','Göğüs destekli.'],
 ['Back Extension','Back extension (bel)','back','machine',1,'i','Bel kasları; sırt nötr.'],
 ['Bear Crawl','Ayı yürüyüşü','shoulders','bodyweight',2,'t','Dizler yerden 2 cm yukarıda.'],
 ['Arm Circles','Kol çevirme','shoulders','bodyweight',1,'t','Küçükten büyüğe daireler.','f'],
 ['Front Raise (Dumbbell)','Dumbbell öne kaldırma','shoulders','dumbbell',1,'i','Göz hizasına kadar.'],
 ['Upright Row (Dumbbell)','Dumbbell dik çekiş','shoulders','dumbbell',1,'i','Dirsekler önde.'],
 ['Lu Raise (Dumbbell)','Lu raise','shoulders','dumbbell',2,'i','Hafif dumbbell, kollar baş üstüne.'],
 ['Z Press (Dumbbell)','Z press','shoulders','dumbbell',3,'c','Yerde, bacaklar düz; core sıkı.'],
 ['Bottoms Up Press (Kettlebell)','Ters kettlebell press','shoulders','kettlebell',3,'c','Omuz stabilitesi.'],
 ['Push Press (Barbell)','Push press','shoulders','barbell',3,'c','Bacaktan güç alarak it.'],
 ['Front Raise (EZ Bar)','EZ bar öne kaldırma','shoulders','ezbar',1,'i','Kontrollü.'],
 ['Plate Halo','Plaka halo','shoulders','plate',1,'i','Plakayı başın etrafında çevir.'],
 ['Band Face Pull','Bantlı face pull','shoulders','band',1,'i','Dirsekler yukarı, kürek sık.','m'],
 ['Front Raise (Band)','Bantlı öne kaldırma','shoulders','band',1,'i','Kontrollü.','f'],
 ['Band Upright Row','Bantlı dik çekiş','shoulders','band',1,'i','Bandın ortasına bas.'],
 ['Cable Rear Delt Fly','Kablo arka omuz fly','shoulders','cable',2,'i','Kollar çapraz.'],
 ['Cable Front Raise','Kablo öne kaldırma','shoulders','cable',1,'i','Sabit gerilim.'],
 ['Lateral Raise (Machine)','Makine yana açış','shoulders','machine',1,'i','Yan omuz.'],
 ['Towel Curl (Isometric)','Havlu curl (izometrik)','biceps','bodyweight',1,'t','Havluyu ayağının altından yukarı çek.'],
 ['Zottman Curl (Dumbbell)','Zottman curl','biceps','dumbbell',2,'i','Yukarı avuç yukarı, aşağı avuç aşağı.'],
 ['Spider Curl (Dumbbell)','Spider curl','biceps','dumbbell',2,'i','Eğimli sehpaya yüzüstü.'],
 ['Cross Body Hammer Curl','Çapraz çekiç curl','biceps','dumbbell',1,'i','Göğsün önünden çapraz.'],
 ['Reverse Curl (EZ Bar)','EZ bar ters curl','biceps','ezbar',1,'i','Ön kol da çalışır.'],
 ['Drag Curl (Barbell)','Drag curl','biceps','barbell',2,'i','Barı gövdeye sürterek çek.'],
 ['Kettlebell Hammer Curl','Kettlebell çekiç curl','biceps','kettlebell',1,'i','Kontrollü.'],
 ['Hammer Curl (Band)','Bantlı çekiç curl','biceps','band',1,'i','Tepede sık.','f'],
 ['Rope Hammer Curl (Cable)','Kablo halat çekiç curl','biceps','cable',1,'i','Brakialis.'],
 ['Bicep Curl (Machine)','Makine biceps curl','biceps','machine',1,'i','İzolasyon.'],
 ['Close Grip Push Up','Dar şınav','triceps','bodyweight',1,'c','Dirsekler gövdeye yakın.','f'],
 ['Bodyweight Skull Crusher','Vücut ağırlığı skull crusher','triceps','bodyweight',3,'i','Masa/bar kenarında.'],
 ['Tate Press (Dumbbell)','Tate press','triceps','dumbbell',2,'i','Dumbbellar göğüse doğru iner.'],
 ['Close Grip Dumbbell Press','Dar dumbbell press','triceps','dumbbell',1,'c','Dumbbellar birbirine değer.'],
 ['Kettlebell Overhead Extension','Kettlebell baş üstü triceps','triceps','kettlebell',1,'i','İki elle.'],
 ['JM Press (Barbell)','JM press','triceps','barbell',3,'c','İleri seviye.'],
 ['Overhead Extension (EZ Bar)','EZ bar baş üstü triceps','triceps','ezbar',1,'i','Uzun baş.'],
 ['Triceps Kickback (Band)','Bantlı triceps kickback','triceps','band',1,'i','Kol sabit.','f'],
 ['Single Arm Cable Pushdown','Tek kol kablo pushdown','triceps','cable',1,'i','Kontrollü.'],
 ['Cable Triceps Kickback','Kablo triceps kickback','triceps','cable',2,'i','Sabit gerilim.'],
 ['Seated Dip (Machine)','Makine dips','triceps','machine',1,'c','Güvenli dips.'],
 ['Jump Squat','Zıplamalı squat','quads','bodyweight',2,'c','Yumuşak iniş.','f'],
 ['Squat Pulse','Pulse squat (yaylanmalı)','quads','bodyweight',1,'c','Altta 2 küçük yaylanma.','f'],
 ['Sumo Squat','Sumo squat','quads','bodyweight',1,'c','Geniş duruş, parmak uçları dışa.','f'],
 ['Cossack Squat','Kazak squat','quads','bodyweight',2,'c','Yana derin squat; mobilite.'],
 ['Sissy Squat','Sissy squat','quads','bodyweight',3,'i','Diz önde, gövde geriye.'],
 ['Lateral Lunge','Yan lunge','quads','bodyweight',1,'c','Kalça geriye.'],
 ['Split Squat','Split squat','quads','bodyweight',1,'c','Ayaklar sabit, yukarı-aşağı.'],
 ['Burpee','Burpee','quads','bodyweight',2,'t','Zıplamasız versiyon: adımla.','f'],
 ['Step Up (Dumbbell)','Dumbbell basamak çıkma','quads','dumbbell',1,'c','Topuktan it.'],
 ['Front Squat (Dumbbell)','Dumbbell ön squat','quads','dumbbell',2,'c','Dumbbellar omuzda.'],
 ['Reverse Lunge (Dumbbell)','Dumbbell geri lunge','quads','dumbbell',1,'c','Dizlere rahat.'],
 ['Heels Elevated Goblet Squat','Topuk yüksek goblet squat','quads','dumbbell',2,'c','Topuklar plakada; ön bacak ağırlıklı.'],
 ['Kettlebell Front Rack Squat','Kettlebell ön squat','quads','kettlebell',2,'c','Dik gövde.'],
 ['Kettlebell Reverse Lunge','Kettlebell geri lunge','quads','kettlebell',1,'c','Kontrollü.'],
 ['Lunge (Barbell)','Barbell lunge','quads','barbell',2,'c','Denge önemli.'],
 ['Zercher Squat (Barbell)','Zercher squat','quads','barbell',3,'c','Bar dirsek içinde.'],
 ['Plate Lunge','Plakalı lunge','quads','plate',1,'c','Plaka göğüste.'],
 ['Overhead Plate Squat','Baş üstü plaka squat','quads','plate',2,'c','Mobilite + core.'],
 ['Band Split Squat','Bantlı split squat','quads','band',1,'c','Bant ön ayağın altında.'],
 ['Leg Extension (Band)','Bantlı leg extension','quads','band',1,'i','Oturarak, bant ayak bileğinde.'],
 ['Pendulum Squat (Machine)','Pendulum squat','quads','machine',2,'c','Ön bacak için çok etkili.'],
 ['Smith Machine Squat','Smith squat','quads','machine',1,'c','Ayaklar biraz önde.'],
 ['Hamstring Walkout','Köprüde hamstring yürüyüşü','hamstrings','bodyweight',2,'i','Köprüde topuklarla ileri-geri.'],
 ['Bodyweight Good Morning','Vücut ağırlığı good morning','hamstrings','bodyweight',1,'c','Eller ensede, kalçadan menteşe.','f'],
 ['Stiff Leg Deadlift (Dumbbell)','Dumbbell düz bacak deadlift','hamstrings','dumbbell',2,'c','Dizler hafif bükük.'],
 ['Leg Curl (Dumbbell)','Dumbbell leg curl (yüzüstü)','hamstrings','dumbbell',2,'i','Dumbbell ayakların arasında.'],
 ['Romanian Deadlift (Kettlebell)','Kettlebell Romen deadlift','hamstrings','kettlebell',1,'c','Kalçadan menteşe.'],
 ['Single Leg Deadlift (Kettlebell)','Kettlebell tek bacak deadlift','hamstrings','kettlebell',2,'c','Denge.'],
 ['Stiff Leg Deadlift (Barbell)','Barbell düz bacak deadlift','hamstrings','barbell',2,'c','Bar bacağa yakın.'],
 ['Plate Romanian Deadlift','Plaka Romen deadlift','hamstrings','plate',1,'c','Plakayı iki elle tut.'],
 ['Band Romanian Deadlift','Bantlı Romen deadlift','hamstrings','band',1,'c','Bandın ortasına bas.','f'],
 ['Standing Leg Curl (Band)','Ayakta bantlı leg curl','hamstrings','band',1,'i','Bant ayak bileğinde.'],
 ['Standing Cable Leg Curl','Ayakta kablo leg curl','hamstrings','cable',1,'i','Kalça sabit.'],
 ['Cable Romanian Deadlift','Kablo Romen deadlift','hamstrings','cable',1,'c','Sabit gerilim.'],
 ['Glute Ham Raise (Machine)','Glute ham raise','hamstrings','machine',3,'i','Çok zorlu; yavaş in.'],
 ['Single Leg Hip Thrust','Tek bacak hip thrust','glutes','bodyweight',2,'c','Sırt kanepede.','f'],
 ['Glute Bridge March','Köprüde yürüyüş','glutes','bodyweight',1,'c','Kalça yukarıda sabit.','f'],
 ['Side Lying Leg Raise','Yan yatış bacak kaldırma','glutes','bodyweight',1,'i','Yan kalça.','f'],
 ['Standing Kickback','Ayakta geri tekme','glutes','bodyweight',1,'i','Bel çukurlaşmasın.','f'],
 ['Curtsy Lunge','Reverans lunge','glutes','bodyweight',1,'c','Her bacak için tekrar.','f'],
 ['B-Stance Hip Thrust (Dumbbell)','B-duruş hip thrust','glutes','dumbbell',2,'c','Yükün çoğu bir bacakta.','f'],
 ['Glute Bridge (Dumbbell)','Dumbbell köprü','glutes','dumbbell',1,'c','Dumbbell kalçada.','f'],
 ['Curtsy Lunge (Dumbbell)','Dumbbell reverans lunge','glutes','dumbbell',2,'c','Kontrollü.','f'],
 ['Deficit Reverse Lunge (Dumbbell)','Derin geri lunge','glutes','dumbbell',2,'c','Ön ayak basamakta.'],
 ['Kettlebell Hip Thrust','Kettlebell hip thrust','glutes','kettlebell',1,'c','Kettlebell kalçada.'],
 ['Glute Bridge (Barbell)','Barbell köprü','glutes','barbell',1,'c','Yerden.'],
 ['Sumo Deadlift (Barbell)','Barbell sumo deadlift','glutes','barbell',2,'c','Geniş duruş.'],
 ['Plate Sumo Squat','Plakalı sumo squat','glutes','plate',1,'c','Plaka bacakların arasında.','f'],
 ['Monster Walk (Band)','Bantlı çapraz yürüyüş','glutes','band',1,'i','Yarım squatta çapraz adım.','f'],
 ['Donkey Kick (Band)','Bantlı donkey kick','glutes','band',1,'i','Bel sabit.','f'],
 ['Fire Hydrant (Band)','Bantlı fire hydrant','glutes','band',1,'i','Yan kalça.','f'],
 ['Standing Hip Abduction (Band)','Ayakta bantlı yana açış','glutes','band',1,'i','Gövde dik.','f'],
 ['Hip Thrust (Band)','Bantlı hip thrust','glutes','band',1,'c','Bant kalça üstünde, uçlar ayakta.','f'],
 ['Cable Hip Abduction','Kablo yana açış (kalça)','glutes','cable',1,'i','Yan kalça.','f'],
 ['Hip Thrust (Machine)','Hip thrust makinesi','glutes','machine',1,'c','Kalça için en etkili.'],
 ['Glute Kickback (Machine)','Kickback makinesi','glutes','machine',1,'i','Hareket kalçadan.','f'],
 ['Pogo Hops','Pogo zıplama','calves','bodyweight',2,'i','Ayak bileğinden zıpla.'],
 ['Tibialis Raise','Tibialis kaldırma','calves','bodyweight',1,'i','Sırt duvarda, ayak uçlarını kaldır.'],
 ['Single Leg Calf Raise (Dumbbell)','Dumbbell tek bacak baldır','calves','dumbbell',2,'i','Basamakta.'],
 ['Kettlebell Calf Raise','Kettlebell baldır kaldırma','calves','kettlebell',1,'i','Tam aşağı in.'],
 ['Calf Raise (Smith Machine)','Smith baldır kaldırma','calves','machine',1,'i','Basamakta.'],
 ['Crunch','Mekik','core','bodyweight',1,'i','Bel yerde.'],
 ['Bicycle Crunch','Bisiklet mekik','core','bodyweight',1,'i','Dirsek karşı dize.'],
 ['Mountain Climber','Mountain climber','core','bodyweight',1,'t','Kalça omuz hizasında.','f'],
 ['Plank Shoulder Tap','Plankta omuza dokunma','core','bodyweight',1,'i','Kalça sallanmasın.','f'],
 ['Plank Hip Dip','Plankta kalça düşürme','core','bodyweight',1,'i','Dirsek plankında.','f'],
 ['Up and Down Plank','Yukarı-aşağı plank','core','bodyweight',2,'i','Dirsekten ele.','f'],
 ['Flutter Kick','Makas (flutter kick)','core','bodyweight',1,'t','Bel yere yapışık.','f'],
 ['Jack Knife','Çakı (jack knife)','core','bodyweight',2,'i','Eller ve ayaklar ortada buluşur.','f'],
 ['Boat Pose','Kayık duruşu','core','bodyweight',2,'t','Sırt düz.','f'],
 ['Roll Up','Pilates roll-up','core','bodyweight',2,'i','Omurgayı tek tek yuvarla.','f'],
 ['Single Leg Stretch','Tek bacak germe (pilates)','core','bodyweight',1,'i','Baş ve omuzlar yukarıda.','f'],
 ['The Hundred','Pilates hundred','core','bodyweight',2,'t','Kollar pompalarken nefes al-ver.','f'],
 ['V-Up','V-up','core','bodyweight',3,'i','Kollar ve bacaklar birlikte.'],
 ['L-Sit','L-sit','core','bodyweight',3,'t','İki sandalye arasında.'],
 ['Copenhagen Plank','Kopenhag plank','core','bodyweight',3,'t','İç bacak + oblik.'],
 ['Plank Jack','Plank jack','core','bodyweight',2,'t','Ayakları açıp kapa.','f'],
 ['X Plank','X plank','core','bodyweight',2,'i','Zıt kol-bacağı dışa aç.','f'],
 ['Weighted Crunch (Dumbbell)','Ağırlıklı mekik','core','dumbbell',1,'i','Dumbbell göğüste.'],
 ['Suitcase Carry (Dumbbell)','Bavul taşıma','core','dumbbell',1,'t','Tek elde ağırlık, dik yürü.','m'],
 ['Farmer Carry (Dumbbell)','Çiftçi yürüyüşü','core','dumbbell',1,'t','Tutuş ve core.','m'],
 ['Turkish Get Up (Kettlebell)','Türk kalkışı','core','kettlebell',3,'i','Yavaş ve kontrollü.'],
 ['Kettlebell Windmill','Kettlebell yel değirmeni','core','kettlebell',2,'i','Oblik ve omuz.'],
 ['Plate Russian Twist','Plakalı Rus twist','core','plate',1,'i','Tekrar = iki taraf.'],
 ['Plate Crunch','Plakalı mekik','core','plate',1,'i','Plaka göğüste.'],
 ['Band Dead Bug','Bantlı ölü böcek','core','band',1,'i','Bant kollarda gerili.','f'],
 ['Band Woodchop','Bantlı woodchop','core','band',1,'i','Gövde dönüşü.'],
 ['Captain Chair Leg Raise (Machine)','Kaptan sandalyesi bacak kaldırma','core','machine',2,'i','Sallanmadan.']
);
// Eski hazır programlardaki (kadın / erkek ev) hareketleri veritabanına aktar
(()=>{const tag={w:'f',wb:'f',m:'m'};const C=/press|push|row|pull|squat|lunge|dead|thrust|bridge|dip|step|burpee|walk/i;
  const eqOf=n=>/band/i.test(n)?'band':/dumbbell/i.test(n)?'dumbbell':'bodyweight';
  const add=(en,tr,m,t,note,tg,lv)=>{if(!en||XDB.some(x=>x[0]===en)||!GMUS.some(g=>g[0]===m))return;XDB.push([en,tr||en,m,eqOf(en),lv,t?'t':C.test(en)?'c':'i',note||'',tg])};
  Object.entries(HOME_PROGRAMS).forEach(([k,g])=>g.plans.forEach(p=>p.exercises.forEach(e=>{const lv=/HIIT/.test(p.name)?2:1;
    add(e.name,e.tr,e.muscle,e.t,e.note,tag[k],lv);if(e.alt){const a=altP(e.alt);add(a.en,a.tr,e.muscle,a.t,'',tag[k],lv)}})))})();

const XDB_EXTRA=[
 // GÖĞÜS
 ['Knee Push Up','Diz üstü şınav','chest','bodyweight',1,'c','15 temiz tekrar olunca tam şınava geç.','w'],
 ['Wide Push Up','Geniş şınav','chest','bodyweight',1,'c','Eller omuzdan geniş; göğüs ağırlıklı.',''],
 ['Archer Push Up','Okçu şınav','chest','bodyweight',3,'c','Ağırlık bir kola biner; tek kol şınava hazırlık.','m'],
 ['Plyometric Push Up','Patlayıcı şınav','chest','bodyweight',3,'c','Ellerin yerden kalksın; yumuşak in.','m'],
 ['Push Up (Banded)','Bantlı şınav','chest','band',2,'c','Bandı sırtından dola, uçları avuçlarının altında.','m'],
 ['Band Incline Press','Bantlı eğimli press','chest','band',1,'c','Bant aşağıda sabit; yukarı doğru it.',''],
 ['Squeeze Press (Dumbbell)','Sıkıştırmalı dumbbell press','chest','dumbbell',1,'c','Dumbbell\'ları birbirine bastırarak it.',''],
 ['Decline Dumbbell Press','Ters eğimli dumbbell press','chest','dumbbell',2,'c','Alt göğüs.','m'],
 ['Floor Fly (Dumbbell)','Yerde dumbbell fly','chest','dumbbell',1,'i','Dirsekler yere değince dur; omuz için güvenli.','w'],
 ['Single Arm Dumbbell Press','Tek kol dumbbell press','chest','dumbbell',2,'c','Core da çalışır; gövde dönmesin.',''],
 ['Kettlebell Squeeze Press','Kettlebell sıkıştırmalı press','chest','kettlebell',1,'c','Kettlebell\'ı iki elle sıkıştır.',''],
 ['Decline Bench Press (Barbell)','Ters eğimli barbell bench','chest','barbell',2,'c','Alt göğüs.','m'],
 ['Floor Press (Barbell)','Yerde barbell press','chest','barbell',2,'c','Omuza dost kısa hareket açıklığı.','m'],
 ['Landmine Press','Landmine press','chest','barbell',2,'c','Barın ucu köşede sabit; tek kol it.',''],
 ['Plate Push Up Press','Plaka ile press (yerde)','chest','plate',1,'c','Yerde sırtüstü, plakayı göğüsten it.','w'],
 ['Low to High Cable Fly','Aşağıdan yukarı kablo fly','chest','cable',2,'i','Üst göğüs.',''],
 ['High to Low Cable Fly','Yukarıdan aşağı kablo fly','chest','cable',2,'i','Alt göğüs.',''],
 ['Single Arm Cable Press','Tek kol kablo press','chest','cable',2,'c','Adım önde, gövde sabit.',''],
 ['Incline Chest Press (Machine)','Eğimli makine göğüs press','chest','machine',1,'c','Üst göğüs.',''],
 ['Smith Machine Bench Press','Smith makinesinde bench','chest','machine',2,'c','Güvenli ağır yükleme.','m'],
 // SIRT
 ['Doorframe Row','Kapı çerçevesinde row','back','bodyweight',1,'c','Kapı kasasını tut, geriye yaslan, kendini çek.','w'],
 ['Negative Pull Up','Negatif barfiks','back','bodyweight',2,'c','Sandalyeden yukarı çık, 3–5 sn\'de in.',''],
 ['Scapular Pull Up','Skapular barfiks','back','bodyweight',2,'i','Kollar düz; sadece kürek kemiklerini çek.',''],
 ['Reverse Snow Angel','Ters kar meleği','back','bodyweight',1,'i','Yüzüstü; kolları yerden kaldırıp yay çiz.','w'],
 ['Floor Back Extension','Yerde sırt ekstansiyonu','back','bodyweight',1,'i','Bel kasları; kontrollü.','w'],
 ['Shrug (Dumbbell)','Dumbbell shrug','back','dumbbell',1,'i','Tepede 2 sn bekle.','m'],
 ['Kroc Row (Dumbbell)','Kroc row','back','dumbbell',3,'c','Ağır, yüksek tekrarlı tek kol row.','m'],
 ['Seal Row (Dumbbell)','Yüzüstü dumbbell row','back','dumbbell',2,'c','Sehpaya yüzüstü; beli tamamen korur.',''],
 ['Kettlebell High Pull','Kettlebell high pull','back','kettlebell',2,'c','Kalça itişiyle çeneye çek.',''],
 ['Kettlebell Deadlift','Kettlebell deadlift','back','kettlebell',1,'c','Kalçadan menteşe; sırt düz.','w'],
 ['Shrug (Barbell)','Barbell shrug','back','barbell',1,'i','Trapez.','m'],
 ['Rack Pull','Rack pull','back','barbell',3,'c','Diz hizasından deadlift.','m'],
 ['T-Bar Row (Landmine)','Landmine T-bar row','back','barbell',2,'c','Göğsü öne çıkar, dirsekleri geri çek.','m'],
 ['Pullover (EZ Bar)','EZ bar pullover','back','ezbar',2,'i','Lat esnemesi.',''],
 ['Plate Pullover','Plaka pullover','back','plate',1,'i','Sırtüstü; plakayı baş arkasına indir.',''],
 ['Band Straight Arm Pulldown','Bantlı düz kol pulldown','back','band',1,'i','Kollar düz, kalçaya doğru çek.',''],
 ['Bent Over Row (Band)','Bantlı eğilerek row','back','band',1,'c','Bandın ortasına bas.','w'],
 ['Single Arm Cable Row','Tek kol kablo row','back','cable',1,'c','Önde tam esne.',''],
 ['Close Grip Lat Pulldown','Dar tutuş lat pulldown','back','cable',1,'c','V-tutacakla.',''],
 ['Lat Pulldown (Machine)','Makine lat pulldown','back','machine',1,'c','Göğsü yukarı.',''],
 ['T-Bar Row (Machine)','Makine T-bar row','back','machine',2,'c','Göğüs destekli.','m'],
 ['Back Extension (Machine)','45° sırt ekstansiyonu','back','machine',1,'i','Bel ve kalça.',''],
 // OMUZ
 ['Wall Slide','Duvar kaydırma','shoulders','bodyweight',1,'i','Sırt duvarda, kolları yukarı kaydır.','w'],
 ['Inchworm','Tırtıl (inchworm)','shoulders','bodyweight',1,'c','Ellerle öne yürü, plankta dur, geri gel.','w'],
 ['Upright Row (Dumbbell)','Dumbbell dik çekiş','shoulders','dumbbell',1,'i','Dirsekler omuz hizasına kadar.',''],
 ['Lu Raise (Dumbbell)','Lu raise','shoulders','dumbbell',2,'i','Kollar düz, yandan baş üstüne.',''],
 ['Lean Away Lateral Raise','Yaslanarak yana açış','shoulders','dumbbell',3,'i','Bir elle direğe tutun; tek kol.','m'],
 ['Cuban Press (Dumbbell)','Cuban press','shoulders','dumbbell',2,'i','Rotator manşet ve arka omuz.',''],
 ['Bottoms Up Kettlebell Press','Ters kettlebell press','shoulders','kettlebell',3,'c','Kettlebell baş aşağı; omuz stabilitesi.',''],
 ['Push Press (Barbell)','Push press','shoulders','barbell',3,'c','Bacak itişiyle press.','m'],
 ['Z Press (Barbell)','Z press','shoulders','barbell',3,'c','Yerde oturarak press; core sıkı.','m'],
 ['Front Raise (Barbell)','Barbell öne kaldırma','shoulders','barbell',1,'i','Ön omuz.',''],
 ['Front Raise (EZ Bar)','EZ bar öne kaldırma','shoulders','ezbar',1,'i','Ön omuz.',''],
 ['Plate Halo','Plaka halo','shoulders','plate',1,'i','Plakayı başının etrafında çevir.','w'],
 ['Upright Row (Band)','Bantlı dik çekiş','shoulders','band',1,'i','Bandın ortasına bas.',''],
 ['Front Raise (Band)','Bantlı öne kaldırma','shoulders','band',1,'i','Göz hizasına kadar.','w'],
 ['Face Pull (Band)','Bantlı face pull','shoulders','band',1,'i','Omuz arkası ve duruş.',''],
 ['Cable Rear Delt Fly','Kablo arka omuz fly','shoulders','cable',2,'i','Kablolar çapraz.',''],
 ['Cable Y Raise','Kablo Y raise','shoulders','cable',2,'i','Yan ve arka omuz.',''],
 ['Front Raise (Cable)','Kablo öne kaldırma','shoulders','cable',1,'i','Ön omuz.',''],
 ['Lateral Raise (Machine)','Makine yana açış','shoulders','machine',1,'i','Yan omuz.',''],
 // BICEPS
 ['Towel Isometric Curl','Havlu izometrik curl','biceps','bodyweight',1,'t','Havluyu ayağınla sabitle, yukarı çekip tut.',''],
 ['Zottman Curl (Dumbbell)','Zottman curl','biceps','dumbbell',2,'i','Yukarı avuç yukarı, aşağı avuç aşağı.',''],
 ['Spider Curl (Dumbbell)','Spider curl','biceps','dumbbell',2,'i','Eğimli sehpaya yüzüstü.',''],
 ['Cross Body Hammer Curl','Çapraz çekiç curl','biceps','dumbbell',1,'i','Dumbbell karşı omza.','m'],
 ['Hammer Curl (Kettlebell)','Kettlebell çekiç curl','biceps','kettlebell',1,'i','Sapı dik tut.',''],
 ['Drag Curl (Barbell)','Drag curl','biceps','barbell',2,'i','Barı gövdeye sürterek çek.','m'],
 ['Reverse Curl (EZ Bar)','EZ bar ters curl','biceps','ezbar',1,'i','Ön kol ve brakialis.',''],
 ['Spider Curl (EZ Bar)','EZ bar spider curl','biceps','ezbar',2,'i','Tepede sık.',''],
 ['Hammer Curl (Band)','Bantlı çekiç curl','biceps','band',1,'i','Dirsek sabit.','w'],
 ['Rope Hammer Curl (Cable)','Halat çekiç curl','biceps','cable',1,'i','Halatı açarak çek.',''],
 ['High Cable Curl','Yüksek kablo curl','biceps','cable',2,'i','Kollar omuz hizasında.',''],
 ['Bicep Curl (Machine)','Makine biceps curl','biceps','machine',1,'i','İzolasyon.',''],
 // TRICEPS
 ['Close Grip Push Up','Dar şınav','triceps','bodyweight',1,'c','Dirsekler gövdeye yakın.','w'],
 ['Bodyweight Triceps Extension','Masada triceps ekstansiyonu','triceps','bodyweight',2,'i','Ellerini masaya koy, alnını ellere indir.','m'],
 ['Tate Press (Dumbbell)','Tate press','triceps','dumbbell',2,'i','Dumbbell\'ları göğse doğru indir.',''],
 ['Close Grip Dumbbell Press','Dar tutuş dumbbell press','triceps','dumbbell',1,'c','Dumbbell\'lar birbirine değsin.',''],
 ['Overhead Extension (Kettlebell)','Kettlebell baş üstü triceps','triceps','kettlebell',1,'i','İki elle.',''],
 ['JM Press (Barbell)','JM press','triceps','barbell',3,'c','Bench ile skull crusher arası.','m'],
 ['Overhead Extension (EZ Bar)','EZ bar baş üstü triceps','triceps','ezbar',2,'i','Uzun baş.',''],
 ['Triceps Kickback (Band)','Bantlı triceps kickback','triceps','band',1,'i','Kol gövdeye paralel.','w'],
 ['Rope Pushdown (Cable)','Halat pushdown','triceps','cable',1,'i','Altta halatı aç.',''],
 ['Single Arm Cable Pushdown','Tek kol kablo pushdown','triceps','cable',1,'i','Ters tutuş da olur.',''],
 ['Cable Kickback (Triceps)','Kablo triceps kickback','triceps','cable',2,'i','Sabit gerilim.',''],
 ['Seated Dip (Machine)','Makine dips','triceps','machine',1,'c','Güvenli dips.',''],
 // ÖN BACAK
 ['Squat Pulse','Pulse squat (yaylanmalı)','quads','bodyweight',1,'c','Dibe in, 2 küçük yaylanma, kalk.','w'],
 ['Jump Squat','Zıplamalı squat','quads','bodyweight',2,'c','Yumuşak in; dizler içe kaçmasın.','w'],
 ['Sumo Squat','Sumo squat','quads','bodyweight',1,'c','Ayaklar geniş, parmaklar dışa.','w'],
 ['Split Squat','Split squat','quads','bodyweight',1,'c','Yerinde lunge.',''],
 ['Lateral Lunge','Yan lunge','quads','bodyweight',1,'c','Kalçayı geriye ver, tek tarafa otur.','w'],
 ['Cossack Squat','Kazak squat','quads','bodyweight',2,'c','Derin yan squat; hareketlilik.',''],
 ['Sissy Squat','Sissy squat','quads','bodyweight',3,'i','Dizler öne, gövde geriye; destek al.','m'],
 ['Lunge to High Knee','Lunge + diz çekme','quads','bodyweight',2,'c','HIIT tarzı; her sette bacak değiştir.','w'],
 ['Static Lunge + Triceps (Band)','Statik lunge + bantlı triceps','quads','band',1,'c','Bacak, core ve kol birlikte.','w'],
 ['Heel Elevated Goblet Squat','Topuk yükseltili goblet squat','quads','dumbbell',2,'c','Topuklar kitap üstünde; ön bacak ağırlıklı.',''],
 ['Front Squat (Dumbbell)','Dumbbell ön squat','quads','dumbbell',2,'c','Dumbbell\'lar omuzda.',''],
 ['Step Up (Dumbbell)','Dumbbell basamak çıkma','quads','dumbbell',1,'c','Ön bacakla it.','w'],
 ['Reverse Lunge (Dumbbell)','Dumbbell geri lunge','quads','dumbbell',1,'c','Dizlere rahat.',''],
 ['Front Rack Squat (Kettlebell)','Kettlebell önde squat','quads','kettlebell',2,'c','İki kettlebell göğüste.',''],
 ['Reverse Lunge (Kettlebell)','Kettlebell geri lunge','quads','kettlebell',1,'c','Kettlebell göğüste.',''],
 ['Reverse Lunge (Barbell)','Barbell geri lunge','quads','barbell',2,'c','Bar sırtta.','m'],
 ['Zercher Squat','Zercher squat','quads','barbell',3,'c','Bar dirsek içinde.','m'],
 ['Overhead Plate Lunge','Baş üstü plakalı lunge','quads','plate',2,'c','Plaka baş üstünde; core sıkı.',''],
 ['Split Squat (Band)','Bantlı split squat','quads','band',1,'c','Bant ön ayağın altında.',''],
 ['Leg Extension (Band)','Bantlı leg extension','quads','band',1,'i','Oturarak; bant ayak bileğinde.',''],
 ['Cable Goblet Squat','Kablo goblet squat','quads','cable',1,'c','Kablo önden.',''],
 ['Smith Machine Squat','Smith makinesinde squat','quads','machine',1,'c','Ayaklar hafif önde.',''],
 ['Pendulum Squat (Machine)','Pendulum squat','quads','machine',2,'c','Ön bacak için çok etkili.','m'],
 // ARKA BACAK
 ['Feet Elevated Glute Bridge','Ayaklar yüksekte köprü','hamstrings','bodyweight',1,'i','Topuklar kanepede; arka bacak.','w'],
 ['Hamstring Walkout','Köprüde topuk yürüyüşü','hamstrings','bodyweight',2,'i','Köprüde topuklarla öne-geri adım.','w'],
 ['Stiff Leg Deadlift (Dumbbell)','Dumbbell düz bacak deadlift','hamstrings','dumbbell',2,'c','Dizler neredeyse düz.',''],
 ['Lying Leg Curl (Dumbbell)','Dumbbell yatarak leg curl','hamstrings','dumbbell',2,'i','Dumbbell ayakların arasında.',''],
 ['Romanian Deadlift (Kettlebell)','Kettlebell Romen deadlift','hamstrings','kettlebell',1,'c','Kalçadan menteşe.','w'],
 ['Single Leg RDL (Kettlebell)','Kettlebell tek bacak RDL','hamstrings','kettlebell',2,'c','Denge ve arka bacak.',''],
 ['Stiff Leg Deadlift (Barbell)','Barbell düz bacak deadlift','hamstrings','barbell',2,'c','Esnemeyi hisset.','m'],
 ['Romanian Deadlift (Band)','Bantlı Romen deadlift','hamstrings','band',1,'c','Bandın ortasına bas.','w'],
 ['Band Pull Through','Bantlı pull-through','hamstrings','band',1,'c','Bant arkada sabit; kalçayı öne it.',''],
 ['Standing Cable Leg Curl','Ayakta kablo leg curl','hamstrings','cable',2,'i','Tek bacak.',''],
 ['Glute Ham Raise (Machine)','Glute ham raise','hamstrings','machine',3,'i','Çok etkili, zor.','m'],
 // KALÇA
 ['Curtsy Lunge','Reverans lunge','glutes','bodyweight',1,'c','Bacağı çapraz arkaya at.','w'],
 ['Glute Bridge March','Köprüde yürüyüş','glutes','bodyweight',1,'c','Kalça yukarıda sabit; dizleri sırayla çek.','w'],
 ['Hip Thrust (Bodyweight)','Vücut ağırlığı hip thrust','glutes','bodyweight',1,'c','Sırt kanepede.','w'],
 ['Single Leg Hip Thrust','Tek bacak hip thrust','glutes','bodyweight',2,'c','Kalça düşmesin.',''],
 ['Side Lying Leg Lift','Yan yatış bacak kaldırma','glutes','bodyweight',1,'i','Bacak düz, ayak ucu hafif aşağı.','w'],
 ['Standing Kickback','Ayakta geri tekme','glutes','bodyweight',1,'i','Bel çukurlaşmasın.','w'],
 ['Donkey Kick (Band)','Bantlı donkey kick','glutes','band',1,'i','Bant dizlerin üstünde.','w'],
 ['Standing Kickback (Band)','Ayakta bantlı geri tekme','glutes','band',1,'i','Bant bileklerde.','w'],
 ['Side Lying Leg Lift (Band)','Bantlı yan bacak kaldırma','glutes','band',1,'i','Yan kalça.','w'],
 ['Monster Walk (Band)','Bantlı çapraz yürüyüş','glutes','band',1,'i','Yarım squatta çapraz adımlar.','w'],
 ['Hip Thrust (Band)','Bantlı hip thrust','glutes','band',1,'c','Bant kalçanın üstünden yere sabit.','w'],
 ['Deficit Reverse Lunge (Dumbbell)','Yükseltiden dumbbell geri lunge','glutes','dumbbell',2,'c','Basamak üstünden geriye adım; kalça esner.','w'],
 ['Curtsy Lunge (Dumbbell)','Dumbbell reverans lunge','glutes','dumbbell',2,'c','Yan kalça.','w'],
 ['Single Leg Hip Thrust (Dumbbell)','Dumbbell tek bacak hip thrust','glutes','dumbbell',2,'c','Dumbbell kalçada.',''],
 ['Frog Pump (Dumbbell)','Dumbbell frog pump','glutes','dumbbell',1,'i','Ayak tabanları birleşik.','w'],
 ['Glute Bridge (Kettlebell)','Kettlebell köprü','glutes','kettlebell',1,'c','Kettlebell kalçada.','w'],
 ['Glute Bridge (Barbell)','Barbell köprü','glutes','barbell',1,'c','Yerde, bar kalçada.','w'],
 ['Sumo Deadlift (Barbell)','Barbell sumo deadlift','glutes','barbell',2,'c','Geniş duruş.','m'],
 ['Frog Pump (Plate)','Plakalı frog pump','glutes','plate',1,'i','Plaka kalçada.','w'],
 ['Cable Hip Abduction','Kablo yana açış (bacak)','glutes','cable',1,'i','Yan kalça.','w'],
 ['Glute Kickback (Machine)','Makine geri tekme','glutes','machine',1,'i','Kalça izolasyonu.','w'],
 ['Hip Thrust (Machine)','Makine hip thrust','glutes','machine',1,'c','Kolay ağır yükleme.','w'],
 // BALDIR
 ['Pogo Hops','Yerinde sekme (pogo)','calves','bodyweight',2,'t','Dizler hafif bükük, ayak uçlarında sek.',''],
 ['Tibialis Raise','Tibialis (ön kaval) kaldırma','calves','bodyweight',1,'i','Sırt duvarda, ayak uçlarını kaldır.',''],
 ['Single Leg Calf Raise (Dumbbell)','Dumbbell tek bacak baldır','calves','dumbbell',2,'i','Basamakta.','m'],
 ['Calf Raise (Kettlebell)','Kettlebell baldır kaldırma','calves','kettlebell',1,'i','Basamakta.',''],
 ['Smith Machine Calf Raise','Smith makinesinde baldır','calves','machine',1,'i','Plakanın üstünde.',''],
 ['Standing Cable Calf Raise','Kablo baldır kaldırma','calves','cable',1,'i','Kemer veya tutacakla.',''],
 // KARIN / CORE
 ['Plank Hip Dip','Plank\'te kalça düşürme','core','bodyweight',1,'i','Dirsek plankta kalçayı yanlara indir.','w'],
 ['Jack Knife','Çakı (jack knife)','core','bodyweight',2,'i','Eller ve ayaklar ortada buluşur.','w'],
 ['Boat Pose','Kayık duruşu','core','bodyweight',2,'t','Sırt düz; dizler bükülü başlayabilirsin.','w'],
 ['Russian Twist','Rus twist','core','bodyweight',1,'i','Tekrar = iki taraf.','w'],
 ['Bicycle Crunch','Bisiklet mekik','core','bodyweight',1,'i','Dirsek karşı dize, yavaş.','w'],
 ['Crunch','Mekik','core','bodyweight',1,'i','Boynu çekme.',''],
 ['Flutter Kick','Makas vuruşu','core','bodyweight',1,'t','Bel yerde.','w'],
 ['Mountain Climber','Mountain climber','core','bodyweight',1,'t','Kalça omuz hizasında.','w'],
 ['Plank Jack','Plank jack','core','bodyweight',2,'t','Ayakları açıp kapa.','w'],
 ['Burpee','Burpee','core','bodyweight',2,'t','Düşük tempolu versiyon: zıplamadan.','w'],
 ['X Plank','X plank','core','bodyweight',2,'i','Zıt kol-bacağı dışa aç.','w'],
 ['Shoulder Tap','Plank\'te omuza dokunma','core','bodyweight',1,'i','Kalça sallanmasın.','w'],
 ['Up and Down Plank','Yukarı-aşağı plank (commando)','core','bodyweight',2,'i','Dirsekten ele, elden dirseğe.','w'],
 ['Bear Crawl Hold','Ayı tutuşu','core','bodyweight',2,'t','Dizler yerden 2–3 cm.',''],
 ['Copenhagen Plank','Kopenhag plank','core','bodyweight',3,'t','Üst bacak sandalyede; iç bacak.','m'],
 ['L-Sit','L-sit','core','bodyweight',3,'t','İki sandalye arasında.','m'],
 ['Roll Up (Band)','Bant destekli roll-up','core','band',1,'i','Pilates; omurgayı tek tek yuvarla.','w'],
 ['Dead Bug (Band)','Bantlı ölü böcek','core','band',1,'i','Bel yere yapışık.','w'],
 ['Leg Circles (Band)','Bantlı bacak çevirme','core','band',1,'i','Pilates; leğen sabit.','w'],
 ['Plank Leg Lift (Mini Band)','Bantlı plank bacak kaldırma','core','band',2,'i','Bant bileklerde.','w'],
 ['Band Woodchop','Bantlı woodchop','core','band',1,'i','Çapraz çekiş.',''],
 ['Dead Bug (Dumbbell)','Dumbbell ölü böcek','core','dumbbell',2,'i','Dumbbell elde.',''],
 ['Weighted Crunch (Dumbbell)','Dumbbell mekik','core','dumbbell',1,'i','Dumbbell göğüste.',''],
 ['Suitcase Carry (Dumbbell)','Tek el dumbbell taşıma','core','dumbbell',1,'t','Gövde eğilmesin; yürü.','m'],
 ['Kettlebell Windmill','Kettlebell windmill','core','kettlebell',3,'i','Kettlebell yukarıda, yana eğil.',''],
 ['Turkish Get Up (Kettlebell)','Türk kalkışı','core','kettlebell',3,'c','Yavaş ve kontrollü.','m'],
 ['Russian Twist (Plate)','Plakalı Rus twist','core','plate',1,'i','Plakayı yanlara değdir.',''],
 ['Plate Sit Up','Plakalı mekik','core','plate',2,'i','Plaka göğüste.',''],
 ['Landmine Rotation','Landmine rotasyon','core','barbell',2,'i','Barın ucunu yay çizerek çevir.','m'],
 ['Pallof Press (Cable)','Kablo Pallof press','core','cable',1,'i','Dönmeye direnç.',''],
 ['Captain\'s Chair Leg Raise','Kaptan sandalyesi bacak kaldırma','core','machine',1,'i','Sırt pede yaslı.','']
];

XDB_EXTRA.forEach(x=>{if(!XDB.some(y=>y[0]===x[0]))XDB.push([...x.slice(0,7),x[7]==='w'?'f':x[7]])});
const XBY=Object.fromEntries(XDB.map(x=>[x[0],x]));
/* ACSM 2009 + hipertrofi literatürüne göre seviye reçetesi */
const RX={1:{c:[3,10,12],i:[2,12,15],t:[2,20,30],rest:'60–90 sn',tip:'Tekniği öğren; son 2–3 tekrar zorlasın ama formu bozma.'},
          2:{c:[3,8,12],i:[3,10,15],t:[3,30,45],rest:'90 sn – 2 dk',tip:'Her sette tükenişe 1–2 tekrar kala bitir (RPE 8–9).'},
          3:{c:[4,6,10],i:[3,10,15],t:[3,45,60],rest:'Ağır hareketlerde 2–3 dk',tip:'Ağır çok eklemlilerle başla; izole hareketlerde son seti tükenişe yakın bitir.'}};
/* ---------- bölge (alt/üst göğüs, ön/yan/arka omuz, alt/üst/yan karın, sırt) ---------- */
const MSUB={chest:[['upper','Üst göğüs'],['mid','Orta göğüs'],['lower','Alt göğüs']],
 shoulders:[['front','Ön omuz'],['side','Yan omuz'],['rear','Arka omuz']],
 core:[['upper','Üst karın'],['lower','Alt karın'],['obl','Yan karın']],
 back:[['lat','Kanat (genişlik)'],['mid','Orta sırt'],['trap','Trapez & bel']]};
function subOf(x){const n=x[0],m=x[2];
  if(m==='chest'){if(/incline (bench|dumbbell|chest)|low to high|landmine|decline push up|incline press|band incline/i.test(n))return['upper'];
    if(/decline (bench|dumbbell)|dip|high to low|incline push up|knee push/i.test(n))return['lower'];return['mid']}
  if(m==='shoulders'){const o=[];if(/press|front raise|arnold|pike|handstand|inchworm|halo/i.test(n))o.push('front');
    if(/lateral|upright|lu raise|y raise|halo|cuban/i.test(n))o.push('side');if(/rear|face pull|pull-?apart|reverse pec|cuban|wall slide|reverse fly/i.test(n))o.push('rear');return o.length?o:['front']}
  if(m==='core'){const o=[];if(/twist|side|woodchop|windmill|pallof|hip dip|copenhagen|suitcase|farmer|bicycle|rotation|halo|carry|x plank|shoulder tap/i.test(n))o.push('obl');
    if(/reverse crunch|leg raise|knee raise|flutter|leg circles|dead bug|hollow|l-sit|dragon|mountain|boat|knee tuck|captain|jack knife|plank jack|burpee|bear|scissor|leg lift/i.test(n))o.push('lower');
    if((/crunch|sit up|roll up|jack knife|rollout|bicycle|v-up/i.test(n))&&!/reverse crunch/i.test(n))o.push('upper');return o.length?o:['gen']}
  if(m==='back'){if(/pull ?up|chin up|pulldown|pullover|straight arm/i.test(n))return['lat'];
    if(/shrug|deadlift|rack pull|extension|superman|good morning|high pull|snow angel|y-t-w/i.test(n))return['trap'];return['mid']}
  return null}
XDB.forEach(x=>{x.sub=subOf(x)});
/* ---------- elindeki ağırlıklar ---------- */
const WOPT={dumbbell:[2,3,4,5,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30,32,36,40],kettlebell:[2,4,6,8,10,12,14,16,18,20,24,28,32],
  barbell:[2,5,10,15,20,25,30,35,40,45,50,60,70,80,90,100],ezbar:[2,5,7.5,10,12.5,15,17.5,20,25,30,35,40],plate:[2,2.5,5,7.5,10,15,20,25]};
const WLBL={dumbbell:'Dumbbell (tek dumbbell ağırlığı)',kettlebell:'Kettlebell',barbell:'Barbell (bar + plakalar toplam)',ezbar:'EZ bar (bar + plakalar toplam)',plate:'Plaka'};
const gp=()=>{const d={mus:[],eq:['bodyweight','band','dumbbell'],lvl:1,dur:30,sex:(S.profile&&S.profile.sex)==='f'?'f':'m'};if(!S.homeGen||typeof S.homeGen!=='object')S.homeGen={};const g=S.homeGen;
  Object.keys(d).forEach(k=>{if(g[k]==null)g[k]=d[k]});
  if(g.sex==='w')g.sex='f';if(g.sex!=='f'&&g.sex!=='m')g.sex=d.sex;
  if(!Array.isArray(g.mus))g.mus=[];g.mus=g.mus.filter(m=>GMUS.some(x=>x[0]===m));
  if(!Array.isArray(g.eq))g.eq=[];g.eq=g.eq.filter(k=>EQ.some(x=>x[0]===k));if(!g.eq.length)g.eq=[...d.eq];
  if(![1,2,3].includes(g.lvl))g.lvl=1;if(![20,30,45,60].includes(g.dur))g.dur=30;
  if(!g.sub||typeof g.sub!=='object'||Array.isArray(g.sub))g.sub={};Object.keys(g.sub).forEach(m=>{if(!MSUB[m]||!Array.isArray(g.sub[m]))delete g.sub[m];else g.sub[m]=g.sub[m].filter(k=>MSUB[m].some(q=>q[0]===k))});
  if(!g.w||typeof g.w!=='object'||Array.isArray(g.w))g.w={};Object.keys(g.w).forEach(k=>{if(!WOPT[k]||!Array.isArray(g.w[k]))delete g.w[k];else g.w[k]=g.w[k].map(Number).filter(v=>v>0&&v<=500)});return g};
function genPool(m,eq,lvl,ex,sub){return XDB.filter(x=>x[2]===m&&eq.includes(x[3])&&x[4]<=lvl&&!ex.includes(x[0])&&(!sub||!x.sub||x.sub.includes(sub)))}
const subPick=(m,x)=>{const sel=(gp().sub[m]||[]);if(!sel.length)return null;const own=x&&x.sub?sel.filter(k=>x.sub.includes(k)):[];const a=own.length?own:sel;return a[Math.floor(Math.random()*a.length)]};
function startKg(x,lvl,ws){const n=ws.length;let f=x[5]==='c'?.45:.2;f+=(lvl-2)*.18;if(/raise|fly|kickback|curl|pull-?apart|halo|face pull|y raise|lu raise/i.test(x[0]))f-=.12;if(gp().sex==='f')f-=.1;
  return ws[Math.max(0,Math.min(n-1,Math.round(f*(n-1))))]}
function genPick(pool,lvl,pref){if(!pool.length)return null;
  const w=pool.map(x=>(pref&&x[5]===pref?3:1)*(lvl===3?(x[4]===3?3:x[4]===2?2:1):lvl===2?(x[4]===2?2.5:1):(x[4]===1?2:.5))*(x[3]==='bodyweight'?.9:1.1)*(x[7]?(x[7]===gp().sex?2.4:.55):1));
  let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0)return pool[i]}return pool[pool.length-1]}
function genAlts(x,lvl,used,n=4){const eq=gp().eq,ex=[...used,x[0]],out=[],sb=x.sub&&MSUB[x[2]]?((gp().sub[x[2]]||[]).filter(k=>x.sub.includes(k))[0]||x.sub[0]):null;
  for(let k=0;k<n;k++){const a=(sb&&genPick(genPool(x[2],eq,lvl,ex,sb),lvl,x[5]))||genPick(genPool(x[2],eq,lvl,ex),lvl,x[5])||genPick(genPool(x[2],eq,3,ex),lvl)||genPick(genPool(x[2],['bodyweight','band'],lvl,ex),lvl);if(!a)break;ex.push(a[0]);out.push(a)}return out}
const altStr=a=>a[0]+'|'+a[1]+(a[5]==='t'?'|t':'');
const qNorm=t=>String(t||'').toLocaleLowerCase('tr').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,' ').trim();
const QPOP=['Push Up','Pull Up','Plank','Burpee','Dips','Crunch','Lunge','Jumping Jack','Mountain Climber','Squat (Barbell)','Bench Press (Barbell)','Deadlift (Barbell)'];
function qPool(){if(!qPool.c){const seen=new Set();qPool.c=[];
  const add=(name,tr,muscle,eq,t,note)=>{if(!name||seen.has(name))return;seen.add(name);qPool.c.push({name,tr,muscle,eq,t:t?1:0,note:note||'',k:qNorm(name+' '+tr)})};
  XDB.forEach(x=>add(x[0],x[1],x[2],x[3],x[5]==='t',x[6]));
  try{S.plans.forEach(p=>(p.exercises||[]).forEach(e=>add(e.name,e.tr||'',e.muscle,e.eq||'',e.t,e.note)))}catch(e){}
  try{S.sessions.forEach(ss=>ss.sets.forEach(x=>add(x.ex,'',x.muscle,'',x.t)))}catch(e){}}
  return qPool.c}
function qRes(){const q=qNorm(A._q.q),P=qPool();let r;
  if(!q){const recent=[...new Set(S.sessions.slice(-15).reverse().flatMap(s=>s.sets.map(x=>x.ex)))].slice(0,6);
    const names=[...recent,...QPOP.filter(n=>!recent.includes(n))];r=names.map(n=>P.find(x=>x.name===n)).filter(Boolean).slice(0,10)}
  else{const w=q.split(' ');r=P.map(x=>{if(!w.every(t=>x.k.includes(t)))return null;const tr=qNorm(x.tr),en=qNorm(x.name);
      const sc=(tr===q||en===q?0:tr.startsWith(q)||en.startsWith(q)?1:2)+(x.name.length/200);return[sc,x]}).filter(Boolean).sort((a,b)=>a[0]-b[0]).map(z=>z[1]).slice(0,12)}
  A._qr=r.slice();
  const rows=r.map((x,i)=>`<button class="q-row" onclick="A.qAdd(${i})"><span class="q-dot" style="--c:${(MGI[mgOf(x.muscle)]||[])[2]||'#9b9ba4'}"></span><div><b>${esc(x.tr||x.name)}</b><small>${esc(x.tr&&x.tr!==x.name?x.name+' · ':'')}${MUSCLES[x.muscle]||''}${x.t?' · ⏱ süreli':''}</small></div><i>+</i></button>`).join('');
  let cust='';if(q){A._qr.push({name:A._q.q.trim(),tr:'',muscle:'core',eq:'bodyweight',t:0,custom:1});cust=`<button class="q-row q-cust" onclick="A.qAdd(${A._qr.length-1})"><span>✏️</span><div><b>“${esc(A._q.q.trim())}” adıyla ekle</b><small>Listede yoksa kendi hareketini yaz</small></div><i>+</i></button>`}
  return (q?'':'<div class="mini" style="margin:4px 0 6px">'+(S.sessions.length?'Son yaptıkların ve popüler':'Popüler')+'</div>')+(rows||(q?'<div class="lbl" style="padding:8px 2px">Bulunamadı.</div>':''))+cust}
function qHint(s){const goal=num(s.goal)||0,n=num(s.sets)||(goal?Math.max(1,Math.min(10,Math.ceil(goal/(s.t?60:25)))):3);
  if(!goal)return `${n} set · tekrarları antrenmanda girersin`;const per=Math.floor(goal/n),r=goal-per*n;return `${n} set × ~${per}${r?'–'+(per+1):''} ${s.t?'sn':'tekrar'} = ${goal}`}
function qSel(){const L=A._q.sel;if(!L.length)return '';
  const ms=Object.entries(MUSCLES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
  return `<div class="mini" style="margin:14px 0 6px">Seçilenler</div>${L.map((s,i)=>{const bw=s.eq==='bodyweight'||s.eq==='band';return `<div class="q-sel">
    <div class="row between"><b>${esc(s.tr||s.name)}</b><button class="x" onclick="A.qDel(${i})">✕</button></div>
    ${s.custom?`<select onchange="A.qSet(${i},'muscle',this.value)" style="margin:8px 0 0">${ms.replace(`value="${s.muscle}"`,`value="${s.muscle}" selected`)}</select>`:''}
    <div class="grid3 q-f"><div><div class="mini">${s.t?'Toplam sn':'Toplam tekrar'}</div><input id="q_g${i}" inputmode="numeric" placeholder="ör. ${s.t?180:100}" value="${s.goal}" oninput="A.qSet(${i},'goal',this.value)"></div>
     <div><div class="mini">Set</div><input inputmode="numeric" placeholder="otomatik" value="${s.sets}" oninput="A.qSet(${i},'sets',this.value)"></div>
     <div><div class="mini">${bw?'Ek kg':'Kg'}</div><input inputmode="decimal" placeholder="${bw?'0':'—'}" value="${s.kg}" oninput="A.qSet(${i},'kg',this.value)"></div></div>
    <div class="lbl" id="q_h${i}" style="margin-top:6px">${qHint(s)}</div></div>`}).join('')}
   <div class="grid2" style="margin-top:12px"><button class="btn" onclick="A.qStart()">▶ Başlat</button><button class="btn ghost" onclick="A.qLog()">✓ Yaptım, kaydet</button></div>
   <div class="lbl" style="margin-top:8px;line-height:1.45">“Başlat” setleri tek tek takip eder ve hedefe kalan tekrarı gösterir. Zaten yaptıysan “Yaptım, kaydet” hedefi setlere bölüp antrenman olarak kaydeder.</div>`}
function genEx(x,lvl,used){const rx=RX[lvl][x[5]],alts=genAlts(x,lvl,used),alt=alts[0];
  const e={name:x[0],tr:x[1],muscle:x[2],sets:rx[0],repMin:rx[1],repMax:rx[2],inc:['barbell','machine','cable','ezbar','plate'].includes(x[3])?2.5:x[3]==='dumbbell'||x[3]==='kettlebell'?2:0,note:x[6],eq:x[3]};
  if(x[5]==='t'){e.t=1;e.fix=0}else if(x[3]==='bodyweight'||x[3]==='band')e.fix=0;
  else{const ws=[...new Set((gp().w[x[3]]||[]).map(Number))].sort((a,b)=>a-b);if(ws.length===1)e.fix=ws[0];else if(ws.length>1){e.kgs=ws;e.startKg=startKg(x,lvl,ws)}}
  if(alt)e.alt=altStr(alt);e.alts=alts.map(altStr);return e}
function genBuild(){const g=gp(),lvl=g.lvl,mus=g.mus.length?g.mus:GPRE[0][1];let budget=Math.max(6,Math.round(g.dur/2.3));
  const out=[],used=[],miss=[];
  const order=['quads','glutes','hamstrings','chest','back','shoulders','triceps','biceps','calves','core'].filter(m=>mus.includes(m));
  // 1. tur: her kasa birer (önce çok eklemli)
  order.forEach(m=>{const subs=(g.sub[m]&&g.sub[m].length)?g.sub[m]:[null];
    subs.forEach(sb=>{let x=genPick(genPool(m,g.eq,lvl,used,sb),lvl,'c');if(!x){x=genPick(genPool(m,['bodyweight','band'],lvl,used,sb),lvl,'c');if(x&&!miss.includes(m))miss.push(m)}
    if(!x&&sb)x=genPick(genPool(m,g.eq,lvl,used),lvl,'c');
    if(x){used.push(x[0]);const e=genEx(x,lvl,used);out.push(e);budget-=e.sets}})});
  // 2. tur: süre kaldıkça izole/ek hareketler (büyük kaslara öncelik)
  let k=0,guard=0;const big=order.filter(m=>['quads','glutes','hamstrings','chest','back','shoulders'].includes(m)),cyc=[...big,...order.filter(m=>!big.includes(m))];
  while(budget>=2&&cyc.length&&guard++<40){const m=cyc[k++%cyc.length];const x=genPick(genPool(m,g.eq,lvl,used,subPick(m)),lvl,'i')||((g.sub[m]||[]).length?null:genPick(genPool(m,g.eq,lvl,used),lvl,'i'));if(!x)continue;
    used.push(x[0]);const e=genEx(x,lvl,used);out.push(e);budget-=e.sets}
  // sıralama: çok eklemli → izole → core/süreli en sonda
  const rk=e=>e.muscle==='core'?3:XBY[e.name][5]==='c'?0:XBY[e.name][5]==='i'?1:2;
  out.sort((a,b)=>rk(a)-rk(b)||order.indexOf(a.muscle)-order.indexOf(b.muscle));
  const names=out.map(e=>e.name);out.forEach((e,i)=>{out[i]=genEx(XBY[e.name],lvl,names)});
  const nm=genPresets().find(p=>p[1].length===mus.length&&p[1].every(m=>mus.includes(m)));
  ui.gen={name:(nm?nm[0]:mus.map(m=>GMUS.find(x=>x[0]===m)[1]).slice(0,3).join(' + ')+(mus.length>3?' +'+(mus.length-3):''))+' · '+LVL[lvl-1][0],exercises:out,miss};
}
const genPresets=()=>gp().sex==='f'?[['Kalça & bacak',['glutes','hamstrings','quads']],...GPRE,['Kalça & karın',['glutes','core']]]:[...GPRE,['Göğüs & kol',['chest','biceps','triceps']]];
function genOk(G){return G&&Array.isArray(G.exercises)&&G.exercises.length&&G.exercises.every(e=>e&&e.name&&e.muscle&&e.sets)}
function genSection(){const g=gp();if(!ui.gen&&g.last)ui.gen=g.last;if(ui.gen&&!genOk(ui.gen)){ui.gen=null;delete g.last}
  const G=ui.gen;if(G){G.miss=G.miss||[];G.name=G.name||'Antrenman'}const PRE=genPresets(),tab=ui.gTab;
  const subRows=g.mus.filter(m=>MSUB[m]).map(m=>{const sel=g.sub[m]||[],nm=GMUS.find(x=>x[0]===m)[1];
    return `<div class="gsub"><span>${nm} · hangi bölge?</span><div><button class="${sel.length?'':'on'}" onclick="A.genSub('${m}','')">Hepsi</button>${MSUB[m].map(([k,n])=>`<button class="${sel.includes(k)?'on':''}" onclick="A.genSub('${m}','${k}')">${n}</button>`).join('')}</div></div>`}).join('');
  const wSel=g.eq.filter(k=>WOPT[k]);
  const tile=(k,ic,l,v,sub)=>`<button class="gtile ${tab===k?'on':''}" onclick="A.genTab('${k}')"><span class="gt-ic">${ic}</span><small>${l}</small><b>${v}</b>${sub?`<em>${sub}</em>`:''}</button>`;
  const wTxt=wSel.map(k=>(g.w[k]||[]).length).reduce((a,b)=>a+b,0);
  const panel=tab==='sex'?`<div class="gpanel"><div class="gen-sx">${[['f','👩','Kadın'],['m','👨','Erkek']].map(([k,ic,n])=>`<button class="${g.sex===k?'on':''}" onclick="A.genSex('${k}')"><span>${ic}</span><b>${n}</b></button>`).join('')}</div></div>`
   :tab==='lvl'?`<div class="gpanel"><div class="gen-lv">${LVL.map(([n,d],i)=>`<button class="${g.lvl===i+1?'on':''}" onclick="A.genLvl(${i+1})"><b>${n}</b><small>${d}</small></button>`).join('')}</div>
      <div class="lbl" style="margin-top:10px;line-height:1.5">📋 ${LVL[g.lvl-1][0]}: çok eklemli ${RX[g.lvl].c[0]}×${RX[g.lvl].c[1]}–${RX[g.lvl].c[2]}, izole ${RX[g.lvl].i[0]}×${RX[g.lvl].i[1]}–${RX[g.lvl].i[2]} · dinlenme ${RX[g.lvl].rest}</div></div>`
   :tab==='dur'?`<div class="gpanel"><div class="gdur">${[20,30,45,60].map(d=>`<button class="${g.dur===d?'on':''}" onclick="A.genDur(${d})"><b>${d}</b><small>dakika</small></button>`).join('')}</div></div>`
   :tab==='eq'?`<div class="gpanel"><div class="gen-l" style="margin-top:2px">Ekipmanların <small>(birden fazla seçebilirsin)</small></div>
      <div class="gen-eq">${EQ.map(([k,ic,n])=>`<button class="${g.eq.includes(k)?'on':''}" onclick="A.genEq('${k}')">${n}</button>`).join('')}</div>
      ${wSel.length?`<div class="gen-l">⚖️ Elindeki ağırlıklar <small>(seçmezsen antrenmanda kendin girersin)</small></div>
       ${wSel.map(k=>{const own=g.w[k]||[],opts=[...new Set([...WOPT[k],...own])].sort((a,b)=>a-b);
        return `<div class="gw"><div class="gw-h"><b>${WLBL[k]}</b><span>${own.length?own.length+' seçili':'seçilmedi'}</span></div>
         <div class="gw-c">${opts.map(v=>`<button class="${own.includes(v)?'on':''}" onclick="A.genW('${k}',${v})">${fmt(v)}</button>`).join('')}</div>
         <div class="gw-add"><input id="gw-${k}" inputmode="decimal" placeholder="Başka ağırlık (kg)"><button onclick="A.genWAdd('${k}')">+ Ekle</button></div></div>`}).join('')}`
       :`<div class="lbl" style="margin-top:10px">Dumbbell, kettlebell, barbell, EZ bar ya da plaka seçersen elindeki ağırlıkları da işaretleyebilirsin.</div>`}</div>`:'';
  return `<div class="gen">
   <div class="gen-k">🎯 Antrenman oluşturucu</div><div class="gen-t">Hangi kas grubuna odaklanmak istiyorsun?</div>
   <div class="gen-pre">${PRE.map(([n,ms])=>`<button class="${ms.length===g.mus.length&&ms.every(m=>g.mus.includes(m))?'on':''}" onclick="A.genPre('${n}')">${n}</button>`).join('')}</div>
   <div class="gen-mus">${GMUS.map(([k,n])=>{const gg=mgOf(k),c=gg?MGI[gg][2]:'#ff5fb0',on=g.mus.includes(k);return `<button class="${on?'on':''}" style="--c:${c}" onclick="A.genMus('${k}')"><i>${on?'✓':''}</i>${n}${MSUB[k]?'<em>bölge seçilebilir</em>':''}</button>`}).join('')}</div>
   ${subRows}
   <div class="gs-h"><span>⚙️ Ayarlar</span><small>Değiştirmek için kutucuğa dokun</small></div>
   <div class="gtiles">${tile('sex',g.sex==='f'?'👩':'👨','Cinsiyet',g.sex==='f'?'Kadın':'Erkek')}${tile('lvl','📊','Seviye',LVL[g.lvl-1][0])}${tile('dur','⏱','Süre',g.dur+' dk')}${tile('eq','🏋️','Ekipman',g.eq.length+' seçili',wTxt?wTxt+' ağırlık':'')}</div>
   ${panel}
   <button class="btn" style="margin-top:14px" onclick="A.genMake()">✨ ${G?'Yeniden oluştur':'Antrenmanımı oluştur'}</button>
   ${G?`<div class="gen-res"><div class="row between" style="align-items:flex-start"><div><div class="nx-k">Senin için oluşturuldu</div><div class="gen-rt">${esc(G.name)}</div>
      <div class="lbl">${G.exercises.length} hareket · ${G.exercises.reduce((a,e)=>a+e.sets,0)} set · ~${planMin(G)} dk · dinlenme ${RX[g.lvl].rest}</div></div><button class="pill fin" onclick="A.genStart()">▶ Başlat</button></div>
     ${G.miss.length?`<div class="lbl warn" style="margin-top:8px">Seçtiğin ekipmanla ${G.miss.map(m=>(GMUS.find(x=>x[0]===m)||[0,m])[1]).join(', ')} için hareket yoktu; vücut ağırlığı/bant hareketi eklendi.</div>`:''}
     <div class="coachl" style="margin:12px 0 4px"><span>💡</span><div>${RX[g.lvl].tip}</div></div>
     ${G.exercises.map((e,i)=>{const alts=(e.alts||(e.alt?[e.alt]:[])).map(altP),eqi=EQ.find(q=>q[0]===e.eq),x=XBY[e.name],sb=x&&x.sub&&MSUB[e.muscle]?x.sub.map(s=>(MSUB[e.muscle].find(q=>q[0]===s)||[0,''])[1]).filter(Boolean).join(', '):'';
      const kg=e.fix?fmt(e.fix)+' kg':e.startKg?fmt(e.startKg)+' kg ile başla':'';
      return `<div class="gx"><span class="gx-b" onclick="A.genInfo(${i})">${bodyMini(e.name,e.muscle,38)}<em>${i+1}</em></span><div class="pex-b" onclick="A.genInfo(${i})"><b>${e.t?'⏱ ':''}${esc(e.name)} <span class="gx-i">ⓘ</span></b><small>${esc(e.tr||'')} · ${sb||MUSCLES[e.muscle]}${eqi?' · '+eqi[2]:''}</small>
        <small class="gx-n">${e.sets} × ${rr(e)}${kg?' · <b class="gx-kg">'+kg+'</b>':''}${e.note?' · '+esc(e.note):''}</small>
        ${alts.length?`<div class="gx-alts"><span>↔ Alternatifler (${alts.length})</span>${alts.map((a,j)=>`<button onclick="event.stopPropagation();A.genAlt(${i},${j})">${a.t?'⏱ ':''}${esc(a.en)}<small>${esc(a.tr)}</small></button>`).join('')}</div>`:''}</div>
        <button class="gx-r" onclick="A.genRe(${i})" aria-label="Başka hareket">🔄</button></div>`}).join('')}
     <div class="gen-act"><button class="btn" onclick="A.genStart()">▶ Antrenmanı başlat</button><button class="btn ghost" onclick="A.genSave()">+ Kaydet</button></div></div>`:''}
  </div>`}

/* ---------- İnsan vücudu kas haritası (ön / arka) — anatomik ---------- */
const BODY_SIL='M60,35 C55.5,36 50.5,38.5 45.5,41 C38.5,42 32.5,45 30,52 C28,58 27,66 26.5,74 C25,84 23.6,96 22.6,108 C21.6,118 21,126 21.4,132 C21.8,138 24,142.5 27,141.5 C29,136.5 29.6,130 30.2,124 C31.2,112 33,100 34.2,92 C35.2,84 36.6,76 38.2,70.5 L39.2,80 C39.6,92 40.2,104 41.4,114 C40.1,124 39.6,136 40,148 C40.5,164 41.5,178 42.6,186 C41,198 41.5,212 43.4,226 C44,232 43,236 41.4,240.5 L50.2,242 C50.6,236 50.6,230 51,224 C52.5,210 53.6,198 53,188 C54.5,176 56,162 57,150 C58,140 59,132 60,129 Z';
const BODY={
 front:[ // [kas, path (sol yarı)]
  ['trap','M60,37.5 C56,38.5 51,40.5 46.5,42.6 L50.5,45.3 C54,43.8 57,43 60,42.8 Z'],
  ['shoulders','M45.2,42.6 C38.6,43.4 32.6,46.2 30.8,53 C29.8,58 29.8,63 30.8,67.2 C33.2,63.2 36.2,58.4 38.8,54.4 C40.4,50.4 43.2,47.4 47.2,45.6 Z'],
  ['chest','M59.6,46.4 L48.4,46.8 C43.2,49.2 39.8,53.6 38.8,59 C38.3,64 40.2,68.6 44.6,70.6 C49.2,72.2 54.6,71.6 59.6,69.2 Z'],
  ['biceps','M31.2,68.6 C28.7,74.4 27.7,81.2 28.2,88.2 C30.2,90.2 33.2,90.2 35.2,88.2 C36.7,82.2 37.7,75.2 37.7,66.4 C35.2,64.6 32.7,65.4 31.2,68.6 Z'],
  ['forearms','M27.7,92.2 C25.2,100.2 23.7,110.2 23.2,120.2 L23.2,128 L28.7,128 C29.7,118 31.7,106 34.7,93.2 C32.2,91.2 29.7,91.2 27.7,92.2 Z'],
  ['obliques','M44.2,72.8 C42.2,80.4 41.4,90.4 42.2,100.4 C43.2,108.2 46.2,113.2 51.6,115.4 L51.6,74 C49.2,74 46.6,73.6 44.2,72.8 Z'],
  ['core','M52.8,73.6 L59.6,73.2 L59.6,82.4 L52.8,82.8 Z'],['core','M52.8,84.4 L59.6,84.2 L59.6,93.2 L52.8,93.4 Z'],['core','M52.8,95 L59.6,94.8 L59.6,103.8 L52.8,104 Z'],['core','M52.8,105.6 L59.6,105.4 L59.6,121 C56.2,119.6 54,117.6 52.8,115.4 Z'],
  ['quads','M43.6,120.6 C40.6,134.4 40.1,152.4 42.1,170.4 C43.6,178.4 46.1,182.4 49.1,182.6 C48.1,166.4 48.6,146.4 50.6,124.4 C48.1,121.4 45.6,120.4 43.6,120.6 Z'],
  ['quads','M51.8,123.6 C49.8,142.4 49.3,162.4 50.3,182.4 C53.3,182.4 55.8,178.4 56.8,172.4 C57.8,160.4 58.3,146.4 58.6,132.4 C56.8,127.4 54.3,124.4 51.8,123.6 Z'],
  ['adductors','M58.8,128.6 C58.4,138.4 58,148.4 57.2,158 L59.8,141 L59.8,128.4 Z'],
  ['calves','M43.6,192.4 C42.6,204.4 43.1,216.4 45.1,228.2 L48.1,228.2 C48.6,216.4 48.6,204.4 48.1,192.4 Z'],
  ['calves','M49.6,192.6 C51.6,200.4 52.6,210.4 51.6,222.2 L49.6,226 C49.6,214.4 49.6,202.4 49.6,192.6 Z']],
 back:[
  ['trap','M60,32.5 C56,36.4 50.4,40.2 44.8,43.2 C48.2,46.2 52.2,49.2 55.2,54.2 C57.2,62.2 58.6,72.2 60,80.4 Z'],
  ['shoulders','M44.4,43.6 C38.6,43.8 32.6,46.4 30.8,53 C29.8,58 29.8,63 30.8,67.2 C33.2,63.2 36.2,58.4 38.8,54.4 C40,50.6 41.8,47.6 44.4,45.4 Z'],
  ['back','M54.8,55.4 C51,52.8 47.4,50.4 45,48.4 C42,52.4 41,57.4 42,62.4 C45.4,64.4 50.4,65.4 56.2,64.6 Z'],
  ['lats','M41.8,63.8 C40.2,72.4 40.6,84.4 43.6,96.4 C47.2,102.2 52.2,104.4 57.2,103.4 L58.4,90.4 C57.2,80.4 56.8,72.4 56.4,65.6 C51.2,66.8 46.2,66.2 41.8,63.8 Z'],
  ['lowback','M58.2,84 C57.8,94 57.4,104 56.8,116.4 L59.8,118.4 L59.8,82 Z'],
  ['triceps','M31.2,68.4 C28.7,74.4 27.7,82.2 28.2,89.2 C30.7,91.2 33.7,90.7 35.7,88.2 C36.7,80.2 37.2,72.2 37.2,64.2 C35.2,62.8 32.7,64.4 31.2,68.4 Z'],
  ['forearms','M27.7,92.2 C25.2,100.2 23.7,110.2 23.2,120.2 L23.2,128 L28.7,128 C29.7,118 31.7,106 34.7,93.2 C32.2,91.2 29.7,91.2 27.7,92.2 Z'],
  ['glutes','M42.2,116.6 C39.7,124.4 40.2,136.4 44.2,143.4 C49.2,148.4 55.7,147.9 59.8,142.4 L59.8,119.4 C54.2,115.4 47.2,114.6 42.2,116.6 Z'],
  ['hamstrings','M42.6,148.6 C41.1,160.4 41.6,172.4 44.1,182.4 L49.1,182.4 C48.6,170.4 48.6,158.4 49.6,149 C47.1,148 44.6,148 42.6,148.6 Z'],
  ['hamstrings','M50.8,149.4 C50.3,160.4 50.8,172.4 51.8,182.4 L55.3,180.4 C57.3,170.4 57.8,158.4 57.8,149.4 C55.3,148.4 52.8,148.9 50.8,149.4 Z'],
  ['calves','M43.2,190.4 C40.7,198.4 41.2,208.4 43.7,216.4 C45.7,219.4 47.7,218.4 48.2,214.4 C48.7,206.4 48.7,197.4 47.7,190.4 Z'],
  ['calves','M48.9,190.6 C51.6,196.6 53.1,205.6 51.9,214.4 C50.9,219.4 48.9,219.4 48.7,214.4 Z']]};
function ensureBodyDefs(){if(document.getElementById('bodydefs'))return;
  document.body.insertAdjacentHTML('beforeend',`<svg id="bodydefs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
   <linearGradient id="mred" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a4a"/><stop offset="1" stop-color="#e0241a"/></linearGradient>
   <linearGradient id="mhi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
   <radialGradient id="msil" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#2a2a31"/><stop offset="1" stop-color="#1c1c21"/></radialGradient></defs></svg>`)}
/* lv: kas anahtarı -> 0..1 */
function bodySvg(lv,o={}){ensureBodyDefs();const views=o.view==='front'?['front']:o.view==='back'?['back']:['front','back'];
  const val=k=>Math.max(0,Math.min(1,k==='lats'||k==='trap'?(lv.back||0):k==='lowback'?Math.max(lv.lowback||0,(lv.back||0)*.55):k==='obliques'?(lv.core||0)*.85:k==='adductors'?(lv.quads||0)*.8:(lv[k]||0)));
  const tap=k=>o.click?({trap:'back',lats:'back',obliques:'core',adductors:'quads'}[k]||k):'';
  const reg=(d,v,k)=>`<path d="${d}" class="${v>0?'mu1':'mu0'}${o.click?' bmk':''}" ${v>0?`fill="url(#mred)" fill-opacity="${(.3+.7*v).toFixed(2)}"`:''} ${o.click?`onclick="A.acMus('${tap(k)}')"`:''}/><path d="${d}" fill="url(#mhi)" pointer-events="none"/>`;
  const one=(side,dx)=>{const half=BODY[side].map(([k,d])=>reg(d,val(k),k)).join('');
    const det=side==='front'?`<path d="M60,46.6 L60,121" class="bln"/><path d="M50.6,183.6 C49.6,186.6 47.6,188.6 45.6,188.6" class="bln"/>`:`<path d="M60,33 L60,128" class="bln"/><path d="M47.6,236 C47,231 46.8,226 47,220" class="bln"/>`;
    return `<g transform="translate(${dx},0)"><ellipse cx="60" cy="18.5" rx="10.2" ry="12.6" class="sil"/><path d="M54.8,29 L65.2,29 L66.4,40 L53.6,40 Z" class="sil"/>
     <path d="${BODY_SIL}" class="sil"/><path d="${BODY_SIL}" class="sil" transform="matrix(-1 0 0 1 120 0)"/>
     <g>${half}</g><g transform="matrix(-1 0 0 1 120 0)">${half}</g>${det}
     ${o.labels!==false&&views.length>1?`<text x="60" y="254" text-anchor="middle" class="blb">${side==='front'?'ÖN':'ARKA'}</text>`:''}</g>`};
  const W=views.length*120+(views.length-1)*10,H=views.length>1&&o.labels!==false?258:245;
  return `<svg class="body ${o.cls||''}" viewBox="0 0 ${W} ${H}" ${o.w?`width="${o.w}"`:''} ${o.h?`height="${o.h}"`:''} aria-hidden="true">${views.map((v,i)=>one(v,i*130)).join('')}</svg>`}
/* Bir hareketin ana ve yardımcı kasları */
function exMus(name,m){const x=XBY[name],c=x?x[5]==='c':/press|push|row|pull|squat|lunge|dead|thrust|bridge|dip|step/i.test(name);let s=[];
  if(/burpee|mountain|plank jack|climber|bear crawl/i.test(name))s=['quads','shoulders','chest','core'];
  else if(m==='chest')s=c?['triceps','shoulders']:['shoulders'];
  else if(m==='back')s=/dead|good morning|rack pull|extension/i.test(name)?['lowback','hamstrings','glutes']:/shrug/i.test(name)?['forearms']:/pullover|straight arm/i.test(name)?['triceps','core']:c?['biceps','shoulders','forearms']:['shoulders'];
  else if(m==='shoulders')s=c?['triceps','back']:/rear|face pull|pull-apart|reverse/i.test(name)?['back']:[];
  else if(m==='biceps')s=['forearms'];
  else if(m==='triceps')s=c?['chest','shoulders']:[];
  else if(m==='quads')s=c?['glutes','hamstrings','core']:[];
  else if(m==='hamstrings')s=c?['glutes','lowback','forearms']:['calves'];
  else if(m==='glutes')s=c?['hamstrings','quads']:[];
  else if(m==='core')s=/carry/i.test(name)?['forearms','back']:/russian|twist|woodchop|side|windmill|pallof/i.test(name)?[]:[];
  const lv={};s.forEach(k=>lv[k]=.45);lv[m]=1;if(m==='back'&&/dead|rack pull|extension|superman/i.test(name))lv.lowback=1;return lv}
const backView=m=>['back','triceps','hamstrings','glutes','calves','lowback'].includes(m);
function bodyMini(name,m,w=34){return bodySvg(exMus(name,m),{view:backView(m)?'back':'front',w,cls:'mini',labels:false})}
/* Dönem için kas yoğunluğu (ana kas 1 set, yardımcı 0,5 set) */
function bodyLoad(list,full){const o={};list.forEach(s=>s.sets.forEach(x=>{const l=exMus(x.ex,x.muscle);Object.entries(l).forEach(([k,v])=>o[k]=(o[k]||0)+(v>=1?1:.5))}));
  const mx=Math.max(full,...Object.values(o),0),lv={};Object.entries(o).forEach(([k,v])=>lv[k]=Math.min(1,v/mx));return{lv,raw:o}}

function homeWkV(){
  return `<div class="hero" style="padding-bottom:18px"><div class="top"><button class="back" onclick="A.go('programs')">${I.back}</button><div></div></div>
    <div class="lbl" style="margin-top:14px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.75)">🏠 Evde antrenman</div>
    <div class="h2" style="font-size:28px">Bugün ne çalışalım?</div><div class="lbl">Kas grubunu seç; ${XDB.length} hareketlik veritabanından sana özel antrenman oluşturayım</div></div>
  ${genSection()}`}
function ingRow(l,i,db){const[n,q,u,st]=l,d=db[n],m=d?lineMac(l):null;
  const units=d?[d.u,...(d.pu?[d.pu]:[])]:['g','ml'];const step=(u==='g'||u==='ml')?10:0.5;
  const cur=stOf(d,st)||(d&&d.st?d.st[0]:null);
  let hint='';
  if(d&&d.st&&m&&u===d.u){if(cur.y!==1)hint=`≈ ${Math.round(m.g/cur.y)} g ${d.st[0].n.toLocaleLowerCase('tr-TR')} karşılığı`;
    else{const c1=d.st.find(x=>x.y!==1);if(c1)hint=`${c1.n} hali ≈ ${Math.round(m.g*c1.y)} g olur`}}
  return `<div class="ingrow"><div class="row" style="gap:6px"><div class="ingq"><input value="${esc(n)}" placeholder="Besin ara… (ör. süt, coco pops, döner)" autocomplete="off" oninput="A.ingSug(${i},this.value)" onchange="const v=this.value.trim();setTimeout(()=>{if(Date.now()-(A._pk||0)<600)return;A.ingName(${i},v)},160)" onblur="setTimeout(()=>{const e=document.getElementById('sug${i}');if(e)e.innerHTML=''},250)"><div class="sug" id="sug${i}"></div></div>
    <button class="x" onclick="A._rb.ing.splice(${i},1);A.drawBuilder()" aria-label="Sil">✕</button></div>
   ${d&&d.st?`<div class="seg ckseg" style="margin-top:6px">${d.st.map(x=>`<button class="${x.n===cur.n?'on':''}" onclick="A._rb.ing[${i}][3]='${x.n}';A.drawBuilder()">${x.n}</button>`).join('')}</div>`:''}
   <div class="row" style="gap:6px;margin-top:6px"><button class="stp" onclick="A.qty(${i},-${step})">−</button>
    <input class="qin" inputmode="decimal" value="${fmt(q)}" oninput="A._rb.ing[${i}][1]=A.n(this.value)||0;A.updTot()">
    <button class="stp" onclick="A.qty(${i},${step})">+</button>
    <select class="uin" onchange="A._rb.ing[${i}][2]=this.value;A.drawBuilder()">${units.map(x=>`<option ${x===u?'selected':''}>${x}</option>`).join('')}</select>
    <span class="lk" id="lk${i}">${m?Math.round(m.k)+' kcal':''}</span></div>
   ${n&&!d?`<div class="lbl warn" style="margin-top:6px">"${esc(n)}" listede yok. <button style="color:var(--a3);font-size:12px;text-decoration:underline" onclick="A.newIng(${i})">Besin değerlerini gir →</button></div>`:''}
   ${cur?`<div class="lbl" style="margin-top:5px">100 g ${cur.n.toLocaleLowerCase('tr-TR')}: ${cur.k} kcal · P ${cur.p} g${hint?` · <span style="color:#ffb4a8">${hint}</span>`:''}</div>`:''}
   ${d&&d.pu&&u===d.pu?`<div class="lbl" style="margin-top:4px">1 ${d.pu} ≈ ${d.pw} g</div>`:''}</div>`}
function rbTot(){const b=A._rb,t=sumMac(b.ing),sv=b.serv||1;
  return `<div class="lbl" style="margin-bottom:6px">${b.mode==='meal'?'Bu öğünün toplamı':`Porsiyon başı (toplam ÷ ${fmt(sv)})`}${t.unk?` · <span class="warn">${t.unk} malzemenin değeri yok</span>`:''}</div>
   <div class="macro4"><div><b>${Math.round(t.k/sv)}</b><span class="lbl">kcal</span></div><div><b>${Math.round(t.p/sv)}g</b><span class="lbl">protein</span></div><div><b>${Math.round(t.c/sv)}g</b><span class="lbl">karb.</span></div><div><b>${Math.round(t.f/sv)}g</b><span class="lbl">yağ</span></div></div>
   ${b.mode==='meal'?'':`<div class="lbl">Tüm tarif: ${Math.round(t.k)} kcal · P ${Math.round(t.p)} g · K ${Math.round(t.c)} g · Y ${Math.round(t.f)} g</div>`}`}
function bottleSvg(p,goal){const f0=A._wPrev??p;A._wPrev=p;const up=p>f0+.001,top=62,bot=188,lv=y=>bot-(bot-top)*Math.min(1,y),B='M33 40h24v5c0 5 21 7 21 21v115c0 8-5 13-13 13H25c-8 0-13-5-13-13V66c0-14 21-16 21-21z';
  return `<svg class="wbot" viewBox="0 0 90 200" role="img" aria-label="Su şişesi %${Math.round(p*100)} dolu">
   <defs><clipPath id="wbc"><path d="${B}"/></clipPath><linearGradient id="wbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d4bff"/><stop offset="1" stop-color="#1b27d8"/></linearGradient>
   <linearGradient id="wgl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".18" stop-color="#fff" stop-opacity=".03"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient></defs>
   <path d="M36 20a9 8.5 0 1 1 18 0" fill="none" stroke="#2a2c34" stroke-width="6"/><path d="M36 20a9 8.5 0 1 1 18 0" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.2"/>
   <rect x="31" y="18" width="28" height="22" rx="4" fill="#15161b" stroke="rgba(255,255,255,.16)"/><path d="M33 25h24M33 30h24M33 35h24" stroke="rgba(255,255,255,.07)"/>
   <path d="${B}" fill="#050507"/>
   <g clip-path="url(#wbc)"><g class="wfill" style="--y0:${(lv(f0)-lv(p)).toFixed(1)}px;transform:translateY(${lv(p).toFixed(1)}px)"><g class="wsl${up?' go':''}">
    <path class="wwave" d="M-90 0q11-5 22 0t22 0 22 0 22 0 22 0 22 0 22 0 22 0 22 0V220H-90z" fill="url(#wbg)"/><path class="wwave w2" d="M-90 2q11-4 22 0t22 0 22 0 22 0 22 0 22 0 22 0 22 0 22 0V220H-90z" fill="#5a66ff" opacity=".35"/></g></g></g>
   <text x="45" y="134" text-anchor="middle" font-size="30" font-weight="800" fill="#9b9ca6" opacity=".9" font-family="Inter,sans-serif" letter-spacing="-1">${fmt(Math.round(goal/100)/10)}L</text>
   <path d="${B}" fill="url(#wgl)"/><path d="${B}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1.4"/><path d="M19 74v100" stroke="#fff" stroke-opacity=".14" stroke-width="3" stroke-linecap="round"/></svg>`}
function waterCard(d){
  const wg=waterGoal(d),fl=fluid(d),pct=Math.min(1,fl/wg.goal),cf=caffeine(d),dr=dayDrinks(d);
  const glasses=Math.ceil(wg.goal/250),full=Math.floor(fl/250);
  return `<div class="card"><div class="row between"><div><b>Su & içecekler</b><div class="lbl">${wg.hasW?`${Math.round((S.profile.weight??latestW()))} kg × 35 ml = ${wg.base} ml`:'Kilonu girersen hedef kişiselleşir (şimdilik 75 kg varsayıldı)'}${wg.extra?` + antrenman ${wg.min} dk → +${wg.extra} ml`:''}</div></div>${dr.length?`<button class="wlog" onclick="A.drinkLog('${d}')" aria-label="Bugün içtiklerin"><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg><i>${dr.length}</i></button>`:''}</div>
   <div class="wbx">${bottleSvg(pct,wg.goal)}<div class="wbx-r"><div class="row" style="align-items:flex-end;gap:6px"><span class="kpi" style="color:#8fd3ff">${(fl/1000).toFixed(2).replace('.',',')}</span><span class="lbl" style="margin-bottom:6px">/ ${(wg.goal/1000).toFixed(2).replace('.',',')} L</span></div>
    <div class="lbl" style="margin:2px 0 12px">${pct>=1?'<span class="ok">Hedef tamam ✓</span>':`${Math.max(0,wg.goal-fl)} ml kaldı · %${Math.round(pct*100)}`}</div>
    <button class="wbig" onclick="A.drink('su',250)" aria-label="250 ml su ekle"><span>💧</span>+250 ml</button></div></div>
   <div class="grid5" style="margin-top:6px">${[[100,'Yudum'],[200,'Bardak'],[330,'Kutu'],[500,'Şişe'],[1000,'1 L']].map(([ml,l])=>`<button class="wbtn" onclick="A.drink('su',${ml})"><b>+${ml}</b><span>${l}</span></button>`).join('')}</div>
   <div class="seg" style="margin-top:10px">${Object.entries(DRINK).filter(([k])=>k!=='su').map(([k,t])=>`<button onclick="A.drinkSheet('${k}')">${t.e} ${t.n}</button>`).join('')}</div>
   <div class="lbl" style="margin-top:8px;line-height:1.5">Kafein bugün: <b style="color:${cf>400?'var(--bad)':cf>300?'var(--warn)':'var(--txt)'}">${cf} / 400 mg</b> · ${TT('günlük üst sınır 400 mg','daily limit 400 mg')}</div></div>`}
function suppCard(d){
  const list=suppsFor(d),log=S.suppLog[d]||{},done=list.filter(s=>log[s.id]).length;
  const byT=TIMES.map(t=>[t,list.filter(s=>s.time===t)]).filter(([,a])=>a.length);
  return `<div class="card"><div class="row between"><div><b>Takviyelerim</b><div class="lbl">${S.supps.length?`Bugün ${done}/${list.length} alındı`:'Sahip olduğun takviyeleri ekle'}</div></div>
    <div class="row" style="gap:6px">${S.supps.length?`<button class="pill" onclick="A.suppHist()">Geçmiş</button>`:''}<button class="pill" onclick="A.suppLib()">+ Ekle</button></div></div>
   ${list.length?`<div class="bar"><i style="width:${done/list.length*100}%;background:linear-gradient(90deg,#3ee6a0,#3fd0ff)"></i></div>`:''}
   ${byT.map(([t,a])=>`<div class="gcat">${t}</div>${a.map(s=>{const I2=suppInfo(s),on=!!log[s.id];return `<div class="sp ${on?'on':''}">
     <button class="bx" onclick="A.suppTick('${d}','${s.id}')">${on?'✓':''}</button>
     <div style="flex:1" onclick="A.suppEdit('${s.id}')"><div class="row" style="gap:6px;flex-wrap:wrap"><b style="font-weight:600">${I2.e} ${esc(s.name)}</b><span class="lbl">${esc(s.dose||'')}</span>${s.freq==='training'?'<span class="tag" style="background:rgba(63,208,255,.15);color:var(--a3)">antrenman günü</span>':''}</div>
      <div class="lbl" style="margin-top:3px;line-height:1.45">${esc(I2.what)}</div>${on&&typeof log[s.id]==='string'?`<div class="lbl ok" style="margin-top:2px">✓ ${log[s.id]}</div>`:''}</div></div>`}).join('')}`).join('')}
   ${S.supps.length&&!list.length?'<div class="lbl" style="margin-top:8px">Bugün için takviye yok (sadece antrenman günlerine ayarlananlar var).</div>':''}
   ${S.supps.length?'<div class="lbl" style="margin-top:10px;line-height:1.5">Bu bilgiler genel özettir. İlaç kullanıyorsan ya da bir sağlık sorunun varsa takviyelere başlamadan önce doktoruna danış.</div>':''}</div>`}
function goalOut(){const r=calcTargets(S.profile);
  if(!r)return '<div class="lbl" style="margin-top:4px">Hesaplamak için yaş, boy ve kilo gir.</div>';
  const d=r.kcal-r.tdee;
  return `<div class="sugg" data-noi18n style="margin:6px 0 0">${TT('Bazal metabolizma','Basal metabolic rate (BMR)')} <b>${r.bmr}</b> · ${TT('Günlük harcama','Daily expenditure (TDEE)')} <b>${r.tdee}</b> kcal<br>
   ${TT('Hedef','Target')}: <b>${r.kcal} kcal</b> (${d>0?'+':''}${d}) · P <b>${r.protein}</b> g · ${TT('K','C')} <b>${r.carbs}</b> g · ${TT('Y','F')} <b>${r.fat}</b> g
   <div style="opacity:.75;font-size:12.5px;margin-top:6px;line-height:1.45">${TT('Bazal metabolizma, vücudunun tam dinlenirken (nefes, kalp, organlar) harcadığı kaloridir. Günlük harcama buna aktivite ve antrenmanları ekler. Hedef kalori, günlük harcamaya hedefine göre açık ya da fazla eklenerek bulunur.','BMR is the calories your body burns at complete rest (breathing, heart, organs). Daily expenditure adds your activity and workouts on top. Your target is your daily expenditure plus a deficit or surplus for your goal.')}</div>
   ${r.clamped?`<br><span class="warn">${TT('Güvenlik sınırı: kalori bazal metabolizmanın ve alt sınırın altına indirilmedi.','Safety limit: calories were not set below your BMR or the minimum.')}</span>`:''}</div>`}
function goalCard(){const pr=S.profile,wv=pr.weight??latestW();
  const ww=wv||75,rates=(PCT_OPTS[pr.goal]||[]).map(([v,l])=>[v,`${l} · ~${pr.goal==='cut'?'−':'+'}${fmt(Math.round(ww*v)/100)} kg`]);
  const inp=(k,l,v)=>`<div class="fld"><label>${l}</label><input inputmode="decimal" value="${v??''}" oninput="A.pf('${k}',A.n(this.value))"></div>`;
  return `<div class="card"><b>Hedef & vücut</b>
   <div class="lbl" style="margin-top:4px;line-height:1.5">Vücut geliştirme standartları: definasyonda haftada vücut ağırlığının %0,5–1'i, bulkta (kas kazanımı) %0,25–0,5'i, ileri seviyede daha az. Protein definasyonda 2,2 g/kg, bulkta 2,0 g/kg; yağ kalorinin ~%25'i. Harcama Mifflin-St Jeor formülüyle hesaplanır.</div>
   <div class="seg" style="margin:12px 0 8px">${[['cut','🔥 Definasyon'],['maintain','⚖️ Koruma'],['bulk','💪 Bulk']].map(([k,l])=>`<button class="${pr.goal===k?'on':''}" onclick="A.goal('${k}')">${l}</button>`).join('')}</div>
   ${pr.goal==='bulk'?`<div class="lbl" style="line-height:1.5;margin:0 0 10px;padding:10px 12px;border-radius:12px;background:var(--card2,rgba(127,127,127,.08))"><span data-noi18n>${BULK_INFO_F()}</span></div>`:''}${rates.length?`<div class="fld"><label>Hız</label><select onchange="A.pf('pct',+this.value)">${rates.map(([v,l])=>`<option value="${v}" ${pr.pct===v?'selected':''}>${l}</option>`).join('')}</select></div>`:''}
   <div class="grid2"><div class="fld"><label>Cinsiyet</label><select onchange="A.pf('sex',this.value)"><option value="m" ${pr.sex!=='f'?'selected':''}>Erkek</option><option value="f" ${pr.sex==='f'?'selected':''}>Kadın</option></select></div>
    ${inp('age','Yaş',pr.age)}${inp('height','Boy (cm)',pr.height)}${inp('weight','Kilo (kg)',wv)}</div>
   <div class="fld"><label>Aktivite</label><select onchange="A.pf('act',+this.value)">${ACTS.map(([v,l])=>`<option value="${v}" ${pr.act===v?'selected':''}>${l}</option>`).join('')}</select></div>
   <div id="goalOut">${goalOut()}</div>
   <label class="row" style="gap:10px;margin:14px 0;font-size:14px"><input type="checkbox" style="width:20px;height:20px" ${pr.auto?'checked':''} onchange="A.pf('auto',this.checked)"> Kilomu girdikçe hedefleri otomatik güncelle</label>
   <button class="btn" onclick="A.applyGoal()">Hedefleri uygula</button></div>`}
const SIC={"perf":"<path d=\"M13 2L4 14h7l-1 8 9-12h-7l1-8z\"/>","wsum":"<path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/>","guide":"<path d=\"M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z\"/><path d=\"M19 19v2H6\"/>","news": "<path d=\"M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z\"/><path d=\"M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z\"/>", "med": "<path d=\"M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z\"/><path d=\"M8 12.5h2.2l1.2-2.3 1.6 4.3 1.1-2h2\"/>", "look": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"7.5\" cy=\"10.5\" r=\"1.2\"/><circle cx=\"12\" cy=\"7.5\" r=\"1.2\"/><circle cx=\"16.5\" cy=\"10.5\" r=\"1.2\"/><path d=\"M12 21c-1.5 0-2-1-2-2s1-2 2-2h1.5a3.5 3.5 0 0 0 3.5-3.5\"/>", "lang": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c2.5 2.7 3.7 5.7 3.7 9s-1.2 6.3-3.7 9c-2.5-2.7-3.7-5.7-3.7-9S9.5 5.7 12 3z\"/>", "rem": "<path d=\"M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z\"/><path d=\"M10 20.5a2 2 0 0 0 4 0\"/>", "swake": "<circle cx=\"12\" cy=\"13\" r=\"7.5\"/><path d=\"M12 9.5V13l2.5 2M4 5l3-2.5M20 5l-3-2.5\"/>", "goal": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\"/>", "train": "<path d=\"M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12\"/>", "health": "<rect x=\"7\" y=\"6\" width=\"10\" height=\"12\" rx=\"3\"/><path d=\"M9 6V3h6v3M9 18v3h6v-3M10 12h1l1-2 1.5 4 1-2h.5\"/>", "cloud": "<path d=\"M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z\"/>", "acct": "<path d=\"M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z\"/><path d=\"M12 8v4\"/><circle cx=\"12\" cy=\"15.5\" r=\".6\"/>", "profile": "<circle cx=\"12\" cy=\"8.5\" r=\"4\"/><path d=\"M4 20.5c1.3-3.8 4.4-5.5 8-5.5s6.7 1.7 8 5.5\"/>", "dev": "<rect x=\"7\" y=\"6\" width=\"10\" height=\"12\" rx=\"3\"/><path d=\"M9 6V3h6v3M9 18v3h6v-3M10 12h1l1-2 1.5 4 1-2h.5\"/>", "data": "<ellipse cx=\"12\" cy=\"6\" rx=\"7.5\" ry=\"3\"/><path d=\"M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6\"/>"},sic=k=>`<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${SIC[k]||''}</svg>`;
function settingsV(){
  const st=S.settings;
  const f=(k,l)=>`<div class="fld"><label>${l}</label><input id="s_${k}" inputmode="numeric" value="${st[k]}"></div>`;
const SEC={perf:()=>perfV(),news:()=>{setTimeout(()=>{A.setSec(null);newsSheet(true)},0);return ''},wsum:()=>{setTimeout(()=>{A.setSec(null);A.wkSum(0)},0);return ''},guide:()=>{setTimeout(()=>{A.setSec(null);ui.gback='settings';ui.gsec='all';ui.gq='';A.go('guide')},0);return ''},med:()=>medSec(),ahealth:()=>{const st=S.settings,ago=t=>{if(!t)return '—';const m=Math.round((Date.now()-t)/6e4);return m<1?'az önce':m<60?m+' dk önce':m<1440?Math.round(m/60)+' sa önce':Math.round(m/1440)+' gün önce'};
   return `<div class="card"><div class="row" style="gap:12px;align-items:center"><span style="font-size:30px">❤️</span><div style="flex:1"><b>Apple Sağlık</b><div class="lbl">Fitbit verin Google Health → Apple Sağlık üzerinden gelir</div></div><span class="intg-st ${st.hk?'on':''}">${st.hk?'Bağlı':'Bekliyor'}</span></div>
   <div class="dv-g" style="margin-top:12px"><div><span>Son senkron</span><b>${ago(st.ghLast)}</b><em>uygulama açıkken 5 dk'da bir</em></div><div><span>Okunan</span><b>nabız, uyku, adım…</b><em>kalori, HRV, SpO₂, kilo, antrenman</em></div><div><span>Yazılan</span><b>öğün, su, kafein</b><em>antrenman, kilo</em></div><div><span>Canlı nabız</span><b>${hrmOn()?(HRM.bpm||'—')+' bpm':'Bağlı değil'}</b><em>Bluetooth</em></div></div>
   <div class="grid2" style="margin-top:12px"><button class="btn" onclick="A.ghSync()">↻ Şimdi eşitle</button><button class="btn ghost" onclick="A.hkPerm()">İzinleri yönet</button></div>
   <div class="lbl" style="margin-top:10px;line-height:1.5">İzinleri değiştirmek için: Sağlık uygulaması → profil → Uygulamalar → HypeMode.</div></div>`},
cloud:()=>`  <button class="card setc" onclick="A.syncInfo()"><span>${CL.status==='synced'?'☁️':CL.status==='loading'?'⏳':'📱'}</span><div><b>Bulut & yedek</b><small>${cloudLabel()}</small></div><i>›</i></button>
`,legal:()=>legalV(),acct:()=>`  ${window.HMAcct?HMAcct.card():''}
`,goal:()=>`  ${goalCard()}
  <div class="card"><b>Günlük hedefler (manuel)</b><div class="lbl" style="margin-top:4px">"Hedefleri uygula" bu alanları otomatik doldurur. İstersen elle de değiştirebilirsin.</div><div class="grid2" style="margin-top:10px">${f('kcal','Kalori (kcal)')}${f('protein','Protein (g)')}${f('carbs','Karbonhidrat (g)')}${f('fat','Yağ (g)')}${f('rest','Set arası dinlenme (sn)')}</div>
   <button class="btn ghost" onclick="A.saveSettings()">Kaydet</button></div>
`,rem:()=>`  ${remCard()}${frNotifCard()}
`,lang:()=>`  <div class="card"><b>🌐 Dil / Language</b><div class="seg3" style="margin-top:10px" data-noi18n>${[['tr','🇹🇷 Türkçe'],['en','🇬🇧 English']].map(([k,l])=>`<button class="${LANG()===k?'on':''}" onclick="A.setLang('${k}')">${l}</button>`).join('')}</div></div>
`,look:()=>`  <div class="card"><b>🎨 Görünüm</b>${(()=>{const day=document.documentElement.dataset.mode==='light';return `<button type="button" class="dn${day?' day':''}" role="switch" aria-checked="${day}" aria-label="Gece / Gündüz" onclick="A.modeTgl(this)"><span class="dn-trk"></span><span class="dn-th"><svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z" fill="#e9eef7"/><circle cx="18" cy="5.5" r="1.1" fill="#fff"/><circle cx="14.5" cy="2.8" r=".7" fill="#fff"/></svg><svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.6" fill="#f59e0b"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M5.3 18.7l1.9-1.9M16.8 7.2l1.9-1.9" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" fill="none"/></svg></span></button><div class="dn-lbl">${day?'Gündüz modu':'Gece modu'}</div>`})()}
   <div class="lbl" style="margin-top:12px">Ana renk</div>${themePick((S.settings.theme)||'red','A.setTheme')}</div>
`,profile:()=>`  <div class="card"><b>👤 Profil</b><div class="row" style="gap:12px;margin:10px 0"><label class="avp">${avHtml(S.profile.name||S.profile.username,S.profile.photo)}<i>📷</i><input type="file" accept="image/*" hidden onchange="A.avPick(this)"></label><div><b>${esc(S.profile.name||'')}</b><div class="lbl">${S.profile.username?'@'+esc(S.profile.username):'kullanıcı adı yok'}</div>${S.profile.photo?`<button class="link" style="padding:2px 0;margin:0" onclick="A.avDel()">Fotoğrafı kaldır</button>`:''}</div></div><div class="lbl" style="margin:4px 0 10px">${S.profile.name?esc(S.profile.name)+' · ':''}Giriş sorularını baştan cevaplayıp hedeflerini yeniden hesapla.</div><button class="btn ghost" onclick="A.obRestart()">Giriş ekranını yeniden başlat</button></div>
`,train:()=>`  <div class="card"><b>📋 Şablon güncelleme</b><label class="tchk" style="margin-top:10px"><input type="checkbox" ${S.settings.autoTpl!==false?'checked':''} onchange="A.autoTpl(this.checked)"> Antrenmandan sonra şablonu otomatik güncelle</label>
   <div class="lbl" style="line-height:1.5">Antrenmanda set eklediysen, hareket değiştirdiysen, ısınma/drop seti ya da süperset kullandıysan şablon bir sonraki sefer için buna göre güncellenir. Özet ekranından geri alabilirsin.</div></div>
`,dev:()=>{const st=S.settings,D=st.ghDev||[],ago=t=>{if(!t)return '—';const m=Math.round((Date.now()-t)/6e4);return m<1?'az önce':m<60?m+' dk önce':m<1440?Math.round(m/60)+' sa önce':Math.round(m/1440)+' gün önce'};
   if(!st.ghOk&&!S.healthDemo&&!HMN())return `<div class="dv-empty">${HM_LOGO(110)}<h3>Cihaz bağla</h3><p>Fitbit Air'in Google Health üzerinden HypeMode'a bağlanır. Uyku, nabız, adım ve antrenmanların otomatik gelir.</p>
     <div class="dv-st">${[['1','Fitbit uygulamasında saatinin eşitlendiğinden emin ol'],['2','Aşağıdan Google hesabınla giriş yap ve izin ver'],['3','Veriler birkaç saniyede gelir; sonra otomatik güncellenir']].map(r=>`<div><b>${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div>
     <button class="gi-b" style="width:100%" onclick="A.ghSync()">Google Health'i bağla</button><button class="gi-l" onclick="A.healthDemo(true);A.setSec('dev')">Örnek veriyle dene</button></div>`;
   const BB=st.bleBat&&Date.now()-st.bleBat.t<6*36e5?st.bleBat:null;let list=D.length?D:[{name:S.healthDemo?'Fitbit Air (örnek)':(BB&&BB.name)||'Fitbit cihazı',last:S.healthDemo?Date.now()-12*6e4:null,bat:S.healthDemo?72:null}];if(BB)list=list.map((x,i)=>i?x:{...x,bat:BB.v,last:Math.max(x.last||0,BB.t)});
   return list.map(dv=>{const b=dv.bat,bc=b==null?'#8a8a94':b>50?'#3ee6a0':b>20?'#ffc93c':'#ff5f5f';return `<div class="dv-card"><div class="dv-top"><div class="dv-w"><svg aria-hidden="true" viewBox="0 0 64 64" width="64" height="64"><rect x="18" y="4" width="28" height="10" rx="3" fill="#2a2a31"/><rect x="18" y="50" width="28" height="10" rx="3" fill="#2a2a31"/><rect x="12" y="12" width="40" height="40" rx="12" fill="#141418" stroke="#3a3a42" stroke-width="2"/><path d="M22 33h6l3-7 4 13 3-6h5" fill="none" stroke="#ff4d5e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><i class="dv-dot ${dv.last&&Date.now()-dv.last<3*36e5?'on':''}"></i></div>
     <div><b>${esc(dv.name)}</b><small>${dv.last&&Date.now()-dv.last<3*36e5?'Bağlı · eşitleniyor':'Bağlı'} · ${HMN()?'Apple Sağlık + Bluetooth':'Google Health'}</small></div></div>
     <div class="dv-g"><div><span>Pil</span>${b!=null?`<div class="dv-bat"><i style="width:${b}%;background:${bc}"></i></div><b>%${Math.round(b)}</b>`:`<b>${dv.bl?esc(dv.bl):'—'}</b><em>${HMN()?(st.bleDiag?(/^svc:/.test(st.bleDiag.m)&&!/180F/i.test(st.bleDiag.m)?TT('Saat Bluetooth üzerinden pil bilgisi yayınlamıyor','The watch does not broadcast battery over Bluetooth'):TT('Pil okunamadı','Battery could not be read'))+' · '+esc(st.bleDiag.m):'Canlı nabız bağlanınca okunur (saat destekliyorsa)'):'Google bu cihaz için pil bilgisi vermiyor'}</em>`}</div>
      <div><span>Saatin son eşitlemesi</span><b>${ago(dv.last)}</b><em>${dv.last?new Date(dv.last).toLocaleString(LOC(),{weekday:'short',hour:'2-digit',minute:'2-digit'}):'Fitbit uygulamasını aç'}</em></div>
      <div><span>HypeMode senkronu</span><b>${ago(st.ghLast)}</b><em>${st.ghLast?new Date(st.ghLast).toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'}):''}</em></div>
      <div><span>Bluetooth</span><b>${dv.mac?esc(dv.mac):'Telefon üzerinden'}</b><em>${dv.mac?'':'Saat telefona bağlı, adres paylaşılmıyor'}</em></div></div>
     <div class="dv-src"><span>Gelen veriler</span>${['Uyku','Nabız','HRV','SpO₂','Adım','Mesafe','Antrenman','Kalori','VO₂max'].map(t=>`<i>${t}</i>`).join('')}</div>
     <div class="grid2"><button class="btn" onclick="A.ghSync()">↻ Şimdi eşitle</button><button class="btn ghost" onclick="A.setSec('health')">Ayrıntılar</button></div></div>`}).join('')+`<div class="lbl" style="margin:12px 4px;line-height:1.5">Saatin verisi önce Fitbit uygulamasına, oradan Google'a gider. "Saatin son eşitlemesi" eskiyse Fitbit uygulamasını açman yeterli.</div>`},health:()=>`  <div class="card intg"><div class="intg-h"><span class="intg-ic"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="#4285F4" d="M12 21s-7.5-4.6-7.5-10.3A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.5 2.7C19.5 16.4 12 21 12 21z"/><path d="M6.5 12.5h3l1.2-2.4 2 4.6 1.3-2.2h3.5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <div style="flex:1"><b>Google Health</b><div class="lbl">Fitbit Air ve diğer Fitbit cihazları</div></div><span class="intg-st ${S.settings.ghOk?'on':''}">${S.settings.ghOk?'Bağlı':'Bağlı değil'}</span></div>
   <div class="lbl" style="margin:12px 0;line-height:1.55">${S.settings.ghOk?`Son senkronizasyon: <b style="color:var(--txt)">${S.settings.ghLast?new Date(S.settings.ghLast).toLocaleString(LOC(),{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'-'}</b> · ${Object.keys(S.health||{}).length} günlük veri`:'Uyku, uyku evreleri, dinlenik nabız, HRV, SpO₂, solunum, adım ve nabız verilerin HypeMode\'a aktarılır. Sadece okuma izni istenir; verilerin Google\'dan doğrudan senin cihazına gelir.'}</div>
   ${S.settings.ghOk?`<div class="grid2"><button class="btn" onclick="A.ghSync()">Şimdi senkronize et</button><button class="btn ghost" onclick="A.ghOff()">Bağlantıyı kes</button></div>
   <div class="row between" style="margin-top:14px;gap:10px;align-items:center"><div><b style="font-size:14.5px">${TT('Kalıcı bağlantı','Permanent link')}</b><div class="lbl" style="font-size:12.5px;line-height:1.45">${S.settings.ghRT?TT('Açık: hiçbir cihazda tekrar giriş istemez.','On: no more sign-in prompts on any device.'):TT('Bir kez kur, telefonda ve bilgisayarda bir daha "bağlan" demesin.','Set once; no more connect prompts.')}</div></div>${S.settings.ghRT?`<button class="pill" onclick="A.ghPermOff()">${TT('Kaldır','Remove')}</button>`:`<button class="pill" onclick="A.ghPerm()">${TT('Kur','Set up')}</button>`}</div>`:`<button class="gbtn" onclick="A.ghSync()"><svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6C43.9 38 46.5 31.8 46.5 24.5z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>Google ile bağlan</button>`}
   <div id="ghlog" class="lbl" style="margin:8px 0 0;line-height:1.6"></div>
   <details style="margin-top:10px"><summary class="lbl" style="cursor:pointer">Gelişmiş</summary>
    <div class="fld" style="margin-top:10px"><label>Google OAuth Client ID</label><input id="ghcid" placeholder="1234…apps.googleusercontent.com" value="${esc(S.settings.ghClient||'')}" onchange="A.ghCid(this.value)" autocomplete="off"></div>
    <button class="link" onclick="A.ghRaw()">Örnek ham veriyi indir (hata bildirmek için)</button>
   <label class="row" style="gap:10px;margin:0 0 12px;font-size:14px"><input type="checkbox" style="width:20px;height:20px" ${S.settings.dynKcal!==false?'checked':''} onchange="A.dynKcal(this.checked)"> Kalori hedefini gerçek harcamama göre ayarla</label>
   <label class="row" style="gap:10px;margin:0 0 12px;font-size:14px"><input type="checkbox" style="width:20px;height:20px" ${S.healthDemo?'checked':''} onchange="A.healthDemo(this.checked)"> Örnek veriyle göster (Bugün sayfası)</label>
   ${Object.keys(S.health||{}).length?'<button class="link" style="color:var(--bad)" onclick="A.healthClear()">Sağlık verilerini sil</button>':''}
   <div class="fld" style="margin-top:10px"><label>Veya sağlık verisi dosyası yükle (.json)</label><input type="file" accept=".json,application/json" onchange="A.healthFile(this)"></div></details><details style="margin-top:8px;display:none"><summary class="lbl" style="cursor:pointer">Dosya formatı</summary><pre class="fmt">{"days":[{"date":"2026-12-01",
 "sleep":{"min":452,"deep":88,"rem":95,"light":239,
   "awake":31,"eff":93,"bed":"23:50","wake":"07:53"},
 "hrv":75,"rhr":60,"spo2":97,"resp":15.0,
 "steps":8120,"active":34,"kcalOut":2710,
 "hr15":[58,57,56,"… 15 dakikalık 96 nabız değeri"]}]}</pre></details></div>
`,data:()=>`  <div class="card"><b>Veri depolama</b><div style="margin:8px 0 2px;font-weight:600">${cloudLabel()}</div>
   <div class="lbl" data-noi18n style="line-height:1.5">${CL.status==='synced'?(window.HM_PWA?TT('Verilerin HypeMode hesabına bağlı; Google Firebase (ABD) sunucularında, yalnızca sana açık bir veritabanında saklanıyor. Telefon, iPad ve bilgisayarda aynı verileri görürsün.','Your data is linked to your HypeMode account and stored on Google Firebase servers (USA) in a database only you can access. You see the same data on your phone, iPad and computer.'):TT('Verilerin claude.ai hesabına bağlı, yalnızca sana açık bir veritabanında saklanıyor. Telefon ve bilgisayarda aynı verileri görürsün.','Your data is linked to your claude.ai account and stored in a database only you can access. You see the same data on your phone and computer.')):(window.HM_PWA?TT('Hesabına giriş yaptığında veriler otomatik olarak buluta taşınır.','Your data moves to the cloud automatically when you sign in.'):TT('Uygulama claude.ai üzerinden açıldığında veriler otomatik olarak buluta taşınır.','When the app is opened through claude.ai, your data moves to the cloud automatically.'))}</div>
   <div class="grid2" style="margin-top:10px"><button class="btn ghost" onclick="A.syncInfo()">📲 Cihazlar & kurulum</button><button class="btn ghost" onclick="A.backupFile()">⬇︎ Yedeği indir</button></div></div>
  <div class="card"><b>Veri: dışa / içe aktar</b><div class="lbl" style="margin:4px 0 10px;line-height:1.5">Yedek almak ya da başka bir yere taşımak için. Bu JSON ileride ML modeli ve koç için eğitim verin olacak.</div>
   <textarea id="io" rows="6" style="font-family:monospace;font-size:11px" placeholder="Dışa aktar'a bas ya da yedeğini buraya yapıştır"></textarea>
   <div class="grid2" style="margin-top:10px"><button class="btn ghost" onclick="A.exportData()">Dışa aktar + kopyala</button><button class="btn ghost" onclick="A.importData()">İçe aktar</button></div>
   <div class="fld" style="margin-top:10px"><label>…ya da yedek dosyası seç (.json)</label><input type="file" accept=".json,application/json" onchange="A.importFile(this)"></div></div>
  <div class="card" style="display:none"><div class="lbl" style="margin-bottom:10px">Kullanılan alan: <b>${(()=>{try{return Math.round((localStorage.getItem(KEY)||'').length/1024)}catch(e){return 0}})()} KB</b> / ~5.000 KB · ${S.photos.length} fotoğraf</div><button class="btn ghost" style="color:var(--bad)" onclick="A.resetAsk()">Tüm verileri sıfırla</button></div>
`};
  const SM={perf:['⚡',TT('Performans ve depolama','Performance & storage'),TT('Hız, yedekler, güç tasarrufu','Speed, backups, power saving')],wsum:['📊',TT('Haftalık özet','Weekly summary'),TT('Antrenman, kilo, beslenme, rekorlar','Workouts, weight, food, PRs')],guide:['📖',TT('Rehber','Guide'),TT('Beslenme, antrenman, hastalıklar','Nutrition, training, conditions')],legal:['⚖️',TT('Gizlilik ve yasal','Privacy & legal'),TT('Aydınlatma metni · rızalar · iletişim','Notice · consents · contact')],look:['🎨','Görünüm',`${({dark:'Gece',light:'Gündüz'})[document.documentElement.dataset.mode||'dark']} · ${({energy:'Enerji',ocean:'Okyanus',lavender:'Lavanta',red:'Kırmızı',pink:'Pembe',orange:'Turuncu',purple:'Mor',blue:'Mavi',green:'Yeşil',mono:'Gri',night:'Gece'})[st.theme||'red']||st.theme}`],lang:['🌐','Dil / Language',LANG()==='en'?'English':'Türkçe'],rem:['🔔','Bildirimler','Hatırlatıcıları yönet'],goal:['🎯','Hedefler','Kalori ve makro hedefleri'],news:['✨','Yenilikler',NEWS[0].t[0]],med:['🩺','Sağlık durumum',(S.med&&S.med.conds&&S.med.conds.length)?S.med.conds.map(k=>(MEDC.find(x=>x[0]===k)||[,'?'])[1]).join(', '):'Diyabet, kolesterol, tansiyon, böbrek, gut'],train:['📋','Antrenman','Şablon güncelleme'],
    dev:['⌚','Cihazlar',st.ghDev&&st.ghDev[0]?esc(st.ghDev[0].name)+(st.ghDev[0].bat!=null?' · %'+st.ghDev[0].bat:''):(st.ghOk?'Bağlı':'Cihaz bağla')],ahealth:['❤️','Apple Sağlık',st.hk?'Bağlı · '+(st.ghLast?new Date(st.ghLast).toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'})+' senkron':''):'İzin ver'],health:['⌚','Google Health · Fitbit',st.ghOk?'Bağlı · '+Object.keys(S.health||{}).length+' gün veri':'Bağlı değil'],cloud:['☁️','Bulut & yedek',cloudLabel().replace(/^\S+\s/,'')],acct:['🔐','Hesap & güvenlik','Giriş, bildirim izinleri'],profile:['👤','Profil','Ad, fotoğraf, kullanıcı adı'],data:['🗄️','Depolama & veri','Dışa aktar, içe aktar, temizle']};
  if(!HMN()){const d0=SEC.dev;SEC.dev=()=>hkScCard()+d0()}
  const sec=ui.setSec&&SEC[ui.setSec]?ui.setSec:null;
  if(sec)return `<div class="sp-h"><button class="ddp-b" onclick="A.setSec(null)">‹ Ayarlar</button><b>${SM[sec][1]}</b><span></span></div><div class="sp-sec">${SEC[sec]()}</div><div style="height:110px"></div>`;
  const used=(()=>{try{return (localStorage.getItem(KEY)||'').length/1024}catch(e){return 0}})(),cap=5120,pct=Math.min(100,used/cap*100);
  const row=k=>k==='swake'?`<button class="sr" onclick="A.swake()"><span class="sr-i">${sic('swake')}</span><span class="sr-t"><b>Akıllı uyandırma</b><small>${S.swake&&S.swake.on?'Açık · '+hmT(swPlan().t):'Kapalı'} · ${HMN()?'bildirim + ses':'titreşim'}</small></span><i class="sr-c">›</i></button>`:SM[k]&&(k!=='acct'||window.HMAcct)?`<button class="sr" onclick="A.setSec('${k}')"><span class="sr-i">${SIC[k]?sic(k):SM[k][0]}</span><span class="sr-t"><b>${SM[k][1]}</b><small>${SM[k][2]}</small></span><i class="sr-c">›</i></button>`:'';
  const grp=(t,ks)=>{const h=ks.map(row).join('');return h?`<div class="sg-t">${t}</div><div class="sg">${h}</div>`:''};
  return `<div class="sp-top"><button class="back" onclick="A.go('home')">${I.back}</button><h1>Profilin</h1><button class="sp-gear" onclick="A.setSec('look')" aria-label="Görünüm"><svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button></div>
   <button class="sp-prof" onclick="A.setSec('profile')"><span class="sp-av">${avHtml(S.profile.name||S.profile.username||'?',S.profile.photo)}</span><span class="sr-t"><b>${esc(S.profile.name||TT('Adını ekle','Add your name'))}</b><small>${S.profile.username?'@'+esc(S.profile.username):'kullanıcı adı yok'}</small><em class="sp-chip">${CL.status==='synced'?'Bulut hesabı':'Yerel'} · Ücretsiz</em></span><i>›</i></button>
   ${grp(TT('Sık kullanılanlar','Essentials'),['guide','med','goal','rem','dev',HMN()?'ahealth':'health','cloud'])}${grp(TT('Hesap','Account'),['acct','profile','wsum','news','data','perf','legal'])}${grp(TT('Görünüm ve dil','Look & language'),['look','lang'])}
   <div class="pad lbl" style="text-align:center;margin:10px 0 20px">HypeMode v0.1 · kural tabanlı koç (çift ilerleme + RPE)</div>`;
}

/* ---------- sheets / toast ---------- */
let _sb=false,_sp=null;
function sheet(html,keep){if(_sb){_sp=[html,keep];return}_sb=true;
  try{_sheet(html,keep)}finally{_sb=false}
  if(_sp){const q=_sp;_sp=null;sheet(q[0],true)}}
function _sheet(html,keep){const old=document.querySelector('#scrim .sheet'),st=keep&&old?old.scrollTop:0;
  closeSheet();const d=document.createElement('div');d.className='scrim';d.id='scrim';d.innerHTML=`<div class="sheet" ${keep?'style="animation:none"':''}>${html}</div>`;
  d.addEventListener('click',e=>{if(e.target===d)closeSheet()});document.body.appendChild(d);try{stripEmo(d)}catch(e){}if(st)d.firstChild.scrollTop=st;try{m3dScan()}catch(e){}}
function closeSheet(){const s=document.getElementById('scrim');if(s){s.id='';try{s.remove()}catch(e){}try{m3dScan()}catch(e){}}}
function toast(t){const d=document.createElement('div');d.className='toast';const s=typeof t==='string'?t:String(t),ok=/^\s*(✓|✅)|kaydedildi|eklendi|güncellendi|kopyalandı|tamamlandı|\bsaved\b|\badded\b/i.test(s),tx=emoText(s).replace(/^\s*[✓✔]\s*/,'').replace(/\s{2,}/g,' ').trim();
  if(ok){d.classList.add('ok');d.innerHTML='<svg class="tk" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';d.appendChild(document.createTextNode(tx))}else d.textContent=tx;
  document.querySelectorAll('body>.toast').forEach(x=>x.remove());document.body.appendChild(d);setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),220)},1800)}
/* mikro etkileşim: hafif titreşim + rekor kutlaması (düşük güç / azaltılmış harekette sade) */
function tap(){try{if((S.settings&&S.settings.vib)==='off'||!navigator.vibrate)return;navigator.vibrate(8)}catch(e){}}
function prFx(n){try{buzz([30,40,60])}catch(e){}const calm=document.documentElement.classList.contains('lowpow')||matchMedia('(prefers-reduced-motion:reduce)').matches;
  const d=document.createElement('div');d.className='prfx'+(calm?' calm':'');d.setAttribute('role','status');
  d.innerHTML=`<div class="prfx-c">${eiSvg('trophy')}<b>${n>1?n+' yeni rekor':'Yeni rekor'}</b><small>Tahmini 1RM'in arttı</small></div>${calm?'':Array.from({length:14},(_,i)=>`<i style="--a:${i*360/14}deg;--d:${60+(i%3)*22}px"></i>`).join('')}`;
  d.onclick=()=>d.remove();document.body.appendChild(d);setTimeout(()=>d.remove(),calm?1600:2200)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button.btn,.chk,.wbig,.wf-ctl button,.tabs button');if(b)tap()},true);
function ask(q,yes,label='Evet'){sheet(`<h3>${q}</h3><div class="grid2"><button class="btn ghost" onclick="A.close()">Vazgeç</button><button class="btn" id="yes">${label}</button></div>`);
  document.getElementById('yes').onclick=()=>{closeSheet();yes()}}

/* ---------- rest timer ---------- */
let restEnd=0,restT=null;
function startRest(sec){restEnd=Date.now()+(sec||S.settings.rest)*1000;restBar();clearInterval(restT);restT=setInterval(restBar,250)}
function restBar(){
  let el=document.getElementById('rest');const left=Math.ceil((restEnd-Date.now())/1000);
  if(left<=0||ui.view!=='workout'){if(el){el.remove();if(left<=0&&ui.view==='workout')try{buzz([90,60,90])}catch(e){}}if(left<=0)clearInterval(restT);return}
  if(!el){el=document.createElement('div');el.className='rest';el.id='rest';
    el.innerHTML='<span>'+eiSvg('clock')+' Dinlenme <span id="rt"></span></span><button onclick="A.restAdd(30)">+30</button><button onclick="A.restAdd(-999)">Atla</button>';document.body.appendChild(el)}
  document.getElementById('rt').textContent=Math.floor(left/60)+':'+z(left%60);
}

let hold=null,_ac=null,_errT=0;
addEventListener('error',ev=>{if(Date.now()-_errT<4000)return;_errT=Date.now();try{toast('⚠️ Hata: '+String(ev.message||'').slice(0,80))}catch(_){}});
function beep(f=880,d=.12){try{_ac=_ac||new (window.AudioContext||window.webkitAudioContext)();const o=_ac.createOscillator(),g=_ac.createGain();o.frequency.value=f;g.gain.value=.12;o.connect(g);g.connect(_ac.destination);o.start();o.stop(_ac.currentTime+d)}catch(_){}}
setInterval(()=>{if(!S.active||ui.view!=='workout')return;
  const w=document.getElementById('wkt');if(w)w.textContent='⏱ '+mmss(Date.now()-S.active.startedAt);
  if(hold&&hold.inf){const n=document.getElementById('holdt');if(n)n.textContent=tFmt((Date.now()-hold.start)/1000);}
  else if(hold){const left=hold.target-(Date.now()-hold.start)/1000,sec=Math.ceil(left);
    const n=document.getElementById('holdt'),b=document.getElementById('holdb');if(n)n.textContent=tFmt(sec);if(b)b.style.width=Math.min(100,(Date.now()-hold.start)/10/hold.target)+'%';
    if(sec<=3&&sec>0&&hold.bp!==sec){hold.bp=sec;beep(660,.08)}
    if(left<=0)A.holdStop(true)}},200);
/* ---------- actions ---------- */
const A=window.A={
  close:closeSheet,
  tool(id){if(ui.view!=='tool')ui.tFrom=ui.view;ui.tool=id;ui.view='tool';ui.tDone=null;ui.tv=null;closeSheet();render()},
  tSet(k,v){ui.tv[k]=isNaN(+v)?v:+v;render(true)},
  tSlide(k,el,u){const v=+el.value;ui.tv[k]=v;const b=document.getElementById('tv_'+k);if(b)b.textContent=fmt(v)+(u?' '+u:'');el.style.setProperty('--p',Math.round((v-el.min)/(el.max-el.min)*100)+'%');if(ui.tDone){const r=document.getElementById('tres');if(r)r.innerHTML=toolResult(ui.tool,ui.tv)}},
  tCalc(){ui.tDone=ui.tool;const r=document.getElementById('tres');if(r){r.innerHTML=toolResult(ui.tool,ui.tv);if(innerWidth<960)r.scrollIntoView({behavior:'smooth',block:'start'})}},
  tReset(){ui.tDone=null;render(true)},
  tApply(k,p,c,f){Object.assign(S.settings,{kcal:k,protein:p,carbs:c,fat:f});save();toast(TT('Günlük hedefin güncellendi','Daily target updated'))},
  acMore(){ui.ac.n=(ui.ac.n||36)+36;document.getElementById('acl').innerHTML=acList()},
  acQ(v){ui.ac.q=v;ui.ac.n=36;document.getElementById('acl').innerHTML=acList()},
  exd(n){try{n=decodeURIComponent(n)}catch(e){}ui.exd=n;ui.view='exd';closeSheet();render()},
  acF(k,v){ui.ac=ui.ac||{};ui.ac[k]=ui.ac[k]===v?null:v;ui.ac.n=36;render(true)},
  acMus(k){const m={lats:'back',trap:'back',lowback:'back',obliques:'core',forearms:'biceps'}[k]||k;ui.ac=ui.ac||{};ui.ac.m=(ui.view==='academy'&&ui.ac.m===m)?null:m;ui.ac.n=36;if(ui.view!=='academy'){ui.view='academy';render()}else render(true)},
  acTry(n){try{n=decodeURIComponent(n)}catch(e){}const x=XBY[n]||ACX().find(r=>r[0]===n);if(!x)return;A._q={q:'',sel:[{name:x[0],tr:x[1],muscle:x[2],eq:x[3],t:x[5]==='t'?1:0,goal:'',sets:'',kg:''}]};A.qDraw()},
  acAdd(n){try{n=decodeURIComponent(n)}catch(e){}const ps=S.plans.filter(p=>!p.archived);if(!ps.length){toast('Önce bir şablon oluştur');return}
    sheet(`<h3>Hangi şablona eklensin?</h3>${ps.map(p=>`<button class="btn ghost" style="margin-bottom:8px" onclick="A.acAddTo('${p.id}','${ja(n)}')">${esc(p.name)}</button>`).join('')}`)},
  acAddTo(pid,n){try{n=decodeURIComponent(n)}catch(e){}const p=S.plans.find(x=>x.id===pid),x=XBY[n]||ACX().find(r=>r[0]===n);if(!p||!x)return;if(p.exercises.some(e=>e.name===x[0])){toast('Bu şablonda zaten var');return}
    const r=acRx(x),[a,b]=String(r[1]).replace(/[^0-9–]/g,'').split('–').map(Number);const bw=x[3]==='bodyweight'||x[3]==='band';
    const e={name:x[0],tr:x[1],muscle:x[2],sets:parseInt(r[0])||3,repMin:a||8,repMax:b||a||12,inc:bw?0:2.5,eq:x[3]};if(x[5]==='t'){e.t=1;e.fix=0}else if(bw)e.fix=0;
    p.exercises.push(e);save();closeSheet();toast(`${p.name} şablonuna eklendi`)},
  _ed(kind){const HK=kind==='home'?'homeHide':kind==='food'?'foodHide':'pgHide';const H=S.settings[HK]||(kind==='pg'?['vol']:[]);
    const L0=kind==='home'?HSEC.filter(x=>!x[3]||cycOn()):kind==='food'?FSEC:PSEC,ord=(S.settings.ord||{})[kind]||(kind==='home'?HDEF:[]),ix=k=>{const i=ord.indexOf(k);return i<0?999+L0.findIndex(x=>x[0]===k):i};
    return{HK,H,L:L0.slice().sort((a,b)=>ix(a[0])-ix(b[0]))}},
  _edG(kind,k){if(kind!=='home')return 0;return HDEF.includes(k)?0:null},
  _edN(kind,L,i,d){const g=A._edG(kind,L[i][0]);if(g==null)return -1;for(let j=i+d;j>=0&&j<L.length;j+=d)if(A._edG(kind,L[j][0])===g)return j;return -1},
  edSheet(kind){const{H,L}=A._ed(kind);
    sheet(`<h3>✎ ${kind==='home'?'Ekranı düzenle':'Sayfayı düzenle'}</h3><div class="lbl" style="margin:-6px 0 10px">${kind==='home'?'Bölümleri aç/kapat, okla yukarı-aşağı taşı.':'Bölümleri aç/kapat, okla yukarı-aşağı taşı.'}</div>
     ${L.map(([k,ic,n],i)=>{const on=!H.includes(k);return `<div class="hed-r"><span>${ic}</span><b>${n}</b><span class="hed-m"><button onclick="A.edMove('${kind}','${k}',-1)" ${A._edN(kind,L,i,-1)>=0?'':'disabled'} aria-label="Yukarı taşı">${lic('up',18)}</button><button onclick="A.edMove('${kind}','${k}',1)" ${A._edN(kind,L,i,1)>=0?'':'disabled'} aria-label="Aşağı taşı">${lic('down',18)}</button></span><button class="sw ${on?'on':''}" role="switch" aria-checked="${on}" aria-label="${n}" onclick="A.edTog('${kind}','${k}')"></button></div>`}).join('')}
     <div class="grid2" style="margin-top:14px"><button class="btn ghost" onclick="A.edAll('${kind}')">Sıfırla</button><button class="btn" onclick="A.close()">Bitti</button></div>`,true)},
  edMove(kind,k,d){const{L}=A._ed(kind),a=L.map(x=>x[0]),i=a.indexOf(k),j=A._edN(kind,L,i,d);if(j<0)return;[a[i],a[j]]=[a[j],a[i]];S.settings.ord={...(S.settings.ord||{}),[kind]:a};save();render(true);A.edSheet(kind)},
  edTog(kind,k){const{HK,H}=A._ed(kind);const btn=event&&event.currentTarget;if(btn){btn.classList.toggle('on');btn.setAttribute('aria-checked',btn.classList.contains('on'))}S.settings[HK]=H.includes(k)?H.filter(x=>x!==k):[...H,k];save();setTimeout(()=>{render(true);A.edSheet(kind)},260)},
  edAll(kind){const{HK}=A._ed(kind);S.settings[HK]=[];const o={...(S.settings.ord||{})};delete o[kind];S.settings.ord=o;save();render(true);A.edSheet(kind)},
  go(v){if(ui.b3&&v!=='programs')ui.b3.sel=null;ui.view=v;if(v==='food'||v==='mealplan')ui.yLast=v;closeSheet();render()},
  openPlan(id,back){ui.planId=id;ui.planBack=back||'programs';ui.view='plan';render()},
  pickPlan(){sheet(`<h3>Antrenman seç</h3>${S.plans.map(p=>`<button class="btn ghost" style="margin-bottom:10px;text-align:left" onclick="A.close();A.openPlan('${p.id}')">${esc(p.name)} <span class="muted" style="font-size:13px">· ${p.exercises.length} egzersiz</span></button>`).join('')}`)},
  start(id){
    const p0=plan(id),lc=locAdapt(p0),p=lc.p;
    setTimeout(lockStart,0);ui.wHR=null;S.active={planId:p.id,planName:p.name,startedAt:Date.now(),idx:0,ex:p.exercises.map(e=>{const sg=suggest(e);
      const st=Array.from({length:e.sets},()=>({kg:sg.kg??'',reps:sg.reps??'',rpe:'',done:false}));
      if(e.last&&e.last!=='n'&&!e.t&&st.length){const l=st[st.length-1];l.ty=e.last;if(e.last==='d'&&num(sg.kg)>0)l.kg=kgRound(num(sg.kg)*.75,e.inc)}
      const wu=Array.from({length:e.t?0:Math.min(3,e.wu||0)},(_,k)=>({kg:num(sg.kg)>0?kgRound(num(sg.kg)*(k?.7:.5),e.inc):'',reps:k?5:8,rpe:'',done:false,ty:'w'}));
      return{...e,o:e.name,sugg:sg,sets:[...wu,...st]}})};
    if(lc.n)S.active.loc='home';
    if(S.settings.autoWarm){const seen=new Set();S.active.ex.forEach(e=>{const g=mgOf(e.muscle);if(seen.has(g))return;
      if(e.sets.some(x=>tyOf(x)==='w')){seen.add(g);return}if(!wuCand(e))return;const w0=e.sets.find(x=>tyOf(x)!=='w'),L=wuGen(e,w0&&w0.kg);if(L.length){e.sets=[...L,...e.sets];seen.add(g)}})}
    if(lc.n)setTimeout(()=>toast(`🏠 ${lc.n} hareket eve göre değişti`),500);
    save();countdown(p);
    if(SDB()&&S.profile.username&&!(S.social&&(S.social.liveNotify===false||S.social.live===false))&&p.tmpl!=='live-join'){(S.friends||[]).filter(f=>isMut(SOC.friends[f.uid])).slice(0,10).forEach(f=>inboxSend(f.uid,{type:'live',msg:p.name}))}
  },
  setVal(i,k,v){const s=S.active.ex[S.active.idx].sets[i];s[k]=v;save();
    const btn=document.querySelector('.bottom-cta .btn');const e=S.active.ex[S.active.idx];const ni=e.sets.findIndex(x=>!x.done);
    if(btn&&ni===i&&!e.t){const ns=e.sets[i];btn.textContent=`Set ${i+1} kaydet · ${ns.kg!==''?ns.kg+' kg':'? kg'} × ${ns.reps||'?'}`}},
  toggleSet(i){const s=S.active.ex[S.active.idx].sets[i];
    if(!s.done){if(num(s.kg)==null||!num(s.reps)){toast('Önce kg ve tekrar gir');return}s.done=true;const e=S.active.ex[S.active.idx];
      if(tyOf(s)!=='w')e.sets.forEach((o,j)=>{if(j>i&&!o.done&&(o.kg===''||o.kg==null)&&tyOf(o)!=='w')o.kg=s.kg});
      const nx=e.sets[i+1];
      if(tyOf(s)==='w')startRest(45);
      else if(nx&&!nx.done&&tyOf(nx)==='d'){if(num(s.kg)>0&&(nx.kg===''||num(nx.kg)>=num(s.kg)))nx.kg=kgRound(num(s.kg)*.75,e.inc);restEnd=0;toast('⬇ Drop set: kiloyu düşür, dinlenmeden devam et')}
      else if(!A._ssAdv())startRest()}else s.done=false;
    save();render()},
  addSet(){const e=S.active.ex[S.active.idx];const l=e.sets.filter(x=>tyOf(x)!=='w').pop()||e.sets[e.sets.length-1]||{};e.sets.push({kg:l.kg??'',reps:l.reps??'',rpe:'',done:false});save();render()},
  cta(){const a=S.active,e=a.ex[a.idx],i=e.sets.findIndex(s=>!s.done);
    if(i>=0&&e.t)return hold&&hold.ai===a.idx&&hold.i!=null?A.holdStop(false):A.holdStart();
    if(i>=0)return A.toggleSet(i);
    const t=nextEx(a);if(t>=0){a.idx=t;save();render()}else A.finish()},
  prevEx(){if(S.active.idx>0){S.active.idx--;save();render()}else ask('Antrenmandan çık?',()=>{A.finishAsk()},'Devam')},
  restAdd(s){restEnd+=s*1000;restBar()},
  b3Sel(k){const st=ui.b3||(ui.b3={yaw:.35,per:7});st.sel=k||null;render(true)},
  wtLog(){const v=prompt(TT('Bugünkü kilon (kg)','Today\'s weight (kg)'),latestW()!=null?String(latestW()).replace('.',','):'');if(v==null)return;const w=parseFloat(String(v).replace(',','.'));if(!(w>25&&w<350)){toast(TT('Geçerli bir kilo gir','Enter a valid weight'));return}
    const d=dkey(),b=S.body.find(x=>x.date===d);if(b)b.weight=w;else S.body.push({date:d,weight:w,sleep:null});S.profile.weight=w;save();render(true);toast(TT('✓ Kilo kaydedildi','✓ Weight saved'))},
  wtGoal(){const v=prompt(TT('Hedef kilon (kg) — boş bırakırsan silinir','Goal weight (kg)'),S.profile.gw?String(S.profile.gw).replace('.',','):'');if(v==null)return;const w=parseFloat(String(v).replace(',','.'));
    if(!v.trim()){delete S.profile.gw}else if(w>25&&w<350)S.profile.gw=w;else{toast(TT('Geçerli bir kilo gir','Enter a valid weight'));return}save();render(true)},
  fnTog(k){S.settings.fn={...(S.settings.fn||{}),[k]:!fnOn(k)};save();SOC.lastPush=null;try{socPush()}catch(e){}render(true)},
  async webPush(){try{if(window.HMAcct&&HMAcct.push)await HMAcct.push()}catch(e){}render(true)},
  demoStart(){window.HM_DEMO=1;document.documentElement.classList.add('demo');const now=Date.now(),D=864e5;
    S.onboarded=true;S.profile={...S.profile,name:'Demo',username:'',sex:'m',age:28,height:180,weight:82,goal:'cut',pct:.5,applied:true,gw:76};S.healthDemo=true;S.settings.rz={v:2,cloud:false,health:true};S.settings.newsSeen=999;S.settings.ghIntro=1;
    const W=[['Bench Press (Barbell)','chest'],['Lat Pulldown','back'],['Overhead Press (Dumbbell)','shoulders'],['Barbell Curl','biceps'],['Triceps Pushdown','triceps'],['Squat (Barbell)','quads'],['Romanian Deadlift','hamstrings'],['Hip Thrust','glutes'],['Plank','core']];
    S.sessions=[];for(let k=0;k<12;k++){const day=k*2+1,ex=k%2?W.slice(5):W.slice(0,5);S.sessions.push({id:'demo'+k,planName:k%2?'Alt vücut':'Üst vücut',date:new Date(now-day*D).toISOString(),dur:3300,prs:[],sets:ex.flatMap(([n,m],i)=>Array.from({length:3},()=>({ex:n,muscle:m,kg:40+i*5+k,reps:8+(k%3),done:true})))})}
    S.sessions.reverse();S.body=Array.from({length:10},(_,i)=>({date:dkey(new Date(now-i*3*D)),weight:Math.round((80.2+i*.35+((i*7)%3)*.2)*10)/10,sleep:null}));
    ui.view='home';render();toast(TT('Demo: örnek verilerle geziyorsun','Demo: browsing with sample data'))},
  demoEnd(){try{sessionStorage.setItem('hm-demo-exit','1')}catch(e){}location.reload()},
  b3Mode(m){const st=ui.b3||(ui.b3={yaw:.35,per:7});st.mode=m;st.sel=null;tap();render(true)},
  b3All(){const st=ui.b3||(ui.b3={yaw:.35,per:7});st.all=!st.all;tap();render(true)},
  b3Per(v){const st=ui.b3||(ui.b3={yaw:.35});st.per=v;st.sel=null;tap();render(true)},
  b3Face(f){const st=ui.b3||(ui.b3={yaw:.35,per:7});st.face=f;st.yawT=f?Math.PI:0;render(true)},
  wFocus(){S.settings.wfocus=!S.settings.wfocus;save();render()},
  wfStep(i,k,d){const e=S.active&&S.active.ex[S.active.idx];if(!e)return;const s=e.sets[i];if(!s)return;
    if(k==='kg'){const st=+e.inc||2.5,v=Math.max(0,Math.round(((num(s.kg)||0)+d*st)*100)/100);s.kg=v}else s.reps=Math.max(1,(num(s.reps)||0)+d);
    tap();save();render(true)},
  setLang(l){S.settings.lang=l;document.documentElement.lang=l;save();render(true);if(l==='en')i18nApply(document.body)},
  setMode(m){S.settings.mode=m;save();render(true)},
  joinLive(fid){const f=(S.friends||[]).find(x=>x.uid===fid),d=SOC.friends[fid],L=liveOf(d);if(!f||!L)return toast('Arkadaşın şu an antrenmanda değil');
    if(S.active)return toast('Önce kendi antrenmanını bitir');const nm=(d&&d.name)||f.username;
    let p=S.plans.find(x=>x.tmpl==='live-join');if(!p){p={id:uid(),tmpl:'live-join',archived:true};S.plans.push(p)}
    p.name=nm+' ile · '+L.n;p.archived=true;p.exercises=L.ex.map(e=>{const x=XBY[e.n],mine=S.plans.filter(q=>q.tmpl!=='live-join').flatMap(q=>q.exercises||[]).find(q=>q.name===e.n);
      return mine?{...mine,sets:Math.max(1,e.t||mine.sets)}:{name:e.n,tr:(x&&x[1])||'',muscle:(x&&x[2])||'other',sets:Math.max(1,e.t||3),repMin:e.tm?30:8,repMax:e.tm?60:12,inc:x&&['bodyweight','band'].includes(x[3])?0:2.5,...(e.tm?{t:1}:{})}});
    closeSheet();A.start(p.id);S.active.with={uid:fid,u:f.username,n:nm};save();
    inboxSend(fid,{type:'poke',kind:'cheer',msg:'🏋️ Seninle aynı antrenmana başladım!'});toast('🏋️ '+nm+' ile ortak antrenman başladı')},
  setLoc(l){S.settings.loc=l;save();render(true);toast(l==='home'?'🏠 Ev modu açık':'🏢 Salon modu açık')},
  locEq(){sheet(`<h3>🏠 Evdeki ekipman</h3><div class="lbl" style="margin:-6px 0 12px;line-height:1.5">Ev modunda antrenmana başlayınca, burada olmayan ekipmanı isteyen hareketler aynı kası çalıştıran bir alternatifle değiştirilir. Evde antrenman oluşturucu da bu listeyi kullanır.</div>
    <div class="gen-eq">${EQ.map(([k,ic,n])=>`<button class="${homeEq().includes(k)?'on':''}" ${k==='bodyweight'?'disabled':''} onclick="A.genEq('${k}');A.locEq()">${ic} ${n}</button>`).join('')}</div>`)},
  warm(){const a=S.active,e=a&&a.ex[a.idx];if(!e)return;const has=e.sets.some(x=>tyOf(x)==='w'),w0=e.sets.find(x=>tyOf(x)!=='w')||{},L=wuGen(e,w0.kg);
    sheet(`<h3>🔥 Isınma setleri</h3><div class="lbl" style="margin:-6px 0 12px;line-height:1.5">Ağır setlerden önce kası ve eklemi hazırlar, sakatlanma riskini azaltır. Çalışma kilona göre hesaplanır; ısınma setleri kas yüküne ve rekorlara sayılmaz.</div>
      ${num(w0.kg)>0?(L.length?`<div class="card" style="margin:0 0 12px">${L.map((x,i)=>`<div class="row between" style="padding:6px 0;${i?'border-top:1px solid var(--line)':''}"><span>Isınma ${i+1}</span><b>${String(x.kg).replace('.',',')} kg × ${x.reps}</b></div>`).join('')}<div class="row between" style="padding:6px 0;border-top:1px solid var(--line)"><span>Çalışma seti</span><b style="color:var(--a1)">${String(num(w0.kg)).replace('.',',')} kg</b></div></div>`:'<div class="lbl" style="margin-bottom:12px">Bu kilo için ısınma seti gerekmiyor.</div>'):'<div class="lbl" style="margin-bottom:12px">Önce ilk çalışma setine kilo yaz, ısınmayı ona göre hesaplayayım.</div>'}
      <div class="grid2">${L.length?`<button class="btn" onclick="A.warmSet(1)">${has?'↻ Yeniden hesapla':'+ Ekle'}</button>`:''}${has?`<button class="btn ghost" onclick="A.warmSet(0)">Kaldır</button>`:''}</div>
      <label class="row" style="gap:10px;margin-top:14px;align-items:center;justify-content:flex-start"><input type="checkbox" style="width:20px;height:20px;flex:none;margin:0" ${S.settings.autoWarm?'checked':''} onchange="S.settings.autoWarm=this.checked;save()"><span>Her antrenmanda ağır hareketlere otomatik ekle</span></label>`)},
  warmSet(on){const a=S.active,e=a.ex[a.idx],keep=e.sets.filter(x=>tyOf(x)!=='w'||x.done);e.sets=keep;if(on){const w0=keep.find(x=>tyOf(x)!=='w')||{};e.sets=[...wuGen(e,w0.kg),...keep]}closeSheet();save();render(true);toast(on?'🔥 Isınma setleri eklendi':'Isınma setleri kaldırıldı')},
  swapSheet(){
    const cur=S.active.ex[S.active.idx];
    const all=[...new Map(S.plans.flatMap(p=>p.exercises).map(e=>[e.name,e])).values()].filter(e=>e.muscle===cur.muscle&&e.name!==cur.name);
    sheet(`<h3>${esc(cur.name)} yerine</h3>
      ${CL.sample?`<div class="card coach" style="margin:0 0 14px;padding:14px"><h4>🤖 AI'dan alternatif iste</h4>
        <div class="grid2" style="margin-top:8px"><select id="swr">${['Makine / ekipman dolu','Bu ekipman salonda yok','Ağrı / rahatsızlık var','Sıkıldım, farklı bir şey istiyorum','Evde antrenman yapıyorum'].map(x=>`<option>${x}</option>`).join('')}</select>
         <button class="btn sm" style="width:100%" onclick="A.aiSwap()">Öner</button></div>
        <input id="swx" style="margin-top:8px" placeholder="Ek bilgi (isteğe bağlı), ör. sadece dumbbell var"><div id="aisw"></div></div>`:''}
      ${(()=>{const eq=gp().eq,lvl=gp().lvl,c=XBY[cur.name],pool=XDB.filter(x=>x[2]===cur.muscle&&x[0]!==cur.name).sort((a,b)=>(eq.includes(b[3])-eq.includes(a[3]))||((c&&b[5]===c[5])-(c&&a[5]===c[5]))||(a[4]-b[4]));A._dbAlts=pool.slice(0,10);
        return pool.length?`<div class="gcat" style="margin-top:0">Önerilen alternatifler</div><div class="swl">${A._dbAlts.map((x,k)=>`<button onclick="A.swapDB(${k})">${bodyMini(x[0],x[2],26)}<span><b>${esc(x[0])}</b><small>${esc(x[1])} · ${(EQ.find(q=>q[0]===x[3])||[])[2]||''}${eq.includes(x[3])?'':' · ekipmanında yok'}</small></span></button>`).join('')}</div>`:''})()}
      ${all.length?'<div class="gcat">Programlarındaki benzerleri</div>':''}${all.map((e,k)=>`<button class="btn ghost" style="margin-bottom:8px;text-align:left" data-k="${k}">${esc(e.name)}</button>`).join('')||'<div class="lbl">Aynı kas grubunda başka egzersiz yok.</div>'}
      <div class="fld" style="margin-top:12px"><label>Ya da yeni egzersiz adı</label><input id="swn" placeholder="ör. Hack Squat"></div><button class="btn" id="swb">Değiştir</button>`);
    const apply=(name,muscle)=>{const e={...cur,name};if(muscle)e.muscle=muscle;e.sugg=suggest(e);e.sets=cur.sets.map(()=>({kg:e.sugg.kg??'',reps:e.sugg.reps??'',rpe:'',done:false}));S.active.ex[S.active.idx]=e;save();closeSheet();render()};
    A._swapApply=apply;document.querySelectorAll('#scrim [data-k]').forEach(b=>b.onclick=()=>apply(all[+b.dataset.k].name));
    document.getElementById('swb').onclick=()=>{const v=document.getElementById('swn').value.trim();if(v)apply(v)};
  },
  finishAsk(){const n=S.active.ex.flatMap(e=>e.sets).filter(s=>s.done).length;
    ask(n?`Antrenmanı bitir? (${n} set kaydedildi)`:'Hiç set kaydetmedin. Antrenmanı iptal et?',()=>n?A.finish():(S.active=null,save(),A.go('home')),n?'Bitir':'İptal et')},
  finish(){hold=null;
    const a=S.active;const sets=[];
    const wu=[];a.ex.forEach(e=>e.sets.forEach(s=>{if(!s.done)return;const o={ex:e.name,muscle:e.muscle,kg:num(s.kg)??0,reps:num(s.reps),rpe:num(s.rpe),...(e.t?{t:1}:{})};const ty=tyOf(s);if(ty==='w')wu.push(o);else{if(ty!=='n')o.ty=ty;sets.push(o)}}));
    if(!sets.length){lockStop();S.active=null;save();return A.go('home')}
    const prs=[];[...new Set(sets.map(s=>s.ex))].forEach(n=>{
      const prev=S.sessions.flatMap(s=>s.sets).filter(x=>x.ex===n);if(!prev.length)return;
      if(prev.some(x=>x.t))return;const pb=Math.max(...prev.map(x=>e1rm(x.kg,x.reps))),nb=Math.max(...sets.filter(x=>x.ex===n).map(x=>e1rm(x.kg,x.reps)));
      if(nb>pb)prs.push(`${n}: tahmini 1RM ${fmt(Math.round(pb*10)/10)} → ${fmt(Math.round(nb*10)/10)} kg`)});
    const sess={id:uid(),planId:a.planId,planName:a.planName,date:new Date().toISOString(),dur:Math.round((Date.now()-a.startedAt)/1000),sets,prs};if(wu.length)sess.wu=wu;
    const tp=plan(a.planId);if(tp&&!['gen-last','quick-last','live-join'].includes(tp.tmpl)&&!a.loc){try{const df=tplDiff(tp,a);if(df.chg.length){sess.tpl={pid:tp.id,chg:df.chg,out:df.out,prev:df.prev,applied:false};if(true){tp.exercises=JSON.parse(JSON.stringify(df.out));sess.tpl.applied=true}}}catch(err){}}
    S.sessions.push(sess);
    const tdp=todaysPlan();if(tdp&&tdp.id===a.planId)S.next=(S.next+1)%activePlans().length;
    if(ui.wHR&&ui.wHR.s&&ui.wHR.s.length>=3)sess.hr=ui.wHR.s.filter((x,i,a)=>i%Math.ceil(a.length/240)===0);ui.wHR=null;lockStop();S.active=null;restEnd=0;save();ui.view='summary';render();if(prs.length)setTimeout(()=>prFx(prs.length),300);
  },
  mealSheet(){A._photo=null;sheet(`<h3>Öğün ekle</h3>
    ${freqRow()}<button class="btn snb" style="margin:10px 0 8px" onclick="A.snap()">📸 Fotoğraftan kalori hesapla <small>AI</small></button>
    <button class="btn" style="margin-bottom:6px" onclick="A.composer()">🧮 Besinlerden hesapla (çiğ / pişmiş)</button>
    <div class="lbl" style="text-align:center;margin:10px 0">ya da elle gir</div>
    <label class="photo-in" id="phbox"><input type="file" accept="image/*" onchange="A.pickPhoto(this)" hidden><span>📷 Fotoğraf ekle</span></label>
    <div class="fld"><label>Ne yedin?</label><input id="m_n" placeholder="ör. Yulaf + süt + muz"></div>
    <div class="grid2"><div class="fld"><label>Kalori</label><input id="m_k" inputmode="decimal"></div><div class="fld"><label>Protein (g)</label><input id="m_p" inputmode="decimal"></div>
    <div class="fld"><label>Karbonhidrat (g)</label><input id="m_c" inputmode="decimal"></div><div class="fld"><label>Yağ (g)</label><input id="m_f" inputmode="decimal"></div></div>
    <div class="lbl" style="margin-bottom:10px">Kaloriyi boş bırakırsan makrolardan hesaplanır (P×4 + K×4 + Y×9).</div>
    <button class="btn" onclick="A.addMeal()">Ekle</button>`)},
  addMeal(){const g=id=>num(document.getElementById(id).value)||0;const name=document.getElementById('m_n').value.trim()||'Öğün';
    const p=g('m_p'),c=g('m_c'),f=g('m_f');let k=g('m_k');if(!k)k=p*4+c*4+f*9;
    if(!k){toast('Kalori ya da makro gir');return}
    const m={id:uid(),date:ui.view==='food'?ui.foodDay:dkey(),name,kcal:k,p,c,f};
    if(A._photo){const n=new Date(),ph={id:uid(),date:m.date,time:z(n.getHours())+':'+z(n.getMinutes()),img:A._photo,note:name,mealId:m.id};S.photos.push(ph);m.photoId=ph.id}
    S.meals.push(m);save();closeSheet();render(true);toast('Öğün eklendi')},
  pickPhoto(inp){const f=inp.files[0];if(!f)return;const im=new Image(),u=URL.createObjectURL(f);
    im.onload=()=>{const M=420,sc=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);A._photo=c.toDataURL('image/jpeg',0.7);URL.revokeObjectURL(u);
      const b=document.getElementById('phbox');if(b){b.style.backgroundImage=`url(${A._photo})`;b.classList.add('has');b.querySelector('span').textContent='📷 Değiştir'}};
    im.onerror=()=>toast('Fotoğraf açılamadı');im.src=u},
  photo(id){const m=S.meals.find(x=>x.id===id);if(m&&m.photoId)return A.photoView(m.photoId);if(!m||!m.photo)return;
    sheet(`<img src="${m.photo}" alt="" style="width:100%;border-radius:18px;display:block"><h3 style="margin-top:14px">${esc(m.name)}</h3><div class="lbl">${Math.round(m.kcal)} kcal · P ${Math.round(m.p)} g · K ${Math.round(m.c)} g · Y ${Math.round(m.f)} g</div>
     <button class="link" style="color:var(--bad)" onclick="A.delPhoto('${id}')">Fotoğrafı kaldır</button>`)},
  delPhoto(id){const m=S.meals.find(x=>x.id===id);delete m.photo;save();closeSheet();render(true)},
  async photoPick(inp,d){const fs=[...inp.files];inp.value='';if(!fs.length)return;
    const n=new Date(),t=z(n.getHours())+':'+z(n.getMinutes());let last=null;
    for(const f of fs){try{const img=await compress(f);last={id:uid(),date:d||dkey(),time:t,img,note:''};S.photos.push(last)}catch(e){toast('Fotoğraf açılamadı')}}
    if(!last)return;save();render(true);if(fs.length>1){toast(fs.length+' fotoğraf eklendi');return}A.photoView(last.id,true)},
  photoView(id,isNew){const x=S.photos.find(p=>p.id===id);if(!x)return;const m=x.mealId&&S.meals.find(y=>y.id===x.mealId);
    sheet(`<img src="${x.img}" alt="" style="width:100%;border-radius:18px;display:block">
     <div class="row between" style="margin:12px 0 8px"><b>${isNew?'Fotoğraf kaydedildi ✓':esc(x.note||'Yemek fotoğrafı')}</b><span class="lbl">${new Date(x.date+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})} · ${x.time}</span></div>
     <div class="grid2"><div class="fld"><label>Not</label><input value="${esc(x.note||'')}" placeholder="ör. Annemin mercimeği" onchange="A.photoNote('${id}',this.value)"></div>
      <div class="fld"><label>Saat</label><input type="time" value="${x.time}" onchange="A.photoTime('${id}',this.value)"></div></div>
     ${m?`<div class="sugg" style="margin:4px 0 12px">🍽️ <b>${esc(m.name)}</b> · ${m.kcal} kcal · P ${m.p} g · K ${m.c} g · Y ${m.f} g${m.items?`<br><span class="lbl">${esc(m.items)}</span>`:''}</div>`
       :`<button class="btn snb" style="margin:4px 0 8px" onclick="A.snapPhoto('${id}')">✨ AI ile kalorisini tahmin et</button><button class="btn ghost" style="margin:0 0 10px" onclick="A.composer({photoId:'${id}',name:(S_note('${id}')),date:'${x.date}'})">🧮 Besinlerden kendim hesaplayayım</button>`}
     <div class="grid2"><button class="btn ghost" onclick="A.close()">${isNew?'Sonra eklerim':'Kapat'}</button><button class="btn ghost" style="color:var(--bad)" onclick="A.photoDel('${id}')">Sil</button></div>`)},
  photoNote(id,v){const x=S.photos.find(p=>p.id===id);x.note=v.trim();save();render(true)},
  photoTime(id,v){const x=S.photos.find(p=>p.id===id);if(v)x.time=v;save();render(true)},
  photoDel(id){ask('Fotoğraf silinsin mi?',()=>{S.photos=S.photos.filter(p=>p.id!==id);S.meals.forEach(m=>{if(m.photoId===id)delete m.photoId});save();render(true)},'Sil')},
  drink(type,ml){const n=new Date();S.drinks.push({id:uid(),date:ui.view==='food'?ui.foodDay:dkey(),type,ml,time:z(n.getHours())+':'+z(n.getMinutes())});save();closeSheet();render(true);
    const d=ui.view==='food'?ui.foodDay:dkey(),fl=fluid(d),g=waterGoal(d).goal;toast(fl>=g&&fl-ml<g?'💧 Günlük su hedefi tamam!':`+${ml} ml ${DRINK[type].n.toLocaleLowerCase('tr-TR')}`);
    if(caffeine(d)>400&&DRINK[type].caf)setTimeout(()=>toast('⚠️ Kafein bugün 400 mg’ı geçti'),1900)},
  drinkSheet(k){const T=DRINK[k];const opts=[...new Set([T.ml,Math.round(T.ml*1.5),T.ml*2,100,250,330,500])].filter(x=>x>0).sort((a,b)=>a-b);
    sheet(`<h3>${T.e} ${T.n}</h3><div class="lbl" style="margin:-6px 0 12px">100 ml: ${T.k} kcal${T.caf?` · ${T.caf} mg kafein`:''}</div>
     <div class="grid4">${opts.map(ml=>`<button class="wbtn" onclick="A.drink('${k}',${ml})"><b>${ml}</b><span>ml</span></button>`).join('')}</div>
     <div class="row" style="gap:8px;margin-top:12px"><input id="dml" inputmode="numeric" placeholder="Başka miktar (ml)"><button class="btn sm" onclick="const v=A.n(document.getElementById('dml').value);if(v)A.drink('${k}',v)">Ekle</button></div>`)},
  delDrink(id){S.drinks=S.drinks.filter(x=>x.id!==id);save();render(true)},
  suppLib(){const own=new Set(S.supps.map(s=>s.key));
    sheet(`<h3>Takviye ekle</h3><div class="lbl" style="margin:-6px 0 8px;line-height:1.5">Kanıt düzeyi, sağlıklı ve antrenman yapan yetişkinler için genel araştırma sonuçlarına dayanır.</div>
     ${Object.entries(SUPP).map(([k,x])=>`<button class="rlist" onclick="A.suppForm('${k}')" style="align-items:flex-start"><div class="plate sm" style="background:var(--card2);box-shadow:none">${x.e}</div><div style="flex:1"><b style="font-weight:600">${x.n}</b> ${own.has(k)?'<span class="tag">Ekli</span>':''}<span class="lbl" style="float:right;color:${EVC[x.ev]}">● ${x.ev}</span><small style="line-height:1.45">${x.what}</small></div></button>`).join('')}
     <button class="btn ghost" style="margin-top:12px" onclick="A.suppForm(null)">＋ Listede olmayan takviye</button>`)},
  suppForm(key,id){const ex=id?S.supps.find(s=>s.id===id):null,I2=key?SUPP[key]:null;
    const v=ex||{key,name:I2?I2.n:'',dose:I2?I2.dose:'',time:I2&&TIMES.includes(I2.time)?I2.time:(I2&&/öncesi/.test(I2.time)?'Antrenman öncesi':'Sabah'),freq:'daily',note:''};
    if(I2&&I2.time==='Antrenman sonrası')v.time='Antrenman sonrası';
    sheet(`<h3>${I2?I2.e+' ':''}${ex?'Takviyeyi düzenle':'Takviye ekle'}</h3>
     ${I2?`<div class="sugg" style="margin:0 0 12px">${I2.what}<br><span class="lbl">Önerilen zaman: ${I2.time} · Tipik doz: ${I2.dose}</span></div>`:''}
     <div class="fld"><label>Ad</label><input id="sp_n" value="${esc(v.name)}" placeholder="ör. Çinko"></div>
     <div class="grid2"><div class="fld"><label>Doz</label><input id="sp_d" value="${esc(v.dose)}" placeholder="ör. 5 g, 1 kapsül"></div>
      <div class="fld"><label>Ne zaman?</label><select id="sp_t">${TIMES.map(t=>`<option ${t===v.time?'selected':''}>${t}</option>`).join('')}</select></div></div>
     <div class="fld"><label>Sıklık</label><select id="sp_f"><option value="daily" ${v.freq!=='training'?'selected':''}>Her gün</option><option value="training" ${v.freq==='training'?'selected':''}>Sadece antrenman günleri</option></select></div>
     ${I2?'':`<div class="fld"><label>Ne için? (kısa not)</label><input id="sp_note" value="${esc(v.note||'')}" placeholder="ör. Bağışıklık"></div>`}
     <button class="btn" onclick="A.suppSave('${key||''}','${id||''}')">Kaydet</button>
     ${ex?`<button class="link" style="color:var(--bad)" onclick="A.suppDel('${id}')">Listeden çıkar</button>`:''}`)},
  suppSave(key,id){const g=x=>document.getElementById(x)?.value.trim()||'';const n=g('sp_n');if(!n){toast('Ad gir');return}
    const o={name:n,dose:g('sp_d'),time:g('sp_t'),freq:g('sp_f')};if(!key)o.note=g('sp_note');
    if(id)Object.assign(S.supps.find(s=>s.id===id),o);else S.supps.push({id:uid(),key:key||null,...o});
    save();closeSheet();if(ui.view!=='food'&&ui.view!=='home'){ui.view='food'}render(true);toast('Kaydedildi')},
  suppEdit(id){const s=S.supps.find(x=>x.id===id);A.suppForm(s.key,id)},
  suppDel(id){S.supps=S.supps.filter(s=>s.id!==id);save();closeSheet();render(true)},
  suppTick(d,id){const L=S.suppLog[d]=S.suppLog[d]||{};if(L[id])delete L[id];else{const n=new Date();L[id]=z(n.getHours())+':'+z(n.getMinutes())}save();render(true)},
  suppHist(){const days=Array.from({length:14},(_,i)=>{const x=new Date();x.setDate(x.getDate()-13+i);return dkey(x)});
    sheet(`<h3>Takviye geçmişi · 14 gün</h3><div class="lbl" style="margin:-6px 0 10px">● alındı · ○ alınmadı · boş = o gün planlı değildi</div>
     <div class="hgrid" style="grid-template-columns:110px repeat(14,1fr)"><span></span>${days.map(d=>`<span class="lbl" style="text-align:center;font-size:9px">${+d.slice(8)}</span>`).join('')}
     ${S.supps.map(s=>{let tk=0,pl=0;const cells=days.map(d=>{const due=s.freq!=='training'||trainedOn(d).length;const on=(S.suppLog[d]||{})[s.id];if(due){pl++;if(on)tk++}
       return `<span style="text-align:center;color:${on?'var(--ok)':'var(--mut)'}">${on?'●':due?'○':''}</span>`}).join('');
       return `<span style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${suppInfo(s).e} ${esc(s.name)}<br><span class="lbl">%${pl?Math.round(tk/pl*100):0}</span></span>${cells}`}).join('')}</div>`)},
  editMeal(id){const m=S.meals.find(x=>x.id===id);if(!m)return;
    const base=m.base||(m.full?null:{kcal:m.kcal,p:m.p,c:m.c,f:m.f,items:m.items||''});let bn=null;TMPI={};
    if(base){bn='Önceki kayıt: '+(m.name||'Öğün');TMPI[bn]=ig('g',base.kcal,base.p,base.c,base.f,'Diğer',100,'porsiyon')}
    const ing=m.full?m.full.map(l=>l[0]==='@base'?[bn,1,'porsiyon']:[...l]):[[bn,1,'porsiyon']];
    A._rb={mode:'meal',editId:id,n:m.name||'',slot:m.slot||'s',serv:1,ing:[...ing,['',100,'g']],photoId:m.photoId||null,date:m.date,base:bn?{n:bn,m:base}:null};A.drawBuilder(false)},
  delMeal(id){S.meals=S.meals.filter(m=>m.id!==id);save();render()},
  day(n){const d=new Date(ui.foodDay+'T12:00');d.setDate(d.getDate()+n);if(dkey(d)>dkey())return;ui.foodDay=dkey(d);render()},
  saveBody(){const w=num(document.getElementById('bw').value),s=num(document.getElementById('sl').value);
    S.body=S.body.filter(b=>b.date!==ui.foodDay);if(w!=null||s!=null)S.body.push({date:ui.foodDay,weight:w,sleep:s});
    const pr=S.profile;
    if(w!=null&&pr.auto&&pr.applied&&latestW()===w){pr.weight=w;const r=calcTargets(pr);
      if(r&&r.kcal!==S.settings.kcal){Object.assign(S.settings,{kcal:r.kcal,protein:r.protein,carbs:r.carbs,fat:r.fat});save();render(true);toast(`Hedef yeni kilona göre: ${r.kcal} kcal`);return}}
    save();toast('Kaydedildi')},
  n:num,
  pf(k,v){S.profile[k]=v;save();const o=document.getElementById('goalOut');if(o)o.innerHTML=goalOut()},
  goal(k){S.profile.goal=k;S.profile.pct=k==='cut'?0.75:k==='bulk'?bulkPct():null;save();render(true)},
  applyGoal(){const r=calcTargets(S.profile);if(!r){toast('Yaş, boy ve kilo gir');return}
    Object.assign(S.settings,{kcal:r.kcal,protein:r.protein,carbs:r.carbs,fat:r.fat});S.profile.applied=true;
    if(S.profile.weight!=null&&latestW()==null)S.body.push({date:dkey(),weight:S.profile.weight,sleep:null});
    save();render(true);toast(`Günlük hedef: ${r.kcal} kcal · P ${r.protein} g`)},
  /* ---- kendi tarifin ---- */
  builder(id,d,k){const r=id?rec(id):null;
    A._rbCtx=d?{d,k}:null;
    A._rb=r?{id:r.custom?r.id:null,n:r.custom?r.n:r.n+' (benim)',e:r.e,col0:r.col,slot:r.slot,serv:r.custom?r.serv:1,min:r.min||'',how:r.how||'',
      ing:(r.full||r.ing).map(l=>[l[0],l[1],l[2],r.full?l[3]:undefined])}
      :{id:null,n:'',e:'🍲',slot:k||'l',serv:1,min:'',how:'',ing:[['',100,'g']]};
    A.drawBuilder(false)},
  composer(o={}){const h=new Date().getHours();
    TMPI=null;A._rb={mode:'meal',n:o.name||'',slot:o.slot||(h<11?'b':h<16?'l':h<21?'d':'s'),serv:1,ing:[['',100,'g']],photoId:o.photoId||null,date:o.date||(ui.view==='food'?ui.foodDay:dkey())};A.drawBuilder(false)},
  drawBuilder(keep=true){const b=A._rb,db=ING();
    if(b.mode==='meal'){const ph=b.photoId&&S.photos.find(x=>x.id===b.photoId);
      return sheet(`<h3>${b.editId?'Öğünü düzenle · besin ekle':'Ne yedin? · besinlerden hesapla'}</h3>
       ${ph?`<img src="${ph.img}" alt="" style="width:100%;max-height:180px;object-fit:cover;border-radius:16px;margin-bottom:12px">`:''}
       <div class="grid2"><div class="fld"><label>Öğün adı</label><input value="${esc(b.n)}" oninput="A._rb.n=this.value" placeholder="ör. Öğle yemeği"></div>
        <div class="fld"><label>Öğün</label><select onchange="A._rb.slot=this.value">${SLOTS.map(([k,l])=>`<option value="${k}" ${b.slot===k?'selected':''}>${l}</option>`).join('')}</select></div></div>
       <div class="lbl" style="margin-bottom:4px;line-height:1.5">Her besini tabağa koyduğun haliyle tart: pişmiş tavuk tartıyorsan "Izgara / fırın", kuru pirinç tartıyorsan "Kuru (çiğ)" seç.</div>
       <datalist id="ingl">${Object.keys(db).sort((a,c)=>a.localeCompare(c,'tr')).map(n=>`<option value="${esc(n)}">`).join('')}</datalist>
       ${b.ing.map((l,i)=>ingRow(l,i,db)).join('')}
       <button class="btn ghost" style="margin:12px 0" onclick="A._rb.ing.push(['',100,'g']);A.drawBuilder()">＋ Besin ekle</button>
       <div id="rbTot">${rbTot()}</div>
       <button class="btn" style="margin-top:12px" onclick="A.saveRecipe()">${b.editId?'Değişiklikleri kaydet':'Öğünü günlüğe ekle'}</button>`,keep)}
    const emos=EMO.includes(b.e)?EMO:[b.e,...EMO];
    sheet(`<h3>${b.id?'Tarifi düzenle':'Kendi tarifin'}</h3>
     <div class="fld"><label>Tarif adı</label><input value="${esc(b.n)}" oninput="A._rb.n=this.value" placeholder="ör. Fırında tavuklu sebze"></div>
     <div class="fld"><label>Görsel</label><div class="seg">${emos.map(e=>`<button class="${b.e===e?'on':''}" onclick="A._rb.e='${e}';A.drawBuilder()">${e}</button>`).join('')}</div></div>
     <div class="grid2"><div class="fld"><label>Öğün</label><select onchange="A._rb.slot=this.value">${SLOTS.map(([k,l])=>`<option value="${k}" ${b.slot===k?'selected':''}>${l}</option>`).join('')}</select></div>
      <div class="fld"><label>Kaç porsiyon çıkıyor?</label><input inputmode="decimal" value="${fmt(b.serv)}" oninput="A._rb.serv=A.n(this.value)||1;A.updTot()"></div></div>
     <div class="row between" style="margin-top:6px"><b>Malzemeler</b><span class="lbl">tüm tarif için</span></div>
     <datalist id="ingl">${Object.keys(db).sort((a,c)=>a.localeCompare(c,'tr')).map(n=>`<option value="${esc(n)}">`).join('')}</datalist>
     ${b.ing.map((l,i)=>ingRow(l,i,db)).join('')}
     <button class="btn ghost" style="margin:12px 0" onclick="A._rb.ing.push(['',100,'g']);A.drawBuilder()">＋ Malzeme ekle</button>
     <div id="rbTot">${rbTot()}</div>
     <div class="grid2" style="margin-top:12px"><div class="fld"><label>Hazırlama süresi (dk)</label><input inputmode="numeric" value="${b.min}" oninput="A._rb.min=A.n(this.value)||''"></div><div></div></div>
     <div class="fld"><label>Hazırlanışı (isteğe bağlı)</label><textarea rows="3" oninput="A._rb.how=this.value">${esc(b.how)}</textarea></div>
     <button class="btn" onclick="A.saveRecipe()">Tarifi kaydet</button>
     ${b.id?'<button class="link" style="color:var(--bad)" onclick="A.delRecipe()">Tarifi sil</button>':''}`,keep)},
  qty(i,dlt){const l=A._rb.ing[i];l[1]=Math.max(0,Math.round((l[1]+dlt)*100)/100);A.drawBuilder()},
  ingSug(i,v){const e=document.getElementById('sug'+i);if(!e)return;const r=ingFind(v);e.innerHTML=r.map(n=>{const d=ING()[n];return `<button type="button" onpointerdown="event.preventDefault();A._pk=Date.now();A.ingName(${i},this.dataset.n)" onclick="if(Date.now()-(A._pk||0)>600){A._pk=Date.now();A.ingName(${i},this.dataset.n)}" data-n="${esc(n)}"><span>${esc(n)}</span><small>${Math.round(d.k)} kcal/100${d.u}</small></button>`}).join('')},
  ingName(i,v){v=ingResolve(v);const l=A._rb.ing[i],d=ING()[v];l[0]=v;l[3]=d&&d.st?d.st[0].n:undefined;if(d){if(d.pu){l[2]=d.pu;l[1]=1}else{l[2]=d.u;l[1]=100}}A.drawBuilder()},
  updTot(){const t=document.getElementById('rbTot');if(t)t.innerHTML=rbTot();A._rb.ing.forEach((l,i)=>{const e=document.getElementById('lk'+i);if(e){const m=lineMac(l);e.textContent=m?Math.round(m.k)+' kcal':''}})},
  newIng(i){const n=A._rb.ing[i][0];
    sheet(`<h3>Yeni malzeme</h3><div class="lbl" style="margin:-6px 0 12px;line-height:1.5">Değerleri ambalajın arkasındaki besin tablosundan (100 g/ml için) gir.</div>
     <div class="fld"><label>Adı</label><input id="ni_n" value="${esc(n)}"></div>
     <div class="grid2"><div class="fld"><label>Birim</label><select id="ni_u"><option value="g">gram (100 g için)</option><option value="ml">ml (100 ml için)</option></select></div>
      <div class="fld"><label>1 adet kaç g? (isteğe bağlı)</label><input id="ni_pw" inputmode="decimal" placeholder="ör. 60"></div></div>
     <div class="grid4">${[['k','kcal'],['p','Protein'],['c','Karb.'],['f','Yağ']].map(([k,l])=>`<div class="fld"><label>${l}</label><input id="ni_${k}" inputmode="decimal"></div>`).join('')}</div>
     <button class="btn" onclick="A.saveIng(${i})">Kaydet ve tarife dön</button><button class="link" onclick="A.drawBuilder(false)">Vazgeç</button>`)},
  saveIng(i){const g=id=>A.n(document.getElementById(id).value);const n=document.getElementById('ni_n').value.trim();
    const k=g('ni_k');if(!n||k==null){toast('Ad ve kalori gerekli');return}
    const pw=g('ni_pw');S.customIng[n]=ig(document.getElementById('ni_u').value,k,g('ni_p')||0,g('ni_c')||0,g('ni_f')||0,'Diğer',pw||undefined);
    save();A._rb.ing[i][0]=n;const d=S.customIng[n];A._rb.ing[i][2]=d.pu||d.u;A._rb.ing[i][1]=d.pu?1:100;A.drawBuilder(false);toast('Malzeme eklendi')},
  saveRecipe(){const b=A._rb,lines=b.ing.filter(l=>l[0]&&l[1]>0),t=sumMac(lines),sv=b.serv||1;
    if(b.mode==='meal'){if(!lines.length){toast('En az bir besin ekle');return}if(t.unk){toast('Besin değeri olmayan malzeme var');return}
      const lab=SLOTS.find(x=>x[0]===b.slot)[1];
      const desc=lines.map(l=>{const st=l[3]&&ING()[l[0]].st&&l[3]!==ING()[l[0]].st[0].n?' ('+l[3].toLocaleLowerCase('tr-TR')+')':'';return `${l[0]}${st} ${fmt(l[1])} ${l[2]}`}).join(', ');
      const m={id:uid(),date:b.date,name:b.n.trim()||lab,slot:b.slot,kcal:Math.round(t.k),p:Math.round(t.p),c:Math.round(t.c),f:Math.round(t.f),items:desc};
      if(b.photoId){m.photoId=b.photoId;const ph=S.photos.find(x=>x.id===b.photoId);if(ph)ph.mealId=m.id}
      m.full=lines.map(l=>[l[0],l[1],l[2],l[3]]);if(b.base)m.full=m.full.map(l=>l[0]===b.base.n?['@base',1,'porsiyon']:l);
      if(b.editId){const ix=S.meals.findIndex(x=>x.id===b.editId);if(ix>=0){const o=S.meals[ix];m.id=o.id;m.date=o.date;if(o.photoId)m.photoId=o.photoId;if(o.photo)m.photo=o.photo;if(b.base)m.base=b.base.m;S.meals[ix]=m;TMPI=null;save();closeSheet();render(true);toast(`${m.name} güncellendi: ${m.kcal} kcal`);return}}
      TMPI=null;S.meals.push(m);save();closeSheet();render(true);toast(`${m.name}: ${m.kcal} kcal eklendi`);return}
    if(!b.n.trim()){toast('Tarife bir ad ver');return}
    if(!lines.length){toast('En az bir malzeme ekle');return}
    if(t.unk){toast('Besin değeri olmayan malzeme var');return}
    const id=b.id||'my-'+uid();
    const r={id,custom:true,slot:b.slot,n:b.n.trim(),e:b.e,col:EMO.includes(b.e)?COLS[EMO.indexOf(b.e)%COLS.length]:(b.col0||COLS[0]),
      kcal:Math.round(t.k/sv),p:Math.round(t.p/sv),c:Math.round(t.c/sv),f:Math.round(t.f/sv),min:b.min||0,how:b.how||'',serv:sv,
      full:lines.map(l=>[l[0],l[1],l[2],l[3]]),
      ing:lines.map(l=>{const d=ING()[l[0]],c=stOf(d,l[3]);const raw=c&&c.y!==1&&l[2]===d.u?l[1]/c.y:l[1];return[l[0],Math.round(raw/sv*100)/100,l[2],d.cat]})};
    const ix=S.myRecipes.findIndex(x=>x.id===id);if(ix>=0)S.myRecipes[ix]=r;else S.myRecipes.push(r);
    if(A._rbCtx&&!b.id){const{d,k}=A._rbCtx;(S.mealPlan[d]=S.mealPlan[d]||{})[k]={rid:id,serv:1}}
    save();closeSheet();render(true);toast('Tarif kaydedildi · '+r.kcal+' kcal/porsiyon')},
  delRecipe(){const id=A._rb.id;ask('Tarif silinsin mi? Plandaki yerleri de boşalır.',()=>{S.myRecipes=S.myRecipes.filter(r=>r.id!==id);
    Object.values(S.mealPlan).forEach(m=>Object.keys(m).forEach(k=>{if(m[k].rid===id)delete m[k]}));save();render(true)},'Sil')},
  progEx(n){ui.progEx=n;render()},
  setNext(id){S.next=activePlans().findIndex(p=>p.id===id);save();render(true)},
  arch(id,v){const p=plan(id),cur=todaysPlan();p.archived=v;const a=activePlans();S.next=cur&&a.includes(cur)?a.indexOf(cur):0;save();render(true);toast(v?'Arşive taşındı':'Rotasyona eklendi')},
  sess(id){const s=S.sessions.find(x=>x.id===id);if(!s)return;const g={};s.sets.forEach(x=>(g[x.ex]=g[x.ex]||[]).push(x));
    sheet(`<h3>${esc(s.planName)}</h3><div class="lbl" style="margin:-8px 0 10px">${new Date(s.date).toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
     ${Object.entries(g).map(([n,xs])=>`<div class="ing" style="display:block"><b style="font-weight:600">${esc(n)}</b><div class="lbl" style="margin-top:3px">${xs.map(x=>(x.ty?`<b style="color:${STY[x.ty].c}">${STY[x.ty].k}</b> `:'')+(x.t?(x.kg?fmt(x.kg)+' kg · ':'')+x.reps+' sn':fmt(x.kg)+' kg × '+x.reps)).join('  ·  ')}</div></div>`).join('')}
     ${s.wu&&s.wu.length?`<div class="lbl" style="margin-top:8px">+ ${s.wu.length} ısınma seti (hacme dahil değil)</div>`:''}`)},
  editPlan(id){
    const p=id?JSON.parse(JSON.stringify(plan(id))):{id:uid(),name:'',exercises:[ex('','chest',3,8,12,2.5)]};
    A._draft=p;A._isNew=!id;A.drawEditor();
  },
  drawEditor(){const p=A._draft;
    const ms=Object.entries(MUSCLES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
    sheet(`<h3>${A._isNew?'Yeni program':'Programı düzenle'}</h3>
    <div class="fld"><label>Program adı</label><input value="${esc(p.name)}" oninput="A._draft.name=this.value" placeholder="ör. Push Day"></div>
    ${p.exercises.map((e,i)=>`<div class="ex-edit"><div>
      <input value="${esc(e.name)}" placeholder="Egzersiz adı" oninput="A._draft.exercises[${i}].name=this.value" style="margin-bottom:8px">
      <select onchange="A._draft.exercises[${i}].muscle=this.value" style="margin-bottom:8px">${ms.replace(`value="${e.muscle}"`,`value="${e.muscle}" selected`)}</select>
      <label class="tchk"><input type="checkbox" ${e.t?'checked':''} onchange="A._draft.exercises[${i}].t=this.checked?1:0;A.drawEditor()"> ⏱ Süreli hareket (plank gibi, saniye)</label>
      ${e.t?'':`<div class="grid2 edx"><div><div class="mini">Isınma seti</div><select onchange="A._draft.exercises[${i}].wu=+this.value">${[0,1,2,3].map(v=>`<option value="${v}" ${(e.wu||0)===v?'selected':''}>${v?v+' ısınma':'Yok'}</option>`).join('')}</select></div>
       <div><div class="mini">Son set türü</div><select onchange="A._draft.exercises[${i}].last=this.value">${['n','d','f','r'].map(k=>`<option value="${k}" ${(e.last||'n')===k?'selected':''}>${STY[k].n}</option>`).join('')}</select></div></div>`}
      ${i<p.exercises.length-1?`<label class="tchk"><input type="checkbox" ${e.ss&&p.exercises[i+1].ss===e.ss?'checked':''} onchange="A.edSS(${i},this.checked)"> 🔗 Sonraki hareketle süperset</label>`:''}
      <div class="grid4">${[['sets','Set'],['repMin',e.t?'Min sn':'Min tkr'],['repMax',e.t?'Max sn':'Max tkr'],['inc','+kg']].map(([k,l])=>`<div><div class="mini">${l}</div><input inputmode="decimal" value="${e[k]}" oninput="A._draft.exercises[${i}].${k}=parseFloat(this.value.replace(',','.'))||0"></div>`).join('')}</div></div>
      <button class="x" onclick="A._draft.exercises.splice(${i},1);A.drawEditor()">✕</button></div>`).join('')}
    <button class="btn ghost" style="margin-bottom:10px" onclick="A._draft.exercises.push({name:'',muscle:'chest',sets:3,repMin:8,repMax:12,inc:2.5});A.drawEditor()">+ Egzersiz ekle</button>
    <button class="link" style="margin:0 auto 10px" onclick="A.styInfo()">ⓘ Set türleri ve süperset nedir?</button>
    <button class="btn" onclick="A.savePlan()">Kaydet</button>
    ${A._isNew?'':'<button class="link" style="color:var(--bad)" onclick="A.delPlan()">Programı sil</button>'}`)},
  edSS(i,on){const L=A._draft.exercises,a=L[i],b=L[i+1];if(!b)return;if(on){const used=new Set(L.map(x=>x.ss).filter(Boolean)),g=a.ss||b.ss||[...SSL].find(c=>!used.has(c));if(b.ss&&b.ss!==g)L.forEach(x=>{if(x.ss===b.ss)x.ss=g});a.ss=g;b.ss=g}
    else{const g=a.ss;let k=i+1;const nl=[...SSL].find(c=>!L.some(x=>x.ss===c));while(L[k]&&L[k].ss===g){L[k].ss=nl;k++}}ssNorm(L);A.drawEditor()},
  savePlan(){const p=A._draft;p.name=p.name.trim()||'Program';p.exercises=p.exercises.filter(e=>e.name.trim()).map(e=>{const o={...e,name:e.name.trim(),sets:Math.max(1,Math.round(e.sets)||1),repMin:e.repMin||1,repMax:Math.max(e.repMax||1,e.repMin||1)};if(!o.wu)delete o.wu;if(!o.last||o.last==='n')delete o.last;return o});ssNorm(p.exercises);
    if(!p.exercises.length){toast('En az bir egzersiz ekle');return}
    const i=S.plans.findIndex(x=>x.id===p.id);if(i>=0)S.plans[i]=p;else S.plans.push(p);save();closeSheet();render();toast('Kaydedildi')},
  delPlan(){const id=A._draft.id;ask('Program silinsin mi?',()=>{S.plans=S.plans.filter(p=>p.id!==id);S.next=0;save();render()},'Sil')},
  saveSettings(){['kcal','protein','carbs','fat','rest'].forEach(k=>{const v=num(document.getElementById('s_'+k).value);if(v!=null&&v>0)S.settings[k]=v});save();toast('Kaydedildi')},
  syncInfo(){const own=CL.base==='pulse',ok=CL.status==='synced';const lb=S.lastBackup?new Date(S.lastBackup).toLocaleDateString(LOC(),{day:'numeric',month:'long'}):null;
    sheet(`<h3>${ok?'☁️ Verilerin bulutta':'📱 Verilerin bu cihazda'}</h3>
     <div class="sugg" data-noi18n style="margin:0 0 12px">${LANG()==='en'?(ok?(window.HM_PWA?'Your data is stored in the cloud, linked to your HypeMode account and visible only to you. Sign in with the same account and you see the same data on <b>every device</b> (phone, iPad, computer).':own?'This is your app: you see the same data on <b>every device</b> where you sign in with your claude.ai account (phone, iPad, computer). Data is stored in separate monthly records; check the Summary tab for daily/weekly/monthly views.':'Your data is linked to your claude.ai account and kept in a space <b>only you</b> can access. Nobody else, including the app owner, can see it. Same data on every device you sign in with.')
       :'Right now your data is kept <b>only in this browser</b>. It survives closing and reopening, but it disappears if browser data is cleared, and you won\'t see it on other devices. To store it in the cloud, sign in to your account.'):ok?(window.HM_PWA?'Verilerin HypeMode hesabına bağlı olarak bulutta, sadece sana açık şekilde saklanıyor. Aynı hesapla girdiğin <b>her cihazda</b> (telefon, iPad, bilgisayar) aynı verileri görürsün.':own?'Bu senin uygulaman: claude.ai hesabınla girdiğin <b>her cihazda</b> (telefon, iPad, bilgisayar) aynı veriler görünür. Veriler ay ay ayrı kayıtlarda saklanır; Özet sekmesinde günlük/haftalık/aylık bakabilirsin.':'Verilerin claude.ai hesabına bağlı, <b>sadece sana özel</b> bir alanda saklanıyor. Uygulamanın sahibi dahil kimse göremez. Aynı hesapla girdiğin her cihazda aynı veriler.')
       :'Şu an verilerin sadece <b>bu tarayıcıda</b> tutuluyor. Kapatıp açınca kaybolmaz ama tarayıcı verisi silinirse ya da başka cihaza geçersen görünmez. Bulutta saklamak için hesabına giriş yap.'}</div>
     <div class="row" style="gap:8px;margin:-2px 0 12px;flex-wrap:wrap"><span class="chip">💾 ${TT('Cihaza son kayıt','Last saved on device')}: ${S._ts?tAgo(S._ts):'—'}</span>${ok?`<span class="chip">☁️ ${TT('Buluta son kayıt','Last synced to cloud')}: ${CL.lastSync?tAgo(CL.lastSync):'—'}</span>`:''}</div>
     <div class="gcat" style="margin-top:4px">📲 Telefona uygulama gibi ekle</div>
     <div class="lbl" style="line-height:1.6;margin-bottom:12px"><b>iPhone / iPad (Safari):</b> Paylaş <span style="opacity:.8">⬆︎</span> → <b>Ana Ekrana Ekle</b><br><b>Android (Chrome):</b> ⋮ menü → <b>Ana ekrana ekle</b><br>Böylece simgeye dokunup doğrudan açarsın.</div>
     <div class="gcat">💾 Yedek</div><div class="lbl" data-noi18n style="margin-bottom:8px">${lb?TT('Son yedek: ','Last backup: ')+lb+'.':TT('Henüz yedek alınmadı.','No backup yet.')}${ok?TT(' Bulutta olsan da ara sıra yedek almak iyi bir alışkanlık.',' Even in the cloud, an occasional backup is a good habit.'):TT(' Haftada bir yedek indirmeni öneririm.',' I recommend downloading a backup once a week.')}</div>
     <button class="btn" onclick="A.backupFile()">⬇︎ Yedeği indir (.json)</button>
     <button class="link" onclick="A.close();A.go('settings')">Yedekten geri yükle → Ayarlar</button>`)},
  async backupFile(){const t=JSON.stringify({...S,active:null,exportedAt:new Date().toISOString()}),fn='hypemode-yedek-'+dkey()+'.json';
    const ok=()=>{S.lastBackup=new Date().toISOString();save();closeSheet();render(true)};
    const dl=await cuse('downloads');
    if(dl){try{await dl.save({filename:fn,data:t});ok();toast('Yedek kaydedildi')}catch(e){if(e&&e.code==='declined')toast('Yedek iptal edildi');else if(e&&e.code==='rate_limited')toast('Biraz bekleyip tekrar dene');else A._copyBackup(t,ok)}return}
    if(window.claude&&window.claude.use&&!window.HM_PWA){A._copyBackup(t,ok);return}
    try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'application/json'}));a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);ok();toast('Yedek indirildi')}
    catch(e){A._copyBackup(t,ok)}},
  _copyBackup(t,ok){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{ok();toast('İndirilemedi; yedek panoya kopyalandı')}).catch(()=>toast('Yedek alınamadı; Ayarlar → Dışa aktar'))},
  async exportData(){const t=JSON.stringify({...S,active:null,exportedAt:new Date().toISOString()},null,1);const io=document.getElementById('io');io.value=t;
    try{await navigator.clipboard.writeText(t);toast('Panoya kopyalandı')}catch(e){io.select();toast('Metni seçip kopyala')}},
  importData(){A._imp(document.getElementById('io').value)},
  importFile(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>A._imp(r.result);r.readAsText(f)},
  _imp(txt){try{const d=JSON.parse(txt);if(!d.plans||!d.sessions)throw 0;
    ask('Mevcut verilerin yerine bu yedek yüklensin mi?',()=>{S={...defaults(),...d,active:null};migrateProfile();save();if(CL.db)pushAll(true);toast('İçe aktarıldı');A.go('home')},'Yükle')}catch(e){toast('Geçersiz yedek')}},
  planWeek(){if(ui.mpBusy)return;
    const has=weekDays().filter(d=>d>=dkey()).some(d=>Object.keys(S.mealPlan[d]||{}).length);
    if(!has)return runPlanner('empty');
    sheet(`<h3>Haftayı planla</h3><p class="lbl" style="margin-top:-6px;line-height:1.5">Bu haftada zaten planlanmış öğünler var. Yediğin olarak işaretlenenler korunur.</p>
     <button class="btn" style="margin-bottom:10px" onclick="A.close();A._run('empty')">Sadece boşları doldur</button>
     <button class="btn ghost" onclick="A.close();A._run('all')">Hepsini yeniden planla</button>`)},
  _run:m=>runPlanner(m),
  mpWeek(n){ui.mpWeek=Math.max(0,Math.min(4,ui.mpWeek+n));ui.mpSel=null;render()},
  jump(d){ui.mpClosed[d]=false;ui.mpSel=d;render(true)},
  toggleDay(d){ui.mpClosed[d]=!ui.mpClosed[d];render(true)},
  slot(d,k){if(ui.mpBusy)return;const x=(S.mealPlan[d]||{})[k];x&&rec(x.rid)?recipeSheet(d,k):A.pickSheet(d,k)},
  pickSheet(d,k){
    const lab=SLOTS.find(s=>s[0]===k)[1];
    const row=r=>`<button class="rlist" onclick="A.assign('${d}','${k}','${r.id}')"><div class="plate sm" style="background:${r.col}">${r.e}</div><div>${esc(r.n)}${r.ai?' <span class="tag" style="background:rgba(255,90,60,.2);color:#ffc0b0">AI</span>':r.custom?' <span class="tag">Benim</span>':r.phase?` <span class="tag ph-${r.phase}">${PHASE_LBL[r.phase]}</span>`:''}<small>${r.kcal} kcal · P ${r.p} g${r.min?' · ⏱ '+r.min+' dk':''}</small></div></button>`;
    sheet(`<h3>${lab} için tarif</h3><button class="btn ghost" style="margin-bottom:8px" onclick="A.builder(null,'${d}','${k}')">＋ Kendi tarifini oluştur</button>${ALL().filter(r=>r.slot===k).sort((a,b)=>(b.custom?2:phaseOk(b)&&b.phase?1:0)-(a.custom?2:phaseOk(a)&&a.phase?1:0)).map(row).join('')}
     <div class="gcat">Diğer tarifler</div>${ALL().filter(r=>r.slot!==k).map(row).join('')}`)},
  assign(d,k,rid){(S.mealPlan[d]=S.mealPlan[d]||{})[k]={rid,serv:1};save();closeSheet();render(true)},
  unslot(d,k){delete S.mealPlan[d][k];save();closeSheet();render(true)},
  serv(d,k,n){const x=S.mealPlan[d][k];x.serv=Math.max(0.5,Math.min(3,x.serv+n));save();recipeSheet(d,k);render(true)},
  ate(d,k){const x=S.mealPlan[d][k],r=rec(x.rid),s=x.serv;
    S.meals.push({id:uid(),date:d,name:r.n+(s!==1?' (×'+fmt(s)+')':''),kcal:Math.round(r.kcal*s),p:Math.round(r.p*s),c:Math.round(r.c*s),f:Math.round(r.f*s)});
    x.eaten=true;save();recipeSheet(d,k);render(true);toast('Beslenme günlüğüne eklendi')},
  groc(){
    const days=weekDays(),wk=days[0],agg={};
    days.forEach(d=>Object.values(S.mealPlan[d]||{}).forEach(x=>{const r=rec(x.rid);if(!r)return;
      r.ing.forEach(([n,a,u,c])=>{const key=n+'|'+u;(agg[key]=agg[key]||{n,u,c,a:0}).a+=a*x.serv})}));
    const items=Object.values(agg);
    if(!items.length){sheet('<h3>Alışveriş listesi</h3><div class="empty">Bu hafta için plan yok. Önce "Haftamı planla"ya bas.</div>');return}
    const cats=[ET,SU,SB,TA,DG],ck=S.groc[wk]||{};
    const q=i=>{let v=i.a;v=(i.u==='g'||i.u==='ml')?Math.ceil(v/10)*10:Math.ceil(v*2)/2;return (i.u==='g'&&v>=1000)?fmt(v/1000)+' kg':(i.u==='ml'&&v>=1000)?fmt(v/1000)+' L':fmt(v)+' '+i.u};
    A._gtext=cats.map(c=>{const it=items.filter(i=>i.c===c);return it.length?c+':\n'+it.map(i=>'- '+i.n+' '+q(i)).join('\n'):''}).filter(Boolean).join('\n\n');
    sheet(`<div class="row between"><h3>Alışveriş listesi</h3><button class="pill" onclick="A.copyGroc()">Kopyala</button></div>
     <div class="lbl">${esc(new Date(days[0]+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'}))} haftası · ${items.length} ürün</div>
     ${cats.map(c=>{const it=items.filter(i=>i.c===c).sort((a,b)=>a.n.localeCompare(b.n,'tr'));return it.length?`<div class="gcat">${c}</div>`+it.map(i=>{const key=i.n+'|'+i.u;return `<button class="gi ${ck[key]?'on':''}" data-key="${esc(key)}"><span class="bx">${ck[key]?'✓':''}</span><span style="flex:1">${esc(i.n)}</span><span class="muted">${q(i)}</span></button>`}).join(''):''}).join('')}`);
    document.querySelectorAll('#scrim .gi').forEach(b=>b.onclick=()=>{const g=S.groc[wk]=S.groc[wk]||{};g[b.dataset.key]=!g[b.dataset.key];save();
      b.classList.toggle('on',g[b.dataset.key]);b.querySelector('.bx').textContent=g[b.dataset.key]?'✓':''});
  },
  async copyGroc(){try{await navigator.clipboard.writeText(A._gtext);toast('Liste kopyalandı')}catch(e){toast('Kopyalanamadı')}},
  async report(kind,force){
    const d=dkey(),key=(kind==='week'?'w-':'d-')+d,old=S.reports[key];
    if(old&&!force){return sheet(reportView(old,kind)+`<button class="btn ghost" style="margin-top:10px" onclick="A.report('${kind}',true)">🔄 Yeniden oluştur</button>`)}
    sheet(`<div class="ai-load"><div class="spin"></div><b>${kind==='week'?'Haftan analiz ediliyor…':'Günün analiz ediliyor…'}</b><div class="lbl">Antrenman, beslenme, su, uyku ve takviye kayıtların inceleniyor</div></div>`);
    let ctx;
    if(kind==='week'){const days=Array.from({length:7},(_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);return dkey(x)});
      const prev=Array.from({length:7},(_,i)=>{const x=new Date();x.setDate(x.getDate()-13+i);return dkey(x)});
      const vol=ds=>Math.round(ds.flatMap(trainedOn).flatMap(s=>s.sets).reduce((a,x)=>a+x.kg*x.reps,0));
      const ms={};days.flatMap(trainedOn).forEach(s=>s.sets.forEach(x=>ms[MUSCLES[x.muscle]||x.muscle]=(ms[MUSCLES[x.muscle]||x.muscle]||0)+1));
      const adh=S.supps.map(sp=>{let due=0,tk=0;days.forEach(dd=>{if(sp.freq!=='training'||trainedOn(dd).length){due++;if((S.suppLog[dd]||{})[sp.id])tk++}});return `${sp.name}: ${tk}/${due}`});
      ctx={...baseCtx(),gunler:days.map(daySummary),haftalik_kas_basina_set:ms,toplam_hacim_kg:vol(days),onceki_hafta_hacim_kg:vol(prev),takviye_uyumu:adh,yarin:tomorrowCtx()};
    }else ctx={...baseCtx(),bugun:daySummary(d),son7gun:Array.from({length:6},(_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);const t=dayTotals(dkey(x));return `${dkey(x)}: ${Math.round(t.kcal)} kcal, P${Math.round(t.p)}, ${trainedOn(dkey(x)).length?'antrenman var':'antrenman yok'}`}),yarin:tomorrowCtx(),kural_tabanli_notlar:coachNotes().map(x=>x.replace(/<[^>]+>/g,''))};
    const prompt=`Sen HypeMode fitness uygulamasının kişisel AI koçusun. Kullanıcının ${kind==='week'?'son 7 gününü':'bugününü'} değerlendir ve ${kind==='week'?'gelecek hafta':'yarın'} için hedefine göre uygulanabilir öneriler ver.
${RULES}
JSON şeması:
{"title": "kısa başlık", "period": "${kind==='week'?'tarih aralığı':'tarih'}", "score": 0-100 arası genel uyum puanı (beslenme hedefi, protein, su, antrenman, uyku, takviye),
 "summary": "2-3 cümlelik özet",
 "goalNote": "hedefe (${GOALTXT()}) göre bir cümlelik durum değerlendirmesi, ör. kalori fazlası/açığı tuttu mu",
 "good": ["iyi giden 1-3 madde"], "improve": ["geliştirilecek 1-3 madde"],
 "plan": [{"area":"Antrenman|Beslenme|Toparlanma|Su|Takviye|Kilo","text":"somut öneri"}] (3-6 madde${kind==='week'?'':'; antrenman maddesinde sıradaki antrenmanın önerilen kilolarını kullan; beslenme maddesinde hedefe ulaşmak için kaç kcal/protein ve hangi yiyeceklerle'})}
Veri:
${JSON.stringify(ctx)}`;
    if(!CL.sample){A._rpt=`Sen kişisel fitness koçumsun. ${kind==='week'?'Son 7 günümü':'Bugünümü'} değerlendir. Hedefim: ${GOALTXT()}. Türkçe, kısa başlıklarla yaz: 1) Özet ve 0-100 uyum puanı 2) İyi gidenler 3) Geliştirilecekler 4) ${kind==='week'?'Gelecek hafta':'Yarın'} için somut plan (antrenman, beslenme kcal/protein, su, uyku, takviye). Verilerim (JSON):\n${JSON.stringify(ctx)}`;
      return sheet(`<h3>🤖 ${kind==='week'?'Haftalık AI raporu':'AI raporu'}</h3>${noAI()}<ol class="fm-c" style="font-size:13px"><li>Aşağıdaki düğme verilerini ve talimatı kopyalar.</li><li>Claude uygulamasında yeni sohbet aç ve yapıştır.</li><li>Claude sana raporu yazar.</li></ol><button class="btn" onclick="A.rptCopy()">📋 Raporu iste (kopyala)</button>`)}
    try{const r=await askAI(prompt,{tier:kind==='week'?'complex':'default'});if(!r||typeof r!=='object')throw{code:'bad'};
      r.at=new Date().toLocaleString('tr-TR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
      S.reports[key]=r;const ks=Object.keys(S.reports).sort();while(ks.length>40)delete S.reports[ks.shift()];
      save();render(true);sheet(reportView(r,kind)+`<button class="btn ghost" style="margin-top:10px" onclick="A.report('${kind}',true)">🔄 Yeniden oluştur</button>`)}
    catch(e){closeSheet();aiErr(e)}},
  mealNutri(id){const m=S.meals.find(x=>x.id===id);if(!m)return;sheet(`<h3 style="margin-bottom:4px">${esc(m.name||'Öğün')}</h3><div class="lbl">${Math.round(m.kcal)} kcal · P ${Math.round(m.p)} · K ${Math.round(m.c)} · Y ${Math.round(m.f)}</div>${nutriBars(m)}<button class="btn ghost" onclick="A.close()">Kapat</button>`)},
  modeTgl(el){const day=!el.classList.contains('day');el.classList.toggle('day',day);el.setAttribute('aria-checked',day);setTimeout(()=>A.setMode(day?'light':'dark'),300)},
  howTo(n,m,en){try{n=decodeURIComponent(n);en=en&&decodeURIComponent(en)}catch(e){}A.howClose();const d=document.createElement('div');d.className='m3m';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label',n);
    d.onclick=ev=>{if(ev.target===d)A.howClose()};d.innerHTML=`<div class="m3m-c"><div class="m3m-h"><b>${esc(acName?(ACX().find(r=>r[0]===n)?acName(ACX().find(r=>r[0]===n)):n):n)}</b><button onclick="A.howClose()" aria-label="${TT('Kapat','Close')}">✕</button></div>${m3dBox({name:n,en,muscle:m},'min(62vh,440px)')}<div class="m3m-f"><span><i></i>${TT('Çalışan kas','Target muscle')}</span><span>${TT('Döngüde 1 tekrar','1 rep, looping')}</span></div></div>`;
    document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('on'));A._howK=e=>{if(e.key==='Escape')A.howClose()};document.addEventListener('keydown',A._howK);m3dScan()},
  howClose(){const d=document.querySelector('.m3m');if(!d)return;d.remove();document.removeEventListener('keydown',A._howK);m3dScan()},
  wkGoal(){A.pick({t:TT('Haftalık antrenman hedefi','Weekly workout goal'),v:S.settings.wkGoal||3,min:1,max:7,step:1,u:TT('antrenman','workouts'),cb:v=>{S.settings.wkGoal=v;save();render(true)}})},
  frOpenU(u){const i=(ui._F||[]).findIndex(f=>f.uid===u);if(i<0){ui._F=(S.friends||[]).map(f=>({...f,d:SOC.friends[f.uid]}))}const j=(ui._F||[]).findIndex(f=>f.uid===u);if(j>=0)A.frOpen(j)},
  chNew(k){const t=CHT.find(c=>c[0]===k);if(!t)return;sheet(`<h3>${TT(t[1],t[2])} · ${TT('haftalık hedef','weekly goal')}</h3><div class="lbl" style="margin:-6px 0 12px">${TT('Her pazartesi sıfırlanır. Aynı hedefi seçen arkadaşlarınla yarışırsın.','Resets every Monday. You compete with friends who pick the same goal.')}</div>
    <div class="cht-g">${t[4].map((g,i)=>`<button class="btn ${i===1?'':'ghost'}" onclick="A.chStart('x:${k}:${g}')">${g.toLocaleString('tr-TR')} ${t[5]}<small>${[TT('Kolay','Easy'),TT('Orta','Medium'),TT('Zor','Hard')][i]}</small></button>`).join('')}</div>`)},
  chStart(id){closeSheet();const c=new Set((S.social&&S.social.ch)||[]);c.add(id);S.social={...(S.social||{}),ch:[...c].slice(-8)};SOC.lastPush=null;save();socPush();ui.frTab='chal';render(true);toast(TT('✓ Meydan okuma başladı','✓ Challenge started'));setTimeout(()=>A.chInvite(id),350)},
  chInvite(id){const x=chT(id),fr=(S.friends||[]).filter(f=>f.uid);if(!x)return;if(!fr.length){toast(TT('Önce arkadaş ekle','Add a friend first'));return}
    sheet(`<h3>${TT('Arkadaşlarını davet et','Invite friends')}</h3><div class="lbl" style="margin:-6px 0 12px">${TT(`Haftada ${x.goal.toLocaleString('tr-TR')} ${x.t[5]} ${x.t[1]}`,`${x.goal} ${x.t[2]} this week`)}</div>
     ${fr.map(f=>`<button class="btn ghost" style="margin-bottom:8px;text-align:left" onclick="A.chSend('${id}','${f.uid}',this)">${esc(f.name||f.username||'')}</button>`).join('')}`)},
  async chSend(id,fid,btn){const x=chT(id);if(btn)btn.disabled=true;const ok=await inboxSend(fid,{type:'chal',ref:id,msg:`Haftada ${x.goal.toLocaleString('tr-TR')} ${x.t[5]} ${x.t[1]}`});
    if(btn){btn.textContent=(ok?'✓ ':'✕ ')+btn.textContent}if(!ok)toast(TT('Gönderilemedi','Could not send'))},
  chJoin(id){const c=new Set((S.social&&S.social.ch)||[]);c.has(id)?c.delete(id):c.add(id);S.social={...(S.social||{}),ch:[...c]};SOC.lastPush=null;save();socPush();render(true)},
  plike(pid,fid){return A._lk(fid,pid,'paylaşımını beğendi')},
  story(uid){const me=uid==='me'||uid===SOC.me,id=me?SOC.me:uid,L=(SOC.posts||[]).filter(p=>p.uid===id).sort((a,b)=>a.at-b.at);if(!L.length)return;
    const d=me?{name:S.profile.name,photo:S.profile.photo,username:S.profile.username}:((SOC.friends[id]||{}));const day=L.filter(p=>Date.now()-p.at<864e5);let i=day.length?L.length-day.length:Math.max(0,L.length-5);const Ls=L.slice(i);i=0;
    A.storyClose();const o=document.createElement('div');o.className='sty';o.setAttribute('role','dialog');document.body.appendChild(o);let T=null;
    const show=()=>{const p=Ls[i];clearTimeout(T);o.innerHTML=`<div class="sty-bars">${Ls.map((_,k)=>`<i class="${k<i?'done':k===i?'cur':''}"><b></b></i>`).join('')}</div>
      <div class="sty-h">${avHtml(d.name||d.username||'?',d.photo,'sm')}<b>${esc(me?TT('Sen','You'):(d.name||'@'+(d.username||'')))}</b><small>${agoTxt(p.at)}</small><button onclick="A.storyClose()" aria-label="${TT('Kapat','Close')}">✕</button></div>
      <img src="${p.img}" alt="">${p.cap||p.kcal?`<div class="sty-c">${p.cap?`<p>${esc(p.cap)}</p>`:''}${p.kcal?`<small>${Math.round(p.kcal)} kcal · P ${Math.round(p.p||0)} · K ${Math.round(p.c||0)} · Y ${Math.round(p.f||0)}</small>`:''}</div>`:''}
      <button class="sty-l" onclick="A._stG(-1)" aria-label="${TT('Önceki','Previous')}"></button><button class="sty-r" onclick="A._stG(1)" aria-label="${TT('Sonraki','Next')}"></button>
      ${me?`<button class="sty-del" onclick="A.storyClose();A.postDel('${p.id}')">${TT('Sil','Delete')}</button>`:''}`;T=setTimeout(()=>A._stG(1),5000)};
    A._stG=k=>{i+=k;if(i<0)i=0;if(i>=Ls.length)return A.storyClose();show()};A._stT=()=>clearTimeout(T);show()},
  storyClose(){const o=document.querySelector('.sty');if(o)o.remove();if(A._stT)A._stT()},
  postView(id){const p=(SOC.posts||[]).find(x=>x.id===id);if(!p)return;sheet(`<div class="fp" style="margin:0">${frCardP({f:{me:1,uid:SOC.me,username:S.profile.username,d:{name:S.profile.name,photo:S.profile.photo}},p,at:p.at})}</div>`)},
  async cam(){if(!SDB()||!S.profile.username){toast(TT('Paylaşım için hesap ve kullanıcı adı gerekli','Account and username needed'));return}
    const md=navigator.mediaDevices;if(!md||!md.getUserMedia){A.camFile(true);return}
    A.camClose();const o=document.createElement('div');o.className='cam';o.setAttribute('role','dialog');o.setAttribute('aria-label',TT('Kamera','Camera'));
    o.innerHTML=`<video playsinline muted autoplay></video><div class="cam-top"><button onclick="A.camClose()" aria-label="${TT('Kapat','Close')}">✕</button></div>
     <div class="cam-bot"><label class="cam-g" aria-label="${TT('Galeri','Gallery')}">🖼️<input type="file" accept="image/*" hidden onchange="A.camPicked(this)"></label><button class="cam-sh" onclick="A.camShot()" aria-label="${TT('Fotoğraf çek','Take photo')}"></button><button class="cam-f" onclick="A.camFlip()" aria-label="${TT('Kamerayı çevir','Flip camera')}">⟲</button></div>`;
    document.body.appendChild(o);A._camFace=A._camFace||'environment';await A.camStart()},
  async camStart(){const o=document.querySelector('.cam');if(!o)return;if(A._camS)A._camS.getTracks().forEach(t=>t.stop());
    try{A._camS=await navigator.mediaDevices.getUserMedia({video:{facingMode:A._camFace,width:{ideal:1440},height:{ideal:1920}},audio:false});const v=o.querySelector('video');v.srcObject=A._camS;v.classList.toggle('mir',A._camFace==='user');await v.play().catch(()=>{})}
    catch(e){A.camClose();A.camFile(true)}},
  camFlip(){A._camFace=A._camFace==='user'?'environment':'user';A.camStart()},
  camClose(){if(A._camS){A._camS.getTracks().forEach(t=>t.stop());A._camS=null}const o=document.querySelector('.cam');if(o)o.remove()},
  camShot(){const o=document.querySelector('.cam'),v=o&&o.querySelector('video');if(!v||!v.videoWidth)return;let w=v.videoWidth,h=v.videoHeight;const k=Math.min(1,1080/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k);
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(A._camFace==='user'){x.translate(w,0);x.scale(-1,1)}x.drawImage(v,0,0,w,h);let d=c.toDataURL('image/jpeg',.72);if(d.length>420000)d=c.toDataURL('image/jpeg',.55);
    o.classList.add('flash');setTimeout(()=>{A.camClose();A.postNew(d)},160)},
  async camPicked(inp){const f=inp.files&&inp.files[0];if(!f)return;try{const d=await imgShrink(f);A.camClose();A.postNew(d)}catch(e){toast(TT('Fotoğraf okunamadı','Could not read photo'))}},
  camFile(capture){const i=document.createElement('input');i.type='file';i.accept='image/*';if(capture)i.setAttribute('capture','environment');i.onchange=()=>A.camPicked(i);i.click()},
  postNew(img){if(!SDB()||!S.profile.username){toast(TT('Paylaşım için hesap ve kullanıcı adı gerekli','Account and username needed'));return}A._post={img:img||null,meal:null};
    const ms=dayMeals(dkey()).filter(m=>m.photo||(m.photoId&&S.photos.find(x=>x.id===m.photoId)));
    sheet(`<h3>📸 ${TT('Yemek paylaş','Share a meal')}</h3><div class="lbl" style="margin:-6px 0 12px">${TT('Sadece arkadaşların görür. 21 gün sonra akıştan düşer.','Only friends see it. Drops from the feed after 21 days.')}</div>
     <div class="pn-img" id="pnImg">${img?`<img src="${img}" alt="">`:`<span>${TT('Fotoğraf seç','Pick a photo')}</span>`}</div>
     <div class="grid2" style="margin:10px 0"><label class="btn">📷 ${TT('Çek','Camera')}<input type="file" accept="image/*" capture="environment" hidden onchange="A.postPick(this)"></label><label class="btn ghost">🖼️ ${TT('Galeri','Gallery')}<input type="file" accept="image/*" hidden onchange="A.postPick(this)"></label></div>
     ${ms.length?`<div class="lbl">${TT('ya da bugünkü öğününden seç','or pick from today\'s meals')}</div><div class="pn-ms">${ms.map(m=>`<button onclick="A.postMeal('${m.id}')"><img src="${m.photo||S.photos.find(x=>x.id===m.photoId).img}" alt=""><small>${esc(m.name)}</small></button>`).join('')}</div>`:''}
     <div class="lbl" style="margin-top:10px">${TT('Bağlı öğün (kalori ve makrolar gösterilir)','Linked meal (shows calories and macros)')}</div>
     <select id="pnMeal" onchange="A._post.meal=this.value||null"><option value="">${TT('Yok','None')}</option>${dayMeals(dkey()).map(m=>`<option value="${m.id}">${esc(m.name)} · ${Math.round(m.kcal)} kcal</option>`).join('')}</select>
     <input id="pnCap" maxlength="180" placeholder="${TT('Açıklama yaz… (isteğe bağlı)','Write a caption… (optional)')}" style="margin-top:10px">
     <div style="display:flex;justify-content:center">${HB.html(TT('Paylaşmak için basılı tut','Hold to share'),'pnHold')}</div>`);
    setTimeout(()=>HB.bind('pnHold',()=>{if(!(A._post||{}).img){toast(TT('Önce fotoğraf seç','Pick a photo first'));return false}return true},()=>A.postSend(true),()=>{closeSheet();ui.frTab='feed';render(true);toast(TT('Paylaşıldı','Shared'))}),0)},
  async postPick(inp){const f=inp.files&&inp.files[0];if(!f)return;try{A._post.img=await imgShrink(f);const b=document.getElementById('pnImg');if(b)b.innerHTML=`<img src="${A._post.img}" alt="">`}catch(e){toast(TT('Fotoğraf okunamadı','Could not read photo'))}},
  postMeal(id){const m=S.meals.find(x=>x.id===id);if(!m)return;A._post.img=m.photo||(S.photos.find(x=>x.id===m.photoId)||{}).img;A._post.meal=id;const b=document.getElementById('pnImg');if(b)b.innerHTML=`<img src="${A._post.img}" alt="">`;const sl=document.getElementById('pnMeal');if(sl)sl.value=id},
  async postSend(hold){const P=A._post||{};if(!P.img)return toast(TT('Önce fotoğraf seç','Pick a photo first'));if(!navigator.onLine){S.outbox=(S.outbox||[]).concat([{...P}]).slice(-5);save();try{closeSheet()}catch(e){}toast(TT('Çevrimdışısın: bağlantı gelince paylaşılacak','Offline: will post when you reconnect'));return true}if(P.img.length>600000){try{const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=P.img}),k=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);P.img=c.toDataURL('image/jpeg',.65)}catch(e){}}const id=await socId();if(!id)return;const m=P.meal&&S.meals.find(x=>x.id===P.meal);
    const doc={uid:id,username:S.profile.username,name:S.profile.name||'',fr:(S.friends||[]).map(f=>f.uid).filter(Boolean),img:P.img,cap:(document.getElementById('pnCap')||{}).value||'',...(m?{kcal:Math.round(m.kcal),p:Math.round(m.p),c:Math.round(m.c),f:Math.round(m.f),mn:m.name}:{}),at:Date.now()};
    try{const pid=uid()+uid();await SDB().collection('posts').doc(pid).set(doc);try{(S.friends||[]).map(f=>({...f,d:SOC.friends[f.uid]})).filter(f=>f.uid&&isMut(f.d)).forEach(f=>inboxSend(f.uid,{type:'post',ref:pid,msg:(doc.cap||'').slice(0,80)}))}catch(e){}S.myPosts=[{id:pid,at:doc.at},...(S.myPosts||[])].slice(0,40);save();SOC.lastPush=null;socPush();SOC.posts=[{...doc,id:pid},...(SOC.posts||[])];if(hold)return true;closeSheet();ui.frTab='feed';render(true);toast(TT('Paylaşıldı','Shared'))}
    catch(e){const c=String(e&&(e.code||e.message)||'');console.warn('post',e);toast(/perm|denied|not_granted/i.test(c)?TT('İzin yok: Firebase kurallarını güncelle','No permission: update Firebase rules'):TT('Paylaşılamadı','Could not share')+' ('+c.slice(0,40)+')');return false}},
  async postDel(id){if(!confirm(TT('Paylaşımı sil?','Delete post?')))return;try{await SDB().collection('posts').doc(id).delete()}catch(e){}S.myPosts=(S.myPosts||[]).filter(x=>x.id!==id);save();SOC.lastPush=null;socPush();SOC.posts=(SOC.posts||[]).filter(p=>p.id!==id);render(true)},
  ctaKg(){const a=S.active;if(!a)return false;const e=a.ex[a.idx];if(!e||e.t)return false;const i=e.sets.findIndex(s=>!s.done);if(i<0)return false;const st=e.sets[i];if(st.kg===''||st.kg==null){A.pickSet(i,'kg');return true}return false},
  pickSet(i,k){const e=S.active.ex[S.active.idx],st=e.sets[i],prev=i>0?e.sets[i-1][k]:null,cur=num(st[k])??num(prev)??(k==='kg'?20:(e.t?30:(e.repMin||8)));
    const kg=k==='kg';A.pick({t:kg?TT('Kaç kilo?','How much weight?'):e.t?TT('Kaç saniye?','How many seconds?'):TT('Kaç tekrar?','How many reps?'),sub:esc(e.name)+' · '+TT('Set','Set')+' '+(i+1),v:cur,min:0,max:kg?400:(e.t?600:100),step:kg?(/dumbbell|kettlebell/i.test(e.name)?1:2.5):1,u:kg?'kg':e.t?TT('sn','s'):TT('tkr.','reps'),
      cb:v=>{A.setVal(i,k,String(v));render(true)}})},
  pick(o){o.v=Math.min(o.max,Math.max(o.min,Math.round(o.v/o.step)*o.step));A._pk=o;const n=Math.round((o.max-o.min)/o.step)+1,md=o.step<1?10:o.step===1?5:4;
    sheet(`<div class="pk"><div class="pk-t">${o.t}</div>${o.sub?`<div class="lbl" style="text-align:center">${o.sub}</div>`:''}
      <div class="pk-v"><b id="pkv">${A._pkf(o.v)}</b><small>${o.u}</small></div>
      <div class="pk-r" id="pkr" role="slider" tabindex="0" aria-valuemin="${o.min}" aria-valuemax="${o.max}" aria-valuenow="${o.v}" aria-label="${o.t}" onkeydown="A.pkKey(event)"><div class="pk-in" style="width:${n*10}px">${Array.from({length:n},(_,j)=>`<i class="${j%(md*2)===0?'M':j%md===0?'m':''}"></i>`).join('')}</div></div>
      <div class="pk-c" aria-hidden="true"></div>
      <div class="row" style="gap:10px;margin-top:14px"><button class="btn ghost" style="flex:0 0 64px" onclick="A.pkStep(-1)" aria-label="${TT('Azalt','Decrease')}">−</button><button class="btn" onclick="A.pkOk()">${TT('Tamam','Done')}</button><button class="btn ghost" style="flex:0 0 64px" onclick="A.pkStep(1)" aria-label="${TT('Artır','Increase')}">+</button></div></div>`);
    setTimeout(()=>{const r=document.getElementById('pkr');if(!r)return;const pad=(r.clientWidth/2-5)+'px';r.firstElementChild.style.margin='0 '+pad;A._pkSet(o.v,false);
      r.onscroll=()=>{const j=Math.round(r.scrollLeft/10),v=Math.min(o.max,Math.max(o.min,Math.round((o.min+j*o.step)*100)/100));if(v!==A._pk.v){A._pk.v=v;const b=document.getElementById('pkv');if(b){b.textContent=A._pkf(v);b.classList.remove('roll');void b.offsetWidth;b.classList.add('roll')}r.setAttribute('aria-valuenow',v);if(navigator.vibrate)try{navigator.vibrate(4)}catch(e){}}}},60)},
  _pkf(v){return String(v).replace('.',LANG()==='en'?'.':',')},
  _pkSet(v,sm){const o=A._pk,r=document.getElementById('pkr');if(!r)return;r.scrollTo({left:Math.round((v-o.min)/o.step)*10,behavior:sm?'smooth':'auto'})},
  pkStep(d){const o=A._pk;const v=Math.min(o.max,Math.max(o.min,Math.round((o.v+d*o.step)*100)/100));A._pkSet(v,true)},
  pkKey(e){if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();A.pkStep(1)}else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();A.pkStep(-1)}else if(e.key==='Enter')A.pkOk()},
  pkOk(){const o=A._pk;closeSheet();if(o&&o.cb)setTimeout(()=>o.cb(o.v),60)},
  verOpen(){const v=verState(),pc=Math.round(v.cur/v.need*100);S.settings.verSeen=v.lv;save();render(true);
    sheet(`<div class="vsh"><div class="lbl" style="text-align:center">${TT('Şu anki versiyonun','Your current version')}</div><div class="vbig">${verWord()}<b>${v.v}</b></div>
      <div class="vbar"><i style="width:${pc}%"></i></div><div class="lbl" style="text-align:center;margin-top:6px">${TT(`v${v.next} için ${v.need-v.cur} XP kaldı`,`${v.need-v.cur} XP to v${v.next}`)} · ${TT('toplam','total')} ${v.xp.toLocaleString(LOC())} XP</div>
      <div class="vgrid">${v.src.map(q=>`<div><small>${q[0]}</small><b>+${q[2]}</b><span>${q[1]}</span></div>`).join('')}</div>
      <div class="dp-t" style="font-size:16px;margin:18px 0 8px">${TT('Bu hafta kazandığın','Earned this week')}<small>+${v.week} XP</small></div>
      <div class="lbl" style="line-height:1.55">${TT('Versiyonun, uygulamada yaptığın her şeyle yükselir: antrenman, set, kardiyo, rekor, öğün kaydı, su hedefi ve 7 saatten uzun uyku. Her 10 seviyede ana sürüm değişir (1.9 → 2.0).','Your version rises with everything you do in the app: workouts, sets, cardio, records, logged meals, water goals and 7+ hour nights. Every 10 levels the major version changes (1.9 → 2.0).')}</div></div>`)},
  askIntro(k,d){const H=HD(),x=H[d]||{},sc=healthScores(d)||{},nm=(S.profile.name||'').split(' ')[0],hi=nm?TT(`Merhaba ${nm}, `,`Hey ${nm}, `):TT('Merhaba, ','Hey, ');
    if(k==='slp'){const sl=x.sleep||{},db=sleepDebt(d);if(!sl.min)return hi+TT('bu gece için uyku verin henüz yok. Uykunla ilgili ne merak ediyorsun?','there is no sleep data for this night yet. What would you like to know about your sleep?');
      return hi+TT(`dün gece ${fmtMin(sl.min)} uyudun, uyku skorun ${sc.sleep??'—'}. ${db>60?`Son 7 günde ${tmT(db)} uyku borcun birikti.`:'Uyku borcun yok denecek kadar az.'} Bugün nasıl hissediyorsun?`,`you slept ${fmtMin(sl.min)} last night with a sleep score of ${sc.sleep??'—'}. ${db>60?`You have ${tmT(db)} of sleep debt over the last 7 days.`:'You have almost no sleep debt.'} How are you feeling today?`)}
    if(k==='hrd'){const b=baseline('rhr',d),hb=baseline('hrv',d),r=x.rhr,st=b&&r!=null?(r>b.m+b.sd?TT('normalinin üstünde','above your normal'):r<b.m-b.sd?TT('normalinin altında','below your normal'):TT('normal aralığında','within your normal range')):'';
      return hi+TT(`dinlenik nabzın ${r??'—'} bpm${st?', '+st:''}; HRV'n ${x.hrv??'—'} ms${hb&&x.hrv!=null?(x.hrv>=hb.m?', normalinin üstünde':', normalinin altında'):''}. Toparlanman %${sc.rec??'—'}. Kalbinle ilgili neyi merak ediyorsun?`,`your resting heart rate is ${r??'—'} bpm${st?', '+st:''}; HRV is ${x.hrv??'—'} ms. Recovery is ${sc.rec??'—'}%. What would you like to know?`)}
    if(k==='yuk'){const sv=strainOf(d),pl=todaysPlan();return hi+TT(`bugünkü yükün ${sv!=null?fmt(sv):'—'}/21, toparlanman %${sc.rec??'—'}.${pl?` Sırada ${esc(pl.name)} var.`:''} Bugün antrenman konusunda ne düşünüyorsun?`,`today's strain is ${sv!=null?fmt(sv):'—'}/21 and recovery ${sc.rec??'—'}%.${pl?` ${esc(pl.name)} is up next.`:''} How are you leaning on training today?`)}
    const st=x.steps;return hi+TT(`bugün ${st!=null?Math.round(st).toLocaleString(LOC()):'—'} adımdasın${st!=null?`, hedefinin %${Math.round(st/80)}'i`:''}. Hareketinle ilgili ne sormak istersin?`,`you're at ${st!=null?Math.round(st).toLocaleString(LOC()):'—'} steps today${st!=null?`, ${Math.round(st/80)}% of your goal`:''}. What would you like to ask?`)},
  askPage(k){const d=ui.hdDay||dkey(),Q={hrd:[TT('Nabzım normal mi?','Is my heart rate normal?'),TT('HRV\'mi nasıl yükseltirim?','How do I raise my HRV?'),TT('Dinlenik nabzım neden değişiyor?','Why does my resting HR change?')],
     slp:[TT('Kendimi iyi hissediyorum','I feel good'),TT('Biraz yorgunum','I feel a bit tired'),TT('Derin uykumu nasıl artırırım?','How do I get more deep sleep?'),TT('Bu gece kaçta yatmalıyım?','When should I go to bed tonight?')],
     yuk:[TT('Bugün dinleneceğim','I plan to rest today'),TT('Hafif çalışmak istiyorum','I want to train lightly'),TT('Antrenman öner','Suggest a workout'),TT('Yüküm fazla mı?','Is my strain too high?')],
     stp:[TT('Hedefime nasıl ulaşırım?','How do I hit my goal?'),TT('Bu hafta yeterince hareket ettim mi?','Did I move enough this week?'),TT('Yürüyüş öner','Suggest a walk')]}[k];
    A._ak={k,d,m:[{r:'ai',t:A.askIntro(k,d)}]};A._akQ=Q;
    sheet(`<div class="aqx"><div class="aqx-h"><span class="aqx-b"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2.5c.5 4.3 2.2 6 6.5 6.5-4.3.5-6 2.2-6.5 6.5-.5-4.3-2.2-6-6.5-6.5 4.3-.5 6-2.2 6.5-6.5Z"/><path d="M18 13.5c.25 2.1 1.1 2.95 3.2 3.2-2.1.25-2.95 1.1-3.2 3.2-.25-2.1-1.1-2.95-3.2-3.2 2.1-.25 2.95-1.1 3.2-3.2Z"/></svg></i>HypeMode AI</span></div><div id="aqm"></div>
      <div class="aqc">${Q.map((q,i)=>`<button class="chip" onclick="A.askPageGo(${i})">${esc(q)}</button>`).join('')}</div>
      <div class="aqf"><input id="aqi" maxlength="300" placeholder="${TT('HypeMode\'a sor…','Ask HypeMode anything…')}" aria-label="${TT('Sorunu yaz','Type your question')}" onkeydown="if(event.key==='Enter')A.askPageGo()"><button class="aqs" onclick="A.askPageGo()" aria-label="${TT('Gönder','Send')}">↑</button></div><div class="lbl" style="font-size:12px;margin-top:8px">${CL.sample?TT('Sorun ve bu sayfanın verileri yanıt için Claude\'a (Anthropic) gönderilir. Tıbbi tavsiye değildir.','Your question and this page\'s data are sent to Claude (Anthropic) to answer. Not medical advice.'):TT('Yanıtlar tıbbi tavsiye değildir.','Answers are not medical advice.')} <a href="gizlilik.html" target="_blank">${TT('Aydınlatma Metni','Privacy notice')}</a></div></div>`);A.askDraw()},
  askDraw(load){const box=document.getElementById('aqm');if(!box||!A._ak)return;
    box.innerHTML=A._ak.m.map((q,i)=>q.r==='me'?`<div class="aqu">${esc(q.t)}</div>`:q.r==='noai'?q.t:`<div class="aqa"><p>${esc(q.t)}</p>${(q.tips||[]).length?`<ul>${q.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}<div class="aqa-t"><button onclick="A.askCopy(${i})" aria-label="${TT('Kopyala','Copy')}">${lic('copy',16)}</button></div></div>`).join('')+(load?`<div class="ai-load" style="padding:10px 0"><div class="spin"></div><div class="lbl">${TT('Verilerine bakılıyor…','Looking at your data…')}</div></div>`:'');
    box.scrollTop=box.scrollHeight},
  async askCopy(i){const q=A._ak.m[i];const ok=await copyTxt(q.t+((q.tips||[]).length?'\n- '+q.tips.join('\n- '):''));toast(ok?TT('Kopyalandı','Copied'):TT('Kopyalanamadı','Copy failed'))},
  pageCtx(k,d){const H=HD(),x=H[d]||{},sc=healthScores(d)||{},wk=lastNDays(d,7),c={tarih:d,dinlenik_nabiz:x.rhr,hrv:x.hrv,hrv_normal:(baseline('hrv',d)||{}).m,nabiz_normal:(baseline('rhr',d)||{}).m,toparlanma:sc.rec,hazirlik:sc.tot,profil:{yas:S.profile.age,cinsiyet:S.profile.sex==='f'?'kadın':'erkek'},hedef:GOALTXT()};
    if(k==='hrd')Object.assign(c,{gunun_en_yuksek:x.hrHi,gunun_en_dusuk:x.hrLo,maks_nabiz_tahmini:hrMax(),son_7_gun:wk.map(q=>({t:q,dinlenik:(H[q]||{}).rhr,hrv:(H[q]||{}).hrv}))});
    if(k==='slp'){const sp=sleepParts(x)||{},sl=x.sleep||{};Object.assign(c,{uyku:{sure_dk:sl.min,derin:sl.deep,rem:sl.rem,hafif:sl.light,uyanik:sl.awake,yatis:sl.bed,kalkis:sl.wake},uyku_skoru:sp.tot,skor_parcalari:{sure_50:sp.dur,kalite_25:sp.qual,toparlanma_25:sp.rest},uykudaki_nabiz:sp.shr,uyku_borcu_7g_dk:sleepDebt(d),son_7_gece:wk.map(q=>{const s2=(H[q]||{}).sleep||{};return{t:q,dk:s2.min,yatis:s2.bed}})})}
    if(k==='yuk'){const p=strainParts(d)||{};Object.assign(c,{yuk:p.tot,kalp_yuku:p.hr,yuksek_nabiz_dk:p.zmin,set:p.sets,yuk_dengesi_acwr:sc.acwr,son_14_gun_yuk:lastNDays(d,14).map(q=>strainOf(q)),antrenmanlar:trainedOn(d).map(s2=>({ad:s2.planName,set:s2.sets.length,dk:Math.round((s2.dur||0)/60)})),siradaki_antrenman:(todaysPlan()||{}).name||null})}
    if(k==='stp')Object.assign(c,{adim:x.steps,hedef_adim:8000,aktif_dk:x.active,son_7_gun_adim:wk.map(q=>(H[q]||{}).steps)});
    return c},
  async askPageGo(i){const{k,d,m}=A._ak||{},inp=document.getElementById('aqi'),q=i!=null?A._akQ[i]:(inp&&inp.value||'').trim();if(!q||!k)return;if(inp)inp.value='';
    m.push({r:'me',t:q});const ctx=A.pageCtx(k,d),hist=m.filter(x=>x.r!=='noai').slice(-8).map(x=>(x.r==='me'?'Kullanıcı: ':'Koç: ')+x.t).join('\n');
    if(!CL.sample){A._rpt=`Sen kişisel sağlık ve antrenman koçumsun. Fitbit verilerime bakarak Türkçe, kısa ve somut cevap ver. Tıbbi teşhis koyma.\nKonuşma:\n${hist}\nVerilerim (JSON):\n${JSON.stringify(ctx)}`;
      m.push({r:'noai',t:`${noAI()}<button class="btn" onclick="A.rptCopy()">📋 ${TT('Sohbeti ve verilerimi kopyala','Copy the chat and my data')}</button>`});A.askDraw();return}
    A.askDraw(1);
    const prompt=`Sen HypeMode uygulamasının sağlık ve antrenman koçusun. Kullanıcı ${({hrd:'kalp atışı',slp:'uyku',yuk:'yük (strain)',stp:'adım'})[k]} sayfasında seninle konuşuyor. Yük 0-21 ölçeğinde (WHOOP benzeri), toparlanma ve hazırlık 0-100.
Konuşma:
${hist}
Veriler (JSON): ${JSON.stringify(ctx)}
Son mesaja kısa, sohbet tonunda cevap ver (en fazla 4 cümle); gerekiyorsa en fazla 3 somut öneri ekle. ${RULES}
JSON şeması: {"answer":"cevap","tips":["öneri"]}`;
    try{const r=await askAI(prompt,{tier:'quick'});if(!r||!r.answer)throw{code:'bad'};m.push({r:'ai',t:r.answer,tips:(r.tips||[]).slice(0,3)});A.askDraw()}
    catch(e){m.pop();A.askDraw();aiErr(e)}},
  smartSheet(){const days=weekDays();
    sheet(`<h3>🤖 Akıllı yemek önerisi</h3><div class="lbl" style="margin:-6px 0 12px;line-height:1.5">AI, o günün kalan kalori ve proteinine göre tarif önerir. Kaloriler HypeMode'un besin veritabanından hesaplanır.</div>
     <div class="grid2"><div class="fld"><label>Gün</label><select id="ss_d">${days.map(d=>`<option value="${d}">${new Date(d+'T12:00').toLocaleDateString(LOC(),{weekday:'long',day:'numeric'})}</option>`).join('')}</select></div>
      <div class="fld"><label>Öğün</label><select id="ss_k"><option value="all">Tüm gün (4 öğün)</option>${SLOTS.map(([k,l])=>`<option value="${k}">${l} (3 seçenek)</option>`).join('')}</select></div></div>
     <div class="fld"><label>Elimde olanlar (isteğe bağlı)</label><textarea id="ss_p" rows="2" placeholder="ör. tavuk göğsü, pirinç, yoğurt, domates, yumurta"></textarea></div>
     <div class="fld"><label>Tercihler (isteğe bağlı)</label><input id="ss_x" placeholder="ör. 20 dk'dan kısa, öğrenci bütçesi, balık sevmem"></div>
     <button class="btn" onclick="A.smartGo()">✨ Öner</button>`)},
  async smartGo(){const d=document.getElementById('ss_d').value,k=document.getElementById('ss_k').value,pan=document.getElementById('ss_p').value.trim(),pref=document.getElementById('ss_x').value.trim();
    const st=S.settings,mp=S.mealPlan[d]||{};
    const planned=SLOTS.filter(([kk])=>mp[kk]&&rec(mp[kk].rid)&&(k==='all'?false:kk!==k)).map(([kk,l])=>{const r=rec(mp[kk].rid);return{ogun:l,ad:r.n,kcal:Math.round(r.kcal*mp[kk].serv),p:Math.round(r.p*mp[kk].serv)}});
    const eaten=d===dkey()?dayTotals(d):{kcal:0,p:0};
    const usedK=planned.reduce((a,x)=>a+x.kcal,0),usedP=planned.reduce((a,x)=>a+x.p,0);
    const remK=Math.max(250,st.kcal-usedK-(k==='all'?0:0)),remP=Math.max(15,st.protein-usedP);
    const targets=k==='all'?SLOTS.map(([kk,l,sh])=>`${l} (${kk}): ~${Math.round(st.kcal*sh)} kcal, ~${Math.round(st.protein*sh)} g protein`).join('; ')
      :(()=>{const sh=SLOTS.find(x=>x[0]===k)[2],tot=SLOTS.filter(([kk])=>!planned.find(x=>x.ogun===SLOTS.find(z=>z[0]===kk)[1])).reduce((a,x)=>a+x[2],0)||sh;return `${SLOTS.find(x=>x[0]===k)[1]} (${k}): ~${Math.round(remK*sh/tot)} kcal, ~${Math.round(remP*sh/tot)} g protein`})();
    sheet(`<div class="ai-load"><div class="spin"></div><b>Tarifler hazırlanıyor…</b><div class="lbl">${esc(targets)}</div></div>`);
    const prompt=`Sen HypeMode uygulamasının beslenme koçusun. ${k==='all'?'Bir günlük 4 öğün (kahvaltı b, öğle l, akşam d, ara öğün s) için birer tarif':'Bu öğün için 3 farklı tarif seçeneği'} öner.
Hedef: ${GOALTXT()}. Günlük hedef ${st.kcal} kcal, ${st.protein} g protein. Hedefler: ${targets}.
${planned.length?'O gün zaten planlı: '+JSON.stringify(planned)+'. ':''}${d===dkey()&&eaten.kcal?`Bugün şimdiye kadar ${Math.round(eaten.kcal)} kcal ve ${Math.round(eaten.p)} g protein alındı. `:''}
${pan?'Elindeki malzemeler (öncelikle bunları kullan): '+pan+'. ':''}${pref?'Tercihler: '+pref+'. ':''}
Türk mutfağına uygun, pratik tarifler olsun. Malzemeleri YALNIZCA aşağıdaki listedeki isimlerle, birebir aynı yazımla kullan; miktarı listedeki birimle (g/ml ya da parantezdeki adet birimi) ve uygun pişirme durumuyla ver (ör. pişmiş tartılıyorsa "Izgara / fırın", kuru tartılıyorsa "Kuru (çiğ)"). Tuz, baharat, limon gibi kalorisiz şeyleri malzemeye yazma, "how" içinde geçebilir. Miktarları hedef kaloriye yakın tutturmaya çalış.
${RULES}
JSON şeması: {"recipes":[{"name":"tarif adı","emoji":"tek emoji","slot":"b|l|d|s","minutes":sayı,"how":"2-3 cümle hazırlanış","ingredients":[{"name":"listeden isim","qty":sayı,"unit":"g|ml|adet|...","state":"durum veya boş"}]}],"note":"kısa not"}
Malzeme listesi:
${ingCatalog()}`;
    try{const r=await askAI(prompt,{tier:'default'});const recs=(r&&r.recipes)||[];if(!recs.length)throw{code:'bad'};
      A._smart={d,k,recs:recs.map(x=>{const n=normLines(x.ingredients);const t=sumMac(n.lines);return{...x,slot:SLOTS.find(z=>z[0]===x.slot)?x.slot:(k==='all'?'l':k),lines:n.lines,bad:n.bad,t}}),note:r.note};
      A.smartShow()}catch(e){closeSheet();aiErr(e)}},
  smartShow(){const S2=A._smart;
    sheet(`<h3>🤖 Öneriler</h3>${S2.note?`<div class="lbl" style="margin:-6px 0 10px;line-height:1.5">${esc(S2.note)}</div>`:''}
     ${S2.recs.map((r,i)=>`<div class="card" style="margin:10px 0;padding:14px"><div class="row" style="gap:12px"><div class="plate sm" style="background:${COLS[EMO.indexOf(r.emoji)>=0?EMO.indexOf(r.emoji):i%COLS.length]}">${esc(r.emoji||'🍽️')}</div>
       <div style="flex:1"><b>${esc(r.name)}</b><div class="lbl">${SLOTS.find(z=>z[0]===r.slot)[1]}${r.minutes?' · ⏱ '+r.minutes+' dk':''}</div></div></div>
       <div class="macro4" style="margin:10px 0"><div><b>${Math.round(r.t.k)}</b><span class="lbl">kcal</span></div><div><b>${Math.round(r.t.p)}g</b><span class="lbl">protein</span></div><div><b>${Math.round(r.t.c)}g</b><span class="lbl">karb.</span></div><div><b>${Math.round(r.t.f)}g</b><span class="lbl">yağ</span></div></div>
       <div class="lbl" style="line-height:1.55">${r.lines.map(l=>`${esc(l[0])}${l[3]&&ING()[l[0]].st&&l[3]!==ING()[l[0]].st[0].n?' ('+esc(l[3].toLocaleLowerCase('tr-TR'))+')':''} ${fmt(l[1])} ${l[2]}`).join(' · ')}</div>
       ${r.bad.length?`<div class="lbl warn" style="margin-top:4px">Hesaba katılmadı: ${esc(r.bad.join(', '))}</div>`:''}
       <p class="lbl" style="line-height:1.5;margin:8px 0">${esc(r.how||'')}</p>
       <div class="grid2"><button class="btn sm" style="width:100%" onclick="A.smartAdd(${i})">Plana ekle</button><button class="btn ghost sm" style="width:100%" onclick="A.smartEdit(${i})">Düzenle</button></div></div>`).join('')}
     <button class="btn ghost" onclick="A.smartSheet()">↻ Farklı öneri iste</button>`)},
  _smartRecipe(i){const r=A._smart.recs[i],id='my-'+uid();
    return{id,custom:true,ai:true,slot:r.slot,n:r.name,e:r.emoji||'🍽️',col:COLS[EMO.indexOf(r.emoji)>=0?EMO.indexOf(r.emoji):i%COLS.length],kcal:Math.round(r.t.k),p:Math.round(r.t.p),c:Math.round(r.t.c),f:Math.round(r.t.f),
      min:r.minutes||0,how:r.how||'',serv:1,full:r.lines,ing:r.lines.map(l=>{const d=ING()[l[0]],c=stOf(d,l[3]);const raw=c&&c.y!==1&&l[2]===d.u?l[1]/c.y:l[1];return[l[0],Math.round(raw*100)/100,l[2],d.cat]})}},
  smartAdd(i){const r=A._smartRecipe(i),{d}=A._smart;S.myRecipes.push(r);(S.mealPlan[d]=S.mealPlan[d]||{})[r.slot]={rid:r.id,serv:1};save();
    toast(`${SLOTS.find(z=>z[0]===r.slot)[1]}: ${r.n} plana eklendi`);if(ui.view!=='mealplan'){ui.view='mealplan'}render(true);A.smartShow()},
  smartEdit(i){const r=A._smart.recs[i];A._rbCtx={d:A._smart.d,k:r.slot};
    A._rb={id:null,n:r.name,e:EMO.includes(r.emoji)?r.emoji:'🍲',slot:r.slot,serv:1,min:r.minutes||'',how:r.how||'',ing:r.lines.map(l=>[...l])};A.drawBuilder(false)},
  async aiSwap(){const cur=S.active.ex[S.active.idx],why=document.getElementById('swr').value,more=(document.getElementById('swx')||{}).value||'';
    const known=[...new Set([...S.sessions.flatMap(s=>s.sets.map(x=>x.ex)),...S.plans.flatMap(p=>p.exercises.map(e=>e.name))])];
    const box=document.getElementById('aisw');box.innerHTML='<div class="ai-load" style="padding:14px 0"><div class="spin"></div><div class="lbl">Alternatifler aranıyor…</div></div>';
    const prompt=`Sen HypeMode uygulamasının antrenman koçusun. Kullanıcı şu an "${cur.name}" (${MUSCLES[cur.muscle]||cur.muscle}, hedef ${cur.repMin}-${cur.repMax} tekrar) yapamıyor. Sebep: ${why}${more?' — '+more:''}.
Aynı kas grubunu benzer hareket paterniyle çalıştıran 3 alternatif öner. Mümkünse kullanıcının daha önce yaptığı egzersizleri tercih et (geçmişini kullanabilmek için): ${known.slice(0,80).join('; ')}.
Egzersiz adlarını standart İngilizce adıyla ve ekipmanı parantezde yazarak ver, ör. "Incline Bench Press (Dumbbell)". ${/ağrı/i.test(why)?'Ağrı varsa ağrıyan bölgeyi zorlamayan seçenekler öner ve ağrı sürerse uzmana danışmasını hatırlat. ':''}
${RULES}
JSON şeması: {"options":[{"name":"egzersiz adı","muscle":"quads|hamstrings|glutes|calves|chest|back|shoulders|biceps|triceps|core|other","why":"neden uygun, 1 cümle","tip":"kısa teknik ipucu"}],"note":"varsa kısa uyarı"}`;
    try{const r=await askAI(prompt,{tier:'quick'});const o=(r&&r.options)||[];if(!o.length)throw{code:'bad'};A._swo=o;
      box.innerHTML=`${r.note?`<div class="lbl warn" style="margin:6px 0">${esc(r.note)}</div>`:''}`+o.map((x,i)=>{const hist=lastLabel(x.name);
        return `<button class="rlist" style="align-items:flex-start" onclick="A.swapTo(${i})"><div class="plate sm" style="background:var(--card2);box-shadow:none">🤖</div><div style="flex:1"><b style="font-weight:600">${esc(x.name)}</b>${hist?` <span class="tag">son: ${hist}</span>`:''}<small style="line-height:1.45">${esc(x.why||'')}${x.tip?'<br>💡 '+esc(x.tip):''}</small></div></button>`}).join('')}
    catch(e){box.innerHTML='';aiErr(e)}},
  swapTo(i){const x=A._swo[i];A._swapApply(x.name,MUSCLES[x.muscle]?x.muscle:null)},
  guide(ph){const g=S.profile.applied?S.profile.goal:'maintain';ph=ph||(g==='bulk'?'bulk':'cut');A._gph=ph;const cut=ph==='cut';
    const PT=[['Pirinç, haşlanmış','150 g · 195 kcal','250 g · 325 kcal'],['Bulgur pilavı','150 g · 124 kcal','250 g · 208 kcal'],['Makarna, haşlanmış','150 g · 224 kcal','250–300 g · 372–447 kcal'],
      ['Tam buğday ekmek','1 dilim · 74 kcal','3 dilim · 222 kcal'],['Yulaf, kuru','50–60 g · 194–233 kcal','90 g · 350 kcal'],['Patates, fırında','150–200 g · 140–186 kcal','250–300 g · 232–279 kcal'],
      ['Zeytinyağı','1 tatlı kaşığı (5 g) · 44 kcal','1 yemek kaşığı (10–15 g) · 88–133 kcal'],['Fıstık ezmesi / badem','10 g · ~58 kcal','30 g · ~175 kcal'],
      ['Tavuk göğsü, ızgara','150–180 g · 248–297 kcal','200 g · 330 kcal'],['Yumurta','2 haşlanmış · 155 kcal','4 adet · 310 kcal'],['Yeşillik / sebze','Sınırsız, öğün başı 200 g+','100–150 g'],['İçecek','Su, maden suyu','300 ml ayran 111 / süt 150 kcal']];
    const SW=cut?[['150 g patates kızartması','150 g fırın patates','−328'],['250 g tereyağlı pilav','125 g haşlanmış pirinç + 150 g yeşillik','−190'],['3 dilim ekmek','1 dilim + 1 kase çoban salata','−148'],['330 ml kola','Maden suyu / limonlu soda','−139'],['Göz kararı yağ (~15 g)','Ölçülü 5 g','−89'],['2 sahanda yumurta','2 haşlanmış yumurta','−41'],['200 ml meyve suyu','1 portakal','−19']]
      :[['Ara öğüne','Kilo aldıran shake','+650'],['Ara öğüne','30 g badem','+174'],['Öğünde su yerine','300 ml süt / ayran','+150 / +111'],['Yulafa','20 g fıstık ezmesi','+118'],['Kahvaltıya','1 muz','+107'],['Salataya','10 g zeytinyağı','+88'],['Pilava','10 g tereyağı','+72']];
    const recs=PHASE_RECIPES.filter(r=>r.phase===ph);
    const DAY=cut?['c-menemen','c-elma','c-tavukbulgur','c-whey','c-sote','c-yumurta']:['b-yulaf','b-tavukpilav','b-yogurt','b-biftek'];
    const dt=DAY.map(rec).reduce((a,r)=>({k:a.k+r.kcal,p:a.p+r.p}),{k:0,p:0});
    sheet(`<h3>📘 Beslenme rehberi</h3>
     <div class="seg" style="margin:-4px 0 12px"><button class="${cut?'on':''}" onclick="A.guide('cut')">🔥 Definasyon</button><button class="${!cut?'on':''}" onclick="A.guide('bulk')">💪 Bulk</button></div>
     <div class="sugg" style="margin:0 0 12px">${cut?'Aynı yemekler, daha az karbonhidrat ve yağ, daha çok sebze. Tabak: ½ sebze · ¼ protein · ¼ karbonhidrat.':'Aynı yemekler, daha çok karbonhidrat ve sağlıklı yağ. İştah zorlarsa kaloriyi sıvıdan (shake, ayran, süt) ekle.'}
      ${g!=='maintain'&&S.profile.applied?`<br><span class="lbl">Senin hedefin: ${goalLabel()} · ${S.settings.kcal} kcal · P ${S.settings.protein} g</span>`:''}</div>
     <div class="gcat">Porsiyonlar · ${cut?'definasyon':'bulk'}</div>
     ${PT.map(r=>`<div class="ing"><span>${r[0]}</span><span style="text-align:right;color:${'var(--txt)'}">${cut?r[1]:r[2]}<br><span class="lbl">${cut?'bulk: '+r[2]:'definasyon: '+r[1]}</span></span></div>`).join('')}
     <div class="gcat">${cut?'Bunun yerine bunu ye':'Buna ekle'}</div>
     ${SW.map(r=>`<div class="ing"><span>${r[0]} → <b>${r[1]}</b></span><span class="${cut?'ok':'warn'}" style="white-space:nowrap">${r[2]} kcal</span></div>`).join('')}
     <div class="gcat">Basit yemekler · ${recs.length} tarif</div>
     ${SLOTS.map(([k,l])=>recs.filter(r=>r.slot===k).map(r=>`<button class="rlist" onclick="A.guideRec('${r.id}')"><div class="plate sm" style="background:${r.col}">${r.e}</div><div style="flex:1">${esc(r.n)}<small>${l} · ${r.kcal} kcal · P ${r.p} g · ⏱ ${r.min} dk</small></div><span class="muted">›</span></button>`).join('')).join('')}
     <div class="gcat">Örnek tam gün</div>
     <div class="lbl" style="line-height:1.6">${DAY.map(id=>esc(rec(id).n)).join(' · ')}<br><b style="color:var(--txt)">${dt.k} kcal · P ${dt.p} g</b></div>
     <div class="grid2" style="margin-top:10px"><select id="gd_d">${weekDays().map(d=>`<option value="${d}">${new Date(d+'T12:00').toLocaleDateString(LOC(),{weekday:'long',day:'numeric'})}</option>`).join('')}</select>
      <button class="btn sm" style="width:100%" onclick="A.guideDay()">Bu günü plana koy</button></div>
     <div class="lbl" style="margin-top:12px;line-height:1.5">Değerler HypeMode besin veritabanından hesaplanır, yaklaşıktır. "Haftamı planla" hedefin definasyon ise definasyon, bulk ise bulk tariflerini öncelikli seçer.</div>`)},
  guideRec(id){const d=dkey(),r=rec(id);A._grId=id;
    sheet(`<div class="plate lg" style="background:${r.col}">${r.e}</div><h3 style="text-align:center;margin-bottom:4px">${esc(r.n)}</h3>
     <div class="lbl" style="text-align:center;margin-bottom:12px">${SLOTS.find(s=>s[0]===r.slot)[1]} · ⏱ ${r.min} dk · <span class="tag ph-${r.phase}">${PHASE_LBL[r.phase]}</span></div>
     <div class="macro4"><div><b>${r.kcal}</b><span class="lbl">kcal</span></div><div><b>${r.p}g</b><span class="lbl">protein</span></div><div><b>${r.c}g</b><span class="lbl">karb.</span></div><div><b>${r.f}g</b><span class="lbl">yağ</span></div></div>
     <b>Malzemeler</b>${r.full.map(([n,a,u,st])=>{const dd=ING()[n],c=stOf(dd,st);return `<div class="ing"><span>${esc(n)}${c&&c.y!==1?` <span class="lbl">(${c.n.toLocaleLowerCase('tr-TR')})</span>`:''}</span><span class="muted">${fmt(a)} ${u}</span></div>`}).join('')}
     <p class="lbl" style="line-height:1.5;margin:12px 0 14px">${esc(r.how)}</p>
     <div class="grid2"><select id="gr_d">${weekDays().map(x=>`<option value="${x}">${new Date(x+'T12:00').toLocaleDateString(LOC(),{weekday:'long',day:'numeric'})}</option>`).join('')}</select>
      <button class="btn sm" style="width:100%" onclick="A.guideAdd()">Plana ekle</button></div>
     <div class="grid2" style="margin-top:10px"><button class="btn ghost" onclick="A.guide('${r.phase}')">← Rehber</button><button class="btn ghost" onclick="A.builder('${id}')">✏️ Kopyala & düzenle</button></div>`)},
  guideAdd(){const r=rec(A._grId),d=document.getElementById('gr_d').value;(S.mealPlan[d]=S.mealPlan[d]||{})[r.slot]={rid:r.id,serv:1};save();render(true);
    toast(`${SLOTS.find(s=>s[0]===r.slot)[1]}: ${r.n} eklendi`)},
  guideDay(){const d=document.getElementById('gd_d').value,cut=A._gph==='cut';
    const pick=cut?{b:'c-menemen',l:'c-tavukbulgur',d:'c-sote',s:'c-whey'}:{b:'b-yulaf',l:'b-tavukpilav',d:'b-biftek',s:'b-yogurt'};
    S.mealPlan[d]=Object.fromEntries(Object.entries(pick).map(([k,id])=>[k,{rid:id,serv:1}]));save();closeSheet();if(ui.view!=='mealplan')ui.view='mealplan';render(true);
    toast(`${new Date(d+'T12:00').toLocaleDateString(LOC(),{weekday:'long'})} planlandı`)},
  planToggle(id){ui.planOpen[id]=!ui.planOpen[id];render(true)},
  histToggle(){ui.histAll=!ui.histAll;render(true)},
  arcToggle(){ui.arcOpen=!ui.arcOpen;render(true)},
  homeG(g){ui.homeG=g;render(true)},
  genPre(n){const pr=genPresets().find(x=>x[0]===n);gp().mus=[...pr[1]];save();render(true)},
  genMus(k){const g=gp();if(g.mus.includes(k)){g.mus=g.mus.filter(x=>x!==k);if(g.sub[k]){const n={...g.sub};delete n[k];g.sub=n}}else g.mus=[...g.mus,k];save();render(true)},
  genAdv(){ui.genAdv=!ui.genAdv;render(true)},
  genTab(t){ui.gTab=ui.gTab===t?null:t;render(true)},
  genSub(m,k){const g=gp();let a=g.sub[m]||[];if(!k)a=[];else a=a.includes(k)?a.filter(x=>x!==k):[...a,k];if(a.length===MSUB[m].length)a=[];const n={...g.sub};if(a.length)n[m]=a;else delete n[m];g.sub=n;save();render(true)},
  genW(k,v){const g=gp(),a=g.w[k]||[];const n={...g.w};n[k]=a.includes(v)?a.filter(x=>x!==v):[...a,v].sort((x,y)=>x-y);if(!n[k].length)delete n[k];g.w=n;save();render(true)},
  genWAdd(k){const el=document.getElementById('gw-'+k),v=Math.round(parseFloat(String(el&&el.value||'').replace(',','.'))*4)/4;if(!(v>=1&&v<=500))return toast('Geçerli bir kilo yaz (1–500)');
    const g=gp(),a=g.w[k]||[];if(!a.includes(v)){g.w={...g.w,[k]:[...a,v].sort((x,y)=>x-y)};save()}render(true);toast(fmt(v)+' kg eklendi')},
  genTo(i,name){name=decodeURIComponent(name);const g=gp(),G=ui.gen,x=XBY[name];if(!G||!x)return;const names=G.exercises.map(e=>e.name).filter((n,j)=>j!==i);G.exercises[i]=genEx(x,g.lvl,names);g.last=G;save();closeSheet();render(true);toast('↔ '+x[0])},
  genInfo(i){const g=gp(),G=ui.gen,e=G&&G.exercises[i];if(!e)return;const x=XBY[e.name]||[],eqi=EQ.find(q=>q[0]===(e.eq||x[3]));
    const alts=(e.alts||(e.alt?[e.alt]:[])).map(altP),lv=exMus(e.name,e.muscle),sec=Object.keys(lv).filter(k=>lv[k]<1).map(k=>(typeof MUSC2!=='undefined'?MUSC2:MUSCLES)[k]).filter(Boolean);
    const hist=S.sessions.some(s=>s.sets.some(y=>y.ex===e.name));
    const skip=[...G.exercises.map(z=>z.name),...alts.map(a=>a.en)],sb=x.sub&&MSUB[e.muscle]?x.sub:null;
    const more=XDB.filter(y=>y[2]===e.muscle&&g.eq.includes(y[3])&&!skip.includes(y[0])).sort((a,b)=>((sb&&b.sub&&b.sub.some(k=>sb.includes(k)))?1:0)-((sb&&a.sub&&a.sub.some(k=>sb.includes(k)))?1:0)||Math.abs(a[4]-g.lvl)-Math.abs(b[4]-g.lvl)).slice(0,10);
    sheet(`<h3>${esc(e.name)}</h3><div class="lbl" style="margin:-8px 0 12px">${esc(e.tr||'')}</div>
     <div class="gi-top">${bodySvg(lv,{w:200,labels:true})}</div>
     <div class="gi-chips"><span class="mtag" style="--c:#ff5a3c">${MUSCLES[e.muscle]||''}</span>${sec.length?`<span class="chip">Yardımcı: ${sec.join(', ')}</span>`:''}${eqi?`<span class="chip">${eqi[1]} ${eqi[2]}</span>`:''}${x[4]?`<span class="chip">${LVL[x[4]-1][0]}</span>`:''}<span class="chip">${e.t?'Süreli':x[5]==='c'?'Çok eklemli':'İzole'}</span></div>
     <div class="exs-grid" style="margin-top:12px"><div><small>Set × tekrar</small><b>${e.sets} × ${rr(e)}</b></div><div><small>${e.fix||e.startKg?'Başlangıç':'Dinlenme'}</small><b style="font-size:14px">${e.fix?fmt(e.fix)+' kg':e.startKg?fmt(e.startKg)+' kg':RX[g.lvl].rest}</b></div></div>
     ${e.note?`<div class="coachl" style="margin:12px 0"><span>💡</span><div>${esc(e.note)}</div></div>`:''}
     ${formBlock(e.name)}
     ${alts.length?`<div class="gcat">Alternatifler</div><div class="swl">${alts.map((a,j)=>{const ax=XBY[a.en]||[],aq=EQ.find(q=>q[0]===ax[3]);return `<button onclick="A.close();A.genAlt(${i},${j})"><span>${aq?aq[1]:'↔'}</span><b>${a.t?'⏱ ':''}${esc(a.en)}</b><small>${esc(a.tr)}${aq?' · '+aq[2]:''} · bununla değiştir</small></button>`}).join('')}</div>`:''}
     ${more.length?`<div class="gcat">Diğer seçenekler · ${MUSCLES[e.muscle]||''}</div><div class="swl">${more.map(y=>{const aq=EQ.find(q=>q[0]===y[3]);return `<button onclick="A.genTo(${i},'${ja(y[0])}')"><span>${aq?aq[1]:'↔'}</span><b>${y[5]==='t'?'⏱ ':''}${esc(y[0])}</b><small>${esc(y[1])}${aq?' · '+aq[2]:''} · ${LVL[y[4]-1][0]}</small></button>`}).join('')}</div>`:''}
     <div class="grid2" style="margin-top:8px"><button class="btn ghost" onclick="A.close();A.genRe(${i})">🔄 Başka hareket</button>${hist?`<button class="btn ghost" onclick="A.close();A.exInfo('${ja(e.name)}')">📈 Geçmiş</button>`:`<button class="btn ghost" onclick="A.close()">Kapat</button>`}</div>`)},
  genSex(k){gp().sex=k;save();render(true)},
  homeQuick(n){const pr=genPresets().find(x=>x[0]===n);gp().mus=[...pr[1]];genBuild();gp().last=ui.gen;save();A.homeOpen();setTimeout(()=>{const r=document.querySelector('.gen-res');if(r)r.scrollIntoView({block:'start'})},80)},
  genAlt(i,j){const g=gp(),G=ui.gen,cur=G.exercises[i],a=altP((cur.alts||[cur.alt])[j]),x=XBY[a.en];if(!x)return;
    const names=G.exercises.map(e=>e.name).filter(n=>n!==cur.name);G.exercises[i]=genEx(x,g.lvl,names);g.last=G;save();render(true);toast('↔ '+x[0])},
  hwReady(){ui.hwReady=!ui.hwReady;render(true)},
  genEq(k){const g=gp();if(g.eq.includes(k)){if(g.eq.length===1)return toast('En az bir ekipman seçili olmalı');g.eq=g.eq.filter(x=>x!==k)}else g.eq=[...g.eq,k];save();render(true)},
  genLvl(i){gp().lvl=i;save();render(true)},
  genDur(d){gp().dur=d;save();render(true)},
  genMake(){const g=gp();if(!g.mus.length)return toast('Önce en az bir kas grubu seç');genBuild();g.last=ui.gen;save();render(true);
    setTimeout(()=>{const r=document.querySelector('.gen-res');if(r)r.scrollIntoView({behavior:'smooth',block:'start'})},60)},
  genRe(i){const g=gp(),G=ui.gen,cur=G.exercises[i],used=G.exercises.map(e=>e.name),t=XBY[cur.name]?XBY[cur.name][5]:'c';
    const sb=subPick(cur.muscle,XBY[cur.name]);const x=(sb&&genPick(genPool(cur.muscle,g.eq,g.lvl,used,sb),g.lvl,t))||genPick(genPool(cur.muscle,g.eq,g.lvl,used),g.lvl,t)||genPick(genPool(cur.muscle,['bodyweight'],g.lvl,used),g.lvl);
    if(!x)return toast('Bu kas için seçili ekipmanla başka hareket yok');G.exercises[i]=genEx(x,g.lvl,[...used,x[0]]);const nm=G.exercises.map(e=>e.name);G.exercises.forEach((e,j)=>{if(j!==i&&e.alt&&altP(e.alt).en===x[0])G.exercises[j]=genEx(XBY[e.name],g.lvl,nm)});g.last=G;save();render(true);toast('🔄 '+x[1])},
  genStart(){const G=ui.gen;if(!G||!G.exercises||!G.exercises.length)return toast('Önce antrenman oluştur');
    try{let p=S.plans.find(x=>x.tmpl==='gen-last');if(!p){p={id:uid(),tmpl:'gen-last',archived:true};S.plans.push(p)}
      p.name=G.name;p.archived=true;p.exercises=JSON.parse(JSON.stringify(G.exercises));hold=null;ui.tmrOpen=false;closeSheet();save();A.start(p.id)}
    catch(e){toast('⚠️ Başlatılamadı: '+(e&&e.message||e))}},
  /* ---- hızlı antrenman ---- */
  quick(){closeSheet();qPool.c=null;A._q={q:'',sel:[]};setTimeout(()=>{A.qDraw();setTimeout(()=>{const i=document.getElementById('q_in');if(i)i.focus()},80)},60)},
  qDraw(){const Q=A._q;sheet(`<h3>⚡ Hızlı antrenman</h3><div class="lbl" style="margin:-6px 0 12px;line-height:1.5">Şablon gerekmez: hareketi bul, istersen hedef koy (ör. 100 tekrar). Canlı takip et ya da yaptıysan direkt kaydet.</div>
    <input id="q_in" class="q-in" type="search" autocomplete="off" placeholder="🔍 Hareket ara… (şınav, squat, plank, barfiks)" value="${esc(Q.q)}" oninput="A.qSearch(this.value)">
    <div id="q_res" class="q-res">${qRes()}</div><div id="q_sel">${qSel()}</div>`)},
  qSearch(v){A._q.q=v;const r=document.getElementById('q_res');if(r)r.innerHTML=qRes()},
  qAdd(i){const x=A._qr[i];if(!x)return;const Q=A._q;
    if(Q.sel.some(s=>s.name===x.name))return toast('Zaten ekli');
    Q.sel.push({...x,goal:x.goal||'',sets:'',kg:''});Q.q='';const inp=document.getElementById('q_in');if(inp)inp.value='';
    document.getElementById('q_res').innerHTML=qRes();document.getElementById('q_sel').innerHTML=qSel();
    setTimeout(()=>{const g=document.getElementById('q_g'+(Q.sel.length-1));if(g)g.focus()},50)},
  qDel(i){A._q.sel.splice(i,1);document.getElementById('q_sel').innerHTML=qSel()},
  qSet(i,k,v){const s=A._q.sel[i];if(!s)return;s[k]=k==='muscle'?v:(v===''?'':Math.max(0,parseFloat(String(v).replace(',','.'))||0));if(k==='goal'||k==='sets'){const h=document.getElementById('q_h'+i);if(h)h.innerHTML=qHint(s)}},
  qBuild(){const L=A._q.sel;if(!L.length){toast('Önce bir hareket seç');return null}
    return L.map(s=>{const goal=num(s.goal)||0,n=num(s.sets)||(goal?Math.max(1,Math.min(10,Math.ceil(goal/(s.t?60:25)))):3);
      const per=goal?Math.max(1,Math.round(goal/n)):0,bw=s.eq==='bodyweight'||s.eq==='band'||s.custom&&!num(s.kg);
      const e={name:s.name,tr:s.tr||'',muscle:s.muscle||'core',sets:n,repMin:per||(s.t?30:8),repMax:per||(s.t?60:15),inc:bw?0:2.5,eq:s.eq||'bodyweight',note:s.note||''};
      if(s.t){e.t=1;e.fix=0}else if(bw)e.fix=0;if(goal)e.goal=goal;e._kg=num(s.kg);return e})},
  qStart(){const ex=A.qBuild();if(!ex)return;
    let p=S.plans.find(x=>x.tmpl==='quick-last');if(!p){p={id:uid(),tmpl:'quick-last',archived:true};S.plans.push(p)}
    p.name=ex.length===1?ex[0].name+(ex[0].goal?' · '+ex[0].goal+(ex[0].t?' sn':' tekrar'):''):'Hızlı antrenman';p.archived=true;p.exercises=ex.map(({_kg,...e})=>e);
    closeSheet();A.start(p.id);
    S.active.ex.forEach((e,j)=>{const src=ex[j];e.sets.forEach(st=>{if(st.kg===''||st.kg==null)st.kg=src._kg!=null?src._kg:(e.fix===0||e.t?0:'')});
      if(e.goal){const w=e.sets.filter(x=>tyOf(x)!=='w'),per=Math.floor(e.goal/w.length);let rem=e.goal-per*w.length;w.forEach(x=>{x.reps=per+(rem>0?1:0);rem--})}});
    save();render(true)},
  qLog(){const ex=A.qBuild();if(!ex)return;if(ex.some(e=>!e.goal))return toast('Kaydetmek için her harekete hedef/toplam yaz');
    const sets=[];ex.forEach(e=>{const per=Math.floor(e.goal/e.sets);let rem=e.goal-per*e.sets;for(let k=0;k<e.sets;k++){sets.push({ex:e.name,muscle:e.muscle,kg:e._kg||0,reps:per+(rem>0?1:0),rpe:null,...(e.t?{t:1}:{})});rem--}});
    const dur=Math.round(sets.length*75+ex.reduce((a,e)=>a+(e.t?e.goal:e.goal*2.5),0));
    const sess={id:uid(),planId:null,planName:ex.length===1?ex[0].name+' · '+ex[0].goal+(ex[0].t?' sn':' tekrar'):'Hızlı antrenman',date:new Date().toISOString(),dur,sets,prs:[],quick:1};
    S.sessions.push(sess);closeSheet();save();ui.view='summary';render();toast('✓ Kaydedildi')},
  qMore(){const e=S.active.ex[S.active.idx];if(!e.goal)return A.addSet();const dn=e.sets.filter(x=>x.done&&tyOf(x)!=='w').reduce((t,x)=>t+(num(x.reps)||0),0),rem=e.goal-dn;if(rem<=0)return;
    const l=e.sets.filter(x=>tyOf(x)!=='w').pop()||{};e.sets.push({kg:l.kg??0,reps:Math.min(rem,num(l.reps)||rem),rpe:'',done:false});save();render(true)},
  genSave(){const G=ui.gen;if(!G)return;S.plans.push({id:uid(),name:G.name,exercises:JSON.parse(JSON.stringify(G.exercises))});save();toast('Şablonlarına eklendi');render(true)},
  /* ---- set türleri & süperset ---- */
  styInfo(){sheet(`<h3>Set türleri & süperset</h3><div class="lbl" style="margin:-6px 0 12px;line-height:1.5">Antrenmanda set numarasına dokunarak türünü değiştirebilirsin. Şablon düzenlerken ısınma seti, son set türü ve süperset de seçilebilir.</div>
    ${Object.entries(STY).map(([k,t])=>`<div class="styi"><span class="styb" style="--c:${t.c}">${t.k||'1'}</span><div><b>${t.n}</b><p>${t.d}</p></div></div>`).join('')}
    <div class="styi"><span class="styb" style="--c:#ff5fb0">🔗</span><div><b>Süperset</b><p>${SS_TXT}</p></div></div>`)},
  setType(i){const e=S.active.ex[S.active.idx],cur=tyOf(e.sets[i]);
    sheet(`<h3>Set türü</h3><div class="lbl" style="margin:-6px 0 12px">${esc(e.name)} · set ${setLbl(e,i)}</div>${Object.entries(STY).map(([k,t])=>`<button class="styo ${cur===k?'on':''}" onclick="A.setTy(${i},'${k}')"><span class="styb" style="--c:${t.c}">${t.k||'1'}</span><div><b>${t.n}</b><small>${t.d}</small></div></button>`).join('')}`)},
  setTy(i,k){const e=S.active.ex[S.active.idx],s=e.sets[i];if(!s)return;if(k==='n')delete s.ty;else s.ty=k;
    if(k==='w'&&!s.done){const w0=e.sets.find(x=>tyOf(x)!=='w'),kg=num(w0&&w0.kg);if(kg>0&&(num(s.kg)==null||num(s.kg)>=kg))s.kg=kgRound(kg*.5,e.inc);if(!num(s.reps)||num(s.reps)<6)s.reps=8}
    if(k==='d'&&!s.done&&i>0){const p=num(e.sets[i-1].kg);if(p>0)s.kg=kgRound(p*.75,e.inc)}
    if(k==='w'){e.sets=[...e.sets.filter(x=>tyOf(x)==='w'),...e.sets.filter(x=>tyOf(x)!=='w')]}
    hold=null;save();closeSheet();render()},
  addWarm(){const e=S.active.ex[S.active.idx],w0=e.sets.find(x=>tyOf(x)!=='w'),kg=num(w0&&w0.kg),nw=e.sets.filter(x=>tyOf(x)==='w').length;
    e.sets.splice(nw,0,{kg:kg>0?kgRound(kg*(nw?.7:.5),e.inc):'',reps:nw?5:8,rpe:'',done:false,ty:'w'});hold=null;save();render();toast('Isınma seti eklendi')},
  ssSheet(){const a=S.active,i=a.idx,e=a.ex[i],g=ssOf(a.ex,i);
    sheet(`<h3>🔗 Süperset</h3><p class="lbl" style="line-height:1.55;margin:-4px 0 12px">${SS_TXT}</p>
     ${g?`<div class="gcat" style="margin-top:0">Grup ${e.ss}</div><div style="margin-bottom:10px;font-weight:600">${g.map(j=>esc(a.ex[j].name)).join(' + ')}</div><button class="btn ghost" style="margin-bottom:12px" onclick="A.ssOff()">Bu hareketi süpersetten çıkar</button>`:''}
     <div class="gcat"${g?'':' style="margin-top:0"'}>${esc(e.name)} ile eşleştir</div>
     <div class="swl">${a.ex.map((x,j)=>j===i||(g&&g.includes(j))?'':`<button onclick="A.ssPair(${j})">${bodyMini(x.name,x.muscle,26)}<span><b>${esc(x.name)}</b><small>${MUSCLES[x.muscle]||''}${x.ss?' · süperset '+x.ss:''}${x.sets.every(s=>s.done)?' · tamamlandı':''}</small></span></button>`).join('')||'<div class="lbl">Eşleştirilecek başka hareket yok.</div>'}</div>`)},
  ssPair(j){const a=S.active,cur=a.ex[a.idx],o=a.ex[j];if(!o)return;const used=new Set(a.ex.map(x=>x.ss).filter(Boolean));
    const L=cur.ss||o.ss||[...SSL].find(c=>!used.has(c));if(o.ss&&o.ss!==L)a.ex.forEach(x=>{if(x.ss===o.ss)x.ss=L});cur.ss=L;o.ss=L;
    const mem=a.ex.filter(x=>x.ss===L),first=a.ex.findIndex(x=>x.ss===L),rest=a.ex.filter(x=>x.ss!==L);rest.splice(Math.min(first,rest.length),0,...mem);
    a.ex=rest;ssNorm(a.ex);a.idx=a.ex.indexOf(cur);hold=null;save();closeSheet();render();toast('🔗 Süperset: '+mem.map(x=>x.name).join(' + '))},
  ssOff(){const a=S.active,cur=a.ex[a.idx];delete cur.ss;ssNorm(a.ex);save();closeSheet();render()},
  _ssAdv(){const a=S.active,g=ssOf(a.ex,a.idx);if(!g)return false;const pos=g.indexOf(a.idx);
    for(let k=pos+1;k<g.length;k++){const x=a.ex[g[k]];if(x.sets.some(s=>!s.done)){a.idx=g[k];hold=null;restEnd=0;toast('🔗 Dinlenmeden → '+x.name);return true}}
    const f=g.find(j=>a.ex[j].sets.some(s=>!s.done));if(f!=null){if(f!==a.idx){a.idx=f;hold=null}startRest();toast('Tur bitti · dinlen, sonra '+a.ex[f].name);return true}
    return false},
  /* ---- şablon güncelleme ---- */
  tplApply(sid){const s=S.sessions.find(x=>x.id===sid);if(!s||!s.tpl)return;const p=plan(s.tpl.pid);if(!p)return toast('Şablon bulunamadı');p.exercises=JSON.parse(JSON.stringify(s.tpl.out));s.tpl.applied=true;save();render(true);toast('📋 Şablon güncellendi')},
  tplUndo(sid){const s=S.sessions.find(x=>x.id===sid);if(!s||!s.tpl)return;const p=plan(s.tpl.pid);if(!p)return toast('Şablon bulunamadı');p.exercises=JSON.parse(JSON.stringify(s.tpl.prev));s.tpl.applied=false;save();render(true);toast('↩︎ Şablon eski hâline döndü')},
  autoTpl(v){S.settings.autoTpl=!!v;save();render(true);toast(v?'Şablonlar otomatik güncellenecek':'Otomatik güncelleme kapalı')},
  /* ---- kardiyo ---- */
  cardioAdd(){const n=new Date();A._cd={type:'run',day:0,time:z(n.getHours())+':'+z(n.getMinutes()),min:'',km:'',hr:'',rpe:5};A.cardioDraw()},
  cardioDraw(){const c=A._cd;sheet(`<h3>🏃 Kardiyo ekle</h3>
   <div class="ctyp">${CTYPES.map(([k,ic,n])=>`<button class="${c.type===k?'on':''}" onclick="A._cd.type='${k}';A.cardioDraw()"><span>${ic}</span>${n}</button>`).join('')}</div>
   <div class="grid2" style="margin-top:12px"><div class="fld"><label>Gün</label><select onchange="A._cd.day=+this.value">${[[0,'Bugün'],[1,'Dün'],[2,'2 gün önce'],[3,'3 gün önce']].map(([v,l])=>`<option value="${v}" ${c.day===v?'selected':''}>${l}</option>`).join('')}</select></div>
    <div class="fld"><label>Başlangıç saati</label><input type="time" value="${c.time}" oninput="A._cd.time=this.value"></div>
    <div class="fld"><label>Süre (dk)</label><input inputmode="numeric" value="${c.min}" oninput="A._cd.min=this.value" placeholder="ör. 30"></div>
    <div class="fld"><label>Mesafe (km)</label><input inputmode="decimal" value="${c.km}" oninput="A._cd.km=this.value" placeholder="isteğe bağlı"></div></div>
   <div class="fld"><label>Ortalama nabız (isteğe bağlı · maks. nabzın ~${hrMax()})</label><input inputmode="numeric" value="${c.hr}" oninput="A._cd.hr=this.value" placeholder="Saatin gösterdiği ortalama nabız"></div>
   <div class="gen-l" style="margin-top:4px">Ne kadar zordu? <small>(nabız girmezsen yük bundan hesaplanır)</small></div>
   <div class="rpeg">${[1,2,3,4,5,6,7,8,9,10].map(v=>`<button class="${c.rpe===v?'on':''}" onclick="A._cd.rpe=${v};A.cardioDraw()">${v}</button>`).join('')}</div><div class="lbl" style="text-align:center;margin:6px 0 12px">${c.rpe} · ${RPEL[c.rpe]}</div>
   <button class="btn" onclick="A.cardioSave()">Kaydet</button>`)},
  cardioSave(){const c=A._cd,m=num(c.min);if(!m||m<=0||m>600)return toast('Süreyi dakika olarak gir');const hr=num(c.hr);if(hr!=null&&(hr<50||hr>230))return toast('Nabız 50–230 arası olmalı');
    const x=new Date();x.setDate(x.getDate()-c.day);const it={id:uid(),date:dkey(x),time:c.time||'',type:c.type,min:Math.round(m),rpe:c.rpe};if(num(c.km))it.km=num(c.km);if(hr)it.hr=Math.round(hr);
    S.cardio=[...(S.cardio||[]),it];save();closeSheet();render(true);toast(`Kardiyo kaydedildi · yük ${Math.round(cLoad(it))}`)},
  cardioDel(id){ask('Bu kardiyo kaydı silinsin mi?',()=>{S.cardio=(S.cardio||[]).filter(c=>c.id!==id);save();closeSheet();render(true)},'Sil')},
  cardioInfo(){const cs=cardioStat(),[n,c,d]=CST[cs.st],L=(S.cardio||[]).filter(x=>dDiff(x.date,dkey())<28).sort((a,b)=>(b.date+(b.time||''))<(a.date+(a.time||''))?-1:1);
    sheet(`<h3>Kardiyo yükü</h3><span class="cst" style="--c:var(--txt)">${n}</span><p style="line-height:1.55;margin:10px 0">${d}</p>
     ${cs.st!=='none'?`<div class="cd-n" style="margin:4px 0 8px"><div><b>${cs.a7}</b><small>7 günlük yük</small></div><div><b>${cs.c28}</b><small>4 hafta ort./hafta</small></div><div><b>${cs.c28?fmt(r1(cs.ratio)):'—'}</b><small>oran</small></div></div>${cs.c28?acwrBar(cs.ratio):''}`:''}
     <div class="gcat">Nasıl hesaplanıyor?</div><div class="lbl" style="line-height:1.6">Her seansın yükü, ortalama nabız girdiysen nabız rezervine göre (TRIMP), girmediysen süre × zorluk (oturum RPE) ile hesaplanır. Son 7 günün toplamı, son 4 haftanın haftalık ortalamasıyla karşılaştırılır:<br>
      • <b>0,6 altı:</b> form kaybı<br>• <b>0,6–0,85:</b> koruma (yük artışından sonraysa zirve)<br>• <b>0,85–1,3:</b> verimli<br>• <b>1,3–1,5:</b> yorgun<br>• <b>1,5 üstü:</b> aşırı yüklenme<br>
      Odak: maks. nabzın %77 altı (RPE 1–4) düşük aerobik, %77–90 (RPE 5–7) yüksek aerobik, %90 üstü (RPE 8–10) anaerobik. Sağlıklı bir dağılımda kardiyonun çoğu düşük aerobik olur.</div>
     <div class="gcat">Son 4 hafta</div>${L.length?`<div>${L.map(cRow).join('')}</div>`:'<div class="lbl">Kayıt yok.</div>'}
     <button class="btn" style="margin-top:12px" onclick="A.close();A.cardioAdd()">+ Kardiyo ekle</button>`)},
  /* ---- enerji bankası ---- */
  energyInfo(d){const E=energyOf(d);if(!E)return;const mn=e=>Math.round(Math.min(...e.pts.map(p=>p[1]))),hist=lastNDays(dkey(),7).reverse().map(k=>({k,e:energyOf(k)}));
    sheet(`<h3>⚡ Enerji bankası</h3><p style="line-height:1.55;margin:-4px 0 12px">Vücudunun pili gibi düşün. Sabah, uyku ve toparlanma skoruna göre dolar. Gün içinde uyanık kaldıkça, antrenman ve kardiyo yaptıkça ve nabzın stresle yükseldikçe boşalır. Nabzın dinlenik seviyeye indiği sakin anlarda biraz şarj olur.</p>
     <div class="enchips"><span>Uyandığında <b>%${E.start}</b></span><span>${E.today?'Şimdi':'Gün sonu'} <b>%${E.cur}</b></span><span>En düşük <b>%${mn(E)}</b></span></div>
     <div class="gcat">Son 7 gün</div><div class="enh">${hist.map(({k,e})=>`<div><div class="enh-b">${e?`<i style="bottom:${mn(e)}%;height:${Math.max(2,e.start-mn(e))}%"></i>`:''}</div><small>${'PSÇPCCP'[new Date(k+'T12:00').getDay()]}</small><em>${e?e.start:'—'}</em></div>`).join('')}</div>
     <div class="lbl" style="margin-top:6px">Çubuk: sabahki başlangıçtan günün en düşük seviyesine kadar. Alttaki sayı sabah değeri.</div>
     <div class="gcat">Daha dolu bir pil için</div><div class="lbl" style="line-height:1.7">• 7–9 saat ve her gün benzer saatte uyu<br>• Ağır antrenman gününden sonra hafif bir gün koy<br>• Gün içinde 5–10 dk nefes ya da yürüyüş molası ver<br>• Öğleden sonra kafeini, akşam alkolü azalt</div>
     <div class="lbl" style="margin-top:12px">Tahmini bir göstergedir; Fitbit verisi geldikçe daha isabetli olur.</div>`)},
  /* ---- biyolojik yaş ---- */
  bioInfo(){const B=bioAge(),b=S.bio||{};if(B.need)return sheet(`<h3>🧬 Biyolojik yaş</h3><p class="lbl" style="line-height:1.5">Hesaplamak için ayarlardaki "Hedef & vücut" bölümüne yaşını gir.</p><button class="btn" onclick="A.close();A.go('settings')">Ayarlara git</button>`);
    const mx=Math.max(1,...B.f.map(x=>Math.abs(x.y)));
    sheet(`<h3>🧬 Biyolojik yaş</h3><div class="bio-h"><div><b>${fmt(B.bio)}</b><small>biyolojik</small></div><div><b>${B.age}</b><small>gerçek</small></div><div><b style="color:${B.diff<=0?'#3ee6a0':'#ff8a7a'}">${B.diff>0?'+':''}${fmt(B.diff)}</b><small>${B.diff<=0?'yıl daha genç':'yıl daha yaşlı'}</small></div></div>
     <div class="gcat">Neler etkiliyor?</div>${B.f.map(x=>`<div class="bio-f"><span>${x.ic}</span><div style="flex:1;min-width:0"><div class="row between"><b>${x.n}</b><em style="color:${x.y<=0?'#3ee6a0':'#ff8a7a'}">${x.y>0?'+':''}${fmt(x.y)} yıl</em></div><small>${x.val}</small>
       <div class="bio-bar"><i style="${x.y<=0?`right:50%;width:${Math.abs(x.y)/mx*50}%;background:#3ee6a0`:`left:50%;width:${x.y/mx*50}%;background:#ff8a7a`}"></i></div>${x.y>.2?`<small class="tipb">💡 ${x.tip}</small>`:''}</div></div>`).join('')}
     <div class="gcat">Ek bilgiler <small style="font-weight:500;color:var(--mut)">(daha isabetli tahmin için)</small></div>
     <div class="grid2"><div class="fld"><label>Sigara</label><select id="bi_s"><option value="">Belirtme</option><option value="0" ${b.smoke===false?'selected':''}>İçmiyorum</option><option value="1" ${b.smoke===true?'selected':''}>İçiyorum</option></select></div>
      <div class="fld"><label>Alkol (içki / hafta)</label><input id="bi_a" inputmode="numeric" value="${b.alc??''}"></div>
      <div class="fld"><label>Tansiyon (büyük, mmHg)</label><input id="bi_p" inputmode="numeric" value="${b.sys??''}" placeholder="ör. 120"></div>
      <div class="fld"><label>VO₂max (biliyorsan)</label><input id="bi_v" inputmode="decimal" value="${b.vo2??''}"></div></div>
     <button class="btn" onclick="A.bioSave()">Kaydet</button>
     <div class="lbl" style="margin-top:12px;line-height:1.5">Nabız, HRV, kondisyon, uyku, aktivite ve vücut ölçülerinin yaşına göre normlarla karşılaştırılmasıyla hesaplanan tahmini bir değerdir; tıbbi teşhis değildir. Son 30 günün ortalaması kullanılır.</div>`)},
  bioSave(){const g=id=>(document.getElementById(id)||{value:''}).value.trim(),s=g('bi_s');S.bio={...(S.bio||{}),smoke:s===''?null:s==='1',alc:g('bi_a')===''?null:num(g('bi_a')),sys:num(g('bi_p')),vo2:num(g('bi_v'))};save();render(true);A.bioInfo();toast('Kaydedildi')},
  /* ---- regl döngüsü ---- */
  cycStart(d){if(!d)return;const C=S.cycle;if(!(C.starts||[]).includes(d))C.starts=[...(C.starts||[]),d].sort();const lg={...(C.log||{})},cur=lg[d]||{};lg[d]={...cur,flow:cur.flow&&cur.flow!=='0'?cur.flow:'2'};C.log=lg;save();closeSheet();render(true);toast('🩸 Regl başlangıcı kaydedildi')},
  cycEnd(d){if(!d)return;const C=S.cycle,st=(C.starts||[]).filter(x=>x<=d).pop();if(!st)return toast('Önce başlangıç tarihini kaydet');C.ends={...(C.ends||{}),[st]:d};save();closeSheet();render(true);toast('Regl bitişi kaydedildi')},
  cycPick(){const C=S.cycle||{},st=(C.starts||[]).slice().sort().pop()||'',c=cyc(),act=c&&c.inPer,e=act?((C.ends||{})[st]||addD(st,c.plen-1)):'';
    sheet(`<h3>${act?'Regl tarihleri':'Tarih seç'}</h3>${act?`<div class="lbl" style="margin:-4px 0 10px">Başlangıç ${new Date(st+'T12:00').toLocaleDateString(LANG()==='en'?'en-GB':'tr-TR',{day:'numeric',month:'long'})}. Bitiş gününü seç; ileri bir tarih de seçebilirsin, sonra değiştirebilirsin.</div>
      <div class="fld"><label>Bitiş tarihi</label><input type="date" id="cy_e" value="${e}" min="${st}" max="${addD(st,14)}"></div><button class="btn" onclick="A.cycEnd(document.getElementById('cy_e').value)">Bitişi kaydet</button>
      <div class="gen-l" style="margin-top:16px">Yeni başlangıç</div>`:''}<div class="fld"><label>Başlangıç tarihi</label><input type="date" id="cy_d" value="${dkey()}" max="${dkey()}"></div>
      <div class="fld"><label>Bitiş tarihi (isteğe bağlı)</label><input type="date" id="cy_d2" value=""></div>
      <button class="btn${act?' ghost':''}" onclick="(()=>{const a=document.getElementById('cy_d').value,b=document.getElementById('cy_d2').value;if(!a)return;A.cycStart(a);if(b&&b>=a)A.cycEnd(b)})()">🩸 Regl başladı</button>`)},
  cycSet(){const C=S.cycle||(S.cycle={starts:[],ends:{},log:{}}),c=cyc()||{len:28,plen:5,ov:14,pms:5},F=C.cfg||{},man=F.auto===false;
    const v={len:F.len||c.len,plen:F.plen||c.plen,ov:F.ov||c.ov,pms:F.pms||c.pms};A._cy=v;
    const row=(k,l,mn,mx)=>`<div class="cyset-r${man?'':' off'}"><span>${l}</span><div class="cyset-st"><button ${man?'':'disabled'} onclick="A.cyAdj('${k}',-1,${mn},${mx})" aria-label="Azalt">−</button><b id="cyv_${k}">${v[k]} gün</b><button ${man?'':'disabled'} onclick="A.cyAdj('${k}',1,${mn},${mx})" aria-label="Artır">+</button></div></div>`;
    sheet(`<h3>Döngü ve ovulasyon</h3><div class="cyset-r"><span>Ortalamasını al<small>Kayıtlı döngülerine göre</small></span><button class="sw ${man?'':'on'}" role="switch" aria-checked="${!man}" onclick="A.cyAuto()"><i></i></button></div>
      ${row('len','Döngü uzunluğu',18,45)}${row('plen','Regl süresi',2,10)}${row('ov','Ovulasyon günü',8,30)}${row('pms','PMS uzunluğu',0,14)}
      <p class="lbl" style="line-height:1.5;margin-top:12px">"Ortalamasını al" açıkken döngü uzunluğu ve regl süresi kayıtlı döngülerinden hesaplanır, ovulasyon sonraki reglden 14 gün önce kabul edilir. Kapalıyken kendin ayarlarsın.</p>
      ${man?`<button class="btn" style="margin-top:6px" onclick="A.cySave()">Kaydet</button>`:''}`)},
  cyAuto(){const C=S.cycle,F={...(C.cfg||{})};F.auto=F.auto===false;if(F.auto===false){const c=cyc()||{len:28,plen:5,ov:14,pms:5};F.len=F.len||c.len;F.plen=F.plen||c.plen;F.ov=F.ov||c.ov;F.pms=F.pms??c.pms}C.cfg=F;save();render(true);A.cycSet()},
  cyAdj(k,d,mn,mx){const v=A._cy;v[k]=Math.max(mn,Math.min(mx,(+v[k]||0)+d));if(k==='len'&&v.ov>v.len-2)v.ov=v.len-2;const e=document.getElementById('cyv_'+k);if(e)e.textContent=v[k]+' gün';const o=document.getElementById('cyv_ov');if(o)o.textContent=v.ov+' gün'},
  cySave(){const C=S.cycle;C.cfg={...(C.cfg||{}),auto:false,...A._cy};save();closeSheet();render(true);toast('Döngü ayarları kaydedildi')},
  cycFlow(k){const C=S.cycle,td=dkey(),lg={...(C.log||{})};lg[td]={...(lg[td]||{}),flow:k};C.log=lg;
    if(k==='1'||k==='2'||k==='3'){const c=cyc(td);if((!c||(!c.inPer&&c.day>c.len-8))&&!(C.starts||[]).includes(td)){C.starts=[...(C.starts||[]),td].sort();toast('🩸 Yeni regl başlangıcı olarak kaydedildi')}}
    save();render(true)},
  cycSym(k){const C=S.cycle,td=dkey(),lg={...(C.log||{})},cur=lg[td]||{},s=cur.sym||[];lg[td]={...cur,sym:s.includes(k)?s.filter(x=>x!==k):[...s,k]};C.log=lg;save();render(true)},
  cycDel(s){ask('Bu regl kaydı silinsin mi?',()=>{const C=S.cycle;C.starts=(C.starts||[]).filter(x=>x!==s);const e={...(C.ends||{})};delete e[s];C.ends=e;save();render(true)},'Sil')},
  homeEd(){ui.homeEd=!ui.homeEd;render(true);if(ui.homeEd)setTimeout(()=>{const e=document.querySelector('.hed');if(e)e.scrollIntoView({behavior:'smooth',block:'start'})},60)},
  homeTog(k){const h=S.settings.homeHide||[];S.settings.homeHide=h.includes(k)?h.filter(x=>x!==k):[...h,k];save();render(true)},
  homeShowAll(){S.settings.homeHide=[];save();render(true)},
  /* ---- fotoğraftan kalori (AI) ---- */
  snap(){A._sn={imgs:[],urls:[],thumb:null,hint:'',busy:false};A.snapDraw()},
  snapFrom(inp,d){A._sn={imgs:[],urls:[],thumb:null,hint:'',busy:false,date:d};A.snapPick(inp)},
  async snapPhoto(id){const x=S.photos.find(p=>p.id===id);if(!x)return;try{const blob=await (await fetch(x.img)).blob();
    A._sn={imgs:[blob],urls:[x.img],thumb:x.img,hint:x.note||'',busy:false,date:x.date,photoId:id};A.snapDraw()}catch(e){toast('Fotoğraf açılamadı')}},

  snapDraw(){const s=A._sn;if(!s)return;
    sheet(`<h3>📸 Fotoğraftan kalori</h3>
     <div class="lbl" style="margin:-6px 0 12px;line-height:1.5">Yemeğin tamamı görünecek şekilde, tabağı <b>45° açıyla</b> çek. Yanına çatal, kaşık ya da elini koymak porsiyonu çok daha doğru tahmin ettirir. İkinci bir fotoğraf (tepeden) eklemek doğruluğu artırır.</div>
     <div class="sn-ph">${s.imgs.map((b,i)=>`<div class="sn-i" style="background-image:url(${s.urls[i]})"><button onclick="A.snapRm(${i})" aria-label="Kaldır">✕</button></div>`).join('')}
      ${s.imgs.length<2?`<label class="sn-add"><input type="file" accept="image/*" capture="environment" hidden onchange="A.snapPick(this)"><span>📷</span>${s.imgs.length?'2. açı (tepeden)':'Kamera'}</label>
      <label class="sn-add"><input type="file" accept="image/*" hidden onchange="A.snapPick(this)"><span>🖼️</span>Galeri</label>`:''}</div>
     <div class="fld" style="margin-top:12px"><label>Ek bilgi (isteğe bağlı ama doğruluğu artırır)</label><input id="sn_h" value="${esc(s.hint)}" oninput="A._sn.hint=this.value" placeholder="ör. zeytinyağlı, 2 dilim ekmek, yarısını yedim"></div>
     <div class="sn-tags">${['Yağda kızartma','Tereyağlı','Zeytinyağlı','Az yağlı / haşlama','Yarısını yedim','Ev yemeği','Restoran'].map(t=>`<button onclick="A.snapTag('${t}')">${t}</button>`).join('')}</div>
     <button class="btn" style="margin-top:12px" ${s.imgs.length&&!s.busy?'':'disabled'} onclick="A.snapRun()">${s.busy?'<span class="spin"></span> Analiz ediliyor…':'✨ Kaloriyi hesapla'}</button>
     ${CL.sample?'':`${noAI()}<ol class="fm-c" style="font-size:13px"><li>Aşağıdan talimatı kopyala.</li><li>Claude uygulamasında yeni sohbet aç, yemeğin fotoğrafını ekle ve talimatı yapıştır.</li><li>Claude'un verdiği cevabın tamamını kopyalayıp buraya yapıştır.</li></ol>
      <button class="btn ghost" onclick="A.snapCopy()">📋 Talimatı kopyala</button>
      <textarea id="sn_paste" class="sn-pa" placeholder="Claude'un cevabını buraya yapıştır"></textarea><button class="btn" style="margin-top:8px" onclick="A.snapImport()">Sonucu içe aktar</button>`}`)},
  async snapCopy(){const ok=await copyTxt(snapPrompt(A._sn||{imgs:[],hint:''}));toast(ok?'📋 Kopyalandı · Claude sohbetine fotoğrafla birlikte yapıştır':'Kopyalanamadı')},
  snapImport(){const s=A._sn,t=(document.getElementById('sn_paste')||{}).value||'';let v=null;try{const m=t.match(/\{[\s\S]*\}/);v=JSON.parse(m?m[0]:t)}catch(e){}
    if(!v||!Array.isArray(v.items)||!v.items.length)return toast('Cevap okunamadı; Claude\'un verdiği JSON\'u tamamen yapıştır');
    s.res={dish:String(v.dish||'Öğün'),notes:v.notes||'',tips:v.tips||'',items:v.items.map(snapItem).filter(Boolean)};if(!s.res.items.length)return toast('Bileşen bulunamadı');A.snapReview()},
  snapTag(t){const s=A._sn;s.hint=(s.hint?s.hint.replace(/[,\s]+$/,'')+', ':'')+t.toLocaleLowerCase('tr-TR');A.snapDraw()},
  snapRm(i){const s=A._sn;s.imgs.splice(i,1);s.urls.splice(i,1);if(!i)s.thumb=null;A.snapDraw()},
  async snapPick(inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;const s=A._sn;
    try{const im=await new Promise((res,rej)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{res(i);URL.revokeObjectURL(u)};i.onerror=rej;i.src=u});
      const cv=(M,q)=>{const sc=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c};
      const big=cv(1280),blob=await new Promise(r=>big.toBlob(r,'image/jpeg',.85));const small=cv(420).toDataURL('image/jpeg',.7);
      s.imgs.push(blob);s.urls=s.urls||[];s.urls.push(small);if(!s.thumb)s.thumb=small;A.snapDraw()}catch(e){toast('Fotoğraf açılamadı')}},
  async snapRun(){const s=A._sn;if(!s||!s.imgs.length||s.busy)return;if(!CL.sample)return toast('AI kullanılamıyor');
    let lim=null;try{lim=CL.sample.limits?await CL.sample.limits():null}catch(e){}
    if(lim&&lim.images===false)return toast('Bu görünümde AI fotoğraf okuyamıyor');
    s.busy=true;A.snapDraw();
    const prompt=snapPrompt(s);
    try{let v;const opt={modelTier:'complex',images:s.imgs};
      if(typeof CL.sample.json==='function')v=await CL.sample.json(prompt,opt);else{const r=await CL.sample(prompt,opt);const m=(r.text||'').match(/\{[\s\S]*\}/);v=JSON.parse(m?m[0]:r.text)}
      if(typeof v==='string')v=JSON.parse(v);
      if(!v||!Array.isArray(v.items)||!v.items.length){s.busy=false;A.snapDraw();return toast(v&&v.error?String(v.error).slice(0,90):'Yemek tanınamadı, daha net bir fotoğraf dene')}
      s.res={dish:String(v.dish||'Öğün'),notes:v.notes||'',tips:v.tips||'',items:v.items.map(snapItem).filter(Boolean)};s.busy=false;A.snapReview()}
    catch(e){s.busy=false;A.snapDraw();if(e&&e.code==='not_granted'){CL.sample=null}aiErr(e)}},
  snapReview(){const s=A._sn,R=s.res;if(!R)return;const T=snapTot(R.items);
    sheet(`<div class="sn-top">${s.thumb?`<div class="sn-th" style="background-image:url(${s.thumb})"></div>`:''}<div style="flex:1;min-width:0"><input class="sn-dn" value="${esc(R.dish)}" oninput="A._sn.res.dish=this.value"><div class="lbl">${R.items.length} bileşen · güven ${T.conf>=.75?'<b class="ok">yüksek</b>':T.conf>=.5?'<b style="color:#ffd23f">orta</b>':'<b class="warn">düşük</b>'}</div></div></div>
     <div class="sn-k"><div><b id="sn_k">${Math.round(T.k)}</b><small>kcal</small></div><span>aralık ${Math.round(T.lo)}–${Math.round(T.hi)}</span></div>
     <div class="sn-m" id="sn_m">${snapMac(T)}</div>
     <div class="gcat">Bileşenler <small style="font-weight:500;color:var(--mut)">· gramı düzelt, doğruluk en çok burada artar</small></div>
     ${R.items.map((x,i)=>`<div class="sn-r"><div class="row between"><b>${esc(x.name)}${x.db?' <i class="sn-db">✓ veritabanı</i>':''}${x.hidden?' <i class="sn-hd">tahmini</i>':''}</b><button class="x" onclick="A.snapDel(${i})" aria-label="Kaldır">✕</button></div>
       <div class="sn-g"><button onclick="A.snapG(${i},-10)">−</button><input inputmode="decimal" value="${Math.round(x.g)}" oninput="A.snapGv(${i},this.value)"><span>g</span><button onclick="A.snapG(${i},10)">+</button><em id="sn_e${i}">${Math.round(x.g*x.k/100)} kcal</em></div>
       <div class="lbl" style="font-size:11px">tahmin ${Math.round(x.lo)}–${Math.round(x.hi)} g · 100 g: ${Math.round(x.k)} kcal, P ${fmt(r1(x.p))} K ${fmt(r1(x.c))} Y ${fmt(r1(x.f))}</div></div>`).join('')}
     <div class="sn-add2"><input id="sn_an" placeholder="Eksik bir şey mi var? ör. Ayran"><input id="sn_ag" inputmode="decimal" placeholder="gram" style="width:80px"><button onclick="A.snapAdd()">+ Ekle</button></div>
     ${R.notes?`<div class="lbl" style="margin-top:10px;line-height:1.5">🍳 ${esc(R.notes)}</div>`:''}${R.tips?`<div class="lbl" style="margin-top:4px;line-height:1.5">💡 ${esc(R.tips)}</div>`:''}
     <div class="grid2" style="margin-top:14px"><button class="btn ghost" onclick="A.snapDraw()">↺ Yeniden çek</button><button class="btn" onclick="A.snapSave()">Öğüne ekle</button></div>`)},
  snapUpd(){const s=A._sn,T=snapTot(s.res.items),k=document.getElementById('sn_k'),m=document.getElementById('sn_m');if(k)k.textContent=Math.round(T.k);if(m)m.innerHTML=snapMac(T);
    s.res.items.forEach((x,i)=>{const e=document.getElementById('sn_e'+i);if(e)e.textContent=Math.round(x.g*x.k/100)+' kcal'})},
  snapGv(i,v){const x=A._sn.res.items[i],n=num(v);if(n!=null&&n>=0){x.g=n;x.ed=1;A.snapUpd()}},
  snapG(i,d){const x=A._sn.res.items[i];x.g=Math.max(0,Math.round(x.g+d));x.ed=1;A.snapReview()},
  snapDel(i){A._sn.res.items.splice(i,1);A.snapReview()},
  snapAdd(){const n=(document.getElementById('sn_an').value||'').trim(),g=num(document.getElementById('sn_ag').value);if(!n||!(g>0))return toast('Ad ve gram gir');
    const k=matchIng(n);const d=k&&ING()[k];if(!d||d.u!=='g'&&d.u!=='ml'){toast('Bu besin listede yok; en yakın kalori için elle ekleyebilirsin');return}
    const v=(d.st&&d.st[1])||d;A._sn.res.items.push({name:k,g,ai:g,lo:g,hi:g,k:v.k,p:v.p,c:v.c,f:v.f,conf:1,db:1,ed:1,add:1});A.snapReview()},
  snapSave(){const s=A._sn,R=s.res,T=snapTot(R.items);if(!R.items.length)return toast('En az bir bileşen olmalı');
    const d=s.date||(ui.view==='food'?ui.foodDay:dkey()),m={id:uid(),date:d,name:(R.dish||'Öğün').trim(),kcal:Math.round(T.k),p:r1(T.p),c:r1(T.c),f:r1(T.f),ai:{items:R.items.map(x=>({n:x.name,g:Math.round(x.g),ai:Math.round(x.ai)}))}};
    const ex=s.photoId&&S.photos.find(p=>p.id===s.photoId);if(ex){ex.mealId=m.id;if(!ex.note)ex.note=m.name;m.photoId=ex.id}
    else if(s.thumb){const n=new Date(),ph={id:uid(),date:d,time:z(n.getHours())+':'+z(n.getMinutes()),img:s.thumb,note:m.name,mealId:m.id};S.photos.push(ph);m.photoId=ph.id}
    const rs=R.items.filter(x=>x.ed&&!x.add&&x.ai>20&&x.g>0).map(x=>x.g/x.ai);if(rs.length){S.aiCal=[...(S.aiCal||[]),...rs].slice(-40)}
    S.meals.push(m);A._sn=null;save();closeSheet();render(true);toast(`✓ ${m.name} · ${m.kcal} kcal eklendi`)},
  obNext(){ui.ob=(ui.ob||0)+1;{const o=obD();if(OBS[ui.ob]==='done'&&!S.settings.theme&&o.sex==='f')S.settings.theme='pink'}render();if(OBS[ui.ob]==='name')setTimeout(()=>{const e=document.getElementById('ob_name');if(e)e.focus()},80)},
  obBack(){ui.ob=Math.max(0,(ui.ob||0)-1);render()},
  async obUser(){const o=obD(),v=(o.user||'').toLowerCase();const b=document.querySelector('.ob-go');if(b){b.disabled=true;b.textContent='Kontrol ediliyor…'}
    const r=await unClaim(v);if(r!==true){if(b){b.disabled=false;b.textContent='Devam'}const m=document.getElementById('ob_um');if(m){m.textContent=r;m.className='lbl warn'}return}A.obNext()},
  obSet(k,v,live){const o=obD();o[k]=v;if(k==='goal')o.pct=v==='cut'?0.75:v==='bulk'?(o.lvl>=3?0.15:0.25):null;
    if(live){const e=document.getElementById('ob_'+k);if(e)e.textContent=fmt(v);const b=document.querySelector('.ob-go');if(b)b.disabled=false;const t=document.querySelector('.ob-st input');if(t)t.value=v;return}
    render(true)},
  obStep(k,d,min,max){const o=obD(),c=num(o[k]);o[k]=Math.round(Math.max(min,Math.min(max,(c==null?Math.round((min+max)/2):c)+d))*10)/10;render(true)},
  setTheme(k){S.settings.theme=k;save();render(true)},
  obTheme(k){S.settings.theme=k;render(true)},
  obSkip(){S.onboarded=true;S.settings.ghIntro=1;save();render()},
  ghPerm(){const w=ghWk();if(!w)return toast(TT('Worker adresi yok','No worker URL'));const pop=window.open(w+'/gh/start?o='+encodeURIComponent(location.origin)+(S.settings.ghEmail?'&h='+encodeURIComponent(S.settings.ghEmail):''),'hmgh','width=500,height=650');if(!pop)return toast(TT('Açılır pencereye izin ver','Allow pop-ups'));
    const on=e=>{if(!e.data||!e.data.hmgh)return;removeEventListener('message',on);if(e.data.error){toast(TT('Bağlanamadı: ','Failed: ')+e.data.error);return}S.settings.ghRT=e.data.rt;S.settings.ghOk=1;GH_TOK={t:e.data.at,exp:Date.now()+(+e.data.exp||3600)*1000};try{localStorage.setItem('hm_ghtok',JSON.stringify(GH_TOK))}catch(_){}save();render(true);toast(TT('Kalıcı bağlantı kuruldu ✓','Permanent link set ✓'));ghSync(false).catch(()=>{})};addEventListener('message',on)},
  ghPermOff(){S.settings.ghRT=null;save();render(true);toast(TT('Kalıcı bağlantı kaldırıldı','Permanent link removed'))},
  giConnect(){S.settings.ghIntro=1;ui.giInfo=0;save();render();ghSync(true).then(r=>{if(r&&r.n)toast('Fitbit bağlandı ✓')}).catch(e=>toast('Bağlanılamadı: '+(e.message||e)))},
  giDemo(){S.settings.ghIntro=1;S.healthDemo=true;save();render()},giSkip(){S.settings.ghIntro=1;save();render()},
  obRestart(){A._ob=null;ui.ob=0;S.onboarded=false;save();render()},
  obFinish(){const o=obD(),pr=S.profile;Object.assign(pr,{name:o.name.trim(),sex:o.sex,age:o.age,height:o.height,weight:o.weight,goal:o.goal,pct:o.goal==='maintain'?null:o.pct,act:o.act});
    const r=calcTargets(pr);if(r){Object.assign(S.settings,{kcal:r.kcal,protein:r.protein,carbs:r.carbs,fat:r.fat});pr.applied=true}
    if(o.weight&&!S.body.some(b=>b.date===dkey()&&b.weight!=null)){const b=S.body.find(x=>x.date===dkey());if(b)b.weight=o.weight;else S.body.push({date:dkey(),weight:o.weight,sleep:null})}
    try{const g=gp();g.sex=o.sex;if(o.lvl)g.lvl=o.lvl;if(o.where==='home')g.eq=['bodyweight','band','dumbbell'];else if(o.where==='gym'||o.where==='both')g.eq=[...new Set([...g.eq,'dumbbell','barbell','cable','machine','bodyweight'])].filter(k=>EQ.some(x=>x[0]===k))}catch(e){}
    try{S.settings.loc=o.where==='home'?'home':'gym';const nd=o.days||3,DM={2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,3,4],6:[0,1,2,3,4,5]};
      S.wplan=null;const W=wpS();W.goal=o.goal==='cut'?'cut':o.goal==='bulk'?'bulk':'maint';W.days=DM[nd]||DM[3];
      S.tp={goal:o.goal==='cut'?'fat':o.goal==='bulk'?'muscle':'recomp',lvl:o.lvl||1,days:nd,dur:o.dur||60,focus:'bal',joint:false};const T=S.tp,L=tpBuild();
      T.ids=L.map(d=>{const p={id:uid(),tmpl:'tp',name:d.name,exercises:d.exercises};S.plans.push(p);return p.id});const t=new Date(dkey()+'T12:00');t.setDate(t.getDate()-((t.getDay()+6)%7));T.start=t.toISOString().slice(0,10);T.aw=null;tpApply(true)}catch(e){console.warn(e)}
    S.onboarded=true;A._ob=null;ui.ob=0;ui.view='home';save();render();toast(`Hoş geldin, ${pr.name} 👋 Programların hazır`)},
  /* ---- form ---- */
  formInfo(enc){const n=decodeURIComponent(enc),x=XBY[n];sheet(`<h3>${esc(n)}</h3>${x?`<div class="lbl" style="margin:-8px 0 10px">${esc(x[1])}</div>`:''}${formBlock(n)}`)},
  async formAI(enc){const n=decodeURIComponent(enc);toast('🤖 Form ipuçları hazırlanıyor…');
    try{const r=await askAI(`Sen deneyimli bir kuvvet antrenörüsün. "${n}" egzersizi için Türkçe, kısa ve uygulanabilir form ipuçları ver. Güvenliği önceliklendir.
SADECE JSON: {"cues":["3-4 madde, her biri en fazla 12 kelime, uygulama sırasına göre"],"err":["en sık 2 hata, kısa"]}`,{tier:'quick'});
      if(!r||!Array.isArray(r.cues)||!r.cues.length)throw{code:'bad'};S.formTips={...(S.formTips||{}),[n]:{cues:r.cues.slice(0,5).map(String),err:(r.err||[]).slice(0,3).map(String)}};save();
      const el=document.querySelector('#scrim .fmb');if(el)el.outerHTML=formBlock(n,1);else A.formInfo(enc)}catch(e){aiErr(e)}},
  /* ---- sık yenenler ---- */
  reMeal(enc){const k=mKey(decodeURIComponent(enc)),src=S.meals.filter(m=>mKey(m.name)===k).sort((a,b)=>a.date<b.date?-1:1).pop();if(!src)return;
    const d=ui.view==='food'?ui.foodDay:dkey(),m={id:uid(),date:d,name:src.name,kcal:src.kcal,p:src.p,c:src.c,f:src.f};if(src.items)m.items=src.items;if(src.lines)m.lines=JSON.parse(JSON.stringify(src.lines));
    S.meals.push(m);save();closeSheet();render(true);toast(`✓ ${m.name} · ${Math.round(m.kcal)} kcal eklendi`)},
  /* ---- akıllı öğün ---- */
  cook(tab){A._ck=A._ck||{type:(h=>h<11?'Kahvaltı':h<16?'Öğle yemeği':h<21?'Akşam yemeği':'Ara öğün')(new Date().getHours()),min:20,res:null,busy:false};if(tab)A._ck.tab=tab;A.cookDraw()},
  cookDraw(){const c=A._ck,P=S.pantry||[],d=ui.view==='food'?ui.foodDay:dkey(),t=dayTotals(d),st=S.settings,lk=Math.max(0,Math.round(st.kcal-t.kcal)),lp=Math.max(0,Math.round(st.protein-t.p));
    const tab=c.tab||'rec';
    const seg=`<div class="seg" style="margin:0 0 14px"><button class="${tab==='rec'?'on':''}" onclick="A._ck.tab='rec';A.cookDraw()">🍳 Tarif öner</button><button class="${tab==='ask'?'on':''}" onclick="A._ck.tab='ask';A.cookDraw()">💬 AI'ya sor</button></div>`;
    if(tab==='ask'){const ch=c.chat||[];return sheet(`<h3>🧑‍🍳 Ne pişirsem?</h3>${seg}
     <div class="lbl" style="margin:-4px 0 10px">Yemek, tarif, besin değeri, porsiyon ya da beslenme düzeninle ilgili her şeyi sor. Koç hedefini ve bugün yediklerini biliyor. Bugün kalan: <b>${lk} kcal · ${lp} g protein</b></div>
     <div class="fch" id="fch">${ch.length?ch.map(m=>`<div class="fcm ${m.role==='user'?'u':'a'}">${m.role==='user'?esc(m.content):fmtAI(m.content)}</div>`).join(''):`<div class="fcq">${['Antrenman sonrası ne yemeliyim?','Akşam 40 g protein nasıl alırım?','Gece acıkınca ne yiyebilirim?','Pilav mı bulgur mu daha iyi?','Evdeki malzemelerle hızlı bir kahvaltı?'].map(q=>`<button onclick="A.fAsk('${ja(q)}')">${q}</button>`).join('')}</div>`}
      ${c.asking?'<div class="fcm a"><span class="spin"></span> düşünüyor…</div>':''}</div>
     <div class="fci"><input id="fc_in" placeholder="Sorunu yaz…" onkeydown="if(event.key==='Enter')A.fAsk()"><button onclick="A.fAsk()" ${c.asking?'disabled':''}>➤</button></div>
     ${ch.length?`<button class="link" style="margin:8px auto 0" onclick="A._ck.chat=[];A.cookDraw()">Sohbeti temizle</button>`:''}
     ${!CL.sample?`${noAI()}<button class="btn ghost" onclick="A.fCopy()">📋 Sorumu bilgilerimle kopyala</button>`:''}`),setTimeout(()=>{const f=document.getElementById('fch');if(f)f.scrollTop=f.scrollHeight},30)}
    sheet(`<h3>🧑‍🍳 Ne pişirsem?</h3>${seg}<div class="lbl" style="margin:-6px 0 12px">Evdeki malzemeleri seç, koç kalan kalori ve proteinine uygun basit tarifler önersin. Bugün kalan: <b>${lk} kcal · ${lp} g protein</b></div>
     <div class="gen-l" style="margin-top:0">Evde ne var? <small>(${P.length} seçili)</small></div>
     <div class="pan">${[...new Set([...P,...PANTRY0])].map(x=>`<button class="${P.includes(x)?'on':''}" onclick="A.panTog('${ja(x)}')">${esc(x)}</button>`).join('')}</div>
     <div class="gw-add" style="margin-top:8px"><input id="pan_in" placeholder="Başka malzeme ekle (ör. kabak)" onkeydown="if(event.key==='Enter')A.panAdd()"><button onclick="A.panAdd()">+ Ekle</button></div>
     <div class="grid2" style="margin-top:12px"><div class="fld"><label>Öğün</label><select onchange="A._ck.type=this.value">${['Kahvaltı','Öğle yemeği','Akşam yemeği','Ara öğün','Antrenman sonrası'].map(x=>`<option ${c.type===x?'selected':''}>${x}</option>`).join('')}</select></div>
      <div class="fld"><label>En fazla süre</label><select onchange="A._ck.min=+this.value">${[10,20,30,45].map(v=>`<option value="${v}" ${c.min===v?'selected':''}>${v} dk</option>`).join('')}</select></div></div>
     <button class="btn" ${P.length&&!c.busy?'':'disabled'} onclick="A.cookRun()">${c.busy?'<span class="spin"></span> Tarifler hazırlanıyor…':'✨ Tarif öner'}</button>
     ${!CL.sample?`${noAI()}<button class="btn ghost" onclick="A.cookCopy()">📋 Tarif isteğini kopyala</button>`:''}
     ${c.res?c.res.map((r,i)=>`<div class="ckr"><div class="row between"><b>${esc(r.name)}</b><span class="lbl">⏱ ${r.time||'?'} dk</span></div>
       <div class="ck-m"><span><b>${Math.round(r.kcal)}</b> kcal</span><span>P ${Math.round(r.p)} g</span><span>K ${Math.round(r.c)} g</span><span>Y ${Math.round(r.f)} g</span></div>
       <div class="lbl" style="margin:6px 0">${(r.ingredients||[]).map(x=>`${esc(x.name)} ${x.amount?esc(String(x.amount)):''}`).join(' · ')}</div>
       <ol class="fm-c">${(r.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${r.why?`<div class="lbl" style="font-size:12px">💡 ${esc(r.why)}</div>`:''}
       <button class="btn ghost sm" style="margin-top:8px" onclick="A.cookAdd(${i})">+ Öğüne ekle</button></div>`).join(''):''}`)},
  async fCopy(){const q=((document.getElementById('fc_in')||{}).value||'').trim()||'Bugün ne yemeliyim?';const ok=await copyTxt(foodCtx()+'\n\nSoru: '+q);toast(ok?'📋 Kopyalandı · Claude sohbetine yapıştır':'Kopyalanamadı')},
  async cookCopy(){const c=A._ck,P=S.pantry||[];if(!P.length)return toast('Önce malzeme seç');const ok=await copyTxt(`${foodCtx()}\n\n${c.type} için sadece evdeki malzemelerle (${P.join(', ')}) en fazla ${c.min} dakikada hazırlanabilecek 3 basit tarif öner. Her tarif için malzeme miktarları, kalori ve makrolar, kısa adımlar yaz.`);toast(ok?'📋 Kopyalandı · Claude sohbetine yapıştır':'Kopyalanamadı')},
  async fAsk(enc){const c=A._ck;if(!c||c.asking)return;const el=document.getElementById('fc_in'),q=(enc?decodeURIComponent(enc):(el&&el.value||'')).trim();if(!q)return;
    if(!CL.sample)return toast('AI kullanılamıyor');c.chat=[...(c.chat||[]),{role:'user',content:q}];c.asking=true;A.cookDraw();
    const d=ui.view==='food'?ui.foodDay:dkey(),t=dayTotals(d),st=S.settings,pr=S.profile,ms=dayMeals(d);
    const ctx=foodCtx();
    const hist=c.chat.slice(-10).map((m,i,a)=>({role:m.role,content:i===0&&m.role==='user'?ctx+'\n\nSoru: '+m.content:m.content}));
    if(hist[0].role!=='user')hist.unshift({role:'user',content:ctx});
    try{const r=await CL.sample(hist,{modelTier:'default',cache:false});c.chat.push({role:'assistant',content:String(r&&r.text||'').trim()||'Cevap alınamadı.'})}
    catch(e){c.chat.pop();aiErr(e)}c.asking=false;if(document.getElementById('fch')||document.querySelector('#scrim'))A.cookDraw()},
  panTog(enc){const x=decodeURIComponent(enc),P=S.pantry||[];S.pantry=P.includes(x)?P.filter(y=>y!==x):[...P,x];save();A.cookDraw()},
  panAdd(){const el=document.getElementById('pan_in'),v=(el&&el.value||'').trim();if(!v)return;const x=v[0].toLocaleUpperCase('tr-TR')+v.slice(1);if(!(S.pantry||[]).includes(x))S.pantry=[...(S.pantry||[]),x];save();A.cookDraw()},
  async cookRun(){const c=A._ck;if(!CL.sample)return toast('AI kullanılamıyor');const P=S.pantry||[];if(!P.length)return toast('Önce malzeme seç');
    const d=ui.view==='food'?ui.foodDay:dkey(),t=dayTotals(d),st=S.settings,lk=Math.max(150,Math.round(st.kcal-t.kcal)),lp=Math.max(0,Math.round(st.protein-t.p));
    c.busy=true;A.cookDraw();
    try{const r=await askAI(`Sen pratik bir diyetisyen ve aşçısın. Kullanıcı için ${c.type.toLocaleLowerCase('tr-TR')} olarak 3 BASİT tarif öner.
Evdeki malzemeler (SADECE bunları kullan; tuz, karabiber, baharat, su ve az miktar sıvı yağ her evde var sayılabilir): ${P.join(', ')}.
Kısıtlar: hazırlık + pişirme en fazla ${c.min} dakika; malzeme miktarlarını gram/adet olarak ver. Hedef: tarif başına yaklaşık ${Math.min(lk,c.type==='Ara öğün'?400:900)} kcal'i geçmesin, mümkün olduğunca protein yüksek olsun (bugün kalan protein ${lp} g). Kullanıcının hedefi: ${GOALTXT()}.
Kalori ve makroları malzeme miktarlarından gerçekçi hesapla (kcal ≈ 4P+4K+9Y). Türkçe yaz, adımlar kısa olsun (3–5 adım).
SADECE JSON: {"recipes":[{"name":"","time":15,"kcal":0,"p":0,"c":0,"f":0,"ingredients":[{"name":"","amount":"100 g"}],"steps":[""],"why":"neden uygun, 1 kısa cümle"}]}`,{tier:'default'});
      const R=(r&&r.recipes||[]).filter(x=>x&&x.name).slice(0,3);if(!R.length)throw{code:'bad'};
      R.forEach(x=>{['kcal','p','c','f'].forEach(k=>x[k]=Math.max(0,+x[k]||0));const at=4*x.p+4*x.c+9*x.f;if(at>0&&Math.abs(x.kcal-at)/at>.2)x.kcal=Math.round(at)});c.res=R}
    catch(e){aiErr(e)}c.busy=false;A.cookDraw()},
  cookAdd(i){const r=A._ck&&A._ck.res&&A._ck.res[i];if(!r)return;const d=ui.view==='food'?ui.foodDay:dkey();
    S.meals.push({id:uid(),date:d,name:r.name,kcal:Math.round(r.kcal),p:r1(r.p),c:r1(r.c),f:r1(r.f),items:(r.ingredients||[]).map(x=>x.name+' '+(x.amount||'')).join(', ')});save();closeSheet();render(true);toast(`✓ ${r.name} eklendi`)},
  /* ---- hatırlatmalar ---- */
  remSet(k,f,v){const R=remCfg();R[k][f]=v;S.rem=R;save();render(true);if(f==='on'&&v&&window.Notification&&Notification.permission==='default')A.remPerm()},
  remDay(i){const R=remCfg(),d=R.train.days;R.train.days=d.includes(i)?d.filter(x=>x!==i):[...d,i];S.rem=R;save();render(true)},
  remMeal(i,v){const R=remCfg();R.meal.times[i]=v;S.rem=R;save()},
  async remPerm(){if(!window.Notification)return toast('Bu görünüm bildirim desteklemiyor');try{const p=await Notification.requestPermission();toast(p==='granted'?'🔔 Bildirim izni verildi':'Bildirim izni verilmedi; hatırlatmalar uygulama içinde görünecek')}catch(e){toast('Bildirim izni istenemedi')}render(true)},
  remTest(){remShow({id:'test',ic:'💧',t:'Su zamanı',m:'Örnek hatırlatma: zamanı gelince böyle görünür.',act:[['+250 ml',"A.drink('su',250)"]]})},
  /* ---- arkadaşlar ---- */
  unSheet(){sheet(`<h3>Kullanıcı adı</h3><div class="lbl" style="margin:-6px 0 12px">Arkadaşların seni bu adla bulur. 3–20 karakter: küçük harf, rakam, _ ve .</div>
    <div class="fld"><input id="un_in" value="${esc(S.profile.username||'')}" placeholder="ör. yusuf_23" autocapitalize="none" autocorrect="off"></div><button class="btn" onclick="A.unSave()">Kaydet</button>`)},
  async unSave(){const v=(document.getElementById('un_in').value||'').trim().toLowerCase().replace(/^@/,'');const r=await unClaim(v);if(r!==true)return toast(r);closeSheet();render(true);toast('@'+v+' kaydedildi')},
  async friendAdd(){const el=document.getElementById('fr_u'),v=(el&&el.value||'').trim().toLowerCase().replace(/^@/,'');if(!unOk(v))return toast('Geçerli bir kullanıcı adı yaz');if(v===S.profile.username)return toast('Bu senin kullanıcı adın 🙂');
    if(!SDB())return toast('Bulut bağlantısı yok');try{const q=await SDB().collection('social').where('username','==',v).get(),d=q.docs.find(x=>x.exists);if(!d)return toast('@'+v+' bulunamadı');
      const fid=sid(d.id);if(!fid)return toast('@'+v+' bulunamadı');if((S.friends||[]).some(f=>f.uid===fid))return toast('Zaten arkadaşın');S.friends=[...(S.friends||[]),{uid:fid,username:v}];SOC.friends[fid]=sanR(JSON.parse(JSON.stringify(d.data())));save();render(true);
      SOC.lastPush=null;socPush();const ok=await inboxSend(fid,{type:'req'});toast(ok?'✓ @'+v+' eklendi · istek gönderildi':'✓ @'+v+' eklendi (istek gönderilemedi: düzenleme izni gerekli)')}catch(e){toast('Aranamadı, tekrar dene')}},
  async reqOk(pid){const p=SOC.pokes.find(x=>x.id===pid);if(!p)return;if(!(S.friends||[]).some(f=>f.uid===p.from))S.friends=[...(S.friends||[]),{uid:p.from,username:p.fromUser}];save();
    await inboxSend(p.from,{type:'acc'});await A.pokeDel(pid);SOC.lastPush=null;socPush();socLoad(true);toast('✓ @'+p.fromUser+' arkadaşın oldu')},
  async avPick(inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;try{const im=await new Promise((res,rej)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{res(i);URL.revokeObjectURL(u)};i.onerror=rej;i.src=u});
    const z0=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=160;c.getContext('2d').drawImage(im,(im.width-z0)/2,(im.height-z0)/2,z0,z0,0,0,160,160);
    S.profile.photo=c.toDataURL('image/jpeg',.8);save();SOC.lastPush=null;socPush();render(true);toast('Profil fotoğrafı güncellendi')}catch(e){toast('Fotoğraf açılamadı')}},
  avDel(){delete S.profile.photo;save();SOC.lastPush=null;socPush();render(true)},
  friendDel(id){ask('Arkadaş listenden çıkarılsın mı?',()=>{S.friends=(S.friends||[]).filter(f=>f.uid!==id);save();render(true)},'Çıkar')},
  async poke(to,un,kind){const D=SDB();if(!D)return;const k0=PK.find(x=>x[0]===kind);if(!k0)return;const msg=k0[1]+' '+k0[2];const key=to+kind+Math.floor(Date.now()/36e5);SOC.sent=SOC.sent||{};if(SOC.sent[key])return toast('Bu hatırlatmayı az önce gönderdin');
    const ok=await inboxSend(to,{type:'poke',kind,msg:k0[2]});if(!ok)return toast(SOC.sendErr==='perm'?'Gönderilemedi: düzenleme izni gerekli':'Gönderilemedi, tekrar dene');SOC.sent[key]=1;buzz&&buzz();
    toast(TT('Mesaj gönderildi','Message sent'));return;
    const txt=`${msg} (${S.profile.name||'@'+S.profile.username} · HypeMode) ${APP_URL}`;
    sheet(`<h3>${k0[1]} Gönderildi</h3><div class="lbl" style="margin:-6px 0 12px;line-height:1.5">@${esc(un)} uygulamayı açınca görecek. Uygulama kapalıyken telefonuna bildirim gidemiyor; hemen haberi olsun istersen mesajla da gönder:</div>
     <div class="sugg" style="margin:0 0 12px">${esc(txt)}</div>
     <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener" onclick="A.close()">WhatsApp'tan gönder</a>
     ${navigator.share?`<button class="btn ghost" style="margin-top:8px" onclick="A.shareTxt(${JSON.stringify(txt).replace(/"/g,'&quot;')})">Başka uygulamayla paylaş</button>`:''}
     <label class="tchk" style="margin-top:12px"><input type="checkbox" onchange="S.social={...(S.social||{}),noWa:this.checked};save()"> Bunu bir daha sorma</label>`)},
  async shareTxt(t){try{await navigator.share({text:t})}catch(e){}A.close()},
  async reqResend(fid){const f=(S.friends||[]).find(x=>x.uid===fid);const ok=await inboxSend(fid,{type:'req'});toast(ok?'İstek tekrar gönderildi':'Gönderilemedi')},
  async pokeDel(id){try{await SDB().collection('pokes').doc(id).delete()}catch(e){}SOC.pokes=SOC.pokes.filter(p=>p.id!==id);render(true)},
  socRefresh(){socLoad(true);toast('Yenileniyor…')},
  socShare(v){S.social={...(S.social||{}),share:!!v};save();if(v)socPush();else socId().then(id=>{if(id&&SDB())SDB().collection('social').doc(id).set({uid:id,username:S.profile.username,name:S.profile.name||'',hidden:true,fr:(S.friends||[]).map(f=>f.uid).filter(Boolean),pp:(S.myPosts||[]).filter(x=>x.at>Date.now()-21*864e5).slice(0,30).map(x=>x.id),at:Date.now()}).catch(()=>{})});render(true)},
  /* ---- uyarlanabilir kalori ---- */
  adaptApply(){const A2=adaptTDEE();if(A2.need)return;const pr=S.profile,old=S.settings.kcal,p=Math.round((num(pr.weight)||latestW()||75)*(pr.goal==='cut'?2.2:pr.goal==='bulk'?2:1.8)),f=Math.round(Math.max(A2.kcal*.25/9,(latestW()||75)*.5));
    Object.assign(S.settings,{kcal:A2.kcal,protein:p,fat:f,carbs:Math.max(0,Math.round((A2.kcal-p*4-f*9)/4))});S.adaptLog=[...(S.adaptLog||[]),{d:dkey(),from:old,to:A2.kcal,tdee:A2.tdee}].slice(-20);save();render(true);toast(`Hedef ${old} → ${A2.kcal} kcal`)},
  adaptInfo(){const L=(S.adaptLog||[]).slice().reverse();sheet(`<h3>🎯 Uyarlanabilir kalori</h3><p style="line-height:1.55;margin:-4px 0 10px">Formüller (Mifflin-St Jeor) herkes için ortalama bir tahmin verir; gerçek harcaman %10–20 farklı olabilir. Bu özellik son 4 haftada <b>yediğin kaloriyi</b> ve <b>kilo eğilimini</b> karşılaştırarak senin gerçek harcamanı geriye doğru hesaplar:</p>
    <div class="sugg" style="margin:0 0 10px">harcama ≈ ortalama alınan kcal − (haftalık kilo değişimi × 7700 / 7)</div>
    <div class="lbl" style="line-height:1.55">• Günlük tartı su ve tuzla ±1 kg oynar; bu yüzden ham kilo yerine yumuşatılmış <b>eğilim çizgisi</b> kullanılır.<br>• En doğru sonuç için öğünlerini düzenli kaydet ve haftada 3–4 kez sabah aç karnına tartıl.<br>• Haftada bir bu karta bakıp önerilen hedefi uygulamak yeterli.</div>
    ${L.length?`<div class="gcat">Geçmiş ayarlamalar</div>${L.map(x=>`<div class="crow"><span class="cic">🎯</span><div style="flex:1"><b>${x.from} → ${x.to} kcal</b><small>${new Date(x.d+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'long'})} · harcama ${x.tdee}</small></div></div>`).join('')}`:''}`)},
  /* ---- uyku koçu ---- */
  sleepCoachInfo(){const c=sleepCoach(),SC=S.sleepCoach||{};sheet(`<h3>🌙 Uyku koçu</h3>
    <div class="slc-r" style="margin:4px 0 12px"><div><small>Yat</small><b>${c.bed}</b></div><i>→</i><div><small>Kalk</small><b>${c.wake}</b></div><div><small>İhtiyaç</small><b>${fmtMin(c.need)}</b></div></div>
    <div class="lbl" style="line-height:1.6">Temel ihtiyacın ${fmtMin(SC.need||480)}. ${c.why.length?'Bugün eklenenler:<br>• '+c.why.join('<br>• '):'Bugün ek ihtiyaç yok.'}<br>Uykuya dalma için ${c.lat} dk pay bırakıldı.</div>
    <div class="grid2" style="margin-top:12px"><div class="fld"><label>Kalkış saatim</label><input type="time" value="${SC.wake||c.wake}" onchange="A.scSet('wake',this.value)"></div>
     <div class="fld"><label>Temel uyku ihtiyacım</label><select onchange="A.scSet('need',+this.value)">${[420,450,480,510,540].map(v=>`<option value="${v}" ${(SC.need||480)===v?'selected':''}>${fmtMin(v)}</option>`).join('')}</select></div></div>
    <button class="btn" onclick="A.scRem()">🔔 ${c.bed}'dan 30 dk önce hatırlat</button>
    <div class="lbl" style="margin-top:10px;line-height:1.5">${c.real?'Fitbit verine (uyku borcu, HRV, toparlanma) göre hesaplandı.':'Şu an genel değerlerle çalışıyor. Fitbit Air bağlanınca kalkış saatin, uyku borcun ve toparlanman otomatik kullanılacak.'}</div>`)},
  scSet(k,v){S.sleepCoach={...(S.sleepCoach||{}),[k]:v};save();A.sleepCoachInfo();render(true)},
  scRem(){const c=sleepCoach(),m=((hm(c.bed)-30)%1440+1440)%1440,R=remCfg();R.sleep={...R.sleep,on:true,time:z(Math.floor(m/60))+':'+z(m%60)};S.rem=R;save();closeSheet();toast('🔔 Uyku hatırlatması '+R.sleep.time+' için kuruldu')},
  /* ---- ilerleme fotoğrafları ---- */
  async pcAdd(inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;try{const im=await new Promise((res,rej)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{res(i);URL.revokeObjectURL(u)};i.onerror=rej;i.src=u});
    const M=520,sc=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
    const n=new Date();S.photos.push({id:uid(),kind:'body',date:dkey(),time:z(n.getHours())+':'+z(n.getMinutes()),img:c.toDataURL('image/jpeg',.72),note:''});ui.pcSel=null;save();render(true);toast('İlerleme fotoğrafı eklendi')}catch(e){toast('Fotoğraf açılamadı')}},
  pcPick(id){const s=(ui.pcSel&&ui.pcSel.length===2?ui.pcSel:(()=>{const P=bodyPh();return P.length>=2?[P[0].id,P[P.length-1].id]:[]})()).filter(x=>x!==id);
    const n=s.length>=2?[s[1],id]:[...s,id];const P=bodyPh();n.sort((a,b)=>P.findIndex(p=>p.id===a)-P.findIndex(p=>p.id===b));ui.pcSel=n;render(true)},
  pcPos(v){ui.pcPos=+v;const b=document.querySelector('.cmp-b'),l=document.querySelector('.cmp-l');if(b)b.style.clipPath=`inset(0 0 0 ${v}%)`;if(l)l.style.left=v+'%'},
  pcDel(id){ask('Bu ilerleme fotoğrafı silinsin mi?',()=>{S.photos=S.photos.filter(p=>p.id!==id);ui.pcSel=null;save();render(true)},'Sil')},
  /* ---- arkadaş: beğeni, yorum, program kopyalama ---- */
  like(fid,un,sid){return A._lk(fid,sid,'👏 antrenmanını beğendi')},
  async _lk(fid,ref,msg){const k='like:'+ref;S.sentFx=S.sentFx||{};const cur=S.sentFx[k];tap();
    if(cur){const n={...S.sentFx};delete n[k];S.sentFx=n;save();render(true);if(typeof cur==='string'&&SDB())try{await SDB().collection('pokes').doc(cur).delete()}catch(e){}return}
    S.sentFx={...S.sentFx,[k]:1};save();render(true);
    const pid=await inboxSend(fid,{type:'like',ref,msg});
    if(pid){S.sentFx={...S.sentFx,[k]:pid};save()}else{const n={...S.sentFx};delete n[k];S.sentFx=n;save();render(true);
      toast(!SDB()?TT('Beğenmek için hesabına giriş yap','Sign in to like'):SOC.sendErr==='perm'?TT('Beğenilemedi: arkadaşın seni henüz eklememiş','Could not like: your friend has not added you yet'):TT('Gönderilemedi, bağlantını kontrol et','Could not send, check your connection'))}},
  async hrmConnect(){if(HMN()){HRM.nat={name:'Nabız',on:false};S.settings.hrmAuto=1;save();webkit.messageHandlers.hm.postMessage({cmd:'hrm',on:true});return}if(!navigator.bluetooth){sheet(`<h3>${TT('Canlı nabız','Live heart rate')}</h3><p class="lbl" style="line-height:1.5">${TT('iPhone ve iPad\'de Safari Bluetooth\'a izin vermiyor. Canlı nabız için HypeMode\'u ücretsiz <b>Bluefy</b> tarayıcısında aç (App Store). Android ve bilgisayarda Chrome ile çalışır.','Safari on iPhone/iPad has no Bluetooth access. Open HypeMode in the free Bluefy browser (App Store). Works in Chrome on Android and desktop.')}</p><p class="lbl" style="line-height:1.5">${TT('Bileklikte nabız yayınını aç: Google Health uygulaması → cihazın → <b>Nabzı paylaş</b>.','Turn on heart rate sharing on your band (Google Health app → device → Share heart rate).')}</p>`);return}
    try{const dev=await navigator.bluetooth.requestDevice({filters:[{services:['heart_rate']}]});HRM.dev=dev;
      dev.addEventListener('gattserverdisconnected',async()=>{if(HRM.dev!==dev)return;try{await A.hrmLink(dev)}catch(e){HRM.bpm=null;hrmPaint();render(true);toast(TT('Nabız bağlantısı koptu','HR disconnected'))}});
      await A.hrmLink(dev);render(true);toast(TT('Canlı nabız bağlandı','Live HR connected'))}
    catch(e){if(!/cancel/i.test(String(e&&(e.name+e.message))))toast(TT('Bağlanamadı: bileklikte nabız paylaşımını aç','Could not connect: enable HR sharing'))}},
  async hrmLink(dev){const sv=await dev.gatt.connect(),svc=await sv.getPrimaryService('heart_rate'),ch=await svc.getCharacteristic('heart_rate_measurement');await ch.startNotifications();
    ch.addEventListener('characteristicvaluechanged',e=>{const v=e.target.value,f=v.getUint8(0),b=f&1?v.getUint16(1,true):v.getUint8(1);if(b>25&&b<250){HRM.bpm=b;HRM.at=Date.now();
      if(S.active){const a=S.active;a.hrS=(a.hrS||0)+b;a.hrN=(a.hrN||0)+1;a.hrX=Math.max(a.hrX||0,b)}hrmPaint()}});hrmPaint()},
  drinkLog(d){const dr=dayDrinks(d);if(!dr.length){closeSheet();return}sheet(`<h3>${TT('Bugün içtiklerin','Today\'s drinks')}</h3><div>${dr.slice().reverse().map(x=>{const T=DRINK[x.type]||{n:x.type,e:'🥤',k:0,caf:0};const k=Math.round(T.k*x.ml/100),c=Math.round(T.caf*x.ml/100);
     return `<div class="meal" style="padding:10px 0"><div>${T.e} ${T.n} · ${x.ml} ml<small>${x.time}${k?` · ${k} kcal`:''}${c?` · ${c} mg kafein`:''}</small></div><button class="x" onclick="A.delDrink('${x.id}');setTimeout(()=>A.drinkLog('${d}'),30)" aria-label="Sil">✕</button></div>`}).join('')}</div>`,true)},
  hkPerm(){try{webkit.messageHandlers.hm.postMessage({cmd:'open',url:'x-apple-health://'})}catch(e){}},
  hrmOff(){if(HMN()){S.settings.hrmAuto=0;save()}if(HMN()&&HRM.nat){HRM.nat=null;try{webkit.messageHandlers.hm.postMessage({cmd:'hrm',on:false})}catch(e){}}const d=HRM.dev;HRM.dev=null;HRM.bpm=null;try{d&&d.gatt&&d.gatt.disconnect()}catch(e){}hrmPaint();render(true)},
  cmtDel(id,fid,ref){ask(TT('Yorum silinsin mi?','Delete comment?'),async()=>{try{await SDB().collection('pokes').doc(id).delete()}catch(e){}
    S.cmGone=[...(S.cmGone||[]),id].slice(-200);S.sentCm=(S.sentCm||[]).filter(c=>c.id!==id);SOC.pokes=(SOC.pokes||[]).filter(p=>p.id!==id);save();SOC.lastPush=null;socPush();closeSheet();render(true);toast(TT('Yorum silindi','Comment deleted'))},TT('Sil','Delete'))},
  cmtAll(fid,ref){const f=fid==='me'?{me:1}:{uid:fid,d:SOC.friends[fid]};const L=cmtsFor(f,ref);sheet(`<h3>${TT('Yorumlar','Comments')}</h3><div class="fp-cm" style="padding:0">${L.map(c=>cmP({...c,full:1},fid,ref)).join('')}</div>`)},
  cmtSheet(fid,un,sid,name){sheet(`<h3>💬 Yorum yaz</h3><div class="lbl" style="margin:-6px 0 10px">@${esc(un)} · ${esc(decodeURIComponent(name))}</div>
    <div class="cychips" style="margin-bottom:10px">${['Helal olsun! 💪','Canavar gibisin 🔥','Hacim uçmuş 🚀','Yarın ben de geliyorum 😤'].map(t=>`<button onclick="document.getElementById('cm_in').value='${t}'">${t}</button>`).join('')}</div>
    <div class="fci"><input id="cm_in" maxlength="140" placeholder="Yorumun…" onkeydown="if(event.key==='Enter')A.cmtSend('${fid}','${un}','${sid}')"><button onclick="A.cmtSend('${fid}','${un}','${sid}')">➤</button></div>`);setTimeout(()=>{const e=document.getElementById('cm_in');if(e)e.focus()},80)},
  async cmtSend(fid,un,sid){const t=((document.getElementById('cm_in')||{}).value||'').trim().slice(0,140);if(!t)return;const ok=await inboxSend(fid,{type:'cmt',ref:sid,msg:t});
    if(ok){S.sentCm=[...(S.sentCm||[]),{to:fid,ref:sid,msg:t,at:Date.now(),id:ok}].slice(-60);save();closeSheet();ui.frW=fid+sid;render(true);toast('💬 Yorum gönderildi')}else toast('Gönderilemedi')},
  frPlans(fid){const d=SOC.friends[fid];if(!d||!d.plans||!d.plans.length)return toast('Paylaşılan program yok');
    sheet(`<h3>📋 ${esc(d.name||'@'+d.username)} programları</h3><div class="lbl" style="margin:-6px 0 12px">Kopyaladığın program senin şablonlarına eklenir; kilolar senin geçmişine göre önerilir.</div>
     ${d.plans.map((p,i)=>`<div class="ckr"><div class="row between"><b>${esc(p.name)}</b><span class="lbl">${p.ex.length} hareket</span></div>
      <div class="lbl" style="margin:6px 0 8px;line-height:1.5">${p.ex.map(e=>`${esc(e.name)} <span style="opacity:.7">${e.sets}×${e.repMin}–${e.repMax}${e.t?' sn':''}</span>`).join(' · ')}</div>
      <button class="btn ghost sm" onclick="A.frCopy('${fid}',${i})">⤵︎ Kopyala</button></div>`).join('')}`)},
  frCopy(fid,i){const d=SOC.friends[fid],p=d&&d.plans&&d.plans[i];if(!p)return;const np={id:uid(),name:p.name+' ('+(d.name||d.username)+')',exercises:p.ex.map(e=>{const x=XBY[e.name];return{name:e.name,tr:e.tr||(x&&x[1])||'',muscle:e.muscle,sets:e.sets,repMin:e.repMin,repMax:e.repMax,inc:e.inc||2.5,...(e.t?{t:1}:{}),...(e.ss?{ss:e.ss}:{}),...(e.wu?{wu:e.wu}:{})}})};
    S.plans.push(np);save();closeSheet();render(true);toast('✓ "'+np.name+'" şablonlarına eklendi')},
  aiNo(){toast('AI raporu bu görünümde kullanılamıyor')},
  async rptCopy(){const ok=await copyTxt(A._rpt||'');toast(ok?'📋 Kopyalandı · Claude sohbetine yapıştır':'Kopyalanamadı')},
  stR(v){ui.stR=v;render(true)},
  jumpEx(i){S.active.idx=i;save();render()},
  usePrev(i){const a=S.active,e=a.ex[a.idx],lp=lastPerf(e.name),p=lp&&wix(e,i)>=0&&lp.sets[wix(e,i)];if(!p)return;const s=e.sets[i];s.kg=p.kg;s.reps=p.reps;save();render(true)},
  rpe(i,v){S.active.ex[S.active.idx].sets[i].rpe=v;save();render(true)},
  delSet(){const e=S.active.ex[S.active.idx];if(e.sets.length>1&&!e.sets[e.sets.length-1].done){e.sets.pop();save();render(true)}},
  plates(bar){const e=S.active.ex[S.active.idx],ns=e.sets.find(s=>!s.done)||e.sets[e.sets.length-1],kg=num(ns.kg)||0;bar=bar??(ui.bar??20);ui.bar=bar;
    const P=[[25,'#ff3b30'],[20,'#3f7bff'],[15,'#ffd166'],[10,'#3ee6a0'],[5,'#f3f3f5'],[2.5,'#ff5a3c'],[1.25,'#9b9ba4']];
    let side=(kg-bar)/2,out=[];if(side>0)P.forEach(([w,c])=>{while(side>=w-1e-6){out.push([w,c]);side=Math.round((side-w)*100)/100}});
    sheet(`<h3>🏋️ Plaka hesaplayıcı</h3><div class="lbl" style="margin:-6px 0 12px">Hedef: <b>${fmt(kg)} kg</b> · her tarafa takılacak plakalar</div>
     <div class="seg">${[20,15,10,0].map(b=>`<button class="${b===bar?'on':''}" onclick="A.plates(${b})">${b?b+' kg bar':'Bar yok'}</button>`).join('')}</div>
     ${kg<=bar?`<div class="card lbl">Ağırlık bar ağırlığından az ya da eşit.</div>`:`<div class="plv"><span class="pbar"></span>${out.map(([w,c])=>`<span class="pl" style="--c:${c};height:${40+w*3.2}px">${fmt(w)}</span>`).join('')}</div>
     <div class="lbl" style="text-align:center">Her taraf: <b>${out.map(x=>fmt(x[0])).join(' + ')||'—'}</b>${side>0.01?` · ${fmt(side*2)} kg tamamlanamadı`:''}</div>`}`)},
  exInfo(enc){const name=decodeURIComponent(enc),hist=[];S.sessions.forEach(s=>{const xs=s.sets.filter(x=>x.ex===name);if(xs.length)hist.push({s,xs})});
    const pe=S.plans.flatMap(p=>p.exercises).find(e=>e.name===name)||(S.active&&S.active.ex.find(e=>e.name===name));
    const timed=hist.some(h=>h.xs.some(x=>x.t))||(pe&&pe.t),bw=!timed&&hist.length&&hist.every(h=>h.xs.every(x=>!(x.kg>0)));
    const all=hist.flatMap(h=>h.xs),metric=x=>timed||bw?x.reps:e1rm(x.kg,x.reps),unit=timed?'sn':bw?'tekrar':'kg';
    const pts=hist.slice(-12).map(h=>({d:h.s.date,y:Math.max(...h.xs.map(metric))}));
    const tiles=timed?[['En uzun',Math.max(0,...all.map(x=>x.reps))+' sn'],['Toplam süre',mmss(all.reduce((a,x)=>a+x.reps,0)*1000)],['Antrenman',hist.length],['Set',all.length]]
      :bw?[['En çok tekrar',Math.max(0,...all.map(x=>x.reps))],['Toplam tekrar',all.reduce((a,x)=>a+x.reps,0)],['Antrenman',hist.length],['Set',all.length]]
      :[['Tahmini 1RM',fmt(r1(Math.max(0,...all.map(x=>e1rm(x.kg,x.reps)))))+' kg'],['En ağır',fmt(Math.max(0,...all.map(x=>x.kg)))+' kg'],['En iyi set',Math.round(Math.max(0,...all.map(x=>x.kg*x.reps))).toLocaleString('tr-TR')+' kg'],['Toplam tekrar',all.reduce((a,x)=>a+x.reps,0)]];
    const sg=pe?suggest(pe):null,mus=pe?MUSCLES[pe.muscle]:(all[0]&&MUSCLES[all[0].muscle]);
    const mk=pe?pe.muscle:(all[0]&&all[0].muscle)||(XBY[name]&&XBY[name][2]),trn=pe&&pe.tr||(XBY[name]&&XBY[name][1]),ml=mk?exMus(name,mk):{};
    sheet(`<h3>${esc(name)}</h3><div class="lbl" style="margin:-8px 0 12px">${trn?esc(trn)+' · ':''}${mus||MUSCLES[mk]||''} · ${hist.length} antrenman</div>
     ${mk?`<div class="exs-body">${bodySvg(ml,{cls:'lgb'})}<div class="exs-leg"><div><i class="p"></i>Ana kas: <b>${MUSCLES[mk]||''}</b></div>${Object.keys(ml).filter(k=>ml[k]<1).length?`<div><i class="s"></i>Yardımcı: ${Object.keys(ml).filter(k=>ml[k]<1).map(k=>MUSC2[k]||k).join(', ')}</div>`:''}</div></div>`:''}
     ${formBlock(name)}
     ${hist.length?`<div class="exs-grid">${tiles.map(t=>`<div><small>${t[0]}</small><b>${t[1]}</b></div>`).join('')}</div>
     <div class="exs-ch"><div class="lbl" style="margin-bottom:4px">${timed?'En uzun süre':bw?'En çok tekrar':'Tahmini 1RM'} · son ${pts.length} antrenman</div>${lineSvg(pts,unit)}</div>`:'<div class="card lbl">Bu egzersiz için henüz kayıt yok.</div>'}
     ${sg&&!S.active?`<div class="coachl" style="margin:12px 0"><span>🤖</span><div>Sonraki sefer: ${sg.why}</div></div>`:''}
     ${hist.length?`<div class="gcat">Geçmiş</div>${hist.slice().reverse().slice(0,10).map(h=>`<div class="exh"><span>${new Date(h.s.date).toLocaleDateString(LOC(),{day:'numeric',month:'short',year:'2-digit'})}</span><div>${h.xs.map(x=>`<i>${x.t?x.reps+' sn':(x.kg?fmt(x.kg)+'×':'')+x.reps}</i>`).join('')}</div></div>`).join('')}`:''}`)},
  homeOpen(g){if(g)ui.homeG=g;ui.view='homewk';closeSheet();render();scrollTo(0,0)},
  holdStart(){const a=S.active,e=a.ex[a.idx],i=e.sets.findIndex(s=>!s.done);if(i<0)return;
    const tg=num(e.sets[i].reps)||e.repMin;restEnd=0;restBar();hold={ai:a.idx,i,start:Date.now(),target:tg,inf:!!ui.tInf};beep(880,.08);render()},
  ftStart(){const a=S.active;if(!ui.tInf&&!(ui.ftg>0)){toast('Önce süre ekle (+5, +10…) ya da ∞ seç');return}
    hold={ai:a.idx,i:null,start:Date.now(),target:ui.ftg||0,inf:!!ui.tInf};beep(880,.08);render()},
  tmrToggle(){if(hold&&hold.i==null){hold=null}ui.tmrOpen=!ui.tmrOpen;render()},
  tAdd(n){const a=S.active,e=a.ex[a.idx];
    if(hold){const el=(Date.now()-hold.start)/1000;if(hold.inf){hold.inf=false;hold.target=Math.ceil(el)+n}else hold.target+=n;hold.bp=null}
    else if(e.t){const i=e.sets.findIndex(s=>!s.done);if(i<0)return;const s=e.sets[i];s.reps=(num(s.reps)||e.repMin)+n;ui.tInf=false;save()}
    else{ui.ftg=(ui.ftg||0)+n;ui.tInf=false}
    render()},
  tInf(){if(hold){const el=(Date.now()-hold.start)/1000;hold.inf=!hold.inf;if(!hold.inf)hold.target=Math.max(hold.target,Math.ceil(el)+5)}else ui.tInf=!ui.tInf;render()},
  tReset(){const a=S.active,e=a.ex[a.idx];
    if(hold){hold=null;toast('Sayaç sıfırlandı')}
    else if(e.t){const i=e.sets.findIndex(s=>!s.done);if(i>=0){e.sets[i].reps=e.repMin;save()}ui.tInf=false}
    else{ui.ftg=0;ui.tInf=false}
    render()},
  holdStop(full){if(!hold)return;const a=S.active,h=hold;hold=null;const el=Math.round((Date.now()-h.start)/1000);
    if(h.i==null){if(full){beep(1046,.25);buzz();toast('⏰ Süre doldu')}else toast(`⏱ ${tFmt(el)}${el>=60?'':' sn'}`);render();return}
    const e=a.ex[h.ai],s=e&&e.sets[h.i];if(!s||s.done){render();return}
    s.reps=full?h.target:h.inf?Math.max(1,el):Math.max(1,Math.min(el,h.target));if(s.kg===''||s.kg==null)s.kg=e.fix||0;
    if(full){beep(1046,.25);buzz();}
    toast(`✓ ${s.reps} sn kaydedildi`);A.toggleSet(h.i)},
  _homeEnsure(id,arch){let p=S.plans.find(x=>x.tmpl===id);
    if(!p){const t=homeTpl(id);p={id:uid(),tmpl:id,name:t.name,exercises:JSON.parse(JSON.stringify(t.exercises)),archived:!!arch};S.plans.push(p)}
    return p},
  homeAdd(id){const p=A._homeEnsure(id,false);p.archived=false;save();render(true);toast('Programlarına eklendi')},
  homeStart(id){const p=A._homeEnsure(id,true);save();A.openPlan(p.id,'homewk')},
  swapDB(k){const x=A._dbAlts[k],a=S.active,cur=a.ex[a.idx];if(!x)return;const g=genEx(x,gp().lvl,a.ex.map(e=>e.name));
    const e={...cur,name:g.name,tr:g.tr,muscle:g.muscle,note:g.note,alt:g.alt,alts:g.alts,eq:g.eq,repMin:g.repMin,repMax:g.repMax,inc:g.inc};delete e.t;delete e.fix;delete e.kgs;delete e.startKg;if(g.t)e.t=1;if(g.fix!=null)e.fix=g.fix;if(g.kgs){e.kgs=g.kgs;e.startKg=g.startKg}
    e.sugg=suggest(e);e.sets=cur.sets.map(s=>s.done?s:{kg:e.sugg.kg??'',reps:e.sugg.reps??'',rpe:'',done:false});a.ex[a.idx]=e;hold=null;save();closeSheet();render();toast('⇄ '+x[0])},
  altSwap(){const a=S.active,cur=a.ex[a.idx],x=altP(cur.alt);
    const e={...cur,name:x.en,tr:x.tr,alt:cur.name+'|'+(cur.tr||'')+(cur.t?'|t':''),note:'',altFix:cur.fix};
    e.fix=cur.altFix!==undefined?cur.altFix:/dumbbell/i.test(x.en)?undefined:0;if(e.fix===undefined)delete e.fix;if(e.altFix===undefined)delete e.altFix;
    if(x.t&&!cur.t){e.t=1;e.repMin=30;e.repMax=45}else if(!x.t&&cur.t){delete e.t;e.repMin=10;e.repMax=15}
    delete e.kgs;delete e.startKg;{const gx=XBY[x.en];if(gx&&!e.t){const g=genEx(gx,gp().lvl,[]);if(g.kgs){e.kgs=g.kgs;e.startKg=g.startKg;delete e.fix}else if(g.fix){e.fix=g.fix}}}
    if(hold&&hold.ai===a.idx)hold=null;
    e.sugg=suggest(e);e.sets=cur.sets.map(s=>s.done?s:{kg:e.sugg.kg??'',reps:e.sugg.reps??'',rpe:'',done:false});
    a.ex[a.idx]=e;save();render();toast('↔ '+(x.tr||x.en))},
  ghCid(v){S.settings.ghClient=v.trim();S.settings.ghOk=0;save()},
  async ghSync(){const el=()=>document.getElementById('ghlog');
    toast(S.settings.ghOk?'Senkronize ediliyor…':'Google Health\'a bağlanılıyor…');try{const r=await ghSync(true);if(el())el().innerHTML=r.log.join(' · ');if(!r.n)toast('Veri gelmedi; Ham veriyi indir ile bana gönder')}catch(e){if(el())el().textContent='✕ '+e.message;toast(e.message)}},
  ghOff(){ask('Google Health bağlantısı kesilsin mi? Daha önce aktarılan veriler kalır.',()=>{try{GH_TOK&&google.accounts.oauth2.revoke(GH_TOK.t)}catch(e){}GH_TOK=null;S.settings.ghOk=0;S.settings.ghRT=null;try{localStorage.removeItem('hm_ghtok')}catch(_){}save();render(true);toast('Bağlantı kesildi')})},
  ghRaw(){const b=new Blob([JSON.stringify({raw:GH_RAW,last:S.settings.ghLast,sample:Object.entries(S.health||{}).slice(-2)},null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='hypemode-google-health-ornek.json';a.click()},
  async wHR(){const a=S.active;if(!a)return;ui.wHR={...(ui.wHR||{}),busy:1};try{const s2=await wHRFetch(a.startedAt);ui.wHR={s:s2,at:Date.now()}}catch(e){ui.wHR={s:(ui.wHR||{}).s,at:Date.now(),err:e.message}}if(ui.view==='workout')render(true)},
  dynKcal(v){S.settings.dynKcal=!!v;save();render(true)},
  lockNext(){const a=S.active;if(a)A.cta()},
  drScroll(el){clearTimeout(A._drT);A._drT=setTimeout(()=>{const cs=[...el.children],m=el.scrollLeft+el.clientWidth/2;let b=0,bd=1e9;cs.forEach((c,i)=>{const dd=Math.abs(c.offsetLeft+c.offsetWidth/2-m);if(dd<bd){bd=dd;b=i}});const lp=+el.dataset.n>1,n=lp?+el.dataset.n:cs.length;if(ui._dr&&b%n!==ui._dr.i)drSet(b%n);const c=cs[b];if(c&&bd>2&&!el._tch)el.scrollTo({left:c.offsetLeft-(el.clientWidth-c.offsetWidth)/2,behavior:'smooth'});else if(lp&&!el._tch&&(b<n||b>=2*n)){const st=cs[1].offsetLeft-cs[0].offsetLeft;el.scrollLeft+=(b<n?n:-n)*st;drFx(el)}},110)},
  drPick(i,tap,raw){const D=ui._dr;if(i<0||!D||!D.M[0].C[i])return;if(tap&&D&&D.i===i)return A.drOpen();const el=document.getElementById('drCards');const n=el?+el.dataset.n:1;let ci=raw!=null?raw:i;if(el&&n>1&&raw==null){const m2=el.scrollLeft+el.clientWidth/2;let bd=1e9;[i,i+n,i+2*n].forEach(j=>{const k=el.children[j];if(!k)return;const dd=Math.abs(k.offsetLeft+k.offsetWidth/2-m2);if(dd<bd){bd=dd;ci=j}})}const c=el&&el.children[ci];if(c)el.scrollTo({left:c.offsetLeft-(el.clientWidth-c.offsetWidth)/2,behavior:'smooth'});drSet(i)},
  drOpen(){const D=ui._dr;if(!D)return;if(D.sub)return;{const k0=D.M[0].C[D.i];if(k0&&k0.noOpen&&(!D.mid||D.mid==='day')){const t=document.querySelector(`.htl[data-go="${k0.noOpen}"]`);if(t){t.scrollIntoView({behavior:'smooth',block:'center'});t.classList.remove('pulse');void t.offsetWidth;t.classList.add('pulse')}return}if(k0&&k0.go&&(!D.mid||D.mid==='day')){ui.hdDay=D.d;A.go(k0.go);window.scrollTo(0,0);return}}if(D.mid&&D.mid!=='day'){const k=D.M[0].C[D.i];if(k&&k.L&&k.L.length)sheet(`<h3>${k.ic||''} ${k.t}</h3><div class="dr-list all">${drList(k,1)}</div>`);return}const k=D.M[0].C[D.i];if(!k||!k.X||!k.X.length)return toast('Bu kategoride ayrıntı yok');ui.drSub=D.i;ui.drSi=undefined;ui.drDay=D.d;if(DRG)DRG.P=null;A.go('dday');window.scrollTo(0,0)},
  drBack(){ui.drSub=null;A.go('home')},
  swake(){const W=S.swake=S.swake||{on:false,win:30},P=swPlan(),v=(S.settings.vib)||'normal';
    sheet(`<h3>⏰ Akıllı uyandırma</h3><div class="sugg" style="margin:0 0 12px">Seni en geç saatine kadar, uyku döngünün bittiği (hafif uykuda olduğun) anda uyandırır. Döngün ${S.health&&Object.keys(S.health).length>=5?'verinden ölçüldü':'varsayılan'}: <b>${P.cyc} dk</b>.</div>
     <div class="swp"><div><small>Yatış</small><b>${hmT(P.bed)}</b></div><i>→</i><div><small>Uyandırma</small><b style="color:var(--a1)">${hmT(P.t)}</b><em>${P.inCycle?P.cy+'. döngü sonu':'döngü dışında'}</em></div><div><small>En geç</small><b>${hmT(P.to)}</b></div></div>
     ${P.inCycle?'':`<div class="lbl" style="margin-top:8px;line-height:1.5">Bu pencereye bir döngü sonu denk gelmiyor. Yatışını <b style="color:var(--txt)">${hmT(P.sb)}</b> yaparsan tam döngü sonunda (${hmT(P.to)}) kalkarsın. Ya da pencereyi 45 dk yap.</div>`}
     <label class="row" style="gap:10px;margin:12px 0;font-size:14px"><input type="checkbox" style="width:20px;height:20px" ${W.on?'checked':''} onchange="S_sw('on',this.checked)"> Akıllı uyandırma açık</label>
     <div class="grid2"><div class="fld"><label>En geç kalkış</label><input type="time" value="${W.to||sleepCoach().wake}" onchange="S_sw('to',this.value)"></div><div class="fld"><label>Pencere</label><select onchange="S_sw('win',this.value)">${[15,20,30,45].map(n=>`<option ${+W.win===n?'selected':''} value="${n}">${n} dk önce</option>`).join('')}</select></div></div>
     <div class="fld"><label>Planlanan yatış (boş: uyku koçu)</label><input type="time" value="${W.bed||''}" onchange="S_sw('bed',this.value)"></div>
     <div class="gen-l">Titreşim</div><div class="rpeg" style="grid-template-columns:repeat(4,1fr)">${[['off','Kapalı'],['light','Hafif'],['normal','Normal'],['strong','Güçlü']].map(([k,n])=>`<button class="${v===k?'on':''}" onclick="S_sw('vib','${k}')">${n}</button>`).join('')}</div>
     <button class="btn ghost" style="margin-top:10px" onclick="buzz()">Titreşimi dene</button>
     <details style="margin-top:14px"><summary class="lbl" style="cursor:pointer">⌚ Bileğinde titreşimle uyanmak için (Fitbit Air)</summary><div class="lbl" style="line-height:1.6;margin-top:8px">Google, saate alarm kurmayı uygulamalara açmıyor; bu yüzden saatin titreşimi Fitbit uygulamasından kurulur:<br>1. Fitbit uygulaması → Bugün → saat simgesi → <b>Alarmlar</b><br>2. Saati <b>${hmT(P.to)}</b> yap, <b>Smart Wake</b>'i aç (${P.win} dk pencere)<br>3. Saat seni ${hmT(P.from)}–${hmT(P.to)} arasında hafif uykuda titreşimle uyandırır.<br>HypeMode'daki alarm ise uygulama açıkken telefonda çalar (iPhone'da web uygulamaları titreşim yapamaz, ses çalar).</div></details>`)},
  setSec(k){ui.setSec=k;render();window.scrollTo(0,0)},
  frOpen(i){const f=(ui._F||[])[i];if(!f)return;const d=f.d;sheet(`${frBody(f)}<div class="grid2" style="margin-top:16px"><button class="btn ghost" onclick="__report('${esc(f.uid)}','${esc(f.username)}')">⚑ ${TT('Şikayet et','Report')}</button><button class="btn ghost" style="color:var(--bad)" onclick="__block('${esc(f.uid)}','${esc(f.username)}')">⛔ ${TT('Engelle','Block')}</button></div>`)},
  wgEdit(){const W=ui._wg;if(!W)return;S.settings.wg=S.settings.wg||{};const cfg=S.settings.wg[W.v]=S.settings.wg[W.v]||{h:[],o:[]};const ord=cfg.o.length?[...cfg.o.filter(k=>W.keys.includes(k)),...W.keys.filter(k=>!cfg.o.includes(k))]:W.keys.slice();
    sheet(`<h3>✎ Widget'ları düzenle</h3><div class="lbl" style="margin:-4px 0 10px">Göstermek istemediklerini kapat, okla sırala.</div><div class="sg" style="margin:0">${ord.map((k,i)=>`<div class="sr"><span class="sr-t"><b>${esc(k)}</b></span><button class="x" ${i?'':'disabled'} onclick="A.wgMv(${i},-1)">↑</button><button class="x" ${i<ord.length-1?'':'disabled'} onclick="A.wgMv(${i},1)">↓</button><input type="checkbox" class="swi" ${cfg.h.includes(k)?'':'checked'} onchange="A.wgTg('${ja(k)}',this.checked)"></div>`).join('')}</div><button class="btn ghost" style="margin-top:12px" onclick="S.settings.wg['${W.v}']={h:[],o:[]};save();closeSheet();render(true)">Varsayılana dön</button>`);A._wgOrd=ord},
  wgMv(i,dd){const W=ui._wg,o=A._wgOrd.slice(),j=i+dd;[o[i],o[j]]=[o[j],o[i]];S.settings.wg[W.v].o=o;save();render(true);A.wgEdit()},
  wgTg(k,on){k=decodeURIComponent(k);const c=S.settings.wg[ui._wg.v];c.h=c.h.filter(x=>x!==k);if(!on)c.h.push(k);save();render(true);A.wgEdit()},
  healthDemo(v){S.healthDemo=!!v;_demo=null;save();render(true)},
  healthFile(inp){const f=inp.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const j=JSON.parse(rd.result);const days=j.days||j;let n=0;
      (Array.isArray(days)?days:[]).forEach(x=>{if(x&&x.date){const{date,...rest}=x;S.health[date]={...(S.health[date]||{}),...rest};n++}});
      if(!n)throw 0;S.healthDemo=false;save();render(true);toast(`${n} günlük sağlık verisi yüklendi`)}catch(e){toast('Geçersiz sağlık dosyası')}};rd.readAsText(f);inp.value=''},
  healthClear(){ask('Yüklenen tüm Fitbit verileri silinsin mi?',()=>{S.health={};save();render(true)},'Sil')},
  hDay(n){const td=dkey(),cur=ui.hDay&&ui.hDay<=td?ui.hDay:td,x=new Date(cur+'T12:00');x.setDate(x.getDate()+n);const k=dkey(x);
    const min=new Date();min.setDate(min.getDate()-60);if(k>td||k<dkey(min))return;ui.hDay=k===td?null:k;render()},
  scrollTo(id){const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth',block:'start'});else toast('Bu gün için veri yok')},
  notes(d){const td=dkey(),sc=healthScores(d),isT=d===td,ms=isT?[...(sc?[stateTxt(sc)]:[]),...coachNotes()]:[dayHeadline(d,sc,strainOf(d))];
    sheet(`<h3>${isT?'Koç notları':'Günün özeti'}</h3>${ms.map(m=>`<div class="sugg" style="margin:0 0 10px">${m}</div>`).join('')}`)},
  stressInfo(){sheet(`<h3>Stres monitörü</h3><p class="lbl" style="line-height:1.6">0–3 arası tahmini bir değer: son nabız ölçümlerinin dinlenik nabzına göre ne kadar yüksek olduğuna ve HRV'nin normalinin altına inip inmediğine bakar. 0–1 düşük, 1–2 orta, 2–3 yüksek. Hareket hâlindeyken yüksek görünmesi normaldir. Tıbbi bir ölçüm değildir.</p>`)},
  quickAdd(){sheet(`<h3>Ekle</h3><div class="grid2">
    <button class="btn ghost" onclick="A.close();A.go('programs')">🏋️ Antrenman</button><button class="btn ghost" onclick="A.quick()">⚡ Hızlı antrenman</button><button class="btn ghost" onclick="A.close();A.snap()">📸 Fotoğraftan kalori</button>
    <button class="btn ghost" onclick="A.drink('su',250)">💧 +250 ml su</button><button class="btn ghost" onclick="A.close();A.go('food')">🍽️ Öğün / takviye</button>
    <button class="btn ghost" onclick="A.close();A.go('food');setTimeout(()=>A.scrollTo('bw'),300)">⚖️ Kilo / uyku</button>
    <button class="btn ghost" onclick="A.close();A.cardioAdd()">🏃 Kardiyo</button>${cycOn()?`<button class="btn ghost" onclick="A.close();A.go('cycle')">🌸 Döngü</button>`:''}</div>`)},
  dayReview(d){const sc=healthScores(d),stn=strainOf(d),t=dayTotals(d),st=S.settings,ss=trainedOn(d),fl=fluid(d),wg=waterGoal(d),sp=suppsFor(d),L=S.suppLog[d]||{},bw=S.body.find(b=>b.date===d);
    const row=(ic,l,v,sub)=>`<div class="ing" style="align-items:center"><span>${ic} ${l}${sub?`<br><small class="lbl">${sub}</small>`:''}</span><b style="text-align:right">${v}</b></div>`;
    sheet(`<h3>${d===dkey()?'Günün özeti':new Date(d+'T12:00').toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'})}</h3>
     ${sc?row('😴','Uyku',sc.sleep!=null?'%'+sc.sleep:'—',sc.x.sleep&&sc.x.sleep.min?fmtMin(sc.x.sleep.min):''):''}
     ${sc?row('💚','Toparlanma',sc.rec!=null?'%'+sc.rec:'—',sc.x.hrv!=null?`HRV ${sc.x.hrv} ms · nabız ${sc.x.rhr} bpm`:''):''}
     ${row('⚡','Yük',stn!=null?String(stn).replace('.',',')+' / 21':'—',HD()[d]&&HD()[d].steps!=null?`${HD()[d].steps.toLocaleString('tr-TR')} adım`:'')}
     ${row('🏋️','Antrenman',ss.length?ss.map(x=>esc(x.planName)).join(', '):'—',ss.length?`${ss.reduce((a,x)=>a+x.sets.length,0)} set · ${Math.round(ss.reduce((a,x)=>a+x.sets.reduce((b,y)=>b+y.kg*y.reps,0),0)).toLocaleString('tr-TR')} kg hacim`:'')}
     ${row('🍽️','Beslenme',`${Math.round(t.kcal)} / ${st.kcal} kcal`,`Protein ${Math.round(t.p)}/${st.protein} g · ${dayMeals(d).length} öğün`)}
     ${row('💧','Su',`${(fl/1000).toFixed(1).replace('.',',')} / ${(wg.goal/1000).toFixed(1).replace('.',',')} L`,'')}
     ${sp.length?row('💊','Takviye',`${sp.filter(x=>L[x.id]).length}/${sp.length}`,''):''}
     ${bw&&bw.weight!=null?row('⚖️','Kilo',fmt(bw.weight)+' kg',''):''}
     ${d===dkey()&&CL.sample?`<button class="btn" style="margin-top:14px" onclick="A.report('day')">🤖 AI günlük raporu</button>`:''}`)},
  stP(k){ui.stP=k;ui.stOff=0;render()},
  stOff(n){ui.stOff=Math.max(0,Math.min(ui.stP==='day'?60:ui.stP==='week'?26:12,ui.stOff+n));render()},
  resetAsk(){ask('Tüm veriler silinsin mi? Bu geri alınamaz.',()=>{S=defaults();save();A.go('home')},'Sil')}
};

/* ---------- countdown ---------- */
function countdown(p){
  const d=document.createElement('div');d.className='cd';const C=2*Math.PI*98;
  const first=S.active.ex[0];
  d.innerHTML=`<div class="k">${esc(p.name)} · ${p.exercises.length} egzersiz</div><div class="t">Antrenman başlıyor</div>
   <div class="ring"><svg aria-hidden="true" width="210" height="210"><circle cx="105" cy="105" r="98" stroke="rgba(255,255,255,.15)" stroke-width="4" fill="none" stroke-dasharray="2 8"/>
   <circle id="cdr" cx="105" cy="105" r="98" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="transition:stroke-dashoffset 1s linear"/></svg><div class="n" id="cdn">3</div></div>
   <div style="opacity:.8;font-size:14px">İlk egzersiz · ${esc(first.name)}, ${first.sets.length} set</div><div style="opacity:.5;font-size:12px;margin-top:40px">Atlamak için dokun</div>`;
  document.body.appendChild(d);
  let n=3;const done=()=>{clearInterval(t);d.remove();if(S.active){S.active.startedAt=Date.now();save()}ui.view='workout';render()};
  d.onclick=done;
  requestAnimationFrame(()=>{document.getElementById('cdr').style.strokeDashoffset=C*(2/3)});
  const t=setInterval(()=>{n--;if(n<=0)return done();const el=document.getElementById('cdn');if(!el){clearInterval(t);return}el.textContent=n;el.style.animation='none';void el.offsetWidth;el.style.animation='';
    document.getElementById('cdr').style.strokeDashoffset=C*((n-1)/3)},1000);
}

function quickSplash(){const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const o=document.createElement('div');o.className='qsp';o.innerHTML='<canvas></canvas>';document.body.appendChild(o);const end=()=>{o.classList.add('out');setTimeout(()=>o.remove(),420)};
  const go=()=>{const cv=o.querySelector('canvas'),dpr=Math.min(2,devicePixelRatio||1),W=innerWidth,H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;const x=cv.getContext('2d');x.scale(dpr,dpr);
  const TXT='HYPEMODE';let fs=Math.min(64,W*.11);const font=()=>`800 ${fs}px Unbounded,Inter,sans-serif`;x.font=font();while(x.measureText(TXT).width>W*.78&&fs>18){fs-=2;x.font=font()}
  const tw=x.measureText(TXT).width,cx=W/2,cy=H/2,L=cx-tw/2;
  const drawText=(rev,glow,a)=>{x.save();x.globalCompositeOperation='source-over';x.beginPath();x.rect(0,0,rev>=1?W:L+tw*rev+fs*.2,H);x.clip();x.font=font();x.textAlign='center';x.textBaseline='middle';
    if(glow>0){x.shadowColor=`rgba(255,240,220,${.9*glow})`;x.shadowBlur=28*glow+6;x.fillStyle=`rgba(255,255,255,${a})`;x.fillText(TXT,cx,cy);x.shadowBlur=60*glow;x.fillText(TXT,cx,cy)}
    x.shadowBlur=0;x.fillStyle=`rgba(255,255,255,${a})`;x.fillText(TXT,cx,cy);x.restore()};
  if(RM){x.fillStyle='#000';x.fillRect(0,0,W,H);drawText(1,.4,1);setTimeout(end,700);return}
  // metin pikselleri
  const off=document.createElement('canvas');off.width=W;off.height=H;const ox=off.getContext('2d');ox.font=font();ox.textAlign='center';ox.textBaseline='middle';ox.fillStyle='#fff';ox.fillText(TXT,cx,cy);
  const dt=ox.getImageData(0,0,W,H).data,T=[];for(let yy=Math.floor(cy-fs);yy<cy+fs;yy+=2)for(let xx=Math.floor(L-4);xx<L+tw+4;xx+=2)if(dt[(yy*W+xx)*4+3]>110)T.push([xx,yy]);
  const N=Math.min(7000,Math.max(2500,T.length*2)),R0=Math.min(W,H),ARMS=5,P=new Array(N);
  for(let i=0;i<N;i++){const t=T[(i*7919)%T.length],arm=i%ARMS,u=Math.random();
    P[i]={tx:t[0]+(Math.random()-.5)*1.5,ty:t[1]+(Math.random()-.5)*1.5,a0:arm/ARMS*6.283+u*1.1+Math.random()*.25,r0:R0*(.12+u*.55)*(.8+Math.random()*.4),sp:.9+Math.random()*.8,dl:.42+.33*((t[0]-L)/tw)+Math.random()*.06,h:Math.random()};}
  const t0=performance.now(),D=1900;let last=t0;
  const f=now=>{const k=(now-t0)/D;x.globalCompositeOperation='source-over';x.fillStyle=k<.7?'rgba(0,0,0,.22)':'rgba(0,0,0,.35)';x.fillRect(0,0,W,H);x.globalCompositeOperation='lighter';
    const fade=Math.min(1,k/.18);
    for(const p of P){const q=Math.max(0,Math.min(1,(k-p.dl)/.2)),e=q*q*(3-2*q),sw=Math.min(k,p.dl);
      const th=p.a0+sw*p.sp*5.2+Math.sin(p.h*6.283+k*3)*.15,r=p.r0*(1-.62*Math.min(1,sw/p.dl))+Math.sin(th*2+p.h*9)*R0*.015,
        sx=cx+Math.cos(th)*r*1.1,sy=cy+Math.sin(th)*r*.62,px=sx+(p.tx-sx)*e,py=sy+(p.ty-sy)*e;
      if(e>=1&&k>p.dl+.35)continue;
      const heat=Math.min(1,k*1.25+e*.4),hue=6+heat*44,lt=32+heat*30+e*30,al=(.18+.35*heat)*fade*(1-.6*Math.max(0,(k-p.dl-.15)/.25));
      x.fillStyle=`hsla(${hue},100%,${Math.min(96,lt)}%,${Math.max(0,al)})`;x.fillRect(px,py,1.3,1.3)}
    const rv=Math.max(0,Math.min(1,(k-.55)/.33)),gl=k<.75?Math.min(1,(k-.5)/.25):Math.max(0,1-(k-.75)/.45);
    if(rv>0)drawText(rv,Math.max(0,gl),Math.min(1,rv*1.4));
    if(k<1.35)requestAnimationFrame(f);else{x.globalCompositeOperation='source-over';x.fillStyle='#000';x.fillRect(0,0,W,H);drawText(1,0,1);setTimeout(end,350)}};
  x.fillStyle='#000';x.fillRect(0,0,W,H);requestAnimationFrame(f)};
  (document.fonts&&document.fonts.load?Promise.race([document.fonts.load('800 64px Unbounded'),new Promise(r=>setTimeout(r,350))]).catch(()=>{}):Promise.resolve()).then(go)}
async function splash(){if(!location.hash.includes('splash')){let long=true;try{const L=+localStorage.getItem('hm-open')||0,now=Date.now();long=!L||dkey(new Date(L))!==dkey(new Date(now))||now-L>3*36e5;localStorage.setItem('hm-open',String(now))}catch(_){}
  if(!long)return quickSplash()}const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{applyTheme()}catch(_){}
  const light=document.documentElement.dataset.mode==='light',cs=getComputedStyle(document.documentElement),acc=(cs.getPropertyValue('--a1').trim()||'#ff3b30'),th=(S.settings&&S.settings.theme)||'red',neutral=th==='night'||th==='mono';
  const phone=innerWidth<700,nm=S.profile&&S.profile.name?esc(S.profile.name.split(' ')[0]):'',h=new Date().getHours();
  const greet=TT(h<5?'İyi geceler':h<12?'Günaydın':h<18?'İyi günler':'İyi akşamlar',h<5?'Good night':h<12?'Good morning':h<18?'Good afternoon':'Good evening');
  const d=document.createElement('div');d.className='dsp'+(light?' lt':'')+(phone?' ph':'');d.setAttribute('data-noi18n','');
  d.innerHTML=`<canvas class="dsp-cv"></canvas><div class="dsp-sh"></div><div class="dsp-card"><div class="dsp-grid"></div>
    <div class="dsp-brand">${HM_LOGO(phone?64:54)}<span>${[...'HYPEMODE'].map((c,i)=>`<i style="--i:${i}">${c}</i>`).join('')}</span></div>
    <h1 class="dsp-h">${TT('Kişisel koçun','Your personal coach')}</h1>
    <p class="dsp-p">${TT('Antrenman, uyku ve toparlanma tek yerde.','Training, sleep and recovery in one place.')}</p>
    <button class="dsp-go">${nm?`${greet}, ${nm} →`:TT('Başla →','Get started →')}</button>${!S.onboarded&&!window.HM_DEMO?`<button class="dsp-demo">${TT('Kayıt olmadan dene (demo)','Try without signing up (demo)')}</button>`:''}
    <div class="dsp-f"><span>${TT('Fitbit Air ile en iyi sonuç','Best with Fitbit Air')}</span><span>v1.0</span></div></div>`;
  document.body.appendChild(d);let done=false,raf=0;
  const end=()=>{if(done)return;done=true;d.classList.add('out');$app.classList.add('boot');setTimeout(()=>{cancelAnimationFrame(raf);d.remove()},700);setTimeout(()=>$app.classList.remove('boot'),1400)};
  d.querySelector('.dsp-go').onclick=end;{const dm=d.querySelector('.dsp-demo');if(dm)dm.onclick=e=>{e.stopPropagation();end();setTimeout(()=>A.demoStart(),50)}}let T=setTimeout(end,RM?1200:8400);
  requestAnimationFrame(()=>d.classList.add('on'));if(RM)return;
  try{const cv=d.querySelector('canvas'),ctx=cv.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1);let W,H;const rs=()=>{W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)};rs();addEventListener('resize',rs);
    const hex=c=>{c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');const n=parseInt(c,16);return[n>>16&255,n>>8&255,n&255]},A1=light?[228,40,30]:[255,62,42],A2=light?[240,120,20]:[255,168,72],G=light?[20,170,110]:[110,240,170],DIM=light?[60,60,70]:[255,245,240];
    const NT=phone?96:132,ND=phone?12:15,P=[];for(let i=0;i<NT;i++)for(let j=0;j<ND;j++){const r=.78+j/(ND-1)*.22;P.push({a:i/NT*Math.PI*2,r,j,i,sx:(Math.random()-.5)*2.6,sy:(Math.random()-.5)*2.6,sz:Math.random()*2-1,dl:Math.random()*.6+(i%7)*.02,gl:(i%17===3||i%23===11)&&Math.random()<.7,hv:.35+.65*Math.abs(Math.sin(i*1.7))})}
    const LT=2.7,LP=[],LS=160;let LR=0,LST=1.6;(async()=>{try{const oc=document.createElement('canvas');oc.width=oc.height=LS;const o=oc.getContext('2d');
      const g=o.createLinearGradient(LS,0,0,LS);g.addColorStop(0,'#ffc24a');g.addColorStop(.45,'#ff6a2a');g.addColorStop(1,'#d81f2a');o.fillStyle=g;o.beginPath();(o.roundRect?o.roundRect(8,8,LS-16,LS-16,38):o.rect(8,8,LS-16,LS-16));o.fill();
      const sv=HM_LOGO(100).replace(/url\(#gil\)/g,'#fff').replace(/#0b0b0e/g,'#000').replace(/ filter="url\(#gis\)"/,'');const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(sv.replace('<svg aria-hidden="true" ','<svg xmlns="http://www.w3.org/2000/svg" '));await im.decode();
      const m=document.createElement('canvas');m.width=m.height=LS;const mc=m.getContext('2d');mc.drawImage(im,14,14,LS-28,LS-28);const md=mc.getImageData(0,0,LS,LS).data,od=o.getImageData(0,0,LS,LS).data,st=phone?2:1.6;
      LST=st;for(let y=0;y<LS;y+=st)for(let x=0;x<LS;x+=st){const k=((y|0)*LS+(x|0))*4;if(od[k+3]<128)continue;const ma=md[k+3]/255,mw=ma*(md[k]/255),ink=md[k]<60&&ma>.5;if(ink)continue;
        const c=mw>.4?[255,248,240]:light?[Math.round(od[k]*.92),Math.round(od[k+1]*.8),Math.round(od[k+2]*.8)]:[od[k],od[k+1],od[k+2]],dx=x-LS/2,dy=y-LS/2;LP.push({x:dx,y:dy,c,w:mw>.4,r:Math.hypot(dx,dy),th:Math.atan2(dy,dx),sx:(Math.random()-.5)*90,sy:(Math.random()-.5)*90,dl:Math.random()*.35,v:.6+Math.random()*.8,b:.75+Math.random()*.25,s:mw>.4?Math.random()*.55:.15+Math.pow(Math.random(),.8)*.85,arm:Math.random()<.5?0:Math.PI,jt:(Math.random()+Math.random()+Math.random()-1.5)})}
      LR=1}catch(_){LR=-1}})();
    const drawLogo=(t,W,H)=>{if(LR!==1||t>LT+.6)return;const st=LST;const sc=Math.min(W,H)*(phone?.36:.26)/LS,cx=W/2,cy=H/2;ctx.globalCompositeOperation=light?'source-over':'lighter';
      const vt=Math.max(0,(t-1.75)/1.35),vk=vt*vt;for(const p of LP){const ap=Math.min(1,Math.max(0,(t-.15-p.dl)/.85)),e=1-Math.pow(1-ap,3);if(e<=0)continue;let X,Y,al;
        if(vt<=0){X=p.x+p.sx*(1-e)*(1-e);Y=p.y+p.sy*(1-e)*(1-e);al=e*p.b}else{const m0=Math.min(1,vt*1.5),m=m0*m0*(3-2*m0),to=p.th+vt*2.5,ox=Math.cos(to)*p.r,oy=Math.sin(to)*p.r,Rs=LS*(.12+p.s*(.75+vt*2.6))*(1+p.jt*.22),ts=p.arm+p.s*3.4+vt*3.6+p.jt*.6*(.4+p.s),sx2=Math.cos(ts)*Rs,sy2=Math.sin(ts)*Rs*.86;X=ox+(sx2-ox)*m;Y=oy+(sy2-oy)*m;al=p.b*Math.pow(Math.max(0,1-vt),.8)*(p.w?1:.85)}
        const sz=light?(vt>0?(p.w?2.1:1.9)*Math.max(1,sc*.9)*(1-vt*.3):st*sc*1.12):(p.w?1.9:1.6)*Math.max(1,sc*.85)*(vt>0?1-vt*.4:1);ctx.globalAlpha=Math.min(1,light?(vt>0?al*1.5:Math.min(1,al*1.3)):al);ctx.fillStyle=light&&p.w&&vt>0?'rgb(40,40,48)':`rgb(${p.c})`;ctx.fillRect(cx+X*sc-sz/2,cy+Y*sc-sz/2,sz,sz)}
      ctx.globalAlpha=1};
    let rot=0,vel=0,tilt=.22,tx=0,ty=0,ptx=0,pty=0,drag=null,rings=[],lastTick=0;const t0=performance.now();
    const lay=()=>phone?{u:W*1.28,cx:W/2,cy:70+W*1.22}:{u:W>=900?Math.min(W*.42,H*.74):Math.min(W*.78,H*.62),cx:W/2,cy:H/2};
    d.addEventListener('pointermove',e=>{ptx=(e.clientX/W-.5);pty=(e.clientY/H-.5);if(drag){const dx=e.clientX-drag.x;vel=dx*.0009;drag.x=e.clientX;drag.m+=Math.abs(dx)}},{passive:true});
    cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,m:0,cx:e.clientX,cy:e.clientY};clearTimeout(T)});
    addEventListener('pointerup',e=>{if(drag&&drag.m<5)rings.push({t:performance.now()});drag=null},{passive:true});
    const fr=now=>{if(done&&d.classList.contains('gone'))return;const t0s=(now-t0)/1000,t=Math.max(0,t0s-LT),L=lay(),u=L.u,intro=Math.min(1,t/1.6),e=1-Math.pow(1-intro,3);
      tx+=(ptx-tx)*.05;ty+=(pty-ty)*.05;vel*=.96;rot+=.0022+vel+(1-e)*.03;const tl=tilt+ty*.35,ca=Math.cos(tl),sa=Math.sin(tl),sw=t*.7%(Math.PI*2);
      const tk=Math.floor((rot%(Math.PI*2))/(Math.PI*2)*NT);if(tk!==lastTick&&Math.abs(vel)>.004){lastTick=tk;try{navigator.userActivation&&navigator.userActivation.hasBeenActive&&navigator.vibrate&&navigator.vibrate(4)}catch(_){}}
      ctx.clearRect(0,0,W,H);drawLogo(t0s,W,H);ctx.globalCompositeOperation=light?'multiply':'lighter';
      if(t0s>LT-.2)for(const p of P){const a=p.a+rot+tx*.3;let x=Math.cos(a)*p.r,y=Math.sin(a)*p.r,z=0;const y2=y*ca-z*sa,z2=y*sa+z*ca;
        let X=x,Y=y2,Z=z2;if(e<1){const k=Math.max(0,Math.min(1,(t-p.dl)/1.1)),kk=1-Math.pow(1-k,3);X=p.sx+(x-p.sx)*kk;Y=p.sy+(y2-p.sy)*kk;Z=p.sz+(z2-p.sz)*kk}
        const per=1.9/(1.9-Z*.55),sx=L.cx+X*u*per,sy=L.cy+Y*u*per*.95;if(sx<-20||sx>W+20||sy<-20||sy>H+20)continue;
        const dA=Math.abs(((a-sw)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI),hot=Math.max(0,1-dA/1.6),front=(Z+1)/2;
        let ring=0;for(const rg of rings){const age=(now-rg.t)/1000;ring=Math.max(ring,Math.max(0,1-Math.abs(p.r-(.7+age*.6))*9)*Math.max(0,1-age))}
        const c=p.gl?G:hot>.55?A2.map((v,i)=>Math.round(v+(DIM[i]-v)*(hot-.55)*.9)):A1.map((v,i)=>Math.round(v+(A2[i]-v)*hot)),al=(.22+.78*(p.j/(ND-1)))*(.45+.55*front)*(.55+.45*p.hv)*(.55+.9*hot+ring)*Math.min(1,e*1.3)+(p.gl?.15:0);
        ctx.globalAlpha=Math.min(1,al*(light?2.1:1.6)+(light?.1:.06));ctx.fillStyle=`rgb(${c})`;const sz=(1.3+front*1.6)*per*(phone?1.05:1)*(1+ring*.8);ctx.fillRect(sx-sz/2,sy-sz/2,sz,sz)}
      rings=rings.filter(rg=>now-rg.t<1600);ctx.globalAlpha=1;raf=requestAnimationFrame(fr)};raf=requestAnimationFrame(fr)
  }catch(e){console.warn(e)}}


if(migrateProfile())save();
splash();
render();
/* yakınlaştırmayı kapat: iki parmak, çift dokunma, ctrl+tekerlek */
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
let _lastTouch=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-_lastTouch<300&&!(e.target.closest&&e.target.closest('input,textarea,select')))e.preventDefault();_lastTouch=n},{passive:false});
window.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
window.S_sw=(k,v)=>{S.swake=S.swake||{};S.swake[k]=k==='on'?!!v:v;if(k==='vib'){S.settings.vib=v;buzz()}save();A.swake();render(true)};
window.ui_setNull=()=>{ui.setSec=null};
window.render=render;/* satır içi onclick'ler bu adlara erişebilsin */Object.defineProperty(window,'S',{get:()=>S,set:v=>{S=v},configurable:true});Object.assign(window,{ui,save,closeSheet,buzz,LANG,dkey,esc,rzSheet});window.__hm={acx:()=>ACX(),S:()=>S,toast,prFx,PERF:()=>PERF,CL,ui:()=>ui,ghParseSleep,healthScores,strainParts,HD:()=>HD(),ALL:()=>ALL(),socId,socLoad,SOC:()=>SOC};
