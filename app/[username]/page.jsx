import React from 'react'
import GetUserByUsername from './GetUserByUsername';


function page({params}) {
  return (
    <div>
      <GetUserByUsername params={params} />
    </div>
  )
}

export default page