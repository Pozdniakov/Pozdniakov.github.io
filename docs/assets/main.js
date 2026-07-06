/* Ivan Pozdniakov — site scripts
   Neural canvas · scroll reveal · nav state · lightbox · strip drag */

(function () {
  'use strict';

  const noAnim = /[?&]noanim/.test(location.search); // testing hook: render everything revealed
  const reducedMotion =
    noAnim || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ Neural network canvas ============ */

  const canvas = document.getElementById('neural');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const TEAL = [94, 234, 212];
    const VIOLET = [167, 139, 250];
    const mobile = window.matchMedia('(max-width: 700px)').matches;
    const COUNT = mobile ? 26 : 64;
    const LINK_D = mobile ? 120 : 170;
    const MOUSE_D = 220;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0;
    let nodes = [];
    let pulses = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = null;
    let lastW = 0;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      if (Math.abs(rect.width - lastW) < 2 && nodes.length) {
        // ignore mobile address-bar height flicker
        H = rect.height;
        canvas.height = H * dpr;
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return;
      }
      lastW = rect.width;
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!nodes.length) init();
    }

    function init() {
      nodes = Array.from({ length: COUNT }, () => {
        const z = 0.35 + Math.random() * 0.65; // depth: far → near
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22 * z,
          vy: (Math.random() - 0.5) * 0.22 * z,
          r: (Math.random() * 1.4 + 1.1) * z,
          z: z,
          c: Math.random() < 0.82 ? TEAL : VIOLET,
        };
      });
    }

    function spawnPulse() {
      // fire a signal along a random short edge
      for (let attempt = 0; attempt < 12; attempt++) {
        const a = nodes[(Math.random() * COUNT) | 0];
        const b = nodes[(Math.random() * COUNT) | 0];
        if (a === b) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_D && d > 30) {
          pulses.push({ a, b, t: 0, speed: 0.008 + Math.random() * 0.01 });
          return;
        }
      }
    }

    let pulseTimer = 0;

    function frame() {
      ctx.clearRect(0, 0, W, H);

      // links
      for (let i = 0; i < COUNT; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < COUNT; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_D * LINK_D) {
            const d = Math.sqrt(d2);
            const depth = (a.z + b.z) / 2;
            const alpha = (1 - d / LINK_D) * 0.22 * depth;
            ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${alpha})`;
            ctx.lineWidth = 0.8 * depth;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // cursor link
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE_D * MOUSE_D) {
          const md = Math.sqrt(md2);
          const alpha = (1 - md / MOUSE_D) * 0.3;
          ctx.strokeStyle = `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // pulses — signals travelling along edges
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pl = pulses[p];
        pl.t += pl.speed;
        if (pl.t >= 1 || Math.hypot(pl.a.x - pl.b.x, pl.a.y - pl.b.y) > LINK_D * 1.4) {
          pulses.splice(p, 1);
          continue;
        }
        const x = pl.a.x + (pl.b.x - pl.a.x) * pl.t;
        const y = pl.a.y + (pl.b.y - pl.a.y) * pl.t;
        const fade = Math.sin(pl.t * Math.PI);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${0.85 * fade})`);
        g.addColorStop(1, 'rgba(94,234,212,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${0.55 * n.z + 0.15})`;
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      }

      // fire a new pulse every ~40–90 frames
      if (--pulseTimer <= 0) {
        spawnPulse();
        pulseTimer = 40 + Math.random() * 50;
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (!raf && !reducedMotion) raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });

    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });

    resize();
    if (reducedMotion) {
      frame(); // draw a single static frame
      cancelAnimationFrame(raf);
      raf = null;
    } else {
      start();
    }
  }

  /* ============ Scroll reveal ============ */

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ============ Nav: glass on scroll + active section ============ */

  const nav = document.getElementById('nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    let current = null;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
    }
    navLinks.forEach((a) =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + current)
    );
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ Photo strip: drag to scroll ============ */

  const strip = document.getElementById('strip');
  if (strip) {
    let isDown = false, startX = 0, startScroll = 0, moved = false;

    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return; // native touch scrolling is fine
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
      strip.classList.add('dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', () => {
      isDown = false;
      strip.classList.remove('dragging');
    });

    /* ============ Lightbox ============ */

    const imgs = Array.from(strip.querySelectorAll('img'));
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCount = document.getElementById('lbCount');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let idx = 0;
    let lastFocus = null;

    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[idx].src;
      lbImg.alt = imgs[idx].alt;
      lbCount.textContent =
        String(idx + 1).padStart(2, '0') + ' / ' + String(imgs.length).padStart(2, '0');
      // preload neighbours
      new Image().src = imgs[(idx + 1) % imgs.length].src;
      new Image().src = imgs[(idx - 1 + imgs.length) % imgs.length].src;
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function close() {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    imgs.forEach((img, i) => {
      img.addEventListener('click', () => {
        if (!moved) open(i);
      });
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => show(idx - 1));
    lbNext.addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
