/* ===== v2: ana ekran mini kartları + detaylı Kalp/Uyku ===== */
window.__hdNav=k=>{const d=ui.hdDay||dkey(),n=new Date(d+'T12:00');n.setDate(n.getDate()+k);const nd=dkey(n);if(nd>dkey())return;ui.hdDay=nd;render(true)};
window.__goD=(v,d)=>{ui.hdDay=d;A.go(v);window.scrollTo(0,0)};
function dNav(d){return `<div class="dnv"><button onclick="__hdNav(-1)" aria-label="Önceki gün">‹</button><b>${d===dkey()?TT('Bugün','Today'):dayLbl(d)}<small>${new Date(d+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</small></b><button onclick="__hdNav(1)" ${d===dkey()?'disabled':''} aria-label="Sonraki gün">›</button></div>`}
function infoSheet(t,a,b,c){sheet(`<div class="ifs"><h3>${t}</h3><p>${a}</p>${b?`<h4>${TT('Sayı nereden geliyor','Where the number comes from')}</h4><p>${b}</p>`:''}${c?`<h4>${TT('Nasıl okunur','How to read it')}</h4><p>${c}</p>`:''}<p class="ifs-n">${TT('Ölçümler bağlı cihazından gelir. HypeMode\'un hesapladığı skorlar cihazında hesaplanır.','Measurements come from your connected device. HypeMode\'s derived scores are calculated on your device.')}</p></div>`)}
const INF={
 rhr:['Dinlenik nabız','Dinlenirken kalbinin dakikadaki atış sayısı.','Fitbit\'in günlük tahmininden okunur.','Kondisyon arttıkça düşer. Kendi normalinden birkaç atım yüksekse yorgunluk, stres ya da hastalık başlangıcı olabilir.'],
 hrv:['Kalp atış değişkenliği (HRV)','Ardışık kalp atışları arasındaki süre farkı.','Uyku sırasında ölçülür; tek bir gece ortalamasıdır.','Kişiden kişiye çok değişir; sadece kendi normalinle karşılaştır. Normalinden yüksekse toparlanmışsın demektir.'],
 cload:['Kardiyo yükü','Kardiyo aktivitelerinin kalbine bindirdiği yük. Antrenman yükünden ayrı bir ölçüdür.','Süre ve ortalama nabızdan hesaplanır (TRIMP).','7 günlük yük, 28 günlük ortalamanla karşılaştırılır; ani artışlar sakatlık riskini yükseltir.'],
 zones:['Nabız bölgeleri nasıl çalışır','Bölgeler maksimum nabzının yüzdelerine göre ayrılır.','Maks. nabız yaşından tahmin edilir; ayarlardan değiştirebilirsin.','Yağ yakımı ve üstü bölgelerde geçen dakikalar aktif bölge dakikası sayılır.'],
 read:['Nabız ölçümleri','Gün içi nabız 15 dakikalık ortalamalar olarak gösterilir.','Fitbit Air bileğinden optik sensörle ölçer.','Saat gevşekse veya şarjdaysa ölçüm boşlukları oluşur; grafikte bunlar boşluk olarak kalır.'],
 w:['Uyanık','Uyku süresi içinde uyanık geçen zaman.','Evrelere ayrılmış uyku kaydından okunur.','Gece kısa uyanmalar normaldir; toplam 30 dakikayı geçerse uyku kalitesi düşer.'],
 l:['Hafif uyku','Cihazının hafif uyku olarak sınıfladığı süre.','Evrelere ayrılmış uyku kaydından okunur. Hafif uyku normal bir uyku döngüsünün parçasıdır.','Çok hafif uyku boşa geçmiş uyku demek değildir; gecenin yaklaşık yarısı hafif uykudur.'],
 d:['Derin uyku','Derin ya da yavaş dalga uykusu olarak sınıflanan süre. Kas onarımı ve büyüme hormonu bu evrede yoğunlaşır.','Evrelere ayrılmış uyku kaydından okunur. Yüzdeler toplam uyku süresine göredir.','Tüketici cihazlarının evre tahminleri yaklaşıktır. Genelde uykunun %13–23\'ü derin uykudur.'],
 r:['REM uykusu','Hızlı göz hareketli uyku olarak sınıflanan süre. Hafıza ve ruh hali için önemlidir.','Evrelere ayrılmış uyku kaydından okunur. REM hafif, derin ve uyanık süreden ayrı gösterilir.','Tek bir gecenin yüzdesi uyku kalitesini belirlemez; haftalık eğilime bak.'],
 need:['Uyku ihtiyacı','Bu gece için tahmini uyku ihtiyacın.','Sağlıklı minimum (8 saat) + son günlerdeki yükün + birikmiş uyku borcunun bir kısmı.','İhtiyacının %90\'ını karşılamak çoğu gün için yeterlidir.'],
 cons:['Uyku düzeni','Son 7 gecede yatış saatlerinin ne kadar sabit olduğu.','Yatış saatlerinin standart sapmasından hesaplanır; en az 3 gece gerekir.','Her gün ±30 dakika içinde yatmak uyku kalitesini belirgin şekilde artırır.'],
 eff:['Uyku verimi','Yatakta geçen sürenin ne kadarının uykuyla geçtiği.','Uyku süresi / yatakta geçen süre.','%85 ve üstü iyi kabul edilir.'],
 dur:['Süre (50 puan)','Uyku skorunun yarısı ne kadar uyuduğuna göre verilir.','Uykuda geçen süre; 8 saat ve üstü tam puan, 3 saatin altı sıfır.','Fitbit gibi çoğu cihaz da skorun yarısını süreden verir.'],
 qual:['Kalite (25 puan)','Derin ve REM uykusunun toplam uykuya oranı.','Evrelere ayrılmış uyku kaydından okunur; %45 ve üstü tam puan, %15 ve altı sıfır.','Derin uyku bedeni, REM zihni toparlar.'],
 rst:['Toparlanma (25 puan)','Uykuda nabzının dinlenik nabzına göre ne kadar düştüğü ve uyanık geçen süre.','Uyku saatlerindeki nabız ölçümleri ve uyanık dakikalar.','Uykuda nabzın dinlenik nabzının altına iniyorsa ve gece az uyanıyorsan puan yükselir.'],
 rest:['Onarıcı uyku','Derin ve REM uykusunun toplamı.','Evrelere ayrılmış uyku kaydından okunur.','Uykunun %35–50\'si onarıcıysa iyi bir gecedir.']};
window.__inf=k=>{const q=INF[k];if(q)infoSheet(TT(q[0],q[0]),q[1],q[2],q[3])};
function spk2(vs,col,w=120,h=38){const p=vs.map((v,i)=>[i,v]).filter(q=>q[1]!=null);if(p.length<2)return '';const mx=Math.max(...p.map(q=>q[1])),mn=Math.min(...p.map(q=>q[1])),n=vs.length-1||1;
  return `<svg aria-hidden="true" viewBox="0 0 ${w} ${h}" class="spk" preserveAspectRatio="none"><path d="${p.map((q,i)=>(i&&q[0]-p[i-1][0]>2?'M':i?'L':'M')+(q[0]/n*w).toFixed(1)+','+(h-2-(q[1]-mn)/((mx-mn)||1)*(h-4)).toFixed(1)).join('')}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>`}
function homeTiles(d){const H=HD(),x=H[d]||{},f=n=>Math.round(n).toLocaleString(LOC()),hr=(x.hr15||[]),hv=hr.filter(v=>v!=null),sl=x.sleep||{},sc=healthScores(d);
  const L=S.healthDemo?{v:hv.slice(-1)[0],t:Date.now()-4*6e4}:(S.settings.ghHR&&dkey(new Date(S.settings.ghHR.t))===d?S.settings.ghHR:null),last=L&&L.v?L.v:hv.slice(-1)[0];
  const li=hr.map((v,i)=>v!=null?i:-1).filter(i=>i>=0).pop(),lt=L&&L.t?new Date(L.t).toTimeString().slice(0,5):li!=null?z(Math.floor(li/4))+':'+z(li%4*15):'';
  const wk=lastNDays(d,7).reverse(),wv=wk.map(k=>(H[k]||{}).steps),wa=wv.filter(v=>v!=null),avg=wa.length?Math.round(wa.reduce((a,b)=>a+b,0)/wa.length):0,wm=Math.max(...wa,1);
  const zs=x.azm!=null?x.azm:hr.reduce((q,v)=>{const z2=v!=null?hrZoneOf(v):-1;return q+(z2>=3?30:z2>=1?15:0)},0),zw=wk.reduce((q,k)=>{const y=H[k]||{};return q+(y.azm!=null?y.azm:0)},0);
  const st=sl.min?[[sl.deep,'#7cc4ff'],[sl.rem,'rgba(124,196,255,.55)'],[sl.light,'rgba(255,255,255,.3)'],[sl.awake,'rgba(255,255,255,.12)']].filter(q=>q[0]):[];
  const T=(go,lab,big,mid,foot,col)=>`<button class="htl" data-go="${go}" onclick="__goD('${go}','${d}')" style="--tc:${col}"><small>${lab}</small><b>${big}</b><div class="htl-m">${mid}</div><span>${foot}</span></button>`;
  return `<div class="htg">
   ${T('hrd',TT('kalp atışı','heart rate'),last!=null?DRV(last,'bpm'):'—',spk2(hr,'#cfd3da'),last!=null?`${lt}${x.rhr?' · '+TT('dinlenik','rest')+' '+x.rhr:''}`:TT('nabız bekleniyor','waiting for data'),'#ff4d5e')}
   ${T('stp',TT('adım','steps'),x.steps!=null?f(x.steps):'—',`<div class="htl-b">${wv.map((v,i)=>`<i style="height:${v==null?3:Math.max(10,v/wm*100)}%;background:${v!=null&&v===Math.max(...wa)?'#7cc4ff':i===6?'var(--txt)':'rgba(255,255,255,.22)'}"></i>`).join('')}</div>`,`${TT('7 gün ort.','7-day avg')} ${f(avg)}`,'#8f8cff')}
   ${T('slp',TT('uyku','sleep'),sl.min?tmV(sl.min):'—',st.length?`<div class="htl-s">${st.map(q=>`<i style="flex:${q[0]};background:${q[1]}"></i>`).join('')}</div>`:'',sl.min?(sc&&sc.sleep!=null?TT('skor','score')+' '+sc.sleep:`${sl.bed||''}${sl.wake?' → '+sl.wake:''}`):TT('gece verisi yok','no night data'),'#7f8cff')}
   ${(()=>{const sv=strainOf(d),sw=wk.map(k=>strainOf(k)),smx=Math.max(...sw.filter(v=>v!=null),1);return T('yuk',TT('yük','strain'),sv!=null?DRV(fmt(sv),'/21'):'—',`<div class="htl-b">${sw.map((v,i)=>`<i style="height:${v==null?3:Math.max(10,v/smx*100)}%;background:${v!=null&&v===smx?'#7cc4ff':i===6?'var(--txt)':'rgba(255,255,255,.22)'}"></i>`).join('')}</div>`,sv==null?TT('henüz hareket yok','no activity yet'):sv>=14?TT('Zorlu gün','Hard day'):sv>=8?TT('Orta yük','Moderate'):TT('Hafif gün','Light day'),'#34d399')})()}
  </div>`}
