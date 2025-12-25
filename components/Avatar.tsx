
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { Group, Mesh, Color, MathUtils, Vector3 } from 'three';
import { Sphere, Cylinder, Box, RoundedBox } from '@react-three/drei';
import { MouthCue } from '../hooks/useGeminiLive';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      div: any;
      span: any;
      h1: any;
      h2: any;
      h3: any;
      p: any;
      button: any;
      svg: any;
      path: any;
      input: any;
      label: any;
      textarea: any;
      form: any;
      circle: any;
      group: any;
      mesh: any;
      meshToonMaterial: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhysicalMaterial: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      boxGeometry: any;
      roundedBoxGeometry: any;
      circleGeometry: any;
      // Fix: Adding torusGeometry to intrinsic elements to resolve JSX type error on line 128
      torusGeometry: any;
    }
  }
}

interface AvatarProps {
  mouthCue: MouthCue;
}

const PALETTE = {
  skin: new Color(0xffdbac), // Warm child skin tone
  hair: new Color(0x4e342e), // Dark brown
  shirt: new Color(0x34a853), // Friendly green
  eyes: new Color(0x2d5a27),
  white: new Color(0xffffff),
  mouth: new Color(0x600000),
  tongue: new Color(0xff8888)
};

export const Avatar: React.FC<AvatarProps> = ({ mouthCue }) => {
  const rootRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const torsoRef = useRef<Group>(null);
  const jawRef = useRef<Group>(null);
  const mouthInnerRef = useRef<Group>(null);
  const leftEyeRef = useRef<Group>(null);
  const rightEyeRef = useRef<Group>(null);
  const leftEyelidRef = useRef<Mesh>(null);
  const rightEyelidRef = useRef<Mesh>(null);

  const [blink, setBlink] = useState(false);

  // Blinking logic
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
      timeout = setTimeout(triggerBlink, Math.random() * 4000 + 2000);
    };
    timeout = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { open, width } = mouthCue;

    // 1. Head Tracking
    if (headRef.current) {
      const targetX = -state.pointer.y * 0.2;
      const targetY = state.pointer.x * 0.4;
      headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, targetX, 0.1);
      headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, targetY, 0.1);
      headRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
    }

    // 2. Torso Swaying (Breathing)
    if (torsoRef.current) {
      torsoRef.current.rotation.y = Math.sin(t * 0.5) * 0.02;
      torsoRef.current.position.y = -2.2 + Math.sin(t * 1.5) * 0.01;
    }

    // 3. Mouth & Jaw Movement
    if (jawRef.current && mouthInnerRef.current) {
      const jawDrop = open * 0.25;
      jawRef.current.position.y = MathUtils.lerp(jawRef.current.position.y, -0.45 - jawDrop, 0.2);
      
      const mScaleY = 0.1 + (open * 1.2);
      const mScaleX = 0.8 + (width * 0.4);
      mouthInnerRef.current.scale.y = MathUtils.lerp(mouthInnerRef.current.scale.y, mScaleY, 0.3);
      mouthInnerRef.current.scale.x = MathUtils.lerp(mouthInnerRef.current.scale.x, mScaleX, 0.3);
    }

    // 4. Eye Blinking
    if (leftEyelidRef.current && rightEyelidRef.current) {
      const targetScaleY = blink ? 1 : 0.01;
      leftEyelidRef.current.scale.y = MathUtils.lerp(leftEyelidRef.current.scale.y, targetScaleY, 0.5);
      rightEyelidRef.current.scale.y = MathUtils.lerp(rightEyelidRef.current.scale.y, targetScaleY, 0.5);
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.5, 0]}>
      {/* --- BODY (TORSO) --- */}
      <group ref={torsoRef} position={[0, -2.2, 0]}>
        {/* Shirt Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.9, 1.8, 32]} />
          <meshStandardMaterial color={PALETTE.shirt} roughness={0.7} />
        </mesh>
        {/* Neck Fur/Collar */}
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.35, 0.1, 16, 32]} />
          <meshStandardMaterial color={PALETTE.white} />
        </mesh>
        {/* Small Logo on Shirt */}
        <mesh position={[0, 0.4, 0.75]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={PALETTE.white} />
        </mesh>
      </group>

      {/* --- HEAD SYSTEM --- */}
      <group ref={headRef} position={[0, 0.4, 0]}>
        {/* Face */}
        <mesh scale={[1, 1.1, 1]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={PALETTE.skin} roughness={0.8} />
        </mesh>

        {/* Hair - Stylish Messy Cut */}
        <group position={[0, 0.3, 0]}>
          <mesh position={[0, 0.2, -0.2]} scale={[1.05, 1, 1]}>
            <sphereGeometry args={[1.0, 32, 32]} />
            <meshStandardMaterial color={PALETTE.hair} />
          </mesh>
          {/* Hair Tufts */}
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.cos(i) * 0.8, 
                0.8 + Math.sin(i * 2) * 0.1, 
                Math.sin(i) * 0.6
              ]}
              rotation={[Math.random(), Math.random(), Math.random()]}
            >
              <sphereGeometry args={[0.25, 8, 8]} />
              <meshStandardMaterial color={PALETTE.hair} />
            </mesh>
          ))}
        </group>

        {/* Ears */}
        <mesh position={[-1, 0, 0]} scale={[0.5, 0.8, 0.3]} rotation={[0, 0, -0.2]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={PALETTE.skin} />
        </mesh>
        <mesh position={[1, 0, 0]} scale={[0.5, 0.8, 0.3]} rotation={[0, 0, 0.2]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={PALETTE.skin} />
        </mesh>

        {/* Eyes */}
        <group position={[0, 0.25, 0.8]}>
          {/* Left Eye */}
          <group ref={leftEyeRef} position={[-0.35, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshStandardMaterial color={PALETTE.white} />
            </mesh>
            <mesh position={[0, 0, 0.14]}>
              <circleGeometry args={[0.1, 32]} />
              <meshStandardMaterial color={PALETTE.eyes} />
            </mesh>
            <mesh position={[0, 0, 0.15]}>
              <circleGeometry args={[0.04, 32]} />
              <meshBasicMaterial color="black" />
            </mesh>
            {/* Eyelid (Blink) */}
            <mesh ref={leftEyelidRef} position={[0, 0.08, 0.1]} scale={[1.2, 0.01, 1]}>
              <boxGeometry args={[0.35, 0.2, 0.1]} />
              <meshStandardMaterial color={PALETTE.skin} />
            </mesh>
          </group>

          {/* Right Eye */}
          <group ref={rightEyeRef} position={[0.35, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshStandardMaterial color={PALETTE.white} />
            </mesh>
            <mesh position={[0, 0, 0.14]}>
              <circleGeometry args={[0.1, 32]} />
              <meshStandardMaterial color={PALETTE.eyes} />
            </mesh>
            <mesh position={[0, 0, 0.15]}>
              <circleGeometry args={[0.04, 32]} />
              <meshBasicMaterial color="black" />
            </mesh>
            {/* Eyelid (Blink) */}
            <mesh ref={rightEyelidRef} position={[0, 0.08, 0.1]} scale={[1.2, 0.01, 1]}>
              <boxGeometry args={[0.35, 0.2, 0.1]} />
              <meshStandardMaterial color={PALETTE.skin} />
            </mesh>
          </group>
        </group>

        {/* Nose */}
        <mesh position={[0, 0, 1.0]} scale={[1, 0.8, 1]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={PALETTE.skin} roughness={0.9} />
        </mesh>

        {/* JAW SYSTEM (Moves when talking) */}
        <group ref={jawRef} position={[0, -0.45, 0.5]}>
          {/* Chin/Lower Face Area */}
          <mesh position={[0, -0.1, 0]} scale={[0.8, 0.4, 0.5]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={PALETTE.skin} />
          </mesh>

          {/* Mouth Opening */}
          <group ref={mouthInnerRef} position={[0, 0.2, 0.4]} scale={[1, 0.1, 1]}>
            {/* Mouth Void */}
            <mesh>
              <sphereGeometry args={[0.25, 32, 16]} />
              <meshBasicMaterial color={PALETTE.mouth} />
            </mesh>
            {/* Tongue */}
            <mesh position={[0, -0.1, 0.1]} scale={[1, 0.4, 1]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color={PALETTE.tongue} />
            </mesh>
          </group>
        </group>

        {/* Eyebrows */}
        <group position={[0, 0.55, 0.85]}>
          <mesh position={[-0.35, 0, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.25, 0.04, 0.05]} />
            <meshStandardMaterial color={PALETTE.hair} />
          </mesh>
          <mesh position={[0.35, 0, 0]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.25, 0.04, 0.05]} />
            <meshStandardMaterial color={PALETTE.hair} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
