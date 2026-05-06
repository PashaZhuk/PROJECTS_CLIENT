# 📦 Экспорт проекта: client

## 🌳 Структура проекта
```
📁 D:\2025\PROJECTS claude version\client/
  📄 README.md
  📄 eslint.config.js
  📄 export_for_ai.py
  📄 index.html
  📄 package-lock.json
  📄 package.json
  📄 project_for_ai.md
  📄 tsconfig.app.json
  📄 tsconfig.json
  📄 tsconfig.node.json
  📄 vite.config.ts
  📁 public/
    📄 vite.svg
  📁 src/
    📄 App.css
    📄 App.tsx
    📄 main.tsx
    📁 api/
      📄 auth.ts
      📄 ky.ts
      📄 projects.ts
      📄 socket.ts
      📄 user.ts
    📁 assets/
      📄 logo.webp
    📁 components/
      📁 auth/
        📄 ForcePasswordChange.tsx
        📄 ProtectedRoute.tsx
      📁 dashboard/
        📁 admin/
          📄 AdminCreateUser.tsx
          📄 AdminOverview.tsx
          📄 LogsViewer.tsx
          📄 UsersList.tsx
        📁 forms/
          📄 DynamicProjectForm.tsx
        📁 shared/
          📄 ChatDrawer.tsx
          📄 NewsCards.tsx
          📄 ProjectRow.tsx
          📄 ProjectsListView.tsx
          📄 StatCardStatus.tsx
          📄 StatsView.tsx
          📄 UIHelpers.tsx
      📁 layouts/
        📄 DashboardLayout.tsx
        📄 Sidebar.tsx
      📁 ui/
        📄 Footer.tsx
        📄 Header.tsx
        📄 LockedModal.tsx
        📄 SessionExpiredModal.tsx
        📄 SessionSupersededModal.tsx
    📁 config/
      📄 projectFields.ts
    📁 hooks/
      📄 useChatLogic.ts
      📄 useGlobalChatLoader.ts
      📄 useProjectSockets.ts
      📄 useSessionManager.ts
      📄 useUserSockets.ts
    📁 pages/
      📄 AdminDashboard.tsx
      📄 LoginPage.tsx
      📄 ManagerDashboard.tsx
      📄 ResetPasswordPage.tsx
      📄 UserDashboard.tsx
      📁 dashboard/
        📄 DashboardDispatcher.tsx
    📁 schemas/
      📄 passwordSchema.ts
      📄 userSchema.ts
    📁 store/
      📄 useAuthStore.ts
      📄 useChatStore.ts
      📄 useProjectStore.ts
      📄 useUserStore.ts
    📁 types/
      📄 index.ts
```

## 📝 Содержимое файлов

> 💡 **Для ИИ:** Это React + TypeScript + Vite приложение. Анализируй: типы, API вызовы (ky), состояние (store), роутинг (pages), компоненты.

### 📄 `.gitignore`
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local
.env
# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### 📄 `README.md`
```markdown
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Projects_client
```

### 📄 `eslint.config.js`
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

### 📄 `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/assets/logo.webp" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>B2B IPMATIKA Bel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 📄 `package.json`
```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@tailwindcss/vite": "^4.1.18",
    "@tanstack/react-query": "^5.90.21",
    "dotenv": "^17.2.3",
    "ky": "^1.14.3",
    "lucide-react": "^0.562.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.72.1",
    "react-router-dom": "^7.12.0",
    "socket.io-client": "^4.8.3",
    "tailwindcss": "^4.1.18",
    "zod": "^4.3.6",
    "zustand": "^5.0.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.9",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
```

### 📄 `project_for_ai.md`
```markdown

```

### 📄 `tsconfig.app.json`
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### 📄 `tsconfig.json`
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "types": ["node"]
  }
}
```

### 📄 `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": false,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 📄 `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {host: '0.0.0.0'},
  plugins: [react(), tailwindcss()],
})
```

### 📄 `src\App.css`
```css
@import "tailwindcss"
```

### 📄 `src\App.tsx`
```typescript
import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Stores & Hooks
import { useAuthStore } from './store/useAuthStore';
import { useSessionManager } from './hooks/useSessionManager';

// Layouts & Pages
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForcePasswordChange from './components/auth/ForcePasswordChange';
import DashboardDispatcher from './pages/dashboard/DashboardDispatcher';

// Modals
import SessionExpiredModal from './components/ui/SessionExpiredModal';
import SessionSupersededModal from './components/ui/SessionSupersededModal';
import LockedModal from './components/ui/LockedModal';

const AppContent = () => {
  const { 
    user, 
    isAuthenticated, 
    isInitialized, 
    _hasHydrated, 
    isLoading, 
    checkAuth,
    isSessionExpired,
    isSessionSuperseded,
    isUserBlocked,
    setSessionExpired,
    setSessionSuperseded,
    setUserBlocked
  } = useAuthStore();

  // Реф, чтобы не спамить проверкой авторизации
  const authChecked = useRef(false);

  // Запускаем менеджер сессий
  useSessionManager();

  // Проверка авторизации: строго после гидрации и только один раз
  useEffect(() => {
    if (_hasHydrated && !authChecked.current) {
      checkAuth();
      authChecked.current = true;
    }
  }, [_hasHydrated, checkAuth]);

  // Экраны загрузки
  if (!_hasHydrated || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 text-sm animate-pulse">Проверка сессии...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <SessionExpiredModal />
      <SessionSupersededModal />
      <LockedModal 
        isOpen={isUserBlocked}
        onClose={() => setUserBlocked(false)}
        lockUntil={null}
        message="Ваш аккаунт заблокирован администратором. Обратитесь в поддержку."
        title="Аккаунт заблокирован"
      />

      <Header />
      
      <main className="grow flex flex-col">
        {isAuthenticated && user?.mustChangePassword ? (
          <ForcePasswordChange />
        ) : (
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/reset-password" 
              element={<ResetPasswordPage />} 
            />
            <Route 
              path="/" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardDispatcher />} />
              </Route>
            </Route>
            <Route path="/unauthorized" element={
              <div className="grow flex items-center justify-center text-center p-10">
                <h1 className="text-xl font-bold text-red-600 uppercase tracking-widest">Доступ запрещен</h1>
              </div>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
```

### 📄 `src\main.tsx`
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 📄 `src\api\auth.ts`
```typescript
import api from './ky';

const authApi = {
  login: (data: any) => api.post('auth/login', { json: data }).json(),
  logout: (reason: 'manual' | 'inactivity' = 'manual', userId?: string) =>
    api.post('auth/logout', { json: { reason, userId } }).json(),
  profile: () => api.get('auth/profile').json(),
  forgotPassword: (email: string) => api.post('auth/forgot-password', { json: { email } }).json(),
  resetPassword: (token: string, newPassword: string) => api.post('auth/reset-password', { json: { token, newPassword } }).json(),
  
  // 🔥 2FA Methods
  send2FACode: (userId: number) => api.post('auth/2fa/send', { json: { userId } }).json(),
  verify2FACode: (userId: number, code: string) => api.post('auth/2fa/verify', { json: { userId, code } }).json(),
};

export default authApi;
```

### 📄 `src\api\ky.ts`
```typescript
import ky from 'ky';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include',
  timeout: 20000,
  hooks: {
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401 || response.status === 403) {
          const url = request.url;
          if (url.includes('/auth/profile')) return;

          try {
            const errorBody = await response.clone().json();
            const { isAuthenticated, setSessionExpired, setSessionSuperseded, setUserBlocked } = useAuthStore.getState();

            if (!isAuthenticated) return;

            if (errorBody.code === "USER_BLOCKED") {
              setUserBlocked(true);
            } else if (errorBody.code === "SESSION_SUPERSEDED") {
              setSessionSuperseded(true);
            } else if (errorBody.code === "SESSION_EXPIRED") {
              setSessionExpired(true);
            } else {
              useAuthStore.getState().logout();
            }
          } catch (e) {
            useAuthStore.getState().logout();
          }
        }
      }
    ]
  }
});

export default api;
```

### 📄 `src\api\projects.ts`
```typescript
import api from './ky';
import type { Project } from '../types';

interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

const projectApi = {
  getProjects: (page: number, search: string) =>
    api.get('projects', {
      searchParams: { page: page.toString(), search }
    }).json<ProjectsResponse>(),

  getProjectById: (id: number) =>
    api.get(`projects/${id}`).json<Project>(),

  createProject: (data: any) =>
    api.post('projects', { json: data }).json<Project>(),

  updateProject: (id: number, data: any) =>
    api.put(`projects/${id}`, { json: data }).json<Project>(),

  deleteProject: (id: number) =>
    api.delete(`projects/${id}`).json<{ success: boolean; message?: string }>(),

  updateStatus: (id: number, status: string) =>
    api.patch(`projects/${id}/status`, { json: { status } }).json<Project>(),
};

export default projectApi;
```

### 📄 `src\api\socket.ts`
```typescript
import { io, Socket } from 'socket.io-client';

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

export const initSocket = (): Socket => {
  // Если уже есть активное соединение, возвращаем его
  if (socket && socket.connected) {
    return socket;
  }
  // Если есть отключённый экземпляр, переподключаем с включённым reconnection
  if (socket) {
    socket.io?.reconnection(true);
    socket.connect();
    return socket;
  }
  // Создаём новое соединение
  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    // Отключаем авто-переподключение, чтобы после разлогина не восстанавливалось
    socket.io?.reconnection(false);
    socket.removeAllListeners(); // очищаем обработчики, чтобы не было утечек
    socket.disconnect();
    socket = null;
  }
};

// Для обратной совместимости, но рекомендуется использовать getSocket / initSocket
export { socket };
```

### 📄 `src\api\user.ts`
```typescript
import api from './ky';

const userApi = {
  getAllUsers: (params?: any) =>
    api.get('user/users', { searchParams: params }).json(),

  register: (data: any) =>
    api.post('auth/register', { json: data }).json(),

  deleteUser: (id: number) =>
    api.delete(`user/users/${id}`).json(),

  changePw: (data: any) =>
    api.post('user/change-password', { json: data }).json(),

  getAdminStats: () =>
    api.get('user/admin/stats').json(),

  updateUser: (id: number, data: any) =>
    api.put(`user/users/${id}`, { json: data }).json(),

  toggleBlock: (id: number) =>
    api.patch(`user/users/${id}/block`).json<{ isBlocked: boolean }>(),
};

