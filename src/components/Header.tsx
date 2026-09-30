import React from 'react';

interface HeaderProps {
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  return (
    <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-40 pointer-events-auto">
      {/* 
        Admin Button 'R' placed at the top right of the hero.
        Set to absolute positioning so it stays at the top and does NOT scroll down over the cards/content ("admin botton secrole down na ho").
      */}
      <button
        onClick={onOpenAdmin}
        title="Admin Dashboard (Visitors & Analytics)"
        aria-label="Open Admin Dashboard"
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#ffe07a] via-[#f7c042] to-[#e59e1c] text-[#061e1c] font-black text-base sm:text-lg flex items-center justify-center hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(247,192,66,0.35)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe07a] border-2 border-[#fff3b0] cursor-pointer"
      >
        R
      </button>
    </div>
  );
};
