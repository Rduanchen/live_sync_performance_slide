# Live-Sync Performance Web App

這是一個專為現場演出設計的即時同步網頁應用程式。包含讓觀眾查看目前節目、演出細節及動態內容的即時同步介面，以及一個供管理員即時控制與更新演出狀態的後台管理面板（Admin Panel）。

## 技術堆疊 (Tech Stack)

此專案使用 `pnpm` workspaces 建立為 Monorepo 架構。

### 前端 (Client - `client/`)
* **框架**: Vue 3 (Composition API)
* **建置工具**: Vite
* **UI 套件**: Vuetify
* **即時通訊**: Socket.IO Client

### 後端 (Server - `server/`)
* **執行環境**: Node.js
* **框架**: Express
* **即時通訊**: Socket.IO
* **語言**: TypeScript

## 前置需求

* Node.js (建議 v18 或以上版本)
* [pnpm](https://pnpm.io/installation) (建議 v8 或以上版本)

## 安裝步驟

1. 複製此儲存庫 (Clone the repository)。
2. 在根目錄執行以下指令，為所有工作區安裝相依套件：

   ```bash
   pnpm install
   ```

## 開發環境

若要同時啟動前端與後端的開發伺服器，請在根目錄執行：

```bash
pnpm dev
```

* **前端 (Client)**: 運行於 [http://localhost:5173/](http://localhost:5173/)
* **後端 (Server)**: 運行於 `http://localhost:3000/` (或定義在 `.env` 中的 Port)

你也可以分別啟動它們：
* 僅啟動前端：`pnpm --filter client run dev`
* 僅啟動後端：`pnpm --filter server run dev`

## 建置 Production 版本

若要同時建置前端與後端程式碼：

```bash
pnpm build
```

這將會執行前端的 `vite build` 與後端的 `tsc`。

## 啟動 Production 伺服器

建置完成後，可以使用以下指令啟動伺服器：

```bash
pnpm start
```

## 環境變數 (Environment Variables)

請確保設定了必要的環境變數。你可以根據需求在 `client` 與 `server` 目錄下分別建立 `.env` 檔案以進行設定。
