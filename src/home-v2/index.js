/* The Lazy Dog — Accueil v2 : index des projets.
   [data-v2-index] : la liste CMS (.v2-work__item > a.v2-row). Vue « liste » : au survol d'une ligne, un aperçu de l'image suit
   le curseur (avec une légère inclinaison selon la vitesse) et change d'image par un volet. Vue « grille » : cartes images.
   [data-v2-view="list|grid"] : boutons de bascule (choix mémorisé). [data-v2-year] : la date CMS est réduite à l'année.
   [data-v2-count] : nombre de projets. Les lignes se dessinent (trait puis texte) à l'entrée dans l'écran. */
(function(){
  var V=window.tldV2,list=document.querySelector('[data-v2-index]');if(!V||!list)return;
  var items=[].slice.call(list.querySelectorAll('.v2-work__item'));
  [].forEach.call(list.querySelectorAll('[data-v2-year]'),function(el){var m=(el.textContent||'').match(/(19|20)\d{2}/);if(m)el.textContent=m[0];});
  [].forEach.call(document.querySelectorAll('[data-v2-count]'),function(el){el.textContent=('0'+items.length).slice(-2);});
  /* bascule liste / grille */
  var btns=[].slice.call(document.querySelectorAll('[data-v2-view]')),pill=document.querySelector('.v2-switch__pill');
  function placePill(b){if(!pill||!b)return;pill.style.width=b.offsetWidth+'px';pill.style.transform='translateX('+b.offsetLeft+'px)';}
  var sec=list.closest('.v2-work');
  function setView(v,anim){
    if(sec)sec.setAttribute('data-view',v);
    btns.forEach(function(b){var on=b.getAttribute('data-v2-view')===v;b.setAttribute('aria-pressed',on?'true':'false');if(on)placePill(b);});
    if(list.getAttribute('data-view')===v)return;
    try{localStorage.setItem('tld-v2-view',v);}catch(e){}
    if(!anim||V.reduce){list.setAttribute('data-view',v);return;}
    list.classList.add('is-swapping');hide();
    setTimeout(function(){list.setAttribute('data-view',v);requestAnimationFrame(function(){list.classList.remove('is-swapping');});},220);
  }
  var saved=null;try{saved=localStorage.getItem('tld-v2-view');}catch(e){}
  setView(saved==='grid'?'grid':'list',false);
  btns.forEach(function(b){b.addEventListener('click',function(){setView(b.getAttribute('data-v2-view'),true);});});
  window.addEventListener('resize',function(){placePill(btns.filter(function(b){return b.getAttribute('aria-pressed')==='true';})[0]);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){placePill(btns.filter(function(b){return b.getAttribute('aria-pressed')==='true';})[0]);});
  /* apparition des lignes : le trait se dessine, puis le texte monte */
  if(!V.reduce&&window.CSS&&CSS.registerProperty){try{CSS.registerProperty({name:'--v2-rx',syntax:'<number>',inherits:false,initialValue:'1'});}catch(e){}}
  var rows=items.map(function(it){return it.querySelector('.v2-row');}).filter(Boolean);
  if(!V.reduce){rows.forEach(function(r){r.style.setProperty('--v2-rx','0');r.style.transition='--v2-rx 1.1s '+V.E.io;[].forEach.call(r.children,function(c){c.style.opacity='0';});});
    V.inView(rows,function(r){var i=rows.indexOf(r)%4;
      setTimeout(function(){r.style.setProperty('--v2-rx','1');
        [].forEach.call(r.children,function(c,k){c.style.opacity='';c.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:800,delay:160+k*45,easing:V.E.out,fill:'backwards'});});},i*70);});}
  /* aperçu flottant */
  if(!V.fine)return;
  var pv=document.createElement('div');pv.className='v2-preview';pv.setAttribute('aria-hidden','true');document.body.appendChild(pv);
  var imgs=rows.map(function(r){var src=r.querySelector('img');var im=document.createElement('img');im.alt='';im.decoding='async';if(src)im.src=src.currentSrc||src.src;pv.appendChild(im);return im;});
  var on=false,cur=-1,x=0,y=0,px=0,py=0,rot=0,sc=.92,raf=null,last=performance.now();
  function frame(now){
    var dt=Math.min(64,now-last)/16.7;last=now;
    var k=1-Math.pow(1-.16,dt),vx=(x-px);px+=(x-px)*k;py+=(y-py)*k;
    rot+=(V.clamp(vx*.06,-8,8)-rot)*Math.min(1,.12*dt);sc+=((on?1:.92)-sc)*Math.min(1,.18*dt);
    pv.style.transform='translate3d('+(px-pv.offsetWidth/2).toFixed(1)+'px,'+(py-pv.offsetHeight/2).toFixed(1)+'px,0) rotate('+rot.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';
    if(on||Math.abs(x-px)>.5||Math.abs(sc-.92)>.005)raf=requestAnimationFrame(frame);else raf=null;
  }
  function kick(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
  function show(i){
    if(list.getAttribute('data-view')!=='list')return;
    if(!on){on=true;px=x;py=y;pv.classList.add('is-on');}
    if(i!==cur){var prev=imgs[cur];if(prev){prev.classList.remove('is-current');prev.classList.add('is-leaving');setTimeout(function(){prev.classList.remove('is-leaving');},520);}
      imgs[i].classList.remove('is-leaving');imgs[i].classList.add('is-current');imgs[i].style.zIndex=++z;cur=i;}
    kick();
  }
  var z=1;
  function hide(){if(!on)return;on=false;pv.classList.remove('is-on');kick();}
  window.addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;if(on)kick();},{passive:true});
  rows.forEach(function(r,i){r.setAttribute('data-cursor','projects');r.addEventListener('pointerenter',function(){show(i);});});
  list.addEventListener('pointerleave',hide);
  window.addEventListener('scroll',function(){if(!on)return;var t=document.elementFromPoint(x,y);if(!t||!list.contains(t))hide();},{passive:true});
})();
