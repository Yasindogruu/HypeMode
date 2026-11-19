/* ================= Set türleri & süperset ================= */
const STY={n:{k:'',n:'Normal set',c:'#c9c9d1',d:'Hedef tekrar aralığında çalış ve tükenişe 1–3 tekrar kala bitir (RPE 7–9). Gelişimin asıl kaynağı bu setler.'},
 w:{k:'W',n:'Isınma seti',c:'#ffd23f',d:'Çalışma kilonun yaklaşık %40–60\'ıyla 6–10 rahat tekrar. Kası, eklemi ve hareket kalıbını hazırlar. Yorulmadan bitir. Kas yükü, hacim ve rekor hesabına girmez.'},
 d:{k:'D',n:'Drop set',c:'#a98bff',d:'Seti bitirince dinlenmeden kiloyu %20–30 azaltıp tükenişe yakın devam et. Az zamanda ek hacim sağlar ama çok yorar. Bir harekette en fazla 1–2 kez, genelde son sette kullan.'},
 f:{k:'F',n:'Tükeniş seti',c:'#ff5a3c',d:'Temiz formla bir tekrar daha yapamayacağın noktaya kadar git. En çok izole hareketlerin son setinde işe yarar. Ağır squat ve bench gibi hareketlerde yardımcı olmadan yapma. Sık kullanmak toparlanmayı uzatır.'},
 r:{k:'R',n:'Rest-pause',c:'#3fd0ff',d:'Tükenişe 1 tekrar kala bitir, 15–20 sn nefeslen, aynı kiloyla birkaç tekrar daha yap. Bunu 2–3 kez tekrarla. Tek sette çok sayıda etkili tekrar toplar.'}};
const SS_TXT='İki ya da daha fazla hareketi arka arkaya, aralarında dinlenmeden yaparsın; gruptaki son hareketten sonra dinlenirsin. Zıt kaslarla yapılan süperset (göğüs + sırt, biceps + triceps) antrenmanı yaklaşık %30 kısaltır ve performansı pek düşürmez. Aynı kasa iki hareket (ör. bench + fly) kası daha çok yorar; kiloyu biraz düşür.';
const SSL='ABCDEFGH';
const ssOf=(list,i)=>{const e=list[i];if(!e||!e.ss)return null;const ix=list.map((x,j)=>x.ss===e.ss?j:-1).filter(j=>j>=0);return ix.length>1?ix:null};
const tyOf=s=>s&&s.ty||'n';
const wix=(e,i)=>{if(tyOf(e.sets[i])==='w')return -1;let n=0;for(let j=0;j<i;j++)if(tyOf(e.sets[j])!=='w')n++;return n};
function setLbl(e,i){const t=tyOf(e.sets[i]);if(t!=='n')return STY[t].k;return wix(e,i)+1}
const kgRound=(v,inc)=>{const s=inc>0?inc:2.5;return Math.max(0,Math.round(v/s)*s)};
function ssNorm(list){const seen={};let k=0;list.forEach(e=>{if(!e.ss)return;if(seen[e.ss]==null)seen[e.ss]=SSL[k++]||e.ss;e.ss=seen[e.ss]});
  const cnt={};list.forEach(e=>{if(e.ss)cnt[e.ss]=(cnt[e.ss]||0)+1});list.forEach(e=>{if(e.ss&&cnt[e.ss]<2)delete e.ss})}

