export type UserRole = 'employee' | 'organizer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: number;
  phone?: string;
}

export interface Department {
  id: number;
  name: string;
}

export function isOrganizer(user: User | null): boolean {
  const role = user?.role?.toLowerCase();
  return role === 'organizer';
}
export function isEmployee(user: User | null): boolean {
  return user?.role === 'employee';
}
