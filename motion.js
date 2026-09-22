/* One quiet reveal on the hero; everything else is static. Respects prefers-reduced-motion. */
(function () {
  'use strict';
  function run() {
    if (!document.documentElement.classList.contains('motion')) return;
    var s1 = document.querySelector('.s1');
    var s2 = document.querySelector('.s2');
    var frameA = document.querySelector('.frame.a');
    var frameB = document.querySelector('.frame.b');
    if (!s1) return;

    requestAnimationFrame(function () { s1.classList.add('in'); });
    setTimeout(function () { if (frameA) frameA.classList.add('in'); }, 420);
    setTimeout(function () { if (frameB) frameB.classList.add('in'); }, 620);
    setTimeout(function () { if (s2) s2.classList.add('in'); }, 900);
  }
  if (document.body.dataset.page === 'home') {
    if (window.TMG_READY) run();
    else document.addEventListener('tmg:ready', run, { once: true });
  }
})();
