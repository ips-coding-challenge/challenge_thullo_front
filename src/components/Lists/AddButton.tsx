import React from 'react'

type AddButtonProps = {
  text: string
  icon: JSX.Element
}

const AddButton = ({ text, icon }: AddButtonProps) => {
  return (
    <button className="bg-blue-btn rounded px-3">
      <div className="flex items-center justify-between text-blue">
        <span className="text-blue font-semibold text-sm">{text}</span>
        {icon}
      </div>
    </button>
  )
}

export default AddButton
