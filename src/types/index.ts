// Типы для пользователей
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
  createdAt?: string;
}

// Типы для проектов (регистраций)
export interface Project {
  id: number;
  name: string;
  unp: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'CLOSED' | 'START' | 'COMPLETED';
  managerId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  dynamicData: any;
  customerName: string;
  customerInn: string;
  // Добавляем эти поля, чтобы TS не ругался в сторах и сокетах
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
  | 'orders-create';

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
  approved: number; // Добавлено, так как StatsView его требует
}