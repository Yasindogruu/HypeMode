/* ================= Uyarlanabilir kalori (MacroFactor tarzı) ================= */
function wTrend(n=60){const bw=S.body.filter(b=>b.weight!=null).sort((a,b)=>a.date<b.date?-1:1);if(!bw.length)return[];
  const start=bw[0].date,end=dkey(),out=[];let tr=null,i=0;const map={};bw.forEach(b=>map[b.date]=b.weight);
  for(let d=start;d<=end;d=addD(d,1)){const w=map[d];if(w!=null)tr=tr==null?w:tr+0.1*(w-tr);if(tr!=null)out.push({d,w:w??null,t:tr});if(++i>800)break}
  return out.slice(-n)}
function adaptTDEE(){const T=wTrend(400),pr=S.profile;if(T.length<10)return{need:'w',have:T.length};
  const N=Math.min(28,T.length-1),a=T[T.length-1-N],b=T[T.length-1],days=lastNDays(dkey(),N).filter(d=>d>a.d);
  const logged=days.filter(d=>dayMeals(d).length&&dayTotals(d).kcal>500);if(logged.length<Math.max(7,days.length*.6))return{need:'f',have:logged.length,of:days.length};
  const intake=logged.reduce((s,d)=>s+dayTotals(d).kcal,0)/logged.length,slope=(b.t-a.t)/N,tdee=Math.round((intake-slope*7700)/10)*10;
  const f=calcTargets(pr),adj=pr.goal==='cut'?-rateKg(pr,b.t)*7700/7:pr.goal==='bulk'?rateKg(pr,b.t)*7700/7:0;
  const kcal=Math.round((tdee+adj)/10)*10,floor=Math.max(f?f.bmr:1200,pr.sex==='f'?1200:1500);
  return{tdee,intake:Math.round(intake),wk:r1(slope*7*100)/100,trend:r1(b.t),kcal:Math.max(floor,kcal),formula:f?f.tdee:null,days:N,logged:logged.length,adj:Math.round(adj)}}
function wChart(T){if(T.length<2)return '';const W=320,Hh=110,ws=T.flatMap(x=>[x.t,x.w]).filter(v=>v!=null),mn=Math.min(...ws)-.3,mx=Math.max(...ws)+.3,X=i=>i/(T.length-1)*W,Y=v=>Hh-(v-mn)/(mx-mn)*Hh;
  return `<svg aria-hidden="true" viewBox="0 -4 ${W} ${Hh+22}" class="wch">${T.map((x,i)=>x.w!=null?`<circle cx="${X(i)}" cy="${Y(x.w)}" r="2.6" fill="rgba(255,255,255,.35)"/>`:'').join('')}
   <polyline fill="none" stroke="${SCC.w}" stroke-width="2.6" stroke-linejoin="round" points="${T.map((x,i)=>X(i).toFixed(1)+','+Y(x.t).toFixed(1)).join(' ')}"/>
   <text x="0" y="${Hh+16}">${new Date(T[0].d+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</text><text x="${W-40}" y="${Hh+16}">bugün</text></svg>`}
function adaptCard(){const A2=adaptTDEE(),T=wTrend(42),st=S.settings;
  return `<div class="card adc"><div class="row between"><b>🎯 Uyarlanabilir kalori hedefi</b><button class="pill" onclick="A.adaptInfo()">ⓘ</button></div>
   ${T.length>=2?`<div class="lbl" style="margin-top:6px">Kilo eğilimi (çizgi) · noktalar günlük tartı</div>${wChart(T)}`:''}
   ${A2.need==='w'?`<p class="lbl" style="line-height:1.5;margin-top:8px">Gerçek harcamanı hesaplamak için en az <b>2 haftalık kilo</b> ve öğün kaydı gerekiyor (şu an ${A2.have} gün). Haftada 3–4 kez, sabah aç karnına tartıl ve Yemek sekmesinden kilonu gir.</p>`
   :A2.need==='f'?`<p class="lbl" style="line-height:1.5;margin-top:8px">Kilo verin hazır; öğün kayıtların az (${A2.have}/${A2.of} gün). Günlerin en az %60'ında öğünlerini kaydedince gerçek harcaman hesaplanır.</p>`
   :`<div class="ad-g"><div><b>${A2.tdee.toLocaleString('tr-TR')}</b><small>gerçek harcaman</small></div><div><b>${A2.intake.toLocaleString('tr-TR')}</b><small>ort. aldığın</small></div><div><b style="color:${A2.wk<0?'#3fd0ff':A2.wk>0?'#ffb547':'#fff'}">${A2.wk>0?'+':''}${fmt(A2.wk)}</b><small>kg / hafta</small></div></div>
    <div class="ad-s">Hedefine göre önerilen: <b>${A2.kcal.toLocaleString('tr-TR')} kcal</b>${A2.kcal!==st.kcal?` <span class="lbl">(şu an ${st.kcal})</span>`:' ✓'}${A2.formula?`<br><small>Formül tahmini ${A2.formula.toLocaleString('tr-TR')} kcal'di; senin vücudun ${Math.abs(A2.tdee-A2.formula).toLocaleString('tr-TR')} kcal ${A2.tdee>A2.formula?'daha fazla':'daha az'} harcıyor.</small>`:''}</div>
    ${Math.abs(A2.kcal-st.kcal)>=50?`<button class="btn" style="margin-top:10px" onclick="A.adaptApply()">Hedefi ${A2.kcal.toLocaleString('tr-TR')} kcal yap</button>`:''}`}</div>`}

