/* The Lazy Dog — Accueil v3 : couche d'animations supplémentaire au-dessus de la v1.
   Choix guidés par les skills d'animation (fréquence, but, budget, GPU, accessibilité) :
   - Textes [data-v3-lines] ou listés ci-dessous : apparition ligne par ligne derrière un masque (élément principal de chaque section).
   - Projets : l'image se « pose » (scale 1.18 → 1) pendant le dévoilement du cadre ; les cartes s'inclinent légèrement selon la vitesse de scroll.
   - Stickers à collectionner : flottent doucement ; le sticker du hero se trémousse de temps en temps tant que rien n'est collectionné.
   - Services : l'étoile tourne quand la colonne est remplie (CSS) ; les titres des colonnes montent à l'arrivée de la section.
   - Footer : le logotype monte lettre par lettre en vague ; au survol, chaque lettre saute (l'œil tourne).
   - Liens : survol « roulant » (le texte est doublé et glisse) sur la nav et le footer.
   Tout est coupé avec prefers-reduced-motion (sauf les fondus), et les survols sont réservés aux souris. */
(function(){
  var root=document.documentElement;root.classList.add('v3');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var EXPO='cubic-bezier(.16,1,.3,1)',OUT='cubic-bezier(.23,1,.32,1)';
  function inView(els,fn,margin){els=[].slice.call(els||[]);if(!els.length)return;
    if(!('IntersectionObserver' in window)){els.forEach(fn);return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target);}});},{rootMargin:margin||'0px 0px -10% 0px'});
    els.forEach(function(el){io.observe(el);});}
  function ready(fn){if(!root.classList.contains('tld-loading')){fn();return;}
    window.addEventListener('tld:loaded',function h(){window.removeEventListener('tld:loaded',h);fn();});setTimeout(fn,9000);}

  /* 1. Lignes derrière un masque ------------------------------------------------------------- */
  var LINE_SEL='[data-v3-lines],.tld-works__text,.tld-services__text,.tld-news__title,.tld-news__text,.tld-contact__text,.tld-contact__link';
  function split(el){
    if(el._v3html==null)el._v3html=el.innerHTML;
    var words=[];
    (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;
        if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return;}var s=document.createElement('span');s.className='v3-w';s.textContent=w;f.appendChild(s);words.push(s);});c.parentNode.replaceChild(f,c);}
      else if(c.nodeType===1&&c.tagName!=='BR')walk(c);});})(el);
    /* regroupe les mots par ligne (même position verticale) */
    var lines=[],top=null;
    words.forEach(function(w){var t=w.offsetTop;if(top===null||Math.abs(t-top)>4){lines.push([]);top=t;}lines[lines.length-1].push(w);});
    el.innerHTML='';
    lines.forEach(function(ws){var m=document.createElement('span');m.className='v3-line';var i=document.createElement('span');i.className='v3-line__in';
      ws.forEach(function(w,k){i.appendChild(document.createTextNode((k?' ':'')+w.textContent));});m.appendChild(i);el.appendChild(m);});
    return [].slice.call(el.querySelectorAll('.v3-line__in'));
  }
  var lineEls=[].slice.call(document.querySelectorAll(LINE_SEL));
  if(reduce||!lineEls.length)root.classList.remove('v3-pre');
  if(!reduce&&lineEls.length){
    var go=function(){
      lineEls.forEach(function(el){el._v3in=split(el);el._v3in.forEach(function(l){l.style.transform='translateY(110%)';});});
      root.classList.remove('v3-pre'); /* les textes étaient masqués en attendant le découpage (pas de saut) */
      inView(lineEls,function(el){el._v3done=true;(el._v3in||[]).forEach(function(l,i){l.style.transform='';
        l.animate([{transform:'translateY(110%)'},{transform:'none'}],{duration:1000,delay:i*80,easing:EXPO,fill:'backwards'});});});
    };
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);else go();
    /* au redimensionnement, on rend le texte d'origine (les lignes ne correspondent plus) */
    var lw=window.innerWidth;window.addEventListener('resize',function(){if(Math.abs(window.innerWidth-lw)<40)return;lw=window.innerWidth;
      lineEls.forEach(function(el){if(el._v3html!=null&&el._v3done){el.innerHTML=el._v3html;}});});
  }

  /* 2. Projets : l'image se pose, cartes inclinées selon la vitesse ----------------------------- */
  var works=[].slice.call(document.querySelectorAll('.tld-work'));
  if(!reduce){
    var imgs=works.map(function(w){return w.querySelector('.tld-work__img');}).filter(Boolean);
    imgs.forEach(function(im){im.style.scale='1.18';});
    inView(imgs.map(function(im){return im.closest('.tld-work__media')||im;}),function(m){var im=m.querySelector('.tld-work__img')||m;
      im.style.scale='';im.animate([{scale:'1.18'},{scale:'1'}],{duration:1600,easing:EXPO,fill:'backwards'});},'0px 0px -15% 0px');
    if(works.length){
      var lastY=window.scrollY,lastT=performance.now(),skew=0,target=0,raf=null;
      var loop=function(){raf=null;var now=performance.now();
        var v=window.tldLenis&&typeof window.tldLenis.velocity==='number'?window.tldLenis.velocity:(window.scrollY-lastY)/Math.max(1,now-lastT)*16;
        lastY=window.scrollY;lastT=now;target=Math.max(-3,Math.min(3,v*.12));skew+=(target-skew)*.12;
        if(Math.abs(skew)<.01&&Math.abs(target)<.01){skew=0;works.forEach(function(w){w.style.transform='';});return;}
        var s='skewY('+skew.toFixed(3)+'deg)';works.forEach(function(w){w.style.transform=s;});raf=requestAnimationFrame(loop);};
      window.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
    }
  }

  /* 3. Stickers : flottement + rappel sur le sticker du hero ------------------------------------ */
  var stickers=[].slice.call(document.querySelectorAll('[data-collect]'));
  stickers.forEach(function(s,i){s.style.setProperty('--v3-d',(-i*0.9).toFixed(1)+'s');s.classList.add('v3-float');});
  var hint=document.querySelector('[data-collect="1"]'),hinted=null;
  function anyGot(){return !!document.querySelector('.tld-collect.is-collected');}
  if(hint&&!reduce){
    var wiggle=function(){if(anyGot()||hint.matches(':hover')){return;}
      hint.animate([{rotate:'0deg'},{rotate:'-7deg'},{rotate:'6deg'},{rotate:'-4deg'},{rotate:'2deg'},{rotate:'0deg'}],{duration:800,easing:'cubic-bezier(.36,0,.66,1)',composite:'add'});};
    ready(function(){setTimeout(function(){wiggle();hinted=setInterval(function(){if(anyGot()){clearInterval(hinted);return;}var r=hint.getBoundingClientRect();if(r.bottom>0&&r.top<window.innerHeight)wiggle();},9000);},2600);});
  }

  /* 4. Services : les titres des colonnes montent à l'arrivée de la section ------------------- */
  var labels=[].slice.call(document.querySelectorAll('.tld-service__label'));
  if(!reduce&&labels.length){labels.forEach(function(l){l.style.opacity='0';});
    inView([document.querySelector('[data-services]')||labels[0]],function(){labels.forEach(function(l,i){l.style.opacity='';
      l.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:800,delay:120+i*70,easing:OUT,fill:'backwards'});});},'0px 0px -35% 0px');}

  /* 5. Footer : le logotype monte en vague, chaque lettre derrière son propre masque (aucune lettre coupée) ; survol lettre par lettre */
  var logo=document.querySelector('.tld-footer__logo');
  if(logo){var letters=[].slice.call(logo.querySelectorAll('svg'));logo.classList.add('v3-logo');
    if(!reduce){var HID={transform:'translateY(100%)',clipPath:'inset(0 0 100% 0)'};
      letters.forEach(function(l){l.style.transform=HID.transform;l.style.clipPath=HID.clipPath;});
      inView([logo],function(){letters.forEach(function(l,i){l.style.transform='';l.style.clipPath='';
        l.animate([HID,{transform:'translateY(0)',clipPath:'inset(0 0 0% 0)'}],{duration:1100,delay:i*55,easing:EXPO,fill:'backwards'});});},'0px 0px -5% 0px');}
    if(fine&&!reduce)letters.forEach(function(l,i){var eye=i===8,busy=false;l.addEventListener('pointerenter',function(){if(busy)return;busy=true;
      var a=l.animate(eye?[{rotate:'0deg'},{rotate:'360deg'}]:[{translate:'0 0'},{translate:'0 -14%'},{translate:'0 0'}],{duration:eye?700:480,easing:eye?OUT:'cubic-bezier(.34,1.56,.64,1)'});a.onfinish=function(){busy=false;};});});
  }

  /* 6. Liens textes : au survol, les lettres partent vers le haut et reviennent par le bas, en léger décalage.
     Chaque lettre porte sa copie en text-shadow juste en dessous ; le mot est découpé par clip-path (pas d'overflow,
     donc la ligne de base ne bouge pas). */
  var LINKS='.tld-nav__link,.tld-footer__big,.tld-footer__link,.tld-works__more>span:last-child,.tld-services__more>span:last-child';
  [].forEach.call(document.querySelectorAll(LINKS),function(a){
    var tn=[].filter.call(a.childNodes,function(n){return n.nodeType===3&&n.textContent.trim();})[0];if(!tn||a.querySelector('.v3-roll'))return;
    var text=tn.textContent.trim(),r=document.createElement('span');r.className='v3-roll';r.setAttribute('aria-label',text);
    text.split('').forEach(function(ch,i){var c=document.createElement('span');c.className='v3-ch';c.setAttribute('aria-hidden','true');c.style.setProperty('--i',i);c.textContent=ch===' '?'\u00a0':ch;r.appendChild(c);});
    a.replaceChild(r,tn);
    /* le masque suit la hauteur réelle des lettres, même si la hauteur de ligne est plus petite que la police */
    var cs=getComputedStyle(a),fs=parseFloat(cs.fontSize)||16,lh=parseFloat(cs.lineHeight);if(isNaN(lh))lh=fs*1.2;
    r.style.setProperty('--v3-ov',(Math.max(0,(fs*1.12-lh)/2)/fs+.04).toFixed(3));
  });
})();
