import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useSharedBrain } from "@/hooks/useSharedBrain";
import { systemAudio } from "@/lib/systemAudio";
import { cn } from "@/lib/utils";
import {
  Shield, Swords, LayoutDashboard, Hexagon,
  Wallet, ShoppingBag, Sparkles as SparklesIcon,
  User, Volume2, VolumeX, Eye, Flame, AlertCircle, ChevronRight
} from "lucide-react";

interface PortalHub3DProps {
  onNavigate: (section: string) => void;
}

export type PortalRank = "E" | "D" | "C" | "B" | "A" | "S";

export interface SystemPortalData {
  id: string;
  name: string;
  dungeonCode: string;
  rank: PortalRank;
  category: "war" | "core" | "shadow" | "recovery";
  color: string;
  glowColor: string;
  angle: number;
  radius: number;
  elevation: number;
  description: string;
  activeMissions: number;
  xpValue: number;
  icon: any;
}

const PORTALS: SystemPortalData[] = [
  {
    id: "dashboard",
    name: "Command Center",
    dungeonCode: "GATE-01 // TERMINAL CENTRAL",
    rank: "A",
    category: "core",
    color: "#00f0ff",
    glowColor: "#00d9ff",
    angle: 0,
    radius: 6.8,
    elevation: 0.2,
    description: "Timeline 07h-23h, Ops ativas, Money Rush e radar de sincronia.",
    activeMissions: 4,
    xpValue: 350,
    icon: LayoutDashboard,
  },
  {
    id: "questlines",
    name: "Questlines & Galáxias",
    dungeonCode: "GATE-02 // ARCO PRINCIPAL",
    rank: "S",
    category: "shadow",
    color: "#8a2be2",
    glowColor: "#a855f7",
    angle: 45,
    radius: 7.2,
    elevation: 0.8,
    description: "Expéria Empire, Prova Social Plin/Muli, Base Limpa e Navegação Estelar.",
    activeMissions: 7,
    xpValue: 1200,
    icon: Hexagon,
  },
  {
    id: "bosses",
    name: "The Boss Room",
    dungeonCode: "GATE-03 // CÂMARA DOS CHEFÕES",
    rank: "S",
    category: "shadow",
    color: "#ff0033",
    glowColor: "#ff3366",
    angle: 90,
    radius: 7.0,
    elevation: -0.4,
    description: "Masmorras Financeira (38k), Física e Mental + Plano de Ataque 15k.",
    activeMissions: 3,
    xpValue: 2000,
    icon: Swords,
  },
  {
    id: "charsheet",
    name: "Character Sheet",
    dungeonCode: "GATE-04 // JANELA DO PLAYER",
    rank: "B",
    category: "core",
    color: "#ffb703",
    glowColor: "#fbbf24",
    angle: 135,
    radius: 6.6,
    elevation: 0.5,
    description: "Perfil do Protagonista, Radar da Santa Tríade e Passivas de Maestria.",
    activeMissions: 1,
    xpValue: 200,
    icon: User,
  },
  {
    id: "skills",
    name: "Skill Tree",
    dungeonCode: "GATE-05 // ÁRVORE DE PODER",
    rank: "A",
    category: "core",
    color: "#00f0ff",
    glowColor: "#38bdf8",
    angle: 180,
    radius: 6.9,
    elevation: -0.2,
    description: "IA Ops, Engenharia de Automação, Vendas e Domínio Mental.",
    activeMissions: 5,
    xpValue: 450,
    icon: Shield,
  },
  {
    id: "finances",
    name: "Finances & War Chest",
    dungeonCode: "GATE-06 // COFRE DA SEASON",
    rank: "A",
    category: "war",
    color: "#00e676",
    glowColor: "#4ade80",
    angle: 225,
    radius: 7.1,
    elevation: 0.6,
    description: "Meta R$ 40k, Dívida Mensal Ativa e negociações Serasa.",
    activeMissions: 2,
    xpValue: 500,
    icon: Wallet,
  },
  {
    id: "loot",
    name: "Arsenal & Season Pass",
    dungeonCode: "GATE-07 // CÂMARA DE RECOMPENSAS",
    rank: "B",
    category: "war",
    color: "#ff9100",
    glowColor: "#f59e0b",
    angle: 270,
    radius: 6.7,
    elevation: -0.5,
    description: "Recompensas de dopamina consciente, loja de gemas e tiers.",
    activeMissions: 3,
    xpValue: 300,
    icon: ShoppingBag,
  },
  {
    id: "sanctuary",
    name: "Santuário",
    dungeonCode: "GATE-08 // ZONA DE RECUPERAÇÃO",
    rank: "E",
    category: "recovery",
    color: "#b0bec5",
    glowColor: "#e2e8f0",
    angle: 315,
    radius: 6.5,
    elevation: 0.3,
    description: "Descanso sagrado, silêncio cognitivo e restauração de Mana.",
    activeMissions: 1,
    xpValue: 150,
    icon: SparklesIcon,
  },
];

