// 回到頂端按鈕 + 頁尾年份。原本是各頁底部的 inline script,現在改成同源外部檔案,
// 由 CSP 的 script-src 'self' 放行,不再需要雜湊值。各頁以 <script src="site.js" defer> 載入。
// 並非每頁都有回到頂端按鈕(例如 work-with-me.html),所以每個元素都先確認存在再使用。
(function () {
  var scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function () {
      var isScrolled = window.scrollY > 300;
      scrollToTopBtn.classList.toggle('opacity-100', isScrolled);
      scrollToTopBtn.classList.toggle('pointer-events-auto', isScrolled);
      scrollToTopBtn.classList.toggle('opacity-0', !isScrolled);
      scrollToTopBtn.classList.toggle('pointer-events-none', !isScrolled);
    });

    scrollToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
