// Theme JavaScript Foundation
class Theme {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupCart();
    this.setupProductForms();
  }

  setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMain = document.querySelector('.nav-main');
    
    if (menuBtn && navMain) {
      menuBtn.addEventListener('click', () => {
        navMain.style.display = navMain.style.display === 'flex' ? 'none' : 'flex';
      });
    }
  }

  setupCart() {
    console.log('Cart system ready');
  }

  setupProductForms() {
    const productForms = document.querySelectorAll('form[action="/cart/add"]');
    productForms.forEach(form => {
      form.addEventListener('submit', this.handleProductFormSubmit.bind(this));
    });
  }

  handleProductFormSubmit(e) {
    e.preventDefault();
    console.log('Add to cart triggered');
  }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  window.themeApp = new Theme();
});
