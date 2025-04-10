// src/types/index.ts
import type { Group, Vector3 } from 'three';

export interface Project {
  title: string;
  description: string;
  details: string;
  color: number;
}

export interface ProjectCard {
  mesh: Group;
  title: string;
  description: string;
  details: string;
  initialPosition: Vector3;
}
