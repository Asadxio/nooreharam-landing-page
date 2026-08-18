/**
 * Noor-E-Haram — Full Premium 3D Effects Suite v2.0
 * Custom Cursor · Stars · Parallax · Tilt · Magnetic · Ripple · Reveal
 * Typewriter · Countdown · Confetti · Shimmer · Stagger · Toast
 * WhatsApp Bubble · Glassmorphism Nav · Animated Borders · Number Scramble
 */

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

/* ── 1. CUSTOM CURSOR ──────────────────────────────────────────────────── */
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
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; visible = false; });
  const hoverQ = 'a,button,.btn,.package-card,.service-card';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverQ)) { dot.classList.add('nh-cursor-hover'); ring.classList.add('nh-cursor-hover'); }});
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverQ)) { dot.classList.remove('nh-cursor-hover'); ring.classList.remove('nh-cursor-hover'); }});
  (function animate() {
    dot.style.transform = `translate(${mx-5}px,${my-5}px)`;
    rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
    ring.style.transform = `translate(${rx-18}px,${ry-18}px)`;
    requestAnimationFrame(animate);
  })();
}

/* ── 2. PARTICLE STARS ─────────────────────────────────────────────────── */
function initParticleStars() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'nh-stars-canvas';
  hero.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; };
  resize(); window.addEventListener('resize', resize);
  const P = Array.from({length:130},()=>({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    r:Math.random()*1.8+0.3, op:Math.random()*0.7+0.1,
    sx:(Math.random()-.5)*.15, sy:(Math.random()-.5)*.08,
    ts:Math.random()*.02+.005, td:Math.random()>.5?1:-1,
    col:Math.random()>.7?'#d4ac0d':'#fff'
  }));
  (function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    P.forEach(p => {
      p.op += p.ts*p.td; if(p.op>.9||p.op<.05)p.td*=-1;
      p.x += p.sx; p.y += p.sy;
      if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.col; ctx.globalAlpha=p.op; ctx.fill(); ctx.globalAlpha=1;
    });
    requestAnimationFrame(draw);
  })();
}

/* ── 3. PARALLAX HERO ──────────────────────────────────────────────────── */
function initParallaxHero() {
  if (IS_MOBILE) return;
  const hero = document.querySelector('.hero');
  const bg = document.querySelector('.hero-bg');
  const content = document.querySelector('.hero-content');
  if (!hero||!bg) return;
  document.addEventListener('mousemove', e => {
    const xR=(e.clientX/window.innerWidth-.5)*2, yR=(e.clientY/window.innerHeight-.5)*2;
    bg.style.cssText += `transform:translate(${xR*-18}px,${yR*-12}px) scale(1.04);transition:transform .8s cubic-bezier(.25,.46,.45,.94);`;
    if (content) content.style.cssText += `transform:translate(${xR*8}px,${yR*5}px);transition:transform .6s cubic-bezier(.25,.46,.45,.94);`;
  });
  hero.addEventListener('mouseleave', () => {
    bg.style.transform='translate(0,0) scale(1)';
    if(content) content.style.transform='translate(0,0)';
  });
}

/* ── 4. 3D TILT CARDS ──────────────────────────────────────────────────── */
function applyTilt(card) {
  if (card.dataset.tiltInit) return; card.dataset.tiltInit='1';
  card.addEventListener('mousemove', e => {
    const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    const rY=((x-r.width/2)/(r.width/2))*10, rX=-((y-r.height/2)/(r.height/2))*8;
    card.style.transform=`perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-8px) scale(1.02)`;
    card.style.transition='transform 0.1s ease';
    let sh=card.querySelector('.nh-shine');
    if(!sh){sh=document.createElement('div');sh.className='nh-shine';card.appendChild(sh);}
    sh.style.background=`radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%,rgba(255,255,255,.12) 0%,transparent 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform='perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    card.style.transition='transform 0.5s cubic-bezier(.25,.46,.45,.94)';
    const sh=card.querySelector('.nh-shine'); if(sh) sh.style.background='transparent';
  });
}
function initTiltCards() {
  if (IS_MOBILE) return;
  document.querySelectorAll('.package-card,.tilt-card').forEach(applyTilt);
  const grid=document.getElementById('packagesGrid');
  if(grid) new MutationObserver(()=>document.querySelectorAll('.package-card').forEach(applyTilt)).observe(grid,{childList:true});
}

/* ── 5. MAGNETIC BUTTONS ───────────────────────────────────────────────── */
function initMagneticButtons() {
  if (IS_MOBILE) return;
  document.querySelectorAll('.btn-primary,.btn-gold,.btn-whatsapp,.header-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r=btn.getBoundingClientRect();
      btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.28}px,${(e.clientY-r.top-r.height/2)*.28}px)`;
      btn.style.transition='transform 0.2s ease';
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform='translate(0,0)'; btn.style.transition='transform 0.5s cubic-bezier(.25,.46,.45,.94)'; });
  });
}

/* ── 6. RIPPLE EFFECT ──────────────────────────────────────────────────── */
function initRippleEffect() {
  document.addEventListener('click', e => {
    const btn=e.target.closest('.btn,.header-cta'); if(!btn) return;
    const ripple=document.createElement('span'); ripple.className='nh-ripple';
    const r=btn.getBoundingClientRect(), size=Math.max(r.width,r.height)*2;
    ripple.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px;`;
    btn.appendChild(ripple); ripple.addEventListener('animationend',()=>ripple.remove());
  });
}

/* ── 7. CINEMATIC SECTION REVEAL ───────────────────────────────────────── */
function initCinematicReveal() {
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('nh-in-view');obs.unobserve(e.target);}});
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('section').forEach(s=>{s.classList.add('nh-section-reveal');obs.observe(s);});
}

/* ── 8. FLOATING ISLAMIC SHAPES ────────────────────────────────────────── */
function initFloatingShapes() {
  const hero=document.querySelector('.hero'); if(!hero) return;
  [{s:'☽',x:'85%',y:'12%',sz:'64px',o:.06,d:'8s'},{s:'✦',x:'5%',y:'28%',sz:'22px',o:.10,d:'6s'},
   {s:'✦',x:'92%',y:'60%',sz:'16px',o:.08,d:'7s'},{s:'☽',x:'8%',y:'78%',sz:'36px',o:.05,d:'9s'},
   {s:'✦',x:'76%',y:'88%',sz:'18px',o:.09,d:'5s'}].forEach(s=>{
    const el=document.createElement('div'); el.textContent=s.s;
    el.style.cssText=`position:absolute;left:${s.x};top:${s.y};font-size:${s.sz};opacity:${s.o};color:#d4ac0d;pointer-events:none;z-index:1;animation:nhFloat ${s.d} ease-in-out infinite alternate;user-select:none;`;
    hero.appendChild(el);
  });
}

/* ── 9. TYPEWRITER EFFECT ──────────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('nhTypewriter');
  if (!el) return;
  const phrases = [
    'Professional Hajj, Umrah & Ziyarat services across India.',
    'Transparent pricing. Expert guidance. 10+ Years of trust.',
    'Your sacred journey — planned with love and care.',
    'Serving pilgrims since 2016 — Alhamdulillah.'
  ];
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const cur = phrases[pi];
    el.textContent = deleting ? cur.slice(0, ci--) : cur.slice(0, ci++);
    if (!deleting && ci > cur.length) { deleting = true; setTimeout(type, 1800); return; }
    if (deleting && ci < 0)  { deleting = false; pi = (pi+1)%phrases.length; ci = 0; setTimeout(type, 400); return; }
    setTimeout(type, deleting ? 35 : 55);
  }
  type();
}

/* ── 10. COUNTDOWN TIMER ───────────────────────────────────────────────── */
function initCountdown() {
  const daysEl=document.getElementById('nhCdDays'), hrsEl=document.getElementById('nhCdHrs');
  const minEl=document.getElementById('nhCdMin'), secEl=document.getElementById('nhCdSec');
  if (!daysEl) return;
  // Next departure: set to ~45 days from now
  const target = new Date(); target.setDate(target.getDate()+45); target.setHours(9,0,0,0);
  function update() {
    const diff = target - Date.now();
    if (diff <= 0) { daysEl.textContent=hrsEl.textContent=minEl.textContent=secEl.textContent='00'; return; }
    const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000);
    const m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
    daysEl.textContent=String(d).padStart(2,'0'); hrsEl.textContent=String(h).padStart(2,'0');
    minEl.textContent=String(m).padStart(2,'0'); secEl.textContent=String(s).padStart(2,'0');
  }
  update(); setInterval(update, 1000);
}

/* ── 11. CONFETTI BURST ────────────────────────────────────────────────── */
function initConfetti() {
  const canvas = document.getElementById('nhConfettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; });

  let particles = [];
  const COLORS = ['#d4ac0d','#0b5345','#ffffff','#f0c040','#a8d5b5','#e8c870'];

  function burst(x, y) {
    for (let i = 0; i < 80; i++) {
      const angle = Math.random()*Math.PI*2;
      const speed = Math.random()*8+2;
      particles.push({
        x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed-6,
        r: Math.random()*6+3, color: COLORS[Math.floor(Math.random()*COLORS.length)],
        alpha: 1, rot: Math.random()*360, rotSpeed: (Math.random()-.5)*10,
        gravity: 0.25, shape: Math.random()>.5?'rect':'circle'
      });
    }
    animate();
  }

  let animId;
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles = particles.filter(p => p.alpha > 0.01);
    particles.forEach(p => {
      p.vy += p.gravity; p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.016; p.rot += p.rotSpeed;
      ctx.save(); ctx.globalAlpha = Math.max(0,p.alpha);
      ctx.fillStyle = p.color; ctx.translate(p.x, p.y); ctx.rotate(p.rot*Math.PI/180);
      if (p.shape==='rect') ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);
      else { ctx.beginPath(); ctx.arc(0,0,p.r/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    if (particles.length) animId = requestAnimationFrame(animate);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.nh-confetti-trigger')) {
      burst(e.clientX, e.clientY);
    }
  });
}

/* ── 12. GOLD SHIMMER HEADING ──────────────────────────────────────────── */
function initShimmerText() {
  // CSS handles shimmer via class nh-shimmer-text (defined in CSS)
  // Just ensure hero title has the class
  const h1 = document.querySelector('.hero-title');
  if (h1 && !h1.classList.contains('nh-shimmer-text')) h1.classList.add('nh-shimmer-text');
}

/* ── 13. STAGGERED CARD ENTRY ──────────────────────────────────────────── */
function initStaggeredCards() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.package-card,.service-card,.tilt-card');
        cards.forEach((card, i) => {
          setTimeout(() => { card.classList.add('nh-stagger-in'); }, i * 120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.packages-grid,.services-grid').forEach(g => {
    g.querySelectorAll('.package-card,.service-card').forEach(c => c.classList.add('nh-stagger-card'));
    obs.observe(g);
  });
}

/* ── 14. GLASSMORPHISM NAVBAR ON SCROLL ────────────────────────────────── */
function initGlassNav() {
  const header = document.querySelector('.header');
  if (!header) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('nh-glass-nav');
    } else {
      header.classList.remove('nh-glass-nav');
    }
    // Hide on scroll down, show on scroll up
    if (y > lastY + 8 && y > 200) header.classList.add('nh-nav-hide');
    else if (y < lastY - 8) header.classList.remove('nh-nav-hide');
    lastY = y;
  }, { passive: true });
}

