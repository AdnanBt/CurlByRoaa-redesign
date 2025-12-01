// ===== THEME CORE FUNCTIONALITY =====
class Theme {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupCart();
    this.setupProductForms();
    this.setupImageGalleries();
    this.setupSmoothScrolling();
    this.setupAnimations();
  }

  class ImageOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.preloadCriticalImages();
  }

  lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  preloadCriticalImages() {
    // Preload hero video and first product images
    const criticalImages = [
      'https://cdn.shopify.com/s/files/1/0567/4172/4316/files/logo.jpg?v=1764436849',
      'https://cdn.shopify.com/videos/c/o/v/1f8218940a0d4c5bbd92cb24c024b184.mp4'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = src.includes('.mp4') ? 'video' : 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

  // Mobile Menu Functionality
  setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMain = document.querySelector('.nav-main');
    
    if (menuBtn && navMain) {
      menuBtn.addEventListener('click', () => {
        navMain.classList.toggle('active');
        menuBtn.textContent = navMain.classList.contains('active') ? '✕' : '☰';
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.header') && navMain.classList.contains('active')) {
          navMain.classList.remove('active');
          menuBtn.textContent = '☰';
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMain.classList.contains('active')) {
          navMain.classList.remove('active');
          menuBtn.textContent = '☰';
        }
      });
    }
  }

  // Cart Functionality
  setupCart() {
    console.log('Cart system ready - will integrate with Shopify cart API');
  }

  // Product Form Enhancements
  setupProductForms() {
    const productForms = document.querySelectorAll('form[action="/cart/add"]');
    
    productForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Success state
          submitBtn.textContent = 'Added! ✓';
          
          // Open cart drawer (if implemented)
          if (window.cartDrawer) {
            window.cartDrawer.openCart();
          }
          
          // Reset after delay
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2000);
          
        } catch (error) {
          submitBtn.textContent = 'Error - Try Again';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2000);
        }
      });
    });
  }

  // Image Gallery Functionality
  setupImageGalleries() {
    // Product image galleries
    const thumbItems = document.querySelectorAll('.thumb-item');
    const mainImage = document.getElementById('main-image');
    
    if (thumbItems.length > 0 && mainImage) {
      thumbItems.forEach(thumb => {
        thumb.addEventListener('click', function() {
          // Remove active class from all thumbs
          thumbItems.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked thumb
          this.classList.add('active');
          
          // Update main image
          const newSrc = this.getAttribute('data-image');
          mainImage.src = newSrc;
        });
      });
    }

    // Collection image hover effects
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  // Smooth Scrolling
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Animations on scroll
  setupAnimations() {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.benefit-card, .product-card, .collection-card');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };

    // Set initial state
    const animatedElements = document.querySelectorAll('.benefit-card, .product-card, .collection-card');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
  }
}

