/* The Lazy Dog — parallax au scroll.
   [data-parallax] et .tld-work__media (cadre en overflow:hidden) : l'image à l'intérieur glisse plus lentement que le cadre. Valeur = amplitude (défaut 0.12 = 12 % de la hauteur).
   [data-speed] : l'élément entier avance plus vite ou plus lentement que la page (ex. 0.1 = 10 % de la hauteur de l'écran).
   [data-speeds="0,0.08,…"] sur une liste : une vitesse par élément de la liste. Désactivé sur mobile. */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var frames=[].slice.call(document.querySelectorAll('[data-parallax],.tld-work__media')).map(function(el){
    var img=el.querySelector('video')||el.querySelector('img');if(img&&img.closest('.tld-work__hover'))img=null;if(!img)return null; /* vidéo du projet (work-video.js) ou image */
    var a=parseFloat(el.getAttribute('data-parallax'));if(!(a>0))a=el.hasAttribute('data-parallax')?.12:.07; /* projets : parallax léger */
    img.style.position='absolute';img.style.left='0';img.style.width='100%';img.style.maxWidth='none';
    img.style.top=(-a*100)+'%';img.style.height=((1+2*a)*100)+'%';img.style.objectFit='cover';img.style.willChange='transform';
    return {el:el,img:img,a:a};
  }).filter(Boolean);
  var movers=[].slice.call(document.querySelectorAll('[data-speed]')).map(function(el){return {el:el,s:parseFloat(el.getAttribute('data-speed'))||0};}).filter(function(m){return m.s;});
  /* [data-speeds="0,0.08,…"] sur une liste (ex. Collection List) : une vitesse par enfant, dans l'ordre */
  [].forEach.call(document.querySelectorAll('[data-speeds]'),function(list){var sp=list.getAttribute('data-speeds').split(',').map(parseFloat);
    [].forEach.call(list.children,function(ch,i){var v=sp[i%sp.length];if(v)movers.push({el:ch,s:v});});});
  if(!frames.length&&!movers.length)return;
  var ticking=false;
  function prog(r,vh){return (vh-r.top)/(vh+r.height);} /* 0 = juste sous l'écran, 1 = juste au-dessus */
  function update(){
    ticking=false;var vh=window.innerHeight,mobile=window.innerWidth<768;
    frames.forEach(function(f){var r=f.el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
      var p=Math.max(0,Math.min(1,prog(r,vh)));f.img.style.transform='translate3d(0,'+((.5-p)*2*f.a*r.height).toFixed(1)+'px,0)';});
    movers.forEach(function(m){var r=m.el.getBoundingClientRect();
      var p=prog({top:r.top-(m._y||0),height:r.height},vh),y=mobile?0:(.5-p)*m.s*vh;m._y=y;
      m.el.style.transform=y?'translate3d(0,'+y.toFixed(1)+'px,0)':'';});
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);req();
})();
