import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import DentistList from './DentistList'

const ManageDentists = ({role}) => {
  return (
    <section id='interface'>
        <Header/>
        <Sidebar/>
        <DentistList role={role}/>
    </section>
  )
}

export default ManageDentists