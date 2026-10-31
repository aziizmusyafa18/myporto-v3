/**
 * Portofolio Interaktif - Muhammad Luthfi 'Aziiz Musyafa'
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollProgress();
  initScrollReveal();
  initNavScrollspy();
  initMobileMenu();
  initProjectFilters();
  initContactForm();
  initScrollToTop();
  updateFooterYear();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (LIGHT & DARK MODE DENGAN LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Cek preferensi tersimpan atau gunakan default 'light' sesuai permintaan (putih kombinasi hitam)
  const savedTheme = localStorage.getItem('porto_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('porto_theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. ON-SCROLL ANIMATION REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // Hanya animasikan sekali agar mulus
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAVIGATION LINK (SCROLLSPY)
   -------------------------------------------------------------------------- */
function initNavScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  function updateActiveNav() {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* --------------------------------------------------------------------------
   5. MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Tutup menu saat link diklik
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/* --------------------------------------------------------------------------
   6. PROJECT CATEGORY FILTERS
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE CONTACT FORM & WHATSAPP GENERATOR
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btnWhatsApp = document.getElementById('btnWhatsApp');
  const toast = document.getElementById('contactToast');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(text, duration = 3500) {
    if (!toast) return;
    toastMessage.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Handle Pengiriman Pesan via WhatsApp Langsung
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const name = document.getElementById('senderName').value.trim() || 'Teman';
      const contact = document.getElementById('senderContact').value.trim() || '-';
      const subject = document.getElementById('senderSubject').value.trim() || 'Tanya Portofolio / Peluang Kerjasama';
      const message = document.getElementById('senderMessage').value.trim() || 'Halo Mas Aziiz, saya tertarik untuk berdiskusi.';

      const formattedText = 
`Halo Mas Muhammad Luthfi 'Aziiz Musyafa',

Perkenalkan saya: ${name}
Kontak/Email: ${contact}
Perihal: ${subject}

Pesan:
${message}

(Terkirim melalui form portofolio https://github.com/aziizmusyafa18)`;

      // Nomor WhatsApp tujuan (User dapat menyesuaikan nomornya disini)
      // Mengarahkan ke WhatsApp Web/Mobile API
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
      
      showToast('Membuka aplikasi WhatsApp...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }

  // Handle Form Submit Standar (Simulasi pengiriman / Email trigger)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const contact = document.getElementById('senderContact').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      const mailtoUrl = `mailto:aziizmusyafa18@gmail.com?subject=${encodeURIComponent(`[Porto Kontak] ${subject} - ${name}`)}&body=${encodeURIComponent(`Halo Aziiz,\n\nSaya: ${name}\nKontak: ${contact}\n\n${message}`)}`;

      showToast(`Terima kasih, ${name}! Membuka aplikasi pesan/email...`);

      setTimeout(() => {
        window.location.href = mailtoUrl;
        form.reset();
      }, 1000);
    });
  }
}

/* --------------------------------------------------------------------------
   8. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scrollToTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   9. DYNAMIC YEAR
   -------------------------------------------------------------------------- */
function updateFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
