import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Admin from './pages/Admin'
import { NavbarDefault } from './components/Navbar'
import { SimpleFooter } from './components/Footer'

const App = () => {
  return (
    <Router>
      <NavbarDefault />
      
      <div className=' px-30 mt-10'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>

      <SimpleFooter />
    </Router>
  )
}

export default App