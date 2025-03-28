import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/influencers' element={<Home />} />

    </Routes>
  )
}
