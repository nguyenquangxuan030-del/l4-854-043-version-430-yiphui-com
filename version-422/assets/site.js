
(function(){
  function ready(fn){if(document.readyState!=='loading'){fn()}else{document.addEventListener('DOMContentLoaded',fn)}}
  function qsa(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel))}
  ready(function(){
    var header=document.querySelector('.site-header');
    var toggle=document.querySelector('.menu-toggle');
    if(toggle&&header){toggle.addEventListener('click',function(){header.classList.toggle('open')})}
    qsa('.hero-panel').forEach(function(panel){
      var slides=qsa('.hero-slide',panel);var dots=qsa('.hero-dot',panel);var i=0;
      function show(n){if(!slides.length)return;i=(n+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('active',k===i)});dots.forEach(function(d,k){d.classList.toggle('active',k===i)})}
      dots.forEach(function(d,k){d.addEventListener('click',function(){show(k)})});show(0);if(slides.length>1){setInterval(function(){show(i+1)},5200)}
    });
    qsa('[data-filter-scope]').forEach(function(scope){
      var input=scope.querySelector('[data-filter-input]');var year=scope.querySelector('[data-filter-year]');var region=scope.querySelector('[data-filter-region]');var cards=qsa('[data-title]',scope);var empty=scope.querySelector('.empty-state');
      var params=new URLSearchParams(location.search);var initial=params.get('q');if(initial&&input){input.value=initial}
      function apply(){var kw=(input&&input.value||'').toLowerCase().trim();var y=year&&year.value||'';var r=region&&region.value||'';var visible=0;cards.forEach(function(card){var text=(card.dataset.title+' '+card.dataset.genre+' '+card.dataset.region+' '+card.dataset.year).toLowerCase();var ok=(!kw||text.indexOf(kw)>-1)&&(!y||card.dataset.year===y)&&(!r||card.dataset.region===r);card.style.display=ok?'':'none';if(ok)visible++});if(empty){empty.style.display=visible?'none':'block'}}
      [input,year,region].forEach(function(el){if(el){el.addEventListener('input',apply);el.addEventListener('change',apply)}});apply();
    });
    qsa('.player-unit').forEach(function(unit){
      var video=unit.querySelector('video');var cover=unit.querySelector('.player-cover');var src=unit.getAttribute('data-src');var started=false;
      function safePlay(){var p=video.play();if(p&&p.catch){p.catch(function(){})}}
      function load(){if(!video||!src||started)return;started=true;if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;video.load()}else if(window.Hls&&window.Hls.isSupported()){var hls=new window.Hls({enableWorker:true,lowLatencyMode:true});hls.loadSource(src);hls.attachMedia(video);if(window.Hls.Events){hls.on(window.Hls.Events.MANIFEST_PARSED,function(){if(unit.classList.contains('playing')){safePlay()}})}}else{video.src=src;video.load()}}
      function play(){load();unit.classList.add('playing');safePlay()}
      if(cover){cover.addEventListener('click',play)}
      if(video){video.addEventListener('click',function(){if(video.paused){play()}else{video.pause()}});video.addEventListener('play',function(){unit.classList.add('playing')})}
    });
  })
})();
