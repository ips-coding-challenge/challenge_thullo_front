import React, { useEffect } from 'react'
import { Route, Redirect, useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '../state/userState'

type PublicRouteProps = {
  children: JSX.Element
  path: string
  exact?: boolean
}
const PublicRoute = ({ children, ...rest }: PublicRouteProps) => {
  const user = useRecoilValue(userState)
  const history = useHistory()

  useEffect(() => {
    if (user) {
      history.push('/')
    }
  }, [])
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !user ? children : <Redirect to={{ pathname: '/' }} />
      }
    />
  )
}

export default PublicRoute
