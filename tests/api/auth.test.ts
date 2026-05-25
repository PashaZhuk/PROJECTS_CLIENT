import { describe, it, expect, vi, beforeEach } from 'vitest'

// ky сам по себе — mocked
const mockKyInstance = {
  post: vi.fn(),
  get: vi.fn(),
}

vi.mock('ky', () => ({
  default: { create: () => mockKyInstance },
}))

  const authApi = (await import("../../src/api/auth")).default;

beforeEach(() => {
  vi.clearAllMocks()
  mockKyInstance.post.mockReturnValue({ json: vi.fn().mockResolvedValue({}) })
  mockKyInstance.get.mockReturnValue({ json: vi.fn().mockResolvedValue({}) })
})

describe('authApi', () => {
  it('login вызывает POST auth/login', async () => {
    await authApi.login({ email: 'test@test.com', password: 'pass' })

    expect(mockKyInstance.post).toHaveBeenCalledWith('auth/login', {
      json: { email: 'test@test.com', password: 'pass' },
    })
  })

  it('profile вызывает GET auth/profile', async () => {
    await authApi.profile()

    expect(mockKyInstance.get).toHaveBeenCalledWith('auth/profile')
  })

  it('logout вызывает POST auth/logout', async () => {
    await authApi.logout('manual', '1')

    expect(mockKyInstance.post).toHaveBeenCalledWith('auth/logout', {
      json: { reason: 'manual', userId: '1' },
    })
  })

  it('refresh вызывает POST auth/refresh', async () => {
    await authApi.refresh()

    expect(mockKyInstance.post).toHaveBeenCalledWith('auth/refresh')
  })

  it('send2FACode вызывает POST auth/2fa/send', async () => {
    await authApi.send2FACode(42)

    expect(mockKyInstance.post).toHaveBeenCalledWith('auth/2fa/send', {
      json: { userId: 42 },
    })
  })

  it('verify2FACode вызывает POST auth/2fa/verify', async () => {
    await authApi.verify2FACode(42, '123456')

    expect(mockKyInstance.post).toHaveBeenCalledWith('auth/2fa/verify', {
      json: { userId: 42, code: '123456' },
    })
  })

  it('forgotPassword вызывает POST auth/forgot-password', async () => {
    await authApi.forgotPassword('test@test.com')

    expect(mockKyInstance.post).toHaveBeenCalledWith('auth/forgot-password', {
      json: { email: 'test@test.com' },
    })
  })

  it('resetPassword вызывает POST auth/reset-password', async () => {
    await authApi.resetPassword('token-uuid', 'newpass123')

    expect(mockKyInstance.post).toHaveBeenCalledWith('auth/reset-password', {
      json: { token: 'token-uuid', newPassword: 'newpass123' },
    })
  })
})
