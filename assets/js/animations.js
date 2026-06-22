// VeloMax Premium Animations Handler
// Powered by GSAP, ScrollTrigger, and Lenis Smooth Scroll

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false
    });
  }

  // 1. Initialize Page Reveal Transition
  document.body.classList.add('page-reveal');
  requestAnimationFrame(() => {
    document.body.classList.add('revealed');
  });

  // 2. Initialize Lenis Smooth Scroll Engine
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Update ScrollTrigger on Lenis scroll
    lenisInstance.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    // Request Animation Frame loop for Lenis
    const raf = (time) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Bind Lenis to GSAP Ticker
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
    
    // Add lenis indicator class
    document.documentElement.classList.add('lenis-smooth');
  }

  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 3. Dynamic Typography reveals
    // --- Split Text Reveal Animation ---
    const textRevealElements = document.querySelectorAll('.animate-split-text');
    textRevealElements.forEach(el => {
      const text = el.textContent.trim();
      el.textContent = '';
      
      const words = text.split(' ');
      words.forEach((word, idx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'text-mask-wrapper';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        
        for (let char of word) {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          charSpan.classList.add('char-reveal', 'text-mask-content');
          wordSpan.appendChild(charSpan);
        }
        
        el.appendChild(wordSpan);
        
        if (idx < words.length - 1) {
          const space = document.createTextNode(' ');
          el.appendChild(space);
        }
      });
      
      const chars = el.querySelectorAll('.char-reveal');
      gsap.fromTo(chars, 
        { y: '100%', opacity: 0 }, 
        { y: '0%', opacity: 1, duration: 1.0, stagger: 0.02, ease: 'power4.out', delay: 0.2 }
      );
    });

    // --- Heading Scroll Reveal Masking (For all Section Headings) ---
    const sectionHeadings = document.querySelectorAll('section h2.display-5, section h3.display-6');
    sectionHeadings.forEach(heading => {
      // Skip if already has custom animation class
      if (heading.classList.contains('animate-split-text')) return;
      
      const text = heading.textContent.trim();
      heading.textContent = '';
      
      const maskWrapper = document.createElement('span');
      maskWrapper.className = 'text-mask-wrapper d-block';
      
      const maskContent = document.createElement('span');
      maskContent.className = 'text-mask-content d-block';
      maskContent.textContent = text;
      
      maskWrapper.appendChild(maskContent);
      heading.appendChild(maskWrapper);
      
      gsap.to(maskContent, {
        y: '0%',
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 4. Hero Banner Entrance Elements
    gsap.from('.hero-reveal-fade', {
      opacity: 0,
      y: 35,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.4
    });

    // Hero Background slow zoom scale-in on load
    if (document.querySelector('.hero-bg')) {
      gsap.fromTo('.hero-bg', 
        { scale: 1.15, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' }
      );
    }

    // 5. ScrollTrigger Animations
    // --- Staggered Card Entrance Animations ---
    const staggeredGrids = document.querySelectorAll('.staggered-grid');
    staggeredGrids.forEach(grid => {
      // Find cards or items to stagger inside
      const items = grid.querySelectorAll('.staggered-item, .premium-card, .glass-panel, .timeline-item');
      if (items.length === 0) return;
      
      gsap.from(items, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // --- Dynamic Scroll Zoom on Section Images ---
    const scrollZoomImages = document.querySelectorAll('.premium-card-img, section img.rounded-4');
    scrollZoomImages.forEach(img => {
      gsap.to(img, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // --- Parallax Image Movements ---
    const parallaxWraps = document.querySelectorAll('.parallax-img-wrap img, .hero-section .hero-bg');
    parallaxWraps.forEach(img => {
      gsap.fromTo(img, 
        { yPercent: -8 }, 
        { 
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement || img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    // --- Numeric Counter Trigger ---
    const counterElements = document.querySelectorAll('.stat-counter');
    counterElements.forEach(counter => {
      const targetVal = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = parseFloat(counter.getAttribute('data-duration')) || 1.8;
      
      const countObj = { val: 0 };
      
      gsap.to(countObj, {
        val: targetVal,
        duration: duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          let currentVal = Math.floor(countObj.val);
          if (targetVal >= 1000) {
            counter.textContent = (currentVal / 1000).toFixed(1) + 'k+';
          } else {
            counter.textContent = currentVal;
          }
        }
      });
    });

    // --- Horizontal Scrolling / Section Pinning ---
    const horizontalSec = document.querySelector('.horizontal-scroll-container');
    if (horizontalSec) {
      const sections = horizontalSec.querySelectorAll('.horizontal-section');
      if (sections.length > 0) {
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalSec,
            pin: true,
            scrub: 1.2,
            snap: 1 / (sections.length - 1),
            start: 'top top',
            end: () => '+=' + horizontalSec.offsetWidth
          }
        });
      }
    }
    
    // --- Elevation Curve SVG Draw Animation (on Home 2) ---
    const elevationPath = document.querySelector('svg path[stroke="var(--primary-color)"]');
    if (elevationPath) {
      const length = elevationPath.getTotalLength();
      gsap.set(elevationPath, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(elevationPath, {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: elevationPath.parentElement,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    }

    // --- Inject Floating Decoration Parallax Layers ---
    const contentSections = document.querySelectorAll('section.py-5, section.my-md-5');
    contentSections.forEach((section, index) => {
      // Create a background decoration layer
      if (index % 2 === 0) {
        const decor = document.createElement('div');
        decor.className = `floating-layer ${index % 4 === 0 ? '' : 'floating-layer-reverse'}`;
        decor.style.top = `${20 + (index * 5) % 40}%`;
        decor.style.left = index % 4 === 0 ? '5%' : '85%';
        decor.style.width = '120px';
        decor.style.height = '120px';
        decor.style.borderRadius = '50%';
        decor.style.border = '2px dashed var(--primary-color)';
        section.appendChild(decor);
      }
    });

    // --- Auto wrap images with reveal masks ---
    const cardImages = document.querySelectorAll('.premium-card-img-wrapper');
    cardImages.forEach(wrapper => {
      wrapper.classList.add('image-reveal-mask');
      
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top 92%',
        onEnter: () => {
          wrapper.classList.add('revealed');
        }
      });
    });
  }

  // 6. Interactive 3D Mouse Perspective Card Tilt
  const tiltCards = document.querySelectorAll('.tilt-card, .premium-card');
  tiltCards.forEach(card => {
    card.classList.add('tilt-card'); // ensure class is attached
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const maxRotateX = 8;
      const maxRotateY = 8;
      
      const rotateX = ((centerY - y) / centerY) * maxRotateX;
      const rotateY = ((x - centerX) / centerX) * maxRotateY;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      
      // Auto shadow depth adjustments based on tilt coordinates
      card.style.boxShadow = `0 ${20 + rotateX * 2}px ${40 + Math.abs(rotateY) * 2}px rgba(0,0,0,0.15), var(--shadow-glow)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.boxShadow = '';
    });
  });

  // 7. Click Ripple Triggers on Buttons
  const buttons = document.querySelectorAll('.btn-premium, .btn-premium-outline, button.btn');
  buttons.forEach(btn => {
    btn.classList.add('ripple-effect');
    
    // Auto-enrich buttons with arrows if they contain text but no arrow icons
    if (btn.textContent.includes('Tour') || btn.textContent.includes('Club') || btn.textContent.includes('Explore')) {
      const text = btn.textContent.trim();
      // Only append if it doesn't already have an icon inside
      if (!btn.querySelector('i') && !btn.querySelector('svg')) {
        btn.innerHTML = `${text} <i data-lucide="arrow-right" class="ms-1 w-4 h-4 align-middle"></i>`;
      }
    }

    btn.addEventListener('click', function(e) {
      const x = e.clientX - btn.getBoundingClientRect().left;
      const y = e.clientY - btn.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple-circle';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Calculate max dimension
      const size = Math.max(btn.offsetWidth, btn.offsetHeight);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.marginLeft = `${-size / 2}px`;
      ripple.style.marginTop = `${-size / 2}px`;
      
      // Remove any existing ripple
      const oldRipple = btn.querySelector('.ripple-circle');
      if (oldRipple) oldRipple.remove();
      
      btn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Re-run lucide to bind new dynamic icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
