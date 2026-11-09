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
