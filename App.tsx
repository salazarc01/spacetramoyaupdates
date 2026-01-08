
import React, { useState, useEffect } from 'react';
import { Post } from './types';
import { AUTHOR_IMAGE, AUTHOR_NAME, INITIAL_POST_CONTENT, APP_NAME } from './constants';
import PostCard from './components/PostCard';
import { generateTimedMessage } from './services/geminiService';

const STORAGE_KEY = 'spacetramoya_posts_v5';
const LAST_GEN_KEY = 'spacetramoya_last_gen_window_v5';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const getCurrentTime = (offsetMinutes: number = 0) => {
    const now = new Date(Date.now() - offsetMinutes * 60000);
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const newStagePost: Post = {
        id: 'new-stage-' + Date.now(),
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: getCurrentTime(0),
        content: "¡PRIMICIA! 💎 El fastuoso escenario para la segunda conferencia de prensa del Miss Slam Thailand & Venezuela ya se encuentra totalmente listo. Un diseño vanguardista que fusiona lo mejor de ambas culturas para recibir a nuestras reinas. ¡La cuenta regresiva ha comenzado! 👑🇹🇭🇻🇪 #MissSlam #Escenario #Primicia #Thailand #Venezuela",
        images: ["https://i.postimg.cc/V6kqvWYz/a4fc0e76-0b45-427f-93c9-a2b1155e8f9b.jpg"],
        videoEmbed: '<div style="position:relative; width:100%; height:0px; padding-bottom:68.519%"><iframe allow="fullscreen;autoplay" allowfullscreen height="100%" src="https://streamable.com/e/3ygyn0?autoplay=1" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"></iframe></div>',
        likes: 7420,
        comments: 0,
      };

      const caracasStagePost: Post = {
        id: 'caracas-stage-' + Date.now(),
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: getCurrentTime(30),
        content: "¡PRIMICIA EXCLUSIVA! 🇻🇪✨ Tras el éxito arrollador en Bangkok, la emoción se traslada a la vibrante capital de Venezuela. \n\nPresentamos las primeras imágenes del majestuoso escenario que recibirá la segunda rueda de prensa del Miss Slam Thailand & Venezuela. Caracas se viste de gala para recibir a las reinas en un despliegue de tecnología, luces y elegancia sin precedentes. ¡El orgullo venezolano brilla en cada detalle de este templo del glamour! 💎🏛️ #MissSlam #Caracas #Primicia #Venezuela #GrandSlam",
        images: [
          "https://i.postimg.cc/MGs3KTyS/4d271291-7e24-4110-8d9c-bff4ba1943ba.jpg",
          "https://i.postimg.cc/fWSqDMkb/7794b1ab-d7b4-4477-bb77-bf77789b47fb.jpg",
          "https://i.postimg.cc/K8fJJzp1/7b2f5a3e-ea2a-4aaf-a9af-f251857fad9a.jpg",
          "https://i.postimg.cc/fWSqDMkb/7794b1ab-d7b4-4477-bb77-bf77789b47fb.jpg"
        ],
        likes: 5120,
        comments: 0,
      };

      const pressConferencePost: Post = {
        id: 'press-conf-' + Date.now(),
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: getCurrentTime(120),
        content: "¡HISTÓRICO! 👑✨ Directamente desde la cosmopolita ciudad de Bangkok, se ha llevado a cabo con éxito la primera conferencia de prensa oficial de Miss Slam Thailand y Miss Slam Venezuela. 🇹🇭🇻🇪\n\nAmbas soberanas deslumbraron a la prensa internacional con una pasarela impecable y una oratoria que demuestra por qué son las máximas favoritas de esta edición. ¡La tramoya apenas comienza en tierras asiáticas! 💎🌏 #MissSlam #Bangkok #GrandSlam",
        videoEmbed: '<div style="position:relative; width:100%; height:0px; padding-bottom:68.519%"><iframe allow="fullscreen;autoplay" allowfullscreen height="100%" src="https://streamable.com/e/7kw6bf?autoplay=1" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"></iframe></div>',
        images: [
          "https://i.postimg.cc/L6TXXK0W/e6759c4f-9109-45a1-980b-2d6483a821a3.jpg",
          "https://i.postimg.cc/pX2W3cXf/72b76f5f-7032-4e39-8d75-07aab4ba6433.jpg",
          "https://i.postimg.cc/Dzbn1t5Y/7cf59376-30a9-4104-99f0-c00448a9a5a3.jpg",
          "https://i.postimg.cc/1XySh4Ps/9cdd6ad8-3d56-4888-8c10-a598e7b6ad99.jpg",
          "https://i.postimg.cc/dQnPZsw1/8f86cd2c-fe0e-4a30-9cd0-7b4157f1170f.jpg"
        ],
        likes: 2840,
        comments: 0,
      };

      const welcomePost: Post = {
        id: 'initial-' + Date.now(),
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: getCurrentTime(1440),
        content: INITIAL_POST_CONTENT,
        likes: 124,
        comments: 0,
      };

      const initialBatch = [newStagePost, caracasStagePost, pressConferencePost, welcomePost];
      setPosts(initialBatch);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBatch));
    }
  }, []);

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

    const interval = setInterval(checkAndGenerate, 30000);
    return () => clearInterval(interval);
  }, [posts.length]);

  return (
    <div className="min-h-screen font-sans text-slate-100 flex flex-col items-center">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-indigo-500/20 shadow-2xl h-14 md:h-16">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-center relative">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/40 border border-white/10">
              <i className="fa-solid fa-crown text-white text-xs md:text-sm"></i>
            </div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent uppercase">
              {APP_NAME}
            </h1>
          </div>

          <div className="absolute right-4">
             <img 
              src={AUTHOR_IMAGE} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-indigo-500 object-cover shadow-lg" 
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[500px] w-full px-3 pt-20 pb-10">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            Últimas Primicias
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-2 rounded-full shadow-lg shadow-indigo-500/40"></div>
          <p className="text-slate-400 text-[10px] mt-3 font-bold uppercase tracking-[0.2em]">
            Miss Slam Thailand & Venezuela
          </p>
        </div>

        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <footer className="mt-16 pb-8 text-center text-slate-500 text-[10px] uppercase tracking-widest leading-loose">
          <p>© 2024 Spacetramoya Updates</p>
          <p>La cuna del Grand Slam Virtual</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
