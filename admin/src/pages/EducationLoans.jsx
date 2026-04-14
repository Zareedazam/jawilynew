import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function EducationLoans({ adminData, handleLogout }) {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const normalizeFormData = (formData) => {
    const normalized = { ...formData }
    if (typeof normalized.supportedCountries === 'string') {
      normalized.supportedCountries = normalized.supportedCountries
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (typeof normalized.services === 'string') {
      normalized.services = normalized.services
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    return normalized
  }

  const columns = [
    { key: 'loanType', label: 'Loan Type', type: 'select', required: true, options: ['Secured', 'Unsecured'] },
    { key: 'loanName', label: 'Loan Name', required: true },
    { key: 'lender', label: 'Lender Name', required: false },
    { key: 'aprFrom', label: 'APR From (%)', type: 'number', required: true },
    { key: 'maxAmount', label: 'Max Amount (GBP)', type: 'number', required: true },
    { key: 'tenure', label: 'Tenure (Years)', type: 'number', required: true },
    { key: 'processingFee', label: 'Processing Fee', required: false },
    { key: 'moratorium', label: 'Moratorium', required: false },
    { key: 'supportedCountries', label: 'Supported Countries (comma separated)', required: false },
    { key: 'services', label: 'Services (comma separated)', required: false },
    { key: 'description', label: 'Description', required: false },
  ]

  useEffect(() => {
    fetchEducationLoans()
  }, [])

  const fetchEducationLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.EDUCATION_LOANS)
      if (!response.ok) throw new Error('Failed to fetch education loans')
      const data = await response.json()
      setLoans(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching education loans:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      const payload = normalizeFormData(formData)
      const response = await fetch(API_ENDPOINTS.EDUCATION_LOANS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        let msg = 'Failed to add loan'
        try {
          const body = await response.json()
          msg = body?.error || body?.message || msg
        } catch {
          // ignore
        }
        throw new Error(msg)
      }
      const newLoan = await response.json()
      setLoans([...loans, newLoan])
    } catch (err) {
      setError(err.message)
      console.error('Error adding loan:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      setError(null)
      const payload = normalizeFormData(formData)
      const response = await fetch(`${API_ENDPOINTS.EDUCATION_LOANS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        let msg = 'Failed to update loan'
        try {
          const body = await response.json()
          msg = body?.error || body?.message || msg
        } catch {
          // ignore
        }
        throw new Error(msg)
      }
      const updatedLoan = await response.json()
      setLoans(loans.map(item => item._id === id ? updatedLoan : item))
    } catch (err) {
      setError(err.message)
      console.error('Error updating loan:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.EDUCATION_LOANS}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete loan')
      setLoans(loans.filter(item => item._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting loan:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      {error && (
        <div style={{ marginBottom: 12, padding: 12, border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ marginBottom: 12, padding: 12, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', borderRadius: 8 }}>
          Loading...
        </div>
      )}

      <CRUDTable
        title="Education Loans"
        data={loans}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
