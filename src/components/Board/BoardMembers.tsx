import React from 'react'
import { User } from '../../types/types'
import Avatar from '../Header/Avatar'
import MembersDropdown from './MembersDropdown'

type BoardMembersProps = {
  members: User[]
}

const BoardMembers = ({ members }: BoardMembersProps) => {
  return (
    <div className="ml-4 flex items-center">
      <ul>
        {members.map((member: User) => (
          <Avatar key={member.id} username={member.username} className="mr-4" />
        ))}

        {/* Invite member dropdown */}
      </ul>
      <MembersDropdown
        title="Invite to board"
        subtitle="Search users you want to invite to"
      />
    </div>
  )
}

export default BoardMembers
