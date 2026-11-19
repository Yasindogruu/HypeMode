/* ===== Hızlı çizim: ekranı baştan kurmak yerine sadece değişen düğümleri güncelle ===== */
function morphSame(x,y){return x.nodeType===y.nodeType&&(x.nodeType!==1||(x.tagName===y.tagName&&(x.id||'')===(y.id||'')))}
function morphNode(x,y){if(x.nodeType!==1){if(x.nodeValue!==y.nodeValue)x.nodeValue=y.nodeValue;return}
  const T=x.tagName;if(T==='CANVAS'||T==='VIDEO'||T==='IFRAME'||x.hasAttribute('data-keep'))return;
  for(const a of [...x.attributes]){if(!y.hasAttribute(a.name)&&!(T==='DETAILS'&&a.name==='open'))x.removeAttribute(a.name)}
  for(const a of y.attributes){if(x.getAttribute(a.name)!==a.value)x.setAttribute(a.name,a.value)}
  if(T==='INPUT'||T==='TEXTAREA'||T==='SELECT'){if(document.activeElement!==x){const v=T==='TEXTAREA'?y.value:(y.getAttribute('value')||'');if(T!=='SELECT'&&x.type!=='file'&&x.value!==v)x.value=v;if(x.type==='checkbox'||x.type==='radio')x.checked=y.hasAttribute('checked')}if(T!=='SELECT')return}
  morphKids(x,y)}
function morphKids(a,b){const bn=[...b.childNodes];for(let i=0;i<bn.length;i++){const nb=bn[i],na=a.childNodes[i];if(!na){a.appendChild(nb);continue}if(morphSame(na,nb))morphNode(na,nb);else a.replaceChild(nb,na)}while(a.childNodes.length>bn.length)a.removeChild(a.lastChild)}
function morphHTML(el,html){const t=document.createElement('template');t.innerHTML=html;morphKids(el,t.content)}
