/*! The Lazy Dog — home-v2.js v4.2.0 — github.com/Cetezer44/thelazydog-webflow-custom-code */
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
    /* chaque sticker « tombe » sur l'écran : chute qui accélère jusqu'à l'impact (IMP de la durée), puis rebond.
       Le tremblement et le compteur sont calés exactement sur l'impact (même horloge que l'animation, pas de minuteur). */
    var DUR=560,IMP=.42;
    list.forEach(function(el,i){
      var d=reduce?0:750+i*320,r=(i%2?1:-1)*(10+Math.random()*10),b=el._base||'';
      el.animate([
        {opacity:0,transform:b+' scale(2.8) rotate('+r*2+'deg)',easing:'cubic-bezier(.55,0,.9,.45)'},
        {opacity:1,transform:b+' scale(.86) rotate('+(-r*.4)+'deg)',offset:IMP,easing:'cubic-bezier(.2,.7,.3,1)'},
        {opacity:1,transform:b+' scale(1.06) rotate('+(r*.15)+'deg)',offset:.74,easing:'cubic-bezier(.4,0,.3,1)'},
        {opacity:1,transform:b+' scale(1)'}],{duration:reduce?1:DUR,delay:d,easing:'linear',fill:'forwards'});
      if(reduce){el.style.opacity='1';return;}
      var hit=d+DUR*IMP,x=(i%2?1:-1)*(4+Math.random()*3),y=(Math.random()*6-3);
      fin.animate([{transform:'translate(0,0)'},{transform:'translate('+x+'px,'+y+'px)',offset:.25},{transform:'translate('+(-x*.5)+'px,'+(-y*.5)+'px)',offset:.6},{transform:'translate(0,0)'}],
        {duration:240,delay:hit,easing:'ease-out'});
      if(count){count.animate([{transform:'scale(1)'},{transform:'scale(1.35)',offset:.2},{transform:'scale(1)'}],{duration:320,delay:hit,easing:'cubic-bezier(.3,0,.3,1)'});
        setTimeout(function(){count.textContent=(i+1)+'/'+n;},hit);}
    });
    setTimeout(function(){fin.classList.add('is-done');},reduce?0:750+n*320+400);
  }
  function close(){if(!fin||fin.hidden||!fin.classList.contains('is-done'))return;
    var a=fin.animate([{opacity:1},{opacity:0}],{duration:350,easing:'ease',fill:'forwards'});
    a.onfinish=function(){fin.hidden=true;fin.classList.remove('is-open','is-done');document.documentElement.classList.remove('tld-collect-open');window.dispatchEvent(new Event('tld:cursor'));};}
  if(fin){fin.hidden=true;fin.addEventListener('click',close);window.addEventListener('keydown',function(e){if(e.key==='Escape')close();});}
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

/* --- src/home-v2/core.js --- */
/* The Lazy Dog — Accueil v2 : outils partagés (courbes, apparition au scroll, bulle qui suit le curseur, fin du loader). */
(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var E={out:'cubic-bezier(.23,1,.32,1)',io:'cubic-bezier(.77,0,.175,1)',expo:'cubic-bezier(.16,1,.3,1)'};
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  /* une seule fois, quand l'élément entre dans l'écran */
  function inView(els,fn,margin){
    els=[].slice.call(els||[]);if(!els.length)return;
    if(!('IntersectionObserver' in window)){els.forEach(fn);return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target);}});},{rootMargin:margin||'0px 0px -12% 0px'});
    els.forEach(function(el){io.observe(el);});
  }
  /* la page est prête quand le loader a fini (ou tout de suite s'il n'y en a pas) */
  function ready(fn){
    if(window.tldLoaded||!root.classList.contains('tld-loading')||!document.querySelector('.tld-loader')){fn();return;}
    window.addEventListener('tld:loaded',function h(){window.removeEventListener('tld:loaded',h);fn();});
  }
  /* bulle de texte qui suit le curseur (copier l'email, lecture/pause…) */
  var tip=null,tx=-999,ty=-999,traf=null;
  function tipEl(){if(!tip){tip=document.createElement('div');tip.className='v2-toast';tip.setAttribute('aria-hidden','true');document.body.appendChild(tip);
    window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!traf)traf=requestAnimationFrame(function(){traf=null;tip.style.transform='translate3d('+(tx+18)+'px,'+(ty+18)+'px,0)';});},{passive:true});}return tip;}
  function toast(text){if(!fine)return;var t=tipEl();if(text===null){t.classList.remove('is-on');return;}t.textContent=text;t.classList.add('is-on');}
  /* Webflow transforme les <button> en liens sans href : on leur rend un comportement de bouton (clavier, pas de saut en haut de page) */
  [].forEach.call(document.querySelectorAll('.v2-page a[type="button"]'),function(a){
    a.setAttribute('role','button');if(!a.hasAttribute('tabindex'))a.tabIndex=0;
    a.addEventListener('click',function(e){e.preventDefault();});
    a.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();a.click();}});
  });
  window.tldV2={reduce:reduce,fine:fine,E:E,clamp:clamp,inView:inView,ready:ready,toast:toast};
})();

