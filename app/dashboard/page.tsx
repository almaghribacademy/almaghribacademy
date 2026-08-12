'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.success) {
          const role = data.user.role;
          let redirectPath = '/admin/dashboard';
          
          if (role === 'super_admin' || role === 'admin') {
            redirectPath = '/admin/dashboard';
          } else if (role === 'staff') {
            redirectPath = '/staff/dashboard';
          } else if (role === 'teacher') {
            redirectPath = '/teachers/dashboard';
          } else if (role === 'student') {
            redirectPath = '/students/dashboard';
          }
          
          router.push(redirectPath);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        router.push('/auth/login');
      }
    };
    
    checkAuth();
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{ fontSize: '1.25rem', color: '#4b5563' }}>Redirecting to your dashboard...</div>
    </div>
  );
}