/* ── 15. ANIMATED GRADIENT BORDER (featured card) ─────────────────────── */
function initAnimatedBorders() {
  document.querySelectorAll('.package-card.featured').forEach(card => {
    card.classList.add('nh-glow-border');
  });
  // Re-apply when cards are dynamically rendered
  const grid = document.getElementById('packagesGrid');
  if (grid) new MutationObserver(() => {
    document.querySelectorAll('.package-card.featured:not(.nh-glow-border)').forEach(c => c.classList.add('nh-glow-border'));
  }).observe(grid, { childList: true });
}

/* ── 16. NUMBER SCRAMBLE STATS ─────────────────────────────────────────── */
function initNumberScramble() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const original = el.textContent.trim();
      const numMatch = original.match(/\d[\d,]*/);
      if (!numMatch) return;
      const target = parseInt(numMatch[0].replace(/,/g,''));
      const prefix = original.slice(0, original.indexOf(numMatch[0]));
      const suffix = original.slice(original.indexOf(numMatch[0]) + numMatch[0].length);
      let frame = 0; const totalFrames = 50;
      const timer = setInterval(() => {
        frame++;
        if (frame < totalFrames - 10) {
          // Scramble phase
          el.textContent = prefix + Math.floor(Math.random()*target*1.5).toLocaleString('en-IN') + suffix;
        } else {
          // Settle phase
          const progress = (frame - (totalFrames-10)) / 10;
          el.textContent = prefix + Math.floor(target * progress).toLocaleString('en-IN') + suffix;
        }
        if (frame >= totalFrames) { clearInterval(timer); el.textContent = original; }
      }, 40);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(n => obs.observe(n));
}

/* ── 17. SOCIAL PROOF NOTIFICATION TOASTS ──────────────────────────────── */
function initNotificationToasts() {
  const toast = document.getElementById('nhToast');
  const msg = document.getElementById('nhToastMsg');
  if (!toast || !msg) return;

  const messages = [
    '🕋 Ahmed from Bengaluru just booked a Deluxe package!',
    '✅ 5 people booked Umrah packages today!',
    '📞 Fatima from Mumbai enquired about Ziyarat tour.',
    '🌙 3 families from Hubli confirmed their departure!',
    '⭐ Yusuf gave us a 5-star review on Google!',
    '🛫 Next batch has only 4 seats remaining — book now!'
  ];

  let idx = 0;
  function showToast() {
    msg.textContent = messages[idx % messages.length];
    toast.classList.add('nh-toast-show');
    setTimeout(() => toast.classList.remove('nh-toast-show'), 4500);
    idx++;
  }

  // First toast after 6 seconds, then every 12 seconds
  setTimeout(() => { showToast(); setInterval(showToast, 12000); }, 6000);
}

/* ── 18. SCROLL PROGRESS BAR ───────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div'); bar.id='nhScrollProgress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const st=document.documentElement.scrollTop, dh=document.documentElement.scrollHeight-document.documentElement.clientHeight;
    bar.style.width=(dh>0?(st/dh)*100:0)+'%';
  }, {passive:true});
}

/* ── INIT ALL ───────────────────────────────────────────────────────────── */
export function initPremiumEffects() {
  initCustomCursor();
  initParticleStars();
  initParallaxHero();
  initTiltCards();
  initMagneticButtons();
  initRippleEffect();
  initCinematicReveal();
  initFloatingShapes();
  initTypewriter();
  initCountdown();
  initConfetti();
  initShimmerText();
  initStaggeredCards();
  initGlassNav();
  initAnimatedBorders();
  initNumberScramble();
  initNotificationToasts();
  initScrollProgress();
}
