/* ===== iOS uygulaması (WKWebView köprüsü): Apple Health + Bluetooth nabız ===== */
const HMN=()=>!!(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.hm);
window.__hmCb={};window.__hmNative=(id,r)=>{const f=__hmCb[id];if(f){delete __hmCb[id];f(r)}};
const hmCall=(cmd,o)=>new Promise(ok=>{const id=Math.random().toString(36).slice(2);__hmCb[id]=ok;try{webkit.messageHandlers.hm.postMessage({cmd,id,...(o||{})})}catch(e){ok({error:String(e)})}setTimeout(()=>{if(__hmCb[id]){delete __hmCb[id];ok({error:'timeout'})}},60000)});
/* Basılı tut → paylaş (yaylar: hold-release 260/14, hold-morph 320/20) */
const HB=(()=>{const RM=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SP={rel:[260,14],morph:[320,20]},HOLD=1100;
  const spr=(x,k,c)=>({x,v:0,t:x,k,c});
  const step=(q,dt)=>{const c=RM()?2*Math.sqrt(q.k):q.c;const a=-q.k*(q.x-q.t)-c*q.v;q.v+=a*dt;q.x+=q.v*dt};
  const rest=q=>Math.abs(q.x-q.t)<1e-3&&Math.abs(q.v)<1e-3;
  const ST=new WeakMap();
  function get(el){let o=ST.get(el);if(!o){const W=el.getBoundingClientRect().width;o={el,W,p:spr(0,...SP.rel),sc:spr(1,...SP.morph),w:spr(W,...SP.morph),ok:spr(0,...SP.morph),hold:false,h0:0,done:false,raf:0,last:0};ST.set(el,o)}return o}
  function paint(o){const el=o.el,p=Math.max(0,Math.min(1,o.p.x));el.querySelector('.hb-f').style.transform=`scaleX(${p})`;el.querySelector('.hb-l2').style.clipPath=`inset(0 ${(100-p*100).toFixed(2)}% 0 0)`;
    el.style.transform=`scale(${o.sc.x.toFixed(4)})`;el.style.width=o.w.x.toFixed(1)+'px';const ok=Math.max(0,Math.min(1,o.ok.x));
    el.querySelector('.hb-l').style.opacity=el.querySelector('.hb-l2').style.opacity=String(1-ok);el.querySelector('.hb-ok').style.opacity=String(ok)}
  function loop(o){if(o.raf)return;o.last=performance.now();const f=now=>{let dt=Math.min(.064,(now-o.last)/1000);o.last=now;
      if(o.hold&&!o.done){o.p.x=Math.min(1,(now-o.h0)/HOLD);o.p.v=0;if(o.p.x>=1)fire(o)}
      const n=Math.ceil(dt/(1/240));for(let i=0;i<n;i++){const h=dt/n;if(!o.hold||o.done)step(o.p,h);step(o.sc,h);step(o.w,h);step(o.ok,h)}
      paint(o);if(o.hold||![o.p,o.sc,o.w,o.ok].every(rest)){o.raf=requestAnimationFrame(f)}else{o.raf=0;paint(o)}};o.raf=requestAnimationFrame(f)}
  async function fire(o){o.done=true;o.hold=false;o.p.x=1;o.p.t=1;o.sc.t=1;try{navigator.vibrate&&navigator.vibrate(18)}catch(e){}
    const H=o.el.getBoundingClientRect().height;o.w.t=H;o.ok.t=1;const ic=o.el.querySelector('.hb-ok');ic.innerHTML='<i class="sp"></i>';o.el.style.background='#ececf0';loop(o);
    let ok=false;try{ok=await (o.el.__done?o.el.__done():true)}catch(e){ok=false}
    if(ok){ic.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';o.sc.x=.92;o.sc.v=0;o.sc.t=1;loop(o);if(o.el.__after)setTimeout(o.el.__after,650)}
    else{o.el.style.background='';o.ok.t=0;o.w.t=o.W;o.p.k=SP.rel[0];o.p.t=0;o.done=false;loop(o)}}
  return{
    html:(label,id)=>`<button type="button" class="hb" id="${id}" aria-label="${esc(label)}" onpointerdown="HB.down(this,event)" onpointerup="HB.up(this)" onpointercancel="HB.up(this)" onpointerleave="HB.up(this)" oncontextmenu="return false" onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();HB.down(this,event)}" onkeyup="HB.up(this)"><i class="hb-f"></i><span class="hb-l">${esc(label)}</span><span class="hb-l2" aria-hidden="true">${esc(label)}</span><span class="hb-ok"></span></button>`,
    bind(id,can,done,after){const el=document.getElementById(id);if(!el)return;el.__can=can;el.__done=done;el.__after=after},
    down(el,e){const o=get(el);if(o.done||o.hold)return;if(el.__can&&!el.__can())return;try{e&&e.pointerId!=null&&el.setPointerCapture(e.pointerId)}catch(_){}
      o.hold=true;o.h0=performance.now()-o.p.x*HOLD;o.sc.t=.97;loop(o)},
    up(el){const o=ST.get(el);if(!o||!o.hold||o.done)return;o.hold=false;o.sc.t=1;o.p.t=0;loop(o)}}})();
window.HB=HB;
/* Uygulama içinde (iOS) sayfa günlerce açık kalabiliyor: yeni sürüm yayınlanınca kendini yenilesin */
(()=>{const get=()=>fetch('sw.js?ts='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>(t.match(/hm-v\d+/)||[''])[0]).catch(()=>'');
  let cur='';const stale=v=>{/* önbellekten açılan sayfa eskiyse bir kez yenile */if(window.HM_V&&v&&v!==window.HM_V&&sessionStorage.getItem('hmrl')!==v){try{sessionStorage.setItem('hmrl',v)}catch(e){}setTimeout(()=>{const busy=(typeof S!=='undefined'&&S.active)||document.querySelector('.sheet,.scrim,.sty,.cam,input:focus,textarea:focus');if(!busy)location.reload()},1500);return true}};get().then(v=>{cur=v;stale(v)});
  const chk=()=>{if(document.visibilityState!=='visible'||!cur)return;get().then(v=>{if(!v||v===cur)return;const busy=(typeof S!=='undefined'&&S.active)||document.querySelector('.sheet,.scrim,.sty,.cam,input:focus,textarea:focus');if(busy){return}location.reload()})};
  document.addEventListener('visibilitychange',chk);setInterval(chk,5*60e3)})();
/* ===== Siri (iOS uygulaması) komutları ===== */
const VNUM={yarim:.5,bucuk:.5,bir:1,iki:2,uc:3,dort:4,bes:5,alti:6,yedi:7,sekiz:8,dokuz:9,on:10,onbes:15,yirmi:20,otuz:30,kirk:40,elli:50,yuz:100,ikiyuz:200,ucyuz:300,a:1,an:1,one:1,two:2,three:3,four:4,five:5,half:.5};
const VUNIT={g:'g',gr:'g',gram:'g',grams:'g',ml:'ml',mililitre:'ml',kg:'kg',kilo:'kg',lt:'l',litre:'l',adet:'adet',tane:'adet',dilim:'dilim',porsiyon:'porsiyon',kase:'kase',bardak:'bardak',kasik:'kasik',yemekkasigi:'kasik',tatlikasigi:'tkasik',avuc:'avuc',paket:'paket',kutu:'kutu',slice:'dilim',slices:'dilim',cup:'bardak',bowl:'kase',piece:'adet',pieces:'adet',tbsp:'kasik'};
const VGR={bardak:200,kasik:15,tkasik:5,avuc:30,kutu:330};
function voiceMealParse(q){const parts=String(q).toLocaleLowerCase('tr-TR').replace(/\b(yedim|içtim|ictim|yiyorum|i ate|ate|had)\b/g,'').split(/\s*(?:,|\+|\bve\b|\bile\b|\band\b|\bwith\b)\s*/).map(x=>x.trim()).filter(Boolean),out=[],miss=[];
  for(const pt of parts){let w=pt.split(/\s+/),n=null,u=null;
    const nv=x=>{const t=x.replace(',','.');if(/^\d+(\.\d+)?$/.test(t))return +t;const k=ingNorm(x);return VNUM[k]};
    if(w.length&&nv(w[0])!=null){n=nv(w[0]);w=w.slice(1);if(w.length&&ingNorm(w[0])==='bucuk'){n+=.5;w=w.slice(1)}}
    if(w.length&&VUNIT[ingNorm(w[0])]){u=VUNIT[ingNorm(w[0])];w=w.slice(1)}
    const name=w.join(' ').replace(/^(tane|adet)\s+/,'').trim();if(!name)continue;
    let hit=ingFind(name,1)[0];if(!hit){const ws=name.split(/\s+/);for(let i=ws.length-1;i>=0&&!hit;i--)hit=ingFind(ws[i],1)[0]}
    if(!hit){miss.push(name);continue}
    const d=ING()[hit];let g;n=n==null?1:n;
    if(u==='g'||u==='ml')g=n;else if(u==='kg'||u==='l')g=n*1000;else if(VGR[u])g=n*VGR[u];
    else if(d.pw)g=n*d.pw;else g=(u==null&&n>=20)?n:n*100;
    const f=g/100;out.push({hit,g:Math.round(g),k:Math.round(d.k*f),p:Math.round(d.p*f*10)/10,c:Math.round(d.c*f*10)/10,f:Math.round(d.f*f*10)/10,txt:(u||n!==1||!d.pw?(n!==1||u?fmt(n)+' ':'')+(u&&u!=='adet'?u+' ':''):'')+hit})}
  return{out,miss}}
window.__hmVoice=async o=>{try{o=o||{};const d=dkey(),nw=new Date(),tm=z(nw.getHours())+':'+z(nw.getMinutes());
  if(o.t==='meal'){const{out,miss}=voiceMealParse(o.q||'');if(!out.length)return TT('"'+(o.q||'')+'" yemeğini tanıyamadım. Uygulamadan elle ekleyebilirsin.','I could not recognise "'+(o.q||'')+'".');
    const tot=out.reduce((a,x)=>({k:a.k+x.k,p:a.p+x.p,c:a.c+x.c,f:a.f+x.f}),{k:0,p:0,c:0,f:0});
    S.meals.push({id:uid(),date:d,time:tm,name:out.map(x=>x.txt).join(', '),kcal:tot.k,p:Math.round(tot.p),c:Math.round(tot.c),f:Math.round(tot.f),src:'siri'});save();ui.view='food';ui.foodDay=d;render(true);
    const eaten=S.meals.filter(m=>m.date===d).reduce((a,m)=>a+(+m.kcal||0),0);
    return TT(`Eklendi: ${out.map(x=>x.txt).join(', ')}. Yaklaşık ${tot.k} kalori, ${Math.round(tot.p)} gram protein. Bugün toplam ${Math.round(eaten)} kalori.`,`Added ${out.map(x=>x.txt).join(', ')}: about ${tot.k} kcal, ${Math.round(tot.p)} g protein. ${Math.round(eaten)} kcal today.`)+(miss.length?TT(' Tanıyamadığım: '+miss.join(', ')+'.',' Not recognised: '+miss.join(', ')+'.'):'')}
  if(o.t==='drink'){const T=DRINK[o.type]||DRINK.su,ml=+o.ml||T.ml;S.drinks.push({id:uid(),date:d,type:DRINK[o.type]?o.type:'su',ml,time:tm});save();ui.view='food';ui.foodDay=d;render(true);
    let fl=0;try{fl=Math.round(fluid(d))}catch(e){}return TT(`${ml} ml ${T.n.toLocaleLowerCase('tr-TR')} eklendi.`+(fl?` Bugün ${(fl/1000).toFixed(1).replace('.',',')} litre sıvı aldın.`:''),`Added ${ml} ml.`+(fl?` ${(fl/1000).toFixed(1)} L today.`:''))}
  if(o.t==='start'){if(S.active){render(true);return TT('Zaten devam eden bir antrenmanın var: '+(S.active.planName||''),'A workout is already running.')}
    let p=null;const act=S.plans.filter(x=>!x.archived);if(o.name){const qn=ingNorm(o.name);p=act.find(x=>ingNorm(x.name)===qn)||act.find(x=>ingNorm(x.name).includes(qn)||qn.includes(ingNorm(x.name)))}
    if(!p)p=todaysPlan();if(!p)return TT('Başlatacak şablon bulamadım.','No template found.');A.start(p.id);return TT(`${p.name} başladı. ${p.exercises.length} hareket, iyi antrenmanlar!`,`${p.name} started. Have a good session!`)}
  return TT('Bu komutu bilmiyorum.','Unknown command.')}catch(e){console.warn(e);return TT('Bir hata oldu.','Something went wrong.')}};
let __wgT=0;function widgetSoon(){if(!HMN())return;clearTimeout(__wgT);__wgT=setTimeout(widgetPush,1500)}
function widgetPush(){try{const td=dkey(),sc=healthScores(td)||null,x=sc?sc.x:(HD()[td]||{}),M=foreModel(td,x||{},sc),e=[];for(let h=0;h<=30;h+=.5)e.push(Math.round(M.E(h)));
  const r=v=>v==null||isNaN(v)?null:Math.round(v),sl=(x&&x.sleep)||{},st=strainOf(td);
  const o={d:td,rec:sc?r(sc.rec):null,sleep:r(sl.min),slS:sc?r(sc.sleep):null,steps:r(x&&x.steps),rhr:r(x&&x.rhr),hrv:r(x&&x.hrv),strain:st==null?null:Math.round(st*10)/10,e,bed:Math.round(M.bedH*100)/100,lang:LANG()};
  const k=JSON.stringify(o);let L='';try{L=localStorage.getItem('hm-wg')||''}catch(_){}
  const lt=+(L.split('|')[0]||0);if(L.slice(L.indexOf('|')+1)===k&&Date.now()-lt<3*36e5)return;
  hmCall('widget',{snap:JSON.stringify({...o,t:Date.now()})}).then(q=>{if(q&&q.ok)try{localStorage.setItem('hm-wg',Date.now()+'|'+k)}catch(_){}})}catch(e){console.warn('widget',e)}}
async function hkSync(){const days=Math.max(3,Math.min(60,+S.settings.ghDays||30)),r=await hmCall('health',{days});if(!r||r.error){toast(TT('Apple Health okunamadı','Could not read Apple Health'));return{n:0,log:['✕ Apple Health']}}
  const H={},civ=t=>{const d=new Date(t);return{year:d.getFullYear(),month:d.getMonth()+1,day:d.getDate()}},log=[],run=(l,f)=>{try{f();log.push('✓ '+l)}catch(e){log.push('✕ '+l);console.warn(e)}};
  run('Uyku',()=>{const sl=(r.sleep||[]).map(x=>({s:new Date(x.s),e:new Date(x.e),v:x.v})).sort((a,b)=>a.s-b.s),stg=sl.some(x=>x.v>=3),T=['inbed','asleep','awake','light','deep','rem'],ss=[];
    sl.forEach(x=>{if(stg&&x.v===0)return;const l=ss[ss.length-1];if(l&&x.s-l.e<60*6e4){if(x.e>l.e)l.e=x.e;l.st.push(x)}else ss.push({s:x.s,e:x.e,st:[x]})});
    ghParseSleep(ss.map(q=>({startTime:q.s.toISOString(),endTime:q.e.toISOString(),nap:q.e-q.s<3*36e5&&q.s.getHours()>=9&&q.s.getHours()<20,stages:q.st.map(x=>({type:T[x.v]||'asleep',startTime:x.s.toISOString(),endTime:x.e.toISOString()}))})),H)});
  const daily=(k,key,mul,rd)=>ghParseDaily((r[k]||[]).map(x=>({date:civ(x.t),value:x.v*(mul||1)})),H,key,/value/,rd);
  run('Dinlenik nabız',()=>daily('rhr','rhr'));run('HRV',()=>daily('hrv','hrv'));run('SpO₂',()=>daily('spo2','spo2',100));run('Solunum',()=>daily('resp','resp',1,1));run('VO₂max',()=>daily('vo2','vo2',1,1));
  run('Adım',()=>ghParseSteps((r.steps||[]).map(x=>({startTime:x.t,count:x.v})),H));
  run('Nabız',()=>ghParseHR((r.hr||[]).map(x=>({time:x.t,bpm:x.v})),H));
  run('Kalori',()=>{const KA={},KB={};ghParseKcal((r.kcal||[]).map(x=>({startTime:x.t,kcal:x.v})),KA);ghParseKcal((r.basal||[]).map(x=>({startTime:x.t,kcal:x.v})),KB);
    new Set([...Object.keys(KA),...Object.keys(KB)]).forEach(d=>{const a=(KA[d]||{}).kcalOut,b=(KB[d]||{}).kcalOut;H[d]={...(H[d]||{}),...(a!=null?{kcalAct:a}:{}),...(a!=null&&b!=null?{kcalOut:a+b}:{})}})});
  run('Mesafe',()=>{const by={};(r.dist||[]).forEach(x=>{const d=dkey(new Date(x.t));by[d]=(by[d]||0)+x.v});Object.entries(by).forEach(([d,v])=>H[d]={...(H[d]||{}),dist:Math.round(v*100)/100})});
  if(r.weight&&r.weight.v&&!/hypemode/i.test(r.weight.src||'')){const wt=+new Date(r.weight.t),kg=Math.round(r.weight.v*10)/10;let L=null;try{L=JSON.parse(localStorage.getItem('hm-hkw')||'null')}catch(e){}
    if((!L||wt>L.t)&&S.profile&&Math.abs((+S.profile.weight||0)-kg)>=.05){S.profile.weight=kg;try{localStorage.setItem('hm-hkw',JSON.stringify({v:kg,t:wt}))}catch(e){}log.push('✓ Kilo')}}
  run('Antrenmanlar',()=>{const C=S.cardio=S.cardio||[],ws=(r.workouts||[]).filter(w=>!/hypemode/i.test(w.src||'')&&w.type!=='STRENGTH').filter(w=>{const st=new Date(w.t);return !C.some(c=>c.date===dkey(st)&&c.time&&Math.abs(hm(c.time)-(st.getHours()*60+st.getMinutes()))<6)});
    const k=ghParseEx(ws.map(w=>({name:'hk/'+w.id,exercise:{startTime:w.t,endTime:w.e,exerciseType:w.type}})));if(k)log.push(k+' yeni kardiyo')});
  if(r.height&&r.height.v&&S.profile&&!S.profile.height){S.profile.height=Math.round(r.height.v*100)}
  const n=Object.keys(H).length;Object.entries(H).forEach(([d,v])=>{S.health[d]={...(S.health[d]||{}),...v}});
  if(n){S.healthDemo=false;S.settings.ghOk=1;S.settings.ghLast=Date.now();S.settings.hk=1}save();render(true);return{n,log}}
/* HypeMode kayıtlarını Apple Sağlık'a yaz: öğün (kcal+makro), içecek (su, kafein), antrenman, kardiyo */
let _hkPT=null;function hkPushSoon(){if(!HMN())return;clearTimeout(_hkPT);_hkPT=setTimeout(hkPush,4000)}
function hkPush(){if(!HMN())return;const lim=dkey(new Date(Date.now()-14*864e5)),at=(d,t)=>{const x=new Date(d+'T'+(/^\d\d:\d\d$/.test(t||'')?t:'12:00')+':00');return isNaN(x)?null:x.toISOString()},I=[];
  (S.meals||[]).filter(m=>m.date>=lim).forEach(m=>{const t=at(m.date,m.time);if(t)I.push({sid:'m-'+m.id,kind:'meal',t,kcal:+m.kcal||0,p:+m.p||0,c:+m.c||0,f:+m.f||0})});
  (S.drinks||[]).filter(d=>d.date>=lim).forEach(d=>{const t=at(d.date,d.time),D=DRINK[d.type]||{},k=(+d.ml||0)/100;if(t)I.push({sid:'d-'+d.id,kind:'drink',t,ml:+d.ml||0,caf:Math.round((D.caf||0)*k),kcal:Math.round((D.k||0)*k)})});
  (S.sessions||[]).filter(x=>dkey(new Date(x.date))>=lim&&x.dur>60).forEach(x=>{const e=new Date(x.date),st=new Date(+e-x.dur*1000);I.push({sid:'s-'+x.id,kind:'workout',type:'strength',t:st.toISOString(),e:e.toISOString(),name:x.planName||'Antrenman'})});
  (S.cardio||[]).filter(c=>c.date>=lim&&!/^(gh|hk)-/.test(String(c.id))&&c.src!=='gh'&&c.min>0).forEach(c=>{const t=at(c.date,c.time);if(t)I.push({sid:'c-'+c.id,kind:'workout',type:c.type||'other',t,e:new Date(+new Date(t)+c.min*6e4).toISOString(),kcal:+c.kcal||0})});
  let M={};try{M=JSON.parse(localStorage.getItem('hm-hkp')||'{}')}catch(e){}const sig=o=>JSON.stringify(o),N={},items=[];I.forEach(o=>{N[o.sid]=sig(o);if(M[o.sid]!==N[o.sid])items.push(o)});
  const ex=new Set([...(S.meals||[]).map(x=>'m-'+x.id),...(S.drinks||[]).map(x=>'d-'+x.id),...(S.sessions||[]).map(x=>'s-'+x.id),...(S.cardio||[]).map(x=>'c-'+x.id)]),del=[];Object.keys(M).forEach(k=>{if(N[k])return;if(ex.has(k))N[k]=M[k];else del.push(k)});
  if(!items.length&&!del.length)return;hmCall('push',{items,del}).then(r=>{if(r&&!r.error){try{localStorage.setItem('hm-hkp',JSON.stringify(N))}catch(e){}}})}
function swNotify(){if(!HMN())return;const W=S.swake||{};let sig='off';const o={cmd:'alarm',on:!!W.on};
  if(W.on){const P=swPlan(),nx=m=>{const d=new Date();d.setSeconds(0,0);d.setHours(Math.floor(m/60),m%60);if(+d<=Date.now()+6e4)d.setDate(d.getDate()+1);return +d};o.at=nx(P.t);o.at2=nx(P.to);if(o.at2<o.at)o.at2+=864e5;o.title=TT('Günaydın ☀️','Good morning ☀️');o.body=TT('Uyku döngün bitti, kalkmak için en iyi an.','Your sleep cycle ended — best time to get up.');sig=o.at+'|'+o.at2}
  if(swNotify._s===sig)return;swNotify._s=sig;try{webkit.messageHandlers.hm.postMessage(o)}catch(e){}}
function hkWeightPush(){if(!HMN())return;const w=+(S.profile&&S.profile.weight);if(!w||w<20||w>400)return;let L=null;try{L=JSON.parse(localStorage.getItem('hm-hkw')||'null')}catch(e){}
  if(L&&Math.abs(L.v-w)<.05)return;try{localStorage.setItem('hm-hkw',JSON.stringify({v:w,t:Date.now()}))}catch(e){}hmCall('weight',{kg:w}).then(r=>{if(r&&r.ok===false)console.warn('weight save failed')})}
window.__hmBat=(v,name)=>{if(v>=0&&v<=100){S.settings.bleBat={v,t:Date.now(),name:name||''};save()}};
window.__hmHR=(b,name)=>{HRM.nat={name:name||'Nabız',on:true};if(b>25&&b<250){HRM.bpm=b;HRM.at=Date.now();if(S.active){const a=S.active;a.hrS=(a.hrS||0)+b;a.hrN=(a.hrN||0)+1;a.hrX=Math.max(a.hrX||0,b)}}hrmPaint()};
window.__hmHRState=st=>{if(/^(svc|baterr):/.test(st)){S.settings.bleDiag={m:st,t:Date.now()};save();return}if(st==='on'){HRM.nat={...(HRM.nat||{name:'Nabız'}),on:true};render(true)}else if(st==='lost'||st==='off'||st==='bt-off'){if(HRM.nat)HRM.nat.on=false;HRM.bpm=null;hrmPaint();render(true);if(st==='bt-off')toast(TT('Bluetooth kapalı','Bluetooth is off'))}else if(st==='scan'&&!HRM.auto)toast(TT('Bileklik aranıyor… nabız paylaşımı açık olsun','Searching… keep HR sharing on'))};
setTimeout(()=>{if(HMN()&&!S.settings.hk)ghSync(false).catch(()=>{})},2500);
const hrmAutoGo=()=>{if(HMN()&&S.settings&&S.settings.hrmAuto!==0&&!hrmOn()){HRM.auto=1;HRM.nat={name:'Nabız',on:false};try{webkit.messageHandlers.hm.postMessage({cmd:'hrm',on:true})}catch(e){}setTimeout(()=>HRM.auto=0,15000)}};setTimeout(hrmAutoGo,1800);setTimeout(()=>{try{swNotify()}catch(e){}},3000);setInterval(()=>{if(HMN()&&document.visibilityState==='visible')ghAutoArm()},5*6e4);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(hrmAutoGo,600)});
/* Canlı nabız: Bluetooth nabız yayını (Fitbit "nabzı paylaş", göğüs bandı, saat) */
const HRM={bpm:null,dev:null,at:0};
const hrmOn=()=>!!(HRM.nat&&HRM.nat.on)||!!(HRM.dev&&HRM.dev.gatt&&HRM.dev.gatt.connected);
function hrmCard(){if(hrmOn())return `<div class="hrm on"><div><small>${TT('CANLI','LIVE')} · ${esc((HRM.nat||HRM.dev||{}).name||TT('Nabız cihazı','HR device'))}</small><b><span id="hrmV">${HRM.bpm??'—'}</span><i> bpm</i></b></div><button class="btn ghost" onclick="A.hrmOff()">${TT('Kes','Disconnect')}</button></div>`;
  return `<div class="hrm"><div><small>${TT('CANLI NABIZ','LIVE HEART RATE')}</small><span>${TT('Bilekliğinden anlık nabız al','Get live HR from your band')}</span></div><button class="btn" onclick="A.hrmConnect()">${TT('Bağla','Connect')}</button></div>`}
