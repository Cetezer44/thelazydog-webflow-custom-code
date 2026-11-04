/* The Lazy Dog — showreel qui grandit au scroll.
   Au départ le showreel est carré (data-grow-from, défaut 350 px) ; en scrollant il s'élargit jusqu'à data-grow-to
   (défaut 0.7 = 70 % de la largeur de l'écran) en prenant le format 16:9 (data-grow-ratio, défaut 16/9).
   La place finale est réservée dès le départ : le reste de la page ne bouge pas pendant l'animation.
   data-grow-snap : depuis le premier écran, un geste de scroll vers le bas emmène directement au showreel en grand
   (et vers le haut, ramène tout en haut). */
(function(){
  var reel=document.querySelector('[data-grow]');if(!reel)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FROM=parseFloat(reel.getAttribute('data-grow-from'))||350,TO=parseFloat(reel.getAttribute('data-grow-to'))||.7;
  var RATIO=(function(r){if(!r)return 16/9;var m=r.split('/');return m.length===2?parseFloat(m[0])/parseFloat(m[1]):parseFloat(r)||16/9;})(reel.getAttribute('data-grow-ratio'));
  var top0=0,vw=0,vh=0,box=0,w0,w1,h1,ticking=false;
  function ease(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;}
  function measure(){
    vw=document.documentElement.clientWidth;vh=window.innerHeight;
    box=reel.parentNode.clientWidth-(parseFloat(getComputedStyle(reel.parentNode).paddingLeft)||0)-(parseFloat(getComputedStyle(reel.parentNode).paddingRight)||0);
    if(!(box>0))box=vw;w1=vw<768?box:Math.min(vw*TO,box);
    h1=w1/RATIO;w0=Math.min(FROM,w1*.7);
    var y=0,el=reel;while(el){y+=el.offsetTop;el=el.offsetParent;}top0=y;
  }
  function endY(){return Math.max(1,top0-(vh-h1)/2);}
  function update(){
    ticking=false;
    var end=Math.max(1,top0-(vh-h1)/2),p=reduce?1:Math.max(0,Math.min(1,(window.pageYOffset||0)/end)),e=ease(p);
    var w=w0+(w1-w0)*e,h=w0+(h1-w0)*e;
    reel.style.width=w.toFixed(1)+'px';reel.style.height=h.toFixed(1)+'px';
    reel.style.marginBottom=(h1-h).toFixed(1)+'px'; /* garde la hauteur finale réservée */
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  function init(){measure();update();}
  init();
  window.addEventListener('scroll',req,{passive:true});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(init,120);});
  window.addEventListener('load',init);
  /* ancre : premier écran <-> showreel */
  if(reel.hasAttribute('data-grow-snap')&&!reduce){
    var anim=null,lock=0;
    function go(to){
      var from=window.pageYOffset||0,t0=null,D=Math.min(1300,Math.max(700,Math.abs(to-from)*1.3));
      if(anim)cancelAnimationFrame(anim);lock=Date.now()+D+250;
      document.documentElement.style.scrollBehavior='auto';
      (function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/D);window.scrollTo(0,from+(to-from)*ease(k));if(k<1)anim=requestAnimationFrame(step);else anim=null;})(performance.now());
    }
    function zone(dir){var y=window.pageYOffset||0,e=endY();if(dir>0&&y<e-4)return e;if(dir<0&&y>2&&y<=e+4)return 0;return null;}
    function intent(dir,ev){if(document.documentElement.classList.contains('tld-loading'))return;
      if(Date.now()<lock){if(zone(dir)!==null||anim){ev&&ev.cancelable&&ev.preventDefault();}return;}
      var to=zone(dir);if(to===null)return;ev&&ev.cancelable&&ev.preventDefault();go(to);}
    window.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)<2||e.ctrlKey)return;intent(e.deltaY>0?1:-1,e);},{passive:false});
    var ty=null;
    window.addEventListener('touchstart',function(e){ty=e.touches[0].clientY;},{passive:true});
    window.addEventListener('touchmove',function(e){if(ty===null)return;var d=ty-e.touches[0].clientY;if(Math.abs(d)<12)return;intent(d>0?1:-1,e);if(anim||Date.now()<lock)ty=null;},{passive:false});
    window.addEventListener('keydown',function(e){var k=e.key,dir=(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey))?1:(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey))?-1:0;
      if(!dir||/input|textarea|select/i.test((e.target&&e.target.tagName)||''))return;intent(dir,e);});
  }
})();
