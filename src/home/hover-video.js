/* The Lazy Dog — catégories dans la phrase d'intro : au survol d'une catégorie, une vidéo apparaît en fond (sans transition).
   [data-hover-stage] : le bloc qui reçoit la vidéo ; data-video = vidéo par défaut.
   [data-hover-cat] : chaque catégorie survolable ; data-video facultatif pour une vidéo propre à la catégorie.
   Sans survol, seule la phrase est visible. Classes posées : .is-hover sur le bloc, .is-on sur la catégorie survolée. */
(function(){
  [].forEach.call(document.querySelectorAll('[data-hover-stage]'),function(stage){
    var cats=[].slice.call(stage.querySelectorAll('[data-hover-cat]'));if(!cats.length)return;
    var def=stage.getAttribute('data-video')||'';
    var v=document.createElement('video');v.className='tld-hover-video';v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';
    v.setAttribute('aria-hidden','true');v.setAttribute('muted','');v.setAttribute('playsinline','');
    stage.insertBefore(v,stage.firstChild);
    var active=null,warm=false;
    function warmUp(){if(warm)return;warm=true;var s=def||(cats[0]&&cats[0].getAttribute('data-video'));if(s&&!v.src){v.src=s;v.preload='auto';}}
    /* on précharge la vidéo quand la section approche de l'écran */
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){warmUp();io.disconnect();}},{rootMargin:'400px 0px'});io.observe(stage);}else warmUp();
    function on(cat){
      warmUp();if(active)active.classList.remove('is-on');active=cat;cat.classList.add('is-on');stage.classList.add('is-hover');
      var s=cat.getAttribute('data-video')||def;if(s&&v.getAttribute('src')!==s)v.src=s;
      var p=v.play();if(p&&p.catch)p.catch(function(){});
    }
    function off(cat){if(active!==cat)return;cat.classList.remove('is-on');active=null;stage.classList.remove('is-hover');v.pause();}
    cats.forEach(function(cat){
      cat.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'||e.pointerType==='pen')on(cat);});
      cat.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'||e.pointerType==='pen')off(cat);});
      cat.addEventListener('focus',function(){on(cat);});cat.addEventListener('blur',function(){off(cat);});
    });
  });
})();
