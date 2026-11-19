/* ===== Kişiye özel antrenman programı (12 hafta, 3 faz) ===== */
const TPG=[['muscle','Kas kazanımı','Build muscle'],['fat','Yağ yakımı','Fat loss'],['recomp','Sıkılaşma','Recomp'],['strength','Güç','Strength'],['health','Sağlıklı yaşam','General health']];
const TPF=[['bal','Dengeli','Balanced'],['glute','Kalça & bacak','Glutes & legs'],['upper','Üst vücut','Upper body'],['arms','Kol & omuz','Arms & shoulders']];
/* slot: [kas, tip(c/i), alt bölge, kod] */
const TPS={Q:['quads','c'],Q2:['quads','c'],QI:['quads','i'],H:['hamstrings','c'],HI:['hamstrings','i'],G:['glutes','c'],GI:['glutes','i'],CAL:['calves','i'],
  CU:['chest','c','upper'],CM:['chest','c','mid'],CI:['chest','i'],BL:['back','c','lat'],BM:['back','c','mid'],SP:['shoulders','c','front'],SS:['shoulders','i','side'],SR:['shoulders','i','rear'],BI:['biceps','i'],TR:['triceps','i'],CO:['core','i']};
const TPD={
  fa:['Tüm vücut A','Full body A',['Q','CM','BL','HI','SS','CO']],
  fb:['Tüm vücut B','Full body B',['H','CU','BM','Q2','SR','BI']],
  fc:['Tüm vücut C','Full body C',['Q','SP','BL','G','TR','CAL']],
  ua:['Üst vücut A','Upper A',['CM','BM','SP','BL','SS','TR','BI']],
  la:['Alt vücut A','Lower A',['Q','H','Q2','HI','CAL','CO']],
  ub:['Üst vücut B','Upper B',['CU','BL','CI','BM','SS','SR','BI']],
  lb:['Alt vücut B','Lower B',['H','G','Q2','QI','HI','CAL']],
  pu:['İtiş (göğüs, omuz, arka kol)','Push',['CU','CM','SP','SS','CI','TR']],
  pl:['Çekiş (sırt, ön kol)','Pull',['BL','BM','BL','SR','BI','BI']],
  lg:['Bacak','Legs',['Q','H','Q2','HI','GI','CAL']],
  pu2:['İtiş B','Push B',['CM','SP','CU','SS','TR','TR']],
  pl2:['Çekiş B','Pull B',['BM','BL','BM','SR','BI','CO']],
  lg2:['Bacak B','Legs B',['H','G','Q','QI','HI','CAL']],
  ct:['Göğüs & arka kol','Chest & triceps',['CM','CU','CM','CI','TR','TR','CO']],
  bb:['Sırt & ön kol','Back & biceps',['BL','BM','BM','BL','BI','BI']],
  lgb:['Bacak','Legs',['QI','Q2','Q','Q2','HI','HI','CAL']],
  ct2:['Göğüs & arka kol B','Chest & triceps B',['CM','CU','CI','CI','TR','TR']],
  sb:['Omuz & ön kol','Shoulders & biceps',['SP','SS','SR','SS','BI','BI','CO']]};
function tpSplit(days,lvl,st){if(days===5&&st==='bro')return['ct','bb','lgb','ct2','sb'];return days<=2?['fa','fb']:days===3?(lvl>=2?['ua','la','fb']:['fa','fb','fc']):days===4?['ua','la','ub','lb']:days===5?['ua','la','pu','pl','lg']:['pu','pl','lg','pu2','pl2','lg2']}
function tpS(){if(!S.tp||typeof S.tp!=='object')S.tp={};const T=S.tp,p=S.profile||{};
  if(!T.goal){const g=p.goal;T.goal=g==='cut'?'fat':g==='bulk'?'muscle':'recomp'}
  T.lvl=T.lvl||(S.sessions.length>60?2:1);T.days=T.days||3;T.dur=T.dur||60;T.focus=T.focus||'bal';T.joint=!!T.joint;return T}