function hrmPaint(){const v=document.getElementById('hrmV');if(v)v.textContent=HRM.bpm??'—';const hp=document.querySelector('.hrpill b');if(hp&&hrmOn()&&HRM.bpm){hp.textContent=HRM.bpm;const em=document.querySelector('.hrpill em');if(em&&!/canlı/.test(em.textContent))em.textContent='canlı'}let p=document.getElementById('hrmPill');if(p)p.remove();return;
  if(!hrmOn()){if(p)p.remove();return}if(!p){p=document.createElement('button');p.id='hrmPill';p.className='hrm-pill';p.onclick=()=>A.go('hrd');document.body.appendChild(p)}
  const pc=HRM.bpm&&typeof hrMax==='function'?HRM.bpm/hrMax():0;p.style.setProperty('--z',pc>=.9?'#ff3b4f':pc>=.8?'#ff8a3c':pc>=.7?'#ffd23c':pc>=.6?'#34d399':'#7aa7ff');p.innerHTML=`<i>♥</i>${HRM.bpm??'—'}`;p.style.display=hp?'none':''}
/* metrik başına tek renk: her grafikte aynı */
const SCC={hr:'#ff5c74',step:'#34d399',load:'#f5a524',sleep:'#8b7cf6',kcal:'#ff8a4c',w:'#4cc9f0'};
function scCol(id){return /^(hrc|snh|naph)/.test(id)?SCC.hr:/^stc/.test(id)?SCC.step:/^yuc/.test(id)?SCC.load:/^(sl|slp)/.test(id)?SCC.sleep:/^(kc|cal)/.test(id)?SCC.kcal:/^(wt|kilo)/.test(id)?SCC.w:SCC.step}
function scrubChart(id,pts,o){/* pts:[[x0..1,y,label]] */if(/^(hrc|snh|naph)/.test(id))o={...o,line:1};const fine=/^(hrc|snh|naph)/.test(id);if(!o.bar&&pts.length>(fine?300:120)){const g=Math.ceil(pts.length/(fine?288:96)),np=[];for(let i=0;i<pts.length;i+=g){const gr=pts.slice(i,i+g),vv=gr.filter(q=>q[1]!=null);np.push([gr.reduce((a,q)=>a+q[0],0)/gr.length,vv.length?vv.reduce((a,q)=>a+q[1],0)/vv.length:null,(vv[0]||gr[0])[2]])}pts=np}const lol=false;delete o.pkMin;if(lol&&pts.length>64){const g=Math.ceil(pts.length/56),np=[];for(let i=0;i<pts.length;i+=g){const gr=pts.slice(i,i+g),vv=gr.filter(q=>q[1]!=null);np.push([gr.reduce((a,q)=>a+q[0],0)/gr.length,vv.length?(o.cum?vv[vv.length-1][1]:vv.reduce((a,q)=>a+q[1],0)/vv.length):null,(vv[0]||gr[0])[2]])}pts=np}o={...o,col:o.keepCol?o.col:scCol(id),area:false};const W=340,H=o.h&&o.h<130?o.h:140,ys=pts.map(p=>p[1]).filter(v=>v!=null),mx=o.max??Math.max(...ys,1)*1.08,mn=o.min??0,Y=v=>H-(v-mn)/((mx-mn)||1)*H,X=f=>f*W;
  const segs=[];let cur=[];pts.forEach(p=>{if(p[1]==null){if(cur.length)segs.push(cur);cur=[]}else cur.push(p)});if(cur.length)segs.push(cur);
  const path=a=>{if(a.length<3||o.bar)return a.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join('');let d='M'+X(a[0][0]).toFixed(1)+','+Y(a[0][1]).toFixed(1);for(let i=1;i<a.length;i++){const p0=a[i-2]||a[i-1],p1=a[i-1],p2=a[i],p3=a[i+1]||p2,t=.18;const c1x=X(p1[0])+(X(p2[0])-X(p0[0]))*t,c1y=Y(p1[1])+(Y(p2[1])-Y(p0[1]))*t,c2x=X(p2[0])-(X(p3[0])-X(p1[0]))*t,c2y=Y(p2[1])-(Y(p3[1])-Y(p1[1]))*t;d+=`C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${X(p2[0]).toFixed(1)},${Y(p2[1]).toFixed(1)}`}return d};
  window.__sc=window.__sc||{};window.__sc[id]={pts,W,H,X,Y,u:o.u||'',m:o.bar?'bar':lol?'lol':'',bw:o.bw};
  window.__sc[id].hl=o.title||'';window.__sc[id].hr=o.hint===undefined?TT('Sürükleyip incele','Drag to explore'):o.hint;
  return `${o.title!==undefined?`<div class="sc-hd"><span id="${id}-hl">${o.title}</span><b id="${id}-hr" class="hint">${window.__sc[id].hr}</b></div>`:''}<div class="scw" id="${id}" style="--sc:${o.col}" onpointermove="scrub(event,'${id}')" onpointerdown="scrub(event,'${id}')" onpointerleave="scrubEnd('${id}')" onpointerup="if(event.pointerType!=='mouse')scrubEnd('${id}')"><div class="sc-tip" id="${id}-t"></div>
   <div class="sc-in"><div class="sc-y">${(o.grid||[]).slice().reverse().map(g=>`<span style="top:${(Y(g)+8)/(H+16)*100}%">${g>=1000?Math.round(g/100)/10+'k':g}</span>`).join('')}</div>
   <svg aria-hidden="true" viewBox="0 -8 ${W} ${H+16}" preserveAspectRatio="none" style="width:100%;height:${H+16}px;display:block"><defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.col}" stop-opacity=".32"/><stop offset="1" stop-color="${o.col}" stop-opacity="0"/></linearGradient><filter id="${id}f"><feGaussianBlur stdDeviation="2.5"/></filter></defs>
    ${(o.grid||[]).map(g=>`<line x1="0" x2="${W}" y1="${Y(g)}" y2="${Y(g)}" class="sc-gl"/>`).join('')}<line x1="0" x2="${W}" y1="${H}" y2="${H}" class="sc-bl"/>
    ${o.extra||''}${o.bar?(()=>{const vp=pts.filter(p=>p[1]!=null),pk=o.noPeak||vp.length<3?null:vp.reduce((a,b)=>b[1]>a[1]?b:a);return vp.map(p=>{const hh=Math.max(o.bw,H-Y(p[1]));return `<rect class="${p===pk?'sb-pk':'sb-b'}" x="${X(p[0])-o.bw/2}" y="${H-hh}" width="${o.bw}" height="${hh}" rx="${o.bw/2}"/>`}).join('')+`<rect id="${id}-r" class="sb-hl" width="${o.bw}" rx="${o.bw/2}" style="display:none"/>`})():lol?(()=>{const vp=pts.filter(p=>p[1]!=null);if(!vp.length)return '';const pk=o.noPeak?null:vp.reduce((a,b)=>b[1]>a[1]?b:a),sv=vp.map(p=>p[1]).sort((a,b)=>a-b),thr=o.cum||o.noPeak?1e12:Math.max(sv[Math.floor(sv.length*.9)],o.pkMin||-1e9);
      return pts.map(p=>p[1]==null?`<circle class="lp-z" cx="${X(p[0])}" cy="${H}" r="1.6"/>`:`<line class="lp-s${p===pk?' pk':p[1]>=thr?' hot':''}" x1="${X(p[0])}" x2="${X(p[0])}" y1="${H}" y2="${Y(p[1])}"/><circle class="lp-d${p===pk?' pk':p[1]>=thr?' hot':''}" cx="${X(p[0])}" cy="${Y(p[1])}" r="${p===pk?3.2:2.2}"/>`).join('')})():`${segs.map(a=>o.bar?a.map(p=>`<rect x="${X(p[0])-o.bw/2}" y="${Y(p[1])}" width="${o.bw}" height="${Math.max(1,H-Y(p[1]))}" rx="${Math.min(4,o.bw/2)}" fill="${o.col}"/>`).join(''):`${o.area!==false?`<path d="${path(a)}L${X(a[a.length-1][0]).toFixed(1)},${H}L${X(a[0][0]).toFixed(1)},${H}Z" fill="url(#${id}g)"/>`:''}<path d="${path(a)}" fill="none" stroke="${o.col}" stroke-opacity="${o.noPeak?1:.55}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`).join('')}
    ${(()=>{if(o.noPeak)return '';const vp=pts.filter(p=>p[1]!=null);if(vp.length<3)return '';const pk=vp.reduce((a,b)=>b[1]>a[1]?b:a);
      if(o.bar)return `<rect x="${X(pk[0])-o.bw/2}" y="${Y(pk[1])}" width="${o.bw}" height="${Math.max(1,H-Y(pk[1]))}" rx="${Math.min(4,o.bw/2)}" fill="${o.col}"/>`;
      if(o.cum)return `<circle cx="${X(pk[0])}" cy="${Y(pk[1])}" r="4" fill="${o.col}"/>`;
      const sv=vp.map(p=>p[1]).sort((a,b)=>a-b),thr=Math.max(sv[Math.floor(sv.length*.9)],o.pkMin||-1e9),run=[],out=[];
      pts.forEach((p,k)=>{if(p[1]!=null&&p[1]>=thr){if(!run.length&&k&&pts[k-1][1]!=null)run.push(pts[k-1]);run.push(p)}else{if(run.length){if(p[1]!=null)run.push(p);out.push(run.splice(0))}}});if(run.length)out.push(run);
      return out.map(r=>`<path d="${r.length>1?path(r):`M${X(r[0][0])-1},${Y(r[0][1])}L${X(r[0][0])+1},${Y(r[0][1])}`}" fill="none" stroke="${o.col}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`).join('')})()}
    `}<line id="${id}-l" x1="0" x2="0" y1="0" y2="${H}" class="${lol?'lp-hl':'sc-ln'}" style="display:none"/><circle id="${id}-c" r="${lol?4.5:5}" class="${lol?'lp-hc':''}" fill="${o.col}" stroke="var(--card)" stroke-width="2" style="display:none"/></svg></div>
   <div class="sc-x">${(o.xl||['00:00','06:00','12:00','18:00','24:00']).map(t=>`<span>${t}</span>`).join('')}</div></div>`}
