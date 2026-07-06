/* ==========================================================================
   VideoHut — Complete Interactive Layer
   Handles ALL animations that Framer Motion / React used to drive
   ========================================================================== */
(function() {
  'use strict';

  /* === FIX FRAMER SSR SCROLLING === */
  var styleFix = document.createElement('style');
  styleFix.textContent = '[data-framer-root] > * > * > * { position: relative !important; top: auto !important; }' +
    '[data-framer-root] [style*="position:sticky"] { position: relative !important; }' +
    '.framer-2q3rns-container { position: fixed !important; }' +
    'html, body { overflow-x: hidden; overflow-y: auto !important; height: auto !important; min-height: 100vh; }' +
    '[data-framer-name="Brand Logos"] img { mix-blend-mode: screen !important; }';
  document.head.appendChild(styleFix);

  /* === LENIS SMOOTH SCROLL === */
  var lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return 1 - Math.pow(1 - t, 3); },
    smoothWheel: true
  });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  /* === SMOOTH ANCHOR LINKS === */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) { e.preventDefault(); lenis.scrollTo(target); closeMobileMenu(); }
    });
  });

  /* === NAV SCROLL EFFECT === */
  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (nav) nav.style.background = window.scrollY > 50 ? 'rgba(13,13,13,0.85)' : '';
  }, { passive: true });

  /* === MOBILE MENU === */
  var hamburger = null, mobileMenu = null;
  document.querySelectorAll('[data-framer-name]').forEach(function(el) {
    if (el.getAttribute('data-framer-name').toLowerCase().includes('mobile')) mobileMenu = el;
  });
  document.querySelectorAll('nav [tabindex]').forEach(function(el) {
    if (!hamburger && el.querySelectorAll('span').length === 3) hamburger = el;
  });
  function closeMobileMenu() {
    if (mobileMenu) { mobileMenu.style.opacity = '0'; mobileMenu.style.pointerEvents = 'none'; }
    document.body.style.overflow = '';
    if (hamburger) hamburger.classList.remove('nav-ham--open');
  }
  if (hamburger && mobileMenu) {
    hamburger.style.cursor = 'pointer';
    hamburger.addEventListener('click', function() {
      if (mobileMenu.style.opacity === '1') closeMobileMenu();
      else { mobileMenu.style.opacity = '1'; mobileMenu.style.pointerEvents = 'all'; mobileMenu.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    });
    mobileMenu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMobileMenu); });
  }

  /* ========================================================================
     COMPANY LOGOS MARQUEE — Continuous horizontal scroll
     Animates the <ul> inside "Brand Logos" data-framer-name
     ======================================================================== */
  var brandContainer = document.querySelector('[data-framer-name="Brand Logos"]');
  if (brandContainer) {
    var brandList = brandContainer.querySelector('ul');
    if (brandList) {
      // Make it horizontal and scrollable — don't touch existing images/DOM
      brandList.style.display = 'flex';
      brandList.style.flexWrap = 'nowrap';
      brandList.style.gap = '60px';
      brandList.style.width = 'max-content';
      brandList.style.padding = '20px 0';
      brandList.style.margin = '0';
      brandList.style.listStyle = 'none';
      
      // Each li should not shrink
      brandList.querySelectorAll('li').forEach(function(li) {
        li.style.flexShrink = '0';
      });
      
      // Clone children once for seamless loop
      var children = brandList.children;
      var childCount = children.length;
      for (var i = 0; i < childCount; i++) {
        var clone = children[i].cloneNode(true);
        brandList.appendChild(clone);
      }
      
      // GSAP marquee — never pauses
      var totalWidth = brandList.scrollWidth / 2;
      gsap.to(brandList, {
        x: -totalWidth,
        duration: 45,
        ease: 'none',
        repeat: -1,
        onRepeat: function() { gsap.set(brandList, { x: 0 }); }
      });
    }
  }

  /* ========================================================================
     TICKER STRIP — Continuous horizontal scroll of service names
     Animates the list inside "Section - Ticker"
     ======================================================================== */
  var tickerSection = document.querySelector('[data-framer-name="Section - Ticker"]');
  if (tickerSection) {
    var tickerList = tickerSection.querySelector('ul');
    if (tickerList) {
      tickerList.style.display = 'flex';
      tickerList.style.gap = '40px';
      tickerList.style.width = 'max-content';
      tickerList.style.listStyle = 'none';
      tickerList.style.padding = '20px 0';
      tickerList.style.margin = '0';
      
      tickerList.querySelectorAll('li').forEach(function(li) {
        li.style.flexShrink = '0';
        li.style.whiteSpace = 'nowrap';
        li.style.fontFamily = "'Syne', sans-serif";
        li.style.fontWeight = '600';
        li.style.fontSize = '18px';
        li.style.color = 'rgba(255,255,255,0.7)';
      });
      
      // Duplicate for seamless loop
      var tickerItems = tickerList.querySelectorAll('li');
      var tc = tickerItems.length;
      for (var j = 0; j < tc; j++) {
        tickerList.appendChild(tickerItems[j].cloneNode(true));
      }
      
      var tickerWidth = tickerList.scrollWidth / 2;
      gsap.to(tickerList, {
        x: -tickerWidth,
        duration: 50,
        ease: 'none',
        repeat: -1,
        onRepeat: function() { gsap.set(tickerList, { x: 0 }); }
      });
    }
  }

  /* ========================================================================
     GSAP SCROLL REVEALS — Fade up + scale on scroll
     ======================================================================== */
  gsap.registerPlugin(ScrollTrigger);
  
  // Reveal sections and cards
  document.querySelectorAll('section, [data-framer-appear-id]').forEach(function(el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
    });
  });

  /* ========================================================================
     CARD HOVER EFFECTS — Lift + shadow on hover
     ======================================================================== */
  document.querySelectorAll('[tabindex]').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-6px)';
      this.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
      this.style.transition = 'all 0.3s cubic-bezier(0.2,0,0,1)';
      this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
      this.style.zIndex = '';
    });
  });

  /* ========================================================================
     TESTIMONIAL CAROUSEL — Auto-advancing slide
     ======================================================================== */
  var testSection = document.querySelector('[data-framer-name="Section - Testimonials"]');
  if (testSection) {
    var testUl = testSection.querySelector('ul');
    if (testUl && testUl.children.length > 1) {
      testUl.style.display = 'flex';
      testUl.style.gap = '24px';
      testUl.style.transition = 'transform 0.6s cubic-bezier(0.65,0,0.35,1)';
      testUl.style.listStyle = 'none';
      
      var testCards = testUl.querySelectorAll('li');
      testCards.forEach(function(card) { card.style.flexShrink = '0'; card.style.width = '380px'; });
      
      var testIndex = 0;
      function goTestSlide(i) {
        testIndex = i;
        var w = testCards[0].offsetWidth + 24;
        testUl.style.transform = 'translateX(' + (-i * w) + 'px)';
      }
      setInterval(function() { goTestSlide((testIndex + 1) % testCards.length); }, 5000);
    }
  }

  /* ========================================================================
     FAQ ACCORDION — Click to expand/collapse
     ======================================================================== */
  var faqSection = document.querySelector('[data-framer-name="Section - FAQ"]');
  if (faqSection) {
    faqSection.querySelectorAll('[tabindex]').forEach(function(item) {
      item.addEventListener('click', function() {
        var wasOpen = this.classList.contains('faq-open');
        var parent = this.parentElement;
        parent.querySelectorAll('.faq-open').forEach(function(open) {
          open.classList.remove('faq-open');
        });
        if (!wasOpen) this.classList.add('faq-open');
      });
    });
  }

  console.log('✓ All animations initialized — marquee, ticker, reveals, hover, carousel, FAQ');
})();
