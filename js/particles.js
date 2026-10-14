/* ============================================================
   DEF JAM WIKI — Particle / Spark Engine
   Canvas-based atmospheric background effect
   ============================================================ */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;
  const MAX = 60;

  // color palette — yellow / amber / white sparks
  const COLORS = [
    'rgba(245,197,24,',
    'rgba(255,229,102,',
    'rgba(255,140,0,',
    'rgba(245,230,180,',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.vx   = (Math.random() - .5) * .5;
      this.vy   = -(Math.random() * .8 + .2);
      this.size = Math.random() * 2 + .5;
      this.life = 0;
      this.maxL = Math.random() * 200 + 100;
      this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.type = Math.random() < .15 ? 'spark' : 'dot'; // 15% are line sparks
      this.len  = this.type === 'spark' ? Math.random() * 12 + 6 : 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      // slight drift
      this.vx += (Math.random() - .5) * .02;
    }
    draw() {
      const t   = this.life / this.maxL;
      const a   = t < .2 ? t / .2 : t > .7 ? 1 - (t - .7) / .3 : 1;
      const size = this.size * (1 - t * .5);
      ctx.globalAlpha = a * .7;
      if (this.type === 'spark') {
        ctx.strokeStyle = this.col + a * .8 + ')';
        ctx.lineWidth   = size * .6;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * this.len, this.y - this.vy * this.len);
        ctx.stroke();
      } else {
        ctx.fillStyle = this.col + a + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    isDead() { return this.life >= this.maxL; }
  }

  function init() {
    particles = [];
    for (let i = 0; i < MAX; i++) particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].isDead()) particles[i].reset();
    }
    // occasional burst on random intervals
    animId = requestAnimationFrame(loop);
  }

  // mouse-triggered burst
  let lastBurst = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastBurst < 80) return;
    lastBurst = now;
    if (Math.random() > .25) return; // 25% chance per move event
    const p = new Particle();
    p.x = e.clientX + (Math.random() - .5) * 30;
    p.y = e.clientY + (Math.random() - .5) * 30;
    p.vy = -(Math.random() * 1.5 + .5);
    p.vx = (Math.random() - .5) * 1.5;
    p.size = Math.random() * 3 + 1;
    p.maxL = 60;
    p.life = 0;
    particles.push(p);
    if (particles.length > MAX + 30) particles.splice(0, 5);
  });

  // click burst
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 12; i++) {
      const p = new Particle();
      p.x = e.clientX;
      p.y = e.clientY;
      const angle = (i / 12) * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1;
      p.size = Math.random() * 4 + 1;
      p.maxL = 50;
      p.life = 0;
      p.type = 'spark';
      p.len  = 8;
      particles.push(p);
    }
    if (particles.length > MAX + 40) particles.splice(0, 15);
  });

  window.addEventListener('resize', () => { resize(); });

  // check for reduced motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mq.matches) {
    resize();
    init();
    loop();
  }
  mq.addEventListener('change', (e) => {
    if (e.matches) { cancelAnimationFrame(animId); ctx.clearRect(0, 0, W, H); }
    else { resize(); init(); loop(); }
  });
})();
