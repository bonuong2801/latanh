import { useState, useEffect, memo } from 'react';

type Page = {
  id: string;
  imageUrl: string;
  caption: string;
};

const Flipbook = memo(function Flipbook({ pages, theme }: { pages: Page[], theme: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < pages.length) {
      setActiveIndex(prev => prev + 1); // Vuốt sang trái -> lật trang tiếp theo
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(prev => prev - 1); // Vuốt sang phải -> lật trang trước đó
    }
  };
  
  // Reset trang về 0 khi chuyển tab
  useEffect(() => {
    setActiveIndex(0);
  }, [pages]);

  return (
    <div 
      className="relative w-full max-w-sm md:max-w-4xl aspect-[3/4] md:aspect-[8/5] mx-auto perspective-1500 mt-4 mb-8"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndEvent}
    >
      
      {/* Desktop base covers (Phần bìa sách tĩnh ở dưới) - Ẩn trên mobile */}
      <div className="hidden md:block absolute top-0 left-0 w-1/2 h-full bg-[#f4f1ea] rounded-l-lg border-l-2 border-y-2 border-neutral-300 shadow-xl z-0" />
      <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full bg-[#f4f1ea] rounded-r-lg border-r-2 border-y-2 border-neutral-300 shadow-xl z-0" />
      {/* Bóng của gáy sách - Ẩn trên mobile */}
      <div className="hidden md:block absolute inset-y-0 left-1/2 w-4 -ml-2 bg-gradient-to-r from-black/10 via-black/5 to-transparent z-0" />

      {/* Mobile base cover (Dạng 1 thẻ bài duy nhất) */}
      <div className="md:hidden absolute top-0 left-0 w-full h-full bg-[#f4f1ea] rounded-lg border-2 border-neutral-300 shadow-xl z-0" />

      {pages.map((page, index) => {
        // Tối ưu hoá hiệu năng (DOM Culling): 
        // Chỉ render các trang kề sát trang hiện tại để tránh việc trình duyệt phải xử lý hàng tá DOM node ẩn
        if (Math.abs(index - activeIndex) > 3) return null;

        const isFlipped = index < activeIndex;

        return (
          <div
            key={page.id}
            className={`absolute top-0 right-0 w-full md:w-1/2 h-full transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] preserve-3d cursor-pointer drop-shadow-md hover:drop-shadow-xl
              md:origin-left origin-center will-change-transform transform-gpu
            `}
            style={{
              zIndex: isFlipped ? index + 10 : pages.length - index + 10,
              transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => {
              if (isFlipped) setActiveIndex(index); // Lật lại
              else setActiveIndex(index + 1); // Lật đi
            }}
          >
            {/* MẶT TRƯỚC (Hình ảnh & Caption kiểu Polaroid) */}
            <div className="absolute inset-0 backface-hidden bg-[#faf8f5] p-4 md:p-6 rounded-lg md:rounded-l-none md:rounded-r-lg border border-neutral-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] flex flex-col items-center">
              {/* Overlay tạo chất liệu giấy nhẹ */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

              {/* Khung ảnh */}
              <div className={`w-full h-full bg-white p-3 md:p-4 shadow-md border border-neutral-100 relative flex items-center justify-center ${theme === 'old' ? 'sepia-[0.3] contrast-75' : ''}`}>
                <img src={page.imageUrl} alt={page.caption} loading="lazy" decoding="async" className="w-full h-full object-contain rounded-sm pointer-events-none mix-blend-multiply" />
              </div>

              {/* Bóng uốn cong ở gáy sách (chỉ hiện trên Desktop) */}
              <div className="hidden md:block absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* MẶT SAU 
                Trên Desktop: Trang giấy trắng có texture. 
                Trên Mobile: Trong suốt để khi lật sẽ ẩn đi hoàn toàn, lộ ra thẻ bên dưới.
            */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 md:bg-[#f4f1ea] bg-transparent p-4 md:p-6 rounded-l-lg border-r border-neutral-200 pointer-events-none md:pointer-events-auto">
                <div className="hidden md:flex w-full h-full flex-col">
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                  <div className="w-full h-full border-2 border-dashed border-neutral-300 rounded flex items-center justify-center opacity-40">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                  </div>
                  {/* Bóng đổ gáy sách phía bên trái */}
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default Flipbook;
