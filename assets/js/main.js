(function () {
  'use strict';

  // Nav shadow on scroll + active link
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    links.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  // Research tabs
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-tab');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-panel') === key); });
    });
  });

  // Show more publications
  document.querySelectorAll('.show-more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var more = btn.parentNode.querySelector('.more');
      var open = more.hidden;
      more.hidden = !open;
      btn.textContent = open ? 'Show fewer' : 'Show all journal papers';
    });
  });

  // Reveal on scroll
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.head, .stat, .skill, .card, .tabs, .post, .timeline > li, .edu, .award, .patent, .projects, .cta');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { t.classList.add('reveal'); io.observe(t); });
  }

  // Count outbound clicks (email, profiles, articles) in GoatCounter
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || !window.goatcounter || !window.goatcounter.count) return;
    var href = a.getAttribute('href');
    if (href.charAt(0) === '#') return;
    var path = href.indexOf('mailto:') === 0 ? 'click/email'
      : 'click/' + a.hostname.replace(/^www\./, '') + a.pathname.replace(/\/$/, '');
    window.goatcounter.count({ path: path, title: a.textContent.trim(), event: true });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
