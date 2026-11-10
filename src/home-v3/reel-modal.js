/* The Lazy Dog — showreel en grand (v3).
   Clic sur la vignette du hero : la vidéo s'agrandit depuis la vignette jusqu'au centre de l'écran, sur un fond noir à 80 %.
   Vidéo en boucle, sans contrôles. Survol de la vidéo : curseur play / pause selon l'état (clic = lecture / pause).
   Survol du fond : curseur croix (clic = fermer). Échap ferme aussi, Espace met en pause. */
(function(){
  var reel=document.querySelector('.tld-hero .tld-reel[data-reel]')||document.querySelector('.tld-reel[data-reel]');if(!reel)return;
  var src=reel.getAttribute('data-reel-src');if(!src)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,EASE='cubic-bezier(.16,1,.3,1)';
  reel.setAttribute('data-reel-modal','');reel.setAttribute('data-cursor','hover');reel.setAttribute('role','button');reel.setAttribute('tabindex','0');
  reel.setAttribute('aria-label','Voir le showreel en grand');
  var ov=document.createElement('div');ov.className='tld-reelbox';ov.setAttribute('data-cursor','close');ov.setAttribute('role','dialog');
  ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Showreel The Lazy Dog');ov.hidden=true;
  var v=document.createElement('video');v.className='tld-reelbox__video';v.loop=true;v.playsInline=true;v.preload='none';
  v.setAttribute('playsinline','');v.setAttribute('loop','');v.setAttribute('data-cursor','pause');v.setAttribute('aria-label','Showreel (clic : lecture / pause)');
  ov.appendChild(v);document.body.appendChild(ov);
  var isOpen=false,busy=null;
  function fit(){var vw=window.innerWidth,vh=window.innerHeight,w=Math.min(vw*.82,1500),h=w*9/16;if(h>vh*.8){h=vh*.8;w=h*16/9;}
    return {w:w,h:h,l:(vw-w)/2,t:(vh-h)/2};}
  function layout(){var r=fit();v.style.width=r.w+'px';v.style.height=r.h+'px';v.style.left=r.l+'px';v.style.top=r.t+'px';}
  function cur(){v.setAttribute('data-cursor',v.paused?'play':'pause');window.dispatchEvent(new Event('tld:cursor'));}
  function fromThumb(){var a=reel.getBoundingClientRect(),b=v.getBoundingClientRect();
    return 'translate('+(a.left-b.left)+'px,'+(a.top-b.top)+'px) scale('+(a.width/b.width)+','+(a.height/b.height)+')';}
  function open(){
    if(isOpen)return;isOpen=true;if(busy)busy.cancel();
    layout();if(!v.getAttribute('src'))v.src=src;
    var thumb=reel.querySelector('video');try{if(thumb&&thumb.currentTime&&!isNaN(thumb.currentTime))v.currentTime=thumb.currentTime;}catch(e){}
    ov.hidden=false;document.documentElement.classList.add('tld-reelbox-open');if(window.tldLenis)window.tldLenis.stop();
    v.muted=false;var p=v.play();if(p&&p.catch)p.catch(function(){v.muted=true;var q=v.play();if(q&&q.catch)q.catch(function(){});}); /* son si le navigateur l'autorise */
    if(!reduce){ov.animate([{backgroundColor:'rgba(0,0,0,0)'},{backgroundColor:'rgba(0,0,0,.8)'}],{duration:450,easing:'ease'});
      v.animate([{transform:fromThumb()},{transform:'none'}],{duration:800,easing:EASE});}
    cur();ov.focus&&ov.setAttribute('tabindex','-1');ov.focus({preventScroll:true});
  }
  function close(){
    if(!isOpen)return;isOpen=false;
    var done=function(){ov.hidden=true;v.pause();document.documentElement.classList.remove('tld-reelbox-open');if(window.tldLenis)window.tldLenis.start();
      busy=null;window.dispatchEvent(new Event('tld:cursor'));reel.focus({preventScroll:true});};
    if(reduce){done();return;}
    ov.animate([{backgroundColor:'rgba(0,0,0,.8)'},{backgroundColor:'rgba(0,0,0,0)'}],{duration:450,easing:'ease',fill:'forwards'});
    busy=v.animate([{transform:'none'},{transform:fromThumb()}],{duration:650,easing:'cubic-bezier(.7,0,.2,1)',fill:'forwards'});
    busy.onfinish=function(){busy.cancel();ov.getAnimations().forEach(function(a){a.cancel();});done();};
  }
  function toggle(){if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();}
  /* la vignette ne met plus en pause au clic (showreel.js) : elle ouvre la modale */
  reel.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();open();},true);
  reel.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  v.addEventListener('click',function(e){e.stopPropagation();toggle();});
  v.addEventListener('play',cur);v.addEventListener('pause',cur);
  ov.addEventListener('click',function(e){if(e.target===ov)close();});
  window.addEventListener('keydown',function(e){if(!isOpen)return;if(e.key==='Escape'){e.preventDefault();close();}else if(e.key===' '){e.preventDefault();toggle();}});
  window.addEventListener('resize',function(){if(isOpen)layout();});
})();
