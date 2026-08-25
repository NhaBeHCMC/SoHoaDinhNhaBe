import { legacyPixelToNormalized } from "@/lib/map-coordinate";
import type { MapData, MapImage, MapLocation } from "@/types/map";

export const PHU_XUAN_SOURCE_MARKER_COUNT = 11;

function legacyPosition(x: number, y: number) {
  return legacyPixelToNormalized({ x, y });
}

function image(src: string, alt: string, caption?: string): MapImage {
  return {
    src,
    alt,
    caption
  };
}

const hinhAnhDinhThan: MapImage[] = Array.from({ length: 29 }, (_, index) => {
  const photoNumber = index + 1;
  return image(
    `AnhDinh/dinh (${photoNumber}).JPG`,
    `Hình ảnh Đình Phú Xuân ${photoNumber}`,
    `Hình ảnh Đình Phú Xuân ${photoNumber}`
  );
});

const hinhAnhHoatDong: MapImage[] = Array.from({ length: 30 }, (_, index) => {
  const photoNumber = index + 1;
  return image(
    `AnhHoatDong/AnhHoatDong (${photoNumber}).jpg`,
    `Hình ảnh hoạt động tại Đình Phú Xuân ${photoNumber}`,
    `Hình ảnh hoạt động ${photoNumber}`
  );
});

