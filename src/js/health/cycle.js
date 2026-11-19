/* ================= Regl döngüsü ================= */
const PH={men:['Menstrüasyon','#ff5f7a','🩸','Enerjin düşükse hacmi ve kiloyu biraz azalt; hafif kardiyo ve mobilite krampları hafifletebilir. Kendini iyi hissediyorsan normal antrenman yapmanın sakıncası yok. Demirden zengin besinler (kırmızı et, mercimek, ıspanak) ve bol su ekle.'],
 fol:['Foliküler','#3fd0ff','🌱','Östrojen yükseliyor; birçok kadın bu dönemde kendini daha enerjik hisseder. Ağır ve yoğun antrenmanlar, kilo artırma ve rekor denemeleri için iyi bir dönem.'],
 ovu:['Ovulasyon','#ffd23f','✨','Güç zirveye yakın olabilir. Bu dönemde bağ dokusunun biraz gevşediğini öne süren çalışmalar var; zıplama ve ani yön değişimlerinden önce iyi ısın.'],
 lut:['Luteal','#a98bff','🌙','Vücut ısısı ve dinlenik nabız biraz yükselir, yorgunluk artabilir. Kalori ihtiyacı günde ~100–300 kcal artabilir; şişkinlik normaldir. Son günlerde (PMS) hacmi biraz azaltmak iyi gelebilir.'],
 late:['Gecikme','#ffb547','⏳','Regl beklenen tarihten gecikti. Stres, yoğun antrenman, kilo değişimi ve uyku düzensizliği döngüyü kaydırabilir. Uzun süren gecikmelerde doktoruna danış.']};
const FLOW=[['0','Yok'],['s','Lekelenme'],['1','Hafif'],['2','Orta'],['3','Yoğun']];
const SYM=[['cramp','Kramp'],['bloat','Şişkinlik'],['head','Baş ağrısı'],['tired','Yorgunluk'],['acne','Sivilce'],['breast','Göğüs hassasiyeti'],['mood','Ruh hali değişimi'],['crave','İştah artışı'],['insom','Uykusuzluk'],['back','Bel ağrısı']];
const cycOn=()=>S.profile.sex==='f';
function cyc(d=dkey()){const C=S.cycle||{},st=[...(C.starts||[])].filter(x=>x<=d).sort();if(!st.length)return null;const all=[...(C.starts||[])].sort();
  const gaps=[];for(let i=1;i<all.length;i++){const g=dDiff(all[i-1],all[i]);if(g>=18&&g<=45)gaps.push(g)}
  const CF=C.cfg||{},man=CF.auto===false;let len=gaps.length?Math.round(gaps.slice(-6).reduce((a,b)=>a+b,0)/Math.min(6,gaps.length)):28;if(man&&CF.len)len=CF.len;
  const pl=all.map(s=>C.ends&&C.ends[s]?dDiff(s,C.ends[s])+1:null).filter(v=>v&&v>=2&&v<=10),plen=man&&CF.plen?CF.plen:pl.length?Math.round(pl.slice(-6).reduce((a,b)=>a+b,0)/Math.min(6,pl.length)):5;
  const last=st[st.length-1],day=dDiff(last,d)+1,ov=Math.min(len-2,man&&CF.ov?CF.ov:len-14),pms=man&&CF.pms?CF.pms:5,ended=C.ends&&C.ends[last];
  const inPer=ended?d<=ended:day<=plen;
  const ph=inPer?'men':day>len+2?'late':day<ov-1?'fol':day<=ov+1?'ovu':'lut';
  const next=addD(last,len);
  return{len,plen,ov,pms,man,day,ph,last,next,toNext:dDiff(d,next),ovD:addD(last,ov-1),fert:[addD(last,ov-6),addD(last,ov)],gaps,inPer,ended}}
function cycKind(k){const C=S.cycle||{},lg=(C.log||{})[k],td=dkey();if(lg&&lg.flow&&lg.flow!=='0')return 'per';
  const t=cyc(td),st=(C.starts||[]).filter(x=>x<=k).sort().pop();
  if(st&&k<=td){const e=C.ends&&C.ends[st];if(e?k<=e:dDiff(st,k)<(t?t.plen:5))return 'per'}
  if(!t)return '';
  for(let i=0;i<4;i++){const s=addD(t.last,i*t.len);if(k>td&&k>=s&&dDiff(s,k)<t.plen)return 'pper';
    const fs=addD(s,t.ov-6),fe=addD(s,t.ov);if(k>=fs&&k<=fe)return k===addD(s,t.ov-1)?'ovu':'fert';if(k>td&&k>=addD(s,t.len-t.pms)&&k<addD(s,t.len))return 'pms'}
  return ''}
