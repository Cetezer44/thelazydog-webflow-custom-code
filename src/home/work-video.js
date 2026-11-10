/* The Lazy Dog — vidéos des projets.
   .tld-work__media[data-video="https://…mp4"] (champ CMS « Vidéo » de la collection Projets) : l'image de couverture est
   remplacée par la vidéo, muette et en boucle, avec l'image en poster. La vidéo ne se charge qu'à l'approche de l'écran
   et se met en pause quand elle en sort (économie de bande passante). Pas de parallax sur ces vignettes ([data-parallax-off]).
   Sans lien vidéo, l'image reste. À charger avant parallax.js. */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vids=[].slice.call(document.querySelectorAll('.tld-work__media[data-video]')).map(function(m){
    var src=(m.getAttribute('data-video')||'').trim();if(!src)return null;
    var img=null;[].some.call(m.querySelectorAll('img'),function(i){if(!i.closest('.tld-work__hover')){img=i;return true;}});
    var v=document.createElement('video');
    v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';
    v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('loop','');v.setAttribute('aria-hidden','true');
    if(img){v.className=img.className+' tld-work__video';v.poster=img.currentSrc||img.src;img.parentNode.insertBefore(v,img);img.parentNode.removeChild(img);}
    else{v.className='tld-work__img tld-work__video';m.insertBefore(v,m.firstChild);}
    /* vidéo calée en cover sur tout le cadre (sans parallax : le cadre garde son ratio, la vidéo le remplit) */
    if(getComputedStyle(m).position==='static')m.style.position='relative';m.style.overflow='hidden';
    m.setAttribute('data-parallax-off','');
    v.style.cssText+=';position:absolute;top:0;left:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:50% 50%;display:block;transform:none';
    v._src=src;return v;
  }).filter(Boolean);
  if(!vids.length)return;
  function load(v){if(!v.src){v.src=v._src;}}
  function play(v){load(v);if(reduce)return;var p=v.play();if(p&&p.catch)p.catch(function(){});}
  if(!('IntersectionObserver' in window)){vids.forEach(play);return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)play(e.target);else if(e.target.src)e.target.pause();});},{rootMargin:'300px 0px'});
  vids.forEach(function(v){io.observe(v);});
})();
