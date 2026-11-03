/* The Lazy Dog — stickers du hero : chute avec gravité (Matter.js) puis glisser-déposer / lancer.
   Zone de jeu = premier écran ; le showreel est un obstacle (les stickers tombent dessus ou de chaque côté).
   Chaque image [data-sticker] dans .tld-stickers : data-x = point de chute (sur 1440 px), data-y = position si mouvement réduit, data-w = largeur, data-rot = rotation.
   Réglages sur .tld-stickers : data-scale (taille, défaut 1.25) et data-gravity (gravité, défaut 0.55). */
(function(){
  var wrap=document.querySelector('.tld-stickers');if(!wrap)return;
  var hero=wrap.closest('.tld-hero')||wrap.parentNode,reel=document.querySelector('.tld-reel');
  var items=[].slice.call(wrap.querySelectorAll('[data-sticker]'));if(!items.length)return;
  var root=document.documentElement,reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MATTER=wrap.getAttribute('data-matter-src')||'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/build/matter.min.js';
  var SCALE=parseFloat(wrap.getAttribute('data-scale'))||1.25;   /* taille des stickers (1 = maquette) */
  var GRAVITY=parseFloat(wrap.getAttribute('data-gravity'))||0.55; /* gravité (1 = « terrestre ») */
  var W,H,k,R=null;
  function measure(){ /* zone de jeu : le premier écran ; le showreel est un obstacle, les stickers peuvent tomber de chaque côté */
    var top=hero.getBoundingClientRect().top+(window.pageYOffset||0);
    W=hero.clientWidth;H=Math.max(320,(document.documentElement.clientHeight||window.innerHeight)-top);
    wrap.style.height=H+'px';
    k=Math.max(.5,Math.min(1,W/1440))*SCALE;
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
    var engine=Eng.create({enableSleeping:true});engine.gravity.y=GRAVITY;
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
      var s=sizeOf(img),a=s.w/s.h,opt={restitution:.32,friction:.35,frictionAir:.02,density:.0016,angle:(parseFloat(img.getAttribute('data-rot'))||0)*Math.PI/180};
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
