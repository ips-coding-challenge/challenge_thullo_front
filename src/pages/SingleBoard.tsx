import React, { useCallback, useEffect, useState } from 'react'
import { MdAdd, MdMoreHoriz } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import client from '../api/client'
import BasicLoader from '../components/BasicLoader'
import Button from '../components/Common/Button'
import Navbar from '../components/Header/Navbar'
import Layout from '../components/Layout'
import AddButton from '../components/Lists/AddButton'
import List from '../components/Lists/List'
import { Board } from '../types/types'

const SingleBoard = () => {
  const { id }: any = useParams()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchBoard = useCallback(async () => {
    console.log('id', id)
    try {
      const res = await client.get(`/boards/${id}`)
      console.log('board', res.data.data)
      setBoard(res.data.data)
    } catch (e) {
      console.log('Fetch Board error', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBoard()
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
          <div className="grid grid-flow-col gap-6">
            <List list={{ name: 'List 1' }} />
            <List list={{ name: 'List 2' }} />
            <List list={{ name: 'List 3' }} />
            <AddButton icon={<MdAdd />} text="Add a list" />
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleBoard
