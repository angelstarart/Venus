import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sky,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';
import { Water } from 'three/examples/jsm/objects/Water.js';
const waternormals = new URL('../../../images/waternormals.jpg', import.meta.url).href;

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

// Extend Water to make it available as a JSX element
extend({ Water });

// Type for Water properties
interface WaterProps {
  sunDirection: THREE.Vector3;
  waterColor: number;
  distortionScale: number;
  size: number;
}

// Type for GUI parameters
// interface SkyParams {
//   elevation: number;
//   azimuth: number;
// }

// Water component with proper TypeScript typing
const WaterComponent: React.FC<WaterProps> = ({ sunDirection, waterColor, distortionScale, size }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  // Load water normal texture
  const waterNormals = useTexture(waternormals);

  // Apply texture settings directly
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  // Water configuration
  const waterConfig = useMemo(() => ({
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection,
    sunColor: 0xffffff,
    waterColor,
    distortionScale,
    fog: scene.fog,
    size
  }), [waterNormals, sunDirection, waterColor, distortionScale, scene.fog, size]);

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
    />
  );
};

// Main ocean scene component
const OceanComponent: React.FC = () => {
  const skyParams = {
    turbidity: 20,
    rayleigh: 0.558,
    mieCoefficient: 0.009,
    mieDirectionalG: 0.999998,
    elevation: 15,
    azimuth: -50,
    exposure: 0.2257
  };
  const waterParams = {
    distortionScale: 3.7,
    size: 1.0
  };

  // Calculate sun position from sky parameters
  const sunPosition = useMemo(() => {
    const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation);
    const theta = THREE.MathUtils.degToRad(skyParams.azimuth);
    const sunDirection = new THREE.Vector3();
    sunDirection.setFromSphericalCoords(1, phi, theta);
    return sunDirection;
  }, [skyParams.elevation, skyParams.azimuth]);

  return (
    <>
      {/* Skybox */}
      <Sky 
        distance={10000} 
        sunPosition={sunPosition} 
        turbidity={10}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Water */}
      <WaterComponent
        sunDirection={sunPosition} 
        waterColor={0x001e0f}
        distortionScale={waterParams.distortionScale}
        size={waterParams.size}
      />

      {/* Controls and Stats */}
      <OrbitControls 
        maxPolarAngle={Math.PI * 0.495}
        target={[0, 10, 0]}
        minDistance={40.0}
        maxDistance={200.0}
      />
    </>
  );
};

// Main component
const Ocean: React.FC = () => {
  return (
    <FullScreen>
      <Canvas
        camera={{ position: [30, 30, 100], fov: 55, near: 1, far: 20000 }}
        gl={{ 
          alpha: false,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.5
        }}
      >
        <OceanComponent />
      </Canvas>
    </FullScreen>
  );
};

export default Ocean;