// ===== CART DRAWER FUNCTIONALITY =====
class CartDrawer {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createCartDrawer();
    this.bindEvents();
  }

  createCartDrawer() {
    // Create cart drawer HTML if it doesn't exist
    if (!document.getElementById('cart-drawer')) {
      const cartDrawerHTML = `
        <div class="cart-overlay" id="cart-overlay"></div>
        <div class="cart-drawer" id="cart-drawer">
          <div class="cart-header">
            <h3>Your Cart</h3>
            <button class="cart-close" id="cart-close">✕</button>
          </div>
          <div class="cart-content" id="cart-content">
            <div class="cart-empty" id="cart-empty">
              <p>Your cart is empty</p>
              <button class="btn btn-primary" onclick="window.cartDrawer.closeCart()">Continue Shopping</button>
            </div>
            <div class="cart-items" id="cart-items"></div>
          </div>
          <div class="cart-footer" id="cart-footer">
            <div class="cart-subtotal">
              <span>Subtotal:</span>
              <span id="cart-subtotal">$0.00</span>
            </div>
            <button class="checkout-button" onclick="window.location.href='/checkout'">
              Checkout Now
            </button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', cartDrawerHTML);
    }
  }

  bindEvents() {
    // Cart toggle
    document.querySelectorAll('.cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleCart();
      });
    });

    // Close cart
    document.getElementById('cart-close').addEventListener('click', () => this.closeCart());
    document.getElementById('cart-overlay').addEventListener('click', () => this.closeCart());

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeCart();
      }
    });
  }

  openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
    this.isOpen = true;
    this.loadCart();
  }

  closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
    this.isOpen = false;
  }

  toggleCart() {
    if (this.isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  async loadCart() {
    // Simulate cart loading
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');

    // Show empty state for demo
    cartEmpty.style.display = 'block';
    cartFooter.style.display = 'none';
    cartItems.innerHTML = '';
    cartSubtotal.textContent = '$0.00';
  }
}

// ===== QUIZ FUNCTIONALITY =====
class HairQuiz {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.answers = {};
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateProgress();
  }

  bindEvents() {
    // Option selection
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const step = this.currentStep;
        const value = e.currentTarget.getAttribute('data-value');
        
        // Remove selected class from siblings
        e.currentTarget.parentElement.querySelectorAll('.quiz-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Add selected class to current
        e.currentTarget.classList.add('selected');
        
        // Store answer
        this.answers[`step${step}`] = value;
        
        // Enable next button
        document.querySelector('.quiz-btn.next').disabled = false;
      });
    });

    // Navigation
    document.querySelectorAll('.quiz-btn.next').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    document.querySelectorAll('.quiz-btn.prev').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.hideStep(this.currentStep);
      this.currentStep++;
      this.showStep(this.currentStep);
    } else {
      this.showResults();
    }
    this.updateProgress();
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.hideStep(this.currentStep);
      this.currentStep--;
      this.showStep(this.currentStep);
    }
    this.updateProgress();
  }

  hideStep(step) {
    document.querySelector(`[data-step="${step}"]`).classList.remove('active');
  }

  showStep(step) {
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    
    // Update button states
    const prevBtn = document.querySelector('.quiz-btn.prev');
    const nextBtn = document.querySelector('.quiz-btn.next');
    
    prevBtn.disabled = step === 1;
    nextBtn.textContent = step === this.totalSteps ? 'See Results' : 'Next';
    nextBtn.disabled = !this.answers[`step${step}`];
  }

  showResults() {
    this.hideStep(this.currentStep);
    document.querySelector('.quiz-results').style.display = 'block';
    document.querySelector('.quiz-results').classList.add('active');
  }

  updateProgress() {
    const progress = (this.currentStep - 1) / this.totalSteps * 100;
    const progressBar = document.getElementById('quiz-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  window.themeApp = new Theme();
  
  // Initialize cart drawer
  window.cartDrawer = new CartDrawer();
  
  // Initialize quiz if on quiz page
  if (document.querySelector('.hair-quiz')) {
    window.hairQuiz = new HairQuiz();
  }

  console.log('🎉 CurlsByRoaa Theme Loaded Successfully!');
});

// ===== MOBILE OPTIMIZATIONS =====
class MobileOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.detectTouch();
    this.optimizeAnimations();
    this.lazyLoadImages();
    this.fixViewportHeight();
    this.preventZoomOnInput();
  }

  detectTouch() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      document.documentElement.classList.add('touch-device');
      document.documentElement.classList.remove('no-touch');
      
      // Add touch-specific optimizations
      this.addTouchStyles();
    } else {
      document.documentElement.classList.add('no-touch');
      document.documentElement.classList.remove('touch-device');
    }
  }

  addTouchStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .touch-device .btn:hover,
      .touch-device .product-card:hover,
      .touch-device .nav-link:hover {
        transform: none !important;
      }
      
      .touch-device .card-btn {
        transition: background-color 0.2s ease !important;
      }
      
      /* Improve scrolling on iOS */
      .touch-device .scrollable {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
  }

  optimizeAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--transition-base', '0.01ms');
      document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
  }

  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      // Observe all lazy images
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  fixViewportHeight() {
    // Fix 100vh issue on mobile
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
  }

  preventZoomOnInput() {
    // Prevent zoom on input focus in iOS
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      document.addEventListener('focus', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
          document.body.style.fontSize = '16px';
        }
      }, true);
      
      document.addEventListener('blur', () => {
        document.body.style.fontSize = '';
      }, true);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileOptimizer();
  
  // Fix for iOS viewport height
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.documentElement.style.setProperty('--ios-vh', '1vh');
  }
});

// ===== UTILITY FUNCTIONS =====
const ThemeUtils = {
  formatMoney: (cents) => {
    return '$' + (cents / 100).toFixed(2);
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Make utils globally available
window.ThemeUtils = ThemeUtils;