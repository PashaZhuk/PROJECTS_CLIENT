import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../src/store/useAuthStore'

// Заранее очищаем стор, чтобы тесты не зависели друг от друга
beforeEach(() => {
  useAuthStore.setState({
    isSessionExpired: false,
    isSessionSuperseded: false,
    isUserBlocked: false,
    isAuthenticated: true,
    user: { id: 1, email: 'test@test.com', role: 'USER', name: 'Тест' },
  })
})

// ---------- SessionExpiredModal ----------

describe('SessionExpiredModal', () => {
  it('не отображается когда isSessionExpired=false', async () => {
    useAuthStore.setState({ isSessionExpired: false })
    const SessionExpiredModal = (await import('../../src/components/ui/SessionExpiredModal')).default
    const { container } = render(
      <MemoryRouter>
        <SessionExpiredModal />
      </MemoryRouter>
    )
    expect(container.innerHTML).toBe('')
  })

  it('отображается когда isSessionExpired=true', async () => {
    useAuthStore.setState({ isSessionExpired: true })
    const SessionExpiredModal = (await import('../../src/components/ui/SessionExpiredModal')).default
    render(
      <MemoryRouter>
        <SessionExpiredModal />
      </MemoryRouter>
    )
    expect(screen.getByText(/Сессия истекла/i)).toBeInTheDocument()
  })
})

describe('SessionSupersededModal', () => {
  it('не отображается когда isSessionSuperseded=false', async () => {
    useAuthStore.setState({ isSessionSuperseded: false })
    const SessionSupersededModal = (await import('../../src/components/ui/SessionSupersededModal')).default
    const { container } = render(
      <MemoryRouter>
        <SessionSupersededModal />
      </MemoryRouter>
    )
    expect(container.innerHTML).toBe('')
  })

  it('отображается когда isSessionSuperseded=true', async () => {
    useAuthStore.setState({ isSessionSuperseded: true })
    const SessionSupersededModal = (await import('../../src/components/ui/SessionSupersededModal')).default
    render(
      <MemoryRouter>
        <SessionSupersededModal />
      </MemoryRouter>
    )
    // Ищем по тексту внутри карточки
    expect(screen.getByText(/другого устройства/i)).toBeInTheDocument()
  })
})

describe('LockedModal', () => {
  it('отображается когда isOpen=true', async () => {
    const LockedModal = (await import('../../src/components/ui/LockedModal')).default
    render(
      <LockedModal
        isOpen={true}
        onClose={vi.fn()}
        title="Аккаунт заблокирован"
        message="Вы заблокированы"
      />
    )
    expect(screen.getByText('Аккаунт заблокирован')).toBeInTheDocument()
    expect(screen.getByText('Вы заблокированы')).toBeInTheDocument()
  })

  it('не отображается когда isOpen=false', async () => {
    const LockedModal = (await import('../../src/components/ui/LockedModal')).default
    const { container } = render(
      <LockedModal
        isOpen={false}
        onClose={vi.fn()}
        title=""
        message=""
      />
    )
    expect(container.innerHTML).toBe('')
  })

  it('вызывает onClose при нажатии на кнопку', async () => {
    const onClose = vi.fn()
    const LockedModal = (await import('../../src/components/ui/LockedModal')).default
    render(
      <LockedModal
        isOpen={true}
        onClose={onClose}
        title="Блокировка"
        message="Тест"
      />
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onClose).toHaveBeenCalled()
  })
})
