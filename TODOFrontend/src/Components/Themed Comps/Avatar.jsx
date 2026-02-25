import React from 'react'
import { useTheme } from './ThemeContext'

/**
 * Avatar — displays user initials or an image.
 * size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * variant: 'circle' | 'rounded'
 * status: 'online' | 'away' | 'busy' | 'offline' | null
 */
export default function Avatar({
  src,
  name = '',
  size = 'md',
  variant = 'circle',
  status = null,
  style: extraStyle = {},
  onClick,
}) {
  const { theme } = useTheme()

  const sizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 52,
    xl: 68,
  }
  const px = sizes[size] || sizes.md
  const fontSize = Math.round(px * 0.36)

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  // Generate a stable hue from the name string
  const hue =
    name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360

  const avatarStyle = {
    width: px,
    height: px,
    borderRadius: variant === 'circle' ? '50%' : Math.round(px * 0.22),
    background: src ? 'transparent' : `hsl(${hue},55%,${theme.name === 'dark' ? 40 : 55}%)`,
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    fontWeight: 600,
    fontFamily: 'inherit',
    overflow: 'hidden',
    flexShrink: 0,
    userSelect: 'none',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    border: `2px solid ${theme.border}`,
    ...extraStyle,
  }

  const statusColors = {
    online: theme.success,
    away: theme.warning,
    busy: theme.danger,
    offline: theme.textMuted,
  }

  const indicatorSize = Math.max(8, Math.round(px * 0.22))

  const indicatorStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: indicatorSize,
    height: indicatorSize,
    borderRadius: '50%',
    background: statusColors[status] || theme.textMuted,
    border: `2px solid ${theme.surface}`,
  }

  return (
    <div style={avatarStyle} onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <span>{initials || '?'}</span>
      )}
      {status && <span style={indicatorStyle} />}
    </div>
  )
}
