/*! The Lazy Dog — home.js v1.6.0 — github.com/Cetezer44/thelazydog-webflow-custom-code */
/* --- src/home/loader.js --- */
/* The Lazy Dog — loader de la page d'accueil (maquette « Animation home » Step 0 → 5)
   THE → THE LAZY → THE LAZY DOG → lettres écartées → lettres imbriquées → l'œil se ferme (paupière ovale) et se rouvre dans le header (Steps 5 → 9) */
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
  /* paupière : masque ovale (relevé sur les Steps 5 → 9 de la maquette). Valeurs [centre Y, rayon X, rayon Y] en unités de l'œil (43,2 px) */
  var LID_CLOSE=[[-5.6,55,2],[12.4,31,14],[25.4,31,27]],LID_OPEN=[[25.4,31,27],[12.4,31,14],[-1.1,31,.5]];
  function setLid(el,v){var u=el.offsetWidth/43.2,m='radial-gradient(ellipse '+(v[1]*u)+'px '+(v[2]*u)+'px at '+(el.offsetWidth/2)+'px '+(v[0]*u)+'px, transparent 97%, #000 100%)';
    el.style.webkitMaskImage=m;el.style.maskImage=m;el.style.webkitMaskRepeat=el.style.maskRepeat='no-repeat';}
  function clearLid(el){el.style.webkitMaskImage=el.style.maskImage='';}
  function lid(el,fr,dur,delay,ease,done){setTimeout(function(){var t0=null;
    function step(now){if(t0===null)t0=now;var p=Math.min(1,(now-t0)/dur),e=ease(p),seg=(fr.length-1)*e,i=Math.min(fr.length-2,Math.max(0,Math.floor(seg))),f=seg-i,a=fr[i],b=fr[i+1];
      setLid(el,[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]);if(p<1)requestAnimationFrame(step);else if(done)done();}
    requestAnimationFrame(step);},delay||0);}
  function easeIn(p){return p*p*(3-2*p);} /* fermeture douce au début et à la fin */
  function easeOut(p){var q=1-p;return 1-q*q*q;}
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
    if(eye){lid(eye,LID_OPEN,560,140,easeOut,function(){clearLid(eye);});}
    var h=document.querySelector('.tld-hero__title'),last=0;
    if(h){var sp=splitLines(h);sp.inners.forEach(function(el,i){last=i;
      el.animate([{transform:'translateY(110%)'},{transform:'translateY(0)'}],{duration:1000,delay:160+i*130,easing:OUT,fill:'backwards'});});
      setTimeout(function(){h.innerHTML=sp.html;},160+last*130+1050);}
    [].forEach.call(document.querySelectorAll('.tld-nav__link'),function(el){
      var c=el.classList,base=getComputedStyle(el).transform;base=(base==='none')?'':' '+base;
      var r=el.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight,dl=r.left,dr=vw-r.right,dt=r.top,db=vh-r.bottom,m=Math.min(dl,dr,dt,db); /* arrive par le bord le plus proche */
      var off=m===dt?'translateY(-56px)':m===db?'translateY(56px)':m===dl?'translateX(-56px)':'translateX(56px)';
      el.animate([{transform:off+base,opacity:0},{transform:(base?base.trim():'none'),opacity:1}],{duration:1000,delay:420,easing:OUT,fill:'backwards'});
    });
    [].forEach.call(document.querySelectorAll('.tld-reel'),function(el){
      el.animate([{opacity:0,transform:'translateY(60px)'},{opacity:1,transform:'none'}],{duration:1100,delay:160+(last+1)*130,easing:OUT,fill:'backwards'});
    });
    setTimeout(revealed,160+last*130+650); /* les stickers tombent quand le titre est écrit */
  }
  function revealed(){window.dispatchEvent(new CustomEvent('tld:revealed'));}
  function finish(){
    if(eye&&!reduce)setLid(eye,LID_OPEN[0]); /* l'œil du header apparaît fermé */
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
  /* Step 5 : les autres lettres s'envolent */
  var t5=3640;
  ALL.forEach(function(id,i){if(id==='o')return;var p=L[id];
    to(id,{x:p.x*1.35+rnd(-20,20),y:p.y+rnd(40,90),r:p.r+rnd(-70,70),s:.2,o:0},520,t5+i*28,E.out);});
  /* l'œil reste en place : la paupière ovale descend et le ferme (Steps 5 → 7) */
  lid(L.o.el,LID_CLOSE,440,t5+380,easeIn);
  bg.animate([{opacity:1},{opacity:0}],{duration:400,delay:t5+900,easing:'ease',fill:'forwards'});
  /* l'œil du header se rouvre ensuite (Steps 8 → 9, dans reveal) */
  setTimeout(finish,t5+1320);
})();

