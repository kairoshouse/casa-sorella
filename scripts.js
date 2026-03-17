/* ═══════════════════════════════════════════════════════
   CASA SORELLA — GLOBAL SCRIPTS
   Boutique Editorial · Scroll Reveal · Nav Drawer
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL ENGINE ──────────────────────────
     Watches .reveal, .svc, .principle, .soc__row,
     .soc__header, .soc__closing, .details__item
     Adds .visible (and .active as alias) when 15% in view.
  ─────────────────────────────────────────────────────── */
  var REVEAL_SELECTORS = [
    '.reveal',
    '.svc',
    '.principle',
    '.soc__row',
    '.soc__header',
    '.soc__closing',
    '.soc__risk',
    '.details__item',
    '.about__row',
  ].join(', ');

  var observerOptions = {
    threshold: 0.15
  };

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.add('active'); /* alias for JS-snippet compat */
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  /* Stagger sibling reveals within the same parent */
  function applyStaggerDelays(selector, delayStep) {
    var groups = {};
    document.querySelectorAll(selector).forEach(function (el) {
      var parentKey = el.parentElement ? el.parentElement.dataset.staggerGroup || el.parentElement.className : 'root';
      groups[parentKey] = groups[parentKey] || [];
      groups[parentKey].push(el);
    });
    Object.values(groups).forEach(function (siblings) {
      siblings.forEach(function (el, i) {
        if (!el.classList.contains('reveal-delay-1') &&
            !el.classList.contains('reveal-delay-2') &&
            !el.classList.contains('reveal-delay-3')) {
          el.style.transitionDelay = (i * (delayStep || 0.12)) + 's';
        }
      });
    });
  }

  function initReveal() {
    /* Apply auto-stagger to service cards and SOC rows */
    applyStaggerDelays('.svc-card', 0.12);
    applyStaggerDelays('.soc__row', 0.08);
    applyStaggerDelays('.details__item', 0.1);

    document.querySelectorAll(REVEAL_SELECTORS).forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ── 2. NAV DRAWER ────────────────────────────────────
     Toggle hamburger + drawer + overlay.
     Works on every page that has #nav-hamburger.
  ─────────────────────────────────────────────────────── */
  function initNav() {
    var btn     = document.getElementById('nav-hamburger');
    var drawer  = document.getElementById('nav-drawer');
    var overlay = document.getElementById('nav-overlay');

    if (!btn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      btn.classList.add('is-open');
      overlay.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      btn.classList.remove('is-open');
      overlay.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function toggleDrawer() {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    }

    btn.addEventListener('click', toggleDrawer);
    overlay.addEventListener('click', closeDrawer);

    /* Close on any drawer link tap */
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ── 3. ACTIVE NAV LINK ───────────────────────────────
     Highlights the current page link in the drawer.
  ─────────────────────────────────────────────────────── */
  function initActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__drawer-item').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === current || (current === '' && href === 'index.html')) {
        link.style.opacity = '1';
        link.querySelector('.nav__drawer-label') &&
          (link.querySelector('.nav__drawer-label').style.color = 'rgba(227,233,240,0.5)');
      }
    });
  }

  /* ── 4. FIXED CONTACT ANCHOR ─────────────────────────
     Slides up from bottom once user scrolls past hero.
     Hides again if user scrolls back to top.
  ─────────────────────────────────────────────────────── */
  function initFixedAnchor() {
    var anchor = document.querySelector('.fixed-anchor');
    if (!anchor) return;

    var hero   = document.getElementById('hero');
    var trigger = hero ? hero.offsetHeight * 0.85 : 400;

    function onScroll() {
      if (window.scrollY > trigger) {
        anchor.classList.add('visible');
      } else {
        anchor.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* run once on load in case page is already scrolled */
  }

  /* ── INIT ─────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initReveal();
      initNav();
      initActiveNav();
      initFixedAnchor();
    });
  } else {
    initReveal();
    initNav();
    initActiveNav();
    initFixedAnchor();
  }

})();
