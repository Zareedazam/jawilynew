import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function Events({ adminData, handleLogout }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'title', label: 'Event Title', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'location', label: 'Location', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.EVENTS)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.EVENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to add event')
      const newEvent = await response.json()
      setEvents([...events, newEvent])
    } catch (err) {
      setError(err.message)
      console.error('Error adding event:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.EVENTS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to update event')
      const updatedEvent = await response.json()
      setEvents(events.map(item => item.id === id ? updatedEvent : item))
    } catch (err) {
      setError(err.message)
      console.error('Error updating event:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.EVENTS}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete event')
      setEvents(events.filter(item => item.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting event:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <CRUDTable
        title="Events"
        data={events}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
