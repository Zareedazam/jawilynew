import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function Universities({ adminData, handleLogout }) {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'name', label: 'University Name', required: true },
    { key: 'country', label: 'Country', required: true },
    { key: 'city', label: 'City', required: true },
    { key: 'rank', label: 'Rank', type: 'number', required: true },
    { key: 'description', label: 'Description', required: false },
  ]

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.UNIVERSITIES)
      if (!response.ok) throw new Error('Failed to fetch universities')
      const data = await response.json()
      setUniversities(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching universities:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.UNIVERSITIES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to add university')
      const newUniversity = await response.json()
      setUniversities([...universities, newUniversity])
    } catch (err) {
      setError(err.message)
      console.error('Error adding university:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.UNIVERSITIES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to update university')
      const updatedUniversity = await response.json()
      setUniversities(universities.map(item => item._id === id ? updatedUniversity : item))
    } catch (err) {
      setError(err.message)
      console.error('Error updating university:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.UNIVERSITIES}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete university')
      setUniversities(universities.filter(item => item._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting university:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <CRUDTable
        title="Universities"
        data={universities}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
