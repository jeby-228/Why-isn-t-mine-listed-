# Justfile 使用手冊

## 介紹

本專案使用 `just` 作為任務運行工具，而不是傳統的 npm 腳本。`just` 是一個簡單易用的命令運行工具，使命令管理更加便捷。

## 安裝

### 1. 安裝 `just`

在使用 justfile 之前，需要先安裝 `just`：

- **Linux**:
  ```bash
  apt install just
  ```

或者訪問 [Just 官方網站](https://just.systems/) 查看更多安裝方式。

### 2. 初始化專案依賴

```bash
just init
```

此命令會執行 `npm install` 安裝所有項目依賴。

## 可用命令

### `just` 或 `just --list`

顯示所有可用的命令列表。

```bash
just
```

### `just run`

啟動開發伺服器，使用 Vite + SvelteKit 的開發模式。

```bash
just run
```

開發伺服器通常運行在 `http://localhost:5173`

### `just build`

構建生產環境的應用程式。

```bash
just build
```

編譯後的文件會輸出到 `.svelte-kit/output` 目錄。

### `just lint`

運行代碼風格檢查和 ESLint 檢驗。

```bash
just lint
```

此命令會檢查：

- Prettier 代碼格式
- ESLint 代碼質量規則

### `just fmt`

自動格式化代碼（使用 Prettier）。

```bash
just fmt
```

此命令會修復所有格式不符合 Prettier 標準的代碼。

### `just test`

運行測試套件。

```bash
just test
```

### `just check`

運行類型檢查（TypeScript）和 Svelte 檢查。

```bash
just check
```

此命令會執行 `svelte-kit sync` 和 `svelte-check`。

### `just ci`

運行完整的持續集成流程。

```bash
just ci
```

此命令依序執行：

1. `just check` - 類型檢查
2. `just lint` - 代碼風格檢查
3. `just build` - 構建項目

**推薦在提交代碼前運行此命令。**

## 工作流程示例

### 開始開發

```bash
just init      # 首次安裝依賴
just run       # 啟動開發伺服器
```

### 提交代碼前的檢查清單

```bash
just fmt       # 自動格式化代碼
just ci        # 運行完整檢查（包括類型、風格、構建）
```

### 快速格式化和檢查

```bash
just fmt && just check
```

## 常見問題

### Q: 如何快速修複格式化問題？

A: 運行 `just fmt` 自動修複代碼格式。

### Q: 如何驗證代碼質量？

A: 運行 `just lint` 檢查代碼風格和質量。

### Q: 構建失敗怎麼辦？

A: 先運行 `just check` 檢查類型錯誤，然後根據錯誤訊息修正代碼。

### Q: 開發環境配置有問題？

A: 嘗試運行 `just init` 重新安裝依賴。

## 項目依賴

本項目使用以下主要依賴：

- **SvelteKit**: 現代化的 Svelte 框架
- **Tailwind CSS**: 實用優先的 CSS 框架
- **Skeleton Labs**: UI 组件庫
- **Lucide Svelte**: 圖標庫
- **TypeScript**: 類型安全的 JavaScript

## 相關檔案

- `justfile` - Just 任務定義文件
- `package.json` - NPM 依賴和腳本配置
- `tsconfig.json` - TypeScript 配置
- `svelte.config.js` - Svelte/SvelteKit 配置
- `tailwind.config.js` - Tailwind 配置
- `eslint.config.js` - ESLint 配置

## 更多資訊

- [Just 官方文檔](https://just.systems/)
- [SvelteKit 文檔](https://kit.svelte.dev/)
- [Skeleton Labs 組件庫](https://www.skeletonlabs.com/)
