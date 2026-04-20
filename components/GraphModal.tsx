'use client'

import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ChartRow } from '@/lib/fred/get-topic-dataset'

interface GraphModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  chart: React.ReactNode
  currentValue?: string | null
  change?: string | null
  topicSlug?: string
  chartRows?: ChartRow[]
  intelligenceData: {
    whatYouSee: string
    unit: string
    normalRange: string
    currentReading: string
    whenHigh: string[]
    whenLow: string[]
    keyFactors: Array<{
      name: string
      direction: string
      explanation: string
    }>
    historicalEvents: Array<{
      year: string
      event: string
      impact: string
    }>
  }
}

const RangeButton = ({ label, active }: { label: string; active?: boolean }) => (
  <button
    style={{
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
      color: active ? '#fff' : '#999',
      border: active ? '1px solid #333' : '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    {label}
  </button>
)

const SectionLabel = ({ children, color = '#999' }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontSize: '10px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: color,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}
  >
    {children}
  </div>
)

export const GraphModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  chart,
  currentValue,
  change,
  intelligenceData,
}: GraphModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    // CRITICAL: prevent body scroll
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  // Portal renders directly into body
  // This escapes sidebar layout completely
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <ModalContent
          onClose={onClose}
          title={title}
          subtitle={subtitle}
          chart={chart}
          currentValue={currentValue}
          change={change}
          intelligenceData={intelligenceData}
        />
      )}
    </AnimatePresence>,
    document.body
  )
}

