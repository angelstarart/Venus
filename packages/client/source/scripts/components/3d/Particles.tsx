// src/components/Particles.tsx
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Points } from 'three';
import { BufferGeometry, Float32BufferAttribute } from 'three';

const Particles: React.FC = () => {
  const particlesRef = useRef<Points>(null);
  
  const particleCount = 1000;
  
  // Generate particles
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    
    return geometry;
  }, [particleCount]);

  // Animate particles
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <primitive object={particles} />
      <pointsMaterial 
        color={0xe1e1e6} 
        size={0.05} 
        transparent 
        opacity={0.4} 
      />
    </points>
  );
};

export default Particles;
