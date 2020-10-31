import React from 'react'
import { User } from '../../types/types'
import { avatarInitials } from '../../utils/utils'

type AvatarProps = {
  user: User
}

const Avatar = ({ user }: AvatarProps) => {
  return (
    <div className="w-8 h-8 rounded-lg bg-gray4 p-4 text-sm text-white flex justify-center items-center">
      <div>{avatarInitials(user.username)}</div>
    </div>
  )
}

export default Avatar