function dotsBar(v,mx,col){const n=14,k=Math.round(Math.max(0,Math.min(1,v/mx))*n);return `<span class="dts">${Array.from({length:n},(_,i)=>`<i${i<k?` style="background:${col}"`:''}></i>`).join('')}</span>`}
const qCol=(v,lo,hi)=>v==null?'rgba(127,127,140,.4)':v>=hi?'#3ee6a0':v>=lo?(document.documentElement.dataset.mode==='light'?'#85848e':'#c9c9d1'):'#ff9a3c';
function heartDV2(){const d=ui.hdDay||dkey(),H=HD(),x=H[d]||{},a=x.hr15||[],v=a.filter(q=>q!=null),hm2=i=>z(Math.floor(i/4))+':'+z(i%4*15),M=hrMax();
  const avg=v.length?Math.round(v.reduce((q,w)=>q+w,0)/v.length):null,base=k=>{const b=lastNDays(d,31).slice(1).map(k2=>(H[k2]||{})[k]).filter(q=>q!=null);return b.length>=3?b.reduce((q,w)=>q+w,0)/b.length:null};
  const dl=(k,inv)=>{const b=base(k);if(b==null||x[k]==null)return '';const df=Math.round(x[k]-b);return df?`<i class="${(df>0)===!!inv?'up':'dn'}">${df>0?'↑':'↓'} ${Math.abs(df)} ${TT('normaline göre','vs. usual')}</i>`:`<i>${TT('normalinde','at usual')}</i>`};
  const zs=x.hrz?x.hrz.slice():HRZ.map(()=>0);if(!x.hrz)a.forEach(q=>{const z2=q!=null?hrZoneOf(q):-1;if(z2>=0)zs[z2]+=15});const zt=zs.reduce((q,w)=>q+w,0)||1;
  const wk=lastNDays(d,7).reverse(),rh=wk.map(k2=>[k2,(H[k2]||{}).rhr]),hv2=wk.map(k2=>[k2,(H[k2]||{}).hrv]),dn=k2=>new Date(k2+'T12:00').toLocaleDateString(LOC(),{weekday:'narrow'});
  const mini=(arr,col)=>{const vs=arr.map(q=>q[1]).filter(q=>q!=null);if(!vs.length)return `<div class="lbl">${TT('Veri yok','No data')}</div>`;const mx=Math.max(...vs),mn=Math.min(...vs);return `<div class="mbars">${arr.map(q=>`<div><i style="height:${q[1]==null?4:20+(q[1]-mn)/((mx-mn)||1)*60}%;background:${q[1]==null?'rgba(127,127,140,.15)':col}"></i><b>${q[1]??''}</b><span>${dn(q[0])}</span></div>`).join('')}</div>`};
  const sl=x.sleep||{},ov=sl.bed&&sl.wake?(()=>{const b=hm(sl.bed),w=hm(sl.wake),idx=[];for(let i=0;i<96;i++){const m=i*15;if(b>w?(m>=b||m<w):(m>=b&&m<w))idx.push(i)}return idx})():[];
  const acts=[...cOn(d).map(c=>{const t=CTYPES.find(q=>q[0]===c.type)||['','❤️','Kardiyo'];return{ic:t[1],n:t[2],tm:c.time||'',min:c.min||0,sub:[c.time,Math.round(cLoad(c))+' '+TT('yük puanı','load pts'),c.km?fmt(c.km)+' km':'',c.hr?c.hr+' bpm':''].filter(Boolean).join(' · ')}}),
    ...trainedOn(d).map(s2=>{const t=new Date(s2.date);return{ic:'🏋️',n:esc(s2.planName||'Antrenman'),tm:z(t.getHours())+':'+z(t.getMinutes()),min:(s2.dur||0)/60,sub:[z(t.getHours())+':'+z(t.getMinutes()),s2.sets.length+' set',Math.round(volOf(s2)).toLocaleString(LOC())+' kg'].join(' · ')}})].sort((p,q)=>p.tm<q.tm?-1:1);
  const mk=acts.filter(q=>q.tm).map(q=>`<span class="hmk" style="left:${hm(q.tm)/1440*100}%" title="${q.n}">${q.ic}</span>`).join('');
  const cs=cardioStat(d),cl=cOn(d).reduce((q,c)=>q+cLoad(c),0);
  const row=(t,s,val,u,k)=>`<button class="dpr" onclick="__inf('${k}')"><div><b>${t}</b><small>${s}</small></div><em>${val}<small>${u}</small></em><i>›</i></button>`;
  const zr=[...HRZ.map((q,i)=>[q,i])].reverse();
  return `<div class="ddp dp">${dpHead(TT('Kalp atışı','Heart rate'))}${dNav(d)}
   <div class="dp-k">${d===dkey()?TT('Bugün kaydedilen','Recorded today'):TT('Kaydedilen','Recorded')}</div>
   <div class="dp-big">${v.length?`${x.hrLo??Math.min(...v)}–${x.hrHi??Math.max(...v)}<small>bpm</small>`:'—'}</div><div class="dp-s">${avg?TT(`Ortalama ${avg} bpm. Aralık, kaydedilen en düşük ve en yüksek tekil ölçümdür.`,`${avg} bpm average. The range is the lowest and highest single reading.`):TT('Bu gün için nabız verisi henüz gelmedi.','No heart-rate data for this day yet.')}</div>
   ${hrmCard()}<div class="dp-t">${TT('Gün boyu nabız','Heart rate through the day')}</div>
   <div class="dp-c"><div class="dp-2"><div><span>${TT('Dinlenik nabız','Resting heart rate')}</span><b>${x.rhr??'—'}<small> bpm</small></b>${dl('rhr')}</div><div><span>${TT('Gece HRV','Overnight HRV')}</span><b>${x.hrv??'—'}<small> ms</small></b>${dl('hrv',1)}</div></div>
    ${scrubChart('hrc',x.hr1&&x.hr1.some(q=>q!=null)?x.hr1.map((q,i)=>[i/1439,q,z(Math.floor(i/60))+':'+z(i%60)]):a.map((q,i)=>[i/95,q,hm2(i)+(x.hr15x&&q!=null&&x.hr15x[i]>q+1?' · '+TT('tepe','peak')+' '+x.hr15x[i]:'')]),{title:TT('Nabız','Heart rate'),low:1,u:'bpm',col:'#ff4d5e',pkMin:(()=>{const r=x.rhr||rhrNow(d);return Math.round(r+.25*(hrMax()-r))})(),min:40,max:Math.max(160,...v,x.hrHi||0)+10,grid:[40,80,120,160],h:190,
      extra:ov.length?`<rect x="${ov[0]/95*340}" y="-8" width="${(ov[ov.length-1]-ov[0])/95*340}" height="196" fill="rgba(127,140,255,.08)"/>`:''})}
    ${mk?`<div class="hmks">${mk}</div>`:''}
    <div class="lbl" style="margin-top:8px">${TT(`${x.hr1?'Dakika dakika ölçümler':'Çizgi 15 dakikalık ortalamaları gösterir; tepe değerler biraz daha düşük görünebilir'}${x.hrHi?` · günün en yüksek ölçümü ${x.hrHi} bpm`:''}${ov.length?' · mor alan uyku':''}${mk?' · simgeler kayıtlı aktiviteler':''} · kırmızı: yüksek yoğunluk bölgesi. Eksik ölçümler boşluk bırakır.`,`15-minute averages${ov.length?' · purple area is sleep':''}${mk?' · icons are recorded activities':''}. Missing readings leave gaps.`)}</div></div>
   <div class="dp-t">${TT('Nabız bölgelerinde süre','Time in heart-rate zones')}<small onclick="__inf('zones')" style="cursor:pointer">${TT('Eşiklerin','Your thresholds')} ›</small></div>
   <div class="dp-c">${zr.map(([q,i])=>{const lo=Math.round(q[0]*M),hi=HRZ[i+1]?Math.round(HRZ[i+1][0]*M)-1:null,pc=Math.round(zs[i]/zt*100);return `<div class="zr2"><div class="row between"><b><i style="background:${q[2]}"></i>${q[1]}</b><em>${tmT(zs[i])}</em></div><div class="zr2-b"><i style="width:${Math.max(zs[i]?2:0,pc)}%;background:${q[2]}"></i></div><div class="row between"><small>${hi?lo+'–'+hi:lo+'+'} bpm</small><small>%${pc}</small></div></div>`}).join('')}
    <div class="lbl" style="margin-top:8px">${TT('Maks. nabız tahmini','Estimated max HR')} ~${M} bpm${x.hrz?' · Fitbit':''}</div></div>
   <div class="dp-t">${TT('Toparlanma sinyalleri','Recovery signals')}</div>
   <div class="dp-c dpl">${row(TT('Dinlenik nabız','Resting heart rate'),TT('Günlük tahmin','Daily estimate'),x.rhr??'—',' bpm','rhr')}${row(TT('Kalp atış değişkenliği','Heart rate variability'),TT('Uykuda ölçüldü','Recorded during sleep'),x.hrv??'—',' ms','hrv')}${row(TT('Kardiyo yükü','Cardio load'),TT(`Bugün · 7 gün: ${cs.a7||0}`,`Today · 7-day: ${cs.a7||0}`),Math.round(cl),' '+TT('puan','pts'),'cload')}</div>
   <div class="dp-t">${TT('Kaydedilen aktiviteler','Recorded activities')}</div>
   <div class="dp-c dpl">${acts.length?acts.map(q=>`<div class="dpr"><span class="dpr-i">${q.ic}</span><div><b>${q.n}</b><small>${q.sub}</small></div><em>${tmT(q.min)}</em></div>`).join(''):`<div class="lbl" style="padding:6px 0">${TT('Bu gün kayıtlı aktivite yok.','No recorded activities this day.')}</div>`}</div>
   <div class="dp-t">${TT('Dinlenik nabız · son 7 gün','Resting heart rate · last 7 days')}</div><div class="dp-c">${trendBand(d,'rhr',{u:'bpm',col:'#34d399',lowGood:true,minSd:2,hint:TT('Düşük olması iyi: kalbin dinlenirken daha az çalışıyor demek.','Lower is better: your heart works less at rest.')})}</div>
   <div class="dp-t">HRV · ${TT('son 7 gün','last 7 days')}</div><div class="dp-c">${trendBand(d,'hrv',{u:'ms',col:'#34d399',lowGood:false,minSd:3,hint:TT('Yüksek olması iyi: vücudun toparlanmış demek.','Higher is better: your body is recovered.')})}</div>
   <div class="dp-t">${TT('Kalp atışını anlamak','Understand heart rate')}</div>
   <div class="dp-c dpl"><button class="dpr" onclick="__inf('read')"><div><b>${TT('Nabız ölçümleri ve canlı veri','Heart-rate readings & live data')}</b></div><i>›</i></button><button class="dpr" onclick="__inf('zones')"><div><b>${TT('Bölgeler nasıl çalışır','How your zones work')}</b></div><i>›</i></button></div>
   <div class="lbl" style="text-align:center;margin:18px 0 0">${TT('Fitbit Air · kayıtlı ölçümler. Skorlar tahminidir ve cihazında hesaplanır.','Fitbit Air · recorded readings. Scores are estimates computed on your device.')}</div>
   <div style="height:120px"></div></div>`}
function yukDV(){const d=ui.hdDay||dkey(),H=HD(),x=H[d]||{},sp=strainParts(d)||{},sv=sp.tot??null,wk=lastNDays(d,14).reverse(),sw=wk.map(k=>strainOf(k)),sc=healthScores(d);
  const lab=sv==null?TT('Henüz hareket yok','No activity yet'):sv>=14?TT('Zorlu gün','Hard day'):sv>=8?TT('Orta yük','Moderate day'):TT('Hafif gün','Light day');
  const av=sw.filter(v=>v!=null),avg=av.length?Math.round(av.reduce((a,b)=>a+b,0)/av.length*10)/10:null;
  const acts=[...cOn(d).map(c=>{const t=CTYPES.find(q=>q[0]===c.type)||['','❤️','Kardiyo'];return{n:t[2],min:c.min||0,sub:[c.time,Math.round(cLoad(c))+' '+TT('yük puanı','load pts'),c.km?fmt(c.km)+' km':''].filter(Boolean).join(' · ')}}),...trainedOn(d).map(s2=>{const t=new Date(s2.date);return{n:esc(s2.planName||'Antrenman'),min:(s2.dur||0)/60,sub:[z(t.getHours())+':'+z(t.getMinutes()),s2.sets.length+' set'].join(' · ')}})];
  const row=(t,sb,v,u)=>`<div class="dpr"><div><b>${t}</b><small>${sb}</small></div><em>${v}<small>${u}</small></em></div>`;
  return `<div class="ddp dp">${dpHead(TT('Yük','Strain'))}${dNav(d)}
   <div class="dp-k">${d===dkey()?TT('Bugünkü yük','Today\'s strain'):TT('Yük','Strain')}</div>
   <div class="dp-big">${sv!=null?fmt(sv):'—'}<small>/21</small></div><div class="dp-s">${lab}. ${TT('Yük, gün boyu nabzının dinlenik nabzınla maksimum nabzın arasında ne kadar yükseldiğinden ve kuvvet setlerinden 0–21 arasında hesaplanır. Ölçek logaritmiktir: 10\'dan 15\'e çıkmak, 5\'ten 10\'a çıkmaktan çok daha fazla efor ister.','Strain is calculated from 0–21 from how high your heart rate rose between your resting and maximum heart rate during the day, plus strength sets. The scale is logarithmic: going from 10 to 15 takes far more effort than from 5 to 10.')}</div>
   <div class="dp-t">${TT('Son 14 gün','Last 14 days')}<small>${avg!=null?TT('ortalama','avg')+' '+fmt(avg):''}</small></div>
   <div class="dp-c">${scrubChart('yuc',sw.map((v,i)=>[(i+.5)/14,v,new Date(wk[i]+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})]),{title:TT('Günlük yük','Daily strain'),u:'/21',min:0,max:21,bar:1,bw:14,grid:[0,7,14,21],h:150,xl:[new Date(wk[0]+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'}),TT('Bugün','Today')]})}
    <div class="tbl" style="margin-top:8px"><span><i style="background:#ff3b4f"></i>${TT('En yüksek gün','Highest day')}</span><span>0–7 ${TT('hafif','light')} · 8–13 ${TT('orta','moderate')} · 14+ ${TT('zorlu','hard')}</span></div></div>
   <div class="dp-t">${TT('Yükü oluşturanlar','What made up your strain')}</div>
   <div class="dp-c dpl">${sp.src?row(TT('Kalp yükü','Heart load'),TT('nabız rezervinin %30\'u ve üstünde ','at 30%+ of heart rate reserve ')+(sp.zmin||0)+' '+TT('dk','min'),sp.hr,' '+TT('puan','pts')):''}${row(TT('Kuvvet setleri','Strength sets'),(sp.sets||0)+' set',sp.setL||0,' '+TT('puan','pts'))}${sp.src?'':row(TT('Kardiyo','Cardio'),TT('kaydettiğin kardiyo','logged cardio'),sp.cardioL||0,' '+TT('puan','pts'))}${sp.moveL?row(TT('Gün içi hareket','Daily movement'),TT('adım ve aktif dakika','steps and active minutes'),sp.moveL,' '+TT('puan','pts')):''}${sc&&sc.acwr!=null?row(TT('Yük dengesi','Load balance'),TT('son 7 gün / son 28 gün · ideal 0,8–1,3','last 7 days / last 28 days · ideal 0.8–1.3'),sc.acwr.toFixed(2).replace('.',LANG()==='en'?'.':','),''):''}</div>
   <div class="dp-t">${TT('Kaydedilen aktiviteler','Recorded activities')}</div>
   <div class="dp-c dpl">${acts.length?acts.map(q=>`<div class="dpr"><div><b>${q.n}</b><small>${q.sub}</small></div><em>${tmT(q.min)}</em></div>`).join(''):`<div class="lbl" style="padding:6px 0">${TT('Bu gün kayıtlı aktivite yok.','No recorded activities this day.')}</div>`}</div>
   <div style="height:120px"></div></div>`}
