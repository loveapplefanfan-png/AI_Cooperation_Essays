/** @type {import('tailwindcss').Config} */
module.exports = {
  // 告訴 Tailwind 去掃描哪些檔案、找出實際用到的 class 名稱,
  // 只把這些用到的 class 編進最終的 styles.css,其餘一律不產生(這就是體積比 Play CDN 版本小很多的原因)。
  content: ['./*.html'], // 根目錄所有 HTML 頁面;新增頁面不必再回來改這裡
  theme: {
    extend: {},
  },
  plugins: [],
}
