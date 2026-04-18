import React from 'react'
import GetUserByUsername from './GetUserByUsername';


async function page({params}) {
  const { username } = await params;
  return (
    <div>
      <GetUserByUsername params={{ username }} />
    </div>
  )
}

export default page