const ModalContent = ({
  onClose,
  title,
  subtitle,
  chart,
  currentValue,
  change,
  intelligenceData,
}: Omit<GraphModalProps, 'isOpen' | 'topicSlug' | 'chartRows'>) => {
  return (
    <>
      {/* BACKDROP - covers everything */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          zIndex: 99998,
        }}
      />

      {/* MODAL PANEL - covers full screen */}
      <motion.div
        key="modal"
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 16,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.97,
          y: 8,
        }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#080808',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── TOP BAR ── */}
        <div
          style={{
            height: '64px',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            borderBottom: '1px solid #151515',
            background: '#0a0a0a',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {/* Left: title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <div
              style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#fff',
                letterSpacing: '-0.2px',
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: '11px',
                  color: '#999',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Center: current value */}
          {currentValue && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {currentValue}
                </div>
                {change && (
                  <div
                    style={{
                      fontSize: '11px',
                      marginTop: '4px',
                      color: change.startsWith('+') ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {change} vs 1yr ago
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right: ESC hint + close */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: '#888',
                letterSpacing: '0.5px',
                fontWeight: '600',
              }}
            >
              ESC TO CLOSE
            </span>
            <motion.button
              onClick={onClose}
              whileHover={{
                background: 'rgba(255,255,255,0.08)',
                borderColor: '#333',
                color: '#fff',
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #1e1e1e',
                background: 'transparent',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                transition: 'all 0.2s',
              }}
            >
              ✕
            </motion.button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gridTemplateRows: '1fr',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {/* ══ LEFT COLUMN ══ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #111',
              overflow: 'hidden',
            }}
          >
            {/* Chart section - top of left */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.4,
                ease: 'easeOut',
              }}
              style={{
                padding: '32px 32px 0',
                flexShrink: 0,
              }}
            >
              {/* Time range pills */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                {['3M', '6M', '1Y', '3Y', '5Y', 'ALL'].map((range) => (
                  <RangeButton key={range} label={range} active={range === '5Y'} />
                ))}
              </div>

              {/* Chart container */}
              <div
                style={{
                  background: '#0d0d0d',
                  borderRadius: '12px',
                  border: '1px solid #141414',
                  overflow: 'hidden',
                  padding: '24px',
                }}
              >
                {chart}
              </div>
            </motion.div>

            {/* Lower left: phrases + bullets + history */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.4,
              }}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '32px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                alignContent: 'start',
              }}
            >
              {/* What you see - full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <SectionLabel>What this graph shows</SectionLabel>
                <div
                  style={{
                    background: '#0d0d0d',
                    border: '1px solid #141414',
                    borderRadius: '12px',
                    padding: '20px',
                    fontSize: '14px',
                    color: '#bbb',
                    lineHeight: '1.8',
                  }}
                >
                  <strong style={{ color: '#eee' }}>In plain English: </strong>
                  {intelligenceData.whatYouSee}
                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #161616',
                      color: '#999',
                      fontSize: '13px',
                    }}
                  >
                    <strong style={{ color: '#aaa' }}>The unit: </strong>
                    {intelligenceData.unit}
                  </div>
                </div>
              </div>

              {/* When HIGH */}
              <div>
                <SectionLabel color="#22c55e">↑ When high it means</SectionLabel>
                <div
                  style={{
                    background: '#060f06',
                    border: '1px solid #0d1f0d',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {intelligenceData.whenHigh.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        fontSize: '13px',
                        color: '#bbb',
                        lineHeight: '1.6',
                      }}
                    >
                      <span
                        style={{
                          color: '#1a3d1a',
                          marginTop: '3px',
                          flexShrink: 0,
                          fontSize: '8px',
                        }}
                      >
                        ●
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* When LOW */}
              <div>
                <SectionLabel color="#ef4444">↓ When low it means</SectionLabel>
                <div
                  style={{
                    background: '#0f0606',
                    border: '1px solid #1f0d0d',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {intelligenceData.whenLow.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        fontSize: '13px',
                        color: '#bbb',
                        lineHeight: '1.6',
                      }}
                    >
                      <span
                        style={{
                          color: '#3d1a1a',
                          marginTop: '3px',
                          flexShrink: 0,
                          fontSize: '8px',
                        }}
                      >
                        ●
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical events table */}
              <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                <SectionLabel>Key historical events</SectionLabel>
                <div
                  style={{
                    background: '#0d0d0d',
                    border: '1px solid #141414',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Table header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 1fr',
                      padding: '12px 20px',
                      borderBottom: '1px solid #141414',
                      background: '#0a0a0a',
                    }}
                  >
                    {['Year', 'Event', 'Impact'].map((h) => (
                      <div
                        key={h}
                        style={{
                          fontSize: '10px',
                          color: '#999',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          fontWeight: '700',
                        }}
                      >
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Table rows */}
                  {intelligenceData.historicalEvents.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.3 + i * 0.06,
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr 1fr',
                        padding: '16px 20px',
                        borderBottom:
                          i < intelligenceData.historicalEvents.length - 1
                            ? '1px solid #0f0f0f'
                            : 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#999' }}>
                        {event.year}
                      </div>
                      <div style={{ fontSize: '13px', color: '#ccc', paddingRight: '16px' }}>
                        {event.event}
                      </div>
                      <div style={{ fontSize: '13px', color: '#bbb' }}>{event.impact}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.4,
              ease: 'easeOut',
            }}
            style={{
              overflowY: 'auto',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              background: '#060606',
            }}
          >
            {/* Current reading */}
            <div>
              <SectionLabel>Right now</SectionLabel>
              <div
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #141414',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.7' }}>
                  {intelligenceData.currentReading}
                </div>
              </div>
            </div>

            {/* Health range bar */}
            <div>
              <SectionLabel>Health range</SectionLabel>
              <div
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #141414',
                  borderRadius: '12px',
                  padding: '24px 20px',
                }}
              >
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(
                      to right,
                      #ef4444 0%,
                      #f97316 25%,
                      #22c55e 40%,
                      #22c55e 60%,
                      #f97316 75%,
                      #ef4444 100%
                    )`,
                    marginBottom: '16px',
                    position: 'relative',
                  }}
                >
                  {/* Marker dot */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '55%',
                      width: '20px',
                      height: '20px',
                      background: '#fff',
                      borderRadius: '50%',
                      border: '4px solid #000',
                      transform: 'translateX(-50%)',
                      boxShadow: '0 0 10px rgba(255,255,255,0.4)',
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.6' }}>
                  {intelligenceData.normalRange}
                </div>
              </div>
            </div>

            {/* Key factors */}
            <div>
              <SectionLabel>What moves this number</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {intelligenceData.keyFactors.map((factor, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#0d0d0d',
                      border: '1px solid #141414',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#ccc' }}>
                        {factor.name}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          color: factor.direction === 'UP' ? '#22c55e' : '#ef4444',
                          background: factor.direction === 'UP' ? '#060f06' : '#0f0606',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${factor.direction === 'UP' ? '#0d1f0d' : '#1f0d0d'}`,
                        }}
                      >
                        {factor.direction}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#bbb', lineHeight: '1.6' }}>
                      {factor.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
