import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from '../motion'

const NODE_COUNT = 34
const LINKS_PER_NODE = 3
const PACKET_COUNT = 14
const RADIUS = 3.4

// Evenly spread points over a sphere, slightly jittered so it looks organic
function buildNetwork() {
  const nodes: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    const jitter = 0.85 + Math.random() * 0.3
    nodes.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(RADIUS * jitter))
  }
  const edges: [number, number][] = []
  const seen = new Set<string>()
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: a.distanceTo(b) }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, LINKS_PER_NODE)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  // a few hub nodes are "core servers"
  const hubs = new Set([0, 7, 13, 21, 28])
  return { nodes, edges, hubs }
}

function Network() {
  const group = useRef<THREE.Group>(null)
  const packetsRef = useRef<THREE.InstancedMesh>(null)
  const { nodes, edges, hubs } = useMemo(buildNetwork, [])

  const lineGeo = useMemo(() => {
    const pos = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(pos, i * 6)
      nodes[b].toArray(pos, i * 6 + 3)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [nodes, edges])

  const packets = useMemo(
    () =>
      Array.from({ length: PACKET_COUNT }, () => ({
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.25,
        forward: Math.random() > 0.5,
      })),
    [edges.length],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g || reducedMotion) return
    const scroll = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)
    // slow spin + mouse parallax + scroll-driven tilt
    g.rotation.y += delta * 0.03
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.25 + scroll * 1.2, 0.05)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.15, 0.05)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 9 - scroll * 3, 0.05)

    const mesh = packetsRef.current
    if (!mesh) return
    packets.forEach((p, i) => {
      p.t += delta * p.speed
      if (p.t >= 1) {
        // packet arrived: hop onto a random edge leaving the destination node
        const [a, b] = edges[p.edge]
        const at = p.forward ? b : a
        const next = edges
          .map((e, idx) => ({ e, idx }))
          .filter(({ e }) => e[0] === at || e[1] === at)
        const pick = next[Math.floor(Math.random() * next.length)]
        p.edge = pick.idx
        p.forward = pick.e[0] === at
        p.t = 0
      }
      const [a, b] = edges[p.edge]
      const from = p.forward ? nodes[a] : nodes[b]
      const to = p.forward ? nodes[b] : nodes[a]
      tmp.lerpVectors(from, to, p.t)
      dummy.position.copy(tmp)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#cfe8d8" transparent opacity={0.14} />
      </lineSegments>

      {nodes.map((n, i) => {
        const hub = hubs.has(i)
        return (
          <group key={i} position={n}>
            <mesh>
              <sphereGeometry args={[hub ? 0.11 : 0.05, 16, 16]} />
              <meshBasicMaterial color={hub ? '#3dff8b' : '#cfe8d8'} toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[hub ? 0.32 : 0.16, 16, 16]} />
              <meshBasicMaterial
                color={hub ? '#3dff8b' : '#cfe8d8'}
                transparent
                opacity={hub ? 0.06 : 0.04}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        )
      })}

      <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKET_COUNT]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#3dff8b" toneMapped={false} />
      </instancedMesh>

      {/* faint outer shell */}
      <mesh>
        <icosahedronGeometry args={[RADIUS * 1.25, 2]} />
        <meshBasicMaterial color="#cfe8d8" wireframe transparent opacity={0.03} />
      </mesh>
    </group>
  )
}

export default function NetworkScene() {
  const wrap = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(true)

  // full strength on the hero, gone once you start reading (and it stops rendering then)
  useEffect(() => {
    const onScroll = () => {
      const t = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
      if (wrap.current) wrap.current.style.opacity = String(1 - t)
      setLive(t < 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? 'demand' : live ? 'always' : 'never'}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        eventSource={document.getElementById('root')!}
        eventPrefix="client"
      >
        <fog attach="fog" args={['#050806', 7, 15]} />
        <Network />
      </Canvas>
      {/* vignette so text stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050806_85%)]" />
    </div>
  )
}
