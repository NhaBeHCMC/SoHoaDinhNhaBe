# Công trình số hóa thông tin di tích kiến trúc nghệ thuật Đình Phú Xuân

Dự án tái cấu trúc website bản đồ số Đình Phú Xuân từ HTML/CSS/JavaScript thuần sang Next.js App Router, TypeScript và Leaflet. Mục tiêu là giữ nguyên dữ liệu lịch sử, ảnh và vị trí marker hiện có, đồng thời tạo nền tảng có thể tái sử dụng để xây dựng tổng cộng 9 bản đồ số di tích.

## Công nghệ

- Next.js App Router, TypeScript, static generation.
- Leaflet với `L.CRS.Simple` cho bản đồ trên ảnh sơ đồ.
- CSS Modules theo component và token thiết kế tập trung.
- Vitest cho kiểm tra dữ liệu, tọa độ và image adapter.

## Cấu trúc chính

- `src/app`: route trang chủ, route `/ban-do/[slug]`, metadata, sitemap, robots.
- `src/components`: header, menu, bộ sưu tập bản đồ, Leaflet viewer, detail panel, gallery.
- `src/data`: dữ liệu bản đồ và dữ liệu Đình Phú Xuân đã tách khỏi giao diện.
- `src/lib`: chuyển tọa độ, adapter ảnh, SEO helper, sanitize helper cho dữ liệu legacy.
- `src/types`: type dùng chung cho bản đồ.
- `src/test`: test dữ liệu và công thức chuyển đổi.
- `public/logo.png`: logo liên đơn vị được phục vụ trực tiếp từ ứng dụng.
- `index.html`, `script.js`: phiên bản cũ được giữ để đối chiếu cấu trúc và dữ liệu.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Các lệnh kiểm tra:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Thêm bản đồ mới

1. Upload ảnh sơ đồ lên Cloudinary bằng cùng quy ước public ID trong phần Quản lý ảnh.
2. Tạo một `MapData` mới theo type trong `src/types/map.ts`.
3. Thêm `MapData` đó vào mảng `maps` trong `src/data/maps.ts`.
4. Không cần copy `MapViewer` hoặc tạo route riêng; `/ban-do/[slug]` dùng chung cho mọi bản đồ.

## Thêm marker

Mỗi marker là một `MapLocation` có:

- `id` duy nhất trong bản đồ.
- `title`, `description`.
- `position` dạng tỷ lệ 0-1.
- `images` có `src` và `alt`.

Dữ liệu cũ dùng công thức:

```ts
lng = x / 2000
lat = y / 1600
```

Dữ liệu mới lưu normalized position:

```ts
normalizedX = (x / 2000) / mapWidth
normalizedY = (y / 1600) / mapHeight
```

Khi render Leaflet:

```ts
lat = normalizedY * mapHeight
lng = normalizedX * mapWidth
```

Test trong `src/test/map-data.test.ts` khóa công thức này để marker không lệch so với phiên bản cũ.

## Bản đồ địa lý trang chủ

Trang chủ dùng Leaflet và nền OpenStreetMap để hiển thị vị trí ngoài đời của các di tích mà không cần Google Maps API key. Đình Phú Xuân hiện được đặt tại tọa độ `10.69838, 106.73501`, đối chiếu theo OpenStreetMap way `614636407`.

Mỗi `MapData` có thể khai báo thêm:

```ts
geographicLocation: {
  latitude: 10.69838,
  longitude: 106.73501,
  address: "Đường Huỳnh Tấn Phát, xã Nhà Bè, TP.HCM",
  sourceUrl: "https://www.openstreetmap.org/way/614636407",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=10.69838%2C106.73501"
}
```

`getGeolocatedMapSummaries()` chỉ đưa các bản đồ có tọa độ thật lên bản đồ trang chủ. Khi bổ sung một đình mới, thêm dữ liệu `MapData` và `geographicLocation`; marker, danh sách địa điểm và khung nhìn sẽ được cập nhật tự động.

## Quản lý ảnh bằng Cloudinary

Ứng dụng chỉ tạo URL từ Cloudinary, không còn fallback về `public/legacy-assets`. Một ảnh gốc
được dùng cho cả ba ngữ cảnh thông qua transformation của Cloudinary:

- `thumbs`: crop `480x320` cho lưới gallery.
- `large`: giới hạn chiều rộng `1600px` cho card và hero.
- `viewer`: giới hạn chiều rộng `2200px` cho lightbox.

Ảnh Đình Phú Xuân và ảnh sơ đồ được phân phối từ Cloudinary. Logo là ngoại lệ duy nhất:
ứng dụng dùng file local `public/logo.png` và không upload logo lên Cloudinary. Không cần lưu
ba bản sao `thumbs/large/viewer` trong `public` vì Cloudinary tạo kích thước phù hợp bằng
transformation.

Các bản ảnh Đình Phú Xuân local được loại khỏi source sau khi xác nhận đã có trên Cloudinary.

1. Sao chép `.env.example` thành `.env.local`.
2. Điền Cloud name, API key và API secret lấy từ Cloudinary Console.
3. Kiểm tra danh sách public ID, không truyền dữ liệu:

```bash
npm run cloudinary:upload -- --dry-run
```

4. Upload các ảnh chưa tồn tại:

```bash
npm run cloudinary:upload
```

5. Khi cần thay thế ảnh có cùng public ID:

```bash
npm run cloudinary:upload -- --overwrite
```

Script migration không đưa `logo.png` lên Cloudinary. Public ID ảnh đình được giữ ổn định theo cấu trúc, ví dụ
`nha-be/di-tich-phu-xuan/AnhDinh/dinh (1)`. API secret chỉ được script đọc ở server và
không mang tiền tố `NEXT_PUBLIC_`.

## Deploy Vercel

1. Tạo project Vercel từ repository.
2. Cấu hình `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` và
   `NEXT_PUBLIC_CLOUDINARY_ASSET_FOLDER` trên Vercel.
3. Không cần đưa `CLOUDINARY_API_KEY` hoặc `CLOUDINARY_API_SECRET` lên Vercel vì website
   chỉ phân phối ảnh; hai biến này chỉ cần ở máy chạy migration.
4. Khi có domain chính thức, cập nhật `NEXT_PUBLIC_SITE_URL` để canonical URL, sitemap và Open Graph đúng.

Không commit secret. Các khóa R2, token CI hoặc credential khác phải nằm trong môi trường deploy.

## Hallmark

Hallmark được dùng để audit giao diện cũ và định hướng thiết kế mới:

- Macrostructure: Map / Diagram cho trang bản đồ, index trang trọng cho trang chủ.
- Tone: di sản Việt Nam, cổ kính, trầm ấm, không fantasy, không game, không cung đình Trung Quốc.
- Token: giấy ngà, sơn son, nâu gỗ, đồng cổ, mực nâu đen.
- Tương tác: marker như dấu triện, panel phải trên desktop, bottom sheet trên mobile, lightbox bằng `dialog`.

Khi chỉnh sửa giao diện tiếp theo, hãy rà lại:

- Không dùng màu hard-code ngoài token.
- Không tạo card-in-card hoặc dashboard SaaS.
- Không dùng gradient tím/xanh, glow, orb, emoji làm icon.
- Kiểm tra mobile ở 360x800, 390x844, 768x1024.
- Đảm bảo focus-visible, vùng nhấn tối thiểu 44px, không khóa zoom.

## Những phần chưa thực hiện

- Chưa có 8 bản đồ còn lại; trang chủ đang giữ chỗ cho các bản đồ này.
- Chưa cấu hình domain production vì chưa được yêu cầu.
- Nếu phát hiện lỗi chính tả hoặc sai dữ liệu trong nội dung gốc, cần xác minh nguồn trước khi sửa. Một số câu trong `script.js` có vẻ có lỗi gõ nhưng hiện được giữ nguyên theo yêu cầu bảo toàn nội dung.
- Ảnh sơ đồ trên Cloudinary có kích thước thực 2000x1646, trong khi bản cũ ép bounds 2000x1600. Code mới giữ `mapHeight = 1600` để bảo toàn vị trí marker.

## Đối chiếu phiên bản cũ

- Số marker cũ: 11.
- Số marker mới: kiểm bằng `PHU_XUAN_SOURCE_MARKER_COUNT` và test.
- `index.html` và `script.js` vẫn được giữ để đối chiếu; ảnh đình được lấy từ Cloudinary.
- Dữ liệu lịch sử, tên địa điểm, danh sách ảnh và vị trí marker đã được chuyển sang `src/data/phu-xuan.ts`.