window.__hdGo=d=>{ui.hdDay=d;A.go('hrd');window.scrollTo(0,0)};
window.scrub=(e,id)=>{const c=window.__sc[id],el=document.getElementById(id);if(!c||!el)return;const r=el.getBoundingClientRect(),f=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));let b=null,bd=9;c.pts.forEach(p=>{if(p[1]==null)return;const dd=Math.abs(p[0]-f);if(dd<bd){bd=dd;b=p}});if(!b)return;
  const l=document.getElementById(id+'-l'),ci=document.getElementById(id+'-c'),t=document.getElementById(id+'-t');l.setAttribute('x1',c.X(b[0]));l.setAttribute('x2',c.X(b[0]));l.style.display='';ci.setAttribute('cx',c.X(b[0]));ci.setAttribute('cy',c.Y(b[1]));ci.style.display='';if(c.m==='lol'){l.setAttribute('y1',c.Y(b[1]));l.setAttribute('y2',c.H)}if(c.m==='bar'){const rr=document.getElementById(id+'-r'),hh=Math.max(c.bw,c.H-c.Y(b[1]));if(rr){rr.setAttribute('x',c.X(b[0])-c.bw/2);rr.setAttribute('y',c.H-hh);rr.setAttribute('height',hh);rr.style.display=''}l.style.display='none';ci.style.display='none'}const vs=`${fmt(Math.round(b[1]))} ${c.u}`;if(c.lastB!==b){t.innerHTML=`<small>${b[2]||''}</small><b>${vs}</b>`;t.classList.remove('roll');void t.offsetWidth;t.classList.add('roll')}const tw=t.offsetWidth||80;t.style.left=Math.min(r.width-tw,Math.max(0,b[0]*r.width-tw/2))+'px';t.style.opacity=1;
  const hl=document.getElementById(id+'-hl'),hr=document.getElementById(id+'-hr');if(c.lastB!==b){if(hl)hl.textContent=b[2]||'';if(hr){hr.textContent=vs;hr.classList.remove('hint');hr.classList.remove('roll');void hr.offsetWidth;hr.classList.add('roll')}}
  if(c.lastB!==b){c.lastB=b;try{navigator.vibrate&&navigator.userActivation&&navigator.userActivation.isActive&&navigator.vibrate(2)}catch(_){}}};
