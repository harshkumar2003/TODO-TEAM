import React, { useState } from 'react'
import { useTheme } from './ThemeContext'

/**
 * Input — type: 'text' | 'email' | 'password' | 'search' | 'textarea'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Input({
  label,
  type = 'text',
  size = 'md',
  placeholder = '',
  value,
  onChange,
  error,
  hint,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  rows = 4,
  fullWidth = true,
  style: extraStyle = {},
  id,
  ...rest
}) {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)

  const sizes = {
    sm: { padding: '7px 10px', fontSize: 13, borderRadius: 6 },
    md: { padding: '10px 13px', fontSize: 14, borderRadius: 8 },
    lg: { padding: '13px 16px', fontSize: 16, borderRadius: 10 },
  }
  const sz = sizes[size] || sizes.md

  const borderColor = error
    ? theme.danger
    : focused
    ? theme.borderFocus
    : theme.border

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    width: fullWidth ? '100%' : undefined,
  }

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: theme.textSecondary,
  }

  const fieldWrapStyle = {
    display: 'flex',
    alignItems: type === 'textarea' ? 'flex-start' : 'center',
    background: theme.surface,
    border: `1.5px solid ${borderColor}`,
    borderRadius: sz.borderRadius,
    transition: 'border-color 0.18s',
    opacity: disabled ? 0.55 : 1,
  }

  const iconStyle = {
    padding: '0 10px',
    color: theme.textSecondary,
    display: 'flex',
    alignItems: 'center',
  }

  const inputStyle = {
    flex: 1,
    padding: sz.padding,
    fontSize: sz.fontSize,
    color: theme.text,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    resize: type === 'textarea' ? 'vertical' : undefined,
    minHeight: type === 'textarea' ? rows * 24 : undefined,
    ...extraStyle,
  }

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div style={wrapperStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
        </label>
      )}
      <div style={fieldWrapStyle}>
        {leftIcon && <span style={iconStyle}>{leftIcon}</span>}
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            style={inputStyle}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            style={inputStyle}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
        )}
        {rightIcon && <span style={iconStyle}>{rightIcon}</span>}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: theme.danger }}>{error}</span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 12, color: theme.textSecondary }}>{hint}</span>
      )}
    </div>
  )
}
