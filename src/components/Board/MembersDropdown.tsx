import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md'
import client from '../../api/client'
import { User } from '../../types/types'
import BaseDropdown from '../Common/BaseDropdown'
import SquareButton from '../Common/SquareButton'
import Avatar from '../Header/Avatar'
import SearchInput from '../Header/SearchInput'

type MembersDropdownProps = {
  title: string
  subtitle: string
  members?: User[]
}

const MembersDropdown = ({
  title,
  subtitle,
  members,
}: MembersDropdownProps) => {
  const [newMembers, setnewMembers] = useState<User[]>([])

  const searchMembers = async (query: string) => {
    if (query.length === 0) {
      setnewMembers([])
      return
    }
    try {
      const res = await client.get(`/members?q=${query}`)
      console.log('res.data', res.data.data)
      const users = res.data.data
      const filtered = users.filter((user: User) => {
        const index = members?.findIndex((m: User) => m.id === user.id)
        return index === -1
      })
      setnewMembers(filtered)
    } catch (e) {
      console.log('searchMembers e', e)
    }
  }

  const selectUser = (member: User) => {
    // Invite User or assign it to the task
  }

  return (
    <BaseDropdown>
      {(onTrigger, show) => (
        <>
          <SquareButton
            onClick={() => onTrigger()}
            icon={<MdAdd className="text-white" />}
          />
          {show && (
            <div className="absolute w-list top-0 bg-white rounded-card shadow-lg mt-10 py-3 px-4 z-10 border border-gray-border">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray3 mb-4">{subtitle}</p>
              <SearchInput placeholder="User..." search={searchMembers} />

              {/* Members Result */}
              {newMembers.length > 0 && (
                <div className="rounded-lg shadow-md mt-6">
                  <ul>
                    {newMembers.map((member: User) => (
                      <li
                        className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray1 transition-colors duration-300"
                        onClick={(e) => selectUser(member)}
                      >
                        <Avatar className="mr-4" username={member.username} />
                        <span className="font-semibold">{member.username}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </BaseDropdown>
  )
}

export default MembersDropdown
