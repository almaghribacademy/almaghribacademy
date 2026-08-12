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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const getNavigation = () => {
    const navItems = [];
    navItems.push({ name: 'Dashboard', href: getDashboardPath(user?.role || '') });

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
          { name: 'Settings', href: '/admin/settings' }
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
    }
    return navItems;
  };

  const getDashboardPath = (role: string) => {
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
  };

  const navigation = getNavigation();

  return (
    <div className="dashboard-layout">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 60,
          padding: '0.5rem',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          display: 'block'
        }}
        className="menu-toggle"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>AlMaghrib Academy</h1>
          <p className="user-name">{user?.fullName}</p>
          <p className="user-role">{user?.role?.replace('_', ' ')}</p>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}