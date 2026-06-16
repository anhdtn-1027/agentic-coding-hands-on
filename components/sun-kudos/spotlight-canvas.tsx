"use client";

// mm:2940:14174 — B.7_Spotlight (interactive word-cloud SVG)
// Pan: pointer drag on inner <g>. Zoom: wheel (clamp 0.5–2.5). Double-click: reset.
// Hover: tooltip with name + postedAt. Click: presentational (no nav this pass).

import { useRef, useState, useCallback, useEffect } from "react";
import type { SpotlightNode } from "./types";
import {
  buildPositionedNodes,
  CANVAS_DIMS,
  COLOR_NORMAL,
  COLOR_HIGHLIGHTED,
  FONT_FAMILY,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from "./spotlight-scatter";

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  postedAt: string;
}

export interface SpotlightCanvasProps {
  nodes: SpotlightNode[];
  loading?: boolean;
  /** true = drag to pan; false = zoom-only with wheel */
  panMode: boolean;
  onNodeClick?: (node: SpotlightNode) => void;
  searchQuery?: string;
}

export function SpotlightCanvas({
  nodes,
  loading = false,
  panMode,
  onNodeClick,
  searchQuery = "",
}: SpotlightCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const dragging = useRef(false);
  const lastPt = useRef({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, name: "", postedAt: "",
  });

  const positioned = buildPositionedNodes(nodes, searchQuery);
  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!panMode) return;
    dragging.current = true;
    lastPt.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [panMode]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!panMode || !dragging.current) return;
    const dx = e.clientX - lastPt.current.x;
    const dy = e.clientY - lastPt.current.y;
    lastPt.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, [panMode]);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  // React wheel listeners are passive by default — e.preventDefault() is ignored there,
  // so the page scrolls while zooming. Attach a non-passive native listener instead.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setTransform((t) => ({
        ...t,
        scale: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, t.scale + delta)),
      }));
    }
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []); // ZOOM_STEP/MIN_ZOOM/MAX_ZOOM are module-level constants — no deps needed

  const onDoubleClick = useCallback(() => setTransform({ x: 0, y: 0, scale: 1 }), []);

  // mm:B.7 canvas shell styles (reused for loading/empty states)
  const canvasShell: React.CSSProperties = {
    width: "100%",
    aspectRatio: `${CANVAS_DIMS.w}/${CANVAS_DIMS.h}`,
    borderRadius: 47,                            // mm:border-radius 47.14px
    border: "1px solid #998C5F",                 // mm:border 1px solid #998C5F
    background: "rgba(0, 0, 0, 0.70)",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  if (loading) {
    return (
      <div style={canvasShell} role="status" aria-label="Loading spotlight board">
        <div style={{
          width: "60%", height: 8, borderRadius: 4,
          background: "rgba(255,255,255,0.12)",
        }} />
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div style={{ ...canvasShell, color: "rgba(255,255,255,0.4)", fontFamily: FONT_FAMILY, fontSize: 14 }}>
        No spotlight data
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* mm:B.7 — border-radius 47px, border 1px solid #998C5F, dark bg */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_DIMS.w} ${CANVAS_DIMS.h}`}
        width="100%"
        style={{
          display: "block",
          borderRadius: 47,
          border: "1px solid #998C5F",
          background: "rgba(0, 0, 0, 0.70)",
          cursor: panMode ? "grab" : "default",
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onDoubleClick={onDoubleClick}
        aria-label="Spotlight word cloud"
        role="img"
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {positioned.map((node, i) => (
            <text
              key={`${node.name}-${i}`}
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              // mm: highlighted → #F17676, normal → #FFFFFF
              fill={node.highlighted ? COLOR_HIGHLIGHTED : COLOR_NORMAL}
              opacity={node.dimmed ? 0.2 : 1}
              fontSize={node.fontSize}
              fontFamily={FONT_FAMILY}
              fontWeight={700}
              style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseEnter={(e) => {
                const rect = svgRef.current?.getBoundingClientRect();
                if (!rect) return;
                setTooltip({
                  visible: true,
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  name: node.name,
                  postedAt: node.postedAt,
                });
              }}
              onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
              onClick={() => {
                // presentational click — no navigation this pass
                onNodeClick?.(node);
              }}
            >
              {node.name}
            </text>
          ))}
        </g>
      </svg>

      {/* Hover tooltip — name + received time */}
      {tooltip.visible && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            left: tooltip.x + 12,
            top: tooltip.y - 8,
            background: "rgba(0,16,26,0.95)",
            border: "1px solid #998C5F",
            borderRadius: 8,
            padding: "6px 10px",
            pointerEvents: "none",
            zIndex: 10,
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            lineHeight: "1.4",
          }}
        >
          <div style={{ fontWeight: 700 }}>{tooltip.name}</div>
          {/* mm: gold accent for time label */}
          <div style={{ color: "rgba(255,234,158,0.8)", fontSize: 10 }}>{tooltip.postedAt}</div>
        </div>
      )}
    </div>
  );
}
