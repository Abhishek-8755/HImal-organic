"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, PerformanceMonitor, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Lathe profiles: [radius, height] points spun around the vertical axis
const lathe = (points, segments = 64) =>
  new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments);

function GrainSack(props) {
  const body = useMemo(
    () =>
      lathe([
        [0, -0.82],
        [0.42, -0.8],
        [0.62, -0.68],
        [0.7, -0.42],
        [0.68, -0.08],
        [0.6, 0.24],
        [0.43, 0.48],
        [0.31, 0.57],
        [0.35, 0.64],
        [0.47, 0.77],
        [0.5, 0.84],
        [0.46, 0.86],
      ]),
    []
  );
  const grains = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = i * 2.4;
        const r = 0.36 * Math.sqrt((i + 0.5) / 26);
        return [Math.cos(a) * r, 0.8 + Math.sin(i * 1.7) * 0.03, Math.sin(a) * r];
      }),
    []
  );
  return (
    <group {...props}>
      <mesh geometry={body}>
        <meshStandardMaterial color="#C9A46E" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* Rope tie at the neck */}
      <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.05, 16, 48]} />
        <meshStandardMaterial color="#7A5A3A" roughness={0.8} />
      </mesh>
      {/* Grain heaped in the opening */}
      <mesh position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 40]} />
        <meshStandardMaterial color="#A3463A" roughness={0.7} />
      </mesh>
      {grains.map((p, i) => (
        <mesh key={i} position={p} rotation={[i, i * 0.5, 0]} scale={[1, 0.45, 0.45]}>
          <sphereGeometry args={[0.07, 12, 8]} />
          <meshStandardMaterial color={i % 3 ? "#A3463A" : "#B85A45"} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function GheeJar(props) {
  const body = useMemo(
    () =>
      lathe([
        [0, -0.55],
        [0.38, -0.55],
        [0.45, -0.49],
        [0.47, -0.3],
        [0.47, 0.3],
        [0.43, 0.43],
        [0.35, 0.49],
        [0.35, 0.56],
      ]),
    []
  );
  return (
    <group {...props}>
      <mesh geometry={body}>
        <meshPhysicalMaterial color="#E7B547" roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.478, 0.478, 0.38, 64, 1, true]} />
        <meshStandardMaterial color="#F6F1E7" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.17, 64]} />
        <meshStandardMaterial color="#1F3D2B" roughness={0.45} />
      </mesh>
    </group>
  );
}

function GarlicBulb(props) {
  const body = useMemo(
    () =>
      lathe(
        [
          [0, -0.3],
          [0.18, -0.28],
          [0.29, -0.16],
          [0.31, 0.02],
          [0.23, 0.18],
          [0.1, 0.31],
          [0.035, 0.42],
          [0.02, 0.5],
          [0, 0.5],
        ],
        12 // few segments give the bulb its cloves
      ),
    []
  );
  return (
    <mesh geometry={body} {...props}>
      <meshStandardMaterial color="#F1EADC" roughness={0.6} flatShading />
    </mesh>
  );
}

function Leaf({ color = "#4F7A4A", ...props }) {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.18, 0.12, 0.34, 0.32, 0, 0.78);
    s.bezierCurveTo(-0.34, 0.32, -0.18, 0.12, 0, 0);
    return new THREE.ExtrudeGeometry(s, { depth: 0.01, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 });
  }, []);
  return (
    <mesh geometry={geometry} {...props}>
      <meshStandardMaterial color={color} roughness={0.55} side={THREE.DoubleSide} />
    </mesh>
  );
}

const BEANS = [
  [-1.25, 0.95, 0.5],
  [-0.45, 1.35, 0.2],
  [1.35, -0.15, 0.6],
  [0.25, -1.25, 0.7],
  [-1.3, -0.95, 0.4],
  [0.55, 1.55, -0.4],
  [1.05, -1.0, 0.1],
];
const SEEDS = [
  [-0.85, 1.25, 0.6, "#D9A441"],
  [1.45, 0.45, 0.3, "#8A5A3C"],
  [-1.5, 0.2, 0.2, "#D9A441"],
  [0.0, -1.5, 0.3, "#8A5A3C"],
  [0.95, 1.2, 0.5, "#D9A441"],
  [-0.2, 0.95, 0.9, "#8A5A3C"],
];