/* ================= Şablon otomatik güncelleme ================= */
/* otomatik ısınma setleri: çalışma kilosuna göre */
function wuGen(e,kg){kg=num(kg);if(!(kg>0)||e.t)return[];const eq=(XBY[e.name]&&XBY[e.name][3])||e.eq||'',bar=eq==='barbell'?20:eq==='ezbar'?10:0,inc=e.inc||2.5,r=v=>Math.max(bar,kgRound(v,inc));
  let L;if(bar){L=kg>=60?[[bar,10],[.5,5],[.7,3],[.85,1]]:kg>=40?[[bar,10],[.6,5],[.8,3]]:kg>bar+5?[[bar,10],[.7,5]]:[[bar,10]]}
  else L=kg>=15?[[.5,8],[.75,4]]:kg>=6?[[.6,8]]:[];
  const out=[];L.forEach(([f,rp])=>{const w=f>1?f:r(kg*f);if(w<kg&&!out.some(x=>x.kg===w))out.push({kg:w,reps:rp,rpe:'',done:false,ty:'w'})});return out}
/* ev / salon profili */
function homeEq(){const g=gp();return[...new Set(['bodyweight',...(g.eq||[])])]}
const eqGuess=n=>{n=String(n||'').toLowerCase();return /barbell|\bbb\b/.test(n)?'barbell':/dumbbell|\bdb\b/.test(n)?'dumbbell':/kettlebell/.test(n)?'kettlebell':/cable|pulldown|pushdown|crossover/.test(n)?'cable':/machine|leg press|smith|hack squat|pec deck|leg curl|leg extension|seated row|chest press/.test(n)?'machine':/ez bar|ez-bar/.test(n)?'ezbar':/\bband\b/.test(n)?'band':''};
function locAdapt(p){if(!p||S.settings.loc!=='home')return{p,n:0};const have=homeEq(),used=new Set(p.exercises.map(e=>e.name));let n=0;
  const ex=p.exercises.map(e=>{const x=XBY[e.name],eq=(x&&x[3])||e.eq||eqGuess(e.name);if(!eq||have.includes(eq))return e;
    const base=qNorm(e.name.replace(/\(.*?\)/g,'')).split(' ').filter(w=>w.length>2&&!['machine','standing','seated','press'].includes(w)),typ=(x&&x[5])||'c',lv=(x&&x[4])||2;let best=null,bs=-1;
    XDB.forEach(c=>{if(c[2]!==e.muscle||!have.includes(c[3])||used.has(c[0]))return;let sc=0;if(c[5]===typ)sc+=4;const cn=qNorm(c[0]);base.forEach(w=>{if(cn.includes(w))sc+=2});if(c[3]!=='bodyweight')sc+=1;if((c[4]||1)<=lv)sc+=.5;if(sc>bs){bs=sc;best=c}});
    if(!best)return e;used.add(best[0]);n++;const bw=best[3]==='bodyweight'||best[3]==='band';
    const o={...e,name:best[0],tr:best[1],eq:best[3],inc:bw?0:(best[3]==='dumbbell'||best[3]==='kettlebell'?2:2.5),from:e.name,note:best[6]||'',alt:null};
    if(bw)o.fix=0;else delete o.fix;if(best[5]==='t'){o.t=1;o.repMin=30;o.repMax=60}else delete o.t;return o});
  return{p:{...p,exercises:ex},n}}
