import React, { useState } from 'react'
import { useTheme } from '../Components/Themed Comps/ThemeContext'
import Button from '../Components/Themed Comps/Button'
import Input from '../Components/Themed Comps/Input'
import ThemeToggle from '../Components/Themed Comps/ThemeToggle'

/**
 * LoginScreen
 * Props:
 *   onLogin     — (email, password) => void | Promise
 *   onNavigateToSignup — () => void
 */
export default function LoginScreen({ onLogin, onNavigateToSignup }) {
  const { theme } = useTheme()

  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.email.trim())                        e.email    = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.password)                            e.password = 'Password is required.'
    else if (form.password.length < 6)             e.password = 'Password must be at least 6 characters.'
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
      await onLogin?.(form.email, form.password)
    } catch (err) {
      setServerError(err?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
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
    maxWidth: 420,
    background: theme.surface,
    borderRadius: 16,
    boxShadow: theme.shadow,
    border: `1px solid ${theme.border}`,
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  }

  const logoAreaStyle = {
    textAlign: 'center',
    marginBottom: 28,
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
    margin: 0,
  }

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0',
  }

  const dividerLineStyle = {
    flex: 1,
    height: 1,
    background: theme.border,
  }

  const dividerTextStyle = {
    fontSize: 12,
    color: theme.textMuted,
    whiteSpace: 'nowrap',
  }

  const socialBtnStyle = (hovered) => ({
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
  })

  const forgotStyle = {
    fontSize: 13,
    color: theme.primary,
    cursor: 'pointer',
    textDecoration: 'none',
    userSelect: 'none',
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 4,
  }

  const errorBoxStyle = {
    background: theme.danger + '18',
    border: `1px solid ${theme.danger}44`,
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: theme.danger,
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

  const toggleRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 24,
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Theme toggle */}
        <div style={toggleRowStyle}>
          <ThemeToggle size="sm" />
        </div>

        {/* Logo / heading */}
        <div style={logoAreaStyle}>
          <div style={logoIconStyle}>✅</div>
          <h1 style={headingStyle}>Welcome back</h1>
          <p style={subheadingStyle}>Sign in to your TodoTeam account</p>
        </div>

        {/* Social login buttons */}
        <SocialButton icon="🌐" label="Continue with Google" theme={theme} />
        <SocialButton icon="🐙" label="Continue with GitHub"  theme={theme} />

        {/* Divider */}
        <div style={dividerStyle}>
          <span style={dividerLineStyle} />
          <span style={dividerTextStyle}>or sign in with email</span>
          <span style={dividerLineStyle} />
        </div>

        {/* Server error */}
        {serverError && <div style={{ ...errorBoxStyle, marginBottom: 14 }}>{serverError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
                autoComplete="current-password"
              />
              <a href="#" style={forgotStyle} onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Footer */}
        <p style={footerStyle}>
          Don't have an account?
          <a
            style={linkStyle}
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigateToSignup?.() }}
          >
            Create one
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
