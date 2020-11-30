import React, { useEffect, useState } from 'react'
import { DraggableStateSnapshot } from 'react-beautiful-dnd'
import { MdAttachFile, MdCancel, MdComment, MdEdit } from 'react-icons/md'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { boardMembersState } from '../../state/boardState'
import {
  assignedMembersState,
  commentsState,
  currentTaskState,
  labelsAssignedState,
  newTaskState,
  taskAttachmentsState,
  taskModalShowState,
  taskState,
} from '../../state/taskState'
import { LabelType, TaskType, User } from '../../types/types'
import MembersDropdown from '../Board/MembersDropdown'
import Button from '../Common/Button'
import Avatar from '../Header/Avatar'
import Label from './Modal/Labels/Label'
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
  const [currentTask, setCurrentTask] = useRecoilState(taskState(task?.id!))
  const setTaskModal = useSetRecoilState(taskModalShowState)
  const assignedMembers = useRecoilValue(assignedMembersState(task?.id!))
  const assignedLabels = useRecoilValue(labelsAssignedState(task?.id!))
  const attachments = useRecoilValue(taskAttachmentsState(task?.id!))
  const comments = useRecoilValue(commentsState(task?.id!))

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
      className={`w-full mb-4 rounded-lg p-3 shadow-md transition-all duration-300 ${
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

      {/* Labels */}
      {assignedLabels && assignedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {assignedLabels.map((label: LabelType) => (
            <Label key={label.id} label={label} can={false} />
          ))}
        </div>
      )}

      {/* Assign members dropdown */}
      <div className="mt-6 flex justify-between items-center">
        <div className="md:relative flex gap-1">
          {assignedMembers && assignedMembers.length > 0 && (
            <>
              {assignedMembers.map((m: User) => (
                <Avatar key={m.id} username={m.username} />
              ))}
            </>
          )}
          {assignedMembers && assignedMembers.length! < boardMembers.length && (
            <MembersDropdown
              task={task}
              title="Members"
              subtitle="Assign members to this task"
            />
          )}
        </div>

        {/* Attachments count and comments count */}
        <div className="flex">
          {comments && comments.length > 0 && (
            <div className="flex items-center text-xs text-gray3 mr-1">
              <MdComment />
              <span>{comments.length}</span>
            </div>
          )}
          {attachments && attachments.length > 0 && (
            <div className="flex items-center text-xs text-gray3">
              <MdAttachFile />
              <span>{attachments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Task