/* --- src/home/stickers.js --- */
/* The Lazy Dog — stickers du hero : chute avec gravité (Matter.js), la souris les pousse au survol (tap = saut sur mobile).
   Zone de jeu = toute la page sous le haut du hero. Le « sol » suit le bas de l'écran : quand on scrolle, les stickers
   continuent de tomber, sauf si un élément les arrête (showreel, visuels des projets, ou tout élément [data-sticker-stop]).
   Chaque image [data-sticker] dans .tld-stickers : data-x = point de chute (sur 1440 px), data-y = position si mouvement réduit, data-w = largeur, data-rot = rotation.
   Réglages sur .tld-stickers : data-scale (taille, défaut 1.25), data-gravity (gravité, défaut 0.55) et data-bounce (rebond, défaut 0.75), data-push (force de la souris, défaut 1). */
(function(){
  var wrap=document.querySelector('.tld-stickers');if(!wrap)return;
  var hero=wrap.closest('.tld-hero')||wrap.parentNode,reel=document.querySelector('.tld-reel');
  var items=[].slice.call(wrap.querySelectorAll('[data-sticker]'));if(!items.length)return;
  var root=document.documentElement,reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MATTER=wrap.getAttribute('data-matter-src')||'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/build/matter.min.js';
  var SCALE=parseFloat(wrap.getAttribute('data-scale'))||1.25;   /* taille des stickers (1 = maquette) */
  var GRAVITY=parseFloat(wrap.getAttribute('data-gravity'))||0.55; /* gravité (1 = « terrestre ») */
  var BOUNCE=parseFloat(wrap.getAttribute('data-bounce'));if(isNaN(BOUNCE))BOUNCE=0.75; /* rebond (0 = aucun, 1 = maximum) */
  var W,H,k,top0=0;
  function measure(){ /* zone de jeu : du haut du hero jusqu'en bas de la page */
    top0=hero.getBoundingClientRect().top+(window.pageYOffset||0);
    wrap.style.height='0px';
    var docH=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    W=hero.clientWidth;H=Math.max(320,docH-top0);
    wrap.style.height=H+'px';
    k=Math.max(.5,Math.min(1,W/1440))*SCALE;
  }
  function stops(){ /* éléments qui arrêtent les stickers */
    return [].slice.call(document.querySelectorAll('.tld-reel,.tld-work__media,[data-sticker-stop]'));
  }
  function screenBottom(){return Math.min(H,(window.innerHeight||document.documentElement.clientHeight)-wrap.getBoundingClientRect().top);}
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
    var engine=Eng.create({enableSleeping:true});engine.gravity.y=GRAVITY;
    var T=400,walls=[],obs=[],floor=null,floorY=0;
    function rel(el){var r=el.getBoundingClientRect(),w=wrap.getBoundingClientRect();return {x:r.left-w.left,y:r.top-w.top,w:r.width,h:r.height};}
    function wakeAll(){Comp.allBodies(engine.world).forEach(function(b){if(!b.isStatic)M.Sleeping.set(b,false);});}
    function placeWalls(){ /* murs gauche/droite + plafond lointain ; sol = bas de l'écran (ne remonte jamais) ; obstacles = éléments « stop » */
      if(walls.length)Comp.remove(engine.world,walls);
      if(obs.length)Comp.remove(engine.world,obs.map(function(o){return o.body;}));
      walls=[Bodies.rectangle(-T/2,H/2-1500,T,H+3000+2*T,{isStatic:true}),
        Bodies.rectangle(W+T/2,H/2-1500,T,H+3000+2*T,{isStatic:true}),
        Bodies.rectangle(W/2,-3000-T/2,W+2*T,T,{isStatic:true})];
      floorY=Math.max(floorY,screenBottom());
      floor=Bodies.rectangle(W/2,floorY+T/2,W+2*T,T,{isStatic:true});walls.push(floor);
      obs=[];
      stops().forEach(function(el){var r=rel(el);if(r.w<4||r.h<4)return;
        var b=Bodies.rectangle(r.x+r.w/2,r.y+r.h/2,r.w,r.h,{isStatic:true,chamfer:{radius:Math.min(8,r.h/2)}});
        obs.push({el:el,body:b,w:r.w,h:r.h});});
      Comp.add(engine.world,walls.concat(obs.map(function(o){return o.body;})));
    }
    function track(){ /* le sol descend avec le scroll ; les obstacles suivent leur élément (parallax compris) */
      var moved=false,f=Math.max(floorY,screenBottom());
      if(f>floorY+.5){floorY=f;Body.setPosition(floor,{x:W/2,y:floorY+T/2});moved=true;}
      obs.forEach(function(o){var r=rel(o.el);if(Math.abs(r.w-o.w)>1||Math.abs(r.h-o.h)>1){needRebuild=true;return;}
        var c={x:r.x+r.w/2,y:r.y+r.h/2},p=o.body.position;
        if(Math.abs(c.x-p.x)>.3||Math.abs(c.y-p.y)>.3){Body.setPosition(o.body,c);moved=true;}});
      if(moved)wakeAll();
    }
    var needRebuild=false;
    placeWalls();
    var list=[];
    items.forEach(function(img,i){
      var s=sizeOf(img),a=s.w/s.h,opt={restitution:BOUNCE,friction:.3,frictionAir:.018,density:.0016,angle:(parseFloat(img.getAttribute('data-rot'))||0)*Math.PI/180};
      var x=Math.min(W-s.w/2,Math.max(s.w/2,(parseFloat(img.getAttribute('data-x'))||720)/1440*W));
      var y=-s.h-40-i*90;
      var body=(a>.85&&a<1.18)?Bodies.circle(x,y,Math.min(s.w,s.h)/2*.95,opt):Bodies.rectangle(x,y,s.w*.94,s.h*.86,Object.assign({chamfer:{radius:Math.min(s.w,s.h)*.3}},opt));
      img.style.width=s.w+'px';img.style.pointerEvents='none';img.style.touchAction='auto';img._b=body;img._s=s;body._img=img;
      list.push({img:img,body:body,delay:i*160});
    });
    /* chute échelonnée */
    list.forEach(function(it){setTimeout(function(){Body.setAngularVelocity(it.body,(Math.random()-.5)*.12);Comp.add(engine.world,it.body);it.img.style.opacity=1;},it.delay);});
    function sync(){list.forEach(function(it){var b=it.body,s=it.img._s;it.img.style.transform='translate('+(b.position.x-s.w/2)+'px,'+(b.position.y-s.h/2)+'px) rotate('+b.angle+'rad)';});}
    /* boucle (pas fixe, mise en pause quand le hero n'est pas visible) */
    var raf=null,last=0,visible=true;
    function rescue(){ /* garde-fou : un sticker sorti de la zone (ou invalide) est remis en haut et retombe */
      list.forEach(function(it){var b=it.body,s=it.img._s,q=b.position;
        if(!isFinite(q.x)||!isFinite(q.y)||q.y>floorY+s.h||q.x<-s.w||q.x>W+s.w){
          Body.setPosition(b,{x:Math.min(W-s.w/2,Math.max(s.w/2,isFinite(q.x)?q.x:W/2)),y:-s.h});Body.setVelocity(b,{x:0,y:0});Body.setAngularVelocity(b,0);}});
    }
    function loop(t){raf=requestAnimationFrame(loop);var dt=last?Math.max(8,Math.min(16.667,t-last)):16.667;last=t;if(needRebuild){needRebuild=false;placeWalls();}track();Eng.update(engine,dt);rescue();sync();}
    function play(){if(!raf){last=0;raf=requestAnimationFrame(loop);}}
    function pause(){if(raf){cancelAnimationFrame(raf);raf=null;}}
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;visible?play():pause();}).observe(wrap);}
    play();
    /* interaction : la souris pousse les stickers au survol (pas de glisser-déposer) ; au doigt, un tap fait sauter le sticker */
    var bodies=list.map(function(it){return it.body;}),prev=null,PUSH=parseFloat(wrap.getAttribute('data-push'))||1;
    function local(e){var r=wrap.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
    function cap(v,m){var l=Math.sqrt(v.x*v.x+v.y*v.y);return l>m?{x:v.x/l*m,y:v.y/l*m}:v;}
    window.addEventListener('pointermove',function(e){
      if(!visible||(e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')){prev=null;return;}
      var p=local(e),d=prev?{x:p.x-prev.x,y:p.y-prev.y}:null;prev=p;if(!d)return;
      var sp=Math.sqrt(d.x*d.x+d.y*d.y);if(sp<1)return;
      M.Query.point(bodies,p).forEach(function(b){
        M.Sleeping.set(b,false);
        var v=cap({x:b.velocity.x+d.x*.12*PUSH,y:b.velocity.y+d.y*.12*PUSH-.6*PUSH},14);
        Body.setVelocity(b,v);
        var rx=p.x-b.position.x,ry=p.y-b.position.y;
        Body.setAngularVelocity(b,Math.max(-.25,Math.min(.25,b.angularVelocity+(rx*d.y-ry*d.x)*.00008*PUSH)));
      });
    },{passive:true});
    document.addEventListener('pointerleave',function(){prev=null;});
    window.addEventListener('pointerdown',function(e){
      if(!visible||!e.pointerType||e.pointerType==='mouse')return;
      M.Query.point(bodies,local(e)).forEach(function(b){M.Sleeping.set(b,false);
        Body.setVelocity(b,{x:(Math.random()-.5)*6,y:-9*PUSH});Body.setAngularVelocity(b,(Math.random()-.5)*.3);});
    },{passive:true});
    /* redimensionnement (fenêtre ou hauteur de la page) : on recale la zone, les murs et les stickers */
    var rt;function refit(){clearTimeout(rt);rt=setTimeout(function(){measure();floorY=Math.min(floorY,H);placeWalls();
      list.forEach(function(it){var b=it.body,s=it.img._s;Body.setPosition(b,{x:Math.min(W-s.w/2,Math.max(s.w/2,b.position.x)),y:Math.min(floorY-s.h/2,b.position.y)});M.Sleeping.set(b,false);});},150);}
    window.addEventListener('resize',refit);
    if('ResizeObserver' in window){var lastH=document.body.offsetHeight;new ResizeObserver(function(){var h=document.body.offsetHeight;if(Math.abs(h-lastH)>2){lastH=h;refit();}}).observe(document.body);}
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

/* --- src/home/words.js --- */
/* The Lazy Dog — texte qui s'écrit mot par mot.
   Tout élément [data-words] : quand il entre dans l'écran, ses mots apparaissent un par un, à leur rythme
   (indépendamment de la vitesse du scroll). Le gras, les liens, etc. sont conservés.
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
  if(!('IntersectionObserver' in window)){els.forEach(play);return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){play(e.target);io.unobserve(e.target);}});},{rootMargin:'0px 0px -15% 0px',threshold:.15});
  els.forEach(function(el){io.observe(el);});
})();

/* --- src/home/parallax.js --- */
/* The Lazy Dog — parallax au scroll.
   [data-parallax] (cadre en overflow:hidden) : l'image à l'intérieur glisse plus lentement que le cadre. Valeur = amplitude (défaut 0.12 = 12 % de la hauteur).
   [data-speed] : l'élément entier avance plus vite ou plus lentement que la page (ex. 0.1 = 10 % de la hauteur de l'écran).
   [data-speeds="0,0.08,…"] sur une liste : une vitesse par élément de la liste. Désactivé sur mobile. */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var frames=[].slice.call(document.querySelectorAll('[data-parallax]')).map(function(el){
    var img=el.querySelector('img');if(!img)return null;
    var a=parseFloat(el.getAttribute('data-parallax'));if(!(a>0))a=.12;
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
