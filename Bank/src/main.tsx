import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './Home.tsx'
import SignUp from './SignUp.tsx'
import Login from './Login.tsx'
import Account from './Account.tsx'
import MeetTheTeam from './MeetTheTeam.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/meettheteam" element={<MeetTheTeam />} />
       </Routes>
     </BrowserRouter>
  </StrictMode>,
)
