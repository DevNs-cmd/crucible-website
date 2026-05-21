"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Terminal, 
  Cpu, 
  Send, 
  Radio, 
  Check, 
  X, 
  Activity, 
  HardDrive, 
  Zap, 
  TrendingUp, 
  Server
} from "lucide-react";

type AdminTab = "analytics" | "applications" | "compute" | "broadcast";

interface Application {
  id: string;
  name: string;
  founder: string;
  project: string;
  score: number;
  tier: "Elite Resident" | "Incubator" | "Core Builder";
  status: "pending" | "approved" | "rejected";
}

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [broadcastTarget, setBroadcastTarget] = useState("all-founders");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const logIdRef = useRef(4);
  const nextLogId = () => {
    logIdRef.current += 1;
    return `admin-log-${logIdRef.current}`;
  };
  
  // Dynamic logs state
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", timestamp: "22:42:01", source: "ALGOFORCE_GRID", message: "Node 12 auto-scaled to meet H100 GPU compute spike.", type: "info" },
    { id: "2", timestamp: "22:40:15", source: "WAITLIST_SVC", message: "New application received from AuraAI (Score: 94/100).", type: "success" },
    { id: "3", timestamp: "22:35:12", source: "BROADCAST_TWR", message: "Weekly ecosystem digest sent successfully to 1,420 members.", type: "success" },
    { id: "4", timestamp: "22:15:40", source: "SECURITY_AUTH", message: "Admin role initialized with cryptographically signed token.", type: "info" },
  ]);

  // Simulated applications state
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app-1",
      name: "Nexus Labs",
      founder: "Aria Chen",
      project: "Decentralized physical infrastructure network (DePIN) for local browser model compute sharing.",
      score: 96,
      tier: "Elite Resident",
      status: "pending"
    },
    {
      id: "app-2",
      name: "Zephyr Systems",
      founder: "Marcus Vance",
      project: "Zero-latency audio-to-audio conversational agents running on lightweight edge matrices.",
      score: 89,
      tier: "Incubator",
      status: "pending"
    },
    {
      id: "app-3",
      name: "Solaris Bio",
      founder: "Dr. Elena Rostova",
      project: "Generative protein engineering workflow models accelerated via multi-node H100 clusters.",
      score: 93,
      tier: "Elite Resident",
      status: "pending"
    },
    {
      id: "app-4",
      name: "Crux AI",
      founder: "Devon Miller",
      project: "Collaborative developer sandbox layer incorporating dynamic semantic code indexing.",
      score: 82,
      tier: "Core Builder",
      status: "pending"
    }
  ]);

  // Automated log ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const sources = ["ALGOFORCE_GRID", "SYS_METRICS", "WAITLIST_SVC", "NETWORK_EDGE", "COMPUTE_NODE"];
      const messages = [
        "Node telemetry sync complete. All systems nominal.",
        "GPU temperature normalized to 41.5°C across cluster.",
        "Pending cohort batch index updated dynamically.",
        "Waitlist registration pipeline cleared.",
        "Telemetry latency optimized to 18ms grid-wide."
      ];
      const types: Array<"info" | "success" | "warning"> = ["info", "success", "info"];
      
      const newLog: LogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        type: types[Math.floor(Math.random() * types.length)]
      };

      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleApprove = (id: string, name: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: "approved" } : app));
    
    // Add success log
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const log: LogEntry = {
      id: nextLogId(),
      timestamp,
      source: "ADMIN_CONSOLE",
      message: `Approved '${name}' application into Crucible Ecosystem. Notification sent.`,
      type: "success"
    };
    setLogs(prev => [log, ...prev]);
    triggerToast(`Application '${name}' Approved!`);
  };

  const handleReject = (id: string, name: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: "rejected" } : app));
    
    // Add warning log
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const log: LogEntry = {
      id: nextLogId(),
      timestamp,
      source: "ADMIN_CONSOLE",
      message: `Rejected '${name}' application. Waitlist fallback status assigned.`,
      type: "warning"
    };
    setLogs(prev => [log, ...prev]);
    triggerToast(`Application '${name}' Waitlisted.`);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastContent) {
      triggerToast("Please fill in all broadcast fields.");
      return;
    }

    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const targetName = broadcastTarget === "all-founders" ? "All Vetted Founders" : 
                       broadcastTarget === "waitlist" ? "All Waitlisted Applicants" : "AlgoForce Computing Group";
    
    const log: LogEntry = {
      id: nextLogId(),
      timestamp,
      source: "BROADCAST_TWR",
      message: `Cryptographic broadcast '${broadcastSubject}' dispatched to [${targetName}].`,
      type: "success"
    };
    setLogs(prev => [log, ...prev]);
    triggerToast(`Ecosystem Broadcast Dispatched Successfully!`);
    
    // Clear form
    setBroadcastSubject("");
    setBroadcastContent("");
  };

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl glass-panel-gold border-crucible-amber text-crucible-navy font-mono text-xs font-bold flex items-center gap-3 shadow-xl"
          >
            <Zap className="w-4 h-4 text-crucible-amber animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative flex flex-col gap-10">
        
        {/* Glow Effects */}
        <div className="absolute top-12 right-12 w-[500px] h-[500px] glow-amber-radial opacity-40 pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] glow-navy-radial opacity-50 pointer-events-none" />

        {/* 1. Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-crucible-navy/5 pb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber animate-ping" />
              <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
                ADMIN SECURE TUNNEL // OVERLORD
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
            >
              CRUCIBLE <br />
              <span className="text-gradient-amber-gold">TELEMETRY GRID.</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 font-mono text-[10px] text-crucible-slate bg-white px-5 py-3.5 rounded-2xl border border-crucible-navy/5 shadow-sm"
          >
            <Activity className="w-4 h-4 text-crucible-amber animate-pulse" />
            <div className="flex flex-col">
              <span className="font-bold text-crucible-navy uppercase">GRID CONNECTION STABLE</span>
              <span>LATENCY: 14ms // PKT DROP: 0.00%</span>
            </div>
          </motion.div>
        </div>

        {/* 2. Global Core Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Cohort Founders", val: "142", sub: "Vetted Builders", icon: Users },
            { label: "Total Applications", val: "1,849", sub: "+24 in last 24h", icon: TrendingUp },
            { label: "H100 Active Clusters", val: "28 / 32 Nodes", sub: "AlgoForce Shared GPU", icon: Cpu },
            { label: "Ecosystem Telemetry Pool", val: "94.8%", sub: "Nominal Load Rating", icon: Server }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                key={idx}
                className="p-6 rounded-2xl bg-white border border-crucible-navy/5 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-crucible-slate/60 uppercase tracking-widest block mb-1">
                    {stat.label}
                  </span>
                  <h3 className="text-2xl font-mono font-black text-crucible-navy">{stat.val}</h3>
                  <span className="text-[10px] text-crucible-slate/70 font-semibold">{stat.sub}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-crucible-bg/60 border border-crucible-navy/5 flex items-center justify-center text-crucible-amber">
                  <Icon className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Operational Grid (Interactive Tab Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel - Tab Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Tab selection header */}
            <div className="p-1.5 rounded-2xl bg-white border border-crucible-navy/5 shadow-sm flex flex-wrap gap-1">
              {([
                { id: "analytics", label: "Analytics Matrix" },
                { id: "applications", label: "Pending Founders" },
                { id: "compute", label: "Compute Overlord" },
                { id: "broadcast", label: "Broadcast Tower" }
              ] satisfies Array<{ id: AdminTab; label: string }>).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-grow md:flex-grow-0 px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-crucible-navy text-white shadow-md"
                      : "text-crucible-slate/75 hover:bg-crucible-bg hover:text-crucible-navy"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Render Tab Contents */}
            <div className="min-h-[420px]">
              {activeTab === "analytics" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-8"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      Telemetry Analytics.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Ecosystem metrics compiled from AlgoForce grid node networks.</p>
                  </div>

                  {/* Simulated charts using CSS styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Founder Activity */}
                    <div className="p-6 rounded-2xl bg-crucible-bg/30 border border-crucible-navy/5 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-crucible-navy/5 pb-2">
                        <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Ecosystem Velocity (Weekly)</span>
                        <span className="font-mono text-[9px] font-bold text-crucible-amber">+24.5%</span>
                      </div>
                      <div className="h-32 flex items-end justify-between gap-2.5 pt-4">
                        {[40, 55, 48, 70, 85, 62, 92].map((height, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full bg-crucible-navy/5 rounded-t-md relative h-full overflow-hidden">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 1, delay: 0.1 * idx }}
                                className="w-full bg-gradient-to-t from-crucible-amber to-crucible-gold absolute bottom-0 rounded-t-md"
                              />
                            </div>
                            <span className="font-mono text-[8px] font-bold text-crucible-slate/60">W0{idx+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compute allocations */}
                    <div className="p-6 rounded-2xl bg-crucible-bg/30 border border-crucible-navy/5 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-crucible-navy/5 pb-2">
                        <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase">GPU Allocation Breakdown</span>
                        <span className="font-mono text-[9px] font-bold text-crucible-slate/75">87.5% Bound</span>
                      </div>
                      <div className="flex flex-col gap-3 pt-2">
                        {[
                          { label: "Elite Resident Clusters", pct: 60, val: "1,500 hrs" },
                          { label: "Incubator Nodes", pct: 25, val: "625 hrs" },
                          { label: "Core Sandbox Compute", pct: 15, val: "375 hrs" }
                        ].map((cItem, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center font-mono text-[9px] font-bold">
                              <span className="text-crucible-slate/70">{cItem.label}</span>
                              <span className="text-crucible-navy">{cItem.val} ({cItem.pct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-crucible-navy/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${cItem.pct}%` }}
                                transition={{ duration: 0.8, delay: 0.2 * idx }}
                                className="h-full bg-crucible-navy"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Technical Spec Logs */}
                  <div className="p-6 rounded-2xl bg-crucible-navy text-[#FAF8F5] border border-white/5 font-mono text-[10px] flex flex-col gap-3.5 shadow-lg">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-crucible-amber" />
                        <span className="font-bold uppercase tracking-wider text-white">Ecosystem Diagnostics Matrix</span>
                      </div>
                      <span className="text-crucible-amber text-[9px] font-bold px-2 py-0.5 rounded-full bg-crucible-amber/15 border border-crucible-amber/25">SECURE CONNECTION</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-white/50 block">PARENT NODES:</span>
                        <span className="font-bold text-white uppercase">AlgoForce Core Grid</span>
                      </div>
                      <div>
                        <span className="text-white/50 block">VAULT STORAGE:</span>
                        <span className="font-bold text-white uppercase">AES-256 ENCRYPTED</span>
                      </div>
                      <div>
                        <span className="text-white/50 block">COHORT DURATION:</span>
                        <span className="font-bold text-white uppercase">12 MONTH CYCLES</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {activeTab === "applications" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      Pending Founder Applications.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Review incoming builders requesting ecosystem access and H100 compute pools.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                      {applications.filter(app => app.status === "pending").map(app => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.4 }}
                          key={app.id}
                          className="p-5 rounded-2xl border border-crucible-navy/5 bg-crucible-bg/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-crucible-navy/10 hover:bg-white transition-all duration-300"
                        >
                          <div className="max-w-xl">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono text-xs font-black text-crucible-navy uppercase">{app.name}</span>
                              <span className="text-[9px] font-mono text-crucible-slate/60 font-semibold">by {app.founder}</span>
                              <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-crucible-navy/10 bg-white text-crucible-navy">
                                {app.tier}
                              </span>
                            </div>
                            <p className="text-xxs font-medium text-crucible-slate/90 leading-relaxed font-sans">
                              {app.project}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-crucible-navy/5 pt-3 md:pt-0">
                            <div className="text-right flex flex-col">
                              <span className="font-mono text-[8px] font-bold text-crucible-slate/50 uppercase tracking-wider">FIT SCORE</span>
                              <span className="font-mono text-sm font-black text-crucible-amber">{app.score}%</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleReject(app.id, app.name)}
                                className="w-9 h-9 rounded-xl border border-red-500/10 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-all duration-300 cursor-pointer"
                                title="Reject / Waitlist"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApprove(app.id, app.name)}
                                className="w-9 h-9 rounded-xl border border-crucible-amber/20 bg-crucible-amber/10 hover:bg-crucible-amber hover:text-white text-crucible-amber flex items-center justify-center transition-all duration-300 cursor-pointer"
                                title="Approve Entry"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {applications.filter(app => app.status === "pending").length === 0 && (
                      <div className="text-center py-12 border border-dashed border-crucible-navy/10 rounded-2xl bg-crucible-bg/30">
                        <span className="font-mono text-[10px] text-crucible-slate/50 uppercase font-bold">All pending applications reviewed. Telemetry queue clear.</span>
                      </div>
                    )}
                  </div>

                  {/* History of Decisions */}
                  {applications.filter(app => app.status !== "pending").length > 0 && (
                    <div className="border-t border-crucible-navy/5 pt-6 mt-2">
                      <h4 className="font-mono text-[10px] font-bold text-crucible-navy uppercase mb-3">Audit Logs (Decided Session batch)</h4>
                      <div className="flex flex-col gap-2">
                        {applications.filter(app => app.status !== "pending").map(app => (
                          <div key={app.id} className="flex justify-between items-center text-[10px] font-mono px-3 py-2 bg-white rounded-lg border border-crucible-navy/5">
                            <span className="text-crucible-navy font-bold">{app.name} ({app.founder})</span>
                            <span className={`font-bold uppercase text-[9px] ${app.status === "approved" ? "text-crucible-amber" : "text-red-500"}`}>
                              {app.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

              {activeTab === "compute" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      AlgoForce GPU Cluster Core.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Control active compute clusters, monitor hardware telemetry, and manage shard partitions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Node status lists */}
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase tracking-wider">GRID SPEC Telemetry</span>
                      
                      {[
                        { name: "ALGOFORCE_GRID_01", load: 92, temp: "42°C", status: "ACTIVE" },
                        { name: "ALGOFORCE_GRID_02", load: 78, temp: "39°C", status: "ACTIVE" },
                        { name: "ALGOFORCE_GRID_03", load: 45, temp: "35°C", status: "ACTIVE" },
                        { name: "ALGOFORCE_GRID_04", load: 0, temp: "22°C", status: "STANDBY" }
                      ].map((node, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-crucible-navy/5 bg-crucible-bg/30 flex items-center justify-between text-[10px] font-mono">
                          <div className="flex items-center gap-2">
                            <Cpu className={`w-3.5 h-3.5 ${node.status === "ACTIVE" ? "text-crucible-amber animate-pulse" : "text-crucible-slate/40"}`} />
                            <span className="font-bold text-crucible-navy">{node.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-crucible-slate">{node.temp}</span>
                            <span className="text-crucible-slate font-bold">{node.load}% LOAD</span>
                            <span className={`font-bold text-[8px] px-2 py-0.5 rounded-full ${
                              node.status === "ACTIVE" ? "bg-crucible-amber/15 text-crucible-amber border border-crucible-amber/20" : "bg-white text-crucible-slate/60 border border-crucible-navy/5"
                            }`}>{node.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* GPU Controls & Hardware Stats */}
                    <div className="p-6 rounded-2xl bg-crucible-bg/30 border border-crucible-navy/5 flex flex-col justify-between">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-crucible-amber" />
                          <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Total Cluster Footprint</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-xl border border-crucible-navy/5 flex flex-col">
                            <span className="font-mono text-[8px] text-crucible-slate/50">TOTAL CORES</span>
                            <span className="font-mono text-sm font-black text-crucible-navy">32,768 Tensor</span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-crucible-navy/5 flex flex-col">
                            <span className="font-mono text-[8px] text-crucible-slate/50">MEMORY BANDWIDTH</span>
                            <span className="font-mono text-sm font-black text-crucible-navy">3.2 TB/s</span>
                          </div>
                        </div>
                        
                        <p className="text-[10px] text-crucible-slate font-sans leading-normal">
                          AlgoForce AI incubator grants Crucible residents on-demand access to high-performance local H100 GPU clusters for advanced training and telemetry simulations.
                        </p>
                      </div>

                      <button
                        onClick={() => triggerToast("Compute grid optimized. Shards re-balanced.")}
                        className="w-full py-3 mt-6 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy transition-all duration-300 cursor-pointer"
                      >
                        Optimize Node Shards
                      </button>
                    </div>

                  </div>

                </motion.div>
              )}

              {activeTab === "broadcast" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      Broadcasting Tower.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Disseminate cohort updates, waitlist status alerts, or technical announcements across the Crucible matrix.</p>
                  </div>

                  <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Dispatch Target</label>
                        <select
                          value={broadcastTarget}
                          onChange={(e) => setBroadcastTarget(e.target.value)}
                          className="p-3 rounded-xl border border-crucible-navy/10 bg-crucible-bg text-xxs font-mono font-bold focus:outline-none focus:border-crucible-amber"
                        >
                          <option value="all-founders">All Vetted Founders</option>
                          <option value="waitlist">Waitlist Applicants</option>
                          <option value="compute-shards">Compute Shard Users</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Broadcast Subject</label>
                        <input
                          type="text"
                          placeholder="e.g. Crucible Incubation Cohort 05 Application Deadlines"
                          value={broadcastSubject}
                          onChange={(e) => setBroadcastSubject(e.target.value)}
                          className="p-3 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-semibold focus:outline-none focus:border-crucible-amber font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Telemetry Body Content</label>
                      <textarea
                        rows={6}
                        placeholder="Write cohort notifications or news here... (Accepts standard plaintext message)"
                        value={broadcastContent}
                        onChange={(e) => setBroadcastContent(e.target.value)}
                        className="p-4 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-medium focus:outline-none focus:border-crucible-amber font-sans leading-normal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-fit px-6 py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center gap-2 transition-all duration-300 shadow-md cursor-pointer self-end"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Broadcast</span>
                    </button>

                  </form>

                </motion.div>
              )}
            </div>

          </div>

          {/* Right panel - Live Log Feeds */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col h-[560px]">
            <div className="flex justify-between items-center border-b border-crucible-navy/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-crucible-amber animate-pulse" />
                <h3 className="text-xs font-mono font-black text-crucible-navy uppercase tracking-wider">
                  Live Log Telemetry
                </h3>
              </div>
              <span className="font-mono text-[8px] font-bold bg-crucible-bg text-crucible-slate/70 px-2 py-0.5 rounded-full border border-crucible-navy/5">LIVE FEED</span>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-3 font-mono text-[9px] leading-relaxed custom-scrollbar">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-xl border text-[9px] flex flex-col gap-1 transition-all duration-300 ${
                    log.type === "success" 
                      ? "border-crucible-amber/20 bg-crucible-amber/5 text-crucible-navy" 
                      : log.type === "warning"
                      ? "border-red-500/20 bg-red-50 text-red-700"
                      : "border-crucible-navy/5 bg-crucible-bg/30 text-crucible-slate"
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-[8px] tracking-wide">
                    <span className={log.type === "success" ? "text-crucible-amber" : "text-crucible-navy/70"}>
                      [{log.source}]
                    </span>
                    <span className="opacity-60">{log.timestamp}</span>
                  </div>
                  <p className="font-medium">{log.message}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-crucible-navy/5 pt-4 mt-4 flex items-center justify-between font-mono text-[8px] text-crucible-slate/60 font-bold">
              <span>ACTIVE SESSION: 04h 32m</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber animate-ping" />
                SYNCED WITH CLOUD
              </span>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
