(function () {
  'use strict';

  // ---- Preloader ----
  (function initPreloader() {
    var preloader = document.getElementById('pec-preloader');
    if (!preloader) return;
    var start = Date.now();
    var minShow = 1000;
    var hidden = false;
    function hide() {
      if (hidden) return;
      hidden = true;
      var elapsed = Date.now() - start;
      var delay = Math.max(0, minShow - elapsed);
      setTimeout(function () {
        preloader.classList.add('pec-preloader--hidden');
        setTimeout(function () { preloader.parentNode && preloader.parentNode.removeChild(preloader); }, 500);
      }, delay);
    }
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(hide, 3500); // failsafe
  })();

  // ---- Mobile hamburger menu ----
  (function initMobileMenu() {
    var burger = document.querySelector('.pec-nav__burger');
    var menu = document.getElementById('pec-mobile-menu');
    if (!burger || !menu) return;
    var closeBtn = menu.querySelector('.pec-mobile-menu__close');
    function open() {
      menu.classList.add('pec-mobile-menu--open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('pec-menu-open');
    }
    function close() {
      menu.classList.remove('pec-mobile-menu--open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('pec-menu-open');
    }
    burger.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    menu.querySelectorAll('a[href]').forEach(function (a) { a.addEventListener('click', close); });
  })();

  // ---- Sticky mobile bar: track iOS Safari's visual viewport bottom ----
  // iOS Safari's URL bar collapses on scroll-down. position: fixed; bottom: 0
  // is anchored to the LAYOUT viewport, so during the URL-bar collapse animation
  // the bar can appear to "hover" above the visible bottom. We compute the
  // delta between layout and visual viewport bottoms and translate the bar
  // every animation frame while scrolling.
  (function initStickyBar() {
    var bar = document.querySelector('.pec-sticky-mobile');
    if (!bar || !window.visualViewport) return;
    var vv = window.visualViewport;
    var ticking = false;
    var lastY = null;

    function applyUpdate() {
      ticking = false;
      // Distance from layout viewport bottom to visual viewport bottom.
      // Positive when visual is BELOW layout (rare). Negative when visual is
      // ABOVE layout (URL bar visible -> visual is shorter than layout).
      // Bar with position: fixed; bottom: 0 sits at layout bottom by default,
      // so we translate UP by the gap to land on visual bottom.
      var gap = window.innerHeight - (vv.offsetTop + vv.height);
      // Update only if changed enough to matter — saves work and avoids jitter.
      if (lastY !== null && Math.abs(gap - lastY) < 0.5) return;
      lastY = gap;
      bar.style.transform = gap === 0 ? '' : 'translateY(' + (-gap) + 'px)';
    }

    function request() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyUpdate);
      }
    }

    // Visual viewport: fires on URL-bar collapse end and pinch-zoom.
    vv.addEventListener('resize', request);
    vv.addEventListener('scroll', request);
    // Window scroll: fires on every scroll frame, catches URL-bar mid-transition.
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('orientationchange', request);
    // Touch events: catch the moment the URL bar starts collapsing on iOS.
    document.addEventListener('touchmove', request, { passive: true });
    document.addEventListener('touchend', request, { passive: true });
    applyUpdate();
  })();

  // ---- Nav scroll state + sticky telehealth float ----
  var nav = document.querySelector('.pec-nav');
  var teleFloat = document.querySelector('.pec-tele-float');
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('pec-nav--scrolled', y > 20);
    if (teleFloat) teleFloat.classList.toggle('pec-tele-float--shown', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- FAQ accordion ----
  var faqItems = document.querySelectorAll('.pec-faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var wasOpen = item.classList.contains('pec-faq__item--open');
      faqItems.forEach(function (other) {
        other.classList.remove('pec-faq__item--open');
        other.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('pec-faq__item--open');
        item.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Scroll reveal with IntersectionObserver ----
  var targets = document.querySelectorAll(
    '.pec-section-head, .pec-empathy__body, ' +
    '.pec-step, .pec-whycard, .pec-svc, ' +
    '.pec-tele__copy > *, .pec-tele__side, ' +
    '.pec-animal, .pec-review, ' +
    '.pec-area__copy, .pec-area__cities, ' +
    '.pec-faq__head, .pec-faq__item, ' +
    '.pec-final__copy, .pec-contact-card'
  );

  // Apply stagger delay inside grids (steps, why-cards, services, animals, reviews, FAQ, pills)
  function staggerChildren(selector) {
    document.querySelectorAll(selector).forEach(function (child, i) {
      child.classList.add('pec-reveal');
      child.setAttribute('data-delay', String(Math.min(i, 6)));
    });
  }
  staggerChildren('.pec-how__grid > .pec-step');
  staggerChildren('.pec-why__grid > .pec-whycard');
  staggerChildren('.pec-services__grid > .pec-svc');
  staggerChildren('.pec-animals__grid > .pec-animal');
  staggerChildren('.pec-reviews__grid > .pec-review');
  staggerChildren('.pec-faq__list > .pec-faq__item');

  // Non-grid sections just get the reveal class
  targets.forEach(function (el) {
    if (!el.classList.contains('pec-reveal')) el.classList.add('pec-reveal');
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.pec-reveal').forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    document.querySelectorAll('.pec-reveal').forEach(function (el) { el.classList.add('is-in'); });
  }
})();
