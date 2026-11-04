/* The Lazy Dog — showreel qui grandit au scroll.
   Au départ le showreel est carré (data-grow-from, défaut 350 px) ; en scrollant il s'élargit jusqu'à data-grow-to
   (défaut 0.7 = 70 % de la largeur de l'écran) en prenant le format 16:9 (data-grow-ratio, défaut 16/9).
   La place finale est réservée dès le départ : le reste de la page ne bouge pas pendant l'animation.
   data-grow-fill : la section du showreel prend toute la hauteur de l'écran (showreel centré, la section suivante
   commence au bas de l'écran une fois arrivé).
   (Les ancres de scroll sont gérées par snap.js.) */
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
})();