/* ================= Uyku koçu ================= */
function sleepCoach(){const H=HD(),d=dkey(),sc=healthToday(),SC=S.sleepCoach||{};
  const wakes=lastNDays(d,7).map(k=>((H[k]||{}).sleep||{}).wake).filter(Boolean).map(hm);
  const wake=SC.wake?hm(SC.wake):wakes.length>=3?Math.round(wakes.reduce((a,b)=>a+b,0)/wakes.length/5)*5:450;
  const OPT=sleepOptimal(),BS=bedSpread();let need=SC.need||(OPT?OPT.min:480);const why=[];if(!SC.need&&OPT)why.push(`Senin verinde en iyi toparlanma ${fmtMin(OPT.min)} uykuda (ort. %${OPT.rec})`);if(BS!=null&&BS>45)why.push(`Yatış saatin ±${BS} dk oynuyor; sabit saat toparlanmayı artırır`);const debt=sleepDebt(d);
  if(debt>60){const add=Math.min(45,Math.round(debt/7/5)*5);if(add){need+=add;why.push(`7 günlük uyku borcun ${fmtMin(debt)} → +${add} dk`)}}
  const stn=strainOf(d);if(stn!=null&&stn>=14){need+=20;why.push(`Bugünkü yükün yüksek (${fmt(stn)}) → +20 dk`)}
  if(sc&&sc.rec!=null&&sc.rec<40){need+=20;why.push(`Toparlanman düşük (%${sc.rec}) → +20 dk`)}
  if(trainedOn(d).length&&!why.some(w=>w.includes('yük'))){need+=10;why.push('Bugün antrenman yaptın → +10 dk')}
  const lat=15,bed=((wake-need-lat)%1440+1440)%1440,f=m=>z(Math.floor(m/60)%24)+':'+z(m%60);
  return{bed:f(bed),wake:f(wake),need,why,lat,real:!!(sc&&!sc.demo),hasData:hasHealth()}}
function sleepCoachCard(){const c=sleepCoach();
  return `<div class="card slc" onclick="A.sleepCoachInfo()"><div class="row between"><b>🌙 Uyku koçu</b><span class="lbl">${c.real?'verine göre':'tahmini'} ›</span></div>
   <div class="slc-r"><div><small>Bu gece yat</small><b>${c.bed}</b></div><i>→</i><div><small>Kalk</small><b>${c.wake}</b></div><div><small>Uyku ihtiyacı</small><b>${fmtMin(c.need)}</b></div></div>
   <div class="lbl" style="margin-top:6px" onclick="event.stopPropagation();A.swake()">⏰ Akıllı uyandırma: <b style="color:var(--txt)">${S.swake&&S.swake.on?hmT(swPlan().t):'kapalı'}</b> ›</div>
   ${c.why.length?`<div class="lbl" style="margin-top:6px">${c.why[0]}${c.why.length>1?' +'+(c.why.length-1):''}</div>`:''}${!c.real?'<div class="lbl" style="margin-top:4px;font-size:11.5px">Fitbit bağlanınca uyku borcun, HRV ve toparlanmana göre kişiselleşir.</div>':''}</div>`}

