/* Quiet reveal: rows fade up into place as they scroll into view. No decorative
   artwork -- the structural journal layout is the differentiator for this tier. */
(function () {
  'use strict';
  function run() {
    if (!document.documentElement.classList.contains('motion')) return;
    var targets = Array.prototype.slice.call(
      document.querySelectorAll('.theme-row, .stat, .pcard, .nrow, .close')
    );
    if (!targets.length) return;
    targets.forEach(function (t) { t.classList.add('reveal'); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.2 });
      targets.forEach(function (t) { io.observe(t); });
    } else {
      targets.forEach(function (t) { t.classList.add('in'); });
    }
  }
  if (window.TMG_READY) run();
  else document.addEventListener('tmg:ready', run, { once: true });
})();
