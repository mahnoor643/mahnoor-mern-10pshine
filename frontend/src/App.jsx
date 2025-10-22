import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Auth from './pages/Auth/Auth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Auth/>
    </>
  )
}

export default App