function sleepDV(){const d=ui.hdDay||dkey(),H=HD(),x=H[d]||{},sl=x.sleep||{},sc=healthScores(d),q=sc&&sc.sleep!=null?sc.sleep:null;
  if(!sl.min)return `<div class="ddp dp">${dpHead(TT('Uyku','Sleep'))}${dNav(d)}<div class="dp-c" style="margin-top:20px;text-align:center"><b>${TT('Bu gece için uyku verisi yok','No sleep data for this night')}</b><div class="lbl" style="margin-top:6px">${TT('Fitbit eşitlenince burada görünür.','It appears here after Fitbit syncs.')}</div></div><div style="height:120px"></div></div>`;
  const awake=sl.awake||0,inBed=sl.span||sl.min+awake,eff=sl.eff!=null?Math.round(sl.eff):Math.round(sl.min/inBed*100);
  const pd=lastNDays(d,2)[1],sv=strainOf(pd),strAdd=sv!=null&&sv>8?Math.round((sv-8)*2):0,debt=sleepDebt(pd),debtAdd=Math.min(30,Math.round(debt/7)),need=NEED+strAdd+debtAdd,met=Math.round(sl.min/need*100);
  const bt=lastNDays(d,7).map(k=>((H[k]||{}).sleep||{}).bed).filter(Boolean).map(b=>{let m=hm(b);if(m<720)m+=1440;return m}),cons=consScore(d);
  const tot=(sl.deep||0)+(sl.rem||0)+(sl.light||0)||sl.min,rest=(sl.deep||0)+(sl.rem||0),rp=Math.round(rest/tot*100),restS=Math.min(100,Math.round(rp/45*100));
  const head=met>=90?(awake>5?TT('Uyanıklıkla birlikte tam bir gece','A full night, with wake time'):TT('Tam bir gece','A full night')):met>=75?TT('İdare eder bir gece','A fair night'):TT('Kısa bir gece','A short night');
  const C=2*Math.PI*52,arc=q!=null?C*q/100:0;
  const sp=sleepParts(x)||{dur:0,qual:0,rest:0};const fac=[[TT('Süre','Duration'),sp.dur*2,sp.dur+'/50','dur',75,90],[TT('Kalite','Quality'),sp.qual*4,sp.qual+'/25','qual',60,80],[TT('Toparlanma','Restoration'),sp.rest*4,sp.rest+'/25','rst',60,80]];
  const stg=[['w',TT('Uyanık','Awake'),awake,'#ff9a6a'],['l',TT('Hafif','Light'),sl.light,'#6fc6ff'],['d',TT('Derin','Deep'),sl.deep,'#4b5cff'],['r','REM',sl.rem,'#a48bff']],all=stg.reduce((a,s2)=>a+(s2[2]||0),0)||1;
  const hr=x.hr15||[],b0=hm(sl.bed||'23:00'),span=inBed,hp=[];if(hr.length&&sl.bed){for(let i=0;i<96;i++){const m0=((i*15-b0)%1440+1440)%1440;if(m0<=span&&hr[i]!=null)hp.push([m0/span,hr[i],z(Math.floor(i/4))+':'+z(i%4*15)])}hp.sort((a,b)=>a[0]-b[0])}
  let tl=sl.tl;if(!tl&&S.healthDemo){tl=[];let t=0,i=0;const pat=[['l',25],['d',45],['l',30],['r',20],['l',35],['d',30],['r',25],['w',4],['l',40],['r',35],['l',30],['d',15],['r',30],['w',3],['l',40]];while(t<span){const p=pat[i%pat.length];tl.push([t,Math.min(span,t+p[1]),p[0]]);t+=p[1];i++}}
  const rows=[['w',TT('Uyanık','Awake'),'#ff9a6a'],['r','REM','#a48bff'],['l',TT('Hafif','Light'),'#6fc6ff'],['d',TT('Derin','Deep'),'#4b5cff']],W=340,rh=26,fx=v2=>v2/span*W,wakes=tl?tl.filter(p=>p[2]==='w').length:0;
  return `<div class="ddp dp">${dpHead(TT('Uyku','Sleep'))}${dNav(d)}
   <div class="slr"><svg aria-hidden="true" viewBox="0 0 120 120"><defs><linearGradient id="slg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f8cff"/><stop offset="1" stop-color="#3a6dff"/></linearGradient></defs><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(127,127,140,.15)" stroke-width="7"/><circle cx="60" cy="60" r="52" fill="none" stroke="url(#slg)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${arc} ${C}" transform="rotate(-90 60 60)"/></svg><div><b>${q??'—'}</b><small>${TT('Uyku skoru','Sleep score')}</small></div></div>
   <div class="sl2"><div><small>${TT('Uykuda','Time asleep')}</small><b>${tmV(sl.min)}</b></div><div><small>${TT('Yatakta','Time in bed')}</small><b>${tmV(inBed)}</b></div></div>
   <div class="slh"><b>${head}</b><span>${TT(`İhtiyacının %${met}'i karşılandı · ${awake} dk uyanık`,`${met}% of estimated need met · ${awake} minutes awake`)}</span><em>${lic('moon',14)} ${sl.bed||'—'} → ${lic('sun',14)} ${sl.wake||'—'}</em></div>
   <div class="dp-c"><div class="sqh">${TT('UYKU SKORUNU OLUŞTURANLAR','WHAT MAKES UP YOUR SCORE')}</div>${fac.map(r=>`<button class="sqr" onclick="__inf('${r[3]}')"><span>${r[0]}</span>${dotsBar(r[1]??0,100,qCol(r[1],r[4],r[5]))}<b>${r[2]??'—'}</b><i>›</i></button>`).join('')}
    <div class="sql"><span><i style="background:#ff9a3c"></i>${TT('Zayıf','Poor')}</span><span><i style="background:#9b9ba4"></i>${TT('Yeterli','Sufficient')}</span><span><i style="background:#3ee6a0"></i>${TT('İyi','Optimal')}</span></div></div>
   <div class="dp-t">${TT('Dün geceki uyku','Last night\'s sleep')}</div>
   <div class="dp-c">${hp.length>3?`${scrubChart('snh2',hp,{title:TT('Gece nabzı','Overnight heart rate')+' · '+hp.length+' '+TT('ölçüm','readings'),low:1,u:'bpm',col:'#ff6b8a',min:Math.min(...hp.map(q2=>q2[1]))-10,max:Math.max(...hp.map(q2=>q2[1]))+10,grid:[],h:110,xl:[sl.bed,TT('Gece','Overnight'),sl.wake]})}`:''}
    <div class="row between sl-tb"><small>${TT('YATAKTA','TIME IN BED')}</small><b>${tmT(inBed)}</b></div>
    ${radialMix('slmx',stg.map(s2=>[s2[1],s2[2]||0,s2[3]]),TT('ONARICI','RESTORATIVE'),'%'+rp)}
    ${stg.map(s2=>`<button class="stgr" onclick="__inf('${s2[0]}')"><div class="row between"><span><i style="border-color:${s2[3]}"></i>${s2[1]} <em style="color:${s2[3]}">%${Math.round((s2[2]||0)/all*100)}</em></span><b>${s2[2]!=null?tmT(s2[2]):'—'}</b></div><div class="stgr-b"><i style="width:${(s2[2]||0)/all*100}%;background:${s2[3]}"></i></div></button>`).join('')}
    <div class="row between sl-tb" style="border:0"><small><i class="sq" style="background:#a48bff"></i>${TT('ONARICI UYKU','RESTORATIVE SLEEP')}</small><b>${tmT(rest)}</b></div></div>
   ${tl&&tl.length?`<div class="dp-t">${TT('Evre zaman çizelgesi','Stage timeline')}<small>${TT(`uykunun %${rp}'i onarıcı`,`${rp}% of sleep restorative`)}</small></div>
   <div class="dp-c"><div class="lbl" style="margin:-2px 0 12px;line-height:1.5">${TT('Gece boyunca hangi uyku evresinde olduğunu gösterir. Soldan sağa yatıştan kalkışa zaman akar, her satır bir evredir. Sağlıklı bir gecede derin uyku (koyu mavi) ilk saatlerde, REM (mor) sabaha doğru yoğunlaşır; kısa uyanmalar normaldir.','Shows which sleep stage you were in through the night. Time flows left to right from bedtime to wake; each row is a stage. In a healthy night deep sleep (dark blue) clusters early and REM (purple) towards morning; brief awakenings are normal.')}</div>
    <svg aria-hidden="true" viewBox="0 0 ${W+46} ${rows.length*rh+6}" style="width:100%;display:block">${(()=>{const b0=hm(sl.bed||'00:00'),o=[];for(let m=60-(b0%60);m<span;m+=60)o.push(`<line x1="${46+fx(m)}" x2="${46+fx(m)}" y1="0" y2="${rows.length*rh}" stroke="rgba(127,127,140,.14)" stroke-dasharray="2 4"/>`);return o.join('')})()}${rows.map((r,j)=>`<text x="0" y="${j*rh+rh/2+4}" fill="${r[2]}" font-size="10.5" font-weight="600">${r[1]}</text><line x1="46" x2="${W+46}" y1="${j*rh+rh/2}" y2="${j*rh+rh/2}" stroke="rgba(127,127,140,.12)"/>`).join('')}
    ${tl.map(p=>{const j=rows.findIndex(r=>r[0]===p[2]);if(j<0)return '';return `<rect x="${46+fx(p[0])}" y="${j*rh+3}" width="${Math.max(1.5,fx(p[1]-p[0]))}" height="${rh-6}" rx="3" fill="${rows[j][2]}"/>`}).join('')}</svg>
    <div class="sc-x" style="padding-left:46px">${(()=>{const b0=hm(sl.bed||'00:00'),n=Math.min(5,Math.max(2,Math.round(span/120))),o=[];for(let i=0;i<=n;i++)o.push(`<span>${mfmt(b0+span*i/n)}</span>`);return o.join('')})()}</div>
    ${stageInsights(tl,sl,span)}<div class="row between sl-tb" style="border:0;margin-top:4px"><small>${TT('UYANMA SAYISI','WAKE EVENTS')}</small><b>${wakes}</b></div></div>`:''}
   <div class="dp-t">${TT('Saat / ihtiyaç','Hours vs need')}<small onclick="__inf('need')" style="cursor:pointer">${TT('İhtiyacı anla','Understand need')} ›</small></div>
   <div class="dp-c"><div class="dp-big" style="font-size:40px;margin:0 0 12px">${met}<small>%</small></div>
    <div class="row between hn"><small>${TT('UYKUDA','TIME ASLEEP')}</small><b>${tmT(sl.min)}</b></div><div class="hnb"><i style="width:${Math.min(100,sl.min/Math.max(need,sl.min)*100)}%"></i></div>
    <div class="row between hn"><small>${TT('UYKU İHTİYACI','SLEEP NEED')}</small><b>${tmT(need)}</b></div><div class="hnb nd"><i style="width:${need/Math.max(need,sl.min)*100}%"></i></div>
    <div class="drl"><span><i class="sq" style="background:#55545e"></i>${TT('Sağlıklı minimum','Healthy minimum')}</span><div><b>${tmT(NEED)}</b></div></div>
    <div class="drl"><span><i class="sq" style="background:#3a6dff"></i>${TT('Son yük','Recent strain')}</span><div><b>+${strAdd} dk</b></div></div>
    <div class="drl"><span><i class="sq" style="background:#ffb547"></i>${TT('Uyku borcu','Sleep debt')}</span><div><b>+${debtAdd} dk</b></div></div>
    <div class="lbl" style="margin-top:10px;line-height:1.5">${TT(`Dün geceye ${tmT(debt)} uyku borcuyla girdin; son yükün ihtiyacına ${strAdd} dk ekledi.`,`You carried ${tmT(debt)} of sleep debt into last night; recent strain added ${strAdd} min to your need.`)}</div></div>
   <div class="dp-t">${TT('Uyku düzeni · son 7 gece','Sleep consistency · last 7 nights')}</div>${sleepCons(d)}
   <div class="dp-t">${TT('Şekerlemeler','Naps')}<small>${new Date(d+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'long'})}</small></div>${napsCard(d)}
   <div class="dp-t">${TT('Uykuyu anlamak','Understand your night')}</div>
   <div class="dp-c dpl"><button class="dpr" onclick="__inf('d')"><div><b>${TT('Uyku evreleri ne anlama gelir','What the stages mean')}</b></div><i>›</i></button><button class="dpr" onclick="__inf('need')"><div><b>${TT('Uyku ihtiyacı nasıl hesaplanır','How sleep need is calculated')}</b></div><i>›</i></button><button class="dpr" onclick="__inf('cons')"><div><b>${TT('Düzen neden önemli','Why consistency matters')}</b></div><i>›</i></button></div>
   <div style="height:120px"></div></div>`}
/* ===== Anlaşılır grafikler: 7 gün eğilimi, uyku düzeni, şekerleme ===== */
function trendBand(d,key,o){const H=HD(),wk=lastNDays(d,7).reverse(),vals=wk.map(k=>(H[k]||{})[key]),b30=lastNDays(d,31).slice(1).map(k=>(H[k]||{})[key]).filter(v=>v!=null);
  const vs=vals.filter(v=>v!=null);if(!vs.length)return `<div class="lbl">${TT('Henüz veri yok.','No data yet.')}</div>`;
  const mu=b30.length>=5?b30.reduce((a,b)=>a+b,0)/b30.length:null,sd=mu!=null?Math.max(o.minSd||1,Math.sqrt(b30.reduce((a,b)=>a+(b-mu)**2,0)/b30.length)):null,lo=mu!=null?Math.round(mu-sd):null,hi=mu!=null?Math.round(mu+sd):null;
  const all=[...vs,...(lo!=null?[lo,hi]:[])],mx=Math.max(...all)+2,mn=Math.min(...all)-2,W=320,Hh=92,X=i=>14+i/6*(W-28),Y=v=>10+(mx-v)/((mx-mn)||1)*(Hh-20);
  const ti=vals.length-1,tv=vals[ti],st=tv==null||lo==null?null:tv<lo?'low':tv>hi?'high':'in';
  const good=st==null?null:st==='in'?true:(o.lowGood?st==='low':st==='high');
  const vtxt=tv==null?TT('Bugün için ölçüm yok.','No reading today.'):lo==null?TT(`Bugün ${tv} ${o.u}. Normalini hesaplamak için birkaç gün daha veri gerekiyor.`,`Today ${tv} ${o.u}. A few more days are needed to learn your normal.`):
    st==='in'?TT(`Bugün ${tv} ${o.u}, senin normalinin (${lo}–${hi}) içinde.`,`Today ${tv} ${o.u}, within your normal (${lo}–${hi}).`):TT(`Bugün ${tv} ${o.u}, normalinin (${lo}–${hi}) ${st==='low'?'altında':'üstünde'}.`,`Today ${tv} ${o.u}, ${st==='low'?'below':'above'} your normal (${lo}–${hi}).`);
  const pts=vals.map((v,i)=>v==null?null:[X(i),Y(v),v,i]).filter(Boolean),path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join('');
  return `<div class="tbv ${good==null?'':good?'ok':'wr'}"><i>${good==null?'•':good?'✓':'!'}</i><span>${vtxt} <em>${o.hint}</em></span></div>
   <svg aria-hidden="true" viewBox="0 0 ${W} ${Hh+22}" class="tbs">${lo!=null?`<rect x="0" y="${Y(hi)}" width="${W}" height="${Math.max(2,Y(lo)-Y(hi))}" rx="6" fill="${o.col}" opacity=".12"/><line x1="0" x2="${W}" y1="${Y(mu)}" y2="${Y(mu)}" stroke="${o.col}" stroke-opacity=".45" stroke-dasharray="3 4"/>`:''}
    <path d="${path}" fill="none" stroke="${o.col}" stroke-width="2.2" stroke-linejoin="round"/>
    ${(()=>{const mxv=Math.max(...pts.map(q=>q[2])),mnv=Math.min(...pts.map(q=>q[2]));o._mx=mxv;o._mn=mnv;return ''})()}${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[3]===ti||p[2]===o._mx?4.2:3}" fill="${p[2]===o._mx?'#ff3b4f':p[3]===ti?o.col:'var(--card)'}" stroke="${p[2]===o._mx?'#ff3b4f':o.col}" stroke-width="2"/><text x="${p[0]}" y="${p[1]-10}" text-anchor="middle" font-size="11" font-weight="${p[3]===ti?800:600}" fill="currentColor" opacity="${p[3]===ti?1:.7}">${p[2]}</text>`).join('')}
    ${wk.map((k,i)=>`<text x="${X(i)}" y="${Hh+16}" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="${i===ti?1:.75}" font-weight="${i===ti?700:500}">${i===ti?TT('Bugün','Today'):new Date(k+'T12:00').toLocaleDateString(LOC(),{weekday:'short'})}</text>`).join('')}</svg>
   <div class="tbl"><span><i style="background:#ff3b4f;border-radius:50%"></i>${TT('En yüksek','Highest')}</span><span><i style="background:${o.col};opacity:.25"></i>${TT('Senin normalin (son 30 gün)','Your normal (last 30 days)')}</span><span><i class="dl" style="border-color:${o.col}"></i>${TT('Ortalaman','Your average')}${mu!=null?' '+Math.round(mu):''}</span></div>`}
const mfmt=m=>{m=((Math.round(m)%1440)+1440)%1440;return z(Math.floor(m/60))+':'+z(m%60)};
function slpBW(k){const sl=(HD()[k]||{}).sleep||{};if(!sl.bed||!sl.wake)return null;let b=hm(sl.bed),w=hm(sl.wake);if(b<720)b+=1440;while(w<=b)w+=1440;return{b,w}}
function consScore(d){const r=lastNDays(d,7).map(slpBW).filter(Boolean);if(r.length<3)return null;const sd=a=>{const m=a.reduce((x,y)=>x+y,0)/a.length;return Math.sqrt(a.reduce((x,y)=>x+(y-m)**2,0)/a.length)};
  return Math.max(0,Math.min(100,Math.round(100-(sd(r.map(q=>q.b))+sd(r.map(q=>q.w)))/2*.9)))}
function sleepCons(d){const days=lastNDays(d,7).reverse(),rows=days.map(k=>({k,...(slpBW(k)||{})})),ok=rows.filter(r=>r.b!=null);
  if(!ok.length)return `<div class="dp-c"><div class="lbl">${TT('Uyku saati verisi yok.','No sleep times yet.')}</div></div>`;
  const sc=consScore(d),pv=consScore(lastNDays(d,2)[1]),df=sc!=null&&pv!=null?sc-pv:0;
  const ideal=k=>{const prev=lastNDays(k,8).slice(1).map(slpBW).filter(Boolean),src=prev.length>=2?prev:ok;return{b:src.reduce((a,q)=>a+q.b,0)/src.length,w:src.reduce((a,q)=>a+q.w,0)/src.length}};
  const W=340,Hh=190,L=46,R=8,T=22,B=26,T0=1260,T1=2220,Y=m=>T+Math.max(0,Math.min(1,(m-T0)/(T1-T0)))*(Hh-T-B),n=rows.length,cw=(W-L-R)/n,X=j=>L+cw*(j+.5),bw=Math.min(26,cw*.46);
  const idl=rows.map(r=>ideal(r.k)),line=key=>idl.map((q,j)=>`${j?'L':'M'}${X(j).toFixed(1)},${Y(q[key]).toFixed(1)}`).join('');
  const last=rows[n-1],pill=(x,y,t)=>`<rect x="${x-21}" y="${y-9}" width="42" height="18" rx="5" fill="#16263d" stroke="#9ec3ec" stroke-opacity=".5"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="11" font-weight="700" fill="#cfe3fa">${t}</text>`;
  return `<div class="dp-c scn"><div class="row between" style="align-items:flex-start"><div><div class="scn-k">${TT('UYKU DÜZENİ','SLEEP CONSISTENCY')}</div>
     <div class="scn-v">${sc!=null?sc+'%':'—'}${sc!=null&&pv!=null&&df!==0?`<i class="${df>0?'up':'dn'}">${df>0?'▲':'▼'}</i>`:''}</div>${pv!=null?`<small class="scn-p">${TT('dün','yesterday')} ${pv}%</small>`:''}</div>
    <button class="scn-i" onclick="__inf('cons')" aria-label="${TT('Bilgi','Info')}">i</button></div>
   <div class="scn-l"><svg width="22" height="6" aria-hidden="true"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/></svg>${TT('İDEAL YATIŞ/KALKIŞ','OPTIMAL BED/WAKE TIME')}</div>
   <svg viewBox="0 0 ${W} ${Hh}" style="width:100%;display:block" role="img" aria-label="${TT('Son 7 gecenin yatış ve kalkış saatleri','Bed and wake times for the last 7 nights')}">
    ${[21,1,5,9,13].map(h=>{const m=h>=21?h*60:h*60+1440;return `<line x1="${L}" x2="${W-R}" y1="${Y(m)}" y2="${Y(m)}" stroke="rgba(127,127,140,.22)"/><text x="0" y="${Y(m)+4}" font-size="11" fill="currentColor" opacity=".7">${z(h)}:00</text>`}).join('')}
    ${rows.map((r,j)=>{const cur=j===n-1;return (r.b!=null?`<rect x="${X(j)-bw/2}" y="${Y(r.b)}" width="${bw}" height="${Math.max(3,Y(r.w)-Y(r.b))}" rx="3" fill="${cur?'#9ec3ec':'rgba(165,170,182,.55)'}"/>`:'')+`<text x="${X(j)}" y="${Hh-8}" text-anchor="middle" font-size="11" fill="currentColor" opacity="${cur?1:.6}" font-weight="${cur?700:500}">${new Date(r.k+'T12:00').toLocaleDateString(LOC(),{weekday:'short'})}</text>`}).join('')}
    <path d="${line('b')}" fill="none" stroke="currentColor" stroke-opacity=".75" stroke-width="1.4" stroke-dasharray="4 3"/><path d="${line('w')}" fill="none" stroke="currentColor" stroke-opacity=".75" stroke-width="1.4" stroke-dasharray="4 3"/>
    ${last.b!=null?pill(X(n-1),Math.max(10,Y(last.b)-12),mfmt(last.b))+pill(X(n-1),Math.min(Hh-B-2,Y(last.w)+12),mfmt(last.w)):''}</svg>
   <div class="lbl" style="margin-top:8px;line-height:1.5">${TT('Her çubuk bir gece: üst ucu yatış, alt ucu kalkış saati. Kesikli çizgiler önceki gecelerine göre ideal saatlerin; çubuklar çizgilere yakın kaldıkça düzenin yükselir.','Each bar is one night: the top is bedtime, the bottom is wake time. Dashed lines are your ideal times based on previous nights; staying close to them raises your score.')}</div></div>`}
function napsCard(d){const H=HD(),days=[d],naps=[];days.forEach(k=>{const sl=(H[k]||{}).sleep||{};(sl.naps||[]).forEach((n,i)=>naps.push({k,i,...n}))});
  if(!naps.length)return `<div class="dp-c"><div class="nap0"><span>${lic('sun',20)}</span><div><b>${TT('Bu gün şekerleme yok','No naps this day')}</b><small>${TT('Gündüz 15 dk\'dan uzun uyuduğunda Fitbit bunu şekerleme olarak kaydeder ve burada görünür.','When you sleep more than 15 min during the day, Fitbit records it as a nap and it shows here.')}</small></div></div></div>`;
  return naps.slice().reverse().map((n,j)=>{const x=H[n.k]||{},b=hm(n.bed),w=hm(n.wake),span=((w-b)%1440+1440)%1440||n.min;let pts=[];
    if(x.hr1){for(let m=0;m<=span;m++){const v=x.hr1[(b+m)%1440];if(v!=null)pts.push([m/span,v,mfmt(b+m)])}}else if(x.hr15){for(let m=0;m<=span;m+=15){const v=x.hr15[Math.floor(((b+m)%1440)/15)];if(v!=null)pts.push([m/span,v,mfmt(b+m)])}}
    const vs=pts.map(p=>p[1]),avg=vs.length?Math.round(vs.reduce((a,c)=>a+c,0)/vs.length*10)/10:null;
    return `<div class="dp-c napi"><div class="napi-h"><span class="napc-i">${lic('sun',18)}</span><div><b>${new Date(n.k+'T12:00').toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'})}</b><small>${TT('Google Health ile kaydedildi','Tracked with Google Health')}</small></div><em>${tmV(n.min||0)}</em></div>
     <div class="nps-r">${lic('moon',18)}<span>${TT('Uyku dönemi','Sleep period')}</span><b>${n.bed} – ${n.wake}</b></div>
     <div class="napi-t">${TT('Uyku sırasında nabız','Sleeping heart rate')}</div>
     ${avg!=null?`<div class="nps-hr"><b>${String(avg).replace('.',',')}</b><span>bpm</span><small>${TT('ORTALAMA NABIZ','AVERAGE HR')}${x.rhr?` · ${TT('dinlenik','resting')} ${x.rhr}`:''}</small></div>${scrubChart('naph'+j,pts,{title:TT('Nabız','Heart rate'),u:'bpm',min:Math.min(...vs)-6,max:Math.max(...vs)+6,grid:[Math.round(Math.min(...vs)),Math.round(Math.max(...vs))],h:110,xl:[n.bed,n.wake]})}`:`<div class="lbl">${TT('Bu şekerleme için nabız verisi yok.','No heart-rate data for this nap.')}</div>`}</div>`}).join('')}
function stageInsights(tl,sl,span){if(!tl||!tl.length)return '';const fd=tl.find(p=>p[2]==='d'),dTot=tl.filter(p=>p[2]==='d').reduce((a,p)=>a+p[1]-p[0],0),dFirst=tl.filter(p=>p[2]==='d').reduce((a,p)=>a+Math.max(0,Math.min(p[1],span/2)-p[0]),0),rTot=tl.filter(p=>p[2]==='r').reduce((a,p)=>a+p[1]-p[0],0),rLast=tl.filter(p=>p[2]==='r').reduce((a,p)=>a+Math.max(0,p[1]-Math.max(p[0],span/2)),0);
  const lr=tl.filter(p=>p[2]==='r').sort((a,b)=>(b[1]-b[0])-(a[1]-a[0]))[0],b0=hm(sl.bed||'00:00'),cyc=Math.max(1,Math.round(span/90));
  const I=[fd?[TT('İlk derin uyku','First deep sleep'),TT(`yattıktan ${Math.round(fd[0])} dk sonra`,`${Math.round(fd[0])} min after bedtime`),fd[0]<=40]:null,
    dTot?[TT('Derin uykunun gecenin ilk yarısındaki payı','Share of deep sleep in first half'),'%'+Math.round(dFirst/dTot*100),dFirst/dTot>=.55]:null,
    rTot?[TT('REM\'in gecenin ikinci yarısındaki payı','Share of REM in second half'),'%'+Math.round(rLast/rTot*100),rLast/rTot>=.5]:null,
    lr?[TT('En uzun REM dönemi','Longest REM period'),`${mfmt(b0+lr[0])} · ${Math.round(lr[1]-lr[0])} dk`,null]:null,
    [TT('Tahmini uyku döngüsü','Estimated sleep cycles'),`≈ ${cyc} × 90 dk`,cyc>=4]].filter(Boolean);
  return `<div class="sti">${I.map(r=>`<div><span>${r[0]}</span><b>${r[1]}${r[2]==null?'':r[2]?' <i class="ok">✓</i>':' <i class="wr">!</i>'}</b></div>`).join('')}</div>`}
/* ===== Gizlilik: açık rıza, yasal bilgiler, engelle / şikayet ===== */
const CONTACT=()=>{const c=(window.HM_CONFIG||{}).contact||{};return{name:c.name||'Yasin Doğru',email:c.email||'',gh:c.github||'https://github.com/Yasindogruu/HypeMode/issues'}};
const contactHtml=()=>{const c=CONTACT();return `${c.email?`<a href="mailto:${esc(c.email)}">${esc(c.email)}</a> · `:''}<a href="${c.gh}" target="_blank" rel="noopener">GitHub</a>`};
const CLP=en=>window.HM_PWA?(en?'Google Firebase (USA)':'Google Firebase (ABD)'):(en?'Anthropic / claude.ai (USA)':'Anthropic / claude.ai (ABD)');
function rzSheet(){ui._rzOpen=1;const r=S.settings.rz||{},c0=r.v?!!r.cloud:(rzC()?true:null),h0=r.v?!!r.health:null,loc=window.HM_PWA&&localStorage.getItem('hm-local')==='1';
  const ch=(n,v,y,no)=>`<div class="rzo"><label><input type="radio" name="${n}" value="1" ${v===true?'checked':''}> ${y}</label><label><input type="radio" name="${n}" value="0" ${v===false?'checked':''}> ${no}</label></div>`;
  sheet(`<div class="rzs"><h3>🔒 ${TT('Kişisel verilerin','Your personal data')}</h3>
   <div class="rzi"><b>${TT('Aydınlatma Metni','Privacy Notice')}</b><p>${TT('Hangi verilerini, hangi amaçla ve hukuki sebeple işlediğimizi, kimlere aktardığımızı ve KVKK kapsamındaki haklarını Aydınlatma Metni\'nde bulabilirsin. HypeMode ücretsizdir; reklam, analitik ya da takip aracı kullanmaz ve verini satmaz.','The Privacy Notice explains which data we process, why, on what legal basis, who receives it and your rights. HypeMode is free; no ads, analytics or tracking, and we never sell your data.')}</p><button class="link rzl" onclick="__legal()">${TT('Aydınlatma Metni\'ni oku ›','Read the Privacy Notice ›')}</button></div>
   <div class="rzc2"><b>${TT('Bulut hesabı ve eşitleme','Cloud account and sync')}</b><span>${TT('Verilerin hesabında saklanır, telefonun, tabletin ve bilgisayarın arasında eşitlenir; arkadaş özellikleri açılır.','Your data is kept in your account and synced across your devices; friend features turn on.')}</span>${loc?`<em>${TT('Şu an hesapsız kullanıyorsun. Bulutu seçersen hesap açma ekranına yönlendirilirsin.','You are using the app without an account. Choosing cloud takes you to sign-up.')}</em>`:''}${ch('rz_c',c0,TT('Bulutta sakla','Use cloud'),TT('Sadece bu cihaz','This device only'))}<small>${TT('Sadece bu cihazı seçersen verilerin cihazında kalır; arkadaş özellikleri çalışmaz.','On this device only, friend features are off.')}</small></div>
   <div class="rzh">${TT('Açık Rıza Metni','Explicit Consent')} <button class="link" onclick="__legal('acik-riza.html')">${TT('metni oku ›','read ›')}</button></div>
   <div class="rzc2"><b>${TT('Sağlık verilerinin bulutta saklanması','Health data in the cloud')}</b><span>${TT('Nabız, HRV, uyku, adım, kilo, vücut ölçüleri, regl döngüsü, takviye kayıtları ve ilerleme fotoğraflarımın buluta yedeklenmesine açık rıza veriyorum.','I consent to my heart rate, HRV, sleep, steps, weight, body measurements, cycle, supplement logs and progress photos being backed up to the cloud.')}</span>${ch('rz_h',h0,TT('Onaylıyorum','I consent'),TT('Onaylamıyorum','I do not consent'))}<small>${TT('Onaylamazsan bu veriler yalnızca bu cihazda kalır; tüm ekranlar yine çalışır.','If not, these stay on this device only; all screens still work.')}</small></div>
   <div class="er" id="rz_e" style="display:none;color:var(--bad);font-size:13px;margin:4px 0 8px">${TT('İki seçenek için de bir seçim yap.','Choose an option for both.')}</div>
   <button class="btn" onclick="__rzSave()">${TT('Seçimlerimi kaydet','Save my choices')}</button>
   <div class="lbl" style="margin-top:10px;text-align:center">${TT('Seçimlerini istediğin an Ayarlar → Gizlilik ve yasal bölümünden değiştirebilir, rızanı geri alabilirsin.','You can change your choices or withdraw consent anytime in Settings → Privacy & legal.')}</div></div>`)}
function rzApply(cloud,health){const was=rzC(),wasH=rzH(),rz={v:2,cloud:!!cloud,health:!!(cloud&&health),at:Date.now()};
  try{if(cloud)localStorage.setItem('hm-rz-cloud',String(Date.now()));else localStorage.removeItem('hm-rz-cloud')}catch(e){}
  if(cloud&&!CL.started){/* önce buluttan çek, sonra rızayı üstüne uygula: eski cihaz verisi buluttakini ezmesin */S.settings.rz=rz;CL.pendingRz=rz;cacheLocal();initCloud().finally(()=>{CL.ready=true;render(true)});return}
  S.settings.rz=rz;save();
  if(cloud&&wasH!==rzH())pushAll(true);
  if(!cloud&&was){const db=CL.db;CL.db=null;CL.started=0;CL.status='local';
    ask(TT('Bulut eşitleme kapatıldı. Buluttaki verilerin de silinsin mi? (Bu cihazdaki veriler kalır.)','Cloud sync is off. Delete your data from the cloud too? (Data on this device stays.)'),()=>rzWipe(db),TT('Buluttan sil','Delete from cloud'))}
  else if(wasH&&!rzH())toast(TT('Sağlık verileri buluttan kaldırılıyor; bu cihazda kalır.','Health data is being removed from the cloud; it stays on this device.'))}
async function rzWipe(db){let n=0;try{if(db&&CL.base){const col=db.collection(CL.base);for(const id of Object.keys(CL.last)){try{await col.doc(id).delete();n++}catch(e){}}CL.last={}}
  const D=CL.sdb,me=await socId();if(D&&me)for(const c of ['social','names','push']){try{await D.collection(c).doc(me).delete()}catch(e){}}}catch(e){}
  toast(TT(`Buluttan silindi (${n} kayıt)`,`Deleted from cloud (${n} records)`))}
window.__rzSave=()=>{const g=n=>{const e=document.querySelector(`input[name=${n}]:checked`);return e?e.value==='1':null},c=g('rz_c'),h=g('rz_h');if(c===null||h===null){const e=document.getElementById('rz_e');if(e)e.style.display='block';return}
  if(c&&window.HM_PWA&&localStorage.getItem('hm-local')==='1'){S.settings.rz={v:2,cloud:true,health:!!h,at:Date.now()};save();cacheLocal&&cacheLocal();localStorage.setItem('hm-rz-cloud',String(Date.now()));localStorage.removeItem('hm-local');location.reload();return}
  rzApply(c,c&&h);closeSheet();render(true)};
window.__rzSet=(k,v)=>{if(v&&window.HM_PWA&&localStorage.getItem('hm-local')==='1'){ask(TT('Bulut için hesap açman gerekiyor. Hesap açma ekranına geçilsin mi? Bu cihazdaki verilerin korunur.','A cloud account is needed. Go to sign-up? Your data on this device is kept.'),()=>{S.settings.rz={v:2,cloud:true,health:k==='health'?true:rzH(),at:Date.now()};save();localStorage.removeItem('hm-local');location.reload()},TT('Devam','Continue'));render(true);return}const r=S.settings.rz||{v:1,cloud:rzC(),health:rzH()};const n={cloud:r.cloud,health:r.health,[k]:v};if(k==='cloud'&&!v)n.health=false;if(k==='health'&&v)n.cloud=true;rzApply(n.cloud,n.health);render(true)};
function rzMaybe(){if(S.settings.rz&&S.settings.rz.v>=2||ui._rzOpen||(!S.onboarded&&(window.HM_PWA||!CL.waitRz)))return;if(document.querySelector('.dsp')||document.getElementById('scrim')||document.getElementById('hmAuth'))return setTimeout(rzMaybe,900);rzSheet()}
function legalV(){const c=CONTACT(),bl=S.blocked||[];
  const t2=(lab,sub,chk,fn)=>`<label class="sr srt"><span class="sr-t"><b>${lab}</b><small>${sub}</small></span><input type="checkbox" class="swi" ${chk?'checked':''} onchange="${fn}"></label>`;
  return `<div class="card"><b>${TT('Aydınlatma Metni ve Gizlilik','Privacy notice')}</b><div class="lbl" style="margin:6px 0 12px;line-height:1.5">${TT('Hangi verileri neden işlediğimizi, kimlere aktarıldığını, ne kadar saklandığını ve KVKK kapsamındaki haklarını anlatır.','Explains which data we process and why, who receives it, how long it is kept and your rights under KVKK.')}</div><div class="lgl">${[['gizlilik.html',TT('Aydınlatma Metni','Privacy Notice')],['acik-riza.html',TT('Açık Rıza Metni','Explicit Consent')],['kullanim-kosullari.html',TT('Kullanım Koşulları','Terms of Use')],['cerez.html',TT('Çerez ve Yerel Depolama','Cookies & storage')]].map(q=>`<button class="dpr" onclick="__legal('${q[0]}')"><div><b>${q[1]}</b></div><i>›</i></button>`).join('')}</div><button class="btn ghost" style="margin-top:10px" onclick="rzSheet()">${TT('Rıza seçimlerimi gözden geçir','Review my consent choices')}</button></div>
   <div class="sg-t">${TT('Açık rızaların','Your consents')}</div><div class="sg">${t2(TT('Bulut hesabı · yurt dışı aktarım','Cloud account · transfer abroad'),TT(CLP()+' · eşitleme ve arkadaşlar',CLP(1)+' · sync and friends'),rzC(),"__rzSet('cloud',this.checked)")}${t2(TT('Sağlık verilerini buluta yedekle','Back up health data'),TT('Nabız, uyku, kilo, döngü, fotoğraf · kapalıysa sadece bu cihazda','Heart, sleep, weight, cycle, photos · off = this device only'),rzH(),"__rzSet('health',this.checked)")}</div>
   ${S.settings.rz&&S.settings.rz.at?`<div class="sg-n">${TT('Son güncelleme','Last updated')}: ${new Date(S.settings.rz.at).toLocaleString(LOC())}</div>`:''}
   <div class="sg-t">${TT('Engellenenler','Blocked')}</div><div class="sg">${bl.length?bl.map(b=>`<div class="sr"><span class="sr-t"><b>@${esc(b.username||'?')}</b><small>${new Date(b.at||Date.now()).toLocaleDateString(LOC())}</small></span><button class="pill" onclick="__unblock('${esc(b.uid)}')">${TT('Kaldır','Unblock')}</button></div>`).join(''):`<div class="sr"><span class="sr-t"><small>${TT('Engellediğin kimse yok.','You haven\'t blocked anyone.')}</small></span></div>`}</div>
   <div class="card" style="margin-top:14px"><b>${TT('İletişim, şikayet ve telif bildirimi','Contact, complaints and copyright notices')}</b><div class="lbl" style="margin-top:6px;line-height:1.55">${TT('Veri talepleri (KVKK m.11), hukuka aykırı içerik ya da telif hakkı ihlali bildirimleri için','For data requests (KVKK Art. 11), unlawful content or copyright notices')}: ${contactHtml()}.<br>${TT('Bildirimler incelenir; hukuka aykırı içerik en geç 48 saat içinde kaldırılır.','Notices are reviewed; unlawful content is removed within 48 hours.')}</div></div>
   <div class="card"><b>${TT('Yer sağlayıcı ve geliştirici','Hosting provider and developer')}</b><div class="lbl" style="margin-top:6px;line-height:1.55">${esc(c.name)} · ${TT('bireysel geliştirici. HypeMode, 5651 sayılı Kanun kapsamında arkadaşlar arası paylaşılan içerikler için yer sağlayıcıdır. Uygulama dosyaları GitHub Pages\'te, hesap verileri Google Firebase\'de barındırılır. Uygulama ücretsizdir; ödeme ve ticari e-posta yoktur.','individual developer. HypeMode is the hosting provider (Law 5651) for content shared between friends. App files are hosted on GitHub Pages, account data on Google Firebase. The app is free; there are no payments or marketing emails.')}</div></div>`}
window.__unblock=id=>{S.blocked=(S.blocked||[]).filter(b=>b.uid!==id);save();render(true)};
window.__block=(id,un)=>{ask(TT(`@${un} engellensin mi? Arkadaş listenden çıkar, sana mesaj, istek ve bildirim gönderemez.`,`Block @${un}? They are removed from your friends and can't message you.`),async()=>{
  S.blocked=[...(S.blocked||[]).filter(b=>b.uid!==id),{uid:id,username:un,at:Date.now()}];S.friends=(S.friends||[]).filter(f=>f.uid!==id);
  const mine=SOC.pokes.filter(p=>p.from===id);SOC.pokes=SOC.pokes.filter(p=>p.from!==id);save();closeSheet();render(true);toast(TT('Engellendi','Blocked'));
  const D=SDB();if(D)for(const p of mine){try{await D.collection('pokes').doc(p.id).delete()}catch(e){}}},TT('Engelle','Block'))};
