/* ============================================
   LANGUAGE SWITCHER
   ============================================ */
(function() {
  const LANG_KEY = 'dalbir_lang';

  function getCurrentLang() {
    return window.location.pathname.includes('/pa/') ? 'pa' : 'en';
  }

  function getSwitchUrl(targetLang) {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    if (targetLang === 'pa') {
      if (path.includes('/pa/')) return path;
      const base = path.substring(0, path.lastIndexOf('/') + 1);
      return base + 'pa/' + file;
    } else {
      if (!path.includes('/pa/')) return path;
      return path.replace('/pa/', '/');
    }
  }

  function initLangSwitch() {
    const currentLang = getCurrentLang();
    localStorage.setItem(LANG_KEY, currentLang);

    document.querySelectorAll('.lang-switch a').forEach(function(link) {
      const lang = link.getAttribute('data-lang');
      if (lang === currentLang) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
      link.addEventListener('click', function(e) {
        e.preventDefault();
        if (lang !== currentLang) {
          window.location.href = getSwitchUrl(lang);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangSwitch);
  } else {
    initLangSwitch();
  }
})();
