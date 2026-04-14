import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'
import '../styles/UsersList.css'

export default function Users({ adminData, handleLogout }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.USERS)
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (userId) => {
    if (!confirm('Are you sure you want to remove this user?')) return
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to remove user')
      setUsers(users.filter(user => user._id !== userId))
    } catch (err) {
      setError(err.message)
      console.error('Error removing user:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <div className="users-container">
        <h2>Registered Users</h2>
        
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <p>No users registered yet</p>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                      Users who register on the frontend will appear here
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td><span className="status-badge">Active</span></td>
                    <td>
                      <button className="btn-view">View</button>
                      <button onClick={() => handleRemove(user._id)} className="btn-remove">Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
