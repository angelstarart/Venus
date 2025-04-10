// src/components/Overlay.tsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Project } from '../../types';

interface OverlayProps {
  currentProject: Project;
}

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Header = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  color: #3d3d4d;
  font-family: 'Montserrat', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin: 0;
  font-weight: 200;
  letter-spacing: 0.3em;
`;

const Subtitle = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2em;
  margin: 10px 0 0 0;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #5d5d6d;
  font-style: italic;
`;

const Description = styled.div`
  max-width: 400px;
  margin-top: 30px;
  font-family: 'Cormorant Garamond', serif;
  line-height: 1.8;
  color: #5d5d6d;
`;

const ProjectInfo = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  text-align: right;
  font-family: 'Montserrat', sans-serif;
`;

const ProjectTitle = styled.h2`
  font-size: 1.8em;
  margin: 0;
  font-weight: 200;
  letter-spacing: 0.2em;
  color: #3d3d4d;
  transition: all 0.8s ease;
`;

const ProjectDescription = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1em;
  margin: 15px 0 0 0;
  font-weight: 300;
  color: #5d5d6d;
  max-width: 400px;
  line-height: 1.8;
  transition: all 0.8s ease;
  margin-left: auto;
`;

const ProjectDetails = styled.div`
  margin-top: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8em;
  color: #7d7d8d;
  letter-spacing: 0.1em;
  transition: all 0.8s ease;
`;

const ScrollInstruction = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  font-family: 'Montserrat', sans-serif;
`;

const ScrollText = styled.p`
  margin: 0;
  font-size: 0.8em;
  letter-spacing: 0.2em;
  color: #5d5d6d;
`;

const Overlay: React.FC<OverlayProps> = ({ currentProject }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Fade out
    if (titleRef.current) {titleRef.current.style.opacity = '0';}
    if (descRef.current) {descRef.current.style.opacity = '0';}
    if (detailsRef.current) {detailsRef.current.style.opacity = '0';}
    
    // Wait a bit then fade in with new content
    const timer = setTimeout(() => {
      if (titleRef.current) {titleRef.current.style.opacity = '1';}
      if (descRef.current) {descRef.current.style.opacity = '1';}
      if (detailsRef.current) {detailsRef.current.style.opacity = '1';}
    }, 400);
    
    return () :void => clearTimeout(timer);
  }, [currentProject]);

  return (
    <OverlayContainer>
      <Header>
        <Title>PORTFOLIO</Title>
        <Subtitle>Digital Artistry & Development</Subtitle>
        <Description>
          <p>Exploring the boundaries between technology and aesthetics through interactive digital experiences.</p>
        </Description>
      </Header>
      
      <ProjectInfo>
        <ProjectTitle ref={titleRef}>{currentProject.title}</ProjectTitle>
        <ProjectDescription ref={descRef}>{currentProject.description}</ProjectDescription>
        <ProjectDetails ref={detailsRef}>{currentProject.details}</ProjectDetails>
      </ProjectInfo>
      
      <ScrollInstruction>
        <ScrollText>SCROLL TO EXPLORE</ScrollText>
      </ScrollInstruction>
    </OverlayContainer>
  );
};

export default Overlay;
