// Frontend API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
    ADMIN_LOGIN: `${API_URL}/api/auth/admin-login`,
  },
  COURSES: `${API_URL}/api/courses`,
  UNIVERSITIES: `${API_URL}/api/universities`,
  ACCOMMODATION: `${API_URL}/api/accommodation`,
  EDUCATION_LOANS: `${API_URL}/api/education-loans`,
  SERVICES: `${API_URL}/api/services`,
  NEWS: `${API_URL}/api/news`,
  BLOGS: `${API_URL}/api/blogs`,
  EVENTS: `${API_URL}/api/events`,
  USERS: `${API_URL}/api/users`,
  SUBMISSIONS: `${API_URL}/api/submissions`,
}
