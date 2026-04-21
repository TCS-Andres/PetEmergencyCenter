(function () {
  'use strict';

  // Nav scroll state
  var nav = document.querySelector('.pec-nav');
  var teleFloat = document.querySelector('.pec-tele-float');
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('pec-nav--scrolled', y > 20);
    if (teleFloat) teleFloat.classList.toggle('pec-tele-float--shown', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // FAQ accordion — single-open behavior, first item open by default
  var faqItems = document.querySelectorAll('.pec-faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var wasOpen = item.classList.contains('pec-faq__item--open');
      faqItems.forEach(function (other) { other.classList.remove('pec-faq__item--open'); });
      if (!wasOpen) item.classList.add('pec-faq__item--open');
      item.setAttribute('aria-expanded', String(!wasOpen));
    });
  });
})();
