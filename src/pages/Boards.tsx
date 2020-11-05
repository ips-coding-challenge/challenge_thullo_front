import React, { useCallback, useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import client from '../api/client'
import CreateBoardModal from '../components/Boards/CreateBoardModal'
import Button from '../components/Common/Button'
import UnsplashModal from '../components/Common/UnsplashModal'
import Layout from '../components/Layout'

const Boards = () => {
  const [boards, setBoards] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(true)

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

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">All Boards</h1>
        <Button
          variant="primary"
          icon={<MdAdd />}
          text="Add"
          alignment="left"
          onClick={() => setShowModal(true)}
        />
        {boards.data && boards.data.length > 0 && (
          <ul>
            {boards.data.map((board: any) => {
              return <li>{board.name}</li>
            })}
          </ul>
        )}
        <CreateBoardModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </Layout>
  )
}

export default Boards
