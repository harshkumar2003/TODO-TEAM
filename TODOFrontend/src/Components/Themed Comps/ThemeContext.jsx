import React, { createContext, useContext, useState, useEffect } from 'react'

// ─── Colour tokens ───────────────────────────────────────────────────────────
export const themes = {
  dark: {
    name: 'dark',
    background: '#121212',
    surface: '#1e1e1e',
    surfaceHover: '#2a2a2a',
    surfaceElevated: '#252525',
    border: '#333333',
    borderFocus: '#7c6af7',
    text: '#e0e0e0',
    textSecondary: '#9e9e9e',
    textMuted: '#616161',
    primary: '#7c6af7',
    primaryHover: '#9585f9',
    primaryText: '#ffffff',
    danger: '#ef5350',
    dangerHover: '#f44336',
    success: '#66bb6a',
    successHover: '#4caf50',
    warning: '#ffa726',
    warningHover: '#ff9800',
    info: '#29b6f6',
    shadow: '0 4px 24px rgba(0,0,0,0.5)',
    shadowSm: '0 2px 8px rgba(0,0,0,0.4)',
    modalOverlay: 'rgba(0,0,0,0.7)',
    scrollbar: '#333333',
    scrollbarThumb: '#555555',
  },
  light: {
    name: 'light',
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceHover: '#f0f0f0',
    surfaceElevated: '#fafafa',
    border: '#e0e0e0',
    borderFocus: '#5c4de5',
    text: '#212121',
    textSecondary: '#757575',
    textMuted: '#bdbdbd',
    primary: '#5c4de5',
    primaryHover: '#4a3bc3',
    primaryText: '#ffffff',
    danger: '#e53935',
    dangerHover: '#c62828',
    success: '#43a047',
    successHover: '#2e7d32',
    warning: '#fb8c00',
    warningHover: '#e65100',
    info: '#0288d1',
    shadow: '0 4px 24px rgba(0,0,0,0.08)',
    shadowSm: '0 2px 8px rgba(0,0,0,0.06)',
    modalOverlay: 'rgba(0,0,0,0.4)',
    scrollbar: '#e0e0e0',
    scrollbarThumb: '#bdbdbd',
  },
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ children, defaultTheme = 'dark' }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('todo-theme') || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    try {
      localStorage.setItem('todo-theme', mode)
    } catch {
      // ignore
    }
  }, [mode])

  const toggleTheme = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'))
  const setTheme = (value) => setMode(value === 'dark' ? 'dark' : 'light')
  const theme = themes[mode] ?? themes.dark

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

export default ThemeContext
