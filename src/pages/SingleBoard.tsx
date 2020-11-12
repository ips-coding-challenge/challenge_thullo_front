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

  const onDragEnd = (result: DropResult) => {
    console.log('dropped?', result)
    const { source, destination } = result

    if (!destination) {
      return
    }

    const sourceListIndex = lists.findIndex((l) => l.id === +source.droppableId)
    const destinationListIndex = lists.findIndex(
      (l) => l.id === +destination.droppableId
    )

    const sourceTasks = Array.from(lists[sourceListIndex].tasks)
    const destinationTasks = Array.from(lists[destinationListIndex].tasks)

    const [removed] = sourceTasks.splice(+source.index, 1)
    destinationTasks.splice(+destination.index, 0, removed)

    setLists((old: ListOfTasks[]) => {
      const copy = [...old]
      copy[sourceListIndex] = { ...copy[sourceListIndex], tasks: sourceTasks }
      copy[destinationListIndex] = {
        ...copy[destinationListIndex],
        tasks: destinationTasks,
      }
      console.log('copy', copy)
      return copy
    })
  }

  if (loading) {
    return <BasicLoader />
  }

  return (
    <div className="flex flex-col">
      <Navbar name={board!.name} />
      <div className="flex-auto h-full px-6 mt-8">
        <div className="flex w-full justify-between mb-8">
          <div></div>
          <Button
            icon={<MdMoreHoriz />}
            text="Show menu"
            alignment="left"
            variant="default"
          />
        </div>

        <div>
          <div className="bg-boardBg rounded-lg p-4">
            <div className="h-full w-full overflow-x-auto">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-flow-col gap-6 auto-cols-list pb-6">
                  {lists.length > 0 &&
                    lists.map((list: ListOfTasks) => {
                      return (
                        <List key={list.id} board_id={board!.id} list={list} />
                      )
                    })}
                  <AddList board_id={board!.id} />
                </div>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SingleBoard)
