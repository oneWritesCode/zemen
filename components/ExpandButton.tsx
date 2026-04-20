import { motion } from "framer-motion";

export const ExpandButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '32px',
      height: '32px',
      background: '#0d0d0d',
      border: '1px solid #141414',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#444',
      zIndex: 10,
      transition: 'all 0.2s'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = '#111'
      e.currentTarget.style.color = '#fff'
      e.currentTarget.style.borderColor = '#1e1e1e'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = '#0d0d0d'
      e.currentTarget.style.color = '#444'
      e.currentTarget.style.borderColor = '#141414'
    }}
    title="Expand chart"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
    </svg>
  </motion.button>
);
