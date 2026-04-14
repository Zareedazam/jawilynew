import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Courses from './pages/Courses'
import Universities from './pages/Universities'
import Accommodation from './pages/Accommodation'
import EducationLoans from './pages/EducationLoans'
import Services from './pages/Services'
import News from './pages/News'
import Blogs from './pages/Blogs'
import Events from './pages/Events'
import FormSubmissions from './pages/FormSubmissions'
import Users from './pages/Users'
import Purchases from './pages/Purchases'
import FoundationPrograms from './pages/FoundationPrograms'
import Scholarships from './pages/Scholarships'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminData, setAdminData] = useState(null)

  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (admin) {
      setIsLoggedIn(true)
      setAdminData(JSON.parse(admin))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminCreds')
    setIsLoggedIn(false)
    setAdminData(null)
  }

  if (!isLoggedIn) {
    return <AdminLogin setIsLoggedIn={setIsLoggedIn} setAdminData={setAdminData} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/courses" element={<Courses adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/universities" element={<Universities adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/accommodation" element={<Accommodation adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/education-loans" element={<EducationLoans adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/services" element={<Services adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/news" element={<News adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/blogs" element={<Blogs adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/events" element={<Events adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/submissions" element={<FormSubmissions adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/users" element={<Users adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/purchases" element={<Purchases adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/foundation-programs" element={<FoundationPrograms adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/scholarships" element={<Scholarships adminData={adminData} handleLogout={handleLogout} />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
