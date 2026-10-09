import './style.css';

function updateActiveNavLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (
      linkPath === currentPath ||
      (currentPath === '/' && (linkPath === '/' || linkPath === '/index.html')) ||
      (currentPath === '/index.html' && linkPath === '/')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initScripts() {
  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.onclick = () => {
      navLinks.classList.toggle('active');
    };
  }

  // Close mobile menu on nav link click
  const navAnchors = document.querySelectorAll('.nav-links a');
  navAnchors.forEach((a) => {
    a.onclick = () => {
      if (navLinks) navLinks.classList.remove('active');
    };
  });

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 80;
    
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Highlight active link
  updateActiveNavLinks();

  // Contact Form Handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.onsubmit = (e) => {
      e.preventDefault();
      const stateContainer = document.getElementById('formStateContainer');
      const loadingState = document.getElementById('loadingState');
      const successState = document.getElementById('successState');
      const errorState = document.getElementById('errorState');
      
      contactForm.style.display = 'none';
      if (stateContainer) stateContainer.style.display = 'flex';
      if (loadingState) loadingState.style.display = 'block';
      if (successState) successState.style.display = 'none';
      if (errorState) errorState.style.display = 'none';

      setTimeout(() => {
        if (loadingState) loadingState.style.display = 'none';
        const emailInput = document.getElementById('email');
        const email = emailInput ? emailInput.value : '';
        if (email.includes('error')) {
          if (errorState) errorState.style.display = 'block';
        } else {
          if (successState) successState.style.display = 'block';
        }
      }, 1200);
    };

    const resetForm = () => {
      const stateContainer = document.getElementById('formStateContainer');
      if (stateContainer) stateContainer.style.display = 'none';
      contactForm.style.display = 'block';
      contactForm.reset();
    };

    const resetBtn = document.getElementById('resetFormBtn');
    const retryBtn = document.getElementById('retryFormBtn');
    
    if (resetBtn) resetBtn.onclick = resetForm;
    if (retryBtn) retryBtn.onclick = resetForm;
  }
}

// Smooth Page Transition Navigation
async function navigateTo(targetUrl) {
  const wrapper = document.querySelector('.page-wrapper') || document.body;

  // 1. Smooth Fade-Out
  wrapper.classList.add('page-leaving');
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Update Document Title & URL
    document.title = doc.title;
    window.history.pushState({}, '', targetUrl);

    // Swap content
    const newWrapper = doc.querySelector('.page-wrapper');
    if (newWrapper && wrapper.classList.contains('page-wrapper')) {
      wrapper.innerHTML = newWrapper.innerHTML;
    } else {
      document.body.innerHTML = doc.body.innerHTML;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 2. Smooth Fade-In Animation
    const activeWrapper = document.querySelector('.page-wrapper') || document.body;
    activeWrapper.classList.remove('page-leaving');
    activeWrapper.classList.add('page-entering');

    // Force reflow
    void activeWrapper.offsetWidth;

    activeWrapper.classList.remove('page-entering');

    // Re-init scripts and reveals
    initScripts();
  } catch (err) {
    // Fallback if fetch fails
    window.location.href = targetUrl;
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link || !link.href) return;

  // Check if internal HTML navigation
  const isSameOrigin = link.origin === window.location.origin;
  const isSelf = link.target === '' || link.target === '_self';
  const isAnchor = link.getAttribute('href')?.startsWith('#');

  if (isSameOrigin && isSelf && !isAnchor) {
    // Ignore if already on the exact URL
    if (link.href === window.location.href) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    navigateTo(link.href);
  }
});

window.addEventListener('popstate', () => {
  navigateTo(window.location.href);
});

document.addEventListener('DOMContentLoaded', () => {
  initScripts();
});
