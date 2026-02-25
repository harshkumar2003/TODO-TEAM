import React, { useState } from 'react'
import { useTheme } from './ThemeContext'
import ThemeToggle from './ThemeToggle'
import Avatar from './Avatar'

/**
 * Navbar — top navigation bar.
 * Props:
 *   brandName   — app name / logo text
 *   brandIcon   — optional JSX icon next to brand
 *   links       — [{ label, href, active? }]
 *   user        — { name, avatarSrc?, status? }
 *   onLogout    — called when "Logout" is clicked
 *   sticky      — boolean, position: sticky or relative
 */
export default function Navbar({
  brandName = 'TodoTeam',
  brandIcon = null,
  links = [],
  user = null,
  onLogout,
  sticky = true,
}) {
  const { theme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const navStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: 0,
    zIndex: 100,
    width: '100%',
    background: theme.surface,
    borderBottom: `1px solid ${theme.border}`,
    boxShadow: theme.shadowSm,
    fontFamily: 'inherit',
  }

  const innerStyle = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  }

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
    color: theme.text,
    fontWeight: 700,
    fontSize: 18,
    userSelect: 'none',
  }

  const linksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  }

  const linkStyle = (active, hovered) => ({
    padding: '6px 12px',
    borderRadius: 7,
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? theme.primary : hovered ? theme.text : theme.textSecondary,
    background: active ? theme.primary + '18' : hovered ? theme.surfaceHover : 'transparent',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    userSelect: 'none',
  })

  const rightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  }

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    boxShadow: theme.shadow,
    minWidth: 160,
    overflow: 'hidden',
    zIndex: 200,
  }

  const dropdownItemStyle = (hovered) => ({
    padding: '10px 16px',
    fontSize: 14,
    color: hovered ? theme.danger : theme.text,
    background: hovered ? theme.danger + '18' : 'transparent',
    cursor: 'pointer',
    transition: 'background 0.15s',
    userSelect: 'none',
  })

  const [logoutHovered, setLogoutHovered] = useState(false)

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        {/* Brand */}
        <a href="/" style={brandStyle}>
          {brandIcon}
          {brandName}
        </a>

        {/* Links (hidden on small screens via CSS — add your media query globally) */}
        {links.length > 0 && (
          <ul style={linksStyle}>
            {links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  style={linkStyle(link.active, hoveredLink === i)}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Right side */}
        <div style={rightStyle}>
          <ThemeToggle size="sm" />

          {user && (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setDropdownOpen(o => !o)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Avatar
                  name={user.name}
                  src={user.avatarSrc}
                  status={user.status}
                  size="sm"
                />
                <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>
                  {user.name}
                </span>
              </div>

              {dropdownOpen && (
                <div style={dropdownStyle}>
                  <div style={{ padding: '10px 16px', borderBottom: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{user.name}</div>
                    {user.email && (
                      <div style={{ fontSize: 12, color: theme.textSecondary }}>{user.email}</div>
                    )}
                  </div>
                  <div
                    style={dropdownItemStyle(logoutHovered)}
                    onMouseEnter={() => setLogoutHovered(true)}
                    onMouseLeave={() => setLogoutHovered(false)}
                    onClick={() => { setDropdownOpen(false); onLogout?.() }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
