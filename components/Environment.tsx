
import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { ContactShadows, Stars, Sparkles } from '@react-three/drei';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      div: any;
      span: any;
      p: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      color: any;
    }
  }
}

export const Environment: React.FC = () => {
  return (
    <>
      <color attach="background" args={['#050b1a']} />

      {/* Global warm illumination */}
      <ambientLight intensity={0.7} color="#fff4e0" />
      
      {/* Bright Key Light (Main light for the character) */}
      <pointLight 
        position={[3, 4, 6]} 
        intensity={2.5} 
        color="#ffffff" 
        castShadow 
        distance={25} 
        decay={1.5} 
      />
      
      {/* Backlight (Rim light for silhouette) */}
      <pointLight 
        position={[-3, 5, -5]} 
        intensity={2.0} 
        color="#aaccff" 
        distance={20} 
        decay={2} 
      />
      
      {/* Fill Light (Softens shadows on the other side) */}
      <pointLight 
        position={[-5, 2, 5]} 
        intensity={1.2} 
        color="#ffe8cc" 
        distance={15} 
        decay={2} 
      />
      
      {/* Top Spot Light for Hair Detail */}
      <spotLight 
        position={[0, 8, 0]} 
        intensity={3.0} 
        color="#ffffff" 
        angle={0.6} 
        penumbra={1} 
        castShadow 
      />

      <ContactShadows 
        resolution={1024} 
        scale={10} 
        blur={3} 
        opacity={0.5} 
        far={10} 
        color="#000000" 
        position={[0, -3.5, 0]}
      />

      <Stars 
        radius={100} 
        depth={50} 
        count={7000} 
        factor={4} 
        saturation={1} 
        fade 
        speed={1} 
      />
      
      <Sparkles 
        count={300} 
        scale={[12, 12, 12]} 
        size={3} 
        speed={0.2} 
        opacity={0.6}
        color="#e0f0ff"
      />
    </>
  );
};