function wuCand(e){if(e.t||(e.fix===0&&!(num((e.sets.find(x=>tyOf(x)!=='w')||{}).kg)>0)))return false;const x=XBY[e.name];return !x||x[5]==='c'||['barbell','ezbar'].includes(x[3])}
function tplDiff(p,a){const prev=JSON.parse(JSON.stringify(p.exercises)),chg=[],used=new Set();
  const out=a.ex.map((e,i)=>{let bi=prev.findIndex((x,j)=>!used.has(j)&&x.name===(e.o||e.name));if(bi<0)bi=prev.findIndex((x,j)=>!used.has(j)&&x.name===e.name);
    const base=bi>=0?prev[bi]:null;if(bi>=0)used.add(bi);
    const did=e.sets.some(s=>s.done);if(base&&!did&&!e.ss&&!base.ss)return {...base};
    const n={...(base||{inc:2.5})};
    if(!base||base.name!==e.name){if(base)chg.push(`${base.name} → <b>${esc(e.name)}</b>`);else chg.push(`<b>${esc(e.name)}</b> eklendi`);
      ['name','tr','muscle','alt','alts','eq','note','repMin','repMax','inc'].forEach(k=>{if(e[k]!==undefined)n[k]=e[k]});
      ['t','fix','kgs','startKg'].forEach(k=>{if(e[k]!==undefined)n[k]=e[k];else delete n[k]})}
    if(did){const ws=e.sets.filter(s=>tyOf(s)!=='w'&&s.done).length,wu=e.sets.filter(s=>tyOf(s)==='w'&&s.done).length;
      if(ws&&ws!==n.sets){chg.push(`${esc(e.name)}: ${n.sets||0} → <b>${ws} set</b>`);n.sets=ws}
      if((n.wu||0)!==wu){chg.push(`${esc(e.name)}: ${wu?`<b>${wu} ısınma seti</b>`:'ısınma seti kaldırıldı'}`);if(wu)n.wu=wu;else delete n.wu}
      const lw=e.sets.filter(s=>tyOf(s)!=='w'&&s.done).pop(),lt=lw?tyOf(lw):'n';
      if((n.last||'n')!==lt){chg.push(`${esc(e.name)}: son set <b>${STY[lt].n.toLocaleLowerCase('tr-TR')}</b>`);if(lt!=='n')n.last=lt;else delete n.last}}
    if((n.ss||'')!==(e.ss||'')){if(e.ss)n.ss=e.ss;else delete n.ss}
    return n});
  prev.forEach((x,j)=>{if(!used.has(j))out.push(x)});ssNorm(out);
  const g={};out.forEach(e=>{if(e.ss)(g[e.ss]=g[e.ss]||[]).push(e.name)});const pg={};prev.forEach(e=>{if(e.ss)(pg[e.ss]=pg[e.ss]||[]).push(e.name)});
  const sk=o=>Object.values(o).map(v=>v.join('+')).sort().join('|');if(sk(g)!==sk(pg))chg.push(Object.keys(g).length?'Süperset: '+Object.values(g).map(v=>'<b>'+v.map(esc).join(' + ')+'</b>').join(', '):'Süpersetler kaldırıldı');
  const ord=a=>a.map(e=>e.name).join('|');if(!chg.length&&ord(out)!==ord(prev))chg.push('Hareket sırası güncellendi');
  return{chg,out,prev}}

/* ================= Kardiyo ================= */
const CTYPES=[['run','🏃','Koşu'],['walk','🚶','Tempolu yürüyüş'],['bike','🚴','Bisiklet'],['swim','🏊','Yüzme'],['row','🚣','Kürek'],['ell','🌀','Eliptik'],['rope','➰','İp atlama'],['hiit','⚡','HIIT'],['stairs','🪜','Merdiven'],['other','❤️','Diğer']];
const RPEL=['','Çok hafif','Hafif','Rahat','Orta','Biraz zor','Zor','Zor+','Çok zor','Neredeyse maks.','Maksimum'];
const ageOf=()=>num(S.profile.age)||25;
const hrMax=()=>Math.round(208-0.7*ageOf());
function rhrNow(d=dkey()){const H=HD(),v=lastNDays(d,14).map(k=>(H[k]||{}).rhr).filter(x=>x!=null);return v.length?v.reduce((a,b)=>a+b,0)/v.length:62}
function cLoad(c){const m=num(c.min)||0;if(num(c.hr)){const rh=rhrNow(),r=Math.max(0,Math.min(1,(c.hr-rh)/(hrMax()-rh))),f=S.profile.sex==='f'?.86*Math.exp(1.67*r):.64*Math.exp(1.92*r);return m*r*f}
  return m*(num(c.rpe)||5)/4}
