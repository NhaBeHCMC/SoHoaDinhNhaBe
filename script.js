// ===== CẤU HÌNH =====
const IMG_WIDTH = 2000;
const IMG_HEIGHT = 1600;
const OPTIMIZED_ROOT = "optimized";

function optimizedImageSrc(src, type) {
  if (src.startsWith(`${OPTIMIZED_ROOT}/`)) {
    return src;
  }

  return `${OPTIMIZED_ROOT}/${type}/${src.replace(/\.[^.]+$/, ".jpg")}`;
}

function fallbackToOriginal(img, originalSrc) {
  img.onerror = () => {
    img.onerror = null;
    img.src = optimizedImageSrc(originalSrc, "viewer");
  };
  img.src = optimizedImageSrc(originalSrc, "large");
}

function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

// ===== TẠO MAP =====
var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  zoomControl: false
});

// Hệ tọa độ 0 → 1 (QUAN TRỌNG)
var bounds = [[0, 0], [1600, 2000]];

// Ảnh nền đã nén nhẹ để tải nhanh hơn khi vào trang
L.imageOverlay('optimized/map.jpg', bounds, {
  errorOverlayUrl: 'map.png'
}).addTo(map);
map.fitBounds(bounds);
map.setMaxBounds(bounds);
L.control.zoom({
  position: 'bottomleft'
}).addTo(map);

// ===== HÀM THÊM MARKER TỪ PX =====

