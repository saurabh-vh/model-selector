// app/components/CameraRig.js
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function CameraRig({ selected, controls }) {
  const { camera } = useThree();

  const target = useRef(new THREE.Vector3(0,0,0));
  const desiredPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!controls.current) return;

    // determine the target position (center of focus)
    const dest = selected ? new THREE.Vector3(...selected.position) : new THREE.Vector3(0, 1, 0);
    target.current.lerp(dest, 0.08);

    controls.current.target.copy(target.current);

    // When a model is selected, only move the orbit target toward it.
    // Do NOT force camera.position so user can freely zoom in/out within OrbitControls limits.
    // OrbitControls continues to enforce its own `minDistance`/`maxDistance`.
  });

  return null;
}
