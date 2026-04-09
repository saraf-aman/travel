/**
 * darkmode.js — Theme toggle with localStorage persistence.
 * Icon switching is handled purely via CSS (.icon-moon / .icon-sun visibility).
 * Anti-flash: put this inline in <head> BEFORE stylesheets:
 *   <script>if(localStorage.getItem('travel-theme')==='dark')document.documentElement.setAttribute('data-theme','dark');</script>
 */
(function () {
  function toggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('travel-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('travel-theme', 'dark');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);
  });
})();
