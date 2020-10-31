import React from 'react'

type ButtonProps = {
  icon: JSX.Element
  text: string
  alignment: string
  variant: string
}
const variants: any = {
  primary: 'bg-blue hover:bg-blue-darker text-white',
  secondary: '',
  default: 'bg-gray1 hover:bg-gray2 text-gray3',
}
const Button = ({ icon, text, alignment, variant }: ButtonProps) => {
  return (
    <button
      className={`${variants[variant]} rounded-lg px-4 py-2 flex items-center justify-center`}
    >
      {alignment === 'left' ? <div className="mr-2">{icon}</div> : null}
      <p>{text}</p>
      {alignment === 'right' ? <div className="ml-2">{icon}</div> : null}
    </button>
  )
}

export default Button
