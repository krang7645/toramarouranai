# MBTI診断アプリ インストールガイド

## 開発環境のセットアップ

### 必要な環境

- Node.js (v14.x以上)
- npm または yarn

### 手順

1. リポジトリをクローンする

```bash
git clone https://github.com/yourusername/mbti-test-app.git
cd mbti-test-app
```

2. 依存関係をインストールする

```bash
npm install
# または
yarn install
```

3. 開発サーバーを起動する

```bash
npm start
# または
yarn start
```

4. ブラウザで http://localhost:3000 にアクセスし、アプリケーションが正常に動作することを確認する

## Dify APIとの連携設定

1. `.env` ファイルをプロジェクトのルートディレクトリに作成する

```
REACT_APP_DIFY_API_URL=https://your-dify-api-endpoint
REACT_APP_DIFY_API_KEY=your-api-key
```

2. `src/components/MBTITest.js` ファイルを開き、`sendToDify` 関数内のコメントアウトされたコードを有効にする

```javascript
// この部分のコメントを解除
fetch(process.env.REACT_APP_DIFY_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_DIFY_API_KEY}`
  },
  body: JSON.stringify({
    zodiacSign: zodiacSign,
    mbtiType: mbtiType,
    gender: gender
  })
})
.then(response => response.json())
.then(data => {
  setDifyResponse(data);
  setLoading(false);
  setStep(4);
})
.catch(error => {
  console.error('Error:', error);
  setLoading(false);
  alert('エラーが発生しました。もう一度お試しください。');
});
```

## Netlifyへのデプロイ

### 手動デプロイ

1. ビルドを作成する

```bash
npm run build
# または
yarn build
```

2. `build` ディレクトリをNetlifyにドラッグ&ドロップする

### GitHubとの連携による自動デプロイ

1. GitHubにリポジトリをプッシュする

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Netlifyにログインし、「New site from Git」をクリック

3. GitHubを選択し、リポジトリを選択

4. ビルド設定：
   - Build command: `npm run build`
   - Publish directory: `build`

5. 「Deploy site」をクリック

6. 環境変数を設定する：
   - Netlifyダッシュボードの「Site settings」→「Build & deploy」→「Environment」
   - 以下の環境変数を追加:
     - REACT_APP_DIFY_API_URL
     - REACT_APP_DIFY_API_KEY

7. 「Trigger deploy」をクリックして再デプロイ

## カスタマイズ

### MBTI質問の変更

`src/components/MBTITest.js` の `questions` 配列を編集することで、質問内容を変更できます。

### デザインの変更

Tailwind CSSを使用しているため、各コンポーネントのクラス名を変更することでデザインをカスタマイズできます。

### 星座計算ロジックの変更

`src/utils/helpers.js` の `calculateZodiacSign` 関数を編集することで、星座計算のロジックを変更できます。