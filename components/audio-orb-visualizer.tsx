"use client"
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Analyser } from '@/lib/analyser';

// استيراد الشيدرز (بناءً على الملفات التي رفعتها)
const vsSphere = `
uniform float time;
uniform vec4 inputData;
uniform vec4 outputData;
varying vec3 vNormal;
void main() {
  vec3 pos = position;
  vec3 dir = normalize(pos);
  pos += dir * (inputData.x * 0.2 * sin(pos.y * 10.0 + time));
  pos += dir * (outputData.x * 0.5 * sin(pos.x * 10.0 + time));
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const fsSphere = `
varying vec3 vNormal;
void main() {
  gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
}`;

interface Props {
  inputNode?: AudioNode | null;
  outputNode?: AudioNode | null;
}

export const AudioOrbVisualizer: React.FC<Props> = ({ inputNode, outputNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x100c14);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.IcosahedronGeometry(1, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        inputData: { value: new THREE.Vector4() },
        outputData: { value: new THREE.Vector4() },
      },
      vertexShader: vsSphere,
      fragmentShader: fsSphere,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // ربط المحلل الصوتي
    let inputAnalyser: Analyser | null = null;
    let outputAnalyser: Analyser | null = null;
    if (inputNode) inputAnalyser = new Analyser(inputNode);
    if (outputNode) outputAnalyser = new Analyser(outputNode);

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      
      const time = performance.now() * 0.001;
      material.uniforms.time.value = time;

      if (inputAnalyser) {
        inputAnalyser.update();
        material.uniforms.inputData.value.set(inputAnalyser.data[0] / 255, 0, 0, 0);
      }
      if (outputAnalyser) {
        outputAnalyser.update();
        material.uniforms.outputData.value.set(outputAnalyser.data[0] / 255, 0, 0, 0);
        const scale = 1 + (outputAnalyser.data[0] / 255) * 0.2;
        sphere.scale.set(scale, scale, scale);
      }

      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [inputNode, outputNode]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};
