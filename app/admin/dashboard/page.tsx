'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalCourses: number;
  totalEnrollments: number;
  totalPayments: number;
  pendingTeacherApplications: number;
  pendingStudentTrials: number;
  recentStudents: any[];
  recentTeachers: any[];
  recentPayments: any[];
  recentActivity: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();
        
        if (!userData.success) {
          router.push('/auth/login');
          return;
        }
        
        setUser(userData.user);

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/admin/dashboard-stats');
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{ fontSize: '1.25rem', color: '#4b5563' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{ color: '#dc2626' }}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a2e' }}>
            Welcome, {user?.fullName}!
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
            Super Admin Dashboard Overview
          </p>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents || 0} 
          color="#3b82f6"
          icon="👨‍🎓"
        />
        <StatCard 
          title="Total Teachers" 
          value={stats?.totalTeachers || 0} 
          color="#10b981"
          icon="👨‍🏫"
        />
        <StatCard 
          title="Total Staff" 
          value={stats?.totalStaff || 0} 
          color="#8b5cf6"
          icon="👔"
        />
        <StatCard 
          title="Total Courses" 
          value={stats?.totalCourses || 0} 
          color="#f59e0b"
          icon="📚"
        />
        <StatCard 
          title="Enrollments" 
          value={stats?.totalEnrollments || 0} 
          color="#ec4899"
          icon="📝"
        />
        <StatCard 
          title="Payments" 
          value={stats?.totalPayments || 0} 
          color="#14b8a6"
          icon="💰"
        />
      </div>

      {/* Pending Items Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <PendingCard 
          title="Pending Teacher Applications" 
          count={stats?.pendingTeacherApplications || 0}
          link="/admin/teacher-applications"
          color="#f59e0b"
        />
        <PendingCard 
          title="Pending Student Trials" 
          count={stats?.pendingStudentTrials || 0}
          link="/admin/student-trials"
          color="#3b82f6"
        />
      </div>

      {/* Recent Activity Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Students */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Recent Students
          </h3>
          {stats?.recentStudents?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {stats.recentStudents.slice(0, 5).map((student, index) => (
                <li key={index} style={{ 
                  padding: '0.5rem 0', 
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{student.firstName} {student.lastName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#6b7280' }}>No recent students</p>
          )}
          <Link href="/admin/students" style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            color: '#2d6a4f',
            textDecoration: 'none'
          }}>
            View All →
          </Link>
        </div>

        {/* Recent Teachers */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Recent Teachers
          </h3>
          {stats?.recentTeachers?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {stats.recentTeachers.slice(0, 5).map((teacher, index) => (
                <li key={index} style={{ 
                  padding: '0.5rem 0', 
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{teacher.firstName} {teacher.lastName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {teacher.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#6b7280' }}>No recent teachers</p>
          )}
          <Link href="/admin/teachers" style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            color: '#2d6a4f',
            textDecoration: 'none'
          }}>
            View All →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.25rem', 
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{title}</p>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a2e', margin: '0.25rem 0 0 0' }}>
            {value}
          </p>
        </div>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
    </div>
  );
}

// Pending Card Component
function PendingCard({ title, count, link, color }: { title: string; count: number; link: string; color: string }) {
  return (
    <Link href={link} style={{ textDecoration: 'none' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.25rem', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderLeft: `4px solid ${color}`,
        cursor: 'pointer',
        transition: 'transform 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{title}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a2e', margin: '0.25rem 0 0 0' }}>
              {count}
            </p>
          </div>
          <span style={{ fontSize: '1.5rem', color: '#9ca3af' }}>→</span>
        </div>
      </div>
    </Link>
  );
}