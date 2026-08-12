import DashboardLayout from '@/app/dashboard-layout';

export default function StudentsDashboardPage() {
  return (
    <DashboardLayout>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a2e' }}>
        Student Dashboard
      </h1>
      <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
        Welcome to your student dashboard
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <div style={{ 
          backgroundColor: '#eff6ff', 
          padding: '1.5rem', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1e40af', fontWeight: '600' }}>My Classes</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>0</p>
        </div>
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          padding: '1.5rem', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#166534', fontWeight: '600' }}>Attendance</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#166534' }}>0</p>
        </div>
        <div style={{ 
          backgroundColor: '#faf5ff', 
          padding: '1.5rem', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#6b21a8', fontWeight: '600' }}>Assessments</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#6b21a8' }}>0</p>
        </div>
      </div>
    </DashboardLayout>
  );
}