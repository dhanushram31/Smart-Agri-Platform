/**
 * ====================================================================
 * SCHEME PORTAL INTERACTIVE ENHANCEMENTS
 * Modern JavaScript Features for Agriculture AI Platform
 * ====================================================================
 * 
 * Features:
 * - Search and Filter System
 * - Category Filtering
 * - Modal Popup for Scheme Details
 * - Scroll-to-Top Button
 * - Animated Counters
 * - Card Reveal Animations
 * - Ripple Effects
 * - Toast Notifications
 * - Smooth Scrolling
 * - Theme Toggle Persistence
 * 
 * Usage: Import and call initSchemePortalEnhancements() in your component
 */

/* ====================================================================
   INITIALIZATION
   ==================================================================== */

export function initSchemePortalEnhancements() {
  console.log('🌾 Initializing Scheme Portal Enhancements...');
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
  } else {
    initializeFeatures();
  }
}

function initializeFeatures() {
  initScrollToTop();
  initAnimatedCounters();
  initCardReveal();
  initSearchFilter();
  initCategoryFilter();
  initSchemeModal();
  initRippleEffects();
  initSmoothScroll();
  initThemePersistence();
  
  console.log('✅ All Scheme Portal enhancements initialized successfully!');
}

/* ====================================================================
   SCROLL-TO-TOP BUTTON
   ==================================================================== */

function initScrollToTop() {
  // Create scroll-to-top button
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  `;
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #2E7D32, #A7D129);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
  `;
  
  document.body.appendChild(scrollBtn);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  });
  
  // Scroll to top on click
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    showToast('Scrolled to top!', 'success');
  });
  
  // Hover effects
  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
    scrollBtn.style.boxShadow = '0 12px 32px rgba(46, 125, 50, 0.4)';
  });
  
  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.transform = 'translateY(0) scale(1)';
    scrollBtn.style.boxShadow = '0 8px 24px rgba(46, 125, 50, 0.3)';
  });
}

/* ====================================================================
   ANIMATED COUNTERS
   ==================================================================== */