// ── 3D CENTRAL MANA CRYSTAL ──
function CentralManaCrystal({ level, xp }: { level: number; xp: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.25;
      wireRef.current.rotation.z += delta * 0.15;
    }
    if (lightRef.current) {
      // Breathing pulse frequency (~4s cycle)
      const pulse = Math.sin(state.clock.elapsedTime * 1.6);
      lightRef.current.intensity = 2.2 + pulse * 1.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic Mana Light */}
      <pointLight ref={lightRef} color="#00f0ff" distance={15} decay={2} />
      
      {/* Inner Crystal Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00b4d8"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Outer Geometric Wireframe */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Floating HUD Label over Crystal */}
      <Billboard position={[0, 2.2, 0]}>
        <Text
          fontSize={0.32}
          color="#00f0ff"
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy22E6k.woff"
          anchorX="center"
          anchorY="middle"
        >
          PLAYER GABRIEL
        </Text>
        <Text
          position={[0, -0.35, 0]}
          fontSize={0.22}
          color="#a855f7"
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy22E6k.woff"
          anchorX="center"
          anchorY="middle"
        >
          {`LEVEL ${level} // RANK S`}
        </Text>
      </Billboard>
    </group>
  );
}

// ── 3D PORTAL GATE COMPONENT ──
interface PortalGateMeshProps {
  portal: SystemPortalData;
  isHovered: boolean;
  onHover: (portal: SystemPortalData | null) => void;
  onClick: (portal: SystemPortalData) => void;
}

