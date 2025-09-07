"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import Loader from "./components/Loader"
import Countdown from "./components/Countdown"
import Celebration from "./components/Celebration"
import HappyBirthday from "./components/HappyBirthday"
import PhotoGallery from "./components/PhotoGallery"
import Letter from "./components/Letter"

export default function BirthdayApp() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [musicStarted, setMusicStarted] = useState(false)

  const birthdayDate = new Date("2025-07-16T00:00:00")
  const [isBirthdayOver, setIsBirthdayOver] = useState(new Date().getTime() >= birthdayDate.getTime())

  const audioRef = useRef(null)

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  // Auto play music when Celebration screen is active
  useEffect(() => {
    if (currentScreen === 0 && !isBirthdayOver) return

    if (currentScreen === 1 && audioRef.current && !musicStarted) {
      audioRef.current.play().catch(() => {
        // Auto-play may fail on some browsers; user interaction may be needed
        console.warn("Autoplay failed, click somewhere to start music.")
      })
      setMusicStarted(true)
    }
  }, [currentScreen, musicStarted, isBirthdayOver])

  const screens = [
    !isBirthdayOver
      ? <Countdown key="countdown" birthdayDate={birthdayDate} onComplete={() => setIsBirthdayOver(true)} />
      : <Celebration key="celebration" onNext={() => setCurrentScreen(1)} />,
    <HappyBirthday key="happy" onNext={() => setCurrentScreen(2)} />,
    <PhotoGallery key="gallery" onNext={() => setCurrentScreen(3)} />,
    <Letter key="letter" />,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/30 via-black to-purple-950/30 overflow-hidden relative">

      {/* Audio */}
      <audio ref={audioRef} src="/music/birthday-song.mp3" loop />

      {/* Radial background gradients */}
      <div className="fixed inset-0 z-0 blur-[120px] opacity-20 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 20% 25%, rgba(255, 99, 165, 0.6), transparent 40%)",
      }} />
      <div className="fixed inset-0 z-0 blur-[120px] opacity-20 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.6), transparent 40%)",
      }} />
      <div className="fixed inset-0 z-0 blur-[160px] opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(228, 193, 255, 0.4), transparent 40%)",
      }} />

      <AnimatePresence mode="wait">
        {isLoading
          ? <Loader key="loader" />
          : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                {screens[currentScreen]}
              </motion.div>
            </AnimatePresence>
          )
        }
      </AnimatePresence>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light"
      >
        @HBDShalu
      </motion.div>
    </div>
  )
}
