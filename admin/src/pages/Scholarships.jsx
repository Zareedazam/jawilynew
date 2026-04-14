import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function Scholarships({ adminData, handleLogout }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'name', label: 'Name', required: true },
    { key: 'provider', label: 'Provider', required: true },
    { key: 'country', label: 'Country', required: true },
    { key: 'level', label: 'Level', required: true },
    { key: 'funding', label: 'Funding', required: true },
    { key: 'amountText', label: 'Amount' },
    { key: 'deadlineText', label: 'Deadline Text' },
    { key: 'deadlineGroup', label: 'Deadline Group' },
    { key: 'tags', label: 'Tags (comma separated)', required: false },
    { key: 'note', label: 'Note', required: false },
  ]

  useEffect(() => {
    fetchItems()
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
      tags: toArray(x.tags),
    }
  }

  const denormalize = (x) => {
    const toCsv = (v) => (Array.isArray(v) ? v.join(', ') : v || '')
    return {
      ...x,
      tags: toCsv(x.tags),
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.SCHOLARSHIPS)
      if (!response.ok) throw new Error('Failed to fetch scholarships')
      const data = await response.json()
      setItems((data || []).map(denormalize))
    } catch (err) {
      setError(err.message)
      console.error('Error fetching scholarships:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.SCHOLARSHIPS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalize(formData)),
      })
      if (!response.ok) throw new Error('Failed to add scholarship')
      const created = await response.json()
      setItems([denormalize(created), ...items])
    } catch (err) {
      setError(err.message)
      console.error('Error adding scholarship:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.SCHOLARSHIPS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalize(formData)),
      })
      if (!response.ok) throw new Error('Failed to update scholarship')
      const updated = await response.json()
      setItems(items.map((x) => (x._id === id ? denormalize(updated) : x)))
    } catch (err) {
      setError(err.message)
      console.error('Error updating scholarship:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.SCHOLARSHIPS}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete scholarship')
      setItems(items.filter((x) => x._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting scholarship:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      {error ? <div style={{ color: 'red', marginBottom: 12 }}>{error}</div> : null}
      <CRUDTable
        title="Scholarships"
        data={items}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
