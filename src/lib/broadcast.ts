/**
 * BroadcastChannel API — синхронизация между вкладками браузера.
 * Позволяет:
 * - Закрывать формы в других вкладках после сохранения
 * - Избегать дубликатов при работе в нескольких вкладках
 *
 * Использование:
 *   broadcastSaved({ entityType: 'project', action: 'created' })
 *   useBroadcastSaved((msg) => { if (msg.entityType === 'project') closeForm() })
 */

const CHANNEL_NAME = 'b2b-portal-sync';

interface BroadcastMessage {
  type: 'entity_saved';
  entityType: string;
  entityId?: number;
  action: 'created' | 'updated' | 'deleted';
  timestamp: number;
}

/** Событие авторизации — показывать модалки во всех вкладках */
export function broadcastAuth(authType: 'session_superseded' | 'user_blocked' | 'session_expired' | 'logout') {
  try {
    const ch = getChannel();
    if (!ch) return;
    ch.postMessage({ type: 'auth_event', authType, timestamp: Date.now() });
  } catch {}
}

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

/** Отправить сообщение о сохранении сущности */
export function broadcastSaved(
  entityType: string,
  action: 'created' | 'updated' | 'deleted',
  entityId?: number,
) {
  try {
    const ch = getChannel();
    if (!ch) return;
    ch.postMessage({ type: 'entity_saved', entityType, entityId, action, timestamp: Date.now() } as BroadcastMessage);
  } catch {
    // игнорируем если BroadcastChannel не поддерживается
  }
}

/** Подписка на все сообщения BroadcastChannel */
export function listenBroadcast(callback: (msg: any) => void): () => void {
  const ch = getChannel();
  if (!ch) return () => {};

  const handler = (event: MessageEvent) => callback(event.data);
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}

/** Подписка на сохранения сущностей */
export function listenBroadcastSaved(callback: (msg: BroadcastMessage) => void): () => void {
  const ch = getChannel();
  if (!ch) return () => {};

  const handler = (event: MessageEvent) => {
    const msg = event.data as BroadcastMessage;
    if (msg?.type === 'entity_saved') {
      callback(msg);
    }
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}
