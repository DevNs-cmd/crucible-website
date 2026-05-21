"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, Users, Award, Briefcase, TrendingUp, Cpu, Network, Rocket } from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
  icon: ComponentType<{ className?: string }>;
  desc: string;
  metric: string;
  details: string[];
}

const nodes: NodeData[] = [
  {
    id: "community",
    name: "Crucible Core",
    pos: [0, 0, 0],
    color: "#E89D30",
    icon: Network,
    desc: "The central nervous system of the Crucible founder movement.",
    metric: "5,000+ Members",
    details: ["Worldwide builder chapters", "Weekly community standups", "Co-working networks"]
  },
  {
    id: "founders",
    name: "Founders",
    pos: [-2.2, 1.5, 0.8],
    color: "#D28E2B",
    icon: Users,
    desc: "Vetted builders, serial operators, and elite technology leaders.",
    metric: "450+ Active Founders",
    details: ["Peer mastermind circles", "1-on-1 expert office hours", "Co-founder matching database"]
  },
  {
    id: "builders",
    name: "Builders",
    pos: [2.2, 1.5, -0.8],
    color: "#0F1D30",
    icon: Cpu,
    desc: "Full-stack hackers, LLM engineers, and specialized AI developers.",
    metric: "1,200+ Engineers",
    details: ["Open-source collab labs", "GPU compute subsidies", "Developer bounty programs"]
  },
  {
    id: "startups",
    name: "Startups",
    pos: [2.5, -1.2, 0.8],
    color: "#D28E2B",
    icon: Rocket,
    desc: "High-growth, AI-first startups built directly inside the Crucible pipeline.",
    metric: "$45M+ Raised",
    details: ["Crucible Studio incubation", "Demo Day investor pipeline", "Free AWS/GCP credits ($150k)"]
  },
  {
    id: "investors",
    name: "Investors",
    pos: [-2.5, -1.2, -0.8],
    color: "#0F1D30",
    icon: TrendingUp,
    desc: "Top-tier early stage VCs, syndicates, and corporate venture funds.",
    metric: "80+ VCs & Angels",
    details: ["Pre-seed syndication", "Weekly pitch feedback hours", "Curated founder intros"]
  },
  {
    id: "hackathons",
    name: "Hackathons",
    pos: [0, 2.3, 1.2],
    color: "#E89D30",
    icon: Award,
    desc: "High-octane weekend sprints building bleeding-edge technology.",
    metric: "$250k Annual Prizes",
    details: ["Global virtual hackathons", "Annual Crucible Summit", "Venture backing for winners"]
  },
  {
    id: "ailabs",
    name: "AI Labs",
    pos: [0, -2.3, -1.2],
    color: "#D28E2B",
    icon: Briefcase,
    desc: "Cutting-edge testing grounds for automation, agents, and tooling.",
    metric: "12 Shared Models",
    details: ["Private fine-tuning rigs", "Agentic tooling workflows", "AlgoForce AI research papers"]
  }
];

// Component to draw connection paths between all nodes and the Central Core
function ConnectionPaths() {
  const coreNode = nodes[0];
  return (
    <>
      {nodes.slice(1).map((node, i) => (
        <Line
          key={i}
          points={[coreNode.pos, node.pos]}
          color="#D28E2B"
          lineWidth={1.2}
          opacity={0.3}
          transparent
        />
      ))}
      {/* Dynamic orbital paths between outer rings */}
      <Line
        points={[nodes[1].pos, nodes[5].pos, nodes[2].pos, nodes[3].pos, nodes[4].pos, nodes[1].pos]}
        color="#0F1D30"
        lineWidth={0.8}
        opacity={0.15}
        transparent
      />
    </>
  );
}

interface InteractiveNodeProps {
  data: NodeData;
  activeNode: NodeData;
  setActiveNode: (n: NodeData) => void;
  hoveredNode: string | null;
  setHoveredNode: (s: string | null) => void;
}

