"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { Analyser } from "@/lib/analyser"

const vsSphere = `
uniform float time;
uniform float inputLevel;
uniform float outputLevel;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

// Simplex-like noise helper
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vNormal = normal;
  vPosition = position;
  
  float noise = snoise(position * 1.5 + vec3(time * 0.4));
  float audioEnergy = max(inputLevel * 0.6, outputLevel * 0.9);
  
  float displacement = noise * (0.15 + audioEnergy * 0.45);
  vDisplacement = displacement;
  
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

const fsSphere = `
uniform float time;
uniform float inputLevel;
uniform float outputLevel;
uniform vec3 userColor;
uniform vec3 aiColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vPosition);
  
  // Fresnel glow
  float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.5);
  
  // Dynamic color blend between base purple/blue, user cyan/emerald, and AI vibrant violet/amber
  vec3 baseColor = vec3(0.08, 0.12, 0.28);
  vec3 activeUser = mix(baseColor, userColor, clamp(inputLevel * 2.0, 0.0, 1.0));
  vec3 activeAI = mix(activeUser, aiColor, clamp(outputLevel * 2.2, 0.0, 1.0));
  
  // Surface shading with displacement highlights
  vec3 finalColor = activeAI + vec3(vDisplacement * 0.8) + fresnel * 0.6;
  
  gl_FragColor = vec4(finalColor, 0.92);
}
`

interface Props {
  inputNode?: AudioNode | null
  outputNode?: AudioNode | null
  className?: string
  isActive?: boolean
}

export const AudioOrbVisualizer: React.FC<Props> = ({
  inputNode,
  outputNode,
  className = "",
  isActive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const requestRef = useRef<number>(0)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.z = 3.2

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const geometry = new THREE.IcosahedronGeometry(1.05, 48)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        inputLevel: { value: 0 },
        outputLevel: { value: 0 },
        userColor: { value: new THREE.Color(0x06b6d4) }, // Cyan
        aiColor: { value: new THREE.Color(0x8b5cf6) },   // Purple
      },
      vertexShader: vsSphere,
      fragmentShader: fsSphere,
      transparent: true,
      wireframe: false,
    })
    materialRef.current = material

    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)
    meshRef.current = sphere

    // Outer subtle glow halo
    const haloGeo = new THREE.IcosahedronGeometry(1.22, 16)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    scene.add(haloMesh)

    let inputAnalyser: Analyser | null = null
    let outputAnalyser: Analyser | null = null

    if (inputNode) inputAnalyser = new Analyser(inputNode)
    if (outputNode) outputAnalyser = new Analyser(outputNode)

    const handleResize = () => {
      if (!container || !rendererRef.current) return
      const w = container.clientWidth || 300
      const h = container.clientHeight || 300
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    let lastTime = performance.now()
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate)
      const now = performance.now()
      const delta = (now - lastTime) * 0.001
      lastTime = now

      material.uniforms.time.value += delta

      let inVal = 0
      let outVal = 0

      if (inputAnalyser) {
        inVal = inputAnalyser.update()
      }
      if (outputAnalyser) {
        outVal = outputAnalyser.update()
      }

      material.uniforms.inputLevel.value = inVal
      material.uniforms.outputLevel.value = outVal

      // Idle subtle breathing pulse if no audio
      const idlePulse = Math.sin(now * 0.002) * 0.03
      const scale = 1 + idlePulse + Math.max(inVal * 0.25, outVal * 0.45)
      sphere.scale.set(scale, scale, scale)
      haloMesh.scale.set(scale * 1.08, scale * 1.08, scale * 1.08)

      sphere.rotation.y += 0.008 + outVal * 0.02
      sphere.rotation.x += 0.004 + inVal * 0.02
      haloMesh.rotation.y -= 0.005
      haloMesh.rotation.z += 0.003

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(requestRef.current)
      resizeObserver.disconnect()
      geometry.dispose()
      haloGeo.dispose()
      material.dispose()
      haloMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [inputNode, outputNode, isActive])

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center w-full h-full min-h-[220px] overflow-hidden rounded-2xl ${className}`}
      aria-hidden="true"
    />
  )
}
