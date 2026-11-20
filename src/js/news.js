/* ===== Yenilikler (yeni özellik duyurusu) ===== */
const NEWS=[
 {id:14,d:'2026-11-20',t:['Toparlanma, kilo trendi, meydan okumalar','Recovery, weight trend, challenges'],b:['Kas haritasında toparlanma modu, hedef tarihli kilo trendi, squat/şınav/mekik gibi haftalık meydan okuma şablonları.','Recovery mode on the muscle map, weight trend with goal date, weekly challenge templates.']},
 {id:13,d:'2026-11-20',t:['3D kas haritası','3D muscle map'],b:['Antrenman sayfasında döndürülebilir vücut; kasa dokun, o kasın hareketlerini gör.','Rotatable body on the Workout page; tap a muscle to see its exercises.'],go:"A.go('programs')"},
 {id:12,d:'2026-11-20',t:['Odak modu ve sade görünüm','Focus mode and a cleaner look'],b:['Antrenmanda tek ekranlık odak modu; sade ikonlar ve tutarlı grafikler.','One-screen focus mode in workouts; clean icons and consistent charts.']},
 {id:10,d:'2026-11-20',t:['Daha hızlı uygulama','Faster app'],b:['Daha hızlı açılış ve her gün otomatik yedek.','Faster start-up and automatic daily backups.']},
 {id:9,d:'2026-11-19',t:['Kişiye özel antrenman programı','Personal training program'],b:['Hedefine ve seviyene göre 12 haftalık program.','A 12-week program for your goal and level.'],go:"A.go('tprog')"},
 {id:6,d:'2026-11-19',t:['Haftalık beslenme programı','Weekly meal plan'],b:['Tarifli öğünler, alışveriş listesi, 2 haftada bir otomatik ayar.','Recipes, shopping list and automatic check-ins every 2 weeks.'],go:"A.go('nprog')"},
 {id:5,d:'2026-11-19',t:['Tahliller ve sağlık durumları','Lab results and health conditions'],b:['Tahlillerini ekle; programlar sağlık durumuna göre uyarlanır.','Add lab results; plans adapt to your health.'],go:"A.go('nprog')"},
 {id:1.2,d:'2026-11-14',t:['Arkadaşlar','Friends'],b:['Akış, hikâyeler, beğeni ve meydan okumalar.','Feed, stories, likes and challenges.'],go:"A.go('friends')"},
 {id:1.1,d:'2026-11-14',t:['Apple Sağlık ve canlı nabız','Apple Health and live heart rate'],b:['iPhone\'da sağlık verilerin ve antrenmanda canlı nabız.','Health data on iPhone and live heart rate during workouts.']},
 {id:1.0,d:'2026-11-13',t:['Uyku, toparlanma ve yük skorları','Sleep, recovery and strain scores'],b:['Her sabah uyku ve toparlanma skorun.','Your sleep and recovery scores every morning.']},
 {id:.8,d:'2026-11-11',t:['Fitbit senkronu','Fitbit sync'],b:['Adım, nabız ve uyku verilerin otomatik gelir.','Steps, heart rate and sleep sync automatically.']},
 {id:.7,d:'2026-11-08',t:['HypeMode yayında','HypeMode is live'],b:['Antrenman, beslenme ve sağlık tek uygulamada.','Training, food and health in one app.']}];
function newsSheet(all){const seen=+S.settings.newsSeen||0,L=all?NEWS:NEWS.filter(n=>n.id>seen);if(!L.length)return;let last='';
  sheet(`<h3>${TT('Yenilikler','What\'s new')}</h3>${L.map(n=>{const ds=new Date(n.d+'T12:00').toLocaleDateString(LOC(),{day:'numeric',month:'long'}),h=ds!==last?`<div class="gen-l" style="margin-top:16px">${ds}</div>`:'';last=ds;
    return h+(n.go?`<button class="nws" onclick="closeSheet();${n.go}"><span><b>${TT(...n.t)}</b><em>${TT(...n.b)}</em></span><i>›</i></button>`:`<div class="nws"><span><b>${TT(...n.t)}</b><em>${TT(...n.b)}</em></span></div>`)}).join('')}<button class="btn" style="margin-top:10px" onclick="closeSheet()">${TT('Tamam','OK')}</button>`);
  S.settings.newsSeen=NEWS[0].id;save()}
function newsCheck(){try{if(!S.onboarded||document.querySelector('.sheet,.dsp,.qsp,.cwait'))return;const st=S.settings;if(st.newsSeen==null){st.newsSeen=(S.meals||[]).length||(S.sessions||[]).length?1:NEWS[0].id;save();if(st.newsSeen===NEWS[0].id)return}if(NEWS[0].id>st.newsSeen)newsSheet()}catch(e){}}
setTimeout(newsCheck,4000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(newsCheck,2500)});
