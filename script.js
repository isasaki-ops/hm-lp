/* ===========================
   PARTICLES SYSTEM
=========================== */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(201, 162, 39, 0.8)',
    'rgba(139, 0, 0, 0.6)',
    'rgba(192, 57, 43, 0.5)',
    'rgba(240, 208, 96, 0.4)',
    'rgba(123, 47, 190, 0.4)',
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H + H;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.8 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.6 + 0.2;
      this.decay = Math.random() * 0.002 + 0.001;
      this.flicker = Math.random() * Math.PI * 2;
    }

    update() {
      this.flicker += 0.05;
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.decay;

      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      const flickerOpacity = this.opacity * (0.8 + 0.2 * Math.sin(this.flicker));
      ctx.globalAlpha = flickerOpacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 十字架パーティクル
  class CrossParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * W;
      this.y = H + 20;
      this.size = Math.random() * 8 + 4;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.15 + 0.05;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.01;
      this.decay = Math.random() * 0.001 + 0.0003;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.decay;
      this.rotation += this.rotSpeed;

      if (this.y < -20 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(0, this.size);
      ctx.moveTo(-this.size * 0.6, -this.size * 0.2);
      ctx.lineTo(this.size * 0.6, -this.size * 0.2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // 初期化
  for (let i = 0; i < 120; i++) {
    const p = new Particle();
    p.y = Math.random() * H; // 初期位置をランダムに
    particles.push(p);
  }

  const crosses = [];
  for (let i = 0; i < 20; i++) {
    const c = new CrossParticle();
    c.y = Math.random() * H;
    crosses.push(c);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => { p.update(); p.draw(); });
    crosses.forEach(c => { c.update(); c.draw(); });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ===========================
   SCROLL ANIMATIONS
=========================== */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el);
    }
  });
}, observerOptions);

// 監視対象を登録
document.querySelectorAll(
  '.about-card, .about-visual, .timeline-item, .rule-card, .benefit-card, .promo-item, .gallery-item, .pelorina-main-photo, .pelorina-main-text, .machine-img-wrap, .machine-info'
).forEach(el => observer.observe(el));

/* ===========================
   HEADER SCROLL EFFECT
=========================== */
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.style.background = 'rgba(5, 3, 10, 0.97)';
    header.style.borderBottomColor = 'rgba(201, 162, 39, 0.4)';
    header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
  } else {
    header.style.background = '';
    header.style.borderBottomColor = '';
    header.style.boxShadow = '';
  }
});

/* ===========================
   SMOOTH ANCHOR SCROLL
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   HERO PARALLAX
=========================== */
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 1.2;
  }
});

/* ===========================
   GLITCH EFFECT ON TITLE
=========================== */
const titleLine2 = document.querySelector('.title-line2');
if (titleLine2) {
  setInterval(() => {
    titleLine2.style.filter = 'drop-shadow(0 0 30px rgba(201, 162, 39, 0.6)) hue-rotate(20deg)';
    setTimeout(() => {
      titleLine2.style.filter = 'drop-shadow(0 0 30px rgba(201, 162, 39, 0.6))';
    }, 80);
  }, 4000 + Math.random() * 3000);
}

/* ===========================
   TIMELINE GLOW ON HOVER
=========================== */
document.querySelectorAll('.timeline-content').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const dot = el.closest('.timeline-item').querySelector('.timeline-dot');
    if (dot) {
      dot.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.8)';
      dot.style.borderColor = '#f0d060';
    }
  });
  el.addEventListener('mouseleave', () => {
    const item = el.closest('.timeline-item');
    const dot = item.querySelector('.timeline-dot');
    if (dot && !item.classList.contains('final')) {
      dot.style.boxShadow = '';
      dot.style.borderColor = '';
    }
  });
});

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el, target, prefix, suffix, duration) {
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);
    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toLocaleString() + suffix;
  }

  requestAnimationFrame(update);
}

// コスト表示にカウンターアニメーション
const costPrice = document.querySelector('.cost-price');
if (costPrice) {
  const costObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(costPrice, 10000, '¥', '', 1500);
        costObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  costObserver.observe(costPrice);
}

/* ===========================
   CRIMSON FLARE ON ENTRY BOX
=========================== */
const entryBox = document.querySelector('.entry-box');
if (entryBox) {
  const entryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entryBox.style.transition = 'box-shadow 1s ease';
        entryBox.style.boxShadow = '0 0 80px rgba(139, 0, 0, 0.4)';
      }
    });
  }, { threshold: 0.4 });

  entryObserver.observe(entryBox);
}
