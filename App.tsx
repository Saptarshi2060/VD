
import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment, ContactShadows } from '@react-three/drei';
import { ExperienceStage } from './types';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import SoundController from './services/SoundController';

const App: React.FC = () => {
  const [stage, setStage] = useState<ExperienceStage>(ExperienceStage.START);
  const [hasStarted, setHasStarted] = useState(false);

  const startExperience = useCallback(() => {
    setHasStarted(true);
    setStage(ExperienceStage.GIFT_BOX);
    SoundController.playBackground();
  }, []);

  const nextStage = useCallback(() => {
    setStage((prev) => {
      switch (prev) {
        case ExperienceStage.GIFT_BOX: return ExperienceStage.OPENING;
        case ExperienceStage.OPENING: return ExperienceStage.WORLD;
        case ExperienceStage.WORLD: return ExperienceStage.FINAL;
        default: return prev;
      }
    });
  }, []);

  // Handle stage transitions automatically for cinematic flow
  useEffect(() => {
    if (stage === ExperienceStage.OPENING) {
      const timer = setTimeout(() => {
        setStage(ExperienceStage.WORLD);
      }, 3500);
      return () => clearTimeout(timer);
    }
    
    if (stage === ExperienceStage.WORLD) {
      const timer = setTimeout(() => {
        setStage(ExperienceStage.FINAL);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fff5f7]">
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-1000">
          <div className="text-center p-8 space-y-6">
            <h1 className="text-4xl md:text-6xl font-love text-rose-500 animate-pulse">
              A Special Surprise for My Love
            </h1>
            <p className="text-rose-400 font-light max-w-md mx-auto text-lg">
              Please turn on your sound for the full magical experience.
            </p>
            <button
              onClick={startExperience}
              className="px-10 py-4 bg-rose-500 text-white rounded-full text-xl font-bold hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-200 pointer-events-auto"
            >
              Open Your Surprise 💝
            </button>
          </div>
        </div>
      )}

      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={50} />
          <OrbitControls 
            enableZoom={stage === ExperienceStage.WORLD || stage === ExperienceStage.FINAL || stage === ExperienceStage.CELEBRATION} 
            enablePan={false} 
            minDistance={4} 
            maxDistance={15}
            autoRotate={stage === ExperienceStage.GIFT_BOX || stage === ExperienceStage.FINAL || stage === ExperienceStage.CELEBRATION}
            autoRotateSpeed={0.5}
            target={[0, 1, 0]}
          />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="sunset" />
          
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />

          <Scene stage={stage} onBoxClick={nextStage} />

          <ContactShadows 
            opacity={0.4} 
            scale={20} 
            blur={2.4} 
            far={10} 
            resolution={256} 
            color="#fb7185" 
          />
        </Suspense>
      </Canvas>

      <UIOverlay stage={stage} setStage={setStage} />
    </div>
  );
};

export default App;
