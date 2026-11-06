/* The Lazy Dog — scroll fluide (Lenis, inclus dans ce bundle). Désactivé si l'utilisateur préfère réduire les animations
   et sur les écrans tactiles (le scroll natif y est déjà fluide). Les autres scripts peuvent l'arrêter avec window.tldLenis.stop(). */
(function(){
  if(typeof window.Lenis!=='function')return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var st=document.createElement('style');
  st.textContent='html.lenis,html.lenis body{height:auto}.lenis:not(.lenis-autoToggle).lenis-stopped{overflow:clip}.lenis [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-smooth iframe{pointer-events:none}html.lenis{scroll-behavior:auto!important}';
  document.head.appendChild(st);
  var lenis=new window.Lenis({lerp:.09,wheelMultiplier:1,smoothWheel:true,syncTouch:false,anchors:true,autoRaf:true});
  window.tldLenis=lenis;
  /* le loader et l'écran final des stickers bloquent le scroll */
  var root=document.documentElement;
  function sync(){var lock=root.classList.contains('tld-loading')||root.classList.contains('tld-collect-open');if(lock)lenis.stop();else lenis.start();}
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['class']});sync();
  window.addEventListener('load',function(){lenis.resize();});
})();
