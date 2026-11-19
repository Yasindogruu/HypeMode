/* ===== Sağlık durumu: diyabet, kolesterol, tansiyon, böbrek, gut ===== */
const MEDC=[['diab','Diyabet / şeker','Diabetes / blood sugar'],['ir','İnsülin direnci','Insulin resistance'],['chol','Yüksek kolesterol','High cholesterol'],['bp','Yüksek tansiyon','High blood pressure'],['ckd','Böbrek hastalığı','Kidney disease'],['gout','Gut / ürik asit','Gout / uric acid'],['gast','Mide (gastrit, ülser, reflü)','Stomach (gastritis, ulcer, reflux)']];
function medS(){if(!S.med)S.med={conds:[],dt:'t2',ckd:3,tg:{},logs:[]};const m=S.med;m.conds=m.conds||[];m.tg=m.tg||{};m.logs=m.logs||[];return m}
const medOn=k=>!!(S.med&&S.med.conds&&S.med.conds.includes(k));
const medAny=()=>!!(S.med&&S.med.conds&&S.med.conds.length);
/* Besin tahmini: öğün adındaki anahtar kelimelere göre (100 kcal başına mg; şeker/lif karbonhidratın, doymuş yağ yağın oranı) */
const NUTR=[
 [/sakatat|ciger|bobrek|iskembe|yurek|beyin|kokorec/,{na:120,k:160,ph:250,sat:.35,pur:3}],
 [/hamsi|sardalya|uskumru|midye|karides|ton balig|istavrit|ringa|kalamar/,{na:90,k:200,ph:180,sat:.25,pur:3}],
 [/sucuk|salam|sosis|pastirma|jambon|kavurma|fume/,{na:360,k:80,ph:60,sat:.38,pur:2}],
 [/tursu|zeytin|salamura|ketcap|soya sos|et suyu|bulyon|salca/,{na:1100,k:60,ph:20,sat:.15}],
 [/cips|kraker|tuzlu|cerez|patlamis/,{na:190,k:180,ph:40,sat:.3,sug:.03,fib:.06}],
 [/peynir|kasar|lor|cokelek|labne|tulum/,{na:360,k:35,ph:160,sat:.62,sug:.1}],
 [/yogurt|sut|ayran|kefir|sutlac|puding/,{na:90,k:250,ph:160,sat:.62,sug:.85}],
 [/yumurta|omlet|menemen/,{na:110,k:100,ph:140,sat:.32}],
 [/kofte|doner|lahmacun|pide|hamburger|burger|pizza|tost|durum|kumpir/,{na:230,k:110,ph:80,sat:.4,sug:.06,fib:.05,pur:1}],
 [/dana|kuzu|kiyma|biftek|bonfile|antrikot|kirmizi et|et sote|kebap|kusbasi/,{na:45,k:170,ph:110,sat:.42,pur:2}],
 [/tavuk|hindi|pilic/,{na:55,k:220,ph:170,sat:.28,pur:1}],
 [/balik|somon|levrek|cipura|alabalik|palamut|lufer/,{na:50,k:220,ph:150,sat:.2,pur:2}],
 [/mercimek|fasulye|nohut|barbunya|bakla|bezelye|leblebi|humus/,{na:20,k:330,ph:140,sat:.15,sug:.06,fib:.25,pur:1}],
 [/badem|ceviz|findik|fistik|kaju|kuruyemis|cekirdek|tahin/,{na:5,k:120,ph:80,sat:.1,sug:.2,fib:.15}],
 [/patates/,{na:10,k:520,ph:70,sat:.2,sug:.03,fib:.1}],
 [/kuru kayisi|kuru incir|kuru uzum|hurma|kuru meyve/,{na:5,k:420,ph:30,sat:.2,sug:.9,fib:.1}],
 [/muz/,{na:1,k:400,ph:25,sat:.3,sug:.6,fib:.1}],
 [/portakal|mandalina|kayisi|kavun|karpuz|elma|armut|cilek|uzum|seftali|kivi|meyve/,{na:2,k:280,ph:30,sat:.1,sug:.75,fib:.15}],
 [/ispanak|domates|salata|brokoli|kabak|patlican|biber|sebze|marul|roka|havuc|pirasa|lahana|bamya|enginar/,{na:60,k:700,ph:110,sat:.15,sug:.35,fib:.3}],
 [/corba/,{na:320,k:150,ph:70,sat:.3,sug:.1,fib:.08}],
 [/kola|gazoz|meyve suyu|ice tea|enerji icecegi|limonata|serbet|cola/,{na:8,k:20,ph:25,sat:0,sug:1}],
 [/cikolata|baklava|kek|kurabiye|pasta|dondurma|lokum|tatli|seker|recel|bal|helva|kunefe|sutlu|biskuvi|gofret|waffle/,{na:70,k:60,ph:40,sat:.55,sug:.72,fib:.03}],
 [/bira|sarap|raki|viski|votka|alkol/,{na:5,k:50,ph:20,sat:0,sug:.3,pur:2}],
 [/tam bugday|cavdar|yulaf|bulgur|kepek|tam tahil|karabugday|kinoa/,{na:120,k:110,ph:120,sat:.18,sug:.04,fib:.15}],
 [/ekmek|simit|pogaca|borek|lavas|bazlama|gozleme|sandvic|acma|tortilla/,{na:190,k:45,ph:45,sat:.3,sug:.05,fib:.06}],
 [/pirinc|pilav|makarna|sehriye|eriste|noodle|manti/,{na:80,k:35,ph:45,sat:.3,sug:.02,fib:.03}]];
