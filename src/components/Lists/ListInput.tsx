import React, { useState } from 'react'
import client from '../../api/client'
import { ListOfTasks } from '../../types/types'
import BasicInput from '../Form/BasicInput'

type ListInputProps = {
  board_id: number
  setEdit: (edit: boolean) => void
  list?: ListOfTasks | null
  onSaved: (list: ListOfTasks) => void
}

const ListInput = ({ board_id, setEdit, list, onSaved }: ListInputProps) => {
  const [name, setName] = useState<string>(list ? list.name : '')
  const [error, setError] = useState<string | null>(null)

  const saveList = async () => {
    setError(null)
    if (name.trim().length < 2) {
      setError("The list's name should have 2 characters minimum")
      return
    }
    try {
      const res = await client.post('/lists', {
        name,
        board_id,
      })
      setEdit(false)
      setName('')
      onSaved(res.data.data)
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

export default ListInput