//Chức năng phóng to ảnh, có hỗ trợ chuyển ảnh trước/sau trong cùng gallery
function openImage(src, gallery = [src]) {
  const overlay = document.createElement("div");
  let currentIndex = Math.max(0, gallery.indexOf(src));
  let touchStartX = 0;
  let touchStartY = 0;

  overlay.style = `
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background: rgba(0,0,0,0.85);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:9999;
  `;

  overlay.innerHTML = `
    <div class="image-viewer" style="
      position:relative;
      width:100%;
      height:100%;
      display:flex;
      justify-content:center;
      align-items:center;
      padding:54px 72px;
      box-sizing:border-box;
    ">
      <button type="button" class="viewer-close" aria-label="Đóng ảnh" style="
        position:absolute;
        top:16px;
        right:18px;
        background:white;
        color:#8b0000;
        border:0;
        width:42px;
        height:42px;
        border-radius:50%;
        display:flex;
        justify-content:center;
        align-items:center;
        cursor:pointer;
        font-size:30px;
        font-weight:bold;
        line-height:1;
        box-shadow:0 6px 18px rgba(0,0,0,.3);
      ">×</button>

      <button type="button" class="viewer-prev" aria-label="Ảnh trước" style="
        position:absolute;
        left:18px;
        top:50%;
        transform:translateY(-50%);
        background:rgba(255,255,255,.92);
        color:#8b0000;
        border:0;
        width:48px;
        height:48px;
        border-radius:50%;
        display:flex;
        justify-content:center;
        align-items:center;
        cursor:pointer;
        font-size:34px;
        line-height:1;
        box-shadow:0 6px 18px rgba(0,0,0,.3);
      ">‹</button>

      <img class="viewer-image" alt="" style="
        max-width:100%;
        max-height:100%;
        border-radius:12px;
        object-fit:contain;
        box-shadow:0 12px 40px rgba(0,0,0,.45);
        user-select:none;
        -webkit-user-drag:none;
      ">

      <button type="button" class="viewer-next" aria-label="Ảnh sau" style="
        position:absolute;
        right:18px;
        top:50%;
        transform:translateY(-50%);
        background:rgba(255,255,255,.92);
        color:#8b0000;
        border:0;
        width:48px;
        height:48px;
        border-radius:50%;
        display:flex;
        justify-content:center;
        align-items:center;
        cursor:pointer;
        font-size:34px;
        line-height:1;
        box-shadow:0 6px 18px rgba(0,0,0,.3);
      ">›</button>

      <div class="viewer-count" style="
        position:absolute;
        left:50%;
        bottom:18px;
        transform:translateX(-50%);
        background:rgba(0,0,0,.62);
        color:white;
        padding:6px 12px;
        border-radius:999px;
        font-family:sans-serif;
        font-size:14px;
      "></div>
    </div>
  `;

  const image = overlay.querySelector(".viewer-image");
  const prevBtn = overlay.querySelector(".viewer-prev");
  const nextBtn = overlay.querySelector(".viewer-next");
  const count = overlay.querySelector(".viewer-count");
  const closeBtn = overlay.querySelector(".viewer-close");

  function showViewerImage(index) {
    currentIndex = (index + gallery.length) % gallery.length;
    const currentSrc = gallery[currentIndex];
    image.onerror = () => {
      image.onerror = () => fallbackToOriginal(image, currentSrc);
      image.src = optimizedImageSrc(currentSrc, "large");
    };
    image.src = optimizedImageSrc(currentSrc, "viewer");
    count.innerText = `${currentIndex + 1} / ${gallery.length}`;

    const hasManyImages = gallery.length > 1;
    prevBtn.style.display = hasManyImages ? "flex" : "none";
    nextBtn.style.display = hasManyImages ? "flex" : "none";
    count.style.display = hasManyImages ? "block" : "none";

    if (hasManyImages) {
      const previousSrc = gallery[(currentIndex - 1 + gallery.length) % gallery.length];
      const nextSrc = gallery[(currentIndex + 1) % gallery.length];
      preloadImage(optimizedImageSrc(previousSrc, "viewer"));
      preloadImage(optimizedImageSrc(nextSrc, "viewer"));
    }
  }

  function showPreviousImage() {
    showViewerImage(currentIndex - 1);
  }

  function showNextImage() {
    showViewerImage(currentIndex + 1);
  }

  function closeViewer() {
    document.removeEventListener("keydown", handleViewerKeydown);
    overlay.remove();
  }

  function handleViewerKeydown(e) {
    if (e.key === "Escape") {
      closeViewer();
    } else if (e.key === "ArrowLeft" && gallery.length > 1) {
      showPreviousImage();
    } else if (e.key === "ArrowRight" && gallery.length > 1) {
      showNextImage();
    }
  }

  // Click nền để đóng
  overlay.onclick = (e) => {
    if (e.target === overlay || e.target.classList.contains("image-viewer")) {
      closeViewer();
    }
  };

  // Ngăn click vào ảnh bị đóng
  image.onclick = (e) => e.stopPropagation();

  // Click nút X để đóng
  closeBtn.onclick = closeViewer;
  prevBtn.onclick = (e) => {
    e.stopPropagation();
    showPreviousImage();
  };
  nextBtn.onclick = (e) => {
    e.stopPropagation();
    showNextImage();
  };

  overlay.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  overlay.addEventListener("touchend", (e) => {
    if (gallery.length <= 1) {
      return;
    }

    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX > 0) {
        showPreviousImage();
      } else {
        showNextImage();
      }
    }
  }, { passive: true });

  showViewerImage(currentIndex);
  document.addEventListener("keydown", handleViewerKeydown);

  document.body.appendChild(overlay);
}

// Nội dung có hình ảnh bên cạnh dạng grid và click phóng to
function addMarkerPx(x, y, title, desc, images) {
  const lat = y / IMG_HEIGHT;
  const lng = x / IMG_WIDTH;

  let imageHtml = "";

  // chỉ tạo gallery nếu có ảnh
  if (images.length > 0) {

    imageHtml = `
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:6px;
      ">
        ${images.map((img, index) => `
          <img src="${optimizedImageSrc(img, "thumbs")}" 
               loading="lazy"
               decoding="async"
               onerror="fallbackToOriginal(this, '${img}')"
               onclick='openImage("${img}", ${JSON.stringify(images)}, ${index})'
               style="
                  width:100%;
                  height:100px;
                  object-fit:cover;
                  border-radius:8px;
                  cursor:pointer;
               ">
        `).join("")}
      </div>
    `;

  }

  const popupContent = `
    <div style="width:350px; max-height:400px; overflow-y:auto">
      <b>${title}</b><br><br>
      ${imageHtml}
      <p>${desc}</p>
    </div>
  `;

  L.marker([lat, lng]).addTo(map)
    .on("click", function () {
      openDetail(title, desc, images);
    });
  /*
    const imageHtml = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
        ${images.map(img => `
          <img src="${img}" 
               onclick="openImage('${img}')"
               style="
                 width:100%;
                 height:100px;
                 object-fit:cover;
                 border-radius:8px;
                 cursor:pointer;
               ">
        `).join("")}
      </div>
    `;
  
    const popupContent = `
      <div style="width:350px; max-height:400px; overflow-y:auto">
        <b>${title}</b><br><br>
        ${imageHtml}
        <p>${desc}</p>
      </div>
    `;
  
    L.marker([lat, lng]).addTo(map)
      .on("click", function () {
        openDetail(title, desc, images);
      });*/

  /*
  L.marker([lat, lng]).addTo(map)
    .bindPopup(popupContent, { maxWidth: 900, minWidth: 300 });
  */
}


