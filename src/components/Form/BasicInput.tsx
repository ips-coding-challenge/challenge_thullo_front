import React from 'react'

type BasicInputProps = {
  type: string
  name: string
  placeholder: string
  error: string
  className?: string
}

const BasicInput = React.forwardRef(
  (
    { type, name, placeholder, error, className }: BasicInputProps,
    ref: any
  ) => {
    return (
      <div>
        <input
          style={{ minWidth: 0 }}
          className={`${className} bg-transparent w-full h-full p-2 border border-gray2 rounded-lg shadow-input`}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={ref}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    )
  }
)

export default BasicInput
