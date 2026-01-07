
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
    let gridClass = "grid gap-1 mt-4 rounded-xl overflow-hidden border border-slate-800 relative";

    if (count === 1) gridClass += " grid-cols-1";
    else if (count === 2) gridClass += " grid-cols-2 h-64";
    else if (count === 3) gridClass += " grid-cols-2 h-80";
    else if (count >= 4) gridClass += " grid-cols-2 h-96";

    return (
      <div className={gridClass}>
        {post.images.slice(0, 5).map((img, idx) => {
          let itemClass = "relative cursor-pointer overflow-hidden bg-slate-800";
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
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          );
        })}

        {showMetadata && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in pointer-events-none">
            <div className="bg-indigo-600/20 border border-indigo-500 p-4 rounded-xl shadow-2xl">
              <i className="fa-solid fa-circle-info text-3xl mb-3 text-indigo-400"></i>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-300 mb-1">Detalles de Publicación</p>
              <p className="text-lg font-medium">{post.timestamp}</p>
              <p className="text-xs text-slate-400 mt-2">Ubicación: Bangkok / Caracas</p>
              <p className="text-xs text-slate-400">Canal: @SpaceTramoyaX</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 shadow-xl relative">
      <div className="flex items-start space-x-3">
        <img 
          src={post.authorImage} 
          alt={post.authorName} 
          className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover shadow-lg"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <h3 className="font-bold text-slate-100">{post.authorName}</h3>
            {post.isVerified && (
              <span className="text-blue-400 text-sm">
                <i className="fa-solid fa-circle-check"></i>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">{post.timestamp}</p>
          
          <div className="mt-3 text-slate-200 text-[15px] whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>

          {/* Video Embed */}
          {post.videoEmbed && (
            <div 
              className="mt-4 rounded-xl overflow-hidden border border-slate-800 shadow-lg" 
              dangerouslySetInnerHTML={{ __html: post.videoEmbed }}
            />
          )}

          {renderImageGrid()}

          <div className="mt-6 pt-3 border-t border-slate-800/50 flex items-center justify-between text-slate-400">
            <div className="flex space-x-6">
              <button className="group flex items-center space-x-2 hover:text-indigo-400 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-indigo-500/10 transition-all">
                  <i className="fa-regular fa-heart text-lg"></i>
                </div>
                <span className="text-sm">{post.likes.toLocaleString()}</span>
              </button>
            </div>
            <button 
              onClick={shareToWhatsApp}
              className="flex items-center space-x-2 text-emerald-500 hover:bg-emerald-500/10 px-4 py-2 rounded-full transition-all active:scale-95 border border-emerald-500/20"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              <span className="text-sm font-bold">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-slate-800/50 hover:bg-red-500/80 rounded-full flex items-center justify-center text-2xl transition-all"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-indigo-500/20"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
