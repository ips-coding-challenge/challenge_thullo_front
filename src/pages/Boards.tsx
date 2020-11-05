import React, { useCallback, useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import client from '../api/client'
import CreateBoardModal from '../components/Boards/CreateBoardModal'
import Button from '../components/Common/Button'
import UnsplashModal from '../components/Common/UnsplashModal'
import Layout from '../components/Layout'

const Boards = () => {
  const [boards, setBoards] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  const fetchBoards = useCallback(async () => {
    try {
      const res = await client.get('/boards')
      console.log('res', res.data)
      setBoards(res.data.data)
    } catch (e) {
      console.log('e', e)
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

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center">
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
          <ul>
            {boards.map((board: any) => {
              return <li key={board.id}>{board.name}</li>
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