const locations: MapLocation[] = [
  {
    id: "chinh-dien",
    title: "Chính điện",
    legacyPosition: { x: 1429000, y: 1772800 },
    position: legacyPosition(1429000, 1772800),
    period: "Đầu thế kỷ XX",
    material: ["Gỗ", "bê-tông cốt thép", "gạch men", "ngói âm dương"],
    physicalLocation: "Giáp với tiền điện đình Phú Xuân",
    description:
      "Cửa vào chính điện đình là cửa gỗ kiểu thượng song hạ bản, gồm một cửa chính, bốn cánh mở vào và hai cửa phụ. Cửa chính chỉ được mở vào các ngày đại lễ trong năm (16 tháng 2, 16 tháng 10 âm lịch). Chính điện có cùng kết cấu kiến trúc với tiền điện nhưng bề thế và vững chắc hơn. Tứ trụ là bốn cột gỗ vuông cạnh 25cm, hệ thống vì kèo, đòn tay, rui bằng gỗ; các thanh xà ngang và cây trống được đẽo gọt tạo dáng mỹ thuật, còn lại là hệ thống cột bê tông cốt thép, nền lát gạch men. Mái lợp ngói âm dương, nóc mái trang trí lưỡng long triều nguyệt.",
    historicalValue:
      "Các bàn thờ ở chính điện đình Phú Xuân được bày trí đăng đối nhau, giữa các bàn thờ trang trí các bức chân, màn nhung đỏ thẫm thêu rồng phượng, tạo nên vẻ nghiêm trang, cổ kính nơi thờ tự.",
    chineseText: [
      "富 仰 聖 恩 大 小 咸 敷 惠 澤",
      "春 霑 神 德 邇 遐 共 樂 遺 靈"
    ],
    transliteration: [
      "Phú ngưỡng thánh ân, đại tiểu hàm phu huệ trạch",
      "Xuân triêm thần đức, nhĩ hà cộng lạc di linh."
    ],
    translation: [
      "Dân Phú Xuân ngưỡng vọng thánh ân, lớn nhỏ đều nhờ huệ trạch",
      "Người Phú Xuân thắm nhuần thần đức, xa gần vui bởi linh thiêng."
    ],
    legacyDescriptionHtml:
      "- Tên hiện vật: Chính điện đình Phú Xuân<br>- Niên đại: Đầu thế kỷ XX<br>- Chất liệu: Gỗ, bê-tông cốt thép, gạch men, ngói âm dương<br>- Vị trí: Giáp với tiền điện đình Phú Xuân<br>- Miêu tả hiện vật: Cửa vào chính điện đình là cửa gỗ kiểu thượng song hạ bản, gồm một cửa chính, bốn cánh mở vào và hai cửa phụ. Cửa chính chỉ được mở vào các ngày đại lễ trong năm (16 tháng 2, 16 tháng 10 âm lịch).<br>Hai bên cột cửa đắp nổi đôi câu đối chữ Hán:<br>富 仰 聖 恩 大 小 咸 敷 惠 澤<br>春 霑 神 德 邇 遐 共 樂 遺 靈<br>Phiên âm:<br>Phú ngưỡng thánh ân, đại tiểu hàm phu huệ trạch<br>Xuân triêm thần đức, nhĩ hà cộng lạc di linh.<br>Phiên nghĩa:<br>Dân Phú Xuân ngưỡng vọng thánh ân, lớn nhỏ đều nhờ huệ trạch<br>Người Phú Xuân thắm nhuần thần đức, xa gần vui bởi linh thiêng.<br>Chính điện có cùng kết cấu kiến trúc với tiền điện nhưng bề thế và vững chắc hơn. Tứ trụ là bốn cột gỗ vuông cạnh 25cm, hệ thống vì kèo, đòn tay, rui bằng gỗ; các thanh xà ngang và cây trống được đẽo gọt tạo dáng mỹ thuật, còn lại là hệ thống cột bê tông cốt thép, nền lát gạch men.<br>Mái lợp ngói âm dương, nóc mái trang trí lưỡng long triều nguyệt.<br>- Giá trị hiện vật: Các bàn thờ ở chính điện đình Phú Xuân được bày trí đăng đối nhau, giữa các bàn thờ trang trí các bức chân, màn nhung đỏ thẫm thêu rồng phượng, tạo nên vẻ nghiêm trang, cổ kính nơi thờ tự.",
    images: [image("AnhCacBanTho/CHINHDIEN.JPG", "Chính điện đình Phú Xuân", "Chính điện")]
  },
  {
    id: "huu-ban",
    title: "Hữu Ban",
    legacyPosition: { x: 987000, y: 1822400 },
    position: legacyPosition(987000, 1822400),
    period: "Đầu thế kỷ XX",
    material: ["Gỗ"],
    dimensions:
      "Cao: 165, ngang: 143, cao chân đế: 25, ngang chân đế: 120, sâu chân đế: 26",
    description:
      "Bài vị đặt trên bàn thờ Hữu Ban, sơn son thếp vàng, trang trí nổi dây lá, ở giữa đề chữ Hán, hai bên chạm chìm câu đối chữ Hán.",
    chineseText: [
      "佑 班 列 位",
      "胤 生 香 裡 祥 雲 合",
      "花 照 燈 前 瑞 色 明"
    ],
    transliteration: [
      "Hữu ban liệt vị.",
      "Yên sanh hương lý, tường vân hiệp",
      "Hoa chiếu đăng tiền, thoại sắc minh."
    ],
    translation: [
      "(Khói tỏa từ tỏng hương, như đám mây lành tụ hội",
      "Hoa sáng bởi tứ đèn, như sắc đẹp tỏa sáng ngời.)"
    ],
    notes: ["(Hoa ở đây là hoa đèn)."],
    legacyDescriptionHtml:
      "- Tên hiện vật: Bài vị 'Hữu Ban'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 165, ngang: 143, cao chân đế: 25, ngang chân đế: 120, sâu chân đế: 26<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Hữu Ban, sơn son thếp vàng, trang trí nổi dây lá, ở giữa đề chữ Hán, hai bên chạm chìm câu đối chữ Hán: <br>佑 班 列 位 <br> 胤 生 香 裡 祥 雲 合 <br> 花 照 燈 前 瑞 色 明 <br> Phiên âm: <br> Hữu ban liệt vị. <br> Yên sanh hương lý, tường vân hiệp <br> Hoa chiếu đăng tiền, thoại sắc minh. <br> (Khói tỏa từ tỏng hương, như đám mây lành tụ hội <br> Hoa sáng bởi tứ đèn, như sắc đẹp tỏa sáng ngời.) <br><i> (Hoa ở đây là hoa đèn). </i> ",
    images: [image("AnhCacBanTho/HUUBAN.JPG", "Bài vị Hữu Ban", "Hữu Ban")]
  },
  {
    id: "than-hoang",
    title: "Thần Hoàng",
    legacyPosition: { x: 1060000, y: 1920000 },
    position: legacyPosition(1060000, 1920000),
    period: "1899",
    material: ["Gỗ"],
    dimensions:
      "Cao: 173, ngang: 157, cao chân đế: 20, ngang chân đế: 141, sâu chân đế: 28",
    description:
      "Bài vị ở giữa chạm nổi chữ 神 (Thần), phía trên chạm nổi lưỡng long triều nhật, hai bên chạm nổi dây lá, thanh gươm, giỏ hoa, cuốn thư, nậm rượu, quạt (thuộc đề tài bát bửu); chạm chìm câu đối chữ Hán.",
    chineseText: ["神", "聖 德 久 長 徽 赫 濯", "神 功 廣 大 顯 精 靈"],
    transliteration: [
      "Thánh đức cửu trường huy hách trạc",
      "Thần công quảng đại hiển tinh linh.",
      "Long phi Kỷ Hợi niên"
    ],
    translation: [
      "(Đức của thánh lâu dài rạng ngời anh linh hiển hách",
      "Công của thần rộng lớn, sáng chói tinh linh linh thiêng.)"
    ],
    legacyDescriptionHtml:
      "- Tên hiện vật: Bài vị 'Thần'<br> - Niên đại: 1899<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 173, ngang: 157, cao chân đế: 20, ngang chân đế: 141, sâu chân đế: 28<br> - Miêu tả hiện vật: Bài vị ở giữa chạm nổi chữ 神 (Thần), phía trên chạm nổi lưỡng long triều nhật, hai bên chạm nổi dây lá, thanh gươm, giỏ hoa, cuốn thư, nậm rượu, quạt (thuộc đề tài bát bửu); chạm chìm câu đối chữ Hán: <br> 聖 德 久 長 徽 赫 濯 <br> 神 功 廣 大 顯 精 靈 <br> Phiên âm: <br> Thánh đức cửu trường huy hách trạc <br> Thần công quảng đại hiển tinh linh. <br> Long phi Kỷ Hợi niên <br> (Đức của thánh lâu dài rạng ngời anh linh hiển hách <br> Công của thần rộng lớn, sáng chói tinh linh linh thiêng.)",
    images: [image("AnhCacBanTho/THANHOANG.JPG", "Bài vị Thần Hoàng", "Thần Hoàng")]
  },
  {
    id: "ta-ban",
    title: "Tả Ban",
    legacyPosition: { x: 1131000, y: 2020800 },
    position: legacyPosition(1131000, 2020800),
    period: "Đầu thế kỷ XX",
    material: ["Gỗ"],
    dimensions:
      "Cao: 164, ngang: 141, cao chân đế: 26, ngang chân đế: 120, sâu chân đế: 25",
    description:
      "Bài vị đặt trên bàn thờ Tả Ban, sơn son thếp vàng, trang trí nổi dây lá, ở giữa đề chữ Hán, hai bên chạm chìm câu đối chữ Hán.",
    chineseText: ["左 班 列 位", "平 有 象 誠 能 格", "大 道 無 私 德 是 親"],
    transliteration: [
      "Tả ban liệt vị.",
      "Hòa bình hữu tượng, thành năng cách",
      "Đại đạo vô tư, đức thị thân."
    ],
    translation: [
      "(Có hiện tượng hòa bình, nhờ ở lòng thành hiểu hết sự việc",
      "Không riêng trong gầy dựng, do sáng suốt đức để gần gũi dân.)"
    ],
    legacyDescriptionHtml:
      "- Tên hiện vật: Bài vị 'Tả Ban'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 164, ngang: 141, cao chân đế: 26, ngang chân đế: 120, sâu chân đế: 25<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Tả Ban, sơn son thếp vàng, trang trí nổi dây lá, ở giữa đề chữ Hán, hai bên chạm chìm câu đối chữ Hán: <br>左 班 列 位 <br>&nbsp;&nbsp;&nbsp;&nbsp; 平 有 象 誠 能 格 <br> 大 道 無 私 德 是 親 <br> Phiên âm: <br> Tả ban liệt vị. <br> Hòa bình hữu tượng, thành năng cách <br> Đại đạo vô tư, đức thị thân. <br> (Có hiện tượng hòa bình, nhờ ở lòng thành hiểu hết sự việc <br> Không riêng trong gầy dựng, do sáng suốt đức để gần gũi dân.)",
    images: [image("AnhCacBanTho/TABAN.JPG", "Bài vị Tả Ban", "Tả Ban")]
  },
  {
    id: "tien-hien",
    title: "Tiền Hiền",
    legacyPosition: { x: 1222000, y: 1772000 },
    position: legacyPosition(1222000, 1772000),
    period: "Đầu thế kỷ XX",
    material: ["Gỗ"],
    dimensions: "Cao: 151, ngang: 102, ngang chân giá: 91, sâu chân giá: 32",
    description:
      "Bài vị đặt trên bàn thờ Tiền Hiền, sơn son thếp vàng, ở giữa đề chữ 前 賢 (Tiền Hiền), hai bên chạm nổi dây lá, chạm chìm lạc khoản chữ Hán.",
    chineseText: ["前 賢", "庚 子 年 仲 春 造 - 會 同 阮 祐 禧 奉 供"],
    transliteration: ["Canh tý niên trọng xuân tạo - hội đồng Nguyễn Hựu Hy (hiệu) phụng cung."],
    translation: ["(Lập tháng Hai năm Canh Tý, ông hội đồng họ Nguyễn hiệu là Hựu Hy cúng.)"],
    legacyDescriptionHtml:
      "- Tên hiện vật: Bài vị 'Tiền Hiền'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 151, ngang: 102, ngang chân giá: 91, sâu chân giá: 32<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Tiền Hiền, sơn son thếp vàng, ở giữa đề chữ 前 賢 (Tiền Hiền), hai bên chạm nổi dây lá, chạm chìm lạc khoản chữ Hán: <br> 庚 子 年 仲 春 造 - 會 同 阮 祐 禧 奉 供 <br> Phiên âm: <br> Canh tý niên trọng xuân tạo - hội đồng Nguyễn Hựu Hy (hiệu) phụng cung. <br> (Lập tháng Hai năm Canh Tý, ông hội đồng họ Nguyễn hiệu là Hựu Hy cúng.)",
    images: [image("AnhCacBanTho/TIENHIEN.JPG", "Bài vị Tiền Hiền", "Tiền Hiền")]
  },
  {
    id: "hau-hien",
    title: "Hậu Hiền",
    legacyPosition: { x: 1354000, y: 1971200 },
    position: legacyPosition(1354000, 1971200),
    period: "Đầu thế kỷ XX",
    material: ["Gỗ"],
    dimensions: "Cao: 151, ngang: 102, ngang chân giá: 91, sâu chân giá: 32",
    description:
      "Bài vị đặt trên bàn thờ Hậu Hiền, sơn son thếp vàng, ở giữa đề chữ 前 賢 (Tiền Hiền), hai bên chạm nổi dây lá, chạm chìm lạc khoản chữ Hán.",
    chineseText: ["前 賢", "庚 子 年 仲 春 造 - 副 總 阮 賢 豪 號 奉 供"],
    transliteration: ["Canh tý niên trọng xuân tạo - phó tổng Nguyễn Hiền Hào (hiệu) phụng cung."],
    translation: ["(Lập tháng Hai năm Canh Tý, ông Phó tổng họ Nguyễn hiệu là Hiền Hào cúng.)"],
    legacyDescriptionHtml:
      "- Tên hiện vật: Bài vị 'Hậu Hiền'<br> - Niên đại: Đầu thế kỷ XX<br> - Chất liệu: Gỗ<br> - Kích thước (cm): Cao: 151, ngang: 102, ngang chân giá: 91, sâu chân giá: 32<br> - Miêu tả hiện vật: Bài vị đặt trên bàn thờ Hậu Hiền, sơn son thếp vàng, ở giữa đề chữ 前 賢 (Tiền Hiền), hai bên chạm nổi dây lá, chạm chìm lạc khoản chữ Hán: <br> 庚 子 年 仲 春 造 - 副 總 阮 賢 豪 號 奉 供 <br> Phiên âm: <br> Canh tý niên trọng xuân tạo - phó tổng Nguyễn Hiền Hào (hiệu) phụng cung. <br> (Lập tháng Hai năm Canh Tý, ông Phó tổng họ Nguyễn hiệu là Hiền Hào cúng.)",
    images: [image("AnhCacBanTho/HAUHIEN.JPG", "Bài vị Hậu Hiền", "Hậu Hiền")]
  },
  {
    id: "hoi-dong",
    title: "Hội Đồng",
    legacyPosition: { x: 1287000, y: 1873600 },
    position: legacyPosition(1287000, 1873600),
    period: "Đầu thế kỷ XX",
    material: ["Gỗ", "vải nhung", "đồng"],
    physicalLocation: "Giữa tiền điện và chính điện",
    description:
      "Giữa tiền điện là Bàn thờ Hội Đồng Ngoại bằng gỗ, phủ vải nhung đỏ thêu long-lân-qui-phụng. Trống được đặt bên phải, kề bên là một chiếc phản gỗ, nơi Ban nhạc lễ tấu nhạc vào các ngày đại lễ trong năm; chiêng đồng và mõ gỗ được đặt bên trái. Giữa chính điện, phía ngoài là Bàn thờ Hội Đồng Nội, hai bên trang trí lọng nhung đỏ, cặp hạc gỗ đứng trên lưng rùa và hai dàn lỗ bộ gỗ. Bên trái và bên phải là Khám thờ Tiền Hiền, Khám thờ Hậu Hiền.",
    historicalValue:
      "Tiền hiền là những người đến trước khai phá dựng làng trên vùng đất mới. Hậu hiền là những lớp người sau tiếp tục mở mang đất đai. Thường các vị Tiền hiền là tập thể những ông tổ các dòng họ đến lúc mới lập làng.",
    legacyDescriptionHtml:
      "- Tên hiện vật: Bàn thờ Hội Đồng<br>- Niên đại: Đầu thế kỷ XX<br>- Chất liệu: Gỗ, vải nhung, đồng<br>- Vị trí: Giữa tiền điện và chính điện<br>- Miêu tả hiện vật: Giữa tiền điện là Bàn thờ Hội Đồng Ngoại bằng gỗ, phủ vải nhung đỏ thêu long-lân-qui-phụng.<br>Trống được đặt bên phải, kề bên là một chiếc phản gỗ, nơi Ban nhạc lễ tấu nhạc vào các ngày đại lễ trong năm; chiêng đồng và mõ gỗ được đặt bên trái.<br>Giữa chính điện, phía ngoài là Bàn thờ Hội Đồng Nội, hai bên trang trí lọng nhung đỏ, cặp hạc gỗ đứng trên lưng rùa và hai dàn lỗ bộ gỗ.<br>Bên trái và bên phải là Khám thờ Tiền Hiền, Khám thờ Hậu Hiền.<br>- Giá trị hiện vật: Tiền hiền là những người đến trước khai phá dựng làng trên vùng đất mới. Hậu hiền là những lớp người sau tiếp tục mở mang đất đai.<br>Thường các vị Tiền hiền là tập thể những ông tổ các dòng họ đến lúc mới lập làng.",
    images: [image("AnhCacBanTho/HOIDONG.JPG", "Bàn thờ Hội Đồng", "Hội Đồng")]
  },
  {
    id: "mieu-quan-thanh-de",
    title: "Miếu thờ Quan Thánh Đế",
    legacyPosition: { x: 2686000, y: 2016000 },
    position: legacyPosition(2686000, 2016000),
    period: "Không rõ (gắn với quá trình hình thành đình)",
    material: ["Miếu bê-tông", "nền ốp gạch men", "mái lợp tôn", "bài vị kiếng tráng thủy", "khung gỗ"],
    physicalLocation: "Góc trái đình, mặt chính hướng ra cổng đình",
    description:
      "Miếu thờ Quan Đế Thánh Quân là một ngôi miếu nhỏ bằng bê-tông, nền ốp gạch men, mái lợp tôn. Trong miếu đặt hai bài vị Quan Đế Thánh Quân và Đinh Phước Táo Quân bằng kiếng tráng thủy, khung gỗ. Trên bài vị Quan Đế Thánh Quân đề các chữ.",
    historicalValue:
      "Quan Đế Thánh Quân (Quan Công) là biểu tượng của trung nghĩa, chính trực và tiết tháo trong tín ngưỡng dân gian. Việc thờ Quan Thánh Đế trong khuôn viên đình thể hiện niềm tôn kính đối với bậc trung thần, đồng thời gửi gắm ước nguyện về chính nghĩa, bình an và bảo hộ cho dân làng.",
    chineseText: ["忠 義 無 餘 地", "春 秋 不 老 千"],
    transliteration: ["Trung nghĩa vô dư địa", "Xuân thu bất lão thiên."],
    translation: ["Lòng trung nghĩa không còn đất chứa", "Sách Xuân Thu trẻ mãi ngang trời."],
    legacyDescriptionHtml:
      "- Tên hiện vật: Đền thờ Quan Thánh Đế<br>- Niên đại: Không rõ (gắn với quá trình hình thành đình)<br>- Chất liệu: Miếu bê-tông, nền ốp gạch men, mái lợp tôn; bài vị kiếng tráng thủy, khung gỗ<br>- Vị trí: Góc trái đình, mặt chính hướng ra cổng đình<br>- Miêu tả hiện vật: Miếu thờ Quan Đế Thánh Quân là một ngôi miếu nhỏ bằng bê-tông, nền ốp gạch men, mái lợp tôn. Trong miếu đặt hai bài vị Quan Đế Thánh Quân và Đinh Phước Táo Quân bằng kiếng tráng thủy, khung gỗ.<br>Trên bài vị Quan Đế Thánh Quân đề các chữ:<br>忠 義 無 餘 地<br>春 秋 不 老 千<br>Phiên âm:<br>Trung nghĩa vô dư địa<br>Xuân thu bất lão thiên.<br>(Nghĩa:<br>Lòng trung nghĩa không còn đất chứa<br>Sách Xuân Thu trẻ mãi ngang trời.)<br>- Giá trị hiện vật: Quan Đế Thánh Quân (Quan Công) là biểu tượng của trung nghĩa, chính trực và tiết tháo trong tín ngưỡng dân gian. Việc thờ Quan Thánh Đế trong khuôn viên đình thể hiện niềm tôn kính đối với bậc trung thần, đồng thời gửi gắm ước nguyện về chính nghĩa, bình an và bảo hộ cho dân làng.",
    images: [image("AnhCacBanTho/QUANTHANHDE.JPG", "Miếu thờ Quan Thánh Đế", "Miếu thờ Quan Thánh Đế")]
  },
  {
    id: "mieu-than-nong",
    title: "Miếu thờ Thần Nông",
    legacyPosition: { x: 2664000, y: 1520000 },
    position: legacyPosition(2664000, 1520000),
    period: "Không rõ (gắn với quá trình hình thành đình)",
    material: ["Bệ thờ ốp gạch men màu đỏ", "mái che tôn"],
    physicalLocation: "Giữa khuôn viên, sát ranh phía trước đình, phía sau bình phong Thần Hổ",
    description:
      "Bệ thờ Thần Nông được bố trí ngoài sân đình, phía sau bình phong Thần Hổ, mang đặc trưng thờ tự truyền thống Nam Bộ. Hai bên gắn đôi câu đối chữ Hán.",
    historicalValue:
      "Ngay từ buổi đầu hình thành làng xã, Thần Nông đã được đem vào đình làng thờ cùng với Thần Thành Hoàng Bổn Cảnh. Thông thường, bàn thờ Thần Nông được đặt trước sân đình, để lộ thiên, không mái che. Ý niệm về Thần Nông không chỉ tồn tại trong tâm thức dân gian mà còn được các triều đại phong kiến coi trọng, bởi đời sống người dân gắn liền với nền nông nghiệp lúa nước. Thần Nông là vị thần dạy dân cày cấy, gặt hái, giúp mùa màng tốt tươi, mang lại ấm no sung túc, nhờ vậy nghề nông phát đạt.",
    chineseText: ["俎 豆 千 秋 因 校 稼", "馨 香 萬 古 為 明 農"],
    transliteration: ["Trở đậu thiên thu, nhân giáo giá", "Hinh hương vạn cổ, vị minh nông."],
    translation: ["Cúng tế ngàn năm vì được dạy gieo cấy", "Thơm tho muôn thuở bởi nông nghiệp sáng ngời."],
    legacyDescriptionHtml:
      "- Tên hiện vật: Miếu thờ Thần Nông<br>- Niên đại: Không rõ (gắn với quá trình hình thành đình)<br>- Chất liệu: Bệ thờ ốp gạch men màu đỏ, mái che tôn<br>- Vị trí: Giữa khuôn viên, sát ranh phía trước đình, phía sau bình phong Thần Hổ<br>- Miêu tả hiện vật: Bệ thờ Thần Nông được bố trí ngoài sân đình, phía sau bình phong Thần Hổ, mang đặc trưng thờ tự truyền thống Nam Bộ. Hai bên gắn đôi câu đối chữ Hán:<br>俎 豆 千 秋 因 校 稼<br>馨 香 萬 古 為 明 農<br>Phiên âm:<br>Trở đậu thiên thu, nhân giáo giá<br>Hinh hương vạn cổ, vị minh nông.<br>(Nghĩa:<br>Cúng tế ngàn năm vì được dạy gieo cấy<br>Thơm tho muôn thuở bởi nông nghiệp sáng ngời.)<br>- Giá trị hiện vật: Ngay từ buổi đầu hình thành làng xã, Thần Nông đã được đem vào đình làng thờ cùng với Thần Thành Hoàng Bổn Cảnh. Thông thường, bàn thờ Thần Nông được đặt trước sân đình, để lộ thiên, không mái che.<br>Ý niệm về Thần Nông không chỉ tồn tại trong tâm thức dân gian mà còn được các triều đại phong kiến coi trọng, bởi đời sống người dân gắn liền với nền nông nghiệp lúa nước.<br>Thần Nông là vị thần dạy dân cày cấy, gặt hái, giúp mùa màng tốt tươi, mang lại ấm no sung túc, nhờ vậy nghề nông phát đạt.",
    images: [image("AnhCacBanTho/THANNONG.JPG", "Miếu thờ Thần Nông", "Miếu thờ Thần Nông")]
  },
  {
    id: "mieu-tho-than",
    title: "Miếu thờ Thổ Thần",
    legacyPosition: { x: 2717000, y: 1232000 },
    position: legacyPosition(2717000, 1232000),
    period: "Không rõ (gắn với quá trình hình thành đình)",
    material: ["Miếu xi măng quét vôi trắng", "mái tôn"],
    physicalLocation: "Bên phải bàn thờ bình phong Thần Hổ, cạnh gốc cây Gừa cổ thụ",
    description:
      "Đây là một ngôi miếu nhỏ bằng xi măng, quét vôi trắng, mái tôn, nằm kề bên một gốc cây Gừa nhánh vươn cao, tán xòe rộng đã trên trăm năm tuổi. Hai bên miếu khắc câu đối chữ quốc ngữ. Bên trong miếu chạm các chữ Hán.",
    historicalValue:
      "Nội dung thờ đất đai sông nước. Theo truyền thống Á Đông, Thổ Thần được xem là vị thần cai quản, chăm nom, đem đến sự an lành cho đất đai, nhà cửa. Bàn thờ Thổ Thần luôn được đặt áp nền đất, mặt chính hướng ra cửa.",
    chineseText: ["五 方 五 土 龍 神"],
    transliteration: ["Ngũ phương ngũ thổ long thần"],
    translation: [
      "Trọn năm khỏe mạnh nhờ thần giúp",
      "Bốn mùa vinh sang cậy ở thánh hiền."
    ],
    legacyDescriptionHtml:
      "- Tên hiện vật: Miếu thờ Thổ Thần<br>- Niên đại: Không rõ (gắn với quá trình hình thành đình)<br>- Chất liệu: Miếu xi măng quét vôi trắng, mái tôn<br>- Vị trí: Bên phải bàn thờ bình phong Thần Hổ, cạnh gốc cây Gừa cổ thụ<br>- Miêu tả hiện vật: Đây là một ngôi miếu nhỏ bằng xi măng, quét vôi trắng, mái tôn, nằm kề bên một gốc cây Gừa nhánh vươn cao, tán xòe rộng đã trên trăm năm tuổi.<br>Hai bên miếu khắc câu đối chữ quốc ngữ:<br>Nhất niên thanh thới bằng thần hổ<br>Tứ quý vinh hoa lạy thánh thần<br>Phiên nghĩa:<br>Trọn năm khỏe mạnh nhờ thần giúp<br>Bốn mùa vinh sang cậy ở thánh hiền.<br>Bên trong miếu chạm các chữ Hán:<br>五 方 五 土 龍 神<br>Phiên âm:<br>Ngũ phương ngũ thổ long thần<br>- Giá trị hiện vật: Nội dung thờ đất đai sông nước. Theo truyền thống Á Đông, Thổ Thần được xem là vị thần cai quản, chăm nom, đem đến sự an lành cho đất đai, nhà cửa. Bàn thờ Thổ Thần luôn được đặt áp nền đất, mặt chính hướng ra cửa.",
    images: [image("AnhCacBanTho/THOTHAN.JPG", "Miếu thờ Thổ Thần", "Miếu thờ Thổ Thần")]
  },
  {
    id: "nha-tho-chu-tich-ho-chi-minh",
    title: "Nhà thờ Chủ tịch Hồ Chí Minh",
    legacyPosition: { x: 1632000, y: 1604800 },
    position: legacyPosition(1632000, 1604800),
    description: "Đây là Nhà thờ Chủ tịch Hồ Chí Minh và trưng bày tiểu sử về Bác",
    legacyDescriptionHtml: "Đây là Nhà thờ Chủ tịch Hồ Chí Minh và trưng bày tiểu sử về Bác",
    images: [
      image("AnhHCM/HCM1.JPG", "Nhà thờ Chủ tịch Hồ Chí Minh 1", "Nhà thờ Chủ tịch Hồ Chí Minh"),
      image("AnhHCM/HCM2.JPG", "Nhà thờ Chủ tịch Hồ Chí Minh 2", "Không gian trưng bày"),
      image("AnhHCM/HCM3.JPG", "Nhà thờ Chủ tịch Hồ Chí Minh 3", "Tư liệu trưng bày"),
      image("AnhHCM/HCM4.JPG", "Nhà thờ Chủ tịch Hồ Chí Minh 4", "Không gian tưởng niệm"),
      image("AnhHCM/HCM5.JPG", "Nhà thờ Chủ tịch Hồ Chí Minh 5", "Hình ảnh tư liệu")
    ]
  }
];

