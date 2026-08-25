# Hệ thống số hóa thông tin di tích các đình xã Nhà Bè

Dự án tích hợp bản đồ số Đình Phú Xuân và Đình Long Kiển trong một khung Next.js App Router, TypeScript và Leaflet dùng chung. Mục tiêu là giữ nguyên dữ liệu lịch sử, ảnh và vị trí marker của từng đình, đồng thời tạo nền tảng có thể mở rộng cho các di tích tiếp theo.

## Công nghệ

- Next.js App Router, TypeScript, static generation.
- Leaflet với `L.CRS.Simple` cho bản đồ trên ảnh sơ đồ.
- CSS Modules theo component và token thiết kế tập trung.
- Vitest cho kiểm tra dữ liệu, tọa độ và image adapter.

## Cấu trúc chính

- `src/app`: route trang chủ, route `/ban-do/[slug]`, metadata, sitemap, robots.
- `src/components`: header, menu, bộ sưu tập bản đồ, Leaflet viewer, detail panel, gallery.
- `src/heritage-sites/phu-xuan`: dữ liệu và cấu hình media riêng của Đình Phú Xuân.
- `src/heritage-sites/long-kien`: dữ liệu và cấu hình media riêng của Đình Long Kiển.
- `src/data/maps.ts`: registry chung, nơi đăng ký các đình vào hệ thống.
- `src/lib`: chuyển tọa độ, adapter ảnh, SEO helper, sanitize helper cho dữ liệu legacy.
- `src/types`: type dùng chung cho bản đồ.
- `src/test`: test dữ liệu và công thức chuyển đổi.
- `public/logo.png`: logo liên đơn vị được phục vụ trực tiếp từ ứng dụng.

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

1. Tạo folder mới trong `src/heritage-sites/<ten-dinh>` và khai báo một `MapData` theo type trong `src/types/map.ts`.
2. Chọn media `local` để dùng ảnh trong `public`, hoặc `cloudinary` khi ảnh đã được upload.
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

Trang chủ dùng Leaflet và nền OpenStreetMap để hiển thị vị trí các di tích; nút chỉ đường mở Google Maps.

Mỗi `MapData` có thể khai báo thêm:

```ts
geographicLocation: {
  latitude: 10.69838,
  longitude: 106.73501,
  address: "Đường Huỳnh Tấn Phát, xã Nhà Bè, TP.HCM",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=10.69838%2C106.73501"
}
```

`getGeolocatedMapSummaries()` chỉ đưa các bản đồ có tọa độ thật lên bản đồ trang chủ. Khi bổ sung một đình mới, thêm dữ liệu `MapData` và `geographicLocation` để marker, địa chỉ và nút chỉ đường được cập nhật tự động.

## Quản lý ảnh bằng Cloudinary

Ảnh hai đình được phân phối từ hai folder Cloudinary độc lập:

- Phú Xuân: `nha-be/di-tich-phu-xuan`.
- Long Kiển: `nha-be/di-tich-long-kien`.

Một ảnh gốc được dùng cho cả ba ngữ cảnh thông qua transformation của Cloudinary:

- `thumbs`: crop `480x320` cho lưới gallery.
- `large`: giới hạn chiều rộng `1600px` cho card và hero.
- `viewer`: giới hạn chiều rộng `2200px` cho lightbox.

Ảnh Đình Phú Xuân và ảnh sơ đồ được phân phối từ Cloudinary. Logo là ngoại lệ duy nhất:
ứng dụng dùng file local `public/logo.png` và không upload logo lên Cloudinary. Không cần lưu
ba bản sao `thumbs/large/viewer` trong `public` vì Cloudinary tạo kích thước phù hợp bằng
transformation.

Các bản ảnh đình local được loại khỏi source sau khi xác nhận đã có trên Cloudinary. Khi cần
thay ảnh, truyền thư mục nguồn bên ngoài repository cho script upload.

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

Upload ảnh Long Kiển từ một thư mục nguồn vào đúng folder:

```bash
npm run cloudinary:upload -- --source "C:/duong-dan/anh-long-kien" --folder nha-be/di-tich-long-kien --tags nha-be,di-tich-long-kien
```

5. Khi cần thay thế ảnh có cùng public ID:

```bash
npm run cloudinary:upload -- --overwrite
```

Script upload không đưa `logo.png` lên Cloudinary. Public ID ảnh đình được giữ ổn định
theo cấu trúc, ví dụ `nha-be/di-tich-phu-xuan/AnhDinh/dinh (1)` hoặc
`nha-be/di-tich-long-kien/AnhDinh/dinh (1)`. API secret chỉ được script đọc ở server và
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

## Lưu ý vận hành

- Đã có 2 bản đồ là Đình Phú Xuân và Đình Long Kiển.
- Cần cấu hình domain production qua `NEXT_PUBLIC_SITE_URL` trước khi phát hành chính thức.
- Nếu phát hiện lỗi chính tả hoặc sai dữ liệu trong nội dung gốc, cần xác minh nguồn trước khi sửa.
- Ảnh sơ đồ trên Cloudinary có kích thước thực 2000x1646, trong khi bản cũ ép bounds 2000x1600. Code mới giữ `mapHeight = 1600` để bảo toàn vị trí marker.

## Kiểm tra dữ liệu

- Số marker cũ: 11.
- Số marker mới: kiểm bằng `PHU_XUAN_SOURCE_MARKER_COUNT` và test.
- Dữ liệu từng đình nằm trong `src/heritage-sites/<ten-dinh>/map-data.ts`; `src/data/phu-xuan.ts` chỉ là file tương thích cho đường dẫn cũ.