const tpWeek=T=>{if(!T.start)return 1;const d=Math.floor((new Date(dkey()+'T12:00')-new Date(T.start+'T12:00'))/864e5);return (Math.max(0,Math.floor(d/7))%12)+1};
function tpDeloads(l){return l>=3?[6,12]:l===2?[8,12]:[12]}
function tpPhase(T,w){if(tpDeloads(T.lvl).includes(w)||(T.dlw===w&&T.dlAt&&(Date.now()-new Date(T.dlAt+'T12:00').getTime())<8*864e5))return{k:'dl',n:TT('Toparlanma (deload) haftası','Deload week'),d:TT('Setler yarıya iner, ağırlık aynı kalır; tükenişe 3–4 tekrar kala bitir. Bu hafta vücut toparlanır, sonraki hafta genellikle daha güçlü dönersin.','Sets are halved, weights stay; stop 3–4 reps short of failure. You usually come back stronger next week.')};
  return w<=4?{k:'p1',n:TT('Faz 1 · Temel','Phase 1 · Foundation'),d:TT('Tekniği oturt, ağırlıkları bul. Setleri tükenişe 2–3 tekrar kala bitir.','Nail technique and find your weights. Stop sets 2–3 reps short of failure.')}
   :w<=8?{k:'p2',n:TT('Faz 2 · Hacim','Phase 2 · Volume'),d:TT('İzole hareketlere 1 set eklenir, setler tükenişe 1–2 tekrar kala biter.'+(T.lvl>=2?' Kol hareketleri süperset yapılır.':''),'One extra set on isolation moves, stop 1–2 reps short of failure.'+(T.lvl>=2?' Arm moves are supersetted.':''))}
   :{k:'p3',n:TT('Faz 3 · Yoğunluk','Phase 3 · Intensity'),d:TT('Ana hareketlerde tekrar düşer, ağırlık artar.'+(T.lvl>=2?' İzole hareketlerin son setinde rest-pause'+(T.lvl>=3?', bazılarında drop set':'')+'.':''),'Lower reps and heavier weights on main lifts.'+(T.lvl>=2?' Rest-pause on the last isolation set'+(T.lvl>=3?', drop sets on some':'')+'.':''))}}
function tpRx(T,e,ph){const b=e.tp,old=(+S.profile.age||0)>=50,goal=T.goal,lvl=T.lvl,c=b.ty==='c',small=/calves|core/.test(e.muscle)||b.code==='SS'||b.code==='SR';
  let sets=c?(lvl>=3&&b.first?4:3):(lvl===1?2:3),lo,hi;
  if(goal==='health'){sets=Math.min(sets,c?3:2);lo=c?8:12;hi=c?12:15}
  else if(c){if(b.first&&goal==='strength'&&lvl>=2){lo=3;hi=6}else if(b.first&&lvl>=2){lo=6;hi=10}else{lo=8;hi=12}}
  else{lo=small?12:10;hi=small?20:15}
  if(old){sets=Math.min(sets,3);if(c&&lo<8){lo=8;hi=12}}
  if(ph.k==='p2'&&!c&&goal!=='health')sets+=1;
  if(ph.k==='p3'&&c&&goal!=='health'){lo=Math.max(old?8:4,lo-2);hi=Math.max(lo+2,hi-2)}
  if(ph.k==='dl')sets=Math.max(1,Math.round(sets/2));
  if(T.sex==='f'&&T.focus==='glute'&&/glutes|hamstrings/.test(e.muscle)&&ph.k!=='dl')sets+=1;
  if(T.style==='bro'&&T.days===5&&goal!=='health'){if(c){lo=8;hi=lvl===1?15:12}else{lo=10;hi=15}if(ph.k!=='dl')sets=small?3:4}
  let last='n',tech='';
  if(lvl>=2&&ph.k==='p3'&&!c&&goal!=='health'){if(lvl>=3&&/biceps|triceps|shoulders/.test(e.muscle)){last='d';tech=TT('Son set drop set: ağırlığı %20–30 azalt, hemen tükenişe kadar devam et.','Last set drop set: cut the weight 20–30% and go to failure.')}else{last='r';tech=TT('Son set rest-pause: 10–15 sn dinlen, 3–5 tekrar daha; bunu 2–3 kez yap.','Last set rest-pause: rest 10–15 s, do 3–5 more reps, 2–3 times.')}}
  if(lvl>=2&&ph.k==='p3'&&c&&b.first&&goal!=='health'){tech=TT(`Ters piramit: 1. set en ağır (${lo}), sonraki setlerde ağırlığı ~%10 azaltıp tekrarı artır.`,`Reverse pyramid: heaviest first set (${lo}), then drop ~10% and add reps.`)}
  if(lvl>=2&&ph.k==='p2'&&/biceps|triceps/.test(e.muscle))tech=TT('Süperset: kol hareketlerini arka arkaya, dinlenmeden yap.','Superset: do the arm moves back to back.');
  const rest=T.style==='bro'&&T.days===5?(/quads|hamstrings|glutes/.test(e.muscle)?'90 sn':'1 dk'):c?(b.first&&lo<=6?'2–3 dk':'2 dk'):'60–90 sn',rir=ph.k==='dl'?'3–4':ph.k==='p1'?(lvl===1?'2–3':'2'):c?'1–2':'0–1';
  if(T.style==='bro'&&T.days===5&&c&&!tech&&ph.k!=='dl')tech=TT('Piramit: her sette ağırlığı artırıp tekrarı düşür (ör. 15-12-10-8).','Pyramid: add weight and drop reps each set (e.g. 15-12-10-8).');
  e.sets=sets;e.repMin=lo;e.repMax=hi;e.last=last;e.note=[TT(`Dinlenme ${rest} · tükenişe ${rir} tekrar kala bitir.`,`Rest ${rest} · stop ${rir} reps short of failure.`),tech,b.cue].filter(Boolean).join(' ')}
