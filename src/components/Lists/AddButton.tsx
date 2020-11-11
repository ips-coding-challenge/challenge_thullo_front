import React from 'react'

type AddButtonProps = {
  text: string
  icon: JSX.Element
  className?: string
  onClick?:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined
}

const AddButton = ({ text, icon, onClick, className }: AddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-btn rounded-lg px-3 py-1 ${className}`}
    >
      <div className="flex items-center justify-between text-blue">
        <span className="text-blue font-semibold text-sm">{text}</span>
        {icon}
      </div>
    </button>
  )
}

export default AddButton
