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
import Button from '../Common/Button'
import SquareButton from '../Common/SquareButton'
import Avatar from '../Header/Avatar'
import SearchInput from '../Header/SearchInput'

type MembersDropdownProps = {
  task: TaskType
  title: string
  subtitle: string
  variant?: string
}

const MembersDropdown = ({
  task,
  title,
  subtitle,
  variant = 'squared',
}: MembersDropdownProps) => {
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
    } else {
      setnewMembers(members)
      setFiltered(members)
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

  const selectButton = (onTrigger: Function) => {
    switch (variant) {
      case 'default': {
        return (
          <Button
            icon={<MdAdd />}
            alignment="left"
            variant="default"
            text="Members"
            className="w-full mt-4"
            onClick={() => onTrigger()}
          />
        )
      }

      case 'blue': {
        return (
          <Button
            icon={<MdAdd />}
            alignment="left"
            variant="primary"
            text="Assign a member"
            onClick={() => onTrigger()}
          />
        )
      }
      default:
        return (
          <SquareButton
            onClick={() => onTrigger()}
            icon={<MdAdd className="text-white" />}
          />
        )
    }
  }

  return (
    <BaseDropdown>
      {(onTrigger, show) => (
        <>
          {selectButton(onTrigger)}
          {show && (
            <div
              className={`absolute w-list top-0 bg-white rounded-card shadow-lg ${
                variant === 'squared' ? 'md:ml-10' : 'md:mt-10'
              } py-3 px-4 z-10 border border-gray-border`}
            >
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

export default React.memo(MembersDropdown)
