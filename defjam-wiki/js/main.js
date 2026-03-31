/**
 * DEF JAM FIGHT FOR NY — WIKI JS
 * Scroll animations, interactions, glitch effects
 */

'use strict';

// ============================================================
// INTERSECTION OBSERVER — Reveal Animations
// ============================================================

const revealElements = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ============================================================
// STYLE BAR FILLS — Animate when cards become visible
// ============================================================

const styleCards = document.querySelectorAll('.style-card');

const styleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        styleObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

styleCards.forEach((card) => styleObserver.observe(card));

// ============================================================
// ACTIVE NAV LINK — Highlight on scroll
// ============================================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach((sec) => sectionObserver.observe(sec));

// ============================================================
// SMOOTH NAV CLICK
// ============================================================

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// MARQUEE DIVIDERS — Duplicate text for seamless loop
// ============================================================

document.querySelectorAll('.divider-text').forEach((el) => {
  const original = el.textContent;
  el.innerHTML = `${original} &nbsp;&nbsp;&nbsp; ${original} &nbsp;&nbsp;&nbsp; ${original} &nbsp;&nbsp;&nbsp; ${original} &nbsp;&nbsp;&nbsp; `;
});

// ============================================================
// GLITCH TRIGGER ON HOVER (nav logo area)
// ============================================================

const glitchEl = document.querySelector('.glitch');

if (glitchEl) {
  // Random additional glitch bursts
  setInterval(() => {
    if (Math.random() < 0.15) {
      glitchEl.style.animation = 'none';
      void glitchEl.offsetWidth; // reflow
      glitchEl.style.animation = '';
    }
  }, 3000);
}

// ============================================================
// FIGHTER CARDS — Stagger entrance
// ============================================================

const fighterCards = document.querySelectorAll('.fighter-card');

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const idx = Array.from(fighterCards).indexOf(card);
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.filter = 'blur(0)';
        }, idx * 60);
        cardObserver.unobserve(card);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fighterCards.forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.filter = 'blur(4px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease';
  cardObserver.observe(card);
});

// ============================================================
// TRACK CARDS — Hover interaction
// ============================================================

document.querySelectorAll('.track-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    const fill = card.querySelector('.track-fill');
    if (fill) {
      fill.style.animationPlayState = 'running';
    }
  });
});

// ============================================================
// VENUE NUMBERS — Count-up animation on enter
// ============================================================

const venueNumbers = document.querySelectorAll('.venue-number');

const venueObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'countUp 0.5s ease both';
        venueObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

venueNumbers.forEach((n) => venueObserver.observe(n));

// ============================================================
// HEADER PARALLAX
// ============================================================

const headerBg = document.querySelector('.header-bg');
const headerGraffiti = document.querySelector('.header-graffiti');

if (headerBg && headerGraffiti) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      headerGraffiti.style.transform = `translateY(calc(-50% + ${scrollY * 0.3}px)) rotate(-8deg)`;
      headerBg.style.opacity = 1 - scrollY / window.innerHeight;
    }
  }, { passive: true });
}

// ============================================================
// CURSOR TRAIL
// ============================================================

const trail = [];
const TRAIL_LENGTH = 8;

for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: ${4 + i * 1.5}px;
    height: ${4 + i * 1.5}px;
    border-radius: 50%;
    background: rgba(200,16,46,${0.6 - i * 0.07});
    pointer-events: none;
    z-index: 99997;
    transform: translate(-50%, -50%);
    transition: left 0.0${i + 1}s ease, top 0.0${i + 1}s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(dot);
  trail.push(dot);
}

document.addEventListener('mousemove', (e) => {
  trail.forEach((dot) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top  = `${e.clientY}px`;
  });
}, { passive: true });

// ============================================================
// INFO CARD FLICKER ON LOAD
// ============================================================

const infoCard = document.querySelector('.info-card');
if (infoCard) {
  setTimeout(() => {
    infoCard.style.transition = 'box-shadow 0.1s';
    let flickers = 0;
    const flicker = setInterval(() => {
      infoCard.style.boxShadow = flickers % 2 === 0
        ? '0 0 20px rgba(200,16,46,0.3)'
        : 'none';
      flickers++;
      if (flickers > 5) {
        clearInterval(flicker);
        infoCard.style.boxShadow = '';
      }
    }, 80);
  }, 1800);
}

// ============================================================
// SECTION BACKGROUND PULSE ON DIVIDERS
// ============================================================

document.querySelectorAll('.section-divider').forEach((div) => {
  div.addEventListener('mouseenter', () => {
    div.style.background = div.classList.contains('alt')
      ? 'linear-gradient(90deg, #0d0d0d 0%, #200808 50%, #0d0d0d 100%)'
      : '';
  });
  div.addEventListener('mouseleave', () => {
    div.style.background = '';
  });
});

// ============================================================
// SCORE COUNTER ANIMATION
// ============================================================

const scoreEl = document.querySelector('.score');
if (scoreEl) {
  const scoreObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        let count = 0;
        const target = 85;
        const step = () => {
          count += 3;
          if (count >= target) {
            scoreEl.textContent = '85/100';
            return;
          }
          scoreEl.textContent = `${count}/100`;
          requestAnimationFrame(step);
        };
        step();
        scoreObs.disconnect();
      }
    },
    { threshold: 1 }
  );
  scoreObs.observe(scoreEl);
}

// ============================================================
// CONSOLE EASTER EGG
// ============================================================

console.log('%cDEF JAM FIGHT FOR NY', 'font-size:2em;font-weight:bold;color:#c8102e;font-family:Impact,sans-serif;');
console.log('%cWiki by a fan. No affiliation with EA Games, Def Jam, or AKI Corporation.', 'color:#888;font-size:0.9em;');
console.log('%c"The streets of NY are mine." — D-Mob', 'color:#d4a017;font-style:italic;');