function InteractiveNode({ data, activeNode, setActiveNode, hoveredNode, setHoveredNode }: InteractiveNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredNode === data.id;
  const isActive = activeNode.id === data.id;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Soft floating motion
    meshRef.current.position.y = data.pos[1] + Math.sin(t * 2 + data.pos[0]) * 0.08;
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={data.pos}
        onClick={(e) => {
          e.stopPropagation();
          setActiveNode(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode(data.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[isActive ? 0.35 : isHovered ? 0.28 : 0.22, 32, 32]} />
        <meshPhysicalMaterial
          color={isActive ? "#E89D30" : isHovered ? "#D28E2B" : data.color}
          roughness={0.1}
          metalness={0.8}
          emissive={isActive || isHovered ? "#D28E2B" : "#000000"}
          emissiveIntensity={isActive ? 1.5 : isHovered ? 0.8 : 0}
        />
      </mesh>
      
      {/* Node label projection helper */}
      {(isHovered || isActive) && (
        <group position={[data.pos[0], data.pos[1] + 0.5, data.pos[2]]}>
          {/* Subtle outline glow indicator */}
          <mesh>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#D28E2B" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Camera auto-pan rigging when nodes change
function CameraRig({ activeNode }: { activeNode: NodeData }) {
  useFrame((state) => {
    // Lerp camera towards target focal point
    const targetX = activeNode.pos[0] * 0.7;
    const targetY = activeNode.pos[1] * 0.7 + 0.3;
    const targetZ = activeNode.pos[2] * 0.7 + 5;
    const { camera } = state;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
  });
  return null;
}

export default function EcosystemMap3D() {
  const [mounted, setMounted] = useState(false);
  const [activeNode, setActiveNode] = useState<NodeData>(nodes[0]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const IconComp = activeNode.icon;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch min-h-[500px]">
      
      {/* 3D WebGL Canvas Area */}
      <div className="lg:col-span-2 relative h-[450px] lg:h-auto rounded-3xl bg-white border border-crucible-navy/5 shadow-inner overflow-hidden">
        {/* Helper instructions */}
        <div className="absolute top-4 left-6 z-10 pointer-events-none">
          <p className="text-[10px] font-mono font-bold tracking-widest text-crucible-navy/40 uppercase">
            Interactable 3D Ecosystem Map
          </p>
          <p className="text-xs font-semibold text-crucible-slate mt-0.5">
            Click nodes to inspect. Drag to rotate system.
          </p>
        </div>

        {/* Dynamic node tooltip indicator */}
        {hoveredNode && (
          <div className="absolute bottom-4 left-6 z-10 px-3.5 py-1.5 glass-panel-light rounded-full pointer-events-none">
            <span className="text-xs font-mono font-bold text-crucible-navy uppercase tracking-wider">
              {nodes.find(n => n.id === hoveredNode)?.name}
            </span>
          </div>
        )}

        {mounted ? (
          <Canvas gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#FFFFFF" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#D28E2B" />
            
            {/* Draw connection lines */}
            <ConnectionPaths />

            {/* Render interactable nodes */}
            {nodes.map((node) => (
              <InteractiveNode
                key={node.id}
                data={node}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
                hoveredNode={hoveredNode}
                setHoveredNode={setHoveredNode}
              />
            ))}

            {/* Orbit Controls */}
            <OrbitControls 
              enableZoom={true} 
              maxDistance={8} 
              minDistance={3}
              enablePan={false}
              autoRotate={!hoveredNode && activeNode.id === "community"}
              autoRotateSpeed={0.4}
            />

            {/* Camera transition rig */}
            <CameraRig activeNode={activeNode} />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-crucible-bg/20">
            <span className="text-xs font-mono tracking-widest text-crucible-slate animate-pulse">
              LOADING 3D NODES...
            </span>
          </div>
        )}
      </div>

      {/* HTML Detail Card Overlay Panel */}
      <div className="flex flex-col justify-between p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm relative overflow-hidden">
        {/* Glow behind card info */}
        <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-60 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Header Node Meta */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 text-crucible-amber">
              <IconComp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
                Crucible Node
              </span>
              <h3 className="text-2xl font-mono font-black text-crucible-navy mt-0.5">
                {activeNode.name}
              </h3>
            </div>
          </div>

          <p className="text-sm font-medium text-crucible-slate leading-relaxed">
            {activeNode.desc}
          </p>

          <div className="w-full h-[1px] bg-crucible-navy/5" />

          {/* Key Stat / Metric */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-navy/40 uppercase">
              Current Footprint
            </span>
            <span className="text-xl font-bold font-sans text-crucible-navy">
              {activeNode.metric}
            </span>
          </div>

          {/* Detailed features bullet list */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-navy/40 uppercase">
              Key Programs
            </span>
            <ul className="flex flex-col gap-2">
              {activeNode.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-crucible-slate leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber mt-1.5 flex-shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic actions button depending on active node */}
        <div className="relative z-10 mt-8">
          <a
            href={activeNode.id === "community" ? "/membership" : "/apply"}
            className="w-full py-4 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-2 group transition-all duration-300 shadow-md"
          >
            <span>Explore {activeNode.name}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

      </div>

    </div>
  );
}
