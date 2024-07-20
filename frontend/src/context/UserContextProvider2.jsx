import React, { useEffect, useState } from 'react'
import UserContext from './UserContext'
import axios from 'axios'

export default function UserContextProvider2({children}) {
    let [cartList, setCartList] = useState('')
    let [auth, setAuth] = useState({
      token: localStorage.getItem('token') || null,
      isAuthenticated: !!localStorage.getItem('token'),
      username: '',
      id:''
    })

   let login = async (username, password)=>{
    let result =   await axios.post('http://localhost:3000/api/clientLogin', {username,password})
    let token = result.data.token
    localStorage.setItem('token', token)
    setAuth({token:result.data.token, isAuthenticated: true, user:username, id:result.data.id})
    return true
    }

    function logout(){
      localStorage.removeItem('token')
    setAuth({token: null, isAuthenticated: false, username: ''})
    }

    async function profile(){
      const token = localStorage.getItem('token');
  
      if (token) {
          try{
              let result = await axios.get('http://localhost:3000/api/profile')
              let username= result.data.email.split('@')[0]
              console.log(result)
              if(username){
                createClientTable(username)
              }
              setAuth({token:token, isAutherized:true, username: username, id:result.data.id})
            }
            catch (error) {
              logout();
            }
          } 
      }

    


    async function getGoogleProfile(){
      let token= localStorage.getItem('token')
      if(token){
        let result = await axios.get('http://localhost:3000/auth/verify')
        let username= result.data.email.split('@')[0]
        console.log(result)
        if(username){
          createClientTable(username)
        }
        setAuth({token:token, isAutherized:true, username: username, id:result.data.id})
      }
    }
    async function createClientTable(username){
      await axios.get(`http://localhost:3000/api/createClient/${username}`)
    }
    useEffect(()=>{
      let token = localStorage.getItem('token')
      if(token){
        axios.defaults.headers.common['Authorization']=`Bearer${token}`
        profile()
        getGoogleProfile()
      }
    },[])
    
  return (
   <UserContext.Provider value={{cartList, setCartList, auth, login, logout, getGoogleProfile}}>
    {children}
   </UserContext.Provider>
  )
}
