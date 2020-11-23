import React from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../state/userState'
import { User } from '../../types/types'
import Avatar from '../Header/Avatar'
import InvitationDropdown from '../Invitations/InvitationDropdown'
import MembersDropdown from './MembersDropdown'

type BoardMembersProps = {
  members: User[]
}

const BoardMembers = ({ members }: BoardMembersProps) => {
  const user = useRecoilValue(userState)
  return (
    <div className="ml-4 flex items-center">
      <div className="flex gap-1">
        {members
          .filter((m: User) => m.id !== user!.id)
          .map((member: User) => (
            <Avatar
              key={member.id}
              username={member.username}
              className="mr-4"
            />
          ))}

        {/* Invite member dropdown */}
      </div>
      <InvitationDropdown />
    </div>
  )
}

export default BoardMembers
