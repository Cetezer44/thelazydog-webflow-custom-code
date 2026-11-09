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
