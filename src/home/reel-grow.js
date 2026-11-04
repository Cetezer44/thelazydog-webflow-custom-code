/* The Lazy Dog — showreel qui grandit au scroll.
   Au départ le showreel est carré (data-grow-from, défaut 350 px) ; en scrollant il s'élargit jusqu'à data-grow-to
   (défaut 0.7 = 70 % de la largeur de l'écran) en prenant le format 16:9 (data-grow-ratio, défaut 16/9).
   La place finale est réservée dès le départ : le reste de la page ne bouge pas pendant l'animation.
   data-grow-fill : la section du showreel prend toute la hauteur de l'écran (showreel centré, la section suivante
   commence au bas de l'écran une fois arrivé).
   data-grow-snap : un geste de scroll emmène en douceur d'une ancre à l'autre : premier écran -> showreel en grand ->
   chaque section [data-snap] (et inversement). Plus bas que la dernière ancre, le scroll est normal.
   data-grow-snap-duration : durée du trajet en ms (défaut 1700). */
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
    var extra=reel.hasAttribute('data-grow-fill')?Math.max(0,(vh-h1)/2):0;
    reel.style.marginBottom=(h1-h+extra).toFixed(1)+'px'; /* garde la hauteur finale réservée (+ bas de l'écran si data-grow-fill) */
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  function init(){measure();update();}
  init();
  window.addEventListener('scroll',req,{passive:true});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(init,120);});
  window.addEventListener('load',init);
  /* ancres douces : premier écran -> showreel en grand -> sections [data-snap] (ex. la section jaune), et retour */
  if(reel.hasAttribute('data-grow-snap')&&!reduce){
    var anim=null,lock=0,DUR=parseFloat(reel.getAttribute('data-grow-snap-duration'))||1700;
    function soft(k){return -(Math.cos(Math.PI*k)-1)/2;} /* easeInOutSine : départ et arrivée très doux */
    function docTop(el){var y=0;while(el){y+=el.offsetTop;el=el.offsetParent;}return y;}
    function points(){var pts=[0,endY()];[].forEach.call(document.querySelectorAll('[data-snap]'),function(el){pts.push(docTop(el));});
      return pts.sort(function(a,b){return a-b;});}
    function go(to){
      var from=window.pageYOffset||0,t0=null,D=DUR*Math.min(1,Math.max(.6,Math.abs(to-from)/window.innerHeight));
      if(anim)cancelAnimationFrame(anim);lock=Date.now()+D+400;
      document.documentElement.style.scrollBehavior='auto';
      anim=requestAnimationFrame(function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/D);window.scrollTo(0,Math.round(from+(to-from)*soft(k)));anim=k<1?requestAnimationFrame(step):null;});
    }
    function target(dir){var y=window.pageYOffset||0,pts=points(),last=pts[pts.length-1];
      if(y>last+4)return null; /* plus bas que la dernière ancre : scroll normal */
      if(dir>0){for(var i=0;i<pts.length;i++)if(pts[i]>y+4)return pts[i];return null;}
      for(var j=pts.length-1;j>=0;j--)if(pts[j]<y-4)return pts[j];return null;}
    function intent(dir,ev){if(document.documentElement.classList.contains('tld-loading'))return;
      if(anim||Date.now()<lock){var yy=window.pageYOffset||0,pts=points();if(yy<=pts[pts.length-1]+4&&ev&&ev.cancelable)ev.preventDefault();return;}
      var to=target(dir);if(to===null)return;if(ev&&ev.cancelable)ev.preventDefault();go(to);}
    window.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)<2||e.ctrlKey)return;intent(e.deltaY>0?1:-1,e);},{passive:false});
    var ty=null;
    window.addEventListener('touchstart',function(e){ty=e.touches[0].clientY;},{passive:true});
    window.addEventListener('touchmove',function(e){if(ty===null)return;var d=ty-e.touches[0].clientY;if(Math.abs(d)<12)return;intent(d>0?1:-1,e);if(anim||Date.now()<lock)ty=null;},{passive:false});
    window.addEventListener('keydown',function(e){var k=e.key,dir=(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey))?1:(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey))?-1:0;
      if(!dir||/input|textarea|select/i.test((e.target&&e.target.tagName)||''))return;intent(dir,e);});
  }
})();
