/**
 * Modern Home Page JavaScript
 * ===========================
 * Clean DOM manipulation, reusable components, and modern ES6+ practices
 * with accessibility features and smooth animations.
 */

'use strict';

// ===== CONFIGURATION & CONSTANTS =====
const CONFIG = {
  // Animation durations (in milliseconds)
  ANIMATION_DURATION: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  
  // Intersection Observer thresholds
  OBSERVER_THRESHOLD: 0.1,
  
  // Scroll threshold for header changes
  SCROLL_THRESHOLD: 100,
  
  // Debounce delay for scroll events
  DEBOUNCE_DELAY: 16, // ~60fps
  
  // Local storage keys
  STORAGE_KEYS: {
    theme: 'home-theme-preference',
    animations: 'home-animations-enabled'
  },
  
  // CSS Classes
  CLASSES: {
    visible: 'animate-fade-in',
    slideLeft: 'animate-slide-in-left',
    slideRight: 'animate-slide-in-right',
    scaleIn: 'animate-scale-in',
    float: 'animate-float',
    pulse: 'animate-pulse',
    scrolled: 'scrolled',
    loading: 'loading',
    focusOutline: 'focus-outline'
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @return {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @return {Function} Throttled function
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if user prefers reduced motion
 * @return {boolean} True if reduced motion is preferred
 */
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Safe query selector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @return {Element|null} Found element or null
 */
const safeQuery = (selector, parent = document) => {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return null;
  }
};

/**
 * Safe query selector all with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @return {NodeList} NodeList of found elements
 */
const safeQueryAll = (selector, parent = document) => {
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return [];
  }
};

// ===== COMPONENT CLASSES =====

/**
 * Header Component - Manages header behavior and navigation
 */
class HeaderComponent {
  constructor() {
    this.header = safeQuery('.header');
    this.nav = safeQuery('.nav');
    this.mobileMenuButton = safeQuery('.mobile-menu-button');
    this.mobileMenu = safeQuery('.mobile-menu');
    this.lastScrollY = window.scrollY;
    
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    this.setupScrollBehavior();
    this.setupMobileMenu();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
  }
  
  setupScrollBehavior() {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      
      // Add/remove scrolled class
      if (currentScrollY > CONFIG.SCROLL_THRESHOLD) {
        this.header.classList.add(CONFIG.CLASSES.scrolled);
      } else {
        this.header.classList.remove(CONFIG.CLASSES.scrolled);
      }
      
      // Header hide/show on scroll (optional)
      if (currentScrollY > this.lastScrollY && currentScrollY > CONFIG.SCROLL_THRESHOLD) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }
      
      this.lastScrollY = currentScrollY;
    }, CONFIG.DEBOUNCE_DELAY);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  setupMobileMenu() {
    if (!this.mobileMenuButton || !this.mobileMenu) return;
    
    this.mobileMenuButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.mobileMenu.contains(e.target) && 
          !this.mobileMenuButton.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    const isOpen = this.mobileMenu.classList.contains('open');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.mobileMenu.classList.add('open');
    this.mobileMenuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstMenuItem = safeQuery('.nav-link', this.mobileMenu);
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }
  
  closeMobileMenu() {
    this.mobileMenu.classList.remove('open');
    this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  
  setupKeyboardNavigation() {
    const navLinks = safeQueryAll('.nav-link', this.nav);
    
    navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % navLinks.length;
          navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
          navLinks[prevIndex].focus();
        }
      });
    });
  }
  
  setupFocusManagement() {
    // Add focus outline class for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

/**
 * Animation Controller - Manages scroll-triggered animations
 */
class AnimationController {
  constructor() {
    this.observerOptions = {
      threshold: CONFIG.OBSERVER_THRESHOLD,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.animatedElements = new Set();
    this.init();
  }
  
  init() {
    if (prefersReducedMotion()) {
      this.disableAnimations();
      return;
    }
    
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupHoverAnimations();
  }
  
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.triggerAnimation(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, this.observerOptions);
    
    // Observe elements with animation attributes
    const animatableElements = safeQueryAll('[data-animate]');
    animatableElements.forEach(el => this.observer.observe(el));
  }
  
  triggerAnimation(element) {
    const animationType = element.dataset.animate || 'fade-in';
    const delay = parseInt(element.dataset.delay) || 0;
    
    setTimeout(() => {
      switch (animationType) {
        case 'slide-left':
          element.classList.add(CONFIG.CLASSES.slideLeft);
          break;
        case 'slide-right':
          element.classList.add(CONFIG.CLASSES.slideRight);
          break;
        case 'scale':
          element.classList.add(CONFIG.CLASSES.scaleIn);
          break;
        case 'fade-in':
        default:
          element.classList.add(CONFIG.CLASSES.visible);
          break;
      }
    }, delay);
  }
  
  setupScrollAnimations() {
    const statsNumbers = safeQueryAll('.stat-number');
    
    statsNumbers.forEach(stat => {
      this.observer.observe(stat);
      stat.addEventListener('animationstart', () => {
        this.animateCounter(stat);
      });
    });
  }
  
  setupHoverAnimations() {
    const cards = safeQueryAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion()) {
          const icon = safeQuery('.card-icon', card);
          if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
          }
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const icon = safeQuery('.card-icon', card);
        if (icon) {
          icon.style.transform = '';
        }
      });
    });
  }
  
  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[\d\s]/g, '');
    const duration = 2000;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(target * easeOutQuart);
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
  
  disableAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Button Component - Enhanced button functionality
 */
