import React from 'react'

type BasicErrorProps = {
  message: string
}
const BasicError = ({ message }: BasicErrorProps) => {
  return (
    <div className="text-white bg-red-400 p-2 w-full rounded my-2">
      {message}
    </div>
  )
}

export default BasicError
