import React, { useCallback, useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import client from '../api/client'
import BasicLoader from '../components/BasicLoader'
import BoardCard from '../components/Boards/BoardCard'
import CreateBoardModal from '../components/Boards/CreateBoardModal'
import Button from '../components/Common/Button'
import UnsplashModal from '../components/Common/UnsplashModal'
import Layout from '../components/Layout'

const Boards = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [boards, setBoards] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  const fetchBoards = useCallback(async () => {
    try {
      const res = await client.get('/boards')
      console.log('res', res.data)
      setBoards(res.data.data)
    } catch (e) {
      console.log('e', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBoards()
  }, [])

  const onCreated = (board: any) => {
    console.log('board', board)
    setShowModal(false)
    setBoards((old: any) => old.concat(board))
  }

  if (loading) {
    return <BasicLoader />
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">All Boards</h1>
          <Button
            variant="primary"
            icon={<MdAdd />}
            text="Add"
            alignment="left"
            onClick={() => setShowModal(true)}
          />
        </div>
        {boards.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {boards.map((board: any) => {
              return <BoardCard key={board.id} board={board} />
            })}
          </ul>
        )}
        <CreateBoardModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          onCreated={onCreated}
        />
      </div>
    </Layout>
  )
}

export default Boards
