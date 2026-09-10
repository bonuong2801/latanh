export const appData = {
  oldMemories: {
    title: "Ký ức ngày xưa",
    description: "Những năm tháng không thể nào quên",
    // Khi bạn đã tải nhạc vào public/music/old.mp3, hãy đổi dòng dưới thành: musicUrl: "/music/old.mp3"
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", 
    pages: Array.from({ length: 29 }, (_, i) => ({
      id: `old-${i + 1}`,
      // Khi bạn đã tải ảnh vào public/photos/old/, hãy đổi dòng dưới thành: imageUrl: `/photos/old/${i + 1}.jpg`
      imageUrl: `https://picsum.photos/seed/memory${i + 1}/800/1000`, 
      caption: ""
    }))
  },
  currentMoments: {
    title: "Khoảnh khắc hiện tại",
    description: "Viết tiếp những kỷ niệm đẹp",
    // Khi bạn đã tải nhạc vào public/music/new.mp3, hãy đổi dòng dưới thành: musicUrl: "/music/new.mp3"
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
    pages: Array.from({ length: 32 }, (_, i) => ({
      id: `new-${i + 1}`,
      // Khi bạn đã tải ảnh vào public/photos/new/, hãy đổi dòng dưới thành: imageUrl: `/photos/new/${i + 1}.jpg`
      imageUrl: `https://picsum.photos/seed/moment${i + 1}/800/1000`, 
      caption: ""
    }))
  }
};
