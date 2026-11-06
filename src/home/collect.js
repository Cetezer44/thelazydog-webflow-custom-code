/* The Lazy Dog — stickers à collectionner sur la page d'accueil.
   [data-collect="id"] : un sticker caché dans la page (affiché en noir et blanc, 30 % d'opacité). Au clic, il reprend sa couleur,
   grossit un peu (×1,1) et tourne légèrement ; une copie s'envole vers sa place dans la barre [data-collect-bar].
   [data-collect-slot="id"] : les places de la barre (en bas à gauche de l'écran), dans l'ordre d'affichage.
   Quand tout est collectionné : écran [data-collect-final] (filtre sombre « glass ») où les stickers [data-final="id"]
   apparaissent un par un, façon lettres S-K-A-T-E. Un clic ou Échap ferme l'écran.
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
      var dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2),sc=Math.min(b.width/a.width,b.height/a.height);
      var anim=c.animate([{transform:'translate(0,0) scale(1) rotate(0)',opacity:1},{transform:'translate('+dx*.45+'px,'+(dy*.45-80)+'px) scale('+(1+sc)/2+') rotate(-12deg)',opacity:1,offset:.45},{transform:'translate('+dx+'px,'+dy+'px) scale('+sc+') rotate(0)',opacity:1}],{duration:820,easing:'cubic-bezier(.5,0,.2,1)',fill:'forwards'});
      anim.onfinish=function(){c.remove();fill(s);};
    }else if(s){fill(s);}
    if(Object.keys(got).length===total)setTimeout(finale,reduce?200:1100);
  }
  function fill(s){s.classList.add('is-got');if(!reduce)s.animate([{transform:'scale(1.45) rotate(-10deg)'},{transform:'scale(.9) rotate(4deg)',offset:.6},{transform:'none'}],{duration:520,easing:'cubic-bezier(.34,1.6,.5,1)'});}
  /* écran final (frame « Stickers_OK ») : les stickers s'empilent au centre, un par un, avec un « claquement » façon S-K-A-T-E.
     Positions [x, y, largeur, rotation] en px depuis le centre, relevées sur la maquette 1440 px (comme la pile du loader). */
  var PILE={'1':[-0.3,-69.5,211,9.73],'7':[-27.4,-6.9,121,-21.04],'3':[-37.5,57.5,99,0],'5':[58.2,63.7,164,15.99],'4':[87.5,33.7,78,30],'6':[50.1,-2.8,107,28.01]},ORDER=['1','7','3','5','4','6'];
  function finale(){
    if(!fin)return;
    fin.hidden=false;fin.classList.add('is-open');document.documentElement.classList.add('tld-collect-open');
    var list=[].slice.call(fin.querySelectorAll('[data-final]'));
    list.sort(function(a,b){var i=ORDER.indexOf(a.getAttribute('data-final')),j=ORDER.indexOf(b.getAttribute('data-final'));return (i<0?99:i)-(j<0?99:j);});
    var row=fin.querySelector('.tld-collect-final__row')||fin,k=Math.min(1.25,Math.max(.7,(window.innerWidth-40)/420));
    row.classList.add('is-pile');
    list.forEach(function(el,i){var p=PILE[el.getAttribute('data-final')]||[0,0,120,0];
      el.style.cssText='position:absolute;left:0;top:0;width:'+(p[2]*k)+'px;height:auto;max-width:none;margin:0;opacity:0;z-index:'+(i+1);
      el._base='translate(-50%,-50%) translate('+(p[0]*k)+'px,'+(p[1]*k)+'px) rotate('+p[3]+'deg)';el.style.transform=el._base;});
    fin.animate([{opacity:0},{opacity:1}],{duration:reduce?1:450,easing:'ease',fill:'forwards'});
    list.forEach(function(el,i){
      var d=reduce?0:600+i*340,r=(i%2?1:-1)*(10+Math.random()*10),b=el._base;
      el.animate([{opacity:0,transform:b+' scale(2.8) rotate('+r*2+'deg)'},{opacity:1,transform:b+' scale(.86) rotate('+(-r*.4)+'deg)',offset:.55},{opacity:1,transform:b+' scale(1.06) rotate('+(r*.15)+'deg)',offset:.8},{opacity:1,transform:b}],{duration:reduce?1:500,delay:d,easing:'cubic-bezier(.2,.8,.25,1)',fill:'forwards'});
      if(!reduce)setTimeout(function(){fin.animate([{transform:'translate(0,0)'},{transform:'translate('+(Math.random()*10-5)+'px,'+(Math.random()*10-5)+'px)'},{transform:'translate(0,0)'}],{duration:150});},d+260);
    });
    setTimeout(function(){fin.classList.add('is-done');},reduce?0:600+list.length*340+500);
  }
  function close(){if(!fin||fin.hidden||!fin.classList.contains('is-done'))return;
    var a=fin.animate([{opacity:1},{opacity:0}],{duration:350,easing:'ease',fill:'forwards'});
    a.onfinish=function(){fin.hidden=true;fin.classList.remove('is-open','is-done');document.documentElement.classList.remove('tld-collect-open');};}
  if(fin){fin.hidden=true;fin.addEventListener('click',close);window.addEventListener('keydown',function(e){if(e.key==='Escape')close();});}
})();
