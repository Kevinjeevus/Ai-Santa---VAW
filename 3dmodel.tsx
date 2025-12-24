import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RealisticMaleFace = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8f4f8);

    const camera = new THREE.PerspectiveCamera(
      40,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(3, 4, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xb8d4ff, 0.4);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // Character group
    const character = new THREE.Group();

    // Materials
    const skinMaterial = new THREE.MeshToonMaterial({
      color: 0xfdd5b1,
      gradientMap: null
    });

    const hairMaterial = new THREE.MeshToonMaterial({
      color: 0x4a2511
    });

    const glassesMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c1810,
      roughness: 0.3,
      metalness: 0.1
    });

    const lenseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.3,
      transmission: 0.9,
      thickness: 0.5
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff
    });

    const irisMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a5c3e
    });

    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000
    });

    const shirtMaterial = new THREE.MeshToonMaterial({
      color: 0xc9b896
    });

    const beltMaterial = new THREE.MeshToonMaterial({
      color: 0x8b6f47
    });

    // Head
    const headGeo = new THREE.SphereGeometry(1, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.scale.set(0.95, 1.15, 0.85);
    headMesh.castShadow = true;
    character.add(headMesh);

    // Ears
    const createEar = (side) => {
      const earGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const earMesh = new THREE.Mesh(earGeo, skinMaterial);
      earMesh.scale.set(0.6, 1, 0.4);
      earMesh.position.set(side * 0.95, 0.15, -0.05);
      earMesh.rotation.z = side * 0.2;
      return earMesh;
    };
    character.add(createEar(-1));
    character.add(createEar(1));

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
    const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
    noseMesh.position.set(0, 0.05, 0.82);
    noseMesh.rotation.x = Math.PI / 2;
    character.add(noseMesh);

    // Eyes
    const createEye = (side) => {
      const eyeGroup = new THREE.Group();

      const eyeballGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const eyeballMesh = new THREE.Mesh(eyeballGeo, eyeMaterial);
      eyeballMesh.position.z = 0.05;
      eyeGroup.add(eyeballMesh);

      const irisGeo = new THREE.CircleGeometry(0.1, 32);
      const irisMesh = new THREE.Mesh(irisGeo, irisMaterial);
      irisMesh.position.z = 0.16;
      eyeGroup.add(irisMesh);

      const pupilGeo = new THREE.CircleGeometry(0.05, 32);
      const pupilMesh = new THREE.Mesh(pupilGeo, pupilMaterial);
      pupilMesh.position.z = 0.17;
      eyeGroup.add(pupilMesh);

      const highlightGeo = new THREE.CircleGeometry(0.02, 16);
      const highlightMesh = new THREE.Mesh(highlightGeo, new THREE.MeshBasicMaterial({
        color: 0xffffff
      }));
      highlightMesh.position.set(-0.03, 0.04, 0.18);
      eyeGroup.add(highlightMesh);

      eyeGroup.position.set(side * 0.35, 0.35, 0.7);
      return eyeGroup;
    };
    character.add(createEye(-1));
    character.add(createEye(1));

    // Glasses frame
    const glassesGroup = new THREE.Group();

    // Left lens frame
    const createLensFrame = (side) => {
      const frameGroup = new THREE.Group();
      
      const frameGeo = new THREE.TorusGeometry(0.22, 0.025, 16, 32);
      const frameMesh = new THREE.Mesh(frameGeo, glassesMaterial);
      frameGroup.add(frameMesh);

      const lenseGeo = new THREE.CircleGeometry(0.2, 32);
      const lenseMesh = new THREE.Mesh(lenseGeo, lenseMaterial);
      lenseMesh.position.z = 0.02;
      frameGroup.add(lenseMesh);

      frameGroup.position.set(side * 0.35, 0.35, 0.88);
      return frameGroup;
    };
    
    glassesGroup.add(createLensFrame(-1));
    glassesGroup.add(createLensFrame(1));

    // Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, glassesMaterial);
    bridgeMesh.rotation.z = Math.PI / 2;
    bridgeMesh.position.set(0, 0.35, 0.88);
    glassesGroup.add(bridgeMesh);

    // Temples
    const createTemple = (side) => {
      const templeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
      const templeMesh = new THREE.Mesh(templeGeo, glassesMaterial);
      templeMesh.rotation.z = Math.PI / 2;
      templeMesh.position.set(side * 0.7, 0.35, 0.5);
      templeMesh.rotation.y = side * 0.3;
      return templeMesh;
    };
    glassesGroup.add(createTemple(-1));
    glassesGroup.add(createTemple(1));

    character.add(glassesGroup);

    // Eyebrows
    const createEyebrow = (side) => {
      const browGeo = new THREE.BoxGeometry(0.3, 0.06, 0.05);
      const browMesh = new THREE.Mesh(browGeo, hairMaterial);
      browMesh.position.set(side * 0.35, 0.58, 0.78);
      browMesh.rotation.z = side * -0.15;
      return browMesh;
    };
    character.add(createEyebrow(-1));
    character.add(createEyebrow(1));

    // Mouth - simple smile
    const smileGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 32, Math.PI);
    const smileMesh = new THREE.Mesh(smileGeo, new THREE.MeshToonMaterial({
      color: 0xd4887f
    }));
    smileMesh.position.set(0, -0.25, 0.8);
    smileMesh.rotation.x = Math.PI;
    smileMesh.rotation.z = Math.PI;
    character.add(smileMesh);

    // Hair - messy/curly style
    const hairGroup = new THREE.Group();

    // Main hair volume
    const mainHairGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const mainHairMesh = new THREE.Mesh(mainHairGeo, hairMaterial);
    mainHairMesh.scale.set(1, 1.15, 0.95);
    mainHairMesh.position.set(0, 0.25, -0.15);
    hairGroup.add(mainHairMesh);

    // Front curly sections
    for (let i = 0; i < 8; i++) {
      const curlGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const curlMesh = new THREE.Mesh(curlGeo, hairMaterial);
      const angle = (i / 8) * Math.PI - Math.PI / 2;
      curlMesh.position.set(
        Math.cos(angle) * 0.85,
        0.85 + Math.sin(i * 0.5) * 0.1,
        0.4 + Math.sin(angle) * 0.3
      );
      curlMesh.scale.set(0.9, 1.1, 0.8);
      hairGroup.add(curlMesh);
    }

    // Side curls
    for (let side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const sideGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const sideMesh = new THREE.Mesh(sideGeo, hairMaterial);
        sideMesh.position.set(
          side * (0.75 + i * 0.1),
          0.6 - i * 0.2,
          0.3 - i * 0.15
        );
        sideMesh.scale.set(0.9, 1.2, 0.7);
        hairGroup.add(sideMesh);
      }
    }

    character.add(hairGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 32);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.set(0, -1.4, 0.1);
    character.add(neckMesh);

    // Shirt/uniform
    const torsoGeo = new THREE.CylinderGeometry(0.75, 0.9, 1.5, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, shirtMaterial);
    torsoMesh.position.set(0, -2.5, 0);
    character.add(torsoMesh);

    // Collar
    const collarGeo = new THREE.TorusGeometry(0.4, 0.08, 16, 32, Math.PI);
    const collarMesh = new THREE.Mesh(collarGeo, shirtMaterial);
    collarMesh.position.set(0, -1.8, 0.35);
    collarMesh.rotation.x = -0.3;
    character.add(collarMesh);

    // Belt
    const beltGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.15, 32);
    const beltMesh = new THREE.Mesh(beltGeo, beltMaterial);
    beltMesh.position.set(0, -2.8, 0);
    character.add(beltMesh);

    // Belt buckle
    const buckleGeo = new THREE.BoxGeometry(0.15, 0.12, 0.08);
    const buckleMesh = new THREE.Mesh(buckleGeo, new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2
    }));
    buckleGeo.translate(0, 0, 0.04);
    buckleGeo.scale(0.8, 1, 1);
    buckleGeo.translate(0, 0, -0.04);
    buckleGeo.rotateY(Math.PI / 4);
    buckleGeo.translate(0, 0, 0.04);
    buckleGeo.scale(1.25, 1, 1);
    buckleGeo.translate(0, 0, -0.04);
    buckleGeo.rotateY(-Math.PI / 4);
    buckleMesh.position.set(0, -2.8, 0.75);
    character.add(buckleMesh);

    // Shoulders
    const createShoulder = (side) => {
      const shoulderGeo = new THREE.SphereGeometry(0.45, 24, 24);
      const shoulderMesh = new THREE.Mesh(shoulderGeo, shirtMaterial);
      shoulderMesh.position.set(side * 0.75, -2.2, 0);
      shoulderMesh.scale.set(1.1, 0.9, 0.8);
      return shoulderMesh;
    };
    character.add(createShoulder(-1));
    character.add(createShoulder(1));

    scene.add(character);
    character.position.y = 0.5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.3;
      targetRotationX = mouseY * 0.2;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      character.rotation.y += (targetRotationY - character.rotation.y) * 0.05;
      character.rotation.x += (targetRotationX - character.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#2c5f7c',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        background: 'rgba(255,255,255,0.9)',
        padding: '15px',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cartoon Character</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>Move mouse to rotate</div>
      </div>
    </div>
  );
};

export default RealisticMaleFace;