function Cluster() {
  return (
    <>
      <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.5}>
        <GrainSack position={[-0.45, -0.35, 0]} rotation={[0.12, 0.5, -0.08]} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.7}>
        <GheeJar position={[0.78, 0.5, -0.35]} rotation={[0.2, -0.4, 0.18]} scale={0.85} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.8}>
        <GarlicBulb position={[0.85, -0.7, 0.55]} rotation={[0.3, 0, -0.35]} />
      </Float>
      <Float speed={1.6} rotationIntensity={0.9} floatIntensity={0.9}>
        <Leaf position={[-1.15, 0.35, 0.3]} rotation={[0.4, 0.6, 0.9]} />
        <Leaf position={[0.2, 1.05, 0.1]} rotation={[-0.3, -0.5, -0.6]} scale={0.8} color="#6F9467" />
        <Leaf position={[1.25, -1.35, 0.2]} rotation={[0.5, 0.2, -2.2]} scale={0.7} />
      </Float>
      {BEANS.map((p, i) => (
        <Float key={i} speed={1.4 + (i % 3) * 0.4} rotationIntensity={1.4} floatIntensity={1}>
          <mesh position={p} rotation={[i, i * 1.3, i * 0.7]} scale={[1, 1, 0.78]}>
            <capsuleGeometry args={[0.085, 0.13, 8, 16]} />
            <meshPhysicalMaterial color={i % 2 ? "#7E2E28" : "#8E3B33"} roughness={0.35} clearcoat={0.6} />
          </mesh>
        </Float>
      ))}
      {SEEDS.map(([x, y, z, color], i) => (
        <Float key={i} speed={2 + (i % 2)} rotationIntensity={0.5} floatIntensity={1.2}>
          <mesh position={[x, y, z]}>
            <sphereGeometry args={[0.06, 16, 12]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Model({ url }) {
  // "/draco/": if the model is Draco-compressed, copy the decoder from
  // node_modules/three/examples/jsm/libs/draco/gltf/ into public/draco/ (no CDN)
  const { scene } = useGLTF(url, "/draco/");
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <primitive object={scene} />
    </Float>
  );
}

// Tilts the whole scene a little towards the mouse
function MouseTilt({ children }) {
  const group = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    const t = 1 - Math.exp(-delta * 3);
    g.rotation.y += (pointer.current.x * 0.35 - g.rotation.y) * t;
    g.rotation.x += (pointer.current.y * 0.18 - g.rotation.x) * t;
  });

  return <group ref={group}>{children}</group>;
}

// Calls onReady after the first frame has been drawn
function ReadySignal({ onReady }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => onReady?.());
  });
  return null;
}

export default function Hero3D({ modelUrl, active = true, onReady, onFallback }) {
  const [dpr, setDpr] = useState(1.5);
  const dprRef = useRef(dpr); // read in callbacks, which may be stale closures
  const changeDpr = (value) => {
    dprRef.current = value;
    setDpr(value);
  };

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
      }}
      aria-hidden="true"
    >
      {/* Lower the resolution first; if it is still slow, swap to the static image */}
      <PerformanceMonitor
        onIncline={() => changeDpr(1.5)}
        onDecline={() => (dprRef.current <= 1 ? onFallback?.() : changeDpr(1))}
        onFallback={() => onFallback?.()}
        flipflops={3}
      />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.7} color="#FFF3DD" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#CFDACB" />
      {/* Studio lighting built in-scene; presets would download from a CDN */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} color="#FFF1D6" position={[0, 4, 3]} scale={[8, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#F2C14E" position={[4, 0, 2]} scale={[2, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#E8EFE6" position={[-5, 1, 1]} scale={[2, 6, 1]} target={[0, 0, 0]} />
      </Environment>
      <MouseTilt>
        <Suspense fallback={null}>
          {modelUrl ? <Model url={modelUrl} /> : <Cluster />}
          {/* Inside Suspense, so "ready" waits for a .glb to finish loading */}
          <ReadySignal onReady={onReady} />
        </Suspense>
      </MouseTilt>
    </Canvas>
  );
}
