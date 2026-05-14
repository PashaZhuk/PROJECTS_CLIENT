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
  | 'logs'
  | 'settings'
  | 'broadcast' // доведение информации
  | 'broadcast-journal' // журнал рассылок
  | 'db-viewer' // просмотр и редактирование БД
  | 'db-backup' // бэкап БД
  | 'equipment' // ведомость оборудования
  | 'monitoring-history' // история событий контроля
  | 'news'; // управление новостями портала

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
  approved: number;
}

// --- API Input Types (вместо `any` в методах API-клиента) ---

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  role?: 'USER' | 'MANAGER';
  companyName?: string;
  unp?: string;
  phone?: string;
}

export interface CreateProjectInput {
  formType: string;
  customerName: string;
  customerInn: string;
  purchaseMethod?: string;
  executionDate?: string | Date | null;
  [key: string]: unknown; // passthrough
}

export interface ChangePasswordInput {
  newPassword: string;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}