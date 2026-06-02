# BroadcastChannel API — синхронизация вкладок

`src/lib/broadcast.ts` — обёртка над BroadcastChannel API для синхронизации состояния между вкладками браузера.

## Архитектура

```
Канал: b2b-portal-sync
Тип сообщения: entity_saved
Поля: { entityType, entityId?, action, timestamp }
```

## Паттерн использования

### 1. Отправить после успешного сохранения (broadcastSaved)

```typescript
import { broadcastSaved } from '../../../lib/broadcast';

// После create/update/delete:
broadcastSaved('equipment', 'created');
broadcastSaved('equipment', 'updated', item.id);
broadcastSaved('equipment', 'deleted', item.id);
```

### 2. Подписаться и закрыть форму / обновить данные (listenBroadcastSaved)

```typescript
import { listenBroadcastSaved } from '../../../lib/broadcast';

useEffect(() => {
  return listenBroadcastSaved((msg) => {
    if (msg.entityType === 'equipment' && modalOpen) {
      // Закрыть модалку + обновить данные
      setModalOpen(false);
      fetchData();
    }
  });
}, [modalOpen, fetchData]);
```

### 3. Альтернатива — invalidate кеша TanStack Query

Для списков лучше инвалидировать кеш, чем перезапрашивать:

```typescript
useEffect(() => {
  return listenBroadcastSaved((msg) => {
    if (msg.entityType === 'user') {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    }
  });
}, [queryClient]);
```

## Где уже внедрено

| Компонент | Отправляет | Слушает | Действие |
|-----------|-----------|---------|----------|
| DynamicProjectForm | `project created/updated` | — | — |
| EquipmentRegister | `equipment created/updated/deleted` | `equipment` | Закрыть модалку + refetch |
| ManagerNews | `news created/updated/deleted` | `news` | Закрыть модалки + refetch |
| ManagerBroadcast | `broadcast created` | — | — |
| AdminCreateUser | `user created` | `user` | Закрыть форму (onCancel) |
| useDeleteUser (hook) | `user deleted` | — | — |
| useToggleBlock (hook) | `user updated` | — | — |
| UsersList | — | `user` | invalidateQueries |
| UserDashboard | — | `project` | Закрыть форму |
| ManagerDashboard | — | `equipment, news, project, broadcast` | Логирование |
| AdminDashboard | — | `user, setting` | Логирование |

## Типы сущностей (entityType)

- `project` — проекты/заказы
- `equipment` — оборудование
- `news` — новости
- `broadcast` — рассылки
- `user` — пользователи
- `setting` — настройки портала (контакты, брендинг)

## Типы действий (action)

- `created` — создание
- `updated` — изменение
- `deleted` — удаление

## Важные моменты

1. **broadcastSaved синхронный** — не ждёт ответа, fire-and-forget
2. **listenBroadcastSaved возвращает cleanup** — вставлять в `useEffect` return
3. **BroadcastChannel не поддерживается в Safari < 15.4** — на старых айфонах не работает, ошибка игнорируется
4. **localStorage shared** — все вкладки одного домена читают один localStorage, Zustand persist синхронизируется автоматически
5. **BroadcastChannel vs Socket.IO** — Socket.IO для данных, которые шлёт сервер (статус проекта, блокировка). BroadcastChannel для данных, которые меняет сам пользователь в другой вкладке.
