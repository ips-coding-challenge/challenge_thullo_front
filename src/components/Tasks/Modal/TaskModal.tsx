import React, { useCallback, useEffect, useState } from 'react'
import {
  MdAccountCircle,
  MdAdd,
  MdClose,
  MdDelete,
  MdPeople,
} from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import TaskCoverSelect from './TaskCoverSelect'
import TaskCover from './TaskCover'
import TaskDescription from './TaskDescription'
import TaskSubtitle from './TaskSubtitle'
import {
  assignedMembersState,
  taskModalShowState,
  taskState,
} from '../../../state/taskState'
import client from '../../../api/client'
import { formatServerErrors, isAdmin, isOwner } from '../../../utils/utils'
import Modal from '../../Common/Modal'
import { currentListState, listState } from '../../../state/listState'
import LabelsDropdown from './Labels/LabelsDropdown'
import { LabelType, ListOfTasks, TaskType, User } from '../../../types/types'
import Label from './Labels/Label'
import { selectedPhotoState } from '../../../state/unsplashState'
import Avatar from '../../Header/Avatar'
import { boardMembersState, boardState } from '../../../state/boardState'
import MembersDropdown from '../../Board/MembersDropdown'
import Button from '../../Common/Button'
import Attachments from './Attachments/Attachments'
import Comments from './Comments/Comments'
import { taskLabelsState } from '../../../state/labelState'
import Labels from './Labels/Labels'
import { userState } from '../../../state/userState'

type TaskModalProps = {
  isVisible: boolean
  onClose: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void
  id: number | null
}
const TaskModal = ({ id, isVisible, onClose }: TaskModalProps) => {
  // Global state
  const board = useRecoilValue(boardState)
  const user = useRecoilValue(userState)
  const [task, setTask] = useRecoilState(taskState(id!))
  const list = useRecoilValue(currentListState(task?.list_id))
  const [lists, setLists] = useRecoilState(listState)
  // const setLists = useSetRecoilState(listState)
  const setTaskModal = useSetRecoilState(taskModalShowState)
  const setSelectedPhoto = useSetRecoilState(selectedPhotoState)
  const members = useRecoilValue(boardMembersState)
  const assignedMembers = useRecoilValue(assignedMembersState(task?.id!))
  const setShowModal = useSetRecoilState(taskModalShowState)

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

  const deleteTask = useCallback(async () => {
    if (!window.confirm('Are you sure that you want to delete this task?'))
      return

    if (task) {
      const originalLists = [...lists]
      const originalTask = { ...task }
      try {
        setLists((lists: ListOfTasks[]) => {
          const listIndex = lists.findIndex(
            (l: ListOfTasks) => l.id === task.list_id
          )

          if (listIndex === -1) {
            return lists
          }

          const listsCopy = [...lists]

          console.log('listCopy', listsCopy)
          const taskIndex = listsCopy[listIndex].tasks.findIndex(
            (t: TaskType) => t.id === task.id
          )

          console.log('taskIndex', taskIndex)
          if (taskIndex === -1) return lists
          const taskCopy = [...listsCopy[listIndex].tasks]
          taskCopy.splice(taskIndex, 1)

          console.log('taskCopy', taskCopy)
          listsCopy[listIndex] = { ...listsCopy[listIndex], tasks: taskCopy }

          return listsCopy
        })

        await client.delete('/tasks', {
          data: {
            task_id: task.id,
            board_id: task.board_id,
          },
        })

        setTask(undefined)
        setShowModal(() => {
          return {
            task_id: null,
            show: false,
          }
        })
      } catch (e) {
        setLists(originalLists)
        setTask(originalTask)
        console.log('e', e)
      }
    }
  }, [task])

  const canDelete = () => {
    const owner = isOwner(user!, task)
    const admin = isAdmin(user!, board!)

    return owner || admin
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

                <Labels taskId={task.id} />

                <TaskDescription task={task} />

                <Attachments />

                <Comments />
              </div>
              {/* Right column */}
              <div className="md:w-4/12 w-full mt-8 md:mt-0 h-auto flex flex-col justify-between">
                <div className="w-full">
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
                {/* Delete task button */}
                {canDelete() && (
                  <Button
                    className="mt-3 md:mt-0"
                    variant="bordered-danger"
                    text="Delete"
                    icon={<MdDelete />}
                    alignment="left"
                    onClick={deleteTask}
                  />
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
