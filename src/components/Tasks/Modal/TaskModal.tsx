import React, { useCallback, useEffect, useState } from 'react'
import { MdAccountCircle } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useSetRecoilState } from 'recoil'
import TaskCoverSelect from './TaskCoverSelect'
import TaskCover from './TaskCover'
import TaskDescription from './TaskDescription'
import TaskSubtitle from './TaskSubtitle'
import { taskModalShowState, taskState } from '../../../state/taskState'
import client from '../../../api/client'
import { formatServerErrors } from '../../../utils/utils'
import Modal from '../../Common/Modal'

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
    <Modal isVisible={isVisible} onClose={onClose} size="large">
      <>
        {!task && loading && (
          <div className="flex w-full h-full items-center justify-center my-4">
            <div className="lds-dual-ring lds-dual-ring-black"></div>
          </div>
        )}
        {task && !loading && (
          <div className="p-4">
            <TaskCover id={task.id!} />

            <div className="flex w-full">
              {/* Left column */}
              <div className="flex flex-col w-8/12">
                <h3 className="font-semibold">{task.title}</h3>
                <TaskDescription task={task} />
              </div>
              {/* Right column */}
              <div className="w-4/12">
                <TaskSubtitle
                  icon={<MdAccountCircle />}
                  text="Actions"
                  className="mb-4"
                />
                <TaskCoverSelect id={task.id!} />
              </div>
            </div>
          </div>
        )}
      </>
    </Modal>
  )
}

export default React.memo(TaskModal)
