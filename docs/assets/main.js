/* Ivan Pozdniakov — site scripts: colour-scheme switcher only */

(function () {
  'use strict';

  var THEME_COLOR = { paper: '#f6f1e6', cyanotype: '#113a5d', ink: '#17181c' };
  var buttons = document.querySelectorAll('[data-set-theme]');
  var meta = document.querySelector('meta[name="theme-color"]');

  function apply(theme, persist) {
    document.documentElement.dataset.theme = theme;
    if (meta) meta.setAttribute('content', THEME_COLOR[theme] || '#f6f1e6');
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setTheme === theme));
    });
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.setTheme, true); });
  });

  /* reflect the theme chosen by the head snippet */
  apply(document.documentElement.dataset.theme || 'paper', false);
})();
