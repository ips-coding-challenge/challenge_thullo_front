import React, { useState } from 'react'
import { MdAccountCircle, MdClose } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'
import { boardMenuState, boardState } from '../../state/boardState'
import { boardDate } from '../../utils/utils'
import Avatar from '../Header/Avatar'
import TaskSubtitle from '../Tasks/Modal/TaskSubtitle'
import BoardDescription from './BoardDescription'
import BoardMenuMembers from './BoardMenuMembers'

const BoardMenu = () => {
  const board = useRecoilValue(boardState)
  const [boardMenu, setBoardMenu] = useRecoilState(boardMenuState)

  if (!board) return null

  return (
    <div
      className={`bg-white fixed w-full md:w-container top-16 bottom-0 right-0 p-6 transform ${
        boardMenu ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 overflow-y-auto`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{board.name}</h3>
        <MdClose
          className="text-xl cursor-pointer"
          onClick={() => setBoardMenu(false)}
        />
      </div>
      <hr className="my-4" />

      <TaskSubtitle text="Made by" icon={<MdAccountCircle />} />

      {/* Board creator */}
      <div className="flex items-center mt-4">
        <Avatar username={board.username!} className="mr-4" />
        <div>
          <p className="font-bold">{board.username}</p>
          <p className="text-xs text-gray3">{boardDate(board.created_at!)}</p>
        </div>
      </div>

      <BoardDescription />

      <BoardMenuMembers />
    </div>
  )
}

export default BoardMenu
