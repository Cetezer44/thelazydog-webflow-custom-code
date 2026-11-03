/* The Lazy Dog — œil du header : image changée selon la position du curseur (sprite 22 frames : 11 gauche + 11 droite) */
(function(){
  var eyes=[].slice.call(document.querySelectorAll('[data-eye]'));if(!eyes.length)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mx=null,my=null,raf=null;
  eyes.forEach(function(el){
    el._n=parseInt(el.getAttribute('data-eye-frames'),10)||22;      /* nombre d'images dans le sprite */
    el._range=parseFloat(el.getAttribute('data-eye-range'))||420;   /* distance (px) pour atteindre l'image extrême */
    el._cur=(el._n-1)/2;el._idx=-1;
    var src=el.getAttribute('data-eye-src');if(src)el.style.backgroundImage='url("'+src+'")'; /* sinon : image de fond définie sur la classe .tld-eye dans le Designer */
  });
  function setFrame(el,i){if(i===el._idx)return;el._idx=i;el.style.backgroundPosition=(i/(el._n-1)*100)+'% 0';}
  function tick(){
    raf=null;var busy=false;
    eyes.forEach(function(el){
      var mid=(el._n-1)/2,target=mid;
      if(mx!==null){
        var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
        var dx=mx-cx,dy=my-cy,t=Math.max(-1,Math.min(1,dx/el._range));
        var d=Math.sqrt(dx*dx+dy*dy),k=Math.min(1,Math.max(0,(d-18)/60)); /* zone morte au centre */
        target=mid+(t<0?-1:1)*Math.pow(Math.abs(t),0.8)*k*mid;
      }
      el._cur+=(target-el._cur)*(reduce?1:0.22);
      if(Math.abs(target-el._cur)>0.02)busy=true;
      setFrame(el,Math.round(el._cur));
    });
    if(busy)raf=requestAnimationFrame(tick);
  }
  function kick(){if(!raf)raf=requestAnimationFrame(tick);}
  window.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;kick();},{passive:true});
  document.addEventListener('pointerleave',function(){mx=my=null;kick();});
  window.addEventListener('scroll',kick,{passive:true});
  eyes.forEach(function(el){setFrame(el,Math.round(el._cur));});
})();
