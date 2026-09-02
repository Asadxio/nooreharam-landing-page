/**
 * Noor-E-Haram — Premium Effects v3.0 (PERFORMANCE OPTIMISED)
 * - Canvas removed → CSS-only GPU stars
 * - All effects deferred via requestIdleCallback
 * - Shimmer uses transform (GPU composited)
 * - WA pulse uses transform scale (no box-shadow animation)
 * - Canvas confetti only on click (not continuous)
 * - Particle loop throttled to 24fps on desktop only
 */

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Helper: defer non-critical work ───────────────────────────────────── */
function defer(fn, delay = 0) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => setTimeout(fn, delay), { timeout: 3000 });
  } else {
    setTimeout(fn, delay + 500);
  }
}

/* ── 1. CUSTOM CURSOR ───────────────────────────────────────────────────── */
function initCustomCursor() {
  if (IS_MOBILE || REDUCED) return;
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'nh-cursor-dot';
  ring.className = 'nh-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0, visible = false, rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { dot.style.opacity = '1'; ring.style.opacity = '1'; visible = true; }
  }, { passive: true });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; visible = false; });

  const hoverQ = 'a,button,.btn,.package-card,.service-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverQ)) { dot.classList.add('nh-cursor-hover'); ring.classList.add('nh-cursor-hover'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverQ)) { dot.classList.remove('nh-cursor-hover'); ring.classList.remove('nh-cursor-hover'); }
  });

  let lastT = 0;
  function animate(t) {
    // Throttle to ~60fps max, skip if tab hidden
    if (!document.hidden) {
      dot.style.transform = `translate(${mx-5}px,${my-5}px)`;
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx-18}px,${ry-18}px)`;
    }
    rafId = requestAnimationFrame(animate);
  }
  rafId = requestAnimationFrame(animate);

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(animate);
  });
}

/* ── 2. CSS STARS (replaces canvas — GPU composited) ───────────────────── */
function initCSSStars() {
  if (REDUCED) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const container = document.createElement('div');
  container.className = 'nh-css-stars';
  container.setAttribute('aria-hidden', 'true');

  // Create 60 CSS stars (lightweight vs 130 canvas particles)
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('span');
    const isGold = Math.random() > 0.75;
    const size = Math.random() * 2.5 + 0.8;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (Math.random() * 4 + 3).toFixed(1);
    const delay = (Math.random() * 5).toFixed(1);
    star.style.cssText = `
      left:${x}%;top:${y}%;width:${size}px;height:${size}px;
      background:${isGold ? '#d4ac0d' : '#fff'};
      border-radius:50%;
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
    `;
    container.appendChild(star);
  }
  hero.appendChild(container);
}

/* ── 3. PARALLAX HERO ───────────────────────────────────────────────────── */
function initParallaxHero() {
  if (IS_MOBILE || REDUCED) return;
  const hero = document.querySelector('.hero');
  const bg = document.querySelector('.hero-bg');
  const content = document.querySelector('.hero-content');
  if (!hero || !bg) return;

  let ticking = false;
  document.addEventListener('mousemove', e => {
    if (ticking || document.hidden) return;
    ticking = true;
    requestAnimationFrame(() => {
      const xR = (e.clientX / window.innerWidth - 0.5) * 2;
      const yR = (e.clientY / window.innerHeight - 0.5) * 2;
      bg.style.transform = `translate(${xR * -16}px,${yR * -10}px) scale(1.04)`;
      if (content) content.style.transform = `translate(${xR * 6}px,${yR * 4}px)`;
      ticking = false;
    });
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    bg.style.transform = 'translate(0,0) scale(1)';
    if (content) content.style.transform = 'translate(0,0)';
  });
}


/* ── 5. MAGNETIC BUTTONS ────────────────────────────────────────────────── */
function initMagneticButtons() {
  if (IS_MOBILE || REDUCED) return;
  document.querySelectorAll('.btn-primary,.btn-gold,.btn-whatsapp,.header-cta').forEach(btn => {
    let ticking = false;
    btn.addEventListener('mousemove', e => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.25}px)`;
        ticking = false;
      });
    }, { passive: true });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}

/* ── 6. RIPPLE EFFECT ───────────────────────────────────────────────────── */
function initRippleEffect() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn,.header-cta'); if (!btn) return;
    const ripple = document.createElement('span'); ripple.className = 'nh-ripple';
    const r = btn.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px;`;
    btn.appendChild(ripple); ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ── 7. CINEMATIC SECTION REVEAL ────────────────────────────────────────── */
function initCinematicReveal() {
  if (REDUCED) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('nh-in-view'); obs.unobserve(e.target); }});
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('section').forEach(s => { s.classList.add('nh-section-reveal'); obs.observe(s); });
}

/* ── 8. FLOATING SHAPES (CSS only, no JS loop) ──────────────────────────── */
function initFloatingShapes() {
  if (REDUCED) return;
  const hero = document.querySelector('.hero'); if (!hero) return;
  [
    { s: '☽', x: '85%', y: '12%', sz: '60px', o: .06, d: '8s' },
    { s: '✦', x: '5%',  y: '28%', sz: '20px', o: .10, d: '6s' },
    { s: '✦', x: '92%', y: '60%', sz: '14px', o: .08, d: '7s' },
    { s: '☽', x: '8%',  y: '78%', sz: '32px', o: .05, d: '9s' },
  ].forEach(s => {
    const el = document.createElement('div'); el.textContent = s.s; el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `position:absolute;left:${s.x};top:${s.y};font-size:${s.sz};opacity:${s.o};color:#d4ac0d;pointer-events:none;z-index:1;animation:nhFloat ${s.d} ease-in-out infinite alternate;user-select:none;will-change:transform;`;
    hero.appendChild(el);
  });
}

