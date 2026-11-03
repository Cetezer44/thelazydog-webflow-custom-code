/* The Lazy Dog — texte qui s'écrit mot par mot au scroll.
   Tout élément [data-words] : chaque mot apparaît à son tour pendant que l'élément traverse l'écran
   (le gras, les liens, etc. sont conservés). */
(function(){
  var els=[].slice.call(document.querySelectorAll('[data-words]'));if(!els.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  els.forEach(function(el){
    var words=[];
    (function walk(node){[].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){if(!part)return;
          if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
          var s=document.createElement('span');s.className='tld-word';s.textContent=part;
          s.style.display='inline-block';s.style.opacity=0;s.style.transform='translateY(.35em)';s.style.willChange='opacity,transform';
          frag.appendChild(s);words.push(s);});
        n.parentNode.replaceChild(frag,n);
      }else if(n.nodeType===1){walk(n);}
    });})(el);
    el._words=words;
  });
  var ticking=false;
  function update(){
    ticking=false;var vh=window.innerHeight;
    els.forEach(function(el){
      var r=el.getBoundingClientRect(),start=vh*.9,end=vh*.4; /* commence quand le haut du texte entre à 90 % de l'écran, finit quand le bas atteint 40 % */
      var p=(start-r.top)/Math.max(1,r.height+start-end);p=Math.max(0,Math.min(1,p));
      var n=el._words.length,shown=p*(n+2);
      el._words.forEach(function(w,i){var o=Math.max(0,Math.min(1,shown-i));if(w._o===o)return;w._o=o;
        w.style.opacity=o;w.style.transform=o>=1?'none':'translateY('+(.35*(1-o)).toFixed(3)+'em)';});
    });
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);req();
})();
