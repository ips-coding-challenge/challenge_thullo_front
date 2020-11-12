import React, { useState } from 'react'
import { MdCancel, MdEdit } from 'react-icons/md'
import { useRecoilState, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { newTaskState } from '../../state/taskState'
import { TaskType } from '../../types/types'
import Button from '../Common/Button'

type TaskProps = {
  task: TaskType
  onTaskSaved: (task: TaskType, action: string) => void
}

const Task = ({ task, onTaskSaved }: TaskProps) => {
  const [newTask, setNewTask] = useRecoilState(newTaskState)
  const [title, setTitle] = useState<string>(task.id ? task.title : '')
  const [error, setError] = useState<string | null>(null)

  const saveTask = async () => {
    setError(null)
    if (!newTask) {
      return
    }
    if (title.trim().length < 2) {
      setError('The title should have 2 characters minimum')
      return
    }
    try {
      let res: any
      if (newTask.id === null) {
        res = await client.post('/tasks', {
          title: title,
          position: task.position,
          list_id: task.list_id,
          board_id: task.board_id,
        })
        onTaskSaved(res.data.data, 'create')
      } else {
        res = await client.put(`/tasks/${task.id}`, {
          title: title,
          position: task.position,
          list_id: task.list_id,
          board_id: task.board_id,
        })
        onTaskSaved(res.data.data, 'update')
      }

      console.log('res', res.data)
    } catch (e) {
      console.log('Save task error', e)
      if (e.response && e.response.data) {
        setError(e.response.data)
      } else {
        setError(e.message)
      }
    }
  }
  // Creation of a task
  // Add also an edit mode ( TODO )
  if (task.id === null || (newTask && task === newTask)) {
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
      <div className="group flex justify-between transition-opacity duration-300 cursor-pointer">
        <h3
          onClick={() => {
            setError(null)
            setNewTask(task)
          }}
        >
          {task.title}
        </h3>
        <MdEdit
          onClick={() => {
            setNewTask(task)
          }}
          className="opacity-0 group-hover:opacity-100"
        />
      </div>
    </div>
  )
}

export default Task