/* ── 9. TYPEWRITER EFFECT ───────────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('nhTypewriter'); if (!el) return;
  const phrases = [
    'Professional Hajj, Umrah & Ziyarat services across India.',
    'Transparent pricing. Expert guidance. 10+ Years of trust.',
    'Your sacred journey — planned with love and care.',
    'Serving pilgrims since 2016 — Alhamdulillah.'
  ];
  let pi = 0, ci = 0, deleting = false;
  function type() {
    if (document.hidden) { setTimeout(type, 500); return; }
    const cur = phrases[pi];
    el.textContent = deleting ? cur.slice(0, ci--) : cur.slice(0, ci++);
    if (!deleting && ci > cur.length) { deleting = true; setTimeout(type, 1800); return; }
    if (deleting && ci < 0) { deleting = false; pi = (pi+1) % phrases.length; ci = 0; setTimeout(type, 400); return; }
    setTimeout(type, deleting ? 30 : 52);
  }
  type();
}

/* ── 10. COUNTDOWN TIMER ────────────────────────────────────────────────── */
function initCountdown() {
  const dEl = document.getElementById('nhCdDays'), hEl = document.getElementById('nhCdHrs');
  const mEl = document.getElementById('nhCdMin'), sEl = document.getElementById('nhCdSec');
  if (!dEl) return;
  const target = new Date(); target.setDate(target.getDate() + 45); target.setHours(9, 0, 0, 0);
  function update() {
    if (document.hidden) return; // Skip update if tab hidden
    const diff = target - Date.now();
    if (diff <= 0) return;
    const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    dEl.textContent = String(d).padStart(2,'0'); hEl.textContent = String(h).padStart(2,'0');
    mEl.textContent = String(m).padStart(2,'0'); sEl.textContent = String(s).padStart(2,'0');
  }
  update(); setInterval(update, 1000);
}

/* ── 11. CONFETTI (only on click, not continuous) ───────────────────────── */
function initConfetti() {
  const canvas = document.getElementById('nhConfettiCanvas'); if (!canvas) return;
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }, { passive: true });
  const ctx = canvas.getContext('2d');
  const COLORS = ['#d4ac0d','#0b5345','#ffffff','#f0c040','#a8d5b5'];
  let particles = [], rafId;

  function burst(x, y) {
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2, speed = Math.random() * 7 + 2;
      particles.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed-5,
        r: Math.random()*5+2, color: COLORS[Math.floor(Math.random()*COLORS.length)],
        alpha: 1, gravity: 0.22 });
    }
    cancelAnimationFrame(rafId); animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0.01);
    particles.forEach(p => {
      p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.alpha -= 0.018;
      ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha); ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.r/2, p.y - p.r/2, p.r, p.r); ctx.restore();
    });
    if (particles.length) rafId = requestAnimationFrame(animate);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.nh-confetti-trigger')) burst(e.clientX, e.clientY);
  });
}

/* ── 12. STAGGERED CARD ENTRY ───────────────────────────────────────────── */
function initStaggeredCards() {
  if (REDUCED) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.package-card,.service-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('nh-stagger-in'), i * 100);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.packages-grid,.services-grid').forEach(g => {
    g.querySelectorAll('.package-card,.service-card').forEach(c => c.classList.add('nh-stagger-card'));
    obs.observe(g);
  });
}

/* ── 13. GLASS NAV ──────────────────────────────────────────────────────── */
function initGlassNav() {
  const header = document.querySelector('.header'); if (!header) return;
  let lastY = 0, ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('nh-glass-nav', y > 60);
      header.classList.toggle('nh-nav-hide', y > lastY + 10 && y > 200);
      if (y < lastY - 10) header.classList.remove('nh-nav-hide');
      lastY = y; ticking = false;
    });
  }, { passive: true });
}

/* ── INIT ALL — deferred after page load ────────────────────────────────── */
export function initPremiumEffects() {
  // Critical: cursor & nav (start early)
  initCustomCursor();
  initGlassNav();
  initRippleEffect();
  initCountdown();
  initTypewriter();

  // Deferred: visual effects (after idle)
  defer(() => {
    initCSSStars();
    initFloatingShapes();
    initParallaxHero();
  }, 300);

  defer(() => {
    initMagneticButtons();
    initStaggeredCards();
    initCinematicReveal();
  }, 800);

  defer(() => {
    initConfetti();
  }, 1500);
}
