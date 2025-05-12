// src/components/Scene.tsx
import type { JSX } from "react";
import React, { useRef, useState, useEffect } from "react";
import type * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styled from 'styled-components';
import Cards from './Cards';
// import Particles from './Particles';
import { projects } from '../../data/projects';
// import Overlay from './Overlay';

const SceneContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Scene: React.FC = (): JSX.Element => {
  // const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);
  const sceneRef = useRef<THREE.Group>(null);
  const lastScrollTimeRef = useRef<number>(Date.now());

  const handleWheel = (event: WheelEvent): void => {
    const currentTime = Date.now();
    if (currentTime - lastScrollTimeRef.current < 200 || isTransitioning) {return;}
    lastScrollTimeRef.current = currentTime;

    const rotationAmount = Math.PI / 2; // 90 degrees in radians
    if (event.deltaY > 0) {
      targetRotationRef.current += rotationAmount;
    } else if (event.deltaY < 0) {
      targetRotationRef.current -= rotationAmount;
    }

    animateRotation();
  };

  const animateRotation = (): void => {
    setIsTransitioning(true);
    const duration = 800;
    const startTime = Date.now();
    const startRotation = rotationRef.current;

    const update = (): void => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      rotationRef.current = (startRotation + (targetRotationRef.current - startRotation)) * easeProgress;

      if (sceneRef.current) {
        sceneRef.current.rotation.y = rotationRef.current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setIsTransitioning(false);
        // updateCurrentCard();
      }
    };

    update();
  };

  useEffect((): void => {
    if (sceneRef.current) {
      console.log(sceneRef.current)
      // sceneRef.current.rotation.y = rotationRef.current;
    }
    console.log(containerRef.current)
  }, [sceneRef, containerRef]);

  // const updateCurrentCard = (): void => {
  //   let index = Math.round(rotationRef.current / (Math.PI / 2)) % projects.length;
  //   if (index < 0) {index += projects.length;}
  //   setCurrentCardIndex(index);
  // };

  useEffect((): (() => void) => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel);
    }

    return (): void => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isTransitioning]);

  return (
    <SceneContainer ref={containerRef}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 70 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={[0xf5f0f5]} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} color={0xfcf0f0} />
        <directionalLight position={[-10, -10, -10]} intensity={0.4} color={0xf0f0fc} />

        <group ref={sceneRef}>
          <Cards projects={projects} />
          {/*<Particles />*/}
        </group>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxDistance={20}
          minDistance={8}
          autoRotate
          autoRotateSpeed={0.2}
          enableZoom={false}
        />
      </Canvas>
      {/*<Overlay currentProject={projects[currentCardIndex]} />*/}
    </SceneContainer>
  );
};

export default Scene;