function cZone(c){if(num(c.hr)){const p=c.hr/hrMax();return p<.77?0:p<.9?1:2}const r=num(c.rpe)||5;return r<=4?0:r<=7?1:2}
const cOn=d=>(S.cardio||[]).filter(c=>c.date===d);
const cDay=d=>cOn(d).reduce((a,c)=>a+cLoad(c),0);
const dDiff=(a,b)=>Math.round((new Date(b+'T12:00')-new Date(a+'T12:00'))/864e5);
const addD=(d,n)=>{const x=new Date(d+'T12:00');x.setDate(x.getDate()+n);return dkey(x)};
function cardioStat(d=dkey()){const C=S.cardio||[];if(!C.length)return{st:'none',a7:0,c28:0,ratio:0};
  const a7=lastNDays(d,7).reduce((s,k)=>s+cDay(k),0),c28=lastNDays(d,28).reduce((s,k)=>s+cDay(k),0)/4,pc=lastNDays(addD(d,-14),28).reduce((s,k)=>s+cDay(k),0)/4;
  const first=C.map(c=>c.date).sort()[0],span=dDiff(first,d)+1,ratio=c28>0?a7/c28:(a7>0?2:0);
  let st=span<14?'cal':ratio<.6?'det':ratio<.85?(c28>pc*1.1&&c28>15?'peak':'main'):ratio<=1.3?'prod':ratio<=1.5?'fat':'over';
  const sc=healthToday();if(st==='prod'&&sc&&!sc.demo&&sc.rec!=null&&sc.rec<34)st='fat';
  return{st,a7:Math.round(a7),c28:Math.round(c28),ratio,span}}
const CST={none:['Veri yok','#6b6b75','Kardiyo kaydı ekledikçe yükün ve durumun burada görünür.'],
 cal:['Kalibre ediliyor','#9b9ba4','Doğru bir durum için en az 14 günlük kardiyo geçmişi gerekiyor. Kaydetmeye devam et.'],
 det:['Form kaybı','#6fa8ff','Bu haftaki kardiyon 4 haftalık ortalamanın çok altında. Kondisyonun düşmeye başlayabilir; haftaya 2–3 seans ekle.'],
 main:['Koruma','#3fd0ff','Mevcut kondisyonunu koruyorsun. Gelişmek için yükü haftada en fazla ~%10 artır.'],
 peak:['Zirve','#3ee6a0','Yükü artırdıktan sonra biraz azalttın: vücudun toparlanıyor ve formun en iyi hâline yaklaşıyor. Test ya da yarış için iyi zaman.'],
 prod:['Verimli','#3ee6a0','Yükün kondisyonunu geliştirecek kadar yüksek ama aşırı değil. Böyle devam et.'],
 fat:['Yorgun','#ffb547','Kısa vadeli yükün normalinin belirgin üstünde ya da toparlanman düşük. 1–2 gün hafif tempo veya dinlenme yap.'],
 over:['Aşırı yüklenme','#ff5a3c','Bu haftaki yük 4 haftalık ortalamanın 1,5 katından fazla. Sakatlık ve aşırı yorgunluk riski artar; yükü azalt.']};
function cFocus(d=dkey(),n=28){const o=[0,0,0];lastNDays(d,n).forEach(k=>cOn(k).forEach(c=>{o[cZone(c)]+=num(c.min)||0}));return o}
function cWeeks(d=dkey(),n=8){return Array.from({length:n},(_,i)=>lastNDays(addD(d,-7*(n-1-i)),7).reduce((s,k)=>s+cDay(k),0))}
function acwrBar(r){const P=v=>Math.min(100,v/2*100);const segs=[[0,.6,'rgba(255,255,255,.12)'],[.6,.85,'rgba(255,255,255,.2)'],[.85,1.3,'rgba(124,196,255,.6)'],[1.3,1.5,'rgba(255,255,255,.2)'],[1.5,2,'rgba(255,255,255,.12)']];
  return `<div class="acw">${segs.map(([a,b,c])=>`<i style="left:${P(a)}%;width:${P(b)-P(a)}%;background:${c}"></i>`).join('')}<span style="left:${P(Math.min(2,r))}%"></span></div>
   <div class="acw-l"><span>Az</span><span>İdeal</span><span>Fazla</span></div>`}
