import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function FoundationPrograms({ adminData, handleLogout }) {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'title', label: 'Title', required: true },
    { key: 'provider', label: 'Provider', required: true },
    { key: 'country', label: 'Country', required: true },
    { key: 'city', label: 'City' },
    { key: 'stream', label: 'Stream', required: true },
    { key: 'intake', label: 'Intake (comma separated)', required: false },
    { key: 'duration', label: 'Duration' },
    { key: 'budget', label: 'Budget' },
    { key: 'requirements', label: 'Requirements (comma separated)', required: false },
    { key: 'benefits', label: 'Benefits (comma separated)', required: false },
  ]

  useEffect(() => {
    fetchPrograms()
  }, [])

  const normalize = (x) => {
    const toArray = (v) => {
      if (Array.isArray(v)) return v
      if (!v) return []
      return String(v)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }

    return {
      ...x,
      intake: toArray(x.intake),
      requirements: toArray(x.requirements),
      benefits: toArray(x.benefits),
    }
  }

  const denormalize = (x) => {
    const toCsv = (v) => (Array.isArray(v) ? v.join(', ') : v || '')
    return {
      ...x,
      intake: toCsv(x.intake),
      requirements: toCsv(x.requirements),
      benefits: toCsv(x.benefits),
    }
  }

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.FOUNDATION_PROGRAMS)
      if (!response.ok) throw new Error('Failed to fetch foundation programs')
      const data = await response.json()
      setPrograms((data || []).map(denormalize))
    } catch (err) {
      setError(err.message)
      console.error('Error fetching foundation programs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.FOUNDATION_PROGRAMS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalize(formData)),
      })
      if (!response.ok) throw new Error('Failed to add program')
      const created = await response.json()
      setPrograms([denormalize(created), ...programs])
    } catch (err) {
      setError(err.message)
      console.error('Error adding program:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.FOUNDATION_PROGRAMS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalize(formData)),
      })
      if (!response.ok) throw new Error('Failed to update program')
      const updated = await response.json()
      setPrograms(programs.map((p) => (p._id === id ? denormalize(updated) : p)))
    } catch (err) {
      setError(err.message)
      console.error('Error updating program:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.FOUNDATION_PROGRAMS}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete program')
      setPrograms(programs.filter((p) => p._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting program:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      {error ? <div style={{ color: 'red', marginBottom: 12 }}>{error}</div> : null}
      <CRUDTable
        title="Foundation Programs"
        data={programs}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
