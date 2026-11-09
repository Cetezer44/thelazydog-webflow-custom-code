/*! The Lazy Dog — home.js v4.1.0 — github.com/Cetezer44/thelazydog-webflow-custom-code */
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
    if(eye){eye.animate([{transform:'scale(0) rotate(-120deg)'},{transform:'scale(1.12) rotate(8deg)',offset:.7},{transform:'none'}],{duration:720,delay:60,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'});}
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
  var pile=PILE.filter(function(p){return srcs[p[0]];});
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
    p.el.animate([{transform:up,clipPath:'inset(0 0 '+D+'px 0)'},{transform:base,clipPath:'inset(0 0 0px 0)'}],{duration:820,delay:O+100+i*140,easing:OUT,fill:'backwards'});});});
  /* Step 1 : les lettres s'écartent */
  move(ALL,3,O+1350,720,E.spread,70);
  /* Step 2 : les lignes se resserrent et s'imbriquent */
  move(ALL,4,O+2150,540,E.snap,40);
  /* Step 5 : les autres lettres s'envolent, il ne reste que l'œil */
  var t5=O+2850;
  ALL.forEach(function(id,i){if(id==='o')return;var p=L[id];
    to(id,{x:p.x*1.35+rnd(-20,20),y:p.y+rnd(40,90),r:p.r+rnd(-70,70),s:.2,o:0},520,t5+i*28,E.out);});
  /* l'œil disparaît en scale (avec une petite anticipation)… */
  L.o.el.animate([{transform:tf(L.o)},{transform:tf({x:L.o.x,y:L.o.y,r:0,s:1.18}),offset:.35},{transform:tf({x:L.o.x,y:L.o.y,r:90,s:0})}],{duration:520,delay:t5+560,easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
  bg.animate([{opacity:1},{opacity:0}],{duration:420,delay:t5+960,easing:'ease',fill:'forwards'});
  /* …et réapparaît en scale dans le header (dans reveal) */
  setTimeout(finish,t5+1180);
})();

/* --- src/home/stickers.js --- */
/* The Lazy Dog — stickers du hero : chute avec gravité (Matter.js), la souris les pousse au survol (tap = saut sur mobile).
   Zone de jeu = premier écran ; le showreel est un obstacle (les stickers tombent dessus ou de chaque côté).
   Au scroll, les stickers sont éjectés par les côtés ; ils ne retombent que si l'on revient tout en haut de la page.
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
  var W,H,k,R=null;
  function measure(){ /* zone de jeu : le premier écran ; le showreel est un obstacle, les stickers peuvent tomber de chaque côté */
    var top=hero.getBoundingClientRect().top+(window.pageYOffset||0);
    W=hero.clientWidth;H=Math.max(320,(document.documentElement.clientHeight||window.innerHeight)-top);
    wrap.style.height=H+'px';wrap.style.overflow='hidden';
    k=Math.max(.5,Math.min(1,W/1440))*SCALE;
    R=null;
    if(reel&&reel.offsetParent===hero&&reel.offsetTop<H-8){R={x:reel.offsetLeft,y:reel.offsetTop,w:reel.offsetWidth,h:Math.min(reel.offsetHeight,H-reel.offsetTop)};}
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
    var engine=Eng.create({enableSleeping:true});engine.gravity.y=GRAVITY;
    var T=400,walls=[],out=false;
    function placeWalls(){ /* sol = bas du premier écran, murs gauche/droite, plafond lointain, + le haut du showreel en obstacle */
      if(walls.length)Comp.remove(engine.world,walls);
      walls=[Bodies.rectangle(W/2,H+T/2,W+6*T,T,{isStatic:true}),
        Bodies.rectangle(W/2,-3000-T/2,W+6*T,T,{isStatic:true})];
      if(!out)walls.push(Bodies.rectangle(-T/2,H/2-1500,T,H+3000+2*T,{isStatic:true}),Bodies.rectangle(W+T/2,H/2-1500,T,H+3000+2*T,{isStatic:true}));
      if(R){walls.push(Bodies.rectangle(R.x+R.w/2,R.y+R.h/2,R.w,R.h,{isStatic:true,chamfer:{radius:5}})); /* le showreel arrête les stickers */}
      Comp.add(engine.world,walls);
    }
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
    var dropT=[];function inWorld(b){return engine.world.bodies.indexOf(b)>-1;}
    list.forEach(function(it){dropT.push(setTimeout(function(){if(out||inWorld(it.body))return;Body.setAngularVelocity(it.body,(Math.random()-.5)*.12);Comp.add(engine.world,it.body);it.img.style.opacity=1;},it.delay));});
    function sync(){list.forEach(function(it){var b=it.body,s=it.img._s;it.img.style.transform='translate('+(b.position.x-s.w/2)+'px,'+(b.position.y-s.h/2)+'px) rotate('+b.angle+'rad)';});}
    /* boucle (pas fixe, mise en pause quand le hero n'est pas visible) */
    var raf=null,last=0,visible=true;
    function rescue(){ /* garde-fou : un sticker sorti de la zone (ou invalide) est remis en haut et retombe */
      if(out){list.forEach(function(it){var b=it.body,s=it.img._s,q=b.position;if(inWorld(b)&&(q.x<-s.w*1.5||q.x>W+s.w*1.5||q.y>H+s.h))Comp.remove(engine.world,b);});return;}
      list.forEach(function(it){var b=it.body,s=it.img._s,q=b.position;
        if(!isFinite(q.x)||!isFinite(q.y)||q.y>H+s.h||q.x<-s.w||q.x>W+s.w){
          Body.setPosition(b,{x:Math.min(W-s.w/2,Math.max(s.w/2,isFinite(q.x)?q.x:W/2)),y:-s.h});Body.setVelocity(b,{x:0,y:0});Body.setAngularVelocity(b,0);}});
    }
    function loop(t){raf=requestAnimationFrame(loop);var dt=last?Math.max(8,Math.min(16.667,t-last)):16.667;last=t;Eng.update(engine,dt);rescue();sync();}
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
    /* scroll : dès qu'on quitte le haut de la page, les stickers partent par le côté le plus proche ;
       ils ne reviennent (nouvelle chute) que lorsqu'on revient tout en haut */
    function eject(){
      out=true;dropT.forEach(clearTimeout);dropT=[];placeWalls();play();
      list.forEach(function(it){var b=it.body;if(!inWorld(b))Comp.add(engine.world,b);
        M.Sleeping.set(b,false);var dir=b.position.x<W/2?-1:1;
        Body.setVelocity(b,{x:dir*(16+Math.random()*8),y:-4-Math.random()*5});Body.setAngularVelocity(b,dir*(.12+Math.random()*.15));});
    }
    function comeBack(){
      out=false;placeWalls();
      list.forEach(function(it,i){var b=it.body,s=it.img._s;Comp.remove(engine.world,b);
        var x=Math.min(W-s.w/2,Math.max(s.w/2,(parseFloat(it.img.getAttribute('data-x'))||720)/1440*W));
        Body.setPosition(b,{x:x,y:-s.h-40-i*90});Body.setVelocity(b,{x:0,y:0});Body.setAngle(b,(parseFloat(it.img.getAttribute('data-rot'))||0)*Math.PI/180);
        it.img.style.opacity=1;dropT.push(setTimeout(function(){if(out||inWorld(b))return;Body.setAngularVelocity(b,(Math.random()-.5)*.12);Comp.add(engine.world,b);},it.delay));});
      play();
    }
    function onScroll(){var y=window.pageYOffset||document.documentElement.scrollTop||0;
      if(!out&&y>40)eject();else if(out&&y<=2)comeBack();}
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
    /* redimensionnement : on recale les murs et on garde les stickers dans la zone */
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){measure();placeWalls();if(out)return;
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

/* --- src/home/reel-grow.js --- */
/* The Lazy Dog — showreel qui grandit au scroll.
   Au départ le showreel est carré (data-grow-from, défaut 350 px) ; en scrollant il s'élargit jusqu'à data-grow-to
   (défaut 0.7 = 70 % de la largeur de l'écran) en prenant le format 16:9 (data-grow-ratio, défaut 16/9).
   La place finale est réservée dès le départ : le reste de la page ne bouge pas pendant l'animation.
   data-grow-fill : la section du showreel prend toute la hauteur de l'écran (showreel centré, la section suivante
   commence au bas de l'écran une fois arrivé).
   (Les ancres de scroll sont gérées par snap.js.) */
(function(){
  var reel=document.querySelector('[data-grow]');if(!reel)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FROM=parseFloat(reel.getAttribute('data-grow-from'))||350,TO=parseFloat(reel.getAttribute('data-grow-to'))||.7;
  var RATIO=(function(r){if(!r)return 16/9;var m=r.split('/');return m.length===2?parseFloat(m[0])/parseFloat(m[1]):parseFloat(r)||16/9;})(reel.getAttribute('data-grow-ratio'));
  var top0=0,vw=0,vh=0,box=0,w0,w1,h1,ticking=false;
  function ease(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;}
  function measure(){
    vw=document.documentElement.clientWidth;vh=window.innerHeight;
    box=reel.parentNode.clientWidth-(parseFloat(getComputedStyle(reel.parentNode).paddingLeft)||0)-(parseFloat(getComputedStyle(reel.parentNode).paddingRight)||0);
    if(!(box>0))box=vw;w1=vw<768?box:Math.min(vw*TO,box);
    h1=w1/RATIO;w0=Math.min(FROM,w1*.7);
    var y=0,el=reel;while(el){y+=el.offsetTop;el=el.offsetParent;}top0=y;
  }
  function endY(){return Math.max(1,top0-(vh-h1)/2);}
  function update(){
    ticking=false;
    var end=Math.max(1,top0-(vh-h1)/2),p=reduce?1:Math.max(0,Math.min(1,(window.pageYOffset||0)/end)),e=ease(p);
    var w=w0+(w1-w0)*e,h=w0+(h1-w0)*e;
    reel.style.width=w.toFixed(1)+'px';reel.style.height=h.toFixed(1)+'px';
    var extra=reel.hasAttribute('data-grow-fill')?Math.max(0,(vh-h1)/2):0;
    reel.style.marginBottom=(h1-h+extra).toFixed(1)+'px'; /* garde la hauteur finale réservée (+ bas de l'écran si data-grow-fill) */
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  function init(){measure();update();}
  init();
  window.addEventListener('scroll',req,{passive:true});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(init,120);});
  window.addEventListener('load',init);
})();

/* --- src/home/build-section.js --- */
/* The Lazy Dog — section « fond qui se construit » (section jaune de la page d'accueil).
   [data-build] : quand la section arrive à l'écran, son fond [data-build-bg] se construit de bas en haut,
   puis le texte [data-words][data-words-wait] s'écrit mot par mot.
   Au survol d'une catégorie [data-hover-cat] (attribut data-image = image de la catégorie), le fond devient cette image,
   sans transition ; sans survol, seul le fond de couleur et la phrase restent. Classes : .is-hover / .is-on. */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(document.querySelectorAll('[data-build]'),function(sec){
    var bg=sec.querySelector('[data-build-bg]'),words=sec.querySelector('[data-words-wait]');
    var D=parseFloat(sec.getAttribute('data-build-duration'))||900;
    function go(){
      if(sec._built)return;sec._built=true;
      if(bg&&!reduce){bg.style.transition='transform '+D+'ms cubic-bezier(.77,0,.18,1)';bg.style.transform='scaleY(1)';}
      setTimeout(function(){if(words)words.dispatchEvent(new CustomEvent('tld:words'));},reduce?0:D*.85);
    }
    if(bg&&!reduce){bg.style.transformOrigin='50% 100%';bg.style.transform='scaleY(0)';}
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){go();io.disconnect();}},{threshold:.35});io.observe(sec);}else go();
    /* images au survol des catégories */
    var cats=[].slice.call(sec.querySelectorAll('[data-hover-cat]'));if(!cats.length)return;
    var layer=document.createElement('div');layer.className='tld-hover-media';layer.setAttribute('aria-hidden','true');
    sec.insertBefore(layer,bg?bg.nextSibling:sec.firstChild);
    var imgs={},active=null;
    cats.forEach(function(cat){var u=cat.getAttribute('data-image');if(!u||imgs[u])return;
      var im=document.createElement('img');im.alt='';im.decoding='async';im.loading='lazy';im.src=u;layer.appendChild(im);imgs[u]=im;});
    function on(cat){if(active)active.classList.remove('is-on');active=cat;cat.classList.add('is-on');sec.classList.add('is-hover');
      var u=cat.getAttribute('data-image');for(var k in imgs)imgs[k].classList.toggle('is-on',k===u);}
    function off(cat){if(active!==cat)return;cat.classList.remove('is-on');active=null;sec.classList.remove('is-hover');for(var k in imgs)imgs[k].classList.remove('is-on');}
    cats.forEach(function(cat){
      cat.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')on(cat);});
      cat.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch')off(cat);});
      cat.addEventListener('focus',function(){on(cat);});cat.addEventListener('blur',function(){off(cat);});
    });
  });
})();

