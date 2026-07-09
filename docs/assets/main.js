/* Ivan Pozdniakov — site scripts.
   An interactive node graph drifts behind the page (linking to the
   cursor, with signals pulsing along edges), and a hand-drawn neuron
   divider fires a saltatory impulse on click. No theme switching —
   the palette is fixed in style.css. */

(function () {
  'use strict';

  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= graph background ================= */

  var canvas = document.getElementById('graph');
  var ctx = canvas ? canvas.getContext('2d') : null;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mobile = matchMedia('(max-width: 700px)').matches;
  var COUNT = mobile ? 24 : 55;
  var LINK_D = mobile ? 120 : 170;
  var MOUSE_D = 220;

  var W = 0, H = 0, nodes = [], pulses = [], raf = null, pulseTimer = 60;
  var mouse = { x: -9999, y: -9999 };
  var inkRGB = [128, 128, 128], accentRGB = [128, 128, 128];

  function parseColor(value) {
    /* normalise any CSS colour to [r, g, b] via canvas */
    if (!ctx) return [128, 128, 128];
    ctx.fillStyle = '#808080';
    ctx.fillStyle = value.trim();
    var v = ctx.fillStyle;
    if (v.charAt(0) === '#') {
      return [
        parseInt(v.slice(1, 3), 16),
        parseInt(v.slice(3, 5), 16),
        parseInt(v.slice(5, 7), 16)
      ];
    }
    var m = v.match(/[\d.]+/g);
    return m ? [+m[0], +m[1], +m[2]] : [128, 128, 128];
  }

  function recolorGraph() {
    if (!ctx) return;
    var cs = getComputedStyle(document.documentElement);
    inkRGB = parseColor(cs.getPropertyValue('--ink'));
    accentRGB = parseColor(cs.getPropertyValue('--accent'));
  }

  var lastResizeW = 0;

  function resize() {
    if (!canvas) return;
    var w = window.innerWidth;
    /* In-app webviews (Telegram etc.) fire resize constantly while
       their chrome collapses — height-only changes are ignored, and
       the canvas is drawn tall enough to cover the grown viewport. */
    if (nodes.length && Math.abs(w - lastResizeW) < 2) return;
    lastResizeW = w;
    W = w;
    H = Math.max(
      window.innerHeight,
      window.screen ? screen.height : 0
    );
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!nodes.length) init();
  }

  function init() {
    nodes = [];
    for (var i = 0; i < COUNT; i++) {
      var z = 0.35 + Math.random() * 0.65; /* depth: far → near */
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.24 * z,
        vy: (Math.random() - 0.5) * 0.24 * z,
        r: (Math.random() * 1.5 + 1.1) * z,
        z: z
      });
    }
  }

  function spawnPulse() {
    for (var attempt = 0; attempt < 12; attempt++) {
      var a = nodes[(Math.random() * COUNT) | 0];
      var b = nodes[(Math.random() * COUNT) | 0];
      if (a === b) continue;
      var d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < LINK_D && d > 30) {
        pulses.push({ a: a, b: b, t: 0, speed: 0.008 + Math.random() * 0.01 });
        return;
      }
    }
  }

  function drawFrame(staticFrame) {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, d2, d, depth, alpha;

    for (i = 0; i < COUNT; i++) {
      a = nodes[i];
      for (j = i + 1; j < COUNT; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        d2 = dx * dx + dy * dy;
        if (d2 < LINK_D * LINK_D) {
          d = Math.sqrt(d2);
          depth = (a.z + b.z) / 2;
          alpha = (1 - d / LINK_D) * 0.13 * depth;
          ctx.strokeStyle = 'rgba(' + inkRGB[0] + ',' + inkRGB[1] + ',' + inkRGB[2] + ',' + alpha + ')';
          ctx.lineWidth = 0.8 * depth;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      /* cursor link */
      dx = a.x - mouse.x; dy = a.y - mouse.y;
      d2 = dx * dx + dy * dy;
      if (d2 < MOUSE_D * MOUSE_D) {
        d = Math.sqrt(d2);
        alpha = (1 - d / MOUSE_D) * 0.28;
        ctx.strokeStyle = 'rgba(' + accentRGB[0] + ',' + accentRGB[1] + ',' + accentRGB[2] + ',' + alpha + ')';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    /* pulses — signals travelling along edges */
    for (i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1 || Math.hypot(p.a.x - p.b.x, p.a.y - p.b.y) > LINK_D * 1.4) {
        pulses.splice(i, 1);
        continue;
      }
      var px = p.a.x + (p.b.x - p.a.x) * p.t;
      var py = p.a.y + (p.b.y - p.a.y) * p.t;
      var fade = Math.sin(p.t * Math.PI);
      var g = ctx.createRadialGradient(px, py, 0, px, py, 6);
      g.addColorStop(0, 'rgba(' + accentRGB[0] + ',' + accentRGB[1] + ',' + accentRGB[2] + ',' + 0.7 * fade + ')');
      g.addColorStop(1, 'rgba(' + accentRGB[0] + ',' + accentRGB[1] + ',' + accentRGB[2] + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    /* nodes */
    for (i = 0; i < COUNT; i++) {
      a = nodes[i];
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + inkRGB[0] + ',' + inkRGB[1] + ',' + inkRGB[2] + ',' + (0.35 * a.z + 0.08) + ')';
      ctx.fill();

      if (!staticFrame) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
        if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
      }
    }

    if (!staticFrame && --pulseTimer <= 0) {
      spawnPulse();
      pulseTimer = 40 + Math.random() * 60;
    }
  }

  function loop() {
    drawFrame(false);
    raf = requestAnimationFrame(loop);
  }

  function startGraph() {
    if (!ctx || raf || reducedMotion) return;
    raf = requestAnimationFrame(loop);
  }
  function stopGraph() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  if (ctx) {
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        if (reducedMotion) drawFrame(true);
      }, 120);
    });
    window.addEventListener('pointermove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('pointerleave', function () {
      mouse.x = -9999; mouse.y = -9999;
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopGraph(); else startGraph();
    });

    resize();
    recolorGraph();
    if (reducedMotion) drawFrame(true); else startGraph();
  }

  /* ================= neuron divider ================= */

  var neuron = document.getElementById('neuron');
  var neuronSvg = neuron ? neuron.querySelector('svg') : null;
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var CONFETTI = ['#f472b6', '#67e8f9', '#fde047', '#a78bfa', '#4ade80', '#fb7185', '#fdba74'];

  /* bare axon ends the impulse glides smoothly (initial + terminal segments) */
  var AXON_START = [168, 42];   /* soma → first node */
  var BRANCH = [498, 42];       /* last node → branch point */
  /* nodes of Ranvier in the myelinated middle — the impulse jumps between these */
  var AXON_NODES = [
    [213, 41], [258, 42.5], [309, 44], [360, 43.5], [411, 40], [457, 40]
  ];

  /* three unmyelinated collaterals (cubic control points) + their boutons */
  var COLLATERALS = [
    { p: [[498, 42], [514, 35], [524, 29], [536, 22]], bouton: [538, 21], dir: [0.7, -1] },
    { p: [[498, 42], [516, 44], [528, 50], [540, 57]], bouton: [542, 58], dir: [0.7, 1] },
    { p: [[498, 42], [520, 43], [532, 42], [547, 41]], bouton: [549, 40], dir: [1, -0.1] }
  ];

  var HOP_MS = 95;      /* dwell at each node before the next jump */
  var HOP_JITTER = 70;  /* small, slightly irregular lag between jumps */

  function cubicAt(p, t) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [
      a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
      a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]
    ];
  }

  function makeDot(vx, vy) {
    var c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('class', 'impulse');
    c.setAttribute('r', '3.4');
    c.setAttribute('cx', vx);
    c.setAttribute('cy', vy);
    neuronSvg.appendChild(c);
    return c;
  }

  /* confetti out of one bouton, fanned along the collateral's direction */
  function confettiBurst(vx, vy, dir) {
    if (reducedMotion || !neuronSvg) return;
    var r = neuronSvg.getBoundingClientRect();
    var ox = r.left + r.width * (vx / 600);
    var oy = r.top + r.height * (vy / 84);
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    var palette = CONFETTI.concat(accent || '#f472b6');
    var baseAng = Math.atan2(dir ? dir[1] : -1, dir ? dir[0] : 0);

    var parts = [];
    for (var i = 0; i < 12; i++) {
      var el = document.createElement('span');
      el.className = 'confetti';
      el.style.background = palette[i % palette.length];
      if (i % 3 === 0) el.style.borderRadius = '50%';
      document.body.appendChild(el);
      var ang = baseAng + (Math.random() - 0.5) * 1.5;
      var sp = 3 + Math.random() * 4;
      parts.push({
        el: el, x: ox, y: oy,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.8,
        rot: Math.random() * 360, vr: (Math.random() - 0.5) * 26,
        life: 0
      });
    }

    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = (ts - start) / 1000, alive = false;
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j];
        if (p.life > 1) continue;
        alive = true;
        p.vy += 0.16;                 /* gravity */
        p.vx *= 0.99;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        p.life = t / 1.1;
        p.el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + p.rot + 'deg)';
        p.el.style.opacity = String(Math.max(0, 1 - p.life));
      }
      if (alive) requestAnimationFrame(step);
      else for (var k = 0; k < parts.length; k++) parts[k].el.remove();
    }
    requestAnimationFrame(step);
  }

  /* the impulse glides down each collateral, then bursts at the bouton */
  function branchOut(withConfetti) {
    COLLATERALS.forEach(function (col) {
      var dot = makeDot(col.p[0][0], col.p[0][1]);
      var start = null, DUR = 320;
      function glide(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / DUR);
        var pt = cubicAt(col.p, t);
        dot.setAttribute('cx', pt[0]);
        dot.setAttribute('cy', pt[1]);
        if (t < 1) {
          requestAnimationFrame(glide);
        } else {
          dot.remove();
          if (withConfetti) confettiBurst(col.bouton[0], col.bouton[1], col.dir);
        }
      }
      requestAnimationFrame(glide);
    });
  }

  /* smooth glide along an unmyelinated stretch (linear) */
  function glideSeg(dot, from, to, dur, done) {
    var start = null;
    function g(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      dot.setAttribute('cx', from[0] + (to[0] - from[0]) * t);
      dot.setAttribute('cy', from[1] + (to[1] - from[1]) * t);
      if (t < 1) requestAnimationFrame(g); else done();
    }
    requestAnimationFrame(g);
  }

  /* saltatory hops between the nodes of Ranvier, with a small pause at
     each node (the signal regenerates before jumping the next internode) */
  function hopNodes(dot, done) {
    var i = 0, last = null, wait = HOP_MS;
    function hop(ts) {
      if (last === null) last = ts;
      if (ts - last >= wait) {
        last = ts;
        wait = HOP_MS + Math.random() * HOP_JITTER;
        i++;
        if (i >= AXON_NODES.length) { done(); return; }
        dot.setAttribute('cx', AXON_NODES[i][0]);
        dot.setAttribute('cy', AXON_NODES[i][1]);
        dot.setAttribute('r', '4.6');       /* flare at the node */
        setTimeout(function () { if (dot.parentNode) dot.setAttribute('r', '3.4'); }, 45);
      }
      requestAnimationFrame(hop);
    }
    requestAnimationFrame(hop);
  }

  /* smooth out of the soma, saltatory through the myelin, smooth into the
     branch, then out along every collateral */
  function fireNeuron(withConfetti) {
    if (reducedMotion || !neuronSvg) return;
    var dot = makeDot(AXON_START[0], AXON_START[1]);
    glideSeg(dot, AXON_START, AXON_NODES[0], 160, function () {
      hopNodes(dot, function () {
        glideSeg(dot, AXON_NODES[AXON_NODES.length - 1], BRANCH, 150, function () {
          dot.remove();
          branchOut(withConfetti);
        });
      });
    });
  }

  if (neuron && neuronSvg) {
    neuron.addEventListener('click', function () { fireNeuron(true); });
    if (!reducedMotion) {
      setTimeout(function () { fireNeuron(false); }, 1500); /* a greeting spike */
      setInterval(function () { fireNeuron(false); }, 9000 + Math.random() * 5000);
    }
  }
})();
