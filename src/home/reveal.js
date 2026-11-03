/* The Lazy Dog — apparition des projets par un masque de haut en bas.
   Chaque visuel .tld-work__media (ou tout élément [data-reveal]) se dévoile du haut vers le bas quand il entre dans l'écran ;
   le titre du projet (.tld-work__title) apparaît juste après. Réglage facultatif : data-reveal-duration (ms, défaut 1100). */
(function(){
  var els=[].slice.call(document.querySelectorAll('.tld-work__media,[data-reveal]'));if(!els.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  var EASE='cubic-bezier(.77,0,.18,1)';
  els.forEach(function(el){
    var d=parseFloat(el.getAttribute('data-reveal-duration'))||1100;
    el.style.clipPath='inset(0 0 100% 0)';el.style.webkitClipPath='inset(0 0 100% 0)';
    el.style.transition='clip-path '+d+'ms '+EASE+',-webkit-clip-path '+d+'ms '+EASE;
    var card=el.closest('.tld-work'),t=card&&card.querySelector('.tld-work__title');
    if(t){t.style.opacity=0;t.style.transform='translateY(10px)';t.style.transition='opacity 600ms ease '+(d*.55)+'ms,transform 600ms ease '+(d*.55)+'ms';el._title=t;}
  });
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
    el.style.clipPath='inset(0 0 0 0)';el.style.webkitClipPath='inset(0 0 0 0)';
    if(el._title){el._title.style.opacity=1;el._title.style.transform='none';}
  });},{rootMargin:'0px 0px -10% 0px',threshold:0});
  els.forEach(function(el){io.observe(el);});
})();