window.scrubEnd=id=>{['-l','-c','-r'].forEach(k=>{const e=document.getElementById(id+k);if(e)e.style.display='none'});const t=document.getElementById(id+'-t');if(t)t.style.opacity=0;const c=window.__sc&&window.__sc[id],hl=document.getElementById(id+'-hl'),hr=document.getElementById(id+'-hr');if(c){if(hl)hl.innerHTML=c.hl;if(hr){hr.textContent=c.hr;hr.classList.add('hint')}c.lastB=null}};
const ASKV={hrd:1,slp:1,yuk:1,stp:1};
const XPR=[['w',50,()=>TT('Antrenman','Workout')],['s',2,()=>TT('Set','Set')],['c',20,()=>TT('Kardiyo','Cardio')],['r',15,()=>TT('Rekor','Record')],['m',10,()=>TT('Öğün kaydı (gün)','Meals logged (day)')],['h',10,()=>TT('Su hedefi','Water goal')],['z',10,()=>TT('7s+ uyku','7h+ sleep')]];
function xpTally(d,t){const H=HD(),ss=trainedOn(d);t.w+=ss.length;t.s+=ss.reduce((a,x)=>a+x.sets.length,0);t.c+=cOn(d).length;t.r+=ss.reduce((a,x)=>a+((x.prs||[]).length),0);if(dayMeals(d).length)t.m++;if(fluid(d)>=waterGoal(d).goal)t.h++;if(!S.healthDemo&&(((H[d]||{}).sleep||{}).min||0)>=420)t.z++;return t}
const xpSum=t=>XPR.reduce((a,[k,p])=>a+t[k]*p,0),xp0=()=>({w:0,s:0,c:0,r:0,m:0,h:0,z:0});
function verState(){const days=new Set([...S.sessions.map(x=>dkey(new Date(x.date))),...S.meals.map(m=>m.date),...(S.drinks||[]).map(x=>x.date),...(S.cardio||[]).map(c=>c.date),...(S.healthDemo?[]:Object.keys(HD()))]);
  const tot=xp0();days.forEach(d=>xpTally(d,tot));const xp=xpSum(tot);let lv=0,rest=xp;while(rest>=150+50*lv){rest-=150+50*lv;lv++}
  const vs=l=>`${1+Math.floor(l/10)}.${l%10}`,wk=xp0();lastNDays(dkey(),7).forEach(d=>xpTally(d,wk));
  return{xp,lv,v:vs(lv),next:vs(lv+1),cur:rest,need:150+50*lv,week:xpSum(wk),src:XPR.map(([k,p,l])=>[l(),tot[k]+' ×'+p,tot[k]*p])}}