/* --- src/home-v2/intro.js --- */
/* The Lazy Dog — Accueil v2 : entrée de la page et apparitions au scroll.
   Hero : les lignes du titre (.v2-line__in) montent derrière leur masque (élément principal), les repères de grille (.v2-guides i)
   se dessinent en même temps (décor), puis le header et les textes [data-v2-fade] arrivent (support).
   Ailleurs : [data-v2-split] (titre d'une ligne) monte par un masque, [data-v2-fade] apparaît en fondu + 12 px, à l'entrée dans l'écran. */
(function(){
  var V=window.tldV2;if(!V)return;
  var root=document.documentElement,E=V.E;
  root.classList.add('v2-js');
  /* titres d'une ligne : on ajoute le masque */
  [].forEach.call(document.querySelectorAll('[data-v2-split]'),function(el){
    var html=el.innerHTML;el.innerHTML='<span class="v2-line"><span class="v2-line__in">'+html+'</span></span>';
  });
  var hero=document.querySelector('.v2-hero');
  function rise(el,delay,dur){return el.animate([{transform:'translateY(105%)'},{transform:'translateY(0)'}],{duration:dur||1000,delay:delay||0,easing:E.expo,fill:'backwards'});}
  function fade(el,delay,dist){el.style.opacity='1';
    if(V.reduce){el.animate([{opacity:0},{opacity:1}],{duration:300,fill:'backwards'});return;}
    el.animate([{opacity:0,transform:'translateY('+(dist||12)+'px)'},{opacity:1,transform:'none'}],{duration:800,delay:delay||0,easing:E.out,fill:'backwards'});}
  /* avant l'entrée, tout ce qui va bouger est masqué (pas de « flash ») */
  var heroLines=hero?[].slice.call(hero.querySelectorAll('.v2-line__in')):[];
  heroLines.forEach(function(el){el.style.transform='translateY(105%)';});
  V.ready(function(){
    if(!hero)return;
    var guides=[].slice.call(hero.querySelectorAll('.v2-guides>span'));
    /* lead : les lignes du titre, en vague (110 ms puis 90 ms) */
    heroLines.forEach(function(el,i){el.style.transform='';if(!V.reduce)rise(el,i===0?0:110+(i-1)*90,1100);});
    /* décor : la grille se dessine depuis le haut, du centre vers les bords, en même temps que le titre */
    var mid=(guides.length-1)/2;
    guides.forEach(function(g,i){g.style.transform='';if(V.reduce)return;
      g.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{duration:1400,delay:Math.abs(i-mid)*70,easing:E.io,fill:'backwards'});});
    /* support : le header (porté d'un bloc) et les textes du hero */
    var head=document.querySelector('[data-v2-head]');
    if(head&&!V.reduce)head.animate([{opacity:0,transform:'translateY(-12px)'},{opacity:1,transform:'none'}],{duration:800,delay:180,easing:E.out,fill:'backwards'});
    [].forEach.call(hero.querySelectorAll('[data-v2-fade]'),function(el,i){fade(el,320+i*70,10);});
  });
  /* le reste de la page, à l'entrée dans l'écran */
  var outside=function(el){return !hero||!hero.contains(el);};
  var fades=[].filter.call(document.querySelectorAll('[data-v2-fade]'),outside);
  fades.forEach(function(el){el.style.opacity='0';});
  V.inView(fades,function(el){fade(el,0,12);});
  var lines=[].filter.call(document.querySelectorAll('[data-v2-split] .v2-line__in'),outside);
  lines.forEach(function(el){if(!V.reduce)el.style.transform='translateY(105%)';});
  V.inView(lines.map(function(l){return l.parentNode;}),function(m){var el=m.firstChild;el.style.transform='';if(!V.reduce)rise(el,0,1100);});
})();

