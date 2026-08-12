// app/lib/auth.ts
export function getDashboardPath(role: string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin/dashboard';
    case 'staff':
      return '/staff/dashboard';
    case 'teacher':
      return '/teachers/dashboard';
    case 'student':
      return '/students/dashboard';
    default:
      return '/dashboard';
  }
}

export function getRoleBasedHomePath(role: string): string {
  return getDashboardPath(role);
}