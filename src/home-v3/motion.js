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
  function ready(fn){var done=false;function go(){if(done)return;done=true;fn();} /* une seule fois (événement du loader ou filet de sécurité) */
    if(!root.classList.contains('tld-loading')){go();return;}
    window.addEventListener('tld:loaded',function h(){window.removeEventListener('tld:loaded',h);go();});setTimeout(go,9000);}

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
        l.animate([{transform:'translateY(110%)'},{transform:'none'}],{duration:1200,delay:i*100,easing:EXPO,fill:'backwards'});});});
    };
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);else go();
    /* au redimensionnement, on rend le texte d'origine (les lignes ne correspondent plus) */
    var lw=window.innerWidth;window.addEventListener('resize',function(){if(Math.abs(window.innerWidth-lw)<40)return;lw=window.innerWidth;
      lineEls.forEach(function(el){if(el._v3html!=null&&el._v3done){el.innerHTML=el._v3html;}});});
  }

  /* 1a. Hero « THE / LAZY · DOG » : chorégraphie après le loader
     1. THE  2. LAZY DOG (la ligne entière, DOG collé à LAZY)  3. DOG glisse à droite et ouvre le trou
     4. le sticker, puis la note et la flèche  5. clic simulé : le sticker prend sa couleur et file dans la collection. Chaque mot monte derrière le masque de sa ligne. */
  var bigL=[].slice.call(document.querySelectorAll('.v3-hero__l')),hs=document.querySelector('.v3-hero__big .tld-collect'),
      hn=document.querySelector('.v3-hero__note'),hp=hn?[].slice.call(hn.querySelectorAll('path')):[],
      wThe=document.querySelector('.v3-hero__l:first-child .v3-hero__in'),wLazy=document.querySelector('.v3-hero__lazy'),wDog=null;
  if(wLazy){var tail=wLazy.parentNode.lastChild; /* « Dog » est un simple texte après le trou : on l'emballe pour l'animer seul */
    if(tail&&tail.nodeType===3&&tail.textContent.trim()){wDog=document.createElement('span');wDog.className='v3-hero__dog';tail.parentNode.replaceChild(wDog,tail);wDog.appendChild(tail);}}
  var words=[wThe,wLazy,wDog].filter(Boolean);
  if(bigL.length&&!reduce){
    var line2=wLazy?wLazy.parentNode:null,intro=[wThe,line2].filter(Boolean);
    intro.forEach(function(w){w.style.transform='translateY(130%)';});
    if(wDog)wDog.style.transform='translateX(-50em)'; /* recalé juste avant le départ (largeur du trou connue) */
    /* le sticker du titre est montré directement en couleur (comme déjà collectionné) : filtre et opacité forcés en ligne */
    if(hs){hs.style.opacity='0';hs.style.filter='none';hs.style.transition='none';}if(hn)hn.style.opacity='0';
    hp.forEach(function(pa){pa.setAttribute('pathLength','1');pa.style.strokeDasharray='1';pa.style.strokeDashoffset='1';});
    var SOFT='cubic-bezier(.22,1,.36,1)',RISE='cubic-bezier(.16,1,.3,1)';
    intro.concat(wDog||[]).forEach(function(w){w.style.willChange='transform';});
    /* chaque élément part de son état caché grâce à fill:'backwards' pendant son délai : aucun style modifié en cours de route */
    function rise(w,t){if(!w)return;w.style.transform='';
      w.animate([{transform:'translateY(115%)'},{transform:'translateY(0)'}],{duration:1150,delay:t,easing:RISE,fill:'backwards'})
       .onfinish=function(){w.style.willChange='';};}
    ready(function(){fitGap(); /* trou calé avant le départ : DOG ne bouge plus ensuite */
      requestAnimationFrame(function(){requestAnimationFrame(function(){ /* laisse le loader se retirer avant de démarrer */
      var T={the:0,line2:200,dog:1150,stk:1850,note:2300,arrow:2550,press:3250,click:3610};
      rise(wThe,T.the);rise(line2,T.line2);
      /* DOG part collé à LAZY (un espace normal), puis glisse à droite jusqu'à sa place */
      if(wDog){var gw=gap?gap.getBoundingClientRect().width:0,shift=-Math.max(0,gw-.26*parseFloat(getComputedStyle(wDog).fontSize));
        wDog.style.transform='';wDog.animate([{transform:'translateX('+shift.toFixed(1)+'px)'},{transform:'translateX(0)'}],{duration:1000,delay:T.dog,easing:'cubic-bezier(.65,0,.2,1)',fill:'backwards'})
          .onfinish=function(){wDog.style.willChange='';};}
      /* apparition en scale, en couleur, avec un léger dépassement */
      if(hs){hs.style.opacity='1';
        hs.animate([{opacity:0,scale:'0'},{opacity:1,scale:'1.12',offset:.62},{scale:'.96',offset:.84},{opacity:1,scale:'1'}],{duration:800,delay:T.stk,easing:'cubic-bezier(.3,0,.3,1)',fill:'backwards'});}
      if(hn){hn.style.opacity='';hn.animate([{opacity:0,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:800,delay:T.note,easing:SOFT,fill:'backwards'});}
      hp.forEach(function(pa,i){pa.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:520,delay:T.arrow+i*260,easing:'cubic-bezier(.45,0,.2,1)',fill:'forwards'});});
      /* DOG monte, puis clic simulé une fois le mot écrit : petite pression, collecte (couleur + envol vers la barre) */
      /* « clic » : le sticker s'enfonce puis rebondit, et file se ranger dans la collection */
      if(hs){setTimeout(function(){if(!hs.classList.contains('is-collected'))hs.animate([{scale:'1'},{scale:'.84',offset:.35},{scale:'1.1',offset:.72},{scale:'1'}],{duration:420,easing:'cubic-bezier(.3,0,.3,1)'});},T.press);
        setTimeout(function(){if(!hs.classList.contains('is-collected'))hs.click();
          /* la classe is-collected garde la couleur : on rend la main au CSS (transitions comprises) */
          requestAnimationFrame(function(){hs.style.filter='';hs.style.opacity='';hs.style.transition='';});},T.click);}
      /* masques relâchés une fois tout en place (le sticker et la note ne sont jamais coupés) */
      setTimeout(function(){bigL.forEach(function(l){l.style.clipPath='none';});},T.dog+1200);
      });});
    });
  }
  /* 1c. Hero à l'arrivée de la section projets :
     - le texte d'intro (h1) s'efface en suivant le scroll ;
     - « THE LAZY DOG » part d'un coup vers le haut (chaque mot sort par le haut de son masque, le sticker et la note
       montent en s'effaçant), puis le showreel disparaît derrière un masque, avec un léger décalage.
     Déclenché en descendant quand le haut des projets passe sous 40 % de l'écran ; tout revient, plus vite, dès qu'on remonte
     et que le bas du hero réapparaît (ou au-dessus de 50 %). */
  var fadeEls=[document.querySelector('.tld-hero__head')].filter(Boolean),reelEl=document.querySelector('.tld-hero .tld-reel'),
      sec2=document.querySelector('.tld-works'),fTick=false,fLast=-1,heroHidden=false,exitAnims=[],heroLastY=window.scrollY||0;
  function buildExit(){
    exitAnims.forEach(function(a){a.cancel();});exitAnims=[];
    bigL.forEach(function(l){l.style.clipPath='';}); /* on remet les masques de lignes pour que les mots en sortent */
    var EX='cubic-bezier(.7,0,.2,1)';
    words.forEach(function(w,i){exitAnims.push(w.animate([{transform:'translateY(0)'},{transform:'translateY(-130%)'}],{duration:760,delay:i*80,easing:EX,fill:'both'}));});
    [hs,hn].forEach(function(el,i){if(!el)return;var op=getComputedStyle(el).opacity;
      exitAnims.push(el.animate([{opacity:op,translate:'0 0'},{opacity:0,translate:'0 -70px'}],{duration:640,delay:100+i*60,easing:EX,fill:'both'}));});
    if(reelEl)exitAnims.push(reelEl.animate([{clipPath:'inset(0% 0% 0% 0% round 5px)',translate:'0 0'},{clipPath:'inset(0% 0% 100% 0% round 5px)',translate:'0 -24px'}],{duration:760,delay:300,easing:EX,fill:'both'}));
  }
  function setHeroHidden(h){
    if(h===heroHidden)return;heroHidden=h;
    if(reduce){[document.querySelector('.v3-hero__big'),reelEl].forEach(function(el){if(el){el.style.transition='opacity .3s';el.style.opacity=h?'0':'';}});return;}
    if(h){if(!exitAnims.length)buildExit();exitAnims.forEach(function(a){a.playbackRate=1;a.play();});}
    else{exitAnims.forEach(function(a){a.playbackRate=-1.6;a.play();}); /* retour plus rapide que la sortie */
      Promise.all(exitAnims.map(function(a){return a.finished;})).then(function(){
        if(heroHidden)return;exitAnims.forEach(function(a){a.cancel();});exitAnims=[];bigL.forEach(function(l){l.style.clipPath='none';});});}
  }
  function heroScroll(){fTick=false;if(!sec2)return;var t=sec2.getBoundingClientRect().top/window.innerHeight;
    /* sortie en descendant, quand le hero est à moitié sorti (projets à 40 % de l'écran) ;
       retour dès qu'on remonte et que le bas du hero (là où est le titre) revient à l'écran — plus de zone vide */
    var y=window.scrollY||window.pageYOffset,dir=y<heroLastY?-1:(y>heroLastY?1:0);heroLastY=y;
    if(t<.4&&dir>=0)setHeroHidden(true);else if((dir<0&&t>.12)||t>.5)setHeroHidden(false);
    var k=Math.max(0,Math.min(1,(t-.4)/(.85-.4)));k=Math.round(k*1000)/1000;if(k===fLast)return;fLast=k;
    var e=k*k*(3-2*k);
    fadeEls.forEach(function(el){if(k>=1){el.style.opacity='';el.style.translate='';el.style.visibility='';return;}
      el.style.opacity=e.toFixed(3);el.style.translate=reduce?'':'0 '+((1-e)*-24).toFixed(1)+'px';el.style.visibility=k<=0?'hidden':'';});
  }
  if(sec2){window.addEventListener('scroll',function(){if(!fTick){fTick=true;requestAnimationFrame(heroScroll);}},{passive:true});
    window.addEventListener('resize',heroScroll);heroScroll();}

  /* « LAZY · DOG » : le trou est calé pour que le sticker soit centré entre les deux mots (comme sur la maquette) */
  var gap=document.querySelector('.v3-hero__gap'),lazy=document.querySelector('.v3-hero__lazy');
  function fitGap(){if(!gap||!lazy)return;var fs=parseFloat(getComputedStyle(gap).fontSize)||1,w=lazy.getBoundingClientRect().width/fs;
    gap.parentNode.parentNode.parentNode.style.setProperty('--v3-gap',Math.max(.6,2*(3.044-w))+'em');}
  if(gap){fitGap();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitGap);window.addEventListener('resize',fitGap);}

  /* 2. Projets : l'image se pose, cartes inclinées selon la vitesse ----------------------------- */
  var works=[].slice.call(document.querySelectorAll('.tld-work'));
  if(!reduce){
    var imgs=works.map(function(w){return w.querySelector('.tld-work__img');}).filter(Boolean);
    imgs.forEach(function(im){im.style.scale='1.1';});
    inView(imgs.map(function(im){return im.closest('.tld-work__media')||im;}),function(m){var im=m.querySelector('.tld-work__img')||m;
      im.style.scale='';im.animate([{scale:'1.1'},{scale:'1'}],{duration:1900,easing:EXPO,fill:'backwards'});},'0px 0px -15% 0px');
    if(works.length){
      var lastY=window.scrollY,lastT=performance.now(),skew=0,target=0,raf=null;
      var loop=function(){raf=null;var now=performance.now();
        var v=window.tldLenis&&typeof window.tldLenis.velocity==='number'?window.tldLenis.velocity:(window.scrollY-lastY)/Math.max(1,now-lastT)*16;
        lastY=window.scrollY;lastT=now;target=Math.max(-1.5,Math.min(1.5,v*.07));skew+=(target-skew)*.08;
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
      var a=l.animate(eye?[{rotate:'0deg'},{rotate:'360deg'}]:[{translate:'0 0'},{translate:'0 -9%'},{translate:'0 0'}],{duration:eye?900:620,easing:eye?OUT:'cubic-bezier(.33,1.25,.6,1)'});a.onfinish=function(){busy=false;};});});
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