class ButtonComponent {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupButtons();
    this.setupLoadingStates();
    this.setupRippleEffect();
  }
  
  setupButtons() {
    const buttons = safeQueryAll('.btn');
    
    buttons.forEach(button => {
      // Add keyboard accessibility
      button.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          button.click();
        }
      });
      
      // Add focus management
      button.addEventListener('focus', () => {
        button.classList.add(CONFIG.CLASSES.focusOutline);
      });
      
      button.addEventListener('blur', () => {
        button.classList.remove(CONFIG.CLASSES.focusOutline);
      });
    });
  }
  
  setupLoadingStates() {
    // Example: Add loading state to form buttons
    const formButtons = safeQueryAll('.btn[type="submit"]');
    
    formButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.form && button.form.checkValidity()) {
          this.setLoading(button, true);
          
          // Simulate async operation
          setTimeout(() => {
            this.setLoading(button, false);
          }, 2000);
        }
      });
    });
  }
  
  setLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add(CONFIG.CLASSES.loading);
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
    } else {
      button.classList.remove(CONFIG.CLASSES.loading);
      button.setAttribute('aria-busy', 'false');
      button.disabled = false;
    }
  }
  
  setupRippleEffect() {
    const buttons = safeQueryAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (prefersReducedMotion()) return;
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.6s linear;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
    
    // Add ripple animation CSS
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

/**
 * Card Component - Enhanced card interactions
 */
class CardComponent {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupCards();
    this.setupCardAnimations();
  }
  
  setupCards() {
    const cards = safeQueryAll('.card');
    
    cards.forEach((card, index) => {
      // Add stagger delay for animations
      card.setAttribute('data-animate', 'fade-in');
      card.setAttribute('data-delay', index * 100);
      
      // Enhance accessibility
      if (!card.getAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      
      // Add keyboard interaction
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const link = safeQuery('.card-link', card);
          if (link) {
            link.click();
          }
        }
      });
    });
  }
  
  setupCardAnimations() {
    const cards = safeQueryAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion()) {
          card.style.transform = 'translateY(-4px)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
      
      card.addEventListener('focus', () => {
        card.classList.add(CONFIG.CLASSES.focusOutline);
      });
      
      card.addEventListener('blur', () => {
        card.classList.remove(CONFIG.CLASSES.focusOutline);
      });
    });
  }
}

/**
 * Form Component - Enhanced form handling
 */
class FormComponent {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupFormValidation();
    this.setupFormSubmission();
  }
  
  setupFormValidation() {
    const forms = safeQueryAll('form');
    
    forms.forEach(form => {
      const inputs = safeQueryAll('input, textarea, select', form);
      
      inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
          e.preventDefault();
          this.showValidationError(input);
        });
        
        input.addEventListener('input', () => {
          this.clearValidationError(input);
        });
      });
    });
  }
  
  setupFormSubmission() {
    const forms = safeQueryAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
          e.preventDefault();
          const firstInvalid = safeQuery(':invalid', form);
          if (firstInvalid) {
            firstInvalid.focus();
            this.showValidationError(firstInvalid);
          }
        }
      });
    });
  }
  
  showValidationError(input) {
    const errorId = input.id + '-error';
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'form-error';
      errorElement.setAttribute('role', 'alert');
      input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = input.validationMessage;
    input.setAttribute('aria-describedby', errorId);
    input.classList.add('error');
  }
  
  clearValidationError(input) {
    const errorId = input.id + '-error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    input.classList.remove('error');
  }
}