// Mở modal
function openDetail(title, desc, images = []) {

  map.dragging.disable();
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();

  const detailModal = document.getElementById("detailModal");
  detailModal.style.display = "flex";
  detailModal.querySelector(".modal-body").scrollTop = 0;

  document.getElementById("modalTitle").innerText = title;

  // Tab thông tin
  document.getElementById("tab-info").innerHTML = desc;


  const imageTabBtn = document.getElementById("btn-images");
  const imageTab = document.getElementById("tab-images");




  if (images.length > 0) {

    // hiện tab hình ảnh
    imageTabBtn.style.display = "block";

    imageTab.innerHTML =
      images.map((img, index) => `
        <img src="${optimizedImageSrc(img, "thumbs")}"
             loading="lazy"
             decoding="async"
             onerror="fallbackToOriginal(this, '${img}')"
             onclick='openImage("${img}", ${JSON.stringify(images)}, ${index})'
             style="
                width:100%;
                margin:8px 0;
                border-radius:10px;
                cursor:pointer;
             ">
      `).join("");

  } else {

    // ẨN tab hình ảnh nếu không có ảnh
    imageTabBtn.style.display = "none";

    imageTab.innerHTML = "";
  }

  // mặc định mở tab thông tin
  showTab("info");

  setTimeout(() => {

    const modal = document.querySelector('.modal-content');

    if (modal) {

      modal.addEventListener('touchstart', e => {
        e.stopPropagation();
      }, { passive: true });

      modal.addEventListener('touchmove', e => {
        e.stopPropagation();
      }, { passive: true });

    }

  }, 100);
}

// Đóng
function closeModal() {
  map.dragging.enable();
  map.touchZoom.enable();
  map.scrollWheelZoom.enable();
  document.getElementById("detailModal").style.display = "none";
}

// Chuyển tab
function showTab(tab) {
  // Ẩn nội dung
  document.getElementById("tab-info").style.display = "none";
  document.getElementById("tab-images").style.display = "none";

  // Hiện nội dung được chọn
  document.getElementById("tab-" + tab).style.display = "block";

  // Xóa active tất cả nút
  document.getElementById("btn-info").classList.remove("active");
  document.getElementById("btn-images").classList.remove("active");

  // Thêm active cho nút đang chọn
  document.getElementById("btn-" + tab).classList.add("active");
}

// ===== CLICK ĐỂ TẠO MARKER =====
/*
map.on('click', function(e) {
  const name = prompt("Nhập tên vị trí:");
  if (!name) return;

  const desc = prompt("Nhập mô tả:");

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  // Tạo marker
  L.marker([lat, lng]).addTo(map)
    .bindPopup(`<b>${name}</b><br>${desc}`);

  // Đổi ra pixel
  const x = Math.round(lng * IMG_WIDTH);
  const y = Math.round(lat * IMG_HEIGHT);

  // In ra console để lưu lại
  console.log(`
addMarkerPx(${x}, ${y}, "${name}", "${desc}");
`);
});
*/

// 20/4/26
// ===== PHẦN BỔ SUNG CHO MENU HAMBURGER GÓC TRÊN PHẢI ======
// =========================================================

