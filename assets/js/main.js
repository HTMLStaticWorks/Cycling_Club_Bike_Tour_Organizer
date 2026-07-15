document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Theme Toggle Logic
  const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mob');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
  const getTheme = () => localStorage.getItem('theme') || systemTheme;
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  };

  const updateThemeIcon = (theme) => {
    themeToggles.forEach(toggle => {
      if (theme === 'dark') {
        toggle.innerHTML = '<i data-lucide="sun"></i>';
      } else {
        toggle.innerHTML = '<i data-lucide="moon"></i>';
      }
    });
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  // Set initial theme
  setTheme(getTheme());

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  // RTL Toggle Logic
  const langToggles = document.querySelectorAll('#lang-toggle, #lang-toggle-mob');
  const rtlStylesheetId = 'rtl-stylesheet-link';
  
  langToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      
      let rtlLink = document.getElementById(rtlStylesheetId);
      if (newDir === 'rtl') {
        if (!rtlLink) {
          rtlLink = document.createElement('link');
          rtlLink.id = rtlStylesheetId;
          rtlLink.rel = 'stylesheet';
          rtlLink.href = 'assets/css/rtl.css';
          document.head.appendChild(rtlLink);
        }
        langToggles.forEach(el => el.title = 'Switch to LTR');
      } else {
        if (rtlLink) {
          rtlLink.remove();
        }
        langToggles.forEach(el => el.title = 'Switch to RTL');
      }
    });
  });

  // Sticky Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on init

  // Active link handler on page load
  let currentPath = window.location.pathname.split('/').pop();
  if (!currentPath || currentPath === '/') {
    currentPath = 'index.html';
  }
  
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .offcanvas-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      if (link.classList.contains('dropdown-toggle')) {
        return; // handle toggles based on children below
      }
      link.classList.remove('active');
    }
  });

  // Ensure dropdown toggles are active if any child is active
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const hasActiveChild = dropdown.querySelector('.dropdown-item.active');
    if (toggle) {
      if (hasActiveChild) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    }
  });

  // Mobile Hamburger & Offcanvas Menu
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const offcanvasMenu = document.getElementById('offcanvas-menu');
  const offcanvasOverlay = document.getElementById('offcanvas-overlay');
  
  if (hamburgerBtn && offcanvasMenu && offcanvasOverlay) {
    const toggleMenu = () => {
      const isActive = offcanvasMenu.classList.contains('active');
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    const openMenu = () => {
      hamburgerBtn.classList.add('active');
      offcanvasMenu.classList.add('active');
      offcanvasOverlay.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Disable page scrolling
      
      // Accessibility focus trap
      const focusableElements = offcanvasMenu.querySelectorAll('a, button');
      if (focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 100);
      }
    };

    const closeMenu = () => {
      hamburgerBtn.classList.remove('active');
      offcanvasMenu.classList.remove('active');
      offcanvasOverlay.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Enable page scrolling
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    offcanvasOverlay.addEventListener('click', closeMenu);
    
    // Close menu when escape key is pressed
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && offcanvasMenu.classList.contains('active')) {
        closeMenu();
        hamburgerBtn.focus();
      }
    });
  }

  // Initialize Swiper.js for Testimonials (if present)
  if (document.querySelector('.testimonials-slider')) {
    new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }

  // Gallery Filtering Logic (if present)
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-wrapper');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            // Trigger simple GSAP entry animation if loaded
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(item, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
            }
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Custom Lightbox Implementation (if present)
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryTriggers = document.querySelectorAll('.gallery-trigger');

  if (lightboxModal && lightboxImg && lightboxClose) {
    galleryTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = trigger.getAttribute('href');
        lightboxImg.setAttribute('src', imgSrc);
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.setAttribute('src', '');
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Premium Form Validations
  const forms = document.querySelectorAll('.premium-form');
  forms.forEach(form => {
    // Add real-time visual styling based on validity state
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.checkValidity()) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
      });
      
      // Remove valid/invalid styles as they type
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let formIsValid = true;
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          input.classList.add('is-invalid');
          formIsValid = false;
        } else {
          input.classList.add('is-valid');
        }
      });

      if (formIsValid) {
        // Show elegant custom Bootstrap success modal or alert
        const successModalElement = document.getElementById('success-modal');
        if (successModalElement && typeof bootstrap !== 'undefined') {
          const successModal = new bootstrap.Modal(successModalElement);
          successModal.show();
        } else {
          alert('Success! Your form has been submitted.');
        }
        form.reset();
        inputs.forEach(input => {
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid');
        });
      } else {
        // Focus the first invalid element
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  });

  // Scroll to Top Button Logic
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // YouTube Video Modal Control
  const videoModalElement = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  if (videoModalElement && videoPlayer) {
    videoModalElement.addEventListener('show.bs.modal', () => {
      videoPlayer.setAttribute('src', 'https://www.youtube.com/embed/CFpIctK74gM?autoplay=1&rel=0');
    });
    videoModalElement.addEventListener('hide.bs.modal', () => {
      videoPlayer.setAttribute('src', '');
    });
  }
});
