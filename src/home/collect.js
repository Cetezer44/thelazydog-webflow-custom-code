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
  function finale(){
    if(!fin)return;
    fin.hidden=false;fin.classList.add('is-open');document.documentElement.classList.add('tld-collect-open');
    var list=[].slice.call(fin.querySelectorAll('[data-final]'));
    list.forEach(function(el){el.style.opacity=0;});
    fin.animate([{opacity:0},{opacity:1}],{duration:reduce?1:450,easing:'ease',fill:'forwards'});
    list.forEach(function(el,i){ /* apparition une par une, avec un « claquement » */
      var d=reduce?0:550+i*320,r=(i%2?1:-1)*(8+Math.random()*8);
      el.animate([{opacity:0,transform:'scale(2.6) rotate('+r*2+'deg)'},{opacity:1,transform:'scale(.86) rotate('+(-r*.4)+'deg)',offset:.55},{opacity:1,transform:'scale(1.06) rotate('+(r*.15)+'deg)',offset:.8},{opacity:1,transform:'none'}],{duration:reduce?1:480,delay:d,easing:'cubic-bezier(.2,.8,.25,1)',fill:'forwards'});
      if(!reduce)setTimeout(function(){fin.animate([{transform:'translate(0,0)'},{transform:'translate('+(Math.random()*8-4)+'px,'+(Math.random()*8-4)+'px)'},{transform:'translate(0,0)'}],{duration:140});},d+250);
    });
    setTimeout(function(){fin.classList.add('is-done');},reduce?0:550+list.length*320+500);
  }
  function close(){if(!fin||fin.hidden||!fin.classList.contains('is-done'))return;
    var a=fin.animate([{opacity:1},{opacity:0}],{duration:350,easing:'ease',fill:'forwards'});
    a.onfinish=function(){fin.hidden=true;fin.classList.remove('is-open','is-done');document.documentElement.classList.remove('tld-collect-open');};}
  if(fin){fin.hidden=true;fin.addEventListener('click',close);window.addEventListener('keydown',function(e){if(e.key==='Escape')close();});}
})();
