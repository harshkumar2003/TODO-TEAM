import React, { useState } from 'react'
import { useTheme } from '../Components/Themed Comps/ThemeContext'
import Button from '../Components/Themed Comps/Button'
import Input from '../Components/Themed Comps/Input'
import Badge from '../Components/Themed Comps/Badge'
import ThemeToggle from '../Components/Themed Comps/ThemeToggle'

/**
 * SignupScreen
 * Props:
 *   onSignup            — (name, email, password) => void | Promise
 *   onNavigateToLogin   — () => void
 */
export default function SignupScreen({ onSignup, onNavigateToLogin }) {
  const { theme } = useTheme()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [agreed, setAgreed]     = useState(false)

  // ── Password-strength helper ─────────────────────────────────────────────────
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: '', variant: 'default' }
    let score = 0
    if (pw.length >= 8)          score++
    if (/[A-Z]/.test(pw))        score++
    if (/[0-9]/.test(pw))        score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    const levels = [
      { label: '',         variant: 'default'  },
      { label: 'Weak',     variant: 'danger'   },
      { label: 'Fair',     variant: 'warning'  },
      { label: 'Good',     variant: 'info'     },
      { label: 'Strong',   variant: 'success'  },
    ]
    return { score, ...levels[score] }
  }

  const strength = getStrength(form.password)

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.name.trim())                             e.name     = 'Full name is required.'
    else if (form.name.trim().length < 2)              e.name     = 'Name must be at least 2 characters.'
    if (!form.email.trim())                            e.email    = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.password)                                e.password = 'Password is required.'
    else if (form.password.length < 8)                 e.password = 'Password must be at least 8 characters.'
    if (!form.confirm)                                 e.confirm  = 'Please confirm your password.'
    else if (form.confirm !== form.password)           e.confirm  = 'Passwords do not match.'
    if (!agreed)                                       e.agreed   = 'You must accept the terms to continue.'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      await onSignup?.(form.name.trim(), form.email, form.password)
    } catch (err) {
      setServerError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Styles ───────────────────────────────────────────────────────────────────
  const pageStyle = {
    minHeight: '100vh',
    background: theme.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'inherit',
  }

  const cardStyle = {
    width: '100%',
    maxWidth: 460,
    background: theme.surface,
    borderRadius: 16,
    boxShadow: theme.shadow,
    border: `1px solid ${theme.border}`,
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
  }

  const logoIconStyle = {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    marginBottom: 14,
    boxShadow: `0 4px 16px ${theme.primary}44`,
  }

  const headingStyle = {
    fontSize: 22,
    fontWeight: 700,
    color: theme.text,
    margin: '0 0 6px',
  }

  const subheadingStyle = {
    fontSize: 14,
    color: theme.textSecondary,
    margin: '0 0 24px',
  }

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0',
  }

  const dividerLineStyle = { flex: 1, height: 1, background: theme.border }
  const dividerTextStyle  = { fontSize: 12, color: theme.textMuted, whiteSpace: 'nowrap' }

  const errorBoxStyle = {
    background: theme.danger + '18',
    border: `1px solid ${theme.danger}44`,
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: theme.danger,
    marginBottom: 14,
  }

  const strengthBarTrackStyle = {
    height: 4,
    borderRadius: 99,
    background: theme.border,
    marginTop: -4,
    overflow: 'hidden',
  }

  const strengthBarFillStyle = {
    height: '100%',
    borderRadius: 99,
    width: `${(strength.score / 4) * 100}%`,
    background:
      strength.score < 2 ? theme.danger :
      strength.score < 3 ? theme.warning :
      strength.score < 4 ? theme.info :
      theme.success,
    transition: 'width 0.3s ease',
  }

  const checkboxRowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  }

  const footerStyle = {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 14,
    color: theme.textSecondary,
  }

  const linkStyle = {
    color: theme.primary,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    marginLeft: 4,
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Theme toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <ThemeToggle size="sm" />
        </div>

        {/* Logo / heading */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={logoIconStyle}>✅</div>
          <h1 style={headingStyle}>Create your account</h1>
          <p style={subheadingStyle}>Join TodoTeam and stay on top of your tasks</p>
        </div>

        {/* Social signup buttons */}
        <SocialButton icon="🌐" label="Sign up with Google" theme={theme} />
        <SocialButton icon="🐙" label="Sign up with GitHub"  theme={theme} />

        {/* Divider */}
        <div style={dividerStyle}>
          <span style={dividerLineStyle} />
          <span style={dividerTextStyle}>or sign up with email</span>
          <span style={dividerLineStyle} />
        </div>

        {/* Server error */}
        {serverError && <div style={errorBoxStyle}>{serverError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Name */}
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              leftIcon={<span style={{ fontSize: 14 }}>👤</span>}
              autoComplete="name"
            />

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              leftIcon={<span style={{ fontSize: 14 }}>✉️</span>}
              autoComplete="email"
            />

            {/* Password + strength bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
                leftIcon={<span style={{ fontSize: 14 }}>🔒</span>}
                rightIcon={
                  <span
                    style={{ cursor: 'pointer', fontSize: 14, userSelect: 'none' }}
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                }
                autoComplete="new-password"
              />
              {form.password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ ...strengthBarTrackStyle, flex: 1 }}>
                    <div style={strengthBarFillStyle} />
                  </div>
                  <Badge size="sm" variant={strength.variant}>{strength.label}</Badge>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <Input
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              error={errors.confirm}
              leftIcon={<span style={{ fontSize: 14 }}>🔒</span>}
              rightIcon={
                <span
                  style={{ cursor: 'pointer', fontSize: 14, userSelect: 'none' }}
                  onClick={() => setShowConfirm(s => !s)}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </span>
              }
              autoComplete="new-password"
            />

            {/* Terms checkbox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={checkboxRowStyle}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => { setAgreed(a => !a); setErrors(e => ({ ...e, agreed: '' })) }}
                  style={{ marginTop: 2, accentColor: theme.primary, cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: theme.primary }} onClick={(e) => e.preventDefault()}>
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" style={{ color: theme.primary }} onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreed && (
                <span style={{ fontSize: 12, color: theme.danger, paddingLeft: 22 }}>
                  {errors.agreed}
                </span>
              )}
            </div>

            {/* Requirements hint */}
            <div style={{
              background: theme.primary + '0f',
              border: `1px solid ${theme.primary}30`,
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 12,
              color: theme.textSecondary,
              lineHeight: 1.7,
            }}>
              <span style={{ display: 'block', fontWeight: 600, color: theme.text, marginBottom: 4 }}>
                Password requirements
              </span>
              {[
                ['8+ characters',           form.password.length >= 8],
                ['One uppercase letter',    /[A-Z]/.test(form.password)],
                ['One number',              /[0-9]/.test(form.password)],
                ['One special character',   /[^A-Za-z0-9]/.test(form.password)],
              ].map(([txt, met]) => (
                <span key={txt} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: met ? theme.success : theme.textMuted }}>{met ? '✓' : '○'}</span>
                  <span style={{ color: met ? theme.text : theme.textMuted }}>{txt}</span>
                </span>
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Footer */}
        <p style={footerStyle}>
          Already have an account?
          <a
            style={linkStyle}
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigateToLogin?.() }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── Reusable social button ───────────────────────────────────────────────────
function SocialButton({ icon, label, theme }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        padding: '10px 16px',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'inherit',
        color: theme.text,
        background: hovered ? theme.surfaceHover : theme.background,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'background 0.15s',
        marginBottom: 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  )
}
