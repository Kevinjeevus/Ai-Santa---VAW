
/// <reference types="react" />
import React from 'react';
import { ThreeElements } from '@react-three/fiber';
import { ContactShadows, Environment as DreiEnvironment, Stars, Sparkles } from '@react-three/drei';

// Augment the JSX namespace to include Three.js elements provided by @react-three/fiber
// This resolves "Property '...' does not exist on type 'JSX.IntrinsicElements'"
// Using both global JSX and React.JSX namespaces for broader compatibility across TS/React versions
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

export const Environment: React.FC = () => {
  return (
    <>
      {/* Standard intrinsic element tags (lowercase) are supported by @react-three/fiber */}
      <ambientLight intensity={0.5} color="#b0ceff" />
      
      {/* Warm Fireplace Glow from right */}
      <pointLight position={[5, 2, 5]} intensity={2.0} color="#ffaa55" castShadow distance={12} decay={2} />
      
      {/* Cool Moonlight from left */}
      <pointLight position={[-5, 5, -5]} intensity={1.5} color="#aaccff" />
      
      {/* Frontal Fill Light - Essential for Face/Beard Detail */}
      <pointLight position={[0, 1, 4]} intensity={0.8} color="#fff0dd" distance={8} decay={2} />
      
      {/* Top Rim light for white hair/fur pop */}
      <spotLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" angle={0.5} penumbra={1} />

      <ContactShadows 
        resolution={1024} 
        scale={15} 
        blur={2} 
        opacity={0.6} 
        far={10} 
        color="#001133" 
      />

      {/* Magical Atmosphere */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Gentle falling snow effect */}
      <Sparkles 
        count={200} 
        scale={[10, 10, 10]} 
        size={4} 
        speed={0.4} 
        opacity={0.7}
        color="#ffffff"
      />
      
      <DreiEnvironment preset="night" />
    </>
  );
};
