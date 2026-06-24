'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChainNode {
  id: string;
  name: string;
  color: string;
  // Spherical coordinates on the globe (theta, phi, radius)
  theta: number;
  phi: number;
}

interface RouteData {
  from: string;
  to: string;
}

interface RouteMap3DProps {
  className?: string;
  activeRoute?: { from: string; to: string };
  sourceChain?: string;
  targetChain?: string;
}

interface HoveredChain {
  id: string;
  name: string;
  position: THREE.Vector3;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const GLOBE_RADIUS = 2.8;
const ARC_HEIGHT_FACTOR = 0.35;
const PARTICLES_PER_ARC = 12;

// Chain definitions with positions on the globe (in spherical coords)
const CHAINS: ChainNode[] = [
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA', theta: 0, phi: 0.15 },
  { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0', theta: 1.8, phi: 1.2 },
  { id: 'optimism', name: 'Optimism', color: '#FF0420', theta: -2.0, phi: 1.0 },
  { id: 'base', name: 'Base', color: '#0052FF', theta: 1.2, phi: 2.4 },
  { id: 'polygon', name: 'Polygon', color: '#8247E5', theta: -1.4, phi: 2.6 },
];

// Route connections
const ROUTES: RouteData[] = [
  { from: 'ethereum', to: 'arbitrum' },
  { from: 'ethereum', to: 'optimism' },
  { from: 'ethereum', to: 'base' },
  { from: 'ethereum', to: 'polygon' },
  { from: 'arbitrum', to: 'base' },
  { from: 'optimism', to: 'base' },
  { from: 'polygon', to: 'optimism' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getChainPosition(chain: ChainNode, radius: number): THREE.Vector3 {
  // phi is measured from the "north pole" (y-axis)
  const phi = chain.phi * 0.5 + 0.3; // map to range [0.3, PI - 0.3] so not at poles
  const theta = chain.theta;
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildArcPoints(
  from: THREE.Vector3,
  to: THREE.Vector3,
  segments: number = 40
): Float32Array {
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const dir = mid.clone().normalize();
  const height = from.distanceTo(to) * ARC_HEIGHT_FACTOR;
  const cp = mid.clone().add(dir.multiplyScalar(height));

  const curve = new THREE.QuadraticBezierCurve3(from, cp, to);
  const points = curve.getPoints(segments);

  const verts = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    verts[i * 3] = points[i].x;
    verts[i * 3 + 1] = points[i].y;
    verts[i * 3 + 2] = points[i].z;
  }
  return verts;
}

function buildArcCurve(from: THREE.Vector3, to: THREE.Vector3): THREE.QuadraticBezierCurve3 {
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const dir = mid.clone().normalize();
  const height = from.distanceTo(to) * ARC_HEIGHT_FACTOR;
  const cp = mid.clone().add(dir.multiplyScalar(height));
  return new THREE.QuadraticBezierCurve3(from, cp, to);
}

function getChainColor(id: string): string {
  return CHAINS.find((c) => c.id === id)?.color ?? '#ffffff';
}

function getChainName(id: string): string {
  return CHAINS.find((c) => c.id === id)?.name ?? id;
}

// ---------------------------------------------------------------------------
// Glow texture (reused from Hero3D pattern)
// ---------------------------------------------------------------------------
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0.0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// Globe geometry (wireframe)
// ---------------------------------------------------------------------------
function GlobeWireframe() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const { geometry, wireframeGeo } = useMemo(() => {
    const geo = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 32);
    // Create wireframe geometry
    const wireframe = new THREE.WireframeGeometry(geo);
    return { geometry: geo, wireframeGeo: wireframe };
  }, []);

  return (
    <group>
      {/* Subtle solid sphere (transparent) */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color="#0a1628"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe overlay */}
      <lineSegments geometry={wireframeGeo}>
        <lineBasicMaterial
          color="#1a3a5c"
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </lineSegments>

      {/* Inner glow rings (simplified with a few line loops) */}
      <lineSegments geometry={wireframeGeo}>
        <lineBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ---------------------------------------------------------------------------
// ChainNode3D — single chain marker on the globe
// ---------------------------------------------------------------------------
function ChainNode3D({
  chain,
  isHovered,
  onHover,
  onUnhover,
}: {
  chain: ChainNode;
  isHovered: boolean;
  onHover: (data: HoveredChain) => void;
  onUnhover: () => void;
}) {
  const position = useMemo(() => getChainPosition(chain, GLOBE_RADIUS * 1.02), [chain]);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  const handlePointerOver = useCallback(
    (e: any) => {
      e.stopPropagation();
      onHover({ id: chain.id, name: chain.name, position: position.clone() });
    },
    [chain, position, onHover]
  );

  const handlePointerOut = useCallback(
    (e: any) => {
      e.stopPropagation();
      onUnhover();
    },
    [onUnhover]
  );

  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color={chain.color} />
      </mesh>

      {/* Glow sprite */}
      <sprite scale={[0.6, 0.6, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color={chain.color}
          opacity={isHovered ? 0.9 : 0.5}
        />
      </sprite>

      {/* Label */}
      <Text
        position={[0, 0.35, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={500}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {chain.name}
      </Text>

      {/* Hover indicator ring */}
      {isHovered && (
        <mesh>
          <ringGeometry args={[0.15, 0.22, 32]} />
          <meshBasicMaterial
            color={chain.color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// RouteArc — animated arc between two chains
// ---------------------------------------------------------------------------
function RouteArc({
  route,
  isActive,
}: {
  route: RouteData;
  isActive: boolean;
}) {
  const fromChain = CHAINS.find((c) => c.id === route.from);
  const toChain = CHAINS.find((c) => c.id === route.to);
  if (!fromChain || !toChain) return null;

  const fromPos = getChainPosition(fromChain, GLOBE_RADIUS * 1.02);
  const toPos = getChainPosition(toChain, GLOBE_RADIUS * 1.02);

  const arcVerts = useMemo(() => buildArcPoints(fromPos, toPos, 48), [fromPos, toPos]);
  const curve = useMemo(() => buildArcCurve(fromPos, toPos), [fromPos, toPos]);

  const arcColor = isActive ? '#00D4FF' : '#1a5276';
  const arcOpacity = isActive ? 0.9 : 0.3;
  const arcWidth = isActive ? 2.5 : 1.0;

  return (
    <group>
      {/* Main arc line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[arcVerts, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={arcColor}
          transparent
          opacity={arcOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          linewidth={arcWidth}
        />
      </line>

      {/* Glow overlay for active arcs */}
      {isActive && (
        <>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[arcVerts, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#06D6A0"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[arcVerts, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#00D4FF"
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
        </>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// ArcParticles — flowing particles along a route arc
// ---------------------------------------------------------------------------
function ArcParticles({
  route,
  isActive,
}: {
  route: RouteData;
  isActive: boolean;
}) {
  const fromChain = CHAINS.find((c) => c.id === route.from);
  const toChain = CHAINS.find((c) => c.id === route.to);
  if (!fromChain || !toChain) return null;

  const fromPos = getChainPosition(fromChain, GLOBE_RADIUS * 1.02);
  const toPos = getChainPosition(toChain, GLOBE_RADIUS * 1.02);
  const curve = useMemo(() => buildArcCurve(fromPos, toPos), [fromPos, toPos]);

  const count = PARTICLES_PER_ARC;

  // Per-particle data stored in refs
  const progressRef = useRef<Float32Array>(
    new Float32Array(count).map(() => Math.random())
  );
  const speedRef = useRef<Float32Array>(
    new Float32Array(count).map(() => 0.15 + Math.random() * 0.2)
  );

  const particleGeometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const materialRef = useRef<THREE.PointsMaterial>(null!);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const posAttr = particleGeometry.attributes.position;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      progressRef.current[i] += dt * speedRef.current[i];
      if (progressRef.current[i] > 1) {
        progressRef.current[i] = 0;
      }

      const t = progressRef.current[i];
      // Smooth ease in-out
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const point = curve.getPoint(eased);
      posArr[i * 3] = point.x;
      posArr[i * 3 + 1] = point.y;
      posArr[i * 3 + 2] = point.z;
    }

    posAttr.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = isActive
        ? 0.6 + 0.3 * Math.sin(Date.now() * 0.003)
        : 0.2 + 0.1 * Math.sin(Date.now() * 0.002);
      materialRef.current.size = isActive ? 0.08 : 0.04;
    }
  });

  return (
    <points geometry={particleGeometry}>
      <pointsMaterial
        ref={materialRef}
        size={isActive ? 0.08 : 0.04}
        color={isActive ? '#ffffff' : '#00D4FF'}
        transparent
        opacity={isActive ? 0.8 : 0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// GlobeScene — the main 3D content
// ---------------------------------------------------------------------------
function GlobeScene({
  activeRoute,
}: {
  activeRoute?: { from: string; to: string };
}) {
  const controlsRef = useRef<any>(null!);
  const [hoveredChain, setHoveredChain] = useState<HoveredChain | null>(null);

  const handleHover = useCallback((data: HoveredChain) => {
    setHoveredChain(data);
  }, []);

  const handleUnhover = useCallback(() => {
    setHoveredChain(null);
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#00D4FF" />

      {/* Globe */}
      <GlobeWireframe />

      {/* Chain nodes */}
      {CHAINS.map((chain) => (
        <ChainNode3D
          key={chain.id}
          chain={chain}
          isHovered={hoveredChain?.id === chain.id}
          onHover={handleHover}
          onUnhover={handleUnhover}
        />
      ))}

      {/* Route arcs */}
      {ROUTES.map((route) => {
        const isActive =
          activeRoute?.from === route.from && activeRoute?.to === route.to;
        return (
          <group key={`${route.from}-${route.to}`}>
            <RouteArc route={route} isActive={isActive} />
            <ArcParticles route={route} isActive={isActive} />
          </group>
        );
      })}

      {/* Tooltip for hovered chain */}
      {hoveredChain && (
        <Html
          position={hoveredChain.position.clone().multiplyScalar(1.15)}
          center
          style={{
            pointerEvents: 'none',
            transform: 'translateY(-10px)',
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid ' + getChainColor(hoveredChain.id),
              borderRadius: 8,
              padding: '4px 12px',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
            }}
          >
            {hoveredChain.name}
          </div>
        </Html>
      )}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.8}
        rotateSpeed={0.6}
        minDistance={4}
        maxDistance={12}
        autoRotate={!hoveredChain}
        autoRotateSpeed={0.8}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Loading placeholder
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
        background: '#0a0a0a',
        borderRadius: 12,
      }}
      aria-label="Loading 3D route map"
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(0,212,255,0.1)',
          borderTopColor: '#00D4FF',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RouteMap3D — public component
// ---------------------------------------------------------------------------
export default function RouteMap3D({
  className = '',
  activeRoute,
}: RouteMap3DProps) {
  // SSR guard: render nothing on the server
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
        borderRadius: 12,
      }}
    >
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45, near: 0.1, far: 30 }}
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
        <GlobeScene activeRoute={activeRoute} />
      </Canvas>
    </div>
  );
}
