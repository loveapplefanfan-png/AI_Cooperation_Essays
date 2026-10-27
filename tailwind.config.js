/** @type {import('tailwindcss').Config} */
module.exports = {
  // 告訴 Tailwind 去掃描哪些檔案、找出實際用到的 class 名稱,
  // 只把這些用到的 class 編進最終的 styles.css,其餘一律不產生(這就是體積比 Play CDN 版本小很多的原因)。
  // 根目錄所有 HTML 頁面,加上 site.js 等腳本(它們會用 classList 切換 class,例如 opacity-100);
  // 新增頁面或腳本不必再回來改這裡
  content: ['./*.html', './*.js'],
  theme: {
    extend: {},
  },
  plugins: [],
}
