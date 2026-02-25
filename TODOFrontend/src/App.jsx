import React, { useState } from 'react'
import { ThemeProvider } from './Components/Themed Comps/index.js'
import LoginScreen    from './Screens/LoginScreen.jsx'
import SignupScreen   from './Screens/SignupScreen.jsx'
import TodoListScreen from './Screens/TodoListScreen.jsx'

// ─── App wrapped in ThemeProvider ────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router />
    </ThemeProvider>
  )
}

// ─── Minimal in-app router ────────────────────────────────────────────────────
function Router() {
  // 'login' | 'signup' | 'todos'
  const [screen, setScreen] = useState('login')
  const [user,   setUser]   = useState({ name: '', email: '' })

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={async (email, password) => {
          // TODO: replace with real API call
          await new Promise(r => setTimeout(r, 800))
          setUser({ name: email.split('@')[0], email })
          setScreen('todos')
        }}
        onNavigateToSignup={() => setScreen('signup')}
      />
    )
  }

  if (screen === 'signup') {
    return (
      <SignupScreen
        onSignup={async (name, email, password) => {
          // TODO: replace with real API call
          await new Promise(r => setTimeout(r, 800))
          setUser({ name, email })
          setScreen('todos')
        }}
        onNavigateToLogin={() => setScreen('login')}
      />
    )
  }

  return (
    <TodoListScreen
      user={user}
      onLogout={() => { setUser({ name: '', email: '' }); setScreen('login') }}
    />
  )
}

