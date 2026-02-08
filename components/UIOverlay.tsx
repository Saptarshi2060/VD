
import React, { useState, useEffect } from 'react';
import { ExperienceStage } from '../types';
import SoundController from '../services/SoundController';

interface UIOverlayProps {
  stage: ExperienceStage;
  setStage: (stage: ExperienceStage) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ stage, setStage }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    "You are my safest place",
    "Every future I want has you in it",
    "I’d choose you in every universe",
    "You make my world infinitely brighter"
  ];

  useEffect(() => {
    if (stage === ExperienceStage.WORLD) {
      const interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % messages.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [stage, messages.length]);

  const handleYesClick = () => {
    setStage(ExperienceStage.CELEBRATION);
    SoundController.playSparkle();
    SoundController.playPop();
  };

  if (stage === ExperienceStage.START) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8 text-center">
      {/* Cycle through love notes during world exploration */}
      <div className={`transition-all duration-1000 ${stage === ExperienceStage.WORLD ? 'opacity-100' : 'opacity-0'} mt-12`}>
        <div key={msgIndex} className="animate-fade-up text-rose-400 italic text-2xl drop-shadow-sm font-light">
          “{messages[msgIndex]}”
        </div>
      </div>

      {/* The Final Emotional Reveal */}
      <div className={`transition-all duration-2000 flex flex-col items-center justify-center flex-1 ${stage === ExperienceStage.FINAL ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
        <div className="mt-[25vh] space-y-6">
           <h2 className="text-5xl md:text-7xl font-love text-rose-500 drop-shadow-2xl leading-tight">
            Happy Valentines Day,<br/>bb (My little princess)
          </h2>
          <p className="text-rose-400 text-2xl font-light italic animate-pulse">
            Will you be my Valentine? Today, Tomorrow, and Forever?
          </p>
          
          <div className="pt-10 flex gap-6 justify-center pointer-events-auto">
            <button 
              onClick={handleYesClick}
              className="px-12 py-5 bg-rose-500 text-white rounded-full text-2xl font-bold hover:bg-rose-600 transition-all shadow-2xl hover:scale-110 active:scale-95 shadow-rose-200"
            >
              Yes, Forever ❤️
            </button>
          </div>
        </div>
      </div>

      {/* Celebration Message */}
      <div className={`transition-all duration-1000 flex flex-col items-center justify-center absolute inset-0 ${stage === ExperienceStage.CELEBRATION ? 'opacity-100 scale-110' : 'opacity-0 scale-50 pointer-events-none'}`}>
          <h2 className="text-7xl md:text-9xl font-love text-rose-600 drop-shadow-[0_0_25px_rgba(225,29,72,0.5)] animate-pulse">
            mwaahhh! 💋
          </h2>
          <p className="text-rose-400 text-3xl font-love mt-8">I love you so much, Agni</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-up {
          0% { transform: translateY(10px); opacity: 0; }
          20% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-10px); opacity: 0; }
        }
        .animate-fade-up {
          animation: fade-up 3.5s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default UIOverlay;
