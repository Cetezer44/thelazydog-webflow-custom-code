/* The Lazy Dog — Accueil v2 : services en accordéon ([data-v2-acc]).
   .v2-acc__item > button.v2-acc__head + .v2-acc__panel > .v2-acc__inner (.v2-acc__media accueille la vidéo).
   Un seul service ouvert à la fois ; la vidéo (data-video sur l'item, ou sur [data-v2-acc]) ne se charge qu'à l'ouverture. */
(function(){
  var V=window.tldV2,acc=document.querySelector('[data-v2-acc]');if(!V||!acc)return;
  var items=[].slice.call(acc.querySelectorAll('.v2-acc__item'));
  function panel(it){return it.querySelector('.v2-acc__panel');}
  function video(it){var m=it.querySelector('.v2-acc__media');if(!m)return null;var v=m.querySelector('video');
    if(!v){var src=it.getAttribute('data-video')||acc.getAttribute('data-video');if(!src)return null;v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='metadata';v.src=src;m.appendChild(v);}return v;}
  function set(it,open){
    var p=panel(it),h=it.querySelector('.v2-acc__head');if(!p||!h)return;
    it.classList.toggle('is-open',open);h.setAttribute('aria-expanded',open?'true':'false');
    var inner=p.firstElementChild,target=open&&inner?inner.offsetHeight:0;
    if(V.reduce){p.style.transition='none';}
    p.style.height=target+'px';
    var v=video(it);if(v){if(open){var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}else v.pause();}
  }
  items.forEach(function(it,i){
    var h=it.querySelector('.v2-acc__head'),p=panel(it);if(!h||!p)return;
    var id='v2-acc-'+i;p.id=id;h.setAttribute('aria-controls',id);h.setAttribute('aria-expanded','false');
    h.addEventListener('click',function(){var open=!it.classList.contains('is-open');items.forEach(function(o){if(o!==it&&o.classList.contains('is-open'))set(o,false);});set(it,open);});
  });
  window.addEventListener('resize',function(){items.forEach(function(it){if(it.classList.contains('is-open')){var p=panel(it);p.style.height=p.firstElementChild.offsetHeight+'px';}});});
})();
