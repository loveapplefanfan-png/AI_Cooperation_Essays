// 全站共用腳本(同源外部檔案,CSP 的 script-src 'self' 已放行,不需要 inline script 或雜湊值)。
// 以 defer 載入,執行時 DOM 已解析完成;每項功能都先確認元素存在,沒有就跳過,所以各分頁可共用同一支檔案。

// 頁尾版權年份
const yearEl = document.getElementById('copyright-year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// 回到頂端按鈕(首頁與 Research Log 有,work-with-me 沒有)
const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        const isScrolled = window.scrollY > 300;
        scrollToTopBtn.classList.toggle('opacity-100', isScrolled);
        scrollToTopBtn.classList.toggle('pointer-events-auto', isScrolled);
        scrollToTopBtn.classList.toggle('opacity-0', !isScrolled);
        scrollToTopBtn.classList.toggle('pointer-events-none', !isScrolled);
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
