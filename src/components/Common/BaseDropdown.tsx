import React, { useEffect, useRef, useState } from 'react'

type BaseDropdownProps = {
  children: (onTrigger: Function, show: boolean) => any
}
const BaseDropdown = ({ children }: BaseDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    window.addEventListener('mousedown', onClickOutside)

    return () => {
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [ref])

  const onClickOutside = (e: any) => {
    if (ref && !ref.current?.contains(e.target)) {
      setShow(false)
    }
  }

  const onTrigger = (e: React.MouseEvent) => {
    setShow((val) => (val = !val))
  }

  return (
    <div ref={ref} className="md:relative">
      {children(onTrigger, show)}
    </div>
  )
}

export default BaseDropdown
