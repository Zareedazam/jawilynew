import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CRUDTable from '../components/CRUDTable'
import { API_ENDPOINTS } from '../config/api'

export default function Courses({ adminData, handleLogout }) {
  const [courses, setCourses] = useState([])
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const universityOptions = universities
    .map((u) => u?.name)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)))

  const columns = [
    { key: 'title', label: 'Course Title', required: true },
    { key: 'university', label: 'University', type: 'select', required: true, options: universityOptions },
    { key: 'level', label: 'Level', type: 'select', required: true, options: ['Undergraduate', 'Postgraduate', 'PhD', 'Diploma'] },
    { key: 'fee', label: 'Fee (GBP)', type: 'number', required: true },
    { key: 'mode', label: 'Mode', type: 'select', required: true, options: ['Full-time', 'Part-time', 'Online', 'Hybrid'] },
    { key: 'duration', label: 'Duration', required: true },
    { key: 'startDate', label: 'Start Date', type: 'date', required: true },
    { key: 'description', label: 'Description' },
  ]

  useEffect(() => {
    fetchCourses()
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

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_ENDPOINTS.COURSES)
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (formData) => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.COURSES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to add course')
      const newCourse = await response.json()
      setCourses([...courses, newCourse])
    } catch (err) {
      setError(err.message)
      console.error('Error adding course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.COURSES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to update course')
      const updatedCourse = await response.json()
      setCourses(courses.map(item => item._id === id ? updatedCourse : item))
    } catch (err) {
      setError(err.message)
      console.error('Error updating course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.COURSES}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete course')
      setCourses(courses.filter(item => item._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting course:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      <CRUDTable
        title="Courses"
        data={courses}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  )
}