window.__report=(id,un)=>{const R=[['abuse',TT('Taciz, hakaret ya da tehdit','Harassment or threats')],['img',TT('Uygunsuz fotoğraf','Inappropriate photo')],['spam',TT('Spam','Spam')],['ip',TT('Telif hakkı ihlali','Copyright infringement')],['other',TT('Diğer','Other')]];
  sheet(`<h3>${TT('Şikayet et','Report')} · @${esc(un)}</h3><div class="rpr">${R.map((r,i)=>`<label><input type="radio" name="rp_r" value="${r[0]}" ${i?'':'checked'}> ${r[1]}</label>`).join('')}</div>
   <textarea id="rp_t" rows="3" maxlength="500" placeholder="${TT('Kısaca açıkla (isteğe bağlı)','Describe briefly (optional)')}" style="width:100%;margin-top:10px"></textarea>
   <label class="rpr" style="margin-top:6px"><input type="checkbox" id="rp_b" checked> ${TT('Ayrıca engelle','Also block')}</label>
   <button class="btn" style="margin-top:12px" onclick="__reportSend('${esc(id)}','${esc(un)}')">${TT('Gönder','Send')}</button>
   <div class="lbl" style="margin-top:10px;line-height:1.5">${TT('Şikayetin ve bu kişiden gelen son mesajlar incelenmek üzere iletilir. Acil bir tehlike varsa 112\'yi ara.','Your report and recent messages from this person are sent for review. In an emergency call 112.')}</div>`)};