/**
 * Theme Controller - Dark/Light theme management
 */
class ThemeController {
  constructor() {
    this.currentTheme = this.getStoredTheme();
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeToggle();
    this.watchSystemTheme();
  }
  
  getStoredTheme() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.theme) || 'auto';
  }
  
  setStoredTheme(theme) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.theme, theme);
  }
  
  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      html.setAttribute('data-theme', theme);
    }
    
    this.currentTheme = theme;
  }
  
  setupThemeToggle() {
    const themeToggle = safeQuery('.theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
      const themes = ['light', 'dark', 'auto'];
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      
      this.applyTheme(nextTheme);
      this.setStoredTheme(nextTheme);
    });
  }
  
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applyTheme('auto');
      }
    });
  }
}

/**
 * Performance Monitor - Monitor and optimize performance
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    this.measurePageLoad();
    this.setupPerformanceObserver();
  }
  
  measurePageLoad() {
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        this.metrics.pageLoad = {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          totalTime: perfData.loadEventEnd - perfData.fetchStart
        };
        
        console.log('Page Load Metrics:', this.metrics.pageLoad);
      }
    });
  }
  
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.metrics.lcp = entry.startTime;
          } else if (entry.entryType === 'first-input') {
            this.metrics.fid = entry.processingStart - entry.startTime;
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }
  }
}

// ===== MAIN APPLICATION CLASS =====

/**
 * Main Application - Orchestrates all components
 */
class HomeApp {
  constructor() {
    this.components = new Map();
    this.isInitialized = false;
    
    this.init();
  }
  
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Initialize components
      this.initializeComponents();
      
      // Setup global event listeners
      this.setupGlobalEvents();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('Home App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Home App:', error);
    }
  }
  
  initializeComponents() {
    const componentClasses = [
      { name: 'header', class: HeaderComponent },
      { name: 'animation', class: AnimationController },
      { name: 'button', class: ButtonComponent },
      { name: 'card', class: CardComponent },
      { name: 'form', class: FormComponent },
      { name: 'theme', class: ThemeController },
      { name: 'performance', class: PerformanceMonitor }
    ];
    
    componentClasses.forEach(({ name, class: ComponentClass }) => {
      try {
        const instance = new ComponentClass();
        this.components.set(name, instance);
      } catch (error) {
        console.warn(`Failed to initialize ${name} component:`, error);
      }
    });
  }
  
  setupGlobalEvents() {
    // Handle window resize
    const handleResize = debounce(() => {
      // Update any resize-dependent calculations
      this.updateLayoutCalculations();
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
    });
  }
  
  updateLayoutCalculations() {
    // Update any dynamic calculations based on viewport size
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  pauseAnimations() {
    if (!prefersReducedMotion()) {
      document.body.classList.add('animations-paused');
    }
  }
  
  resumeAnimations() {
    document.body.classList.remove('animations-paused');
  }
  
  getComponent(name) {
    return this.components.get(name);
  }
  
  destroy() {
    // Cleanup event listeners and resources
    this.components.forEach(component => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    this.components.clear();
    this.isInitialized = false;
  }
}

// ===== ERROR HANDLING =====

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Optional: Send error to analytics service
  // analytics.reportError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Optional: Send error to analytics service
  // analytics.reportError(event.reason);
});

// ===== INITIALIZATION =====

// Initialize the application
let homeApp;

try {
  homeApp = new HomeApp();
} catch (error) {
  console.error('Failed to create Home App instance:', error);
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HomeApp,
    HeaderComponent,
    AnimationController,
    ButtonComponent,
    CardComponent,
    FormComponent,
    ThemeController,
    PerformanceMonitor,
    CONFIG,
    debounce,
    throttle,
    prefersReducedMotion,
    safeQuery,
    safeQueryAll
  };
}

// Add to global scope for browser usage
window.HomeApp = homeApp;
