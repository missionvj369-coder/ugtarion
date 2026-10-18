import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MousePointer2, RotateCcw, Info } from 'lucide-react';
import {
  GRAPH_NODES,
  GRAPH_LINKS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type GraphNode,
  type NodeCategory,
} from '../lib/blueprintGraph';

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface BlueprintConstellationProps {
  height?: number;
}

const BlueprintConstellation: React.FC<BlueprintConstellationProps> = ({ height = 560 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const animRef = useRef<number>(0);
  const dragRef = useRef<SimNode | null>(null);
  const hoverRef = useRef<SimNode | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [size, setSize] = useState({ w: 800, h: height });

  const initNodes = (w: number, h: number): SimNode[] => {
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.34;
    return GRAPH_NODES.map((n, i) => {
      const angle = (i / GRAPH_NODES.length) * Math.PI * 2;
      return {
        ...n,
        x: cx + R * Math.cos(angle),
        y: cy + R * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: n.category === 'core' ? 22 : 15,
      };
    });
  };

  // Resize observer — keeps canvas crisp on any container / DPR.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      const w = Math.max(320, rect.width);
      const h = height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setSize({ w, h });
      if (nodesRef.current.length === 0) nodesRef.current = initNodes(w, h);
    });

    ro.observe(parent);
    return () => ro.disconnect();
  }, [height]);

  // Physics + render loop (force-directed layout, client-side).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (nodesRef.current.length === 0) nodesRef.current = initNodes(size.w, size.h);

    const step = () => {
      const nodes = nodesRef.current;
      const cx = size.w / 2;
      const cy = size.h / 2;

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.radius + b.radius + 26;
          if (dist < minDist) {
            const force = ((minDist - dist) / dist) * 0.5;
            dx *= force;
            dy *= force;
            a.x -= dx; a.y -= dy;
            b.x += dx; b.y += dy;
          }
        }
      }

      // Spring attraction along links
      for (const link of GRAPH_LINKS) {
        const a = nodes.find((n) => n.id === link.source);
        const b = nodes.find((n) => n.id === link.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const target = 120;
        const force = (dist - target) * 0.012;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }

      // Gentle centering + integration + damping
      for (const n of nodes) {
        if (n === dragRef.current) continue;
        n.vx += (cx - n.x) * 0.002;
        n.vy += (cy - n.y) * 0.002;
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(n.radius + 6, Math.min(size.w - n.radius - 6, n.x));
        n.y = Math.max(n.radius + 6, Math.min(size.h - n.radius - 6, n.y));
      }

      draw(ctx, nodes, size.w, size.h);
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  const draw = (ctx: CanvasRenderingContext2D, nodes: SimNode[], w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    const hover = hoverRef.current;
    const sel = selected?.id;

    for (const link of GRAPH_LINKS) {
      const a = nodes.find((n) => n.id === link.source);
      const b = nodes.find((n) => n.id === link.target);
      if (!a || !b) continue;
      const isActive =
        (hover && (a === hover || b === hover)) || (sel && (a.id === sel || b.id === sel));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isActive ? 'rgba(253, 230, 138, 0.7)' : 'rgba(148, 163, 184, 0.16)';
      ctx.lineWidth = isActive ? 1.6 : 1;
      ctx.stroke();
    }

    for (const n of nodes) {
      const c = CATEGORY_COLORS[n.category];
      const isHover = hover === n;
      const isSel = sel === n.id;
      const r = n.radius + (isHover || isSel ? 4 : 0);

      if (isHover || isSel) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = `${c.from}22`;
        ctx.fill();
      }

      const grad = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.3, r * 0.2, n.x, n.y, r);
      grad.addColorStop(0, c.from);
      grad.addColorStop(1, c.to);
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.stroke();

      ctx.fillStyle = isHover || isSel ? '#ffffff' : 'rgba(228, 228, 231, 0.85)';
      ctx.font = `${n.category === 'core' ? '600 ' : '500 '}11px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + r + 14);
    }
  };

  // Pointer interactions
  const nodeAt = (x: number, y: number): SimNode | null => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = x - n.x;
      const dy = y - n.y;
      if (dx * dx + dy * dy <= (n.radius + 6) * (n.radius + 6)) return n;
    }
    return null;
  };

  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const { x, y } = getPos(e);
    const n = nodeAt(x, y);
    if (n) {
      dragRef.current = n;
      setSelected(n);
      canvasRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const { x, y } = getPos(e);
    if (dragRef.current) {
      dragRef.current.x = x;
      dragRef.current.y = y;
      dragRef.current.vx = 0;
      dragRef.current.vy = 0;
    } else {
      const n = nodeAt(x, y);
      hoverRef.current = n;
      canvasRef.current!.style.cursor = n ? 'grab' : 'default';
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const reset = () => {
    nodesRef.current = initNodes(size.w, size.h);
    setSelected(null);
  };

  const categories = Array.from(new Set(GRAPH_NODES.map((n) => n.category))) as NodeCategory[];

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-gradient-to-b from-[#0d0d16] to-[#0a0a12] overflow-hidden">
      <div className="relative" style={{ height }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => {
            hoverRef.current = null;
          }}
          className="block w-full touch-none"
          aria-label="Interactive blueprint systems graph"
        />
      </div>

      {/* Legend + controls */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 border-t border-white/10 bg-black/20">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">
          <MousePointer2 className="w-3.5 h-3.5" /> Drag to explore
        </span>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {categories.map((cat) => (
            <span key={cat} className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: `linear-gradient(135deg, ${CATEGORY_COLORS[cat].from}, ${CATEGORY_COLORS[cat].to})` }}
              />
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>
        <button
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full text-zinc-400 hover:text-white border border-white/10 hover:border-white/25 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Re-layout
        </button>
      </div>

      {/* Detail card */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 max-w-xs rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-serif text-lg text-white leading-tight">{selected.label}</h4>
            <button
              onClick={() => setSelected(null)}
              className="text-zinc-500 hover:text-white text-xs"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          <span
            className="inline-block mb-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full text-zinc-900"
            style={{ background: CATEGORY_COLORS[selected.category].from }}
          >
            {CATEGORY_LABELS[selected.category]}
          </span>
          <p className="text-sm text-zinc-300 font-light leading-relaxed flex gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-300/80" />
            {selected.description}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BlueprintConstellation;


