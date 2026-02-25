import React, { useState } from 'react'
import { useTheme } from './ThemeContext'

/**
 * Button — variant: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
 * size:    'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  loading = false,
  onClick,
  type = 'button',
  style: extraStyle = {},
  ...rest
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)

  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13, borderRadius: 6, gap: 6 },
    md: { padding: '9px 20px', fontSize: 14, borderRadius: 8, gap: 8 },
    lg: { padding: '12px 28px', fontSize: 16, borderRadius: 10, gap: 10 },
  }
  const sz = sizes[size] || sizes.md

  const variants = {
    primary: {
      background: hovered ? theme.primaryHover : theme.primary,
      color: theme.primaryText,
      border: 'none',
    },
    secondary: {
      background: hovered ? theme.surfaceHover : theme.surface,
      color: theme.text,
      border: `1px solid ${theme.border}`,
    },
    danger: {
      background: hovered ? theme.dangerHover : theme.danger,
      color: '#fff',
      border: 'none',
    },
    success: {
      background: hovered ? theme.successHover : theme.success,
      color: '#fff',
      border: 'none',
    },
    ghost: {
      background: hovered ? theme.surfaceHover : 'transparent',
      color: theme.text,
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: theme.primary,
      border: `1.5px solid ${theme.primary}`,
      ...(hovered && { background: theme.primary + '18' }),
    },
  }
  const v = variants[variant] || variants.primary

  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sz.gap,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontWeight: 500,
    fontFamily: 'inherit',
    borderRadius: sz.borderRadius,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 0.18s, opacity 0.18s, border-color 0.18s',
    width: fullWidth ? '100%' : undefined,
    userSelect: 'none',
    outline: 'none',
    ...v,
    ...extraStyle,
  }

  return (
    <button
      type={type}
      style={btnStyle}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {loading ? (
        <span style={spinnerStyle} />
      ) : (
        <>
          {leftIcon && <span style={{ display: 'flex' }}>{leftIcon}</span>}
          {children}
          {rightIcon && <span style={{ display: 'flex' }}>{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

const spinnerStyle = {
  width: 16,
  height: 16,
  border: '2px solid rgba(255,255,255,0.3)',
  borderTopColor: '#fff',
  borderRadius: '50%',
  animation: 'todo-spin 0.7s linear infinite',
}