window.__reportSend=async(id,un)=>{const r=(document.querySelector('input[name=rp_r]:checked')||{}).value||'other',t=((document.getElementById('rp_t')||{}).value||'').slice(0,500),b=(document.getElementById('rp_b')||{}).checked;
  const msgs=SOC.pokes.filter(p=>p.from===id).slice(0,10).map(p=>({type:p.type,msg:p.msg||'',at:p.at}));let ok=false;
  const D=SDB(),me=await socId();if(D&&me){try{await D.collection('reports').doc(uid()+uid()).set({from:me,about:id,username:un,reason:r,text:t,msgs,at:Date.now()});ok=true}catch(e){}}
  closeSheet();if(b){S.blocked=[...(S.blocked||[]).filter(x=>x.uid!==id),{uid:id,username:un,at:Date.now()}];S.friends=(S.friends||[]).filter(f=>f.uid!==id);SOC.pokes=SOC.pokes.filter(p=>p.from!==id);save();render(true)}
  toast(ok?TT('Şikayetin alındı, teşekkürler','Report received, thank you'):TT('Gönderilemedi; iletişim adresinden bildirebilirsin','Couldn\'t send; please use the contact address'));if(!ok)setTimeout(()=>{A.go('settings');A.setSec&&A.setSec('legal')},400)};
/* ===== Akıllı uyandırma ===== */
function swPlan(){const W=S.swake||{},c=sleepCoach(),to=hm(W.to||c.wake),win=+W.win||30,from=to-win,bed=hm(W.bed||c.bed),lat=c.lat||15;
  const H=S.health||{},cyc=(()=>{const v=Object.values(H).map(x=>x.sleep&&x.sleep.min).filter(Boolean);if(v.length<5)return 90;const av=v.reduce((a,b)=>a+b,0)/v.length,n=Math.round(av/90);return Math.max(80,Math.min(105,Math.round(av/n)))})();
  let start=bed+lat;if(start>to)start-=1440;let best=null;for(let k=1;k<9;k++){const t=start+k*cyc;if(t>=from-0&&t<=to)best=t}
  const t=best!=null?best:to,cy=Math.round((t-start)/cyc*10)/10,nb=to-Math.max(4,Math.ceil((to-start)/cyc))*cyc-lat;return{sb:((nb%1440)+1440)%1440,t:((t%1440)+1440)%1440,from:((from%1440)+1440)%1440,to:((to%1440)+1440)%1440,win,cyc,cy,bed:((bed%1440)+1440)%1440,inCycle:best!=null}}
const hmT=m=>z(Math.floor(m/60)%24)+':'+z(Math.round(m)%60);
let SW_LAST='';
function swTick(){const W=S.swake;if(!W||!W.on)return;const P=swPlan(),n=new Date(),nm=n.getHours()*60+n.getMinutes(),key=dkey()+'-'+P.t;
  if(nm===P.t&&SW_LAST!==key&&!(W.snooze&&W.snooze>Date.now())){SW_LAST=key;swAlarm(P)}if(W.snooze&&W.snooze<=Date.now()){W.snooze=0;swAlarm(P)}}
