/* The Lazy Dog — section « fond qui se construit » (section jaune de la page d'accueil).
   [data-build] : quand la section arrive à l'écran, son fond [data-build-bg] se construit de bas en haut,
   puis le texte [data-words][data-words-wait] s'écrit mot par mot.
   Au survol d'une catégorie [data-hover-cat] (attribut data-image = image de la catégorie), le fond devient cette image,
   sans transition ; sans survol, seul le fond de couleur et la phrase restent. Classes : .is-hover / .is-on. */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(document.querySelectorAll('[data-build]'),function(sec){
    var bg=sec.querySelector('[data-build-bg]'),words=sec.querySelector('[data-words-wait]');
    var D=parseFloat(sec.getAttribute('data-build-duration'))||900;
    function go(){
      if(sec._built)return;sec._built=true;
      if(bg&&!reduce){bg.style.transition='transform '+D+'ms cubic-bezier(.77,0,.18,1)';bg.style.transform='scaleY(1)';}
      setTimeout(function(){if(words)words.dispatchEvent(new CustomEvent('tld:words'));},reduce?0:D*.85);
    }
    if(bg&&!reduce){bg.style.transformOrigin='50% 100%';bg.style.transform='scaleY(0)';}
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){go();io.disconnect();}},{threshold:.35});io.observe(sec);}else go();
    /* images au survol des catégories */
    var cats=[].slice.call(sec.querySelectorAll('[data-hover-cat]'));if(!cats.length)return;
    var layer=document.createElement('div');layer.className='tld-hover-media';layer.setAttribute('aria-hidden','true');
    sec.insertBefore(layer,bg?bg.nextSibling:sec.firstChild);
    var imgs={},active=null;
    cats.forEach(function(cat){var u=cat.getAttribute('data-image');if(!u||imgs[u])return;
      var im=document.createElement('img');im.alt='';im.decoding='async';im.loading='lazy';im.src=u;layer.appendChild(im);imgs[u]=im;});
    function on(cat){if(active)active.classList.remove('is-on');active=cat;cat.classList.add('is-on');sec.classList.add('is-hover');
      var u=cat.getAttribute('data-image');for(var k in imgs)imgs[k].classList.toggle('is-on',k===u);}
    function off(cat){if(active!==cat)return;cat.classList.remove('is-on');active=null;sec.classList.remove('is-hover');for(var k in imgs)imgs[k].classList.remove('is-on');}
    cats.forEach(function(cat){
      cat.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')on(cat);});
      cat.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch')off(cat);});
      cat.addEventListener('focus',function(){on(cat);});cat.addEventListener('blur',function(){off(cat);});
    });
  });
})();