function cycRing(c){const R=78,C=2*Math.PI*R,n=c.len,seg=C/n,ov=c.ov;
  const col=i=>i<c.plen?PH.men[1]:i<ov-2?PH.fol[1]:i<=ov?PH.ovu[1]:PH.lut[1];const cur=Math.min(n,c.day)-1;
  return `<svg aria-hidden="true" viewBox="0 0 200 200" class="cyr">${Array.from({length:n},(_,i)=>`<circle cx="100" cy="100" r="${R}" fill="none" stroke="${col(i)}" stroke-opacity="${i===cur?1:.42}" stroke-width="${i===cur?16:11}" stroke-dasharray="${seg-2.2} ${C}" stroke-dashoffset="${-i*seg}" transform="rotate(-90 100 100)"/>`).join('')}
   ${(()=>{const a=(cur+.5)/n*2*Math.PI-Math.PI/2;return `<circle cx="${100+R*Math.cos(a)}" cy="${100+R*Math.sin(a)}" r="9" fill="#fff"/>`})()}</svg>`}
function cycTile(){if(!cycOn())return '';const c=cyc();
  if(!c)return `<button class="cyt" onclick="A.go('cycle')"><span class="cyd" style="background:#ff5f7a">🌸</span><span><b>Döngü takibi</b><small>Regl başlangıcını kaydet, fazını ve sonraki tarihi gör</small></span><i>›</i></button>`;
  const p=PH[c.ph];return `<button class="cyt" onclick="A.go('cycle')"><span class="cyd" style="background:${p[1]}">${c.day}</span><span><b>Döngü günü ${c.day} · ${p[0]}</b><small>${c.inPer?'Regl dönemindesin':c.toNext>0?`Sonraki regl ~${c.toNext} gün sonra`:c.toNext===0?'Regl bugün bekleniyor':`Regl ${-c.toNext} gün gecikti`}</small></span><i>›</i></button>`}
function cycleV(){const c=cyc(),C=S.cycle,td=dkey(),lg=(C.log||{})[td]||{},sy=lg.sym||[];
  const months=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],dl=k=>{const x=new Date(k+'T12:00');return x.getDate()+' '+months[x.getMonth()]};
  const g0=(()=>{const x=new Date();x.setDate(x.getDate()-((x.getDay()+6)%7)-7);return dkey(x)})();
  const cal=Array.from({length:42},(_,i)=>{const k=addD(g0,i),kd=cycKind(k),dn=new Date(k+'T12:00').getDate();return `<span class="cc ${kd} ${k===td?'td':''} ${k>td?'fu':''}">${dn}</span>`}).join('');
  return `<div class="hero" style="padding-bottom:14px"><div class="top"><button class="back" onclick="A.go('home')">${I.back}</button><div class="brand">Döngü takibi</div><div style="width:34px"></div></div>
   ${c?`<div class="cy-w">${cycRing(c)}<div class="cy-c"><small>DÖNGÜ GÜNÜ</small><b>${c.day}</b><em style="color:${PH[c.ph][1]}">${PH[c.ph][2]} ${PH[c.ph][0]}</em></div></div>
    <div class="cy-s"><div><b>${c.inPer?'Şimdi':c.toNext>0?c.toNext+' gün':c.toNext===0?'Bugün':'+'+(-c.toNext)+' gün'}</b><small>${c.inPer?'regl dönemi':'sonraki regl · '+dl(c.next)}</small></div><div><b>${dl(c.fert[0])}–${dl(c.fert[1])}</b><small>doğurgan pencere</small></div><div><b>${c.len} gün</b><small>ort. döngü</small></div></div>`
   :`<div class="cy-empty">🌸<b>Döngünü takip etmeye başla</b><p>Son reglinin ilk gününü kaydet. Uygulama döngü gününü, fazını ve sonraki reglin tahmini tarihini gösterir; her kayıtla tahmin iyileşir.</p></div>`}
   <div class="grid2" style="margin-top:12px">${c&&c.inPer&&!c.ended?`<button class="btn" onclick="A.cycEnd('${td}')">Regl bitti (bugün)</button>`:`<button class="btn" onclick="A.cycStart('${td}')">🩸 Regl başladı (bugün)</button>`}<button class="btn ghost" onclick="A.cycPick()">${c&&c.inPer?'Bitiş tarihi seç':'Başka tarih'}</button></div><button class="btn ghost" style="margin-top:8px;width:100%" onclick="A.cycSet()">Döngü ayarları</button></div>
  <div class="card"><b>Bugün</b><div class="gen-l" style="margin-top:10px">Akış</div><div class="cychips">${FLOW.map(([k,n])=>`<button class="${(lg.flow||'')===k?'on':''}" onclick="A.cycFlow('${k}')">${n}</button>`).join('')}</div>
   <div class="gen-l">Belirtiler</div><div class="cychips">${SYM.map(([k,n])=>`<button class="${sy.includes(k)?'on':''}" onclick="A.cycSym('${k}')">${n}</button>`).join('')}</div></div>
  ${c?`<div class="card cyp" style="--c:${PH[c.ph][1]}"><div class="row between"><b>${PH[c.ph][2]} ${PH[c.ph][0]} fazı</b><span class="lbl">antrenman & beslenme</span></div><p>${PH[c.ph][3]}</p>
   <div class="lbl" style="line-height:1.5">Araştırmalar kişiden kişiye büyük fark olduğunu gösteriyor; kendi belirtilerine göre ayarla.</div></div>`:''}
  <div class="card"><div class="row between"><b>Takvim</b><span class="lbl">6 hafta</span></div><div class="cal-h">${['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map(x=>`<span>${x}</span>`).join('')}</div><div class="cal">${cal}</div>
   <div class="cal-k"><span><i style="background:#ff5f7a"></i>Regl</span><span><i style="border:1.5px dashed #ff5f7a"></i>Tahmini regl</span><span><i style="background:rgba(255,210,63,.35)"></i>Doğurgan</span><span><i style="background:#ffd23f"></i>Ovulasyon</span></div></div>
  ${c&&c.gaps.length?`<div class="card"><b>Geçmiş döngüler</b><div class="cyh">${c.gaps.slice(-6).map(g=>`<div><i style="height:${Math.min(100,g/40*100)}%"></i><small>${g}</small></div>`).join('')}</div><div class="lbl">Ortalama ${c.len} gün · regl ${c.plen} gün</div></div>`:''}
  ${(C.starts||[]).length?`<div class="card" style="padding:6px 14px">${[...C.starts].sort().reverse().slice(0,6).map(s=>`<div class="crow"><span class="cic">🩸</span><div style="flex:1"><b>${dl(s)}</b><small>${C.ends&&C.ends[s]?'bitiş '+dl(C.ends[s])+' · '+(dDiff(s,C.ends[s])+1)+' gün':'bitiş girilmedi'}</small></div><button class="x" onclick="A.cycDel('${s}')" aria-label="Sil">✕</button></div>`).join('')}</div>`:''}
  <div class="pad lbl" style="line-height:1.5;margin-bottom:20px">Tahminler geçmiş kayıtlarına dayanır ve doğum kontrolü için kullanılamaz. Tıbbi tavsiye değildir.</div>`}