function tpEq(){return S.settings.loc==='home'?homeEq():EQ.map(q=>q[0])}
function tpBuild(){const T=tpS();T.sex=(S.profile.sex==='f')?'f':'m';const eq=tpEq(),lvl=T.lvl,split=tpSplit(T.days,lvl,T.style),used=[],out=[],cnt={},bad=T.joint?/Deadlift|Squat \(Barbell\)|Front Squat|Good Morning|Rack Pull|Zercher|Behind|Upright|Dips?\b/i:null;
  split.forEach((k,di)=>{let slots=[...TPD[k][2]];
    if(T.focus==='glute'&&/^l|lg|f/.test(k))slots=slots.map(s=>s==='Q2'?'G':s==='CO'?'GI':s).concat(['GI']);
    if(T.focus==='upper'&&/^u|pu|f/.test(k))slots.push('CI');
    if(T.focus==='arms'&&/^u|pl|pu|f/.test(k))slots.push(/pl/.test(k)?'BI':'TR','SS');
    const max=Math.max(4,Math.floor(T.dur/9));slots=slots.slice(0,max);const ex=[],dayUsed=[];
    slots.forEach((code,si)=>{const[m,ty,sub]=TPS[code];cnt[code]=(cnt[code]||0)+1;
      let x=S.settings.loc!=='home'?tpGymPick(code,T,{day:dayUsed,week:used,first:si===0},cnt[code]-1):null;if(!x){let pool=genPool(m,eq,Math.max(lvl,1),dayUsed,sub).filter(x=>x[5]===ty||(ty==='i'&&x[5]==='c'&&m==='calves'));if(bad)pool=pool.filter(x=>!bad.test(x[0]));
      const fresh=pool.filter(x=>!used.includes(x[0]));x=genPick(fresh.length?fresh:pool,lvl,ty)}
      if(!x){let p2=genPool(m,eq,3,dayUsed).filter(y=>y[5]!=='t');if(bad)p2=p2.filter(y=>!bad.test(y[0]));x=genPick(p2,lvl,ty)}
      if(!x)return;dayUsed.push(x[0]);used.push(x[0]);const e=genEx(x,lvl,dayUsed);
      if(S.settings.loc!=='home'&&!['bodyweight','band'].includes(x[3])){delete e.fix;delete e.kgs;delete e.startKg}
      e.tp={code,ty:x[5]==='c'?'c':'i',first:si===0||(si===1&&ex.length===1&&ty==='c'&&TPD[k][2][0]!==code&&false),cue:x[6]||''};ex.push(e)});
    out.push({name:`${di+1}. ${TT('gün','day')} · ${TT(TPD[k][0],TPD[k][1])}`,k,exercises:ex})});
  return out}
