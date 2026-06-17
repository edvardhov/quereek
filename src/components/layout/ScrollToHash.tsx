import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }

    const id = decodeURIComponent(hash.slice(1))

    // The target may not be mounted on the first frame after a route change,
    // so retry across a few frames until it exists.
    let frames = 0
    let raf = 0

    const scroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (frames++ < 20) {
        raf = requestAnimationFrame(scroll)
      }
    }

    raf = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}
