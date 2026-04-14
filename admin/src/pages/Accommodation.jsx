import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function Accommodation({ adminData, handleLogout }) {
  const [accommodations, setAccommodations] = useState([])
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const universityOptions = universities
    .map((u) => u?.name)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)))

  const columns = [
    { key: 'hostelName', label: 'Hostel Name', required: true },
    { key: 'universityName', label: 'University Name', type: 'select', required: true, options: universityOptions },
    { key: 'city', label: 'City', required: true },
    { key: 'roomType', label: 'Room Type', type: 'select', required: true, options: ['Shared', 'Private', 'Studio', 'Residence Hall'] },
    { key: 'distanceRange', label: 'Distance', type: 'select', required: false, options: ['0-2 km', '2-5 km', '5-10 km', '10+ km'] },
    { key: 'moveInDate', label: 'Move In Date', type: 'date', required: false },
    { key: 'nearBy', label: 'Near By', required: false },
    { key: 'rating', label: 'Rating', type: 'number', required: false },
    { key: 'budget', label: 'Budget (GBP)', type: 'number', required: true },
    { key: 'status', label: 'Status', type: 'select', required: false, options: ['Verified', 'Unverified'] },
    { key: 'services', label: 'Services (comma separated)', required: false },
    { key: 'description', label: 'Description', required: false },
  ]

  useEffect(() => {
    fetchAccommodation()
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.UNIVERSITIES)
      if (!response.ok) throw new Error('Failed to fetch universities')
      const data = await response.json()
      setUniversities(data || [])
    } catch (err) {
      console.error('Error fetching universities:', err)
    }
  }

  const normalizeFormData = (formData) => {
    const normalized = { ...formData }
    if (typeof normalized.services === 'string') {
      const parts = normalized.services
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      normalized.services = parts
    }
    return normalized
  }

  const fetchAccommodation = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.ACCOMMODATION)
      if (!response.ok) throw new Error('Failed to fetch accommodation')
      const data = await response.json()
      setAccommodations(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching accommodation:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      const payload = normalizeFormData(formData)
      const response = await fetch(API_ENDPOINTS.ACCOMMODATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('Failed to add accommodation')
      const newAccommodation = await response.json()
      setAccommodations([...accommodations, newAccommodation])
    } catch (err) {
      setError(err.message)
      console.error('Error adding accommodation:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      const payload = normalizeFormData(formData)
      const response = await fetch(`${API_ENDPOINTS.ACCOMMODATION}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('Failed to update accommodation')
      const updatedAccommodation = await response.json()
      setAccommodations(accommodations.map(item => item._id === id ? updatedAccommodation : item))
    } catch (err) {
      setError(err.message)
      console.error('Error updating accommodation:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.ACCOMMODATION}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete accommodation')
      setAccommodations(accommodations.filter(item => item._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting accommodation:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <CRUDTable
        title="Accommodation"
        data={accommodations}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
