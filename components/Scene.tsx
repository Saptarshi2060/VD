
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import GiftBox from './GiftBox';
import MiniatureWorld from './MiniatureWorld';
import Particles from './Particles';
import { ExperienceStage } from '../types';

interface SceneProps {
  stage: ExperienceStage;
  onBoxClick: () => void;
}

const Scene: React.FC<SceneProps> = ({ stage, onBoxClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle overall movement
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Particles stage={stage} />
      
      {stage === ExperienceStage.GIFT_BOX && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <GiftBox onClick={onBoxClick} />
        </Float>
      )}

      {stage === ExperienceStage.OPENING && (
        <GiftBox isOpen={true} />
      )}

      {(stage === ExperienceStage.WORLD || stage === ExperienceStage.FINAL) && (
        <MiniatureWorld stage={stage} />
      )}
    </group>
  );
};

export default Scene;
