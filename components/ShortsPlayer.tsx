
import React from 'react';
import { Post } from '../types';

interface ShortsPlayerProps {
  posts: Post[];
  onClose: () => void;
}

const ShortsPlayer: React.FC<ShortsPlayerProps> = ({ posts, onClose }) => {
  if (posts.length === 0) return null;

  // Function to extract and clean the iframe from the wrapped div if necessary
  const prepareVideoHtml = (html: string) => {
    // If it's a streamable embed with the div wrapper, we clean the padding and make it full height
    let cleaned = html
      .replace(/padding-bottom:.*?;/g, 'height: 100%;') 
      .replace(/height:0px/g, 'height: 100%')
      .replace('<iframe', '<iframe style="height: 100%; width: 100%; border:none;" allow="autoplay; fullscreen"');
    
    // Ensure muted is present for reliable autoplay in most browsers
    if (cleaned.includes('autoplay=1') && !cleaned.includes('muted=1')) {
      cleaned = cleaned.replace('autoplay=1', 'autoplay=1&muted=1');
    }
    
    return cleaned;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[120] w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-all active:scale-90 shadow-2xl border border-white/20"
      >
        <i className="fa-solid fa-xmark text-2xl"></i>
      </button>

      {/* Snap Scroll Container */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {posts.map((post) => (
          <div key={post.id} className="h-full w-full snap-start relative flex flex-col justify-center items-center bg-black overflow-hidden">
            
            {/* Immersive Video Container */}
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="w-full h-full max-h-screen"
                dangerouslySetInnerHTML={{ 
                  __html: prepareVideoHtml(post.videoEmbed || '') 
                }} 
              />
            </div>

            {/* Subtle Gradient Overlay for Text Readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-20 text-white pointer-events-none max-w-lg mx-auto md:mx-0">
              <div className="flex items-center space-x-3 mb-4 pointer-events-auto">
                <img 
                  src={post.authorImage} 
                  alt={post.authorName} 
                  className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-black text-sm uppercase tracking-tighter text-indigo-100">{post.authorName}</h3>
                    {post.isVerified && <i className="fa-solid fa-circle-check text-blue-400 text-xs"></i>}
                  </div>
                  <p className="text-[10px] text-slate-300 font-bold opacity-70 uppercase tracking-widest">{post.timestamp}</p>
                </div>
              </div>
              
              <div className="pointer-events-auto">
                <p className="text-[13px] md:text-sm line-clamp-2 leading-relaxed font-semibold text-slate-5 drop-shadow-lg pr-12">
                  {post.content}
                </p>
              </div>

              {/* Side Interaction Icons */}
              <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-7 pointer-events-auto">
                <div className="flex flex-col items-center">
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-1 shadow-lg border border-white/10 active:scale-90 transition-transform">
                    <i className="fa-solid fa-heart text-xl text-rose-500"></i>
                  </button>
                  <span className="text-[10px] font-black tracking-tighter">{post.likes}</span>
                </div>
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => {
                        const text = encodeURIComponent(`¡Mira esta primicia en Spacetramoya Updates!\n\n${post.content}`);
                        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    }}
                    className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-1 shadow-lg border border-white/10 active:scale-90 transition-transform"
                  >
                    <i className="fa-solid fa-share text-xl text-emerald-400"></i>
                  </button>
                  <span className="text-[10px] font-black tracking-tighter">Share</span>
                </div>
              </div>
            </div>

            {/* Vertical Swipe Indicator */}
            {post === posts[0] && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 animate-bounce pointer-events-none">
                <span className="text-[8px] font-black uppercase tracking-widest text-white mb-1">Desliza</span>
                <i className="fa-solid fa-chevron-up text-white text-xs"></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortsPlayer;