function swAlarm(P){const el=document.createElement('div');el.className='swal';el.innerHTML=`<div class="swal-r"></div><small>Günaydın${S.profile.name?', '+esc(S.profile.name):''}</small><b>${hmT(P.t)}</b><p>Uyku döngünün sonundasın, şimdi kalkmak en kolay an.</p><div class="grid2"><button class="btn ghost" id="swS">5 dk ertele</button><button class="btn" id="swK">Kalktım</button></div>`;
  document.body.appendChild(el);let k=0;const lp=setInterval(()=>{buzz([500,250,500,250,900]);beep(660+((k++)%3)*110,.35)},2200);buzz([500,250,500,250,900]);
  const close=()=>{clearInterval(lp);el.remove();try{navigator.vibrate&&navigator.vibrate(0)}catch(_){}};
  el.querySelector('#swK').onclick=()=>{close();toast('☀️ İyi bir gün olsun')};el.querySelector('#swS').onclick=()=>{close();S.swake.snooze=Date.now()+5*6e4;save();toast('5 dakika sonra tekrar')}}
setInterval(swTick,20000);
/* uyku ↔ performans */
function perfIdx(s,i){const by={};s.sets.forEach(x=>{if(x.t||!(x.kg>0))return;const v=e1rm(x.kg,x.reps);if(!by[x.ex]||v>by[x.ex])by[x.ex]=v});const r=[];
  Object.entries(by).forEach(([n,v])=>{for(let j=i-1;j>=0;j--){const p=S.sessions[j].sets.filter(x=>x.ex===n&&!x.t&&x.kg>0);if(p.length){const b=Math.max(...p.map(x=>e1rm(x.kg,x.reps)));if(b>0)r.push(v/b-1);break}}});
  return r.length?r.reduce((a,b)=>a+b,0)/r.length*100:null}
function sleepPerf(){const H=HD(),rows=[];S.sessions.forEach((s,i)=>{const d=dkey(new Date(s.date)),sl=(H[d]||{}).sleep;if(!sl||!sl.min)return;const p=perfIdx(s,i);if(p==null||Math.abs(p)>25)return;const sc=healthScores(d);rows.push({d,min:sl.min,p,rec:sc?sc.rec:null})});
  if(rows.length<4)return{need:4-rows.length,n:rows.length};const g=(f)=>{const a=rows.filter(f);return a.length?{n:a.length,p:a.reduce((x,y)=>x+y.p,0)/a.length}:null};
  const hi=g(r=>r.min>=420),lo=g(r=>r.min<420),rh=g(r=>r.rec!=null&&r.rec>=67),rl=g(r=>r.rec!=null&&r.rec<50);
  const mx=rows.reduce((a,b)=>a+b.min,0)/rows.length,my=rows.reduce((a,b)=>a+b.p,0)/rows.length;let sxy=0,sxx=0,syy=0;rows.forEach(r=>{sxy+=(r.min-mx)*(r.p-my);sxx+=(r.min-mx)**2;syy+=(r.p-my)**2});
  return{rows,hi,lo,rh,rl,r:sxx&&syy?sxy/Math.sqrt(sxx*syy):0,n:rows.length}}
function sleepPerfCard(){const P=sleepPerf(),f=v=>(v>0?'+':'')+fmt(Math.round(v*10)/10)+'%';
  if(P.need)return `<div class="card"><b>😴 Uyku ↔ performans</b><div class="lbl" style="margin-top:6px">Uyku verisi olan ${P.need} antrenman daha yapınca uykunun kaldırdığın ağırlıklara etkisini göstereceğim.</div></div>`;
  const W=300,Hh=90,xs=P.rows.map(r=>r.min),x0=Math.min(...xs,300),x1=Math.max(...xs,540),ys=P.rows.map(r=>r.p),y0=Math.min(-5,...ys),y1=Math.max(5,...ys);
  const X=v=>(v-x0)/(x1-x0||1)*W,Y=v=>Hh-(v-y0)/(y1-y0||1)*Hh;
  const msg=P.hi&&P.lo?`7 saat ve üzeri uyuduğun günlerde gücün önceki antrenmana göre ortalama <b>${f(P.hi.p)}</b>, daha az uyuduğunda <b>${f(P.lo.p)}</b>.`:`Ortalama değişim ${f(P.rows.reduce((a,b)=>a+b.p,0)/P.n)}.`;
  return `<div class="card"><div class="row between"><b>😴 Uyku ↔ performans</b><span class="lbl">${P.n} antrenman</span></div>
   <div class="lbl" style="margin:8px 0;line-height:1.5;color:var(--txt)">${msg}${P.rh&&P.rl?` Toparlanma yüksekken ${f(P.rh.p)}, düşükken ${f(P.rl.p)}.`:''}</div>
   <svg aria-hidden="true" viewBox="-6 -6 ${W+12} ${Hh+12}" width="100%" height="${Hh+12}"><line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--line)" stroke-dasharray="3 4"/><line x1="${X(420)}" x2="${X(420)}" y1="0" y2="${Hh}" stroke="var(--line)" stroke-dasharray="3 4"/>
   ${P.rows.map(r=>`<circle cx="${X(r.min).toFixed(1)}" cy="${Y(r.p).toFixed(1)}" r="4.5" fill="${r.p>=0?'#3ee6a0':'#ff6b5e'}" opacity=".85"/>`).join('')}</svg>
   <div class="row between lbl" style="font-size:11px"><span>${fmtMin(x0)}</span><span>7 sa</span><span>${fmtMin(x1)} uyku</span></div>
   <div class="lbl" style="margin-top:6px;font-size:11.5px">Her nokta bir antrenman: o gecenin uykusu ve hareketlerdeki tahmini 1RM'nin önceki seansa göre değişimi. ${Math.abs(P.r)>=.3?`Bağlantı ${P.r>0?'belirgin':'ters yönde'} (r=${fmt(Math.round(P.r*100)/100)}).`:'Henüz belirgin bir bağlantı yok.'}</div></div>`}

/* kişisel ideal uyku süresi */
function sleepOptimal(){if(S.healthDemo)return null;const H=S.health||{},b={};Object.keys(H).forEach(d=>{const sl=(H[d]||{}).sleep;if(!sl||!sl.min)return;const sc=healthScores(d);if(!sc||sc.rec==null)return;const k=Math.min(540,Math.max(330,Math.round(sl.min/30)*30));(b[k]=b[k]||[]).push(sc.rec)});
  const L=Object.entries(b).filter(x=>x[1].length>=3).map(([k,a])=>[+k,a.reduce((x,y)=>x+y,0)/a.length]);if(L.length<2)return null;L.sort((a,b)=>b[1]-a[1]);return{min:L[0][0],rec:Math.round(L[0][1])}}
function bedSpread(){const H=S.health||{},b=lastNDays(dkey(),14).map(k=>((H[k]||{}).sleep||{}).bed).filter(Boolean).map(t=>{let m=hm(t);if(m<720)m+=1440;return m});if(b.length<5)return null;const m=b.reduce((x,y)=>x+y,0)/b.length;return Math.round(Math.sqrt(b.reduce((x,y)=>x+(y-m)**2,0)/b.length))}

function HD(){if(S.healthDemo)return demoHealth();const H={...S.health};Object.keys(H).forEach(k=>{if(H[k]&&H[k].sleep){const f=slFix(H[k].sleep);if(f!==H[k].sleep)H[k]={...H[k],sleep:f}}});
  S.body.forEach(b=>{if(b.sleep!=null&&!H[b.date])H[b.date]={sleep:{min:Math.round(b.sleep*60)},manual:true}});return H}
const hasHealth=()=>S.healthDemo||Object.keys(S.health||{}).length>0||S.body.some(b=>b.sleep!=null);
const clampS=v=>Math.max(1,Math.min(99,Math.round(v)));
const meanSd=a=>{const m=a.reduce((x,y)=>x+y,0)/a.length;return{m,sd:Math.sqrt(a.reduce((x,y)=>x+(y-m)**2,0)/a.length)}};
const SDMIN={hrv:4,rhr:1.5,spo2:0.8,resp:0.4};
function baseline(key,d){const H=HD(),v=[];for(let i=1;i<=30;i++){const x=new Date(d+'T12:00');x.setDate(x.getDate()-i);const r=H[dkey(x)];if(r&&r[key]!=null)v.push(r[key])}
  if(v.length<5)return null;const b=meanSd(v);b.sd=Math.max(b.sd,SDMIN[key]||1);return b}
const lastNDays=(d,n)=>Array.from({length:n},(_,i)=>{const x=new Date(d+'T12:00');x.setDate(x.getDate()-i);return dkey(x)});
const NEED=480;
/* Uyku skoru: Fitbit yöntemi — süre (50) + kalite (25: derin+REM) + toparlanma (25: uykudaki nabız, uyanık süre) */
function sleepParts(x){const sl=(x||{}).sleep||{};if(!sl.min)return null;const cl=v=>Math.max(0,Math.min(1,v));
  const dur=50*cl((sl.min-180)/(480-180));
  const st=(sl.deep||0)+(sl.rem||0)+(sl.light||0),hasSt=st>sl.min*.5,frac=hasSt?((sl.deep||0)+(sl.rem||0))/st:null;
  const qual=frac!=null?25*cl((frac-.15)/(.45-.15)):16;
  const aw=sl.awake||0,awp=aw/Math.max(1,sl.min+aw),s2=cl(1-awp/.2);
  let shr=null;if(sl.bed&&sl.wake){const b=hm(sl.bed),w=hm(sl.wake),span=((w-b)%1440+1440)%1440,v=[];if(x.hr1)for(let m=0;m<span;m++){const q=x.hr1[(b+m)%1440];if(q!=null)v.push(q)}else if(x.hr15)for(let m=0;m<span;m+=15){const q=x.hr15[Math.floor(((b+m)%1440)/15)];if(q!=null)v.push(q)}if(v.length>3)shr=v.reduce((a,c)=>a+c,0)/v.length}
  const s1=shr!=null&&x.rhr?cl(.5+(x.rhr-shr)/10):null,rest=25*(s1!=null?.5*s1+.5*s2:s2*.85);
  const tot=Math.round(dur+qual+rest);return{dur:Math.round(dur),qual:Math.round(qual),rest:Math.round(rest),tot:Math.max(0,Math.min(100,tot)),frac,awp,shr:shr!=null?Math.round(shr):null}}
function healthScores(d){const H=HD(),x=H[d];if(!x)return null;const sl=x.sleep||{};
  const cz=v=>Math.max(-2.5,Math.min(2.5,v)),zz=(k)=>{const b=baseline(k,d);return b&&x[k]!=null?cz((x[k]-b.m)/b.sd):0};
  /* Toparlanma (WHOOP/Oura yöntemi): HRV'nin kendi normaline göre logaritmik sapması, dinlenik nabız, uyku ve dünkü yük */
  const sleep=sl.min?(sleepParts(x)||{}).tot??null:null;
  let hrvS=null;if(x.hrv>0){const v=lastNDays(d,31).slice(1).map(k=>(H[k]||{}).hrv).filter(q=>q>0).map(Math.log);let z0=0;if(v.length>=5){const b=meanSd(v);z0=cz((Math.log(x.hrv)-b.m)/Math.max(b.sd,.08))}hrvS=clampS(60+18*z0)}
  const rhrS=x.rhr!=null?clampS(60-18*zz('rhr')):null;
  const ps=strainOf(lastNDays(d,2)[1]),prevS=ps!=null?clampS(100-Math.max(0,ps-10)*9):null;
  const rb=baseline('resp',d),respPen=rb&&x.resp!=null&&x.resp>rb.m+Math.max(1,2*rb.sd)?10:0;
  const wavg=a=>{a=a.filter(p=>p[0]!=null);return a.length?a.reduce((q,p)=>q+p[0]*p[1],0)/a.reduce((q,p)=>q+p[1],0):null};
  const rec=(hrvS!=null||rhrS!=null)?clampS(wavg([[hrvS,.45],[rhrS,.2],[sleep,.25],[prevS,.1]])-respPen):null;
  /* Yük dengesi: son 7 günün ortalama yükü / son 28 günün ortalaması (0,8–1,3 ideal) */
  const sv=lastNDays(d,29).slice(1).map(k=>strainOf(k)),known=sv.filter(v=>v!=null);let load=null,acwr=null;
  if(known.length>=14){const a7=sv.slice(0,7).map(v=>v||0),a28=sv.map(v=>v||0),ac=a7.reduce((q,v)=>q+v,0)/7,ch=a28.reduce((q,v)=>q+v,0)/28;
    if(ch>0){acwr=Math.round(ac/ch*100)/100;load=clampS(acwr<.8?100-(.8-acwr)*150:acwr>1.3?100-(acwr-1.3)*200:100)}}
  const activity=x.steps!=null?clampS(x.steps/8000*100):null;
  const d7=lastNDays(d,7),beds=d7.map(k=>((H[k]||{}).sleep||{}).bed).filter(Boolean).map(b=>{const[h,m]=b.split(':').map(Number);let t=h*60+m;if(t<720)t+=1440;return t});
  const rhythm=beds.length>=3?clampS(100-meanSd(beds).sd*0.9):null;
  const debt=sleepDebt(d),sleepBal=lastNDays(d,7).some(k=>((H[k]||{}).sleep||{}).min)?clampS(100-debt/6):null;
  /* Hazırlık: toparlanma + uyku borcu + yük dengesi + uyku düzeni */
  const t0=wavg([[rec,.6],[sleepBal,.15],[load,.15],[rhythm,.1]]);
  if(t0==null&&sleep==null)return null;
  const tot=clampS(t0??sleep);
  return{d,tot,rec,sleep,load,acwr,activity,rhythm,sleepBal,hrvS,rhrS,prevS,respPen,x,demo:!!S.healthDemo}}
function healthToday(){const H=HD(),k=Object.keys(H).filter(d=>d<=dkey()).sort().pop();return k?healthScores(k):null}
const fmtMin=m=>m==null?'—':LANG()==='en'?`${Math.floor(m/60)}h ${z(m%60)}m`:`${Math.floor(m/60)}s ${z(m%60)}dk`;
function sleepDebt(d){const H=HD();return lastNDays(d,7).reduce((a,k)=>{const s=(H[k]||{}).sleep;return a+(s&&s.min?Math.max(0,NEED-s.min):0)},0)}
function healthCtx(){const sc=healthToday();if(!sc||sc.demo)return null;const x=sc.x;
  return{tarih:sc.d,hazirlik:sc.tot,toparlanma:sc.rec,uyku_skoru:sc.sleep,uyku:x.sleep?{sure_dk:x.sleep.min,derin:x.sleep.deep,rem:x.sleep.rem,verim:x.sleep.eff,yatis:x.sleep.bed,kalkis:x.sleep.wake}:null,
    hrv:x.hrv,dinlenik_nabiz:x.rhr,spo2:x.spo2,solunum:x.resp,adim:x.steps,aktif_dk:x.active,hrv_normal:(baseline('hrv',sc.d)||{}).m,nabiz_normal:(baseline('rhr',sc.d)||{}).m,uyku_borcu_dk:sleepDebt(sc.d)}}

