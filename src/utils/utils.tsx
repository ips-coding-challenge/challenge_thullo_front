import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { Board, User } from '../types/types'

export const formatServerErrors = (error: AxiosError): string => {
  if (error.response && error.response.data) {
    return error.response.data
  } else {
    return error.message
  }
}

export const avatarInitials = (username: string) => {
  const split = username.split(' ')
  if (split.length === 1) {
    return username.slice(0, 2).toUpperCase()
  } else {
    return `${split[0].slice(0, 1)}${split[1].slice(0, 1)}`.toUpperCase()
  }
}

export const toCamelCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toUpperCase() : match.toLowerCase()
  })
}

export const isOwner = (user: User, resource: any) => {
  return resource.user_id === user.id
}

export const isAdmin = (user: User, board: Board) => {
  const memberAdmin = board.members.find((m: User) => m.id === user.id)

  if (memberAdmin) {
    return memberAdmin.role === 'admin'
  }
  return false
}

export const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str
}

export const boardDate = (date: string) => {
  return format(new Date(date), 'd MMMM, y')
}

export const commentDate = (date: string) => {
  return format(new Date(date), "d MMMM 'at' HH:mm")
}
