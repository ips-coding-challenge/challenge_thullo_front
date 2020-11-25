import React from 'react'

type TaskSubtitleProps = {
  icon: JSX.Element
  text: string
  className?: string
}
const TaskSubtitle = ({ text, icon, className }: TaskSubtitleProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-1 text-xs text-gray4">{icon}</div>
      {/* <MdDescription className="mr-1 text-xs text-gray4" /> */}
      <span className="mr-2 text-gray4 text-xs">{text}</span>
    </div>
  )
}

export default TaskSubtitle
