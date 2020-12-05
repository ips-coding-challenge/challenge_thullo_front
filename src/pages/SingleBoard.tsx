import { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import client from '../api/client'
import BasicLoader from '../components/BasicLoader'
import BoardMembers from '../components/Board/BoardMembers'
import BoardMenu from '../components/Board/BoardMenu'
import BasicError from '../components/Common/BasicError'
import Button from '../components/Common/Button'
import VisibilityDropdown from '../components/Common/Visibility/VisibilityDropdown'
import Navbar from '../components/Header/Navbar'
import Lists from '../components/Lists/Lists'
import TaskModal from '../components/Tasks/Modal/TaskModal'
import {
  boardMembersState,
  boardMenuState,
  boardState,
} from '../state/boardState'
import { labelsState } from '../state/labelState'
import { listState } from '../state/listState'
import { taskModalShowState, tasksState } from '../state/taskState'
import { Board, ListOfTasks, TaskType, User } from '../types/types'
import { formatServerErrors } from '../utils/utils'

const SingleBoard = () => {
  const { id }: any = useParams()
  const history = useHistory()

  // Global state
  const [board, setBoard] = useRecoilState<Board | null>(boardState)
  const setBoardMembers = useSetRecoilState<User[]>(boardMembersState)
  const setLists = useSetRecoilState(listState)
  const setTasks = useSetRecoilState(tasksState)
  const [taskModal, setTaskModal] = useRecoilState(taskModalShowState)
  const setLabels = useSetRecoilState(labelsState)
  const openBoardMenu = useSetRecoilState(boardMenuState)
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
      console.log('e', e.response)
      if (e.response && e.response.status === 403) {
        history.push('/')
      }
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

  const fetchLabels = useCallback(async () => {
    if (board) {
      try {
        const res = await client.get(`/labels?board_id=${board.id}`)
        console.log('labels', res.data.data)
        setLabels(res.data.data)
      } catch (e) {
        console.log('e', e)
      }
    }
  }, [board])

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

  useEffect(() => {
    if (board) {
      fetchLabels()
    }
  }, [board])

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

  if (!loading && !board) {
    return <div>An error occured, please retry</div>
  }

  return (
    <div className="flex flex-col">
      <Navbar name={board!.name} />
      <div className="flex flex-col flex-auto h-board">
        {serverErrors && <BasicError message={serverErrors} />}
        <div className="flex flex-col-reverse sm:flex-row sm:w-full sm:justify-between sm:items-center p-4 md:p-8">
          <div className="relative">
            {board && (
              <div className="flex items-center">
                <VisibilityDropdown
                  visibility={visibility!}
                  setVisibility={updateVisibility}
                />
                {/* BoardMembers */}
                <BoardMembers />
              </div>
            )}
          </div>
          <Button
            icon={<MdMoreHoriz />}
            text="Show menu"
            alignment="left"
            variant="default"
            className="self-start mb-4 sm:mb-0 sm:self-end"
            onClick={() => openBoardMenu(true)}
          />
        </div>

        <div className="flex-auto overflow-hidden md:px-6">
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

      {/* BoardMenu */}
      <BoardMenu />
    </div>
  )
}

export default React.memo(SingleBoard)
