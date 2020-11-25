import React from 'react'

type ButtonProps = {
  text: string
  variant: string
  size?: string
  textSize?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  alignment?: string
  className?: string
  style?: React.CSSProperties
  onClick?:
    | ((
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
      ) => void)
    | undefined
  icon?: JSX.Element
  disabled?: boolean
}
const variants: any = {
  primary: 'bg-blue hover:bg-blue-darker text-white',
  secondary: '',
  default: 'bg-gray1 hover:bg-gray5 text-gray3',
  blank: 'bg-white hover:bg-gray5 text-gray3',
  bordered: 'bg-white border border-gray3 text-gray3 hover:bg-gray5',
}

const sizes: any = {
  sm: 'px-2 py-1',
  md: 'px-4 py-2',
}

const textSizes: any = {
  xs: 'text-xs',
  sm: 'text-sm',
}
const Button = ({
  icon,
  text,
  type,
  alignment,
  variant,
  size = 'md',
  textSize = 'sm',
  className,
  style,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type || 'button'}
      style={style}
      className={`${variants[variant]} ${className} rounded-lg ${sizes[size]} flex items-center justify-center`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && alignment === 'left' ? <div className="mr-2">{icon}</div> : null}
      <p className={`${textSizes[textSize]} font-semibold`}>{text}</p>
      {icon && alignment === 'right' ? (
        <div className="ml-2">{icon}</div>
      ) : null}
    </button>
  )
}

export default Button
