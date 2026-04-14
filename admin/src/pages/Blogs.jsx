import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import CRUDTable from "../components/CRUDTable";
import { API_ENDPOINTS } from "../config/api";

export default function Blogs({ adminData, handleLogout }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    { key: "title", label: "Title", required: true },
    { key: "category", label: "Category", required: true },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "excerpt", label: "Excerpt", required: true },
    { key: "image", label: "Image URL" },
    { key: "content", label: "Description", type: "textarea" },
  ];

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.BLOGS);
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setBlogs(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.BLOGS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add blog");
      const newBlog = await response.json();
      setBlogs([...blogs, newBlog]);
    } catch (err) {
      setError(err.message);
      console.error("Error adding blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.BLOGS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update blog");
      const updatedBlog = await response.json();
      setBlogs(blogs.map((item) => ((item._id || item.id) === id ? updatedBlog : item)));
    } catch (err) {
      setError(err.message);
      console.error("Error updating blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.BLOGS}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete blog");
      setBlogs(blogs.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting blog:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout adminData={adminData} handleLogout={handleLogout}>
      {error && <div style={{ marginBottom: 12, color: "#b00020" }}>{error}</div>}
      <CRUDTable
        title="Blogs"
        data={blogs}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {loading && <div style={{ marginTop: 12, color: "#666" }}>Loading...</div>}
    </AdminLayout>
  );
}
