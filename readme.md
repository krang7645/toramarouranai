# MBTI診断アプリ

生年月日と性別を入力してMBTI診断を行い、結果に基づいた詳細な分析を表示するウェブアプリケーションです。

## 機能

- 生年月日と性別の入力
- 10問のMBTI診断テスト
- 診断結果の表示（MBTIタイプと星座）
- Dify APIへの結果送信と詳細分析の表示
- レスポンシブデザイン

## 技術スタック

- React.js
- Tailwind CSS
- Netlify（デプロイ）

## ローカル開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/mbti-test-app.git
cd mbti-test-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

ブラウザで `http://localhost:3000` を開いてアプリケーションを確認できます。

## Dify API連携

本番環境では、以下の手順でDify APIと連携します：

1. `.env` ファイルを作成して、Dify APIの接続情報を設定します：

```
REACT_APP_DIFY_API_URL=https://your-dify-api-endpoint
REACT_APP_DIFY_API_KEY=your-api-key
```

2. `MBTITest.js` 内の `sendToDify` 関数のコメントアウトされたコードを有効にして、実際のAPIリクエストを行うようにします。

## デプロイ

GitHubリポジトリとNetlifyを連携することで、自動デプロイが可能です：

1. GitHubにリポジトリをプッシュ
2. Netlifyでサイトを新規作成し、GitHubリポジトリと連携
3. ビルド設定は `netlify.toml` に記載済み

## 今後の拡張可能性

- より多くの質問を追加して精度を向上
- 過去の診断結果の保存と比較機能
- より詳細な統計情報の表示
- ソーシャルメディア共有機能の強化
- 多言語対応

## ライセンス

MIT

---

このプロジェクトは [AI Name] によって作成されました。