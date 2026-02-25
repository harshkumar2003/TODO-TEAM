import React, { useState } from 'react'
import { useTheme } from './ThemeContext'
import Badge from './Badge'
import Avatar from './Avatar'

/**
 * TaskCard — displays a single task.
 * Props:
 *   id          — task id
 *   title       — task title
 *   description — optional description
 *   priority    — 'low' | 'medium' | 'high' | 'critical'
 *   status      — 'todo' | 'in-progress' | 'done' | 'blocked'
 *   dueDate     — JS Date or ISO string
 *   assignee    — { name, avatarSrc? }
 *   tags        — string[]
 *   onComplete  — () => void
 *   onEdit      — () => void
 *   onDelete    — () => void
 */
export default function TaskCard({
  id,
  title = 'Untitled Task',
  description = '',
  priority = 'medium',
  status = 'todo',
  dueDate = null,
  assignee = null,
  tags = [],
  onComplete,
  onEdit,
  onDelete,
  style: extraStyle = {},
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const priorityVariants = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  }

  const statusVariants = {
    todo: 'default',
    'in-progress': 'info',
    done: 'success',
    blocked: 'danger',
  }

  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
    blocked: 'Blocked',
  }

  const isDone = status === 'done'

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  const isOverdue =
    dueDate && !isDone && new Date(dueDate) < new Date()

  const cardStyle = {
    background: theme.surface,
    border: `1px solid ${hovered ? theme.borderFocus + '88' : theme.border}`,
    borderRadius: 12,
    padding: '16px 18px',
    cursor: 'pointer',
    transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.15s',
    boxShadow: hovered ? theme.shadow : theme.shadowSm,
    transform: hovered ? 'translateY(-1px)' : 'none',
    position: 'relative',
    ...extraStyle,
  }

  const titleStyle = {
    fontSize: 15,
    fontWeight: 600,
    color: isDone ? theme.textSecondary : theme.text,
    textDecoration: isDone ? 'line-through' : 'none',
    margin: 0,
    flex: 1,
  }

  const descStyle = {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 6,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 8,
  }

  const tagsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 10,
  }

  const dateStyle = {
    fontSize: 12,
    color: isOverdue ? theme.danger : theme.textSecondary,
    fontWeight: isOverdue ? 600 : 400,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  }

  const menuBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: theme.textSecondary,
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 16,
    lineHeight: 1,
  }

  const dropdownStyle = {
    position: 'absolute',
    top: 36,
    right: 14,
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    boxShadow: theme.shadow,
    zIndex: 10,
    minWidth: 130,
    overflow: 'hidden',
  }

  const menuItems = [
    { label: onEdit   ? '✏️  Edit'           : null, action: onEdit,   danger: false },
    { label: onComplete && !isDone ? '✅  Complete' : null, action: onComplete, danger: false },
    { label: onDelete ? '🗑️  Delete'         : null, action: onDelete, danger: true  },
  ].filter(m => m.label)

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        {/* Checkbox */}
        <button
          style={{
            width: 18, height: 18,
            borderRadius: 4,
            border: `2px solid ${isDone ? theme.success : theme.border}`,
            background: isDone ? theme.success : 'transparent',
            cursor: 'pointer', flexShrink: 0, marginTop: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { e.stopPropagation(); onComplete?.() }}
          title="Mark complete"
        >
          {isDone && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
        </button>

        <h3 style={titleStyle}>{title}</h3>

        {/* Menu button */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            style={menuBtnStyle}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }}
          >
            ⋯
          </button>
          {menuOpen && menuItems.length > 0 && (
            <div style={dropdownStyle}>
              {menuItems.map(({ label, action, danger }, i) => (
                <MenuItem key={i} label={label} theme={theme} danger={danger}
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); action?.() }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {description && <p style={descStyle}>{description}</p>}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={tagsStyle}>
          {tags.map((tag, i) => (
            <Badge key={i} size="sm" variant="default">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Footer meta */}
      <div style={metaStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Badge size="sm" variant={statusVariants[status] || 'default'}>
            {statusLabels[status] || status}
          </Badge>
          <Badge size="sm" variant={priorityVariants[priority] || 'default'}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {formattedDate && (
            <span style={dateStyle}>
              📅 {formattedDate}
              {isOverdue && ' (Overdue)'}
            </span>
          )}
          {assignee && (
            <Avatar name={assignee.name} src={assignee.avatarSrc} size="xs" />
          )}
        </div>
      </div>
    </div>
  )
}

// Small helper for dropdown menu items
function MenuItem({ label, theme, danger, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '9px 14px',
        fontSize: 13,
        color: danger ? (hovered ? theme.danger : theme.text) : theme.text,
        background: hovered ? (danger ? theme.danger + '18' : theme.surfaceHover) : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      {label}
    </div>
  )
}
