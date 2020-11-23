import React, { useState } from 'react'

type BaseInputProps = {
  placeholder: string
  icon: JSX.Element
  onClick: (value: string) => void
  className?: string
}

const BaseInput = ({
  placeholder,
  icon,
  onClick,
  className,
}: BaseInputProps) => {
  const [value, setValue] = useState<string>('')

  return (
    <div
      className={`rounded-lg shadow-md h-10 flex justify-between items-center p-1 ${
        className ? className : ''
      }`}
    >
      <input
        style={{ minWidth: 0 }}
        className="mx-2 p-1"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button
        onClick={() => onClick(value)}
        className="bg-blue rounded-lg h-full px-4 text-white text-sm"
      >
        {icon}
      </button>
    </div>
  )
}

export default BaseInput
