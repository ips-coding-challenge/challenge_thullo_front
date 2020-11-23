import React from 'react'

type SquareButton = {
  icon: JSX.Element
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const SquareButton = ({ icon, onClick }: SquareButton) => {
  return (
    <div
      className="w-8 h-8 bg-blue hover:bg-blue-darker p-2 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      {icon}
    </div>
  )
}

export default SquareButton
