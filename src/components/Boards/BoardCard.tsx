import React from 'react'
import { Link } from 'react-router-dom'
import { Board, User } from '../../types/types'
import Avatar from '../Header/Avatar'

type BoardCardProps = {
  board: Board
}

const BoardCard = ({ board }: BoardCardProps) => {
  const othersText = () => {
    const count = board.members.length - 3
    let text = '+ '
    if (count === 1) {
      text += count + ' other'
    } else {
      text += count + ' others'
    }
    return text
  }

  return (
    <Link to={`/boards/${board.id}`} className="rounded-lg shadow bg-white p-2">
      <img
        className="rounded-lg h-32 w-full object-cover mb-4"
        src={board.cover}
        alt="cover"
      />
      <h3 className="font-bold mb-4">{board.name}</h3>

      {board.members.length > 0 && (
        <div className="flex items-center">
          {board.members.slice(0, 3).map((member: User, index: number) => {
            return (
              <Avatar
                key={index}
                className="mr-2"
                avatar={member.avatar}
                username={member.username}
              />
            )
          })}
          {board.members.length > 3 && (
            <span className="text-sm text-gray4">{othersText()}</span>
          )}
        </div>
      )}
    </Link>
  )
}

export default BoardCard
