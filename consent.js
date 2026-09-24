// Cookie 同意機制:訪客按下 Accept 之前,完全不載入 Google Analytics(不設 cookie、不送任何資料)。
// 訪客的選擇存在自己瀏覽器的 localStorage;無法存取時(無痕模式等)就每次都詢問,預設不追蹤。
// 這是獨立的同源檔案,CSP 的 script-src 'self' 已放行,不需要雜湊值。
(function () {
  var GA_ID = 'G-B50RNE00YZ';
  var KEY = 'cookie-consent'; // 'granted' | 'denied'
  var gaLoaded = false;

  function readChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* 無法儲存就只在本次瀏覽生效 */ }
  }

  function loadAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // GA4 本身不記錄、不儲存 IP;另外關閉 Google 信號(跨裝置追蹤)與廣告個人化,只做基本流量統計。
    window.gtag('config', GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // 撤回同意時,刪掉 GA 已經設下的 _ga / _ga_XXXX cookie
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        domains.forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  var banner = document.getElementById('cookie-banner');

  function showBanner() { banner.classList.remove('hidden'); }
  function hideBanner() { banner.classList.add('hidden'); }

  document.getElementById('cookie-accept').addEventListener('click', function () {
    saveChoice('granted');
    hideBanner();
    loadAnalytics();
  });

  document.getElementById('cookie-decline').addEventListener('click', function () {
    var wasLoaded = gaLoaded;
    saveChoice('denied');
    hideBanner();
    clearAnalyticsCookies();
    // GA 已經在這一頁執行時,重新載入頁面才能確實停止
    if (wasLoaded) location.reload();
  });

  document.getElementById('cookie-settings').addEventListener('click', showBanner);

  var choice = readChoice();
  if (choice === 'granted') {
    loadAnalytics();
  } else if (choice !== 'denied') {
    showBanner();
  }
})();