function cardioCard(){const cs=cardioStat(),[n,c]=CST[cs.st],wk=cWeeks(),mx=Math.max(...wk,1),f=cFocus(),ft=f[0]+f[1]+f[2],rec=(S.cardio||[]).slice().sort((a,b)=>(b.date+(b.time||''))<(a.date+(a.time||''))?-1:1).slice(0,3);
  return `<div class="pad row between"><div class="gcat">Kardiyo yükü</div><button class="addl" onclick="A.cardioAdd()">+ Kardiyo</button></div>
  <div class="card cdc" onclick="A.cardioInfo()"><div class="row between"><span class="cst" style="--c:var(--txt)">${n}</span><span class="lbl">dokun: detay ›</span></div>
   ${cs.st==='none'?`<div class="lbl" style="margin-top:10px;line-height:1.5">${TT('Kardiyo kaydettikçe haftalık yükünü ve dengesini gösterir.','Log cardio to see your weekly load and balance.')}</div>`:`
   <div class="cd-n"><div><b>${cs.a7}</b><small>7 günlük yük</small></div><div><b>${cs.c28}</b><small>4 hafta ort./hafta</small></div><div><b>${cs.c28?fmt(r1(cs.ratio)):'—'}</b><small>oran</small></div></div>
   ${cs.c28?acwrBar(cs.ratio):''}
   <div class="cd-w">${wk.map((v,i)=>`<i style="height:${Math.max(3,v/mx*100)}%;${i===wk.length-1?'background:#7cc4ff':''}"></i>`).join('')}</div><div class="lbl" style="font-size:10.5px;text-align:right">son 8 hafta</div>
   ${ft?`<div class="cfz"><i style="flex:${f[0]};background:rgba(255,255,255,.25)"></i><i style="flex:${f[1]};background:rgba(124,196,255,.55)"></i><i style="flex:${f[2]};background:#7cc4ff"></i></div>
   <div class="row between lbl" style="font-size:11px"><span>Düşük aerobik %${Math.round(f[0]/ft*100)}</span><span>Yüksek aerobik %${Math.round(f[1]/ft*100)}</span><span>Anaerobik %${Math.round(f[2]/ft*100)}</span></div>`:''}`}
  </div>
  ${rec.length?`<div class="card" style="padding:4px 14px">${rec.map(cRow).join('')}</div>`:''}`}
function cRow(c){const t=CTYPES.find(x=>x[0]===c.type)||CTYPES[9];
  return `<div class="crow"><span class="cic">${t[1]}</span><div style="flex:1;min-width:0"><b>${t[2]}</b><small>${dayLbl(c.date).toLocaleLowerCase('tr-TR')}${c.time?' '+c.time:''} · ${c.min} dk${num(c.km)?' · '+fmt(c.km)+' km':''}${num(c.hr)?' · ♥ '+c.hr:''}${!num(c.hr)&&c.rpe?' · RPE '+c.rpe:''}</small></div><em>${Math.round(cLoad(c))}</em><button class="x" onclick="event.stopPropagation();A.cardioDel('${c.id}')" aria-label="Sil">✕</button></div>`}

