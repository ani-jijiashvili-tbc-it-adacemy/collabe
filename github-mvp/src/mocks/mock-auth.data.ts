import { UserRole } from '../app/shared/models/user.model';

interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  departmentId: number;
  phone: string;
}
export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'ani.jijiashvili.1997@gmail.com',
    password: 'Password123!',
    role: 'employee' as const,
    departmentId: 1,
    phone: '+995555123456',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'ani@gmail.com',
    password: 'Ani12345',
    role: 'organizer' as const,
    departmentId: 4,
    phone: '+995555123457',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    password: 'Password123!',
    role: 'employee' as const,
    departmentId: 2,
    phone: '+995555123458',
  },
];
export const MOCK_DEPARTMENTS = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Sales' },
  { id: 4, name: 'HR' },
  { id: 5, name: 'Finance' },
  { id: 6, name: 'Operations' },
  { id: 7, name: 'Product' },
  { id: 8, name: 'Customer Success' },
];
