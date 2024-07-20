import React, { useContext, useEffect, useRef, useState } from 'react'
import { BarChart, Wallet, Newspaper, BellRing, Paperclip, Brush, Wrench, Search } from 'lucide-react'
import axios from 'axios'
import UserContext from '../../context/UserContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function Home() {
  let [data, setData] = useState([])
  let [inp, setInp] = useState('')
  let navigation = useNavigate()
  let {token}=useParams()
  let {auth, getGoogleProfile} = useContext(UserContext)
 

  useEffect(()=>{
    if(token){
      localStorage.setItem('token',token)
      getGoogleProfile()
      navigation('/')
    }
  },[token])

  useEffect(() => {
    getData()
    getCartList()
  }, [auth])

 

let {setCartList} = useContext(UserContext)



  async function getData() {
    let result = await axios.get('http://localhost:3000/api/getProduct')
    setData(result.data)
  }

 async function twoToFour(){
    let result = await axios.get('http://localhost:3000/api/getProduct')
    let final = await result.data.filter((data)=> data.productPrice >= 2000 && data.productPrice <= 4000)
    setData(final)
  }
 async function fourToTen(){
    let result = await axios.get('http://localhost:3000/api/getProduct')
    let final = await result.data.filter((data)=> data.productPrice >= 4000 && data.productPrice <= 10000)
    setData(final)
  }
 async function rateFour(){
    let result = await axios.get('http://localhost:3000/api/getProduct')
    let final = await result.data.filter((data)=> data.productRating == 4)
    setData(final)
  }
 async function rateFive(){
    let result = await axios.get('http://localhost:3000/api/getProduct')
    let final = await result.data.filter((data)=> data.productRating == 5)
    setData(final)
  }
  useEffect(()=>{
    getProductByBrand()
    if(inp == ''){
      getData()
    }
  }, [inp])

  async function getProductByBrand(){
    let result = await axios.get(`http://localhost:3000/api/getProductByBrand/${inp}`)
    setData(result.data)
  }
  

async function addtoCart(data){

    if(auth.isAuthenticated){
      await axios.post(`http://localhost:3000/api/cartSave/${auth.user}`,{
      productBrand:data.productBrand,
      productPrice:data.productPrice,
      productRating:data.productRating,
      productType:data.productType,
      image:data.image,
    }, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })
    alert('item saved into cart')
    getCartList()
    }else{
      navigation('/clientLogin')
    }
}

async function getCartList() {

 if(auth.isAuthenticated){
  let result = await axios.get(`http://localhost:3000/api/getCart/${auth.user}`)

  setCartList(result.data.length)
 }
}

  return (
    <>
      <aside className="flex fixed h-screen w-64 flex-col overflow-y-auto border-r bg-black px-5 py-8">

        <div className="mt-6 flex flex-1 flex-col justify-between">
          <nav className="-mx-3 space-y-6 ">
            <div className="space-y-3 ">
              <label className="px-3 text-2xl font-semibold uppercase text-white">filters</label>

              <form className="max-w-md mx-auto">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input type="search" 
                  id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search By Product Brand..." required 
                 onChange={(e)=>setInp(e.target.value)}
                  />

                </div>
              </form>

               <button
                className="flex transform bg-gray-100 items-center rounded-lg px-3 py-2 text-black transition-colors duration-300 hover:bg-gray-400 hover:text-white"
                type='submit'
                onClick={getProductByBrand}
              >
              Search
              </button> 
              <button
                className="flex transform bg-gray-100 items-center rounded-lg px-3 py-2 text-black transition-colors duration-300 hover:bg-gray-400 hover:text-white"
                onClick={getData}
              >
              All
              </button>
            </div>
            <div className="space-y-3 ">
              <label className="px-3 text-xl font-semibold uppercase text-white">Price</label>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                onClick={twoToFour}
                
              >
                <span className="mx-2 text-[15px] font-medium">2000Rs. - 4000Rs.</span>
              </button>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                onClick={fourToTen}
              >
                <span className="mx-2 text-[15px] font-medium">4000Rs. - 10000Rs.</span>
              </button>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                
              >
                <span className="mx-2 text-[15px] font-medium">10000Rs. - 40000Rs.</span>
              </button>
              
            </div>
            <div className="space-y-3 ">
              <label className="px-3 text-xl font-semibold uppercase text-white">Rating</label>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                
              >
                <span className="mx-2 text-[15px] font-medium">⭐</span>
              </button>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                
              >
                <span className="mx-2 text-[15px] font-medium">⭐⭐</span>
              </button>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                
              >
                <span className="mx-2 text-[15px] font-medium">⭐⭐⭐</span>
              </button>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                onClick={rateFour}
              >
                <span className="mx-2 text-[15px] font-medium">⭐⭐⭐⭐</span>
              </button>
              <button
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                onClick={rateFive}
              >
                <span className="mx-2 text-[15px] font-medium">⭐⭐⭐⭐⭐</span>
              </button>
              
            </div>

          </nav>
        </div>
      </aside>

      <div id="card" className='relative w-[1000px] left-[300px] top-[100px] flex flex-wrap'>
        {data.map((data, key) => (
          <div className="w-[300px] m-1 rounded-md border" key={key}>
            <img
              src={`http://localhost:3000/${data.image}`}
              alt="Laptop"
              className="h-[200px] w-full rounded-md object-cover"
            />
            <div className="p-4">
              <h1 className="text-lg font-semibold">Product Brand :- <span className='font-bold'>{data.productBrand}</span></h1>
              <h1 className="text-lg font-semibold">Product Type :- <span className='font-bold'>{data.productType}</span></h1>
              <h1 className="text-lg font-semibold">Product Price :- <span className='font-bold'>{data.productPrice}</span></h1>
              <h1 className="text-lg font-semibold">Product Rating :- <span className='font-bold'>{data.productRating}</span></h1>

              <button
                type="button"
                onClick={()=>addtoCart(data)}
                className="mt-4 rounded-sm bg-black px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
