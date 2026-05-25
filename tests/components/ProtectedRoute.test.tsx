import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../../src/components/auth/ProtectedRoute'

// Мокаем стор авторизации
vi.mock('../../src/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}))

import { useAuthStore } from '../../src/store/useAuthStore'
const mockUseAuthStore = useAuthStore as unknown as ReturnType<typeof vi.fn>

const authenticatedUser = {
  id: 1,
  email: 'user@test.com',
  role: 'USER',
  name: 'Тест',
}

beforeEach(() => {
  vi.clearAllMocks()
})

function renderRoute(overrides: any = {}, allowedRoles?: string[]) {
  const defaultState = { user: null, isAuthenticated: false }
  mockUseAuthStore.mockReturnValue({ ...defaultState, ...overrides })

  const props: any = {}
  if (allowedRoles) props.allowedRoles = allowedRoles

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute {...props}>
              <div data-testid="protected-content">Секретный контент</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        <Route path="/unauthorized" element={<div data-testid="unauthorized-page">Unauthorized</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('редиректит на /login если не аутентифицирован', () => {
    renderRoute()

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('показывает контент если аутентифицирован', () => {
    renderRoute({ user: authenticatedUser, isAuthenticated: true })

    expect(screen.getByTestId('protected-content')).toHaveTextContent('Секретный контент')
  })

  it('редиректит на /unauthorized если роль не подходит', () => {
    renderRoute(
      { user: authenticatedUser, isAuthenticated: true },
      ['ADMIN']
    )

    expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('пропускает если роль совпадает', () => {
    renderRoute(
      { user: authenticatedUser, isAuthenticated: true },
      ['USER']
    )

    expect(screen.getByTestId('protected-content')).toHaveTextContent('Секретный контент')
  })

  it('пропускает если allowedRoles не указан', () => {
    renderRoute({ user: authenticatedUser, isAuthenticated: true })

    expect(screen.getByTestId('protected-content')).toHaveTextContent('Секретный контент')
  })
})
