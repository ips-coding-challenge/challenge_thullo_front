import React, { useState } from 'react'

const LabelColors = ({ selectColor }: any) => {
  const colors = [
    '#219653',
    '#F2C94C',
    '#F2994A',
    '#EB5757',
    '#2F80ED',
    '#56CCF2',
    '#6FCF97',
    '#333333',
    '#4F4F4F',
    '#828282',
    '#BDBDBD',
    '#E0E0E0',
  ]

  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  return (
    <div className="my-6 grid grid-cols-4 gap-2">
      {colors.map((color: string, index: number) => (
        <div
          key={index}
          style={{ backgroundColor: `${color}` }}
          className={`h-6 rounded cursor-pointer ${
            selectedColor === color ? 'ring-1 ring-black' : ''
          }`}
          onClick={() => {
            setSelectedColor(color)
            selectColor(color)
          }}
        ></div>
      ))}
    </div>
  )
}

export default LabelColors
