/* The Lazy Dog — passage à la section noire : le fond de la page fond vers le noir quand [data-bg-dark] arrive à l'écran.
   La couleur sombre se règle avec data-bg-dark="#0c1016" (défaut). Les sections avant/pendant doivent avoir un fond transparent.
   Classe html.tld-dark pendant la phase sombre (pour adapter des couleurs en CSS si besoin). */
(function(){
  var secs=[].slice.call(document.querySelectorAll('[data-bg-dark]'));if(!secs.length)return;
  var root=document.documentElement,body=document.body,light=getComputedStyle(body).backgroundColor,ticking=false,on=null;
  var dark=secs[0].getAttribute('data-bg-dark')||'#0c1016';
  body.style.transition='background-color .9s cubic-bezier(.4,0,.2,1)';
  function update(){
    ticking=false;var vh=window.innerHeight,inside=false;
    secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<vh*.55&&r.bottom>vh*.45)inside=true;});
    if(inside===on)return;on=inside;
    root.classList.toggle('tld-dark',inside);body.style.backgroundColor=inside?dark:light;
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
})();
