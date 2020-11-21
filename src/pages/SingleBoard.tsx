import React, { useCallback, useEffect, useState } from 'react'
import { MdAdd, MdMoreHoriz } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import client from '../api/client'
import BasicLoader from '../components/BasicLoader'
import Button from '../components/Common/Button'
import Navbar from '../components/Header/Navbar'
import AddList from '../components/Lists/AddList'
import List from '../components/Lists/List'
import { listState } from '../state/listState'
import { Board, ListOfTasks } from '../types/types'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import Lists from '../components/Lists/Lists'

const SingleBoard = () => {
  const { id }: any = useParams()
  const [board, setBoard] = useState<Board | null>(null)
  const [lists, setLists] = useRecoilState(listState)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchBoard = useCallback(async () => {
    const res = await client.get(`/boards/${id}`)
    setBoard(res.data.data)
  }, [])

  const fetchLists = useCallback(async () => {
    const res = await client.get(`/lists?board_id=${id}`)
    setLists(res.data.data)
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
  }, [])

  if (loading) {
    return <BasicLoader />
  }

  return (
    <div className="flex flex-col">
      <Navbar name={board!.name} />
      <div className="flex flex-col flex-auto h-board">
        <div className="flex w-full justify-between p-8">
          <div></div>
          <Button
            icon={<MdMoreHoriz />}
            text="Show menu"
            alignment="left"
            variant="default"
          />
        </div>

        <div className="flex-auto overflow-hidden">
          <div className="bg-boardBg rounded-lg h-full">
            <div className="h-full w-full overflow-auto">
              <Lists board={board!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SingleBoard)
