import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/authContext'
import { toast } from 'react-hot-toast'

const ChatContainer = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)
  const {authUser, onlineUsers} = useContext(AuthContext)

  const scrollEnd = useRef()
  const messagesContainerRef = useRef()

  const [input, setInput] = useState('')
  const [isUserScrolling, setIsUserScrolling] = useState(false)

  const handleSendMessage = async (e) => {
    
    e.preventDefault()
    try{
    if(input.trim() === "" ) return null
    await sendMessage({text: input.trim()})
    setInput("")
    // Scroll to bottom when sending a message
    scrollToBottom()

  } catch (error) {
    console.error("Error sending message:", error)
    toast.error("Failed to send message")
  }
}

  const handleSendImage = async (e) =>{
    const file = e.target.files[0]
    if(!file || !file.type.startsWith('image/')) {
      toast.error("Please select a valid image file")
      return
    }

    const reader = new FileReader()

    reader.onloadend = async () => {
      await sendMessage({image: reader.result})
      e.target.value = ""
      // Scroll to bottom when sending an image
      scrollToBottom()
    }

    reader.readAsDataURL(file)
  }

  // Handle scroll detection
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50
      
      // Only set user scrolling to false if they manually scroll to bottom
      // Don't automatically reset it just because they're at bottom
      if (!isAtBottom) {
        setIsUserScrolling(true)
      }
    }
  }

useEffect( () =>{
  if(selectedUser){
    getMessages(selectedUser._id)
    // Don't reset scroll state when switching users - let user control scroll
    // setIsUserScrolling(false)
  }
},[selectedUser, getMessages])

  // Only auto-scroll on initial load or when sending new messages
  useEffect(()=>{
    if(scrollEnd.current && messages){
      // Auto-scroll only if it's the first load (no previous scroll state) or user just sent a message
      const isFirstLoad = messages.length > 0 && !isUserScrolling && messagesContainerRef.current?.scrollTop === 0
      
      if (isFirstLoad) {
        // Scroll to bottom on first load
        setTimeout(() => {
          scrollEnd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
      // Don't auto-scroll otherwise - let user maintain their scroll position
    }
  },[messages])

  // Add a function to manually scroll to bottom
  const scrollToBottom = () => {
    setIsUserScrolling(false)
    setTimeout(() => {
      scrollEnd.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return selectedUser ? (
    <div className='h-full w-full flex flex-col relative backdrop-blur-lg overflow-hidden'>
      {/* Fixed Header */}
      <div className='flex gap-3 py-3 mx-3 border-b border-stone-500 bg-inherit sticky top-0 z-10 flex-shrink-0'>
        <img 
        src={selectedUser.profilePic || assets.avatar_icon}
        alt="profile"
        className='w-8 h-8 rounded-full object-cover'
        />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
      {selectedUser.fullName}
       {onlineUsers.includes(selectedUser._id) ? <span className='w-2 h-2 rounded-full bg-green-500'></span> : <span className='w-2 h-2 rounded-full bg-red-500'></span>}
        </p>
        <img
        onClick={()=> setSelectedUser(null)}
        src={assets.arrow_icon}
        alt="icon"
        className='md:hidden max-w-7 cursor-pointer'>
        </img>
        <img
        src={assets.help_icon}
        alt="help"
        className='max-md:hidden max-w-5' />
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className='flex-1 overflow-y-auto overflow-x-hidden p-3 pb-20 scrollbar-hide'
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
       {messages.map((msg, index)=>(
        <div key={index} className={`flex items-end gap-2 mb-4 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}>
          {msg.senderId !== authUser._id && (
            <div className='text-center'>
              <img src={selectedUser?.profilePic || assets.avatar_icon} alt="icon" 
              className='w-7 h-7 rounded-full object-cover'/>
              <p className='text-gray-500 text-xs mt-1'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          )}
          
          <div className='max-w-lg'>
            {msg.image ? (
              <img src={msg.image} alt='img' 
              className='max-w-md border border-gray-700 rounded-lg w-40 h-40 object-cover'/>
            ):(
              <p className={`p-3 text-sm font-light rounded-lg break-words bg-blue-600/10 text-white 
                ${msg.senderId === authUser._id ? 'rounded-br-none bg-blue-600 text-white' : 'rounded-bl-none bg-gray-700 text-white'}`}
              >{msg.text}</p>
            )}
          </div>

          {msg.senderId === authUser._id && (
            <div className='text-center'>
              <img src={authUser?.profilePic || assets.avatar_icon} alt="icon" 
              className='w-7 h-7 rounded-full object-cover'/>
              <p className='text-gray-500 text-xs mt-1'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          )}
        </div>
       ))}
       <div ref={scrollEnd}></div>
      </div>
        
      {/* Fixed Input Container */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-2 p-3 bg-inherit border-t border-stone-500/30 flex-shrink-0'>
        <div className='flex flex-1 items-center bg-gray-100/12 px-3 rounded-full'>
          <input onChange={(e)=> setInput(e.target.value)} value={input} 
          onKeyDown={(e)=> e.key === 'Enter' ? handleSendMessage(e) : null}
           type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none
          bg-transparent text-white placeholder-gray-400'/>
          <input
          onChange={handleSendImage}
          type='file' id='image' accept='image/png, image/jpeg' hidden/>
          <label htmlFor="image" className='cursor-pointer'>
            <img src={assets.gallery_icon} alt="" 
            className='w-5 mr-2'/>
          </label>
        </div>
        <img onClick={handleSendMessage} 
        src={assets.send_button} alt="" className='w-7 cursor-pointer' />
      </div>
    </div>
    
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
      <img
      src={assets.logo_icon}
      className='max-w-16' />
      <p className='text-lg font-medium text-white'>
        Chat Anytime Anywhere
      </p>
    </div>
  )
}

export default ChatContainer