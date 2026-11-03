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
