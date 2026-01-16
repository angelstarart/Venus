import React, { useState, useRef, useEffect, useMemo } from "react";
// import { css, Global } from "@emotion/react";
import styled from '@emotion/styled';
import { Canvas, useLoader, useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls, Center, Sky, useTexture } from "@react-three/drei";
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

// Import the FBX model and water normals
const logoPath = new URL('../../../images/logo_silver.fbx', import.meta.url).href;
const waternormals = new URL('../../../images/waternormals.jpg', import.meta.url).href;

// Extend Water to make it available as a JSX element
extend({ Water });

// Styled component for full-screen container
const FullScreenContainer = styled.div`
  min-width: 100%;
  min-height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

// Water component
const WaterComponent: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  // Load water normal texture
  const waterNormals = useTexture(waternormals);

  // Apply texture settings directly
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  // Calculate sun position
  const sunPosition = useMemo(() => {
    const phi = THREE.MathUtils.degToRad(90 - 15); // elevation = 15
    const theta = THREE.MathUtils.degToRad(-50); // azimuth = -45
    const sunDirection = new THREE.Vector3();
    sunDirection.setFromSphericalCoords(1, phi, theta);
    return sunDirection;
  }, []);

  // Water configuration
  const waterConfig = useMemo(() => ({
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection: sunPosition,
    sunColor: 0xffffff,
    waterColor: 0x03bfcb,
    distortionScale: 3.7,
    fog: scene.fog,
    size: 1.0
  }), [waterNormals, sunPosition, scene.fog]);

  // Update time uniform on each frame
  useFrame((_, delta) => {
    if (waterRef.current) {
      // Using type assertion to access the material uniforms
      (waterRef.current as THREE.Mesh & { material: { uniforms: { [key: string]: { value: number } } } }).material.uniforms['time'].value += delta;
    }
  });

  return (
    <water
      ref={waterRef}
      args={[new THREE.PlaneGeometry(10000, 10000), waterConfig]}
      rotation-x={-Math.PI / 2}
      position={[0, -5, 0]} // Position below the logo
    />
  );
};

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
    const scale = 2 / maxDim;
    fbx.scale.set(scale, scale, scale);

    fbx.traverse((child) => {
      console.log(child);
      if (child instanceof THREE.Mesh) {
        // Create a new material if the child has one
        if (child.material) {
          // For standard materials, increase emissive properties
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0xcccccc,
              emissiveIntensity: 0.5,
              metalness: 1,
              roughness: 0,
            });
          }
          // For basic materials or other types
          else {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0xaaaaaa,
              emissiveIntensity: 1,
              metalness: 0,
              roughness: 0,
            });
          }
        }
      }
    });

    // Position the model above the water
    // fbx.position.y = 0;
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

  // Calculate sun position for sky
  const sunPosition = useMemo(() => {
    const phi = THREE.MathUtils.degToRad(90 - 12); // elevation
    const theta = THREE.MathUtils.degToRad(142); // azimuth
    const sunDirection = new THREE.Vector3();
    sunDirection.setFromSphericalCoords(1, phi, theta);
    return sunDirection;
  }, []);

  // Set camera position
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />

      {/* Main directional light (sun) */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.5}
        color={0xffffff}
        castShadow
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.7}
        color={0xffffee}
      />

      {/* Rim light to create edge highlights */}
      <spotLight
        position={[0, 8, -5]}
        intensity={1.2}
        angle={0.6}
        penumbra={0.2}
        color={0xffffff}
      />

      {/* Bottom light for subtle fill */}
      <pointLight
        position={[0, -3, 0]}
        intensity={0.4}
        distance={10}
        color={0xadd8e6}
      />
      {/*<directionalLight position={[10, 10, 5]} intensity={1} />*/}

      {/* Sky */}
      <Sky
        distance={10000}
        sunPosition={sunPosition}
        turbidity={0.7}
        rayleigh={0.3}
        mieCoefficient={0.022}
        mieDirectionalG={0.783}
      />

      {/* Water */}
      <WaterComponent />

      {/* 3D Logo */}
      <Center position={[0, 0, 0]}>
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
          camera={{ position: [30, 30, 100], fov: 55, near: 1, far: 20000 }}
          gl={{
            alpha: false,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.5
          }}
        >
          <Scene />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.495}
            minDistance={5.0}
            maxDistance={100.0}
          />
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
