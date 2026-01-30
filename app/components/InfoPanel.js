"use client";

import { useMemo } from "react";

export default function InfoPanel({ model, panelPos }) {
  const PANEL_W = 260;
  const PANEL_H = 140;
  const PANEL_LEFT = 50;

  // compute fixed anchor positions
  const anchor = useMemo(() => {
    const x = PANEL_LEFT + PANEL_W; // right edge of panel
    const y = typeof window !== "undefined" ? window.innerHeight / 2 : 300; // center vertically
    return { x, y };
  }, []);

  return (
    <>
      <svg className="overlay-connector" width="100%" height="100%" viewBox={`0 0 ${typeof window !== "undefined" ? window.innerWidth : 800} ${typeof window !== "undefined" ? window.innerHeight : 600}`} preserveAspectRatio="none">
        {panelPos && (
          <line
            x1={panelPos.x}
            y1={panelPos.y}
            x2={anchor.x}
            y2={200}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>

      <div className="info-panel overlay" style={{ position: "fixed", left: PANEL_LEFT, top: "20%", transform: "translateY(-50%)", width: PANEL_W }}>
        <h2>{model.name}</h2>
        <p>{model.description}</p>
        <p>
          <strong>Status:</strong> Active
        </p>
      </div>
    </>
  );
}