/* ================= İlerleme fotoğrafları ================= */
const bodyPh=()=>S.photos.filter(p=>p.kind==='body').sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);
const wOn=d=>{const b=S.body.filter(x=>x.weight!=null&&x.date<=d).sort((a,c)=>a.date<c.date?-1:1).pop();return b?b.weight:null};
function progCard(){const P=bodyPh(),sel=ui.pcSel&&ui.pcSel.length===2?ui.pcSel:P.length>=2?[P[0].id,P[P.length-1].id]:null,A1=sel&&P.find(p=>p.id===sel[0]),B1=sel&&P.find(p=>p.id===sel[1]);
  const pos=ui.pcPos??50,dd=(a,b)=>Math.round((new Date(b.date+'T12:00')-new Date(a.date+'T12:00'))/864e5);
  return `<div class="card prc"><div class="row between"><b>📸 İlerleme fotoğrafları</b><span class="lbl">${P.length} fotoğraf</span></div>
   ${A1&&B1?`<div class="cmp" id="cmp"><img src="${A1.img}" alt=""><div class="cmp-b" style="clip-path:inset(0 0 0 ${pos}%)"><img src="${B1.img}" alt=""></div><i class="cmp-l" style="left:${pos}%"></i>
     <span class="cmp-t l">${new Date(A1.date+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})}${wOn(A1.date)?' · '+fmt(wOn(A1.date))+' kg':''}</span><span class="cmp-t r">${new Date(B1.date+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})}${wOn(B1.date)?' · '+fmt(wOn(B1.date))+' kg':''}</span></div>
    <input type="range" class="ob-rng" min="0" max="100" value="${pos}" oninput="A.pcPos(this.value)" style="margin:12px 0 4px">
    <div class="lbl" style="text-align:center">${dd(A1,B1)} gün arayla${wOn(A1.date)&&wOn(B1.date)?` · ${wOn(B1.date)-wOn(A1.date)>0?'+':''}${fmt(r1(wOn(B1.date)-wOn(A1.date)))} kg`:''} · kaydırarak karşılaştır</div>`
   :`<div class="lbl" style="margin:8px 0;line-height:1.5">Aynı ışıkta, aynı açıdan ve aynı kıyafetle (ör. her 2 haftada bir sabah) fotoğraf çek. En az 2 fotoğraf olunca öncesi/sonrası karşılaştırması burada görünür.</div>`}
   ${P.length?`<div class="pc-th">${P.map(p=>`<button class="${sel&&sel.includes(p.id)?'on':''}" style="background-image:url(${p.img})" onclick="A.pcPick('${p.id}')"><em onclick="event.stopPropagation();A.pcDel('${p.id}')">✕</em><span>${new Date(p.date+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</span></button>`).join('')}</div>
    <div class="lbl" style="font-size:11.5px;margin-top:4px">Karşılaştırmak için iki fotoğraf seç</div>`:''}
   <div class="grid2" style="margin-top:10px"><label class="btn" style="cursor:pointer">📷 Çek<input type="file" accept="image/*" capture="user" hidden onchange="A.pcAdd(this)"></label><label class="btn ghost" style="cursor:pointer">🖼️ Galeri<input type="file" accept="image/*" hidden onchange="A.pcAdd(this)"></label></div></div>`}
/* ---------- render ---------- */
/* iPhone uygulaması (Xcode): hatırlatmaları telefonun kendi bildirimlerine planla */
function nativeRem(){const H=window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.hm;if(!H||!window.HM_NATIVE)return;
  const R=remCfg(),it=[],at=(t,o)=>{const[h,m]=String(t).split(':').map(Number);if(isFinite(h))it.push({h,m:m||0,...o})};
  if(R.water.on)for(let h=R.water.from;h<=R.water.to;h+=Math.max(1,R.water.every))it.push({h,m:0,title:'Su iç! 💧',body:'Bir bardak su iç ve HypeMode\'a kaydet.'});
  if(R.meal.on)R.meal.times.forEach((t,i)=>at(t,{title:(R.meal.times.length===3?['Kahvaltı','Öğle yemeği','Akşam yemeği'][i]:'Yemek')+' vakti 🍽️',body:'Yediğini kaydetmeyi unutma.'}));
  if(R.supp.on)at(R.supp.time,{title:'Takviye zamanı 💊',body:'Bugünkü takviyelerini al.'});
  if(R.train.on)(R.train.days||[]).forEach(d=>at(R.train.time,{wd:d+1,title:'Antrenman vakti 🏋️',body:'Bugün antrenman günün.'}));
  if(R.sleep.on)at(R.sleep.time,{title:'Uyku vakti yaklaşıyor 🌙',body:'Ekranları kapat, 7–9 saat uyku toparlanmanın temeli.'});
  const k=JSON.stringify(it);if(k===nativeRem.k)return;nativeRem.k=k;try{H.postMessage({type:'reminders',items:it})}catch(e){}}
