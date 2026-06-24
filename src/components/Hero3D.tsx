'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Hero3DProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const NODE_COUNT_DESKTOP = 80;
const NODE_COUNT_MOBILE = 50;
const SPHERE_RADIUS = 4;
const EDGE_DISTANCE_THRESHOLD = 2.8;
const MAX_EDGES_PER_NODE = 4;
const PARTICLE_COUNT = 200;
const ROTATION_SPEED = 0.12;
const PARALLAX_FACTOR = 0.02;
const LERP_FACTOR = 0.05;

const CYAN = '#00D4FF';
const TEAL = '#06D6A0';

interface EdgeData {
  from: number;
  to: number;
}

interface EdgeConnection {
  from: THREE.Vector3;
  to: THREE.Vector3;
}

// ---------------------------------------------------------------------------
// Glow texture generator
// ---------------------------------------------------------------------------
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0.0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.1, 'rgba(0,212,255,0.95)');
  gradient.addColorStop(0.3, 'rgba(6,214,160,0.5)');
  gradient.addColorStop(0.6, 'rgba(0,212,255,0.15)');
  gradient.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// Node generation with Fibonacci sphere + jitter
// ---------------------------------------------------------------------------
function generateNodePositions(count: number, radius: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const r = radius * (0.35 + 0.65 * Math.cbrt(Math.random()));
    const jitter = 0.85 + Math.random() * 0.3;

    positions.push(
      new THREE.Vector3(
        r * radiusAtY * Math.cos(theta) * jitter,
        r * y * 0.7 * jitter,
        r * radiusAtY * Math.sin(theta) * jitter
      )
    );
  }
  return positions;
}

// ---------------------------------------------------------------------------
// Edge generation (nearest-neighbor)
// ---------------------------------------------------------------------------
function generateEdges(
  positions: THREE.Vector3[],
  threshold: number,
  maxEdges: number
): EdgeData[] {
  const edgeSet = new Set<string>();
  const edges: EdgeData[] = [];

  for (let i = 0; i < positions.length; i++) {
    const candidates = positions
      .map((p, j) => ({ idx: j, distSq: p.distanceToSquared(positions[i]) }))
      .filter(({ idx }) => idx !== i)
      .sort((a, b) => a.distSq - b.distSq);

    let added = 0;
    for (const { idx: j } of candidates) {
      if (added >= maxEdges) break;
      if (positions[i].distanceTo(positions[j]) > threshold) continue;
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ from: i, to: j });
        added++;
      }
    }
  }
  return edges;
}