function tpApply(force){const T=tpS();if(!T.ids||!T.ids.length)return;const w=tpWeek(T);if(!force&&T.aw===w)return;const ph=tpPhase(T,w);
  T.ids.forEach(id=>{const p=S.plans.find(x=>x.id===id);if(!p)return;p.exercises.forEach(e=>{if(e.tp)tpRx(T,e,ph)})});T.aw=w;save()}
function tpCardio(T){const x=(S.wplan&&S.wplan.cardio)||0;return (x?TT(`2 haftalık kontrolden: kardiyoya +${x} dk ekle. `,`From your check-in: add ${x} min cardio. `):'')+(T.goal==='fat'||T.goal==='recomp'?TT('Her antrenmandan sonra 15 dk eğimli yürüyüş (eğim 8–12, hız 4,5–5,5) ya da bisiklet; haftada toplam 150 dk orta tempo hedefle.','After each session 15 min incline walk (8–12% incline, 4.5–5.5 km/h) or cycling; aim for 150 min of moderate cardio a week.')
  :T.goal==='health'?TT('Haftada en az 150 dk orta tempo kardiyo (tempolu yürüyüş, bisiklet, yüzme) ekle.','Add at least 150 min of moderate cardio a week.')
  :TT('Kalp sağlığı için haftada 2–3 kez 20–30 dk hafif kardiyo yeterli; bacak gününden hemen önce yapma.','2–3 × 20–30 min light cardio a week is enough; not right before leg day.'))}