//Dữ liệu thông tin tiểu sử đình
const thongTinDinhThan = `
  <h4 style="margin-top: 0; font-size: 18px; color: #8b0000;">1. Lịch sử hình thành và Vị trí</h4>
  <p style="font-size: 15px; line-height: 1.6; text-align: justify;">
    <b>Đình Phú Xuân</b> là một trong các danh thắng nổi tiếng tại Nhà Bè, được thành lập vào năm Canh Tý (1900). Tính đến nay, đình đã có tuổi đời hơn 100 năm. Đình tọa lạc trên một khuôn viên rộng khoảng 770m2, nằm bình yên bên dòng Rạch Đôi với nhiều cây xanh lâu năm rợp bóng mát.
  </p>

  <h4 style="color: #8b0000; font-size: 18px;">2. Giá trị Kiến trúc</h4>
  <p style="font-size: 15px; line-height: 1.6; text-align: justify;">
    Trải qua hơn một thế kỷ, Đình Phú Xuân không chỉ là cơ sở tín ngưỡng dân gian mà còn là nơi lưu giữ những giá trị kiến trúc tiêu biểu của Đình làng Nam Bộ. Phía trước đình là cổng Tam quan kiên cố bằng bê tông cốt thép, phía trên đắp nổi ba chữ “Đình Phú Xuân” bằng gốm tinh xảo. Về mặt kiến trúc, đình được cấu trúc theo trục dọc, bao gồm hai khối nhà chính là Tiền điện và Chính điện nối liền với nhau.
  </p>

  <h4 style="color: #8b0000; font-size: 18px;">3. Các Lễ hội thường niên</h4>
  <p style="font-size: 15px; line-height: 1.6; text-align: justify;">
    Hằng năm, đình là nơi quy tụ bá tánh thập phương về dâng lễ để tưởng nhớ các bậc tiền hiền đã có công khai phá lập làng. Các dịp lễ chính bao gồm:
  </p>
  <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px;">
    <li><b>Lễ Kỳ Yên (16/02 Âm lịch):</b> Lễ cầu an lớn nhất trong năm.</li>
    <li><b>Lễ Cầu Bông (16/10 Âm lịch):</b> Cầu mưa thuận gió hòa, mùa màng bội thu, quốc thái dân an.</li>
    <li><b>Các tiểu lễ khác:</b> Cúng rằm (15/1 và 16/7), Tết Đoan Ngọ (5/5 Âm lịch), Lễ đưa Thần (25 và 30 tháng Chạp).</li>
  </ul>
`;

//Danh sách link ảnh hoạt động (Thay bằng link ảnh thật của bạn)
const hinhAnhHoatDong = [];
const soLuongAnhHD = 30;

// Tự động thêm link ảnh từ 1 đến i vào mảng
for (let i = 1; i <= soLuongAnhHD; i++) {
  hinhAnhHoatDong.push(`AnhHoatDong/AnhHoatDong (${i}).jpg`);
}

const hinhAnhDinhThan = [];
const soLuongAnh = 29;

// Tự động thêm link ảnh từ 1 đến i vào mảng
for (let i = 1; i <= soLuongAnh; i++) {
  hinhAnhDinhThan.push(`AnhDinh/dinh (${i}).JPG`);
}
;
//Bật/tắt menu xổ xuống khi click vào nút Hamburger
function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}

//Mở Modal hiển thị thông tin từ Menu
function openTopMenu(type) {
  // Hiện modal
  document.getElementById("topMenuModal").style.display = "flex";

  const title = document.getElementById("menuModalTitle");
  const body = document.getElementById("menuModalBody");

  if (type === 'info') {
    title.innerText = "Thông Tin Tiểu Sử Đình Thần";
    body.innerHTML = thongTinDinhThan;
  }
  else if (type === 'activities') {
    title.innerText = "Hình Ảnh Các Hoạt Động";

    // Tạo lưới ảnh và tái sử dụng hàm openImage() cũ của bạn để click phóng to
    const htmlAnh = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 15px;">
        ${hinhAnhHoatDong.map((img, index) => `
          <img src="${optimizedImageSrc(img, "thumbs")}" 
               loading="lazy" 
               decoding="async"
               onerror="fallbackToOriginal(this, '${img}')"
               onclick="openImage(hinhAnhHoatDong[${index}], hinhAnhHoatDong)" 
               title="Click để phóng to" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;">
        `).join("")}
      </div>
    `;
    body.innerHTML = htmlAnh;
  }
  else if (type === 'temple_images') {
    title.innerText = "Hình Ảnh Đình Thần";

    // Tái sử dụng giao diện lưới ảnh giống hệt phần Hoạt động
    const htmlAnh = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 15px;">
        ${hinhAnhDinhThan.map((img, index) => `
          <img src="${optimizedImageSrc(img, "thumbs")}" 
               loading="lazy" 
               decoding="async"
               onerror="fallbackToOriginal(this, '${img}')"
               onclick="openImage(hinhAnhDinhThan[${index}], hinhAnhDinhThan)" 
               title="Click để phóng to" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;">
        `).join("")}
      </div>
    `;
    body.innerHTML = htmlAnh;
  }
}

