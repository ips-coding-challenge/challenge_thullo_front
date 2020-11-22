import React, { useState } from 'react'
import { MdAdd, MdSend } from 'react-icons/md'
import { User } from '../../types/types'
import BaseDropdown from '../Common/BaseDropdown'
import BaseInput from '../Common/BaseInput'
import SquareButton from '../Common/SquareButton'
import SearchInput from '../Header/SearchInput'

type MembersDropdownProps = {
  title: string
  subtitle: string
}

const MembersDropdown = ({ title, subtitle }: MembersDropdownProps) => {
  const [members, setMembers] = useState<User[]>([])

  const searchMembers = (query: string) => {}

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
              {members.length > 0 && <div></div>}
            </div>
          )}
        </>
      )}
    </BaseDropdown>
  )
}

export default MembersDropdown
