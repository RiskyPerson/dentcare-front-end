import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const ManageSchedules = ({role}) => {
  return (
    <>
      <section id='interface'>
        <Header/>
        <Sidebar/> 
      </section>
    </>
  )
}

export default ManageSchedules