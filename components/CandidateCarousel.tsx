
import React from 'react';
import { Candidate } from '../types';

interface CandidateCarouselProps {
  candidates: Candidate[];
  onClose: () => void;
}

const CandidateCarousel: React.FC<CandidateCarouselProps> = ({ candidates, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/98 backdrop-blur-3xl flex flex-col animate-fade-in overflow-hidden">
      {/* Header Modal */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">
          Candidatas <span className="text-indigo-400">Miss Slam ThaiVen 8th</span>
        </h2>
        <button 
          onClick={onClose}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-all active:scale-90 border border-white/10"
          aria-label="Cerrar carrusel"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      {/* Carousel Container */}
      <div className="flex-1 overflow-x-auto flex items-center snap-x snap-mandatory scrollbar-hide px-6 space-x-8">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id} 
            className="flex-shrink-0 w-[85vw] md:w-[400px] snap-center flex flex-col items-center py-10"
          >
            {/* 1. Primero va la foto */}
            <div className="w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.3)] mb-8 relative group">
              <img 
                src={candidate.image} 
                alt={candidate.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60"></div>
            </div>
            
            {/* Información de la candidata */}
            <div className="text-center">
              {/* 2. Nombre de la provincia o estado en letras MAYÚSCULAS */}
              <h4 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {candidate.location}
              </h4>
              {/* 3. Nombre de la candidata más pequeño abajo */}
              <p className="text-base font-bold text-indigo-400 uppercase tracking-widest italic opacity-90">
                {candidate.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Help */}
      <div className="pb-12 text-center">
        <div className="flex items-center justify-center space-x-4 text-slate-500 text-[10px] uppercase font-black tracking-widest animate-pulse">
          <i className="fa-solid fa-chevron-left"></i>
          <span>Desliza para ver la competencia</span>
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
};

export default CandidateCarousel;
