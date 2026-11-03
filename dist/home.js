/*! The Lazy Dog — home.js v1.0.0 — github.com/Cetezer44/thelazydog-webflow-custom-code */
/* --- src/home/loader.js --- */
/* The Lazy Dog — loader de la page d'accueil (maquette « Animation home » Step 0 → 5)
   THE → THE LAZY → THE LAZY DOG → lettres écartées → lettres imbriquées → l'œil se ferme au centre et se rouvre dans le header */
(function(){
  var root=document.documentElement,loader=document.querySelector('.tld-loader');
  if(!loader||!root.classList.contains('tld-loading'))return;
  var stage=loader.querySelector('.tld-loader__stage'),bg=loader.querySelector('.tld-loader__bg');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var E={pop:'cubic-bezier(.34,1.7,.5,1)',move:'cubic-bezier(.77,0,.18,1)',spread:'cubic-bezier(.2,1.45,.35,1)',snap:'cubic-bezier(.8,-0.35,.2,1.35)',out:'cubic-bezier(.55,0,.85,.3)',fly:'cubic-bezier(.7,0,.15,1)'};
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
  function pop(ids,step,t0,gap){ids.forEach(function(id,i){var v=S[step][id];
    set(id,{x:v[0]+rnd(-6,6),y:v[1]+38,r:v[2]+rnd(-28,28),s:.3,o:0});
    to(id,{x:v[0],y:v[1],r:v[2],s:1,o:1},640,t0+i*gap,E.pop);});}
  function move(ids,step,t0,dur,ease,jitter){ids.forEach(function(id,i){var v=S[step][id];
    to(id,{x:v[0],y:v[1],r:v[2]},dur,t0+(jitter?Math.round(rnd(0,jitter)):0),ease);});}
  var THE=['t','h','e'],LAZY=['l','a','z','y'],DOG=['d','o','g'],ALL=THE.concat(LAZY,DOG);
  var eye=document.querySelector('.tld-eye'),OUT='cubic-bezier(.16,1,.3,1)';
  function splitLines(h){ /* découpe le h1 en lignes réelles pour la révélation en masque */
    var txt=h.textContent.replace(/\s+/g,' ').trim(),words=txt.split(' ');h.textContent='';
    var spans=words.map(function(w,i){var s=document.createElement('span');s.textContent=w;h.appendChild(s);if(i<words.length-1)h.appendChild(document.createTextNode(' '));return s;});
    var lines=[],top=null;spans.forEach(function(s){if(s.offsetTop!==top){lines.push([]);top=s.offsetTop;}lines[lines.length-1].push(s.textContent);});
    h.textContent='';
    return {txt:txt,inners:lines.map(function(l){var o=document.createElement('span'),i=document.createElement('span');o.className='tld-line';i.className='tld-line__in';i.textContent=l.join(' ');o.appendChild(i);h.appendChild(o);return i;})};
  }
  function reveal(){ /* entrée de la page : œil qui s'ouvre, h1 ligne par ligne, navigation depuis chaque bord */
    if(eye){eye.animate([{clipPath:'inset(50% 0 50% 0)',transform:'scaleY(.7)'},{clipPath:'inset(-10% 0 -10% 0)',transform:'scaleY(1)'}],{duration:650,easing:'cubic-bezier(.3,1.5,.5,1)',fill:'backwards'});}
    var h=document.querySelector('.tld-hero__title'),last=0;
    if(h){var sp=splitLines(h);sp.inners.forEach(function(el,i){last=i;
      el.animate([{transform:'translateY(110%)'},{transform:'translateY(0)'}],{duration:1000,delay:160+i*130,easing:OUT,fill:'backwards'});});
      setTimeout(function(){h.textContent=sp.txt;},160+last*130+1050);}
    [].forEach.call(document.querySelectorAll('.tld-nav__link'),function(el){
      var c=el.classList,base=getComputedStyle(el).transform;base=(base==='none')?'':' '+base;
      var off=(c.contains('is-tl')||c.contains('is-tr'))?'translateY(-56px)':(c.contains('is-bl')||c.contains('is-br'))?'translateY(56px)':c.contains('is-vl')?'translateX(-56px)':'translateX(56px)';
      el.animate([{transform:off+base,opacity:0},{transform:(base?base.trim():'none'),opacity:1}],{duration:1000,delay:420,easing:OUT,fill:'backwards'});
    });
    [].forEach.call(document.querySelectorAll('.tld-reel'),function(el){
      el.animate([{opacity:0,transform:'translateY(60px)'},{opacity:1,transform:'none'}],{duration:1100,delay:160+(last+1)*130,easing:OUT,fill:'backwards'});
    });
    setTimeout(revealed,160+last*130+650); /* les stickers tombent quand le titre est écrit */
  }
  function revealed(){window.dispatchEvent(new CustomEvent('tld:revealed'));}
  function finish(){
    root.classList.remove('tld-loading');
    loader.parentNode&&loader.parentNode.removeChild(loader);
    if(!reduce)reveal();else revealed();
  }
  if(reduce){bg.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish=finish;return;}
  window.scrollTo(0,0);
  /* Step 0 : THE */
  pop(THE,0,120,80);
  /* Step 1 : THE monte, LAZY arrive */
  move(THE,1,780,520,E.move);pop(LAZY,1,860,70);
  /* Step 2 : tout monte, DOG arrive (l'œil tourne sur lui-même) */
  move(THE.concat(LAZY),2,1480,520,E.move);pop(['d','g'],2,1560,140);
  set('o',{x:0,y:S[2].o[1]+38,r:-200,s:.2,o:0});to('o',{x:0,y:S[2].o[1],r:0,s:1,o:1},760,1620,E.pop);
  /* Step 3 : les lettres s'écartent */
  move(ALL,3,2280,700,E.spread,70);
  /* Step 4 : les lignes se resserrent et s'imbriquent */
  move(ALL,4,3020,520,E.snap,40);
  /* Step 5 : les lettres s'envolent, l'œil se recentre puis se ferme (paupières vers le centre) */
  var t5=3640;
  ALL.forEach(function(id,i){if(id==='o')return;var p=L[id];
    to(id,{x:p.x*1.35+rnd(-20,20),y:p.y+rnd(40,90),r:p.r+rnd(-70,70),s:.2,o:0},520,t5+i*28,E.out);});
  to('o',{x:0,y:0,s:1.25},560,t5,E.move);
  var svgO=L.o.el.querySelector('svg');
  svgO.animate([{clipPath:'inset(0% 0 0% 0)',transform:'scaleY(1)'},{clipPath:'inset(46% 0 46% 0)',transform:'scaleY(.92)',offset:.85},{clipPath:'inset(50% 0 50% 0)',transform:'scaleY(.9)'}],{duration:340,delay:t5+620,easing:'cubic-bezier(.55,0,.75,.2)',fill:'forwards'});
  bg.animate([{opacity:1},{opacity:0}],{duration:420,delay:t5+980,easing:'ease',fill:'forwards'});
  /* l'œil du header s'ouvre ensuite (reveal) */
  setTimeout(finish,t5+1420);
})();