const NDEF={na:70,k:130,ph:70,sat:.33,sug:.25,fib:.08,pur:0};
function nutEst(m){const parts=String(m.name||'').split(/\s*(?:,|\+|\bve\b|\bile\b)\s*/).filter(Boolean);const n=Math.max(1,parts.length);
  const kc=(+m.kcal||0)/n,c=(+m.c||0)/n,f=(+m.f||0)/n,o={na:0,k:0,ph:0,sat:0,sug:0,fib:0,pur:0,hit:[]};
  for(const pt of parts){const q=ingNorm(pt).replace(/_/g,' '),raw=pt.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');let r=null;
    for(const [re,v] of NUTR)if(re.test(raw)||re.test(q)){r={...NDEF,...v};break}
    const P=r||NDEF,u=kc/100;o.na+=P.na*u;o.k+=P.k*u;o.ph+=P.ph*u;o.sat+=P.sat*f;o.sug+=P.sug*c;o.fib+=P.fib*c;if(P.pur>o.pur)o.pur=P.pur;if(P.pur>=3)o.hit.push(pt.trim())}
  return o}
function medTg(){const M=medS(),w=+S.profile.weight||70,KG=(()=>{try{return kcalGoal(dkey()).k}catch(e){return 2000}})(),T=M.tg||{},t={};
  const st=+M.ckd||3,dia=M.ckd==='d';
  if(medOn('diab')){t.cmeal={max:T.cmeal||(M.dt==='pre'?60:50),u:'g',n:TT('Karbonhidrat / öğün','Carbs / meal')};t.sug={max:T.sug||40,u:'g',n:TT('Şeker','Sugar')};t.fib={min:T.fib||30,u:'g',n:TT('Lif','Fiber')}}
  if(medOn('ir')){t.cmeal=t.cmeal?{...t.cmeal,max:Math.min(t.cmeal.max,T.cmeal||45)}:{max:T.cmeal||45,u:'g',n:TT('Karbonhidrat / öğün','Carbs / meal')};t.sug={max:Math.min((t.sug||{}).max||99,T.sug||25),u:'g',n:TT('Şeker','Sugar')};t.fib={min:T.fib||30,u:'g',n:TT('Lif','Fiber')};t.pmeal={min:T.pmeal||20,u:'g',n:TT('Protein / öğün (en az)','Protein / meal (min)')}}
  if(medOn('chol')){t.sat={max:T.sat||Math.round(KG*.07/9),u:'g',n:TT('Doymuş yağ','Saturated fat')};t.fib=t.fib||{min:T.fib||30,u:'g',n:TT('Lif','Fiber')}}
  if(medOn('bp')||medOn('ckd'))t.na={max:T.na||(medOn('ckd')?2000:1500),u:'mg',n:TT('Sodyum','Sodium')};
  if(medOn('bp')&&!medOn('ckd'))t.k={min:T.k||3500,u:'mg',n:TT('Potasyum','Potassium')};
  if(medOn('ckd')){t.p={max:T.p||Math.round(w*(dia?1.2:st<=2?0.8:0.6)),u:'g',n:TT('Protein','Protein')};if(dia||st>=4)t.k={max:T.k||2500,u:'mg',n:TT('Potasyum','Potassium')};if(dia||st>=3)t.ph={max:T.ph||900,u:'mg',n:TT('Fosfor','Phosphorus')}}
  return t}
