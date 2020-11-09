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
    <>
      <Navbar name={board!.name} />
      <div className="px-6">
        <div className="flex w-full justify-between my-8">
          <div></div>
          <Button
            icon={<MdMoreHoriz />}
            text="Show menu"
            alignment="left"
            variant="default"
          />
        </div>

        <div className="bg-boardBg rounded-lg h-full">
          <div className="grid grid-flow-col gap-6 auto-cols-list">
            {lists.length > 0 &&
              lists.map((list: ListOfTasks) => {
                return <List key={list.id} board_id={board!.id} list={list} />
              })}
            <AddList board_id={board!.id} />
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleBoard
