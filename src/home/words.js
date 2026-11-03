/* The Lazy Dog — texte qui s'écrit mot par mot.
   Tout élément [data-words] : quand il entre dans l'écran, ses mots apparaissent un par un, à leur rythme
   (indépendamment de la vitesse du scroll). Le gras, les liens, etc. sont conservés.
   Réglages facultatifs : data-words-delay (ms entre deux mots, défaut 55), data-words-duration (ms par mot, défaut 500). */
(function(){
  var els=[].slice.call(document.querySelectorAll('[data-words]'));if(!els.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var EASE='cubic-bezier(.22,1,.36,1)';
  els.forEach(function(el){
    var words=[],dur=parseFloat(el.getAttribute('data-words-duration'))||500;
    (function walk(node){[].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){if(!part)return;
          if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
          var s=document.createElement('span');s.className='tld-word';s.textContent=part;
          s.style.display='inline-block';s.style.opacity=0;s.style.transform='translateY(.4em)';
          s.style.transition='opacity '+dur+'ms '+EASE+',transform '+dur+'ms '+EASE;
          frag.appendChild(s);words.push(s);});
        n.parentNode.replaceChild(frag,n);
      }else if(n.nodeType===1){walk(n);}
    });})(el);
    el._words=words;
  });
  function play(el){
    if(el._played)return;el._played=true;
    var step=parseFloat(el.getAttribute('data-words-delay'))||55;
    el._words.forEach(function(w,i){w.style.transitionDelay=(i*step)+'ms';w.style.opacity=1;w.style.transform='none';});
  }
  if(!('IntersectionObserver' in window)){els.forEach(play);return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){play(e.target);io.unobserve(e.target);}});},{rootMargin:'0px 0px -15% 0px',threshold:.15});
  els.forEach(function(el){io.observe(el);});
})();
