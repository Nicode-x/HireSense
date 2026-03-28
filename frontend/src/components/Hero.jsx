import React, { useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";

// ─── Floating 3D Resumes ──────────────────────────────────────────────────────
const ResumeMesh = ({ initialPosition, rotation, speed, mousePos }) => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;

    // Base floating around initial pos
    const floatY = initialPosition[1] + Math.sin(t) * 0.8;
    const floatX = initialPosition[0] + Math.cos(t * 0.8) * 0.4;

    // React to cursor using projected normalized coordinates mapping roughly to space
    const mx = mousePos.current.x * 6;
    const my = -mousePos.current.y * 6;

    const dx = meshRef.current.position.x - mx;
    const dy = meshRef.current.position.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let repX = 0;
    let repY = 0;
    
    // Repel from cursor
    if (dist < 4) {
      const force = Math.pow((4 - dist) / 4, 1.5) * 1.5;
      repX = (dx / dist) * force;
      repY = (dy / dist) * force;
      
      // Add slight spin perturbation
      meshRef.current.rotation.x += force * 0.02;
      meshRef.current.rotation.y += force * 0.02;
    }

    // Smooth movement
    meshRef.current.position.x += ((floatX + repX) - meshRef.current.position.x) * 0.08;
    meshRef.current.position.y += ((floatY + repY) - meshRef.current.position.y) * 0.08;
    
    // Idle soft rotation
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.2 + rotation[0];
    meshRef.current.rotation.y = Math.cos(t * 0.4) * 0.2 + rotation[1];
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1 + rotation[2];
  });

  return (
    <mesh ref={meshRef} position={initialPosition} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[1.5, 2.0, 0.04]} />
      <meshStandardMaterial color="#fefae0" roughness={0.5} metalness={0.1} />
      
      {/* Abstract document lines / sections */}
      <mesh position={[0, 0.5, 0.025]}>
        <boxGeometry args={[0.8, 0.12, 0.01]} />
        <meshBasicMaterial color="#d4a373" />
      </mesh>
      <mesh position={[0, 0.1, 0.025]}>
        <boxGeometry args={[1.1, 0.06, 0.01]} />
        <meshBasicMaterial color="#ccd5ae" opacity={0.6} transparent />
      </mesh>
      <mesh position={[0, -0.1, 0.025]}>
        <boxGeometry args={[1.1, 0.06, 0.01]} />
        <meshBasicMaterial color="#a08c6a" opacity={0.4} transparent />
      </mesh>
      <mesh position={[-0.2, -0.3, 0.025]}>
        <boxGeometry args={[0.7, 0.06, 0.01]} />
        <meshBasicMaterial color="#a08c6a" opacity={0.4} transparent />
      </mesh>
    </mesh>
  );
};

const FloatingResumes = ({ mousePos }) => {
  const resumes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      pos: [
        (Math.random() - 0.5) * 14, 
        (Math.random() - 0.5) * 10, 
        (Math.random() - 0.5) * 6 - 2
      ],
      rot: [
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
      ],
      speed: 0.8 + Math.random() * 1.5
    }));
  }, []);

  return (
    <>
      {resumes.map((r) => (
        <ResumeMesh
          key={r.id}
          initialPosition={r.pos}
          rotation={r.rot}
          speed={r.speed}
          mousePos={mousePos}
        />
      ))}
    </>
  );
};

// ─── Orbital ring ─────────────────────────────────────────────────────────────
const OrbitalRing = ({ radius, speed, color, tilt }) => {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * speed;
  });
  return (
    <mesh ref={meshRef} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 16, 120]} />
      <meshStandardMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
};

// ─── Floating warm particles ──────────────────────────────────────────────────
const Particles = ({ count = 160 }) => {
  const mesh = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.018;
      mesh.current.rotation.x = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} itemSize={3} array={positions} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#d4a373" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────
const Scene = ({ mousePos }) => (
  <>
    <ambientLight intensity={0.7} color="#fefae0" />
    <pointLight position={[10, 10, 10]} intensity={1.2} color="#d4a373" />
    <pointLight position={[-10, -8, -5]} intensity={0.6} color="#ccd5ae" />
    <spotLight position={[0, 15, 0]} intensity={0.8} color="#faedcd" angle={0.35} penumbra={1} />
    <FloatingResumes mousePos={mousePos} />
    <OrbitalRing radius={4.2} speed={0.22}  color="#ccd5ae" tilt={Math.PI / 4} />
    <OrbitalRing radius={5.2} speed={-0.15} color="#d4a373" tilt={Math.PI / 3} />
    <OrbitalRing radius={6.5} speed={0.12}  color="#e9edc9" tilt={Math.PI / 6} />
    <Particles count={220} />
  </>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const mousePos = useRef({ x: 0, y: 0 });
  const navigate  = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleHistoryClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
    } else {
      document.getElementById("history")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0 },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fefae0 0%, #faedcd 55%, #e9edc9 100%)" }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 52 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene mousePos={mousePos} />
        </Canvas>
      </div>

      {/* Gradient overlay — subtle to not hide warm tone */}
      <div className="absolute inset-0 z-1"
        style={{ background: "linear-gradient(180deg, rgba(254,250,224,0.25) 0%, rgba(250,237,205,0.55) 70%, rgba(254,250,224,0.92) 100%)" }} />

      {/* Warm glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full blur-[120px] pointer-events-none z-1"
        style={{ background: "rgba(212,163,115,0.18)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] rounded-full blur-[90px] pointer-events-none z-1"
        style={{ background: "rgba(204,213,174,0.22)" }} />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.15 } } }}
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="section-eyebrow mb-4"
        >
          AI-Powered Recruitment Intelligence
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#3d3522",
          }}
        >
          Hire <span style={{ color: "#d4a373" }}>Smarter</span>,<br />
          Faster &amp; Better
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="section-sub mx-auto mt-6 max-w-2xl"
          style={{ fontSize: "1.125rem" }}
        >
          Upload resumes, compare candidates against job descriptions, rank top talent,
          and get recruiter-ready AI explanations — all in one premium hiring dashboard.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="#analyze" className="btn-premium px-10 py-4 text-base">
            Start Analyzing
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <button onClick={handleHistoryClick} className="btn-outline px-8 py-4 text-base">
            View History
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-16 flex flex-wrap justify-center gap-10"
        >
          {[
            { val: "95%", label: "Accuracy Rate" },
            { val: "10x", label: "Faster Screening" },
            { val: "AI",  label: "Powered Rankings" },
          ].map((s) => (
            <div key={s.val} className="text-center">
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#d4a373" }}>{s.val}</div>
              <div style={{ fontSize: "0.72rem", color: "#a08c6a", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "0.3rem" }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 z-10 flex flex-col items-center gap-2 animate-floatY">
        <div style={{ width: "1.5px", height: "40px", background: "linear-gradient(to bottom, transparent, #d4a373)" }} />
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#a08c6a", textTransform: "uppercase" }}>Scroll</span>
      </div>
    </section>
  );
};

export default Hero;