import React from 'react'

type LoadingButtonProps = {
  text: string
  type: string
  loading: boolean
  className?: string
  rest?: Object
}

const LoadingButton = ({
  text,
  type,
  loading,
  className,
  ...rest
}: LoadingButtonProps) => {
  return (
    <button
      {...rest}
      type="submit"
      className={`relative w-full mt-2 mb-8 bg-yellow-500 text-white rounded-lg py-3 px-4 hover:bg-orange-600 transition-colors duration-200`}
    >
      {loading && (
        <div
          className="lds-dual-ring absolute"
          style={{ left: '4px', top: '4px' }}
        ></div>
      )}
      {text}
    </button>
  )
}

export default LoadingButton
