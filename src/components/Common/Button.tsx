import React from 'react'

type ButtonProps = {
  text: string
  variant: string
  type?: 'button' | 'submit' | 'reset' | undefined
  alignment?: string
  className?: string
  onClick?:
    | ((
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
      ) => void)
    | undefined
  icon?: JSX.Element
}
const variants: any = {
  primary: 'bg-blue hover:bg-blue-darker text-white',
  secondary: '',
  default: 'bg-gray1 hover:bg-gray5 text-gray3',
  blank: 'bg-white hover:bg-gray5 text-gray3',
}
const Button = ({
  icon,
  text,
  type,
  alignment,
  variant,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type || 'button'}
      className={`${variants[variant]} ${className} rounded-lg px-4 py-2 flex items-center justify-center`}
      onClick={onClick}
    >
      {icon && alignment === 'left' ? <div className="mr-2">{icon}</div> : null}
      <p>{text}</p>
      {icon && alignment === 'right' ? (
        <div className="ml-2">{icon}</div>
      ) : null}
    </button>
  )
}

export default Button
