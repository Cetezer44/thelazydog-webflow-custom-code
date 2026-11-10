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
  if(FAST){E.spread='cubic-bezier(.25,1.75,.4,1)';E.snap='cubic-bezier(.9,-0.45,.1,1.45)';E.out='cubic-bezier(.7,0,.84,0)';}
  var T=FAST?{mask:520,mStag:70,s1:560,d1:430,s2:1000,d2:330,t5:1440,fly:360,fStag:16,eyeAt:300,eye:360,bgAt:560,bg:280,end:700,rv:.7}:{mask:820,mStag:140,s1:1350,d1:720,s2:2150,d2:540,t5:2850,fly:520,fStag:28,eyeAt:560,eye:520,bgAt:960,bg:420,end:1180,rv:1};
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
    if(eye){eye.animate([{transform:'scale(0) rotate(-120deg)'},{transform:'scale(1.12) rotate(8deg)',offset:.7},{transform:'none'}],{duration:720*T.rv,delay:60,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'});}
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
  L.o.el.animate([{transform:tf(L.o)},{transform:tf({x:L.o.x,y:L.o.y,r:0,s:1.18}),offset:.35},{transform:tf({x:L.o.x,y:L.o.y,r:90,s:0})}],{duration:T.eye,delay:t5+T.eyeAt,easing:FAST?'cubic-bezier(.6,-0.3,.8,0)':'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
  bg.animate([{opacity:1},{opacity:0}],{duration:T.bg,delay:t5+T.bgAt,easing:'ease',fill:'forwards'});
  /* …et réapparaît en scale dans le header (dans reveal) */
  setTimeout(finish,t5+T.end);
})();
