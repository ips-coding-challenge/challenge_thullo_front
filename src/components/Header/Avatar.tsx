import React from 'react'
import { User } from '../../types/types'
import { avatarInitials } from '../../utils/utils'

type AvatarProps = {
  username: string
  avatar?: string | null
  className?: string
  width?: string
  height?: string
  textSize?: string
}

const Avatar = ({
  username,
  avatar,
  className,
  width = 'w-8',
  height = 'h-8',
  textSize,
}: AvatarProps) => {
  return avatar ? (
    <img
      src={avatar}
      className={`${width} ${height} rounded-lg ${className} object-cover`}
      alt="avatar"
    />
  ) : (
    <div
      className={`${width} ${height} rounded-lg bg-gray4 p-4 text-sm text-white flex justify-center items-center ${className}`}
    >
      <div className={textSize}>{avatarInitials(username)}</div>
    </div>
  )
}

export default Avatar
