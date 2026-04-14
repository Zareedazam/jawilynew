import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../styles/AdminLayout.css'

export default function AdminLayout({ children, adminData, handleLogout }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header adminData={adminData} handleLogout={handleLogout} />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
