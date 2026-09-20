/* Scroll choreography for the home page (GSAP + ScrollTrigger). Content lives in content/site.json. */
(function () {
  'use strict';
  if (document.body.dataset.page !== 'home') return;
  if (window.TMG_READY) init(); else document.addEventListener('tmg:ready', init, { once: true });

  function init() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var root = document.documentElement;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- shapes: 16-point blobs drawn as smooth closed curves ---------- */
    var N = 16, TAU = Math.PI * 2;
    function gen(fn) { var o = {}; for (var i = 0; i < N; i++) o['r' + i] = fn(i / N * TAU); return o; }
    function round(b, s) { return gen(function (t) { return b * (1 + .07 * Math.sin(3 * t + s) + .04 * Math.sin(5 * t + 2 * s)); }); }
    function leaf(b) { return gen(function (t) { return b * (1 + .34 * Math.cos(2 * t)) * (1 + .05 * Math.sin(3 * t)); }); }
    function cell(b) { return gen(function (t) { return b * (1 + .1 * Math.cos(2 * t)) * (1 + .04 * Math.sin(4 * t + 1)); }); }
    function pathOf(s) {
      var p = [], c = Math.cos(s.rot), sn = Math.sin(s.rot), i;
      for (i = 0; i < N; i++) {
        var a = i / N * TAU, x = Math.cos(a) * s['r' + i] * s.sx, y = Math.sin(a) * s['r' + i] * s.sy;
        p.push([s.cx + x * c - y * sn, s.cy + x * sn + y * c]);
      }
      var d = 'M' + p[0][0].toFixed(1) + ',' + p[0][1].toFixed(1);
      for (i = 0; i < N; i++) {
        var p0 = p[(i - 1 + N) % N], p1 = p[i], p2 = p[(i + 1) % N], p3 = p[(i + 2) % N];
        d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
          (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
      }
      return d + 'Z';
    }
    var A = Object.assign({ cx: 500, cy: 500, sx: 1, sy: 1, rot: 0 }, round(330, 1));
    var B = Object.assign({ cx: 500, cy: 500, sx: 0, sy: 0, rot: 0 }, cell(300));
    var shA = $('#shA'), shB = $('#shB');
    function draw() { shA.setAttribute('d', pathOf(A)); shB.setAttribute('d', pathOf(B)); }
    draw();

    var mergedA = { cx: 500, cy: 500, rot: -.7, sx: 1, sy: .62 }, mergedB = { cx: 500, cy: 500, rot: .7, sx: 1, sy: .62 };

    if (reduce) {
      root.classList.add('reduce');
      Object.assign(A, leaf(300), mergedA); Object.assign(B, mergedB); draw();
      return;
    }

    /* ---------- opening story: seed splits into Food + Medicine, then interlocks ---------- */
    gsap.from('#grow', { scale: .25, opacity: 0, svgOrigin: '500 500', duration: 1.8, ease: 'power3.out' });
    gsap.set('.cap2,.cap3', { autoAlpha: 0 });
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: draw,
      scrollTrigger: { trigger: '.story', start: 'top top', end: '+=300%', pin: true, scrub: .6, anticipatePin: 1 }
    });
    tl.to('.cap1', { autoAlpha: 0, y: -40, duration: .35 }, .05)
      .to(A, Object.assign({ cx: 340, cy: 340, sx: .75, sy: .85, rot: -.5, duration: 1 }, leaf(300)), 0)
      .to(B, { cx: 660, cy: 660, sx: .8, sy: .6, rot: .6, duration: 1 }, 0)
      .fromTo('.cap2', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .4 }, .55)
      .to('.cap2', { autoAlpha: 0, y: -40, duration: .35 }, 1.85)
      .to(A, Object.assign({ duration: 1 }, mergedA), 2)
      .to(B, Object.assign({ duration: 1 }, mergedB), 2)
      .fromTo('.cap3', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .45 }, 2.3)
      .to({}, { duration: .5 }, 3);

    /* ---------- page colour follows the section in view ---------- */
    function res(v) { return /^var\(/.test(v) ? getComputedStyle(root).getPropertyValue(v.slice(4, -1)).trim() : v; }
    $$('[data-bg]').forEach(function (s) {
      ScrollTrigger.create({
        trigger: s, start: 'top 55%', end: 'bottom 55%',
        onToggle: function (self) {
          if (self.isActive) gsap.to(root, { '--pagebg': res(s.dataset.bg), '--pagefg': res(s.dataset.fg || 'var(--ink)'), duration: .6, overwrite: 'auto' });
        }
      });
    });

    /* ---------- theme scenes: shaped media grows into place ---------- */
    $$('.scene .slot').forEach(function (el) {
      gsap.fromTo(el, { scale: .7, rotate: -6 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 40%', scrub: true } });
    });

    /* ---------- ecosystem: numbers count up, network grows ---------- */
    $$('[data-count]').forEach(function (el) {
      var n = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () {
        gsap.to(o, { v: n, duration: 1.6, ease: 'power2.out', onUpdate: function () { el.textContent = pre + o.v.toFixed(dec) + suf; } });
      } });
    });
    var net = $('#net');
    if (net) {
      var edges = $$('.edge', net), nodes = $$('.node', net);
      edges.forEach(function (e) { var L = e.getTotalLength(); e.style.strokeDasharray = L; e.style.strokeDashoffset = L; });
      gsap.set(nodes, { opacity: 0, scale: .6 });
      gsap.timeline({ scrollTrigger: { trigger: net, start: 'top 78%', end: 'bottom 55%', scrub: .8 } })
        .to(edges, { strokeDashoffset: 0, stagger: .07, duration: 1, ease: 'none' }, 0)
        .to(nodes, { opacity: 1, scale: 1, stagger: .07, duration: .6, ease: 'none' }, .25);
    }

    /* ---------- portfolio: horizontal scroll on desktop, swipe elsewhere ---------- */
    var mm = gsap.matchMedia(), sec = $('.folio'), track = $('#track');
    mm.add('(min-width: 861px)', function () {
      if (!sec || !track) return;
      sec.classList.add('pinned');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
      return function () { sec.classList.remove('pinned'); };
    });

    var refresh = function () { ScrollTrigger.refresh(); };
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  }
})();
