# Admin Panel Setup Guide

## Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173` (or the port shown in terminal)

## Admin Panel Features

### Authentication
- **Admin Login**: Use any email/password to login (for testing)
- Session is stored in localStorage

### Content Management
The admin can manage the following resources:
- **Courses**: Add, edit, delete courses with details like title, university, level, fees
- **Universities**: Manage universities with country, ranking, and average fees
- **Accommodation**: Add properties/stays with room types and prices
- **Education Loans**: Manage loan offers with terms and conditions
- **Services**: Create and manage service offerings
- **News**: Publish and manage news articles
- **Events**: Create and manage events

### User Management
- **Users**: View all registered users from the frontend
- **Form Submissions**: View and manage contact form submissions from users

## File Structure

```
admin/src/
├── pages/
│   ├── AdminLogin.jsx          # Admin login page
│   ├── AdminDashboard.jsx      # Main dashboard
│   ├── Courses.jsx             # Courses management
│   ├── Universities.jsx        # Universities management
│   ├── Accommodation.jsx       # Accommodation management
│   ├── EducationLoans.jsx      # Education loans management
│   ├── Services.jsx            # Services management
│   ├── News.jsx                # News management
│   ├── Events.jsx              # Events management
│   ├── Users.jsx               # Users management
│   └── FormSubmissions.jsx     # Form submissions
├── components/
│   ├── AdminLayout.jsx         # Main layout wrapper
│   ├── Header.jsx              # Header with logout
│   ├── Sidebar.jsx             # Navigation sidebar
│   └── CRUDTable.jsx           # Reusable CRUD component
├── styles/
│   ├── AdminLogin.css
│   ├── AdminLayout.css
│   ├── Header.css
│   ├── Sidebar.css
│   ├── CRUD.css
│   ├── Dashboard.css
│   ├── UsersList.css
│   └── Submissions.css
└── App.jsx                     # Main app with routing
```

## How to Use

### Login
1. Go to the admin panel
2. Enter any email and password (demo mode)
3. Click "Login"

### Manage Content
1. Click on any resource in the sidebar (Courses, Universities, etc.)
2. Click "+ Add New" button to create new entry
3. Fill in the form and submit
4. View all entries in the table
5. Click "Edit" to modify an entry
6. Click "Delete" to remove an entry

### View Users & Submissions
- **Users**: Shows all registered users from the frontend application
- **Form Submissions**: Shows all contact form submissions from the apply page

## Backend Integration (Future)

Currently, the admin panel uses local state management. To integrate with backend APIs:

1. Replace state management with API calls in each page/component
2. Update endpoints in `handleAdd`, `handleEdit`, `handleDelete` functions
3. Add error handling and loading states
4. Implement proper authentication with tokens

Example:
```javascript
const handleAdd = async (formData) => {
  const response = await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  // Update state with response
}
```

## Notes

- Currently using localStorage for demo admin session
- All data is stored locally in component state
- For production, implement proper backend integration
- Add form validation and error handling
- Implement proper admin authentication with tokens
