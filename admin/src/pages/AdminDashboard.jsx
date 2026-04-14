import AdminLayout from '../components/AdminLayout'
import '../styles/Dashboard.css'

export default function AdminDashboard({ adminData, handleLogout }) {
  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <div className="dashboard-container">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage all content from here</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>📚 Courses</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>🎓 Universities</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>🏠 Accommodation</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>💰 Education Loans</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>👥 Users</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>📋 Submissions</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