function fitMap() {

  map.invalidateSize();

  if (window.innerWidth < 768) {

    map.fitBounds(bounds, {
      paddingTopLeft: [25, 95],
      paddingBottomRight: [25, 90]
    });

  }
  else if (window.innerWidth <= 1024) {

    map.fitBounds(bounds, {
      padding: [45, 45]
    });

  }
  else {

    map.fitBounds(bounds, {
      padding: [35, 35]
    });

  }

}

window.addEventListener("load", fitMap);
window.addEventListener("resize", fitMap);

//Đóng Modal của Menu
function closeTopMenu() {
  document.getElementById("topMenuModal").style.display = "none";
}

//Đóng Modal khi click ra ngoài khoảng xám
document.getElementById("topMenuModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeTopMenu();
  }
});

document.getElementById("detailModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (document.getElementById("detailModal").style.display === "flex") {
      closeModal();
    }

    if (document.getElementById("topMenuModal").style.display === "flex") {
      closeTopMenu();
    }
  }
});

//Tự động đóng menu xổ xuống nếu người dùng click ra ngoài khu vực menu
window.onclick = function (event) {
  if (!event.target.closest('.menu-container')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
// Ngăn bản đồ Leaflet "cướp" thao tác cuộn chuột khi lướt xem ảnh trong Menu Modal
document.getElementById("topMenuModal").addEventListener("wheel", function (event) {
  event.stopPropagation();
});
//20/4/26
// =========================================================

// ===== DỮ LIỆU CỐ ĐỊNH (dán vào đây sau này) =====
addMarkerPx(1429000, 1772800, "Chính điện", "- Tên hiện vật: Chính điện đình Phú Xuân<br>- Niên đại: Đầu thế kỷ XX<br>- Chất liệu: Gỗ, bê-tông cốt thép, gạch men, ngói âm dương<br>- Vị trí: Giáp với tiền điện đình Phú Xuân<br>- Miêu tả hiện vật: Cửa vào chính điện đình là cửa gỗ kiểu thượng song hạ bản, gồm một cửa chính, bốn cánh mở vào và hai cửa phụ. Cửa chính chỉ được mở vào các ngày đại lễ trong năm (16 tháng 2, 16 tháng 10 âm lịch).<br>Hai bên cột cửa đắp nổi đôi câu đối chữ Hán:<br>富 仰 聖 恩 大 小 咸 敷 惠 澤<br>春 霑 神 德 邇 遐 共 樂 遺 靈<br>Phiên âm:<br>Phú ngưỡng thánh ân, đại tiểu hàm phu huệ trạch<br>Xuân triêm thần đức, nhĩ hà cộng lạc di linh.<br>Phiên nghĩa:<br>Dân Phú Xuân ngưỡng vọng thánh ân, lớn nhỏ đều nhờ huệ trạch<br>Người Phú Xuân thắm nhuần thần đức, xa gần vui bởi linh thiêng.<br>Chính điện có cùng kết cấu kiến trúc với tiền điện nhưng bề thế và vững chắc hơn. Tứ trụ là bốn cột gỗ vuông cạnh 25cm, hệ thống vì kèo, đòn tay, rui bằng gỗ; các thanh xà ngang và cây trống được đẽo gọt tạo dáng mỹ thuật, còn lại là hệ thống cột bê tông cốt thép, nền lát gạch men.<br>Mái lợp ngói âm dương, nóc mái trang trí lưỡng long triều nguyệt.<br>- Giá trị hiện vật: Các bàn thờ ở chính điện đình Phú Xuân được bày trí đăng đối nhau, giữa các bàn thờ trang trí các bức chân, màn nhung đỏ thẫm thêu rồng phượng, tạo nên vẻ nghiêm trang, cổ kính nơi thờ tự.", ["AnhCacBanTho/CHINHDIEN.JPG"]);
addMarkerPx(987000, 1822400, "Hữu Ban", "- Tên hiện vật: Bài vị 'Hữu Ban'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 165, ngang: 143, cao chân đế: 25, ngang chân đế: 120, sâu chân đế: 26<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Hữu Ban, sơn son thếp vàng, trang trí nổi dây lá, ở giữa đề chữ Hán, hai bên chạm chìm câu đối chữ Hán: <br>佑 班 列 位 <br> 胤 生 香 裡 祥 雲 合 <br> 花 照 燈 前 瑞 色 明 <br> Phiên âm: <br> Hữu ban liệt vị. <br> Yên sanh hương lý, tường vân hiệp <br> Hoa chiếu đăng tiền, thoại sắc minh. <br> (Khói tỏa từ tỏng hương, như đám mây lành tụ hội <br> Hoa sáng bởi tứ đèn, như sắc đẹp tỏa sáng ngời.) <br><i> (Hoa ở đây là hoa đèn). </i> ", ["AnhCacBanTho/HUUBAN.JPG"]);
addMarkerPx(1060000, 1920000, "Thần Hoàng", "- Tên hiện vật: Bài vị 'Thần'<br> - Niên đại: 1899<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 173, ngang: 157, cao chân đế: 20, ngang chân đế: 141, sâu chân đế: 28<br> - Miêu tả hiện vật: Bài vị ở giữa chạm nổi chữ 神 (Thần), phía trên chạm nổi lưỡng long triều nhật, hai bên chạm nổi dây lá, thanh gươm, giỏ hoa, cuốn thư, nậm rượu, quạt (thuộc đề tài bát bửu); chạm chìm câu đối chữ Hán: <br> 聖 德 久 長 徽 赫 濯 <br> 神 功 廣 大 顯 精 靈 <br> Phiên âm: <br> Thánh đức cửu trường huy hách trạc <br> Thần công quảng đại hiển tinh linh. <br> Long phi Kỷ Hợi niên <br> (Đức của thánh lâu dài rạng ngời anh linh hiển hách <br> Công của thần rộng lớn, sáng chói tinh linh linh thiêng.)", ["AnhCacBanTho/THANHOANG.JPG"]);
addMarkerPx(1131000, 2020800, "Tả Ban", "- Tên hiện vật: Bài vị 'Tả Ban'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 164, ngang: 141, cao chân đế: 26, ngang chân đế: 120, sâu chân đế: 25<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Tả Ban, sơn son thếp vàng, trang trí nổi dây lá, ở giữa đề chữ Hán, hai bên chạm chìm câu đối chữ Hán: <br>左 班 列 位 <br>&nbsp;&nbsp;&nbsp;&nbsp; 平 有 象 誠 能 格 <br> 大 道 無 私 德 是 親 <br> Phiên âm: <br> Tả ban liệt vị. <br> Hòa bình hữu tượng, thành năng cách <br> Đại đạo vô tư, đức thị thân. <br> (Có hiện tượng hòa bình, nhờ ở lòng thành hiểu hết sự việc <br> Không riêng trong gầy dựng, do sáng suốt đức để gần gũi dân.)", ["AnhCacBanTho/TABAN.JPG"]);
addMarkerPx(1222000, 1772000, "Tiền Hiền", "- Tên hiện vật: Bài vị 'Tiền Hiền'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 151, ngang: 102, ngang chân giá: 91, sâu chân giá: 32<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Tiền Hiền, sơn son thếp vàng, ở giữa đề chữ 前 賢 (Tiền Hiền), hai bên chạm nổi dây lá, chạm chìm lạc khoản chữ Hán: <br> 庚 子 年 仲 春 造 - 會 同 阮 祐 禧 奉 供 <br> Phiên âm: <br> Canh tý niên trọng xuân tạo - hội đồng Nguyễn Hựu Hy (hiệu) phụng cung. <br> (Lập tháng Hai năm Canh Tý, ông hội đồng họ Nguyễn hiệu là Hựu Hy cúng.)", ["AnhCacBanTho/TIENHIEN.JPG"]);
addMarkerPx(1354000, 1971200, "Hậu Hiền", "- Tên hiện vật: Bài vị 'Hậu Hiền'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 151, ngang: 102, ngang chân giá: 91, sâu chân giá: 32<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Hậu Hiền, sơn son thếp vàng, ở giữa đề chữ 前 賢 (Tiền Hiền), hai bên chạm nổi dây lá, chạm chìm lạc khoản chữ Hán: <br> 庚 子 年 仲 春 造 - 副 總 阮 賢 豪 號 奉 供 <br> Phiên âm: <br> Canh tý niên trọng xuân tạo - phó tổng Nguyễn Hiền Hào (hiệu) phụng cung. <br> (Lập tháng Hai năm Canh Tý, ông Phó tổng họ Nguyễn hiệu là Hiền Hào cúng.)", ["AnhCacBanTho/HAUHIEN.JPG"]);
addMarkerPx(1287000, 1873600, "Hội Đồng", "- Tên hiện vật: Bàn thờ Hội Đồng<br>- Niên đại: Đầu thế kỷ XX<br>- Chất liệu: Gỗ, vải nhung, đồng<br>- Vị trí: Giữa tiền điện và chính điện<br>- Miêu tả hiện vật: Giữa tiền điện là Bàn thờ Hội Đồng Ngoại bằng gỗ, phủ vải nhung đỏ thêu long-lân-qui-phụng.<br>Trống được đặt bên phải, kề bên là một chiếc phản gỗ, nơi Ban nhạc lễ tấu nhạc vào các ngày đại lễ trong năm; chiêng đồng và mõ gỗ được đặt bên trái.<br>Giữa chính điện, phía ngoài là Bàn thờ Hội Đồng Nội, hai bên trang trí lọng nhung đỏ, cặp hạc gỗ đứng trên lưng rùa và hai dàn lỗ bộ gỗ.<br>Bên trái và bên phải là Khám thờ Tiền Hiền, Khám thờ Hậu Hiền.<br>- Giá trị hiện vật: Tiền hiền là những người đến trước khai phá dựng làng trên vùng đất mới. Hậu hiền là những lớp người sau tiếp tục mở mang đất đai.<br>Thường các vị Tiền hiền là tập thể những ông tổ các dòng họ đến lúc mới lập làng.", ["AnhCacBanTho/HOIDONG.JPG"]);
addMarkerPx(2686000, 2016000, "Miếu thờ Quan Thánh Đế", "- Tên hiện vật: Đền thờ Quan Thánh Đế<br>- Niên đại: Không rõ (gắn với quá trình hình thành đình)<br>- Chất liệu: Miếu bê-tông, nền ốp gạch men, mái lợp tôn; bài vị kiếng tráng thủy, khung gỗ<br>- Vị trí: Góc trái đình, mặt chính hướng ra cổng đình<br>- Miêu tả hiện vật: Miếu thờ Quan Đế Thánh Quân là một ngôi miếu nhỏ bằng bê-tông, nền ốp gạch men, mái lợp tôn. Trong miếu đặt hai bài vị Quan Đế Thánh Quân và Đinh Phước Táo Quân bằng kiếng tráng thủy, khung gỗ.<br>Trên bài vị Quan Đế Thánh Quân đề các chữ:<br>忠 義 無 餘 地<br>春 秋 不 老 千<br>Phiên âm:<br>Trung nghĩa vô dư địa<br>Xuân thu bất lão thiên.<br>(Nghĩa:<br>Lòng trung nghĩa không còn đất chứa<br>Sách Xuân Thu trẻ mãi ngang trời.)<br>- Giá trị hiện vật: Quan Đế Thánh Quân (Quan Công) là biểu tượng của trung nghĩa, chính trực và tiết tháo trong tín ngưỡng dân gian. Việc thờ Quan Thánh Đế trong khuôn viên đình thể hiện niềm tôn kính đối với bậc trung thần, đồng thời gửi gắm ước nguyện về chính nghĩa, bình an và bảo hộ cho dân làng.", ["AnhCacBanTho/QUANTHANHDE.JPG"]);
addMarkerPx(2664000, 1520000, "Miếu thờ Thần Nông", "- Tên hiện vật: Miếu thờ Thần Nông<br>- Niên đại: Không rõ (gắn với quá trình hình thành đình)<br>- Chất liệu: Bệ thờ ốp gạch men màu đỏ, mái che tôn<br>- Vị trí: Giữa khuôn viên, sát ranh phía trước đình, phía sau bình phong Thần Hổ<br>- Miêu tả hiện vật: Bệ thờ Thần Nông được bố trí ngoài sân đình, phía sau bình phong Thần Hổ, mang đặc trưng thờ tự truyền thống Nam Bộ. Hai bên gắn đôi câu đối chữ Hán:<br>俎 豆 千 秋 因 校 稼<br>馨 香 萬 古 為 明 農<br>Phiên âm:<br>Trở đậu thiên thu, nhân giáo giá<br>Hinh hương vạn cổ, vị minh nông.<br>(Nghĩa:<br>Cúng tế ngàn năm vì được dạy gieo cấy<br>Thơm tho muôn thuở bởi nông nghiệp sáng ngời.)<br>- Giá trị hiện vật: Ngay từ buổi đầu hình thành làng xã, Thần Nông đã được đem vào đình làng thờ cùng với Thần Thành Hoàng Bổn Cảnh. Thông thường, bàn thờ Thần Nông được đặt trước sân đình, để lộ thiên, không mái che.<br>Ý niệm về Thần Nông không chỉ tồn tại trong tâm thức dân gian mà còn được các triều đại phong kiến coi trọng, bởi đời sống người dân gắn liền với nền nông nghiệp lúa nước.<br>Thần Nông là vị thần dạy dân cày cấy, gặt hái, giúp mùa màng tốt tươi, mang lại ấm no sung túc, nhờ vậy nghề nông phát đạt.", ["AnhCacBanTho/THANNONG.JPG"]);
addMarkerPx(2717000, 1232000, "Miếu thờ Thổ Thần", "- Tên hiện vật: Miếu thờ Thổ Thần<br>- Niên đại: Không rõ (gắn với quá trình hình thành đình)<br>- Chất liệu: Miếu xi măng quét vôi trắng, mái tôn<br>- Vị trí: Bên phải bàn thờ bình phong Thần Hổ, cạnh gốc cây Gừa cổ thụ<br>- Miêu tả hiện vật: Đây là một ngôi miếu nhỏ bằng xi măng, quét vôi trắng, mái tôn, nằm kề bên một gốc cây Gừa nhánh vươn cao, tán xòe rộng đã trên trăm năm tuổi.<br>Hai bên miếu khắc câu đối chữ quốc ngữ:<br>Nhất niên thanh thới bằng thần hổ<br>Tứ quý vinh hoa lạy thánh thần<br>Phiên nghĩa:<br>Trọn năm khỏe mạnh nhờ thần giúp<br>Bốn mùa vinh sang cậy ở thánh hiền.<br>Bên trong miếu chạm các chữ Hán:<br>五 方 五 土 龍 神<br>Phiên âm:<br>Ngũ phương ngũ thổ long thần<br>- Giá trị hiện vật: Nội dung thờ đất đai sông nước. Theo truyền thống Á Đông, Thổ Thần được xem là vị thần cai quản, chăm nom, đem đến sự an lành cho đất đai, nhà cửa. Bàn thờ Thổ Thần luôn được đặt áp nền đất, mặt chính hướng ra cửa.", ["AnhCacBanTho/THOTHAN.JPG"]);
addMarkerPx(1632000, 1604800, "Nhà thờ Chủ tịch Hồ Chí Minh", "Đây là Nhà thờ Chủ tịch Hồ Chí Minh và trưng bày tiểu sử về Bác", ["AnhHCM/HCM1.JPG", "AnhHCM/HCM2.JPG", "AnhHCM/HCM3.JPG", "AnhHCM/HCM4.JPG", "AnhHCM/HCM5.JPG"]);
