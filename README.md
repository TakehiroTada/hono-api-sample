# Hono API Sample

HonoフレームワークのAPIサンプルプロジェクトです。

## 技術スタック

- [Hono](https://hono.dev/) - 高速で軽量なWebフレームワーク
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/) - スキーマバリデーション
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) - OpenAPI統合
- [@hono/swagger-ui](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) - Swagger UIドキュメント
- [Biome](https://biomejs.dev/) - リンター・フォーマッター

## セットアップ

### 依存関係のインストール

```bash
pnpm install
```

## 使い方

### 開発サーバーの起動

```bash
pnpm dev
```

サーバーは `http://localhost:3000` で起動します。

### 本番サーバーの起動

```bash
pnpm start
```

### リンター・フォーマッター

```bash
# コードチェック
pnpm lint

# 自動修正
pnpm lint:fix

# フォーマット
pnpm format
```

## APIエンドポイント

### /part-01 - JSON レスポンス

シンプルなJSONレスポンスを返します。

```bash
curl http://localhost:3000/part-01
```

**レスポンス:**
```json
{
  "message": "hello"
}
```

### /part-02 - HTML レスポンス

HTMLテキストを返します。

```bash
curl http://localhost:3000/part-02
```

### /part-03 - CSV レスポンス

CSVファイルを返します。

```bash
curl http://localhost:3000/part-03
```

### /part-04 - JSX レスポンス

`jsxRenderer`を使用してJSXで生成されたHTMLページを返します。ランダムな数字も表示されます。

ブラウザで `http://localhost:3000/part-04` にアクセスしてください。

### /part-05 - バリデーションサンプル (POST)

`@hono/zod-openapi`を使用したバリデーション付きのPOSTエンドポイントです。

**リクエスト例:**
```bash
curl -X POST http://localhost:3000/part-05 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "太郎",
    "email": "taro@example.com",
    "age": 25
  }'
```

**成功レスポンス:**
```json
{
  "success": true,
  "message": "バリデーション成功",
  "data": {
    "name": "太郎",
    "email": "taro@example.com",
    "age": 25
  }
}
```

**バリデーションエラー例:**
```bash
curl -X POST http://localhost:3000/part-05 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email",
    "age": 200
  }'
```

## APIドキュメント

### /docs - Swagger UI

Swagger UIでインタラクティブなAPIドキュメントを表示します。

ブラウザで `http://localhost:3000/docs` にアクセスしてください。

### /doc - OpenAPI スキーマ

OpenAPI 3.0スキーマ（JSON形式）を取得できます。

```bash
curl http://localhost:3000/doc
```

## プロジェクト構造

```
.
├── src/
│   └── index.tsx       # メインアプリケーションファイル
├── biome.json          # Biome設定
├── tsconfig.json       # TypeScript設定
├── package.json        # 依存関係とスクリプト
└── README.md           # このファイル
```

## ライセンス

MIT