function PortalGateMesh({ portal, isHovered, onHover, onClick }: PortalGateMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Mesh>(null);
  const portalVortexRef = useRef<THREE.Mesh>(null);

  const rad = (portal.angle * Math.PI) / 180;
  const x = Math.cos(rad) * portal.radius;
  const z = Math.sin(rad) * portal.radius;
  const y = portal.elevation;

  useFrame((state, delta) => {
    // Smooth hover scale
    if (groupRef.current) {
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
    // Subtle vortex spin
    if (portalVortexRef.current) {
      portalVortexRef.current.rotation.z += delta * (isHovered ? 1.8 : 0.6);
    }
    // Rotating outer rune ring
    if (runeRingRef.current) {
      runeRingRef.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[x, y, z]}>
      {/* Face toward center with natural slant */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <group
          onClick={(e) => {
            e.stopPropagation();
            onClick(portal);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            systemAudio.playHover();
            onHover(portal);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHover(null);
          }}
        >
          {/* Outer Gate Ring */}
          <mesh ref={ringRef}>
            <torusGeometry args={[1.1, 0.045, 16, 48]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={isHovered ? 2.5 : 1.2}
              roughness={0.2}
            />
          </mesh>

          {/* Secondary Counter-Rotating Rune Ring */}
          <mesh ref={runeRingRef}>
            <torusGeometry args={[1.25, 0.015, 12, 32]} />
            <meshBasicMaterial
              color={portal.glowColor}
              wireframe
              transparent
              opacity={isHovered ? 0.8 : 0.35}
            />
          </mesh>

          {/* Inner Dimensional Event Horizon (Vortex) */}
          <mesh ref={portalVortexRef}>
            <circleGeometry args={[1.05, 32]} />
            <meshBasicMaterial
              color={portal.color}
              transparent
              opacity={isHovered ? 0.35 : 0.15}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Center Gate Light */}
          <pointLight color={portal.color} distance={4} intensity={isHovered ? 2.0 : 0.8} />

          {/* Floating Rank Badge Above Portal */}
          <Billboard position={[0, 1.45, 0]}>
            <Text
              fontSize={0.22}
              color={portal.rank === "S" ? "#8a2be2" : portal.color}
              font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy22E6k.woff"
              anchorX="center"
              anchorY="middle"
            >
              {`[RANK ${portal.rank}]`}
            </Text>
          </Billboard>

          {/* Portal Name Label Below Gate */}
          <Billboard position={[0, -1.45, 0]}>
            <Text
              fontSize={0.24}
              color="#ffffff"
              font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy22E6k.woff"
              anchorX="center"
              anchorY="middle"
            >
              {portal.name.toUpperCase()}
            </Text>
            <Text
              position={[0, -0.25, 0]}
              fontSize={0.16}
              color={portal.glowColor}
              font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy22E6k.woff"
              anchorX="center"
              anchorY="middle"
            >
              {`${portal.activeMissions} MISSÕES // +${portal.xpValue} XP`}
            </Text>
          </Billboard>
        </group>
      </Billboard>
    </group>
  );
}

// ── MANA BEAM LINES (Center -> Portals) ──
function ManaDataLines({ portals, hoveredId }: { portals: SystemPortalData[]; hoveredId: string | null }) {
  const lines = useMemo(() => {
    return portals.map((portal) => {
      const rad = (portal.angle * Math.PI) / 180;
      const x = Math.cos(rad) * portal.radius;
      const z = Math.sin(rad) * portal.radius;
      const y = portal.elevation;

      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { id: portal.id, geometry, color: portal.color };
    });
  }, [portals]);

  return (
    <group>
      {lines.map((l) => {
        const isTarget = hoveredId === l.id;
        return (
          <primitive
            key={l.id}
            object={
              new THREE.Line(
                l.geometry,
                new THREE.LineBasicMaterial({
                  color: new THREE.Color(l.color),
                  transparent: true,
                  opacity: isTarget ? 0.75 : 0.15,
                  linewidth: isTarget ? 2 : 1,
                })
              )
            }
          />
        );
      })}
    </group>
  );
}

// ── 3D SCENE ROOT ──
function PortalWorldScene({
  level,
  xp,
  portals,
  hoveredPortal,
  onHover,
  onClick,
}: {
  level: number;
  xp: number;
  portals: SystemPortalData[];
  hoveredPortal: SystemPortalData | null;
  onHover: (portal: SystemPortalData | null) => void;
  onClick: (portal: SystemPortalData) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      
      {/* Central Pulsing Mana Crystal */}
      <CentralManaCrystal level={level} xp={xp} />

      {/* Mana Lines from Core to Gate nodes */}
      <ManaDataLines portals={portals} hoveredId={hoveredPortal?.id || null} />

      {/* 8 Floating Solo Leveling Gates */}
      {portals.map((p) => (
        <PortalGateMesh
          key={p.id}
          portal={p}
          isHovered={hoveredPortal?.id === p.id}
          onHover={onHover}
          onClick={onClick}
        />
      ))}

      {/* Upward Floating Mana Particles (Cyan & Purple) */}
      <Sparkles
        count={140}
        scale={20}
        size={2.8}
        speed={0.4}
        color="#00f0ff"
        opacity={0.65}
      />
      <Sparkles
        count={70}
        scale={24}
        size={4.0}
        speed={0.25}
        color="#8a2be2"
        opacity={0.45}
      />

      {/* Camera Controls with strict damping and bounding limits */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 + 0.12}
        minPolarAngle={Math.PI / 6}
        dampingFactor={0.06}
      />
    </>
  );
}

// ── MAIN EXPORT: 3D PORTAL HUB + 2D SYSTEM HUD OVERLAY ──
export function PortalHub3D({ onNavigate }: PortalHub3DProps) {
  const brain = useSharedBrain();
  const { level, xp, streak, realCoins, focoGems, skyrosScore } = brain;

  const [hoveredPortal, setHoveredPortal] = useState<SystemPortalData | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isMuted, setIsMuted] = useState(!systemAudio.isEnabled());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filteredPortals = useMemo(() => {
    if (filterCategory === "all") return PORTALS;
    if (filterCategory === "rankS") return PORTALS.filter((p) => p.rank === "S");
    return PORTALS.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  const handlePortalClick = (portal: SystemPortalData) => {
    systemAudio.playPortalEnter();
    setIsTransitioning(true);
    // 350ms cinematic flash before switching section
    setTimeout(() => {
      onNavigate(portal.id);
    }, 380);
  };

  const toggleMute = () => {
    const active = systemAudio.toggleAudio();
    setIsMuted(!active);
  };

  return (
    <div className="relative w-full h-[calc(100vh-85px)] min-h-[680px] bg-system-void overflow-hidden select-none">
      {/* 3D WebGL Canvas Layer */}
      <Canvas
        camera={{ position: [0, 7.5, 14], fov: 48 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <PortalWorldScene
          level={level}
          xp={xp}
          portals={filteredPortals}
          hoveredPortal={hoveredPortal}
          onHover={setHoveredPortal}
          onClick={handlePortalClick}
        />
      </Canvas>

      {/* ══ 2D SOLO LEVELING HUD OVERLAYS ══ */}

      {/* Top Header: System Status & Filter Bar */}
      <div className="absolute top-4 left-6 right-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-none">
        {/* System Title Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-system-border px-4 py-2 rounded">
          <div className="w-2.5 h-2.5 rounded-full bg-system-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
          <div>
            <div className="text-[10px] font-mono tracking-widest text-system-cyan uppercase">
              [SISTEMA DE INSTÂNCIAS // SOLO LEVELING v5.0]
            </div>
            <div className="text-xs font-system text-white tracking-wider">
              MAPA DE PORTAIS COORDENADOS
            </div>
          </div>
        </div>

        {/* Filters & Audio Button */}
        <div className="pointer-events-auto flex items-center gap-2 bg-card/80 backdrop-blur-xl border border-system-border p-1 rounded">
          {[
            { id: "all", label: "TODOS OS PORTAIS" },
            { id: "rankS", label: "RANK S (BOSS / OPS)" },
            { id: "core", label: "NÚCLEO" },
            { id: "war", label: "GUERRA / REWARD" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                systemAudio.playHover();
                setFilterCategory(tab.id);
              }}
              className={cn(
                "px-3 py-1 text-[11px] font-mono rounded transition-all",
                filterCategory === tab.id
                  ? "bg-system-cyan/20 border border-system-cyan text-system-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={toggleMute}
            className="p-1.5 text-muted-foreground hover:text-system-cyan transition-colors"
            title={isMuted ? "Ativar Áudio FX" : "Mutar Áudio FX"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-system-cyan" />}
          </button>
        </div>
      </div>

      {/* ══ SOLO LEVELING SYSTEM HOVER WINDOW (BOTTOM-LEFT MODAL) ══ */}
      {hoveredPortal && (
        <div className="absolute bottom-6 left-6 max-w-sm w-full system-window p-4 border border-system-cyan/50 animate-fade-in pointer-events-none z-30">
          <div className="flex items-center justify-between border-b border-system-cyan/20 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-system-cyan uppercase tracking-widest">
                [ALERTA DO SISTEMA: INSTÂNCIA DETECTADA]
              </span>
            </div>
            <span
              className={cn(
                "text-xs font-system font-bold px-2 py-0.5 rounded border",
                hoveredPortal.rank === "S"
                  ? "border-system-purple text-system-purple bg-system-purple/10"
                  : "border-system-cyan text-system-cyan bg-system-cyan/10"
              )}
            >
              RANK {hoveredPortal.rank}
            </span>
          </div>

          <div className="text-lg font-system text-white tracking-wide glow-hunter mb-1">
            {hoveredPortal.name}
          </div>
          <div className="text-[11px] font-mono text-system-cyanDim mb-2">
            {hoveredPortal.dungeonCode}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {hoveredPortal.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-system-cyan/20 pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Missões Ativas</span>
              <span className="text-white font-bold">{hoveredPortal.activeMissions} Objetivos</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Recompensa Potencial</span>
              <span className="text-system-gold font-bold">+{hoveredPortal.xpValue} XP</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 py-1.5 bg-system-cyan/10 border border-system-cyan/40 text-[11px] font-system text-system-cyan tracking-wider rounded">
            <span>CLIQUE PARA ADENTRAR O PORTAL</span>
            <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>
      )}

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-4 right-6 pointer-events-none text-right hidden sm:block">
        <div className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
          Navegação: Arraste para orbitar · Scroll para Zoom · Clique no portal para entrar
        </div>
      </div>

      {/* ══ CINEMATIC DUNGEON DIVE TRANSITION OVERLAY ══ */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-system-cyan/20 backdrop-blur-md flex items-center justify-center z-50 animate-pulse pointer-events-auto">
          <div className="system-window p-6 border-2 border-system-cyan shadow-[0_0_50px_#00f0ff] text-center">
            <div className="text-sm font-mono text-system-cyan uppercase tracking-widest mb-1">
              [SISTEMA DE TELEPORTE DIMENSIONAL]
            </div>
            <div className="text-2xl font-system text-white tracking-widest glow-hunter">
              ENTRANDO NA INSTÂNCIA...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
