import React, { useState } from 'react'
import client from '../../api/client'
import { TaskType } from '../../types/types'

type TaskProps = {
  task: TaskType
  onTaskSaved: (task: TaskType, action: string) => void
}

const Task = ({ task, onTaskSaved }: TaskProps) => {
  const [title, setTitle] = useState<string>(task.id ? task.title : '')

  const saveTask = async () => {
    try {
      const res = await client.post('/tasks', {
        title: title,
        position: task.position,
        list_id: task.list_id,
        board_id: task.board_id,
      })

      console.log('res', res.data)
      onTaskSaved(res.data.data, 'create')
    } catch (e) {
      console.log('Save task error', e)
    }
  }
  // Creation of a task
  // Add also an edit mode ( TODO )
  if (task.id === null) {
    return (
      <textarea
        className="w-full mb-4 bg-white rounded-lg p-4 shadow-md"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            saveTask()
          }
        }}
        placeholder="Add a title"
      ></textarea>
    )
  }
  return (
    <div className="w-full my-4 bg-white rounded-lg p-4 shadow-md">
      {task.cover && <img src={task.cover} alt="cover" />}
      <h3>{task.title}</h3>
    </div>
  )
}

export default Task
