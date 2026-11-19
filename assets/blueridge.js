/* BLUERIDGE PLUMBING — shared interactions (vanilla JS, no dependencies) */
(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function init(){
 var root=$(".br");if(!root)return;
 $$("[data-br-year]").forEach(function(e){e.textContent=new Date().getFullYear()});

 /* Sticky header shadow */
 var hd=$("[data-br-header]");
 if(hd){var onS=function(){hd.classList.toggle("is-stuck",window.scrollY>8)};onS();window.addEventListener("scroll",onS,{passive:true})}

 /* Mobile menu */
 var bg=$("[data-br-burger]"),nav=$("#br-nav"),shade=null;
 function closeNav(){if(!nav)return;nav.classList.remove("is-open");bg.setAttribute("aria-expanded","false");bg.setAttribute("aria-label","Open menu");document.body.classList.remove("br-lock");if(shade){shade.remove();shade=null}}
 if(bg&&nav){bg.addEventListener("click",function(){var o=!nav.classList.contains("is-open");if(!o){closeNav();return}
   nav.classList.add("is-open");bg.setAttribute("aria-expanded","true");bg.setAttribute("aria-label","Close menu");document.body.classList.add("br-lock");
   shade=document.createElement("div");shade.className="br-nav-bg";shade.addEventListener("click",closeNav);(hd||root).appendChild(shade);var f=$("a",nav);if(f)f.focus()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("is-open")){closeNav();bg.focus()}});
  window.addEventListener("resize",function(){if(window.innerWidth>1024)closeNav()});
  $$("a",nav).forEach(function(a){a.addEventListener("click",closeNav)})}
 $$(".br-sub-tg").forEach(function(t){t.addEventListener("click",function(){var li=t.parentNode,o=li.classList.toggle("is-open");t.setAttribute("aria-expanded",o?"true":"false")})});

 /* Scroll reveal */
 var rv=$$(".br-rv");
 if("IntersectionObserver" in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px",threshold:.08});
  rv.forEach(function(e){io.observe(e)});
 }else{root.classList.add("no-io")}

 /* Project filter */
 var grid=$("[data-br-projects]"),cnt=$("[data-br-count]");
 $$("[data-br-filter]").forEach(function(b){b.addEventListener("click",function(){
  var c=b.getAttribute("data-br-filter"),n=0;
  $$("[data-br-filter]").forEach(function(x){var on=x===b;x.classList.toggle("is-on",on);x.setAttribute("aria-pressed",on?"true":"false")});
  $$(".br-proj",grid).forEach(function(p){var show=c==="all"||p.getAttribute("data-cat")===c;p.hidden=!show;if(show){n++;p.classList.add("is-in")}});
  if(cnt)cnt.textContent="Showing "+n+" "+(n===1?"project":"projects")+(c==="all"?"":" in "+c);
 })});

 /* Project gallery modal */
 var dataEl=$("#br-proj-data"),modal=$("[data-br-modal]");
 if(dataEl&&modal){
  var D={};try{D=JSON.parse(dataEl.textContent)}catch(e){}
  var box=$(".br-modal-box",modal),mimg=$("[data-br-mimg]",modal),thumbs=$("[data-br-mthumbs]",modal),mc=$("[data-br-mcount]",modal),cur=null,ix=0,last=null;
  function show(i){var im=cur.imgs;ix=(i+im.length)%im.length;mimg.src=im[ix].s;mimg.alt=im[ix].a;mc.textContent=(ix+1)+" / "+im.length;
   $$("button",thumbs).forEach(function(b,j){b.classList.toggle("is-on",j===ix);b.setAttribute("aria-current",j===ix?"true":"false")})}
  function open(id){cur=D[id];if(!cur)return;last=document.activeElement;
   $("[data-br-mtitle]",modal).textContent=cur.title;$("[data-br-mcat]",modal).textContent=cur.cat;$("[data-br-mcity]",modal).textContent=cur.city;
   $("[data-br-mprob]",modal).textContent=cur.problem;$("[data-br-msol]",modal).textContent=cur.solution;
   $("[data-br-mscope]",modal).innerHTML=cur.scope.map(function(s){return '<li><svg class="br-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.8 10A10 10 0 1 1 17 3.33"/><path d="m9 11 3 3L22 4"/></svg>'+esc(s)+'</li>'}).join("");
   thumbs.innerHTML=cur.imgs.map(function(m,j){return '<button type="button" aria-label="Show photo '+(j+1)+'"><img src="'+esc(m.s.replace("w=1600&h=1200","w=320&h=240"))+'" alt=""></button>'}).join("");
   $$("button",thumbs).forEach(function(b,j){b.addEventListener("click",function(){show(j)})});
   show(0);modal.hidden=false;document.body.classList.add("br-lock");box.focus();
   if(history.replaceState)history.replaceState(null,"","#"+id)}
  function close(){modal.hidden=true;document.body.classList.remove("br-lock");if(history.replaceState)history.replaceState(null,"",location.pathname+location.search);if(last&&last.focus)last.focus()}
  $$("[data-br-project]").forEach(function(b){b.addEventListener("click",function(){open(b.getAttribute("data-br-project"))})});
  $$("[data-br-close]",modal).forEach(function(b){b.addEventListener("click",close)});
  $("[data-br-prev]",modal).addEventListener("click",function(){show(ix-1)});
  $("[data-br-next]",modal).addEventListener("click",function(){show(ix+1)});
  document.addEventListener("keydown",function(e){if(modal.hidden)return;
   if(e.key==="Escape")close();else if(e.key==="ArrowLeft")show(ix-1);else if(e.key==="ArrowRight")show(ix+1);
   else if(e.key==="Tab"){var f=$$("button,a[href]",box).filter(function(x){return x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&(document.activeElement===a||document.activeElement===box)){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
  var h=location.hash.replace("#","");if(h&&D[h])setTimeout(function(){open(h)},150);
  window.addEventListener("hashchange",function(){var k=location.hash.replace("#","");if(k&&D[k]&&modal.hidden)open(k)});
 }
 /* Prefill from query string (?service= / ?city=) */
 var q={};location.search.replace(/^\?/,"").split("&").forEach(function(p){if(!p)return;var kv=p.split("=");q[decodeURIComponent(kv[0])]=decodeURIComponent((kv[1]||"").replace(/\+/g," "))});
 if(q.service){var s=$("#service_needed");if(s&&$('option[value="'+q.service.replace(/"/g,"")+'"]',s))s.value=q.service}
 if(q.city){var c=$("#city");if(c)$$("option",c).forEach(function(o){if(o.textContent===q.city)c.value=o.textContent})}

 /* File input label */
 $$("[data-br-file]").forEach(function(inp){inp.addEventListener("change",function(){var l=$("[data-br-filelabel]",inp.parentNode),fs=Array.prototype.slice.call(inp.files||[]);
  var err=$("#e-"+inp.id),f=inp.closest(".br-field");if(err)err.textContent="";f.classList.remove("is-bad");
  if(fs.length>3){if(err)err.textContent="Please choose up to 3 photos.";f.classList.add("is-bad")}
  else if(fs.some(function(x){return x.type&&x.type.indexOf("image/")!==0})){if(err)err.textContent="Please choose image files only.";f.classList.add("is-bad")}
  l.textContent=fs.length?fs.map(function(x){return x.name}).join(", "):"Choose up to 3 photos (JPG or PNG)"})});

 /* Forms: validation + confirmation summary.
    GHL HOOK: when connected to a native GHL form or workflow, submit `data` there. Until connected, submissions are not transmitted. */
 var today=new Date();today.setHours(0,0,0,0);
 function check(el){
  var f=el.closest(".br-field"),err=f?$(".br-err",f):null,v=(el.value||"").trim(),m="",lab=el.getAttribute("data-label")||"This field";
  if(el.type==="radio"){var g=$$('input[name="'+el.name+'"]',el.form);if(el.required||g.some(function(x){return x.required})){if(!g.some(function(x){return x.checked}))m="Please choose a "+lab.toLowerCase()+"."}}
  else if(el.type==="checkbox"){if(el.required&&!el.checked)m="Please confirm to continue."}
  else if(el.type==="file"){var fs=el.files||[];if(fs.length>3)m="Please choose up to 3 photos."}
  else if(el.required&&!v)m=lab+" is required.";
  else if(v&&el.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))m="Please enter a valid email address.";
  else if(v&&el.type==="tel"&&v.replace(/\D/g,"").length<10)m="Please enter a 10-digit phone number.";
  else if(v&&el.minLength>0&&v.length<el.minLength)m="Please add a little more detail (at least "+el.minLength+" characters).";
  else if(v&&el.hasAttribute("data-br-future")){var d=new Date(v+"T00:00:00");if(isNaN(d)||d<today)m="Please choose today or a future date."}
  if(f){f.classList.toggle("is-bad",!!m);f.classList.toggle("is-ok",!m&&(v!==""||el.checked))}
  if(err)err.textContent=m;
  if(el.type!=="radio"){el.setAttribute("aria-invalid",m?"true":"false");if(err&&err.id)el.setAttribute("aria-errormessage",err.id)}
  return !m}
 $$("[data-br-form]").forEach(function(form){
  var dateIn=$("[data-br-future]",form);if(dateIn){var t=new Date(),p=function(n){return(n<10?"0":"")+n};dateIn.min=t.getFullYear()+"-"+p(t.getMonth()+1)+"-"+p(t.getDate())}
  var fields=$$("input,select,textarea",form).filter(function(e){return e.name});
  fields.forEach(function(el){el.addEventListener("blur",function(){if(el.value||el.closest(".br-field").classList.contains("is-bad"))check(el)});el.addEventListener("change",function(){if(el.closest(".br-field").classList.contains("is-bad")||el.type==="radio"||el.type==="checkbox")check(el)})});
  var done=form.parentNode.querySelector("[data-br-done]");
  form.addEventListener("submit",function(e){e.preventDefault();var ok=true,first=null,seen={};
   fields.forEach(function(el){if(el.type==="radio"){if(seen[el.name])return;seen[el.name]=1}if(!check(el)){ok=false;if(!first)first=el}});
   if(!ok){first.focus();return}
   var data={},dl=done?$("[data-br-summary]",done):null,rows="";seen={};
   fields.forEach(function(el){var lab=el.getAttribute("data-label")||el.name,v="";
    if(el.type==="radio"){if(seen[el.name])return;seen[el.name]=1;var c=$('input[name="'+el.name+'"]:checked',form);v=c?c.value:""}
    else if(el.type==="checkbox"){v=el.checked?"Yes":"No"}
    else if(el.type==="file"){v=Array.prototype.slice.call(el.files||[]).map(function(x){return x.name}).join(", ")}
    else if(el.tagName==="SELECT"){v=el.value?el.options[el.selectedIndex].text:""}
    else v=el.value.trim();
    data[el.name]=v;if(v&&el.name!=="consent")rows+="<dt>"+esc(lab)+"</dt><dd>"+esc(v)+"</dd>"});
   if(dl)dl.innerHTML=rows;
   form.hidden=true;if(done){done.hidden=false;done.focus();done.scrollIntoView({behavior:"smooth",block:"center"})}
  });
  if(done){var rb=$("[data-br-reset]",done);if(rb)rb.addEventListener("click",function(){form.reset();$$(".br-field",form).forEach(function(f){f.classList.remove("is-ok","is-bad")});$$(".br-err",form).forEach(function(x){x.textContent=""});
   var fl=$("[data-br-filelabel]",form);if(fl)fl.textContent="Choose up to 3 photos (JPG or PNG)";done.hidden=true;form.hidden=false;var f1=$("input,select,textarea",form);if(f1)f1.focus()})}
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
