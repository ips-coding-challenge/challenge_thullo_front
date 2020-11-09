import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { currentListState, listState } from '../../state/listState'
import { ListOfTasks } from '../../types/types'
import BasicInput from '../Form/BasicInput'

type ListInputProps = {
  board_id: number
  setEdit: (edit: boolean) => void
  list?: ListOfTasks | null
}

const ListInput = ({ board_id, setEdit, list }: ListInputProps) => {
  const currentList = useRecoilValue(currentListState(list?.id))
  const [name, setName] = useState<string>(currentList ? currentList.name : '')
  const [error, setError] = useState<string | null>(null)
  const setLists = useSetRecoilState(listState)

  const saveList = async () => {
    setError(null)
    if (name.trim().length < 2) {
      setError("The list's name should have 2 characters minimum")
      return
    }
    try {
      let res: any
      if (list) {
        res = await client.put(`/lists/${list.id}`, {
          name,
          board_id,
        })
      } else {
        res = await client.post('/lists', {
          name,
          board_id,
        })
      }

      if (list) {
        setLists((old: ListOfTasks[]) => {
          const index = old.findIndex((el: ListOfTasks) => el.id === list.id)
          if (index > -1) {
            const copy = [...old]

            copy[index] = { ...copy[index], name }
            console.log('copy', copy[index])
            return copy
          }
          return old
        })
      } else {
        setLists((old: ListOfTasks[]) => {
          return old.concat(res.data.data)
        })
      }

      setName('')
      setEdit(false)
    } catch (e) {
      console.log('Save list error', e)
      if (e.response && e.response.data) {
        setError(e.response.data)
      } else {
        setError(e.message)
      }
    }
  }
  return (
    <BasicInput
      name="list"
      type="text"
      placeholder="Enter the list name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={error || ''}
      onBlur={() => {
        setEdit(false)
        setError(null)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          saveList()
        }
      }}
      autoFocus={true}
    />
  )
}

export default React.memo(ListInput)
