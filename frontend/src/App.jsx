import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from 'react-hot-toast'
import DashBoardPage from './pages/DashBoardPage'

function App() {
    const {isSignedin,isLoaded}=useUser()
    if(!isLoaded) return null
  return (
    <>
    <Routes>
    <Route path='/' element={ isSignedin ? <HomePage/>: <Navigate to={"/dashboard"}/>}/>
    <Route path='/dashboard' element={ !isSignedin ? <DashBoardPage/>: <Navigate to={"/"}/>}/>
    <Route path='/problems' element={isSignedin? <ProblemsPage/>: <Navigate to={"/"}/>}/>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
