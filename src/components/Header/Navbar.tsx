import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from '../../state/userState'
import Logo from '../../assets/Logo.svg'
import Avatar from './Avatar'
import SearchInput from './SearchInput'
import { User } from '../../types/types'
import { MdApps } from 'react-icons/md'
import Button from '../Common/Button'
import { Link, matchPath, useLocation } from 'react-router-dom'
import MenuDropdown from '../Common/MenuDropdown'
import { queryState } from '../../state/listState'

type NavbarProps = {
  name?: string
}

const Navbar = ({ name }: NavbarProps) => {
  // Global State
  const location = useLocation()
  const user: User | null = useRecoilValue(userState)
  const setQuery = useSetRecoilState(queryState)

  console.log('location', location.pathname)

  const showSearch = () => {
    return (
      matchPath(location.pathname, {
        path: '/boards/:id',
        exact: true,
        strict: true,
      }) !== null
    )
  }
  /**
   * search tasks by name or label
   * @param value
   */
  const search = (value: string) => {
    setQuery(value)
  }

  return (
    <div className="w-full h-16 shadow-md flex px-2 md:px-6 justify-between items-center">
      <div className="hidden md:flex">
        <img src={Logo} alt="Thullo logo" />
        {name && (
          <div className="flex justify-center items-center lg:ml-20 mx-2">
            <h1 className="font-semibold border-r border-gray4 pr-3">{name}</h1>
            <Link to="/" className="flex-none">
              <Button
                icon={<MdApps />}
                text="All Boards"
                alignment="left"
                variant="default"
                className="ml-3"
              />
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center w-full md:w-auto justify-between md:justify-start">
        {showSearch() && (
          <SearchInput
            className="w-full"
            placeholder="Keywords..."
            search={search}
            debounceTimeout={400}
          />
        )}
        <div className="ml-4 lg:ml-16 flex-none flex items-center">
          <Avatar avatar={user!.avatar} username={user!.username} />

          <MenuDropdown />
        </div>
      </div>
    </div>
  )
}

export default React.memo(Navbar)
