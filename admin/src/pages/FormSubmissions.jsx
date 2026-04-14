import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'
import '../styles/Submissions.css'

export default function FormSubmissions({ adminData, handleLogout }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState(null)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const STATUS_OPTIONS = ['Submitted', 'Under Review', 'Documents Pending', 'Approved', 'Rejected']

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_ENDPOINTS.FORM_SUBMISSIONS}`)
      if (!response.ok) throw new Error('Failed to fetch form submissions')
      const data = await response.json()
      setSubmissions(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching form submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (submissionId, nextStatus) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_ENDPOINTS.FORM_SUBMISSIONS}/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationStatus: nextStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      const updated = await response.json()
      setSubmissions(submissions.map(s => s._id === submissionId ? updated : s))
    } catch (err) {
      setError(err.message)
      console.error('Error updating status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (submissionId) => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.FORM_SUBMISSIONS}/${submissionId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete submission')
      setSubmissions(submissions.filter(sub => sub._id !== submissionId))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting submission:', err)
    } finally {
      setLoading(false)
    }
  }

  const openDetails = async (submissionId) => {
    try {
      setDetailsOpen(true)
      setDetailsLoading(true)
      setDetailsError(null)
      setSelectedSubmission(null)

      const response = await fetch(`${API_ENDPOINTS.FORM_SUBMISSIONS}/${submissionId}`)
      if (!response.ok) throw new Error('Failed to fetch submission details')
      const data = await response.json()
      setSelectedSubmission(data || null)
    } catch (err) {
      setDetailsError(err.message)
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeDetails = () => {
    setDetailsOpen(false)
    setSelectedSubmission(null)
    setDetailsError(null)
    setDetailsLoading(false)
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <div className="submissions-container">
        <h2>Applications</h2>
        
        <div className="submissions-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <p>No applications yet</p>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                      User applications will appear here
                    </p>
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr
                    key={submission._id}
                    onClick={() => openDetails(submission._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{submission.formType || '-'}</td>
                    <td>{submission.firstName}</td>
                    <td>{submission.lastName}</td>
                    <td>{submission.email}</td>
                    <td>{submission.phone}</td>
                    <td>{submission.country}</td>
                    <td>
                      {submission.formType === 'application' ? (
                        <select
                          value={submission.applicationStatus || 'Submitted'}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleStatusChange(submission._id, e.target.value)
                          }}
                          disabled={loading}
                        >
                          {STATUS_OPTIONS.map((x) => (
                            <option key={x} value={x}>{x}</option>
                          ))}
                        </select>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(submission._id)
                        }}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {detailsOpen ? (
          <div
            onClick={closeDetails}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              zIndex: 9999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(900px, 100%)',
                maxHeight: '80vh',
                overflow: 'auto',
                background: '#fff',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <h3 style={{ margin: 0 }}>Submission Details</h3>
                <button onClick={closeDetails} className="btn-delete">
                  Close
                </button>
              </div>

              {detailsLoading ? (
                <div style={{ marginTop: 12 }}>Loading...</div>
              ) : detailsError ? (
                <div style={{ marginTop: 12, color: 'red' }}>{detailsError}</div>
              ) : selectedSubmission ? (
                <div style={{ marginTop: 12 }}>
                  {Object.keys(selectedSubmission)
                    .filter((k) => k !== '__v' && k !== '_id' && k !== 'createdAt' && k !== 'updatedAt')
                    .map((k) => (
                      <div
                        key={k}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '220px 1fr',
                          gap: 12,
                          padding: '8px 0',
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#555' }}>{k}</div>
                        <div style={{ color: '#111', wordBreak: 'break-word' }}>
                          {typeof selectedSubmission[k] === 'object' && selectedSubmission[k] !== null
                            ? JSON.stringify(selectedSubmission[k])
                            : String(selectedSubmission[k])}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>No details.</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  )
}
