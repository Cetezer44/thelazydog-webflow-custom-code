/* The Lazy Dog — section services en colonnes (maquette « Services_Hover »).
   [data-services] : la section (épinglée à l'écran le temps de remplir les colonnes) ; [data-services-pin] : le bloc fixé ;
   [data-service] : chaque colonne, avec un remplissage [data-service-fill] qui monte de bas en haut au scroll, l'une après l'autre.
   Le scroll reprend normalement une fois la dernière colonne pleine.
   Au survol d'une colonne, une vidéo courte se lance en boucle dans la colonne (data-video sur la colonne,
   sinon data-video de la section). Classes posées : .is-hover (survol), .is-full (colonne remplie au niveau du titre).
   data-services-step (défaut 0.5) = scroll par colonne, en hauteur d'écran. */
(function(){
  var sec=document.querySelector('[data-services]');if(!sec)return;
  var pin=sec.querySelector('[data-services-pin]'),cols=[].slice.call(sec.querySelectorAll('[data-service]'));if(!pin||!cols.length)return;
  var n=cols.length,STEP=parseFloat(sec.getAttribute('data-services-step'))||.5,def=sec.getAttribute('data-video')||'',ticking=false;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cols.forEach(function(col){
    var f=col.querySelector('[data-service-fill]');if(f){f.style.transformOrigin='50% 100%';f.style.transform='scaleY(0)';f.style.willChange='transform';}
    col._fill=f;col._label=col.querySelector('[data-service-label]');
    var src=col.getAttribute('data-video')||def;if(!src)return;
    var box=document.createElement('div');box.className='tld-service__media';box.setAttribute('aria-hidden','true');
    var v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';v.setAttribute('muted','');v.setAttribute('playsinline','');
    box.appendChild(v);col.insertBefore(box,col.firstChild);col._video=v;col._src=src;
    col.addEventListener('pointerenter',function(e){if(e.pointerType==='touch')return;on(col);});
    col.addEventListener('pointerleave',function(e){if(e.pointerType==='touch')return;off(col);});
    col.addEventListener('focus',function(){on(col);});col.addEventListener('blur',function(){off(col);});
  });
  function on(col){var v=col._video;if(!v)return;if(!v.getAttribute('src'))v.src=col._src;col.classList.add('is-hover');var p=v.play();if(p&&p.catch)p.catch(function(){});}
  function off(col){col.classList.remove('is-hover');if(col._video)col._video.pause();}
  function layout(){var vh=window.innerHeight;sec.style.height=(vh+n*STEP*vh)+'px';pin.style.position='sticky';pin.style.top='0px';pin.style.height=vh+'px';update();}
  function update(){
    ticking=false;
    var r=sec.getBoundingClientRect(),vh=window.innerHeight,len=Math.max(1,r.height-vh);
    var t=reduce?1:Math.max(0,Math.min(1,-r.top/len)),x=t*n;
    cols.forEach(function(col,j){var v=Math.max(0,Math.min(1,x-j));
      if(col._fill)col._fill.style.transform='scaleY('+v.toFixed(4)+')';
      if(col._label){var h=col.offsetHeight||1,need=1-(col._label.offsetTop+col._label.offsetHeight*.5)/h;col.classList.toggle('is-full',v>=need);}
    });
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,120);});
  window.addEventListener('load',layout);layout();
})();
