import React, { useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { newTaskState } from '../../state/taskState'
import { TaskType } from '../../types/types'
import Button from '../Common/Button'

type TaskProps = {
  task: TaskType
  onTaskSaved: (task: TaskType, action: string) => void
}

const Task = ({ task, onTaskSaved }: TaskProps) => {
  const setNewTask = useSetRecoilState(newTaskState)
  const [title, setTitle] = useState<string>(task.id ? task.title : '')
  const [error, setError] = useState<string | null>(null)

  const saveTask = async () => {
    setError(null)
    if (title.trim().length < 2) {
      setError('The title should have 2 characters minimum')
      return
    }
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
      setError(e.message)
      console.log('Save task error', e)
    }
  }
  // Creation of a task
  // Add also an edit mode ( TODO )
  if (task.id === null) {
    return (
      <div>
        <textarea
          className="w-full  bg-white rounded-lg p-4 shadow-md"
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
        {error && <span className="text-danger text-xs">{error}</span>}
        <div className="flex items-center mb-4">
          <Button
            onClick={saveTask}
            className="mr-2"
            text="Save"
            variant="primary"
          />
          <Button onClick={() => setNewTask(null)} text="x" variant="default" />
        </div>
      </div>
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
