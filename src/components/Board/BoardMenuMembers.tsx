import React from 'react'
import { MdDescription } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'
import client from '../../api/client'
import { boardMembersState, boardState } from '../../state/boardState'
import { userState } from '../../state/userState'
import { User } from '../../types/types'
import { isAdmin } from '../../utils/utils'
import Button from '../Common/Button'
import Avatar from '../Header/Avatar'
import TaskSubtitle from '../Tasks/Modal/TaskSubtitle'

const BoardMenuMembers = () => {
  const user = useRecoilValue(userState)
  const board = useRecoilValue(boardState)
  const [boardMembers, setBoardMembers] = useRecoilState(boardMembersState)

  const sorted = () => {
    const sorted = [...boardMembers]
    sorted.sort((a: any, b: any) => {
      if (a.role > b.role) return 1
      if (a.role < b.role) return -1
      return 0
    })
    return sorted
  }

  const deleteMember = async (member: User) => {
    try {
      await client.delete('/members', {
        data: {
          board_id: board?.id,
          user_id: member.id,
        },
      })
      // Easier in this case to handle assignment/comments/etc...
      window.location.reload()
    } catch (e) {
      console.log('e', e)
    }
  }

  return (
    <div className="mt-8">
      <TaskSubtitle text="Team" icon={<MdDescription />} />
      <ul className="mt-4">
        {sorted().map((member: User) => {
          return (
            <li
              key={member.id}
              className="flex justify-between items-center py-2 rounded-lg"
            >
              <div className="flex items-center">
                <Avatar
                  className="mr-4"
                  avatar={member.avatar}
                  username={member.username}
                />
                <span className="font-semibold">{member.username}</span>
              </div>
              {isAdmin(user!, board!) ? (
                <>
                  {member.role === 'admin' ? (
                    <p className="text-sm capitalize">{member.role}</p>
                  ) : (
                    <Button
                      text="Remove"
                      variant="bordered-danger"
                      size="sm"
                      textSize="xs"
                      onClick={() => deleteMember(member)}
                    />
                  )}
                </>
              ) : (
                <p className="text-sm capitalize">{member.role}</p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default BoardMenuMembers
