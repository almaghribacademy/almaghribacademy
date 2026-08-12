'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ fontSize: '1.25rem', color: '#4b5563' }}>Loading...</div>
      </div>
    );
  }

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
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
  };

  const getNavigation = () => {
    const navItems = [{ name: 'Dashboard', href: getDashboardPath() }];

    switch (user?.role) {
      case 'super_admin':
      case 'admin':
        navItems.push(
          { name: 'Students', href: '/admin/students' },
          { name: 'Teachers', href: '/admin/teachers' },
          { name: 'Staff', href: '/admin/staff' },
          { name: 'Courses', href: '/admin/courses' },
          { name: 'Enrollments', href: '/admin/enrollments' },
          { name: 'Payments', href: '/admin/payments' },
          { name: 'Teacher Applications', href: '/admin/teacher-applications' },
          { name: 'Student Trials', href: '/admin/student-trials' }
        );
        break;
        
      case 'staff':
        navItems.push(
          { name: 'Students', href: '/staff/students' },
          { name: 'Classes', href: '/staff/classes' },
          { name: 'Attendance', href: '/staff/attendance' }
        );
        break;
        
      case 'teacher':
        navItems.push(
          { name: 'My Classes', href: '/teachers/classes' },
          { name: 'Students', href: '/teachers/students' },
          { name: 'Attendance', href: '/teachers/attendance' },
          { name: 'Assessments', href: '/teachers/assessments' }
        );
        break;
        
      case 'student':
        navItems.push(
          { name: 'My Classes', href: '/students/classes' },
          { name: 'Attendance', href: '/students/attendance' },
          { name: 'Assessments', href: '/students/assessments' },
          { name: 'Payments', href: '/students/payments' }
        );
        break;
        
      default:
        navItems.push(
          { name: 'Profile', href: '/profile' }
        );
        break;
    }
    
    return navItems;
  };

  const navigation = getNavigation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <aside style={{
        width: '256px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 50
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d6a4f' }}>AlMaghrib Academy</h1>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>{user?.fullName}</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>
            {user?.role?.replace('_', ' ')}
          </p>
        </div>
        <nav style={{ padding: '1rem' }}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: pathname === item.href ? '#2d6a4f' : '#4b5563',
                backgroundColor: pathname === item.href ? '#d1fae5' : 'transparent',
                marginBottom: '0.25rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              color: '#dc2626',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '256px', padding: '2rem', width: '100%', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}