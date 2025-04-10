import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
// Ensure this path is correct for your project structure
import { UltraHDRLoader } from 'three/examples/jsm/loaders/UltraHDRLoader.js';

const texture4k = new URL('../../../images/spruit_sunrise_4k.hdr.jpg', import.meta.url).href;


// Define the types for THREE constants explicitly
const THREEFloatType: THREE.TextureDataType = THREE.FloatType;
const THREEHalfFloatType: THREE.TextureDataType = THREE.HalfFloatType;
const THREEACESFilmicToneMapping: THREE.ToneMapping = THREE.ACESFilmicToneMapping;
const THREEEquirectangularReflectionMapping: THREE.Mapping = THREE.EquirectangularReflectionMapping;

// Define valid resolution and type options
type Resolution = '2k' | '4k';
type TextureType = 'HalfFloatType' | 'FloatType';

interface SceneContentProps {
  autoRotate: boolean;
  metalness: number;
  roughness: number;
  exposure: number;
  resolution: Resolution;
  textureType: TextureType;
}

// --- SceneContent Component (Remains largely the same) ---
const SceneContent: React.FC<SceneContentProps> = ({
                                                     autoRotate,
                                                     metalness,
                                                     roughness,
                                                     exposure,
                                                     resolution,
                                                     textureType,
                                                   }) => {
  const torusMeshRef = useRef<THREE.Mesh>(null!);
  const { scene, gl } = useThree(); // Access scene and renderer

  // Determine the THREE data type based on the string selection
  const threeDataType = textureType === 'FloatType' ? THREEFloatType : THREEHalfFloatType;

  // Load the UltraHDR texture using useLoader
  const texture = useLoader(UltraHDRLoader, texture4k, (loader) => {
    loader.setDataType(threeDataType);
  }) as THREE.Texture; // Assert type as THREE.Texture

  // Effect to update scene background and environment when texture or type changes
  useEffect(() => {
    texture.mapping = THREEEquirectangularReflectionMapping;
    texture.needsUpdate = true; // Important after changing properties
    scene.background = texture;
    scene.environment = texture;
    console.log(`Loaded ${resolution} texture with type ${textureType}`);
  }, [texture, scene, resolution, textureType]); // Re-run if texture, scene, resolution, or type changes

  // Effect to update renderer tone mapping exposure
  useEffect(() => {
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);

  // Update material properties directly
  useEffect(() => {
    const material = torusMeshRef.current.material as THREE.MeshStandardMaterial;
    material.roughness = roughness;
    material.metalness = metalness;
    material.needsUpdate = true;
  }, [roughness, metalness]);


  // Animation loop for rotation
  useFrame((_state, delta) => {
    if (autoRotate) {
      torusMeshRef.current.rotation.y += 0.5 * delta; // Use delta for frame-rate independence
    }
  });

  return (
    <>
      <mesh ref={torusMeshRef}>
        {/* Geometry args: radius, tube, tubularSegments, radialSegments, p, q */}
        <torusKnotGeometry args={[1, 0.4, 128, 128, 1, 3]} />
        {/* Material is updated via useEffect */}
        <meshStandardMaterial roughness={roughness} metalness={metalness} />
      </mesh>
      <OrbitControls />
    </>
  );
};

const UltraHDR: React.FC = () => {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [metalness, setMetalness] = useState<number>(1.0);
  const [roughness, setRoughness] = useState<number>(0.0);
  const [exposure, setExposure] = useState<number>(1.0);
  const [resolution, setResolution] = useState<Resolution>('2k');
  const [textureType, setTextureType] = useState<TextureType>('HalfFloatType');

  // Basic styles for the controls panel
  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '15px',
    borderRadius: '5px',
    zIndex: 100, // Ensure it's above the canvas
    fontFamily: 'sans-serif',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // Spacing between controls
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  };

  const inputStyle: React.CSSProperties = {
    marginLeft: '5px',
  };

  return (
    <>
      {/* Simple HTML Controls Panel */}
      <div style={controlsStyle}>
        <label style={labelStyle}>
          Auto Rotate:
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Metalness: {metalness.toFixed(2)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={metalness}
            onChange={(e) => setMetalness(parseFloat(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Roughness: {roughness.toFixed(2)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={roughness}
            onChange={(e) => setRoughness(parseFloat(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Exposure: {exposure.toFixed(2)}
          <input
            type="range"
            min="0"
            max="4"
            step="0.01"
            value={exposure}
            onChange={(e) => setExposure(parseFloat(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Resolution:
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value as Resolution)}
            style={inputStyle}
          >
            <option value="2k">2k</option>
            <option value="4k">4k</option>
          </select>
        </label>

        <label style={labelStyle}>
          Texture Type:
          <select
            value={textureType}
            onChange={(e) => setTextureType(e.target.value as TextureType)}
            style={inputStyle}
          >
            <option value="HalfFloatType">HalfFloatType</option>
            <option value="FloatType">FloatType</option>
          </select>
        </label>
      </div>

      {/* Canvas remains the same */}
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREEACESFilmicToneMapping,
          // Initial exposure set here, but updated via useEffect in SceneContent
        }}
        camera={{
          fov: 50,
          near: 1,
          far: 500,
          position: [0, 0, 6], // R3F uses positive Z towards the user
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* Suspense is needed for useLoader */}
        <Suspense fallback={null}>
          {/* Pass state variables as props */}
          <SceneContent
            autoRotate={autoRotate}
            metalness={metalness}
            roughness={roughness}
            exposure={exposure}
            resolution={resolution}
            textureType={textureType}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default UltraHDR;

// --- Rendering Setup (Example) ---
// import ReactDOM from 'react-dom/client';
// import UltraHDRDemo from './UltraHDRDemo';
//
// const rootElement = document.getElementById('root');
// if (!rootElement) throw new Error('Failed to find the root element');
//
// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <UltraHDRDemo />
//   </React.StrictMode>
// );