/* --- src/home-v2/head.js --- */
/* The Lazy Dog — Accueil v2 : header et repères de navigation.
   [data-v2-head] se cache quand on descend, revient dès qu'on remonte, prend un fond « verre » une fois la page défilée ;
   [data-v2-progress] = progression de lecture ; [data-v2-clock] = heure de Nantes ; [data-v2-section="02"][data-v2-name="Projets"]
   alimente l'indicateur fixe en bas à droite (créé ici) et souligne le lien du header correspondant (href="#id"). */
(function(){
  var V=window.tldV2;if(!V)return;
  var head=document.querySelector('[data-v2-head]'),bar=document.querySelector('[data-v2-progress]');
  /* horloge (Europe/Paris) */
  var clocks=[].slice.call(document.querySelectorAll('[data-v2-clock]'));
  function tick(){var t;try{t=new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'}).format(new Date());}catch(e){var d=new Date();t=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);}
    clocks.forEach(function(c){if(c.textContent!==t)c.textContent=t;});}
  if(clocks.length){tick();setInterval(tick,15000);}
  /* indicateur de section */
  var secs=[].slice.call(document.querySelectorAll('[data-v2-section]'));
  var ind=null,cur=null;
  if(secs.length){ind=document.createElement('div');ind.className='v2-indicator';ind.setAttribute('aria-hidden','true');
    ind.innerHTML='<span class="v2-indicator__num"><span></span></span><span>—</span><span class="v2-indicator__name"><span></span></span>';document.body.appendChild(ind);}
  function roll(box,text,dir){
    var old=box.firstChild;if(old&&old.textContent===text)return;
    var n=document.createElement('span');n.textContent=text;
    if(!old||V.reduce){box.textContent='';box.appendChild(n);return;}
    n.style.position='absolute';n.style.left='0';n.style.top='0';box.appendChild(n);
    var d=dir>0?1:-1;
    old.animate([{transform:'none'},{transform:'translateY('+(-100*d)+'%)'}],{duration:450,easing:V.E.out,fill:'forwards'}).onfinish=function(){old.remove();n.style.position='';};
    n.animate([{transform:'translateY('+(100*d)+'%)'},{transform:'none'}],{duration:450,easing:V.E.out});
  }
  var links=[].slice.call(document.querySelectorAll('.v2-head__link[href^="#"]'));
  function setSection(s,dir){
    if(s===cur)return;cur=s;
    if(ind){roll(ind.querySelector('.v2-indicator__num'),'('+(s.getAttribute('data-v2-section')||'')+')',dir);roll(ind.querySelector('.v2-indicator__name'),s.getAttribute('data-v2-name')||'',dir);}
    links.forEach(function(a){var id=a.getAttribute('href').slice(1),t=id&&document.getElementById(id);a.classList.toggle('is-current',!!t&&(t===s||s.contains(t)||t.contains(s)));});
  }
  var lastY=window.scrollY,ticking=false;
  function update(){
    ticking=false;var y=window.scrollY,vh=window.innerHeight,max=document.documentElement.scrollHeight-vh,dir=y>=lastY?1:-1;
    if(head){head.classList.toggle('is-scrolled',y>40);
      if(y>240&&y>lastY+4&&!document.activeElement.closest('[data-v2-head]'))head.classList.add('is-hidden');else if(y<lastY-4||y<=240)head.classList.remove('is-hidden');}
    if(bar)bar.style.transform='scaleX('+(max>0?V.clamp(y/max,0,1):0).toFixed(4)+')';
    var mid=vh*.5,s=null;secs.forEach(function(x){var r=x.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)s=x;});
    if(s)setSection(s,dir);
    if(ind){var f=document.querySelector('.v2-foot');ind.style.opacity=(y<vh*.6||(f&&f.getBoundingClientRect().bottom<vh+4))?'0':'';}
    lastY=y;
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
  /* liens d'ancre : défilement fluide (Lenis s'il est là) */
  [].forEach.call(document.querySelectorAll('.v2-page a[href^="#"]'),function(a){
    a.addEventListener('click',function(e){var id=a.getAttribute('href').slice(1),t=id&&document.getElementById(id);if(!t)return;e.preventDefault();
      if(window.tldLenis)window.tldLenis.scrollTo(t,{offset:0,duration:1.4});else t.scrollIntoView({behavior:V.reduce?'auto':'smooth'});});
  });
})();

/* --- src/home-v2/reel.js --- */
/* The Lazy Dog — Accueil v2 : showreel qui s'ouvre au scroll.
   [data-v2-reel] (data-src = vidéo, data-poster facultatif) : la section reste épinglée ; en défilant, la fenêtre passe
   d'une vignette 16/9 au plein écran (clip-path), la vidéo se « dé-zoome » légèrement. Clic = lecture / pause ;
   [data-v2-sound] active le son. La vidéo n'est chargée qu'à l'approche de la section. */
(function(){
  var V=window.tldV2,sec=document.querySelector('[data-v2-reel]');if(!V||!sec)return;
  var frame=sec.querySelector('.v2-reel__frame'),snd=sec.querySelector('[data-v2-sound]'),vid=null,ticking=false;
  var poster=sec.getAttribute('data-poster');if(poster&&frame)frame.style.backgroundImage='url("'+poster+'")';
  function load(){if(vid||!frame)return;var src=sec.getAttribute('data-src');if(!src)return;
    vid=document.createElement('video');vid.muted=true;vid.loop=true;vid.playsInline=true;vid.setAttribute('playsinline','');vid.preload='auto';vid.src=src;frame.appendChild(vid);
    var p=vid.play();if(p&&p.catch)p.catch(function(){});}
  V.inView([sec],load,'0px 0px 60% 0px');
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function update(){
    ticking=false;if(!frame)return;
    var r=sec.getBoundingClientRect(),vh=window.innerHeight,vw=frame.offsetWidth||window.innerWidth,len=Math.max(1,r.height-vh);
    var p=V.clamp(-r.top/len,0,1),e=V.reduce?1:ease(V.clamp(p/.7,0,1));
    var w0=Math.min(vw*.36,560),h0=w0*9/16; /* vignette de départ, 16/9 */
    var cx=(vw-w0)/2*(1-e),ct=(vh-h0)/2*(1-e);
    sec.style.setProperty('--v2-cx',cx.toFixed(1)+'px');sec.style.setProperty('--v2-ct',ct.toFixed(1)+'px');
    sec.style.setProperty('--v2-cr',(6*(1-e)).toFixed(2)+'px');sec.style.setProperty('--v2-vs',(1.15-.15*e).toFixed(4));
    sec.style.setProperty('--v2-co',V.clamp(1-e*3,0,1).toFixed(3));sec.style.setProperty('--v2-uo',V.clamp((e-.85)/.15,0,1).toFixed(3));
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
  if(frame){
    frame.addEventListener('click',function(){if(!vid)return;if(vid.paused){vid.play();V.toast('Pause');}else{vid.pause();V.toast('Lecture');}});
    frame.addEventListener('pointerenter',function(){V.toast(vid&&vid.paused?'Lecture':'Pause');});
    frame.addEventListener('pointerleave',function(){V.toast(null);});
  }
  if(snd)snd.addEventListener('click',function(e){e.stopPropagation();load();if(!vid)return;vid.muted=!vid.muted;if(!vid.muted&&vid.paused)vid.play();
    snd.textContent=vid.muted?'Son : off':'Son : on';snd.setAttribute('aria-pressed',vid.muted?'false':'true');});
})();

/* --- src/home-v2/words.js --- */
/* The Lazy Dog — Accueil v2 : texte qui s'allume mot à mot au rythme du scroll ([data-v2-words]).
   Les mots passent de 14 % à 100 % d'opacité, du premier au dernier, pendant que le paragraphe traverse l'écran. */
(function(){
  var V=window.tldV2;if(!V||V.reduce)return;
  var blocks=[].slice.call(document.querySelectorAll('[data-v2-words]')).map(function(el){
    var words=[];
    (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return;}var s=document.createElement('span');s.className='v2-w';s.textContent=w;f.appendChild(s);words.push(s);});c.parentNode.replaceChild(f,c);}
      else if(c.nodeType===1)walk(c);});})(el);
    return {el:el,words:words};
  });
  var ticking=false;
  function update(){ticking=false;var vh=window.innerHeight;
    blocks.forEach(function(b){var r=b.el.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
      var start=vh*.85,end=vh*.35-r.height*.5,p=V.clamp((start-r.top)/Math.max(1,start-end),0,1),n=b.words.length,x=p*(n+4);
      b.words.forEach(function(w,i){var o=.14+.86*V.clamp((x-i)/4,0,1);w.style.setProperty('--o',o.toFixed(3));});});}
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);update();
})();

