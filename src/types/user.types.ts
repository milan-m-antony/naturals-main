export type UserRole = 'owner' | 'admin' | 'staff' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  membership_tier?: string;
  total_visits?: number;
  total_spent?: number;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  role: 'owner' | 'admin' | 'staff';
  id?: number;
  name?: string;
  email?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipTier?: string;
  joinDate?: string;
  totalVisits?: number;
  totalSpent?: number;
  favoriteServices?: number[];
  profileImage?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | AdminUser | null;
  role?: UserRole;
}
