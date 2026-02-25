import React, { useState } from 'react'
import { useTheme } from './ThemeContext'
import Avatar from './Avatar'
import Badge from './Badge'

/**
 * Sidebar — collapsible left navigation.
 * Props:
 *   items       — [{ id, icon, label, badge?, badgeVariant?, href?, active? }]
 *   onItemClick — (item) => void
 *   collapsed   — controlled collapse state (optional)
 *   defaultCollapsed — initial state
 *   user        — { name, email?, avatarSrc?, status? }
 *   footer      — JSX node placed at the bottom
 *   width       — expanded width in px (default 240)
 */
export default function Sidebar({
  items = [],
  onItemClick,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  user = null,
  footer = null,
  width = 240,
}) {
  const { theme } = useTheme()
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const [hoveredItem, setHoveredItem] = useState(null)

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed
  const toggle = () => setInternalCollapsed(c => !c)

  const collapsedW = 64
  const currentWidth = isCollapsed ? collapsedW : width

  const sidebarStyle = {
    width: currentWidth,
    minHeight: '100vh',
    background: theme.surface,
    borderRight: `1px solid ${theme.border}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.25s ease',
    overflow: 'hidden',
    flexShrink: 0,
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'space-between',
    padding: isCollapsed ? '16px 0' : '14px 16px',
    borderBottom: `1px solid ${theme.border}`,
    minHeight: 60,
  }

  const brandStyle = {
    fontWeight: 700,
    fontSize: 16,
    color: theme.text,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    opacity: isCollapsed ? 0 : 1,
    maxWidth: isCollapsed ? 0 : 160,
    transition: 'opacity 0.2s, max-width 0.2s',
  }

  const toggleBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: theme.textSecondary,
    cursor: 'pointer',
    fontSize: 18,
    padding: 4,
    borderRadius: 6,
    lineHeight: 1,
    flexShrink: 0,
  }

  const navStyle = {
    flex: 1,
    padding: '10px 8px',
    overflowY: 'auto',
    overflowX: 'hidden',
  }

  const itemStyle = (active, hovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: isCollapsed ? 0 : 10,
    padding: isCollapsed ? '10px 0' : '9px 12px',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    borderRadius: 8,
    marginBottom: 3,
    cursor: 'pointer',
    background: active
      ? theme.primary + '1a'
      : hovered
      ? theme.surfaceHover
      : 'transparent',
    color: active ? theme.primary : hovered ? theme.text : theme.textSecondary,
    fontWeight: active ? 600 : 400,
    fontSize: 14,
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  })

  const iconStyle = (active) => ({
    fontSize: 18,
    flexShrink: 0,
    color: active ? theme.primary : 'inherit',
  })

  const labelStyle = {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: isCollapsed ? 0 : 1,
    maxWidth: isCollapsed ? 0 : 200,
    transition: 'opacity 0.2s, max-width 0.2s',
  }

  const userSectionStyle = {
    padding: isCollapsed ? '12px 0' : '12px 14px',
    borderTop: `1px solid ${theme.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    justifyContent: isCollapsed ? 'center' : 'flex-start',
  }

  return (
    <aside style={sidebarStyle}>
      {/* Header / Brand */}
      <div style={headerStyle}>
        <span style={brandStyle}>TodoTeam</span>
        <button style={toggleBtnStyle} onClick={toggle} aria-label="Toggle sidebar">
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav items */}
      <nav style={navStyle}>
        {items.map((item) => {
          const hovered = hoveredItem === item.id
          return (
            <a
              key={item.id}
              href={item.href || '#'}
              style={itemStyle(item.active, hovered)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={(e) => { if (!item.href || item.href === '#') e.preventDefault(); onItemClick?.(item) }}
              title={isCollapsed ? item.label : undefined}
            >
              <span style={iconStyle(item.active)}>{item.icon}</span>
              <span style={labelStyle}>{item.label}</span>
              {!isCollapsed && item.badge !== undefined && (
                <Badge size="sm" variant={item.badgeVariant || 'primary'}>
                  {item.badge}
                </Badge>
              )}
            </a>
          )
        })}
      </nav>

      {/* User section */}
      {user && (
        <div style={userSectionStyle}>
          <Avatar
            name={user.name}
            src={user.avatarSrc}
            status={user.status}
            size="sm"
          />
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              {user.email && (
                <div style={{ fontSize: 11, color: theme.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Optional footer slot */}
      {footer && !isCollapsed && (
        <div style={{ padding: '10px 14px', borderTop: `1px solid ${theme.border}` }}>
          {footer}
        </div>
      )}
    </aside>
  )
}
