'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, useProgress, Html } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2 bg-black/50 p-4 rounded-xl backdrop-blur-md">
                <div className="w-8 h-8 border-2 border-[hsl(var(--accent-primary))] border-t-transparent rounded-full animate-spin" />
                <span className="text-white text-sm font-medium">{progress.toFixed(0)}% cargado</span>
            </div>
        </Html>
    );
}

function Model({ url }: { url: string }) {
    // Determine file extension
    const isStl = url.toLowerCase().endsWith('.stl');

    // For now we primarily support STL as it's standard for printing
    const geometry = useLoader(STLLoader, url);

    // Create a mesh if it's geometry (STL), or use primitive if it was GLTF (Scene)
    // Basic material for visualization
    const material = new THREE.MeshStandardMaterial({
        color: '#3b82f6', // bright blue
        roughness: 0.5,
        metalness: 0.1,
    });

    return (
        <mesh geometry={geometry} material={material} castShadow receiveShadow>
        </mesh>
    );
}

export function ModelViewer({ url, className = "" }: { url: string, className?: string }) {
    return (
        <div className={`w-full h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-[hsl(var(--border-color))] ${className}`}>
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={<Loader />}>
                    <Stage environment="city" intensity={0.6} adjustCamera>
                        <Model url={url} />
                    </Stage>
                </Suspense>
                <OrbitControls autoRotate autoRotateSpeed={0.5} makeDefault />
            </Canvas>

            <div className="absolute bottom-4 right-4 text-[10px] text-white/30 pointer-events-none">
                <p>Click + Drag para rotar</p>
                <p>Scroll para zoom</p>
            </div>
        </div>
    );
}
