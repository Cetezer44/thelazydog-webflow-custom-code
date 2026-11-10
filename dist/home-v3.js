/*! The Lazy Dog — home-v3.js v4.2.0 — github.com/Cetezer44/thelazydog-webflow-custom-code */
/* --- src/home/loader.js --- */
/* The Lazy Dog — loader de la page d'accueil (maquette « Animation home » Step 00 → 5)
   Step 00 : les stickers de la page ([data-collect]) s'empilent au centre, puis disparaissent ;
   Step 0 : les trois lignes du logo (THE / LAZY / DOG) apparaissent par un masque, du bas vers le haut ;
   Steps 1 → 2 : les lettres s'écartent puis s'imbriquent ; Step 5 : il ne reste que l'œil, qui disparaît en scale
   et réapparaît en scale dans le header. */
(function(){
  var root=document.documentElement,loader=document.querySelector('.tld-loader');
  if(!loader||!root.classList.contains('tld-loading'))return;
  var stage=loader.querySelector('.tld-loader__stage'),bg=loader.querySelector('.tld-loader__bg');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* version rapide (Accueil v3 : <html data-loader-fast>) : pas de pile de stickers, timings ~40 % plus courts, courbes plus nerveuses */
  var FAST=root.hasAttribute('data-loader-fast');
  var E={pop:'cubic-bezier(.34,1.7,.5,1)',move:'cubic-bezier(.77,0,.18,1)',spread:'cubic-bezier(.2,1.45,.35,1)',snap:'cubic-bezier(.8,-0.35,.2,1.35)',out:'cubic-bezier(.55,0,.85,.3)',fly:'cubic-bezier(.7,0,.15,1)'};
  if(FAST){E.spread='cubic-bezier(.22,1.25,.36,1)';E.snap='cubic-bezier(.65,-0.15,.25,1.15)';E.out='cubic-bezier(.55,0,.75,.2)';}
  var T=FAST?{mask:680,mStag:90,s1:680,d1:560,s2:1240,d2:460,t5:1760,fly:460,fStag:20,eyeAt:360,eye:460,bgAt:680,bg:420,end:900,rv:.85}:{mask:820,mStag:140,s1:1350,d1:720,s2:2150,d2:540,t5:2850,fly:520,fStag:28,eyeAt:560,eye:520,bgAt:960,bg:420,end:1180,rv:1};
  var L={};[].forEach.call(stage.querySelectorAll('[data-l]'),function(el){L[el.getAttribute('data-l')]={el:el,x:0,y:0,r:0,s:1,o:0};});
  /* positions (px, depuis le centre de l'écran) relevées sur les frames Figma 1440×900 : [x, y, rotation] */
  var S=[
    {t:[-38.4,-0.6,0],h:[1.6,-0.2,-5],e:[39.3,-0.6,0]},
    {t:[-38.4,-26.6,0],h:[1.6,-26.2,-5],e:[39.3,-26.6,0],l:[-67.4,30.4,0],a:[-29,30.4,0],z:[16,30.4,0],y:[59.3,30.4,0]},
    {t:[-38.4,-55.6,0],h:[1.6,-55.2,-5],e:[39.3,-55.6,0],l:[-67.4,1.4,0],a:[-29,1.4,0],z:[16,1.4,0],y:[59.3,1.4,0],d:[-46.8,55.8,3],o:[0,57.2,0],g:[48.5,56.8,0]},
    {t:[-113.8,-76.6,0],h:[-1.5,-75,0],e:[110.8,-76.6,0],l:[-168.3,0.4,0],a:[-58.6,0.4,0],z:[55.4,0.4,0],y:[160.7,0.4,0],d:[-113,73.8,0],o:[0,74.2,0],g:[111,73.8,0]},
    {t:[-113.8,-38.7,0],h:[-1.5,-37.1,0],e:[110.8,-38.7,0],l:[-168.3,-0.6,0],a:[-58.6,-0.6,0],z:[55.4,-0.6,0],y:[160.7,-0.6,0],d:[-113,35.8,0],o:[0,36.2,0],g:[111,35.8,0]}
  ];
  var k=Math.min(1,Math.max(0.78,(window.innerWidth-32)/400)); /* petits écrans : on réduit un peu l'ensemble */
  stage.style.transform='scale('+k+')';
  function tf(p){return 'translate('+p.x+'px,'+p.y+'px) rotate('+p.r+'deg) scale('+p.s+')';}
  function to(id,next,dur,delay,ease){
    var p=L[id];if(!p)return null;var from={x:p.x,y:p.y,r:p.r,s:p.s,o:p.o};
    for(var key in next)p[key]=next[key];
    return p.el.animate([{transform:tf(from),opacity:from.o},{transform:tf(p),opacity:p.o}],{duration:dur,delay:delay||0,easing:ease||E.move,fill:'forwards'});
  }
  function set(id,st){var p=L[id];for(var key in st)p[key]=st[key];p.el.style.transform=tf(p);p.el.style.opacity=p.o;}
  function rnd(a,b){return a+Math.random()*(b-a);}
  function move(ids,step,t0,dur,ease,jitter){ids.forEach(function(id,i){var v=S[step][id];
    to(id,{x:v[0],y:v[1],r:v[2]},dur,t0+(jitter?Math.round(rnd(0,jitter)):0),ease);});}
  var THE=['t','h','e'],LAZY=['l','a','z','y'],DOG=['d','o','g'],ALL=THE.concat(LAZY,DOG);
  var eye=document.querySelector('.tld-eye'),OUT='cubic-bezier(.16,1,.3,1)';
  function splitLines(h){ /* découpe le h1 en lignes réelles pour la révélation en masque (le gras est conservé) */
    var html=h.innerHTML,words=[];
    (function walk(node,wrap){[].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){n.textContent.split(/\s+/).forEach(function(w){if(!w)return;var s=document.createElement('span');s.textContent=w;words.push({el:s,wrap:wrap});});}
      else if(n.nodeType===1){walk(n,n);}
    });})(h,null);
    h.textContent='';
    words.forEach(function(w,i){var node=w.el;if(w.wrap){var c=w.wrap.cloneNode(false);c.appendChild(w.el);node=c;}w.node=node;h.appendChild(node);if(i<words.length-1)h.appendChild(document.createTextNode(' '));});
    var lines=[],top=null;words.forEach(function(w){var t=w.el.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t;}lines[lines.length-1].push(w.node);});
    h.textContent='';
    return {html:html,inners:lines.map(function(l){var o=document.createElement('span'),i=document.createElement('span');o.className='tld-line';i.className='tld-line__in';
      l.forEach(function(node,k){if(k)i.appendChild(document.createTextNode(' '));i.appendChild(node);});o.appendChild(i);h.appendChild(o);return i;})};
  }
  function reveal(){ /* entrée de la page : œil qui s'ouvre, h1 ligne par ligne, navigation depuis chaque bord */
    if(eye){eye.animate([{transform:'scale(0) rotate(-120deg)'},{transform:FAST?'scale(1.05) rotate(4deg)':'scale(1.12) rotate(8deg)',offset:.7},{transform:'none'}],{duration:720*T.rv,delay:60,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'});}
    var h=document.querySelector('.tld-hero__title'),last=0;
    if(h){var sp=splitLines(h);sp.inners.forEach(function(el,i){last=i;
      el.animate([{transform:'translateY(110%)'},{transform:'translateY(0)'}],{duration:1000*T.rv,delay:(160+i*130)*T.rv,easing:OUT,fill:'backwards'});});
      setTimeout(function(){h.innerHTML=sp.html;},(160+last*130+1050)*T.rv);}
    [].forEach.call(document.querySelectorAll('.tld-nav__link'),function(el){
      var c=el.classList,base=getComputedStyle(el).transform;base=(base==='none')?'':' '+base;
      var r=el.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight,dl=r.left,dr=vw-r.right,dt=r.top,db=vh-r.bottom,m=Math.min(dl,dr,dt,db); /* arrive par le bord le plus proche */
      var off=m===dt?'translateY(-56px)':m===db?'translateY(56px)':m===dl?'translateX(-56px)':'translateX(56px)';
      el.animate([{transform:off+base,opacity:0},{transform:(base?base.trim():'none'),opacity:1}],{duration:1000*T.rv,delay:420*T.rv,easing:OUT,fill:'backwards'});
    });
    [].forEach.call(document.querySelectorAll('.tld-reel'),function(el){
      el.animate([{opacity:0,transform:'translateY(60px)'},{opacity:1,transform:'none'}],{duration:1100*T.rv,delay:(160+(last+1)*130)*T.rv,easing:OUT,fill:'backwards'});
    });
    setTimeout(revealed,(160+last*130+650)*T.rv); /* les stickers tombent quand le titre est écrit */
  }
  function revealed(){window.dispatchEvent(new CustomEvent('tld:revealed'));}
  function finish(){
    window.tldLoaded=true;window.dispatchEvent(new CustomEvent('tld:loaded'));
    root.classList.remove('tld-loading');
    loader.parentNode&&loader.parentNode.removeChild(loader);
    if(!reduce)reveal();else revealed();
  }
  if(reduce){bg.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish=finish;return;}
  window.scrollTo(0,0);
  /* Step 00 : pile de stickers (positions relevées sur la frame « Animation home - Step 00 » : [id, x, y, largeur, rotation], dans l'ordre d'empilement) */
  var PILE=[['1',-0.3,-69.5,211,9.73],['7',-27.4,-6.9,121,-21.04],['3',-37.5,57.5,99,0],['5',58.2,63.7,164,15.99],['4',87.5,33.7,78,30],['6',50.1,-2.8,107,28.01]];
  var O=0,srcs={},GAP=190,DUR=640;
  [].forEach.call(document.querySelectorAll('[data-collect]'),function(el){var im=el.tagName==='IMG'?el:el.querySelector('img');if(im)srcs[el.getAttribute('data-collect')]=im.currentSrc||im.src;});
  var pile=FAST?[]:PILE.filter(function(p){return srcs[p[0]];});
  if(FAST)O=60;
  if(pile.length){
    var end=120+(pile.length-1)*GAP+DUR; /* dernier sticker posé */
    O=end+520; /* la pile reste un instant, puis le logo démarre */
    pile.forEach(function(p,i){
      var im=document.createElement('img');im.src=srcs[p[0]];im.alt='';im.className='tld-loader__stk';
      im.style.cssText='position:absolute;left:0;top:0;width:'+p[3]+'px;height:auto;margin:0;max-width:none;opacity:0;z-index:5;will-change:transform,opacity;pointer-events:none';
      stage.appendChild(im);
      var place=function(x,y,r,sc){return 'translate(-50%,-50%) translate('+x+'px,'+y+'px) rotate('+r+'deg) scale('+sc+')';};
      var t=120+i*GAP; /* un sticker toutes les 190 ms, posé avec un petit rebond */
      im.animate([{transform:place(p[1]+rnd(-30,30),p[2]-60,p[4]+rnd(-35,35),1.7),opacity:0},{transform:place(p[1],p[2],p[4],1),opacity:1}],{duration:DUR,delay:t,easing:E.pop,fill:'forwards'});
      /* puis la pile se ramasse au centre et laisse la place au logo */
      im.animate([{transform:place(p[1],p[2],p[4],1),opacity:1},{transform:place(p[1]*.2,p[2]*.2,p[4]+rnd(-90,90),.15),opacity:0}],{duration:420,delay:O-420+i*22,easing:E.out,fill:'forwards'});
    });
  }
  /* Step 0 : les trois lignes apparaissent par un masque, du bas vers le haut (chaque lettre glisse dans sa propre fenêtre) */
  var LINES=[THE,LAZY,DOG],D=48;
  ALL.forEach(function(id){var v=S[2][id];set(id,{x:v[0],y:v[1],r:v[2],s:1,o:1});});
  LINES.forEach(function(line,i){line.forEach(function(id){var p=L[id],base=tf(p),up=tf({x:p.x,y:p.y+D,r:p.r,s:1});
    p.el.animate([{transform:up,clipPath:'inset(0 0 '+D+'px 0)'},{transform:base,clipPath:'inset(0 0 0px 0)'}],{duration:T.mask,delay:O+100+i*T.mStag,easing:OUT,fill:'backwards'});});});
  /* Step 1 : les lettres s'écartent */
  move(ALL,3,O+T.s1,T.d1,E.spread,FAST?40:70);
  /* Step 2 : les lignes se resserrent et s'imbriquent */
  move(ALL,4,O+T.s2,T.d2,E.snap,FAST?24:40);
  /* Step 5 : les autres lettres s'envolent, il ne reste que l'œil */
  var t5=O+T.t5;
  ALL.forEach(function(id,i){if(id==='o')return;var p=L[id];
    to(id,{x:p.x*1.35+rnd(-20,20),y:p.y+rnd(40,90),r:p.r+rnd(-70,70),s:.2,o:0},T.fly,t5+i*T.fStag,E.out);});
  /* l'œil disparaît en scale (avec une petite anticipation)… */
  L.o.el.animate([{transform:tf(L.o)},{transform:tf({x:L.o.x,y:L.o.y,r:0,s:1.18}),offset:.35},{transform:tf({x:L.o.x,y:L.o.y,r:90,s:0})}],{duration:T.eye,delay:t5+T.eyeAt,easing:FAST?'cubic-bezier(.5,-0.1,.75,0)':'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
  bg.animate([{opacity:1},{opacity:0}],{duration:T.bg,delay:t5+T.bgAt,easing:'ease',fill:'forwards'});
  /* …et réapparaît en scale dans le header (dans reveal) */
  setTimeout(finish,t5+T.end);
})();

/* --- src/home/eye.js --- */
/* The Lazy Dog — œil du header : image changée selon la position du curseur (sprite 22 frames : 11 gauche + 11 droite) */
(function(){
  var eyes=[].slice.call(document.querySelectorAll('[data-eye]'));if(!eyes.length)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mx=null,my=null,raf=null;
  eyes.forEach(function(el){
    el._n=parseInt(el.getAttribute('data-eye-frames'),10)||22;      /* nombre d'images dans le sprite */
    el._range=parseFloat(el.getAttribute('data-eye-range'))||420;   /* distance (px) pour atteindre l'image extrême */
    el._cur=(el._n-1)/2;el._idx=-1;
    var src=el.getAttribute('data-eye-src');if(src)el.style.backgroundImage='url("'+src+'")'; /* sinon : image de fond définie sur la classe .tld-eye dans le Designer */
  });
  function setFrame(el,i){if(i===el._idx)return;el._idx=i;el.style.backgroundPosition=(i/(el._n-1)*100)+'% 0';}
  function tick(){
    raf=null;var busy=false;
    eyes.forEach(function(el){
      var mid=(el._n-1)/2,target=mid;
      if(mx!==null){
        var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
        var dx=mx-cx,dy=my-cy,t=Math.max(-1,Math.min(1,dx/el._range));
        var d=Math.sqrt(dx*dx+dy*dy),k=Math.min(1,Math.max(0,(d-18)/60)); /* zone morte au centre */
        target=mid+(t<0?-1:1)*Math.pow(Math.abs(t),0.8)*k*mid;
      }
      el._cur+=(target-el._cur)*(reduce?1:0.22);
      if(Math.abs(target-el._cur)>0.02)busy=true;
      setFrame(el,Math.round(el._cur));
    });
    if(busy)raf=requestAnimationFrame(tick);
  }
  function kick(){if(!raf)raf=requestAnimationFrame(tick);}
  window.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;kick();},{passive:true});
  document.addEventListener('pointerleave',function(){mx=my=null;kick();});
  window.addEventListener('scroll',kick,{passive:true});
  eyes.forEach(function(el){setFrame(el,Math.round(el._cur));});
})();

/* --- src/home/showreel.js --- */
/* The Lazy Dog — showreel : lecture en boucle (muette), curseur play/pause au survol, clic = lecture/pause */
(function(){
  var reels=[].slice.call(document.querySelectorAll('[data-reel]'));
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  reels.forEach(function(reel){
    var v=reel.querySelector('video'),c=reel.querySelector('.tld-reel__cursor');if(!v)return;
    var src=reel.getAttribute('data-reel-src'),poster=reel.getAttribute('data-reel-poster');
    if(poster)v.poster=poster;
    if(src)v.src=src;
    v.muted=true;v.loop=true;v.playsInline=true;
    var userPaused=reduce; /* mouvement réduit : pas de lecture auto */
    function sync(){var p=v.paused;reel.classList.toggle('is-paused',p);reel.setAttribute('aria-label',p?'Lire le showreel':'Mettre le showreel en pause');}
    function play(){var p=v.play();if(p&&p.catch)p.catch(sync);}
    v.addEventListener('play',sync);v.addEventListener('pause',sync);
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!userPaused)play();}else if(!v.paused){v.pause();}});},{threshold:0.15}).observe(reel);
    }else if(!userPaused){play();}
    function toggle(){if(v.paused){userPaused=false;play();}else{userPaused=true;v.pause();}}
    reel.setAttribute('role','button');reel.tabIndex=0;
    reel.addEventListener('click',toggle);
    reel.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    if(fine&&c){
      var x=0,y=0,raf=null;
      function draw(){raf=null;c.style.transform='translate3d('+x+'px,'+y+'px,0)';}
      reel.addEventListener('pointerenter',function(e){x=e.clientX;y=e.clientY;draw();reel.classList.add('is-hover');});
      reel.addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(draw);});
      reel.addEventListener('pointerleave',function(){reel.classList.remove('is-hover');});
    }
    sync();
  });
})();

