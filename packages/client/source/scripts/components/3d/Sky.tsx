import React, { useMemo, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky as DreiSky } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

// Styled component for full-screen container
const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

// Interface for Sky parameters
interface SkyParams {
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
  elevation: number;
  azimuth: number;
  exposure: number;
}

// Interface for Sky component props
interface SkyComponentProps {
  initialParams?: Partial<SkyParams>;
  showControls?: boolean;
  showGrid?: boolean;
}

// Default sky parameters
const defaultSkyParams: SkyParams = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.7,
  elevation: 2,
  azimuth: 180,
  exposure: 0.5
};

// SkyControls component for GUI controls
const SkyControls: React.FC<{
  params: SkyParams;
  onChange: (params: SkyParams) => void;
}> = ({ params, onChange }) => {
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    // Ensure name is a valid key of SkyParams
    if (Object.keys(params).includes(name)) {
      onChange({
        ...params,
        [name]: numValue
      });
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: '10px',
      borderRadius: '5px',
      color: 'white',
      width: '200px'
    }}>
      <h3>Sky Controls</h3>
      {(Object.entries(params) as [keyof SkyParams, number][]).map(([key, value]) => (
        <div key={key} style={{ margin: '5px 0' }}>
          <label style={{ display: 'block', marginBottom: '2px' }}>{key}</label>
          <input
            type="range"
            name={key}
            value={value}
            onChange={handleChange}
            min={
              key === 'turbidity' ? 0 : 
              key === 'rayleigh' ? 0 : 
              key === 'mieCoefficient' ? 0 : 
              key === 'mieDirectionalG' ? 0 : 
              key === 'elevation' ? 0 : 
              key === 'azimuth' ? -180 : 
              0
            }
            max={
              key === 'turbidity' ? 20 : 
              key === 'rayleigh' ? 4 : 
              key === 'mieCoefficient' ? 0.1 : 
              key === 'mieDirectionalG' ? 1 : 
              key === 'elevation' ? 90 : 
              key === 'azimuth' ? 180 : 
              1
            }
            step={
              key === 'mieCoefficient' ? 0.001 : 
              key === 'mieDirectionalG' ? 0.001 : 
              key === 'exposure' ? 0.0001 : 
              0.1
            }
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: '0.8em' }}>{value.toFixed(4)}</span>
        </div>
      ))}
    </div>
  );
};

// Scene component
const SkyScene: React.FC<{
  params: SkyParams;
  showGrid: boolean;
}> = ({ params, showGrid }) => {
  const { scene, gl } = useThree();

  // Calculate sun position from elevation and azimuth
  const sunPosition = useMemo(() => {
    const phi = THREE.MathUtils.degToRad(90 - params.elevation);
    const theta = THREE.MathUtils.degToRad(params.azimuth);
    const sunDirection = new THREE.Vector3();
    sunDirection.setFromSphericalCoords(1, phi, theta);
    return sunDirection;
  }, [params.elevation, params.azimuth]);

  // Update renderer exposure
  useEffect(() => {
    console.log(gl)
    gl.toneMappingExposure = params.exposure;
  }, [gl, params.exposure]);

  return (
    <>
      {/* Sky */}
      <DreiSky 
        distance={450000}
        sunPosition={sunPosition}
        turbidity={params.turbidity}
        rayleigh={params.rayleigh}
        mieCoefficient={params.mieCoefficient}
        mieDirectionalG={params.mieDirectionalG}
      />

      {/* Optional grid helper */}
      {showGrid && (
        <gridHelper args={[10000, 2, 0xffffff, 0xffffff]} />
      )}
    </>
  );
};

// Main component
const SkyComponent: React.FC<SkyComponentProps> = ({ 
  initialParams = {}, 
  showControls = true,
  showGrid = true
}) => {
  // Merge default params with initial params
  const [params, setParams] = useState<SkyParams>({
    ...defaultSkyParams,
    ...(initialParams as Partial<Record<keyof SkyParams, number>>)
  });

  useEffect(() => {
    console.log(params)
  }, [params]);

  return (
    <FullScreenContainer>
      <Canvas
        camera={{ position: [0, 100, 2000], fov: 60, near: 100, far: 2000000 }}
        gl={{ 
          alpha: false,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: params.exposure
        }}
      >
        <SkyScene params={params} showGrid={showGrid} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>

      {showControls && (
        <SkyControls params={params} onChange={setParams} />
      )}
    </FullScreenContainer>
  );
};

export default SkyComponent;