/* --- src/home-v2/index.js --- */
/* The Lazy Dog — Accueil v2 : index des projets.
   [data-v2-index] : la liste CMS (.v2-work__item > a.v2-row). Vue « liste » : au survol d'une ligne, un aperçu de l'image suit
   le curseur (avec une légère inclinaison selon la vitesse) et change d'image par un volet. Vue « grille » : cartes images.
   [data-v2-view="list|grid"] : boutons de bascule (choix mémorisé). [data-v2-year] : la date CMS est réduite à l'année.
   [data-v2-count] : nombre de projets. Les lignes se dessinent (trait puis texte) à l'entrée dans l'écran. */
(function(){
  var V=window.tldV2,list=document.querySelector('[data-v2-index]');if(!V||!list)return;
  var items=[].slice.call(list.querySelectorAll('.v2-work__item'));
  [].forEach.call(list.querySelectorAll('[data-v2-year]'),function(el){var m=(el.textContent||'').match(/(19|20)\d{2}/);if(m)el.textContent=m[0];});
  [].forEach.call(document.querySelectorAll('[data-v2-count]'),function(el){el.textContent=('0'+items.length).slice(-2);});
  /* bascule liste / grille */
  var btns=[].slice.call(document.querySelectorAll('[data-v2-view]')),pill=document.querySelector('.v2-switch__pill');
  function placePill(b){if(!pill||!b)return;pill.style.width=b.offsetWidth+'px';pill.style.transform='translateX('+b.offsetLeft+'px)';}
  var sec=list.closest('.v2-work');
  function setView(v,anim){
    if(sec)sec.setAttribute('data-view',v);
    btns.forEach(function(b){var on=b.getAttribute('data-v2-view')===v;b.setAttribute('aria-pressed',on?'true':'false');if(on)placePill(b);});
    if(list.getAttribute('data-view')===v)return;
    try{localStorage.setItem('tld-v2-view',v);}catch(e){}
    if(!anim||V.reduce){list.setAttribute('data-view',v);return;}
    list.classList.add('is-swapping');hide();
    setTimeout(function(){list.setAttribute('data-view',v);requestAnimationFrame(function(){list.classList.remove('is-swapping');});},220);
  }
  var saved=null;try{saved=localStorage.getItem('tld-v2-view');}catch(e){}
  setView(saved==='grid'?'grid':'list',false);
  btns.forEach(function(b){b.addEventListener('click',function(){setView(b.getAttribute('data-v2-view'),true);});});
  window.addEventListener('resize',function(){placePill(btns.filter(function(b){return b.getAttribute('aria-pressed')==='true';})[0]);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){placePill(btns.filter(function(b){return b.getAttribute('aria-pressed')==='true';})[0]);});
  /* apparition des lignes : le trait se dessine, puis le texte monte */
  if(!V.reduce&&window.CSS&&CSS.registerProperty){try{CSS.registerProperty({name:'--v2-rx',syntax:'<number>',inherits:false,initialValue:'1'});}catch(e){}}
  var rows=items.map(function(it){return it.querySelector('.v2-row');}).filter(Boolean);
  if(!V.reduce){rows.forEach(function(r){r.style.setProperty('--v2-rx','0');r.style.transition='--v2-rx 1.1s '+V.E.io;[].forEach.call(r.children,function(c){c.style.opacity='0';});});
    V.inView(rows,function(r){var i=rows.indexOf(r)%4;
      setTimeout(function(){r.style.setProperty('--v2-rx','1');
        [].forEach.call(r.children,function(c,k){c.style.opacity='';c.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:800,delay:160+k*45,easing:V.E.out,fill:'backwards'});});},i*70);});}
  /* aperçu flottant */
  if(!V.fine)return;
  var pv=document.createElement('div');pv.className='v2-preview';pv.setAttribute('aria-hidden','true');document.body.appendChild(pv);
  var imgs=rows.map(function(r){var src=r.querySelector('img');var im=document.createElement('img');im.alt='';im.decoding='async';if(src)im.src=src.currentSrc||src.src;pv.appendChild(im);return im;});
  var on=false,cur=-1,x=0,y=0,px=0,py=0,rot=0,sc=.92,raf=null,last=performance.now();
  function frame(now){
    var dt=Math.min(64,now-last)/16.7;last=now;
    var k=1-Math.pow(1-.16,dt),vx=(x-px);px+=(x-px)*k;py+=(y-py)*k;
    rot+=(V.clamp(vx*.06,-8,8)-rot)*Math.min(1,.12*dt);sc+=((on?1:.92)-sc)*Math.min(1,.18*dt);
    pv.style.transform='translate3d('+(px-pv.offsetWidth/2).toFixed(1)+'px,'+(py-pv.offsetHeight/2).toFixed(1)+'px,0) rotate('+rot.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';
    if(on||Math.abs(x-px)>.5||Math.abs(sc-.92)>.005)raf=requestAnimationFrame(frame);else raf=null;
  }
  function kick(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
  function show(i){
    if(list.getAttribute('data-view')!=='list')return;
    if(!on){on=true;px=x;py=y;pv.classList.add('is-on');}
    if(i!==cur){var prev=imgs[cur];if(prev){prev.classList.remove('is-current');prev.classList.add('is-leaving');setTimeout(function(){prev.classList.remove('is-leaving');},520);}
      imgs[i].classList.remove('is-leaving');imgs[i].classList.add('is-current');imgs[i].style.zIndex=++z;cur=i;}
    kick();
  }
  var z=1;
  function hide(){if(!on)return;on=false;pv.classList.remove('is-on');kick();}
  window.addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;if(on)kick();},{passive:true});
  rows.forEach(function(r,i){r.setAttribute('data-cursor','projects');r.addEventListener('pointerenter',function(){show(i);});});
  list.addEventListener('pointerleave',hide);
  window.addEventListener('scroll',function(){if(!on)return;var t=document.elementFromPoint(x,y);if(!t||!list.contains(t))hide();},{passive:true});
})();

