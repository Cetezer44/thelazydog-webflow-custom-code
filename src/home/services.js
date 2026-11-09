/* The Lazy Dog — section services en colonnes (maquette « Services_Hover »).
   [data-services] : la section (épinglée à l'écran le temps de remplir les colonnes) ; [data-services-pin] : le bloc fixé ;
   [data-service] : chaque colonne, avec un remplissage [data-service-fill] qui monte de bas en haut au scroll, l'une après l'autre.
   Le scroll reprend normalement une fois la dernière colonne pleine.
   Au survol d'une colonne (maquette « Services_Hover » du 9 nov.) : les autres colonnes s'effacent, la colonne survolée se remplit
   entièrement et une vidéo courte se lance en boucle en fond de toute la section noire (data-video sur la colonne, sinon data-video
   de la section ; opacité réglable avec data-video-opacity sur la section, défaut 0.15).
   Classes posées : .is-hovering (section), .is-hover (colonne survolée), .is-full (colonne remplie au niveau du titre).
   data-services-step (défaut 0.5) = scroll par colonne, en hauteur d'écran. */
(function(){
  var sec=document.querySelector('[data-services]');if(!sec)return;
  var pin=sec.querySelector('[data-services-pin]'),cols=[].slice.call(sec.querySelectorAll('[data-service]'));if(!pin||!cols.length)return;
  var n=cols.length,STEP=parseFloat(sec.getAttribute('data-services-step'))||.5,def=sec.getAttribute('data-video')||'',ticking=false;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* vidéo de fond, partagée par toutes les colonnes */
  var bg=document.createElement('div');bg.className='tld-services__bg';bg.setAttribute('aria-hidden','true');
  var bv=document.createElement('video');bv.muted=true;bv.loop=true;bv.playsInline=true;bv.preload='none';bv.setAttribute('muted','');bv.setAttribute('playsinline','');
  bg.appendChild(bv);pin.insertBefore(bg,pin.firstChild);
  var op=parseFloat(sec.getAttribute('data-video-opacity'));sec.style.setProperty('--svc-video',isNaN(op)?'.15':String(op));
  var cur=null,OUT='cubic-bezier(.23,1,.32,1)';
  cols.forEach(function(col){
    var f=col.querySelector('[data-service-fill]');if(f){f.style.transformOrigin='50% 100%';f.style.transform='scaleY(0)';f.style.willChange='transform';}
    col._fill=f;col._label=col.querySelector('[data-service-label]');col._src=col.getAttribute('data-video')||def;
    col.addEventListener('pointerenter',function(e){if(e.pointerType==='touch')return;on(col);});
    col.addEventListener('pointerleave',function(e){if(e.pointerType==='touch')return;off(col);});
    col.addEventListener('focus',function(){on(col);});col.addEventListener('blur',function(){off(col);});
  });
  function on(col){
    if(cur&&cur!==col)off(cur,true);cur=col;
    sec.classList.add('is-hovering');col.classList.add('is-hover');
    /* la colonne survolée monte jusqu'en haut (depuis son niveau actuel) */
    if(col._fill&&!reduce){if(col._anim)col._anim.cancel();var from=col._fill.style.transform||'scaleY(0)';
      col._anim=col._fill.animate([{transform:from},{transform:'scaleY(1)'}],{duration:450,easing:OUT,fill:'forwards'});}
    if(col._src){if(bv.getAttribute('src')!==col._src)bv.src=col._src;var p=bv.play();if(p&&p.catch)p.catch(function(){});}
  }
  function off(col,swap){
    col.classList.remove('is-hover');
    if(col._anim){var a=col._anim;col._anim=null;if(reduce)a.cancel();else{a.reverse();a.onfinish=function(){a.cancel();};}}
    if(cur===col)cur=null;
    if(!swap){sec.classList.remove('is-hovering');setTimeout(function(){if(!cur)bv.pause();},600);}
  }
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
