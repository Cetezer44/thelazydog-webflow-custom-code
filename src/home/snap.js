/* The Lazy Dog — ancres de scroll douces entre les sections.
   Chaque section [data-snap] est une ancre : depuis la section précédente, un geste de scroll vers le bas emmène en douceur
   en haut de cette section (et un geste vers le haut ramène à la précédente). Le premier écran (haut de page) est l'ancre de départ.
   Une section plus haute que l'écran (ex. projets épinglés) se scrolle normalement jusqu'à sa fin, puis l'ancre suivante prend le relais.
   Réglage sur <body> ou sur la première ancre : data-snap-duration (ms, défaut 1700). L'inertie du trackpad est ignorée. */
(function(){
  var secs=[].slice.call(document.querySelectorAll('[data-snap]'));if(!secs.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var root=document.documentElement,DUR=parseFloat(document.body.getAttribute('data-snap-duration')||secs[0].getAttribute('data-snap-duration'))||1700;
  var anim=null,lock=0,fresh=true,lastW=0;
  function soft(k){return -(Math.cos(Math.PI*k)-1)/2;} /* easeInOutSine */
  function docTop(el){var y=0;while(el){y+=el.offsetTop;el=el.offsetParent;}return y;}
  /* zones de saut : [fin de la section précédente, haut de la section suivante] */
  function zones(){
    var vh=window.innerHeight,z=[],prev=0;
    secs.forEach(function(el){var t=docTop(el);if(t>prev+8)z.push([prev,t]);prev=t+Math.max(0,el.offsetHeight-vh);});
    return z;
  }
  function target(dir){
    var y=window.pageYOffset||0,z=zones();
    for(var i=0;i<z.length;i++){var a=z[i][0],b=z[i][1];
      if(dir>0&&y>=a-4&&y<b-4)return b;
      if(dir<0&&y>a+4&&y<=b+4)return a;}
    return null;
  }
  function inZone(){var y=window.pageYOffset||0,z=zones();for(var i=0;i<z.length;i++)if(y>=z[i][0]-4&&y<=z[i][1]+4)return true;return false;}
  function go(to){
    var from=window.pageYOffset||0,t0=null,D=DUR*Math.min(1,Math.max(.6,Math.abs(to-from)/window.innerHeight));
    if(anim)cancelAnimationFrame(anim);lock=Date.now()+D;fresh=false;root.style.scrollBehavior='auto';
    anim=requestAnimationFrame(function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/D);window.scrollTo(0,from+(to-from)*soft(k));
      if(k<1)anim=requestAnimationFrame(step);else{anim=null;window.scrollTo(0,to);}});
  }
  function intent(dir,ev,isWheel){
    if(root.classList.contains('tld-loading'))return;
    var now=Date.now(),gap=now-lastW;if(isWheel)lastW=now;
    if(anim||now<lock){if(inZone()&&ev&&ev.cancelable)ev.preventDefault();return;}
    if(isWheel&&!fresh){if(gap<220){if(inZone()&&ev&&ev.cancelable)ev.preventDefault();return;}fresh=true;}
    var to=target(dir);if(to===null)return;if(ev&&ev.cancelable)ev.preventDefault();go(to);
  }
  window.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)<2||e.ctrlKey)return;intent(e.deltaY>0?1:-1,e,true);},{passive:false});
  var ty=null;
  window.addEventListener('touchstart',function(e){ty=e.touches[0].clientY;fresh=true;},{passive:true});
  window.addEventListener('touchmove',function(e){if(ty===null)return;var d=ty-e.touches[0].clientY;if(Math.abs(d)<12)return;intent(d>0?1:-1,e);if(anim||Date.now()<lock)ty=null;},{passive:false});
  window.addEventListener('keydown',function(e){var k=e.key,dir=(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey))?1:(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey))?-1:0;
    if(!dir||/input|textarea|select/i.test((e.target&&e.target.tagName)||''))return;intent(dir,e);});
})();
