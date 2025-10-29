/**
 * =====================================================
 * LABOUR HUB UI ENHANCEMENTS
 * Agriculture-Themed Job Portal Micro-Interactions
 * =====================================================
 */

// Scroll-to-Top Button Functionality
export const initScrollToTop = () => {
  // Create scroll-to-top button if it doesn't exist
  let scrollBtn = document.querySelector('.scroll-to-top');
  
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
  }

  // Show/hide button based on scroll position
  const toggleScrollButton = () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Event listeners
  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  scrollBtn.addEventListener('click', scrollToTop);

  // Initial check
  toggleScrollButton();

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', toggleScrollButton);
    scrollBtn.removeEventListener('click', scrollToTop);
  };
};

// Animated Counter for Stats
export const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  // Use Intersection Observer to trigger animation when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(element);
};

// Initialize all stat counters
export const initStatCounters = () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.textContent);
    if (!isNaN(target)) {
      stat.textContent = '0';
      animateCounter(stat, target, 1500);
    }
  });
};

// Smooth Card Reveal on Scroll
export const initCardReveal = () => {
  const cards = document.querySelectorAll('.job-card, .farmer-job-card');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  cards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
};

// Search Input Focus Animation
export const initSearchAnimation = () => {
  const searchInput = document.querySelector('.search-bar input');
  
  if (searchInput) {
    searchInput.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.01)';
    });

    searchInput.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  }
};

// Button Ripple Effect
export const addRippleEffect = (button) => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
};

// Initialize all ripple effects
export const initRippleEffects = () => {
  const buttons = document.querySelectorAll(
    '.btn-primary, .btn-secondary, .apply-btn, .role-option'
  );
  
  buttons.forEach(addRippleEffect);

  // Add ripple CSS
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
      
      .btn-primary,
      .btn-secondary,
      .apply-btn,
      .role-option {
        position: relative;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }
};

// Toast Notification System
export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Add toast styles if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast {
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 16px 28px;
        background: linear-gradient(135deg, #2F5D3A, #A7D129);
        color: white;
        border-radius: 12px;
        box-shadow: 0 12px 35px rgba(47, 93, 58, 0.35);
        font-weight: 600;
        font-size: 0.95rem;
        z-index: 10000;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        backdrop-filter: blur(10px);
      }
      
      .toast.show {
        transform: translateX(-50%) translateY(0);
      }
      
      .toast-error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }
      
      .toast-warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
      
      .toast-info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Initialize all enhancements
export const initAllEnhancements = () => {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollToTop();
      initStatCounters();
      initCardReveal();
      initSearchAnimation();
      initRippleEffects();
    });
  } else {
    initScrollToTop();
    initStatCounters();
    initCardReveal();
    initSearchAnimation();
    initRippleEffects();
  }
};

// Export default initialization
export default initAllEnhancements;
