export const appData = {
  oldMemories: {
    title: "Ký ức ngày xưa",
    description: "Những năm tháng không thể nào quên",
    musicUrl: "/music/old.mp3",
    pages: Array.from({ length: 36 }, (_, i) => ({
      id: `old-${i + 1}`,
      imageUrl: `/photos/old/${i + 1}.jpg`,
      caption: ""
    }))
  },
  currentMoments: {
    title: "Khoảnh khắc hiện tại",
    description: "Viết tiếp những kỷ niệm đẹp",
    musicUrl: "/music/new.mp3",
    pages: Array.from({ length: 32 }, (_, i) => ({
      id: `new-${i + 1}`,
      imageUrl: `/photos/new/${i + 1}.${i < 24 ? "jpeg" : "jpg"}`,
      caption: ""
    }))
  }
};
