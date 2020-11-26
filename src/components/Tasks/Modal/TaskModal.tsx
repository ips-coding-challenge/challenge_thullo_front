import React, { useCallback, useEffect, useState } from 'react'
import { MdAccountCircle } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import TaskCoverSelect from './TaskCoverSelect'
import TaskCover from './TaskCover'
import TaskDescription from './TaskDescription'
import TaskSubtitle from './TaskSubtitle'
import { taskModalShowState, taskState } from '../../../state/taskState'
import client from '../../../api/client'
import { formatServerErrors } from '../../../utils/utils'
import Modal from '../../Common/Modal'
import { currentListState } from '../../../state/listState'
import LabelsDropdown from './Labels/LabelsDropdown'
import { LabelType } from '../../../types/types'
import Label from './Labels/Label'

type TaskModalProps = {
  isVisible: boolean
  onClose: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void
  id: number | null
}
const TaskModal = ({ id, isVisible, onClose }: TaskModalProps) => {
  const [task, setTask] = useRecoilState(taskState(id!))
  const list = useRecoilValue(currentListState(task?.list_id))
  const setTaskModal = useSetRecoilState(taskModalShowState)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   console.log('task', task)
  // }, [task])

  const fetchTask = useCallback(async () => {
    try {
      const res = await client.get(`/tasks/${id}`)
      console.log('res', res.data.data)
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
                <p className="text-xs text-gray3 mb-4">
                  in list{' '}
                  <span className="font-bold text-black">{list.name}</span>
                </p>
                {task && task.labels && task.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((label: LabelType) => (
                      <Label can={false} key={label.id} label={label} />
                    ))}
                  </div>
                )}
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
                <LabelsDropdown id={task.id!} />
              </div>
            </div>
          </div>
        )}
      </>
    </Modal>
  )
}

export default React.memo(TaskModal)
