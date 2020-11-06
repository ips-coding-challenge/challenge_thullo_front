import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import client from '../api/client'
import Navbar from '../components/Header/Navbar'
import Layout from '../components/Layout'
import { Board } from '../types/types'

const SingleBoard = () => {
  const { id }: any = useParams()
  const [board, setBoard] = useState<Board | null>(null)

  const fetchBoard = useCallback(async () => {
    console.log('id', id)
    // try {
    //   const res = await client.get(`/boards/${id}`)
    // } catch (e) {
    //   console.log('Fetch Board error', e)
    // }
  }, [])

  useEffect(() => {
    fetchBoard()
  }, [])

  return (
    <Layout>
      <>
        {/* <Navbar name={true} /> */}
        <div>Single Board</div>
      </>
    </Layout>
  )
}

export default SingleBoard
