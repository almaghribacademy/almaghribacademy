'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StudentTrial {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  preferredCourse: string;
  preferredTeacher: string;
  status: string;
  preferredDate: string;
  createdAt: string;
}

export default function StudentTrialsPage() {
  const router = useRouter();
  const [trials, setTrials] = useState<StudentTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrials = async () => {
      try {
        const response = await fetch('/api/admin/student-trials');
        const data = await response.json();
        if (data.success) {
          setTrials(data.data);
        }
      } catch (error) {
        console.error('Error fetching trials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrials();
  }, []);

  const filteredTrials = trials.filter(trial =>
    trial.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trial.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trial.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#fef3c7';
      case 'approved': return '#d1fae5';
      case 'completed': return '#dbeafe';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch(status) {
      case 'pending': return '#92400e';
      case 'approved': return '#065f46';
      case 'completed': return '#1e40af';
      case 'cancelled': return '#991b1b';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ fontSize: '1.25rem', color: '#4b5563' }}>Loading trials...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a2e' }}>
          Student Trials
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search trials..."
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
                Name
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Email
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Course
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Preferred Teacher
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Preferred Date
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Submitted
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTrials.length > 0 ? (
              filteredTrials.map((trial) => (
                <tr key={trial.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#1a1a2e' }}>
                    {trial.firstName} {trial.lastName}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {trial.email}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {trial.preferredCourse || 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {trial.preferredTeacher || 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {trial.preferredDate ? new Date(trial.preferredDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      backgroundColor: getStatusColor(trial.status),
                      color: getStatusTextColor(trial.status),
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {trial.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(trial.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No trials found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}