export default userApi;
```

### 📄 `src\components\auth\ForcePasswordChange.tsx`
```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import userAPI from '../../api/user';
import { useAuthStore } from '../../store/useAuthStore';
import { KeyRound, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { forceChangePasswordSchema, type ForceChangePasswordFormData } from '../../schemas/passwordSchema';

const ForcePasswordChange = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setError, 
    clearErrors 
  } = useForm<ForceChangePasswordFormData>({
    resolver: zodResolver(forceChangePasswordSchema),
    mode: 'onChange', // Валидировать при изменении полей (чтобы убирать ошибку сразу)
  });

  const onSubmit = async (data: ForceChangePasswordFormData) => {
    try {
      // Отправляем только новый пароль, confirm уже проверен схемой и не нужен серверу
      await userAPI.changePw({ newPassword: data.newPassword });

      // Обновляем стейт пользователя: флаг mustChangePassword больше не нужен
      if (user) {
        setUser({ ...user, mustChangePassword: false });
      }
    } catch (err: any) {
      console.error('Change password error:', err);
      
      let errorMessage = 'Сетевая ошибка. Попробуйте позже.';
      if (err.response) {
        const errorData = await err.response.json().catch(() => ({}));
        errorMessage = errorData.message || errorData.error || 'Ошибка при смене пароля';
      }

      // Устанавливаем общую ошибку формы (корневую)
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full animate-in zoom-in duration-300 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
            <ShieldAlert size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 text-center">
          Безопасность прежде всего
        </h2>
        <p className="text-slate-500 mb-8 text-sm font-medium text-center leading-relaxed">
          Администратор создал для вас аккаунт с временным паролем. Пожалуйста, установите свой личный пароль.
        </p>

        {/* ОШИБКА ФОРМЫ (SERVER ERROR) */}
        {errors.root && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
            <ShieldAlert size={14} /> {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          
          {/* НОВЫЙ ПАРОЛЬ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Новый пароль
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                {...register('newPassword')}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none transition-all font-mono ${
                  errors.newPassword ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-[10px] font-bold ml-1 uppercase tracking-wide">{errors.newPassword.message}</p>
            )}
          </div>

          {/* ПОДТВЕРЖДЕНИЕ ПАРОЛЯ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Подтвердите пароль
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none transition-all font-mono ${
                  errors.confirmPassword ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px] font-bold ml-1 uppercase tracking-wide">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="animate-spin" size={16} /> Обработка...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Обновить и войти
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;
```

### 📄 `src\components\auth\ProtectedRoute.tsx`
```typescript
import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // К этому моменту App.tsx уже гарантировал что _hasHydrated=true и isInitialized=true,
  // поэтому здесь достаточно просто проверить isAuthenticated.

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
```

### 📄 `src\components\dashboard\admin\AdminCreateUser.tsx`
```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Key, RefreshCw, Check, Briefcase, Building2, ShieldCheck, Phone, AlertCircle, User } from 'lucide-react';
import { useUserStore } from '../../../store/useUserStore';
import { userFormSchema, type UserFormData } from '../../../schemas/userSchema';

interface CreateUserProps {
  onCancel: () => void;
}

const AdminCreateUser = ({ onCancel }: CreateUserProps) => {
  const { createUser, loading } = useUserStore();
  const [serverError, setServerError] = useState('');

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors }, 
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: 'USER',
      name: '',
      email: '',
      password: '',
      companyName: '',
      unp: '',
      phone: '+375',
    }
  });

  const roleValue = watch('role');
  const phoneValue = watch('phone');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('password', pass, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) val = '375';
    if (!val.startsWith('375')) val = '375' + val;
    if (val.length > 12) val = val.slice(0, 12);
    setValue('phone', '+' + val, { shouldValidate: true });
  };

  const onSubmit = async (data: UserFormData) => {
    setServerError('');
    const payload: any = { ...data };

    // Если это Партнер (USER), убираем ФИО, если оно пустое (или всегда, если оно не нужно серверу)
    if (data.role === 'USER') {
      delete payload.name; // Убираем ФИО для партнера
      // Оставляем companyName, unp, phone
    } else {
      // Для менеджера убираем поля партнера
      delete payload.companyName;
      delete payload.unp;
      delete payload.phone;
    }

    try {
      await createUser(payload);
      onCancel();
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Регистрация</h2>
        <ShieldCheck className="text-slate-200" size={32} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
        {serverError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
            <AlertCircle size={14} /> {serverError}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* РОЛЬ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Роль в системе</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                {...register('role')}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-slate-900 transition-all appearance-none"
              >
                {/* 🔥 ИЗМЕНЕНИЕ: Текст заменен на ПАРТНЕР */}
                <option value="USER">ПАРТНЕР</option>
                <option value="MANAGER">МЕНЕДЖЕР</option>
              </select>
            </div>
            {errors.role && <span className="text-red-500 text-xs font-bold">{errors.role.message}</span>}
          </div>

          {/* 🔥 ИЗМЕНЕНИЕ: ФИО показываем ТОЛЬКО для Менеджера */}
          {(roleValue === 'MANAGER' || roleValue === 'ADMIN') && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">ФИО</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('name')}
                  placeholder="Иван Иванов"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium ${errors.name ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              {errors.name && <span className="text-red-500 text-xs font-bold">{errors.name.message}</span>}
            </div>
          )}
        </div>

        {/* ПОЛЯ ТОЛЬКО ДЛЯ ПАРТНЕРА (USER) */}
        {roleValue === 'USER' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Компания</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('companyName')}
                  placeholder='ООО "Название"'
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium ${errors.companyName ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              {errors.companyName && <span className="text-red-500 text-xs font-bold">{errors.companyName.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">УНП</label>
              <input 
                {...register('unp')}
                placeholder="123456789"
                maxLength={9}
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold tracking-tighter ${errors.unp ? 'ring-2 ring-red-500' : ''}`} 
              />
              {errors.unp && <span className="text-red-500 text-xs font-bold">{errors.unp.message}</span>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Телефон (для 2FA)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('phone')}
                  onChange={handlePhoneChange}
                  value={phoneValue}
                  placeholder="+375XXXXXXXXX"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-mono font-bold ${errors.phone ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              {errors.phone && <span className="text-red-500 text-xs font-bold">{errors.phone.message}</span>}
            </div>
          </div>
        )}

        {/* EMAIL И ПАРОЛЬ (Одинаковы для всех) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                {...register('email')}
                type="email"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium ${errors.email ? 'ring-2 ring-red-500' : ''}`} 
              />
            </div>
            {errors.email && <span className="text-red-500 text-xs font-bold">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Временный пароль</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('password')}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-mono ${errors.password ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              <button 
                type="button" 
                onClick={generatePassword} 
                className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs font-bold">{errors.password.message}</span>}
          </div>
        </div>

        {/* КНОПКИ */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <><Check size={16}/> Создать аккаунт</>}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-10 py-5 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateUser;
```

### 📄 `src\components\dashboard\admin\AdminOverview.tsx`
```typescript
import { ShieldCheck, Activity } from 'lucide-react';
import { StatCard, ServerStatus } from '../shared/StatCardStatus';

const AdminOverview = ({ stats, loading, isOnline, onRefresh }: any) => {
  if (!stats) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          {/* <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Root <span className="text-purple-600">Administrator</span>
          </h1> */}
          {/* <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 flex items-center gap-2">
            <Activity size={12} className={isOnline ? 'text-emerald-500' : 'text-red-500'} />
            Мониторинг системы: {isOnline ? 'АКТИВЕН' : 'СВЯЗЬ ПОТЕРЯНА'}
          </p> */}
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-4 bg-white border border-slate-200 rounded-3xl text-slate-400 hover:text-purple-600 shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          Обновить данные
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard
          title="Всего пользователей"
          value={stats.totalUsers}
          icon={<Activity className="text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Сейчас в сети"
          value={stats.onlineCount}
          icon={<Activity className="text-emerald-600" />}
          color="emerald"
          subtitle={
            <div className="flex gap-4 mt-4 pt-4 border-t border-emerald-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-black">
                Пользователи: {stats.details.onlineUsers}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-black border-l border-emerald-100/30 pl-4">
                Менеджеры: {stats.details.onlineManagers}
              </span>
            </div>
          }
        />
      </div>

      {/* Состояние узлов — один блок, без дублирования */}
      {/* <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider mb-8">
          <ShieldCheck size={24} className="text-purple-500" /> Состояние узлов управления
        </h3> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServerStatus label="API Сервер" isOnline={isOnline} />
          <ServerStatus label="База данных" isOnline={isOnline} />
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default AdminOverview;
```

### 📄 `src\components\dashboard\admin\LogsViewer.tsx`
```typescript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, AlertCircle, Info, AlertTriangle, RefreshCw, Calendar, X } from 'lucide-react';
import api from '../../../api/ky';

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  userId?: number;
  email?: string;
  name?: string;
  ip?: string;
  [key: string]: any;
}

const levelColors = {
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  warn: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  error: 'bg-red-100 text-red-700 border-red-200',
};

const levelIcons = {
  info: <Info size={16} />,
  warn: <AlertTriangle size={16} />,
  error: <AlertCircle size={16} />,
};

// Вспомогательные функции для работы с датами
const toDisplayDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
};

const toIsoDate = (displayDate: string): string => {
  const match = displayDate.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return '';
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const LogsViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [level, setLevel] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [displayDate, setDisplayDate] = useState<string>(toDisplayDate(selectedDate));
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const datePickerRef = useRef<HTMLInputElement>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (level) params.append('level', level);
      if (search) params.append('search', search);
      if (selectedDate) params.append('date', selectedDate);
      params.append('limit', '500');
      const response: any = await api.get(`admin/logs?${params.toString()}`).json();
      setLogs(response.logs || []);
      setTotal(response.returned || 0);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }, [level, search, selectedDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Срабатывает при выборе даты в нативном календаре
  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIso = e.target.value;
    if (newIso) {
      setSelectedDate(newIso);
      setDisplayDate(toDisplayDate(newIso));
    }
  };

  // Срабатывает при ручном вводе ДД.ММ.ГГГГ
  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    
    let formatted = '';
    if (raw.length > 0) {
      formatted = raw.slice(0, 2);
      if (raw.length > 2) formatted += '.' + raw.slice(2, 4);
      if (raw.length > 4) formatted += '.' + raw.slice(4, 8);
    }
    
    setDisplayDate(formatted);

    // Если введена полная дата, обновляем системное состояние
    if (raw.length === 8) {
      const iso = toIsoDate(formatted);
      if (iso && !isNaN(new Date(iso).getTime())) {
        setSelectedDate(iso);
      }
    }
  };

  const handleManualDateBlur = () => {
    // Если формат неверный при выходе из поля, возвращаем текущую выбранную дату
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(displayDate)) {
      setDisplayDate(toDisplayDate(selectedDate));
    }
  };

  const openCalendar = () => {
    // Вызываем нативный пикер
    if (datePickerRef.current) {
      try {
        // Современный метод для браузеров
        if ('showPicker' in HTMLInputElement.prototype) {
          datePickerRef.current.showPicker();
        } else {
          datePickerRef.current.click();
        }
      } catch (err) {
        datePickerRef.current.click();
      }
    }
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Логи системы</h2>
          <p className="text-sm text-slate-500 mt-1">Последние события и ошибки</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            title="Обновить"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по логам (по тексту)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative w-44">
          {/* Скрытый нативный инпут, смещенный под иконку */}
          <input
            ref={datePickerRef}
            type="date"
            value={selectedDate}
            onChange={handleNativeDateChange}
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            style={{ top: '50%', left: '20px' }}
          />
          
          <div className="relative flex items-center">
            {/* Иконка теперь кликабельна */}
            <button 
              type="button"
              onClick={openCalendar}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors z-10"
            >
              <Calendar size={18} />
            </button>
            <input
              type="text"
              placeholder="ДД.ММ.ГГГГ"
              value={displayDate}
              onChange={handleManualDateChange}
              onBlur={handleManualDateBlur}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {['', 'info', 'warn', 'error'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                level === lvl 
                  ? (lvl === '' ? 'bg-slate-900 text-white' : 
                     lvl === 'info' ? 'bg-blue-600 text-white' : 
                     lvl === 'warn' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white')
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === '' ? 'Все' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        {loading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="animate-spin text-slate-400" size={32} />
          </div>
        )}
        {!loading && logs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Логи не найдены
          </div>
        )}
        {!loading && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 ${levelColors[log.level]} bg-opacity-30`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{levelIcons[log.level]}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 text-xs font-mono mb-2">
                      <span className="text-slate-500">{formatTimestamp(log.timestamp)}</span>
                      {log.userId && <span className="text-slate-500">User ID: {log.userId}</span>}
                      {log.name && <span className="text-slate-500">Имя: {log.name}</span>}
                      {log.email && <span className="text-slate-500">Email: {log.email}</span>}
                      {log.ip && <span className="text-slate-500">IP: {log.ip}</span>}
                    </div>
                    <div className="text-sm font-medium break-words">
                      {log.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-right text-xs text-slate-400 pt-4">
              Показано {logs.length} из {total} (последних)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsViewer;
```

### 📄 `src\components\dashboard\admin\UsersList.tsx`
```typescript
import { useEffect } from 'react';
import { Mail, Trash2, Search, ChevronLeft, ChevronRight, RefreshCw, UserCheck, Ban, CheckCircle, Lock, AlertTriangle, KeyRound } from 'lucide-react';
import { useUserStore } from '../../../store/useUserStore';

const UsersList = () => {
  const {
    users, loading, searchQuery, setSearchQuery,
    currentPage, totalPages, fetchUsers, deleteUser, setCurrentPage, toggleBlock
  } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => { fetchUsers(); }, 400);
    return () => clearTimeout(timer);
  }, [fetchUsers, currentPage, searchQuery]);

  // 🔥 УНИВЕРСАЛЬНЫЙ ХЕЛПЕР ДЛЯ ПРОВЕРКИ ВСЕХ ТИПОВ БЛОКИРОВОК
  const getLockInfo = (user: any) => {
    const now = new Date();
    
    // 1. Проверка блокировки входа (Пароль)
    if (user.lockUntil) {
      const lockTime = new Date(user.lockUntil);
      if (lockTime > now) {
        const minutesLeft = Math.ceil((lockTime.getTime() - now.getTime()) / 60000);
        return { type: 'LOGIN', minutesLeft, attempts: user.failedLoginAttempts || 0 };
      }
    }
    
    // 2. Проверка блокировки 2FA (SMS)
    if (user.twoFactorLockUntil) {
      const lockTime = new Date(user.twoFactorLockUntil);
      if (lockTime > now) {
        const minutesLeft = Math.ceil((lockTime.getTime() - now.getTime()) / 60000);
        return { type: '2FA', minutesLeft, attempts: user.twoFactorAttempts || 0 };
      }
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">

      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Поиск по имени, email или компании..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-sm font-medium"
          />
        </div>
        {loading && <RefreshCw className="animate-spin text-slate-300" size={20} />}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-10 py-5 italic text-slate-500">Пользователь</th>
              <th className="px-6 py-5">Роль</th>
              <th className="px-6 py-5">Компания / УНП</th>
              <th className="px-10 py-5 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-slate-100 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {users.length > 0 ? (
              users.map(user => {
                const lockInfo = getLockInfo(user);
                const isSystemLocked = !!lockInfo;
                const isManuallyBlocked = user.isBlocked && !isSystemLocked;
                const isAnyBlocked = isSystemLocked || user.isBlocked;

                return (
                  <tr key={user.id} className={`border-b border-slate-100 transition-colors group ${isAnyBlocked ? 'bg-red-50/30' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                            isAnyBlocked ? 'bg-red-100 text-red-400' :
                            user.role === 'ADMIN' ? 'bg-slate-900 text-white' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {user.name[0].toUpperCase()}
                          </div>
                          
                          {/* Индикатор онлайна */}
                          {user.isOnline && !isAnyBlocked && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full animate-pulse" title="Онлайн" />
                          )}

                          {/* Индикатор блокировки с разными цветами для разных типов */}
                          {isAnyBlocked && (
                            <span className={`absolute -top-1 -right-1 w-4 h-4 border-4 border-white rounded-full flex items-center justify-center ${
                              lockInfo?.type === 'LOGIN' ? 'bg-red-600' :
                              lockInfo?.type === '2FA' ? 'bg-purple-600' : 'bg-slate-800'
                            }`} title={
                              lockInfo?.type === 'LOGIN' ? "Блокировка: Неверный пароль" :
                              lockInfo?.type === '2FA' ? "Блокировка: Неверный SMS код" : 
                              "Заблокирован админом"
                            }>
                              {lockInfo?.type === 'LOGIN' ? <AlertTriangle size={10} className="text-white" /> :
                               lockInfo?.type === '2FA' ? <KeyRound size={10} className="text-white" /> :
                               <Ban size={10} className="text-white" />}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="font-black text-slate-900 text-sm uppercase italic tracking-tight flex items-center gap-2 flex-wrap">
                            {user.name}
                            {user.role === 'ADMIN' && <UserCheck size={14} className="text-blue-500" />}
                            
                            {/* Бейдж блокировки */}
                            {lockInfo?.type === 'LOGIN' && (
                              <span className="text-[9px] font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg uppercase tracking-widest flex items-center gap-1">
                                <Lock size={10} /> Пароль ({lockInfo.minutesLeft} мин)
                              </span>
                            )}
                            {lockInfo?.type === '2FA' && (
                              <span className="text-[9px] font-black text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-lg uppercase tracking-widest flex items-center gap-1">
                                <KeyRound size={10} /> SMS ({lockInfo.minutesLeft} мин)
                              </span>
                            )}
                            {isManuallyBlocked && (
                              <span className="text-[9px] font-black text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                                Заблокирован
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                            <Mail size={10} /> {user.email}
                          </div>
                          </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        user.role === 'ADMIN' ? 'bg-slate-900 text-white border-slate-900' :
                        user.role === 'MANAGER' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-6">
                      <div className="text-xs font-bold text-slate-600">{user.companyName || '—'}</div>
                      {user.unp && <div className="text-[9px] text-slate-400 font-black tracking-widest mt-0.5">УНП: {user.unp}</div>}
                    </td>

                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* КНОПКА БЛОКИРОВКИ / РАЗБЛОКИРОВКИ */}
                        <button
                          onClick={() => toggleBlock(user.id)}
                          disabled={user.role === 'ADMIN'}
                          title={
                            lockInfo?.type === 'LOGIN' ? "Снять блокировку входа" :
                            lockInfo?.type === '2FA' ? "Снять блокировку 2FA" :
                            user.isBlocked ? "Разблокировать" : "Заблокировать"
                          }
                          className={`p-3 rounded-xl transition-all disabled:opacity-0 ${
                            isAnyBlocked
                              ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                              : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50 border border-transparent'
                          }`}
                        >
                          {isAnyBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                        </button>

                        {/* КНОПКА УДАЛЕНИЯ */}
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={user.role === 'ADMIN'}
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0 border border-transparent"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : !loading && (
              <tr>
                <td colSpan={4} className="px-10 py-20 text-center">
                  <div className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Пользователи не найдены</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Стр {currentPage} из {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
```

### 📄 `src\components\dashboard\forms\DynamicProjectForm.tsx`
```typescript
import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Plus, Trash2, Save, Calendar, ChevronDown, Loader2, CheckCircle2
} from 'lucide-react';
import { PROJECT_CATEGORIES } from '../../../config/projectFields';
import { useAuthStore } from '../../../store/useAuthStore';
import projectApi from '../../../api/projects';
import type { Project } from '../../../types';

const PLACEHOLDERS: Record<string, string> = {
  customerName: 'ООО "Вектор Плюс"',
  customerInn: '123456789',
  purchasingOrg: 'ОАО "Тендер-Закупки"',
  purchasingInn: '987654321',
  customerWebsite: 'www.client-site.by',
  installationAddr: 'г. Минск, ул. Тимирязева, 67',
  ipAtcType: 'Asterisk / Yeastar S100',
  currentTelephony: 'Аналоговые телефоны Panasonic',
  industry: 'Розничная торговля / Госсектор',
  competitors: 'Cisco, Grandstream',
  keyRequirements: 'Поддержка PoE, запись звонков на SD-карту',
  additionalEquipment: 'Гарнитуры Yealink UH34, блоки питания',
  plannedActions: 'Встреча в офисе заказчика, выдача демо-фонда',
};

// Человекочитаемые названия категорий для кнопок выбора
const CATEGORY_LABELS: Record<string, string> = {
  YEALINK_PHONES: 'Yealink / IP-Телефония',
  NETWORKING: 'Networking / Сетевое оборудование',
  VIDEO_CONFERENCE: 'Video / ВКС системы',
};

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Project | null;
}

const DynamicProjectForm = ({ onClose, onSuccess, initialData }: Props) => {
  const user = useAuthStore((state) => state.user);
  const isEditing = !!initialData;

  // Определяем начальную категорию
  const defaultCategory = (initialData as any)?.formType
    || (initialData as any)?.category
    || Object.keys(PROJECT_CATEGORIES)[0];

  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получаем плоский список полей для выбранной категории
  const allFields = useMemo(
    () => PROJECT_CATEGORIES[selectedCategory] || [],
    [selectedCategory]
  );

  // Группируем поля по секциям
  const sections = useMemo(() => {
    const groups: Record<string, typeof allFields> = {};
    allFields.forEach((field) => {
      const s = field.section || 'Общая информация';
      if (!groups[s]) groups[s] = [];
      groups[s].push(field);
    });
    return Object.entries(groups);
  }, [allFields]);

  // Инициализируем formData при смене категории или при редактировании
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...(initialData.dynamicData as any || {}),
        customerName: initialData.customerName || '',
        customerInn: initialData.customerInn || (initialData as any).unp || '',
        purchaseMethod: (initialData as any).purchaseMethod || '',
        executionDate: initialData.updatedAt ? initialData.updatedAt.split('T')[0] : '',
      });
    } else {
      // Инициализируем пустые значения для всех полей
      const initial: Record<string, any> = {};
      allFields.forEach((field) => {
        initial[field.name] = field.type === 'items' ? [{ model: '', count: '' }] : '';
      });
      setFormData(initial);
    }
  }, [selectedCategory, isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (name: string, value: any) => {
    // Ограничиваем УНП/ИНН полями только цифрами, максимум 9
    if (name.toLowerCase().includes('inn') || name.toLowerCase() === 'unp') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 9) setFormData((prev) => ({ ...prev, [name]: digits }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // Обработчики для поля типа items (спецификация)
  const handleItemChange = (fieldName: string, index: number, subField: string, value: any) => {
    const items = Array.isArray(formData[fieldName]) ? [...formData[fieldName]] : [];
    items[index] = { ...items[index], [subField]: value };
    setFormData((prev) => ({ ...prev, [fieldName]: items }));
  };

  const addItem = (fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...(Array.isArray(prev[fieldName]) ? prev[fieldName] : []), { model: '', count: '' }],
    }));
  };

  const removeItem = (fieldName: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация УНП — ровно 9 цифр если заполнено
    const innFields = Object.keys(formData).filter(
      (k) => k.toLowerCase().includes('inn') || k.toLowerCase() === 'unp'
    );
    for (const key of innFields) {
      if (formData[key] && formData[key].length !== 9) {
        setError('Поле УНП/ИНН должно содержать ровно 9 цифр');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Формируем тело запроса в формате, который ожидает сервер
      const body = {
        ...formData,
        formType: selectedCategory,
        customerName: formData.customerName,
        customerInn: formData.customerInn || formData.unp,
        executionDate: formData.executionDate,
        purchaseMethod: formData.purchaseMethod,
      };

      if (isEditing && initialData) {
        await projectApi.updateProject(initialData.id, body);
      } else {
        await projectApi.createProject(body);
      }

      setIsSuccess(true);
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      let message = 'Ошибка при сохранении';
      if (err?.response) {
        try {
          const data = await err.response.json();
          message = data?.error || data?.message || message;
        } catch {
          // ignore parse error
        }
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Экран успеха
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">
            {isEditing ? 'Обновлено!' : 'Проект создан!'}
          </h2>
          <p className="text-slate-500 font-medium">Обновляем список проектов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">

        {/* Шапка */}
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm group"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {isEditing ? 'Редактирование проекта' : 'Новый проект'}
              </h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                {isEditing ? 'Внесите изменения и сохраните' : 'Выберите направление и заполните анкету'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Ошибка */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          {/* Выбор категории (только при создании) */}
          {!isEditing && (
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                Направление
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(PROJECT_CATEGORIES).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    className={`p-6 rounded-3xl border-2 transition-all text-left ${
                      selectedCategory === key
                        ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">
                      {CATEGORY_LABELS[key] || key}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Секции с полями */}
          {sections.map(([sectionTitle, fields], sIdx) => {
            const sectionNum = String(sIdx + 1).padStart(2, '0');
            const cleanTitle = sectionTitle.replace(/^\d+\.\s*/, '');

            return (
              <section
                key={sectionTitle}
                className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden"
              >
                <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-4 bg-white">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-blue-100">
                    {sectionNum}
                  </span>
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] italic">
                    {cleanTitle}
                  </h3>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => {
                    const isInn = field.name.toLowerCase().includes('inn') || field.name.toLowerCase() === 'unp';
                    const label = isInn ? field.label.replace('ИНН', 'УНП') : field.label;
                    const placeholder = field.placeholder || PLACEHOLDERS[field.name] || '';
                    const isWide = field.type === 'textarea' || field.type === 'items';

                    return (
                      <div
                        key={field.name}
                        className={`flex flex-col gap-2 ${isWide ? 'md:col-span-2' : ''}`}
                      >
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          {label}{field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {/* items — спецификация моделей */}
                        {field.type === 'items' && (
                          <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-200">
                            <div className="space-y-4">
                              {(Array.isArray(formData[field.name]) ? formData[field.name] : []).map(
                                (item: any, idx: number) => (
                                  <div key={idx} className="flex flex-col md:flex-row gap-3 items-end animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex-1 w-full">
                                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Модель</p>
                                      <div className="relative">
                                        <select
                                          required
                                          value={item.model || ''}
                                          onChange={(e) => handleItemChange(field.name, idx, 'model', e.target.value)}
                                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                                        >
                                          <option value="">Выберите модель...</option>
                                          {field.options?.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                      </div>
                                    </div>
                                    <div className="w-full md:w-32">
                                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Кол-во</p>
                                      <input
                                        type="number"
                                        required
                                        min="1"
                                        value={item.count || ''}
                                        onChange={(e) => handleItemChange(field.name, idx, 'count', e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
                                      />
                                    </div>
                                    {formData[field.name]?.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeItem(field.name, idx)}
                                        className="p-3.5 text-slate-300 hover:text-red-500 transition-colors"
                                      >
                                        <Trash2 size={20} />
                                      </button>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem(field.name)}
                              className="mt-6 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent hover:border-blue-100 transition-all"
                            >
                              <Plus size={14} /> Добавить позицию
                            </button>
                          </div>
                        )}

                        {/* textarea */}
                        {field.type === 'textarea' && (
                          <textarea
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={placeholder}
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm min-h-[120px] focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                          />
                        )}

                        {/* select */}
                        {field.type === 'select' && (
                          <div className="relative">
                            <select
                              required={field.required}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm focus:border-blue-500 transition-all appearance-none font-medium"
                            >
                              <option value="">Выберите...</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                          </div>
                        )}

                        {/* text / date */}
                        {(field.type === 'text' || field.type === 'date') && (
                          <div className="relative">
                            <input
                              type={isInn ? 'text' : field.type}
                              inputMode={isInn ? 'numeric' : undefined}
                              required={field.required}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              placeholder={placeholder}
                              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                            />
                            {field.type === 'date' && (
                              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Кнопка сохранения */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 bg-slate-900 text-white hover:bg-blue-600 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-200 disabled:bg-slate-200 disabled:text-slate-400"
          >
            {isSubmitting
              ? <Loader2 className="animate-spin" size={20} />
              : <><Save size={20} />{isEditing ? 'Сохранить изменения' : 'Зарегистрировать проект'}</>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default DynamicProjectForm;
```

### 📄 `src\components\dashboard\shared\ChatDrawer.tsx`
```typescript
import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { MessageSquare, X, Send, Loader2, Minus, Maximize2, Check, CheckCheck } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { useChatLogic } from '../../../hooks/useChatLogic';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  user: any;
  variant?: 'blue' | 'emerald';
}

export const ChatDrawer = ({ 
  isOpen, 
  onClose, 
  project, 
  user, 
  variant = 'blue'
}: ChatDrawerProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const loading = useChatStore(state => state.loading);
  const messages = useChatStore(state => state.messages);

  // ✅ useChatLogic принимает только 4 аргумента
  const { sendMessage } = useChatLogic(
    project?.id, 
    user, 
    isOpen, 
    isMinimized
  );

  // Мемоизируем сообщения конкретного проекта
  const projectMessages = useMemo(() => {
    return project?.id ? messages[project.id] || [] : [];
  }, [messages, project?.id]);

  // Автопрокрутка вниз при новых сообщениях или открытии
  useLayoutEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [projectMessages, isOpen, isMinimized]);

  if (!isOpen) return null;

  const onHandleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  // Стилизация в зависимости от варианта (Менеджер/Пользователь)
  const btnClass = variant === 'emerald' 
    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200';

  const headerClass = variant === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600';

  return (
    <div 
      className={`fixed bottom-0 right-4 z-50 w-full max-w-[400px] transition-all duration-300 transform ${
        isMinimized ? 'translate-y-[calc(100%-56px)]' : 'translate-y-0'
      }`}
    >
      <div className="bg-white rounded-t-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px]">
        
        {/* Шапка чата */}
        <div 
          className={`${headerClass} p-4 text-white flex items-center justify-between cursor-pointer shrink-0 transition-colors`}
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <MessageSquare size={20} />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm leading-tight">Чат по проекту</h3>
              <p className="text-[10px] opacity-80 truncate max-w-[180px]">
                {project?.name || project?.customerName || 'Загрузка...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isMinimized ? "Развернуть" : "Свернуть"}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Закрыть"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Тело чата */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth"
        >
          {loading && projectMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : projectMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <div className="p-4 bg-slate-100 rounded-full">
                <MessageSquare size={32} className="opacity-20" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider">История пуста</p>
            </div>
          ) : (
            projectMessages.map((msg: any) => {
              const isMe = String(msg.senderId) === String(user?.id);
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMe 
                      ? `${headerClass} text-white rounded-tr-none shadow-blue-100` 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                    <div className={`flex items-center gap-1.5 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[10px] font-medium ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <span className="text-white/80">
                          {msg.isRead ? (
                            <CheckCheck size={13} className="inline-block" />
                          ) : (
                            <Check size={13} className="inline-block" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Поле ввода */}
        <div className="p-4 bg-white border-t shrink-0">
          <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500/20 transition-all border border-transparent focus-within:bg-white focus-within:border-slate-200">
            <input 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onHandleSend();
                }
              }}
              className="flex-1 bg-transparent px-3 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              placeholder="Введите сообщение..."
            />
            <button 
              onClick={onHandleSend} 
              disabled={!newMessage.trim()}
              className={`p-3 text-white rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 shadow-lg ${btnClass}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 📄 `src\components\dashboard\shared\NewsCards.tsx`
```typescript
import React from 'react';
import { ExternalLink, Zap, Bell } from 'lucide-react';

const NEWS_DATA = [
  {
    id: 1,
    title: "Новая прошивка Yealink V86",
    desc: "Улучшена стабильность видеосвязи и поддержка новых кодеков. Рекомендуем обновиться.",
    link: "https://yealink.com",
    color: "from-blue-600 to-indigo-700",
    icon: Zap
  },
  {
    id: 2,
    title: "Обновление прайс-листа",
    desc: "С 1 марта меняются цены на сетевое оборудование. Скачайте актуальный документ.",
    link: "https://google.com",
    color: "from-emerald-500 to-teal-600",
    icon: Bell
  }
];

export const NewsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {NEWS_DATA.map((item) => (
        <a 
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative overflow-hidden group p-8 rounded-[2.5rem] bg-gradient-to-br ${item.color} text-white transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95`}
        >
          {/* Декоративный круг на фоне */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          
          <div className="relative flex items-start gap-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
              <item.icon size={28} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black uppercase tracking-tight">{item.title}</h3>
                <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
```

### 📄 `src\components\dashboard\shared\ProjectRow.tsx`
```typescript
import React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Calendar,
  Pencil // Добавили иконку для редактирования
} from 'lucide-react';
import type { Project, User } from '../../../types';

interface ProjectRowProps {
  project: Project & { dynamicData?: any; partner?: any; hasUnread?: boolean };
  isExpanded: boolean;
  onToggleExpand: () => void;
  isAdminView?: boolean;
  onEdit?: (project: any) => void;
  onStatusUpdate?: (id: number, status: Project['status']) => void | Promise<void>;
  onOpenChat?: (projectId: number) => void;
  user: User | null;
}

export const ProjectRow = ({
  project,
  isExpanded,
  onToggleExpand,
  isAdminView,
  onStatusUpdate,
  onOpenChat,
  onEdit, // Не забываем деструктурировать onEdit
}: ProjectRowProps) => {

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusUpdate) {
      await onStatusUpdate(project.id, e.target.value as Project['status']);
    }
  };

  // Маппинг цветов для статусов
  const statusColors: Record<Project['status'], string> = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
    REVISION: 'bg-blue-100 text-blue-700 border-blue-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  // Условие: может ли пользователь редактировать проект
  const canUserEdit = !isAdminView && (project.status === 'PENDING' || project.status === 'REVISION');

  return (
    <>
      <tr className={`border-b border-slate-100 transition-all ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
        {/* ID и Номер */}
        <td className="p-6 text-center">
          <span className="text-xs font-black text-slate-400 block mb-1">ID: {project.id}</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 tracking-tighter">
            PRJ-{project.id}
          </span>
        </td>

        {/* Партнер (только для менеджера) */}
        {isAdminView && (
          <td className="p-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-800">{project.partner?.companyName || '—'}</span>
              <span className="text-[10px] text-slate-400 font-medium">УНП: {project.partner?.unp || '—'}</span>
            </div>
          </td>
        )}

        {/* Заказчик / Название проекта */}
        <td className="p-6 text-center">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">{(project as any).customerName || 'Заказчик не указан'}</span>
            <span className="text-[10px] text-slate-400">УНП объекта: {project.unp}</span>
          </div>
        </td>

        {/* СТАТУС */}
        <td className="p-6 text-center">
          {isAdminView ? (
            <select
              value={project.status}
              onChange={handleStatusChange}
              className={`text-[10px] font-black uppercase tracking-tight border rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer ${statusColors[project.status]}`}
            >
              <option value="PENDING">Ожидание</option>
              <option value="IN_PROGRESS">В работе</option>
              <option value="APPROVED">Одобрено</option>
              <option value="REVISION">На доработку</option> 
              <option value="REJECTED">Отклонено</option>
              <option value="CLOSED">Закрыто</option>
            </select>
          ) : (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusColors[project.status]}`}>
              {project.status === 'REVISION' ? 'НА ДОРАБОТКЕ' : project.status}
            </span>
          )}
        </td>

        {/* Дата создания */}
        <td className="p-6 text-center">
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <Calendar size={14} />
            <span className="text-[11px] font-bold">{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </td>

        {/* Действия */}
        <td className="p-6">
          <div className="flex items-center justify-center gap-3">
            
            {/* КНОПКА РЕДАКТИРОВАНИЯ (Появляется только когда статус REVISION или PENDING) */}
            {canUserEdit && (
              <button
                onClick={() => onEdit?.(project)}
                className="p-2.5 bg-white border border-slate-200 text-amber-600 hover:text-white hover:bg-amber-500 hover:border-amber-500 rounded-xl transition-all shadow-sm group"
                title="Редактировать анкету"
              >
                <Pencil size={18} />
              </button>
            )}

            <button
              onClick={() => onOpenChat?.(project.id)}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500 rounded-xl transition-all shadow-sm relative group"
              title="Открыть чат"
            >
              <MessageSquare size={18} />
              {project.hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
              )}
            </button>
            
            <button
              onClick={onToggleExpand}
              className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                isExpanded 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-500'
              }`}
              title="Детали проекта"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </td>
      </tr>

      {/* РАСКРЫВАЮЩИЕСЯ ДЕТАЛИ */}
      {isExpanded && (
        <tr className="bg-slate-50/50">
          <td colSpan={isAdminView ? 6 : 5} className="p-0 border-b border-slate-100">
            <div className="p-8 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-4 px-8 flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                    Подробная информация по проекту
                  </h4>
                  <div className="flex gap-4">
                     <span className="text-[10px] font-bold text-white/50">Обновлено: {new Date(project.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Объект</label>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-700">{project.unp}</p>
                        <p className="text-xs text-slate-500">{project.description || 'Описание отсутствует'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Заполненная анкета</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.dynamicData ? (
                        Object.entries(project.dynamicData).map(([key, value]) => (
                          <div key={key} className="flex flex-col p-3 px-4 bg-slate-50/80 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter mb-0.5">{key}</span>
                            <span className="text-sm font-bold text-slate-700">{String(value)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-4 text-center text-slate-400 text-xs italic">
                          Дополнительные данные отсутствуют
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
```

### 📄 `src\components\dashboard\shared\ProjectsListView.tsx`
```typescript
import React from 'react';
import { ClipboardList, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ProjectRow } from '../shared/ProjectRow';
// Импортируем типы из вашего центрального файла типов
import type { Project, User } from '../../../types'; 

interface ProjectsListViewProps {
  projects: any[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  onEdit?: (p: any) => void;
  onCreateNew?: () => void;
  isAdminView?: boolean;
  /** * Исправление ошибки: используем Project['status'], 
   * чтобы MODIFICATION и другие статусы подтягивались автоматически 
   */
  onStatusUpdate?: (id: number, status: Project['status']) => void;
  onOpenChat?: (projectId: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** * ОБЯЗАТЕЛЬНО: Передаем текущего юзера, 
   * чтобы ProjectRow мог инициализировать чат 
   */
  user: User | null; 
}

export const ProjectsListView = ({
  projects,
  isLoading,
  searchQuery,
  setSearchQuery,
  expandedId,
  setExpandedId,
  onEdit,
  onCreateNew,
  isAdminView,
  onStatusUpdate,
  onOpenChat,
  currentPage,
  totalPages,
  onPageChange,
  user // Принимаем юзера
}: ProjectsListViewProps) => {

  const headers = isAdminView
    ? ['ID', 'Партнер / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия']
    : ['ID / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Шапка и Поиск */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${isAdminView ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-900 shadow-slate-200'} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
            <ClipboardList size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Реестр проектов</h2>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="text-blue-500 animate-spin" size={20} />
            ) : (
              <Search className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            )}
          </div>
          <input
            type="text"
            placeholder={isAdminView ? "Поиск по партнеру, заказчику или ID..." : "Поиск по заказчику или ID..."}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Основной контейнер таблицы */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col relative overflow-hidden">
        
        {/* ОВЕРЛЕЙ ЗАГРУЗКИ */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <Loader2 className="text-blue-600 animate-spin" size={20} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">Обновление данных...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto min-h-[500px]">
          <table className={`w-full border-collapse transition-all duration-500 ${isLoading ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                {headers.map((h) => (
                  <th key={h} className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((p: any) => (
                  <ProjectRow
                    key={p.id}
                    project={p}
                    isExpanded={expandedId === p.id}
                    onToggleExpand={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    onEdit={onEdit}
                    isAdminView={isAdminView}
                    onStatusUpdate={onStatusUpdate}
                    onOpenChat={onOpenChat}
                    /**
                     * ПРОБРАСЫВАЕМ USER ДАЛЬШЕ
                     * Это устраняет ошибку "Property 'user' is missing"
                     */
                    user={user} 
                  />
                ))
              ) : !isLoading ? (
                <tr>
                  <td colSpan={headers.length} className="py-32 text-center text-slate-400 font-bold uppercase text-xs tracking-widest animate-in zoom-in-95">
                    Ничего не найдено
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* ПАНЕЛЬ ПАГИНАЦИИ */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100 gap-4 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Страница <span className="text-slate-900">{currentPage}</span> из <span className="text-slate-900">{totalPages}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      disabled={isLoading}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-500'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="text-slate-300 mx-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 📄 `src\components\dashboard\shared\StatCardStatus.tsx`
```typescript
// StatCard.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const StatCard = ({ title, value, icon, color, loading, subtitle }: any) => {
  const colors: any = {
    blue: "bg-blue-50/50 border-blue-100",
    purple: "bg-purple-50/50 border-purple-100",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600"
  };
  return (
    <div className={`p-8 rounded-[2.5rem] border ${colors[color]} shadow-sm transition-all hover:shadow-md relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-white rounded-[1.25rem] shadow-sm group-hover:scale-110 transition-transform relative">
          {icon}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-[1.25rem]">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      <div className={`mt-2 transition-all ${loading ? 'opacity-30 blur-[2px]' : 'opacity-100'}`}>
        <p className="text-5xl font-black text-slate-900 tracking-tighter">{value.toLocaleString()}</p>
        {subtitle}
      </div>
    </div>
  );
};

// ServerStatus.tsx
export const ServerStatus = ({ label, isOnline }: { label: string, isOnline: boolean }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
    <span className="text-sm font-black text-slate-600 uppercase tracking-tight">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
      <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-widest ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
  </div>
);
```

### 📄 `src\components\dashboard\shared\StatsView.tsx`
```typescript
import React from 'react';
import { Calendar, RefreshCw, Clock, CheckCircle2, FileText } from 'lucide-react';
import { StatCard } from './UIHelpers';

// Определяем типы вариантов для ролей
type ThemeVariant = 'blue' | 'emerald' | 'purple';

interface StatsViewProps {
  stats: { pending: number; approved: number; total: number };
  onRefresh: () => void;
  isLoading: boolean;
  title?: string;
  variant?: ThemeVariant; // Добавляем variant
}

export const StatsView = ({ 
  stats, 
  onRefresh, 
  isLoading, 
  title = "Менеджер Проектов",
  variant = 'blue' // Значение по умолчанию
}: StatsViewProps) => {

  // Мапинг цветов заголовка и иконок в зависимости от варианта
  const themeClasses = {
    blue: { text: 'text-blue-600', icon: 'text-blue-500', hover: 'hover:text-blue-600' },
    emerald: { text: 'text-emerald-600', icon: 'text-emerald-500', hover: 'hover:text-emerald-600' },
    purple: { text: 'text-purple-600', icon: 'text-purple-500', hover: 'hover:text-purple-600' }
  };

  const theme = themeClasses[variant];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            {title.split(' ')[0]} <span className={theme.text}>{title.split(' ')[1]}</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 flex items-center gap-2">
            <Calendar size={12} className={theme.icon} /> 
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`group p-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 ${theme.hover} shadow-sm transition-all active:scale-90`}
        >
          <RefreshCw 
            size={24} 
            className={isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} 
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* StatCard внутри используют свои цвета, но их тоже можно синхронизировать при желании */}
        <StatCard icon={<Clock />} label="На проверке" value={stats.pending} color="orange" />
        <StatCard icon={<CheckCircle2 />} label="Успешно" value={stats.approved} color="emerald" />
        <StatCard icon={<FileText />} label="Всего заявок" value={stats.total} color={variant === 'emerald' ? 'emerald' : 'blue'} />
      </div>
    </div>
  );
};
```

### 📄 `src\components\dashboard\shared\UIHelpers.tsx`
```typescript
import React, {type ReactElement } from 'react';
import { RefreshCw } from 'lucide-react';

// Цветные статусы
export const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100"
  };
  const labels: any = { PENDING: "На проверке", APPROVED: "Одобрен", REJECTED: "Отклонен" };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${styles[status] || styles.PENDING}`}>
      {labels[status] || status}
    </span>
  );
};

// Одна строка данных в деталях проекта
export const DataRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col border-b border-slate-50 pb-2">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    <span className="text-[13px] font-bold text-slate-700 mt-1 leading-tight">{value}</span>
  </div>
);

// Запись в логах (дата создания/обновления)
export const LogEntry = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: ReactElement, 
  label: string, 
  value: string 
}) => (
  <div className="flex items-center justify-between text-[11px] font-bold">
    <span className="text-slate-400 flex items-center gap-2 italic">
      {/* Добавляем проверку и явное приведение типа */}
      {React.isValidElement(icon) && React.cloneElement(icon as ReactElement<any>, { size: 14 })} 
      {label}
    </span>
    <span className="text-slate-700">{value}</span>
  </div>
);

// Карточки статистики для главной
export const StatCard = ({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: ReactElement, 
  label: string, 
  value: number | string, 
  color: 'orange' | 'emerald' | 'blue' 
}) => {
  const colors = {
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-500 border-emerald-100",
    blue: "bg-blue-50 text-blue-500 border-blue-100"
  };

  return (
    <div className="p-8 rounded-[2.5rem] border bg-white shadow-lg transition-transform hover:-translate-y-1 duration-300">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
        {/* Здесь также типизируем клон */}
        {React.isValidElement(icon) && React.cloneElement(icon as ReactElement<any>, { size: 28 })}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{value}</p>
    </div>
  );
};

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-96 gap-4">
    <RefreshCw size={48} className="animate-spin text-blue-600" />
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      Синхронизация данных...
    </p>
  </div>
);
```

### 📄 `src\components\layouts\DashboardLayout.tsx`
```typescript
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import type { ActiveTabType } from '../../types'

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('stats');

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ activeTab, setActiveTab }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
```

### 📄 `src\components\layouts\Sidebar.tsx`
```typescript
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  List, 
  LogOut, 
  ShieldCheck, 
  ShoppingCart, 
  ChevronDown, 
  FolderOpen,
  FileText // добавлена иконка для логов
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { ActiveTabType } from '../../types';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: ActiveTabType, setActiveTab: (t: ActiveTabType) => void }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  // Состояния для раскрытия групп меню
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isUsersOpen, setIsUsersOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(true);

  const role = user?.role || 'USER'; 

  const themes: any = {
    ADMIN: { text: 'text-purple-600', bg: 'bg-purple-600', shadow: 'shadow-purple-100', active: 'bg-slate-900 text-white shadow-xl' },
    MANAGER: { text: 'text-emerald-600', bg: 'bg-emerald-600', shadow: 'shadow-emerald-100', active: 'bg-emerald-600 text-white shadow-lg' },
    USER: { text: 'text-blue-600', bg: 'bg-blue-600', shadow: 'shadow-blue-100', active: 'bg-blue-600 text-white shadow-lg' }
  };
  const theme = themes[role];

  return (
    <aside className="w-80 bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
      {/* HEADER */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${theme.bg} animate-pulse`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.text}`}>
            {role === 'ADMIN' ? 'Администратор' : role === 'MANAGER' ? 'Менеджер' : 'Партнер'}
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
          IPMATIKA <span className="text-slate-300">B2B</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        
        {/* ОБЗОР (СТАТИСТИКА) - Доступно всем */}
        <NavBtn 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={role === 'ADMIN' ? <ShieldCheck size={20}/> : <LayoutDashboard size={20}/>} 
          label={role === 'ADMIN' ? "Мониторинг" : "Обзор"} 
          theme={theme} 
        />

        {/* ------------------------------------------------------------------ */}
        {/* БЛОК ДЛЯ АДМИНА: ПОЛЬЗОВАТЕЛИ + ЛОГИ */}
        {/* ------------------------------------------------------------------ */}
        {role === 'ADMIN' && (
          <div className="pt-6 pb-2">
            <button 
              onClick={() => setIsUsersOpen(!isUsersOpen)}
              className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span>Управление системой</span>
              <Users size={14} className={`transition-transform duration-300 ${isUsersOpen ? '' : '-rotate-90'}`} />
            </button>
            
            {isUsersOpen && (
              <div className="mt-2 space-y-1 px-2">
                <SubNavBtn 
                  active={activeTab === 'users-list'} 
                  onClick={() => setActiveTab('users-list')} 
                  label="Список пользователей" 
                  icon={<List size={16}/>} 
                  theme={theme} 
                />
                <SubNavBtn 
                  active={activeTab === 'users-create'} 
                  onClick={() => setActiveTab('users-create')} 
                  label="Создать аккаунт" 
                  icon={<PlusCircle size={16}/>} 
                  theme={theme} 
                />
                <SubNavBtn 
                  active={activeTab === 'logs'} 
                  onClick={() => setActiveTab('logs')} 
                  label="Логи системы" 
                  icon={<FileText size={16}/>} 
                  theme={theme} 
                />
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* БЛОК ДЛЯ ПАРТНЕРА (USER) */}
        {/* ------------------------------------------------------------------ */}
        {role === 'USER' && (
          <>
            {/* 1. РАЗДЕЛ ЗАКАЗЫ */}
            <div className="pt-6 pb-2">
              <button 
                onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span>Заказы</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOrdersOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {isOrdersOpen && (
                <div className="mt-2 space-y-1 px-2">
                  <SubNavBtn 
                    active={activeTab === 'orders-create'} 
                    onClick={() => setActiveTab('orders-create')} 
                    label="Создать новый заказ" 
                    icon={<PlusCircle size={16}/>} 
                    theme={theme} 
                  />
                  <SubNavBtn 
                    active={activeTab === 'orders-list'} 
                    onClick={() => setActiveTab('orders-list')} 
                    label="Мои заказы" 
                    icon={<ShoppingCart size={16}/>} 
                    theme={theme} 
                  />
                </div>
              )}
            </div>

            {/* 2. РАЗДЕЛ ПРОЕКТЫ */}
            <div className="pt-2 pb-2">
              <button 
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span>Проекты</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isProjectsOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {isProjectsOpen && (
                <div className="mt-2 space-y-1 px-2">
                  <SubNavBtn 
                    active={activeTab === 'projects-create'} 
                    onClick={() => setActiveTab('projects-create')} 
                    label="Зарегистрировать проект" 
                    icon={<ShieldCheck size={16}/>} 
                    theme={theme} 
                  />
                  <SubNavBtn 
                    active={activeTab === 'projects-list'} 
                    onClick={() => setActiveTab('projects-list')} 
                    label="Мои проекты" 
                    icon={<FolderOpen size={16}/>} 
                    theme={theme} 
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* БЛОК ДЛЯ МЕНЕДЖЕРА (MANAGER) */}
        {/* ------------------------------------------------------------------ */}
        {role === 'MANAGER' && (
          <>
            {/* 1. РАЗДЕЛ ПРОЕКТЫ */}
            <div className="pt-6 pb-2">
              <button 
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span>Проекты</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isProjectsOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {isProjectsOpen && (
                <div className="mt-2 space-y-1 px-2">
                  <SubNavBtn 
                    active={activeTab === 'projects-list'} 
                    onClick={() => setActiveTab('projects-list')} 
                    label="Все проекты" 
                    icon={<FolderOpen size={16}/>} 
                    theme={theme} 
                  />
                </div>
              )}
            </div>

            {/* 2. РАЗДЕЛ ЗАКАЗЫ */}
            <div className="pt-2 pb-2">
              <button 
                onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span>Заказы</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOrdersOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {isOrdersOpen && (
                <div className="mt-2 space-y-1 px-2">
                  <SubNavBtn 
                    active={activeTab === 'orders-list'} 
                    onClick={() => setActiveTab('orders-list')} 
                    label="Все заказы" 
                    icon={<ShoppingCart size={16}/>} 
                    theme={theme} 
                  />
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-4 py-3 bg-slate-50 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Аккаунт</p>
            <p className="text-sm font-bold text-slate-700 truncate">{user?.name || 'Гость'}</p>
            <p className="text-[9px] font-bold text-slate-400 truncate">{user?.email}</p>
        </div>
        <button 
          onClick={() => logout()} 
          className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50 font-black text-[11px] uppercase tracking-widest"
        >
          <LogOut size={20} />
          <span>Выход</span>
        </button>
      </div>
    </aside>
  );
};

// Вспомогательные компоненты
const NavBtn = ({ active, onClick, icon, label, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? theme.active : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} <span className="font-bold text-sm">{label}</span>
  </button>
);

const SubNavBtn = ({ active, onClick, label, icon, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${active ? `bg-slate-50 ${theme.text} font-black` : 'text-slate-400 hover:bg-gray-50'}`}>
    {icon} <span className="text-xs">{label}</span>
  </button>
);

export default Sidebar;
```

### 📄 `src\components\ui\Footer.tsx`
```typescript
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-3 mt-auto">
      <div className="container mx-auto px-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-gray-900">АйПиМатика Бел</span>
            <p className="text-gray-500 text-sm mt-2">
              © {new Date().getFullYear()} Все права защищены
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Условия использования</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Контакты</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### 📄 `src\components\ui\Header.tsx`
```typescript
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Логотип — всегда ведёт на /dashboard */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center space-x-3 group"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md shadow-slate-200 group-hover:scale-105 transition-transform duration-200 overflow-hidden border border-slate-50">
            <img
              src="/src/assets/logo.webp"
              alt="АйПиМатика Лого"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none tracking-tight">
              АйПиМатика Бел
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {isInitialized && isAuthenticated && user && (
            <>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {user.name || 'Пользователь'}
                  </p>
                  <p className="text-[9px] uppercase font-black text-slate-400 mt-1 tracking-tighter flex items-center gap-1">
                    {user.role === 'ADMIN' && <><ShieldCheck className="w-2.5 h-2.5" /> Администратор</>}
                    {user.role === 'MANAGER' && 'Менеджер'}
                    {user.role === 'USER' && 'Партнер'}
                  </p>
                </div>

                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  {user.name ? (
                    <span className="text-sm font-bold text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                title="Выйти"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 📄 `src\components\ui\LockedModal.tsx`
```typescript
import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface LockedModalProps {
  isOpen: boolean;
  /** Дата окончания блокировки (если есть) */
  lockUntil?: Date | null;
  /** Сообщение (если не указано, будет сгенерировано по умолчанию) */
  message?: string;
  /** Заголовок (по умолчанию "Доступ ограничен") */
  title?: string;
  onClose: () => void;
}

const LockedModal: React.FC<LockedModalProps> = ({ 
  isOpen, 
  lockUntil, 
  message, 
  title = "Доступ ограничен",
  onClose 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const stopInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateTimer = () => {
    if (!lockUntil) return;
    const now = new Date();
    const diff = Math.max(0, Math.ceil((lockUntil.getTime() - now.getTime()) / 1000));
    setTimeLeft(diff);
    if (diff <= 0 && !isClosingRef.current) {
      isClosingRef.current = true;
      stopInterval();
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopInterval();
      setTimeLeft(0);
      return;
    }

    isClosingRef.current = false;
    if (lockUntil) {
      updateTimer();
      intervalRef.current = window.setInterval(updateTimer, 1000);
    } else {
      setTimeLeft(0);
    }

    return () => {
      stopInterval();
    };
  }, [isOpen, lockUntil]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultMessage = lockUntil 
    ? "Вы превысили допустимое количество попыток входа. Попробуйте позже."
    : "Ваш аккаунт заблокирован администратором. Обратитесь в поддержку.";

  const displayMessage = message || defaultMessage;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-red-100 animate-in zoom-in-95 duration-300">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center">
            {title}
          </h2>
        </div>
        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            {displayMessage}
          </p>
          {lockUntil && timeLeft > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-center gap-2">
              <Clock className="text-red-500" size={20} />
              <span className="text-lg font-mono font-bold text-red-700">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          <button
            onClick={() => {
              if (isClosingRef.current) return;
              isClosingRef.current = true;
              stopInterval();
              onClose();
            }}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-95"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockedModal;
```

### 📄 `src\components\ui\SessionExpiredModal.tsx`
```typescript
import React from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = () => {
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired);
  const navigate = useNavigate();

  if (!isSessionExpired) return null;

  const handleLogoutClick = () => {
    // Скрываем модалку
    setSessionExpired(false);
    // Редирект на логин (кука уже удалена в таймере)
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-900/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-red-100 animate-in zoom-in-95 duration-300">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-red-900 uppercase tracking-tight text-center">
            Сессия истекла
          </h2>
        </div>

        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Вы отсутствовали слишком долго. В целях безопасности ваш доступ к порталу был временно ограничен.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-bold text-red-800 uppercase tracking-wider">
              Требуется повторный вход
            </p>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <LogOut size={18} />
            Войти заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
```

### 📄 `src\components\ui\SessionSupersededModal.tsx`
```typescript
import React from 'react';
import { Monitor, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const SessionSupersededModal = () => {
  const isSuperseded = useAuthStore((s) => s.isSessionSuperseded);
  const setSuperseded = useAuthStore((s) => s.setSessionSuperseded);
  const navigate = useNavigate();

  if (!isSuperseded) return null;

  const handleConfirm = () => {
    // 1. Скрываем модалку
    setSuperseded(false);
    
    // 2. Переходим на логин (сессия уже убита в useUserSockets)
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="bg-slate-50 p-8 flex flex-col items-center justify-center border-b border-slate-100">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Monitor className="text-slate-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center">
            Вход с другого устройства
          </h2>
        </div>

        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Ваш аккаунт был использован для входа с другого браузера или устройства.
            В целях безопасности текущая сессия была завершена.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Требуется повторный вход
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <LogOut size={18} />
            Войти заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSupersededModal;
```

### 📄 `src\config\projectFields.ts`
```typescript
export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'items';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  section?: string;
}

export const PROJECT_CATEGORIES: Record<string, FormField[]> = {
  YEALINK_PHONES: [
    {
      name: 'customerName',
      label: 'Наименование Заказчика (конечного пользователя)',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'customerInn',
      label: 'ИНН Заказчика',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'purchasingOrg',
      label: 'Наименование закупочной/уполномоченной организации',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'purchasingInn',
      label: 'УНП закупочной организации',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'intermediatePartner',
      label: 'Название и УНП другого партнера (если поставка через него)',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
      placeholder: 'Если напрямую — пишите "сам"',
    },
    {
      name: 'customerWebsite',
      label: 'Сайт Заказчика',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'installationAddr',
      label: 'Адреса/Города планируемой установки оборудования',
      type: 'text',
      required: true,
      section: '2. Информация о конечном Заказчике',
    },
    {
      name: 'specification',
      label: 'Планируемая спецификация по бренду (модели/количество)',
      type: 'items',
      required: true,
      section: '3. Техническая информация',
      options: [
        'Yealink T30', 'Yealink T31P', 'Yealink T33G',
        'Yealink T43U', 'Yealink T46U', 'Yealink T48U',
        'Yealink T53W', 'Yealink T54W', 'Yealink T58W',
        'Yealink W73P', 'Yealink W70B', 'Yealink W73H',
      ],
    },
    {
      name: 'ipAtcType',
      label: 'К какой IP-АТС планируется подключать телефоны?',
      type: 'text',
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'currentTelephony',
      label: 'Установлены ли сейчас у Заказчика АТС и телефоны? (какие)',
      type: 'text',
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'executionDate',
      label: 'Планируемая дата реализации проекта',
      type: 'date',
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'purchaseMethod',
      label: 'Планируемая форма закупки',
      type: 'select',
      options: ['прямая закупка', 'открытый тендер', 'закрытый тендер'],
      required: true,
      section: '3. Техническая информация',
    },
    {
      name: 'industry',
      label: 'Сфера деятельности Заказчика',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
      placeholder: 'напр. транспорт, госсектор...',
    },
    {
      name: 'usageScenario',
      label: 'Сценарий использования (замена АТС, развертывание с нуля)',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'competitors',
      label: 'Какие есть конкуренты-производители в проекте?',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'budgetStatus',
      label: 'Выделен ли уже бюджет у заказчика на покупку?',
      type: 'select',
      options: ['Да', 'Нет', 'В процессе'],
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'deliverySchedule',
      label: 'Поставка одной партией или по графику?',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'keyRequirements',
      label: 'Ключевые требования заказчика к решению',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'additionalEquipment',
      label: 'Какое оборудование/ПО требуется заказчику дополнительно?',
      type: 'text',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'ydmpPlanning',
      label: 'Планируется ли развертывание платформы YDMP?',
      type: 'select',
      options: ['Да', 'Нет'],
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'plannedActions',
      label: 'Планируемые действия по проекту (встречи, демо и т.д.)',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
    {
      name: 'comments',
      label: 'Дополнительные комментарии по проекту',
      type: 'textarea',
      required: true,
      section: '4. Дополнительная информация',
    },
  ],

  NETWORKING: [
    {
      name: 'customerName',
      label: 'Наименование Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'customerInn',
      label: 'ИНН Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'installationAddr',
      label: 'Адрес установки',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'equipmentType',
      label: 'Тип оборудования',
      type: 'select',
      options: ['Коммутаторы', 'Маршрутизаторы', 'Wi-Fi'],
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'portCount',
      label: 'Общее количество портов',
      type: 'text',
      section: '2. Техническая информация',
    },
    {
      name: 'executionDate',
      label: 'Планируемая дата реализации',
      type: 'date',
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'comments',
      label: 'Комментарии к проекту',
      type: 'textarea',
      section: '3. Дополнительно',
    },
  ],

  // Добавлена категория VIDEO_CONFERENCE — была в UI, но отсутствовала в конфиге
  VIDEO_CONFERENCE: [
    {
      name: 'customerName',
      label: 'Наименование Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'customerInn',
      label: 'ИНН Заказчика',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'installationAddr',
      label: 'Адрес установки',
      type: 'text',
      required: true,
      section: '1. Информация о Заказчике',
    },
    {
      name: 'roomCount',
      label: 'Количество переговорных комнат',
      type: 'text',
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'vcsSystem',
      label: 'Предпочитаемая платформа ВКС',
      type: 'select',
      options: ['Yealink MVC', 'Cisco Webex', 'Zoom Rooms', 'Другое'],
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'currentSystem',
      label: 'Текущая система видеосвязи (если есть)',
      type: 'text',
      section: '2. Техническая информация',
    },
    {
      name: 'executionDate',
      label: 'Планируемая дата реализации',
      type: 'date',
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'purchaseMethod',
      label: 'Форма закупки',
      type: 'select',
      options: ['прямая закупка', 'открытый тендер', 'закрытый тендер'],
      required: true,
      section: '2. Техническая информация',
    },
    {
      name: 'keyRequirements',
      label: 'Ключевые требования к системе',
      type: 'textarea',
      required: true,
      section: '3. Дополнительно',
    },
    {
      name: 'comments',
      label: 'Дополнительные комментарии',
      type: 'textarea',
      section: '3. Дополнительно',
    },
  ],
};

export const FIELD_LABELS: Record<string, string> = Object.values(PROJECT_CATEGORIES)
  .flat()
  .reduce((acc, field) => ({ ...acc, [field.name]: field.label }), {});
```

### 📄 `src\hooks\useChatLogic.ts`
```typescript
import { useEffect, useCallback, useRef } from 'react';
import { getSocket, SOCKET_URL } from '../api/socket';
import { useChatStore } from '../store/useChatStore';

export const useChatLogic = (
  projectId: number | undefined,
  user: any,
  isOpen: boolean,
  isMinimized: boolean
) => {
  const { setMessages, addMessage, markMessagesAsReadLocally, setActiveChatId, markMyMessagesAsRead } = useChatStore();
  const isOpenRef = useRef(isOpen);
  const isMinimizedRef = useRef(isMinimized);
  const hasJoinedRoomRef = useRef(false);

  useEffect(() => {
    console.log('[useChatLogic] 🔄 State changed:', { isOpen, isMinimized, projectId, userId: user?.id });
    isOpenRef.current = isOpen;
    isMinimizedRef.current = isMinimized;
  }, [isOpen, isMinimized, projectId, user?.id]);

  const sendReadReceipt = useCallback(async () => {
    if (!projectId || !user?.id) return;
    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/${projectId}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('[useChatLogic] ✅ Read receipt response:', { status: response.status, data });
    } catch (err) {
      console.error('[ChatLogic] ❌ Send read receipt error:', err);
    }
  }, [projectId, user?.id]);

  const joinProjectRoom = useCallback(() => {
    const socket = getSocket();
    if (!projectId || !user?.id || !socket) return;
    if (!hasJoinedRoomRef.current) {
      socket.emit('join_project', { projectId, userId: user.id, userName: user.name, userRole: user.role });
      hasJoinedRoomRef.current = true;
    }
  }, [projectId, user?.id, user?.name, user?.role]);

  useEffect(() => {
    if (isOpen && !isMinimized && projectId && user?.id) {
      joinProjectRoom();
      setActiveChatId(projectId);
      markMessagesAsReadLocally(projectId, user.id);
      sendReadReceipt();
    } else if (!isOpen || isMinimized) {
      setActiveChatId(null);
      hasJoinedRoomRef.current = false;
    }
  }, [isOpen, isMinimized, projectId, user?.id, setActiveChatId, markMessagesAsReadLocally, sendReadReceipt, joinProjectRoom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !projectId || !user?.id) return;
    try {
      const res = await fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const savedMsg = await res.json();
      addMessage(projectId, { ...savedMsg, isRead: false });
    } catch (err) {
      console.error('[ChatLogic] ❌ Send error:', err);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setMessages(projectId, data);
        if (isOpenRef.current && !isMinimizedRef.current && user?.id) {
          markMessagesAsReadLocally(projectId, user.id);
          sendReadReceipt();
        }
      })
      .catch(console.error);
  }, [projectId, setMessages, user?.id, markMessagesAsReadLocally, sendReadReceipt]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const logAllEvents = (event: string, ...args: any[]) => {
      console.log('[useChatLogic] 📡 RAW SOCKET EVENT:', event, args);
    };
    socket.onAny(logAllEvents);
    return () => {
      socket.offAny(logAllEvents);
    };
  }, []);

  useEffect(() => {
    if (!projectId) return;
    const socket = getSocket();
    if (!socket) return;
    const handleMessagesRead = ({ projectId: readProjectId, readerId, messageIds }: { 
      projectId: number; 
      readerId: number;
      messageIds?: number[];
    }) => {
      if (readProjectId === projectId && user?.id && String(readerId) !== String(user.id)) {
        markMyMessagesAsRead(projectId, readerId);
      }
    };
    socket.on('messages_read', handleMessagesRead);
    return () => {
      socket.off('messages_read', handleMessagesRead);
    };
  }, [projectId, user?.id, markMyMessagesAsRead]);

  return { sendMessage };
};
```

### 📄 `src\hooks\useGlobalChatLoader.ts`
```typescript
import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import api from '../api/ky';
import { useChatStore } from '../store/useChatStore';
import { useProjectStore } from '../store/useProjectStore';

export const useGlobalChatLoader = (user: any, projects: any[]) => {
  const { addMessage, markMyMessagesAsRead, activeChatId } = useChatStore();
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (!user?.id || projects.length === 0) return;

    const socket = getSocket();
    if (!socket) {
      console.warn('[GlobalChatLoader] Socket not initialized');
      return;
    }

    console.log('[GlobalChatLoader] 🚀 Initializing for user:', user.id);
    socket.emit('join_self_room', user.id);

    projects.forEach(p => {
      socket.emit('join_project', { 
        projectId: p.id, 
        userId: user.id, 
        userName: user.name, 
        userRole: user.role 
      });
    });

    const handleNewMessage = async (msg: any) => {
      const pId = Number(msg.projectId);
      const chatStore = useChatStore.getState();
      const isChatOpen = chatStore.activeChatId === pId;
      const isMyOwnMessage = String(msg.senderId) === String(user.id);

      let isRead = false;
      if (!isMyOwnMessage && isChatOpen) {
        isRead = true;
        try {
          await api.patch(`chat/${pId}/read`, { json: {} });
          console.log(`[GlobalChatLoader] Marked messages as read for project ${pId}`);
        } catch (err) {
          console.error('[GlobalChatLoader] Failed to mark as read:', err);
        }
      }

      addMessage(pId, { ...msg, isRead });

      if (!isMyOwnMessage && !isChatOpen) {
        setProjects((prev: any[]) => {
          const idx = prev.findIndex(p => Number(p.id) === pId);
          if (idx === -1) return prev;
          const updated = [...prev];
          const currentUnreadCount = updated[idx].unreadCount || 0;
          updated[idx] = { 
            ...updated[idx], 
            hasUnread: true, 
            unreadCount: currentUnreadCount + 1 
          };
          return updated;
        });
      }
    };

    const handleMessagesRead = ({ projectId, readerId }: { projectId: number; readerId: number }) => {
      if (String(readerId) !== String(user.id)) {
        markMyMessagesAsRead(projectId, readerId);
        setProjects((prev: any[]) => {
          const idx = prev.findIndex(p => Number(p.id) === projectId);
          if (idx === -1) return prev;
          const updated = [...prev];
          updated[idx] = { ...updated[idx], hasUnread: false, unreadCount: 0 };
          return updated;
        });
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [user?.id, projects.length, setProjects, addMessage, markMyMessagesAsRead, activeChatId]);
};
```

### 📄 `src\hooks\useProjectSockets.ts`
```typescript
import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import { useProjectStore } from '../store/useProjectStore';

export const useProjectSockets = (userId: number | string | undefined) => {
  const socketRef = useRef<ReturnType<typeof getSocket>>(null);
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (!userId) {
      console.log('⚠️ [Socket Debug] Пропуск подключения: userId не определен');
      return;
    }

    const socket = getSocket();
    if (!socket) {
      console.log('⚠️ [Socket Debug] Socket не инициализирован');
      return;
    }

    socketRef.current = socket;

    const onConnect = () => {
      console.log(`✅ [Socket Debug] Подключено! ID: ${socket.id}. Для User: ${userId}`);
      socket.emit('join_self_room', userId);
      socket.emit('subscribe_admin_stats');
    };

    const onConnectError = (err: Error) => {
      console.error('❌ [Socket Debug] Ошибка подключения:', err.message);
    };

    const onAny = (eventName: string, ...args: any[]) => {
      console.log(`🔹 [Socket Debug] Поймано любое событие: [${eventName}]`, args);
    };

    const onProjectCreated = (newProject: any) => {
      console.log('🆕 [Socket Debug] project_created:', newProject);
      setProjects((prev: any[]) => {
        if (prev.some((p: any) => p.id === newProject.id)) return prev;
        return [newProject, ...prev];
      });
    };

    const onProjectUpdated = (updatedProject: any) => {
      console.log('✏️ [Socket Debug] project_updated:', updatedProject);
      setProjects((prev: any[]) => {
        if (!prev.some((p: any) => p.id === updatedProject.id)) return prev;
        return prev.map((p: any) => p.id === updatedProject.id ? { ...p, ...updatedProject } : p);
      });
    };

    const onProjectStatusChanged = (updatedProject: any) => {
      console.log('🚀 [Socket Debug] project_status_changed', updatedProject);
      setProjects((prev: any[]) => {
        const existingProject = prev.find((p: any) => p.id === updatedProject.id);
        if (!existingProject) return prev;

        const filtered = prev.filter((p: any) => p.id !== updatedProject.id);
        const processed = {
          ...existingProject,
          ...updatedProject,
          unreadCount: updatedProject._count?.messages ?? existingProject?.unreadCount ?? 0,
          hasUnread: (updatedProject._count?.messages ?? existingProject?.unreadCount ?? 0) > 0
        };
        return [processed, ...filtered].sort((a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.onAny(onAny);
    socket.on('project_created', onProjectCreated);
    socket.on('project_updated', onProjectUpdated);
    socket.on('project_status_changed', onProjectStatusChanged);
    // ❌ Удаляем socket.on('new_message', ...) – теперь чат обрабатывается в useGlobalChatLoader

    return () => {
      if (socket) {
        socket.off('connect', onConnect);
        socket.off('connect_error', onConnectError);
        socket.offAny(onAny);
        socket.off('project_created', onProjectCreated);
        socket.off('project_updated', onProjectUpdated);
        socket.off('project_status_changed', onProjectStatusChanged);
      }
    };
  }, [userId, setProjects]);
};
```

### 📄 `src\hooks\useSessionManager.ts`
```typescript
import { useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../api/socket';
import { useAuthStore } from '../store/useAuthStore';

const INACTIVITY_LIMITS = {
  USER: 1 * 60 * 1000,      // 1 минута (демо)
  MANAGER: 2 * 60 * 60 * 1000,
  ADMIN: 2 * 60 * 60 * 1000,
};

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

export const useSessionManager = () => {
  const { user, isAuthenticated, logout, setSessionExpired, setSessionSuperseded, setUserBlocked } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated || !user) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const limit = user.role === 'USER' ? INACTIVITY_LIMITS.USER : INACTIVITY_LIMITS.MANAGER;

    timerRef.current = setTimeout(async () => {
      console.log(`[SessionManager] ⏰ Таймаут неактивности (${user.role})`);
      try {
        await logout();
        setSessionExpired(true);
      } catch (e) {
        console.error('Logout on timeout failed:', e);
        setSessionExpired(true);
      }
    }, limit);
  }, [isAuthenticated, user, logout, setSessionExpired]);

  useEffect(() => {
    if (isAuthenticated && user) {
      resetTimer();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAuthenticated, user?.id, resetTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleActivity = () => resetTimer();
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    return () => ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, handleActivity));
  }, [isAuthenticated, resetTimer]);

  // Подписка на сокет-события (session_superseded, user_blocked)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let retryTimer: ReturnType<typeof setTimeout>;
    const subscribe = () => {
      const socket = getSocket();
      if (!socket) {
        retryTimer = setTimeout(subscribe, 1000);
        return;
      }
      if (subscribedRef.current) return;
      subscribedRef.current = true;
      console.log('[SessionManager] Подписка на сокет-события');
      socket.emit('join_self_room', user.id);
      socket.on('session_superseded', () => {
        console.warn('⚠️ Сессия вытеснена');
        setSessionSuperseded(true);
        logout();
      });
      socket.on('user_blocked', () => {
        console.warn('🛑 Аккаунт заблокирован');
        logout();
        setUserBlocked(true);
      });
    };
    subscribe();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      const socket = getSocket();
      if (socket && subscribedRef.current) {
        socket.off('session_superseded');
        socket.off('user_blocked');
        subscribedRef.current = false;
      }
    };
  }, [isAuthenticated, user?.id, setSessionSuperseded, setUserBlocked, logout]);
};
```

### 📄 `src\hooks\useUserSockets.ts`
```typescript
import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

export const useUserSockets = () => {
  const { fetchUsers, updateUserStatus, updateUserBlockedStatus, setStats } = useUserStore();
  const { user, isAuthenticated } = useAuthStore();
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = getSocket();
    if (!socket) {
      console.warn('[useUserSockets] Socket not initialized');
      return;
    }

    if (!hasIdentified.current) {
      socket.emit('identify_user', { userId: user.id, userRole: user.role });
      hasIdentified.current = true;
    }

    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      socket.emit('subscribe_admin_stats');
    }

    socket.emit('join_self_room', user.id);

    const onStatsUpdated = (newStats: any) => {
      setStats(newStats);
    };

    const onUserRegistered = () => {
      if (user.role === 'ADMIN') fetchUsers();
    };

    const onUserOnline = (userId: number) => {
      updateUserStatus(userId, true);
    };

    const onUserOffline = (userId: number) => {
      updateUserStatus(userId, false);
    };

    const onUserBlockedStatusChanged = (data: {
      userId: number;
      isBlocked?: boolean;
      lockUntil?: string | null;
      failedLoginAttempts?: number;
      twoFactorLockUntil?: string | null;
      twoFactorAttempts?: number;
      wasSystemLock?: boolean;
    }) => {
      if (data.isBlocked !== undefined) {
        updateUserBlockedStatus(data.userId, data.isBlocked);
      }
    };

    socket.on('stats_updated', onStatsUpdated);
    socket.on('user:registered', onUserRegistered);
    socket.on('user:online', onUserOnline);
    socket.on('user:offline', onUserOffline);
    socket.on('user:blocked_status_changed', onUserBlockedStatusChanged);

    return () => {
      socket.off('stats_updated', onStatsUpdated);
      socket.off('user:registered', onUserRegistered);
      socket.off('user:online', onUserOnline);
      socket.off('user:offline', onUserOffline);
      socket.off('user:blocked_status_changed', onUserBlockedStatusChanged);
    };
  }, [isAuthenticated, user?.id, user?.role, setStats, fetchUsers, updateUserStatus, updateUserBlockedStatus]);
};
```

### 📄 `src\pages\AdminDashboard.tsx`
```typescript
import { useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useUserSockets } from '../hooks/useUserSockets';
import type { ActiveTabType } from '../types';
import AdminOverview from '../components/dashboard/admin/AdminOverview';
import UsersList from '../components/dashboard/admin/UsersList';
import AdminCreateUser from '../components/dashboard/admin/AdminCreateUser';
import LogsViewer from '../components/dashboard/admin/LogsViewer';

const AdminDashboard = () => {
  useUserSockets();

  const { activeTab, setActiveTab } = useOutletContext<{
    activeTab: ActiveTabType;
    setActiveTab: (tab: ActiveTabType) => void;
  }>();

  const stats = useUserStore((state) => state.stats);
  const fetchStats = useUserStore((state) => state.fetchStats);
  const loading = useUserStore((state) => state.loading);

  const isSystemOnline = true; 

  const fetchData = useCallback(async (quiet = false) => {
    try {
      await fetchStats(quiet);
    } catch (err: any) {
      console.error("Dashboard statistics fetch error:", err);
    }
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'stats' && !stats) {
      fetchData();
    }
  }, [activeTab, stats, fetchData]);

  return (
    <div className="space-y-6">
      {activeTab === 'stats' && (
        <AdminOverview 
          stats={stats} 
          loading={loading} 
          isOnline={isSystemOnline} 
          onRefresh={() => fetchData(false)} 
        />
      )}

      {activeTab === 'users-list' && <UsersList />}

      {activeTab === 'users-create' && (
        <AdminCreateUser onCancel={() => setActiveTab('users-list')} />
      )}

      {activeTab === 'logs' && <LogsViewer />}

      {(activeTab === 'projects-list' || activeTab === 'projects-create' || activeTab === 'orders-list') && (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-400">Вкладка {activeTab} в разработке</h2>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
```

### 📄 `src\pages\LoginPage.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, X, 
  ShieldCheck, KeyRound, RefreshCw 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import authApi from '../api/auth';
import LockedModal from '../components/ui/LockedModal';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const login = useAuthStore((state) => state.login);
  const verify2FA = useAuthStore((state) => state.verify2FA);
  const is2FARequired = useAuthStore((state) => state.is2FARequired);
  const authLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  
  const [submitError, setSubmitError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  
  const [is2FAView, setIs2FAView] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Единое состояние для модалки блокировки
  const [lockedModal, setLockedModal] = useState<{
    isOpen: boolean;
    lockUntil?: Date | null;
    message?: string;
    title?: string;
  }>({ isOpen: false });
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  // --- Таймер для повторной отправки 2FA ---
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Переключение на 2FA, если требуется
  useEffect(() => {
    if (is2FARequired) {
      setIs2FAView(true);
      setSubmitError('');
      handleResendCode(); 
    }
  }, [is2FARequired]);

  // Редирект после входа
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const routes = { 
        ADMIN: '/admin/dashboard', 
        MANAGER: '/manager/dashboard', 
        USER: '/dashboard' 
      };
      const targetRoute = routes[user.role as keyof typeof routes] || '/dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, isInitialized, user, navigate]);

  // Валидация
  const validateEmail = (email: string) => {
    if (!email) return 'Email обязателен';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email';
    return '';
  };
  const validatePassword = (password: string) => {
    if (!password) return 'Пароль обязателен';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: name === 'email' ? validateEmail(value) : validatePassword(value) 
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ 
      ...prev, 
      [name]: name === 'email' ? validateEmail(value) : validatePassword(value) 
    }));
  };

  const isFormValid = () => !errors.email && !errors.password && formData.email && formData.password;

  // Логин
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setAttemptsLeft(null);
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }
    
    const result = await login(formData);
    
    if (!result.success) {
      // Ручная блокировка администратором
      if (result.userBlocked) {
        setLockedModal({
          isOpen: true,
          lockUntil: null,
          message: "Ваш аккаунт заблокирован администратором. Обратитесь в поддержку.",
          title: "Аккаунт заблокирован"
        });
        setFormData({ email: '', password: '' });
        return;
      }
      if (result.requires2FA) return;
      
      // Блокировка 2FA (3 попытки)
      if (result.lockType === '2FA' && result.timeLeft) {
        const lockDate = new Date(Date.now() + result.timeLeft * 1000);
        setLockedModal({
          isOpen: true,
          lockUntil: lockDate,
          message: "Вы превысили количество попыток ввода SMS-кода. Доступ заблокирован.",
          title: "Блокировка входа"
        });
        useAuthStore.getState().setIs2FARequired(false);
        useAuthStore.getState().setTempUserId(null);
        setFormData({ email: '', password: '' });
        setCode('');
        return;
      }
      
      // Блокировка пароля (5 попыток)
      if (result.timeLeft && result.attemptsLeft === undefined) {
        const lockDate = new Date(Date.now() + result.timeLeft * 1000);
        setLockedModal({
          isOpen: true,
          lockUntil: lockDate,
          message: "Превышено количество попыток входа. Попробуйте позже.",
          title: "Доступ временно ограничен"
        });
        setFormData({ email: '', password: '' });
        return;
      }
      
      // Обычная ошибка логина (не блокировка)
      setSubmitError(result.message || 'Неверный email или пароль');
      if (result.attemptsLeft !== undefined) {
        setAttemptsLeft(result.attemptsLeft);
      }
    }
  };

  // 2FA отправка кода
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    const userId = useAuthStore.getState().tempUserId;
    if (!userId) return;
    try {
      const res: any = await authApi.send2FACode(userId);
      setResendTimer(60);
      if (res.debugCode) console.log('🔐 2FA CODE:', res.debugCode);
    } catch (err: any) {
      const errData = await err.response?.json().catch(() => ({}));
      setResendTimer(errData.timeLeft || 60);
    }
  };

  // Проверка 2FA кода
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codeLoading) return;
    setCodeLoading(true);
    setCodeError('');
    
    const result = await verify2FA(code);
    setCodeLoading(false);
    
    if (!result.success) {
      if (result.timeLeft && !result.attemptsLeft) {
        // блокировка 2FA
        const lockDate = new Date(Date.now() + result.timeLeft * 1000);
        setLockedModal({
          isOpen: true,
          lockUntil: lockDate,
          message: "Вы превысили количество попыток ввода SMS-кода. Доступ заблокирован.",
          title: "Блокировка входа"
        });
        setIs2FAView(false);
        useAuthStore.getState().setIs2FARequired(false);
        useAuthStore.getState().setTempUserId(null);
        setCode('');
      } else if (result.attemptsLeft !== undefined) {
        setCodeError(`Неверный код. Осталось попыток: ${result.attemptsLeft}`);
      } else {
        setCodeError(result.message || 'Ошибка проверки кода');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Сброс пароля
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    try {
      await authApi.forgotPassword(resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      setResetError(err.response?.data?.error || 'Ошибка сети');
    } finally {
      setResetLoading(false);
    }
  };

  const closeLockedModal = () => {
    setLockedModal({ isOpen: false });
    // Очистить форму для нового входа
    setFormData({ email: '', password: '' });
    setCode('');
    setSubmitError('');
    setCodeError('');
    navigate('/login', { replace: true });
  };

  // --- RENDER 2FA ---
  if (is2FAView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-slate-100 animate-in zoom-in duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Проверка безопасности</h2>
            <p className="text-slate-500 text-sm mt-2">Введите код подтверждения</p>
          </div>

          {codeError && (
            <div className="mb-4 p-4 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-2 bg-red-50 text-red-600 border-red-200">
              <AlertCircle size={16} />
              <div>{codeError}</div>
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest mb-1">Код из SMS / Приложения</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text" 
                  inputMode="numeric" 
                  maxLength={6}
                  value={code} 
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  disabled={codeLoading}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-center text-2xl font-mono tracking-[0.5em] font-bold focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-100"
                  placeholder="000000"
                  autoFocus
                />
              </div>
            </div>
            
            <button
              type="submit" 
              disabled={!code || codeLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {codeLoading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
              {codeLoading ? 'Проверка...' : 'Подтвердить'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendCode} 
              disabled={resendTimer > 0}
              className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
            >
              {resendTimer > 0 ? `Отправить повторно (${formatTime(resendTimer)})` : 'Отправить код снова'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
             <button 
               onClick={() => { 
                 setIs2FAView(false); 
                 setSubmitError('');
                 setCode('');
                 setCodeError('');
                 useAuthStore.getState().setIs2FARequired(false);
                 useAuthStore.getState().setTempUserId(null);
               }}
               className="text-[10px] text-slate-400 hover:text-slate-600 uppercase font-bold tracking-widest"
             >
               ← Назад ко входу
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN (оригинальный дизайн) ---
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-50 py-12 flex items-center">
        <div className="container mx-auto px-3">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Вход в портал</h1>
                <p className="text-blue-100">Используйте данные, выданные администратором</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {submitError && (
                  <div className="p-4 rounded-xl border flex items-start gap-2 bg-red-50 text-red-700 border-red-200">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Ошибка входа</p>
                      <p>{submitError}</p>
                      {attemptsLeft !== null && (
                        <p className="mt-1 text-xs font-bold">Осталось попыток: {attemptsLeft}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Электронная почта</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email" id="email" name="email" disabled={authLoading}
                      value={formData.email} onChange={handleChange} onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100
                        ${touched.email && errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="example@email.com"
                    />
                    {touched.email && !errors.email && formData.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1"/>{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
                    <button 
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} id="password" name="password" disabled={authLoading}
                      value={formData.password} onChange={handleChange} onBlur={handleBlur}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100
                        ${touched.password && errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Введите пароль"
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1"/>{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid() || authLoading}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                    ${isFormValid() && !authLoading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-blue-200'
                      : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {authLoading ? (
                    <><RefreshCw className="animate-spin" size={18} /> Вход...</>
                  ) : (
                    'Войти в систему'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка сброса пароля */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Сброс пароля</h3>
                <button onClick={() => {setShowResetModal(false); setResetSuccess(false); setResetError('');}} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {resetSuccess ? (
                <div className="text-center py-4">
                  <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Письмо отправлено!</h4>
                  <p className="text-gray-600 text-sm mb-6">
                    Мы отправили ссылку для сброса пароля на <strong>{resetEmail}</strong>.
                  </p>
                  <button 
                    onClick={() => {setShowResetModal(false); setResetSuccess(false); setResetEmail('');}}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {resetError && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} /> {resetError}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mb-2">Введите ваш email для восстановления</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="mail@example.com"
                    />
                  </div>
                  <button
                    type="submit" disabled={resetLoading || !resetEmail}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    {resetLoading ? 'Отправка...' : 'Прислать ссылку'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <LockedModal 
        isOpen={lockedModal.isOpen}
        lockUntil={lockedModal.lockUntil}
        message={lockedModal.message}
        title={lockedModal.title}
        onClose={closeLockedModal}
      />
    </>
  );
};

export default LoginPage;
```

### 📄 `src\pages\ManagerDashboard.tsx`
```typescript
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import { useUserSockets } from '../hooks/useUserSockets';
import { Rocket } from 'lucide-react';
import type { Project, ActiveTabType } from '../types';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

// 🔥 ПЕРЕКЛЮЧАТЕЛЬ: поставь true, чтобы вернуть старый рабочий функционал
const SHOW_WORKING_FEATURES = true;

const WorkInProgressBanner = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <Rocket className="text-emerald-500" size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">{title}</h2>
      <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Данный модуль находится в разработке. Доступ к текущему функционалу временно ограничен.
      </p>
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-full">
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">В процессе</span>
      </div>
    </div>
  </div>
);

const ManagerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab } = useOutletContext<{ activeTab: ActiveTabType }>();
  
  useUserSockets(); 

  const {
    projects, loading, totalCount, totalPages, currentPage, searchQuery,
    fetchProjects, updateProjectStatus, setSearchQuery, setCurrentPage
  } = useProjectStore();

  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const markMessagesAsReadLocally = useChatStore((state) => state.markMessagesAsReadLocally);

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);

  useGlobalChatLoader(user, projects);

  const userIdForSockets = useMemo(() => user?.id ? (typeof user.id === 'string' ? parseInt(user.id, 10) : user.id) : undefined, [user?.id]);
  useProjectSockets(userIdForSockets);

  useEffect(() => { fetchProjects(); }, [fetchProjects, currentPage, searchQuery]);

  const stats = useMemo(() => ({
    total: totalCount,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    pending: projects.filter(p => p.status === 'PENDING' || p.status === 'REVISION').length
  }), [projects, totalCount]);

  const handleOpenChat = useCallback(async (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project && user?.id) {
      setChatProject(project as Project);
      setActiveChatId(projectId);
      markMessagesAsReadLocally(projectId, user.id);
      try {
        await fetch(`/api/chat/${projectId}/read`, { method: 'POST', credentials: 'include' });
      } catch (err) {
        console.error("Failed to mark messages as read on server", err);
      }
    }
  }, [projects, setActiveChatId, markMessagesAsReadLocally, user?.id]);

  // 🔥 ЕСЛИ РЕЖИМ ДЕМО (false) - ПОКАЗЫВАЕМ ЗАГЛУШКИ
  if (!SHOW_WORKING_FEATURES) {
    if (activeTab === 'orders-list') {
      return <WorkInProgressBanner title="Все заказы" />;
    }
    if (activeTab === 'projects-list' || activeTab === 'stats') {
      return <WorkInProgressBanner title="Управление проектами" />;
    }
    return <WorkInProgressBanner title="Раздел в разработке" />;
  }

  // 🔥 ЕСЛИ РЕЖИМ РАЗРАБОТКИ (true) - ПОКАЗЫВАЕМ РАБОЧИЙ ФУНКЦИОНАЛ
  return (
    <>
      {activeTab === 'stats' && (
        <StatsView stats={stats} onRefresh={() => fetchProjects(true)} isLoading={loading} title="Панель Менеджера" variant="emerald" />
      )}
      {activeTab === 'projects-list' && (
        <ProjectsListView
          projects={projects}
          isLoading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expandedId={expandedProjectId}
          setExpandedId={setExpandedProjectId}
          isAdminView={true}
          onStatusUpdate={updateProjectStatus}
          onOpenChat={handleOpenChat}
          user={user}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {/* Заглушка для заказов, если функционал еще не готов */}
      {activeTab === 'orders-list' && <WorkInProgressBanner title="Все заказы" />}
      
      <ChatDrawer isOpen={!!chatProject} project={chatProject} user={user} onClose={() => setChatProject(null)} variant="emerald" />
    </>
  );
};

export default ManagerDashboard;
```

### 📄 `src\pages\ResetPasswordPage.tsx`
```typescript
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authApi from '../api/auth';
import { Lock, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  
  // Состояния
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Обработка запроса на сброс (если нет токена)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await authApi.forgotPassword(email);
      setMessage({ type: 'success', text: 'Письмо со ссылкой для сброса пароля отправлено на ваш email.' });
      setEmail('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Ошибка при отправке письма';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка установки нового пароля (если есть токен)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен быть не менее 6 символов' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      await authApi.resetPassword(token!, newPassword);
      setMessage({ type: 'success', text: 'Пароль успешно изменен! Перенаправление на вход...' });
      
      // Редирект через 2 секунды
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Ошибка при смене пароля';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Рендер формы запроса ссылки (нет токена)
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Забыли пароль?</h2>
            <p className="text-slate-500 text-sm mt-2">Введите свой email, и мы пришлем ссылку для сброса.</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5"/> : <AlertCircle size={18} className="shrink-0 mt-0.5"/>}
              {message.text}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email адрес</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-[0.1em] text-xs shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Отправка...' : 'Прислать ссылку'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 mx-auto text-slate-500 hover:text-slate-900 text-sm font-bold transition-colors"
            >
              <ArrowLeft size={16} /> Вернуться ко входу
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Рендер формы установки нового пароля (есть токен)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Новый пароль</h2>
          <p className="text-slate-500 text-sm mt-2">Придумайте надежный пароль для вашего аккаунта.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5"/> : <AlertCircle size={18} className="shrink-0 mt-0.5"/>}
            {message.text}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Новый пароль</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Подтвердите пароль</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-[0.1em] text-xs shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Сохранение...' : 'Сменить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
```

### 📄 `src\pages\UserDashboard.tsx`
```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Project, ActiveTabType } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import { useUserSockets } from '../hooks/useUserSockets';
import { Rocket } from 'lucide-react'; // Иконка для заглушки
import DynamicProjectForm from '../components/dashboard/forms/DynamicProjectForm';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

// 🔥 ПЕРЕКЛЮЧАТЕЛЬ: поставь true, чтобы вернуть старый рабочий функционал
const SHOW_WORKING_FEATURES = true;

const WorkInProgressBanner = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <Rocket className="text-blue-500" size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">{title}</h2>
      <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Этот раздел находится в активной разработке. Старый функционал скрыт до момента финальной демонстрации.
      </p>
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-full">
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
        <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Скоро доступно</span>
      </div>
    </div>
  </div>
);

const UserDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab, setActiveTab } = useOutletContext<{
    activeTab: ActiveTabType;
    setActiveTab: (t: ActiveTabType) => void;
  }>();

  useUserSockets();

  const {
    projects, loading, totalCount, totalPages, currentPage, searchQuery,
    fetchProjects, setSearchQuery, setCurrentPage
  } = useProjectStore();

  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const markMessagesAsReadLocally = useChatStore((state) => state.markMessagesAsReadLocally);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useGlobalChatLoader(user, projects);
  useProjectSockets(user?.id);

  useEffect(() => {
    if (activeTab === 'projects-create') {
      setEditingProject(null);
      setSelectedCategory(null);
      setIsFormOpen(true);
    }
  }, [activeTab]);

  useEffect(() => { fetchProjects(); }, [currentPage, searchQuery, fetchProjects]);

  const handleOpenChat = useCallback(async (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project && user?.id) {
      setChatProject(project);
      setActiveChatId(projectId);
      markMessagesAsReadLocally(projectId, user.id);
      try {
        await fetch(`/api/chat/${projectId}/read`, { method: 'POST', credentials: 'include' });
      } catch (err) {
        console.error("Failed to mark messages as read on server", err);
      }
    }
  }, [projects, setActiveChatId, markMessagesAsReadLocally, user?.id]);

  const handleCloseChat = useCallback(() => {
    setChatProject(null);
    setActiveChatId(null);
  }, [setActiveChatId]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setSelectedCategory((project as any).formType || (project as any).category || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    setEditingProject(null);
    setActiveTab('projects-list');
  }, [setActiveTab]);

  const stats = useMemo(() => ({
  total: totalCount,
  active: projects.filter(p => p.status === 'IN_PROGRESS').length,
  completed: projects.filter(p => p.status === 'CLOSED').length,
  pending: projects.filter(p => p.status === 'PENDING' || p.status === 'REVISION').length,
  approved: projects.filter(p => p.status === 'APPROVED').length
}), [projects, totalCount]);

  // 🔥 ЕСЛИ РЕЖИМ ДЕМО (false) - ПОКАЗЫВАЕМ ЗАГЛУШКИ ДЛЯ ВСЕГО
  if (!SHOW_WORKING_FEATURES) {
    // Если открыты вкладки заказов - показываем заглушку
    if (activeTab === 'orders-list' || activeTab === 'orders-create') {
      return <WorkInProgressBanner title={activeTab === 'orders-list' ? 'Мои заказы' : 'Создать новый заказ'} />;
    }
    // Если открыты вкладки проектов - тоже заглушка (так как флаг false)
    if (activeTab === 'projects-list' || activeTab === 'projects-create' || activeTab === 'stats') {
       return <WorkInProgressBanner title="Работа с проектами" />;
    }
    // Для любых других случаев
    return <WorkInProgressBanner title="Раздел в разработке" />;
  }

  // 🔥 ЕСЛИ РЕЖИМ РАЗРАБОТКИ (true) - ПОКАЗЫВАЕМ РАБОЧИЙ ФУНКЦИОНАЛ
  return (
    <>
      {activeTab === 'stats' && (
        <StatsView stats={stats} onRefresh={() => fetchProjects()} isLoading={loading} title="Мои Проекты" variant="blue" />
      )}
      {activeTab === 'projects-list' && (
        <ProjectsListView
          projects={projects}
          isLoading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          onOpenChat={handleOpenChat}
          onEdit={handleEdit}
          user={user}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onCreateNew={() => { setEditingProject(null); setSelectedCategory(null); setIsFormOpen(true); }}
        />
      )}
      {/* Заглушки для заказов, если вдруг флаг true, а функционал заказов еще не готов */}
      {activeTab === 'orders-list' && <WorkInProgressBanner title="Мои заказы" />}
      {activeTab === 'orders-create' && <WorkInProgressBanner title="Работа с заказами" />}
      
      <ChatDrawer isOpen={!!chatProject} project={chatProject} user={user} onClose={handleCloseChat} variant="blue" />
      {isFormOpen && (
        <DynamicProjectForm
          onClose={handleCloseForm}
          onSuccess={async () => { handleCloseForm(); await fetchProjects(); }}
          initialData={editingProject}
        />
      )}
    </>
  );
};

export default UserDashboard;
```

### 📄 `src\pages\dashboard\DashboardDispatcher.tsx`
```typescript
import { useAuthStore } from '../../store/useAuthStore';
import AdminDashboard from '../../pages/AdminDashboard';
import ManagerDashboard from '../../pages/ManagerDashboard';
import UserDashboard from '../../pages/UserDashboard';

const DashboardDispatcher = () => {
  // Получаем юзера из Zustand
  const user = useAuthStore((state) => state.user);

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'USER':
    default:
      return <UserDashboard />;
  }
};

export default DashboardDispatcher;
```

### 📄 `src\schemas\passwordSchema.ts`
```typescript
import { z } from 'zod';

export const forceChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, 'Минимум 6 символов')
    .regex(/[A-Za-z]/, 'Должны быть буквы') // Опционально: требование к сложности
    .regex(/[0-9]/, 'Должны быть цифры'),   // Опционально
  
  confirmPassword: z.string(),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"], // Ошибка привяжется именно к этому полю
});

export type ForceChangePasswordFormData = z.infer<typeof forceChangePasswordSchema>;
```

### 📄 `src\schemas\userSchema.ts`
```typescript
import { z } from 'zod';

// Базовая схема (теперь name не обязателен по умолчанию)
const baseSchema = z.object({
  name: z.string().optional(), // Делаем опциональным, проверим обязательность внутри ролей
  email: z.string().email('Некорректный Email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']),
});

// Схема для ПАРТНЕРА (USER)
// name убран или сделан опциональным, добавлены поля компании
const partnerSchema = baseSchema.extend({
  role: z.literal('USER'),
  name: z.string().optional(), // Или .min(1), если контактное лицо все же нужно. Сейчас сделал необязательным.
  companyName: z.string().min(1, 'Название компании обязательно'),
  unp: z.string().regex(/^\d{9}$/, 'УНП должен содержать ровно 9 цифр'),
  phone: z.string().regex(/^\+375\d{9}$/, 'Формат: +375XXXXXXXXX'),
});

// Схема для МЕНЕДЖЕРА (и АДМИНА)
// Здесь name ОБЯЗАТЕЛЕН
const managerSchema = baseSchema.extend({
  role: z.literal('MANAGER'),
  name: z.string().min(1, 'ФИО обязательно'), // Возвращаем обязательность
  companyName: z.string().optional(),
  unp: z.string().optional(),
  phone: z.string().optional(),
});

const adminSchema = baseSchema.extend({
  role: z.literal('ADMIN'),
  name: z.string().min(1, 'ФИО обязательно'),
  companyName: z.string().optional(),
  unp: z.string().optional(),
  phone: z.string().optional(),
});

export const userFormSchema = z.discriminatedUnion('role', [
  partnerSchema,
  managerSchema,
  adminSchema,
]);

export type UserFormData = z.infer<typeof userFormSchema>;
```

### 📄 `src\store\useAuthStore.ts`
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authAPI from '../api/auth';
import { initSocket, disconnectSocket, getSocket } from '../api/socket';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  isInitialized: boolean;

  isSessionExpired: boolean;
  isSessionSuperseded: boolean;
  isUserBlocked: boolean;

  is2FARequired: boolean;
  tempUserId: number | null;

  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
  setSessionExpired: (expired: boolean) => void;
  setSessionSuperseded: (superseded: boolean) => void;
  setUserBlocked: (blocked: boolean) => void;

  setIs2FARequired: (val: boolean) => void;
  setTempUserId: (id: number | null) => void;

  checkAuth: () => Promise<void>;

  login: (credentials: any) => Promise<{
    success: boolean;
    user?: User;
    message?: string;
    requires2FA?: boolean;
    userId?: number;
    timeLeft?: number;
    attemptsLeft?: number;
    lockType?: string;
    userBlocked?: boolean;
  }>;

  verify2FA: (code: string) => Promise<{
    success: boolean;
    user?: User;
    message?: string;
    timeLeft?: number;
    attemptsLeft?: number;
  }>;

  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      _hasHydrated: false,
      isInitialized: false,
      isSessionExpired: false,
      isSessionSuperseded: false,
      isUserBlocked: false,

      is2FARequired: false,
      tempUserId: null,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setIs2FARequired: (val) => set({ is2FARequired: val }),
      setTempUserId: (id) => set({ tempUserId: id }),

      setSessionExpired: (expired) => {
        if (expired) {
          localStorage.removeItem('auth-storage');
          authAPI.logout('inactivity').catch(() => {});
        }
        set({ isSessionExpired: expired });
      },

      setSessionSuperseded: (superseded) => set({ isSessionSuperseded: superseded }),
      setUserBlocked: (blocked) => set({ isUserBlocked: blocked }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      checkAuth: async () => {
        try {
          const response: any = await authAPI.profile();
          const userData = response.data?.user || response.data || response.user || response;

          if (userData && userData.id) {
            set({
              user: userData,
              isAuthenticated: true,
              isInitialized: true,
              is2FARequired: false,
              tempUserId: null,
            });
            initSocket();
          } else {
            throw new Error('Данные пользователя не найдены');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            is2FARequired: false,
            tempUserId: null,
          });
          disconnectSocket();
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response: any = await authAPI.login(credentials);

          if (response.status === '2FA_REQUIRED') {
            const userId = response.data?.userId;
            if (userId) {
              set({
                isLoading: false,
                is2FARequired: true,
                tempUserId: userId,
              });
              return {
                success: false,
                requires2FA: true,
                userId,
                message: 'Требуется код подтверждения',
              };
            }
          }

          const userData = response.user || response.data?.user || response;

          if (userData) {
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
              is2FARequired: false,
              tempUserId: null,
            });
            initSocket();
            return { success: true, user: userData };
          }

          set({ isLoading: false });
          return { success: false, message: 'Данные пользователя не получены' };
        } catch (error: any) {
          set({ isLoading: false });

          let errorMessage = 'Ошибка входа';
          let extraData: any = {};

          try {
            const errorBody = await error.response?.json();
            errorMessage = errorBody?.error || errorBody?.message || errorBody?.msg || errorMessage;
            if (errorBody.lockUntil) extraData.lockUntil = new Date(errorBody.lockUntil);
            if (errorBody.timeLeft) extraData.timeLeft = errorBody.timeLeft;
            if (errorBody.attemptsLeft !== undefined) extraData.attemptsLeft = errorBody.attemptsLeft;
            if (errorBody.lockType) extraData.lockType = errorBody.lockType;
            if (errorBody.code === 'USER_BLOCKED') extraData.userBlocked = true;
          } catch (e) {
            errorMessage = error.message || errorMessage;
          }
          return { success: false, message: errorMessage, ...extraData };
        }
      },

      verify2FA: async (code: string) => {
        const userId = get().tempUserId;
        if (!userId) {
          return { success: false, message: 'Ошибка сессии: ID пользователя не найден' };
        }

        try {
          const response: any = await authAPI.verify2FACode(userId, code);
          const userData = response.data?.user || response.user;

          if (userData) {
            set({
              user: userData,
              isAuthenticated: true,
              is2FARequired: false,
              tempUserId: null,
              isInitialized: true,
              isLoading: false,
            });
            initSocket();
            return { success: true, user: userData };
          }
          return { success: false, message: 'Ошибка проверки кода' };
        } catch (error: any) {
          let errorMessage = 'Неверный код';
          let extraData: any = {};
          try {
            const errorBody = await error.response?.json();
            errorMessage = errorBody?.error || errorBody?.message || errorMessage;
            if (errorBody.timeLeft) extraData.timeLeft = errorBody.timeLeft;
            if (errorBody.attemptsLeft !== undefined) extraData.attemptsLeft = errorBody.attemptsLeft;
          } catch (e) {
            errorMessage = error.message || errorMessage;
          }
          return { success: false, message: errorMessage, ...extraData };
        }
      },

      logout: async () => {
        const currentUser = get().user;
        try {
          const socket = getSocket();
          if (socket?.connected) {
            socket.emit('user_logging_out');
          }
          await authAPI.logout('manual', currentUser?.id?.toString());
        } finally {
          disconnectSocket();
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isSessionExpired: false,
            is2FARequired: false,
            tempUserId: null,
          });
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 📄 `src\store\useChatStore.ts`
```typescript
import { create } from 'zustand';
import { useProjectStore } from './useProjectStore';

interface Message {
  id: number;
  projectId: number;
  senderId: string | number;
  text: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatStore {
  messages: Record<number, Message[]>;
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
  setMessages: (projectId: number, messages: Message[]) => void;
  addMessage: (projectId: number, message: Message) => void;
  markMessagesAsReadLocally: (projectId: number, currentUserId: string | number) => void;
  markMyMessagesAsRead: (projectId: number, readerId: string | number) => void;
  getUnreadCount: (projectId: number, userId: string | number | undefined) => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: {},
  activeChatId: null,

  setActiveChatId: (id) => set({ activeChatId: id }),

  setMessages: (projectId, msgs) => {
    set((state) => ({
      messages: { ...state.messages, [projectId]: msgs }
    }));
  },

  addMessage: (projectId, message) => {
    set((state) => {
      const prev = state.messages[projectId] || [];
      if (prev.some(m => m.id === message.id)) return state;
      return { messages: { ...state.messages, [projectId]: [...prev, message] } };
    });
  },

  markMessagesAsReadLocally: (projectId, currentUserId) => {
    if (!currentUserId) return;
    const pId = Number(projectId);

    // Сбрасываем счетчик непрочитанных в списке проектов
    useProjectStore.getState().setProjects((prev) => 
      prev.map(p => Number(p.id) === pId ? { ...p, unreadCount: 0, hasUnread: false } : p)
    );

    set((state) => {
      const msgs = state.messages[pId];
      if (!msgs) return state;

      const updated = msgs.map(m => 
        String(m.senderId) !== String(currentUserId) && !m.isRead ? { ...m, isRead: true } : m
      );

      return { messages: { ...state.messages, [pId]: updated } };
    });
  },

  // Вызывается когда СОБЕСЕДНИК прочитал сообщения. readerId = тот, кто открыл чат.
  markMyMessagesAsRead: (projectId, readerId) => {
    if (!readerId) return;
    const pId = Number(projectId);

    set((state) => {
      const msgs = state.messages[pId];
      if (!msgs) return state;

      // Если отправитель НЕ тот, кто прочитал -> значит это моё сообщение
      const updated = msgs.map(m => 
        String(m.senderId) !== String(readerId) && !m.isRead ? { ...m, isRead: true } : m
      );

      return { messages: { ...state.messages, [pId]: updated } };
    });
  },

  getUnreadCount: (projectId, userId) => {
    if (!userId) return 0;
    const msgs = get().messages[projectId] || [];
    return msgs.filter(m => !m.isRead && String(m.senderId) !== String(userId)).length;
  }
}));
```

### 📄 `src\store\useProjectStore.ts`
```typescript
import { create } from 'zustand';
import projectApi from '../api/projects'; // Наш новый API на ky
import type { Project } from '../types';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  fetchProjects: (silent?: boolean) => Promise<void>;
  updateProjectStatus: (id: number, status: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  searchQuery: '',

 setProjects: (next) => {
  set((state) => ({
    projects: typeof next === 'function' ? next(state.projects) : next
  }));
},

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchProjects: async (silent = false) => {
    if (!silent) set({ loading: true });
    try {
      const { currentPage, searchQuery } = get();
      
      // Вызываем API. Ky автоматически возвращает распарсенный JSON
      const response = await projectApi.getProjects(currentPage, searchQuery);
      
      // Защита от некорректного ответа API
      const projects = Array.isArray(response?.projects) ? response.projects : [];
      
      set({ 
        projects: projects, 
        totalPages: response?.totalPages ?? 1,
        totalCount: response?.totalCount ?? 0
      });
    } catch (error) {
      console.error('Ошибка стора при загрузке проектов:', error);
      // При ошибке сбрасываем проекты в пустой массив
      set({ projects: [] });
    } finally {
      set({ loading: false });
    }
  },

  updateProjectStatus: async (id, status) => {
    try {
      // Используем метод из нашего нового API клиента
      await projectApi.updateStatus(id, status);
      
      // Оптимистичное обновление: меняем статус в локальном стейте мгновенно
      set((state) => {
        // Критическая проверка: убеждаемся, что projects - это массив
        if (!Array.isArray(state.projects)) {
          console.error('updateProjectStatus: state.projects не является массивом!', state.projects);
          return { projects: [] };
        }
        
        return {
          projects: state.projects.map((p) => 
            p.id === id ? { ...p, status: status as any } : p
          ),
        };
      });
    } catch (error: any) {
      console.error('Ошибка при обновлении статуса:', error);
      throw error;
    }
  },
}));
```

### 📄 `src\store\useUserStore.ts`
```typescript
import { create } from 'zustand';
import userApi from '../api/user';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastSeen: string;
  companyName?: string;
  unp?: string;
  isOnline?: boolean;
  isBlocked?: boolean;
  lockUntil?: string | null;
  failedLoginAttempts?: number;
  twoFactorLockUntil?: string | null;
  twoFactorAttempts?: number;
}

interface AdminStats {
  totalUsers: number;
  totalManagers: number;
  onlineCount: number;
  details: {
    onlineUsers: number;
    onlineManagers: number;
  };
}

interface UserStore {
  users: UserData[];
  loading: boolean;
  stats: AdminStats | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setStats: (stats: AdminStats) => void;
  fetchUsers: () => Promise<void>;
  fetchStats: (silent?: boolean) => Promise<void>;
  createUser: (formData: any) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleBlock: (id: number) => Promise<void>;
  updateUserStatus: (userId: number, isOnline: boolean) => void;
  updateUserBlockedStatus: (userId: number, isBlocked: boolean) => void;
  updateUserLockStatus: (userId: number, updates: {
    lockUntil?: string | null;
    failedLoginAttempts?: number;
    twoFactorLockUntil?: string | null;
    twoFactorAttempts?: number;
  }) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  stats: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchUsers();
  },

  setStats: (stats) => set({ stats }),

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await userApi.getAllUsers({
        page: get().currentPage,
        search: get().searchQuery,
      }) as { users: UserData[]; totalPages: number; totalCount: number };
      
      set({
        users: response.users,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      });
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchStats: async (silent = false) => {
    if (!silent) set({ loading: true });
    try {
      const stats = await userApi.getAdminStats() as AdminStats;
      set({ stats });
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      if (!silent) set({ loading: false });
    }
  },

  createUser: async (formData) => {
    set({ loading: true });
    try {
      await userApi.register(formData);
      await get().fetchUsers();
      await get().fetchStats(true);
    } catch (error: any) {
      if (error.response) {
        const errorData = await error.response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Ошибка регистрации');
      }
      throw new Error(error.message || 'Ошибка сети');
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await userApi.deleteUser(id);
      set((state) => ({
        users: state.users.filter(u => u.id !== id),
        totalCount: Math.max(0, state.totalCount - 1),
      }));
      get().fetchStats(true);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Ошибка при удалении');
    }
  },

  toggleBlock: async (id) => {
    try {
      await userApi.toggleBlock(id);
      await get().fetchUsers(); // Полный перезапрос для актуализации всех статусов
    } catch (error) {
      console.error('Toggle block error:', error);
      alert('Ошибка при изменении статуса блокировки');
    }
  },

  updateUserStatus: (userId, isOnline) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === userId ? { ...u, isOnline } : u
      ),
    }));
  },

  updateUserBlockedStatus: (userId, isBlocked) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === userId ? { ...u, isBlocked } : u
      ),
    }));
  },

  updateUserLockStatus: (userId, updates) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === userId ? { ...u, ...updates } : u
      ),
    }));
  },
}));
```

### 📄 `src\types\index.ts`
```typescript
// Типы для пользователей
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
  companyName?: string;
  unp?: string;
  phone?: string;
  isBlocked?: boolean;
  lockUntil?: string | null;
  twoFactorLockUntil?: string | null;
  createdAt?: string;
  lastSeen?: string;
}

// Типы для проектов (регистраций)
export interface Project {
  id: number;
  name: string;
  unp: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'CLOSED';
  managerId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  dynamicData: any;
  customerName: string;
  customerInn: string;
  unreadCount?: number;
  hasUnread?: boolean;
}

// Типы для статистики (используются в AdminOverview)
export interface AdminStats {
  totalUsers: number;
  totalManagers: number;
  onlineCount: number;
  details: {
    onlineUsers: number;
    onlineManagers: number;
  };
}

// Типы для пропсов компонентов (например, для ProjectsListView)
export interface ProjectsListViewProps {
  projects: Project[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  isAdminView?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusUpdate?: (id: number, status: Project['status']) => Promise<void>;
  onOpenChat?: (projectId: number) => void;
}

export type ActiveTabType = 
  | 'stats' 
  | 'projects-list' 
  | 'projects-create' 
  | 'users-list' 
  | 'users-create' 
  | 'orders-list' 
  | 'orders-create'
  | 'logs'; // добавлено

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
  approved: number;
}
```

