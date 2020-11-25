import React, { useCallback, useEffect, useState } from 'react'
import { MdAdd, MdMoreHoriz } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../api/client'
import BasicLoader from '../components/BasicLoader'
import Button from '../components/Common/Button'
import Navbar from '../components/Header/Navbar'
import AddList from '../components/Lists/AddList'
import List from '../components/Lists/List'
import { listState } from '../state/listState'
import { Board, ListOfTasks, TaskType, User } from '../types/types'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import Lists from '../components/Lists/Lists'
import VisibilityDropdown from '../components/Common/Visibility/VisibilityDropdown'
import { formatServerErrors, toCamelCase } from '../utils/utils'
import { AxiosError } from 'axios'
import BasicError from '../components/Common/BasicError'
import BoardMembers from '../components/Board/BoardMembers'
import { boardMembersState, boardState } from '../state/boardState'
import { taskModalShowState, tasksState } from '../state/taskState'
import TaskModal from '../components/Tasks/Modal/TaskModal'

const SingleBoard = () => {
  const { id }: any = useParams()

  // Global state
  const [board, setBoard] = useRecoilState<Board | null>(boardState)
  const setBoardMembers = useSetRecoilState<User[]>(boardMembersState)
  const [lists, setLists] = useRecoilState(listState)
  const [tasks, setTasks] = useRecoilState(tasksState)
  const [taskModal, setTaskModal] = useRecoilState(taskModalShowState)
  // Local state
  const [loading, setLoading] = useState<boolean>(true)
  const [visibility, setVisibility] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<string | null>(null)

  const fetchBoard = useCallback(async () => {
    try {
      const res = await client.get(`/boards/${id}`)
      const board: Board = res.data.data
      setBoard(board)
      setVisibility(board.visibility)
      setBoardMembers(board.members)
    } catch (e) {
      console.log('fetchBoard error', e)
    }
  }, [])

  const fetchLists = useCallback(async () => {
    const res = await client.get(`/lists?board_id=${id}`)
    const lists = res.data.data
    const tasks: TaskType[] = []
    lists.forEach((l: ListOfTasks) => {
      l.tasks.forEach((t: TaskType) => {
        tasks.push(t)
      })
    })
    setLists(lists)
    setTasks(tasks)
  }, [])

  const init = async () => {
    try {
      await fetchBoard()
      await fetchLists()
    } catch (e) {
      console.log('e', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()

    return () => {
      setBoard(null)
    }
  }, [])

  const updateVisibility = useCallback(
    async (vis: string) => {
      if (vis === board?.visibility) {
        return
      }

      setServerErrors(null)

      try {
        setVisibility(vis)
        const res = await client.put(`boards/${board?.id}`, {
          visibility: vis,
        })
        setBoard((old: Board | null) =>
          old ? { ...old, visibility: res.data.data.visibility } : old
        )
      } catch (e) {
        const error = e as AxiosError
        setServerErrors(formatServerErrors(error))

        setVisibility(board!.visibility)
      }
    },
    [board]
  )

  if (loading) {
    return <BasicLoader />
  }

  return (
    <div className="flex flex-col">
      <Navbar name={board!.name} />
      <div className="flex flex-col flex-auto h-board">
        {serverErrors && <BasicError message={serverErrors} />}
        <div className="flex w-full justify-between p-8">
          <div className="relative">
            {board && (
              <div className="flex items-center">
                <VisibilityDropdown
                  visibility={visibility!}
                  setVisibility={updateVisibility}
                />
                {/* BoardMembers */}
                <BoardMembers members={board.members} />
              </div>
            )}
          </div>
          <Button
            icon={<MdMoreHoriz />}
            text="Show menu"
            alignment="left"
            variant="default"
          />
        </div>

        <div className="flex-auto overflow-hidden px-6">
          <div className="bg-boardBg rounded-lg h-full">
            <Lists board={board!} />
          </div>
        </div>
      </div>

      {/* TaskModal */}
      <TaskModal
        isVisible={taskModal.show}
        onClose={() => setTaskModal({ task_id: null, show: false })}
        id={taskModal.task_id}
      />
    </div>
  )
}

export default React.memo(SingleBoard)
