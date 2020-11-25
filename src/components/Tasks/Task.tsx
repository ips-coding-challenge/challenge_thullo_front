import React, { useState } from 'react'
import { DraggableStateSnapshot } from 'react-beautiful-dnd'
import { MdCancel, MdEdit } from 'react-icons/md'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { boardMembersState } from '../../state/boardState'
import {
  currentTaskState,
  newTaskState,
  taskModalShowState,
  taskState,
} from '../../state/taskState'
import { TaskType, User } from '../../types/types'
import BoardMembers from '../Board/BoardMembers'
import MembersDropdown from '../Board/MembersDropdown'
import Button from '../Common/Button'
import Avatar from '../Header/Avatar'
import TaskCover from './Modal/TaskCover'

type TaskProps = {
  task: TaskType
  onTaskSaved: (task: TaskType, action: string) => void
  snapshot?: DraggableStateSnapshot
}

const Task = ({ task, onTaskSaved, snapshot }: TaskProps) => {
  // Global state
  const [newTask, setNewTask] = useRecoilState(newTaskState)
  const boardMembers = useRecoilValue(boardMembersState)
  const [currentTask, setCurrentTask] = useRecoilState(taskState(task!.id!))
  const setTaskModal = useSetRecoilState(taskModalShowState)

  // Local state
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
        console.log('task', task)
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
      <div
        className={`${
          currentTask && currentTask.cover
            ? 'w-full mb-4 rounded-lg p-4 shadow-md'
            : ''
        }`}
      >
        {currentTask && currentTask.cover && <TaskCover id={task.id!} />}
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
    <div
      className={`w-full mb-4 rounded-lg p-4 shadow-md transition-all duration-300 ${
        snapshot?.isDragging ? 'bg-gray-200 transform rotate-6 ' : 'bg-white'
      }`}
    >
      {currentTask && currentTask.cover && (
        <TaskCover
          id={currentTask.id!}
          onClick={() => setTaskModal({ task_id: task.id!, show: true })}
        />
      )}
      <div className="group flex justify-between transition-opacity duration-300 cursor-pointer">
        <h3 onClick={() => setTaskModal({ task_id: task.id!, show: true })}>
          {task.title}
        </h3>
        <MdEdit
          onClick={() => {
            setError(null)
            setNewTask(task)
          }}
          className="opacity-0 group-hover:opacity-100 flex-none"
        />
      </div>
      {/* Assign members dropdown */}
      <div className="md:relative mt-4 flex gap-1">
        {currentTask!.assignedMembers &&
          currentTask!.assignedMembers.length > 0 && (
            <>
              {currentTask!.assignedMembers.map((m: User) => (
                <Avatar key={m.id} username={m.username} />
              ))}
            </>
          )}
        {console.log('currentTask', currentTask)}
        {currentTask?.assignedMembers?.length! < boardMembers.length && (
          <MembersDropdown
            task={task}
            title="Members"
            subtitle="Assign members to this task"
          />
        )}
      </div>
    </div>
  )
}

export default Task
