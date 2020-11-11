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

const SingleBoard = () => {
  const { id }: any = useParams()
  const [board, setBoard] = useState<Board | null>(null)
  const [lists, setLists] = useRecoilState(listState)
  // const [lists, setLists] = useState<ListOfTasks[]>([])
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

        <div className="bg-boardBg rounded-lg h-full p-4">
          <div className="h-full w-full overflow-x-auto">
            <div className="grid grid-flow-col gap-6 auto-cols-list pb-6">
              {lists.length > 0 &&
                lists.map((list: ListOfTasks) => {
                  return <List key={list.id} board_id={board!.id} list={list} />
                })}
              <AddList board_id={board!.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleBoard
