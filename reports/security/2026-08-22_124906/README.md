# セキュリティ診断レポート

## 概要

OWASP ZAP を使用して、Next.js Sandbox に対する
Webアプリケーションセキュリティ診断を実施した。

- 実施日: 2026-08-22
- ツール: OWASP ZAP 2.17.0
- 対象: Next.js Sandbox（ローカル環境）
- 対象URL: http://host.docker.internal:3000

## 診断結果

### Medium

#### Content Security Policy (CSP) Header Not Set

Content-Security-Policy ヘッダーが設定されていない。

CSPは、読み込みを許可するJavaScript・CSS・画像などの
リソースを制限することで、XSSやデータインジェクションなどの
攻撃を軽減するための仕組み。

**対応候補**

Next.js側で `Content-Security-Policy` ヘッダーを設定する。

---

#### Missing Anti-clickjacking Header

クリックジャッキング対策用のHTTPヘッダーが設定されていない。

外部サイトからiframeなどでページを埋め込まれることを
制限する必要がある。

**対応候補**

以下のいずれかを設定する。

- CSP の `frame-ancestors`
- `X-Frame-Options`

---

### Low

#### Cross-Origin-Embedder-Policy Header Missing or Invalid

`Cross-Origin-Embedder-Policy` が設定されていない。

クロスオリジンリソースの読み込みを制御するための
セキュリティヘッダー。

---

#### Cross-Origin-Opener-Policy Header Missing or Invalid

`Cross-Origin-Opener-Policy` が設定されていない。

異なるオリジンのページ間でブラウジングコンテキストが
共有されることを制御する。

---

#### Cross-Origin-Resource-Policy Header Missing or Invalid

`Cross-Origin-Resource-Policy` が設定されていない。

クロスオリジンからのリソース利用を制御するための
セキュリティヘッダー。

---

#### Permissions Policy Header Not Set

`Permissions-Policy` が設定されていない。

カメラ・マイク・位置情報などのブラウザ機能について、
ページから利用可能な機能を制限できる。

---

#### X-Powered-By Header

レスポンスに以下の情報が含まれている。

`X-Powered-By: Next.js`

利用しているフレームワークを外部に公開するため、
不要であればヘッダーを削除する。

---

#### X-Content-Type-Options Header Missing

`X-Content-Type-Options: nosniff` が設定されていない。

ブラウザによるMIMEタイプ推測を防止するため、
`nosniff` の設定を検討する。

---

#### Dangerous JS Functions

Next.js / Turbopack が生成したJavaScript内で
`eval()` が検出された。

開発環境由来のコードである可能性が高いため、
本番ビルドでも検出されるか確認する。

---

#### Timestamp Disclosure

Next.jsが生成したJavaScript内の数値が
Unix Timestampとして検出された。

フレームワーク生成コードに対する検出であり、
実際に機密情報が含まれているか確認する。

## Informational

認証フォームの検出や、URL内のメールアドレス・
パスワードパラメータなどが報告された。

ZAPによるテストリクエストも含まれているため、
実際のアプリケーション実装と照合して判断する。

## 所感・今後の対応

今回の診断では High リスクの問題は検出されなかった。

一方で、HTTPセキュリティヘッダーを中心に
Medium / Low の改善項目が確認された。

今後は以下を順次検証する。

- CSPの設定
- クリックジャッキング対策
- X-Content-Type-Optionsの設定
- X-Powered-Byの削除
- Permissions Policyの設定
- Cross-Origin系ヘッダーの検討
- 本番ビルドに対する再診断

修正後に再度ZAPを実行し、
診断結果の変化を記録する。