/* --- src/home/projects.js --- */
/* The Lazy Dog — projets qui défilent au scroll.
   [data-projects] : la section ; [data-projects-pin] : le bloc épinglé à l'écran ; [data-col] : les colonnes du fond (4) ;
   les projets sont les éléments .w-dyn-item (ou [data-project]) de la section. En scrollant, la colonne du projet en cours
   se remplit de bas en haut ; quand elle est pleine, on passe au projet suivant (et à la colonne suivante).
   data-projects-step (défaut 0.8) = scroll par projet, en hauteur d'écran. Classe .is-active sur le projet affiché. */
(function(){
  var sec=document.querySelector('[data-projects]');if(!sec)return;
  var pin=sec.querySelector('[data-projects-pin]'),items=[].slice.call(sec.querySelectorAll('[data-project],.w-dyn-item'));
  var cols=[].slice.call(sec.querySelectorAll('[data-col]')).map(function(c){return c.firstElementChild||c;});
  if(!pin||!items.length)return;
  var n=items.length,C=cols.length||1,STEP=parseFloat(sec.getAttribute('data-projects-step'))||.8,cur=-1,ticking=false;
  cols.forEach(function(f){f.style.transformOrigin='50% 100%';f.style.transform='scaleY(0)';f.style.willChange='transform';});
  function layout(){var vh=window.innerHeight;sec.style.height=(vh+n*STEP*vh)+'px';pin.style.position='sticky';pin.style.top='0px';pin.style.height=vh+'px';update();}
  function set(i){if(i===cur)return;cur=i;items.forEach(function(it,j){it.classList.toggle('is-active',j===i);it.setAttribute('aria-hidden',j===i?'false':'true');});}
  function update(){
    ticking=false;
    var r=sec.getBoundingClientRect(),vh=window.innerHeight,len=Math.max(1,r.height-vh);
    var t=Math.max(0,Math.min(.99999,-r.top/len)),x=t*n,i=Math.floor(x),local=x-i;
    set(i);
    var c=i%C; /* colonnes du « tour » en cours : pleines avant, en cours, vides après */
    cols.forEach(function(f,j){var v=j<c?1:j===c?local:0;f.style.transform='scaleY('+v.toFixed(4)+')';});
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,120);});
  window.addEventListener('load',layout);layout();
})();

/* --- src/home/snap.js --- */
/* The Lazy Dog — ancres de scroll douces entre les sections.
   Chaque section [data-snap] est une ancre : depuis la section précédente, un geste de scroll vers le bas emmène en douceur
   en haut de cette section (et un geste vers le haut ramène à la précédente). Le premier écran (haut de page) est l'ancre de départ.
   Une section plus haute que l'écran (ex. projets épinglés) se scrolle normalement jusqu'à sa fin, puis l'ancre suivante prend le relais.
   Réglage sur <body> ou sur la première ancre : data-snap-duration (ms, défaut 1700). L'inertie du trackpad est ignorée. */
