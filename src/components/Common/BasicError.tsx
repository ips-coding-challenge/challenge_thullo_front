import React from 'react'

type BasicErrorProps = {
  message: string
}
const BasicError = ({ message }: BasicErrorProps) => {
  return <div className="text-white bg-danger p-3 w-full">{message}</div>
}

export default BasicError
