'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { Limelight } from 'next/font/google'

const limelight = Limelight({ 
  weight: ['400'], 
  subsets: ['latin'] 
})

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const outlinePointsRef = useRef<{ x: number; y: number }[] | null>(null)
  const outlineBuiltRef = useRef(false)

  // Customize this text to change what appears instead of "AWS"
  const customText = "talkAI"
  
  // Add click handler for the talkAI text
  const handleTalkAIClick = () => {
    window.location.href = '/landing'
  }

  // Load the background image with timeout and error handling
  useEffect(() => {
    const img = new Image()
    let timeoutId: NodeJS.Timeout
    
    const handleImageLoad = () => {
      console.log('Image loaded successfully:', img.width, 'x', img.height)
      setImageLoaded(true)
      setImageError(false)
      imageRef.current = img
      clearTimeout(timeoutId)
    }
    
    const handleImageError = () => {
      console.error('Failed to load image')
      setImageError(true)
      setImageLoaded(false)
      clearTimeout(timeoutId)
    }
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.warn('Image loading timeout, proceeding without image')
      setImageError(true)
      setImageLoaded(false)
    }, 10000) // 10 second timeout
    
    img.onload = handleImageLoad
    img.onerror = handleImageError
    img.src = '/full_brain.png' // This will use the image in your public folder
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    console.log('Setting isClient to true')
    setIsClient(true)
  }, [])

  // Add a fallback to ensure isClient gets set
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isClient) {
        setIsClient(true)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [isClient])

  useEffect(() => {
    if (!isClient) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768) // Set mobile breakpoint
    }

    // Compute a responsive text height that fits smaller viewports
    const computeTextHeight = () => {
      // ~12% of viewport width, clamped
      return Math.min(120, Math.max(36, Math.floor(canvas.width * 0.12)))
    }
    const getTextBottomOffset = () => (isMobile ? 90 : 30)

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
      isCustomText: boolean
    }[] = []

    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = 'white'
      ctx.save()
      
      const logoHeight = computeTextHeight()
      const vercelLogoWidth = logoHeight * (40 / 19.7762) // Maintain aspect ratio
      
      // Calculate width for custom text
      //ctx.font = `bold ${logoHeight}px Arial, sans-serif`
      ctx.font = `bold ${logoHeight}px Limelight, sans-serif`
      const customTextWidth = ctx.measureText(customText).width
      
      // Position the text above the social icons with proper spacing
      const totalWidth = customTextWidth
      
      ctx.translate(
        canvas.width / 2 - totalWidth / 2 - 20,
        canvas.height - logoHeight - getTextBottomOffset()
      )

      // Draw Vercel logo - COMMENTED OUT TO REMOVE "v0" TEXT
      /*
      ctx.save()
      const vercelScale = logoHeight / 19.7762
      ctx.scale(vercelScale, vercelScale)
      ctx.beginPath()
      ctx.moveTo(23.3919, 0)
      ctx.lineTo(32.9188, 0)
      ctx.bezierCurveTo(36.7819, 0, 39.9136, 3.13165, 39.9136, 6.99475)
      ctx.lineTo(39.9136, 16.0805)
      ctx.lineTo(36.0006, 16.0805)
      ctx.lineTo(36.0006, 6.99475)
      ctx.bezierCurveTo(36.0006, 6.90167, 35.9969, 6.80925, 35.9898, 6.71766)
      ctx.lineTo(26.4628, 16.079)
      ctx.bezierCurveTo(26.4949, 16.08, 26.5272, 16.0805, 26.5595, 16.0805)
      ctx.lineTo(36.0006, 16.0805)
      ctx.lineTo(36.0006, 19.7762)
      ctx.lineTo(26.5595, 19.7762)
      ctx.bezierCurveTo(22.6964, 19.7762, 19.4788, 16.6139, 19.4788, 12.7508)
      ctx.lineTo(19.4788, 3.68923)
      ctx.lineTo(23.3919, 3.68923)
      ctx.lineTo(23.3919, 12.7508)
      ctx.bezierCurveTo(23.3919, 12.9253, 23.4054, 13.0977, 23.4316, 13.2668)
      ctx.lineTo(33.1682, 3.6995)
      ctx.bezierCurveTo(33.0861, 3.6927, 33.003, 3.68923, 32.9188, 3.68923)
      ctx.lineTo(23.3919, 3.68923)
      ctx.lineTo(23.3919, 0)
      ctx.closePath()

      ctx.moveTo(13.7688, 19.0956)
      ctx.lineTo(0, 3.68759)
      ctx.lineTo(5.53933, 3.68759)
      ctx.lineTo(13.6231, 12.7337)
      ctx.lineTo(13.6231, 3.68759)
      ctx.lineTo(17.7535, 3.68759)
      ctx.lineTo(17.7535, 17.5746)
      ctx.bezierCurveTo(17.7535, 19.6705, 15.1654, 20.6584, 13.7688, 19.0956)
      ctx.closePath()

      ctx.fill()
      ctx.restore()
      */

      // Draw custom text instead of AWS logo
      ctx.save()
      
      // No need to translate since we're already centered
      ctx.font = `bold ${logoHeight}px ${limelight.style.fontFamily}`
      ctx.fillStyle = 'white'
      ctx.fillText(customText, 0, 0)
      
      // Add underline to show it's clickable
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      const textMetrics = ctx.measureText(customText)
      ctx.beginPath()
      ctx.moveTo(0, 5)
      ctx.lineTo(textMetrics.width, 5)
      ctx.stroke()
      
      ctx.restore()

      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return 1 // Since we removed vercelScale
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data
      const particleGap = 2
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvasWidth)
        const y = Math.floor(Math.random() * canvasHeight)

        if (data[(y * canvasWidth + x) * 4 + 3] > 128) {
          const logoHeight = computeTextHeight()
          const vercelLogoWidth = logoHeight * (40 / 19.7762)
          
          // Calculate width for custom text
          ctx.font = `bold ${logoHeight}px Limelight, sans-serif`
          const customTextWidth = ctx.measureText(customText).width
          
          // Calculate total width for centered text
          const totalWidth = customTextWidth
          const centerX = canvasWidth / 2
          const centerY = canvasHeight / 2
          const isCustomTextLogo = x >= centerX - totalWidth / 2 && x <= centerX + totalWidth / 2
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1 + .59,
            color: 'white', 
            scatteredColor: isCustomTextLogo ? '#4ECDC4' : '#00DCFF', 
            isCustomText: isCustomTextLogo,
            life: Math.random() * 100 + 50
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      if (!canvas) return
      const baseParticleCount = 6000 // Increased base count for higher density
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw background image and animate a tracer along the outline
      if (imageLoaded && imageRef.current && !imageError) {
        // size/position
        const logoHeight = computeTextHeight()
        const imgW = imageRef.current.width
        const imgH = imageRef.current.height
        const s = (logoHeight / imgH) * 4
        const w = imgW * s, h = imgH * s
        const x = (canvas.width - w) / 2, y = (canvas.height - h) / 2
        const cx = x + w / 2, cy = y + h / 2

        // Build outline points once
        if (!outlineBuiltRef.current) {
          const off = document.createElement('canvas')
          off.width = Math.max(1, Math.floor(w))
          off.height = Math.max(1, Math.floor(h))
          const octx = off.getContext('2d')
          if (octx) {
            octx.clearRect(0, 0, off.width, off.height)
            octx.drawImage(imageRef.current, 0, 0, off.width, off.height)
            const { data, width, height } = octx.getImageData(0, 0, off.width, off.height)
            const pts: { x: number; y: number }[] = []
            const A = (ix: number, iy: number) => data[(iy * width + ix) * 4 + 3] // alpha

            // sample with stride for perf
            const stride = 2
            for (let iy = 1; iy < height - 1; iy += stride) {
              for (let ix = 1; ix < width - 1; ix += stride) {
                const a = A(ix, iy)
                if (a > 24) {
                  // edge if any 4-neighbor alpha is low
                  if (A(ix - 1, iy) <= 24 || A(ix + 1, iy) <= 24 || A(ix, iy - 1) <= 24 || A(ix, iy + 1) <= 24) {
                    pts.push({ x: x + ix, y: y + iy })
                  }
                }
              }
            }

            // sort by angle around centroid for a continuous loop
            if (pts.length) {
              let sx = 0, sy = 0
              for (const p of pts) { sx += p.x; sy += p.y }
              const mx = sx / pts.length, my = sy / pts.length
              pts.sort((p1, p2) => Math.atan2(p1.y - my, p1.x - mx) - Math.atan2(p2.y - my, p2.x - mx))
              outlinePointsRef.current = pts
            }
          }
          outlineBuiltRef.current = true
        }

        // draw the image first
        ctx.globalAlpha = 1.0
        ctx.filter = 'none'
        ctx.drawImage(imageRef.current, x, y, w, h)

        // draw static faint outline
        const pts = outlinePointsRef.current
        if (pts && pts.length > 1) {
          ctx.save()
          ctx.globalAlpha = 0.15
          ctx.strokeStyle = 'rgba(78,205,196,0.25)'
          ctx.lineWidth = 20
          ctx.shadowColor = 'rgba(78,205,196,0.8)'
          ctx.shadowBlur = 3
          ctx.beginPath()
          ctx.moveTo(pts[0].x, pts[0].y)
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
          ctx.closePath()
          ctx.stroke()
          ctx.restore()

          // Enhanced slim glowing tracer along the outline
          const t = performance.now() / 1000
          const speedPtsPerSec = 25 // Slower for more visible effect
          const segLen = 80 // Shorter segment for more focused glow
          const N = pts.length
          const start = Math.floor((t * speedPtsPerSec) % N)

          // Main glowing tracer
          ctx.save()
          ctx.globalAlpha = 0.9
          ctx.strokeStyle = 'rgba(78,205,196,1)'
          ctx.lineWidth = 4.5
          ctx.shadowColor = 'rgba(78,205,196,1)'
          ctx.shadowBlur = 16
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          ctx.beginPath()
          for (let k = 0; k < segLen; k++) {
            const idx = (start + k) % N
            const p = pts[idx]
            if (k === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          }
          ctx.stroke()
          ctx.restore()

          // Secondary inner glow for extra effect
          ctx.save()
          ctx.globalAlpha = 0.6
          ctx.strokeStyle = 'rgba(255,255,255,0.8)'
          ctx.lineWidth = 2
          ctx.shadowColor = 'rgba(78,205,196,0.8)'
          ctx.shadowBlur = 10

          ctx.beginPath()
          for (let k = 0; k < segLen; k++) {
            const idx = (start + k) % N
            const p = pts[idx]
            if (k === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          }
          ctx.stroke()
          ctx.restore()
        }
      }

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 240

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
          
          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx.shadowColor = 'white'
          ctx.shadowBlur = 8
          ctx.fillStyle = 'white' 
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = 7000
      const targetParticleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createTextImage()
      particles = []
      createInitialParticles(newScale)
      // Rebuild the brain outline so tracer aligns after resize
      outlinePointsRef.current = null
      outlineBuiltRef.current = false
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
      
      // Update cursor based on hover position
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      let isOverClickableArea = false
      
      // Check if mouse is over brain image area
      if (imageLoaded && imageRef.current) {
        const logoHeight = computeTextHeight()
        const imgW = imageRef.current.width
        const imgH = imageRef.current.height
        const s = (logoHeight / imgH) * 4
        const w = imgW * s, h = imgH * s
        const imgX = (canvas.width - w) / 2, imgY = (canvas.height - h) / 2
        
        if (x >= imgX && x <= imgX + w && y >= imgY && y <= imgY + h) {
          isOverClickableArea = true
        }
      }
      
      // Check if mouse is over talkAI text area
      if (!isOverClickableArea) {
        const logoHeight = computeTextHeight()
        const customTextWidth = ctx.measureText(customText).width
        const totalWidth = customTextWidth
        const centerX = canvas.width / 2
        const textAreaX = centerX - totalWidth / 2
        const textAreaY = canvas.height - logoHeight - getTextBottomOffset() + 3
        
        if (x >= textAreaX && x <= textAreaX + totalWidth && 
            y >= textAreaY && y <= textAreaY + logoHeight) {
          isOverClickableArea = true
        }
      }
      
      // Update cursor style
      canvas.style.cursor = isOverClickableArea ? 'pointer' : 'default'
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }
    
    ctx.shadowBlur = 0  // Reset shadow

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)
    
    // Add click event listener for the entire brain image area and talkAI text
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Check if click is within the brain image area
      if (imageLoaded && imageRef.current) {
        const logoHeight = computeTextHeight()
        const imgW = imageRef.current.width
        const imgH = imageRef.current.height
        const s = (logoHeight / imgH) * 4
        const w = imgW * s, h = imgH * s
        const imgX = (canvas.width - w) / 2, imgY = (canvas.height - h) / 2
        
        // Check if click is within brain image bounds
        if (x >= imgX && x <= imgX + w && y >= imgY && y <= imgY + h) {
          handleTalkAIClick()
          return
        }
      }
      
      // Also check if click is within the talkAI text area (now at bottom)
      const logoHeight = computeTextHeight()
      const customTextWidth = ctx.measureText(customText).width
      
      // Calculate total width for centered text
      const totalWidth = customTextWidth
      const centerX = canvas.width / 2
      const textAreaX = centerX - totalWidth / 2
      const textAreaY = canvas.height - logoHeight - getTextBottomOffset() + 3 // Match the text position
      
      if (x >= textAreaX && x <= textAreaX + totalWidth && 
          y >= textAreaY && y <= textAreaY + logoHeight) {
        handleTalkAIClick()
      }
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('click', handleTalkAIClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isClient, isMobile, imageLoaded]) // Added imageLoaded to dependencies

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('landing-full');
      document.body.style.backgroundColor = '#000000';
      return () => {
        document.body.classList.remove('landing-full');
        document.body.style.backgroundColor = '';
      };
    }
  }, []);

  if (!isClient) {
    console.log('Rendering loading screen, isClient:', isClient)
    return (
      <div className="relative w-full h-dvh flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="relative">
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full chat-pulse shadow-[0_0_24px_rgba(0,220,255,0.35)]">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-cyan-400 via-fuchsia-500 to-cyan-400 animate-spin-slow blur-md opacity-70"></div>
            <div className="absolute inset-0 rounded-full ring-4 ring-cyan-400/30"></div>
            <div className="absolute inset-0 rounded-full animate-pulse-soft shadow-[0_0_60px_10px_rgba(78,205,196,0.3)]"></div>
            <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
              <div className={`${limelight.className} relative z-10 h-full w-full flex items-center justify-center text-white text-lg md:text-xl`}>Loading...</div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes spin-slow { to { transform: rotate(360deg); } }
          @keyframes pulse-soft { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
          @keyframes chat-pulse { 
            0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.95); }
            60% { box-shadow: 0 0 0 40px rgba(59,130,246,0); }
            100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
          }
          .animate-spin-slow { animation: spin-slow 3s linear infinite; }
          .animate-pulse-soft { animation: pulse-soft 2.4s ease-in-out infinite; }
          .chat-pulse { animation: chat-pulse 2.8s ease-out infinite; }
        `}</style>
      </div>
    )
  }

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center" style={{ backgroundColor: '#000000' }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with Vercel and AWS logos"
      />
      
      {/* Social Media Icons */}
      <div className="absolute bottom-[50px] flex space-x-6 z-10">
        {/* Twitter/X */}
        <a 
          href="https://twitter.com/talkai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        
        {/* LinkedIn */}
        <a 
          href="https://www.linkedin.com/company/talkai_im" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        
        {/* GitHub - Commented out for now */}
        {/*
        <a 
          href="https://github.com/talkai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        */}
        
        {/* Discord - Commented out for now */}
        {/*
        <a 
          href="https://discord.gg/talkai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
          </svg>
        </a>
        */}
      </div>
      
      {/* Copyright Text */}
      <div className="absolute bottom-[20px] text-center z-10">
        <p className="text-gray-500 text-xs">
          © 2025 talkAI. All rights reserved.
        </p>
      </div>
      
      <div className="absolute bottom-[100px] text-center z-10">
        {/* <p className="font-mono text-gray-400 text-xs sm:text-base md:text-sm ">
          Join the{' '}
          
          <a 
            href="https://vercel.fyi/v0-reinvent"
            target="_blank"
            className="invite-link text-gray-300 hover:text-cyan-400 transition-colors duration-300"
          >
            v0 Rooftop Happy Hour
          </a>{' '}
          <span>at</span>
          <span className="transition-colors duration-300">
            {' '}aws re:invent
          </span> <br /><a href="https://v0.dev/chat/RqstUbcB?b=b_BoU5qmQ0ehp" className="text-gray-500 text-xs mt-2.5 inline-block" target="_blank">(fork this v0)</a>
        
          <style>{`
            a.invite-link:hover + span + span {
              color: #FF9900;
            }
          `}</style>
        </p> */}
      </div>
    </div>
  )
}