/* The Lazy Dog — curseur personnalisé (étoile), en mode difference : normal / survol (étoile agrandie) / clic (étoile + rayons)
   / projets (pastille jaune + étoile, sur .tld-work ou [data-cursor="projects"]). Désactivé sur écrans tactiles. */
(function(){
  if(!window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  var N='<svg class="c-n" width="36" height="27" viewBox="0 0 36 27" fill="none" aria-hidden="true"><path fill="#fff" d="M20.87 11.33c-.7 0-1.45-1.16-1.74-1.74a30 30 0 0 1-.86-6.1c0-2.1-.58-3.2-.87-3.49-.87 1.16-2.61 4.18-2.61 6.97s-2.61 3.49-3.48 3.49L0 13.08c2.6.58 8.52 1.74 11.3 1.74s3.49 1.74 3.49 2.61l1.74 8.72 1.74-6.97c.7-2.8 2.02-3.49 2.6-3.49l14.79-2.61c-4.93-.59-14.09-1.75-14.79-1.75"/></svg>';
  var R='<svg class="c-r" width="50" height="45" viewBox="0 0 50 45" fill="none" aria-hidden="true"><path fill="#fff" d="M24.29 5.6a.62.62 0 1 0 1.2.36c.05-.23.04-.28.06-.4q.17-1.64.4-3.28c.06-.37-.12-.78-.14-1.14q-.01-.3.02-.6l.02-.27A.3.3 0 0 0 25.8.1a.2.2 0 0 0-.14-.1.2.2 0 0 0-.17.03.3.3 0 0 0-.12.14l-.08.27-.17.62c-.1.37-.35.69-.4 1.05q-.24 1.66-.41 3.32zM23.37 39.24a.68.68 0 0 0 1.37 0v-.12l-.02-.06-.02-.08-.04-.1c-.03-.04-.05-.15-.29-.3a.7.7 0 0 0-.48-.05q-.24.09-.28.15-.13.12-.14.15l-.05.1-.02.07-.02.05v.06c-.03.11-.03.16-.03.23q-.03.4 0 .8a26 26 0 0 0 .38 3.65q.03.15.15.24t.26.08q.15-.02.24-.13.1-.1.1-.26v-.22c0-1.12.1-2.23.19-3.34l.04-.74.01-.09v.03l-.01.03-.03.07-.05.1q0 .03-.13.15-.04.06-.28.15a.7.7 0 0 1-.48-.06c-.24-.14-.26-.25-.3-.29l-.03-.1-.03-.08v-.09q0-.03 0 0M31.99 15.7a.64.64 0 0 0 1.28 0c-.03.28-.06.24-.07.27l-.01.03v-.02l.28-.3-.01.02q.38-.36.78-.7a3 3 0 0 0 .63-.7q.09-.13.1-.3a.4.4 0 0 0-.06-.28.4.4 0 0 0-.25-.16 1 1 0 0 0-.32 0l-.14.04a2 2 0 0 0-.78.42l-.86.77-.37.4-.11.18c-.02.06-.06.03-.09.33M32.1 31.91a.57.57 0 0 0 1.15 0q.01.08-.04.23a.6.6 0 0 1-.28.29c-.24.09-.3.04-.36.04-.1-.02-.1-.04-.13-.05l-.04-.02h.01l.06.06.38.35-.01-.01q1 1.01 2.16 1.89.18.13.4.21l.19.1q.11.04.24.01a.3.3 0 0 0 .2-.12.3.3 0 0 0 .06-.22.4.4 0 0 0-.08-.23l-.14-.16-.28-.32c-.66-.6-1.28-1.3-1.92-1.96h-.01l-.01-.02-.53-.48-.08-.05-.08-.05c-.03-.01-.05-.03-.15-.05-.06 0-.13-.06-.37.04a.6.6 0 0 0-.28.29q-.06.15-.05.23M17.44 29.15a.74.74 0 1 0-1.42-.4l.04-.11-.04.05c-.25.33-.6.7-.92 1.07l.03-.03c-.32.31-.55.76-.87 1.12l-.8.88a.5.5 0 0 0 .03.68q.15.14.35.14a.5.5 0 0 0 .34-.14l.15-.15q.33-.35.67-.64c.35-.3.82-.49 1.17-.84l.03-.03c.34-.37.66-.72 1.01-1.18l.09-.12c.04-.06.06-.06.14-.3M13.42 13.88a.45.45 0 1 0 .9 0c.02.1-.06.29-.17.36-.1.08-.18.08-.22.09h-.11l-.04-.02.02.01.26.15-.06-.04q.47.45.89.94.17.2.5.36l.26.1q.06 0 .1-.02l.07-.08.03-.12v-.16q0-.4-.23-.7-.48-.52-1-1h-.01l-.06-.04q-.16-.1-.36-.21l-.1-.05-.11-.02q-.03-.02-.15 0c-.04 0-.12 0-.23.08a.5.5 0 0 0-.18.37M46.3 22.7a.58.58 0 1 0 .4 1.08c-.04.02 0 0 .03 0 .27-.04.65-.06.99-.09h.01q.4-.04.75-.11c.17-.04.34-.14.54-.22l.13-.05q.08-.03.14-.12a.3.3 0 0 0 .06-.16.3.3 0 0 0-.06-.17.3.3 0 0 0-.14-.12l-.13-.05c-.2-.08-.41-.17-.62-.18l-.76.03c-.35.02-.68.03-1.1.1-.07 0-.11 0-.24.05M4.16 23.7a.58.58 0 0 0 .52-1.03c-.25-.1-.27-.08-.37-.1-.9-.11-1.67-.12-2.5-.14H1.8c-.27 0-.58.14-.83.19l-.38.07-.2.03a.47.47 0 0 0 .17.92q.1 0 .2-.03l.38-.07c.24-.05.44.04.68.04h-.03c.8.02 1.64.04 2.36.13.03 0 .14.04.02-.01"/></svg>';
  var P='<svg class="c-p" width="70" height="70" viewBox="0 0 70 70" fill="none" aria-hidden="true"><rect width="70" height="70" rx="35" fill="#DCEF05"/><path fill="#0C1016" d="M37.5244 33.62C36.9474 33.62 36.3223 32.7 36.0819 32.24C35.8415 31.32 35.3606 29.066 35.3606 27.41C35.3606 25.754 34.8798 24.88 34.6394 24.65C33.9181 25.57 32.4756 27.962 32.4756 30.17C32.4756 32.378 30.3118 32.93 29.5906 32.93L20.2143 35C22.378 35.46 27.2826 36.38 29.5906 36.38C31.8986 36.38 32.4756 37.76 32.4756 38.45L33.9181 45.35L35.3606 39.83C35.9376 37.622 37.0435 37.07 37.5244 37.07L49.7857 35C45.6986 34.54 38.1014 33.62 37.5244 33.62Z"/></svg>';
  var X='<svg class="c-x" width="70" height="70" viewBox="0 0 70 70" fill="none" aria-hidden="true"><rect width="70" height="70" rx="35" fill="#DCEF05"/><path fill="#0C1016" d="M43.0001 28.0249L28.0249 43.0001L27.0001 41.9753L41.9753 27.0001L43.0001 28.0249Z"/><path fill="#0C1016" d="M41.9752 43L27 28.0248L28.0248 27L43 41.9752L41.9752 43Z"/></svg>';
  var st=document.createElement('style');
  st.textContent='html.tld-cur,html.tld-cur *{cursor:none!important}'
   +'.tld-cursor{position:fixed;top:0;left:0;z-index:9999;width:0;height:0;pointer-events:none;mix-blend-mode:difference;transition:opacity .2s ease;will-change:transform}'
   +'.tld-cursor svg{position:absolute;display:block;max-width:none}'
   +'.tld-cursor .c-n{left:-17.83px;top:-13.08px;transform-origin:17.83px 13.08px;transition:transform .3s cubic-bezier(.2,.8,.2,1)}'
   +'.tld-cursor .c-r{left:-25.29px;top:-23.11px;transform-origin:25.29px 23.11px;opacity:0;transform:scale(.6);transition:opacity .15s ease,transform .3s cubic-bezier(.2,.8,.2,1)}'
   +'.tld-cursor.is-hover .c-n{transform:scale(1.39)}'
   +'.tld-cursor.is-active .c-n{transform:scale(1);transition-duration:.12s}'
   +'.tld-cursor.is-active .c-r{opacity:1;transform:scale(1)}'
   +'.tld-cursor .c-p{left:-35px;top:-35px;transform:scale(0);transition:transform .35s cubic-bezier(.34,1.5,.5,1)}'
   +'.tld-cursor.is-projects{mix-blend-mode:normal}'
   +'.tld-cursor.is-projects .c-p{transform:scale(1)}'
   +'.tld-cursor.is-projects .c-n,.tld-cursor.is-projects .c-r{opacity:0}'
   +'.tld-cursor .c-x{left:-35px;top:-35px;transform:scale(0) rotate(-90deg);transition:transform .4s cubic-bezier(.34,1.5,.5,1)}'
   +'.tld-cursor.is-close{mix-blend-mode:normal}'
   +'.tld-cursor.is-close .c-x{transform:none}'
   +'.tld-cursor.is-close .c-n,.tld-cursor.is-close .c-r,.tld-cursor.is-close .c-p{opacity:0}'
   +'.tld-cursor.is-hidden{opacity:0}';
  document.head.appendChild(st);
  var c=document.createElement('div');c.className='tld-cursor is-hidden';c.innerHTML=N+R+P+X;document.body.appendChild(c);
  document.documentElement.classList.add('tld-cur');
  var PROJ='.tld-work,[data-cursor="projects"]',HOVER='a,button,[role="button"],input,select,textarea,label,summary,[data-cursor="hover"]';
  var x=-100,y=-100,raf=null,downAt=0,upT=null;
  function draw(){raf=null;c.style.transform='translate3d('+x+'px,'+y+'px,0)';}
  function state(t){
    var onReel=t&&t.closest('[data-reel]'); /* sur le showreel : le curseur play/pause prend le relais */
    c.classList.toggle('is-hidden',!!onReel);
    var onClose=!!(t&&t.closest('[data-collect-final].is-open'));c.classList.toggle('is-close',onClose);if(onClose){c.classList.remove('is-projects','is-hover');return;}
    var onProj=!onReel&&!!(t&&t.closest(PROJ));
    c.classList.toggle('is-projects',onProj);
    c.classList.toggle('is-hover',!onReel&&!onProj&&!!(t&&t.closest(HOVER)));
  }
  var moved=false;
  window.addEventListener('pointermove',function(e){
    if(e.pointerType&&e.pointerType!=='mouse')return;
    moved=true;x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(draw);
    state(e.target&&e.target.closest?e.target:null);
  },{passive:true});
  /* un script peut demander de réévaluer l'état (ex. ouverture de l'écran final des stickers) */
  window.addEventListener('tld:cursor',function(){if(!moved)return;var t=document.elementFromPoint(x,y);state(t&&t.closest?t:null);});
  /* la page défile sous un curseur immobile (scroll fluide) : on réévalue l'élément survolé */
  var sraf=null;window.addEventListener('scroll',function(){if(!moved||sraf)return;sraf=requestAnimationFrame(function(){sraf=null;var t=document.elementFromPoint(x,y);state(t&&t.closest?t:null);});},{passive:true});
  window.addEventListener('pointerdown',function(e){if(e.pointerType&&e.pointerType!=='mouse')return;clearTimeout(upT);downAt=Date.now();c.classList.add('is-active');});
  window.addEventListener('pointerup',function(){var wait=Math.max(0,260-(Date.now()-downAt));upT=setTimeout(function(){c.classList.remove('is-active');},wait);});
  document.documentElement.addEventListener('pointerleave',function(){c.classList.add('is-hidden');});
  window.addEventListener('blur',function(){c.classList.add('is-hidden');c.classList.remove('is-active');});
})();
