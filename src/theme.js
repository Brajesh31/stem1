/**
 * PROJECT SPARK - THEME MANAGEMENT SYSTEM
 * 
 * This module handles theme switching functionality with localStorage persistence
 * and smooth transitions between light and dark modes.
 */

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  /**
   * Initialize theme system
   */
  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
    this.bindEvents();
    this.addThemeTransition();
  }

  /**
   * Get theme preference from localStorage
   */
  getStoredTheme() {
    try {
      return localStorage.getItem('spark-theme');
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  }

  /**
   * Get system theme preference
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    // Store preference
    try {
      localStorage.setItem('spark-theme', theme);
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    const themeColors = {
      light: '#ffffff',
      dark: '#0f172a'
    };

    metaThemeColor.content = themeColors[theme] || themeColors.light;
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.updateToggleButton();
    
    // Add a subtle animation to indicate theme change
    this.animateThemeChange();
  }

  /**
   * Create theme toggle button
   */
  createThemeToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) {
      return;
    }

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.setAttribute('title', 'Switch between light and dark themes');
    
    this.updateToggleButtonContent(toggle);
    
    document.body.appendChild(toggle);
    
    // Add click handler
    toggle.addEventListener('click', () => this.toggleTheme());
  }

  /**
   * Update toggle button content based on current theme
   */
  updateToggleButtonContent(button) {
    const icons = {
      light: '🌙',
      dark: '☀️'
    };
    
    button.textContent = icons[this.currentTheme] || icons.light;
  }

  /**
   * Update existing toggle button
   */
  updateToggleButton() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      this.updateToggleButtonContent(toggle);
    }
  }

  /**
   * Add smooth transition for theme changes
   */
  addThemeTransition() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        transition: background-color 0.3s ease, 
                    color 0.3s ease, 
                    border-color 0.3s ease,
                    box-shadow 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);
    
    // Remove transition after theme change completes
    setTimeout(() => {
      style.remove();
    }, 300);
  }

  /**
   * Animate theme change with a subtle effect
   */
  animateThemeChange() {
    document.body.style.transform = 'scale(0.99)';
    document.body.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      document.body.style.transform = 'scale(1)';
      setTimeout(() => {
        document.body.style.transform = '';
        document.body.style.transition = '';
      }, 100);
    }, 50);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
          this.updateToggleButton();
        }
      });
    }

    // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Reapply theme when page becomes visible (handles system changes)
        const storedTheme = this.getStoredTheme();
        if (storedTheme && storedTheme !== this.currentTheme) {
          this.applyTheme(storedTheme);
          this.updateToggleButton();
        }
      }
    });
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Set theme programmatically
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
      this.updateToggleButton();
    }
  }

  /**
   * Add theme-aware animations to elements
   */
  addAnimations() {
    // Add entrance animations to cards
    const cards = document.querySelectorAll('.card, .feature-card, .role-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-fade-in-up');
    });

    // Add stagger animation to grid containers
    const grids = document.querySelectorAll('.grid, .features, .role-cards');
    grids.forEach(grid => {
      grid.classList.add('animate-stagger');
    });
  }

  /**
   * Initialize theme-aware components
   */
  initializeComponents() {
    // Add interactive classes to clickable elements
    const interactiveElements = document.querySelectorAll('.card, .btn, .role-card');
    interactiveElements.forEach(element => {
      if (!element.classList.contains('interactive')) {
        element.classList.add('interactive');
      }
    });

    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        if (this.classList.contains('btn--loading')) return;
        
        this.classList.add('loading');
        setTimeout(() => {
          this.classList.remove('loading');
        }, 1000);
      });
    });
  }
}

/**
 * Utility functions for theme management
 */
const ThemeUtils = {
  /**
   * Get CSS custom property value
   */
  getCSSVariable(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  },

  /**
   * Set CSS custom property value
   */
  setCSSVariable(property, value) {
    document.documentElement.style.setProperty(property, value);
  },

  /**
   * Check if dark theme is active
   */
  isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  },

  /**
   * Get theme-appropriate color
   */
  getThemeColor(lightColor, darkColor) {
    return this.isDarkTheme() ? darkColor : lightColor;
  },

  /**
   * Add theme-aware event listener
   */
  onThemeChange(callback) {
    window.addEventListener('themeChanged', callback);
  },

  /**
   * Remove theme change listener
   */
  offThemeChange(callback) {
    window.removeEventListener('themeChanged', callback);
  }
};

/**
 * Initialize theme system when DOM is ready
 */
function initializeTheme() {
  const themeManager = new ThemeManager();
  
  // Add animations after a short delay to ensure styles are loaded
  setTimeout(() => {
    themeManager.addAnimations();
    themeManager.initializeComponents();
  }, 100);

  // Make theme manager globally available
  window.ThemeManager = themeManager;
  window.ThemeUtils = ThemeUtils;

  // Add theme debugging in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🎨 Project Spark Theme System Initialized');
    console.log('Current theme:', themeManager.getCurrentTheme());
    console.log('Use Ctrl/Cmd + Shift + T to toggle theme');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
  initializeTheme();
}

/**
 * Export for module systems
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, ThemeUtils };
}