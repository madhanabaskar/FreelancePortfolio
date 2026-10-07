import './style.css';

function initScripts() {
  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on init

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger on init

  // Contact Form Handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const stateContainer = document.getElementById('formStateContainer');
      const loadingState = document.getElementById('loadingState');
      const successState = document.getElementById('successState');
      const errorState = document.getElementById('errorState');
      
      contactForm.style.display = 'none';
      stateContainer.style.display = 'flex';
      loadingState.style.display = 'block';
      successState.style.display = 'none';
      errorState.style.display = 'none';

      // Simulate network request
      setTimeout(() => {
        loadingState.style.display = 'none';
        
        // Show error if email contains 'error', else success
        const email = document.getElementById('email').value;
        if (email.includes('error')) {
          errorState.style.display = 'block';
        } else {
          successState.style.display = 'block';
        }
      }, 1500);
    });

    const resetForm = () => {
      document.getElementById('formStateContainer').style.display = 'none';
      contactForm.style.display = 'block';
      contactForm.reset();
    };

    const resetBtn = document.getElementById('resetFormBtn');
    const retryBtn = document.getElementById('retryFormBtn');
    
    if (resetBtn) resetBtn.addEventListener('click', resetForm);
    if (retryBtn) retryBtn.addEventListener('click', resetForm);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initScripts();
});

// Simple SPA Router to prevent page blink
document.addEventListener('click', async (e) => {
  const link = e.target.closest('a');
  if (!link || !link.href) return;
  
  // Only intercept internal links
  if (link.origin === window.location.origin && !link.hash) {
    e.preventDefault();
    
    const targetUrl = link.href;
    if (targetUrl === window.location.href) return; // Ignore if already on the page

    try {
      // Add a subtle fade out to the body content (optional, but makes it smooth)
      document.body.style.opacity = '0.5';
      document.body.style.transition = 'opacity 200ms ease';

      const response = await fetch(targetUrl);
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Update Title and URL
      document.title = doc.title;
      window.history.pushState({}, '', targetUrl);
      
      // Replace body content completely
      document.body.innerHTML = doc.body.innerHTML;
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Re-initialize all scripts on the new DOM
      initScripts();
      
      // Fade back in
      document.body.style.opacity = '1';
    } catch (err) {
      // Fallback in case of fetch failure
      window.location.href = targetUrl;
    }
  }
});

window.addEventListener('popstate', async () => {
  try {
    const response = await fetch(window.location.href);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    document.title = doc.title;
    document.body.innerHTML = doc.body.innerHTML;
    initScripts();
  } catch(err) {
    window.location.reload();
  }
});
