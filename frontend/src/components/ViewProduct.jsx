import React, { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function ViewProduct() {

    let [view, setView] = useState([])

    let {id} = useParams()

    async function viewData(){
        let result = await axios.get(`http://localhost:3000/api/viewProduct/${id}`)
        setView(result.data)
    }
  useEffect(()=>{
    viewData()
  }, [view])

  return (
   <>
   {view.map((data, key)=>(
     <div className="w-[300px] rounded-md border" key={key}>
     <img
       src={`http://localhost:3000/${data.image}`}
       alt="Laptop"
       className="h-[200px] w-full rounded-t-md object-cover"
     />
     <div className="p-4">
       <h1 className="inline-flex items-center text-lg font-semibold">
         Product ID:- <span className='font-bold'>{data.id}</span>
       </h1>
       <h1 className="inline-flex items-center text-lg font-semibold">
         Product Brand:- <span className='font-bold'>{data.productBrand}</span>
       </h1>
       <h1 className="inline-flex items-center text-lg font-semibold">
         Product Type:- <span className='font-bold'>{data.productType}</span>
       </h1>
       <h1 className="inline-flex items-center text-lg font-semibold">
         Product Price:- <span className='font-bold'>{data.productPrice}</span>
       </h1>
       <h1 className="inline-flex items-center text-lg font-semibold">
         Product Rating:- <span className='font-bold'>{data.productRating}</span>
       </h1>
      
      
       <button
         type="button"
         className="mt-4 w-full rounded-sm bg-black px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
       >
         Read
       </button>
     </div>
   </div>
   ))}
   </>
  )
}
