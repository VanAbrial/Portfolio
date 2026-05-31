// ===========================
// HAMBURGER MENU
// ===========================
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('open');
  });
}

if (navOverlay) navOverlay.addEventListener('click', closeMenu);
if (navLinks)   navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ===========================
// ACTIVE NAV LINK (throttled scroll)
// ===========================
const allNavLinks = document.querySelectorAll('.nav-links a');
const sections    = Array.from(document.querySelectorAll('section[id]'));

let scrollTick = false;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    const scrollY = window.scrollY + 120;
    let current = sections[0].id;
    for (const sec of sections) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    }
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
    scrollTick = false;
  });
}, { passive: true });

// ===========================
// SCROLL REVEAL — single IntersectionObserver
// ===========================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target); // stop watching after reveal
    }
  });
}, { rootMargin: '0px 0px -40px 0px', threshold: 0.07 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===========================
// SKILL BAR ANIMATION — piggybacked on reveal
// ===========================
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  const skillObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      entries[0].target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      skillObs.disconnect();
    }
  }, { threshold: 0.25 });
  skillObs.observe(skillsSection);
}

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===========================
// CERTIFICATE FILTER
// ===========================
const certFilters = document.querySelectorAll('.cert-filter');
const certCards   = document.querySelectorAll('.cert-card');

certFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    certFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    certCards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
    });
  });
});

// ===========================
// LIGHTBOX
// ===========================
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(wrap) {
  const img = wrap.querySelector('.cert-img');
  if (!img || wrap.classList.contains('no-img')) return;
  lightboxImg.src = img.src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});