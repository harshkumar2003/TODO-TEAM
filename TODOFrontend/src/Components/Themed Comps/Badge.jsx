import React from 'react'
import { useTheme } from './ThemeContext'

/**
 * Badge — variant: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'default'
 * size: 'sm' | 'md' | 'lg'
 * dot: show dot indicator only (no text)
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pill = true,
  style: extraStyle = {},
}) {
  const { theme } = useTheme()

  const palettes = {
    primary: { bg: theme.primary + '22', color: theme.primary, dot: theme.primary },
    danger:  { bg: theme.danger  + '22', color: theme.danger,  dot: theme.danger  },
    success: { bg: theme.success + '22', color: theme.success, dot: theme.success },
    warning: { bg: theme.warning + '22', color: theme.warning, dot: theme.warning },
    info:    { bg: theme.info    + '22', color: theme.info,    dot: theme.info    },
    default: { bg: theme.border,         color: theme.textSecondary, dot: theme.textSecondary },
  }
  const p = palettes[variant] || palettes.default

  const sizes = {
    sm: { padding: dot ? '3px' : '2px 7px', fontSize: 11, dotSize: 6 },
    md: { padding: dot ? '4px' : '3px 10px', fontSize: 12, dotSize: 8 },
    lg: { padding: dot ? '5px' : '4px 13px', fontSize: 13, dotSize: 10 },
  }
  const sz = sizes[size] || sizes.md

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontWeight: 600,
    letterSpacing: 0.3,
    borderRadius: pill ? 999 : 4,
    background: p.bg,
    color: p.color,
    userSelect: 'none',
    ...extraStyle,
  }

  const dotStyle = {
    width: sz.dotSize,
    height: sz.dotSize,
    borderRadius: '50%',
    background: p.dot,
    flexShrink: 0,
  }

  if (dot) return <span style={{ ...badgeStyle, padding: sz.padding }}><span style={dotStyle} /></span>

  return (
    <span style={badgeStyle}>
      {children}
    </span>
  )
}
