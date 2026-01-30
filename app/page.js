"use client";

import Scene from "./components/Scene";
import InfoPanel from "./components/InfoPanel";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [panelPos, setPanelPos] = useState(null);

  return (
    <div className="container">
      {selected && <InfoPanel model={selected} panelPos={panelPos} />}
      <Scene selected={selected} setSelected={setSelected} setPanelPos={setPanelPos} />
    </div>
  );
}
