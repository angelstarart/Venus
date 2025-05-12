import React, { useState, useRef, useEffect } from "react";
import styled from 'styled-components';
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Import the FBX model
const logoPath = new URL('../../../images/logo.fbx', import.meta.url).href;

// Styled component for full-screen container
const FullScreenContainer = styled.div`
  background-color: black;
  min-width: 100%;
  min-height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

// FBX Model component
const FBXModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const fbx = useLoader(FBXLoader, logoPath);

  // Center the model
  useEffect(() => {
    // Create a bounding box for the model
    const boundingBox = new THREE.Box3().setFromObject(fbx);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    // Reset position to center
    fbx.position.sub(center);

    // Optional: Scale the model if needed
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim; // Scale to fit within a 2 unit sphere
    fbx.scale.set(scale, scale, scale);
  }, [fbx]);

  // Rotate the model
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
};

// Scene setup component
const Scene: React.FC = () => {
  const { camera } = useThree();

  // Set camera position
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Center>
        <FBXModel />
      </Center>
    </>
  );
};

// Main component
const ThreeDLogo: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle loading state
  useEffect(() => {
    document.title = "Peaceful Star - 3D Logo";

    const loader = new FBXLoader();
    loader.load(
      logoPath,
      () => setIsLoading(false),
      undefined,
      (error) => console.error('Error loading FBX:', error)
    );
  }, []);

  return (
    <FullScreenContainer>
      {!isLoading ? (
        <Canvas
          gl={{ 
            alpha: false,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0
          }}
        >
          <Scene />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      ) : (
        <div style={{
          color: 'white',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          Loading...
        </div>
      )}
    </FullScreenContainer>
  );
};

export default ThreeDLogo;
