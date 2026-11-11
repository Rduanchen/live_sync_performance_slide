# CIAO 期中公演｜別為青春雀步

現場公演的節目導覽與即時同步網站。觀眾可以瀏覽節目表、查看演出成員與 Instagram、填寫回饋表單，工作人員則透過管理後台切換現場節目。

目前活動時間為 **18:30～21:00**，地點為 **一大川堂**。

## 功能

- **主頁**提供公演海報、活動資訊、節目入口、社團 Instagram 和回饋表單。
- **節目表**提供曲序圖與可點選的文字列表。
- **現在演出**透過 Socket.IO 跟隨後台切換，也支援左右滑動、上一頁和下一頁。
- **自由瀏覽**時會暫停跟隨現場，點「回到同步」即可跳到後台目前選擇的頁面。
- **管理後台**提供密碼登入、上一頁、下一頁與 Quick Jump。
- **圖片預載**優先下載封面與曲序表，其餘圖卡逐張下載，搭配 HTTP 快取及 PWA 圖片快取。
- **保持螢幕開啟**在「現在演出」分頁使用 Wake Lock，實際支援依瀏覽器與裝置而定。

## 技術架構

| 範圍 | 使用技術 |
| --- | --- |
| 工作區 | pnpm workspaces |
| 前端 | Vue 3、TypeScript、Vite 8、Vuetify 4、Vue Router |
| 後端 | Node.js、Express、TypeScript |
| 即時同步 | Socket.IO |
| PWA 與圖片快取 | vite-plugin-pwa、Workbox |

開發時，Vite 將 `/api`、`/images`、`/socket.io` 代理到後端。正式環境由 Express 同時提供前端建置檔、API、圖片與 Socket.IO。

## 快速開始

以下指令皆於專案根目錄執行。

### 1. 準備環境

- Node.js 22.12.0 以上。Vite 的 Node.js 版本需求為 `^20.19.0 || >=22.12.0`。
- pnpm。本專案已使用 pnpm 10.33.4 完成建置驗證。

```sh
pnpm install --frozen-lockfile
```

### 2. 設定後端環境變數

建立 `server/.env`，填入自己的管理員密碼。

```dotenv
PORT=3000
ADMIN_PASSWORD=請填入自己的管理員密碼
```

`.env` 已列入 Git 忽略清單。變更後請重新啟動後端。

### 3. 啟動開發伺服器

```sh
pnpm dev
```

| 入口 | 預設網址 |
| --- | --- |
| 觀眾首頁 | http://localhost:5173/ |
| 管理員登入 | http://localhost:5173/admin-login |
| 管理後台 | http://localhost:5173/admin-panel |
| 後端節目資料 | http://localhost:3000/api/program |

Vite 在連接埠已被使用時可能選擇其他連接埠，請以終端機印出的網址為準。

### 現場操作

1. 用工作人員的瀏覽器開啟 `/admin-login`，輸入 `ADMIN_PASSWORD`。
2. 登入後，在 `/admin-panel` 使用 **Prev / Next** 或 **Quick Jump** 選擇節目。
3. 用另一台裝置或另一個瀏覽器開啟首頁，進入「現在演出」，確認切換已同步。
4. 觀眾自行翻頁後，可以點「回到同步」恢復跟隨。
5. 結尾在 Quick Jump 選擇「回饋表單」，觀眾即可開啟表單。首頁也有填寫入口。

## 常用指令

| 指令 | 用途 |
| --- | --- |
| `pnpm dev` | 同時啟動前後端開發伺服器 |
| `pnpm --filter client run dev` | 啟動前端 |
| `pnpm --filter server run dev` | 啟動後端並監看程式變更 |
| `pnpm build` | 建置後端、檢查前端 TypeScript 並建置前端 |
| `pnpm start` | 啟動正式環境伺服器 |
| `pnpm run deploy` | 依序建置前後端，成功後啟動正式環境伺服器 |
| `pnpm --filter client run preview` | 預覽前端建置產物，仍需運作中的後端 |

## 專案結構

```text
.
├── client/
│   ├── public/                    # 社團標誌與公開靜態檔案
│   ├── src/
│   │   ├── composables/
│   │   │   ├── preloadPosters.ts   # 圖卡預載佇列
│   │   │   └── useSocket.ts        # 即時同步與自由瀏覽狀態
│   │   ├── router/index.ts         # 路由與登入頁導向
│   │   ├── types/program.ts        # 前端節目型別
│   │   ├── views/Home.vue          # 觀眾頁面
│   │   ├── views/AdminLogin.vue    # 管理員登入
│   │   ├── views/AdminPanel.vue    # 現場控制後台
│   │   └── main.ts                # Vuetify 主題與應用程式入口
│   └── vite.config.ts             # 開發代理、PWA 與快取規則
├── images/                        # 公演 PNG 圖卡
├── server/
│   └── src/
│       ├── data/program.json      # 節目順序、成員、圖片與表單資料
│       └── index.ts               # API、圖片版本與 Socket.IO
├── package.json
└── pnpm-workspace.yaml
```

