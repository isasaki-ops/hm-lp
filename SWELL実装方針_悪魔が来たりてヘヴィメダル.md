# SWELL実装方針｜悪魔が来たりて、ヘヴィメダル LP

> Season1 ミリオンゴッド神堕とし編  
> 対象サイト：WordPress + SWELL テーマ  
> 作成日：2026-03-19

---

## ページ構成（最終版）

| # | セクション | 更新頻度 | 実装方法 |
|---|-----------|---------|---------|
| ① | ヒーローセクション | 固定 | SWELLフルワイドブロック |
| ② | 開催ロードマップ | 固定 | カスタムHTML or SWELLステップブロック |
| ③ | 結果記事リスト（WAVEタブ） | WAVE終了ごと | SWELL投稿リストブロック × 5 |
| ④ | 最後の審判 進出店舗 | WAVE5終了後に公開 | カスタムHTMLブロック（手動更新） |
| ⑤ | バナー広告枠 | 随時 | SWELLグループブロック |
| ⑥ | フッター | 固定 | テキスト＋SNSリンク |

---

## 各セクションの実装詳細

---

### ① ヒーローセクション

**使用ブロック：** SWELL「フルワイドブロック」

- 背景画像：キービジュアル（character + 筐体の合成画像）を設定
- テキストオーバーレイでタイトル・サブタイトルを配置
- 暗めのオーバーレイをかけてテキストを視認しやすくする

```
フルワイドブロック
  └ 背景画像：/image/keyvisual.jpg（または .png）
  └ オーバーレイ：黒 / 不透明度 40〜50%
  └ 中央テキスト：
      「悪魔が来たりて、ヘヴィメダル」（大見出し）
      「season1 ミリオンゴッド神堕とし編」（中見出し）
      「開催期間：5/10 〜 6/14」（本文）
```

**補足：** SWELLのフルワイドブロックは `min-height` 設定でファーストビューをコントロールできます。スマホ表示で文字が小さくならないよう `vw` 単位のフォントサイズ調整を追加CSSで対応するのがおすすめです。

---

### ② 開催ロードマップ

**使用ブロック：** カスタムHTML（推奨）or SWELLステップブロック

WAVE1〜5 → 最後の審判 の流れを横並びで表示。固定コンテンツなのでHTMLで1回作れば以後変更不要です。

```html
<!-- ロードマップ HTML サンプル（カスタムHTMLブロックに貼る） -->
<div class="hm-roadmap">
  <div class="hm-wave">WAVE 1<span>5/10</span></div>
  <div class="hm-arrow">›</div>
  <div class="hm-wave">WAVE 2<span>5/11〜17</span></div>
  <div class="hm-arrow">›</div>
  <div class="hm-wave">WAVE 3<span>5/18〜24</span></div>
  <div class="hm-arrow">›</div>
  <div class="hm-wave">WAVE 4<span>5/25〜31</span></div>
  <div class="hm-arrow">›</div>
  <div class="hm-wave">WAVE 5<span>6/1〜7</span></div>
  <div class="hm-arrow">›</div>
  <div class="hm-wave hm-final">最後の審判<span>6/13〜14</span></div>
</div>
```

スタイルは `子テーマのstyle.css` または SWELLの「追加CSS」に追加します（後述）。

---

### ③ 結果記事リスト（WAVEタブ）

**使用ブロック：** SWELLタブブロック ＋ 投稿リストブロック

#### 記事の準備（投稿側の作業）

各結果記事を通常の「投稿」で作成し、以下のタグを付与：

| WAVE | タグ名 | スラッグ |
|------|--------|---------|
| WAVE 1 | hm-wave1 | hm-wave1 |
| WAVE 2 | hm-wave2 | hm-wave2 |
| WAVE 3 | hm-wave3 | hm-wave3 |
| WAVE 4 | hm-wave4 | hm-wave4 |
| WAVE 5 | hm-wave5 | hm-wave5 |

カテゴリも `heavy-medal`（スラッグ）で統一しておくと管理しやすいです。

#### ブロック構成

```
SWELLタブブロック
  ├ タブ「WAVE 1」
  │   └ SWELL投稿リストブロック
  │       └ 絞り込み：タグ = hm-wave1
  │       └ 表示スタイル：リスト形式（サムネイル＋タイトル）
  ├ タブ「WAVE 2」
  │   └ SWELL投稿リストブロック（タグ：hm-wave2）
  ├ タブ「WAVE 3」
  │   └ SWELL投稿リストブロック（タグ：hm-wave3）
  ├ タブ「WAVE 4」
  │   └ SWELL投稿リストブロック（タグ：hm-wave4）
  └ タブ「WAVE 5」
      └ SWELL投稿リストブロック（タグ：hm-wave5）
```

#### 更新作業（毎WAVE後）

1. 結果記事を「投稿」で作成
2. タグに `hm-wave（番号）` を付与
3. 公開する → **LP側の変更は不要**（自動で引っ張られる）

