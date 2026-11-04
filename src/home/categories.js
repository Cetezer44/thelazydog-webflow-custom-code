/* The Lazy Dog — section catégories (Publicité, Film de marque…) épinglée au scroll.
   [data-cats] : la section ; [data-cats-pin] : le bloc qui reste fixé à l'écran ; [data-cat] : chaque ligne de catégorie ;
   [data-cat-panel] : le paragraphe de chaque catégorie (même ordre) ; [data-cat-bar] : le rectangle de couleur (avec un enfant de remplissage).
   En scrollant, le rectangle se construit de gauche à droite sur la catégorie active, puis passe à la suivante ;
   le paragraphe correspondant s'affiche. data-cats-step (défaut 0.6) = scroll par catégorie, en hauteur d'écran. */
(function(){
  var sec=document.querySelector('[data-cats]');if(!sec)return;
  var pin=sec.querySelector('[data-cats-pin]'),rows=[].slice.call(sec.querySelectorAll('[data-cat]')),panels=[].slice.call(sec.querySelectorAll('[data-cat-panel]'));
  var bar=sec.querySelector('[data-cat-bar]'),fill=bar&&bar.firstElementChild,wrap=panels.length&&panels[0].parentNode;
  if(!pin||!rows.length)return;
  var n=rows.length,STEP=parseFloat(sec.getAttribute('data-cats-step'))||.6,reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur=-1,ticking=false,stacked=false;
  if(fill){fill.style.transformOrigin='0 50%';fill.style.willChange='transform';}
  function layout(){
    var vh=window.innerHeight;
    sec.style.height=(vh+n*STEP*vh)+'px';pin.style.position='sticky';pin.style.top='0px';pin.style.height=vh+'px';
    stacked=window.innerWidth<768;
    if(wrap){var mh=0;panels.forEach(function(p){mh=Math.max(mh,p.offsetHeight);});wrap.style.minHeight=mh+'px';}
    cur=-1;update();
  }
  function set(i){
    if(i===cur)return;cur=i;
    rows.forEach(function(r,j){r.classList.toggle('is-active',j===i);});
    panels.forEach(function(p,j){p.classList.toggle('is-active',j===i);p.setAttribute('aria-hidden',j===i?'false':'true');});
    var r=rows[i];
    if(bar){bar.style.transform='translateY('+r.offsetTop+'px)';bar.style.height=r.offsetHeight+'px';}
    if(wrap)wrap.style.transform=stacked?'':'translateY('+(r.offsetTop+4)+'px)';
  }
  function update(){
    ticking=false;
    var r=sec.getBoundingClientRect(),vh=window.innerHeight,len=Math.max(1,r.height-vh);
    var t=Math.max(0,Math.min(.99999,-r.top/len)),x=t*n,i=Math.floor(x),local=reduce?1:x-i;
    set(i);if(fill)fill.style.transform='scaleX('+Math.min(1,local*1.15).toFixed(4)+')';
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,120);});
  window.addEventListener('load',layout);layout();
})();
