'use client' 
import { motion, AnimatePresence } from 'framer-motion' 
import { useEffect, useState } from 'react' 

const LOADING_PHRASES = [ 
  'Connecting to FRED...', 
  'Loading economic data...', 
  'Detecting market regime...', 
  'Calibrating indicators...', 
  'Almost ready...' 
] 

const LETTERS = 'ZEMEN'.split('') 

export const LoadingScreen = ({ 
  onComplete 
}: { 
  onComplete: () => void 
}) => { 
  const [stage, setStage] = useState<
    'logo' | 'loading' | 'exit' 
  >('logo') 
  const [phraseIndex, setPhraseIndex] = 
    useState(0) 
  const [progress, setProgress] = useState(0) 
  const [visible, setVisible] = useState(true) 

  useEffect(() => { 
    // Stage 1 → Stage 2 
    const t1 = setTimeout(() => { 
      setStage('loading') 
    }, 800) 

    // Progress bar fill 
    const t2 = setTimeout(() => { 
      const interval = setInterval(() => { 
        setProgress(p => { 
          if (p >= 100) { 
            clearInterval(interval) 
            return 100 
          } 
          return p + 2 
        }) 
      }, 20) 
    }, 900) 

    // Phrase cycling 
    const phraseInterval = setInterval(() => { 
      setPhraseIndex(i => 
        (i + 1) % LOADING_PHRASES.length 
      ) 
    }, 300) 

    // Stage 3: Exit 
    const t3 = setTimeout(() => { 
      setStage('exit') 
      setTimeout(() => { 
        setVisible(false) 
        onComplete() 
      }, 600) 
    }, 1900) 

    return () => { 
      clearTimeout(t1) 
      clearTimeout(t2) 
      clearTimeout(t3) 
      clearInterval(phraseInterval) 
    } 
  }, [onComplete]) 

  if (!visible) return null 

  return ( 
    <AnimatePresence> 
      <motion.div 
        key="loading-screen" 
        initial={{ y: 0 }} 
        animate={{ 
          y: stage === 'exit' ? '-100%' : 0 
        }} 
        transition={{ 
          duration: 0.6, 
          ease: [0.76, 0, 0.24, 1] 
        }} 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          background: '#000000', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '32px' 
        }} 
      > 
        {/* Logo letters */} 
        <motion.div 
          style={{ 
            display: 'flex', 
            gap: '4px', 
            alignItems: 'center' 
          }} 
          animate={{ 
            opacity: stage === 'exit' ? 0 : 1, 
            y: stage === 'exit' ? -20 : 0 
          }} 
          transition={{ duration: 0.4 }} 
        > 
          {LETTERS.map((letter, i) => ( 
            <motion.span 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ 
                delay: i * 0.08, 
                duration: 0.4, 
                ease: 'easeOut' 
              }} 
              style={{ 
                fontSize: '52px', 
                fontWeight: '700', 
                color: '#FFFFFF', 
                letterSpacing: '8px', 
                fontFamily: 'monospace' 
              }} 
            > 
              {letter} 
            </motion.span> 
          ))} 
        </motion.div> 

        {/* Subtitle */} 
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.4 }} 
          transition={{ delay: 0.6, duration: 0.4 }} 
          style={{ 
            fontSize: '11px', 
            color: '#FFFFFF', 
            letterSpacing: '4px', 
            textTransform: 'uppercase', 
            marginTop: '-20px' 
          }} 
        > 
          Macro Intelligence 
        </motion.div> 

        {/* Loading bar */} 
        {stage !== 'logo' && ( 
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '12px' 
            }} 
          > 
            {/* Bar track */} 
            <div style={{ 
              width: '200px', 
              height: '1px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '1px', 
              overflow: 'hidden' 
            }}> 
              {/* Bar fill */} 
              <motion.div 
                style={{ 
                  height: '100%', 
                  background: '#FFFFFF', 
                  borderRadius: '1px', 
                  transformOrigin: 'left' 
                }} 
                initial={{ scaleX: 0 }} 
                animate={{ 
                  scaleX: progress / 100 
                }} 
                transition={{ 
                  duration: 0.1, 
                  ease: 'linear' 
                }} 
              /> 
            </div> 

            {/* Status text */} 
            <AnimatePresence mode="wait"> 
              <motion.div 
                key={phraseIndex} 
                initial={{ opacity: 0, y: 4 }} 
                animate={{ opacity: 0.4, y: 0 }} 
                exit={{ opacity: 0, y: -4 }} 
                transition={{ duration: 0.2 }} 
                style={{ 
                  fontSize: '11px', 
                  color: '#FFFFFF', 
                  letterSpacing: '1px' 
                }} 
              > 
                {LOADING_PHRASES[phraseIndex]} 
              </motion.div> 
            </AnimatePresence> 
          </motion.div> 
        )} 
      </motion.div> 
    </AnimatePresence> 
  ) 
} 
