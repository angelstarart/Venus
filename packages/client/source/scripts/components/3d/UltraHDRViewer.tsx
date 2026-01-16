// src/components/UltraHDRViewer.tsx
import type { JSX } from "react";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UltraHDRLoader } from 'three/examples/jsm/loaders/UltraHDRLoader.js';
// import styled from 'styled-components';
import styled from '@emotion/styled';

const texture4k = new URL('../../../images/equirectangular-highres_00003_.jpg', import.meta.url).href;

// Styled components
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const InfoPanel = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-family: 'Arial', sans-serif;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  a {
    color: #8af;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 5px;
  color: white;
  font-family: 'Arial', sans-serif;
`;

const ControlGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Slider = styled.input`
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  padding: 5px;
  background-color: #333;
  color: white;
  border: 1px solid #555;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

// Types
interface SceneProps {
  autoRotate: boolean;
  metalness: number;
  roughness: number;
  exposure: number;
  resolution: '2k' | '4k';
  dataType: THREE.TextureDataType;
}

interface ControlPanelProps {
  params: SceneProps;
  setParams: React.Dispatch<React.SetStateAction<SceneProps>>;
}

// Custom UltraHDR loader hook
function useUltraHDRTexture(resolution: '2k' | '4k', dataType: THREE.TextureDataType): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    console.log(dataType)
    const loader = new UltraHDRLoader();
    loader.setDataType(dataType);
    console.log(loader);

    console.log(resolution)
    loader.load(texture4k, (loadedTexture) => {
      console.log(loadedTexture)
      loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
      loadedTexture.needsUpdate = true;
      setTexture(loadedTexture);
    });
    
    return (): void => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [resolution, dataType]);
  
  return texture;
}

// Scene component with TorusKnot
function Scene({ autoRotate, metalness, roughness, exposure, resolution, dataType }: SceneProps): JSX.Element {
  const torusRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  
  // Load the texture
  const texture = useUltraHDRTexture(resolution, dataType);
  
  // Update scene background and environment when texture changes
  useEffect(() => {
    if (texture) {
      scene.background = texture;
      scene.environment = texture;
    }
    return (): void => {
      scene.background = null;
      scene.environment = null;
    };
  }, [texture, scene]);
  
  // Animation loop
  useFrame(() => {
    if (torusRef.current && autoRotate) {
      torusRef.current.rotation.y += 0.005;
    }
  });
  
  // Update tone mapping
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);
  
  return (
    <>
      <mesh ref={torusRef}>
        <torusKnotGeometry args={[1, 0.4, 128, 128, 1, 3]} />
        <meshStandardMaterial roughness={roughness} metalness={metalness} />
      </mesh>
      <OrbitControls />
    </>
  );
}

// Control Panel Component
function ControlPanelComp({ params, setParams }: ControlPanelProps): JSX.Element {
  return (
    <ControlPanel>
      <ControlGroup>
        <Label>
          <Checkbox 
            type="checkbox" 
            checked={params.autoRotate} 
            onChange={(e) => setParams({ ...params, autoRotate: e.target.checked })}
          />
          Auto Rotate
        </Label>
      </ControlGroup>
      
      <ControlGroup>
        <Label>Metalness: {params.metalness.toFixed(2)}</Label>
        <Slider 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={params.metalness}
          onChange={(e) => setParams({ ...params, metalness: parseFloat(e.target.value) })}
        />
      </ControlGroup>
      
      <ControlGroup>
        <Label>Roughness: {params.roughness.toFixed(2)}</Label>
        <Slider 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={params.roughness}
          onChange={(e) => setParams({ ...params, roughness: parseFloat(e.target.value) })}
        />
      </ControlGroup>
      
      <ControlGroup>
        <Label>Exposure: {params.exposure.toFixed(2)}</Label>
        <Slider 
          type="range" 
          min="0" 
          max="4" 
          step="0.01" 
          value={params.exposure}
          onChange={(e) => setParams({ ...params, exposure: parseFloat(e.target.value) })}
        />
      </ControlGroup>
      
      <ControlGroup>
        <Label>Resolution:</Label>
        <Select 
          value={params.resolution}
          onChange={(e) => setParams({ ...params, resolution: e.target.value as '2k' | '4k' })}
        >
          <option value="2k">2k</option>
          <option value="4k">4k</option>
        </Select>
      </ControlGroup>
      
      <ControlGroup>
        <Label>Data Type:</Label>
        <Select 
          value={params.dataType === THREE.HalfFloatType ? 'HalfFloatType' : 'FloatType'}
          onChange={(e) => setParams({ 
            ...params, 
            dataType: e.target.value === 'HalfFloatType' ? THREE.HalfFloatType : THREE.FloatType 
          })}
        >
          <option value="HalfFloatType">HalfFloatType</option>
          <option value="FloatType">FloatType</option>
        </Select>
      </ControlGroup>
    </ControlPanel>
  );
}

// Main component
export default function UltraHDRViewer(): JSX.Element {
  const [params, setParams] = useState<SceneProps>({
    autoRotate: true,
    metalness: 1.0,
    roughness: 0.0,
    exposure: 1.0,
    resolution: '2k',
    dataType: THREE.HalfFloatType
  });

  return (
    <Container>
      <InfoPanel>
        <div>
          <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> - UltraHDR texture loader
        </div>
        <div>
          Converted from hdr with <a href="https://gainmap-creator.mono-grid.com/" target="_blank" rel="noopener noreferrer">converter</a>.
        </div>
      </InfoPanel>
      
      <ControlPanelComp params={params} setParams={setParams} />
      
      <Canvas camera={{ position: [0, 0, -6], fov: 50 }}>
        <Scene {...params} />
      </Canvas>
    </Container>
  );
}
