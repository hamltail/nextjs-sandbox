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

`Content-Security-Policy` ヘッダーが設定されていない。

CSPは、読み込みを許可するJavaScript・CSS・画像などの
リソースを制限することで、XSSやデータインジェクションなどの
攻撃を軽減するための仕組み。

---

#### Missing Anti-clickjacking Header

クリックジャッキング対策用のHTTPヘッダーが設定されていない。

外部サイトからiframeなどでページを埋め込まれることを
制限する必要がある。

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

#### Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)

レスポンスに以下の情報が含まれている。

`X-Powered-By: Next.js`

利用しているフレームワークに関する情報が
HTTPレスポンスヘッダーから公開されている。

---

#### X-Content-Type-Options Header Missing

`X-Content-Type-Options: nosniff` が設定されていない。

ブラウザによるMIMEタイプ推測を防止するための
セキュリティヘッダーが不足している。

---

#### Dangerous JS Functions

Next.js / Turbopack が生成したJavaScript内で
`eval()` が検出された。

開発環境で生成されたコードが検出対象となっている。

---

#### Timestamp Disclosure - Unix

Next.jsが生成したJavaScript内の数値が
Unix Timestampとして検出された。

フレームワーク生成コード内の値が検出対象となっている。

## Informational

以下のInformational Alertが検出された。

- Authentication Request Identified
- Information Disclosure - Sensitive Information in URL
- Information Disclosure - Suspicious Comments
- Storable but Non-Cacheable Content

認証フォームの検出や、URL内のメールアドレス・
パスワードパラメータなどが報告された。

ZAPによるテストリクエストやNext.jsが生成したJavaScriptも
検出対象に含まれているため、実際のアプリケーション実装と
照合して判断する必要がある。

## 診断結果の分類

ZAPの検出結果について、現時点で以下の3種類に分類する。

### 修正対象

- Content Security Policy (CSP) Header Not Set
- Missing Anti-clickjacking Header
- Permissions Policy Header Not Set
- Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)
- X-Content-Type-Options Header Missing

HTTPレスポンスヘッダーに関する指摘。

アプリケーション側で設定可能か確認し、別PRで対応する。

CSPについては、`frame-ancestors` を設定することで
クリックジャッキング対策もあわせて行えるか検討する。

### 追加確認

- Cross-Origin-Embedder-Policy Header Missing or Invalid
- Cross-Origin-Opener-Policy Header Missing or Invalid
- Cross-Origin-Resource-Policy Header Missing or Invalid
- Information Disclosure - Sensitive Information in URL

Cross-Origin系ヘッダーは、アプリケーションの構成や
外部リソースとの連携への影響を確認した上で対応を判断する。

Sensitive Information in URLについては、
ZAPが生成した以下のようなGETリクエストによる検出が含まれている。

`/login?email=zaproxy@example.com&password=ZAP`

実際のログイン・サインアップ処理が
機密情報をURLに含めていないか、実装と照合する。

### 開発環境由来・誤検知候補

- Dangerous JS Functions
- Timestamp Disclosure - Unix
- Information Disclosure - Suspicious Comments
- Storable but Non-Cacheable Content
- Authentication Request Identified

Dangerous JS Functionsでは、Next.js / Turbopackが生成した
JavaScript内の `eval()` が検出されている。

Timestamp DisclosureやSuspicious Commentsについても、
Next.jsが生成したJavaScriptが主な検出対象となっている。

Storable but Non-Cacheable Contentについても、
開発環境におけるキャッシュ制御が影響している可能性がある。

本番ビルドに対して再診断し、
開発環境固有の検出かどうか確認する。

Authentication Request Identifiedは、
ZAP自身も脆弱性ではないInformational Alertとして扱っている。

## 今後の対応

今回の診断では High リスクの問題は検出されなかった。

HTTPセキュリティヘッダーを中心に、
Medium / Low の改善候補が確認された。

今後は以下を実施する。

- 修正対象として分類したセキュリティヘッダーを対応する
- 追加確認項目をアプリケーション実装と照合する
- 本番ビルドに対してZAPを再実行する
- 修正後に再診断を実施する
- 診断結果の変化を新しいレポートとして記録する

このレポートは初回診断時点の記録として保持し、
修正後の診断結果は別ディレクトリに保存する。
