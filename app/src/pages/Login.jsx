import React, {useContext, useState} from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/authContext'

const Login = () => {

  const[currState, setCurrState] = useState("Sign Up")
  const[fullName , setFullName] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassword ] = useState("")
  const[bio, setBio] = useState("")
  const[isDataSubmitted, setIsDataSubmitted] = useState(false)

 const {login} = useContext(AuthContext)


  const onSubmitHandler = (e)=>{
    e.preventDefault();

    if(currState === 'Sign Up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState==='Sign Up' ? 'signup' :'login' ,{fullName, email, password, bio})

  }

  return (
    <div className='min-h-screen bg-cover bg-center flex flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
    <img src={assets.logo_big} alt=''  className='w-1/6'    />

    <form onSubmit={onSubmitHandler}
    className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
    <h2 className='font-medium text-2xl flex justify-between items-center'>{currState}
      {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)}
            src={assets.arrow_icon} alt="icons" className='w-4 cursor-pointer'  />
}
    </h2>

    {currState === "Sign Up" && !isDataSubmitted && (
         <input onChange={(e)=> setFullName(e.target.value)} value={fullName}
          type='text' className='p-2 border border-gray-400 rounded-md focus:outline-none' placeholder='Full Name*' required></input>

    )}

    { !isDataSubmitted && (
      <>
      <input  onChange={(e)=> setEmail(e.target.value)} value={email}
      type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'>
      </input>
      <input  onChange={(e)=> setPassword(e.target.value)} value={password}
      type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'>
      </input>
      </>
    )

    }

    { currState === "Sign Up" && isDataSubmitted && (
     <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
      rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
     placeholder='Bio...' required>
       
     </textarea>
    )

    }
    <button type='submit' className='py-3 bg-purple-500 text-white rounded-md cursor-pointer'>
      {currState === "Sign Up" ? "Create Account" : " Login Now"}
    </button>
   
   <div className='flex items-center gap-2 text-sm text-gray-500'>
    <input type="checkbox"/>
    <p>Agree to  terms  of use & privacy policy.</p>
   </div>
   <div className='flex flex-col gap-2'>
  {currState === "Sign Up" ? (
    <p className='text-sm text-gray-600'>Already have an account? <span
    onClick={()=>{setCurrState("Login");setIsDataSubmitted(false)} } className='font-md cursor-pointer text-violet-500'>Login here</span></p>
  ) : (
    <p className='text-sm text-gray-600'>Create an account <span 
    onClick={()=>{setCurrState("Sign Up"); setIsDataSubmitted(false)}}
    className='font-md cursor-pointer text-violet-500'>Click Here</span></p>
  )}
   </div>
    
    </form>
    
    </div>
  )
}

export default Login
