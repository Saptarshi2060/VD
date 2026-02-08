
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Sphere } from '@react-three/drei';
import { ExperienceStage } from '../types';

interface MiniatureWorldProps {
  stage: ExperienceStage;
}

const MiniatureWorld: React.FC<MiniatureWorldProps> = ({ stage }) => {
  const worldRef = useRef<THREE.Group>(null);
  const char1Ref = useRef<THREE.Group>(null);
  const char2Ref = useRef<THREE.Group>(null);
  const heartRef = useRef<THREE.Mesh>(null);
  
  const arm1L = useRef<THREE.Mesh>(null);
  const arm1R = useRef<THREE.Mesh>(null);
  const arm2L = useRef<THREE.Mesh>(null);
  const arm2R = useRef<THREE.Mesh>(null);

  const isHugging = stage === ExperienceStage.FINAL || stage === ExperienceStage.CELEBRATION;
  const scale = isHugging ? 2.2 : 1;

  useFrame((state, delta) => {
    if (!worldRef.current) return;
    const t = state.clock.getElapsedTime();

    // Smooth world scale transition
    worldRef.current.scale.setScalar(
      THREE.MathUtils.lerp(worldRef.current.scale.x, scale, delta * 1.2)
    );

    const isCelebrating = stage === ExperienceStage.CELEBRATION;
    
    // Character Proximity and Hugging Logic
    if (char1Ref.current && char2Ref.current) {
      // Extremely close for the hug
      const targetDist = isHugging ? 0.08 : 0.6;
      
      char1Ref.current.position.x = THREE.MathUtils.lerp(char1Ref.current.position.x, -targetDist, delta * 1.5);
      char2Ref.current.position.x = THREE.MathUtils.lerp(char2Ref.current.position.x, targetDist, delta * 1.5);
      
      // Breathing / Heartbeat bob
      const bobFreq = isHugging ? (isCelebrating ? 3 : 1.5) : 5;
      const bobAmp = isHugging ? 0.015 : 0.08;
      char1Ref.current.position.y = Math.abs(Math.sin(t * bobFreq)) * bobAmp;
      char2Ref.current.position.y = Math.abs(Math.sin(t * bobFreq + 0.5)) * bobAmp;

      if (isHugging) {
        // Leaning in for the hug
        char1Ref.current.rotation.z = THREE.MathUtils.lerp(char1Ref.current.rotation.z, 0.2, delta * 2);
        char2Ref.current.rotation.z = THREE.MathUtils.lerp(char2Ref.current.rotation.z, -0.2, delta * 2);
        
        // Wrap arms around each other
        // Char 1 Right arm wraps forward and in
        if (arm1R.current) {
          arm1R.current.rotation.x = THREE.MathUtils.lerp(arm1R.current.rotation.x, 1.2, delta * 3);
          arm1R.current.rotation.z = THREE.MathUtils.lerp(arm1R.current.rotation.z, -1.5, delta * 3);
        }
        // Char 1 Left arm wraps forward
        if (arm1L.current) {
          arm1L.current.rotation.x = THREE.MathUtils.lerp(arm1L.current.rotation.x, 0.8, delta * 3);
          arm1L.current.rotation.z = THREE.MathUtils.lerp(arm1L.current.rotation.z, 0.6, delta * 3);
        }

        // Char 2 Left arm wraps forward and in
        if (arm2L.current) {
          arm2L.current.rotation.x = THREE.MathUtils.lerp(arm2L.current.rotation.x, 1.2, delta * 3);
          arm2L.current.rotation.z = THREE.MathUtils.lerp(arm2L.current.rotation.z, 1.5, delta * 3);
        }
        // Char 2 Right arm wraps forward
        if (arm2R.current) {
          arm2R.current.rotation.x = THREE.MathUtils.lerp(arm2R.current.rotation.x, 0.8, delta * 3);
          arm2R.current.rotation.z = THREE.MathUtils.lerp(arm2R.current.rotation.z, -0.6, delta * 3);
        }
      } else {
        // Swinging arms while walking
        if (arm1L.current) arm1L.current.rotation.z = 0.2 + Math.sin(t * 5) * 0.1;
        if (arm1R.current) arm1R.current.rotation.z = -0.2 - Math.sin(t * 5) * 0.1;
        if (arm2L.current) arm2L.current.rotation.z = 0.2 + Math.sin(t * 5 + 0.5) * 0.1;
        if (arm2R.current) arm2R.current.rotation.z = -0.2 - Math.sin(t * 5 + 0.5) * 0.1;
      }
    }

    // Heart pulsing directly above the couple
    if (heartRef.current && isHugging) {
      heartRef.current.scale.setScalar(0.12 + Math.sin(t * 8) * 0.04);
      heartRef.current.rotation.y += delta * 1.5;
      heartRef.current.position.y = THREE.MathUtils.lerp(heartRef.current.position.y, 2.8, delta * 2);
    }
  });

  const HeartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
    return shape;
  }, []);

  return (
    <group ref={worldRef} scale={0}>
      {/* Soft Ground Base */}
      <Sphere args={[2.8, 64, 64]} scale={[1, 0.08, 1]} position={[0, -0.2, 0]}>
        <meshPhysicalMaterial color="#fff" roughness={0.4} transparent opacity={0.7} />
      </Sphere>

      {/* Decorative Sparkles/Hearts in background */}
      {[...Array(10)].map((_, i) => (
        <group key={i} position={[Math.cos(i * 0.6) * 2.5, 0.3, Math.sin(i * 0.6) * 2.5]}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh rotation={[-Math.PI, 0, 0]} scale={0.012}>
              <extrudeGeometry args={[HeartShape, { depth: 2, bevelEnabled: true, bevelThickness: 2, bevelSize: 2 }]} />
              <meshStandardMaterial color="#fca5a5" emissive="#fb7185" emissiveIntensity={0.5} />
            </mesh>
          </Float>
        </group>
      ))}

      {/* Character 1 (Blue) */}
      <group ref={char1Ref} position={[-2, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
          <meshStandardMaterial color="#93c5fd" />
        </mesh>
        <mesh ref={arm1L} position={[-0.22, 0.6, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
          <meshStandardMaterial color="#bfdbfe" />
        </mesh>
        <mesh ref={arm1R} position={[0.22, 0.6, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
          <meshStandardMaterial color="#bfdbfe" />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#bfdbfe" />
        </mesh>
        <mesh position={[0.1, 1.1, 0.22]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#000" />
        </mesh>
        <mesh position={[-0.1, 1.1, 0.22]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      </group>

      {/* Character 2 (Pink) */}
      <group ref={char2Ref} position={[2, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
          <meshStandardMaterial color="#f9a8d4" />
        </mesh>
        <mesh ref={arm2L} position={[-0.22, 0.6, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
          <meshStandardMaterial color="#fce7f3" />
        </mesh>
        <mesh ref={arm2R} position={[0.22, 0.6, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
          <meshStandardMaterial color="#fce7f3" />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#fce7f3" />
        </mesh>
        <mesh position={[0.1, 1.1, 0.22]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#000" />
        </mesh>
        <mesh position={[-0.1, 1.1, 0.22]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      </group>

      {/* Glowing Heart Reveal above the hug */}
      {(stage === ExperienceStage.FINAL || stage === ExperienceStage.WORLD || stage === ExperienceStage.CELEBRATION) && (
        <group position={[0, 3, 0]}>
          <mesh ref={heartRef} rotation={[-Math.PI, 0, 0]} scale={0.08}>
            <extrudeGeometry args={[HeartShape, { depth: 5, bevelEnabled: true, bevelThickness: 4, bevelSize: 4 }]} />
            <meshPhysicalMaterial 
              color="#e11d48" 
              emissive="#fb7185" 
              emissiveIntensity={4} 
              transparent 
              opacity={1} 
              roughness={0} 
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default MiniatureWorld;
