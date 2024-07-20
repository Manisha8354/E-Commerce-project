import React from 'react'
import NavbarClient from './components/client/NavbarClient'
import { Outlet } from 'react-router-dom'
import UserContextProvider2 from './context/UserContextProvider2'

export default function ClientApp() {
  return (
   <UserContextProvider2>
     <NavbarClient/>
     <Outlet/>
   </UserContextProvider2>

  )
}
