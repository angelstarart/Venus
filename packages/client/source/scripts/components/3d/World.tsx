import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Sky,
  Environment,
  OrbitControls,
  Stars,
  PositionalAudio,
  useTexture,
  Text3D,
  Html,
  Billboard
} from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

// Types
interface User {
  id: string;
  username: string;
  color?: string;
  joinedAt?: string;
  bio?: string;
  [key: string]: any;
}

interface NFT {
  id: string;
  title: string;
  imageUrl?: string;
  owner: string;
  [key: string]: any;
}

interface AvatarProps {
  position: [number, number, number];
  username: string;
  isCurrentUser: boolean;
  color: string;
  onInteract: () => void;
}

interface NFTDisplayProps {
  position: [number, number, number];
  rotation: [number, number, number];
  imageUrl: string;
  title: string;
  owner: string;
}

interface World3DProps {
  users?: User[];
  currentUser?: User | null;
  nfts?: NFT[];
}

// User avatar component
const Avatar: React.FC<AvatarProps> = ({ position, username, isCurrentUser, color, onInteract }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 2, 0]}
      >
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          {username}
          <meshNormalMaterial />
        </Text3D>
      </Billboard>
      {isCurrentUser ? null : (
        <Html position={[0, -1.5, 0]}>
          <button
            onClick={onInteract}
            style={{
              background: '#6e8efb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            Connect
          </button>
        </Html>
      )}
    </group>
  );
};

// NFT display component
const NFTDisplay: React.FC<NFTDisplayProps> = ({ position, rotation, imageUrl, title, owner }) => {
  const texture = useTexture(imageUrl);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        position={[0, -2, 0]}
        size={0.3}
        height={0.05}
      >
        {title}
        <meshNormalMaterial/>
      </Text3D>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        position={[0, -2.5, 0]}
        size={0.2}
        height={0.05}
      >
        {`Owned by: ${owner}`}
        <meshNormalMaterial/>
      </Text3D>
    </group>
  );
};

// Floor component
const Floor: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
};

// Camera controls
const CameraController: React.FC = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 10);
  }, [camera]);

  return <OrbitControls enableDamping dampingFactor={0.1} target={[0, 0, 0]} />;
};

// Main 3D world component
const World3D: React.FC<World3DProps> = ({ users = [], currentUser, nfts = [] }) => {
  const [showUserInfo, setShowUserInfo] = useState<User | null>(null);

  const handleInteract = (user: User) => {
    setShowUserInfo(user);
  };

  return (
    <Wrapper>
      <Canvas shadows>
        <CameraController />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <Sky sunPosition={[100, 10, 100]} />
          <Stars radius={100} depth={50} count={1000} factor={4} />

          {/* Render all users as avatars */}
          {users.map((user, index) => (
            <Avatar
              key={user.id}
              position={[
                Math.cos(index * (Math.PI * 2) / users.length) * 10,
                0,
                Math.sin(index * (Math.PI * 2) / users.length) * 10
              ]}
              username={user.username}
              isCurrentUser={currentUser ? user.id === currentUser.id : false}
              color={user.color || '#1e88e5'}
              onInteract={() => handleInteract(user)}
            />
          ))}

          {/* Display NFTs in a circle */}
          {nfts.map((nft, index) => (
            <NFTDisplay
              key={nft.id}
              position={[
                Math.cos(index * (Math.PI * 2) / nfts.length) * 20,
                5,
                Math.sin(index * (Math.PI * 2) / nfts.length) * 20
              ]}
              rotation={[
                0,
                -index * (Math.PI * 2) / nfts.length + Math.PI/2,
                0
              ]}
              imageUrl={nft.imageUrl || '/api/placeholder/400/400'}
              title={nft.title}
              owner={nft.owner}
            />
          ))}

          <Floor />
        </Suspense>
      </Canvas>

      {showUserInfo && (
        <UserInfoPanel>
          <h3>{showUserInfo.username}</h3>
          <p>Member since: {showUserInfo.joinedAt ? new Date(showUserInfo.joinedAt).toLocaleDateString() : 'Unknown'}</p>
          <p>{showUserInfo.bio || 'No bio available'}</p>
          <div className="buttons">
            <button>Follow</button>
            <button>Message</button>
          </div>
          <button className="close" onClick={() => setShowUserInfo(null)}>×</button>
        </UserInfoPanel>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const UserInfoPanel = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
  }

  .buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;

    button {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 4px;
      background: #6e8efb;
      color: white;
      cursor: pointer;

      &:hover {
        background: #5c7cfa;
      }
    }
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }
`;

export default World3D;