/* --- src/home/stickers.js --- */
/* The Lazy Dog — stickers du hero : chute avec gravité (Matter.js) puis glisser-déposer / lancer.
   Zone de jeu = premier écran ; le showreel est un obstacle (les stickers tombent dessus ou de chaque côté).
   Chaque image [data-sticker] dans .tld-stickers : data-x = point de chute (sur 1440 px), data-y = position si mouvement réduit, data-w = largeur, data-rot = rotation. */
(function(){
  var wrap=document.querySelector('.tld-stickers');if(!wrap)return;
  var hero=wrap.closest('.tld-hero')||wrap.parentNode,reel=document.querySelector('.tld-reel');
  var items=[].slice.call(wrap.querySelectorAll('[data-sticker]'));if(!items.length)return;
  var root=document.documentElement,reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MATTER=wrap.getAttribute('data-matter-src')||'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/build/matter.min.js';
  var W,H,k,R=null;
  function measure(){ /* zone de jeu : le premier écran ; le showreel est un obstacle, les stickers peuvent tomber de chaque côté */
    var top=hero.getBoundingClientRect().top+(window.pageYOffset||0);
    W=hero.clientWidth;H=Math.max(320,(document.documentElement.clientHeight||window.innerHeight)-top);
    wrap.style.height=H+'px';
    k=Math.max(.5,Math.min(1,W/1440));
    R=null;
    if(reel&&reel.offsetParent===hero&&reel.offsetTop<H-8){R={x:reel.offsetLeft,y:reel.offsetTop,w:reel.offsetWidth};}
  }
  function loadImg(img){img.loading='eager';return new Promise(function(res){if(img.complete&&img.naturalWidth)return res();img.addEventListener('load',res,{once:true});img.addEventListener('error',res,{once:true});});}
  function loadMatter(){return new Promise(function(res,rej){if(window.Matter)return res();var s=document.createElement('script');s.src=MATTER;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
  function sizeOf(img){var w=(parseFloat(img.getAttribute('data-w'))||150)*k,r=(img.naturalWidth&&img.naturalHeight)?img.naturalHeight/img.naturalWidth:1;return {w:w,h:w*r};}
  function placeStatic(){ /* mouvement réduit : stickers posés comme sur la maquette */
    items.forEach(function(img){var s=sizeOf(img),x=(parseFloat(img.getAttribute('data-x'))||720)/1440*W,y=(parseFloat(img.getAttribute('data-y'))||400)*k;
      img.style.width=s.w+'px';img.style.transform='translate('+(x-s.w/2)+'px,'+(y-s.h/2)+'px) rotate('+(parseFloat(img.getAttribute('data-rot'))||0)+'deg)';img.style.opacity=1;});
  }
  function start(){
    measure();
    Promise.all(items.map(loadImg)).then(function(){
      if(reduce){placeStatic();return;}
      return loadMatter().then(run);
    }).catch(placeStatic);
  }
  function run(){
    var M=window.Matter,Eng=M.Engine,Bodies=M.Bodies,Body=M.Body,Comp=M.Composite,Con=M.Constraint;
    var engine=Eng.create({enableSleeping:true});engine.gravity.y=1.1;
    var T=400,walls=[];
    function placeWalls(){ /* sol = bas du premier écran, murs gauche/droite, plafond lointain, + le haut du showreel en obstacle */
      if(walls.length)Comp.remove(engine.world,walls);
      walls=[Bodies.rectangle(W/2,H+T/2,W+2*T,T,{isStatic:true}),
        Bodies.rectangle(-T/2,H/2-1500,T,H+3000+2*T,{isStatic:true}),
        Bodies.rectangle(W+T/2,H/2-1500,T,H+3000+2*T,{isStatic:true}),
        Bodies.rectangle(W/2,-3000-T/2,W+2*T,T,{isStatic:true})];
      if(R){walls.push(Bodies.rectangle(R.x+R.w/2,R.y+(H-R.y+T)/2,R.w,H-R.y+T,{isStatic:true,chamfer:{radius:[10,10,0,0]}}));}
      Comp.add(engine.world,walls);
    }
    placeWalls();
    var list=[];
    items.forEach(function(img,i){
      var s=sizeOf(img),a=s.w/s.h,opt={restitution:.32,friction:.35,frictionAir:.012,density:.0016,angle:(parseFloat(img.getAttribute('data-rot'))||0)*Math.PI/180};
      var x=Math.min(W-s.w/2,Math.max(s.w/2,(parseFloat(img.getAttribute('data-x'))||720)/1440*W));
      var y=-s.h-40-i*90;
      var body=(a>.85&&a<1.18)?Bodies.circle(x,y,Math.min(s.w,s.h)/2*.95,opt):Bodies.rectangle(x,y,s.w*.94,s.h*.86,Object.assign({chamfer:{radius:Math.min(s.w,s.h)*.3}},opt));
      img.style.width=s.w+'px';img._b=body;img._s=s;body._img=img;
      list.push({img:img,body:body,delay:i*160});
    });
    /* chute échelonnée */
    list.forEach(function(it){setTimeout(function(){Body.setAngularVelocity(it.body,(Math.random()-.5)*.12);Comp.add(engine.world,it.body);it.img.style.opacity=1;},it.delay);});
    function sync(){list.forEach(function(it){var b=it.body,s=it.img._s;it.img.style.transform='translate('+(b.position.x-s.w/2)+'px,'+(b.position.y-s.h/2)+'px) rotate('+b.angle+'rad)';});}
    /* boucle (pas fixe, mise en pause quand le hero n'est pas visible) */
    var raf=null,last=0,visible=true;
    function loop(t){raf=requestAnimationFrame(loop);var dt=last?Math.min(32,t-last):16.67;last=t;Eng.update(engine,dt);sync();}
    function play(){if(!raf){last=0;raf=requestAnimationFrame(loop);}}
    function pause(){if(raf){cancelAnimationFrame(raf);raf=null;}}
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;visible?play():pause();}).observe(wrap);}
    play();
    /* glisser-déposer : la souris ou le doigt tire le sticker par un ressort, on peut le lancer */
    var drag=null;
    function local(e){var r=wrap.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
    list.forEach(function(it){
      it.img.addEventListener('pointerdown',function(e){
        e.preventDefault();var p=local(e),b=it.body;M.Sleeping.set(b,false);
        var off=M.Vector.rotate({x:p.x-b.position.x,y:p.y-b.position.y},-b.angle);
        drag={c:Con.create({pointA:p,bodyB:b,pointB:off,length:0,stiffness:.18,damping:.08}),img:it.img,id:e.pointerId};
        Comp.add(engine.world,drag.c);it.img.setPointerCapture&&it.img.setPointerCapture(e.pointerId);
        it.img.style.filter='drop-shadow(0 18px 26px rgba(22,20,15,.22))';wrap.appendChild(it.img); /* passe au premier plan */
      });
    });
    window.addEventListener('pointermove',function(e){if(drag&&e.pointerId===drag.id){drag.c.pointA=local(e);}},{passive:true});
    function release(e){if(!drag||(e&&e.pointerId!==drag.id))return;Comp.remove(engine.world,drag.c);drag.img.style.filter='';drag=null;}
    window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
    /* redimensionnement : on recale les murs et on garde les stickers dans la zone */
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){measure();placeWalls();
      list.forEach(function(it){var b=it.body,s=it.img._s;var y=Math.min(H-s.h/2,b.position.y);if(R&&b.position.x>R.x-s.w/2&&b.position.x<R.x+R.w+s.w/2)y=Math.min(y,R.y-s.h/2);Body.setPosition(b,{x:Math.min(W-s.w/2,Math.max(s.w/2,b.position.x)),y:y});M.Sleeping.set(b,false);});},150);});
  }
  /* démarrage : après le loader (évènement tld:revealed), sinon dès le chargement */
  function go(){if(wrap._started)return;wrap._started=true;start();}
  if(root.classList.contains('tld-loading')){window.addEventListener('tld:revealed',go,{once:true});setTimeout(go,9000);}
  else if(document.readyState==='complete'){setTimeout(go,200);}else{window.addEventListener('load',function(){setTimeout(go,200);});}
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
