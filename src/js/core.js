
(function(){
const KEY='pulse-coach-v1';
const MUSCLES={quads:'Ön bacak',hamstrings:'Arka bacak',glutes:'Kalça',calves:'Baldır',chest:'Göğüs',back:'Sırt',shoulders:'Omuz',biceps:'Biceps',triceps:'Triceps',core:'Karın',other:'Diğer'};
const uid=()=>Math.random().toString(36).slice(2,10);
const z=n=>String(n).padStart(2,'0');
const dkey=(d=new Date())=>d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return isNaN(n)?null:n};
const rnd=x=>Math.round(x/1.25)*1.25;
const e1rm=(kg,r)=>kg*(1+r/30);
const ex=(name,muscle,sets,repMin,repMax,inc)=>({name,muscle,sets,repMin,repMax,inc});
/* ---------- Ev antrenmanı şablonları (bant / 10 kg dumbbell) ---------- */
// hx(İngilizce ad, Türkçe ad, kas, set, minTkr, maxTkr, sabit kg (0=bant/vücut ağırlığı), "Alternatif EN|TR", not)
const hx=(name,tr,muscle,sets,repMin,repMax,fix,alt,note)=>({name,tr,muscle,sets,repMin,repMax,inc:0,fix,alt,note});
// ht = süreli hareket (repMin/repMax saniye). Alternatif sonuna "|t" eklenirse alternatif de sürelidir.
const ht=(name,tr,muscle,sets,sMin,sMax,alt,note)=>({name,tr,muscle,sets,repMin:sMin,repMax:sMax,inc:0,fix:0,t:1,alt,note});
const rr=e=>`${e.repMin}–${e.repMax}${e.t?' sn':''}`;
const mmss=ms=>{const t=Math.max(0,Math.floor(ms/1000)),h=Math.floor(t/3600),m=Math.floor(t/60)%60;return (h?h+':'+z(m):m)+':'+z(t%60)};
const HOME_PROGRAMS={
 w:{lbl:'👩 Kadın · Evde',eq:'Sadece mat · isteğe bağlı mini bant',
  note:'Kayla Itsines, Pamela Reif ve Chloe Ting gibi hocaların evde en çok kullandığı vücut ağırlığı hareketleri. ⏱ işaretliler süreli: Başlat\'a basınca sayaç geri sayar. İlerleme: önce tekrar/süre ekle, sonra zor versiyona geç (diz üstü → tam şınav).',
  plans:[
   {id:'h-w-legs',name:'Kalça & Bacak · Evde',by:'Chloe Ting & Kayla Itsines tarzı',exercises:[
    hx('Squat Pulse','Pulse squat (yaylanmalı squat)','quads',3,12,20,0,'Squat (Mini Band)|Bantlı squat','Dibe in, 2 küçük yaylanma yap, sonra kalk.'),
    hx('Curtsy Lunge','Reverans lunge','glutes',3,10,12,0,'Reverse Lunge|Geri lunge','Her bacak için tekrar; ön diz ayak ucunu geçmesin.'),
    hx('Glute Bridge March','Köprüde yürüyüş','glutes',3,10,16,0,'Single-Leg Glute Bridge|Tek bacak köprü','Kalça yukarıda sabit; dizleri sırayla göğse çek.'),
    hx('Fire Hydrant','Fire hydrant (dört ayakta yana açma)','glutes',3,12,15,0,'Clamshell (Mini Band)|İstiridye','Her bacak; bel sabit, hareket kalçadan.'),
    hx('Sumo Squat','Sumo squat','quads',3,15,20,0,'Sumo Squat (Dumbbell)|Dumbbell sumo squat','Ayaklar geniş, parmak uçları dışa.'),
    ht('Wall Sit','Duvarda oturma','quads',3,30,60,'Squat Hold|Squat\'ta bekleme|t','Dizler 90°, sırt duvara yapışık.')]},
   {id:'h-w-core',name:'Karın & Core · Evde',by:'Pamela Reif & Chloe Ting tarzı',exercises:[
    ht('Forearm Plank','Dirsek plank','core',3,30,60,'Plank (Knees)|Diz üstü plank|t','Kalça omuz hizasında, karnı içe çek.'),
    hx('Reverse Crunch','Ters mekik','core',3,12,15,0,'Lying Leg Raise|Yatarak bacak kaldırma','Kalçayı yerden hafifçe kaldır, savurma.'),
    hx('Jack Knife','Çakı (jack knife)','core',3,10,12,0,'Crunch|Mekik','Eller ve ayaklar ortada buluşur.'),
    ht('Boat Pose','Kayık duruşu','core',3,20,40,'Hollow Body Hold|Hollow tutuş|t','Sırt düz, dizler bükülü başlayabilirsin.'),
    hx('Russian Twist','Rus twist','core',3,16,24,0,'Bicycle Crunch|Bisiklet mekik','Tekrar = iki taraf toplamı.'),
    hx('Plank Hip Dip','Plank\'te kalça düşürme','core',3,12,16,0,'Up and Down Plank|Yukarı-aşağı plank','Dirsek plankta kalçayı sağa-sola indir.'),
    ht('Side Plank','Yan plank','core',2,20,40,'Side Plank (Knees)|Diz üstü yan plank|t','Her taraf için bir set say.')]},
   {id:'h-w-upper',name:'Kol & Üst Vücut · Evde',by:'Kayla Itsines tarzı',exercises:[
    hx('Push Up (Knees)','Diz üstü şınav','chest',3,8,15,0,'Push Up|Tam şınav','15 temiz tekrar olunca tam şınava geç.'),
    hx('Commando','Commando (plank\'te yukarı-aşağı)','shoulders',3,10,15,0,'Up and Down Plank|Yukarı-aşağı plank','Kalça sallanmasın; ayakları biraz aç.'),
    hx('Shoulder Tap','Plank\'te omuza dokunma','core',3,16,20,0,'Forearm Plank|Dirsek plank|t','Tekrar = iki taraf toplamı.'),
    hx('Chair Tricep Dip','Sandalye triceps dips','triceps',3,10,15,0,'Triceps Kickback (Band)|Bantlı triceps kickback','Dirsekler geriye bakar, omuzlar kulaktan uzak.'),
    hx('X Plank','X plank','core',3,12,15,0,'Mountain Climber|Mountain climber','Yüksek plankta zıt kol-bacağı dışa aç.'),
    ht('Superman Hold','Superman tutuş','back',3,20,30,'Bird Dog|Bird dog','Yüzüstü, kol ve bacaklar yerden hafif kalkık.')]},
   {id:'h-w-hiit',name:'Tam Vücut HIIT · Evde',by:'Kayla Itsines (High Intensity) tarzı',exercises:[
    ht('Jump Squat','Zıplamalı squat','quads',3,30,40,'Squat Pulse|Pulse squat (zıplamasız)|t','Yumuşak in; dizler içe kaçmasın.'),
    ht('Burpee','Burpee','other',3,30,40,'Walk Out|Walk-out (zıplamasız)|t','Düşük tempolu versiyon: zıplamadan adımla.'),
    ht('Mountain Climber','Mountain climber','core',3,30,40,'Plank Knee Tuck|Plank\'te diz çekme|t','Kalça omuz hizasında.'),
    ht('Lunge to High Knee','Lunge + diz çekme','quads',3,30,40,'Reverse Lunge|Geri lunge|t','Her sette bacak değiştir.'),
    ht('Plank Jack','Plank jack','core',3,30,40,'Shoulder Tap|Omuza dokunma|t','Ayakları açıp kapa, kalça sabit.'),
    ht('Ab Bike','Ab bike (bisiklet mekik)','core',3,30,40,'Dead Bug|Ölü böcek|t','Dirsek karşı dize, yavaş ve kontrollü.')]}]},
 wb:{lbl:'👩 Kadın · Bant',eq:'Uzun pilates bandı + mini loop bant + mat',
  note:'Bantla ilerleme: hedef tekrarın üstüne çıkınca bir sert banda geç, bandı kısa tut ya da 3 sn yavaş indir. Setler arası 30–60 sn dinlen.',
  plans:[
   {id:'h-w-glute',name:'Kalça & Bacak (Bant)',exercises:[
    hx('Glute Bridge (Mini Band)','Bantlı köprü','glutes',3,15,20,0,'Single-Leg Glute Bridge|Tek bacak köprü','Bant dizlerin hemen üstünde; tepede dizleri dışarı it, 1 sn sık.'),
    hx('Squat (Mini Band)','Bantlı squat','quads',3,12,20,0,'Sumo Squat (Band)|Bantlı sumo squat','Dizler içe kaçmasın, bandı dışarı doğru gerdir.'),
    hx('Donkey Kick (Mini Band)','Bantlı geri tekme (donkey kick)','glutes',3,12,15,0,'Standing Kickback (Mini Band)|Ayakta bantlı geri tekme','Her bacak için tekrar; belini çukurlaştırma.'),
    hx('Lateral Band Walk','Bantlı yan yürüyüş','glutes',3,10,15,0,'Monster Walk (Band)|Bantlı çapraz yürüyüş','Tekrar = her yöne adım. Yarım squat pozisyonunda kal.'),
    hx('Clamshell (Mini Band)','İstiridye (clamshell)','glutes',3,15,20,0,'Side-Lying Leg Lift (Band)|Yan yatarak bacak kaldırma','Yan kalça (gluteus medius) için; leğen geriye devrilmesin.'),
    hx('Romanian Deadlift (Band)','Bantlı Romen deadlift','hamstrings',3,12,15,0,'Single-Leg RDL|Tek bacak Romen deadlift','Bandın ortasına bas, kalçadan menteşe yap; sırt düz.')]},
   {id:'h-w-upper',name:'Üst Vücut & Duruş (Bant)',exercises:[
    hx('Seated Row (Band)','Oturarak bant çekiş','back',3,12,15,0,'Bent Over Row (Band)|Eğilerek bant çekiş','Bandı ayak tabanından geçir, kürek kemiklerini sık.'),
    hx('Band Pull-Apart','Bant açma (pull-apart)','shoulders',3,15,20,0,'Reverse Fly (Band)|Bantlı ters açış','Omuz arkası ve duruş için; kollar göğüs hizasında.'),
    hx('Chest Press (Band)','Bantlı göğüs itişi','chest',3,10,15,0,'Push Up (Knees)|Diz üstü şınav','Bandı sırtından dolayıp öne it.'),
    hx('Overhead Press (Band)','Bantlı omuz press','shoulders',3,10,15,0,'Front Raise (Band)|Bantlı öne kaldırma','Bandın ortasına bas, karnını sıkı tut.'),
    hx('Bicep Curl (Band)','Bantlı biceps curl','biceps',3,12,15,0,'Hammer Curl (Band)|Bantlı çekiç curl','Dirsekler gövdeye yapışık.'),
    hx('Triceps Extension (Band)','Bantlı baş üstü triceps','triceps',3,12,15,0,'Triceps Kickback (Band)|Bantlı triceps kickback','Dirsekler sabit, sadece ön kol hareket etsin.')]},
   {id:'h-w-core',name:'Pilates Core (Bant)',exercises:[
    hx('Roll Up (Band)','Bant destekli roll-up','core',3,8,12,0,'Crunch (Band)|Bantlı mekik','Bandı ayaklarına dola, omurgayı tek tek yuvarla.'),
    hx('Dead Bug (Band)','Bantlı ölü böcek (dead bug)','core',3,10,12,0,'Dead Bug|Ölü böcek','Bel yere yapışık; her taraf için tekrar.'),
    hx('Side-Lying Leg Lift (Band)','Yan yatış düz bacak kaldırma','glutes',3,15,20,0,'Clamshell (Mini Band)|İstiridye','Bacak düz, ayak ucu hafif aşağı bakar.'),
    hx('Leg Circles (Band)','Bantlı bacak çevirme','core',3,8,10,0,'Single Leg Stretch|Tek bacak germe','Her yön için tekrar; leğen sabit kalsın.'),
    hx('Plank Leg Lift (Mini Band)','Bantlı plank bacak kaldırma','core',3,8,12,0,'Forearm Plank|Dirsek plank|t','Bant ayak bileklerinde; kalça yükselmesin.'),
    hx('Static Lunge + Triceps (Band)','Statik lunge + bantlı triceps','quads',3,10,12,0,'Split Squat|Split squat','Reformer çalışmasını taklit eder: bacak + core + kol birlikte.')]}]},
 m:{lbl:'👨 Erkek · 10 kg+bant',eq:'1 çift 10 kg dumbbell + direnç bandı (kapı ankrajı) + sandalye',
  note:'Ağırlık 10 kg\'da sabit, bu yüzden ilerleme tekrardan gelir: önce tekrar artır, üst sınıra ulaşınca 3 sn yavaş indir, tek kol/tek bacak versiyonuna geç ya da bant ekle. Setler arası 60–90 sn.',
  plans:[
   {id:'h-m-push',name:'İtiş · Göğüs/Omuz/Triceps (Ev)',exercises:[
    hx('Floor Press (Dumbbell)','Yerde dumbbell press','chest',4,10,15,10,'Push Up|Şınav','Sırtüstü yerde; dirsek yere değince it.'),
    hx('Push Up (Banded)','Bantlı şınav','chest',3,8,15,0,'Push Up (Deficit)|Kitap üstünde derin şınav','Bandı sırtından dola, uçlarını avuçlarının altına al.'),
    hx('Shoulder Press (Dumbbell)','Dumbbell omuz press','shoulders',3,10,15,10,'Arnold Press (Dumbbell)|Arnold press','Oturarak veya ayakta; beli çukurlaştırma.'),
    hx('Lateral Raise (Band)','Bantlı yana açış','shoulders',3,15,20,0,'Lateral Raise (Dumbbell)|Tek kol dumbbell yana açış (10 kg)','10 kg iki kolla ağır gelir; bant veya tek kol tercih et.'),
    hx('Overhead Triceps Extension (Dumbbell)','Tek dumbbell baş üstü triceps','triceps',3,10,15,10,'Triceps Pushdown (Band)|Bantlı triceps pushdown','Tek dumbbell\'i iki elle tut.'),
    hx('Chair Dip','Sandalye dips','triceps',3,10,20,0,'Diamond Push Up|Elmas şınav','Omuz ağrırsa yarım hareket yap.')]},
   {id:'h-m-pull',name:'Çekiş · Sırt/Biceps (Ev)',exercises:[
    hx('Bent Over Row (Dumbbell)','Eğilerek dumbbell row','back',4,10,15,10,'Single Arm Row (Dumbbell)|Tek kol dumbbell row','Sandalyeye dayanarak tek kol da yapabilirsin.'),
    hx('Lat Pulldown (Band)','Bantlı lat pulldown (kapı ankrajı)','back',3,12,15,0,'Pull Up|Barfiks (bar varsa)','Bandı kapının üstüne sabitle, dirsekleri cebe çek.'),
    hx('Seated Row (Band)','Oturarak bant çekiş','back',3,12,15,0,'Renegade Row (Dumbbell)|Plankta dumbbell row','Kürek kemiklerini sık, 1 sn bekle.'),
    hx('Face Pull (Band)','Bantlı face pull','shoulders',3,15,20,0,'Band Pull-Apart|Bant açma','Omuz arkası ve duruş için.'),
    hx('Hammer Curl (Dumbbell)','Dumbbell çekiç curl','biceps',3,10,15,10,'Bicep Curl (Band)|Bantlı biceps curl','Sallanmadan, 2 sn indir.'),
    hx('Shrug (Dumbbell)','Dumbbell shrug','back',3,15,20,10,'Shrug (Band)|Bantlı shrug','Tepede 2 sn bekle.')]},
   {id:'h-m-legs',name:'Bacak (Ev)',exercises:[
    hx('Goblet Squat (Dumbbell)','Goblet squat','quads',4,12,20,10,'Squat (Band)|Bantlı squat','Tek dumbbell göğüs önünde; derin in.'),
    hx('Bulgarian Split Squat (Dumbbell)','Bulgar split squat','quads',3,8,12,10,'Reverse Lunge (Dumbbell)|Geri lunge','Arka ayak sandalyede; her bacak için tekrar.'),
    hx('Romanian Deadlift (Dumbbell)','Dumbbell Romen deadlift','hamstrings',3,12,15,10,'Single Leg Romanian Deadlift (Dumbbell)|Tek bacak RDL','10 kg hafif gelirse tek bacak versiyonuna geç.'),
    hx('Hip Thrust (Dumbbell)','Dumbbell hip thrust','glutes',3,12,20,10,'Hip Thrust (Band)|Bantlı hip thrust','Sırt kanepeye dayalı, dumbbell kalçada.'),
    hx('Lying Leg Curl (Band)','Bantlı yatarak leg curl','hamstrings',3,12,15,0,'Sliding Leg Curl|Havlu ile kaydırmalı leg curl','Bandı kapının altına sabitle.'),
    hx('Single Leg Calf Raise (Dumbbell)','Tek bacak baldır kaldırma','calves',3,12,20,10,'Standing Calf Raise|Çift bacak baldır kaldırma','Basamakta, tam aşağı in.'),
    ht('Plank','Plank','core',3,30,60,'Side Plank|Yan plank|t','60 sn kolaylaşınca dumbbell\'ı sırtına koy.')]}]}
};
const homeTpl=id=>{for(const g of Object.values(HOME_PROGRAMS)){const t=g.plans.find(p=>p.id===id);if(t)return t}return null};
const altP=s=>{const[en,tr,t]=String(s||'').split('|');return{en,tr:tr||'',t:t==='t'}};

function defaults(){return{
  v:1,
  settings:{kcal:2400,protein:150,carbs:260,fat:70,rest:90},
  plans:[
    {id:uid(),name:'Lower Body',exercises:[ex('Squat (Barbell)','quads',4,6,10,2.5),ex('Leg Press','quads',4,8,12,5),ex('Leg Extension (Machine)','quads',3,10,15,2.5),ex('Romanian Deadlift (Barbell)','hamstrings',3,8,12,2.5),ex('Lying Leg Curl (Machine)','hamstrings',3,10,15,2.5),ex('Standing Calf Raise (Machine)','calves',3,10,15,2.5)]},
    {id:uid(),name:'Upper Body',exercises:[ex('Bench Press (Barbell)','chest',4,6,10,2.5),ex('Bent Over Row (Barbell)','back',4,6,10,2.5),ex('Overhead Press (Barbell)','shoulders',3,6,10,2.5),ex('Lat Pulldown (Cable)','back',3,8,12,2.5),ex('Lateral Raise (Dumbbell)','shoulders',3,12,20,1),ex('Bicep Curl (Dumbbell)','biceps',3,10,15,1),ex('Triceps Pushdown (Cable - Straight Bar)','triceps',3,10,15,2.5)]},
    {id:uid(),name:'Full Body',exercises:[ex('Deadlift (Barbell)','back',3,4,8,5),ex('Incline Bench Press (Dumbbell)','chest',3,8,12,2),ex('Pull Up','back',3,5,10,1.25),ex('Bulgarian Split Squat','quads',3,8,12,2),ex('Cable Crunch','core',3,10,15,2.5)]}
  ],
  next:0,sessions:[],meals:[],body:[],active:null,mealPlan:{},groc:{},customIng:{},myRecipes:[],drinks:[],supps:[],suppLog:{},photos:[],reports:{},health:{},healthDemo:false,cardio:[],cycle:{starts:[],ends:{},log:{}},bio:{},
  profile:{sex:'m',age:null,height:null,weight:null,act:1.55,goal:'maintain',rate:0,auto:true,applied:false}
}}
let S;
let FRESH=false;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}
if(!S){S=defaults();FRESH=true;window.__bootFresh=true;S._cf=1}
if(!S.plans||!S.settings)S=defaults();
{const d0=defaults();['mealPlan','groc','customIng','myRecipes','profile','drinks','supps','suppLog','photos','reports','health','cardio','cycle','bio'].forEach(k=>{if(!S[k])S[k]=d0[k]})}
