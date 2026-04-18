"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, LifeBuoy, User } from "lucide-react"
import Link from "next/link"

export default function AccountNotFound() {
  const [particles, setParticles] = useState([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
      }))
    }

    setParticles(generateParticles())

    const handleResize = () => {
      setParticles(generateParticles())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const moveParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      )
    }

    const intervalId = setInterval(moveParticles, 50)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#1e2124] overflow-hidden relative">
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-[#00a896]"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: 0.6,
              transform: `translate(${(mousePos.x - particle.x) / 20}px, ${(mousePos.y - particle.y) / 20}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
        ))}
      </div>
      <main className="flex-grow flex items-start pt-6 justify-center px-4 z-10">
        <div className="max-w-md w-full text-center bg-[#2a2e32] p-8 rounded-lg shadow-2xl backdrop-blur-sm bg-opacity-80">
        <div className="mb-6 relative">
            <div className="w-24 h-24 mx-auto bg-[#00a896] rounded-full flex items-center justify-center overflow-hidden">
              <User className="text-[#1e2124] w-16 h-16" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Account Not Found</h1>
          <p className="text-gray-400 text-lg mb-8">
          We couldn't locate the account you're looking for. It may have been renamed or removed.
          </p>
          <div className="space-y-4">
            <Link 
              href="/Home" 
              className="w-full bg-[#00a896] hover:bg-[#008080] text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center font-bold"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Return to Homepage
            </Link>
            <Link 
              href="/Contact" 
              className="w-full border-2 border-[#00a896] text-[#00a896] hover:bg-[#00a896] hover:text-white py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center font-bold"
            >
              <LifeBuoy className="mr-2 h-5 w-5" /> Contact Support
            </Link>
          </div>
        </div>
      </main>
      <footer className="hidden bg-[#2a2e32] text-center py-4 text-gray-400 text-sm z-10">
        <p>© 2025 LinkerFolio. All rights reserved.</p>
      </footer>
    </div>
  )
}