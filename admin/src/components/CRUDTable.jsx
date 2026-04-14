import { useState } from 'react'
import '../styles/CRUD.css'

export default function CRUDTable({ title, data = [], columns = [], onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({})

  const handleAdd = () => {
    setEditId(null)
    setFormData({})
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditId(item._id || item.id)
    setFormData(item)
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editId) {
      onEdit(editId, formData)
    } else {
      onAdd(formData)
    }
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDelete(id)
    }
  }

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>{title}</h2>
        <button onClick={handleAdd} className="btn-primary">
          + Add New
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editId ? 'Edit' : 'Add New'} {title}</h3>
          <form onSubmit={handleSubmit}>
            {columns.map((col) => (
              <div key={col.key} className="form-group">
                <label>{col.label}</label>
                {col.type === 'select' ? (
                  <select
                    value={formData[col.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                    required={col.required !== false}
                  >
                    <option value="">Select {col.label}</option>
                    {col.options && col.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={col.type || 'text'}
                    value={formData[col.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                    placeholder={col.label}
                    required={col.required !== false}
                  />
                )}
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="btn-success">
                {editId ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-message">
                  No data found. Click "Add New" to create.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id || item.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.type === 'date' && item[col.key]
                        ? new Date(item[col.key]).toLocaleDateString()
                        : item[col.key]}
                    </td>
                  ))}
                  <td className="action-btns">
                    <button onClick={() => handleEdit(item)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id || item.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
