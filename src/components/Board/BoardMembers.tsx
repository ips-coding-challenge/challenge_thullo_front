import React from 'react'
import { useRecoilValue } from 'recoil'
import { boardMembersState, boardState } from '../../state/boardState'
import { userState } from '../../state/userState'
import { User } from '../../types/types'
import { isAdmin } from '../../utils/utils'
import Avatar from '../Header/Avatar'
import InvitationDropdown from '../Invitations/InvitationDropdown'

const BoardMembers = () => {
  const board = useRecoilValue(boardState)
  const user = useRecoilValue(userState)
  const members = useRecoilValue(boardMembersState)
  return (
    <div className="ml-4 flex items-center">
      <div className="flex gap-1">
        {members
          .filter((m: User) => m.id !== user!.id)
          .map((member: User) => (
            <Avatar
              key={member.id}
              username={member.username}
              avatar={member.avatar}
              className="mr-4"
            />
          ))}

        {/* Invite member dropdown */}
      </div>
      {isAdmin(user!, board!) && <InvitationDropdown />}
    </div>
  )
}

export default BoardMembers
