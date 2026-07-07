/* Ivan Pozdniakov — site scripts: theme switcher & its toys.
   Interactions: click a name · press t to cycle · digits 1–8 jump ·
   ?? picks at random. Favicon and browser chrome follow the theme. */

(function () {
  'use strict';

  var THEMES = ['paper', 'manuscript', 'cyanotype', 'terminal', 'macintosh', 'gameboy', 'riso', 'ink'];

  var COLORS = {
    paper:      { bg: '#f6f1e6', fg: '#8a3a2c' },
    manuscript: { bg: '#f1e6cb', fg: '#9e2b1e' },
    cyanotype:  { bg: '#113a5d', fg: '#e5c37c' },
    terminal:   { bg: '#060b07', fg: '#4fdf78' },
    macintosh:  { bg: '#ffffff', fg: '#000000' },
    gameboy:    { bg: '#9bbc0f', fg: '#0f380f' },
    riso:       { bg: '#f7f4ec', fg: '#1d3fae' },
    ink:        { bg: '#17181c', fg: '#a4c9ab' }
  };

  var buttons = document.querySelectorAll('[data-set-theme]');
  var meta = document.querySelector('meta[name="theme-color"]');
  var favicon = document.getElementById('favicon');

  function faviconFor(theme) {
    var c = COLORS[theme];
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
      "<rect width='64' height='64' rx='12' fill='" + c.bg + "'/>" +
      "<text x='32' y='43' font-family=\"Georgia, 'Times New Roman', serif\" " +
      "font-style='italic' font-size='28' fill='" + c.fg + "' text-anchor='middle'>ip</text>" +
      '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function current() {
    return document.documentElement.dataset.theme || 'paper';
  }

  function apply(theme, persist) {
    if (THEMES.indexOf(theme) === -1) theme = 'paper';
    document.documentElement.dataset.theme = theme;
    if (meta) meta.setAttribute('content', COLORS[theme].bg);
    if (favicon) favicon.setAttribute('href', faviconFor(theme));
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setTheme === theme));
    });
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  }

  function switchTo(theme, persist) {
    var run = function () { apply(theme, persist); };
    if (
      document.startViewTransition &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.startViewTransition(run);
    } else {
      run();
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { switchTo(b.dataset.setTheme, true); });
  });

  var shuffle = document.getElementById('shuffle');
  if (shuffle) {
    shuffle.addEventListener('click', function () {
      var pool = THEMES.filter(function (t) { return t !== current(); });
      switchTo(pool[Math.floor(Math.random() * pool.length)], true);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 't' || e.key === 'T') {
      switchTo(THEMES[(THEMES.indexOf(current()) + 1) % THEMES.length], true);
    } else if (e.key >= '1' && e.key <= String(THEMES.length)) {
      switchTo(THEMES[Number(e.key) - 1], true);
    }
  });

  /* reflect the theme chosen by the head snippet */
  apply(current(), false);
})();
