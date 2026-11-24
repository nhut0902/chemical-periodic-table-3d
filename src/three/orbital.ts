import * as THREE from 'three'

/** Deterministic PRNG so a cloud looks identical between renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type OrbitalKind = 's' | 'p' | 'd' | 'f'

export const ORBITAL_COLORS: Record<OrbitalKind, string> = {
  s: '#38BDF8',
  p: '#A78BFA',
  d: '#F472B6',
  f: '#4FD1C5',
}

const L_INDEX: Record<OrbitalKind, number> = { s: 0, p: 1, d: 2, f: 3 }

const AXES = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
}

interface Lobe {
  axis: THREE.Vector3
  weight: number
}

/** Lobe axes that approximate the angular nodes of each real orbital set. */
const LOBES: Record<OrbitalKind, Lobe[]> = {
  s: [{ axis: new THREE.Vector3(0, 1, 0), weight: 1 }],
  p: [
    { axis: AXES.x, weight: 1 },
    { axis: AXES.x.clone().negate(), weight: 1 },
    { axis: AXES.y, weight: 1 },
    { axis: AXES.y.clone().negate(), weight: 1 },
    { axis: AXES.z, weight: 1 },
    { axis: AXES.z.clone().negate(), weight: 1 },
  ],
    d: [
    // dz²: two cones along z
    { axis: AXES.z, weight: 0.5 },
    { axis: AXES.z.clone().negate(), weight: 0.5 },
    // dx²-y²: four lobes in the xy plane, leaving visible nodal planes
    ...[45, 135, 225, 315].map((deg) => {
      const rad = (deg * Math.PI) / 180
      return {
        axis: new THREE.Vector3(Math.cos(rad), Math.sin(rad), 0),
        weight: 0.95,
      }
    }),
  ],
  f: [
    ...[ 
      [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1],
      [1, 1, -1], [1, -1, 1], [-1, 1, 1], [-1, -1, -1],
    ].map(([x, y, z]) => ({ axis: new THREE.Vector3(x, y, z).normalize(), weight: 0.9 })),
  ],
}

/**
 * Sample |ψ|²-inspired point cloud. This is a schematic angular probability
 * density for teaching: lobes follow the real node structure of s/p/d/f, but
 * radii are normalised for the display, not hydrogenic eigenvalues.
 */
export function sampleOrbital(kind: OrbitalKind, count = 4200, seed = 7): Float32Array {
  const rand = mulberry32(seed + L_INDEX[kind] * 977)
  const out = new Float32Array(count * 3)
  const lobes = LOBES[kind]
  const totalWeight = lobes.reduce((s, l) => s + l.weight, 0)
  const base = kind === 's' ? 2.6 : kind === 'p' ? 3.2 : kind === 'd' ? 3.7 : 4.4
  const spread = kind === 's' ? Math.PI : kind === 'p' ? 0.38 : 0.27

  const dir = new THREE.Vector3()
  const perp = new THREE.Vector3()
  const tmp = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    let r = rand() * totalWeight
    let lobe = lobes[0]
    for (const l of lobes) {
      r -= l.weight
      if (r <= 0) {
        lobe = l
        break
      }
    }

    if (kind === 's') {
      const u = rand() * 2 - 1
      const theta = Math.acos(u)
      const phi = rand() * Math.PI * 2
      dir.set(Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi))
    } else {
      // angle away from the lobe axis, denser near the axis
      const theta = Math.min(Math.PI, spread * Math.sqrt(rand()) * 1.35)
      const phi = rand() * Math.PI * 2
      perp.set(0, 1, 0)
      if (Math.abs(lobe.axis.dot(perp)) > 0.95) perp.set(1, 0, 0)
      perp.crossVectors(lobe.axis, perp).normalize()
      tmp.crossVectors(lobe.axis, perp).normalize()
      dir
        .copy(lobe.axis)
        .multiplyScalar(Math.cos(theta))
        .addScaledVector(perp, Math.sin(theta) * Math.cos(phi))
        .addScaledVector(tmp, Math.sin(theta) * Math.sin(phi))
        .normalize()
    }

    const radial = base * (0.52 + 0.5 * Math.cbrt(rand()))
    out[i * 3] = dir.x * radial
    out[i * 3 + 1] = dir.y * radial
    out[i * 3 + 2] = dir.z * radial
  }

  return out
}

/** Convert a subshell n,l into the orbital family displayed for it. */
export function subshellKind(l: number): OrbitalKind {
  return (['s', 'p', 'd', 'f'] as OrbitalKind[])[Math.min(3, Math.max(0, l))]
}

export function shellRadius(n: number): number {
  return 3.0 + (n - 1) * 0.82
}