/* ================= Enerji bankası ================= */
const hm2s=t=>{if(!t)return null;const[h,m]=String(t).split(':').map(Number);return Math.floor((h*60+m)/15)};
function energyOf(d=dkey()){const sc=healthScores(d);if(!sc||(sc.rec==null&&sc.sleep==null))return null;
  const x=sc.x,sl=x.sleep||{},hr=x.hr15||[],rh=x.rhr||rhrNow(d),today=d===dkey();
  let w=hm2s(sl.wake);if(w==null||w>48)w=28;
  const now=today?Math.floor((new Date().getHours()*60+new Date().getMinutes())/15):95,end=Math.max(w,Math.min(95,now));
  const start=Math.max(5,Math.min(100,Math.round(sc.rec!=null&&sc.sleep!=null?.55*sc.rec+.45*sc.sleep+3:(sc.rec??sc.sleep)+3)));
  const extra=Array(96).fill(0);
  trainedOn(d).forEach(s=>{const e=new Date(s.date),en=Math.floor((e.getHours()*60+e.getMinutes())/15),n=Math.max(1,Math.round((s.dur||1800)/900)),tot=s.sets.length*.3;for(let k=0;k<n;k++){const q=en-k;if(q>=0)extra[q]+=tot/n}});
  cOn(d).forEach(c=>{const st=hm2s(c.time)??Math.max(w,end-4),n=Math.max(1,Math.round((num(c.min)||15)/15)),tot=cLoad(c)/3;for(let k=0;k<n;k++){const q=st+k;if(q<96)extra[q]+=tot/n}});
  let v=start;const pts=[[w,v]],br={base:0,act:0,stress:0,rest:0};let lastCh=null;
  for(let t=w;t<end;t++){let dv=-.72;br.base+=.72;const h=hr[t];
    if(extra[t]>0){dv-=extra[t];br.act+=extra[t]}
    else if(h!=null){if(h>=rh+45){dv-=1.4;br.act+=1.4}else if(h>=rh*1.18){dv-=.45;br.stress+=.45}else if(h<=rh+4){dv+=1.0;br.rest+=1.0;lastCh=t}}
    v=Math.max(0,Math.min(100,v+dv));pts.push([t+1,v])}
  const cur=Math.round(v),lab=cur>=75?['Dolu','#3ee6a0']:cur>=50?['İyi','#9be15d']:cur>=25?['Orta','#ffb547']:['Düşük','#ff5a3c'];
  let bed=hm2s(sl.bed);if(bed==null||bed<60)bed=94;bed=Math.min(95,bed);
  return{start,cur,pts,w,end,bed,lab,br,lastCh,today,tip:cur>=75?'Ağır bir antrenman ya da yoğun bir gün için enerjin yerinde.':cur>=50?'Normal tempoda devam edebilirsin.':cur>=25?'Hafif aktivite seç, gün içinde kısa molalar ver.':'Bugün yükü azalt, mümkünse erken yat.'}}
function energySvg(E){const W=320,Hh=92,X=t=>(t-E.w)/Math.max(1,E.bed-E.w)*W,Y=v=>Hh-v/100*Hh;
  const p=E.pts.map(([t,v])=>X(t).toFixed(1)+','+Y(v).toFixed(1)).join(' '),l=E.pts[E.pts.length-1],proj=E.today&&l[0]<E.bed?Math.max(0,l[1]-(E.bed-l[0])*.72):null;
  const tl=[E.w,Math.round((E.w+E.bed)/2),E.bed].map(t=>`<text x="${Math.min(W-26,Math.max(0,X(t)-12))}" y="${Hh+14}">${z(Math.floor(t/4))}:${z(t%4*15)}</text>`).join('');
  return `<svg aria-hidden="true" viewBox="0 -4 ${W} ${Hh+20}" class="ensvg"><defs><linearGradient id="eng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ee6a0"/><stop offset=".5" stop-color="#ffb547"/><stop offset="1" stop-color="#ff5a3c"/></linearGradient>
   <linearGradient id="enf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ee6a0" stop-opacity=".28"/><stop offset="1" stop-color="#3ee6a0" stop-opacity="0"/></linearGradient></defs>
   ${[25,50,75].map(g=>`<line x1="0" x2="${W}" y1="${Y(g)}" y2="${Y(g)}" stroke="rgba(255,255,255,.07)"/>`).join('')}
   <polygon fill="url(#enf)" points="${X(E.pts[0][0])},${Hh} ${p} ${X(l[0])},${Hh}"/><polyline fill="none" stroke="url(#eng)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" points="${p}"/>
   ${proj!=null?`<line x1="${X(l[0])}" y1="${Y(l[1])}" x2="${X(E.bed)}" y2="${Y(proj)}" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-dasharray="3 5"/>`:''}
   <circle cx="${X(l[0])}" cy="${Y(l[1])}" r="4.5" fill="#fff"/>${tl}</svg>`}
