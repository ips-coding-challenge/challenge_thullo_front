import React, { useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { ListOfTasks } from '../../types/types'
import ListInput from './ListInput'

type ListProps = {
  board_id: number
  list: ListOfTasks
}

const List = ({ board_id, list }: ListProps) => {
  const [edit, setEdit] = useState<boolean>(false)

  return (
    <div className="flex w-list justify-between items-center">
      {edit ? (
        <ListInput board_id={board_id} list={list} setEdit={setEdit} />
      ) : (
        <>
          <h3>{list.name}</h3>
          <MdMoreHoriz
            onClick={() => {
              setEdit(true)
            }}
            className="cursor-pointer hover:text-blue transition-colors duration-300"
          />
        </>
      )}
    </div>
  )
}

export default React.memo(List)
