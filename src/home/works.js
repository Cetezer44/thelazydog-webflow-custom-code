/* The Lazy Dog — projets de la page d'accueil : au survol, le nom du projet défile à l'infini dans l'image (avec un filtre sombre).
   Le nom est lu dans .tld-work__title (champ CMS, masqué à l'écran) ; le bandeau est créé dans .tld-work__media.
   data-marquee-speed sur .tld-work (px/s, défaut 90). Le curseur « projets » est géré par global.js. */
(function(){
  var cards=[].slice.call(document.querySelectorAll('.tld-work'));if(!cards.length)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st=document.createElement('style');
  st.textContent='@keyframes tld-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}';
  document.head.appendChild(st);
  function seg(name){var s=document.createElement('span');s.className='tld-work__seg';var t=document.createElement('span');t.textContent=name;var i=document.createElement('span');i.className='tld-work__sep';s.appendChild(t);s.appendChild(i);return s;}
  cards.forEach(function(card){
    var media=card.querySelector('.tld-work__media'),title=card.querySelector('.tld-work__title');if(!media||!title)return;
    var name=(title.textContent||'').trim();if(!name)return;
    if(!card.getAttribute('aria-label'))card.setAttribute('aria-label',name);
    var hov=document.createElement('div');hov.className='tld-work__hover';hov.setAttribute('aria-hidden','true');
    var track=document.createElement('div');track.className='tld-work__track';hov.appendChild(track);media.appendChild(hov);
    var speed=parseFloat(card.getAttribute('data-marquee-speed'))||90;
    function build(){ /* deux moitiés identiques, chacune au moins aussi large que l'image : la boucle est invisible */
      track.textContent='';var half=document.createElement('div');half.className='tld-work__half';track.appendChild(half);
      half.appendChild(seg(name));var w=half.scrollWidth||1,need=media.offsetWidth+w,guard=0;
      while(half.scrollWidth<need&&guard++<40)half.appendChild(seg(name));
      track.appendChild(half.cloneNode(true));
      track.style.animation=reduce?'none':'tld-marquee '+(half.scrollWidth/speed).toFixed(2)+'s linear infinite';
    }
    card._build=build;
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(build);else build();
  });
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){cards.forEach(function(c){c._build&&c._build();});},200);});
})();