## 更新節目與圖卡

### 節目資料

編輯 [server/src/data/program.json](server/src/data/program.json)。JSON 陣列順序就是後台與「現在演出」的頁面順序，每個項目的 `id` 應維持唯一。

```json
{
  "id": "P1",
  "type": "performance",
  "title": "一樣的月光",
  "slideURL": "/images/3.png",
  "members": [
    {
      "name": "阿端",
      "role": "口琴手",
      "ig": "https://www.instagram.com/youduan4045"
    }
  ]
}
```

| 欄位 | 用途 |
| --- | --- |
| `id` | 同步時識別頁面的唯一 ID |
| `type` | `cover`、`schedule`、`performance`、`message`、`sponsors` 或 `feedback` |
| `title` | 頁面標題 |
| `slideURL` | 圖卡路徑 |
| `optionalSlideURL` | 可稍後補上的圖卡，後端會在檔案存在時回傳 `slideURL` |
| `groupName`、`message` | 團名、特別嘉賓或說明 |
| `members` | 成員的 `name`、`role`、`ig` 與選填的 `imgUrl` |
| `sponsors` | 贊助商名稱陣列 |
| `feedbackURL` | 回饋表單連結 |

文字節目列表依序顯示 `performance` 和 `message` 項目，贊助商與回饋表單另外提供入口。

開發模式會監看後端資料變更。正式環境更新 JSON 後，執行 `pnpm build` 並重新啟動伺服器，觀眾重新整理即可取得更新。

### 圖卡對照

| 圖片 | 內容 |
| --- | --- |
| `1.png` | 公演封面 |
| `2.png` | 曲序表 |
| `3.png` | 一樣的月光 |
| `4.png` | 星星 |
| `5.png` | 屋頂上的提琴手 |
| `6.png` | 第一次抽獎 |
| `7.png` | 長成什麼樣子算愛情 |
| `8.png` | 能遇見就很不錯了 |
| `9.png` | 中場休息 |
| `10.png` | BOULEVARD OF BROKEN DREAMS |
| `11.png` | 帶你去旅行 |
| `12.png` | 第二次抽獎 |
| `13.png` | COLD BLOODED |
| `14.png` | 世界が終るまでは |
| `15.png` | 大合照 |
| `16.png` | 感謝贊助商 |
| `17.png` | 回饋表單，可稍後補上 |

將 PNG 放在根目錄的 `images/`。壓縮後可直接覆蓋同名檔案，後端會在下次取得節目資料時，依修改時間與檔案大小產生新版圖片網址，觀眾重新整理後即可載入新版。

`17.png` 補上後會自動加入回饋頁的圖卡顯示與預載佇列。回饋頁也能先以文字與按鈕呈現。

### 活動與表單資訊

- 活動首頁文字與社團連結位於 [client/src/views/Home.vue](client/src/views/Home.vue)。
- 封面頁文字、節目內容及回饋表單網址位於 `program.json`。首頁與回饋頁共用其中的 `feedbackURL`。
- 瀏覽器標題與描述位於 `client/index.html`，PWA 名稱位於 `client/vite.config.ts`。

