/* The Lazy Dog — showreel : lecture en boucle (muette), curseur play/pause au survol, clic = lecture/pause */
(function(){
  var reels=[].slice.call(document.querySelectorAll('[data-reel]'));
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  reels.forEach(function(reel){
    var v=reel.querySelector('video'),c=reel.querySelector('.tld-reel__cursor');if(!v)return;
    var src=reel.getAttribute('data-reel-src'),poster=reel.getAttribute('data-reel-poster');
    if(poster)v.poster=poster;
    if(src)v.src=src;
    v.muted=true;v.loop=true;v.playsInline=true;
    var userPaused=reduce; /* mouvement réduit : pas de lecture auto */
    function sync(){var p=v.paused;reel.classList.toggle('is-paused',p);reel.setAttribute('aria-label',p?'Lire le showreel':'Mettre le showreel en pause');}
    function play(){var p=v.play();if(p&&p.catch)p.catch(sync);}
    v.addEventListener('play',sync);v.addEventListener('pause',sync);
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!userPaused)play();}else if(!v.paused){v.pause();}});},{threshold:0.15}).observe(reel);
    }else if(!userPaused){play();}
    function toggle(){if(v.paused){userPaused=false;play();}else{userPaused=true;v.pause();}}
    reel.setAttribute('role','button');reel.tabIndex=0;
    reel.addEventListener('click',toggle);
    reel.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    if(fine&&c){
      var x=0,y=0,raf=null;
      function draw(){raf=null;c.style.transform='translate3d('+x+'px,'+y+'px,0)';}
      reel.addEventListener('pointerenter',function(e){x=e.clientX;y=e.clientY;draw();reel.classList.add('is-hover');});
      reel.addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(draw);});
      reel.addEventListener('pointerleave',function(){reel.classList.remove('is-hover');});
    }
    sync();
  });
})();
