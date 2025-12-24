
/// <reference types="@react-three/fiber" />
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { Group, Mesh, Color, MathUtils } from 'three';
import { Sphere, Cylinder, Torus, Cone, Circle, Box, RoundedBox, Ring } from '@react-three/drei';
import { MouthCue } from '../hooks/useGeminiLive';

interface AvatarProps {
  mouthCue: MouthCue;
}

// Santa Color Palette
const PALETTE = {
  skin: new Color(0xffdfc4), // Rosy Fair Skin
  hair: new Color(0xffffff), // White
  beard: new Color(0xf0f0f0), // Off-white beard
  suit: new Color(0xb31212), // Deep Santa Red
  suitHighlight: new Color(0xd42e2e),
  fur: new Color(0xffffff), // White fur
  belt: new Color(0x1a1a1a), // Black
  buckle: new Color(0xffd700), // Gold
  lips: new Color(0xcc8888), // Natural lip
  eyeWhite: new Color(0xffffff),
  iris: new Color(0x3e6e8a), // Blue/Grey eyes
  pupil: new Color(0x000000),
  mouthInterior: new Color(0x300000),
  glassesFrame: new Color(0xdaa520), // Gold wire
  glass: new Color(0xffffff),
  teeth: new Color(0xeeeeee)
};

