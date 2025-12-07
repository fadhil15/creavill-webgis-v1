'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ParticleGlobe() {
    const meshRef = useRef<THREE.Points>(null);

    const particleCount = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            const r = 2.5;

            pos[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#1DB8C6"
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

function Connections() {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} scale={[2.48, 2.48, 2.48]}>
            <icosahedronGeometry args={[1, 2]} />
            <meshBasicMaterial wireframe color="#1A237E" transparent opacity={0.15} />
        </mesh>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 select-none">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <ParticleGlobe />
                <Connections />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            </Canvas>
        </div>
    );
}
