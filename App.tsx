
import React, { useState, useEffect } from 'react';
import { Post } from './types.ts';
import { AUTHOR_IMAGE, AUTHOR_NAME, INITIAL_POST_CONTENT, APP_NAME } from './constants.ts';
import PostCard from './components/PostCard.tsx';
import { generateTimedMessage } from './services/geminiService.ts';

const STORAGE_KEY = 'spacetramoya_posts_v4';
const LAST_GEN_KEY = 'spacetramoya_last_gen_window';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const now = new Date();
      const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Caracas Post
      const caracasStagePost: Post = {
        id: 'caracas-stage-' + Date.now(),
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: timeStr,
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

      // Bangkok Press Conference Post with Video
      const pressConferencePost: Post = {
        id: 'press-conf-' + Date.now(),
        authorName: AUTHOR_NAME,
        authorUsername: '@SpaceTramoyaX',
        authorImage: AUTHOR_IMAGE,
        isVerified: true,
        timestamp: "29/12/2024 19:50",
        content: "¡HISTÓRICO! 👑✨ Directamente desde la cosmopolita ciudad de Bangkok, se ha llevado a cabo con éxito la primera conferencia de prensa oficial de Miss Slam Thailand y Miss Slam Venezuela. 🇹🇭🇻🇪\n\nAmbas soberanas deslumbraron a la prensa internacional con una pasarela impecable y una oratoria que demuestra por qué son las máximas favoritas de esta edición. ¡La tramoya apenas comienza en tierras asiáticas! 💎🌏 #MissSlam #Bangkok #GrandSlam",
        videoEmbed: '<div style="position:relative; width:100%; height:0px; padding-bottom:68.519%"><iframe allow="fullscreen" allowfullscreen height="100%" src="https://streamable.com/e/7kw6bf?" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"></iframe></div>',
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
        timestamp: "28/12/2024 08:00",
        content: INITIAL_POST_CONTENT,
        likes: 124,
        comments: 0,
      };

      const initialBatch = [caracasStagePost, pressConferencePost, welcomePost];
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
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <i className="fa-solid fa-crown text-white"></i>
            </div>
            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase">
              {APP_NAME}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src={AUTHOR_IMAGE} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-indigo-500 object-cover" 
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Flash Informativo
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Lo último de la belleza virtual directo a tu pantalla.
          </p>
        </div>

        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
