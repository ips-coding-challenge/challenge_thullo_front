import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '../state/userState'

type PrivateRouteProps = {
  children: JSX.Element
  path: string
  exact?: boolean
}
const PrivateRoute = ({ children, ...rest }: PrivateRouteProps) => {
  const user = useRecoilValue(userState)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    ></Route>
  )
}

export default PrivateRoute
