/* The Lazy Dog — Accueil v2 : outils partagés (courbes, apparition au scroll, bulle qui suit le curseur, fin du loader). */
(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var E={out:'cubic-bezier(.23,1,.32,1)',io:'cubic-bezier(.77,0,.175,1)',expo:'cubic-bezier(.16,1,.3,1)'};
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  /* une seule fois, quand l'élément entre dans l'écran */
  function inView(els,fn,margin){
    els=[].slice.call(els||[]);if(!els.length)return;
    if(!('IntersectionObserver' in window)){els.forEach(fn);return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target);}});},{rootMargin:margin||'0px 0px -12% 0px'});
    els.forEach(function(el){io.observe(el);});
  }
  /* la page est prête quand le loader a fini (ou tout de suite s'il n'y en a pas) */
  function ready(fn){
    if(window.tldLoaded||!root.classList.contains('tld-loading')||!document.querySelector('.tld-loader')){fn();return;}
    window.addEventListener('tld:loaded',function h(){window.removeEventListener('tld:loaded',h);fn();});
  }
  /* bulle de texte qui suit le curseur (copier l'email, lecture/pause…) */
  var tip=null,tx=-999,ty=-999,traf=null;
  function tipEl(){if(!tip){tip=document.createElement('div');tip.className='v2-toast';tip.setAttribute('aria-hidden','true');document.body.appendChild(tip);
    window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!traf)traf=requestAnimationFrame(function(){traf=null;tip.style.transform='translate3d('+(tx+18)+'px,'+(ty+18)+'px,0)';});},{passive:true});}return tip;}
  function toast(text){if(!fine)return;var t=tipEl();if(text===null){t.classList.remove('is-on');return;}t.textContent=text;t.classList.add('is-on');}
  /* Webflow transforme les <button> en liens sans href : on leur rend un comportement de bouton (clavier, pas de saut en haut de page) */
  [].forEach.call(document.querySelectorAll('.v2-page a[type="button"]'),function(a){
    a.setAttribute('role','button');if(!a.hasAttribute('tabindex'))a.tabIndex=0;
    a.addEventListener('click',function(e){e.preventDefault();});
    a.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();a.click();}});
  });
  window.tldV2={reduce:reduce,fine:fine,E:E,clamp:clamp,inView:inView,ready:ready,toast:toast};
})();
