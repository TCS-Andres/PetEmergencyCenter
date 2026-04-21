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
