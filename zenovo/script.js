/* ============================================
   WEBCRAFT PRO — INTERACTIVE SCRIPTS
   Complete JavaScript for all functionality
   ============================================ */

(function() {
  "use strict";

  // ============================================
  // FAQ TOGGLE
  // ============================================
  window.toggleFaq = function(el) {
    const item = el.parentElement;
    const allItems = document.querySelectorAll('.faq-item');

    // Close all other items
    allItems.forEach(function(i) {
      if (i !== item) {
        i.classList.remove('active');
      }
    });

    // Toggle current item
    item.classList.toggle('active');

    // Track FAQ interaction (optional analytics)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'faq_toggle', {
        'event_category': 'engagement',
        'event_label': el.querySelector('span').textContent.trim()
      });
    }
  };

  // ============================================
  // MODAL LOGIC
  // ============================================
  window.openModal = function() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus first input for accessibility
      setTimeout(function() {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 300);

      // Track modal open
      if (typeof gtag !== 'undefined') {
        gtag('event', 'modal_open', {
          'event_category': 'engagement',
          'event_label': 'consultation_form'
        });
      }
    }
  };

  window.closeModal = function(e) {
    const modal = document.getElementById('modal');
    if (!modal) return;

    // Close if clicked on overlay or close button
    if (!e || e.target === modal || e.target.closest('.modal-close')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.handleSubmit = function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate form submission (replace with actual API call)
    console.log('Form submitted:', data);

    // Show success message
    const formContent = document.getElementById('formContent');
    const successMsg = document.getElementById('successMsg');

    if (formContent && successMsg) {
      formContent.style.display = 'none';
      successMsg.style.display = 'block';

      // Track form submission
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'conversion',
          'event_label': 'consultation_request'
        });
      }
    }

    // Optional: Send to your backend
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  };

  window.resetForm = function() {
    const formContent = document.getElementById('formContent');
    const successMsg = document.getElementById('successMsg');
    const form = document.querySelector('#modal form');

    if (formContent && successMsg) {
      formContent.style.display = 'block';
      successMsg.style.display = 'none';
    }

    if (form) {
      form.reset();
    }
  };

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('modal');
      if (modal && modal.classList.contains('active')) {
        window.closeModal();
      }
    }
  });

  // ============================================
  // SCROLL REVEAL ANIMATION
  // ============================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after reveal
          // revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  // ============================================
  // PARTICLE NETWORK CANVAS
  // ============================================
  function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let w, h;
    let animationId = null;
    let isActive = true;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Particle class
    function Particle() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    };

    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, ' + this.alpha + ')';
      ctx.fill();
    };

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    function animate() {
      if (!isActive) return;

      ctx.clearRect(0, 0, w, h);

      // Update and draw particles
      particles.forEach(function(p) {
        p.update();
        p.draw();
      });

      // Connect nearby particles
      const maxDistance = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.1 * (1 - dist / maxDistance)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when tab is hidden (performance)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        isActive = false;
        if (animationId) cancelAnimationFrame(animationId);
      } else {
        isActive = true;
        animate();
      }
    });
  }

  // ============================================
  // 3D TILT EFFECT ON FEATURE CARDS
  // ============================================
  function init3DTilt() {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return;

    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jump
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      });
    });
  }

  // ============================================
  // NAVBAR SCROLL EFFECT (if navbar added later)
  // ============================================
  function initNavbarScroll() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // ============================================
  // WHATSAPP BUTTON TRACKING
  // ============================================
  function initWhatsAppTracking() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (!whatsappBtn) return;

    whatsappBtn.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'engagement',
          'event_label': 'floating_button'
        });
      }
    });
  }

  // ============================================
  // LAZY LOAD IMAGES (if any added later)
  // ============================================
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // PARALLAX EFFECT (subtle background movement)
  // ============================================
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Skip on mobile
    if (window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          const scrolled = window.pageYOffset;
          const rate = scrolled * 0.3;
          hero.style.backgroundPosition = 'center ' + rate + 'px';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================
  // TYPING EFFECT (optional, for hero subtitle)
  // ============================================
  function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;

    const text = typingElement.getAttribute('data-text') || typingElement.textContent;
    const speed = parseInt(typingElement.getAttribute('data-speed')) || 50;

    typingElement.textContent = '';
    let i = 0;

    function type() {
      if (i < text.length) {
        typingElement.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    // Start after a delay
    setTimeout(type, 1000);
  }

  // ============================================
  // COUNTER ANIMATION (for stats)
  // ============================================
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
          const start = 0;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString();
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
      counterObserver.observe(counter);
    });
  }

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  function init() {
    initScrollReveal();
    initParticles();
    init3DTilt();
    initSmoothScroll();
    initNavbarScroll();
    initWhatsAppTracking();
    initLazyLoad();
    initParallax();
    initTypingEffect();
    initCounterAnimation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
