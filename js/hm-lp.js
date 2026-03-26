/*!
 * hm-lp.js — 悪魔が来たりて、ヘヴィメダル LP スクリプト（完全版）
 * 読み込み方法: functions.php で wp_enqueue_script() を使用
 * 依存: なし（Vanilla JS）
 *
 * このファイルは以下を統合しています:
 *   - script.js  : パーティクルシステム / スクロールアニメ / ヘッダー / パララックス
 *   - preview.html <script> : タイトルイントロ / アコーディオン / ハンバーガーメニュー
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ===========================
     PARTICLES SYSTEM
  =========================== */
  (function () {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
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
      constructor() { this.reset(); }
      reset() {
        this.x       = Math.random() * W;
        this.y       = Math.random() * H + H;
        this.size    = Math.random() * 2.5 + 0.5;
        this.speedY  = -(Math.random() * 0.8 + 0.3);
        this.speedX  = (Math.random() - 0.5) * 0.4;
        this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
        this.decay   = Math.random() * 0.002 + 0.001;
        this.flicker = Math.random() * Math.PI * 2;
      }
      update() {
        this.flicker += 0.05;
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= this.decay;
        if (this.y < -10 || this.opacity <= 0) this.reset();
      }
      draw() {
        const fo = this.opacity * (0.8 + 0.2 * Math.sin(this.flicker));
        ctx.globalAlpha = fo;
        ctx.fillStyle   = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class CrossParticle {
      constructor() { this.reset(); }
      reset() {
        this.x        = Math.random() * W;
        this.y        = H + 20;
        this.size     = Math.random() * 8 + 4;
        this.speedY   = -(Math.random() * 0.4 + 0.1);
        this.speedX   = (Math.random() - 0.5) * 0.2;
        this.opacity  = Math.random() * 0.15 + 0.05;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.01;
        this.decay    = Math.random() * 0.001 + 0.0003;
      }
      update() {
        this.y        += this.speedY;
        this.x        += this.speedX;
        this.opacity  -= this.decay;
        this.rotation += this.rotSpeed;
        if (this.y < -20 || this.opacity <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha  = this.opacity;
        ctx.strokeStyle  = 'rgba(201, 162, 39, 0.8)';
        ctx.lineWidth    = 1.5;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(0,  this.size);
        ctx.moveTo(-this.size * 0.6, -this.size * 0.2);
        ctx.lineTo( this.size * 0.6, -this.size * 0.2);
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) {
      const p = new Particle();
      p.y = Math.random() * H;
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
    threshold:  0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => { el.classList.add('visible'); }, delay);
        scrollObserver.unobserve(el);
      }
    });
  }, observerOptions);

  document.querySelectorAll(
    '.about-card, .about-visual, .timeline-item, .rule-card, .benefit-card, ' +
    '.promo-item, .gallery-item, .pelorina-main-photo, .pelorina-main-text, ' +
    '.machine-img-wrap, .machine-info'
  ).forEach(el => scrollObserver.observe(el));

  /* ===========================
     HEADER SCROLL EFFECT
  =========================== */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.style.background       = 'rgba(5, 3, 10, 0.97)';
        header.style.borderBottomColor = 'rgba(201, 162, 39, 0.4)';
        header.style.boxShadow        = '0 4px 30px rgba(0, 0, 0, 0.5)';
      } else {
        header.style.background       = '';
        header.style.borderBottomColor = '';
        header.style.boxShadow        = '';
      }
    });
  }

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
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===========================
     HERO PARALLAX
  =========================== */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity   = String(1 - (scrollY / window.innerHeight) * 1.2);
      }
    });
  }

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
     COUNTER ANIMATION
  =========================== */
  function animateCounter(el, target, prefix, suffix, duration) {
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(ease * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  }
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
     ACCORDION (WAVE結果)
  =========================== */
  function hmToggle(btn) {
    const item   = btn.closest('.hm-accordion-item');
    const body   = item.querySelector('.hm-accordion-body');
    const icon   = btn.querySelector('.hm-accordion-icon');
    const isOpen = item.classList.contains('open');
    // 他をすべて閉じる
    document.querySelectorAll('.hm-accordion-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.hm-accordion-body').style.maxHeight = '0';
      el.querySelector('.hm-accordion-icon').textContent = '▼';
    });
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      icon.textContent = '▲';
    }
  }
  window.hmToggle = hmToggle; // onclick属性から参照できるよう公開

  // REST APIでWAVE記事を取得して自動描画
  (function initWaveAccordion() {
    const accordion = document.getElementById('wave-accordion');
    if (!accordion) return;

    const BASE  = 'https://hisshobon-hall.info/wp-json/wp/v2';
    const WAVES = [1, 2, 3, 4, 5];

    // STEP 1: タグIDをまとめて並列取得
    Promise.all(
      WAVES.map(function(n) {
        return fetch(BASE + '/tags?slug=hm-wave' + n)
          .then(function(r) { return r.ok ? r.json() : []; })
          .then(function(data) { return { wave: n, tagId: data.length ? data[0].id : null }; })
          .catch(function() { return { wave: n, tagId: null }; });
      })
    )
    // STEP 2: タグIDで各WAVEの記事を並列取得
    .then(function(tagResults) {
      return Promise.all(
        tagResults.map(function(t) {
          if (!t.tagId) return Promise.resolve({ wave: t.wave, posts: [] });
          return fetch(BASE + '/report?tags=' + t.tagId + '&_fields=id,title,link&per_page=10')
            .then(function(r) { return r.ok ? r.json() : []; })
            .then(function(data) { return { wave: t.wave, posts: Array.isArray(data) ? data : [] }; })
            .catch(function() { return { wave: t.wave, posts: [] }; });
        })
      );
    })
    // STEP 3: 描画 + 記事があるWAVEの中で最大番号を自動オープン
    .then(function(waveResults) {
      var latestWave = null;

      waveResults.forEach(function(wr) {
        var item = accordion.querySelector('.hm-accordion-item[data-wave="' + wr.wave + '"]');
        if (!item) return;
        var body = item.querySelector('.hm-accordion-body');
        if (!body) return;

        if (wr.posts.length === 0) {
          body.innerHTML = '<p class="wave-post-empty">— WAVE ' + wr.wave + ' 開催後に自動表示 —</p>';
        } else {
          var ul = document.createElement('ul');
          ul.className = 'wave-post-list';
          wr.posts.forEach(function(post) {
            var li = document.createElement('li');
            var a  = document.createElement('a');
            a.href        = post.link;
            a.textContent = post.title.rendered;
            a.target      = '_blank';
            a.rel         = 'noopener noreferrer';
            li.appendChild(a);
            ul.appendChild(li);
          });
          body.innerHTML = '';
          body.appendChild(ul);
          latestWave = wr.wave;
        }
      });

      // 記事があるWAVEの中で最も番号が大きいものを自動オープン
      if (latestWave !== null) {
        var target = accordion.querySelector('.hm-accordion-item[data-wave="' + latestWave + '"]');
        if (target) {
          target.classList.add('open');
          var icon = target.querySelector('.hm-accordion-icon');
          if (icon) icon.textContent = '▲';
        }
      }
    })
    .catch(function(err) { console.error('[WAVE API]', err); });
  })();

  /* ===========================
     HAMBURGER MENU
  =========================== */
  function toggleMobileNav() {
    const btn     = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (!btn || !overlay) return;
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('open');
      btn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeMobileNav() {
    const btn     = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (!overlay || !btn) return;
    overlay.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.toggleMobileNav = toggleMobileNav;
  window.closeMobileNav  = closeMobileNav;

  /* ===========================
     HERO TITLE INTRO
  =========================== */
  (function initTitleIntro() {
    const CHAR_DELAY = 240;
    const TRANS_MS   = 900;
    let totalDelay   = 0;

    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    heroTitle.style.animation = 'none';
    heroTitle.style.opacity   = '1';

    const heroRevealEls = document.querySelectorAll(
      '.hero-eyecatch, .hero-cross-line, .hero-subtitle, .hero-period, .hero-chara'
    );
    const indicator = document.querySelector('.hero-scroll-indicator');

    // ── 安全フォールバック：JS エラー等でアニメが止まった場合に強制表示 ──
    function forceReveal() {
      clearTimeout(safetyTimer);
      heroRevealEls.forEach(function(el) {
        el.classList.remove('hero-intro-wait');
        el.classList.add('hero-intro-reveal');
        el.style.opacity = '1';
      });
      document.querySelectorAll('.hero-title-char').forEach(function(el) {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      // .hero-title 自体の子 span が未生成の場合は元テキストをそのまま表示
      ['.title-line1', '.title-line2'].forEach(function(sel) {
        var line = document.querySelector(sel);
        if (line && !line.querySelector('.hero-title-char')) {
          line.style.opacity = '1';
        }
      });
      if (indicator) indicator.style.visibility = '';
    }
    // 10秒以内にアニメが完了しなければ強制表示
    var safetyTimer = setTimeout(forceReveal, 10000);

    heroRevealEls.forEach(function(el) { el.classList.add('hero-intro-wait'); });
    if (indicator) indicator.style.visibility = 'hidden';

    ['.title-line1', '.title-line2'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      var text = el.textContent;
      el.textContent = '';
      Array.from(text).forEach(function(ch) {
        var span = document.createElement('span');
        span.textContent = ch;
        span.className   = 'hero-title-char';
        span.dataset.d   = totalDelay;
        el.appendChild(span);
        totalDelay += CHAR_DELAY;
      });
    });

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        document.querySelectorAll('.hero-title-char').forEach(function(span) {
          setTimeout(function() { span.classList.add('visible'); }, parseInt(span.dataset.d, 10));
        });
        // 正常完了時：他要素フェードイン ＋ スクロール解除
        setTimeout(function() {
          heroRevealEls.forEach(function(el) {
            el.classList.remove('hero-intro-wait');
            el.classList.add('hero-intro-reveal');
          });
          if (indicator) indicator.style.visibility = '';
          clearTimeout(safetyTimer); // 正常完了したのでフォールバック解除
        }, totalDelay + TRANS_MS + 80);
      });
    });
  })();

  /* ===========================
     CATCHCOPY FADE-IN
  =========================== */
  (function initCatchAnimation() {
    var storyTexts = document.querySelectorAll('.story-text');
    if (!storyTexts.length) return;
    storyTexts.forEach(function(storyText) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.catch-line').forEach(function(line, i) {
            setTimeout(function() { line.classList.add('visible'); }, i * 260);
          });
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.25 });
      obs.observe(storyText);
    });
  })();

}); // end DOMContentLoaded
