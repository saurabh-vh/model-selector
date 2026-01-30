// app/components/MachineModel.js
"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

export default function MachineModel({ data, isSelected, onSelect }) {
    const { scene } = useGLTF(data.model);

    // clone the scene per instance
    const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

    const ref = useRef();
    const [hovered, setHovered] = useState(false);

    // set model to its base scale
    useEffect(() => {
        const s = data.scale;
        clonedScene.scale.set(s, s, s);

        // collect meshes first to avoid adding children while traversing
        const meshes = [];
        clonedScene.traverse((child) => {
            if (child.isMesh) meshes.push(child);
        });

        const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });

        meshes.forEach((mesh) => {
            // create a simple outline mesh using the same geometry (don't clone the whole mesh)
            const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
            outline.scale.copy(new THREE.Vector3(1.03, 1.03, 1.03));
            outline.visible = false;
            outline.renderOrder = 9999;
            mesh.add(outline);
            mesh.userData.outline = outline;
        });

        return () => {
            // cleanup created outlines when component unmounts
            meshes.forEach((mesh) => {
                if (mesh.userData.outline) {
                    mesh.remove(mesh.userData.outline);
                    mesh.userData.outline.geometry?.dispose?.();
                    mesh.userData.outline.material?.dispose?.();
                    delete mesh.userData.outline;
                }
            });
        };
    }, [clonedScene, data.scale]);
    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "auto";
        }

        return () => {
            document.body.style.cursor = "auto";
        };
    }, [hovered]);
    // simple hover scale lerp and outline toggle
    useFrame(() => {
        if (!ref.current) return;
        const base = data.scale;
        const target = hovered ? base * 1.03 : base;
        ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, target, 0.12);
        ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, target, 0.12);
        ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, target, 0.12);

        clonedScene.traverse((child) => {
            if (child.isMesh && child.userData.outline) {
                child.userData.outline.visible = hovered;
            }
        });
    });

    return (
        <primitive
            ref={ref}
            object={clonedScene}
            position={data.position}
            onPointerDown={(e) => {
                e.stopPropagation();
                onSelect(data);
            }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        />
    );
}