const TPI=[
 ['Nasıl ilerlerim? (çift ilerleme)','How to progress',[['Her harekette bir tekrar aralığı var (ör. 8–12). Aynı ağırlıkla tüm setlerde aralığın üst sınırına ulaşınca ağırlığı artır: üst vücutta 1–2,5 kg, alt vücutta 2,5–5 kg.','Each move has a rep range (e.g. 8–12). When you hit the top on all sets, add weight: 1–2.5 kg upper, 2.5–5 kg lower body.'],['Ağırlığı artırınca tekrar düşerse normaldir; aynı ağırlıkta kalıp tekrar aralığın üstüne çıkana kadar devam et.','Reps dropping after a jump is normal; stay there until you reach the top again.'],['Haftadan haftaya kayıtlarına bak: ya ağırlık ya tekrar artmalı. Uygulama son antrenmanına göre ağırlık önerir.','Check your log: weight or reps should rise week to week. The app suggests weights from your last session.']]],
 ['Ne kadar zorlamalıyım? (RIR)','How hard? (RIR)',[['RIR = setin sonunda yapabileceğin kalan tekrar. "2 tekrar kala" = 2 tekrar daha yapabilecekken bırak.','RIR = reps left in the tank. "2 RIR" means stop when 2 more were possible.'],['Kas gelişimi tükenişe yaklaştıkça artar; güç gelişimi geniş bir aralıkta benzerdir. Ağır çok eklemli hareketlerde (squat, deadlift) tükenişe gitme, izole hareketlerde 0–1 kala olur.','Hypertrophy improves closer to failure; strength is similar across a wide range. Don\'t grind heavy compounds to failure; 0–1 RIR is fine on isolations.']]],
 ['Haftalık hacim','Weekly volume',[['Kas başına haftada 10–20 zorlu set kas gelişimi için en iyi aralık: başlangıçta ~10, ileri seviyede 16–20.','10–20 hard sets per muscle per week works best: ~10 for beginners, 16–20 for advanced.'],['Her kası haftada en az 2 kez çalıştır; toplam hacim aynıysa sıklık tek başına fark yaratmaz.','Train each muscle at least twice a week; at equal volume, frequency alone matters little.'],['En iyi program sürdürebildiğin programdır: düzenli 12 hafta, mükemmel ama yarım bırakılan programdan iyidir.','The best program is the one you stick with.']]],
 ['Isınma, dinlenme ve deload','Warm-up, rest and deload',[['5–10 dk hafif kardiyo + ilk harekette 2–3 hafif ısınma seti (boş bar, %50, %75).','5–10 min easy cardio + 2–3 ramp-up sets on the first lift.'],['Set arası: ağır çok eklemlilerde 2–3 dk, izolelerde 60–90 sn. Kısa dinlenme yağ yakmaz, sadece performansı düşürür.','Rest 2–3 min on heavy compounds, 60–90 s on isolations.'],['Deload haftasında setler yarıya iner, ağırlık aynı kalır. Performans 2 hafta düşüyorsa, 72 saatten uzun kas ağrısı ya da sürekli yorgunluk varsa erken deload yap.','On deload weeks halve the sets, keep weights. Deload early if performance drops 2 weeks in a row, soreness lasts 72 h+ or you feel constantly drained.']]],
 ['Hareket değiştirme','Swapping exercises',[['Hareketi yalnızca aynı gruptan biriyle değiştir: yatay çekiş yerine yatay çekiş (row), dikey çekiş yerine dikey çekiş (pulldown/barfiks), üst göğüs press yerine üst göğüs press.','Only swap within the same group: row for row, pulldown for pulldown, incline press for incline press.'],['Hareketleri sık değiştirme; ilerlemeyi ölçmek için en az bir faz (4 hafta) aynı kalsın. Ekipman doluysa benzer makine seç.','Keep moves for at least a phase (4 weeks) so progress is measurable.']]],
 ['Kadınlar için','For women',[['Kadınlar da erkeklerle aynı ilkelerle, benzer oranda güçlenir ve kas kazanır; ağırlık kaldırmak "iri" yapmaz, sıkı ve şekilli gösterir.','Women progress on the same principles at similar relative rates; lifting builds a firm, shaped look, not bulk.'],['Kadınlar setler arasında daha hızlı toparlanır ve genelde biraz daha fazla hacmi tolere eder; kalça odaklı seçenek alt vücuda ekstra set ekler.','Women recover faster between sets and often tolerate a bit more volume; the glute focus adds lower-body sets.'],['Araştırmalar regl döngüsüne göre programı değiştirmenin kas ya da güç kazancını artırdığını göstermiyor. Kendini kötü hissettiğin günlerde ağırlığı azaltman yeterli.','Research doesn\'t show cycle-synced training improves gains; just go lighter on days you feel rough.']]],
 ['40 yaş üstü ve eklem hassasiyeti','Over 40 and sensitive joints',[['Haftada 2–3 gün kuvvet + 150 dk orta tempo kardiyo. Setler 8–12 tekrar aralığında, ısınmayı uzat.','2–3 strength days + 150 min moderate cardio a week; 8–12 reps, longer warm-ups.'],['Eklem hassasiyeti seçeneği barbell squat ve deadlift yerine makine, kablo ve dumbbell hareketleri seçer.','The joint option swaps barbell squats and deadlifts for machines, cables and dumbbells.'],['Ağrı (kas yorgunluğu değil, keskin eklem ağrısı) olursa hareketi bırak, doktora ya da fizyoterapiste danış.','Stop on sharp joint pain and see a doctor or physio.']]]];