(function(){
  var secs=[].slice.call(document.querySelectorAll('[data-snap]'));if(!secs.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var root=document.documentElement,DUR=parseFloat(document.body.getAttribute('data-snap-duration')||secs[0].getAttribute('data-snap-duration'))||1700;
  var anim=null,lock=0,fresh=true,lastW=0;
  function soft(k){return -(Math.cos(Math.PI*k)-1)/2;} /* easeInOutSine */
  function docTop(el){var y=0;while(el){y+=el.offsetTop;el=el.offsetParent;}return y;}
  /* zones de saut : [fin de la section précédente, haut de la section suivante] */
  function zones(){
    var vh=window.innerHeight,z=[],prev=0;
    secs.forEach(function(el){var t=docTop(el);if(t>prev+8)z.push([prev,t]);prev=t+Math.max(0,el.offsetHeight-vh);});
    return z;
  }
  function target(dir){
    var y=window.pageYOffset||0,z=zones();
    for(var i=0;i<z.length;i++){var a=z[i][0],b=z[i][1];
      if(dir>0&&y>=a-4&&y<b-4)return b;
      if(dir<0&&y>a+4&&y<=b+4)return a;}
    return null;
  }
  function inZone(){var y=window.pageYOffset||0,z=zones();for(var i=0;i<z.length;i++)if(y>=z[i][0]-4&&y<=z[i][1]+4)return true;return false;}
  function go(to){
    var from=window.pageYOffset||0,t0=null,D=DUR*Math.min(1,Math.max(.6,Math.abs(to-from)/window.innerHeight));
    if(anim)cancelAnimationFrame(anim);lock=Date.now()+D;fresh=false;root.style.scrollBehavior='auto';
    anim=requestAnimationFrame(function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/D);window.scrollTo(0,from+(to-from)*soft(k));
      if(k<1)anim=requestAnimationFrame(step);else{anim=null;window.scrollTo(0,to);}});
  }
  function intent(dir,ev,isWheel){
    if(root.classList.contains('tld-loading'))return;
    var now=Date.now(),gap=now-lastW;if(isWheel)lastW=now;
    if(anim||now<lock){if(inZone()&&ev&&ev.cancelable)ev.preventDefault();return;}
    if(isWheel&&!fresh){if(gap<220){if(inZone()&&ev&&ev.cancelable)ev.preventDefault();return;}fresh=true;}
    var to=target(dir);if(to===null)return;if(ev&&ev.cancelable)ev.preventDefault();go(to);
  }
  window.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)<2||e.ctrlKey)return;intent(e.deltaY>0?1:-1,e,true);},{passive:false});
  var ty=null;
  window.addEventListener('touchstart',function(e){ty=e.touches[0].clientY;fresh=true;},{passive:true});
  window.addEventListener('touchmove',function(e){if(ty===null)return;var d=ty-e.touches[0].clientY;if(Math.abs(d)<12)return;intent(d>0?1:-1,e);if(anim||Date.now()<lock)ty=null;},{passive:false});
  window.addEventListener('keydown',function(e){var k=e.key,dir=(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey))?1:(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey))?-1:0;
    if(!dir||/input|textarea|select/i.test((e.target&&e.target.tagName)||''))return;intent(dir,e);});
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
/* The Lazy Dog — passage à la section noire : le fond de la page fond vers le noir quand [data-bg-dark] arrive à l'écran.
   La couleur sombre se règle avec data-bg-dark="#0c1016" (défaut). Les sections avant/pendant doivent avoir un fond transparent.
   Classe html.tld-dark pendant la phase sombre (pour adapter des couleurs en CSS si besoin). */
(function(){
  var secs=[].slice.call(document.querySelectorAll('[data-bg-dark]'));if(!secs.length)return;
  var root=document.documentElement,body=document.body,light=getComputedStyle(body).backgroundColor,ticking=false,on=null;
  var dark=secs[0].getAttribute('data-bg-dark')||'#0c1016';
  body.style.transition='background-color .9s cubic-bezier(.4,0,.2,1)';
  function update(){
    ticking=false;var vh=window.innerHeight,inside=false;
    secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<vh*.55&&r.bottom>vh*.45)inside=true;});
    if(inside===on)return;on=inside;
    root.classList.toggle('tld-dark',inside);body.style.backgroundColor=inside?dark:light;
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
})();
