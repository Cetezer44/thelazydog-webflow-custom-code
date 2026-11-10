/* The Lazy Dog — fondus de fond entre sections : le fond de la page (body) prend la couleur de la section au centre de l'écran.
   [data-bg-dark="#0c1016"] : section sombre (ajoute html.tld-dark) ; [data-bg="#f43210"] : section colorée claire.
   [data-bg-cut="nom"] sur deux sections voisines : pas de fondu entre elles (coupure nette). Elles prennent leur propre fond
   tant que l'une des deux est active ; on garde le fondu en entrant ou en sortant du groupe.
   Hors de ces sections, on revient au fond clair d'origine. Les sections concernées doivent avoir un fond transparent. */
(function(){
  var secs=[].slice.call(document.querySelectorAll('[data-bg-dark],[data-bg]'));if(!secs.length)return;
  var root=document.documentElement,body=document.body,light=getComputedStyle(body).backgroundColor,ticking=false,cur=null,FADE=800,timer=null;
  secs=secs.map(function(s){var d=s.hasAttribute('data-bg-dark');return {el:s,dark:d,cut:s.getAttribute('data-bg-cut'),color:(d?s.getAttribute('data-bg-dark'):s.getAttribute('data-bg'))||'#0c1016'};});
  body.style.transition='background-color '+FADE+'ms cubic-bezier(.4,0,.2,1)';
  function solid(group,on){secs.forEach(function(s){if(s.cut&&s.cut===group)s.el.style.backgroundColor=on?s.color:'';});}
  function update(){
    ticking=false;var vh=window.innerHeight,hit=null;
    secs.forEach(function(s){var r=s.el.getBoundingClientRect();if(r.top<vh*.55&&r.bottom>vh*.45)hit=s;});
    if(hit===cur)return;var prev=cur;cur=hit;
    var g=hit&&hit.cut,pg=prev&&prev.cut;
    clearTimeout(timer);
    if(pg&&pg!==g)solid(pg,false);          /* on quitte le groupe : le fondu reprend */
    if(g){if(pg===g)solid(g,true);          /* passage d'une section à l'autre du groupe : coupure nette */
      else timer=setTimeout(function(){if(cur&&cur.cut===g)solid(g,true);},FADE+40);} /* entrée dans le groupe : fondu, puis fonds figés */
    root.classList.toggle('tld-dark',!!(hit&&hit.dark));body.style.backgroundColor=hit?hit.color:light;
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
})();