/* --- src/home/words.js --- */
/* The Lazy Dog — texte qui s'écrit mot par mot.
   Tout élément [data-words] : quand il entre dans l'écran, ses mots apparaissent un par un, à leur rythme
   (indépendamment de la vitesse du scroll). Le gras, les liens, etc. sont conservés.
   data-words-wait : n'écrit le texte qu'à la réception de l'évènement « tld:words » sur l'élément (déclenché par un autre script).
   Réglages facultatifs : data-words-delay (ms entre deux mots, défaut 55), data-words-duration (ms par mot, défaut 500). */
(function(){
  var els=[].slice.call(document.querySelectorAll('[data-words]'));if(!els.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var EASE='cubic-bezier(.22,1,.36,1)';
  els.forEach(function(el){
    var words=[],dur=parseFloat(el.getAttribute('data-words-duration'))||500;
    (function walk(node){[].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){if(!part)return;
          if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
          var s=document.createElement('span');s.className='tld-word';s.textContent=part;
          s.style.display='inline-block';s.style.opacity=0;s.style.transform='translateY(.4em)';
          s.style.transition='opacity '+dur+'ms '+EASE+',transform '+dur+'ms '+EASE;
          frag.appendChild(s);words.push(s);});
        n.parentNode.replaceChild(frag,n);
      }else if(n.nodeType===1){walk(n);}
    });})(el);
    el._words=words;
  });
  function play(el){
    if(el._played)return;el._played=true;
    var step=parseFloat(el.getAttribute('data-words-delay'))||55;
    el._words.forEach(function(w,i){w.style.transitionDelay=(i*step)+'ms';w.style.opacity=1;w.style.transform='none';});
  }
  els.forEach(function(el){el.addEventListener('tld:words',function(){play(el);});});
  els=els.filter(function(el){return !el.hasAttribute('data-words-wait');});
  if(!('IntersectionObserver' in window)){els.forEach(play);return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){play(e.target);io.unobserve(e.target);}});},{rootMargin:'0px 0px -15% 0px',threshold:.15});
  els.forEach(function(el){io.observe(el);});
})();

