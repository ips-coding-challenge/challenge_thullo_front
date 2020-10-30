import React, { useCallback, useEffect, useState } from 'react'
import client from '../api/client'

const Boards = () => {
  const [boards, setBoards] = useState<any>([])

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
    <div>
      <h1>Boards</h1>
      {boards.data && boards.data.length > 0 && (
        <ul>
          {boards.data.map((board: any) => {
            return <li>{board.name}</li>
          })}
        </ul>
      )}
    </div>
  )
}

export default Boards
