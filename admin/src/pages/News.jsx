import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function News({ adminData, handleLogout }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'title', label: 'Title', required: true },
    { key: 'category', label: 'Category', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'excerpt', label: 'Excerpt', required: true },
    { key: 'image', label: 'Image URL' },
    { key: 'content', label: 'Description', type: 'textarea' },
  ]

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.NEWS)
      if (!response.ok) throw new Error('Failed to fetch news')
      const data = await response.json()
      setNews(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.NEWS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to add news')
      const newNews = await response.json()
      setNews([...news, newNews])
    } catch (err) {
      setError(err.message)
      console.error('Error adding news:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.NEWS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to update news')
      const updatedNews = await response.json()
      setNews(news.map(item => item.id === id ? updatedNews : item))
    } catch (err) {
      setError(err.message)
      console.error('Error updating news:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.NEWS}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete news')
      setNews(news.filter(item => item.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting news:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <CRUDTable
        title="News"
        data={news}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
