
import React, { useState, useRef } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const pressTimer = useRef<number | null>(null);

  const shareToWhatsApp = () => {
    const textToShare = `*${post.authorName}* (${post.timestamp})\n\n${post.content}\n\n_Vía Spacetramoya Updates_`;
    const encodedText = encodeURIComponent(textToShare);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const startPress = () => {
    pressTimer.current = window.setTimeout(() => {
      setShowMetadata(true);
    }, 600);
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setTimeout(() => setShowMetadata(false), 2000);
  };

  const renderImageGrid = () => {
    if (!post.images || post.images.length === 0) return null;

    const count = post.images.length;
    let gridClass = "grid gap-1 mt-4 rounded-xl overflow-hidden border border-white/5 relative shadow-xl";

    if (count === 1) gridClass += " grid-cols-1";
    else if (count === 2) gridClass += " grid-cols-2 h-56";
    else if (count === 3) gridClass += " grid-cols-2 h-64";
    else if (count >= 4) gridClass += " grid-cols-2 h-72";

    return (
      <div className={gridClass}>
        {post.images.slice(0, 5).map((img, idx) => {
          let itemClass = "relative cursor-pointer overflow-hidden bg-slate-800/50";
          if (count === 3 && idx === 0) itemClass += " row-span-2";
          if (count === 5 && idx === 0) itemClass += " col-span-1";

          return (
            <div 
              key={idx} 
              className={itemClass}
              onClick={() => setSelectedImage(img)}
              onMouseDown={startPress}
              onMouseUp={endPress}
              onTouchStart={startPress}
              onTouchEnd={endPress}
            >
              <img 
                src={img} 
                alt={`Post ${idx}`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          );
        })}

        {showMetadata && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-10 animate-fade-in pointer-events-none border border-indigo-500/30 rounded-xl">
            <div className="p-2">
              <i className="fa-solid fa-crown text-3xl mb-3 text-indigo-400"></i>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Registro Oficial</p>
              <p className="text-sm font-bold text-white">{post.timestamp}</p>
              <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Cobertura Global SpaceTramoya</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-[2rem] p-5 shadow-2xl relative transition-all duration-500 flex flex-col items-center">
      {/* Centered Author Info Header */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <img 
            src={post.authorImage} 
            alt={post.authorName} 
            className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover shadow-2xl shadow-indigo-500/20"
          />
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#020617] text-[10px] text-white">
            <i className="fa-solid fa-bolt"></i>
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <h3 className="font-black text-white text-base tracking-tight">{post.authorName}</h3>
          {post.isVerified && (
            <span className="text-blue-400 text-sm">
              <i className="fa-solid fa-circle-check"></i>
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{post.timestamp}</span>
      </div>
      
      {/* Post content centered text */}
      <div className="w-full text-slate-200 text-[15px] whitespace-pre-wrap leading-relaxed font-medium text-center px-2 mb-4">
        {post.content}
      </div>

      {/* Video Embed centered width */}
      {post.videoEmbed && (
        <div className="w-full relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black/20">
          <div dangerouslySetInnerHTML={{ __html: post.videoEmbed }} />
        </div>
      )}

      {/* Image grid */}
      <div className="w-full">
        {renderImageGrid()}
      </div>

      {/* Footer centered items */}
      <div className="w-full mt-6 pt-4 border-t border-white/5 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-6">
          <button className="group flex items-center space-x-2 text-slate-400 hover:text-rose-500 transition-all">
            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-rose-500/10 transition-all border border-white/5 group-hover:border-rose-500/20">
              <i className="fa-regular fa-heart text-lg"></i>
            </div>
            <span className="text-xs font-black tracking-widest">{post.likes.toLocaleString()}</span>
          </button>
        </div>
        
        <button 
          onClick={shareToWhatsApp}
          className="flex items-center justify-center space-x-3 w-full max-w-[200px] bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white py-3 rounded-full transition-all active:scale-95 border border-emerald-500/20 font-black uppercase tracking-widest text-[10px]"
        >
          <i className="fa-brands fa-whatsapp text-lg"></i>
          <span>Compartir en WhatsApp</span>
        </button>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-rose-600 rounded-full flex items-center justify-center text-white text-2xl transition-all shadow-2xl border border-white/10"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-[0_0_80px_rgba(79,70,229,0.3)] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
