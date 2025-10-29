// ================================================================
// TOOLS PAGE ENHANCEMENTS - Interactive Features
// Agriculture AI Platform Theme
// ================================================================

/**
 * Initialize all Tools Page enhancements
 * Call this function after component mounts
 */
export function initToolsPageEnhancements() {
  console.log('🌾 Initializing Tools Page Enhancements...');
  
  // Initialize all features
  initScrollToTop();
  initCardRevealAnimation();
  initToolCardInteractions();
  initCounterAnimations();
  initSmoothScroll();
  initToolSearch();
  
  console.log('✅ Tools Page Enhancements Loaded');
}

// ================================================================
// SCROLL TO TOP BUTTON
// ================================================================

function initScrollToTop() {
  // Create scroll-to-top button
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.innerHTML = '↑';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollBtn);
  
  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
  
  // Smooth scroll to top
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ================================================================
// CARD REVEAL ANIMATION ON SCROLL
// ================================================================

function initCardRevealAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all animatable elements
  const elements = document.querySelectorAll(
    '.tool-category, .feature-item, .stat-item, .step-item'
  );
  
  elements.forEach(el => {
    // Set initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ================================================================
// TOOL CARD INTERACTIONS
// ================================================================

function initToolCardInteractions() {
  const toolCards = document.querySelectorAll('.tool-card');
  
  toolCards.forEach(card => {
    // Add ripple effect on click
    card.addEventListener('click', function(e) {
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
        background: rgba(167, 209, 41, 0.3);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
      `;
      
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
    
    // Add keyboard navigation
    card.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Add ripple animation to stylesheet
  if (!document.getElementById('ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================================
// ANIMATED COUNTERS FOR STATS
// ================================================================

function initCounterAnimations() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element) => {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/\D/g, ''));
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    const stepTime = duration / steps;
    let current = 0;
    
    const counter = setInterval(() => {
      current += increment;
      if (current >= number) {
        element.textContent = text;
        clearInterval(counter);
      } else {
        if (hasPercent) {
          element.textContent = Math.floor(current) + '%';
        } else {
          element.textContent = Math.floor(current);
        }
      }
    }, stepTime);
  };
  
  // Intersection observer for counters
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => observer.observe(stat));
}

// ================================================================
// SMOOTH SCROLL FOR INTERNAL LINKS
// ================================================================

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

// ================================================================
// TOOL SEARCH FUNCTIONALITY (Optional Enhancement)
// ================================================================

function initToolSearch() {
  // Create search bar if it doesn't exist
  const toolsContent = document.querySelector('.tools-content');
  if (!toolsContent || document.querySelector('.tools-search')) return;
  
  const searchContainer = document.createElement('div');
  searchContainer.className = 'tools-search';
  searchContainer.innerHTML = `
    <div style="
      max-width: 600px;
      margin: 0 auto 40px;
      position: relative;
    ">
      <input 
        type="text" 
        placeholder="🔍 Search tools..." 
        style="
          width: 100%;
          padding: 16px 50px 16px 20px;
          border: 2px solid rgba(167, 209, 41, 0.3);
          border-radius: 16px;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          background: white;
        "
        id="toolSearchInput"
      />
      <span style="
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.2rem;
        color: #A7D129;
      ">🔍</span>
    </div>
  `;
  
  const toolsGrid = document.querySelector('.tools-grid');
  if (toolsGrid) {
    toolsGrid.parentNode.insertBefore(searchContainer, toolsGrid);
  }
  
  const searchInput = document.getElementById('toolSearchInput');
  if (!searchInput) return;
  
  // Focus effect
  searchInput.addEventListener('focus', function() {
    this.style.borderColor = '#A7D129';
    this.style.boxShadow = '0 4px 16px rgba(167, 209, 41, 0.2)';
  });
  
  searchInput.addEventListener('blur', function() {
    this.style.borderColor = 'rgba(167, 209, 41, 0.3)';
    this.style.boxShadow = 'none';
  });
  
  // Search functionality
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const categories = document.querySelectorAll('.tool-category');
    let visibleCount = 0;
    
    categories.forEach(category => {
      const categoryTitle = category.querySelector('.category-title')?.textContent.toLowerCase() || '';
      const categoryDesc = category.querySelector('.category-description')?.textContent.toLowerCase() || '';
      const tools = category.querySelectorAll('.tool-card');
      let categoryHasMatch = false;
      
      // Check category title/description
      if (categoryTitle.includes(searchTerm) || categoryDesc.includes(searchTerm)) {
        categoryHasMatch = true;
      }
      
      // Check individual tools
      tools.forEach(tool => {
        const toolName = tool.querySelector('.tool-name')?.textContent.toLowerCase() || '';
        const toolDesc = tool.querySelector('.tool-description')?.textContent.toLowerCase() || '';
        
        if (searchTerm === '' || 
            toolName.includes(searchTerm) || 
            toolDesc.includes(searchTerm) ||
            categoryHasMatch) {
          tool.style.display = 'flex';
          categoryHasMatch = true;
        } else {
          tool.style.display = 'none';
        }
      });
      
      // Show/hide entire category
      if (categoryHasMatch) {
        category.style.display = 'block';
        visibleCount++;
      } else {
        category.style.display = 'none';
      }
    });
    
    // Show "no results" message
    let noResults = document.querySelector('.no-results-message');
    if (visibleCount === 0 && searchTerm !== '') {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.style.cssText = `
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        `;
        noResults.innerHTML = `
          <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: #2F5D3A;">No tools found</h3>
          <p>Try searching with different keywords</p>
        `;
        toolsGrid?.appendChild(noResults);
      }
      noResults.style.display = 'block';
    } else if (noResults) {
      noResults.style.display = 'none';
    }
  });
}

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Show a toast notification
 */
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'tools-toast';
  toast.textContent = message;
  
  const colors = {
    success: '#40916C',
    error: '#E63946',
    warning: '#F4A261',
    info: '#2A9D8F'
  };
  
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${colors[type] || colors.info};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ================================================================
// AUTO-INITIALIZE ON DOM READY
// ================================================================

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToolsPageEnhancements);
  } else {
    // DOM already loaded
    initToolsPageEnhancements();
  }
}

// ================================================================
// EXPORT FOR MANUAL INITIALIZATION
// ================================================================

export default {
  init: initToolsPageEnhancements,
  showToast,
  initScrollToTop,
  initCardRevealAnimation,
  initToolCardInteractions,
  initCounterAnimations,
  initSmoothScroll,
  initToolSearch
};
