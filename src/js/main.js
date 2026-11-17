/**
 * Main entry point – orchestrates navigation behaviour, smooth
 * scrolling, mobile menu, active-state highlighting, back-to-top,
 * and scroll-reveal animations.
 */

import { initRevealAnimations } from './animations.js';

/* ------------------------------------------------------------------ */
/*  Dynamic copyright year                                             */
/* ------------------------------------------------------------------ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ------------------------------------------------------------------ */
/*  Mobile navigation toggle                                           */
/* ------------------------------------------------------------------ */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const body = document.body;

function openMenu() {
  navLinks.classList.add('open');
  menuToggle.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
  body.classList.add('menu-open');
}

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  body.classList.remove('menu-open');
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ------------------------------------------------------------------ */
/*  Smooth scrolling for anchor links                                  */
/* ------------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Update URL hash without jumping
    history.pushState(null, '', targetId);
  });
});

/* ------------------------------------------------------------------ */
/*  Active navigation highlighting on scroll                           */
/* ------------------------------------------------------------------ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightActiveNav() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navAnchors.forEach((a) => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${sectionId}`) {
          a.classList.add('active');
        }
      });
    }
  });
}

// Throttle scroll handler for performance
let ticking = false;
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      highlightActiveNav();
      handleHeaderBackground();
      updateScrollControls();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ------------------------------------------------------------------ */
/*  Header background on scroll                                        */
/* ------------------------------------------------------------------ */
const header = document.querySelector('.site-header');
const backToTop = document.getElementById('back-to-top');
const progressBar = document.querySelector('.scroll-progress span');

function handleHeaderBackground() {
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

function updateScrollControls() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 520);
}

/* ------------------------------------------------------------------ */
/*  Keyboard navigation — close menu on Escape                         */
/* ------------------------------------------------------------------ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
    closeMenu();
    menuToggle?.focus();
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks?.classList.contains('open')) closeMenu();
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.project').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rotate-x', `${-y * 2}deg`);
      card.style.setProperty('--rotate-y', `${x * 2}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rotate-x');
      card.style.removeProperty('--rotate-y');
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Initialise reveal animations                                       */
/* ------------------------------------------------------------------ */
initRevealAnimations();

/* ------------------------------------------------------------------ */
/*  Initial state                                                      */
/* ------------------------------------------------------------------ */
highlightActiveNav();
handleHeaderBackground();
updateScrollControls();
