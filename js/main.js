(function(){
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var N = slides.length, cur = 0;
  var prev = document.getElementById('prev'), next = document.getElementById('next');
  var counter = document.getElementById('counter'), bar = document.getElementById('bar');
  var baseTitle = document.title;

  function fromHash(){
    var n = parseInt((location.hash || '').replace('#',''), 10);
    return (n >= 1 && n <= N) ? n - 1 : null;
  }
  function show(i, updateHash){
    i = Math.max(0, Math.min(N - 1, i));
    slides.forEach(function(s, k){
      var on = k === i;
      s.classList.toggle('active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    cur = i;
    slides[i].scrollTop = 0;
    counter.textContent = (i + 1) + ' / ' + N;
    bar.style.width = ((i + 1) / N * 100) + '%';
    prev.disabled = i === 0;
    next.disabled = i === N - 1;
    document.title = (i + 1) + '. ' + (slides[i].dataset.title || '') + '｜' + baseTitle;
    if (updateHash !== false && fromHash() !== i) {
      history.replaceState(null, '', '#' + (i + 1));
    }
  }
  function go(d){ show(cur + d); }

  prev.addEventListener('click', function(){ go(-1); });
  next.addEventListener('click', function(){ go(1); });
  window.addEventListener('hashchange', function(){ var h = fromHash(); if (h !== null && h !== cur) show(h, false); });

  document.addEventListener('keydown', function(e){
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': go(1); e.preventDefault(); break;
      case 'ArrowLeft': case 'PageUp': go(-1); e.preventDefault(); break;
      case 'Home': show(0); e.preventDefault(); break;
      case 'End': show(N - 1); e.preventDefault(); break;
    }
  });

  // swipe (horizontal only; vertical scrolling inside a slide stays normal)
  var deck = document.getElementById('deck'), sx = null, sy = 0, st = 0;
  deck.addEventListener('touchstart', function(e){
    if (e.touches.length !== 1) { sx = null; return; }
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
  }, {passive:true});
  deck.addEventListener('touchend', function(e){
    if (sx === null) return;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - st < 800) {
      go(dx < 0 ? 1 : -1);
    }
  }, {passive:true});

  var h = fromHash();
  show(h === null ? 0 : h);
})();
