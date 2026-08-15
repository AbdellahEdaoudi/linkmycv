import React from 'react'
import AdminPage from './components/AdminPage'
import RequireAuth from './components/RequireAuth'
function page() {
  return (
    <div>
      <RequireAuth>
      <AdminPage />
      </RequireAuth>
    </div>
  )
}

export default page