const verWord=()=>`<span class="vw">VERSION</span>`;
function verBadge(){const v=verState(),pc=Math.round(v.cur/v.need*100);if(S.settings.verSeen==null){S.settings.verSeen=v.lv}const up=v.lv>S.settings.verSeen;
  return `<button class="vbdg${up?' up':''}" onclick="A.verOpen()" aria-label="${TT('Versiyon','Version')} ${v.v}"><span class="vw">VERSION</span><b>${v.v}</b><i><em style="width:${pc}%"></em></i>${up?`<s>${TT('YENİ','NEW')}</s>`:''}</button>`}
function aiFab(k){return `${k?`<button class="aiq aifab" onclick="A.askPage('${k}')" aria-label="${TT('AI\'ya sor','Ask AI')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2.5c.5 4.3 2.2 6 6.5 6.5-4.3.5-6 2.2-6.5 6.5-.5-4.3-2.2-6-6.5-6.5 4.3-.5 6-2.2 6.5-6.5Z"/><path d="M18 13.5c.25 2.1 1.1 2.95 3.2 3.2-2.1.25-2.95 1.1-3.2 3.2-.25-2.1-1.1-2.95-3.2-3.2 2.1-.25 2.95-1.1 3.2-3.2Z"/></svg></button>`:''}`}

