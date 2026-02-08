
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox, Text } from '@react-three/drei';
import SoundController from '../services/SoundController';

interface GiftBoxProps {
  onClick?: () => void;
  isOpen?: boolean;
}

const GiftBox: React.FC<GiftBoxProps> = ({ onClick, isOpen = false }) => {
  const lidRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!lidRef.current) return;
    if (isOpen) {
      lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, 4, delta * 3);
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -Math.PI / 2, delta * 3);
      lidRef.current.scale.setScalar(THREE.MathUtils.lerp(lidRef.current.scale.x, 0, delta * 3));
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onClick && !isOpen) {
      SoundController.playPop();
      SoundController.playSparkle();
      onClick();
    }
  };

  const handlePointerOver = () => {
    if (!isOpen) {
      setHovered(true);
      SoundController.playBoop();
    }
  };

  return (
    <group 
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* Box Body */}
      <RoundedBox args={[2, 2, 2]} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ffc1cc" roughness={0.1} metalness={0.1} clearcoat={1} />
      </RoundedBox>

      {/* Ribbon Around Box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.05, 0.3, 2.05]} />
        <meshStandardMaterial color="#d8b4fe" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.05, 0.3, 2.05]} />
        <meshStandardMaterial color="#d8b4fe" />
      </mesh>

      {/* Box Lid */}
      <group ref={lidRef} position={[0, 1.05, 0]}>
        <RoundedBox args={[2.2, 0.4, 2.2]} radius={0.1} smoothness={4} castShadow>
          <meshPhysicalMaterial color="#ffc1cc" roughness={0.1} metalness={0.1} clearcoat={1} />
        </RoundedBox>
        
        {/* Lid Ribbon and Bow */}
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[2.25, 0.05, 0.3]} />
          <meshStandardMaterial color="#d8b4fe" />
        </mesh>
        <mesh position={[0, 0.21, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.25, 0.05, 0.3]} />
          <meshStandardMaterial color="#d8b4fe" />
        </mesh>
        
        {/* Simple Bow */}
        <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI/4]}>
          <torusGeometry args={[0.2, 0.05, 16, 32]} />
          <meshStandardMaterial color="#d8b4fe" />
        </mesh>
        <mesh position={[0, 0.4, 0]} rotation={[0, Math.PI/2, Math.PI/4]}>
          <torusGeometry args={[0.2, 0.05, 16, 32]} />
          <meshStandardMaterial color="#d8b4fe" />
        </mesh>
      </group>

      {!isOpen && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.4}
          color="#e11d48"
          anchorX="center"
          anchorY="middle"
        >
          Click to Open Your Heart 💝
        </Text>
      )}
    </group>
  );
};

export default GiftBox;
