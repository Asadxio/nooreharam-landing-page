/**
 * Noor-E-Haram Premium 3D Effects
 * Custom Cursor · Magnetic Buttons · Particle Stars · Parallax · 3D Tilt Cards
 */

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

// ─── 1. CUSTOM CURSOR ────────────────────────────────────────────────────────
function initCustomCursor() {
  if (IS_MOBILE) return;
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'nh-cursor-dot';
  ring.className = 'nh-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0, visible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { dot.style.opacity = '1'; ring.style.opacity = '1'; visible = true; }
  });
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0'; visible = false;
  });

  const hoverTargets = 'a, button, .btn, .package-card, .service-card, .tilt-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) { dot.classList.add('nh-cursor-hover'); ring.classList.add('nh-cursor-hover'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) { dot.classList.remove('nh-cursor-hover'); ring.classList.remove('nh-cursor-hover'); }
  });

  function animateCursor() {
    dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ─── 2. PARTICLE STARS ───────────────────────────────────────────────────────
function initParticleStars() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'nh-stars-canvas';
  hero.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.3,
    opacity: Math.random() * 0.7 + 0.1,
    speedX: (Math.random() - 0.5) * 0.15,
    speedY: (Math.random() - 0.5) * 0.08,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleDir: Math.random() > 0.5 ? 1 : -1,
    color: Math.random() > 0.7 ? '#d4ac0d' : '#ffffff'
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.opacity += p.twinkleSpeed * p.twinkleDir;
      if (p.opacity > 0.9 || p.opacity < 0.05) p.twinkleDir *= -1;
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── 3. PARALLAX HERO ────────────────────────────────────────────────────────
function initParallaxHero() {
  if (IS_MOBILE) return;
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');
  if (!hero || !heroBg) return;

  document.addEventListener('mousemove', e => {
    const xR = (e.clientX / window.innerWidth - 0.5) * 2;
    const yR = (e.clientY / window.innerHeight - 0.5) * 2;
    heroBg.style.transform = `translate(${xR * -18}px, ${yR * -12}px) scale(1.04)`;
    heroBg.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
    if (heroContent) {
      heroContent.style.transform = `translate(${xR * 8}px, ${yR * 5}px)`;
      heroContent.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
  });
  hero.addEventListener('mouseleave', () => {
    heroBg.style.transform = 'translate(0,0) scale(1)';
    if (heroContent) heroContent.style.transform = 'translate(0,0)';
  });
}

// ─── 4. 3D TILT CARDS ────────────────────────────────────────────────────────
function applyTiltToCard(card) {
  if (card.dataset.tiltInit) return;
  card.dataset.tiltInit = 'true';
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
    card.style.transition = 'transform 0.1s ease';
    let shine = card.querySelector('.nh-shine');
    if (!shine) { shine = document.createElement('div'); shine.className = 'nh-shine'; card.appendChild(shine); }
    shine.style.background = `radial-gradient(circle at ${(x/rect.width)*100}% ${(y/rect.height)*100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    const shine = card.querySelector('.nh-shine');
    if (shine) shine.style.background = 'transparent';
  });
}

function initTiltCards() {
  if (IS_MOBILE) return;
  document.querySelectorAll('.package-card, .tilt-card').forEach(applyTiltToCard);
  const grid = document.getElementById('packagesGrid');
  if (grid) new MutationObserver(() => {
    document.querySelectorAll('.package-card').forEach(applyTiltToCard);
  }).observe(grid, { childList: true });
}

// ─── 5. MAGNETIC BUTTONS ─────────────────────────────────────────────────────
function initMagneticButtons() {
  if (IS_MOBILE) return;
  document.querySelectorAll('.btn-primary, .btn-gold, .btn-whatsapp, .header-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      btn.style.transition = 'transform 0.2s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });
}

// ─── 6. RIPPLE EFFECT ────────────────────────────────────────────────────────
function initRippleEffect() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn, .header-cta');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'nh-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// ─── 7. CINEMATIC SECTION REVEAL ─────────────────────────────────────────────
function initCinematicReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('nh-in-view'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('section').forEach(sec => { sec.classList.add('nh-section-reveal'); obs.observe(sec); });
}

// ─── 8. FLOATING ISLAMIC SHAPES ──────────────────────────────────────────────
function initFloatingShapes() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  [
    { symbol: '☽', x: '85%', y: '12%', size: '64px', opacity: 0.06, dur: '8s' },
    { symbol: '✦', x: '5%',  y: '28%', size: '22px', opacity: 0.10, dur: '6s' },
    { symbol: '✦', x: '92%', y: '60%', size: '16px', opacity: 0.08, dur: '7s' },
    { symbol: '☽', x: '8%',  y: '78%', size: '36px', opacity: 0.05, dur: '9s' },
    { symbol: '✦', x: '76%', y: '88%', size: '18px', opacity: 0.09, dur: '5s' },
  ].forEach(s => {
    const el = document.createElement('div');
    el.textContent = s.symbol;
    el.style.cssText = `position:absolute;left:${s.x};top:${s.y};font-size:${s.size};opacity:${s.opacity};color:#d4ac0d;pointer-events:none;z-index:1;animation:nhFloat ${s.dur} ease-in-out infinite alternate;user-select:none;`;
    hero.appendChild(el);
  });
}

// ─── INIT ────────────────────────────────────────────────────────────────────
export function initPremiumEffects() {
  initCustomCursor();
  initParticleStars();
  initParallaxHero();
  initTiltCards();
  initMagneticButtons();
  initRippleEffect();
  initCinematicReveal();
  initFloatingShapes();
}
