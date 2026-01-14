
import React, { useState, useRef } from 'react';
import { AUTHOR_NAME, AUTHOR_IMAGE } from '../constants';
import { Post } from '../types';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Fix: Explicitly type 'file' as File to avoid 'unknown' type errors during Blob operations.
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return;

    const newPost: Post = {
      id: 'user-' + Date.now(),
      authorName: AUTHOR_NAME,
      authorUsername: '@SpaceTramoyaX',
      authorImage: AUTHOR_IMAGE,
      isVerified: true,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: content,
      images: images,
      likes: 0,
      hasLiked: false,
      comments: 0,
    };

    onPostCreated(newPost);
    setContent('');
    setImages([]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 mb-8 shadow-2xl animate-fade-in">
      <div className="flex items-start space-x-4">
        <img 
          src={AUTHOR_IMAGE} 
          alt="Me" 
          className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué primicia tienes hoy, reina?"
            className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none text-lg font-medium min-h-[80px]"
          />
          
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4 mb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="flex space-x-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
              >
                <i className="fa-solid fa-image"></i>
                <span>Foto</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                multiple 
                accept="image/*"
              />
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!content.trim() && images.length === 0}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-indigo-600/20"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