/* ---------- AI (Claude) ---------- */
async function askAI(prompt,{tier='default'}={}){
  if(!CL.sample)throw{code:'not_granted'};
  if(LANG()==='en')prompt+='\n\nIMPORTANT: The user has the app in English. Write every human-readable text value (advice, notes, titles, steps, explanations) in English. Keep JSON keys unchanged, and keep any names that must match a list given above exactly as written there.';
  let v;
  try{
    if(typeof CL.sample.json==='function')v=await CL.sample.json(prompt,{modelTier:tier});
    else{const r=await CL.sample(prompt,{modelTier:tier});const m=(r.text||'').match(/\{[\s\S]*\}/);v=JSON.parse(m?m[0]:r.text)}
  }catch(e){
    if(e&&e.code==='not_granted'){CL.sample=null;render(true)}
    throw e}
  if(typeof v==='string'){try{v=JSON.parse(v)}catch(e){}}
  return v;
}
function aiErr(e){const c=e&&e.code;toast(c==='rate_limited'?'Çok sık istek: biraz sonra tekrar dene':c==='not_granted'?'AI izni verilmedi':'AI yanıt veremedi, tekrar dene')}
const GOALTXT=()=>{const p=S.profile,k=Math.round(rateKg(p)*100)/100;return p.applied?(p.goal==='cut'?`definasyon (haftada ~${k} kg, vücut ağırlığının %${p.pct})`:p.goal==='bulk'?`kas kazanımı / bulk (haftada +${k} kg, vücut ağırlığının %${p.pct})`:'kilo koruma'):'belirtilmemiş (hedef ayarlanmamış)'};
const r1=x=>Math.round(x*10)/10;
function daySummary(d){
  const t=dayTotals(d),ss=trainedOn(d),L=S.suppLog[d]||{},sp=suppsFor(d);
  return{tarih:d,kalori:Math.round(t.kcal),protein:Math.round(t.p),karb:Math.round(t.c),yag:Math.round(t.f),
    ogunler:dayMeals(d).map(m=>`${m.name} (${Math.round(m.kcal)} kcal, P${Math.round(m.p)})`),
    sivi_ml:fluid(d),su_hedef_ml:waterGoal(d).goal,kafein_mg:caffeine(d),
    takviye_alinan:sp.filter(s=>L[s.id]).map(s=>s.name),takviye_atlanan:sp.filter(s=>!L[s.id]).map(s=>s.name),
    antrenman:ss.map(s=>({ad:s.planName,sure_dk:Math.round((s.dur||0)/60),set:s.sets.length,hacim_kg:Math.round(s.sets.reduce((a,x)=>a+x.kg*x.reps,0)),
      egzersizler:[...new Set(s.sets.map(x=>x.ex))].map(n=>{const xs=s.sets.filter(x=>x.ex===n);return `${n}: ${xs.map(x=>x.kg+'x'+x.reps).join(', ')}`}),rekorlar:s.prs||[]})),
    uyku:(S.body.find(b=>b.date===d)||{}).sleep??null,kilo:(S.body.find(b=>b.date===d)||{}).weight??null};
}
function baseCtx(){const st=S.settings,pr=S.profile;
  const bw=S.body.filter(b=>b.weight!=null).sort((a,b)=>a.date<b.date?-1:1).slice(-14).map(b=>`${b.date}: ${b.weight} kg`);
  return{saglik_fitbit:healthCtx(),hedef:GOALTXT(),gunluk_hedef:{kalori:st.kcal,protein:st.protein,karb:st.carbs,yag:st.fat},
    profil:{yas:pr.age,boy:pr.height,kilo:pr.weight??latestW(),cinsiyet:pr.sex==='f'?'kadın':'erkek'},kilo_kayitlari:bw,
    takviyeler:S.supps.map(s=>`${s.name} (${s.dose||''}, ${s.time}${s.freq==='training'?', antrenman günleri':''})`)};
}
function tomorrowCtx(){const tm=new Date();tm.setDate(tm.getDate()+1);const d=dkey(tm),p=todaysPlan(),mp=S.mealPlan[d]||{};
  return{tarih:d,siradaki_antrenman:p?{ad:p.name,egzersizler:p.exercises.map(e=>{const sg=suggest(e);return `${e.name} ${e.sets}x${e.repMin}-${e.repMax}${sg.kg?` (öneri ${sg.kg} kg x ${sg.reps})`:''}`})}:null,
    planli_ogunler:SLOTS.filter(([k])=>mp[k]&&rec(mp[k].rid)).map(([k,l])=>{const r=rec(mp[k].rid);return `${l}: ${r.n} (${Math.round(r.kcal*mp[k].serv)} kcal)`})}}
const RULES=`Kurallar: Yalnızca verilen veriye dayan, veri yoksa uydurma, "veri yok" de. Türkçe, samimi ve net yaz. Öneriler somut olsun (gram, kcal, set/tekrar, saat). Hedefe göre konuş: kilo almak/kas kazanımı ise kalori fazlası ve protein, definasyon ise açık ve kas koruma. Tıbbi teşhis koyma; ağrı veya sağlık sorunu varsa uzmana yönlendir. Takviye için doz uydurma, kullanıcının yazdığı dozu kullan. Sadece istenen JSON'u döndür, başka metin ekleme.`;

/* ---------- hızlı besin eşleme (AI çıktısı → veritabanı) ---------- */
function matchIng(name){const db=ING();if(db[name])return name;const lc=String(name||'').toLocaleLowerCase('tr-TR').trim();
  return Object.keys(db).find(k=>k.toLocaleLowerCase('tr-TR')===lc)||Object.keys(db).find(k=>lc&&(k.toLocaleLowerCase('tr-TR').includes(lc)||lc.includes(k.toLocaleLowerCase('tr-TR'))))||null}
function normLines(arr){const db=ING(),out=[],bad=[];
  (arr||[]).forEach(x=>{const n=matchIng(x.name);if(!n){bad.push(x.name);return}const d=db[n];
    let u=x.unit;if(u!==d.u&&u!==d.pu)u=(d.pu&&/adet|dilim|ölçek|kaşık|yaprak|demet|kutu/.test(String(u)))?d.pu:d.u;
    let q=+x.qty;if(!(q>0))q=u===d.pu?1:100;
    let st=x.state;if(d.st){const f=d.st.find(s=>s.n.toLocaleLowerCase('tr-TR')===String(st||'').toLocaleLowerCase('tr-TR'));st=f?f.n:d.st[0].n}else st=undefined;
    out.push([n,Math.round(q*10)/10,u,st])});
  return{lines:out,bad}}
function ingCatalog(){return Object.entries(ING()).map(([n,d])=>`${n} [${d.u}${d.pu?'/'+d.pu+'='+d.pw+'g':''}]${d.st?' durumlar: '+d.st.map(s=>s.n).join(' | '):''}`).join('\n')}

const ui={stP:'week',stOff:0,yLast:'food',hDay:null,planOpen:{},histAll:false,arcOpen:false,mpSel:null,view:S.active?'workout':'home',planId:null,foodDay:dkey(),progEx:null,mpWeek:0,mpBusy:false,mpClosed:{}};
const $app=document.getElementById('app');

/* ---------- icons ---------- */
const I={
 home:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
 dumb:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 7v10M18 7v10M3 9.5v5M21 9.5v5M6 12h12"/></svg>',
 fork:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8"/></svg>',
 pulse:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2.5-6 4 12 2.5-6H21"/></svg>',
 cal:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17h2"/></svg>',
 chart:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16M6 15l4-5 4 3 5-7"/></svg>',
 gear:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
 back:'<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
 check:'<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
 plus:'<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
};

/* ---------- data helpers ---------- */
const plan=id=>S.plans.find(p=>p.id===id);
/* yalnızca antrenman programının günleri (şablonlar kaldırıldı) */
const activePlans=()=>((S.tp&&S.tp.ids)||[]).map(id=>S.plans.find(p=>p.id===id)).filter(p=>p&&!p.archived);
const todaysPlan=()=>{const a=activePlans();return a.length?a[S.next%a.length]:null};
const STALE=60*864e5;
function lastPerf(name){
  for(let i=S.sessions.length-1;i>=0;i--){const ss=S.sessions[i].sets.filter(s=>s.ex===name);if(ss.length)return Date.now()-new Date(S.sessions[i].date).getTime()>STALE?null:{date:S.sessions[i].date,sets:ss}}
  return null;
}
/* Kural tabanlı koç v0: çift ilerleme (double progression) + RPE kontrolü */
function suggest(e){
  const lp=lastPerf(e.name);
  if(e.t){const k=num(e.fix)||0;
    if(!lp)return{kg:k,reps:e.repMin,why:`⏱ Süreli hareket: hedef <b>${e.repMin}–${e.repMax} sn</b>. Aşağıdaki butona bas, sayaç geri saysın; formun bozulursa Durdur'a bas.`};
    const minS=Math.min(...lp.sets.map(s=>s.reps));
    if(minS>=e.repMax)return{kg:k,reps:e.repMax,why:`Geçen sefer tüm setlerde <b>${e.repMax} sn</b> tuttun → zorlaştır: zor versiyona geç (↔ alternatif) ya da ağırlık ekle.`};
    return{kg:k,reps:Math.min(Math.max(minS+5,e.repMin),e.repMax),why:`Geçen sefer en az ${minS} sn → bugün <b>+5 sn</b> hedefle (üst sınır ${e.repMax} sn).`}}
  if(e.fix!=null){const k=e.fix,unit=k?`${fmt(k)} kg sabit`:'Bant / vücut ağırlığı (kg alanı 0)';
    if(!lp)return{kg:k,reps:e.repMin,why:`${unit}: ${e.repMin}–${e.repMax} tekrar, son 2 tekrar zor gelsin (RPE 7–8).`};
    const minR=Math.min(...lp.sets.map(s=>s.reps));
    if(minR>=e.repMax)return{kg:k,reps:e.repMax,why:`Tüm setlerde <b>${e.repMax}+ tekrar</b> yaptın → zorlaştır: <b>3 sn yavaş indir</b>, ${k?'tek kol/tek bacak versiyonuna geç ya da bant ekle':'bir sert banda geç ya da bandı kısalt'}.`};
    return{kg:k,reps:Math.min(minR+1,e.repMax),why:`${unit} → ilerleme tekrardan gelir: <b>1 tekrar daha</b> hedefle (üst sınır ${e.repMax}).`}}
  const K=Array.isArray(e.kgs)&&e.kgs.length?e.kgs.map(Number).sort((a,b)=>a-b):null;
  if(!lp&&K&&e.startKg!=null)return{kg:e.startKg,reps:e.repMin,why:`Elindeki ağırlıklara göre <b>${fmt(e.startKg)} kg</b> ile başla: ${e.repMin}–${e.repMax} tekrar, son 2 tekrar zor gelsin (RPE ~7). Çok hafif/ağır gelirse bir üst/alt ağırlığına geç.`};
  if(!lp){const se=startEst(e);if(se)return{kg:se,reps:e.repMin,why:`İlk kez: kilona, seviyene ve cinsiyetine göre tahmini başlangıç <b>${fmt(se)} kg</b>${/Dumbbell|Lunge|Goblet/.test(e.name)?' (tek dumbbell)':''}. ${e.repMin}–${e.repMax} tekrar, son 2 tekrar zor gelsin; hafif gelirse bir sonraki sette artır.`}}
  if(!lp)return{kg:null,reps:e.repMin,why:`Son 60 günde kayıt yok: rahat bir kiloyla ${e.repMin}–${e.repMax} tekrar yap, zorluk (RPE) ~7 olsun. Koç bir sonraki seferde kiloyu ayarlayacak.`};
  const top=Math.max(...lp.sets.map(s=>s.kg));
  const work=lp.sets.filter(s=>s.kg===top);
  const minR=Math.min(...work.map(s=>s.reps));
  const rpes=work.map(s=>s.rpe).filter(x=>x!=null);const maxR=rpes.length?Math.max(...rpes):null;
  if(K&&minR>=e.repMax&&(maxR==null||maxR<=9)){const nx=K.find(k=>k>top);
    return nx!=null?{kg:nx,reps:e.repMin,why:`Tüm setlerde <b>${e.repMax}+ tekrar</b> yaptın → elindeki bir sonraki ağırlık: <b>${fmt(nx)} kg</b>, ${e.repMin} tekrardan yeniden başla.`}
      :{kg:top,reps:e.repMax,why:`Elindeki en ağır ağırlıktasın (${fmt(top)} kg) → ilerleme tempodan: <b>3 sn yavaş indir</b>, 1 sn duraksa ya da tek kol/tek bacak versiyonuna geç.`}}
  if(K&&minR<e.repMin){const pv=[...K].reverse().find(k=>k<top);return{kg:pv!=null?pv:top,reps:e.repMin,why:pv!=null?`Geçen sefer ${e.repMin} tekrarın altına düştün → bir alt ağırlığın: <b>${fmt(pv)} kg</b>, formu temiz tut.`:`Geçen sefer ${e.repMin} tekrarın altına düştün → aynı ağırlıkta tekrar sayısını düşür, formu temiz tut.`}}
  if(minR>=e.repMax&&(maxR==null||maxR<=9))return{kg:rnd(top+e.inc),reps:e.repMin,why:`Geçen sefer tüm setlerde <b>${e.repMax}+ tekrar</b> yaptın → <b>+${e.inc} kg</b>, ${e.repMin} tekrardan yeniden başla.`};
  if(minR<e.repMin)return{kg:rnd(top*0.95),reps:e.repMin,why:`Geçen sefer ${e.repMin} tekrarın altına düştün → kiloyu <b>~%5 azalt</b> ve formu temiz tut.`};
  if(maxR!=null&&maxR>=9.5)return{kg:top,reps:minR,why:`Geçen sefer çok zorlandın (RPE ${maxR}) → <b>aynı kilo, aynı tekrar</b>; önce bunu rahatlat.`};
  return{kg:top,reps:Math.min(minR+1,e.repMax),why:`Aynı kilo, <b>1 tekrar daha</b> hedefle. Tüm setlerde ${e.repMax} tekrara ulaşınca kilo artacak.`};
}
function lastLabel(name){
  const lp=lastPerf(name);if(!lp)return null;
  const b=lp.sets.reduce((a,s)=>e1rm(s.kg,s.reps)>e1rm(a.kg,a.reps)?s:a);
  return b.t?`${b.kg?fmt(b.kg)+' kg · ':''}${b.reps} sn`:b.kg?`${fmt(b.kg)} kg × ${b.reps}`:`${b.reps} tekrar`;
}
const fmt=n=>(Math.round(n*100)/100).toString().replace('.',',');
function weekSets(){
  const from=Date.now()-7*864e5,m={};
  S.sessions.filter(s=>new Date(s.date).getTime()>=from).forEach(s=>s.sets.forEach(x=>{m[x.muscle]=(m[x.muscle]||0)+1}));
  return m;
}
function dayMeals(d){return S.meals.filter(m=>m.date===d)}
function dayTotals(d){const t=dayMeals(d).reduce((a,m)=>({kcal:a.kcal+m.kcal,p:a.p+m.p,c:a.c+m.c,f:a.f+m.f}),{kcal:0,p:0,c:0,f:0});
  S.drinks.filter(x=>x.date===d).forEach(x=>{const T=DRINK[x.type];if(!T)return;const m=x.ml/100;t.kcal+=T.k*m;t.p+=T.p*m;t.c+=T.c*m;t.f+=T.f*m});return t}
