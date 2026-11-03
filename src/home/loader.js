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
