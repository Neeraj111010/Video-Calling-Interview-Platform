import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from 'react-hot-toast'

function App() {
    const {isSignedin}=useUser()
  return (
    <>
    <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/problems' element={isSignedin? <ProblemsPage/>: <Navigate to={"/"}/>}/>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
