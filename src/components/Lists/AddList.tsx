import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md'
import AddButton from './AddButton'
import { ListOfTasks } from '../../types/types'
import ListInput from './ListInput'

type AddListProps = {
  board_id: number
  onSaved: (list: ListOfTasks) => void
  list?: ListOfTasks | null
}

const AddList = ({ board_id, list, onSaved }: AddListProps) => {
  const [edit, setEdit] = useState<boolean>(false)

  return (
    <div className="w-full">
      {edit ? (
        <ListInput
          board_id={board_id}
          setEdit={setEdit}
          list={list}
          onSaved={onSaved}
        />
      ) : (
        <AddButton
          icon={<MdAdd />}
          text="Add a list"
          className="w-full"
          onClick={() => {
            setEdit(true)
          }}
        />
      )}
    </div>
  )
}

export default AddList
