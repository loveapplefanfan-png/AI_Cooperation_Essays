> **注意(2026-10-02 更新):本筆記已過時。** 任務 A、B 已完成並合併;之後 inline script 也已外部化為 `site.js`,全站不再有 inline script,CSP 不需要任何雜湊。以下內容保留作為歷史紀錄,現況請以 README「Content Security Policy」小節為準。

# 交接筆記:網站 CSP 雜湊維護(給之後的 Claude Code 工作階段)

建立日期:2026-09-29
專案:`loveapplefanfan-png/AI_Cooperation_Essays`(GitHub Pages 為主,Cloudflare Pages 為鏡像)

> 這份筆記寫給沒有這次對話記憶的新工作階段。請先讀完「背景與目前狀態」再動手,不要憑標題推測內容。

---

## 1. 背景與目前狀態

### 網站架構
- 純 HTML 一頁式網站,沒有框架。頁面:`index.html`、`research-log.html`。
- 樣式:`styles.css` 由 GitHub Actions(`.github/workflows/tailwind.yml`)從 `src/input.css` 自動 build,**不要手改**。
- 安全設定:
  - CSP 寫在兩個 HTML 的 `<meta http-equiv="Content-Security-Policy">`,同時 `_headers`(Cloudflare Pages 用)也有一份。
  - `script-src` 用 SHA-256 雜湊放行 inline script,不使用 `'unsafe-inline'`。
  - GitHub Pages 無法設定 HTTP headers,所以那邊實際生效的是 HTML 裡的 meta CSP。

### 目前的兩個 inline script 與雜湊(2026-09-29 已核對)

| 位置 | 內容 | 雜湊 |
|---|---|---|
| `index.html` | JSON-LD 結構化資料(`type="application/ld+json"`) | `sha256-QU5ZjdRH4TksDnuSXvPbTGCW647D6pkCgXouW4Tgspc=` |
| `index.html` 與 `research-log.html` | 回到頂端按鈕 + 頁尾年份的 script(兩頁逐字相同) | `sha256-muSxKhm4ionPygBEBPRsh6EwRZnz+KYj/S19c+PN1aY=` |

- `research-log.html` 沒有 JSON-LD,所以它的 CSP 只有第二個雜湊。
- `_headers` 的 `script-src` 兩個雜湊都有。
- 雜湊計算對象是 `<script>` 與 `</script>` 之間的原文,**連縮排與換行都算**(CRLF 會被瀏覽器統一成 LF)。用編輯器自動格式化整個檔案可能悄悄改變雜湊。

### 已知的重點
- JSON-LD 是資料區塊,瀏覽器不會執行,CSP 的 `script-src` 原則上不會擋它。所以它的雜湊實際上沒有保護作用,只是設定上的一致性,卻是日後最常需要維護的一項。
- README 已有「Updating CSP hashes」小節與重算雜湊的 Python 程式碼。若 README 結構表格下方還留著舊的一段「When you change an inline `<script>`…」,請刪除,因為它與新小節重複且對 JSON-LD 的說法不正確。

---

## 2. 之後「內容更新」仍可能碰到雜湊或 CSP 的三種情況

一般文字內容增加,只改 `index.html` 或 `research-log.html` 的可見文字即可,不影響雜湊。以下三種例外要留意:

| 情況 | 影響 | 需要更新的地方 |
|---|---|---|
| **新增一篇研究,並同步更新 JSON-LD**(最容易被忽略) | JSON-LD 文字改變,雜湊改變 | `index.html` 的 CSP 與 `_headers` |
| **引用新的外部資源**(外部圖片、iframe、腳本、新字體) | 目前 CSP 只允許同源圖片與少數外部網址(Google Fonts、Google Tag Manager、Google Analytics) | 兩個 HTML 的 meta CSP 與 `_headers` |
| **使用新的 Tailwind class** | 需要重新 build `styles.css` | 無需手動,推送到 `main` 後 Actions 自動處理 |

單純的外部連結(`<a href>`)不受 CSP 影響。

新增一篇研究時的檢查清單:
1. `index.html` 可見的 Published Research 區塊新增條目。
2. `research-log.html` 時間軸新增條目。
3. 若保留 JSON-LD 的雜湊:更新 JSON-LD 條目,重算雜湊,同步 `index.html` 與 `_headers`。
4. 確認所有 DOI 連結與 JSON-LD 中的 DOI 一致。

---