function tpInfo(){return `<details class="card ninfo"><summary><b>${TT('Antrenman bilgileri','Training guide')}</b><span class="lbl">${TT('İlerleme, zorluk, hacim, deload','Progression, effort, volume, deload')}</span></summary>${TPI.map(([a,b,L])=>`<div class="gen-l" style="margin-top:14px">${TT(a,b)}</div><ul class="npw">${L.map(([x,y])=>`<li>${TT(x,y)}</li>`).join('')}</ul>`).join('')}<p class="lbl" style="margin:10px 0 0">${TT('Sağlık sorunun varsa programa başlamadan önce doktoruna danış.','See a doctor first if you have a health condition.')}</p></details>`}
function tprogV(){const T=tpS(),has=T.ids&&T.ids.some(id=>S.plans.find(p=>p.id===id)),chip=(on,txt,js)=>`<button class="${on?'on':''}" onclick="${js}">${txt}</button>`;
  if(has)tpApply();const w=tpWeek(T),ph=tpPhase(T,w),plans=has?T.ids.map(id=>S.plans.find(p=>p.id===id)).filter(Boolean):[];
  const form=`<div class="card"><b style="font-size:18px">${has?TT('Programı yeniden oluştur','Rebuild program'):TT('Programını oluştur','Build your program')}</b><p class="lbl" style="margin:4px 0 0;line-height:1.5">${TT('Hedefine, seviyene ve süresine göre 12 haftalık, 3 fazlı program. Her harekete set, tekrar, dinlenme ve zorluk yazılır; ağırlık önerileri kayıtlarından gelir.','A 12-week, 3-phase program for your goal, level and time, with sets, reps, rest and effort for every move.')}</p>
   <div class="wpl">${TT('Hedef','Goal')}</div><div class="npchips in">${TPG.map(([k,a,b])=>chip(T.goal===k,TT(a,b),`A.tpSet('goal','${k}')`)).join('')}</div>
   <div class="wpl">${TT('Seviye','Level')}</div><div class="seg3">${LVL.map((l,i)=>chip(T.lvl===i+1,l[0],`A.tpSet('lvl',${i+1})`)).join('')}</div><p class="lbl" style="margin:6px 0 0;font-size:12px">${LVL[T.lvl-1][1]}</p>
   <div class="wpl">${TT('Haftada kaç gün?','Days per week')}</div><div class="seg3">${[2,3,4,5,6].map(d=>chip(T.days===d,d,`A.tpSet('days',${d})`)).join('')}</div>
   ${T.days===5?`<div class="wpl">${TT('Bölünme türü','Split type')}</div><div class="seg3">${chip(T.style!=='bro',TT('Üst/alt + itiş/çekiş','Upper/lower + PPL'),"A.tpSet('style','ul')")}${chip(T.style==='bro',TT('Bölgesel','Body-part'),"A.tpSet('style','bro')")}</div><p class="lbl" style="margin:6px 0 0;font-size:12px;line-height:1.5">${TT('Bölgesel: göğüs-arka kol, sırt-ön kol, bacak, göğüs-arka kol, omuz-ön kol. Salonlarda en yaygın düzen; bacaklar haftada 1 kez çalışır.','Body-part: chest-tri, back-bi, legs, chest-tri, shoulders-bi. Legs once a week.')}</p>`:''}
   <div class="wpl">${TT('Bir antrenman süresi','Session length')}</div><div class="seg3">${[45,60,75,90].map(d=>chip(T.dur===d,d+' dk',`A.tpSet('dur',${d})`)).join('')}</div>
   <div class="wpl">${TT('Odak','Focus')}</div><div class="npchips in">${TPF.map(([k,a,b])=>chip(T.focus===k,TT(a,b),`A.tpSet('focus','${k}')`)).join('')}</div>
   <div class="wpl">${TT('Yer','Where')}</div><div class="seg3">${chip(S.settings.loc!=='home',TT('Salon','Gym'),"A.setLoc('gym')")}${chip(S.settings.loc==='home',TT('Ev','Home'),"A.setLoc('home')")}</div>
   <div class="wpl">${TT('Eklem ya da bel hassasiyeti','Sensitive joints / back')}</div><div class="seg3">${chip(!T.joint,TT('Yok','No'),"A.tpSet('joint',false)")}${chip(T.joint,TT('Var','Yes'),"A.tpSet('joint',true)")}</div>
   <p class="lbl" style="margin:12px 0 0;line-height:1.5">${TT('Bölünme','Split')}: ${tpSplit(T.days,T.lvl,T.style).map(k=>TT(TPD[k][0],TPD[k][1])).join(' · ')}</p>
   <button class="btn" style="margin-top:14px" onclick="A.tpMake()">${has?TT('Yeniden oluştur','Rebuild'):TT('Programı oluştur','Build program')}</button></div>`;
  const days=plans.map(p=>`<div class="card tpd"><div class="row between"><b>${esc(p.name)}</b><span class="lbl">~${planMin(p)} dk</span></div>${p.exercises.map(e=>`<div class="tpe"><span><b>${esc(e.tr||e.name)}</b><small>${esc(MUSCLES[e.muscle]||'')}${e.last==='r'?' · rest-pause':e.last==='d'?' · drop set':''}</small></span><em>${e.sets} × ${e.repMin}–${e.repMax}${(()=>{try{const g=suggest(e);return g&&g.kg?`<small>${fmt(g.kg)} kg</small>`:''}catch(_){return ''}})()}</em></div>`).join('')}
    <div class="row" style="gap:8px;margin-top:12px"><button class="btn" style="flex:1" onclick="A.start('${p.id}')">▶ ${TT('Başla','Start')}</button><button class="btn ghost" style="flex:1" onclick="A.editPlan('${p.id}')">${TT('Düzenle','Edit')}</button></div></div>`).join('');
  return `<div class="hero" style="padding-bottom:10px"><div class="top"><button class="back" onclick="A.go('programs')">${I.back}</button><div class="brand">${TT('Antrenman programım','My training program')}</div><div style="width:34px"></div></div></div>
   ${has?`<div class="card tph"><small>${TT('Hafta','Week')} ${w}/12 · ${TT(...TPG.find(g=>g[0]===T.goal).slice(1))}</small><h3>${ph.n}</h3><p class="lbl" style="line-height:1.5;margin:6px 0 0">${ph.d}</p><div class="tpw">${Array.from({length:12},(_,i)=>`<i class="${i+1<w?'d':i+1===w?'on':''}${tpDeloads(T.lvl).includes(i+1)?' dl':''}"></i>`).join('')}</div><p class="lbl" style="line-height:1.5;margin:10px 0 0">${tpCardio(T)}</p></div>${days}`:''}
   ${form}${guideLink('tprog','trn')}<div style="height:110px"></div>`}
