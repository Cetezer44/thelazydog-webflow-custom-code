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
    if(ind){var f=document.querySelector('.v2-foot');ind.style.opacity=f&&f.getBoundingClientRect().bottom<vh+4?'0':'';}
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
