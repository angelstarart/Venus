import type { ThreeElements } from "@react-three/fiber";

declare module '*.pdf';
declare module '*.jpg';
declare module '*.png';
declare module "*.svg";
declare module '*.ico';
// declare module 'core-js/stable';
// declare module 'regenerator-runtime/runtime';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {
        [key: string];
      }
    }
  }
}