function batt(v,c){return `<svg aria-hidden="true" viewBox="0 0 44 74" class="enb"><rect x="15" y="1" width="14" height="6" rx="2" fill="rgba(255,255,255,.35)"/><rect x="2" y="6" width="40" height="66" rx="9" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.5"/>
  <rect x="7" y="${11+56*(1-v/100)}" width="30" height="${56*v/100}" rx="5" fill="${c}"/></svg>`}
function energyCard(d){const E=energyOf(d);if(!E)return '';const f=n=>Math.round(n);
  return `<div class="card enc" id="c-en" onclick="A.energyInfo('${d}')"><div class="row between"><b>⚡ Enerji bankası</b><span class="lbl">${E.today?'şimdi':'gün sonu'} ›</span></div>
   <div class="row" style="gap:14px;align-items:center;margin-top:8px">${batt(E.cur,E.lab[1])}<div style="flex:1"><div class="kpi">${E.cur}<small>%</small></div><b style="color:${E.lab[1]}">${E.lab[0]}</b>
    <div class="lbl" style="margin-top:2px">Uyandığında %${E.start}${E.lastCh!=null?` · son şarj ${z(Math.floor(E.lastCh/4))}:${z(E.lastCh%4*15)}`:''}</div></div></div>
   ${energySvg(E)}
   <div class="enchips"><span>😴 Başlangıç <b>+${E.start}</b></span><span>⏳ Gün içi <b>−${f(E.br.base)}</b></span>${E.br.act>=.5?`<span>🏋️ Aktivite <b>−${f(E.br.act)}</b></span>`:''}${E.br.stress>=.5?`<span>💓 Stres <b>−${f(E.br.stress)}</b></span>`:''}${E.br.rest>=.5?`<span>🧘 Dinlenme <b>+${f(E.br.rest)}</b></span>`:''}</div>
   <div class="lbl" style="margin-top:8px;line-height:1.45">${E.tip}</div></div>`}