function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-info h3');
  
  counters.forEach(counter => {
    const updateCounter = () => {
      const target = counter.textContent;
      const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
      
      if (isNaN(numericValue)) return;
      
      const suffix = target.replace(/[0-9.]/g, '');
      const duration = 2000;
      const increment = numericValue / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          counter.textContent = numericValue + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, 16);
    };
    
    // Trigger animation when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

/* ====================================================================
   CARD REVEAL ANIMATIONS
   ==================================================================== */

function initCardReveal() {
  const cards = document.querySelectorAll('.card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

/* ====================================================================
   SEARCH AND FILTER SYSTEM
   ==================================================================== */

function initSearchFilter() {
  // Create search bar if it doesn't exist
  const sectionHeader = document.querySelector('.section-header');
  if (!sectionHeader) return;
  
  const existingSearch = document.querySelector('.scheme-search-bar');
  if (existingSearch) return;
  
  const searchContainer = document.createElement('div');
  searchContainer.className = 'scheme-search-container';
  searchContainer.style.cssText = `
    margin-top: 1.5rem;
    position: relative;
  `;
  
  const searchBar = document.createElement('div');
  searchBar.className = 'scheme-search-bar';
  searchBar.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 600px;
  `;
  
  searchBar.innerHTML = `
    <svg style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 1.25rem; height: 1.25rem; color: #6B7280; pointer-events: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
    <input 
      type="text" 
      id="schemeSearchInput" 
      placeholder="Search schemes by name, category, or description..."
      style="
        width: 100%;
        padding: 1rem 1rem 1rem 3rem;
        border: 2px solid rgba(46, 125, 50, 0.15);
        border-radius: 16px;
        font-size: 0.9375rem;
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(20px);
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
      "
    />
  `;
  
  searchContainer.appendChild(searchBar);
  sectionHeader.appendChild(searchContainer);
  
  // Add focus effects
  const input = searchBar.querySelector('input');
  input.addEventListener('focus', () => {
    input.style.borderColor = '#2E7D32';
    input.style.boxShadow = '0 4px 20px rgba(46, 125, 50, 0.15)';
  });
  
  input.addEventListener('blur', () => {
    input.style.borderColor = 'rgba(46, 125, 50, 0.15)';
    input.style.boxShadow = 'none';
  });
  
  // Search functionality
  input.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    let visibleCount = 0;
    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.badge')?.textContent.toLowerCase() || '';
      
      if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Show message if no results
    showSearchResults(visibleCount);
  });
}

function showSearchResults(count) {
  const existingMessage = document.querySelector('.search-results-message');
  if (existingMessage) existingMessage.remove();
  
  if (count === 0) {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    
    const message = document.createElement('div');
    message.className = 'search-results-message';
    message.style.cssText = `
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #6B7280;
      font-size: 1.125rem;
    `;
    message.innerHTML = `
      <svg style="width: 4rem; height: 4rem; margin: 0 auto 1rem; color: #A7D129;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <p style="font-weight: 600; color: #1B4332; margin-bottom: 0.5rem;">No schemes found</p>
      <p>Try adjusting your search terms or filters</p>
    `;
    grid.appendChild(message);
  }
}

/* ====================================================================
   CATEGORY FILTER
   ==================================================================== */

function initCategoryFilter() {
  const categories = ['All', 'Income Support', 'Insurance', 'Soil Management', 'Market Access', 'Credit Support', 'Irrigation'];
  
  const filterContainer = document.createElement('div');
  filterContainer.className = 'category-filter';
  filterContainer.style.cssText = `
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin: 1.5rem 0;
    padding: 1rem 0;
  `;
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `filter-btn ${category === 'All' ? 'active' : ''}`;
    button.textContent = category;
    button.style.cssText = `
      padding: 0.625rem 1.25rem;
      border-radius: 9999px;
      border: 2px solid rgba(46, 125, 50, 0.2);
      background: rgba(255, 255, 255, 0.75);
      color: #2D6A4F;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Poppins', sans-serif;
    `;
    
    button.addEventListener('click', () => {
      // Update active state
      filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'rgba(255, 255, 255, 0.75)';
        btn.style.color = '#2D6A4F';
        btn.style.borderColor = 'rgba(46, 125, 50, 0.2)';
      });
      
      button.classList.add('active');
      button.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
      button.style.color = 'white';
      button.style.borderColor = 'transparent';
      
      // Filter cards
      filterSchemes(category);
      showToast(`Filtered by: ${category}`, 'info');
    });
    
    filterContainer.appendChild(button);
  });
  
  const searchContainer = document.querySelector('.scheme-search-container');
  if (searchContainer) {
    searchContainer.appendChild(filterContainer);
  }
}

function filterSchemes(category) {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const categoryBadge = card.querySelector('.badge-primary')?.textContent || '';
    
    if (category === 'All' || categoryBadge === category) {
      card.style.display = '';
      card.style.animation = 'cardFloat 0.6s ease-out';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ====================================================================
   SCHEME MODAL POPUP
   ==================================================================== */

function initSchemeModal() {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'scheme-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.className = 'scheme-modal-content';
  modalContent.style.cssText = `
    background: white;
    border-radius: 20px;
    padding: 2.5rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 64px rgba(46, 125, 50, 0.25);
    position: relative;
    animation: modalSlideIn 0.4s ease-out;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: none;
    background: #F0F4F1;
    color: #1B4332;
    font-size: 1.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = '#2E7D32';
    closeBtn.style.color = 'white';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = '#F0F4F1';
    closeBtn.style.color = '#1B4332';
  });
  
  modalContent.appendChild(closeBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Add CSS for modal animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

/* ====================================================================
   RIPPLE EFFECTS
   ==================================================================== */

function initRippleEffects() {
  const buttons = document.querySelectorAll('.btn, .nav-item, .mobile-nav-item, .filter-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ====================================================================
   TOAST NOTIFICATIONS
   ==================================================================== */

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const colors = {
    success: { bg: '#2E7D32', icon: '✓' },
    error: { bg: '#DC2626', icon: '✕' },
    warning: { bg: '#F59E0B', icon: '⚠' },
    info: { bg: '#0EA5E9', icon: 'ℹ' }
  };
  
  const config = colors[type] || colors.info;
  
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${config.bg};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    font-size: 0.9375rem;
    z-index: 10001;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: toastSlideUp 0.4s ease-out forwards;
    font-family: 'Poppins', sans-serif;
  `;
  
  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${config.icon}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastSlideUp {
      to {
        transform: translateX(-50%) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'toastSlideUp 0.4s ease-out reverse';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ====================================================================
   SMOOTH SCROLLING
   ==================================================================== */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ====================================================================
   THEME PERSISTENCE
   ==================================================================== */

function initThemePersistence() {
  const theme = localStorage.getItem('schemePortalTheme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  const themeToggle = document.querySelector('.btn-ghost');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('schemePortalTheme', 'dark');
        showToast('Dark mode enabled', 'success');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('schemePortalTheme', 'light');
        showToast('Light mode enabled', 'success');
      }
    });
  }
}

/* ====================================================================
   EXPORT
   ==================================================================== */

export default {
  init: initSchemePortalEnhancements,
  showToast,
  filterSchemes
};
