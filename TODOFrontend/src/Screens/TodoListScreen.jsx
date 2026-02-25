import React, { useState, useMemo } from 'react'
import { useTheme } from '../Components/Themed Comps/ThemeContext'
import Navbar    from '../Components/Themed Comps/Navbar'
import Sidebar   from '../Components/Themed Comps/Sidebar'
import TaskCard  from '../Components/Themed Comps/TaskCard'
import Button    from '../Components/Themed Comps/Button'
import Input     from '../Components/Themed Comps/Input'
import Badge     from '../Components/Themed Comps/Badge'
import Modal     from '../Components/Themed Comps/Modal'

// ─── Helpers ──────────────────────────────────────────────────────────────────
let _nextId = 100
const newId = () => ++_nextId

const PRIORITIES = ['low', 'medium', 'high', 'critical']
const STATUSES   = ['todo', 'in-progress', 'done', 'blocked']

const STATUS_LABELS = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done',
  'blocked':     'Blocked',
}

const PRIORITY_LABELS = {
  'low':      'Low',
  'medium':   'Medium',
  'high':     'High',
  'critical': 'Critical',
}

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Design authentication flow',
    description: 'Create wireframes for login, register, and password reset screens.',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    assignee: null,
    tags: ['Design', 'Auth'],
  },
  {
    id: 2,
    title: 'Implement task service API',
    description: 'Build CRUD endpoints for tasks in the Spring Boot task-service.',
    priority: 'critical',
    status: 'todo',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    assignee: null,
    tags: ['Backend', 'API'],
  },
  {
    id: 3,
    title: 'Set up notification emails',
    description: 'Configure notification-service to send task reminders via email.',
    priority: 'medium',
    status: 'done',
    dueDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    assignee: null,
    tags: ['Notifications'],
  },
  {
    id: 4,
    title: 'Write unit tests for user service',
    description: '',
    priority: 'low',
    status: 'todo',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    assignee: null,
    tags: ['Testing'],
  },
]

// ─── Blank form factory ───────────────────────────────────────────────────────
const blankForm = () => ({
  title:       '',
  description: '',
  priority:    'medium',
  status:      'todo',
  dueDate:     '',
  tagsInput:   '',
})

/**
 * TodoListScreen
 * Props:
 *   user     — { name, email }
 *   onLogout — () => void
 */
