import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Register from './pages/Register'
import Submit from './pages/Submit'
import Rules from './pages/Rules'
import Prizes from './pages/Prizes'
import Schedule from './pages/Schedule'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Admin from './pages/Admin'
import { PageHero } from './components/Hero'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="That page doesn't exist." subtext="The link may be old, or the page may have moved. Start from Home — every real page is in the navigation." />
      <div className="text-center pb-20">
        <Link to="/" className="liquid-glass rounded-full px-8 py-3.5 inline-block">Back to Home</Link>
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
