import { describe, it, expect, beforeEach, vi } from 'vitest'

// Мокаем API и socket до импорта стора
const mockLogin = vi.fn()
const mockVerify2FA = vi.fn()
const mockLogout = vi.fn()
const mockProfile = vi.fn()
const mockInitSocket = vi.fn()
const mockDisconnectSocket = vi.fn()
const mockGetSocket = vi.fn(() => ({ connected: false }))

vi.mock('../../src/api/auth', () => ({
  default: {
    login: (...args: any[]) => mockLogin(...args),
    logout: (...args: any[]) => mockLogout(...args),
    profile: (...args: any[]) => mockProfile(...args),
    verify2FACode: (...args: any[]) => mockVerify2FA(...args),
  },
}))

vi.mock('../../src/api/socket', () => ({
  initSocket: (...args: any[]) => mockInitSocket(...args),
  disconnectSocket: (...args: any[]) => mockDisconnectSocket(...args),
  getSocket: (...args: any[]) => mockGetSocket(...args),
}))

const { useAuthStore } = await import('../../src/store/useAuthStore')

const TEST_USER = { id: 1, email: 'user@test.com', role: 'USER', name: 'Тест' }

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    _hasHydrated: true,
    isInitialized: true,
    is2FARequired: false,
    tempUserId: null,
    isSessionExpired: false,
    isSessionSuperseded: false,
    isUserBlocked: false,
  })

  localStorage.clear()
  vi.clearAllMocks()
})

describe('useAuthStore', () => {
  describe('initial state', () => {
    it('имеет корректное начальное состояние', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.is2FARequired).toBe(false)
      expect(state.tempUserId).toBeNull()
    })
  })

  describe('setUser', () => {
    it('устанавливает пользователя и isAuthenticated', () => {
      useAuthStore.getState().setUser(TEST_USER)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(TEST_USER)
      expect(state.isAuthenticated).toBe(true)
    })

    it('сбрасывает при null', () => {
      useAuthStore.getState().setUser(null)

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('успешный вход — устанавливает пользователя и зовёт initSocket', async () => {
      mockLogin.mockResolvedValue({
        user: TEST_USER,
      })

      const result = await useAuthStore.getState().login({ email: 'test@test.com', password: 'pass' })

      expect(result.success).toBe(true)
      expect(result.user).toEqual(TEST_USER)
      expect(mockInitSocket).toHaveBeenCalledOnce()

      const state = useAuthStore.getState()
      expect(state.user).toEqual(TEST_USER)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
    })

    it('требует 2FA при status === 2FA_REQUIRED', async () => {
      mockLogin.mockResolvedValue({
        status: '2FA_REQUIRED',
        data: { userId: 42 },
      })

      const result = await useAuthStore.getState().login({ email: 'test@test.com', password: 'pass' })

      expect(result.success).toBe(false)
      expect(result.requires2FA).toBe(true)
      expect(result.userId).toBe(42)

      const state = useAuthStore.getState()
      expect(state.is2FARequired).toBe(true)
      expect(state.tempUserId).toBe(42)
      expect(state.isAuthenticated).toBe(false)
    })

    it('возвращает attemptsLeft при ошибке', async () => {
      mockLogin.mockRejectedValue({
        response: {
          json: () => Promise.resolve({ error: 'Неверный пароль', attemptsLeft: 3 }),
        },
      })

      const result = await useAuthStore.getState().login({ email: 'test@test.com', password: 'wrong' })

      expect(result.success).toBe(false)
      expect(result.attemptsLeft).toBe(3)
      expect(result.message).toBe('Неверный пароль')
    })

    it('возвращает userBlocked при блокировке', async () => {
      mockLogin.mockRejectedValue({
        response: {
          json: () => Promise.resolve({ error: 'Заблокирован', code: 'USER_BLOCKED' }),
        },
      })

      const result = await useAuthStore.getState().login({ email: 'test@test.com', password: 'pass' })

      expect(result.success).toBe(false)
      expect(result.userBlocked).toBe(true)
    })

    it('обрабатывает ошибки сети', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'))

      const result = await useAuthStore.getState().login({ email: 'test@test.com', password: 'pass' })

      expect(result.success).toBe(false)
      expect(result.message).toContain('Сервер недоступен')
    })
  })

  describe('verify2FA', () => {
    it('успешная верификация — устанавливает пользователя', async () => {
      useAuthStore.getState().setTempUserId(42)
      mockVerify2FA.mockResolvedValue({
        data: { user: TEST_USER },
      })

      const result = await useAuthStore.getState().verify2FA('123456')

      expect(result.success).toBe(true)
      expect(result.user).toEqual(TEST_USER)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(TEST_USER)
      expect(state.isAuthenticated).toBe(true)
      expect(state.is2FARequired).toBe(false)
      expect(state.tempUserId).toBeNull()
    })

    it('возвращает ошибку без tempUserId', async () => {
      const result = await useAuthStore.getState().verify2FA('123456')

      expect(result.success).toBe(false)
      expect(result.message).toContain('ID пользователя не найден')
    })

    it('возвращает attemptsLeft при неверном коде', async () => {
      useAuthStore.getState().setTempUserId(42)
      mockVerify2FA.mockRejectedValue({
        response: {
          json: () => Promise.resolve({ error: 'Неверный код', attemptsLeft: 2 }),
        },
      })

      const result = await useAuthStore.getState().verify2FA('000000')

      expect(result.success).toBe(false)
      expect(result.attemptsLeft).toBe(2)
    })
  })

  describe('logout', () => {
    it('очищает состояние и зовёт API logout', async () => {
      useAuthStore.setState({
        user: TEST_USER,
        isAuthenticated: true,
        isInitialized: true,
      })
      mockLogout.mockResolvedValue({})

      await useAuthStore.getState().logout()

      expect(mockLogout).toHaveBeenCalledWith('manual', '1')
      expect(mockDisconnectSocket).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isSessionExpired).toBe(false)
      expect(state.is2FARequired).toBe(false)
    })
  })

  describe('checkAuth', () => {
    it('успешно восстанавливает сессию', async () => {
      mockProfile.mockResolvedValue({
        data: { user: TEST_USER },
      })

      await useAuthStore.getState().checkAuth()

      const state = useAuthStore.getState()
      expect(state.user).toEqual(TEST_USER)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isInitialized).toBe(true)
      expect(mockInitSocket).toHaveBeenCalled()
    })

    it('очищает состояние при ошибке', async () => {
      mockProfile.mockRejectedValue(new Error('Not authorized'))

      await useAuthStore.getState().checkAuth()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isInitialized).toBe(true)
      expect(mockDisconnectSocket).toHaveBeenCalled()
    })
  })

  describe('session state', () => {
    it('setSessionExpired вызывает logout и устанавливает флаг', () => {
      localStorage.setItem('auth-storage', JSON.stringify({ state: { user: TEST_USER } }))

      useAuthStore.getState().setSessionExpired(true)

      expect(useAuthStore.getState().isSessionExpired).toBe(true)
      expect(mockLogout).toHaveBeenCalledWith('inactivity')
    })

    it('setSessionSuperseded', () => {
      useAuthStore.getState().setSessionSuperseded(true)
      expect(useAuthStore.getState().isSessionSuperseded).toBe(true)
    })

    it('setUserBlocked', () => {
      useAuthStore.getState().setUserBlocked(true)
      expect(useAuthStore.getState().isUserBlocked).toBe(true)
    })
  })
})
