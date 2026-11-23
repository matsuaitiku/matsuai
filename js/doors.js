/* =========================================================
   doors.js:蔵の扉ページ
   1. 蔵をクリック → 扉が開く(.open を付ける)
   2. 少し待って、蔵の中のページを表示(.show を付ける)
   3. 「蔵を出る」で元に戻す
   ========================================================= */

const back = document.getElementById("back");
let current = null;   // いま開いている蔵

function openKura(kura) {
  if (current) return;
  current = kura;
  kura.classList.add("open");
  document.body.classList.add("inside");

  const room = document.getElementById("room-" + kura.dataset.room);
  setTimeout(() => {
    room.classList.add("show");
    back.classList.add("show");
  }, 1200);   // 扉が開ききるのを待つ(CSSの transition の時間と合わせる)

  // TODO:扉の位置から光が広がる演出をここに入れる
}

function closeKura() {
  if (!current) return;
  document.querySelectorAll(".room.show").forEach((r) => r.classList.remove("show"));
  back.classList.remove("show");
  const kura = current;
  setTimeout(() => {
    kura.classList.remove("open");
    document.body.classList.remove("inside");
    current = null;
  }, 600);
}

document.querySelectorAll(".kura").forEach((kura) => {
  kura.addEventListener("click", () => openKura(kura));
});
back.addEventListener("click", closeKura);

// トップのメニューから doors.html#food のように来たら、その蔵を開く
const start = document.querySelector(`.kura[data-room="${location.hash.slice(1)}"]`);
if (start) openKura(start);
