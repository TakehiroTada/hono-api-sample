import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { jsxRenderer } from 'hono/jsx-renderer'

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'バリデーションエラー',
          details: result.error.flatten(),
        },
        400
      )
    }
  },
})

// JSX Renderer middleware
app.use(
  '*',
  jsxRenderer(({ children }) => {
    return (
      <html lang="ja">
        <head>
          <title>Hono JSX Sample</title>
        </head>
        <body>{children}</body>
      </html>
    )
  })
)

// /part-01: JSON response
app.get('/part-01', (c) => {
  return c.json({ message: 'hello' })
})

// /part-02: HTML response
app.get('/part-02', (c) => {
  return c.html('<html><body>hello</body></html>')
})

// /part-03: CSV response
app.get('/part-03', (c) => {
  const csv = `"たいとる","ぼでぃー","あいうえお"
aaa,bbb,ccc`

  return c.text(csv, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename="data.csv"',
  })
})

// /part-04: JSX response
app.get('/part-04', (c) => {
  const randomNumber = Math.floor(Math.random() * 1000)

  return c.render(
    <div>
      <h1>Welcome to Hono JSX</h1>
      <p>これはJSXで作成されたページです</p>
      <p>
        ランダムな数字: <strong>{randomNumber}</strong>
      </p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <a href="/">ホームに戻る</a>
    </div>
  )
})

// /part-05: Zod OpenAPI validation sample
const part05Route = createRoute({
  method: 'post',
  path: '/part-05',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().min(1).max(100).openapi({
              example: '太郎',
              description: 'ユーザー名',
            }),
            email: z.string().email().openapi({
              example: 'taro@example.com',
              description: 'メールアドレス',
            }),
            age: z.number().int().min(0).max(150).openapi({
              example: 25,
              description: '年齢',
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              name: z.string(),
              email: z.string(),
              age: z.number(),
            }),
          }),
        },
      },
      description: '成功レスポンス',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
      description: 'バリデーションエラー',
    },
  },
})

app.openapi(part05Route, (c) => {
  const { name, email, age } = c.req.valid('json')

  return c.json(
    {
      success: true,
      message: 'バリデーション成功',
      data: {
        name,
        email,
        age,
      },
    },
    200
  )
})

// /part-06: File upload with multipart/form-data
const part06Route = createRoute({
  method: 'post',
  path: '/part-06',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File).openapi({
              type: 'string',
              format: 'binary',
              description: 'アップロードするファイル',
            }),
            description: z.string().optional().openapi({
              description: 'ファイルの説明（オプション）',
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            fileInfo: z.object({
              name: z.string(),
              size: z.number(),
              type: z.string(),
              description: z.string().optional(),
            }),
          }),
        },
      },
      description: 'ファイルアップロード成功',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
      description: 'バリデーションエラー',
    },
  },
})

app.openapi(part06Route, async (c) => {
  const body = await c.req.parseBody()
  const file = body.file as File
  const description = body.description

  console.table({
    file: {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    },
    description: {
      value: description || 'なし',
    },
  })

  if (!file) {
    return c.json(
      {
        success: false,
        error: 'ファイルが指定されていません',
      },
      400
    )
  }

  return c.json(
    {
      success: true,
      message: 'ファイルアップロード成功',
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        description: description || undefined,
      },
    },
    200
  )
})

// OpenAPI documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hono API Sample',
    description: 'HonoフレームワークのAPIサンプル',
  },
})

// Swagger UI
app.get('/docs', swaggerUI({ url: '/doc' }))

const port = 3000
console.info(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
