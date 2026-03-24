/**
 * generate-ogp.js
 * OGP画像生成スクリプト (1200×630px)
 * 実行: node generate-ogp.js
 *
 * ペロリナ画像を変更する場合は CHARA_FILE を書き換えてください。
 *   perorima_01.png 〜 perorima_07.png
 */

const sharp = require('sharp');
const path  = require('path');

const W = 1200;
const H = 630;

// バストアップに適した perorima_03 を使用（顔のアップ構図）
// 変更する場合: perorima_01〜07 を書き換えて再実行
const CHARA_FILE = path.join(__dirname, 'image', 'perorima_03.png');
const OUT_FILE   = path.join(__dirname, 'image', 'ogp.png');

// バストアップ用スケール高さ（OGP高さより大きく設定 → 上半身クロップ効果）
const CHARA_SCALE_H = 950;

async function generate() {

  /* ── 1. ペロリナ画像をバストアップ用に大きくリサイズ ── */
  const charaResized = await sharp(CHARA_FILE)
    .resize({ height: CHARA_SCALE_H, fit: 'inside' })
    .toBuffer();

  const charaMeta = await sharp(charaResized).metadata();
  const cW = charaMeta.width;   // 約 634px (perorima_03: 1366/2048 * 950)

  // 右端配置（右に20px余白 → 少しはみ出させて臨場感を出す）
  const charaLeft = W - cW + 20;
  const charaTop  = 0;

  // sharp composite は canvas 外へのはみ出し不可のため可視領域にクロップ
  const cropW = Math.min(cW, W - charaLeft);   // canvas 右端までの幅
  const cropH = Math.min(CHARA_SCALE_H, H);    // OGP 高さまでクロップ（下部カット＝バストアップ効果）
  const charaFinal = await sharp(charaResized)
    .extract({ left: 0, top: 0, width: cropW, height: cropH })
    .toBuffer();

  /* ── 2. 背景SVG ── */
  const bgSvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 全体背景グラデーション -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#0e0a04"/>
      <stop offset="50%"  stop-color="#09050a"/>
      <stop offset="100%" stop-color="#1a0608"/>
    </linearGradient>
    <!-- 右側クリムゾングロー -->
    <radialGradient id="cr" cx="78%" cy="60%" r="50%">
      <stop offset="0%"   stop-color="#5c0000" stop-opacity="0.50"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <!-- 左側ゴールドグロー -->
    <radialGradient id="gl" cx="20%" cy="38%" r="42%">
      <stop offset="0%"   stop-color="#e8c96a" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <!-- 下部クリムゾン -->
    <radialGradient id="bt" cx="50%" cy="100%" r="60%">
      <stop offset="0%"   stop-color="#3a0008" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#cr)"/>
  <rect width="${W}" height="${H}" fill="url(#gl)"/>
  <rect width="${W}" height="${H}" fill="url(#bt)"/>
  <!-- 斜め帯（サブテクスチャ） -->
  <line x1="180"  y1="0"        x2="760"  y2="${H}"  stroke="rgba(232,201,106,0.025)" stroke-width="80"/>
  <line x1="-40"  y1="180"      x2="480"  y2="${H}"  stroke="rgba(232,201,106,0.015)" stroke-width="50"/>
</svg>`);

  /* ── 3. キャラクター左端フェードSVG ── */
  // バストアップ用：フェードを広め(300px)に取り自然なブレンドにする
  const fadeStartX = Math.max(0, charaLeft - 120);
  const fadeWidth  = 300;

  const fadeSvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#0a0704" stop-opacity="1"/>
      <stop offset="50%"  stop-color="#0a0704" stop-opacity="0.80"/>
      <stop offset="100%" stop-color="#0a0704" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="${fadeStartX}" y="0" width="${fadeWidth}" height="${H}" fill="url(#fade)"/>
</svg>`);

  /* ── 4. テキスト＋装飾SVG ── */
  const textSvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- タイトルグロー -->
    <filter id="titleglow" x="-15%" y="-30%" width="130%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- サブテキストグロー -->
    <filter id="softglow" x="-10%" y="-20%" width="120%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- ===== 外枠 ===== -->
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}"
    fill="none" stroke="rgba(232,201,106,0.20)" stroke-width="1"/>

  <!-- コーナーマーク（左上） -->
  <line x1="22" y1="22" x2="82" y2="22" stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>
  <line x1="22" y1="22" x2="22" y2="82" stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>
  <!-- コーナーマーク（左下） -->
  <line x1="22" y1="${H - 22}" x2="82"      y2="${H - 22}" stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>
  <line x1="22" y1="${H - 22}" x2="22"      y2="${H - 82}" stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>
  <!-- コーナーマーク（右上） -->
  <line x1="${W - 22}" y1="22"       x2="${W - 82}" y2="22"       stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>
  <line x1="${W - 22}" y1="22"       x2="${W - 22}" y2="82"       stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>
  <!-- コーナーマーク（右下） -->
  <line x1="${W - 22}" y1="${H - 22}" x2="${W - 82}" y2="${H - 22}" stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>
  <line x1="${W - 22}" y1="${H - 22}" x2="${W - 22}" y2="${H - 82}" stroke="rgba(232,201,106,0.60)" stroke-width="1.5"/>

  <!-- 縦装飾ライン（テキストエリア左端） -->
  <line x1="52" y1="90" x2="52" y2="${H - 90}"
    stroke="rgba(232,201,106,0.18)" stroke-width="1"/>

  <!-- ===== テキスト ===== -->

  <!-- SEASON ラベル -->
  <text x="66" y="108"
    font-family="Arial, Helvetica, sans-serif"
    font-size="12"
    letter-spacing="7"
    fill="rgba(232,201,106,0.50)">SEASON 1</text>

  <!-- クロス装飾 -->
  <line x1="172" y1="90"  x2="172" y2="118" stroke="rgba(232,201,106,0.35)" stroke-width="1.2"/>
  <line x1="159" y1="104" x2="185" y2="104" stroke="rgba(232,201,106,0.35)" stroke-width="1.2"/>

  <!-- タイトル1行目：悪魔が来たりて、 -->
  <!-- バストアップ版：テキストエリア幅 ~520px に合わせ font-size 60px -->
  <text x="62" y="240"
    font-family="'Yu Gothic', 'YuGothic', 'Meiryo', 'Hiragino Kaku Gothic ProN', 'MS Gothic', sans-serif"
    font-weight="900"
    font-size="60"
    fill="#e8c96a"
    filter="url(#softglow)">悪魔が来たりて、</text>

  <!-- タイトル2行目：ヘヴィメダル（大） -->
  <text x="58" y="358"
    font-family="'Yu Gothic', 'YuGothic', 'Meiryo', 'Hiragino Kaku Gothic ProN', 'MS Gothic', sans-serif"
    font-weight="900"
    font-size="82"
    fill="#e8c96a"
    filter="url(#titleglow)">ヘヴィメダル</text>

  <!-- デコレーションライン -->
  <line x1="60" y1="384" x2="510" y2="384"
    stroke="rgba(232,201,106,0.45)" stroke-width="1"/>
  <!-- ライン上の小ダイヤ -->
  <rect x="281" y="380" width="8" height="8"
    transform="rotate(45 285 384)"
    fill="rgba(232,201,106,0.70)"/>

  <!-- サブタイトル：ミリオンゴッド神堕とし編 -->
  <text x="62" y="432"
    font-family="'Yu Gothic', 'YuGothic', 'Meiryo', 'Hiragino Kaku Gothic ProN', 'MS Gothic', sans-serif"
    font-size="20"
    fill="rgba(232,201,106,0.70)">ミリオンゴッド神堕とし編</text>

  <!-- キャッチコピー -->
  <text x="64" y="472"
    font-family="'Yu Gothic', 'YuGothic', 'Meiryo', sans-serif"
    font-size="14"
    fill="rgba(232,201,106,0.38)">兎味ペロリナ vs ヨハネの黙示録 4騎士団</text>

  <!-- 開催期間 -->
  <text x="64" y="555"
    font-family="Arial, Helvetica, sans-serif"
    font-size="14"
    letter-spacing="3"
    fill="rgba(232,201,106,0.35)">2025.5.10 — 6.14</text>

</svg>`);

  /* ── 5. 合成 ── */
  await sharp(bgSvg)
    .flatten({ background: { r: 10, g: 7, b: 4 } })  // 万一の透明部を潰す
    .composite([
      { input: charaFinal,   left: charaLeft, top: charaTop, blend: 'over' },
      { input: fadeSvg,      left: 0,         top: 0,        blend: 'over' },
      { input: textSvg,      left: 0,         top: 0,        blend: 'over' },
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUT_FILE);

  console.log('');
  console.log('✓ OGP画像を生成しました');
  console.log('  出力先: ' + OUT_FILE);
  console.log('  サイズ: ' + W + ' x ' + H + ' px');
  console.log('  使用画像: perorima_03.png (バストアップ ' + cW + 'x' + CHARA_SCALE_H + 'px → 上半身クロップ)');
  console.log('');
  console.log('ペロリナ画像を変更する場合は');
  console.log('  CHARA_FILE の perorima_01.png を 01〜07 で書き換えて再実行してください。');
  console.log('');
}

generate().catch(function(err) {
  console.error('エラー:', err.message);
  process.exit(1);
});
