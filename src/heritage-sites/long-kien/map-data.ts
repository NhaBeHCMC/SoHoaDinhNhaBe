import type { MapData, MapImage, MapLocation } from "@/types/map";

export const LONG_KIEN_SOURCE_MARKER_COUNT = 9;

function imagePosition(x: number, yFromTop: number) {
  return {
    x: x / 1280,
    y: 1 - yFromTop / 989
  };
}

function image(src: string, alt: string, caption?: string): MapImage {
  return { src, alt, caption };
}

const templeImages: MapImage[] = Array.from({ length: 16 }, (_, index) => {
  const photoNumber = index + 1;
  return image(
    `AnhDinh/dinh (${photoNumber}).JPG`,
    `Hình ảnh Đình Long Kiển ${photoNumber}`,
    `Hình ảnh Đình Long Kiển ${photoNumber}`
  );
});

const activityImages: MapImage[] = Array.from({ length: 12 }, (_, index) => {
  const photoNumber = index + 1;
  return image(
    `AnhHoatDong/AnhHoatDong (${photoNumber}).jpg`,
    `Hình ảnh hoạt động tại Đình Long Kiển ${photoNumber}`,
    `Hình ảnh hoạt động ${photoNumber}`
  );
});

const locations: MapLocation[] = [
  {
    id: "chanh-dien",
    title: "Chánh điện",
    legacyPosition: { x: 1996000, y: 1625600 },
    position: imagePosition(835, 405),
    description: "Chánh điện Đình Long Kiển.",
    images: [image("AnhCacBanTho/CHANHDIEN.JPG", "Chánh điện Đình Long Kiển", "Chánh điện")]
  },
  {
    id: "huu-ban",
    title: "Hữu Ban",
    legacyPosition: { x: 1664455, y: 2242618 },
    position: imagePosition(565, 185),
    description:
      "Bài vị đặt trên bàn thờ Hữu Ban. Tả Ban và Hữu Ban là hai ban thờ các vị thần, thần tướng có nhiệm vụ hầu cận, hộ vệ và phụ tá Thành Hoàng Bổn Cảnh. Trong không gian thờ tự đình làng Nam Bộ, Tả Ban và Hữu Ban thường được bố trí hai bên ban thờ Thành Hoàng, thể hiện trật tự và sự tôn nghiêm của thần điện.",
    chineseText: ["右 班"],
    transliteration: ["Hữu ban"],
    images: [image("AnhCacBanTho/HUUBAN.JPG", "Bài vị Hữu Ban", "Hữu Ban")]
  },
  {
    id: "than-hoang-bon-canh",
    title: "Thần Hoàng Bổn Cảnh",
    legacyPosition: { x: 2170000, y: 2340000 },
    position: imagePosition(720, 185),
    description:
      "Thần Hoàng Bổn Cảnh là vị thần được nhân dân địa phương tôn kính, thờ phụng tại Đình Thần Long Kiển. Theo sắc phong triều Nguyễn, vua Tự Đức năm thứ 5 (1847) đã ban sắc phong cho vị thần với mỹ hiệu Quảng Hậu. Sắc ghi nhận Thần là bậc ngay thẳng, hiền hậu, linh ứng, có công phù hộ, che chở và bảo vệ nhân dân.",
    historicalValue:
      "Việc thờ phụng Thần Hoàng Bổn Cảnh thể hiện truyền thống “uống nước nhớ nguồn”, lòng biết ơn của cộng đồng đối với vị thần được tin là đã phù hộ quốc thái dân an, bảo vệ xóm làng, đem lại cuộc sống bình an, thuận hòa cho nhân dân. Sắc phong năm Tự Đức thứ 5 (1847) hiện là một tư liệu quý, góp phần minh chứng cho lịch sử tín ngưỡng và đời sống văn hóa của cộng đồng tại địa phương.",
    chineseText: ["神"],
    transliteration: ["Thần"],
    notes: ["Chính khí hộ dân – Linh thần phù quốc. Tôn kính Thành Hoàng – Gìn giữ hồn quê."],
    images: [
      image("AnhCacBanTho/THANHOANG.JPG", "Bài vị Thần Hoàng Bổn Cảnh", "Thần Hoàng Bổn Cảnh")
    ]
  },
  {
    id: "ta-ban",
    title: "Tả Ban",
    legacyPosition: { x: 2693000, y: 2225600 },
    position: imagePosition(875, 185),
    description:
      "Bài vị đặt trên bàn thờ Tả Ban. Tả Ban và Hữu Ban là hai ban thờ các vị thần, thần tướng có nhiệm vụ hầu cận, hộ vệ và phụ tá Thành Hoàng Bổn Cảnh. Trong không gian thờ tự đình làng Nam Bộ, Tả Ban và Hữu Ban thường được bố trí hai bên ban thờ Thành Hoàng, thể hiện trật tự và sự tôn nghiêm của thần điện.",
    chineseText: ["左 班"],
    transliteration: ["Tả ban"],
    images: [image("AnhCacBanTho/TABAN.JPG", "Bài vị Tả Ban", "Tả Ban")]
  },
  {
    id: "tien-hien",
    title: "Tiền Hiền",
    legacyPosition: { x: 2720000, y: 1887200 },
    position: imagePosition(885, 285),
    description:
      "Bài vị đặt trên bàn thờ Tiền Hiền. Đây là nơi tưởng niệm những bậc tiền nhân có công với làng, với đất và với cộng đồng. Tiền Hiền là những người có công khai khẩn, góp phần mở mang vùng đất, hình thành làng xóm.",
    chineseText: ["前 賢"],
    transliteration: ["Tiền Hiền"],
    images: [image("AnhCacBanTho/TIENHIEN.JPG", "Bài vị Tiền Hiền", "Tiền Hiền")]
  },
  {
    id: "hau-hien",
    title: "Hậu Hiền",
    legacyPosition: { x: 1644000, y: 1904000 },
    position: imagePosition(555, 285),
    description:
      "Bài vị đặt trên bàn thờ Hậu Hiền. Đây là nơi tưởng niệm những bậc tiền nhân có công với làng, với đất và với cộng đồng. Hậu Hiền là những người có công khai cơ, xây dựng và phát triển cộng đồng về sau.",
    chineseText: ["後 賢"],
    transliteration: ["Hậu Hiền"],
    images: [image("AnhCacBanTho/HAUHIEN.JPG", "Bài vị Hậu Hiền", "Hậu Hiền")]
  },
  {
    id: "cung-quan-thanh",
    title: "Miếu thờ Cung Quan Thánh",
    legacyPosition: { x: 694000, y: 1163200 },
    position: imagePosition(365, 615),
    description:
      "Quan Thánh, thường được hiểu là Quan Thánh Đế Quân (Quan Công), là biểu tượng của lòng trung nghĩa, chính trực, tín nghĩa và khí tiết. Việc phụng thờ Quan Thánh thể hiện mong muốn con người biết giữ đạo nghĩa, sống ngay thẳng, trọng chữ tín và hướng đến những giá trị tốt đẹp. Trong một số không gian tín ngưỡng Nam Bộ, Quan Công cũng được phối tự cùng các vị thần khác trong hệ thống thờ tự.",
    images: [
      image("AnhCacBanTho/CUNGQUANTHANH.JPG", "Miếu thờ Cung Quan Thánh", "Cung Quan Thánh")
    ]
  },
  {
    id: "ong-ho",
    title: "Miếu thờ Ông Hổ",
    legacyPosition: { x: 1800000, y: 879200 },
    position: imagePosition(660, 625),
    description: "Miếu thờ Ông Hổ trong khuôn viên Đình Long Kiển.",
    images: [image("AnhCacBanTho/ONGHO.JPG", "Miếu thờ Ông Hổ", "Miếu thờ Ông Hổ")]
  },
  {
    id: "ban-tho-bac-ho",
    title: "Bàn thờ Bác Hồ",
    legacyPosition: { x: 2392000, y: 2330400 },
    position: imagePosition(720, 235),
    description: "Bàn thờ Chủ tịch Hồ Chí Minh tại Đình Long Kiển.",
    images: [image("AnhCacBanTho/HCM.JPG", "Bàn thờ Bác Hồ", "Bàn thờ Bác Hồ")]
  }
];

