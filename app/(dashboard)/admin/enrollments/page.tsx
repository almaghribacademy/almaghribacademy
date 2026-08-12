'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Enrollment {
  id: number;
  student: {
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    name: string;
  };
  teacher: {
    firstName: string;
    lastName: string;
  } | null;
  status: string;
  progressPercentage: number;
  enrollmentDate: string;
  createdAt: string;
}

export default function EnrollmentsPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch('/api/admin/enrollments');
        const data = await response.json();
        if (data.success) {
          setEnrollments(data.data);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ fontSize: '1.25rem', color: '#4b5563' }}>Loading enrollments...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a2e' }}>
          Enrollments
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search enrollments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              outline: 'none',
              width: '250px'
            }}
          />
          <button
            style={{
              backgroundColor: '#2d6a4f',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            New Enrollment
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        overflow: 'hidden',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Student
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Course
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Teacher
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Progress
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Enrolled
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#1a1a2e' }}>
                    {enrollment.student.firstName} {enrollment.student.lastName}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {enrollment.course.name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {enrollment.teacher ? `${enrollment.teacher.firstName} ${enrollment.teacher.lastName}` : 'Not assigned'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '6px', 
                        backgroundColor: '#e5e7eb', 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${enrollment.progressPercentage}%`, 
                          height: '100%', 
                          backgroundColor: '#2d6a4f',
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span>{enrollment.progressPercentage}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      backgroundColor: enrollment.status === 'active' ? '#d1fae5' : '#fef3c7',
                      color: enrollment.status === 'active' ? '#065f46' : '#92400e',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No enrollments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}