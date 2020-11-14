import React from 'react'

type BasicInputProps = {
  type: string
  name: string
  placeholder: string
  error: string
  value?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void | undefined
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void | undefined
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  autoFocus?: boolean | undefined
}

const BasicInput = React.forwardRef(
  (
    {
      type,
      name,
      value,
      placeholder,
      error,
      className,
      onChange,
      onBlur,
      onKeyDown,
      autoFocus,
    }: BasicInputProps,
    ref: any
  ) => {
    return (
      <>
        <input
          style={{ minWidth: 0 }}
          className={`${className} bg-transparent w-full p-2 border border-gray2 rounded-lg shadow-input`}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </>
    )
  }
)

export default BasicInput