/* ---------- fotoğraftan kalori yardımcıları ---------- */
function snapCal(){const a=(S.aiCal||[]).filter(x=>x>0.2&&x<5);if(a.length<5)return null;const b=[...a].sort((x,y)=>x-y),m=b[Math.floor(b.length/2)];return Math.abs(m-1)<0.05?null:Math.max(.7,Math.min(1.4,m))}
function snapItem(x){if(!x||!x.name)return null;const n0=+x.grams;if(!(n0>0))return null;const cal=snapCal()||1;
  const lc=String(x.name).toLocaleLowerCase('tr-TR').trim(),db=ING(),key=Object.keys(db).find(k=>k.toLocaleLowerCase('tr-TR')===lc);
  let k=+x.kcal100||0,p=+x.p100||0,c=+x.c100||0,f=+x.f100||0,isdb=0;
  if(key&&!db[key].st&&(db[key].u==='g'||db[key].u==='ml')){const v=db[key];k=v.k;p=v.p;c=v.c;f=v.f;isdb=1}
  const at=4*p+4*c+9*f;if(at>0&&(k<=0||Math.abs(k-at)/at>.2))k=at;if(!(k>=0&&k<950))return null;
  const g=n0*cal,lo=(+x.lo>0?+x.lo:n0*.75)*cal,hi=(+x.hi>0?+x.hi:n0*1.3)*cal;
  return{name:key||String(x.name),g,ai:n0,lo:Math.min(lo,g),hi:Math.max(hi,g),k,p,c,f,conf:Math.max(0,Math.min(1,+x.conf||.5)),hidden:!!x.hidden,db:isdb}}
function snapTot(L){const t={k:0,p:0,c:0,f:0,lo:0,hi:0,conf:0};let w=0;L.forEach(x=>{const m=x.g/100;t.k+=x.k*m;t.p+=x.p*m;t.c+=x.c*m;t.f+=x.f*m;
  const r=x.ed?1:0;t.lo+=x.k*(r?x.g:x.lo)/100;t.hi+=x.k*(r?x.g:x.hi)/100;const kc=x.k*m;t.conf+=(x.ed?1:x.conf)*kc;w+=kc});t.conf=w?t.conf/w:0;return t}
const snapMac=T=>`<div><b>${Math.round(T.p)} g</b><small>Protein</small></div><div><b>${Math.round(T.c)} g</b><small>Karb.</small></div><div><b>${Math.round(T.f)} g</b><small>Yağ</small></div>`;
