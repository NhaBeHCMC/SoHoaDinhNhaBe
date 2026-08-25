# Dữ liệu riêng của từng đình

Mỗi thư mục trong `src/heritage-sites` chỉ chứa dữ liệu và cấu hình media của một đình.
Khung giao diện, route bản đồ, gallery, panel chi tiết và điều hướng vẫn dùng chung trong
`src/app`, `src/components`, `src/lib` và `src/styles`.

- Chỉnh Đình Phú Xuân: `phu-xuan/map-data.ts`.
- Chỉnh Đình Long Kiển: `long-kien/map-data.ts`.
- Đăng ký đình trong hệ thống: `src/data/maps.ts`.

Hai đình đều dùng Cloudinary nhưng có folder độc lập: Phú Xuân dùng
`nha-be/di-tich-phu-xuan`, Long Kiển dùng `nha-be/di-tich-long-kien`. Khi cần upload lại,
dùng thư mục ảnh nguồn bên ngoài repository.
