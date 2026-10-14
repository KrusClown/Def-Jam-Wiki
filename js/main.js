/* ============================================================
   DEF JAM FIGHT FOR NY — WIKI  |  MAIN JS
   ============================================================ */

/* ── console easter egg ─────────────────────────────────── */
console.log(
  '%c DEF JAM: FIGHT FOR NY %c\n%c Wiki — Unofficial Fan Resource\n"The Streets of New York Never Sleep" ',
  'background:#f5c518;color:#050505;font-family:monospace;font-size:22px;font-weight:bold;padding:8px 20px;',
  '',
  'background:#111;color:#f5c518;font-family:monospace;font-size:12px;padding:4px 10px;'
);

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════════════════════
   STYLE BARS
═══════════════════════════════════════════════════════════ */
const styleObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      styleObs.unobserve(e.target);
    }
  });
}, { threshold: .3 });

document.querySelectorAll('.style-card').forEach(el => styleObs.observe(el));

/* ═══════════════════════════════════════════════════════════
   ACTIVE NAV
═══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObs.observe(s));

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════════════════════
   HEADER PARALLAX
═══════════════════════════════════════════════════════════ */
const graffiti = document.querySelector('.header-graffiti');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (graffiti) graffiti.style.transform = `translateY(calc(-50% + ${y * .2}px)) rotate(-8deg)`;
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   MARQUEE DUPLICATION
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.divider-text').forEach(el => {
  const orig = el.innerHTML;
  el.innerHTML = orig + '&nbsp;&nbsp;&nbsp;&nbsp;' + orig + '&nbsp;&nbsp;&nbsp;&nbsp;' + orig;
});
document.querySelectorAll('.stats-ticker-inner').forEach(el => {
  el.innerHTML += el.innerHTML;
});

/* ═══════════════════════════════════════════════════════════
   GLITCH BURST
═══════════════════════════════════════════════════════════ */
const glitchEl = document.querySelector('.title-ny');
function triggerGlitch() {
  if (!glitchEl) return;
  glitchEl.classList.remove('glitch');
  void glitchEl.offsetWidth; // reflow
  glitchEl.classList.add('glitch');
}
setInterval(() => {
  if (Math.random() > .6) triggerGlitch();
}, 2800);

/* ═══════════════════════════════════════════════════════════
   CURSOR TRAIL
═══════════════════════════════════════════════════════════ */
const TRAIL = 8;
const dots = Array.from({ length: TRAIL }, (_, i) => {
  const d = document.createElement('div');
  d.className = 'cursor-dot';
  d.style.cssText = `
    transition: left ${.06 + i * .04}s ease, top ${.06 + i * .04}s ease;
    opacity: ${1 - i / TRAIL};
    width: ${Math.max(2, 6 - i)}px;
    height: ${Math.max(2, 6 - i)}px;
  `;
  document.body.appendChild(d);
  return d;
});

let mx = -100, my = -100;
document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

function trailLoop() {
  dots.forEach((d, i) => {
    if (i === 0) {
      d.style.left = mx + 'px';
      d.style.top  = my + 'px';
    } else {
      const prev = dots[i - 1];
      const px = parseFloat(prev.style.left) || mx;
      const py = parseFloat(prev.style.top)  || my;
      d.style.left = (px * .4 + (parseFloat(d.style.left) || mx) * .6) + 'px';
      d.style.top  = (py * .4 + (parseFloat(d.style.top)  || my) * .6) + 'px';
    }
  });
  requestAnimationFrame(trailLoop);
}
trailLoop();

/* ═══════════════════════════════════════════════════════════
   SCORE COUNTER
═══════════════════════════════════════════════════════════ */
const scoreEl = document.getElementById('metacritic-score');
if (scoreEl) {
  const target = parseInt(scoreEl.dataset.score || '85', 10);
  let started = false;
  const scoreObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      let current = 0;
      const start = performance.now();
      const dur = 1400;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        current = Math.round(ease * target);
        scoreEl.textContent = current;
        if (p < 1) requestAnimationFrame(tick);
        else scoreEl.classList.add('animating');
      }
      requestAnimationFrame(tick);
    }
  }, { threshold: .5 });
  scoreObs.observe(scoreEl);
}

/* ═══════════════════════════════════════════════════════════
   FIGHTER FILTER
═══════════════════════════════════════════════════════════ */
const searchInput  = document.getElementById('fighterSearch');
const filterBtns   = document.querySelectorAll('.filter-btn');
const allCards     = document.querySelectorAll('.fighter-card');
const rosterGroups = document.querySelectorAll('.roster-group');

function applyFilter() {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const activeBtn = document.querySelector('.filter-btn.active');
  const group = activeBtn ? activeBtn.dataset.filter : 'all';

  allCards.forEach(card => {
    const matchSearch = !query || (card.dataset.name || '').toLowerCase().includes(query);
    const matchGroup  = group === 'all' || card.dataset.group === group;
    card.classList.toggle('hidden', !(matchSearch && matchGroup));
  });

  rosterGroups.forEach(grp => {
    const visible = grp.querySelectorAll('.fighter-card:not(.hidden)').length;
    grp.style.display = visible === 0 ? 'none' : '';
  });
}

if (searchInput) {
  searchInput.addEventListener('input', applyFilter);
}
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter();
  });
});

/* ═══════════════════════════════════════════════════════════
   FIGHTER CARD — EXPAND / COLLAPSE BIO
═══════════════════════════════════════════════════════════ */
allCards.forEach(card => {
  const bio = card.querySelector('.fighter-bio');
  if (!bio) return;
  const full = bio.textContent;
  const short = full.length > 120 ? full.slice(0, 120) + '…' : full;
  bio.textContent = short;
  if (full.length > 120) {
    bio.style.cursor = 'pointer';
    let expanded = false;
    bio.addEventListener('click', (e) => {
      e.stopPropagation();
      expanded = !expanded;
      bio.textContent = expanded ? full : short;
      bio.style.color = expanded ? 'var(--white)' : '';
    });
    bio.title = 'Click to read more';
  }
});

/* ═══════════════════════════════════════════════════════════
   HOVER SOUND-WAVE ON FIGHTER CARDS (CSS class toggle)
═══════════════════════════════════════════════════════════ */
allCards.forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('hovered'));
  card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
});

/* ═══════════════════════════════════════════════════════════
   TRACK CARD — staggered scan delay
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.track-fill').forEach((fill, i) => {
  fill.style.animationDelay = (i * .09) % 2.8 + 's';
});

/* ═══════════════════════════════════════════════════════════
   LAZY SECTION BG TINT on scroll
═══════════════════════════════════════════════════════════ */
const sectionObsGlow = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in-view');
  });
}, { threshold: .05 });
document.querySelectorAll('.section').forEach(s => sectionObsGlow.observe(s));
