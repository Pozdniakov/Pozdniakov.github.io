/* Ivan Pozdniakov — site scripts: theme switcher & its toys.
   Interactions: click a name · press t to cycle · digits 1–9 jump ·
   ?? picks at random · click the portrait · one classic 10-key
   sequence unlocks a thirteenth scheme. Favicon, tab title and
   browser chrome follow the theme. */

(function () {
  'use strict';

  var BASE_THEMES = [
    'paper', 'manuscript', 'cyanotype', 'terminal', 'macintosh',
    'gameboy', 'riso', 'punchcard', 'herbarium', 'workbench',
    'darkroom', 'ink'
  ];

  var COLORS = {
    paper:      { bg: '#f6f1e6', fg: '#8a3a2c' },
    manuscript: { bg: '#f1e6cb', fg: '#9e2b1e' },
    cyanotype:  { bg: '#113a5d', fg: '#e5c37c' },
    terminal:   { bg: '#060b07', fg: '#4fdf78' },
    macintosh:  { bg: '#ffffff', fg: '#000000' },
    gameboy:    { bg: '#9bbc0f', fg: '#0f380f' },
    riso:       { bg: '#f7f4ec', fg: '#f04e98' },
    punchcard:  { bg: '#ecdfba', fg: '#2456a6' },
    herbarium:  { bg: '#edf0e0', fg: '#23402a' },
    workbench:  { bg: '#0055aa', fg: '#ff8800' },
    darkroom:   { bg: '#140b0b', fg: '#ff8a72' },
    ink:        { bg: '#17181c', fg: '#a4c9ab' },
    amber:      { bg: '#100a02', fg: '#ffb000' }
  };

  var TITLE = {
    terminal: '> Ivan Pozdniakov',
    amber: '> Ivan Pozdniakov',
    gameboy: '▶ Ivan Pozdniakov',
    manuscript: '❧ Ivan Pozdniakov',
    darkroom: '● Ivan Pozdniakov'
  };

  var picker = document.querySelector('.theme-picker');
  var buttons = document.querySelectorAll('[data-set-theme]');
  var meta = document.querySelector('meta[name="theme-color"]');
  var favicon = document.getElementById('favicon');
  var amberBtn = document.getElementById('amberBtn');

  function unlocked() {
    try { return localStorage.getItem('amber') === '1'; } catch (e) { return false; }
  }

  function themes() {
    return unlocked() ? BASE_THEMES.concat('amber') : BASE_THEMES;
  }

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
    if (!COLORS.hasOwnProperty(theme)) theme = 'paper';
    if (theme === 'amber' && amberBtn) amberBtn.hidden = false;
    document.documentElement.dataset.theme = theme;
    if (meta) meta.setAttribute('content', COLORS[theme].bg);
    if (favicon) favicon.setAttribute('href', faviconFor(theme));
    document.title = TITLE[theme] || 'Ivan Pozdniakov';
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
      var pool = themes().filter(function (t) { return t !== current(); });
      switchTo(pool[Math.floor(Math.random() * pool.length)], true);
      if (picker) {
        picker.classList.remove('wiggle');
        void picker.offsetWidth; /* restart animation */
        picker.classList.add('wiggle');
      }
    });
  }

  /* portrait: click to swap photos */
  var portraitBtn = document.getElementById('portraitToggle');
  if (portraitBtn) {
    var img = portraitBtn.querySelector('img');
    portraitBtn.addEventListener('click', function () {
      var alt = img.src.indexOf('profile_old') === -1;
      img.src = alt ? 'images/profile_old.jpg' : 'images/profile.jpg';
    });
  }

  /* keyboard: t cycles · digits jump · a certain sequence unlocks amber */
  var KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var kPos = 0;

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kPos = key === KONAMI[kPos] ? kPos + 1 : (key === KONAMI[0] ? 1 : 0);
    if (kPos === KONAMI.length) {
      kPos = 0;
      try { localStorage.setItem('amber', '1'); } catch (err) {}
      if (amberBtn) amberBtn.hidden = false;
      switchTo('amber', true);
      return;
    }

    if (e.key === 't' || e.key === 'T') {
      var list = themes();
      var i = list.indexOf(current());
      switchTo(list[(i + 1) % list.length], true);
    } else if (e.key >= '1' && e.key <= '9') {
      var target = themes()[Number(e.key) - 1];
      if (target) switchTo(target, true);
    }
  });

  /* reflect the theme chosen by the head snippet */
  if (unlocked() && amberBtn) amberBtn.hidden = false;
  apply(current(), false);
})();
