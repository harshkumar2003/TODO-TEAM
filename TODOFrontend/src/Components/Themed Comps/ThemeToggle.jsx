import React from 'react'
import { useTheme } from './ThemeContext'

/** Animated pill-style dark/light toggle */
export default function ThemeToggle({ size = 'md', className = '' }) {
  const { mode, toggleTheme, theme } = useTheme()
  const isDark = mode === 'dark'

  const sizes = {
    sm: { width: 40, height: 22, knob: 16, padding: 3 },
    md: { width: 52, height: 28, knob: 20, padding: 4 },
    lg: { width: 64, height: 34, knob: 26, padding: 4 },
  }
  const s = sizes[size] || sizes.md

  const trackStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    width: s.width,
    height: s.height,
    borderRadius: s.height,
    backgroundColor: isDark ? theme.primary : '#c7c7c7',
    padding: s.padding,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    border: 'none',
    outline: 'none',
    flexShrink: 0,
  }

  const knobStyle = {
    width: s.knob,
    height: s.knob,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    transform: isDark ? `translateX(${s.width - s.knob - s.padding * 2}px)` : 'translateX(0)',
    transition: 'transform 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: s.knob * 0.55,
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  }

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={trackStyle}
      onClick={toggleTheme}
      className={className}
    >
      <span style={knobStyle}>{isDark ? '🌙' : '☀️'}</span>
    </button>
  )
}
