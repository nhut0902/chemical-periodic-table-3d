import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Element } from '../data/elements'
import { SHELL_COLORS } from '../data/elements'
import { ORBITAL_COLORS, sampleOrbital, shellRadius, type OrbitalKind } from './orbital'

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface AtomViewProps {
  element: Element
  mode: 'bohr' | 'orbital'
  paused: boolean
  speed: number
  labels: boolean
  activeShells: number[]
  /** Orbital families to draw; empty means derive from the valence shell. */
  orbitalKinds?: OrbitalKind[]
  /** Which component annotations are visible when labels are on. */
  labelParts?: { proton: boolean; neutron: boolean; electron: boolean }
}

function glowTexture(): THREE.Texture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,0.95)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.42)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.09)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function Nucleus({ element, paused, dim }: { element: Element; paused: boolean; dim: boolean }) {
  const group = useRef<THREE.Group>(null)
  const protonRef = useRef<THREE.InstancedMesh>(null)
  const neutronRef = useRef<THREE.InstancedMesh>(null)
  const protons = element.z
  const neutrons = Math.max(0, element.neutrons)
  const total = protons + neutrons
  const tex = useMemo(() => glowTexture(), [])

  const layout = useMemo(() => {
    const rand = mulberry32(element.z * 7919 + total)
    const radius = Math.min(1.95, 0.44 * Math.cbrt(total))
    const points: THREE.Vector3[] = []
    const scales: number[] = []
    for (let i = 0; i < total; i++) {
      const u = rand() * 2 - 1
      const phi = rand() * Math.PI * 2
      const r = radius * Math.cbrt(rand())
      const s = Math.sqrt(1 - u * u)
      points.push(new THREE.Vector3(s * Math.cos(phi) * r, u * r, s * Math.sin(phi) * r))
      scales.push(0.86 + rand() * 0.3)
    }
    return { points, scales, radius }
  }, [element.z, total])

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    const protonMesh = protonRef.current
    const neutronMesh = neutronRef.current
    if (!protonMesh || !neutronMesh) return
    for (let i = 0; i < total; i++) {
      const isProton = i < protons
      const idx = isProton ? i : i - protons
      const mesh = isProton ? protonMesh : neutronMesh
      dummy.position.copy(layout.points[i])
      dummy.scale.setScalar(layout.scales[i])
      dummy.rotation.set(i * 0.7, i * 1.3, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(idx, dummy.matrix)
    }
    protonMesh.instanceMatrix.needsUpdate = true
    neutronMesh.instanceMatrix.needsUpdate = true
    protonMesh.computeBoundingSphere()
    neutronMesh.computeBoundingSphere()
  }, [layout, total, protons])

  useFrame((state, delta) => {
    if (!group.current) return
    if (!paused) {
      group.current.rotation.y += delta * 0.12
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
    }
  })

  return (
    <group ref={group}>
      <instancedMesh
        ref={protonRef}
        args={[undefined, undefined, Math.max(1, protons)]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.118, 14, 14]} />
        <meshStandardMaterial
          color="#FB7185"
          emissive="#F97362"
          emissiveIntensity={0.55}
          roughness={0.32}
          metalness={0.15}
          transparent={dim}
          opacity={dim ? 0.5 : 1}
        />
      </instancedMesh>
      <instancedMesh
        ref={neutronRef}
        args={[undefined, undefined, Math.max(1, neutrons)]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.114, 12, 12]} />
        <meshStandardMaterial
          color="#94A3B8"
          emissive="#334155"
          emissiveIntensity={0.35}
          roughness={0.55}
          metalness={0.1}
          transparent={dim}
          opacity={dim ? 0.5 : 1}
        />
      </instancedMesh>

      <sprite scale={layout.radius * 5.2 + 1.6}>
        <spriteMaterial
          map={tex}
          color="#38BDF8"
          transparent
          opacity={dim ? 0.22 : 0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite scale={layout.radius * 2.6}>
        <spriteMaterial
          map={tex}
          color="#F97362"
          transparent
          opacity={dim ? 0.3 : 0.62}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <pointLight color="#7DD3FC" intensity={dim ? 3 : 6} distance={9} decay={2} />
    </group>
  )
}

