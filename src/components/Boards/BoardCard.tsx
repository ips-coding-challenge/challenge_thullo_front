import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Board } from '../../types/types'
import { avatarInitials } from '../../utils/utils'
import Avatar from '../Header/Avatar'

type BoardCardProps = {
  board: Board
}

const BoardCard = ({ board }: BoardCardProps) => {
  const [members, setMembers] = useState<string[]>([])

  useEffect(() => {
    getMembers()
  }, [])

  const getMembers = () => {
    let allUsernames = [board.username]
    board.members.forEach((member) => {
      allUsernames.push(member.username)
    })

    // Add Some fakes
    allUsernames.push('Marie', 'Jean', 'Etienne')

    setMembers(allUsernames)
  }

  const othersText = () => {
    const count = members.length - 3
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

      <div className="flex items-center">
        {members.slice(0, 3).map((username: string, index: number) => {
          return <Avatar key={index} className="mr-2" username={username} />
        })}
        {members.length > 3 && (
          <span className="text-sm text-gray4">{othersText()}</span>
        )}
      </div>
    </Link>
  )
}

export default BoardCard
