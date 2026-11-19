/* ===== Performans ölçümü ===== */
const PERF={t0:performance.timeOrigin||Date.now(),boot:null,renders:0,renderMs:0,renderMax:0,long:0,longMs:0,idbMs:null,idbBoot:null,syncMs:null,ghMs:null,errs:[],
  err(m){this.errs.unshift({t:Date.now(),m:String(m).slice(0,160)});this.errs.length=Math.min(this.errs.length,20)}};
try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{PERF.long++;PERF.longMs+=e.duration})).observe({type:'longtask',buffered:true})}catch(e){}
addEventListener('error',e=>PERF.err((e.message||'hata')+(e.lineno?' @'+e.lineno:'')));addEventListener('unhandledrejection',e=>PERF.err('promise: '+(e.reason&&(e.reason.message||e.reason))));

