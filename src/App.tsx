import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Homepage'
import Influencers from './pages/InfluencersPage'
import Blogs from './pages/BlogsPage'
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/influencers' element={<Influencers />} />
      <Route path='/blogs' element={<Blogs />} />
    </Routes>
  )
}