function ElectronShells({ element, paused, speed, activeShells }: AtomViewProps) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const time = useRef(0)

  const shells = useMemo(() => {
    const rand = mulberry32(element.z * 37 + 11)
    return element.shells
      .map((count, i) => {
        const n = i + 1
        const tiltX = (rand() - 0.5) * 1.9
        const tiltZ = (rand() - 0.5) * 1.6
        return {
          n,
          count,
          radius: shellRadius(n),
          quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltX, 0, tiltZ)),
          euler: new THREE.Euler(tiltX, 0, tiltZ),
          color: SHELL_COLORS[i % SHELL_COLORS.length],
          visible: activeShells.includes(n),
        }
      })
      .filter((s) => s.count > 0)
  }, [element, activeShells])

  const visible = shells.filter((s) => s.visible)
  const totalVisible = visible.reduce((sum, s) => sum + s.count, 0)

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    visible.forEach((shell) => {
      const c = new THREE.Color(shell.color)
      for (let k = 0; k < shell.count; k++) {
        const offset = visible.slice(0, visible.indexOf(shell)).reduce((a, s) => a + s.count, 0)
        inst.setColorAt(offset + k, c)
      }
    })
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [visible])

  useFrame((_, delta) => {
    const inst = mesh.current
    if (!inst) return
    if (!paused) time.current += Math.min(delta, 0.08) * speed
    const dummy = new THREE.Object3D()
    let idx = 0
    for (const shell of visible) {
      const angular = (0.55 / Math.pow(shell.n, 0.9)) * (shell.n % 2 === 0 ? 1 : -1)
      for (let k = 0; k < shell.count; k++) {
        const angle = time.current * angular + (k / shell.count) * Math.PI * 2
        dummy.position
          .set(Math.cos(angle) * shell.radius, 0, Math.sin(angle) * shell.radius)
          .applyQuaternion(shell.quat)
        const scale = 0.052 + Math.min(0.03, shell.count * 0.0012)
        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        inst.setMatrixAt(idx++, dummy.matrix)
      }
    }
    inst.count = idx
    inst.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {visible.map((shell) => (
        <group key={shell.n} rotation={shell.euler}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[shell.radius, 0.006, 6, 180]} />
            <meshBasicMaterial
              color={shell.color}
              transparent
              opacity={0.32}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, Math.max(1, totalVisible)]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

    </group>
  )
}

function OrbitalClouds({ element, paused, activeShells, orbitalKinds }: AtomViewProps) {
  const group = useRef<THREE.Group>(null)

  const clouds = useMemo(() => {
    const valenceShell = Math.max(...activeShells.filter((n) => (element.shells[n - 1] ?? 0) > 0), 1)
    const subs = element.config.filter((s) => s.n === valenceShell)
    const derived: OrbitalKind[] = subs.map((s) => (['s', 'p', 'd', 'f'] as OrbitalKind[])[s.l] ?? 's')
    const kinds = orbitalKinds && orbitalKinds.length > 0 ? orbitalKinds : [...new Set(derived)]
    return kinds.slice(0, 3).map((kind, i) => ({
      kind,
      positions: sampleOrbital(kind, 5200, element.z * 31 + i * 13),
      // Normalised so every cloud fits the default camera frame.
      scale: 0.9,
    }))
  }, [element, activeShells, orbitalKinds])

  useFrame((_, delta) => {
    if (group.current && !paused) group.current.rotation.y += delta * 0.1
  })

  return (
    <group ref={group}>
      {clouds.map((cloud) => (
        <points key={cloud.kind} scale={cloud.scale}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[cloud.positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={ORBITAL_COLORS[cloud.kind]}
            size={0.055}
            sizeAttenuation
            transparent
            opacity={0.8}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      ))}
    </group>
  )
}

function LabelPill({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-abyss/85 px-2.5 py-1 text-[10px] text-white/85">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </div>
  )
}

function ComponentLabels({
  element,
  parts,
}: {
  element: Element
  parts: NonNullable<AtomViewProps['labelParts']>
}) {
  const shell = shellRadius(element.shells.length || 1)
  return (
    <group>
      {parts.proton && (
        <Html position={[0.55, 0.9, 0]} center distanceFactor={10} className="pointer-events-none select-none">
          <LabelPill color="#F97362">Proton · {element.z}</LabelPill>
        </Html>
      )}
      {parts.neutron && (
        <Html position={[-1.1, -0.75, 0.3]} center distanceFactor={10} className="pointer-events-none select-none">
          <LabelPill color="#94A3B8">Neutron · {element.neutrons}</LabelPill>
        </Html>
      )}
      {parts.electron && (
        <Html position={[shell * 0.85, -shell * 0.45, 0]} center distanceFactor={10} className="pointer-events-none select-none">
          <LabelPill color="#38BDF8">Electron · {element.z}</LabelPill>
        </Html>
      )}
    </group>
  )
}

export function AtomModel(props: AtomViewProps) {
  const { element, mode, labels } = props
  // Keep the outermost shell inside the default camera frame, whatever the atom.
  const outermost = Math.max(1, element.shells.length)
  const scale = Math.min(1, 5.6 / shellRadius(outermost))
  return (
    <group scale={scale}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 6]} intensity={2.1} color="#DBEAFE" />
      <directionalLight position={[-7, -4, -6]} intensity={1.1} color="#A78BFA" />
      <pointLight position={[0, 0, 0]} color="#38BDF8" intensity={2.5} distance={7} />

      <Nucleus element={element} paused={props.paused} dim={mode === 'orbital'} />
      {mode === 'bohr' ? <ElectronShells {...props} /> : <OrbitalClouds {...props} />}
      {labels && (
        <ComponentLabels
          element={element}
          parts={props.labelParts ?? { proton: true, neutron: true, electron: true }}
        />
      )}
    </group>
  )
}