/* --- src/home-v2/acc.js --- */
/* The Lazy Dog — Accueil v2 : services en accordéon ([data-v2-acc]).
   .v2-acc__item > button.v2-acc__head + .v2-acc__panel > .v2-acc__inner (.v2-acc__media accueille la vidéo).
   Un seul service ouvert à la fois ; la vidéo (data-video sur l'item, ou sur [data-v2-acc]) ne se charge qu'à l'ouverture. */
(function(){
  var V=window.tldV2,acc=document.querySelector('[data-v2-acc]');if(!V||!acc)return;
  var items=[].slice.call(acc.querySelectorAll('.v2-acc__item'));
  function panel(it){return it.querySelector('.v2-acc__panel');}
  function video(it){var m=it.querySelector('.v2-acc__media');if(!m)return null;var v=m.querySelector('video');
    if(!v){var src=it.getAttribute('data-video')||acc.getAttribute('data-video');if(!src)return null;v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='metadata';v.src=src;m.appendChild(v);}return v;}
  function set(it,open){
    var p=panel(it),h=it.querySelector('.v2-acc__head');if(!p||!h)return;
    it.classList.toggle('is-open',open);h.setAttribute('aria-expanded',open?'true':'false');
    var inner=p.firstElementChild,target=open&&inner?inner.offsetHeight:0;
    if(V.reduce){p.style.transition='none';}
    p.style.height=target+'px';
    var v=video(it);if(v){if(open){var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}else v.pause();}
  }
  items.forEach(function(it,i){
    var h=it.querySelector('.v2-acc__head'),p=panel(it);if(!h||!p)return;
    var id='v2-acc-'+i;p.id=id;h.setAttribute('aria-controls',id);h.setAttribute('aria-expanded','false');
    h.addEventListener('click',function(){var open=!it.classList.contains('is-open');items.forEach(function(o){if(o!==it&&o.classList.contains('is-open'))set(o,false);});set(it,open);});
  });
  window.addEventListener('resize',function(){items.forEach(function(it){if(it.classList.contains('is-open')){var p=panel(it);p.style.height=p.firstElementChild.offsetHeight+'px';}});});
})();

