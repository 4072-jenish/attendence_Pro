import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'

function App() {

  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

          <Route path="/" element={<Login />} />

          <Route 
            path="/dashboard" 
            element={
              localStorage.getItem("token") 
                ? <Dashboard /> 
                : <Navigate to="/" />
            } 
          />

      </Routes>
    </BrowserRouter>
  )
}

export default App;