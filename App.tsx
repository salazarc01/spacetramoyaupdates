
import React, { useState, useEffect } from 'react';
import { Post } from './types';
import { AUTHOR_IMAGE, AUTHOR_NAME, INITIAL_POST_CONTENT, APP_NAME, CANDIDATES } from './constants';
import PostCard from './components/PostCard';
import CandidateCarousel from './components/CandidateCarousel';
import { generateTimedMessage } from './services/geminiService';

const STORAGE_KEY = 'spacetramoya_posts_v11';
const LAST_GEN_KEY = 'spacetramoya_last_gen_window_v11';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  const getCurrentTime = (offsetMinutes: number = 0) => {
    const now = new Date(Date.now() - offsetMinutes * 60000);
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY);
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        throw new Error("No hay datos guardados");
      }
    } catch (e) {
      const postMerida: Post = {
        id: 'merida-post',
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: getCurrentTime(0),
        content: "MÉRIDA - Ileana Márquez\n\nPresentamos oficialmente a la espectacular Ileana Márquez como candidata oficial a la 8va edición del Miss Slam Thailand & Venezuela. Una belleza imponente que promete dejar el nombre de su estado en lo más alto del Grand Slam. ¡Bienvenida a la contienda! 👑💎 #MissSlam #Merida #Venezuela #IleanaMarquez",
        images: ["https://i.postimg.cc/SsnSHdq6/1768404575947.png"],
        likes: 8520,
        hasLiked: false,
        comments: 0,
      };

      const postSaraburi: Post = {
        id: 'saraburi-post',
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: getCurrentTime(10),
        content: "SARABURI - Praveenar Singh\n\nAnunciamos con orgullo a la deslumbrante Praveenar Singh como candidata oficial a la 8va edición del Miss Slam Thailand & Venezuela. Su elegancia y porte internacional la convierten desde ya en una de las máximas rivales a vencer en esta edición. 👑🌏 #MissSlam #Saraburi #Thailand #PraveenarSingh",
        images: ["https://i.postimg.cc/gJ2d8DrS/1768404575924.png"],
        likes: 9140,
        hasLiked: false,
        comments: 0,
      };

      const welcomePost: Post = {
        id: 'initial-post',
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: getCurrentTime(1440),
        content: INITIAL_POST_CONTENT,
        likes: 124,
        hasLiked: false,
        comments: 0,
      };

      const initialBatch = [postMerida, postSaraburi, welcomePost];
      setPosts(initialBatch);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBatch));
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0 && window.location.hash) {
      const id = window.location.hash.substring(1);
      
      const attemptScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return true;
        }
        return false;
      };

      if (!attemptScroll()) {
        const observer = new MutationObserver(() => {
          if (attemptScroll()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 3000);
      }
    }
  }, [posts]);

  const handleToggleLike = (id: string) => {
    setPosts(prev => {
      const updated = prev.map(post => {
        if (post.id === id) {
          const isLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const checkAndGenerate = async () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDateStr = now.toISOString().split('T')[0];
      
      let windowId = '';
      let type: 'morning' | 'evening' | null = null;

      if (currentHour >= 6 && (currentHour < 18 || (currentHour === 18 && currentMinute < 30))) {
        windowId = `${currentDateStr}-morning`;
        type = 'morning';
      } 
      else if ((currentHour === 18 && currentMinute >= 30) || currentHour > 18 || currentHour < 6) {
        const labelDate = currentHour < 6 ? new Date(now.getTime() - 86400000).toISOString().split('T')[0] : currentDateStr;
        windowId = `${labelDate}-evening`;
        type = 'evening';
      }

      const lastGen = localStorage.getItem(LAST_GEN_KEY);

      if (type && lastGen !== windowId) {
        const message = await generateTimedMessage(type);
        const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newPost: Post = {
          id: 'gen-' + Date.now(),
          authorName: AUTHOR_NAME,
          authorUsername: '@SpaceTramoyaX',
          authorImage: AUTHOR_IMAGE,
          isVerified: true,
          timestamp,
          content: message,
          likes: Math.floor(Math.random() * 50) + 10,
          hasLiked: false,
          comments: 0,
        };

        setPosts(prev => {
          const updated = [newPost, ...prev];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        localStorage.setItem(LAST_GEN_KEY, windowId);
      }
    };

    const interval = setInterval(checkAndGenerate, 60000);
    return () => clearInterval(interval);
  }, [posts.length]);

  return (
    <div className={`min-h-screen font-sans text-slate-100 flex flex-col items-center ${showCarousel ? 'h-screen overflow-hidden' : ''}`}>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-indigo-500/20 shadow-2xl h-14 md:h-16">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between relative">
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-indigo-600 transition-all text-white active:scale-90"
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-12 left-0 w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 animate-fade-in z-[110]">
                <button 
                  onClick={() => {
                    setShowCarousel(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-4 hover:bg-indigo-600/20 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-crown text-xs"></i>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-left leading-tight text-slate-100">
                    candidatas <br/> Miss Slam ThaiVen 8th
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/40 border border-white/10">
              <i className="fa-solid fa-crown text-white text-xs md:text-sm"></i>
            </div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent uppercase">
              {APP_NAME}
            </h1>
          </div>

          <div>
             <img 
              src={AUTHOR_IMAGE} 
              alt="Profile" 
              className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-indigo-500 object-cover shadow-lg" 
            />
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <main className="flex-1 max-w-[500px] w-full px-3 pt-24 pb-10">
        <div className="mb-10 text-center animate-fade-in">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">
            Últimas <span className="text-indigo-500">Primicias</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-3 rounded-full shadow-lg shadow-indigo-500/40"></div>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-4 font-bold">Cobertura Exclusiva SpaceTramoya</p>
        </div>

        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>

        <footer className="mt-20 pb-8 text-center text-slate-500 text-[10px] uppercase tracking-widest leading-loose">
          <div className="flex justify-center space-x-4 mb-4 opacity-50">
            <i className="fa-brands fa-instagram text-lg"></i>
            <i className="fa-brands fa-x-twitter text-lg"></i>
            <i className="fa-brands fa-tiktok text-lg"></i>
          </div>
          <p>© 2024 Spacetramoya Updates</p>
          <p>La cuna del Grand Slam Virtual</p>
        </footer>
      </main>

      {showCarousel && (
        <CandidateCarousel 
          candidates={CANDIDATES} 
          onClose={() => setShowCarousel(false)} 
        />
      )}
    </div>
  );
};

export default App;