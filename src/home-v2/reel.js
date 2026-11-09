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