function dpHead(t,sub){const k=ASKV[ui.view]?ui.view:null;return `<div class="ddp-h"><button class="ddp-b" onclick="A.go('home')">‹ Bugün</button><b>${t}</b><span></span></div>${sub?`<div class="dp-k">${sub}</div>`:''}`}
function heartDV(){const d=ui.hdDay||dkey(),H=HD(),x=H[d]||{},a=x.hr15||[],v=a.filter(q=>q!=null),hm2=i=>z(Math.floor(i/4))+':'+z(i%4*15);
  const avg=v.length?Math.round(v.reduce((q,w)=>q+w,0)/v.length):null,base=k=>{const b=lastNDays(d,31).slice(1).map(k2=>(H[k2]||{})[k]).filter(q=>q!=null);return b.length>=3?b.reduce((q,w)=>q+w,0)/b.length:null};
  const dl=(k,inv)=>{const b=base(k);if(b==null||x[k]==null)return '';const df=Math.round(x[k]-b);return df?`<i class="${(df>0)!==!!inv?'up':'dn'}">${df>0?'↑':'↓'} ${Math.abs(df)} normaline göre</i>`:'<i>normalinde</i>'};
  const zs=x.hrz?x.hrz.slice():HRZ.map(()=>0);if(!x.hrz)v.length&&a.forEach(q=>{const z2=q!=null?hrZoneOf(q):-1;if(z2>=0)zs[z2]+=15});const zt=zs.reduce((q,w)=>q+w,0)||1;
  const wk=lastNDays(d,7).reverse(),rh=wk.map(k2=>[k2,(H[k2]||{}).rhr]),hv2=wk.map(k2=>[k2,(H[k2]||{}).hrv]),dn=k2=>new Date(k2+'T12:00').toLocaleDateString(LOC(),{weekday:'narrow'});
  const mini=(arr,col,u)=>{const vs=arr.map(q=>q[1]).filter(q=>q!=null);if(!vs.length)return '<div class="lbl">Veri yok</div>';const mx=Math.max(...vs),mn=Math.min(...vs);return `<div class="mbars">${arr.map(q=>`<div><i style="height:${q[1]==null?4:20+(q[1]-mn)/((mx-mn)||1)*60}%;background:${q[1]==null?'rgba(255,255,255,.08)':col}"></i><b>${q[1]??''}</b><span>${dn(q[0])}</span></div>`).join('')}</div>`};
  const sl=x.sleep||{},ov=sl.bed&&sl.wake?(()=>{const b=hm(sl.bed),w=hm(sl.wake),idx=[];for(let i=0;i<96;i++){const m=i*15;if(b>w?(m>=b||m<w):(m>=b&&m<w))idx.push(i)}return idx})():[];
  return `<div class="ddp dp">${dpHead('Kalp atışı',d===dkey()?'Bugün kaydedilen':dayLbl(d))}
   <div class="dp-big">${v.length?`${Math.min(...v)}–${Math.max(...v)}<small>bpm</small>`:'—'}</div><div class="dp-s">${avg?`Ortalama ${avg} bpm. Aralık kaydedilen ölçümleri gösterir.`:'Bugün için nabız verisi henüz gelmedi.'}</div>
   ${hrmCard()}<div class="dp-c"><div class="dp-2"><div><span>Dinlenik nabız</span><b>${x.rhr??'—'}<small> bpm</small></b>${dl('rhr')}</div><div><span>Gece HRV</span><b>${x.hrv??'—'}<small> ms</small></b>${dl('hrv',1)}</div></div>
    <div class="dp-ct"><span>Gün boyu nabız</span><em>Sürükleyip incele</em></div>${scrubChart('hrc',a.map((q,i)=>[i/95,q,hm2(i)+(x.hr15x&&q!=null&&x.hr15x[i]>q+1?' · '+TT('tepe','peak')+' '+x.hr15x[i]:'')]),{u:'bpm',col:'#ff4d5e',min:40,max:Math.max(160,...v)+10,grid:[40,80,120,160],h:190,
      extra:ov.length?`<rect x="${ov[0]/95*340}" y="-8" width="${(ov[ov.length-1]-ov[0])/95*340}" height="196" fill="rgba(127,140,255,.08)"/>`:''})}
    <div class="lbl" style="margin-top:8px" data-noi18n>${TT(`15 dakikalık ortalamalar${ov.length?' · mor alan uyku':''}. Eksik ölçümler grafikte boşluk bırakır.`,`15-minute averages${ov.length?' · purple area is sleep':''} · red: high-intensity zone. Missing readings leave gaps in the chart.`)}</div></div>
   <div class="dp-t">Nabız bölgelerinde geçen süre</div><div class="dp-c">${HRZ.map((q,i)=>`<div class="zr"><span style="background:${q[2]}"></span><div class="zn"><b>${q[1]}</b><small>%${Math.round(q[0]*100)}+ maks.</small></div><i><em style="width:${Math.round(zs[i]/zt*100)}%;background:${q[2]}"></em></i><u>${tmT(zs[i])}</u></div>`).join('')}<div class="lbl" style="margin-top:8px">Maks. nabız tahmini ~${hrMax()} bpm${x.hrz?' · Fitbit verisi':''}</div></div>
   <div class="dp-t">Dinlenik nabız · 7 gün</div><div class="dp-c">${mini(rh,'#ff6b7a')}</div>
   <div class="dp-t">HRV · 7 gün</div><div class="dp-c">${mini(hv2,'#3ee6a0')}</div>
   <div style="height:120px"></div></div>`}
