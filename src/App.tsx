import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Disc, Image as ImageIcon, Sparkles } from 'lucide-react';
import { appData } from './data';
import Flipbook from './components/Flipbook';

type Tab = 'old' | 'new';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('old');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTabSwitch = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  // Thiết lập src ban đầu và thử autoplay
  useEffect(() => {
    const startAudio = () => {
      if (!audioRef.current) return;

      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    };

    if (audioRef.current) {
      audioRef.current.src = appData.oldMemories.musicUrl;
      // Thử autoplay, trình duyệt có thể chặn nếu chưa có tương tác
      startAudio();
    }

    window.addEventListener('pointerdown', startAudio, { once: true });
    return () => window.removeEventListener('pointerdown', startAudio);
  }, []);

  // Tự động đổi nhạc khi chuyển tab
  useEffect(() => {
    if (audioRef.current) {
      const targetSrc = activeTab === 'old' ? appData.oldMemories.musicUrl : appData.currentMoments.musicUrl;
      
      // Chỉ gán lại src nếu nó thực sự thay đổi để tránh ngắt quãng request play()
      if (!audioRef.current.src.includes(targetSrc)) {
        audioRef.current.src = targetSrc;
        
        if (isPlaying) {
          audioRef.current.play().catch((e) => {
            console.error("Audio play failed:", e);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [activeTab, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => {
        console.error("Audio play failed:", e);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const currentData = activeTab === 'old' ? appData.oldMemories : appData.currentMoments;

  return (
    <div className="min-h-screen text-neutral-800 font-sans selection:bg-neutral-200 flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-100/50 via-purple-50/50 to-teal-100/50">
      
      {/* Decorative Blur Backgrounds for Glassmorphism Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 mix-blend-multiply filter blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-teal-300/30 mix-blend-multiply filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-300/30 mix-blend-multiply filter blur-[100px] pointer-events-none" />

      <audio ref={audioRef} loop />

      {/* Tiêu đề & Giới thiệu */}
      <header className="pt-12 pb-6 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-serif text-neutral-900 mb-4 tracking-tight"
        >
          Hành Trình Kỷ Niệm
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-500 max-w-lg mx-auto"
        >
          Lật giở từng trang sách để nhìn lại những khoảnh khắc đã qua và trân trọng những phút giây hiện tại.
        </motion.p>
      </header>

      {/* Thanh điều hướng (Tabs) & Nút nhạc ở vị trí trung tâm */}
      <div className="flex flex-col items-center justify-center gap-6 px-4 mb-8 z-20 relative">
        
        {/* Bộ chuyển đổi Tab (Glassmorphism) */}
        <div className="bg-white/40 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/50 flex items-center relative overflow-hidden">
          {/* Vùng chỉ báo Tab đang chọn (Indicator) */}
          <div
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/60 shadow-sm rounded-full transition-transform duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] border border-white/60"
            style={{
              transform: activeTab === 'old' ? 'translateX(0)' : 'translateX(100%)',
              left: '6px'
            }}
          />

          <button
            onClick={() => handleTabSwitch('old')}
            className={`relative z-10 px-6 py-2.5 text-sm font-medium rounded-full transition-colors duration-300 flex items-center gap-2 ${
              activeTab === 'old' ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Ký ức ngày xưa
          </button>
          
          <button
            onClick={() => handleTabSwitch('new')}
            className={`relative z-10 px-6 py-2.5 text-sm font-medium rounded-full transition-colors duration-300 flex items-center gap-2 ${
              activeTab === 'new' ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Khoảnh khắc hiện tại
          </button>
        </div>

        {/* Nút Nhạc (Glassmorphism & Đĩa than) */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/50 text-neutral-800 hover:bg-white/50 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/60 shadow-inner overflow-hidden border border-white/50">
            <Disc className={`w-5 h-5 text-neutral-800 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`} />
          </div>
          <span className="text-sm font-medium pr-2">
            {isPlaying ? 'Đang phát nhạc' : 'Nhạc đã tắt'}
          </span>
        </button>
      </div>

      {/* Khu vực Cuốn Sách */}
      <main className="flex-grow flex flex-col items-center px-4 md:px-8 pb-12 overflow-hidden z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif text-neutral-800">{currentData.title}</h2>
              <p className="text-sm text-neutral-500 italic mt-1">{currentData.description}</p>
            </div>
            
            <Flipbook pages={currentData.pages} theme={activeTab} />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="text-center py-6 text-xs text-neutral-400 mt-auto">
        Chạm vào trang sách để lật • Trải nghiệm tốt nhất khi bật âm thanh
      </footer>
    </div>
  );
}
