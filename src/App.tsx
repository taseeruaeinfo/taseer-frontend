import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Homepage'
import Influencers from './pages/InfluencersPage'
import Blogs from './pages/BlogsPage'
import Login from './pages/auth/login'
import Signup from './pages/auth/Signup'
import Onboarding from './pages/auth/Onboardin'
import Dashboard from './pages/main/Dashboard'
import GigDetails from './pages/main/GigPage'
import Posts from './pages/main/posts/postsPage'
import ProfilePage from './pages/main/profile/ProfilePage'
import PostDetails from './pages/main/posts/SpecificPost'
import ViewMoreCreators from './pages/main/profile/ViewMoreProfile'
import MessagesPage from './pages/main/messages/Messages'
import PremiumNotifications from './pages/main/Notifications'
import ProfileSettings from './pages/main/profile/ProfoleSettings'
import ContactUspage from './pages/ContactUspage'
import BrandOnboarding from './pages/auth/BrandOnboarding'
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/influencers' element={<Influencers />} />
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/contact' element={<ContactUspage />} />
      {/* Auth */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signup/onboarding' element={<Onboarding />} />
      <Route path='/signup/onboarding/brand' element={<BrandOnboarding />} />

      {/* main - dashboard */}
      <Route path='/home' element={<Posts />} />
      <Route path='/post/:id' element={<PostDetails />} />
      <Route path='/profile/:id' element={<ProfilePage />} />
      <Route path='/messages' element={<MessagesPage />} />
      <Route path='/deals' element={<Dashboard />} />
      <Route path='/profile-settings' element={<ProfileSettings />} />
      <Route path='/notifications' element={<PremiumNotifications />} />
      <Route path='/profile/viewmore' element={<ViewMoreCreators />} />
      <Route path="/gig/:id" element={<GigDetails />} />
    </Routes>
  )
}
