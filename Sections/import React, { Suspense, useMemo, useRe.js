import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, Html, OrbitControls, Text3D } from "@react-three/drei";

/**
 * React 3D Animation Starter (Tailwind + @react-three/fiber + drei)
 * - Full-screen hero with animated particles, floating 3D text, and spinning shapes
 * - Clean Tailwind layout and accessible fallbacks
 *
 * Usage:
 * 1) Ensure Tailwind is set up in your project.
 * 2) Install deps: `npm i @react-three/fiber three @react-three/drei`
 * 3) Render <AnimatedHero3D /> anywhere (e.g., App.tsx).
 */

const ACCENT = new THREE.Color(0x7cf4ff);
const ACCENT2 = new THREE.Color(0x8a7dff);

function Particles({ count = 500 }) {
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: 0x9ec9ff, size: 0.02, transparent: true, opacity: 0.75 }), []);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 * Math.pow(Math.random(), 0.6);
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.2;
      arr[i * 3 + 0] = Math.cos(a) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(a) * r - 3.2;
    }
    return arr;
  }, [count]);
  useMemo(() => {
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  }, [geom, positions]);
  useFrame(() => {
    const pos = geom.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iz = i * 3 + 2;
      const x = pos[ix];
      const z = pos[iz] + 3.2;
      const ang = Math.atan2(z, x) + 0.0006;
      const rad = Math.hypot(x, z);
      pos[ix] = Math.cos(ang) * rad;
      pos[iz] = Math.sin(ang) * rad - 3.2;
    }
    geom.attributes.position.needsUpdate = true;
  });
  return <points geometry={geom} material={mat} frustumCulled={false} />;
}

function PulseRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 2.2) * 0.04;
    ref.current.scale.set(s, s, s);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.28 + 0.07 * Math.sin(t * 2.2 + Math.PI / 2);
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.6]}> 
      <torusGeometry args={[1.7, 0.01, 16, 220]} />
      <meshBasicMaterial color={ACCENT.getHex()} transparent opacity={0.35} />
    </mesh>
  );
}

function Spinners() {
  const ref1 = useRef<THREE.Mesh>(null!);
  const ref2 = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref1.current.rotation.set(t * 0.25, t * 0.35, 0);
    ref2.current.rotation.set(-t * 0.22, -t * 0.3, 0);
  });
  return (
    <group>
      <mesh ref={ref1} position={[1.4, 0.6, -0.5]}> 
        <dodecahedronGeometry args={[0.25]} />
        <meshStandardMaterial color={0xffffff} metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh ref={ref2} position={[-1.3, -0.4, -0.3]}> 
        <icosahedronGeometry args={[0.22]} />
        <meshStandardMaterial color={ACCENT2.getHex()} metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

function NameText({ text = "Your Name" }) {
  return (
    <Float floatIntensity={0.7} rotationIntensity={0.2} speed={2.5}>
      <Text3D
        font="https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json"
        size={0.55}
        height={0.1}
        curveSegments={10}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        bevelSegments={3}
      >
        {text}
        <meshStandardMaterial color={0xe6eeff} roughness={0.35} metalness={0.25} />
      </Text3D>
    </Float>
  );
}

export default function AnimatedHero3D() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f19]/70 backdrop-blur">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold tracking-wide">3D Portfolio Starter</div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <a className="px-3 py-1 rounded-full border border-white/10 hover:border-cyan-300/40" href="#projects">Projects</a>
            <a className="px-3 py-1 rounded-full border border-white/10 hover:border-cyan-300/40" href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* HERO with 3D */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <Canvas camera={{ fov: 55, position: [0, 0.4, 4] }} dpr={[1, 2]}>
            <ambientLight intensity={0.15} />
            <spotLight position={[2, 3, 3]} intensity={1.2} angle={Math.PI / 5} penumbra={0.4} color={ACCENT} />
            <pointLight position={[-2.5, 1.5, 2]} intensity={0.8} color={ACCENT2} />
            <directionalLight position={[0, 2, -2]} intensity={0.4} />

            <Suspense fallback={<Html center className="text-slate-200">Loading…</Html>}>
              <Particles />
              <PulseRing />
              <group position={[0, 0.05, 0]}>
                <NameText text="Your Name" />
                <Spinners />
              </group>
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">I build delightful 3D web experiences.</h1>
            <p className="mt-3 text-slate-300">React + Three.js + Tailwind. Fast, accessible, and production-ready.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["React","Three.js","Tailwind","r3f","drei"].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-slate-200 text-sm">{t}</span>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-slate-300 mt-2">Swap in your own content here. Add experience, projects, and contact sections below.</p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">Projects</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5">Project A</div>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5">Project B</div>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5">Project C</div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">Contact</h2>
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 text-slate-300">Email: you@domain.com • GitHub: github.com/you • LinkedIn: /in/you</div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-slate-400 border-t border-white/10">© {new Date().getFullYear()} Your Name</footer>
    </div>
  );
}
