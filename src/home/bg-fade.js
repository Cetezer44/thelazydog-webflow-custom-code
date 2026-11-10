/* The Lazy Dog — fondus de fond entre sections : le fond de la page (body) prend la couleur de la section au centre de l'écran.
   [data-bg-dark="#0c1016"] : section sombre (ajoute html.tld-dark) ; [data-bg="#f43210"] : section colorée claire.
   Hors de ces sections, on revient au fond clair d'origine. Les sections concernées doivent avoir un fond transparent. */
(function(){
  var secs=[].slice.call(document.querySelectorAll('[data-bg-dark],[data-bg]'));if(!secs.length)return;
  var root=document.documentElement,body=document.body,light=getComputedStyle(body).backgroundColor,ticking=false,cur=null;
  secs=secs.map(function(s){var d=s.hasAttribute('data-bg-dark');return {el:s,dark:d,color:(d?s.getAttribute('data-bg-dark'):s.getAttribute('data-bg'))||'#0c1016'};});
  body.style.transition='background-color .8s cubic-bezier(.4,0,.2,1)';
  function update(){
    ticking=false;var vh=window.innerHeight,hit=null;
    secs.forEach(function(s){var r=s.el.getBoundingClientRect();if(r.top<vh*.55&&r.bottom>vh*.45)hit=s;});
    if(hit===cur)return;cur=hit;
    root.classList.toggle('tld-dark',!!(hit&&hit.dark));body.style.backgroundColor=hit?hit.color:light;
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
})();
