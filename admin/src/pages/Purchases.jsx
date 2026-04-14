import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'
import '../styles/UsersList.css'

export default function Purchases({ adminData, handleLogout }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const adminCreds = useMemo(() => {
    const raw = localStorage.getItem('adminCreds')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    fetchPurchases()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      setError(null)

      const email = adminCreds?.email || ''
      const password = adminCreds?.password || ''

      if (!email || !password) {
        throw new Error('Missing admin credentials. Please logout and login again.')
      }

      const response = await fetch(API_ENDPOINTS.PAYMENTS.PURCHASES_ADMIN, {
        headers: {
          'x-admin-email': email,
          'x-admin-password': password,
        },
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to fetch purchases')
      setPurchases(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Error fetching purchases')
      console.error('Error fetching purchases:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <div className="users-container">
        <h2>Purchased Plans</h2>

        {error ? <div style={{ color: 'red', marginBottom: 12 }}>{error}</div> : null}

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Purchased By</th>
                <th>User Email</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Loading...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    <p>No purchases yet</p>
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p._id}>
                    <td>{p.planName || p.planId || '-'}</td>
                    <td>{p.purchaserName || '-'}</td>
                    <td>{p.purchaserEmail || '-'}</td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
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
