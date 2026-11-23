/* =========================================================
   street.js:360度で通りを歩くページ

   ★写真を差し替えるだけで本物になる★
   1. 360度写真を images/360/ に入れる
   2. 下の SCENES の panorama にファイル名を書く
   3. 目印(hotSpots)の pitch(上下)と yaw(左右)を調整する

   pitch / yaw の調べ方:
   ページを開いて、写真の上で「Ctrlキー + クリック」すると、
   その場所の pitch と yaw がブラウザのコンソール(F12)に表示される
   ========================================================= */

/* ---------- 商品(本物の情報に書き換える) ---------- */
const PRODUCTS = {
  koikuchi: {
    name: "濃口醤油(仮)",
    image: "images/photos/koikuchi.jpg",   // 商品の写真(撮ったら入れる)
    text: "蔵で寝かせた、昔ながらの濃口醤油。",
    price: "¥ ---",
  },
  // TODO:商品を増やす
};

/* ---------- お品書き ---------- */
const MENU = [
  ["焼き魚定食", "¥ ---"],
  ["海鮮丼", "¥ ---"],
  // TODO:お店の本物のメニューに書き換える
];

/* ---------- 目印を作る関数 ---------- */
// pitch・yaw:目印の位置 / label:ラベルの文字 / onClick:押したときの動き / cls:見た目の種類
function spot(pitch, yaw, label, onClick, cls = "") {
  return {
    pitch,
    yaw,
    cssClass: "hs " + cls,
    createTooltipFunc: (div) => {
      const s = document.createElement("span");
      s.textContent = label;
      div.appendChild(s);
    },
    clickHandlerFunc: onClick,
  };
}
// 別の場面へ移動する(yaw:移動したあとに向く方向)
const go = (sceneId, yaw = 0) => () => viewer.loadScene(sceneId, 0, yaw);

/* ---------- 場面(シーン)の一覧 ----------
   場面を増やすときは、同じ形で足して、どこかの目印から go("名前") でつなぐ */
const NAMES = {
  street1: "松合の通り",
  street2: "松合の通り(奥)",
  shop: "松合醤油蔵",
};

const SCENES = {
  street1: {
    type: "equirectangular",
    panorama: "images/360/street-01.jpg",
    hotSpots: [
      spot(-20, 0, "通りを進む", go("street2"), "walk"),
      spot(-5, 30, "醤油蔵に入る", go("shop")),
    ],
  },
  street2: {
    type: "equirectangular",
    panorama: "images/360/street-02.jpg",
    hotSpots: [
      spot(-20, 180, "戻る", go("street1", 180), "walk"),
      // TODO:食事処などの入口
    ],
  },
  shop: {
    type: "equirectangular",
    panorama: "images/360/shop-01.jpg",
    hotSpots: [
      spot(0, -20, "濃口醤油", () => showProduct("koikuchi")),
      spot(-5, 120, "お品書き(例)", showMenu),
      spot(-10, 180, "通りに出る", go("street1", 30)),
    ],
  },
};

/* ---------- 360度ビューアを起動 ---------- */
const viewer = pannellum.viewer("pano", {
  default: {
    firstScene: "street1",
    sceneFadeDuration: 900,   // 場面が切り替わるときのフェード(ミリ秒)
    autoLoad: true,
    showControls: false,
    hotSpotDebug: true,       // Ctrl+クリックで pitch/yaw を表示。完成したら false に
  },
  scenes: SCENES,
});

viewer.on("scenechange", (id) => {
  document.getElementById("place").textContent = NAMES[id];
});

/* ---------- 商品・お品書きのウィンドウ ---------- */
const modal = document.getElementById("modal");

function openModal(html) {
  document.getElementById("modal-body").innerHTML = html;
  modal.classList.add("show");
}
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.closest(".close")) modal.classList.remove("show");
});

function showProduct(id) {
  const p = PRODUCTS[id];
  openModal(`
    <img src="${p.image}" alt="${p.name}" onerror="this.remove()">
    <h3>${p.name}</h3>
    <p>${p.text}</p>
    <p>価格 ${p.price}</p>
  `);
}

function showMenu() {
  const rows = MENU.map(([name, price]) => `<li><span>${name}</span><span>${price}</span></li>`).join("");
  openModal(`<h3>お品書き</h3><ul class="menu">${rows}</ul>`);
}

/* TODO:食事処の「席に座る」→ 料理が運ばれてくる演出
   (座った目線で撮った動画を <video> で全画面に流すのがおすすめ) */