/* içecekler: 100 ml başına kcal/makro, kafein mg (EFSA: çay 220 ml≈50 mg, filtre 200 ml≈90 mg, espresso 60 ml≈80 mg) */
const DRINK={
 su:{n:'Su',e:'💧',ml:250,k:0,p:0,c:0,f:0,caf:0},
 maden:{n:'Maden suyu',e:'🫧',ml:200,k:0,p:0,c:0,f:0,caf:0},
 cay:{n:'Çay',e:'🍵',ml:100,k:1,p:0,c:0.2,f:0,caf:22.7},
 turk:{n:'Türk kahvesi',e:'☕',ml:65,k:5,p:0.2,c:0.6,f:0.2,caf:92},
 filtre:{n:'Filtre kahve',e:'☕',ml:200,k:1,p:0.1,c:0,f:0,caf:45},
 espresso:{n:'Espresso',e:'☕',ml:30,k:2,p:0.1,c:0,f:0,caf:133},
 ayran:{n:'Ayran',e:'🥛',ml:300,k:37,p:1.9,c:2.8,f:2,caf:0},
 sut:{n:'Süt',e:'🥛',ml:200,k:50,p:3.4,c:4.8,f:1.6,caf:0},
 meyve:{n:'Meyve suyu',e:'🧃',ml:200,k:45,p:0.5,c:11,f:0.1,caf:0},
 kola:{n:'Kola',e:'🥤',ml:330,k:42,p:0,c:10.6,f:0,caf:10},
 enerji:{n:'Enerji içeceği',e:'⚡',ml:250,k:45,p:0,c:11,f:0,caf:32}
};
const dayDrinks=d=>S.drinks.filter(x=>x.date===d);
const fluid=d=>dayDrinks(d).reduce((a,x)=>a+x.ml,0);
const caffeine=d=>Math.round(dayDrinks(d).reduce((a,x)=>a+(DRINK[x.type]?.caf||0)*x.ml/100,0)+S.supps.filter(s=>s.key==='caffeine'&&(S.suppLog[d]||{})[s.id]).reduce((a,s)=>a+(num(s.dose)||200),0));
const trainedOn=d=>S.sessions.filter(s=>dkey(new Date(s.date))===d);
function waterGoal(d){
  const w=S.profile.weight??latestW();const base=(w||75)*35;
  const ss=trainedOn(d);let min=ss.reduce((a,s)=>a+Math.round((s.dur||0)/60),0);
  if(!min&&(ss.length||(d===dkey()&&S.active)))min=60;
  const extra=Math.round(min*12);
  return{goal:Math.round((base+extra)/50)*50,base:Math.round(base),extra,min,hasW:!!w};
}
/* takviye kütüphanesi: kısa, kanıta dayalı özet */
const SUPP={
 creatine:{n:'Kreatin monohidrat',e:'💪',ev:'Güçlü',what:'Güç, patlayıcı performans ve kas kazanımını destekler; en çok araştırılmış takviye. Zamanlamadan çok her gün düzenli almak önemli.',dose:'3–5 g / gün',time:'Her zaman'},
 whey:{n:'Whey protein',e:'🥤',ev:'Güçlü',what:'Yemekten farkı olmayan pratik süt proteini. Günlük protein hedefini tutturmak için kullanılır, hedef yemekle doluyorsa şart değil.',dose:'1 ölçek ≈ 24 g protein',time:'Antrenman sonrası'},
 caffeine:{n:'Kafein / pre-workout',e:'⚡',ev:'Güçlü',what:'Antrenmanda performans ve odağı artırır. Uykuyu bozabileceği için akşam antrenmanında dikkat. Günlük toplam kafeini 400 mg altında tut (EFSA).',dose:'Etiketteki doz (mg)',time:'Antrenman öncesi'},
 vitd:{n:'D vitamini',e:'☀️',ev:'Eksiklik varsa',what:'Kemik ve bağışıklık sağlığı. Güneşin az olduğu aylarda eksiklik yaygın. Dozu kan tahliline göre doktorunla belirle.',dose:'Etiketteki doz',time:'Sabah (yemekle)'},
 omega3:{n:'Omega-3 (balık yağı)',e:'🐟',ev:'Orta',what:'Haftada 2 porsiyondan az yağlı balık yiyorsan EPA/DHA desteği; kalp-damar sağlığı.',dose:'Etiketteki doz',time:'Yemekle'},
 mg:{n:'Magnezyum',e:'🌙',ev:'Eksiklik varsa',what:'Kas ve sinir fonksiyonu; eksiklikte kramp ve uyku sorunlarına yardımcı olabilir.',dose:'Etiketteki doz',time:'Akşam'},
 multi:{n:'Multivitamin',e:'💊',ev:'Zayıf',what:'Beslenme dengesizse bir "güvence". Dengeli beslenen birinde performansa ek katkısı gösterilmemiş.',dose:'Etiketteki doz',time:'Sabah (yemekle)'},
 beta:{n:'Beta-alanin',e:'🔥',ev:'Orta',what:'1–4 dakika süren yüksek yoğunluklu eforlarda yorgunluğu geciktirir. Ciltte karıncalanma zararsız bir yan etkidir.',dose:'Etiketteki doz',time:'Her zaman'},
 citrulline:{n:'Sitrülin malat',e:'🍉',ev:'Karışık',what:'Kan akışı ve "pump" için kullanılır; performans etkisi çalışmalarda tutarsız.',dose:'Etiketteki doz',time:'Antrenman öncesi'},
 electro:{n:'Elektrolit',e:'🧂',ev:'Koşula bağlı',what:'Uzun, çok terleten ya da sıcakta yapılan antrenmanlarda sodyum ve potasyum kaybını yerine koyar.',dose:'Etiketteki doz',time:'Antrenman sırası'},
 b12:{n:'B12 vitamini',e:'🌱',ev:'Eksiklik varsa',what:'Vegan veya az hayvansal ürün tüketenlerde önemli; enerji ve sinir sistemi.',dose:'Etiketteki doz',time:'Sabah'},
 zma:{n:'ZMA (çinko+magnezyum+B6)',e:'🌙',ev:'Zayıf',what:'Eksiklik yoksa testosteron veya performansa etkisi gösterilmemiş; uyku için magnezyum kısmı yardımcı olabilir.',dose:'Etiketteki doz',time:'Akşam'},
 bcaa:{n:'BCAA',e:'🧪',ev:'Zayıf',what:'Günlük protein yeterliyse ek faydası yok denecek kadar az; parayı whey veya gerçek yemeğe harcamak daha verimli.',dose:'Etiketteki doz',time:'Antrenman sırası'},
 glutamine:{n:'Glutamin',e:'🧪',ev:'Zayıf',what:'Sağlıklı sporcularda kas gelişimi veya toparlanmaya etkisi gösterilmemiş.',dose:'Etiketteki doz',time:'Her zaman'},
 ashwa:{n:'Ashwagandha',e:'🌿',ev:'Sınırlı',what:'Stres ve uyku için bazı çalışmalar var. Tiroid ve bazı ilaçlarla etkileşebilir, doktoruna danış.',dose:'Etiketteki doz',time:'Akşam'},
 collagen:{n:'Kolajen',e:'🦴',ev:'Sınırlı',what:'Eklem ve tendon için kullanılır; kas gelişimi için whey yerine geçmez.',dose:'Etiketteki doz',time:'Antrenman öncesi'}
};
const EVC={'Güçlü':'var(--ok)','Orta':'var(--a3)','Eksiklik varsa':'var(--warn)','Koşula bağlı':'var(--warn)','Karışık':'var(--warn)','Sınırlı':'var(--mut)','Zayıf':'var(--mut)'};
const TIMES=['Sabah','Öğle','Antrenman öncesi','Antrenman sonrası','Akşam','Yatmadan önce'];
const suppInfo=s=>SUPP[s.key]||{n:s.name,e:'💊',what:s.note||'',ev:''};
const suppsFor=d=>S.supps.filter(s=>s.freq!=='training'||trainedOn(d).length||(d===dkey()&&S.active));
function coachNotes(){
  const n=[],t=dayTotals(dkey()),st=S.settings,h=new Date().getHours();
  const last=S.sessions[S.sessions.length-1];
  if(!last)n.push('Henüz kayıtlı antrenman yok. İlk antrenmanında kiloları rahat seç; koç önerileri senin verinle şekillenecek.');
  else{const days=Math.floor((Date.now()-new Date(last.date).getTime())/864e5);
    if(days>60)n.push('Yeni dönem başlıyor: ilk 2 hafta kiloları rahat seç (RPE ~7, 2–3 tekrar daha yapabilecek gibi). Koç önerileri yeni kayıtlarınla şekillenecek.');
    else if(days>=4)n.push(`Son antrenmanından bu yana <b>${days} gün</b> geçti. Bugün hafif başlayıp ritmi geri kazanmak iyi olur.`)}
  const sc=healthToday();if(sc&&!sc.demo){if(sc.tot<60)n.unshift(`Hazırlık skorun <b>${sc.tot}</b>. Bugün hacmi azalt: her egzersizde 1 set eksik yap, RPE 8'i geçme.`);else if(sc.tot>=80)n.unshift(`Hazırlık skorun <b>${sc.tot}</b>: ağır bir antrenman için iyi gün.`)}
  const ws=weekSets();Object.entries(ws).forEach(([k,v])=>{if(v>=22)n.push(`${MUSCLES[k]} için bu hafta <b>${v} set</b> yaptın, bu yüksek bir hacim. Performansın düşüyorsa bir deload haftası düşün.`)});
  if(h>=17&&t.p<st.protein*0.6)n.push(`Bugün protein <b>${Math.round(t.p)} / ${st.protein} g</b>. Akşam öğününde protein ağırlıklı bir şey eklemek hedefi tutturmana yardım eder.`);
  const b=S.body.filter(x=>x.sleep!=null).slice(-3);if(b.length>=2&&b.every(x=>x.sleep<6))n.push('Son günlerde uykun 6 saatin altında. Bugün kiloları zorlamak yerine tekrar kalitesine odaklan.');
  const pr=S.profile,bw=S.body.filter(x=>x.weight!=null);
  if(pr.applied&&pr.goal!=='maintain'&&bw.length>=4){
    const now=Date.now(),avg=a=>a.reduce((s,x)=>s+x.weight,0)/a.length,age=x=>(now-new Date(x.date+'T12:00').getTime())/864e5;
    const w1=bw.filter(x=>age(x)<7),w0=bw.filter(x=>age(x)>=7&&age(x)<14);
    if(w1.length>=2&&w0.length>=2){const dlt=avg(w1)-avg(w0),ds=(dlt>0?'+':'')+fmt(Math.round(dlt*10)/10);
      if(pr.goal==='cut'&&dlt>-0.1)n.unshift(`Haftalık ortalama kilon ${ds} kg değişti, definasyon hedefi için yavaş. Günlük kaloriyi <b>~150 kcal</b> azaltmayı düşün.`);
      else if(pr.goal==='cut'&&dlt<-rateKg(pr)*1.6)n.unshift(`Kilon hedeften hızlı düşüyor (${ds} kg/hafta). Kas kaybını azaltmak için kaloriyi <b>~150 kcal</b> artırmayı düşün.`);
      else if(pr.goal==='bulk'&&dlt<0.05)n.unshift(`Haftalık ortalama kilon ${ds} kg değişti, kas kazanımı için yetersiz. Günlük <b>~150 kcal</b> ekle.`);
      else if(pr.goal==='bulk'&&dlt>rateKg(pr)*1.8)n.unshift(`Kilon hedeften hızlı artıyor (${ds} kg/hafta). Fazla yağlanmamak için kaloriyi biraz azalt.`)}}
  if(cycOn()){const c=cyc(),lg=(S.cycle.log||{})[dkey()]||{},sy=lg.sym||[];
    if(c&&c.ph==='men'&&(sy.includes('cramp')||sy.includes('tired')))n.unshift('Regl dönemindesin ve kramp/yorgunluk işaretledin. Bugün hacmi biraz azalt; hafif kardiyo ve esneme krampları hafifletebilir.');
    else if(c&&c.ph==='lut'&&c.day>=c.len-4)n.push('Döngünün son günlerindesin (PMS dönemi). Yorgun hissedersen kiloyu değil set sayısını azalt; iştah artışı bu dönemde normal.');
    else if(c&&c.ph==='fol')n.push('Foliküler fazdasın: birçok kadın bu dönemde daha güçlü hisseder. Kilo artırmak için iyi bir zaman.')}
  {const cs=cardioStat();if(cs.st==='over')n.unshift(`Kardiyo yükün 4 haftalık ortalamanın <b>${fmt(r1(cs.ratio))} katı</b>. Sakatlık riskini azaltmak için 1–2 gün hafif tempo yap.`);else if(cs.st==='det')n.push('Bu hafta kardiyon azaldı. Kondisyonunu korumak için haftaya 2 kısa seans (20–30 dk) ekle.')}
  if(!n.length)n.push('Her şey yolunda görünüyor. Bugünkü hedef: önerilen kilo ve tekrarları temiz formla tamamla.');
  return n.slice(0,2);
}

