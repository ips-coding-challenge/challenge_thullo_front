import { format } from 'path'
import React, { useCallback, useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { taskModalShowState, taskState } from '../../state/taskState'
import { TaskType } from '../../types/types'
import { formatServerErrors } from '../../utils/utils'
import BasicLoader from '../BasicLoader'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import TaskDescription from './TaskDescription'

type TaskModalProps = {
  isVisible: boolean
  onClose: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void
  id: number | null
}
const TaskModal = ({ id, isVisible, onClose }: TaskModalProps) => {
  const [task, setTask] = useRecoilState(taskState(id!))
  const setTaskModal = useSetRecoilState(taskModalShowState)
  const [loading, setLoading] = useState(true)

  const fetchTask = useCallback(async () => {
    try {
      const res = await client.get(`/tasks/${id}`)
      setTask(res.data.data)
    } catch (e) {
      console.log('e', e)
      toast.error(formatServerErrors(e))
      setTaskModal({ task_id: null, show: false })
    } finally {
      setLoading(false)
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      fetchTask()
    }
  }, [isVisible])

  if (!task && !loading) return null

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <>
        {!task && loading && (
          <div className="flex w-full h-full items-center justify-center my-4">
            <div className="lds-dual-ring lds-dual-ring-black"></div>
          </div>
        )}
        {task && !loading && (
          <div className="p-4">
            {task && task.cover ? (
              <img
                className="w-full h-24 bg-gray1 rounded-lg mb-6 object-cover"
                src={task.cover ? task.cover : ''}
                alt="cover"
              />
            ) : (
              <div className="w-full h-24 bg-gray1 rounded-lg mb-6"></div>
            )}

            <div className="flex w-full">
              {/* Left column */}
              <div className="flex flex-col w-3/5">
                <h3 className="font-semibold">{task.title}</h3>
                <TaskDescription task={task} />
              </div>
              {/* Right column */}
              <div></div>
            </div>
          </div>
        )}
      </>
    </Modal>
  )
}

export default TaskModal