export const longKienMap: MapData = {
  id: "long-kien",
  slug: "dinh-long-kien",
  title: "Công trình số hóa thông tin di tích kiến trúc nghệ thuật Đình Long Kiển",
  shortTitle: "Đình Long Kiển",
  description:
    "Bản đồ số hóa Đình Long Kiển với các không gian thờ tự, hiện vật và bộ ảnh tư liệu được trình bày trong cùng hệ giao diện di sản xã Nhà Bè.",
  mapImage: "map.jpg",
  media: {
    provider: "cloudinary",
    assetFolder: "nha-be/di-tich-long-kien",
    deliveryVersion: 1787658101
  },
  mapWidth: 1280,
  mapHeight: 989,
  intrinsicMapWidth: 1280,
  intrinsicMapHeight: 989,
  geographicLocation: {
    latitude: 10.6973805,
    longitude: 106.7060156,
    address: "Hẻm 1243/22 Lê Văn Lương, Ấp 21, xã Nhà Bè, TP.HCM",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=10.6973805%2C106.7060156"
  },
  locations,
  infoSections: [
    {
      id: "lich-su",
      title: "Lịch sử hình thành",
      body: [
        "Đình được xây dựng vào thời kỳ người lưu dân đến khai hoang, mở cõi tại vùng đất cù lao ven sông nước Phước Kiển.",
        "Đình lấy tên theo làng cũ Long Kiểng, sau này hợp nhất với làng Phước Long Đông thành xã Phước Kiển, nay là xã Nhà Bè, TP.HCM.",
        "Đình thờ thần Thành Hoàng Bổn Cảnh làm vị thần chính bảo hộ cho xóm làng mưa thuận gió hòa, cuộc sống bình an.",
        "Đình kết hợp thờ các vị Tiền hiền, Hậu hiền — những người có công khai hoang, lập làng — cùng tín ngưỡng đặc trưng ngoại thành như Bạch Mã Thái Giám và linh thần vùng sông nước."
      ]
    },
    {
      id: "kien-truc",
      title: "Giá trị kiến trúc",
      body: [
        "Đình mang phong cách kiến trúc đình làng Nam Bộ điển hình, gồm cổng đình, sân đình với bình phong, miếu thờ Thần Nông hoặc Bà Ngũ Hành và khu nhà chính điện.",
        "Cấu trúc nhà ba gian hai chái, mái lợp ngói âm dương. Hệ thống rường cột, rui mè chịu lực đơn giản, phù hợp với điều kiện kinh tế dân gian ngoại thành cũ.",
        "Gian chính điện bài trí trang nghiêm với các khánh thờ bằng gỗ, hoành phi và câu đối sơn son thếp vàng miêu tả công đức của thần linh và ước vọng của người dân."
      ]
    },
    {
      id: "le-hoi",
      title: "Lễ hội và hoạt động thường niên",
      body: [
        "Lễ hội Kỳ Yên, hay Cúng Đình, là lễ hội lớn nhất năm, thường diễn ra vào tháng Giêng hoặc tháng Hai âm lịch; lịch cụ thể thay đổi linh hoạt tùy ban tế tự tổ chức.",
        "Các nghi thức cốt lõi gồm lễ Túc Yết, lễ Chánh Tế để dâng hương, trà, rượu lên Thần Hoàng; tiếp đó là nghi thức tưởng nhớ các bậc tiền nhân khẩn hoang và cầu an cho bá tánh."
      ]
    }
  ],
  galleries: [
    {
      id: "temple-images",
      title: "Hình ảnh Đình Thần",
      description: "Bộ ảnh tư liệu không gian Đình Long Kiển.",
      images: templeImages
    },
    {
      id: "activities",
      title: "Hình ảnh các hoạt động",
      description: "Bộ ảnh các hoạt động diễn ra tại Đình Long Kiển.",
      images: activityImages
    }
  ],
  sourceCredit:
    "Thiết kế và phát triển bởi Khoa Công nghệ Thông tin, Trường Đại học Mở TP.HCM."
};
