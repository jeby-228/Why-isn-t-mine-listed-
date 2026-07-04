default:
    @just --list

init:
    pnpm install
    pnpm exec playwright install --with-deps chromium

build:
    pnpm run build

run:
    pnpm run dev

lint:
    pnpm run lint

fmt:
    pnpm run format

test:
    pnpm run test

check:
    pnpm run check

# 快速檢查（跳過測試和建置，適合開發時使用）
quick:
    just check
    just lint

# 完整 CI 檢查（包含測試和建置）
ci:
    just check
    just lint
    just test
    just build

