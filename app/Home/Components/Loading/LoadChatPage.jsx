import React from 'react'
import LoadUserList from '../Loading/LoadUserList'
import LMessages from './LMessages'

function LoadChatPage() {
  return (
    <div className='flex '>
        <div className='bg-gray-800 w-full md:w-72 md:min-w-72  p-4 '>
            <LoadUserList />
        </div>
        <div className='w-full md:block hidden'>
            <LMessages />
        </div>
    </div>
  )
}

export default LoadChatPage