export default function TodoListScreen({ user = { name: 'User', email: '' }, onLogout }) {
  const { theme } = useTheme()

  // ── Tasks state ─────────────────────────────────────────────────────────────
  const [tasks,  setTasks]  = useState(INITIAL_TASKS.map(t => ({ ...t, assignee: { name: user.name } })))

  // ── UI state ────────────────────────────────────────────────────────────────
  const [search,        setSearch]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [filterPriority,setFilterPriority]= useState('all')
  const [sortBy,        setSortBy]        = useState('created') // 'created' | 'due' | 'priority'
  const [activeSection, setActiveSection] = useState('tasks')

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen,   setEditOpen]   = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const [form,       setForm]       = useState(blankForm())
  const [editTarget, setEditTarget] = useState(null)   // task being edited
  const [deleteTarget,setDeleteTarget]= useState(null) // task pending delete

  // ── Sidebar items ───────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    all:          tasks.length,
    todo:         tasks.filter(t => t.status === 'todo').length,
    'in-progress':tasks.filter(t => t.status === 'in-progress').length,
    done:         tasks.filter(t => t.status === 'done').length,
    blocked:      tasks.filter(t => t.status === 'blocked').length,
  }), [tasks])

  const sidebarItems = [
    {
      id: 'tasks',    icon: '✅', label: 'All Tasks',
      active: activeSection === 'tasks',
      badge: counts.all > 0 ? counts.all : undefined,
      badgeVariant: 'primary',
    },
    {
      id: 'todo',     icon: '📋', label: 'To Do',
      active: activeSection === 'todo',
      badge: counts.todo > 0 ? counts.todo : undefined,
      badgeVariant: 'default',
    },
    {
      id: 'in-progress', icon: '🔄', label: 'In Progress',
      active: activeSection === 'in-progress',
      badge: counts['in-progress'] > 0 ? counts['in-progress'] : undefined,
      badgeVariant: 'info',
    },
    {
      id: 'done',     icon: '🎉', label: 'Done',
      active: activeSection === 'done',
      badge: counts.done > 0 ? counts.done : undefined,
      badgeVariant: 'success',
    },
    {
      id: 'blocked',  icon: '🚫', label: 'Blocked',
      active: activeSection === 'blocked',
      badge: counts.blocked > 0 ? counts.blocked : undefined,
      badgeVariant: 'danger',
    },
  ]

  const handleSidebarItem = (item) => {
    setActiveSection(item.id)
    setFilterStatus(item.id === 'tasks' ? 'all' : item.id)
  }

  // ── Filtered + sorted tasks ──────────────────────────────────────────────────
  const visibleTasks = useMemo(() => {
    let list = [...tasks]

    if (filterStatus !== 'all')
      list = list.filter(t => t.status === filterStatus)

    if (filterPriority !== 'all')
      list = list.filter(t => t.priority === filterPriority)

    if (search.trim())
      list = list.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )

    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    if (sortBy === 'priority')
      list.sort((a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4))
    else if (sortBy === 'due')
      list.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })

    return list
  }, [tasks, filterStatus, filterPriority, search, sortBy])

  // ── Form helpers ─────────────────────────────────────────────────────────────
  const handleFormChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    return e
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const handleCreate = () => {
    const errs = validateForm()
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    const tags = form.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    setTasks(prev => [
      {
        id: newId(),
        title:       form.title.trim(),
        description: form.description.trim(),
        priority:    form.priority,
        status:      form.status,
        dueDate:     form.dueDate || null,
        assignee:    { name: user.name },
        tags,
      },
      ...prev,
    ])
    setCreateOpen(false)
    setForm(blankForm())
    setFormErrors({})
  }

  const openEdit = (task) => {
    setEditTarget(task)
    setForm({
      title:       task.title,
      description: task.description,
      priority:    task.priority,
      status:      task.status,
      dueDate:     task.dueDate ? task.dueDate.slice(0, 10) : '',
      tagsInput:   task.tags.join(', '),
    })
    setFormErrors({})
    setEditOpen(true)
  }

  const handleUpdate = () => {
    const errs = validateForm()
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    const tags = form.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    setTasks(prev => prev.map(t =>
      t.id === editTarget.id
        ? { ...t,
            title:       form.title.trim(),
            description: form.description.trim(),
            priority:    form.priority,
            status:      form.status,
            dueDate:     form.dueDate || null,
            tags,
          }
        : t
    ))
    setEditOpen(false)
    setEditTarget(null)
    setForm(blankForm())
    setFormErrors({})
  }

  const handleToggleComplete = (id) =>
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
    ))

  const confirmDelete = (task) => { setDeleteTarget(task); setDeleteOpen(true) }

  const handleDelete = () => {
    setTasks(prev => prev.filter(t => t.id !== deleteTarget.id))
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  // ── Stats ────────────────────────────────────────────────────────────────────
  const overdue = tasks.filter(t =>
    t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()
  ).length

  const completionPct = tasks.length
    ? Math.round((counts.done / tasks.length) * 100)
    : 0

  // ── Layout styles ─────────────────────────────────────────────────────────────
  const pageStyle = {
    display: 'flex',
    minHeight: '100vh',
    background: theme.background,
    fontFamily: 'inherit',
  }

  const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  }

  const contentStyle = {
    flex: 1,
    padding: '28px 32px',
    overflowY: 'auto',
  }

  const statCards = [
    { label: 'Total Tasks',   value: counts.all,         icon: '📋', color: theme.primary  },
    { label: 'In Progress',   value: counts['in-progress'], icon: '🔄', color: theme.info    },
    { label: 'Completed',     value: `${completionPct}%`, icon: '🎉', color: theme.success  },
    { label: 'Overdue',       value: overdue,             icon: '⚠️', color: theme.danger   },
  ]

  const navLinks = [
    { label: 'My Tasks', href: '#', active: true },
  ]

  return (
    <div style={pageStyle}>
      {/* ── Sidebar ── */}
      <Sidebar
        items={sidebarItems}
        user={{ name: user.name, email: user.email, status: 'online' }}
        onItemClick={handleSidebarItem}
        defaultCollapsed={false}
      />

      {/* ── Main ── */}
      <div style={mainStyle}>
        {/* Navbar */}
        <Navbar
          brandName="TodoTeam"
          links={navLinks}
          user={{ name: user.name, email: user.email, status: 'online' }}
          onLogout={onLogout}
        />

        <div style={contentStyle}>

          {/* ── Page header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ color: theme.text, fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
                {activeSection === 'tasks' ? 'All Tasks' : STATUS_LABELS[activeSection] ?? 'Tasks'}
              </h1>
              <p style={{ color: theme.textSecondary, margin: 0, fontSize: 14 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              leftIcon={<span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>}
              onClick={() => { setForm(blankForm()); setFormErrors({}); setCreateOpen(true) }}
            >
              New Task
            </Button>
          </div>

          {/* ── Stat cards ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 14,
            marginBottom: 28,
          }}>
            {statCards.map(card => (
              <StatCard key={card.label} {...card} theme={theme} />
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}>
            {/* Search */}
            <div style={{ flex: '1 1 220px', minWidth: 180 }}>
              <Input
                type="search"
                placeholder="Search tasks…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<span style={{ fontSize: 13 }}>🔍</span>}
              />
            </div>

            {/* Status filter chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['all', 'todo', 'in-progress', 'done', 'blocked'].map(s => (
                <FilterChip
                  key={s}
                  label={s === 'all' ? 'All' : STATUS_LABELS[s]}
                  active={filterStatus === s}
                  theme={theme}
                  onClick={() => { setFilterStatus(s); setActiveSection(s === 'all' ? 'tasks' : s) }}
                />
              ))}
            </div>

            {/* Priority filter */}
            <SelectField
              value={filterPriority}
              theme={theme}
              onChange={e => setFilterPriority(e.target.value)}
              options={[
                { value: 'all',      label: 'All priorities' },
                { value: 'critical', label: '🔴 Critical' },
                { value: 'high',     label: '🟠 High' },
                { value: 'medium',   label: '🟡 Medium' },
                { value: 'low',      label: '🟢 Low' },
              ]}
            />

            {/* Sort */}
            <SelectField
              value={sortBy}
              theme={theme}
              onChange={e => setSortBy(e.target.value)}
              options={[
                { value: 'created',  label: '↕ Date created' },
                { value: 'due',      label: '📅 Due date' },
                { value: 'priority', label: '⚡ Priority' },
              ]}
            />
          </div>

          {/* ── Task grid ── */}
          {visibleTasks.length === 0 ? (
            <EmptyState search={search} theme={theme} onNew={() => { setForm(blankForm()); setFormErrors({}); setCreateOpen(true) }} />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 14,
            }}>
              {visibleTasks.map(task => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onComplete={() => handleToggleComplete(task.id)}
                  onEdit={() => openEdit(task)}
                  onDelete={() => confirmDelete(task)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Modal ── */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setFormErrors({}) }}
        title="Create New Task"
        confirmLabel="Create Task"
        onConfirm={handleCreate}
        size="md"
      >
        <TaskForm form={form} errors={formErrors} onChange={handleFormChange} theme={theme} />
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        open={editOpen}
        onClose={() => { setEditOpen(false); setFormErrors({}) }}
        title="Edit Task"
        confirmLabel="Save Changes"
        onConfirm={handleUpdate}
        size="md"
      >
        <TaskForm form={form} errors={formErrors} onChange={handleFormChange} theme={theme} />
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Task"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        size="sm"
      >
        <p style={{ color: theme.text, margin: 0, lineHeight: 1.6 }}>
          Are you sure you want to delete{' '}
          <strong>"{deleteTarget?.title}"</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

// ─── Task form (shared by create + edit modals) ───────────────────────────────
function TaskForm({ form, errors, onChange, theme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input
        label="Title *"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={onChange('title')}
        error={errors.title}
      />

      <Input
        label="Description"
        type="textarea"
        placeholder="Add details, notes or context…"
        value={form.description}
        onChange={onChange('description')}
        rows={3}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Priority */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary }}>Priority</label>
          <SelectField
            value={form.priority}
            theme={theme}
            onChange={onChange('priority')}
            fullWidth
            options={PRIORITIES.map(p => ({ value: p, label: PRIORITY_LABELS[p] }))}
          />
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary }}>Status</label>
          <SelectField
            value={form.status}
            theme={theme}
            onChange={onChange('status')}
            fullWidth
            options={STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] }))}
          />
        </div>
      </div>

      {/* Due date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary }}>Due date</label>
        <input
          type="date"
          value={form.dueDate}
          onChange={onChange('dueDate')}
          style={{
            padding: '10px 13px',
            fontSize: 14,
            borderRadius: 8,
            border: `1.5px solid ${theme.border}`,
            background: theme.surface,
            color: theme.text,
            fontFamily: 'inherit',
            outline: 'none',
            width: '100%',
            colorScheme: theme.name === 'dark' ? 'dark' : 'light',
          }}
        />
      </div>

      <Input
        label="Tags (comma-separated)"
        placeholder="e.g. Backend, API, Auth"
        value={form.tagsInput}
        onChange={onChange('tagsInput')}
        hint="Separate multiple tags with commas"
      />
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, theme }) {
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: theme.shadowSm,
    }}>
      <div style={{
        width: 42,
        height: 42,
        borderRadius: 10,
        background: color + '1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}

// ─── Filter chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, theme, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 13px',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        fontFamily: 'inherit',
        borderRadius: 999,
        border: `1.5px solid ${active ? theme.primary : theme.border}`,
        background: active ? theme.primary + '1a' : hovered ? theme.surfaceHover : 'transparent',
        color: active ? theme.primary : hovered ? theme.text : theme.textSecondary,
        cursor: 'pointer',
        transition: 'all 0.15s',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ─── Native select styled to match theme ─────────────────────────────────────
function SelectField({ value, onChange, options, theme, fullWidth = false }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: '8px 32px 8px 12px',
        fontSize: 13,
        fontFamily: 'inherit',
        borderRadius: 8,
        border: `1.5px solid ${theme.border}`,
        background: theme.surface,
        color: theme.text,
        cursor: 'pointer',
        outline: 'none',
        width: fullWidth ? '100%' : undefined,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ search, theme, onNew }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 20px',
      color: theme.textSecondary,
      textAlign: 'center',
      gap: 14,
    }}>
      <span style={{ fontSize: 52 }}>{search ? '🔍' : '📭'}</span>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, marginBottom: 6 }}>
          {search ? 'No tasks match your search' : 'No tasks here yet'}
        </div>
        <div style={{ fontSize: 14 }}>
          {search
            ? `Try a different keyword or clear the search.`
            : 'Create your first task to get started.'}
        </div>
      </div>
      {!search && (
        <Button variant="primary" size="md" onClick={onNew}>
          + New Task
        </Button>
      )}
    </div>
  )
}
