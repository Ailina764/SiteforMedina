// Живой фон: оранжевое и голубое пятна сами блуждают по секции,
// а когда курсор проходит через пятно — оно плавно следует за курсором.
export function startGlow(host: HTMLElement): () => void {
  const section = host.parentElement
  if (!section) return () => {}
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const blobs = Array.from(host.children).map((node, index) => ({
    el: node as HTMLElement,
    x: index === 0 ? 0.15 : 0.85,
    y: index === 0 ? 0.6 : 0.45,
    following: false,
    // случайные частоты и фазы — у каждого пятна свой «характер» движения
    fx: [0.035 + Math.random() * 0.02, 0.08 + Math.random() * 0.03],
    fy: [0.03 + Math.random() * 0.02, 0.07 + Math.random() * 0.03],
    px: [Math.random() * 6.28, Math.random() * 6.28],
    py: [Math.random() * 6.28, Math.random() * 6.28],
  }))

  const wander = (blob: (typeof blobs)[number], t: number) => [
    0.5 + 0.42 * Math.sin(t * blob.fx[0] * 6.28 + blob.px[0]) + 0.1 * Math.sin(t * blob.fx[1] * 6.28 + blob.px[1]),
    0.5 + 0.34 * Math.sin(t * blob.fy[0] * 6.28 + blob.py[0]) + 0.09 * Math.sin(t * blob.fy[1] * 6.28 + blob.py[1]),
  ]
  // стартуем сразу с траектории, без рывка
  for (const blob of blobs) [blob.x, blob.y] = wander(blob, performance.now() / 1000)

  let pointer: { x: number; y: number } | null = null
  let visible = true
  let frame = 0
  let last = performance.now()

  const onMove = (event: PointerEvent) => {
    const rect = section.getBoundingClientRect()
    pointer = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height }
  }
  const onLeave = () => {
    pointer = null
    blobs.forEach((blob) => (blob.following = false))
  }

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const t = now / 1000
    const width = section.clientWidth
    const height = section.clientHeight

    for (const blob of blobs) {
      const size = blob.el.offsetWidth
      let targetX: number
      let targetY: number

      if (pointer && !blob.following) {
        const dx = (pointer.x - blob.x) * width
        const dy = (pointer.y - blob.y) * height
        if (Math.hypot(dx, dy) < size * 0.3) blob.following = true
      }

      if (blob.following && pointer) {
        targetX = pointer.x
        targetY = pointer.y
      } else {
        ;[targetX, targetY] = wander(blob, t)
      }

      const ease = 1 - Math.exp(-dt * (blob.following ? 1.8 : 0.6))
      blob.x += (targetX - blob.x) * ease
      blob.y += (targetY - blob.y) * ease
      blob.el.style.transform = `translate3d(${blob.x * width - size / 2}px, ${blob.y * height - size / 2}px, 0)`
    }

    frame = visible ? requestAnimationFrame(tick) : 0
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && !frame && !reduceMotion) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
  })

  if (reduceMotion) {
    tick(performance.now())
    cancelAnimationFrame(frame)
  } else {
    observer.observe(section)
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
  }

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    section.removeEventListener('pointermove', onMove)
    section.removeEventListener('pointerleave', onLeave)
  }
}