## 3. 待辦任務

### 任務 A:加入自動 CSP 雜湊檢查(建議優先做)

**目的**:額度用完後,不再依賴手動步驟。每次推送或 PR,自動確認雜湊沒有漏改。

**要做的事**
1. 新增 `scripts/check_csp.py`:
   - 讀取 `index.html`、`research-log.html`、`_headers`。
   - 對每個 HTML 找出所有沒有 `src` 屬性的 inline `<script>`,計算 SHA-256(先把 `\r\n` 與 `\r` 統一為 `\n`),用 `base64` 編碼。
   - 從 meta CSP 的 `script-src` 抓出所有 `'sha256-…'`。
   - **失敗條件**:任何 inline script 的雜湊不在該頁面的 CSP 裡(輸出應包含該 script 類型與「預期雜湊值」,方便直接複製替換)。
   - **失敗條件**:`_headers` 的 `script-src` 雜湊集合,與 `index.html` 的雜湊集合不一致。
   - **警告**(不失敗):CSP 裡有雜湊沒有對應到任何 inline script。
2. 新增 `.github/workflows/csp-check.yml`:
   - 觸發:`push` 與 `pull_request`,路徑限定 `index.html`、`research-log.html`、`_headers`、`scripts/check_csp.py`。
   - `permissions: contents: read`。
   - 步驟:checkout → 設定 Python → 執行 `python scripts/check_csp.py`。
3. 注意與既有的 `tailwind.yml` 不衝突:它會把 `styles.css` commit 回 repo,新的檢查只讀取,不寫入。

**驗收條件**
- 目前的 main 通過檢查。
- 故意改動 JSON-LD 一個字元(不更新雜湊),檢查失敗且輸出正確的新雜湊。
- 故意改動回到頂端 script,檢查失敗。
- 故意讓 `_headers` 的雜湊與 `index.html` 不同,檢查失敗。
- 測試完成後把測試用的錯誤改動還原,不要留在 main。

### 任務 B:評估是否拿掉 JSON-LD 的雜湊(需要先與使用者確認)

**取捨**
- 保留:設定看起來完整,但每次改 JSON-LD 都要同步 `index.html` 與 `_headers`。
- 拿掉:少一項常態維護,但要確認結構化資料與瀏覽器行為不受影響。

**做之前必須先驗證**
1. 在瀏覽器測試(Chrome 與 Firefox)拿掉 JSON-LD 雜湊後,主控台**沒有** CSP 錯誤,頁面功能(回到頂端按鈕、頁尾年份)正常。
2. 用 Google 的 Rich Results Test 或 Schema.org 驗證工具檢查頁面,Person、WebSite、ScholarlyArticle 等實體仍被正確辨識。
3. 使用者確認要採用。

**若採用,需要同步修改**
- `index.html` 的 meta CSP 移除 `sha256-QU5Zjd…`。
- `_headers` 移除同一個雜湊。
- `index.html` 頂端關於 CSP 的註解(說明兩段 inline script 被雜湊鎖定)改寫為只有一段。
- README「Updating CSP hashes」小節的表格移除 JSON-LD 那一列,並說明 JSON-LD 不在 CSP 內。
- 若任務 A 已完成:檢查腳本要**忽略** `type="application/ld+json"` 的 script,不可要求它有雜湊。

---

## 4. 執行時的限制與注意

- 只改任務相關的檔案,不動使用者的文字內容(標題、段落、姓名拼法 `Fan Chen-Chieh` 等)。
- 不要修改 `index.html` 與 `research-log.html` 底部回到頂端那段 inline script 的任何字元。
- 不要對整個 HTML 檔案做自動格式化。
- 每次修改後,用 README 裡的 Python 程式碼重算雜湊,確認兩個 HTML 與 `_headers` 三處一致。
- 使用 PR 流程,不要直接推到 `main`,並在 PR 描述中列出驗證結果。
- 推送後 Actions 會自動 build `styles.css`,這是正常現象。

---

## 5. 給新工作階段的起始提示(可直接貼上)

```text
請先閱讀 repo 內的 csp-handoff-note.md(或我貼上的這份交接筆記),再開始工作。
先做任務 A(自動 CSP 雜湊檢查),完成後以 PR 送出並列出驗收結果。
任務 B 先只做驗證與評估,不要直接修改,結果回報後再由我決定。
過程中不要修改我的網站文字內容,也不要動回到頂端 script 的內容。
```