/* ================= Biyolojik yaş ================= */
function bioAge(d=dkey()){const age=num(S.profile.age);if(!age)return{need:1};const B=S.bio||{},sex=S.profile.sex;
  const H=HD(),days=lastNDays(d,30),pick=k=>days.map(q=>(H[q]||{})[k]).filter(v=>v!=null),avg=a=>a.length>=3?a.reduce((x,y)=>x+y,0)/a.length:null,f=[];
  const add=(k,ic,n,y,val,tip)=>f.push({k,ic,n,y:Math.round(Math.max(-6,Math.min(8,y))*10)/10,val,tip});
  const rhr=avg(pick('rhr'));if(rhr!=null)add('rhr','❤️','Dinlenik nabız',(rhr-62)*.22,Math.round(rhr)+' bpm','Düzenli zone 2 kardiyo (konuşabildiğin tempo) dinlenik nabzı düşürür.');
  const hrv=avg(pick('hrv'));if(hrv!=null){const nm=Math.max(22,(sex==='f'?60:62)-.75*(age-20));add('hrv','💚','HRV',Math.max(-3,Math.min(4,(nm-hrv)/nm*6)),Math.round(hrv)+' ms',"Düzenli uyku saati, alkolü azaltmak ve stres yönetimi HRV'yi yükseltir.")}
  const vo2=num(B.vo2)||(rhr!=null?15.3*hrMax()/rhr:null);if(vo2){const nm=(sex==='f'?41:48)-.38*(Math.max(20,age)-20);add('vo2','🫁','VO₂max'+(num(B.vo2)?'':' (nabızdan tahmini)'),num(B.vo2)?(nm-vo2)*.55:Math.max(-2.5,Math.min(2.5,(nm-vo2)*.3)),fmt(r1(vo2))+' ml/kg/dk',"Haftada 1–2 interval antrenmanı (ör. 4×4 dk zor tempo) VO₂max'ı en hızlı geliştiren yoldur.")}
  const sm=avg(pick('sleep').map(s=>s&&s.min).filter(Boolean));if(sm){const h=sm/60;add('sleep','😴','Ortalama uyku',h<7?(7-h)*1.6:h>9?(h-9)*1.2:-.6,fmtMin(Math.round(sm)),'7–9 saat ve her gün benzer saatte yatmak en etkili alışkanlıklardan.')}
  const st=avg(pick('steps'));if(st!=null)add('steps','👟','Günlük adım',st>=10000?-1.5:st>=8000?-.8:st>=5000?.3:1.8,Math.round(st).toLocaleString('tr-TR'),'Gün içine 2–3 kısa yürüyüş eklemek adımı kolayca artırır.');
  const ss=S.sessions.filter(s=>dDiff(dkey(new Date(s.date)),d)<28&&dDiff(dkey(new Date(s.date)),d)>=0).length/4;
  add('str','🏋️','Kuvvet antrenmanı',ss>=3?-1.5:ss>=2?-1.2:ss>=1?-.4:1,fmt(r1(ss))+' / hafta','Haftada en az 2 gün kuvvet antrenmanı kas kaybını ve yaşlanma etkisini azaltır.');
  const cm=lastNDays(d,28).reduce((a,k)=>a+cOn(k).reduce((s2,c)=>s2+(num(c.min)||0),0),0)/4,am=(avg(pick('active'))||0)*7,mod=Math.max(cm,am);
  add('car','🏃','Haftalık kardiyo',mod>=150?-1.5:mod>=75?-.5:1.2,Math.round(mod)+' dk','Haftada 150 dk orta tempo kardiyo önerilen alt sınırdır.');
  const w=latestW()||num(S.profile.weight),h=num(S.profile.height);if(w&&h){const bmi=w/((h/100)**2);add('bmi','⚖️','Vücut kitle indeksi',bmi<18.5?1:bmi<25?-.3:bmi<30?1.2:3,fmt(r1(bmi)),'Bel çevresi ve kas oranı da önemli; VKİ kaslı kişilerde yanıltıcı olabilir.')}
  const sc=healthScores(d);if(sc&&sc.rhythm!=null)add('rhy','🕰️','Uyku düzeni',sc.rhythm>=80?-.5:sc.rhythm<50?1:0,'%'+sc.rhythm,'Hafta sonu dahil yatış saatini 1 saatlik aralıkta tut.');
  if(B.smoke!=null)add('smk','🚬','Sigara',B.smoke?5:-.3,B.smoke?'içiyor':'içmiyor','Sigarayı bırakmak biyolojik yaşa en büyük tek katkıdır.');
  if(B.alc!=null&&B.alc!=='')add('alc','🍷','Alkol',num(B.alc)>14?2.5:num(B.alc)>7?1.2:num(B.alc)>0?.2:-.3,num(B.alc)+' / hafta','Alkol özellikle uyku kalitesini ve HRV\'yi düşürür.');
  if(num(B.sys))add('bp','🩺','Tansiyon (büyük)',num(B.sys)>=140?3:num(B.sys)>=130?1.5:num(B.sys)<120?-.5:0,num(B.sys)+' mmHg','Tuzu azaltmak, kilo kontrolü ve kardiyo tansiyonu düşürür.');
  f.sort((a,b)=>b.y-a.y);const sum=Math.max(-12,Math.min(15,f.reduce((a,x)=>a+x.y,0)*.8)),bio=Math.round((age+sum)*10)/10;return{age,bio,diff:Math.round((bio-age)*10)/10,f}}