function tpEntry(){const T=S.tp||{},has=T.ids&&T.ids.some(id=>S.plans.find(p=>p.id===id));const w=has?tpWeek(T):0,ph=has?tpPhase(T,w):null;
  return `<button class="card qpc tpent" onclick="A.go('tprog')"><div class="qph"><div><small>${TT('Antrenman programı','Training program')}</small><h3>${has?TT('Antrenman programım','My training program'):TT('Sana özel program oluştur','Build your own program')}</h3></div>${has?`<span class="qpg">${TT('Hafta','Week')} ${w}/12</span>`:''}</div><p class="lbl" style="margin:8px 0 0;line-height:1.5;text-align:left">${has?ph.n+' · '+ph.d:TT('Hedefin, seviyen, gün sayın ve süren ile 12 haftalık program: set, tekrar, dinlenme, zorluk ve deload haftaları hazır.','A 12-week program from your goal, level, days and time: sets, reps, rest, effort and deload weeks.')}</p><div class="qpb">${has?TT('Programı aç','Open program'):TT('Oluştur','Build')} <span>›</span></div></button>`}
Object.assign(A,{
  tpSet(k,v){tpS()[k]=v;save();render(true)},
  tpMake(){const T=tpS();if(T.ids&&T.ids.length&&!confirm(TT('Mevcut program şablonları yenileriyle değiştirilsin mi? Geçmiş antrenmanların silinmez.','Replace the current program templates? Your history stays.')))return;
    S.plans=S.plans.filter(p=>!(T.ids||[]).includes(p.id));T.seed=(T.seed||0)+(T.ids&&T.ids.length?1:0);const L=tpBuild();T.ids=L.map(d=>{const p={id:uid(),tmpl:'tp',name:d.name,exercises:d.exercises};S.plans.push(p);return p.id});
    const t=new Date(dkey()+'T12:00');t.setDate(t.getDate()-((t.getDay()+6)%7));T.start=t.toISOString().slice(0,10);T.aw=null;tpApply(true);save();render(true);window.scrollTo(0,0);toast(TT('Programın hazır','Your program is ready'))}});
