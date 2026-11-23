/* =========================================================
   top.js:漆喰を塗るトップページ

   しくみ(骨組みだけ。TODO のところを自分で作っていく)
   1. 画面いっぱいに「土壁」を描く          → drawEarth()
   2. 別のキャンバスに「漆喰の壁」を用意する → makePlaster()
   3. なぞった線の形で、漆喰の壁を写す       → paint()
   4. ある程度塗ったら、中身を表示する       → finish()

   ヒント:本物の土壁・漆喰の写真が撮れたら、
   drawEarth / makePlaster で写真を drawImage するだけでもよい
   ========================================================= */

const canvas = document.getElementById("wall");
const ctx = canvas.getContext("2d");
const guide = document.getElementById("guide");
const skipBtn = document.getElementById("skip");
const content = document.getElementById("content");

let W, H;
let plaster;          // 漆喰の壁(見えないキャンバス)
let last = null;      // 前回なぞった位置
let strokeCount = 0;  // 塗った回数(仮の「どれだけ塗ったか」)
let finished = false;

// ---------- 1. 土壁を描く ----------
function drawEarth() {
  // いまは単色。TODO:ざらざら感、藁(わら)、写真など
  ctx.fillStyle = "#806042";
  ctx.fillRect(0, 0, W, H);
}

// ---------- 2. 漆喰の壁を用意する ----------
function makePlaster() {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#f2eee6";
  g.fillRect(0, 0, W, H);
  // TODO:壁に浮かび上がる言葉(縦書き)を描く
  //   g.font = '24px "Noto Serif JP"';
  //   g.fillText("八", x, y); を1文字ずつ下にずらしていくと縦書きになる
  return c;
}

// ---------- 3. 塗る ----------
function paint(x, y) {
  const from = last || { x, y };
  // 漆喰の壁を「絵の具」にして線を引く → 塗ったところだけ漆喰が見える
  ctx.strokeStyle = ctx.createPattern(plaster, "no-repeat");
  ctx.lineWidth = 100;          // コテの幅。TODO:画面サイズに合わせる
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(x + 0.01, y);
  ctx.stroke();
  last = { x, y };

  // TODO:「どれだけ塗ったか」をちゃんと数える(画面をマス目に分けて数える方法がおすすめ)
  strokeCount++;
  if (!finished && strokeCount > 150) finish();
}

// ---------- 4. 仕上げ ----------
function finish() {
  finished = true;
  ctx.drawImage(plaster, 0, 0);   // TODO:ふわっと白くなるアニメーションにする
  skipBtn.classList.add("hide");
  guide.classList.add("hide");
  content.classList.add("show");
}

// ---------- 操作 ----------
let down = false;
canvas.addEventListener("pointerdown", (e) => {
  down = true;
  last = null;
  guide.classList.add("hide");
  paint(e.clientX, e.clientY);
});
canvas.addEventListener("pointermove", (e) => {
  if (down && !finished) paint(e.clientX, e.clientY);
});
window.addEventListener("pointerup", () => { down = false; last = null; });
skipBtn.addEventListener("click", finish);

// ---------- 準備 ----------
function setup() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  drawEarth();
  plaster = makePlaster();
}
setup();
// TODO:画面サイズが変わったとき(resize)の対応
