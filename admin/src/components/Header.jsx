import { useNavigate } from 'react-router-dom'
import '../styles/Header.css'

export default function Header({ adminData, handleLogout }) {
  const navigate = useNavigate()

  const onLogout = () => {
    handleLogout()
    navigate('/')
  }

  return (
    <div className="admin-header">
      <div className="header-content">
        <h2>Jawily Admin Panel</h2>
        <div className="header-right">
          <span className="admin-name">{adminData?.email || 'Admin'}</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
