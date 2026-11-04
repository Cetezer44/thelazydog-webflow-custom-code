/* The Lazy Dog — projets qui défilent au scroll.
   [data-projects] : la section ; [data-projects-pin] : le bloc épinglé à l'écran ; [data-col] : les colonnes du fond (4) ;
   les projets sont les éléments .w-dyn-item (ou [data-project]) de la section. En scrollant, la colonne du projet en cours
   se remplit de bas en haut ; quand elle est pleine, on passe au projet suivant (et à la colonne suivante).
   data-projects-step (défaut 0.8) = scroll par projet, en hauteur d'écran. Classe .is-active sur le projet affiché. */
(function(){
  var sec=document.querySelector('[data-projects]');if(!sec)return;
  var pin=sec.querySelector('[data-projects-pin]'),items=[].slice.call(sec.querySelectorAll('[data-project],.w-dyn-item'));
  var cols=[].slice.call(sec.querySelectorAll('[data-col]')).map(function(c){return c.firstElementChild||c;});
  if(!pin||!items.length)return;
  var n=items.length,C=cols.length||1,STEP=parseFloat(sec.getAttribute('data-projects-step'))||.8,cur=-1,ticking=false;
  cols.forEach(function(f){f.style.transformOrigin='50% 100%';f.style.transform='scaleY(0)';f.style.willChange='transform';});
  function layout(){var vh=window.innerHeight;sec.style.height=(vh+n*STEP*vh)+'px';pin.style.position='sticky';pin.style.top='0px';pin.style.height=vh+'px';update();}
  function set(i){if(i===cur)return;cur=i;items.forEach(function(it,j){it.classList.toggle('is-active',j===i);it.setAttribute('aria-hidden',j===i?'false':'true');});}
  function update(){
    ticking=false;
    var r=sec.getBoundingClientRect(),vh=window.innerHeight,len=Math.max(1,r.height-vh);
    var t=Math.max(0,Math.min(.99999,-r.top/len)),x=t*n,i=Math.floor(x),local=x-i;
    set(i);
    var c=i%C; /* colonnes du « tour » en cours : pleines avant, en cours, vides après */
    cols.forEach(function(f,j){var v=j<c?1:j===c?local:0;f.style.transform='scaleY('+v.toFixed(4)+')';});
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,120);});
  window.addEventListener('load',layout);layout();
})();
