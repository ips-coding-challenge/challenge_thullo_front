import { format } from 'path'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { taskModalShowState, taskState } from '../../state/taskState'
import { TaskType } from '../../types/types'
import { formatServerErrors } from '../../utils/utils'
import BasicLoader from '../BasicLoader'
import Modal from '../Common/Modal'

type TaskModalProps = {
  isVisible: boolean
  onClose: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void
  id: number | null
}
const TaskModal = ({ id, isVisible, onClose }: TaskModalProps) => {
  const [task, setTask] = useState<TaskType | null>(null)
  const setTaskModal = useSetRecoilState(taskModalShowState)
  const [loading, setLoading] = useState(true)

  const fetchTask = useCallback(async () => {
    try {
      const res = await client.get(`/tasks/${id}`)
      console.log('res', res.data.data)
    } catch (e) {
      console.log('e', e)
      toast.error(formatServerErrors(e))
      setTaskModal({ task_id: null, show: false })
    } finally {
      setLoading(false)
    }
  }, [])

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
          </div>
        )}
      </>
    </Modal>
  )
}

export default TaskModal
