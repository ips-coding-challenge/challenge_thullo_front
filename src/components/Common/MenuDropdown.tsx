import React from 'react'
import { MdExpandMore } from 'react-icons/md'
import { Link, useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../../state/userState'
import { truncate } from '../../utils/utils'
import BaseDropdown from './BaseDropdown'

const MenuDropdown = () => {
  const history = useHistory()

  const [user, setUser] = useRecoilState(userState)

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    history.push('/login')
  }

  return (
    <BaseDropdown>
      {(onTrigger, show) => (
        <>
          <button onClick={() => onTrigger()} className="flex items-center">
            <h4 className="ml-2 md:ml-4 mr-2 font-bold">
              {truncate(user!.username, 10)}
            </h4>
            <MdExpandMore />
          </button>
          {show && (
            <ul className="absolute w-auto top-0 right-0 bg-white rounded-card shadow-lg mt-10 py-3 px-4 z-10 border border-gray-border">
              <Link to="/">
                <li className="dropdown-item">Boards</li>
              </Link>
              <hr />
              <Link to="/invitations">
                <li className="dropdown-item">Invitations</li>
              </Link>
              <hr />
              <Link to="/profile">
                <li className="dropdown-item">Profile</li>
              </Link>
              <hr />
              <li className="dropdown-item" onClick={logout}>
                Logout
              </li>
            </ul>
          )}
        </>
      )}
    </BaseDropdown>
  )
}

export default MenuDropdown