/* --- src/home/parallax.js --- */
/* The Lazy Dog — parallax au scroll.
   [data-parallax] et .tld-work__media (cadre en overflow:hidden) : l'image à l'intérieur glisse plus lentement que le cadre. Valeur = amplitude (défaut 0.12 = 12 % de la hauteur).
   [data-speed] : l'élément entier avance plus vite ou plus lentement que la page (ex. 0.1 = 10 % de la hauteur de l'écran).
   [data-speeds="0,0.08,…"] sur une liste : une vitesse par élément de la liste. Désactivé sur mobile. */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var frames=[].slice.call(document.querySelectorAll('[data-parallax],.tld-work__media')).map(function(el){
    var img=el.querySelector('img');if(img&&img.closest('.tld-work__hover'))img=null;if(!img)return null;
    var a=parseFloat(el.getAttribute('data-parallax'));if(!(a>0))a=el.hasAttribute('data-parallax')?.12:.07; /* projets : parallax léger */
    img.style.position='absolute';img.style.left='0';img.style.width='100%';img.style.maxWidth='none';
    img.style.top=(-a*100)+'%';img.style.height=((1+2*a)*100)+'%';img.style.objectFit='cover';img.style.willChange='transform';
    return {el:el,img:img,a:a};
  }).filter(Boolean);
  var movers=[].slice.call(document.querySelectorAll('[data-speed]')).map(function(el){return {el:el,s:parseFloat(el.getAttribute('data-speed'))||0};}).filter(function(m){return m.s;});
  /* [data-speeds="0,0.08,…"] sur une liste (ex. Collection List) : une vitesse par enfant, dans l'ordre */
  [].forEach.call(document.querySelectorAll('[data-speeds]'),function(list){var sp=list.getAttribute('data-speeds').split(',').map(parseFloat);
    [].forEach.call(list.children,function(ch,i){var v=sp[i%sp.length];if(v)movers.push({el:ch,s:v});});});
  if(!frames.length&&!movers.length)return;
  var ticking=false;
  function prog(r,vh){return (vh-r.top)/(vh+r.height);} /* 0 = juste sous l'écran, 1 = juste au-dessus */
  function update(){
    ticking=false;var vh=window.innerHeight,mobile=window.innerWidth<768;
    frames.forEach(function(f){var r=f.el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
      var p=Math.max(0,Math.min(1,prog(r,vh)));f.img.style.transform='translate3d(0,'+((.5-p)*2*f.a*r.height).toFixed(1)+'px,0)';});
    movers.forEach(function(m){var r=m.el.getBoundingClientRect();
      var p=prog({top:r.top-(m._y||0),height:r.height},vh),y=mobile?0:(.5-p)*m.s*vh;m._y=y;
      m.el.style.transform=y?'translate3d(0,'+y.toFixed(1)+'px,0)':'';});
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);req();
})();