// ---------------------------------------------------------------------------
// Inner 3D scene
// ---------------------------------------------------------------------------
function NetworkScene() {
  const { size, mouse } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const nodeMaterialRef = useRef<THREE.PointsMaterial>(null!);
  const edgeMaterialRef = useRef<THREE.LineBasicMaterial>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const particleMaterialRef = useRef<THREE.PointsMaterial>(null!);

  const isMobile = size.width < 768;
  const nodeCount = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;

  // ---- Static geometry ----
  const { positions, edgeConnections } = useMemo(() => {
    const pos = generateNodePositions(nodeCount, SPHERE_RADIUS);
    const edgeData = generateEdges(pos, EDGE_DISTANCE_THRESHOLD, MAX_EDGES_PER_NODE);
    const conns: EdgeConnection[] = edgeData.map((e) => ({
      from: pos[e.from].clone(),
      to: pos[e.to].clone(),
    }));
    return { positions: pos, edges: edgeData, edgeConnections: conns };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeCount]);

  // ---- Edge line geometry ----
  const edgeGeometry = useMemo(() => {
    const verts: number[] = [];
    for (const conn of edgeConnections) {
      verts.push(conn.from.x, conn.from.y, conn.from.z);
      verts.push(conn.to.x, conn.to.y, conn.to.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, [edgeConnections]);

  // ---- Node points geometry ----
  const nodeGeometry = useMemo(() => {
    const verts = new Float32Array(positions.length * 3);
    for (let i = 0; i < positions.length; i++) {
      verts[i * 3] = positions[i].x;
      verts[i * 3 + 1] = positions[i].y;
      verts[i * 3 + 2] = positions[i].z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, [positions]);

  // ---- Particle system ----
  const particleState = useMemo(() => {
    const progress = new Float32Array(PARTICLE_COUNT);
    const edgeIdx = new Uint16Array(PARTICLE_COUNT);
    const speed = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      edgeIdx[i] = Math.floor(Math.random() * edgeConnections.length);
      progress[i] = Math.random();
      speed[i] = 0.25 + Math.random() * 0.35;
    }
    return { progress, edgeIdx, speed };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgeConnections.length]);

  const particleGeometry = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return geo;
  }, []);

  // ---- Glow texture ----
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // ---- Animation loop ----
  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);

    // Auto-rotate around Y
    group.rotation.y += dt * ROTATION_SPEED;

    // Mouse parallax (smooth lerp)
    const targetRX = mouse.y * PARALLAX_FACTOR;
    const targetRZ = -mouse.x * PARALLAX_FACTOR * 0.4;
    group.rotation.x += (targetRX - group.rotation.x) * LERP_FACTOR;
    group.rotation.z += (targetRZ - group.rotation.z) * LERP_FACTOR;

    // Pulse node size uniformly
    if (nodeMaterialRef.current) {
      const pulse = 0.25 + 0.15 * Math.sin(state.clock.elapsedTime * 1.2);
      nodeMaterialRef.current.size = 0.3 + pulse;
      nodeMaterialRef.current.opacity = 0.7 + 0.2 * Math.sin(state.clock.elapsedTime * 0.9 + 1);
    }

    // Pulse edge opacity
    if (edgeMaterialRef.current) {
      edgeMaterialRef.current.opacity = 0.08 + 0.06 * Math.sin(state.clock.elapsedTime * 0.6);
    }

    // Update particles
    if (particlesRef.current && particleMaterialRef.current) {
      const posAttr = particleGeometry.attributes.position;
      const posArr = posAttr.array as Float32Array;
      const { progress, edgeIdx, speed } = particleState;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        progress[i] += dt * speed[i];
        if (progress[i] > 1) {
          progress[i] = 0;
          edgeIdx[i] = Math.floor(Math.random() * edgeConnections.length);
        }

        const conn = edgeConnections[edgeIdx[i]];
        if (!conn) continue;

        const t = progress[i];
        // Smooth ease in-out
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        posArr[i * 3] = conn.from.x + (conn.to.x - conn.from.x) * eased;
        posArr[i * 3 + 1] = conn.from.y + (conn.to.y - conn.from.y) * eased;
        posArr[i * 3 + 2] = conn.from.z + (conn.to.z - conn.from.z) * eased;
      }

      posAttr.needsUpdate = true;
      particleMaterialRef.current.opacity = 0.5 + 0.3 * Math.sin(state.clock.elapsedTime * 0.8);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          ref={edgeMaterialRef}
          color={TEAL}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      <points geometry={nodeGeometry}>
        <pointsMaterial
          ref={nodeMaterialRef}
          size={0.4}
          map={glowTexture}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color={CYAN}
          sizeAttenuation
          opacity={0.9}
        />
      </points>

      {/* Particles (flowing data packets) */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          ref={particleMaterialRef}
          size={0.1}
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Loading placeholder (SSR)
// ---------------------------------------------------------------------------
function LoadingPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
      aria-label="Loading 3D scene"
    />
  );
}

// ---------------------------------------------------------------------------
// Hero3D — public component
// ---------------------------------------------------------------------------
export default function Hero3D({ className = '' }: Hero3DProps) {
  if (typeof window === 'undefined') {
    return <LoadingPlaceholder className={className} />;
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 30 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <NetworkScene />
      </Canvas>
    </div>
  );
}
