import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Homepage'
import Influencers from './pages/InfluencersPage'
import Blogs from './pages/BlogsPage'
import Login from './pages/auth/login'
import Signup from './pages/auth/Signup'
import Onboarding from './pages/auth/Onboardin'
import Dashboard from './pages/main/Dashboard'
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/influencers' element={<Influencers />} />
      <Route path='/blogs' element={<Blogs />} />

      {/* Auth */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signup/onboarding' element={<Onboarding />} />

      {/* main - dashboard */}
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}