/* --- src/home/reveal.js --- */
/* The Lazy Dog — apparition des projets par un masque de haut en bas.
   Tout élément [data-reveal] se dévoile du haut vers le bas quand il entre dans l'écran ;
   le titre du projet (.tld-work__title) apparaît juste après. Réglage facultatif : data-reveal-duration (ms, défaut 1100). */
(function(){
  var els=[].slice.call(document.querySelectorAll('[data-reveal]'));if(!els.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  var EASE='cubic-bezier(.77,0,.18,1)';
  els.forEach(function(el){
    var d=parseFloat(el.getAttribute('data-reveal-duration'))||1100;
    el.style.clipPath='inset(0 0 100% 0)';el.style.webkitClipPath='inset(0 0 100% 0)';
    el.style.transition='clip-path '+d+'ms '+EASE+',-webkit-clip-path '+d+'ms '+EASE;
    var card=el.closest('.tld-work'),t=card&&card.querySelector('.tld-work__title');
    if(t){t.style.opacity=0;t.style.transform='translateY(10px)';t.style.transition='opacity 600ms ease '+(d*.55)+'ms,transform 600ms ease '+(d*.55)+'ms';el._title=t;}
  });
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
    el.style.clipPath='inset(0 0 0 0)';el.style.webkitClipPath='inset(0 0 0 0)';
    if(el._title){el._title.style.opacity=1;el._title.style.transform='none';}
  });},{rootMargin:'0px 0px -10% 0px',threshold:0});
  els.forEach(function(el){io.observe(el);});
})();

