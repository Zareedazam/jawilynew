import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function Services({ adminData, handleLogout }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'title', label: 'Service Title', required: true },
    { key: 'tag', label: 'Tag', required: true },
    { key: 'description', label: 'Description', required: true },
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.SERVICES)
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      setServices(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.SERVICES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        let msg = 'Failed to add service'
        try {
          const body = await response.json()
          msg = body?.error || body?.message || msg
        } catch {}
        throw new Error(msg)
      }
      const newService = await response.json()
      setServices([...services, newService])
    } catch (err) {
      setError(err.message)
      console.error('Error adding service:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_ENDPOINTS.SERVICES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        let msg = 'Failed to update service'
        try {
          const body = await response.json()
          msg = body?.error || body?.message || msg
        } catch {}
        throw new Error(msg)
      }
      const updatedService = await response.json()
      setServices(services.map(item => (item._id || item.id) === id ? updatedService : item))
    } catch (err) {
      setError(err.message)
      console.error('Error updating service:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_ENDPOINTS.SERVICES}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        let msg = 'Failed to delete service'
        try {
          const body = await response.json()
          msg = body?.error || body?.message || msg
        } catch {}
        throw new Error(msg)
      }
      setServices(services.filter(item => (item._id || item.id) !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting service:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      {error ? (
        <div style={{ padding: '0 0 12px', color: '#b91c1c', fontSize: 14 }}>
          {error}
        </div>
      ) : null}
      <CRUDTable
        title="Services"
        data={services}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