/* --- src/home-v2/contact.js --- */
/* The Lazy Dog — Accueil v2 : contact, newsletter et footer.
   [data-v2-copy="adresse"] : un clic copie l'adresse (bulle « Adresse copiée ») ; sans presse-papiers, ouvre le mail.
   .v2-news__form : aide en direct sous le champ (adresse incomplète / Entrée pour valider).
   [data-v2-mark] : le grand logotype du footer monte lettre par lettre quand il arrive ; [data-v2-top] remonte en haut. */
(function(){
  var V=window.tldV2;if(!V)return;
  [].forEach.call(document.querySelectorAll('[data-v2-copy]'),function(b){
    var mail=b.getAttribute('data-v2-copy'),t=null;
    b.addEventListener('pointerenter',function(){V.toast('Copier l’adresse');});
    b.addEventListener('pointerleave',function(){V.toast(null);});
    b.addEventListener('click',function(){
      function done(){V.toast('Adresse copiée ✓');b.setAttribute('aria-label','Adresse copiée');clearTimeout(t);t=setTimeout(function(){V.toast(b.matches(':hover')?'Copier l’adresse':null);},1600);
        if(!V.reduce)b.animate([{transform:'scale(1)'},{transform:'scale(.985)'},{transform:'scale(1)'}],{duration:220,easing:V.E.out});}
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(mail).then(done,function(){location.href='mailto:'+mail;});
      else location.href='mailto:'+mail;
    });
  });
  [].forEach.call(document.querySelectorAll('.v2-news__form'),function(f){
    var inp=f.querySelector('input[type="email"],input'),box=f.closest('.v2-news__wrap')||f.parentNode,hint=box.querySelector('.v2-news__hint');if(!inp)return;
    if(!inp.getAttribute('placeholder'))inp.setAttribute('placeholder','Votre adresse email');inp.setAttribute('aria-label','Adresse email');inp.setAttribute('autocomplete','email');
    var ok=box.querySelector('.w-form-done'),ko=box.querySelector('.w-form-fail');
    if(ok)ok.innerHTML='<div class="v2-news__ok">Merci ! À très vite dans votre boîte mail.</div>';
    if(ko)ko.innerHTML='<div>Oups, l’inscription n’a pas fonctionné. Réessayez dans un instant.</div>';
    if(!hint)return;
    function check(){var v=inp.value.trim();hint.textContent=!v?'':(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'Appuyez sur Entrée pour vous inscrire ↵':'Adresse email incomplète');}
    inp.addEventListener('input',check);
  });
  [].forEach.call(document.querySelectorAll('[data-v2-mark]'),function(m){
    var text=(m.textContent||'').trim();m.setAttribute('aria-label',text);m.textContent='';
    var ls=text.split('').map(function(ch){var s=document.createElement('span');s.textContent=ch===' '?' ':ch;s.setAttribute('aria-hidden','true');m.appendChild(s);return s;});
    /* le logotype occupe toute la largeur, quelle que soit la police */
    function fit(){m.style.fontSize='';var w=m.clientWidth,sw=m.scrollWidth,fs=parseFloat(getComputedStyle(m).fontSize);if(sw>w+1)m.style.fontSize=(fs*w/sw*.995)+'px';}
    fit();window.addEventListener('resize',fit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
    if(V.reduce)return;
    ls.forEach(function(s){s.style.transform='translateY(100%)';});
    V.inView([m],function(){var mid=(ls.length-1)/2;ls.forEach(function(s,i){s.style.transform='';
      s.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:1200,delay:Math.round(Math.pow(Math.abs(i-mid)/mid,.8)*260),easing:V.E.expo,fill:'backwards'});});},'0px 0px -5% 0px');
  });
  [].forEach.call(document.querySelectorAll('[data-v2-top]'),function(b){b.addEventListener('click',function(e){e.preventDefault();
    if(window.tldLenis)window.tldLenis.scrollTo(0,{duration:1.6});else window.scrollTo({top:0,behavior:V.reduce?'auto':'smooth'});});});
})();
