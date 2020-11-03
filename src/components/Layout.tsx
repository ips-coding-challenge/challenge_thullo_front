import React from 'react'
import Navbar from './Header/Navbar'

type LayoutProps = {
  children: JSX.Element
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 max-w-container px-8">
        {children}
      </div>
    </div>
  )
}

export default Layout