/* --- src/home/collect.js --- */
/* The Lazy Dog — stickers à collectionner sur la page d'accueil.
   [data-collect="id"] : un sticker caché dans la page (affiché en noir et blanc, 30 % d'opacité). Au clic, il reprend sa couleur,
   grossit un peu (×1,1) et tourne légèrement ; une copie s'envole vers sa place dans la barre [data-collect-bar].
   [data-collect-slot="id"] : les places de la barre (fixe, verticale, à gauche de l'écran), dans l'ordre d'affichage.
   Quand tout est collectionné : écran [data-collect-final] (filtre sombre « glass », maquette « Stickers_OK ») : le titre
   « Stickers complétés » arrive, puis les stickers [data-final="id"] claquent en ligne un par un, façon lettres S-K-A-T-E,
   pendant que le compteur [data-final-count] avance (1/6 … 6/6). Un clic (curseur « fermer ») ou Échap ferme l'écran.
   Rotation de départ d'un sticker : variable CSS --r sur l'élément (ex. style="--r:24deg"). */
(function(){
  var items=[].slice.call(document.querySelectorAll('[data-collect]'));if(!items.length)return;
  var bar=document.querySelector('[data-collect-bar]'),fin=document.querySelector('[data-collect-final]');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var got={},total=0,ids={};
  items.forEach(function(el){var id=el.getAttribute('data-collect');if(!ids[id]){ids[id]=1;total++;}
    el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label','Collectionner ce sticker');el.setAttribute('aria-pressed','false');
    el.addEventListener('click',function(e){e.preventDefault();collect(el);});
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();collect(el);}});
  });
  function slot(id){return bar&&bar.querySelector('[data-collect-slot="'+id+'"]');}
  function imgOf(el){return el.tagName==='IMG'?el:el.querySelector('img');}
  function collect(el){
    var id=el.getAttribute('data-collect');if(got[id])return;got[id]=true;
    el.classList.add('is-collected');el.setAttribute('aria-pressed','true');el.setAttribute('aria-label','Sticker collectionné');
    var s=slot(id),im=imgOf(el);
    if(s&&im&&!reduce){ /* une copie s'envole vers la barre */
      var a=im.getBoundingClientRect(),b=s.getBoundingClientRect(),c=im.cloneNode(false);
      c.removeAttribute('srcset');c.className='tld-collect-fly';c.style.cssText='position:fixed;left:'+a.left+'px;top:'+a.top+'px;width:'+a.width+'px;height:'+a.height+'px;margin:0;z-index:9990;pointer-events:none;';
      document.body.appendChild(c);
      var rot=0;try{var m=new DOMMatrix(getComputedStyle(s).transform);rot=Math.round(Math.atan2(m.b,m.a)*180/Math.PI);}catch(err){}
      var side=Math.abs(Math.abs(rot)-90)<5; /* place tournée de 90° dans la barre verticale */
      var dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2),sc=side?Math.min(b.height/a.width,b.width/a.height):Math.min(b.width/a.width,b.height/a.height);
      var anim=c.animate([{transform:'translate(0,0) scale(1) rotate(0)',opacity:1},{transform:'translate('+dx*.45+'px,'+(dy*.45-80)+'px) scale('+(1+sc)/2+') rotate(-12deg)',opacity:1,offset:.45},{transform:'translate('+dx+'px,'+dy+'px) scale('+sc+') rotate('+rot+'deg)',opacity:1}],{duration:820,easing:'cubic-bezier(.5,0,.2,1)',fill:'forwards'});
      anim.onfinish=function(){c.remove();fill(s);};
    }else if(s){fill(s);}
    if(Object.keys(got).length===total)setTimeout(finale,reduce?200:1100);
  }
  function fill(s){s.classList.add('is-got');if(!reduce)s.animate([{transform:'scale(1.45) rotate(-10deg)'},{transform:'scale(.9) rotate(4deg)',offset:.6},{transform:'scale(1)'}],{duration:520,easing:'cubic-bezier(.34,1.6,.5,1)',composite:'add'});}
  /* écran final (frame « Stickers_OK ») : titre, puis les stickers claquent en ligne un par un et le compteur avance */
  function finale(){
    if(!fin)return;
    fin.hidden=false;fin.classList.add('is-open');document.documentElement.classList.add('tld-collect-open');window.dispatchEvent(new Event('tld:cursor'));
    var list=[].slice.call(fin.querySelectorAll('[data-final]')),n=list.length;
    var title=fin.querySelector('[data-final-title]'),count=fin.querySelector('[data-final-count]');
    if(!title){title=document.createElement('div');title.className='tld-collect-final__title';title.setAttribute('data-final-title','');
      title.innerHTML='<span class="tld-collect-final__line">Stickers</span><span class="tld-collect-final__line">Complétés<span class="tld-collect-final__count" data-final-count></span></span>';
      var row0=fin.querySelector('.tld-collect-final__row');fin.insertBefore(title,row0||fin.firstChild);count=title.querySelector('[data-final-count]');}
    if(count)count.textContent=(reduce?n:0)+'/'+n;
    list.forEach(function(el){el.style.opacity='0';el._base=el.getAttribute('data-final')==='1'?'rotate(2.79deg)':'';});
    fin.animate([{opacity:0},{opacity:1}],{duration:reduce?1:450,easing:'ease',fill:'forwards'});
    if(!reduce)[].forEach.call(title.querySelectorAll('.tld-collect-final__line'),function(l,i){
      l.animate([{opacity:0,transform:'translateY(40%)'},{opacity:1,transform:'none'}],{duration:700,delay:150+i*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});});
    list.forEach(function(el,i){
      var d=reduce?0:750+i*320,r=(i%2?1:-1)*(10+Math.random()*10),b=el._base||'';
      var a=el.animate([{opacity:0,transform:b+' scale(2.8) rotate('+r*2+'deg)'},{opacity:1,transform:b+' scale(.86) rotate('+(-r*.4)+'deg)',offset:.55},{opacity:1,transform:b+' scale(1.06) rotate('+(r*.15)+'deg)',offset:.8},{opacity:1,transform:b+' scale(1)'}],{duration:reduce?1:500,delay:d,easing:'cubic-bezier(.2,.8,.25,1)',fill:'forwards'});
      if(reduce){el.style.opacity='1';return;}
      setTimeout(function(){ /* impact : le compteur avance, l'écran tremble un peu */
        if(count){count.textContent=(i+1)+'/'+n;count.animate([{transform:'scale(1.35)'},{transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(.34,1.6,.5,1)'});}
        fin.animate([{transform:'translate(0,0)'},{transform:'translate('+(Math.random()*10-5)+'px,'+(Math.random()*10-5)+'px)'},{transform:'translate(0,0)'}],{duration:150});
      },d+260);
    });
    setTimeout(function(){fin.classList.add('is-done');},reduce?0:750+n*320+400);
  }
  function close(){if(!fin||fin.hidden||!fin.classList.contains('is-done'))return;
    var a=fin.animate([{opacity:1},{opacity:0}],{duration:350,easing:'ease',fill:'forwards'});
    a.onfinish=function(){fin.hidden=true;fin.classList.remove('is-open','is-done');document.documentElement.classList.remove('tld-collect-open');window.dispatchEvent(new Event('tld:cursor'));};}
  if(fin){fin.hidden=true;fin.addEventListener('click',close);window.addEventListener('keydown',function(e){if(e.key==='Escape')close();});}
})();

/* --- src/home/services.js --- */
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

/* --- src/home/works.js --- */
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

/* --- src/home/bg-fade.js --- */
/* The Lazy Dog — fondus de fond entre sections : le fond de la page (body) prend la couleur de la section au centre de l'écran.
   [data-bg-dark="#0c1016"] : section sombre (ajoute html.tld-dark) ; [data-bg="#f43210"] : section colorée claire.
   [data-bg-cut="nom"] sur deux sections voisines : pas de fondu entre elles (coupure nette). Elles prennent leur propre fond
   tant que l'une des deux est active ; on garde le fondu en entrant ou en sortant du groupe.
   Hors de ces sections, on revient au fond clair d'origine. Les sections concernées doivent avoir un fond transparent. */
(function(){
  var secs=[].slice.call(document.querySelectorAll('[data-bg-dark],[data-bg]'));if(!secs.length)return;
  var root=document.documentElement,body=document.body,light=getComputedStyle(body).backgroundColor,ticking=false,cur=null,FADE=800,timer=null;
  secs=secs.map(function(s){var d=s.hasAttribute('data-bg-dark');return {el:s,dark:d,cut:s.getAttribute('data-bg-cut'),color:(d?s.getAttribute('data-bg-dark'):s.getAttribute('data-bg'))||'#0c1016'};});
  body.style.transition='background-color '+FADE+'ms cubic-bezier(.4,0,.2,1)';
  function solid(group,on){secs.forEach(function(s){if(s.cut&&s.cut===group)s.el.style.backgroundColor=on?s.color:'';});}
  function update(){
    ticking=false;var vh=window.innerHeight,hit=null;
    secs.forEach(function(s){var r=s.el.getBoundingClientRect();if(r.top<vh*.55&&r.bottom>vh*.45)hit=s;});
    if(hit===cur)return;var prev=cur;cur=hit;
    var g=hit&&hit.cut,pg=prev&&prev.cut;
    clearTimeout(timer);
    if(pg&&pg!==g)solid(pg,false);          /* on quitte le groupe : le fondu reprend */
    if(g){if(pg===g)solid(g,true);          /* passage d'une section à l'autre du groupe : coupure nette */
      else timer=setTimeout(function(){if(cur&&cur.cut===g)solid(g,true);},FADE+40);} /* entrée dans le groupe : fondu, puis fonds figés */
    root.classList.toggle('tld-dark',!!(hit&&hit.dark));body.style.backgroundColor=hit?hit.color:light;
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
})();

/* --- src/home-v3/motion.js --- */
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
     1. THE  2. LAZY  3. le sticker, puis la note et la flèche  4. DOG  5. clic simulé : le sticker prend sa couleur et file
     dans la collection. Chaque mot monte derrière le masque de sa ligne. */
  var bigL=[].slice.call(document.querySelectorAll('.v3-hero__l')),hs=document.querySelector('.v3-hero__big .tld-collect'),
      hn=document.querySelector('.v3-hero__note'),hp=hn?[].slice.call(hn.querySelectorAll('path')):[],
      wThe=document.querySelector('.v3-hero__l:first-child .v3-hero__in'),wLazy=document.querySelector('.v3-hero__lazy'),wDog=null;
  if(wLazy){var tail=wLazy.parentNode.lastChild; /* « Dog » est un simple texte après le trou : on l'emballe pour l'animer seul */
    if(tail&&tail.nodeType===3&&tail.textContent.trim()){wDog=document.createElement('span');wDog.className='v3-hero__dog';tail.parentNode.replaceChild(wDog,tail);wDog.appendChild(tail);}}
  var words=[wThe,wLazy,wDog].filter(Boolean);
  if(bigL.length&&!reduce){
    words.forEach(function(w){w.style.transform='translateY(130%)';});
    if(hs)hs.style.opacity='0';if(hn)hn.style.opacity='0';
    hp.forEach(function(pa){pa.setAttribute('pathLength','1');pa.style.strokeDasharray='1';pa.style.strokeDashoffset='1';});
    var SOFT='cubic-bezier(.22,1,.36,1)',RISE='cubic-bezier(.16,1,.3,1)';
    words.forEach(function(w){w.style.willChange='transform';});
    /* chaque élément part de son état caché grâce à fill:'backwards' pendant son délai : aucun style modifié en cours de route */
    function rise(w,t){if(!w)return;w.style.transform='';
      w.animate([{transform:'translateY(115%)'},{transform:'translateY(0)'}],{duration:1150,delay:t,easing:RISE,fill:'backwards'})
       .onfinish=function(){w.style.willChange='';};}
    ready(function(){fitGap(); /* trou calé avant le départ : DOG ne bouge plus ensuite */
      requestAnimationFrame(function(){requestAnimationFrame(function(){ /* laisse le loader se retirer avant de démarrer */
      var T={the:0,lazy:180,stk:760,note:1060,arrow:1320,dog:1650,press:3350,click:3530};
      rise(wThe,T.the);rise(wLazy,T.lazy);
      if(hs){hs.style.opacity='';var op=getComputedStyle(hs).opacity;
        hs.animate([{opacity:0,scale:'.85'},{opacity:op,scale:'1'}],{duration:900,delay:T.stk,easing:SOFT,fill:'backwards'});}
      if(hn){hn.style.opacity='';hn.animate([{opacity:0,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:800,delay:T.note,easing:SOFT,fill:'backwards'});}
      hp.forEach(function(pa,i){pa.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:520,delay:T.arrow+i*260,easing:'cubic-bezier(.45,0,.2,1)',fill:'forwards'});});
      /* DOG monte, puis clic simulé une fois le mot écrit : petite pression, collecte (couleur + envol vers la barre) */
      if(hs){setTimeout(function(){if(!hs.classList.contains('is-collected'))hs.animate([{scale:'1'},{scale:'.92',offset:.45},{scale:'1'}],{duration:240,easing:'ease-in-out'});},T.press);
        setTimeout(function(){if(!hs.classList.contains('is-collected'))hs.click();},T.click);}
      rise(wDog,T.dog);
      /* masques relâchés une fois tout en place (le sticker et la note ne sont jamais coupés) */
      setTimeout(function(){bigL.forEach(function(l){l.style.clipPath='none';});},T.dog+1250);
      });});
    });
  }
  /* 1c. Hero à l'arrivée de la section projets :
     - le texte d'intro (h1) s'efface en suivant le scroll ;
     - « THE LAZY DOG » part d'un coup vers le haut (chaque mot sort par le haut de son masque, le sticker et la note
       montent en s'effaçant), puis le showreel disparaît derrière un masque, avec un léger décalage.
     Déclenché quand le haut des projets passe sous 70 % de l'écran ; tout revient quand on remonte (au-dessus de 78 %). */
  var fadeEls=[document.querySelector('.tld-hero__head')].filter(Boolean),reelEl=document.querySelector('.tld-hero .tld-reel'),
      sec2=document.querySelector('.tld-works'),fTick=false,fLast=-1,heroHidden=false,exitAnims=[];
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
    else{exitAnims.forEach(function(a){a.playbackRate=-1;a.play();});
      Promise.all(exitAnims.map(function(a){return a.finished;})).then(function(){
        if(heroHidden)return;exitAnims.forEach(function(a){a.cancel();});exitAnims=[];bigL.forEach(function(l){l.style.clipPath='none';});});}
  }
  function heroScroll(){fTick=false;if(!sec2)return;var t=sec2.getBoundingClientRect().top/window.innerHeight;
    if(t<.7)setHeroHidden(true);else if(t>.78)setHeroHidden(false);
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
