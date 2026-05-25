import { describe, it, expect, beforeEach, vi } from 'vitest'

// Мокаем queryClient
vi.mock('../src/lib/queryClient', () => ({
  queryClient: { setQueriesData: vi.fn() },
}))

const { useChatStore } = await import('../../src/store/useChatStore')

beforeEach(() => {
  useChatStore.setState({
    messages: {},
    activeChatId: null,
    loading: false,
  })
  vi.clearAllMocks()
})

const MSG = { id: 1, projectId: 1, senderId: 1, text: 'Привет', isRead: false, createdAt: '2026-01-01' }

describe('useChatStore', () => {
  it('setActiveChatId', () => {
    useChatStore.getState().setActiveChatId(5)
    expect(useChatStore.getState().activeChatId).toBe(5)
  })

  it('setMessages сохраняет сообщения проекта', () => {
    useChatStore.getState().setMessages(1, [MSG])
    expect(useChatStore.getState().messages[1]).toHaveLength(1)
    expect(useChatStore.getState().messages[1][0].text).toBe('Привет')
  })

  it('addMessage добавляет сообщение', () => {
    useChatStore.getState().addMessage(1, MSG)
    expect(useChatStore.getState().messages[1]).toHaveLength(1)

    // Дубликат не добавляется
    useChatStore.getState().addMessage(1, MSG)
    expect(useChatStore.getState().messages[1]).toHaveLength(1)
  })

  it('getUnreadCount считает непрочитанные от других', () => {
    useChatStore.getState().setMessages(1, [
      { id: 1, projectId: 1, senderId: 2, text: 'от менеджера', isRead: false, createdAt: '' },
      { id: 2, projectId: 1, senderId: 1, text: 'моё', isRead: false, createdAt: '' },
    ])

    const count = useChatStore.getState().getUnreadCount(1, 1)
    expect(count).toBe(1) // только сообщение от senderId=2
  })

  it('markMessagesAsReadLocally помечает прочитанными', () => {
    useChatStore.getState().setMessages(1, [
      { id: 1, projectId: 1, senderId: 2, text: 'от менеджера', isRead: false, createdAt: '' },
    ])

    useChatStore.getState().markMessagesAsReadLocally(1, 1)

    const msgs = useChatStore.getState().messages[1]
    expect(msgs[0].isRead).toBe(true)
  })

  it('setLoading', () => {
    useChatStore.getState().setLoading(true)
    expect(useChatStore.getState().loading).toBe(true)
  })
})