export const phuXuanMap: MapData = {
  id: "phu-xuan",
  slug: "dinh-phu-xuan",
  title: "Công trình số hóa thông tin di tích kiến trúc nghệ thuật Đình Phú Xuân",
  shortTitle: "Đình Phú Xuân",
  description:
    "Bản đồ số hóa di tích kiến trúc nghệ thuật Đình Phú Xuân, tổ chức các vị trí thờ tự, hiện vật và hình ảnh tư liệu theo không gian đình làng Nam Bộ.",
  mapImage: "map.jpg",
  media: {
    provider: "cloudinary"
  },
  mapWidth: 2000,
  mapHeight: 1600,
  intrinsicMapWidth: 2000,
  intrinsicMapHeight: 1646,
  geographicLocation: {
    latitude: 10.69838,
    longitude: 106.73501,
    address: "Đường Huỳnh Tấn Phát, xã Nhà Bè, TP.HCM",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=10.69838%2C106.73501"
  },
  locations,
  infoSections: [
    {
      id: "lich-su",
      title: "Lịch sử hình thành và Vị trí",
      body: [
        "Đình Phú Xuân là một trong các danh thắng nổi tiếng tại Nhà Bè, được thành lập vào năm Canh Tý (1900). Tính đến nay, đình đã có tuổi đời hơn 100 năm.",
        "Đình tọa lạc trên một khuôn viên rộng khoảng 770m2, nằm bình yên bên dòng Rạch Đôi với nhiều cây xanh lâu năm rợp bóng mát."
      ]
    },
    {
      id: "kien-truc",
      title: "Giá trị Kiến trúc",
      body: [
        "Trải qua hơn một thế kỷ, Đình Phú Xuân không chỉ là cơ sở tín ngưỡng dân gian mà còn là nơi lưu giữ những giá trị kiến trúc tiêu biểu của Đình làng Nam Bộ.",
        "Phía trước đình là cổng Tam quan kiên cố bằng bê tông cốt thép, phía trên đắp nổi ba chữ “Đình Phú Xuân” bằng gốm tinh xảo. Về mặt kiến trúc, đình được cấu trúc theo trục dọc, bao gồm hai khối nhà chính là Tiền điện và Chính điện nối liền với nhau."
      ]
    },
    {
      id: "le-hoi",
      title: "Các Lễ hội thường niên",
      body: [
        "Hằng năm, đình là nơi quy tụ bá tánh thập phương về dâng lễ để tưởng nhớ các bậc tiền hiền đã có công khai phá lập làng. Các dịp lễ chính bao gồm:"
      ],
      items: [
        "Lễ Kỳ Yên (16/02 Âm lịch): Lễ cầu an lớn nhất trong năm.",
        "Lễ Cầu Bông (16/10 Âm lịch): Cầu mưa thuận gió hòa, mùa màng bội thu, quốc thái dân an.",
        "Các tiểu lễ khác: Cúng rằm (15/1 và 16/7), Tết Đoan Ngọ (5/5 Âm lịch), Lễ đưa Thần (25 và 30 tháng Chạp)."
      ]
    }
  ],
  galleries: [
    {
      id: "temple-images",
      title: "Hình Ảnh Đình Thần",
      description: "Bộ ảnh tư liệu không gian Đình Phú Xuân.",
      images: hinhAnhDinhThan
    },
    {
      id: "activities",
      title: "Hình Ảnh Các Hoạt Động",
      description: "Bộ ảnh các hoạt động diễn ra tại Đình Phú Xuân.",
      images: hinhAnhHoatDong
    }
  ],
  sourceCredit:
    "Thiết kế và phát triển bởi Khoa Công nghệ Thông tin, Trường Đại học Mở TP.HCM."
};
