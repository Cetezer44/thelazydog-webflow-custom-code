/* The Lazy Dog — Accueil v2 : entrée de la page et apparitions au scroll.
   Hero : les lignes du titre (.v2-line__in) montent derrière leur masque (élément principal), les repères de grille (.v2-guides i)
   se dessinent en même temps (décor), puis le header et les textes [data-v2-fade] arrivent (support).
   Ailleurs : [data-v2-split] (titre d'une ligne) monte par un masque, [data-v2-fade] apparaît en fondu + 12 px, à l'entrée dans l'écran. */
(function(){
  var V=window.tldV2;if(!V)return;
  var root=document.documentElement,E=V.E;
  root.classList.add('v2-js');
  /* titres d'une ligne : on ajoute le masque */
  [].forEach.call(document.querySelectorAll('[data-v2-split]'),function(el){
    var html=el.innerHTML;el.innerHTML='<span class="v2-line"><span class="v2-line__in">'+html+'</span></span>';
  });
  var hero=document.querySelector('.v2-hero');
  function rise(el,delay,dur){return el.animate([{transform:'translateY(105%)'},{transform:'translateY(0)'}],{duration:dur||1000,delay:delay||0,easing:E.expo,fill:'backwards'});}
  function fade(el,delay,dist){el.style.opacity='1';
    if(V.reduce){el.animate([{opacity:0},{opacity:1}],{duration:300,fill:'backwards'});return;}
    el.animate([{opacity:0,transform:'translateY('+(dist||12)+'px)'},{opacity:1,transform:'none'}],{duration:800,delay:delay||0,easing:E.out,fill:'backwards'});}
  /* avant l'entrée, tout ce qui va bouger est masqué (pas de « flash ») */
  var heroLines=hero?[].slice.call(hero.querySelectorAll('.v2-line__in')):[];
  heroLines.forEach(function(el){el.style.transform='translateY(105%)';});
  V.ready(function(){
    if(!hero)return;
    var guides=[].slice.call(hero.querySelectorAll('.v2-guides i'));
    /* lead : les lignes du titre, en vague (110 ms puis 90 ms) */
    heroLines.forEach(function(el,i){el.style.transform='';if(!V.reduce)rise(el,i===0?0:110+(i-1)*90,1100);});
    /* décor : la grille se dessine depuis le haut, du centre vers les bords, en même temps que le titre */
    var mid=(guides.length-1)/2;
    guides.forEach(function(g,i){g.style.transform='';if(V.reduce)return;
      g.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{duration:1400,delay:Math.abs(i-mid)*70,easing:E.io,fill:'backwards'});});
    /* support : le header (porté d'un bloc) et les textes du hero */
    var head=document.querySelector('[data-v2-head]');
    if(head&&!V.reduce)head.animate([{opacity:0,transform:'translateY(-12px)'},{opacity:1,transform:'none'}],{duration:800,delay:180,easing:E.out,fill:'backwards'});
    [].forEach.call(hero.querySelectorAll('[data-v2-fade]'),function(el,i){fade(el,320+i*70,10);});
  });
  /* le reste de la page, à l'entrée dans l'écran */
  var outside=function(el){return !hero||!hero.contains(el);};
  var fades=[].filter.call(document.querySelectorAll('[data-v2-fade]'),outside);
  fades.forEach(function(el){el.style.opacity='0';});
  V.inView(fades,function(el){fade(el,0,12);});
  var lines=[].filter.call(document.querySelectorAll('[data-v2-split] .v2-line__in'),outside);
  lines.forEach(function(el){if(!V.reduce)el.style.transform='translateY(105%)';});
  V.inView(lines.map(function(l){return l.parentNode;}),function(m){var el=m.firstChild;el.style.transform='';if(!V.reduce)rise(el,0,1100);});
})();
