import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from './ThemeContext'
import Button from './Button'

/**
 * Modal — accessible dialog overlay.
 * Props:
 *   open         — boolean
 *   onClose      — () => void
 *   title        — string
 *   size         — 'sm' | 'md' | 'lg' | 'full'
 *   showClose    — boolean (default true)
 *   footer       — JSX node; set to null to hide footer
 *   confirmLabel — label for the confirm button
 *   cancelLabel  — label for the cancel button
 *   onConfirm    — () => void
 *   confirmVariant — Button variant
 *   loading      — bool; disables confirm while loading
 */
export default function Modal({
  open = false,
  onClose,
  title = '',
  size = 'md',
  showClose = true,
  footer,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  loading = false,
  children,
}) {
  const { theme } = useTheme()
  const dialogRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus trap — focus dialog when opened
  useEffect(() => {
    if (open && dialogRef.current) dialogRef.current.focus()
  }, [open])

  if (!open) return null

  const sizes = {
    sm:   { maxWidth: 380 },
    md:   { maxWidth: 520 },
    lg:   { maxWidth: 780 },
    full: { maxWidth: '100%', margin: 16 },
  }
  const sz = sizes[size] || sizes.md

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: theme.modalOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
    padding: 16,
    backdropFilter: 'blur(2px)',
  }

  const dialogStyle = {
    background: theme.surface,
    borderRadius: 14,
    boxShadow: theme.shadow,
    width: '100%',
    maxWidth: sz.maxWidth,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 48px)',
    overflow: 'hidden',
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 22px',
    borderBottom: `1px solid ${theme.border}`,
    flexShrink: 0,
  }

  const titleStyle = {
    fontSize: 17,
    fontWeight: 700,
    color: theme.text,
    margin: 0,
  }

  const closeStyle = {
    background: 'transparent',
    border: 'none',
    color: theme.textSecondary,
    fontSize: 20,
    cursor: 'pointer',
    lineHeight: 1,
    padding: '2px 6px',
    borderRadius: 6,
  }

  const bodyStyle = {
    padding: '22px',
    overflowY: 'auto',
    flex: 1,
    color: theme.text,
    fontSize: 14,
    lineHeight: 1.6,
  }

  const footerStyle = {
    padding: '14px 22px',
    borderTop: `1px solid ${theme.border}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    flexShrink: 0,
  }

  const defaultFooter = (
    <div style={footerStyle}>
      {onClose && (
        <Button variant="secondary" size="md" onClick={onClose}>
          {cancelLabel}
        </Button>
      )}
      {onConfirm && (
        <Button variant={confirmVariant} size="md" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      )}
    </div>
  )

  const modal = (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
        tabIndex={-1}
        style={dialogStyle}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h2 id="modal-title" style={titleStyle}>{title}</h2>
          {showClose && (
            <button style={closeStyle} onClick={onClose} aria-label="Close dialog">✕</button>
          )}
        </div>

        {/* Body */}
        <div style={bodyStyle}>{children}</div>

        {/* Footer */}
        {footer !== null && (footer !== undefined ? <div style={footerStyle}>{footer}</div> : defaultFooter)}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
