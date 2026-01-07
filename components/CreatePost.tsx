
import React, { useState } from 'react';
import { AUTHOR_IMAGE, AUTHOR_NAME } from '../constants';

interface CreatePostProps {
  onPost: (content: string, image?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image.trim()) return;
    onPost(content, image);
    setContent('');
    setImage('');
    setShowImageInput(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-lg shadow-purple-900/10">
      <div className="flex items-start space-x-3">
        <img 
          src={AUTHOR_IMAGE} 
          alt={AUTHOR_NAME} 
          className="w-10 h-10 rounded-full border border-indigo-500 object-cover"
        />
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué novedades hay en el mundo del glamour?"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[100px] transition-all"
          />
          
          {showImageInput && (
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="URL de la imagen (https://...)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button 
                type="button" 
                onClick={() => setShowImageInput(false)}
                className="text-slate-500 hover:text-red-400"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="p-2 rounded-full hover:bg-indigo-500/10 text-indigo-400 transition-colors"
                title="Añadir imagen"
              >
                <i className="fa-regular fa-image text-xl"></i>
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-purple-500/10 text-purple-400 transition-colors">
                <i className="fa-solid fa-at text-xl"></i>
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-fuchsia-500/10 text-fuchsia-400 transition-colors">
                <i className="fa-regular fa-calendar text-xl"></i>
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!content.trim() && !image.trim()}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-indigo-600/30"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
