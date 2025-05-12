// src/components/Cards.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { Project } from "../../types";

interface CardsProps {
  projects: Project[];
}

const Cards: React.FC<CardsProps> = ({ projects }) => {
  const groupRef = useRef<Group>(null);
  
  // Create cards
  const cards = useMemo(() => 
    projects.map((project, index) => {
      const angle = (index / projects.length) * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const rotation = (-angle + Math.PI) / 2;

      console.log(x)
      
      return {
        project,
        position: [x, 10, z] as [number, number, number],
        rotation: [0, rotation, 0] as [number, number, number],
        index
      };
    }),
  [projects]);

  // Animate cards
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    console.log(cards)
    
    cards.forEach((_card, index) => {
      if (!groupRef.current) {return;}
      
      const cardMesh = groupRef.current.children[index] as Group;
      // console.log(cardMesh)

      cardMesh.position.y = Math.sin(time + index) * 0.1;
      cardMesh.rotation.z = Math.sin((time * 0.5) + index) * 0.02;
    });
  });

  useEffect(() => {
    console.log(cards)
  }, [cards]);

  return (
    <group ref={groupRef}>
      {cards.map((card, index) => (
        <group key={index} position={card.position} rotation={card.rotation}>
          <mesh>
            <boxGeometry args={[4, 3, 0.1]} />
            <meshPhysicalMaterial 
              color={card.project.color}
              metalness={0.1}
              roughness={0.4}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Cards;