目前使用的回饋表單為 [CIAO 公演回饋表單](https://forms.gle/nFbRVwGSLHi32BiH8)。

## 圖片預載與快取

1. 首頁取得節目資料後，同時以高優先度請求封面與曲序表。
2. 封面下載完成後，背景佇列依節目順序，一次下載一張其餘圖卡。曲序表此時可繼續下載。
3. 「現在演出」顯示中的圖卡會發出高優先度請求，瀏覽器依網路狀態安排下載。
4. 單張背景圖卡失敗時會繼續下一張，離開觀眾頁面時會取消預載佇列。
5. 後端圖片提供 **1 小時 HTTP 快取**。Service Worker 對帶版本參數的數字 PNG 圖卡使用 **CacheFirst**，最多保留 **36 筆、7 天**，實際保存也受瀏覽器儲存空間管理影響。

快取名稱為 `ciao-program-posters`。圖片網址的 `?v=` 由後端產生，請在 JSON 中填寫原始路徑。

Service Worker 在 HTTPS 或 localhost 的安全環境運作。以區域網路 IP 的 HTTP 網址測試時，仍可使用圖片預載與 HTTP 快取。首次取得節目資料及即時同步需要網路連線。

## 正式環境部署

```sh
pnpm install --frozen-lockfile
pnpm run deploy
```

在部署主機的專案根目錄執行。此指令會先執行 `build`，成功後執行 `start`，伺服器會持續在目前終端機運行。更新運行中的網站時，先停止既有行程，再執行此指令。

pnpm 內建的 `deploy` 用於工作區套件部署，因此這裡使用完整的 `pnpm run deploy` 呼叫專案腳本。

預設開啟 http://localhost:3000/，管理登入位於 http://localhost:3000/admin-login。對外網址依部署網域與反向代理設定而定。

部署時保留依賴套件及以下目錄結構，讓 Express 正確找到前端與圖片。

```text
client/dist/
server/dist/             # 包含 data/program.json
server/.env
images/
```

使用 HTTPS 網域時，將 HTTP 請求代理到後端，並為 `/socket.io/` 提供 WebSocket 連線升級支援。

### Railway 單一服務部署

本專案的前端與後端共用一個 Railway 服務。Express 提供 `client/dist/` 頁面、`/assets/` 前端資源、`/images/` 圖卡、`/api/` 和 `/socket.io/`，瀏覽器透過同一個公開網址使用全部功能。

Railway 匯入 JavaScript monorepo 時，會為可部署套件自動建立服務。本專案根目錄的 `railway.json` 指定從根目錄建置並啟動 Express，設定於每個選用該檔案的服務生效。匯入時選取一個服務即可完成這種部署。[Railway monorepo 說明](https://docs.railway.com/deployments/monorepo)

在選定服務的 Settings 設定以下欄位。

| 欄位 | 設定 |
| --- | --- |
| Root Directory | `/`，使用整個儲存庫 |
| Railway Config File | `/railway.json` |
| Build Command | `pnpm run build`，由設定檔提供 |
| Start Command | `pnpm run start`，由設定檔提供 |
| Watch Paths | 清空套件專屬限制，讓前端、後端及圖片更新都能觸發部署 |

在 Variables 設定 `ADMIN_PASSWORD`。保留 Railway 提供的 `PORT`，讓前端使用預設同源連線。若曾設定 `VITE_API_URL` 指向另一個服務，請移除該變數再重新部署。

部署成功後，在 Networking 產生公開網域，首頁使用該網域，管理登入使用同一網域的 `/admin-login`。已有兩個服務時，先完成選定服務的上述設定並驗證網站，再處理多餘服務。

根目錄的 `packageManager` 固定 pnpm 版本，`engines.node` 指定 Node.js 22。Railway 分別執行建置與啟動階段，`pnpm run deploy` 可供自行管理主機時使用。[Railway 設定檔說明](https://docs.railway.com/config-as-code)

### 環境變數

| 位置 | 變數 | 預設與用途 |
| --- | --- | --- |
| `server/.env` | `PORT` | 預設 `3000` |
| `server/.env` | `ADMIN_PASSWORD` | 管理員登入密碼 |
| `client/.env.local` | `VITE_API_URL` | 預設使用網站同源的 API、圖片與 Socket.IO |

前後端分開網域時，可在 `client/.env.local` 設定後端來源，然後重新建置前端。

```dotenv
VITE_API_URL=https://api.example.com
```

`VITE_API_URL` 使用來源網址並省略結尾斜線。Vite 會將 `VITE_` 變數寫入前端程式，因此這些值會提供給瀏覽器讀取。

開發代理的後端目標固定在 `client/vite.config.ts` 的 `backend`。變更開發用 `PORT` 時，也要同步調整代理目標，或透過 `VITE_API_URL` 指定後端來源。

## 目前的運作限制

- **現場狀態**保存在單一 Node.js 行程的記憶體。重啟後會回到第一頁，多個獨立後端行程需要共用狀態與同步機制。
- **後台驗證**目前使用固定 token 與前端路由檢查，Socket.IO 的 `admin:update` 接受連線端提交的 ID。公開部署的管理控制需要補上伺服器端權限驗證與節目 ID 檢查。
- **PWA 安裝圖示**目前 manifest 指向 `pwa-192x192.png` 與 `pwa-512x512.png`。要完整提供安裝體驗，請在 `client/public/` 補上對應檔案。

## 常見問題

| 情況 | 檢查方式 |
| --- | --- |
| 登入時出現 Connection error | 確認後端已啟動，並檢查開發代理或 `VITE_API_URL` |
| 登入密碼變更後仍無法使用 | 確認設定在 `server/.env`，並重新啟動後端 |
| 手機瀏覽頁面時圖片或 API 失敗 | 確認手機可連到網站，並檢查前端環境變數是否指向手機自身的 localhost |
| 觀眾頁面停在先前節目 | 點「回到同步」，再確認 Socket.IO 連線與反向代理設定 |
| 覆蓋 PNG 後仍看到舊圖 | 重新整理頁面，檢查 `/api/program` 回傳的 `slideURL` 版本參數是否已更新 |
| 修改 JSON 後正式站內容未更新 | 重新建置後端並重啟，再重新整理觀眾頁 |
| 出現 pwa 圖示 404 | 依 manifest 指定名稱補上兩個安裝圖示 |
