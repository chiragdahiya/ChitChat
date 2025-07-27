import  { useContext, useState, useEffect } from 'react'
import assets from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { ChatContext } from '../../context/chatContext'


const Sidebar = () => {

const  {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext)

  const navigate = useNavigate();
  const {logout, onlineUsers} = useContext(AuthContext)


   const [input, setInput] = useState('')

   const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users

 useEffect (()=>{
  getUsers()

 },[onlineUsers])



  return (
    <div className={`bg-gray-300/10 h-full p-5 rounded-lg overflow-y-scroll text-white ${selectedUser ?" max-md:hidden": ''}`}>
    <div className='pb-5'>
      <div className='flex justify-between items-center'> 
        <img src={assets.logo} alt="logo"  className='max-w-40 '/>
        <div className='relative py-2 group'> 
            <img src={assets.menu_icon} alt="icon" className='max-h-5 cursor-pointer' />
            <div className=' absolute top-full right-0 z-20 w-20 p-5 rounded-lg border border-gray-400 text-gray-600 hidden group-hover:block bg-white'>
                <p onClick={()=> navigate('/Profile')}
                 className='cursor-pointer text-sm'>Edit Profile</p>
                <hr className='my-2 border-t border-gray-500' />
                <p onClick ={()=> logout()}
                className='cursor-pointer text-sm'>Logout</p>
            </div>

        </div>

      </div>
      <div className='bg-gray-900 rounded-full py-3 px-4 mt-5 flex items-center gap-4'>
      <img src={assets.search_icon} alt="search" className='w-3 h-3'
       />
       <input type="text" 
       onChange={(e) => setInput(e.target.value)}

       placeholder='Search User'
       className='w-full rounded-lg bg-tranparent outline-none text-sm text-white placeholder:text-gray-400'

        />

      </div>
    </div>
<div className='flex flex-col'>
  {filteredUsers.map((user,index)=> (
    <div  onClick={()=>{setSelectedUser(user); setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }))}}
    key={index} className={`relative flex items-center p-4 gap-2 pl-4 rounded cursor-pointer max-sm:text-sm  
    ${selectedUser?._id === user._id && 'bg-gray-900/20'}`}>
      <img
      src={user?.profilePic || assets.avatar_icon} 
      alt='image'
      className='w-12 h-12 rounded-full'
      /> 
      
      <div className='flex flex-col leading-5'>
        <p>{user.fullName}</p>
        {
          onlineUsers.includes(user._id)
           ?
          <span className='text-sm text-green-500'>online</span> :  <span className='text-sm text-gray-500'>offline</span>
        }

      </div>
      {
        unseenMessages[user._id] > 0
        && <p className='absolute top-4 right-2 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-purple-600'>
          {unseenMessages[user._id]}</p>
      }
      </div>

  ))}

</div>

    </div>
  )
}

export default Sidebar
