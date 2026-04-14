import { Link, useLocation } from 'react-router-dom'
import '../styles/Sidebar.css'

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Jawily Admin</h1>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          📊 Dashboard
        </Link>

        <div className="sidebar-section">
          <h3>Content Management</h3>
          <Link
            to="/foundation-programs"
            className={`sidebar-link ${isActive('/foundation-programs') ? 'active' : ''}`}
          >
            🧩 Foundation Programs
          </Link>
          <Link
            to="/scholarships"
            className={`sidebar-link ${isActive('/scholarships') ? 'active' : ''}`}
          >
            🎓 Scholarships
          </Link>
          <Link
            to="/courses"
            className={`sidebar-link ${isActive('/courses') ? 'active' : ''}`}
          >
            📚 Courses
          </Link>
          <Link
            to="/universities"
            className={`sidebar-link ${isActive('/universities') ? 'active' : ''}`}
          >
            🎓 Universities
          </Link>
          <Link
            to="/accommodation"
            className={`sidebar-link ${isActive('/accommodation') ? 'active' : ''}`}
          >
            🏠 Accommodation
          </Link>
          <Link
            to="/education-loans"
            className={`sidebar-link ${isActive('/education-loans') ? 'active' : ''}`}
          >
            💰 Education Loans
          </Link>
          <Link
            to="/services"
            className={`sidebar-link ${isActive('/services') ? 'active' : ''}`}
          >
            🛠️ Services
          </Link>
          <Link
            to="/news"
            className={`sidebar-link ${isActive('/news') ? 'active' : ''}`}
          >
            📰 News
          </Link>
          <Link
            to="/blogs"
            className={`sidebar-link ${isActive('/blogs') ? 'active' : ''}`}
          >
            📝 Blogs
          </Link>
          <Link
            to="/events"
            className={`sidebar-link ${isActive('/events') ? 'active' : ''}`}
          >
            🎉 Events
          </Link>
        </div>

        <div className="sidebar-section">
          <h3>User Management</h3>
          <Link
            to="/users"
            className={`sidebar-link ${isActive('/users') ? 'active' : ''}`}
          >
            👥 Users
          </Link>
          <Link
            to="/submissions"
            className={`sidebar-link ${isActive('/submissions') ? 'active' : ''}`}
          >
            📋 Form Submissions
          </Link>
          <Link
            to="/purchases"
            className={`sidebar-link ${isActive('/purchases') ? 'active' : ''}`}
          >
            💳 Purchases
          </Link>
        </div>
      </nav>
    </div>
  )
}