function stepsDV(){const d=ui.hdDay||dkey(),H=HD(),x=H[d]||{},f=n=>Math.round(n).toLocaleString(LOC()),mode=ui.stpM||'cum',cmp=ui.stpC||'usual',goal=8000;
  const sh=x.stepsH||null,tot=x.steps||0,now=new Date(),nh=d===dkey()?now.getHours():23;
  const prev=lastNDays(d,8).slice(1).map(k2=>H[k2]).filter(q=>q&&q.stepsH),usual=prev.length?Array.from({length:24},(_,i)=>Math.round(prev.reduce((q,w)=>q+w.stepsH[i],0)/prev.length)):null,yd=(H[lastNDays(d,2)[1]]||{}).stepsH||null,ref=cmp==='usual'?usual:yd;
  const cum=a=>{let c=0;return a.map(v2=>c+=v2)};const refAt=ref?cum(ref)[nh]:null,diff=refAt!=null&&sh?cum(sh)[nh]-refAt:null;
  let chart='';if(sh){if(mode==='cum'){const t=cum(sh),r2=ref?cum(ref):null,mx=Math.max(goal,...t,...(r2||[0]))*1.05;
      chart=scrubChart('stc',t.map((v2,i)=>[ (i+1)/24,i<=nh?v2:null,z(i+1)+':00']),{title:TT('Adım','Steps'),cum:1,u:'adım',col:'#8f8cff',min:0,max:mx,grid:[0,Math.round(mx/2/1000)*1000||1000,Math.round(mx/1000)*1000],extra:r2?`<path d="${r2.map((v2,i)=>(i?'L':'M')+((i+1)/24*340).toFixed(1)+','+(170-v2/mx*170).toFixed(1)).join('')}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.6" stroke-dasharray="5 4"/><line x1="0" x2="340" y1="${170-goal/mx*170}" y2="${170-goal/mx*170}" stroke="rgba(62,230,160,.35)" stroke-dasharray="2 3"/>`:'',xl:['00:00','12:00','24:00']})}
    else{const mx=Math.max(...sh,...(ref||[0]),100)*1.1;chart=scrubChart('stc',sh.map((v2,i)=>[(i+.5)/24,i<=nh?v2:null,z(i)+':00']),{title:TT('Adım','Steps'),u:'adım',col:'#8f8cff',min:0,max:mx,bar:1,bw:9,grid:[0,Math.round(mx/2/100)*100,Math.round(mx/100)*100],extra:ref?ref.map((v2,i)=>`<rect x="${(i+.5)/24*340-5}" y="${170-v2/mx*170}" width="10" height="2" fill="rgba(255,255,255,.55)"/>`).join(''):'',xl:['00:00','12:00','24:00']})}}
  const wk=lastNDays(d,7).reverse(),wv=wk.map(k2=>(H[k2]||{}).steps),wm=Math.max(goal,...wv.filter(q=>q!=null)),wa=wv.filter(q=>q!=null),avg=wa.length?Math.round(wa.reduce((q,w)=>q+w,0)/wa.length):0;
  const rel=[['Mesafe',x.dist!=null?fmt(Math.round(x.dist*10)/10)+' km':fmt(Math.round(tot*.00075*10)/10)+' km',x.dist!=null?'Fitbit':'tahmini'],['Aktif kalori',x.kcalAct!=null?f(x.kcalAct)+' kcal':f(tot*.04)+' kcal',x.kcalAct!=null?'Fitbit':'tahmini'],['Aktif bölge dk.',x.azm!=null?x.azm+' dk':'—',''],['Aktif saatler',sh?sh.filter(q=>q>=250).length+' saat':'—','250+ adım'],['En aktif saat',sh?z(sh.indexOf(Math.max(...sh)))+':00':'—',sh?f(Math.max(...sh))+' adım':'']];
  return `<div class="ddp dp">${dpHead('Adım',d===dkey()?'Şu ana kadar':dayLbl(d))}
   <div class="dp-big">${f(tot)}<small>adım</small></div><div class="dp-s"><span data-noi18n>${diff!=null?TT(`Saat ${z(nh)}:00 itibarıyla ${cmp==='usual'?'olağan gününden':'dünden'} ${f(Math.abs(diff))} ${diff>=0?'fazla':'az'}.`,`${f(Math.abs(diff))} ${diff>=0?'more':'fewer'} than ${cmp==='usual'?'your usual day':'yesterday'} by ${z(nh)}:00.`):TT(`Hedefin ${f(goal)} · %${Math.round(tot/goal*100)}`,`Goal ${f(goal)} · ${Math.round(tot/goal*100)}%`)}</span></div>
   <div class="dp-t">Günün hareketi</div><div class="dp-c"><div class="seg2">${[['cum','Birikimli'],['hr','Saatlik']].map(([k,l])=>`<button class="${mode===k?'on':''}" onclick="ui_tr('stpM','${k}')">${l}</button>`).join('')}</div>
    ${chart||'<div class="lbl" style="padding:30px 0;text-align:center">Saatlik adım verisi Fitbit eşitlenince gelir.</div>'}
    ${sh?`<div class="lgd"><span><i style="background:#34d399"></i>Bugün</span>${ref?`<span><i style="background:rgba(255,255,255,.55)"></i>${cmp==='usual'?'Olağan gün':'Dün'}</span>`:''}</div><div class="seg2" style="margin-top:12px">${[['usual','Olağan gün'],['yd','Dün']].map(([k,l])=>`<button class="${cmp===k?'on':''}" onclick="ui_tr('stpC','${k}')">${l}</button>`).join('')}</div>`:''}</div>
   <div class="dp-t">Haftan <small>${f(avg)} adım / gün</small></div><div class="dp-c"><div class="wbars">${wk.map((k2,i)=>`<div onclick="ui_cbT(this,'${wv[i]!=null?f(wv[i])+' adım':'veri yok'}')"><i style="height:${wv[i]==null?3:Math.max(4,wv[i]/wm*100)}%;background:${wv[i]==null?'rgba(127,127,140,.15)':wv[i]===Math.max(...wv.filter(q=>q!=null))?'#ff3b4f':wv[i]>=goal?'#34d399':'rgba(52,211,153,.45)'}"></i><span>${new Date(k2+'T12:00').toLocaleDateString(LOC(),{weekday:'short'})}</span></div>`).join('')}<em style="bottom:${goal/wm*100}%"></em></div></div>
   <div class="dp-t">İlgili hareket</div><div class="dp-c" style="padding:4px 18px">${rel.map(r=>`<div class="drl"><span>${r[0]}<small style="display:block;opacity:.5;font-weight:400">${r[2]}</small></span><div><b>${r[1]}</b></div></div>`).join('')}</div>
   <div style="height:120px"></div></div>`}
