
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ExperienceStage } from '../types';

interface ParticlesProps {
  stage: ExperienceStage;
}

const Particles: React.FC<ParticlesProps> = ({ stage }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 500;
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    if (stage === ExperienceStage.CELEBRATION) {
      // Shower of love: particles fall from top
      for (let i = 0; i < count; i++) {
        // Fall speed
        positions[i * 3 + 1] -= 0.1;
        // Sway
        positions[i * 3] += Math.sin(t + i) * 0.02;

        // Reset to top when off screen
        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = 15;
          positions[i * 3] = (Math.random() - 0.5) * 25;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.01;
    } else {
      // Slow drift for other stages
      pointsRef.current.rotation.y = t * 0.05;
      pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }

    // Pulse size on final/celebration stages
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    if (stage === ExperienceStage.FINAL || stage === ExperienceStage.CELEBRATION) {
      mat.size = 0.4 + Math.sin(t * 3) * 0.15;
      mat.opacity = 0.8;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={initialPositions.length / 3}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#fb7185"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Particles;