export const Avatar: React.FC<AvatarProps> = ({ mouthCue }) => {
  const groupRef = useRef<Group>(null);
  const headGroupRef = useRef<Group>(null);
  const torsoGroupRef = useRef<Group>(null);
  
  // Animation Refs
  const jawRef = useRef<Group>(null);
  const mouthRef = useRef<Group>(null);
  const mustacheRef = useRef<Group>(null);
  const leftEyelidRef = useRef<Mesh>(null);
  const rightEyelidRef = useRef<Mesh>(null);
  // Changed eyebrows to Groups for multi-sphere structure
  const leftBrowRef = useRef<Group>(null);
  const rightBrowRef = useRef<Group>(null);
  const hatRef = useRef<Group>(null);
  const pompomRef = useRef<Mesh>(null);

  const [blink, setBlink] = useState(false);

  // Random blink logic
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150); 
      const nextBlink = Math.random() * 3000 + 2000;
      timeout = setTimeout(triggerBlink, nextBlink);
    };
    timeout = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Beard Generation
  // We split beard into Static (Sideburns/Cheeks) and Dynamic (Chin that moves with jaw)
  const { staticBeard, dynamicBeard } = useMemo(() => {
    const staticParts = [];
    const dynamicParts = [];
    
    // 1. Static Sideburns / Cheeks
    for (let i = 0; i < 7; i++) { // Left side
        const angle = -0.3 - (i * 0.25);
        staticParts.push({ pos: [Math.sin(angle) * 0.98, -0.15 - (i * 0.08), Math.cos(angle) * 0.88], scale: 0.38 });
    }
    for (let i = 0; i < 7; i++) { // Right side
        const angle = 0.3 + (i * 0.25);
        staticParts.push({ pos: [Math.sin(angle) * 0.98, -0.15 - (i * 0.08), Math.cos(angle) * 0.88], scale: 0.38 });
    }

    // 2. Dynamic Chin Beard (Attached to Jaw)
    // Central mass
    dynamicParts.push({ pos: [0, -0.1, 0.4], scale: 0.45 });
    dynamicParts.push({ pos: [0, -0.35, 0.35], scale: 0.42 });
    dynamicParts.push({ pos: [-0.3, -0.2, 0.3], scale: 0.4 });
    dynamicParts.push({ pos: [0.3, -0.2, 0.3], scale: 0.4 });
    // Lower tips
    dynamicParts.push({ pos: [0, -0.6, 0.25], scale: 0.35 });
    dynamicParts.push({ pos: [-0.2, -0.5, 0.2], scale: 0.3 });
    dynamicParts.push({ pos: [0.2, -0.5, 0.2], scale: 0.3 });

    return { staticBeard: staticParts, dynamicBeard: dynamicParts };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { open, width } = mouthCue;

    // 1. Head Tracking
    if (headGroupRef.current) {
        const mouseX = state.pointer.x; 
        const mouseY = state.pointer.y;
        
        const targetRotY = mouseX * 0.3;
        const targetRotX = -mouseY * 0.15;

        headGroupRef.current.rotation.y = MathUtils.lerp(headGroupRef.current.rotation.y, targetRotY, 0.1);
        headGroupRef.current.rotation.x = MathUtils.lerp(headGroupRef.current.rotation.x, targetRotX, 0.1);
        headGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.01;
    }

    // 2. Breathing
    if (torsoGroupRef.current) {
        torsoGroupRef.current.position.y = -2.5 + Math.sin(t * 1) * 0.01;
        torsoGroupRef.current.scale.x = 1 + Math.sin(t * 1.5) * 0.005;
        torsoGroupRef.current.scale.z = 1 + Math.sin(t * 1.5) * 0.005;
    }

    // 3. Hat Physics
    if (pompomRef.current) {
        pompomRef.current.position.x = 0.6 + Math.sin(t * 2) * 0.05 + (headGroupRef.current?.rotation.y || 0) * -0.3;
        pompomRef.current.position.y = -0.4 + Math.cos(t * 3) * 0.05;
    }

    // 4. Lip & Beard Sync
    if (jawRef.current && mouthRef.current) {
        // Jaw drops based on volume
        const jawDrop = open * 0.25; 
        jawRef.current.position.y = MathUtils.lerp(jawRef.current.position.y, -0.4 - jawDrop, 0.25);
        
        // Push jaw forward slightly when opening for realism
        jawRef.current.position.z = MathUtils.lerp(jawRef.current.position.z, 0.6 + (jawDrop * 0.2), 0.2);

        // Mouth shaping
        const targetScaleX = 0.8 + (width * 0.3); 
        const targetScaleY = 0.3 + (open * 1.0);
        mouthRef.current.scale.x = MathUtils.lerp(mouthRef.current.scale.x, targetScaleX, 0.3);
        mouthRef.current.scale.y = MathUtils.lerp(mouthRef.current.scale.y, targetScaleY, 0.3);

        // Mustache moves slightly with upper lip/expression
        if (mustacheRef.current) {
           const mustacheLift = open * 0.05;
           mustacheRef.current.position.y = -0.12 + mustacheLift;
           mustacheRef.current.rotation.z = Math.sin(t * 10) * 0.02 * open; // Quiver when talking loud
        }
    }

    // 5. Blinking
    if (leftEyelidRef.current && rightEyelidRef.current) {
        const openRot = -0.1;
        const closedRot = Math.PI / 2 + 0.1;
        const targetRot = blink ? closedRot : openRot; 
        
        leftEyelidRef.current.rotation.x = MathUtils.lerp(leftEyelidRef.current.rotation.x, targetRot, 0.45);
        rightEyelidRef.current.rotation.x = MathUtils.lerp(rightEyelidRef.current.rotation.x, targetRot, 0.45);
    }

    // 6. Eyebrows (Expressive)
    if (leftBrowRef.current && rightBrowRef.current) {
        const browLift = (open * 0.15) + (Math.sin(t * 0.5) * 0.02);
        // Base position is 0.68, add lift
        const baseY = 0.0; // Reset relative y
        
        leftBrowRef.current.position.y = MathUtils.lerp(leftBrowRef.current.position.y, baseY + browLift, 0.1);
        rightBrowRef.current.position.y = MathUtils.lerp(rightBrowRef.current.position.y, baseY + browLift, 0.1);
        
        // Furrow when "thinking" 
        leftBrowRef.current.rotation.z = 0.15 - Math.sin(t) * 0.02;
        rightBrowRef.current.rotation.z = -0.15 + Math.sin(t) * 0.02;
    }
  });

  return (
    // Standard intrinsic element tags (lowercase) are supported by @react-three/fiber
    <group ref={groupRef} position={[0, 0.2, 0]}>
      
      {/* --- SANTA SUIT BODY --- */}
      <group>
          <Cylinder args={[0.4, 0.5, 0.8, 32]} position={[0, -1.4, 0.1]}>
             <meshToonMaterial color={PALETTE.skin} />
          </Cylinder>

          <group ref={torsoGroupRef} position={[0, -2.5, 0]}>
             <Sphere args={[1.35, 32, 32]} position={[0, -0.5, 0]} scale={[1, 1.05, 0.85]}>
                 <meshToonMaterial color={PALETTE.suit} />
             </Sphere>
             <Sphere args={[0.6, 24, 24]} position={[-0.9, 0.4, 0]}>
                 <meshToonMaterial color={PALETTE.suit} />
             </Sphere>
             <Sphere args={[0.6, 24, 24]} position={[0.9, 0.4, 0]}>
                 <meshToonMaterial color={PALETTE.suit} />
             </Sphere>

             {/* Fur Trim */}
             <Cylinder args={[0.22, 0.28, 2.5, 32]} position={[0, -0.5, 0.8]} rotation={[0.08, 0, 0]}>
                 <meshToonMaterial color={PALETTE.fur} />
             </Cylinder>
             <Torus args={[0.5, 0.15, 16, 32]} position={[0, 0.8, 0.2]} rotation={[-0.4, 0, 0]}>
                 <meshToonMaterial color={PALETTE.fur} />
             </Torus>

             {/* Belt & Buckle */}
             <Cylinder args={[1.37, 1.37, 0.22, 32]} position={[0, -0.8, 0]}>
                 <meshToonMaterial color={PALETTE.belt} />
             </Cylinder>
             <Box args={[0.45, 0.35, 0.1]} position={[0, -0.8, 1.3]}>
                <meshStandardMaterial color={PALETTE.buckle} metalness={0.7} roughness={0.3} />
             </Box>
             <Box args={[0.35, 0.25, 0.12]} position={[0, -0.8, 1.3]}>
                <meshStandardMaterial color={PALETTE.belt} />
             </Box>
          </group>
      </group>

      {/* --- HEAD GROUP --- */}
      <group ref={headGroupRef}>
        
        {/* Face Base */}
        <Sphere args={[1, 32, 32]} scale={[1, 1.15, 1]} castShadow>
            <meshToonMaterial color={PALETTE.skin} />
        </Sphere>
        
        {/* Forehead Wrinkles (Old Santa) */}
        <group position={[0, 0.75, 0.85]} rotation={[-0.2, 0, 0]}>
            <Torus args={[0.4, 0.015, 8, 32, 1.5]} position={[0, 0.1, 0]} rotation={[0, 0, -0.75]}>
                <meshBasicMaterial color="#eecbad" />
            </Torus>
            <Torus args={[0.5, 0.015, 8, 32, 1.8]} position={[0, -0.05, 0]} rotation={[0, 0, -0.9]}>
                <meshBasicMaterial color="#eecbad" />
            </Torus>
        </group>

        {/* Rosy Cheeks */}
        <Sphere args={[0.32, 32, 32]} position={[-0.55, -0.05, 0.75]} scale={[1, 0.8, 0.4]}>
            <meshBasicMaterial color={new Color(0xffbfa0)} transparent opacity={0.5} />
        </Sphere>
        <Sphere args={[0.32, 32, 32]} position={[0.55, -0.05, 0.75]} scale={[1, 0.8, 0.4]}>
            <meshBasicMaterial color={new Color(0xffbfa0)} transparent opacity={0.5} />
        </Sphere>

        {/* Nose - Bulbous & Reddish */}
        <Sphere args={[0.16, 32, 32]} position={[0, 0.05, 1.0]} scale={[1, 0.9, 1]}>
            <meshToonMaterial color={new Color(0xffcbb3)} />
        </Sphere>

        {/* Ears */}
        <Sphere args={[0.22, 16, 16]} position={[-0.98, 0.15, -0.1]} scale={[0.6, 1, 0.4]} rotation={[0, 0, -0.2]}>
            <meshToonMaterial color={PALETTE.skin} />
        </Sphere>
        <Sphere args={[0.22, 16, 16]} position={[0.98, 0.15, -0.1]} scale={[0.6, 1, 0.4]} rotation={[0, 0, 0.2]}>
            <meshToonMaterial color={PALETTE.skin} />
        </Sphere>

        {/* Hair - Back & Sides */}
        <Sphere args={[1.02, 32, 32]} position={[0, 0.1, -0.2]} scale={[1.05, 1.1, 1]}>
            <meshToonMaterial color={PALETTE.hair} />
        </Sphere>
        <Sphere args={[0.35, 16, 16]} position={[-0.92, 0.1, 0.3]}><meshToonMaterial color={PALETTE.hair} /></Sphere>
        <Sphere args={[0.35, 16, 16]} position={[0.92, 0.1, 0.3]}><meshToonMaterial color={PALETTE.hair} /></Sphere>

        {/* STATIC BEARD (Sideburns/Cheeks) */}
        {staticBeard.map((clump, i) => (
            <Sphere key={`s-beard-${i}`} args={[clump.scale as number, 16, 16]} position={clump.pos as any}>
                <meshToonMaterial color={PALETTE.beard} />
            </Sphere>
        ))}

        {/* MUSTACHE - Attached to Head (Upper Lip) */}
        <group ref={mustacheRef} position={[0, -0.12, 1.1]} rotation={[0, 0, 0]}>
            {/* Left side */}
            <Sphere args={[0.16, 16, 16]} position={[-0.22, 0, 0]} scale={[1.8, 0.8, 0.8]} rotation={[0, 0, 0.35]}>
                <meshToonMaterial color={PALETTE.beard} />
            </Sphere>
            {/* Right side */}
            <Sphere args={[0.16, 16, 16]} position={[0.22, 0, 0]} scale={[1.8, 0.8, 0.8]} rotation={[0, 0, -0.35]}>
                <meshToonMaterial color={PALETTE.beard} />
            </Sphere>
        </group>

        {/* --- DYNAMIC JAW GROUP (Moves with speech) --- */}
        {/* Initial position slightly lower than head center */}
        <group ref={jawRef} position={[0, -0.4, 0.6]}>
            
            {/* Mouth Interior */}
            <group ref={mouthRef} position={[0, 0.15, 0.3]}>
                <Sphere args={[0.18, 32, 16]} scale={[1, 0.6, 0.5]}>
                    <meshBasicMaterial color={PALETTE.mouthInterior} />
                </Sphere>
                {/* Tongue */}
                <Sphere args={[0.08, 16, 16]} position={[0, -0.08, 0.05]} scale={[1.5, 0.5, 1]}>
                    <meshStandardMaterial color={new Color(0xd4887f)} />
                </Sphere>
                {/* Teeth */}
                <RoundedBox args={[0.2, 0.04, 0.02]} position={[0, 0.06, 0.08]} radius={0.005}>
                    <meshStandardMaterial color={PALETTE.teeth} />
                </RoundedBox>
            </group>
            
            {/* DYNAMIC BEARD (Chin) */}
            <group position={[0, 0, 0]}>
                 {dynamicBeard.map((clump, i) => (
                    <Sphere key={`d-beard-${i}`} args={[clump.scale as number, 16, 16]} position={clump.pos as any}>
                        <meshToonMaterial color={PALETTE.beard} />
                    </Sphere>
                ))}
            </group>
        </group>

        {/* --- SANTA HAT --- */}
        <group ref={hatRef} position={[0, 0.85, 0]} rotation={[-0.2, 0, 0]}>
            <Torus args={[1.02, 0.22, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshToonMaterial color={PALETTE.fur} />
            </Torus>
            <group position={[0, 0.5, -0.2]} rotation={[-0.4, 0, 0]}>
                <Cone args={[0.98, 2.0, 32]} position={[0, 0.5, 0]}>
                    <meshToonMaterial color={PALETTE.suit} />
                </Cone>
                <group position={[0, 1.5, 0]} rotation={[0, 0, -0.5]}> 
                     <Cone args={[0.42, 0.8, 16]} position={[0.2, -0.1, 0]} rotation={[0, 0, -1.2]}>
                         <meshToonMaterial color={PALETTE.suit} />
                     </Cone>
                     <Sphere ref={pompomRef} args={[0.28, 16, 16]} position={[0.6, -0.4, 0]}>
                         <meshToonMaterial color={PALETTE.fur} />
                     </Sphere>
                </group>
            </group>
        </group>

        {/* --- EYES --- */}
        <group position={[0, 0.35, 0.85]}>
            {/* Left Eye */}
            <group position={[-0.35, 0, 0]}>
                 <Sphere args={[0.15, 32, 32]} position={[0, 0, 0.05]}>
                     <meshStandardMaterial color={PALETTE.eyeWhite} />
                 </Sphere>
                 <Circle args={[0.09, 32]} position={[0, 0, 0.19]}>
                     <meshStandardMaterial color={PALETTE.iris} />
                 </Circle>
                 <Circle args={[0.04, 32]} position={[0, 0, 0.20]}>
                     <meshBasicMaterial color={PALETTE.pupil} />
                 </Circle>
                 <Circle args={[0.02, 16]} position={[-0.03, 0.04, 0.21]}>
                     <meshBasicMaterial color="white" />
                 </Circle>
                 <group position={[0, 0, 0.05]}>
                    <Sphere ref={leftEyelidRef} args={[0.155, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]}>
                         <meshToonMaterial color={PALETTE.skin} side={2} />
                    </Sphere>
                 </group>
            </group>

            {/* Right Eye */}
            <group position={[0.35, 0, 0]}>
                 <Sphere args={[0.15, 32, 32]} position={[0, 0, 0.05]}>
                     <meshStandardMaterial color={PALETTE.eyeWhite} />
                 </Sphere>
                 <Circle args={[0.09, 32]} position={[0, 0, 0.19]}>
                     <meshStandardMaterial color={PALETTE.iris} />
                 </Circle>
                 <Circle args={[0.04, 32]} position={[0, 0, 0.20]}>
                     <meshBasicMaterial color={PALETTE.pupil} />
                 </Circle>
                 <Circle args={[0.02, 16]} position={[-0.03, 0.04, 0.21]}>
                     <meshBasicMaterial color="white" />
                 </Circle>
                 <group position={[0, 0, 0.05]}>
                    <Sphere ref={rightEyelidRef} args={[0.155, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]}>
                         <meshToonMaterial color={PALETTE.skin} side={2} />
                    </Sphere>
                 </group>
            </group>
        </group>

        {/* --- ROUND GLASSES (Classic Santa) --- */}
        <group position={[0, 0.28, 1.05]}>
             {/* Frames */}
             <Torus args={[0.17, 0.02, 16, 32]} position={[-0.32, 0, 0]}>
                 <meshStandardMaterial color={PALETTE.glassesFrame} metalness={1.0} roughness={0.2} />
             </Torus>
             <Torus args={[0.17, 0.02, 16, 32]} position={[0.32, 0, 0]}>
                 <meshStandardMaterial color={PALETTE.glassesFrame} metalness={1.0} roughness={0.2} />
             </Torus>
             
             {/* Bridge */}
             <Torus args={[0.1, 0.02, 16, 16, Math.PI]} position={[0, 0.0, 0]} rotation={[0, 0, Math.PI]}>
                  <meshStandardMaterial color={PALETTE.glassesFrame} metalness={1.0} roughness={0.2} />
             </Torus>

             {/* Side Arms (Temples) */}
             <Cylinder args={[0.015, 0.015, 0.8]} position={[-0.49, 0.05, -0.4]} rotation={[0, -0.1, Math.PI/2]}>
                  <meshStandardMaterial color={PALETTE.glassesFrame} metalness={1.0} roughness={0.2} />
             </Cylinder>
             <Cylinder args={[0.015, 0.015, 0.8]} position={[0.49, 0.05, -0.4]} rotation={[0, 0.1, Math.PI/2]}>
                  <meshStandardMaterial color={PALETTE.glassesFrame} metalness={1.0} roughness={0.2} />
             </Cylinder>

             {/* Lenses */}
             <Circle args={[0.16, 32]} position={[-0.32, 0, 0.02]}>
                <meshPhysicalMaterial 
                    color={PALETTE.glass} 
                    metalness={0.2} 
                    roughness={0} 
                    transparent 
                    opacity={0.25} 
                    transmission={0.95} 
                    thickness={0.2} 
                />
             </Circle>
             <Circle args={[0.16, 32]} position={[0.32, 0, 0.02]}>
                <meshPhysicalMaterial 
                    color={PALETTE.glass} 
                    metalness={0.2} 
                    roughness={0} 
                    transparent 
                    opacity={0.25} 
                    transmission={0.95} 
                    thickness={0.2} 
                />
             </Circle>
        </group>

        {/* --- EYEBROWS (Fluffy Groups) --- */}
        <group position={[0, 0.68, 0.82]} rotation={[-0.2, 0, 0]}>
            {/* Left Brow Group */}
            <group ref={leftBrowRef} position={[-0.35, 0, 0]} rotation={[0, 0.35, 0.15]}>
                <Sphere args={[0.09, 16, 16]} position={[-0.12, -0.02, 0]}><meshToonMaterial color={PALETTE.hair} /></Sphere>
                <Sphere args={[0.10, 16, 16]} position={[0, 0.02, 0]}><meshToonMaterial color={PALETTE.hair} /></Sphere>
                <Sphere args={[0.09, 16, 16]} position={[0.12, -0.01, 0]}><meshToonMaterial color={PALETTE.hair} /></Sphere>
            </group>
            {/* Right Brow Group */}
            <group ref={rightBrowRef} position={[0.35, 0, 0]} rotation={[0, -0.35, -0.15]}>
                <Sphere args={[0.09, 16, 16]} position={[-0.12, -0.01, 0]}><meshToonMaterial color={PALETTE.hair} /></Sphere>
                <Sphere args={[0.10, 16, 16]} position={[0, 0.02, 0]}><meshToonMaterial color={PALETTE.hair} /></Sphere>
                <Sphere args={[0.09, 16, 16]} position={[0.12, -0.02, 0]}><meshToonMaterial color={PALETTE.hair} /></Sphere>
            </group>
        </group>

      </group>
    </group>
  );
};