> ポイント：記事が0件のタブは「記事がありません」と表示されます。WAVE未開催のタブをあらかじめ非表示にしたい場合はCSSで制御するか、タブ自体をWAVE終了後に追加する運用でもOKです。

---

### ④ 最後の審判 進出店舗

**使用ブロック：** カスタムHTMLブロック（手動管理）

#### WAVE5終了まで：非表示状態

SWELLの「表示条件」機能、またはブロックをコメントアウトして非表示にします。

```html
<!-- WAVE5終了まではこのブロックをコメントアウト
<div class="hm-finalists">
  <h2 class="hm-section-title">最後の審判 進出店舗</h2>
  <ul class="hm-hall-list">
    <li>○○ホール</li>
    <li>○○ホール</li>
  </ul>
</div>
-->
```

#### WAVE5終了後：店舗名を入力して公開

```html
<div class="hm-finalists">
  <h2 class="hm-section-title">最後の審判 進出店舗</h2>
  <ul class="hm-hall-list">
    <li>○○ホール（店舗名）</li>
    <li>○○ホール（店舗名）</li>
    <li>○○ホール（店舗名）</li>
    <!-- 各WAVEのTOP5 最大25店舗 -->
  </ul>
</div>
```

ランキング不要のため、シンプルな `<ul>` リストで十分です。

---

### ⑤ バナー広告枠

**使用ブロック：** SWELLグループブロック ＋ メディアブロック（×10枠）

```
グループブロック（グリッドレイアウト：3列）
  ├ 画像ブロック（バナー画像 ＋ リンク設定）
  ├ 画像ブロック
  ├ 画像ブロック
  ├ 画像ブロック
  ├ 画像ブロック
  └ 画像ブロック（追加は末尾に差し込む）
```

**画像サイズ推奨：** 横長バナー `300px × 100px` 程度（比率3:1）を統一しておくと見た目が揃います。

**運用：** バナー追加・差替えはグループブロック内の画像を入れ替えるだけです。セクションタイトルは設けず、バナーを並べるだけのシンプルな見た目にします。

---

### ⑥ フッター

通常のテキストブロックとリンクで対応。

```
・お問い合わせ：サバトエンターテイメント（リンク or テキスト）
・X（旧Twitter）公式アカウントへのリンク
```

---

## 追加CSS（子テーマ or SWELL追加CSS）

以下を `外観 > カスタマイズ > 追加CSS` または子テーマの `style.css` に追加します。

```css
/* ロードマップ */
.hm-roadmap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  justify-content: center;
  padding: 16px 0;
}
.hm-wave {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1a1a1a;
  color: #e8c96a;
  border: 1px solid #5a4a20;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: bold;
  min-width: 70px;
  text-align: center;
}
.hm-wave span {
  font-size: 10px;
  color: #aaa;
  font-weight: normal;
  margin-top: 2px;
}
.hm-wave.hm-final {
  background: #3a0a0a;
  color: #ff6b6b;
  border-color: #8b0000;
}
.hm-arrow {
  color: #666;
  font-size: 18px;
}

/* 進出店舗リスト */
.hm-finalists {
  padding: 24px 16px;
}
.hm-section-title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 16px;
  color: #e8c96a;
}
.hm-hall-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 480px;
  margin: 0 auto;
}
.hm-hall-list li {
  padding: 10px 16px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 14px;
  color: #ccc;
}

/* スマホ対応 */
@media (max-width: 768px) {
  .hm-roadmap {
    gap: 4px;
  }
  .hm-wave {
    min-width: 54px;
    font-size: 10px;
    padding: 6px 8px;
  }
}
```

> 色はサイトの世界観（ダークファンタジー・黒金）に合わせています。実際のキービジュアルの色味を見ながら微調整してください。

---

## 運用フロー（WAVE別の作業まとめ）

```
【各WAVE終了後】
1. 「投稿」で結果記事を作成
2. タグに hm-wave（N） を付与
3. 公開 → 自動でLP③に反映（作業おわり）

【WAVE5終了後】
1. ④ 進出店舗ブロックのコメントアウトを外す
2. 店舗名リストを入力
3. 更新・公開

【最後の審判 終了後】
1. 優勝店舗を⑥フッター近くに追記（任意）
```

---

## Claude Codeでの実装作業フォルダ想定

```
project/
├ image/
│   ├ keyvisual.jpg         ← ヒーロー背景
│   ├ character.png         ← キャラ画像
│   └ banner_hall_XX.png    ← 広告バナー各ホール
├ css/
│   └ hm-lp.css             ← 追加CSS（上記）
└ html/
    ├ section-roadmap.html  ← ②ロードマップ用HTML
    └ section-finalist.html ← ④進出店舗用HTML（コメントアウト版）
```

---

*以上がSWELLでのLP実装方針です。Claude Codeでの作業に入る際は、このドキュメントをプロジェクトフォルダに入れておくと指示出しが楽になります。*