function render(keep){const t0=performance.now();try{return render_(keep)}finally{const d=performance.now()-t0;PERF.renders++;PERF.renderMs+=d;if(d>PERF.renderMax)PERF.renderMax=d;if(PERF.boot==null)PERF.boot=performance.now()}}
function render_(keep){try{applyTheme()}catch(e){}try{nativeRem()}catch(e){}
  const v=ui.view,y=window.scrollY;
  let h='';
  const OB=!S.onboarded&&!S.active;
  const CW=OB&&rzC()&&!CL.loaded&&!CL.skipW&&(CL.status==='loading'||CL.status==='offline'||!CL.ready);
  const view=()=>{if(CW)return `<div class="cwait"><i class="sp"></i><b>${TT('Verilerin yükleniyor','Loading your data')}</b><p>${CL.status==='offline'?TT('Bağlantı yavaş. Bulut verin gelene kadar bekleniyor.','Slow connection. Waiting for your cloud data.'):TT('Hesabındaki bilgiler getiriliyor…','Fetching your account data…')}</p>${CL.status==='offline'?`<button class="btn ghost" onclick="CL.skipW=1;render(true)">${TT('Yine de devam et','Continue anyway')}</button>`:''}</div>`;if(OB)return onbV();if(v==='home')return homeV();if(v==='dday')return ddayV();if(v==='hrd')return withDemo(()=>heartDV2())+aiFab('hrd');if(v==='slp')return withDemo(()=>sleepDV())+aiFab('slp');if(v==='yuk')return withDemo(()=>yukDV())+aiFab('yuk');if(v==='stp')return withDemo(()=>stepsDV())+aiFab('stp');if(v==='plan')return planV();if(v==='workout')return workoutV();if(v==='summary')return summaryV();
    if(v==='food')return foodV();if(v==='nprog')return nprogV();if(v==='tprog')return tprogV();if(v==='guide')return guideV();if(v==='programs')return programsV();if(v==='settings')return settingsV();
    if(v==='cycle')return cycleV();if(v==='friends')return friendsV();if(v==='mealplan'){ui.view='food';return foodV()}if(v==='stats'){ui.view='home';return homeV()}if(v==='homewk')return homeWkV();if(v==='tools'){ui.view='programs';return programsV()}if(v==='tool')return toolPageV();if(v==='academy')return academyV();if(v==='exd')return exdV();return homeV()};
  try{h=view()}catch(err){console.error(err);
    if(v==='homewk'&&!render._r){render._r=1;try{ui.gen=null;if(S.homeGen){delete S.homeGen.last}save();h=view()}catch(e2){h=''}render._r=0}
    if(!h)h=`<div class="card" style="margin-top:60px"><b>⚠️ Bu ekran açılamadı</b><div class="lbl" style="margin:8px 0 12px">${esc(String(err&&err.message||err))}</div><button class="btn" onclick="A.go('home')">Ana sayfaya dön</button></div>`}
  const MT=['home','food','nprog','tprog','guide','programs','mealplan','stats','homewk','tools','tool','academy','exd','friends'].includes(ui.view);
  if(!OB)h+=tabs(!MT);
  $app.classList.toggle('dsk',!OB);
  $app.dataset.v=ui.view;$app.classList.toggle('dk',!OB&&!matchMedia('(pointer:coarse)').matches&&['home','food','programs','stats','settings','friends'].includes(ui.view));$app.classList.toggle('vprog',ui.view==='programs');document.body.classList.toggle('wfm',ui.view==='workout'&&!!S.settings.wfocus);$app.classList.toggle('vtools',['tools','tool','academy','exd'].includes(ui.view));
  try{const o=$app.querySelector('nav.tabs .tlens'),n=$app.querySelector('nav.tabs');if(o&&n&&o.style.opacity!=='0')tabLens._p=o.getBoundingClientRect().left-n.getBoundingClientRect().left}catch(e){}h=h.replace(/<img (?![^>]*loading=)/g,'<img loading="lazy" decoding="async" ');if(keep&&render._v===v&&S.settings.morph!==false&&$app.firstChild){try{morphHTML($app,h)}catch(e){PERF.err('morph: '+e.message);$app.innerHTML=h}}else $app.innerHTML=h;void $app.offsetHeight;try{secOrder()}catch(e){}try{m3dScan()}catch(e){}try{b3dScan()}catch(e){RF&&RF.err&&RF.err('b3d: '+e.message)}try{tabLens()}catch(e){}try{fcCount()}catch(e){}try{navCam()}catch(e){}try{widgetSoon()}catch(e){}try{stripEmo($app)}catch(e){}if(render._v!==v){render._v=v;$app.classList.remove('vin');void $app.offsetWidth;$app.classList.add('vin');clearTimeout(render._vt);render._vt=setTimeout(()=>$app.classList.remove('vin'),900)}if((!OB||(!window.HM_PWA&&CL.waitRz))&&!(S.settings.rz&&S.settings.rz.v>=2)&&!ui._rzOpen&&!render._rzT){render._rzT=setTimeout(()=>{render._rzT=0;rzMaybe()},1200)}try{wgApply(ui.view)}catch(e){console.warn(e)}try{dkSplit();navCam();tabLens()}catch(e){}
  if(v==='workout'){restBar();const c=document.querySelector('.exs.on');if(c&&c.parentElement)c.parentElement.scrollLeft=c.offsetLeft-c.parentElement.clientWidth/2+c.clientWidth/2}
  window.scrollTo(0,keep?y:0);
}
