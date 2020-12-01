import React, { useCallback, useEffect, useState } from 'react'
import { MdAccountCircle, MdAdd, MdClose, MdPeople } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import TaskCoverSelect from './TaskCoverSelect'
import TaskCover from './TaskCover'
import TaskDescription from './TaskDescription'
import TaskSubtitle from './TaskSubtitle'
import {
  assignedMembersState,
  labelsAssignedState,
  taskModalShowState,
  taskState,
} from '../../../state/taskState'
import client from '../../../api/client'
import { formatServerErrors } from '../../../utils/utils'
import Modal from '../../Common/Modal'
import { currentListState } from '../../../state/listState'
import LabelsDropdown from './Labels/LabelsDropdown'
import { LabelType, User } from '../../../types/types'
import Label from './Labels/Label'
import { selectedPhotoState } from '../../../state/unsplashState'
import Avatar from '../../Header/Avatar'
import { boardMembersState } from '../../../state/boardState'
import MembersDropdown from '../../Board/MembersDropdown'
import Button from '../../Common/Button'
import Attachments from './Attachments/Attachments'
import { filesState } from '../../../state/fileState'
import Comments from './Comments/Comments'

type TaskModalProps = {
  isVisible: boolean
  onClose: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void
  id: number | null
}
const TaskModal = ({ id, isVisible, onClose }: TaskModalProps) => {
  // Global state
  const [task, setTask] = useRecoilState(taskState(id!))
  const list = useRecoilValue(currentListState(task?.list_id))
  const setTaskModal = useSetRecoilState(taskModalShowState)
  const setSelectedPhoto = useSetRecoilState(selectedPhotoState)
  const members = useRecoilValue(boardMembersState)
  const assignedMembers = useRecoilValue(assignedMembersState(task?.id!))
  const assignedLabels = useRecoilValue(labelsAssignedState(task?.id!))

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return () => {
      setSelectedPhoto(null)
    }
  }, [])

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

  const deleteAssignedMember = async (m: User) => {
    try {
      await client.delete('/assignments', {
        data: {
          user_id: m.id,
          task_id: task?.id!,
        },
      })

      setTask((old) => {
        if (old) {
          const copy = { ...old }
          if (copy.assignedMembers) {
            const index = copy.assignedMembers.findIndex((el) => el.id === m.id)
            let newAssignedMembers = [...copy.assignedMembers]
            if (index > -1) {
              newAssignedMembers.splice(index, 1)
              return { ...copy, assignedMembers: newAssignedMembers }
            }

            return old
          }
        }
        return old
      })
    } catch (e) {
      console.log('delete assignedMember error', e)
    }
  }

  const deleteLabel = async (label: LabelType) => {
    try {
      await client.delete(`/tasks/${task?.id!}/labels`, {
        data: {
          task_id: task?.id!,
          label_id: label.id,
        },
      })

      setTask((old) => {
        if (old) {
          const copy = { ...old }
          if (copy.labels) {
            const index = copy.labels.findIndex((el) => el.id === label.id)
            let newlabels = [...copy.labels]
            if (index > -1) {
              newlabels.splice(index, 1)
              return { ...copy, labels: newlabels }
            }

            return old
          }
        }
        return old
      })
    } catch (e) {
      console.log('deleteFromTask error', e)
    }
  }

  if (!task && !loading) return null

  return (
    <Modal isVisible={isVisible} onClose={onClose} size="large">
      <>
        {loading && (
          <div className="flex w-full h-full items-center justify-center my-4">
            <div className="lds-dual-ring lds-dual-ring-black"></div>
          </div>
        )}
        {task && !loading && (
          <div className="p-4">
            <TaskCover id={task.id!} large={true} />

            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex flex-col w-full md:w-8/12 mr-4">
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-xs text-gray3 mb-4">
                  in list{' '}
                  <span className="font-bold text-black">{list.name}</span>
                </p>
                {assignedLabels && assignedLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {assignedLabels.map((label: LabelType) => (
                      <Label
                        can={false}
                        key={label.id}
                        label={label}
                        deleteLabel={deleteLabel}
                      />
                    ))}
                  </div>
                )}
                <TaskDescription task={task} />

                <Attachments />

                <Comments />
              </div>
              {/* Right column */}
              <div className="md:w-4/12 w-full mt-8 md:mt-0">
                <TaskSubtitle
                  icon={<MdAccountCircle />}
                  text="Actions"
                  className="mb-4"
                />
                <TaskCoverSelect id={task.id!} />
                <LabelsDropdown id={task.id!} />
                {assignedMembers && assignedMembers.length === 0 && (
                  <MembersDropdown
                    task={task}
                    variant="default"
                    title="Members"
                    subtitle="Assign members to this card"
                  />
                )}

                {assignedMembers && assignedMembers.length > 0 && (
                  <div>
                    <TaskSubtitle
                      icon={<MdPeople />}
                      text="Members"
                      className="my-4"
                    />
                    {assignedMembers.map((m: User) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between mb-2"
                      >
                        <div className="flex items-center">
                          <Avatar className="mr-4" username={m.username} />
                          <div>{m.username}</div>
                        </div>
                        <MdClose
                          onClick={() => deleteAssignedMember(m)}
                          className="cursor-pointer bg-red-500 rounded-full text-white text-xl p-1 transition-colors duration-200 hover:text-red-500 hover:bg-white"
                        />
                      </div>
                    ))}

                    {assignedMembers.length < members.length && (
                      <div className="mt-4">
                        <MembersDropdown
                          task={task}
                          variant="blue"
                          title="Members"
                          subtitle="Assign members to this card"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </Modal>
  )
}

export default React.memo(TaskModal)
