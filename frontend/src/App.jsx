import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import CreateNotes from './pages/CreateNotes/CreateNotes'
import Notes from './pages/Notes/Notes'
import Archive from './pages/Archive/Archive'
import Locked from './pages/Locked/Locked'
import Profile from './pages/Profile/Profile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth/>} />
        {/* <Route path='/' element={<Auth/>} /> */}
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/create' element={<CreateNotes/>} />
        <Route path='/notes' element={<Notes/>} />
        <Route path='/archive' element={<Archive/>} />
        <Route path='/locked' element={<Locked/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
