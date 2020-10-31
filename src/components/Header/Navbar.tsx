import React from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../state/userState'
import Logo from '../../assets/Logo.svg'
import Avatar from './Avatar'
import SearchInput from './SearchInput'
import { User } from '../../types/types'
import { MdExpandMore } from 'react-icons/md'

const Navbar = () => {
  const user: User | null = useRecoilValue(userState)

  return (
    <div className="w-full h-16 shadow-md flex px-6 justify-between items-center">
      <div className="flex">
        <img src={Logo} alt="Thullo logo" />
      </div>
      <div className="flex">
        <SearchInput />
        <div className="ml-16 flex items-center">
          <Avatar user={user!} />

          <button className="flex items-center">
            <h4 className="ml-4 mr-2 font-bold">{user!.username}</h4>
            <MdExpandMore />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
