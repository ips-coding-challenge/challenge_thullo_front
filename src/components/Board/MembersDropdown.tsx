import React, { useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { boardMembersState } from '../../state/boardState'
import {
  assignedMembersState,
  currentTaskState,
  taskState,
} from '../../state/taskState'
import { TaskType, User } from '../../types/types'
import { formatServerErrors } from '../../utils/utils'
import BaseDropdown from '../Common/BaseDropdown'
import SquareButton from '../Common/SquareButton'
import Avatar from '../Header/Avatar'
import SearchInput from '../Header/SearchInput'

type MembersDropdownProps = {
  task: TaskType
  title: string
  subtitle: string
}

const MembersDropdown = ({ task, title, subtitle }: MembersDropdownProps) => {
  // Global state
  const members = useRecoilValue(boardMembersState)
  const setCurrentTask = useSetRecoilState(taskState(task.id!))
  const assignedMembers = useRecoilValue(assignedMembersState(task.id!))

  // Local State
  const [newMembers, setnewMembers] = useState<User[]>(members)
  const [filtered, setFiltered] = useState<User[]>(members)

  const filteredMembers = () => {
    if (assignedMembers && assignedMembers.length > 0) {
      const filtered = newMembers.filter((m: User) => {
        return assignedMembers?.findIndex((am: User) => am.id === m.id) === -1
      })
      setnewMembers(filtered)
      setFiltered(filtered)
    }
  }

  useEffect(() => {
    filteredMembers()
  }, [assignedMembers])

  const searchMembers = async (query: string) => {
    if (query.length === 0) {
      setFiltered(newMembers)
      return
    }

    const filtered = newMembers.filter((nm: User) =>
      nm.username.toLowerCase().includes(query.toLowerCase())
    )
    setFiltered(filtered)
  }

  const selectUser = async (member: User) => {
    // Invite User or assign it to the task

    try {
      const res = await client.post('/assignments', {
        task_id: task.id,
        user_id: member.id,
      })

      console.log('add user to task', res.data)
      setCurrentTask((old: TaskType | undefined) => {
        if (old) {
          return {
            ...old,
            assignedMembers: old?.assignedMembers?.concat(member),
          }
        }
        return old
      })
    } catch (e) {
      formatServerErrors(e)
      console.log('e', e)
    }
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
            <div className="absolute w-list top-0 left-0 md:left-auto bg-white rounded-card shadow-lg md:ml-10 py-3 px-4 z-10 border border-gray-border">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray3 mb-4">{subtitle}</p>
              <SearchInput placeholder="User..." search={searchMembers} />

              {/* Members Result */}
              {filtered.length > 0 && (
                <div className="rounded-lg shadow-md mt-6">
                  <ul>
                    {filtered.map((member: User) => (
                      <li
                        key={member.id}
                        className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray1 transition-colors duration-300"
                        onClick={() => selectUser(member)}
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