function medDay(ms){const o={na:0,k:0,ph:0,sat:0,sug:0,fib:0,p:0,cmax:0,pur:[],pmin:null};ms.forEach(m=>{if((+m.kcal||0)>=250)o.pmin=o.pmin==null?(+m.p||0):Math.min(o.pmin,+m.p||0);const e=nutEst(m);o.na+=e.na;o.k+=e.k;o.ph+=e.ph;o.sat+=e.sat;o.sug+=e.sug;o.fib+=e.fib;o.p+=+m.p||0;o.cmax=Math.max(o.cmax,+m.c||0);if(e.pur>=3)o.pur.push(m.name)});return o}
const GIHI=/beyaz ekmek|ekmek|simit|pogaca|pilav|pirinc|makarna|patates|kizartma|cips|misir gevregi|corn flakes|cocopops|kola|gazoz|meyve suyu|seker|recel|bal|lokum|baklava|tatli|kek|kurabiye|biskuvi|pide|lavas|tost|hamburger|pizza/;
function medTags(m){if(!medAny())return '';const e=nutEst(m),t=medTg(),tg=[];
  if(medOn('ir')){const raw=String(m.name||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');if(GIHI.test(raw)&&!/tam bugday|cavdar|yulaf|bulgur|esmer/.test(raw))tg.push(TT('Yüksek GI','High GI'));if((+m.kcal||0)>=250&&(+m.p||0)<(t.pmeal?t.pmeal.min:20))tg.push(TT('Protein az','Low protein'))}
  if(t.cmeal&&(+m.c||0)>t.cmeal.max)tg.push(TT('Karbonhidrat yüksek','High carbs'));
  if(t.sug&&e.sug>t.sug.max*.45)tg.push(TT('Şekerli','Sugary'));
  if(t.sat&&e.sat>t.sat.max*.45)tg.push(TT('Doymuş yağ','Sat. fat'));
  if(t.na&&e.na>t.na.max*.4)tg.push(TT('Tuzlu','Salty'));
  if(t.k&&t.k.max&&e.k>t.k.max*.35)tg.push(TT('Potasyum','Potassium'));
  if(t.ph&&e.ph>t.ph.max*.4)tg.push(TT('Fosfor','Phosphorus'));
  if(medOn('gast')){const raw=String(m.name||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');if(/aci|pul biber|isot|kahve|latte|cappuccino|americano|espresso|kola|gazoz|enerji icecegi|bira|sarap|raki|alkol|kizartma|cips|tursu|salgam|portakal suyu|meyve suyu|limon|cikolata|nutella|sucuk|salam|sosis|pastirma|adana|lahmacun|hamburger|pizza|hot dog|nugget|mayonez|ketcap|kunefe|baklava/.test(raw))tg.push(TT('Mideyi zorlayabilir','May upset stomach'))}
  if(medOn('gout')&&e.pur>=3)tg.push(TT('Pürin yüksek','High purine'));
  return tg.length?`<span class="mdt">${tg.map(x=>`<i>${x}</i>`).join('')}</span>`:''}
const MEDL={ins:['Açlık insülini','Fasting insulin','µIU/mL'],waist:['Bel çevresi','Waist','cm'],glu:['Kan şekeri','Blood sugar','mg/dL'],bp:['Tansiyon','Blood pressure','mmHg'],ldl:['LDL kolesterol','LDL cholesterol','mg/dL'],a1c:['HbA1c','HbA1c','%'],ua:['Ürik asit','Uric acid','mg/dL'],egfr:['eGFR','eGFR','mL/dk']};
function medLogTypes(){const t=[];if(medOn('diab'))t.push('glu','a1c');if(medOn('ir'))t.push('glu','ins','a1c','waist');if(medOn('bp')||medOn('ckd'))t.push('bp');if(medOn('chol'))t.push('ldl');if(medOn('gout'))t.push('ua');if(medOn('ckd'))t.push('egfr');return [...new Set(t)]}
function medStat(l){const v=+l.v,M=medS();if(l.t==='glu'){const lo=v<70,hi=l.ctx==='a'?v>130:v>180;return lo?['low',TT('Düşük','Low')]:hi?['hi',TT('Yüksek','High')]:['ok',TT('Hedefte','In range')]}
  if(l.t==='bp'){const s=v,d=+l.v2||0;return s>=140||d>=90?['hi',TT('Yüksek','High')]:s>=130||d>=80?['mid',TT('Sınırda','Borderline')]:['ok',TT('Hedefte','In range')]}
  if(l.t==='ldl')return v>=(M.tg.ldl||100)?['hi',TT('Hedef üstü','Above target')]:['ok',TT('Hedefte','In range')];
  if(l.t==='a1c')return v>=(M.tg.a1c||7)?['hi',TT('Hedef üstü','Above target')]:['ok',TT('Hedefte','In range')];
  if(l.t==='ins')return v>=15?['hi',TT('Yüksek','High')]:v>=10?['mid',TT('Sınırda','Borderline')]:['ok',TT('Hedefte','In range')];
  if(l.t==='waist'){const L=S.profile.sex==='f'?80:94;return v>=L+8?['hi',TT('Yüksek','High')]:v>=L?['mid',TT('Sınırda','Borderline')]:['ok',TT('Hedefte','In range')]}
  if(l.t==='ua')return v>=6?['hi',TT('Yüksek','High')]:['ok',TT('Hedefte','In range')];
  if(l.t==='egfr')return v<30?['hi',TT('Düşük','Low')]:v<60?['mid',TT('Azalmış','Reduced')]:['ok',TT('Normal','Normal')];return ['ok','']}
function medCard(d,ms){if(!medAny())return '';const t=medTg(),D=medDay(ms),M=medS(),f=n=>Math.round(n).toLocaleString(LOC());
  const val={pmeal:D.pmin||0,cmeal:D.cmax,sug:D.sug,fib:D.fib,sat:D.sat,na:D.na,k:D.k,ph:D.ph,p:D.p};
  const bars=Object.entries(t).map(([k,g])=>{const v=val[k]||0,lim=g.max||g.min,pc=Math.min(100,v/lim*100),bad=g.max?v>g.max:false,good=g.min?v>=g.min:!bad;
    return `<div class="mdb"><span>${g.n}</span><div class="bar"><i style="width:${pc}%;background:${bad?'#ff6b6b':good&&g.min?'#5bd98c':'var(--txt)'}"></i></div><b>${f(v)}<small> / ${g.max?'≤':'≥'}${f(lim)} ${g.u}</small></b></div>`}).join('');
  const homa=(()=>{if(!medOn('ir'))return '';const ins=M.logs.filter(x=>x.t==='ins').sort((a,b)=>b.ts-a.ts)[0],g=M.logs.filter(x=>x.t==='glu'&&x.ctx==='a').sort((a,b)=>b.ts-a.ts)[0];if(!ins||!g)return '';const h=Math.round(ins.v*g.v/405*10)/10,c=h>=2.5?'hi':h>=1.9?'mid':'ok';return `<div class="mdl"><span>HOMA-IR</span><b>${String(h).replace('.',LOC().startsWith('tr')?',':'.')}</b><em class="${c}">${c==='hi'?TT('Direnç var','Resistant'):c==='mid'?TT('Sınırda','Borderline'):TT('Normal','Normal')}</em></div>`})();
  const irTips=(()=>{if(!medOn('ir'))return '';const st=(()=>{try{return Math.round((HD()[d]||{}).steps||0)}catch(e){return 0}})(),wk=S.sessions.filter(x=>x&&x.date&&Date.now()-new Date(x.date).getTime()<7*864e5).length;
    return `<div class="mdls"><div class="mdl"><span>${TT('Haftalık kuvvet antrenmanı','Strength sessions this week')}</span><b>${wk}/3</b><em class="${wk>=2?'ok':'mid'}">${wk>=2?TT('İyi','Good'):TT('Hedef 2–3','Aim 2–3')}</em></div><div class="mdl"><span>${TT('Adım','Steps')}</span><b>${st.toLocaleString(LOC())}</b><em class="${st>=8000?'ok':'mid'}">${st>=8000?TT('İyi','Good'):TT('Hedef 8.000','Aim 8,000')}</em></div></div><p class="lbl" style="margin:8px 0 0;line-height:1.5">${TT('Öğünden sonra 10–15 dk yürümek şeker yükselişini azaltır. Karbonhidratı proteinle ve lifle birlikte ye, önce sebzeyi ye.','A 10–15 min walk after meals blunts the glucose rise. Pair carbs with protein and fiber; eat vegetables first.')}</p>`})();
  const gTips=(()=>{if(!medOn('gast'))return '';const n=ms.length,lt=ms.map(m=>m.time||'').filter(Boolean).sort().pop()||'',late=lt>'21:00',cof=(S.drinks||[]).filter(x=>x.date===d&&/turk|filtre|espresso|latte|kahve|cappu|americano/.test(x.type)).length;
    return `<div class="mdls"><div class="mdl"><span>${TT('Öğün sayısı','Meals')}</span><b>${n}</b><em class="${n>=5?'ok':'mid'}">${n>=5?TT('İyi','Good'):TT('Hedef 5–6 küçük öğün','Aim 5–6 small meals')}</em></div>${lt?`<div class="mdl"><span>${TT('Son öğün','Last meal')}</span><b>${lt}</b><em class="${late?'mid':'ok'}">${late?TT('Geç','Late'):TT('Uygun','OK')}</em></div>`:''}<div class="mdl"><span>${TT('Kahve','Coffee')}</span><b>${cof}</b><em class="${cof?'mid':'ok'}">${cof?TT('Azalt','Cut down'):TT('İyi','Good')}</em></div></div><p class="lbl" style="margin:8px 0 0;line-height:1.5">${TT('Siyah dışkı, kanlı kusma ya da geçmeyen şiddetli ağrıda hemen doktora başvur.','See a doctor immediately for black stools, vomiting blood or severe pain that does not pass.')}</p>`})();
  const types=medLogTypes(),last=types.map(ty=>{const l=M.logs.filter(x=>x.t===ty).sort((a,b)=>b.ts-a.ts)[0];if(!l)return '';const[c,lab]=medStat(l);
    return `<div class="mdl"><span>${TT(MEDL[ty][0],MEDL[ty][1])}</span><b>${l.t==='bp'?l.v+'/'+l.v2:String(l.v).replace('.',LOC().startsWith('tr')?',':'.')} <small>${MEDL[ty][2]}</small></b><em class="${c}">${lab}</em></div>`}).join('');
  return `<div class="card mdc"><div class="row between"><b>${TT('Sağlık hedeflerin','Your health targets')}</b><button class="pill" onclick="A.medLog()">+ ${TT('Ölçüm','Reading')}</button></div>
   ${bars}${D.pur.length&&medOn('gout')?`<p class="mdw">${TT('Pürini yüksek','High purine')}: ${esc(D.pur.slice(0,3).join(', '))}</p>`:''}
   ${last||homa?`<div class="mdls">${last}${homa}</div>`:''}${irTips}${gTips}
   <div class="row between" style="margin-top:8px"><span class="lbl" style="font-size:11px">${TT('Değerler öğün adından tahmin edilir · tıbbi tavsiye değildir','Estimated from meal names · not medical advice')}</span><button class="pill ghost" onclick="A.go('settings');setTimeout(()=>A.setSec('med'),50)">${TT('Ayarlar','Settings')}</button></div></div>`}
const MEDI={gast:[['Mideyi zorlayabilecek yiyeceklerde uyarı: acı, kızartma, kahve, kola, alkol, turşu, ekşi meyve suyu…','Warning on foods that may upset the stomach: spicy, fried, coffee, cola, alcohol, pickles, acidic juice…'],['Günlük öğün sayısı takibi (hedef 5–6 küçük öğün)','Daily meal count (aim 5–6 small meals)'],['Geç akşam yemeği uyarısı (21:00 sonrası)','Late dinner warning (after 21:00)'],['Bugünkü kahve sayısı','Coffee count today'],['Mide dostu örnek beslenme programı','Stomach-friendly sample meal plan'],['Siyah dışkı, kanlı kusma ya da şiddetli ağrıda hemen doktora başvurma hatırlatması','Reminder to see a doctor immediately for black stools, vomiting blood or severe pain']],ir:[['Öğün başına karbonhidrat sınırı: 45 g','Carb limit per meal: 45 g'],['Günlük şeker sınırı 25 g, lif hedefi 30 g','Daily sugar limit 25 g, fiber target 30 g'],['Her ana öğünde en az 20 g protein hedefi; azsa "Protein az" uyarısı','At least 20 g protein per main meal; "Low protein" tag'],['Beyaz ekmek, pilav, patates, tatlı gibi yiyeceklerde "Yüksek GI" uyarısı','"High GI" tag on white bread, rice, potatoes, sweets'],['Açlık şekeri, açlık insülini, HbA1c ve bel çevresi kaydı','Fasting glucose, fasting insulin, HbA1c and waist logging'],['Açlık şekeri ve insülinden HOMA-IR hesabı (2,5 üstü direnç)','HOMA-IR from fasting glucose and insulin (over 2.5 = resistance)'],['Haftalık kuvvet antrenmanı (hedef 2–3) ve günlük adım (8.000) takibi','Weekly strength sessions (aim 2–3) and daily steps (8,000)'],['Öğün sonrası yürüyüş ve yemek sırası önerisi','Post-meal walk and food order tips']],diab:[['Öğün başına karbonhidrat sınırı (varsayılan 50 g, prediyabette 60 g)','Carb limit per meal (default 50 g, 60 g for prediabetes)'],['Günlük şeker ve lif hedefi','Daily sugar and fiber targets'],['Sınırı aşan öğünlerde "Karbonhidrat yüksek" ve "Şekerli" uyarısı','"High carbs" and "Sugary" tags on meals'],['Kan şekeri (aç, tok, antrenman) ve HbA1c kaydı','Blood sugar (fasting, after meal, workout) and HbA1c logging'],['Şeker 70 altındaysa ne yapılacağı uyarısı','Guidance when blood sugar is under 70'],['Antrenman başlarken "önce şekerini ölç" hatırlatması','"Check your blood sugar" reminder when a workout starts']],
 chol:[['Doymuş yağ sınırı (günlük kalorinin %7\'si)','Saturated fat limit (7% of daily calories)'],['Günlük lif hedefi','Daily fiber target'],['Doymuş yağı yüksek öğünlerde uyarı','Warning on meals high in saturated fat'],['LDL kolesterol kaydı ve hedefi (varsayılan 100)','LDL cholesterol logging and target (default 100)']],
 bp:[['Günlük sodyum (tuz) sınırı: 1500 mg','Daily sodium limit: 1500 mg'],['Potasyum hedefi (böbrek hastalığı yoksa)','Potassium target (if no kidney disease)'],['Tuzlu öğünlerde "Tuzlu" uyarısı','"Salty" tag on meals'],['Tansiyon kaydı: hedefte, sınırda, yüksek','Blood pressure log: in range, borderline, high'],['Antrenmanda ağır setlerde nefes tutmama hatırlatması','Reminder not to hold your breath on heavy sets']],
 ckd:[['Evreye göre protein sınırı (kilona göre)','Protein limit by stage (per body weight)'],['Sodyum sınırı: 2000 mg','Sodium limit: 2000 mg'],['Evre 4–5 ve diyalizde potasyum, evre 3 ve sonrasında fosfor sınırı','Potassium limit at stage 4–5 and dialysis, phosphorus from stage 3'],['Potasyumu ve fosforu yüksek öğünlerde uyarı','Warnings for meals high in potassium or phosphorus'],['Tansiyon ve eGFR kaydı','Blood pressure and eGFR logging'],['Değerleri mutlaka doktorunun verdiğiyle değiştir','Replace values with the ones your doctor gave you']],
 gout:[['Pürini yüksek yiyecek uyarısı (sakatat, hamsi, sardalya, midye…)','High-purine food warning (organ meat, anchovy, sardine, mussels…)'],['Günün pürini yüksek öğünleri kartta listelenir','Today\'s high-purine meals listed on the card'],['Ürik asit kaydı (hedef 6 mg/dL altı)','Uric acid logging (target under 6 mg/dL)']]};
function medSec(){const M=medS(),t=medTg(),on=k=>M.conds.includes(k);
  const inp=(k,l,u,ph)=>`<div class="fld"><label>${l} (${u})</label><input id="mt_${k}" inputmode="decimal" placeholder="${ph}" value="${M.tg[k]??''}"></div>`;
  return `<div class="card"><p class="lbl" style="line-height:1.5;margin:0 0 12px">${TT('Durumunu seç; Yemek sayfasında sana göre sınırlar, öğünlerde uyarılar ve ölçüm takibi açılır. Hedefleri doktorunun ya da diyetisyeninin verdiği değerlere göre değiştirebilirsin.','Pick your conditions to get limits, meal warnings and readings tracking on the Food page. Change targets to the values your doctor gave you.')}</p>
   <div class="cychips">${MEDC.map(([k,a,b])=>`<button class="${on(k)?'on':''}" onclick="A.medTog('${k}')">${TT(a,b)}</button>`).join('')}</div><button class="pill" style="margin-top:12px" onclick="A.go('nprog');setTimeout(()=>{const e=document.querySelector('.labc');e&&e.scrollIntoView({block:'center'})},120)">${TT('Tahlil sonucuna göre öner','Suggest from lab results')}</button></div>
   <div class="card"><b>${TT('Her seçenek neler ekler?','What each option adds')}</b>${MEDC.map(([k,a,b])=>`<details class="mdi"${on(k)?' open':''}><summary><span>${TT(a,b)}</span>${on(k)?`<em>${TT('Açık','On')}</em>`:''}</summary><ul>${MEDI[k].map(([x,y])=>`<li>${TT(x,y)}</li>`).join('')}</ul></details>`).join('')}</div>
   ${on('diab')?`<div class="card"><b>${TT('Diyabet türü','Diabetes type')}</b><div class="seg3" style="margin-top:10px">${[['t1','Tip 1','Type 1'],['t2','Tip 2','Type 2'],['pre','Prediyabet','Prediabetes']].map(([k,a,b])=>`<button class="${M.dt===k?'on':''}" onclick="A.medSet('dt','${k}')">${TT(a,b)}</button>`).join('')}</div></div>`:''}
   ${on('ckd')?`<div class="card"><b>${TT('Böbrek hastalığı evresi','Kidney disease stage')}</b><div class="seg3" style="margin-top:10px;flex-wrap:wrap">${['1','2','3','4','5','d'].map(k=>`<button class="${String(M.ckd)===k?'on':''}" onclick="A.medSet('ckd','${k}')">${k==='d'?TT('Diyaliz','Dialysis'):TT('Evre ','Stage ')+k}</button>`).join('')}</div><p class="lbl" style="margin:10px 0 0;line-height:1.5">${TT('Protein, potasyum ve fosfor sınırları evreye göre çok değişir. Mutlaka doktorunun verdiği değerleri aşağıya gir.','Protein, potassium and phosphorus limits vary a lot by stage. Enter the values your doctor gave you below.')}</p></div>`:''}
   ${M.conds.length?`<div class="card"><b>${TT('Günlük hedefler','Daily targets')}</b><p class="lbl" style="margin:4px 0 10px">${TT('Boş bırakırsan önerilen değer kullanılır.','Leave empty to use the suggested value.')}</p>
     ${Object.entries(t).map(([k,g])=>inp(k,g.n+(g.max?' ≤':' ≥'),g.u,String(g.max||g.min))).join('')}
     ${on('chol')?inp('ldl','LDL '+TT('hedefi','target')+' <','mg/dL','100'):''}${on('diab')?inp('a1c','HbA1c '+TT('hedefi','target')+' <','%','7'):''}
     <button class="btn" onclick="A.medSave()">${TT('Kaydet','Save')}</button></div>`:''}
   <p class="lbl" style="line-height:1.5;padding:0 6px">${TT('HypeMode teşhis koymaz ve ilaç önermez. Besin değerleri öğün adlarından tahmin edilir. Tedavi ve diyet kararları için doktoruna danış.','HypeMode does not diagnose or suggest medication. Nutrients are estimated from meal names. Ask your doctor about treatment and diet.')}</p>`}
Object.assign(A,{
  medTog(k){const M=medS();M.conds=M.conds.includes(k)?M.conds.filter(x=>x!==k):[...M.conds,k];save();render(true)},
  medSet(k,v){medS()[k]=v;save();render(true)},
  medSave(){const M=medS(),tg={};document.querySelectorAll('[id^=mt_]').forEach(e=>{const v=parseFloat(String(e.value).replace(',','.'));if(v>0)tg[e.id.slice(3)]=v});M.tg=tg;save();render(true);toast(TT('Hedefler kaydedildi','Targets saved'))},
  medLog(ty){const T=medLogTypes();if(!T.length)return;ty=ty||A._mlT||T[0];if(!T.includes(ty))ty=T[0];A._mlT=ty;const M=medS();
    const hist=M.logs.filter(x=>x.t===ty).sort((a,b)=>b.ts-a.ts).slice(0,6);
    sheet(`<h3>${TT('Ölçüm ekle','Add reading')}</h3><div class="seg3" style="flex-wrap:wrap;margin-bottom:12px">${T.map(k=>`<button class="${k===ty?'on':''}" onclick="A.medLog('${k}')">${TT(MEDL[k][0],MEDL[k][1])}</button>`).join('')}</div>
     ${ty==='bp'?`<div class="grid2"><div class="fld"><label>${TT('Büyük','Systolic')}</label><input id="ml_v" inputmode="numeric" placeholder="120"></div><div class="fld"><label>${TT('Küçük','Diastolic')}</label><input id="ml_v2" inputmode="numeric" placeholder="80"></div></div>`
       :`<div class="fld"><label>${TT(MEDL[ty][0],MEDL[ty][1])} (${MEDL[ty][2]})</label><input id="ml_v" inputmode="decimal"></div>`}
     ${ty==='glu'?`<div class="seg3" style="margin-bottom:12px">${[['a','Aç','Fasting'],['t','Tok (1–2 sa)','After meal'],['w','Antrenman','Workout']].map(([k,a,b],i)=>`<button class="${i===0?'on':''}" data-c="${k}" onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on')">${TT(a,b)}</button>`).join('')}</div>`:''}
     <button class="btn" onclick="A.medLogSave('${ty}')">${TT('Kaydet','Save')}</button>
     ${hist.length?`<div class="gen-l" style="margin-top:14px">${TT('Son ölçümler','Recent')}</div>${hist.map(l=>{const[c,lab]=medStat(l);return `<div class="mdl"><span>${new Date(l.ts).toLocaleString(LOC(),{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}${l.ctx?' · '+({a:TT('aç','fasting'),t:TT('tok','after meal'),w:TT('antrenman','workout')})[l.ctx]:''}</span><b>${l.t==='bp'?l.v+'/'+l.v2:l.v}</b><em class="${c}">${lab}</em><button class="mdx" aria-label="${TT('Sil','Delete')}" onclick="A.medDel('${l.id}')">×</button></div>`}).join('')}`:''}`)},
  medLogSave(ty){const v=parseFloat(String((document.getElementById('ml_v')||{}).value||'').replace(',','.'));if(!(v>0))return toast(TT('Bir değer gir','Enter a value'));
    const l={id:uid(),t:ty,v,ts:Date.now()};if(ty==='bp'){const v2=parseFloat((document.getElementById('ml_v2')||{}).value);if(!(v2>0))return toast(TT('Küçük tansiyonu gir','Enter diastolic'));l.v2=v2}
    if(ty==='glu'){const b=document.querySelector('.sheet [data-c].on');l.ctx=b?b.dataset.c:'a'}
    medS().logs.push(l);save();const[c,lab]=medStat(l);
    if(ty==='glu'&&l.v<70)toast(TT('Şekerin düşük: 15 g hızlı karbonhidrat al (meyve suyu, 3–4 küp şeker), 15 dk sonra tekrar ölç.','Low: take 15 g fast carbs, re-check in 15 min.'));else toast(TT('Kaydedildi','Saved')+(lab?' · '+lab:''));
    A.medLog(ty);render(true)},
  medDel(id){const M=medS();M.logs=M.logs.filter(x=>x.id!==id);save();A.medLog();render(true)}});
(()=>{const st=A.start;if(typeof st!=='function')return;A.start=function(...a){const r=st.apply(this,a);try{
  if(medOn('diab'))setTimeout(()=>toast(TT('Antrenmandan önce şekerini ölç: 90 altındaysa biraz karbonhidrat al, 250 üstündeyse ertele.','Check blood sugar first: under 90 eat some carbs, over 250 postpone.')),600);
  else if(medOn('ir'))setTimeout(()=>toast(TT('Kuvvet antrenmanı insülin duyarlılığını artırır. Bitirince 10 dk yürüyüş de iyi gelir.','Strength training improves insulin sensitivity. A 10-min walk afterwards helps too.')),600);
  else if(medOn('bp'))setTimeout(()=>toast(TT('Ağır setlerde nefesini tutma; baş dönmesi olursa dur.','Do not hold your breath on heavy sets; stop if dizzy.')),600)}catch(e){}return r}})();
