import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@/App.css'
import HomePage from '@/pages/HomePage'
import ReservationPage from '@/pages/ReservationPage'
import AdminPage from '@/pages/AdminPage'
import ConfirmationPage from '@/pages/ConfirmationPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reserve" element={<ReservationPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
