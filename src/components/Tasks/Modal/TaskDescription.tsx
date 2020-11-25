import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdAdd, MdDescription, MdEdit } from 'react-icons/md'
import { useSetRecoilState } from 'recoil'
import client from '../../../api/client'
import { taskState } from '../../../state/taskState'
import { TaskType } from '../../../types/types'
import { formatServerErrors } from '../../../utils/utils'
import Button from '../../Common/Button'
import TaskSubtitle from './TaskSubtitle'

type TaskDescriptionProps = {
  task: TaskType
}
const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState<string>(task.description || '')
  const setTask = useSetRecoilState(taskState(task.id!))
  const ref = useRef<HTMLTextAreaElement>(null)

  const saveDescription = useCallback(async () => {
    setError(null)

    if (description.trim().length < 2) {
      setError('"description" length must be at least 2 characters long')
      return
    }
    try {
      console.log('description', description)
      const res = await client.patch(`/tasks/${task.id}`, {
        board_id: task.board_id,
        description,
      })

      setTask((old: TaskType | undefined) => {
        if (old) {
          return { ...old, description }
        }
        return old
      })

      setEdit(false)

      console.log('res', res.data)
    } catch (e) {
      setError(formatServerErrors(e))
      console.log('Error', e)
    }
  }, [description])

  useEffect(() => {
    if (edit && ref && ref.current) {
      ref.current.focus()
    }
  }, [ref, edit])

  return (
    <div className="mt-8">
      <div className="flex items-center">
        <TaskSubtitle icon={<MdDescription />} text="Description" />
        <Button
          variant="bordered"
          text={task.description ? 'Edit' : 'Add'}
          size="sm"
          textSize="xs"
          alignment="left"
          icon={task.description ? <MdEdit /> : <MdAdd />}
          onClick={() => setEdit((val) => (val = !val))}
        />
      </div>
      {edit && (
        <>
          {error && <p className="text-danger text-sm p-2">{error}</p>}
          <textarea
            ref={ref}
            rows={5}
            className="w-full mt-3 text-sm p-1"
            placeholder="Add a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <Button text="Save" onClick={saveDescription} variant="primary" />
        </>
      )}
      {description && !edit && <p className="mt-4">{description}</p>}
    </div>
  )
}

export default TaskDescription
