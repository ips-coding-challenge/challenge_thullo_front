import React from 'react'
import { MdMoreHoriz } from 'react-icons/md'

const List = ({ list }: any) => {
  return (
    <div className="flex w-list justify-between items-center">
      <h3>{list.name}</h3>
      <MdMoreHoriz />
    </div>
  )
}

export default List
