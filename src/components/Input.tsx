import React from 'react'

type InputProps = {
  type: string
  name: string
  icon: JSX.Element
  placeholder: string
  error: string
  required?: boolean
  rest?: Object
}

const Input = React.forwardRef(
  ({ type, name, icon, placeholder, error, ...rest }: InputProps, ref: any) => {
    return (
      <div className="mb-4">
        <div className="flex items-center border px-2 py-1 border-gray4 rounded-lg">
          {icon}

          <input
            style={{ minWidth: 0 }}
            className="bg-transparent ml-2 w-full h-full p-2 rounded-lg"
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            {...rest}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    )
  }
)

export default Input
