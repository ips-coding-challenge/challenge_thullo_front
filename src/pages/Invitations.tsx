import React, { useCallback, useEffect, useState } from 'react'
import client from '../api/client'
import Navbar from '../components/Header/Navbar'
import Invitation from '../components/Invitations/Invitation'
import { InvitationType } from '../types/types'

const Invitations = () => {
  const [invitations, setInvitations] = useState<InvitationType[]>([])

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await client.get('/invitations')

      setInvitations(res.data.data)
    } catch (e) {
      console.log('e', e)
    }
  }, [])

  useEffect(() => {
    fetchInvitations()
  }, [])
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="container mx-auto mt-6 p-8">
        <h1 className="text-2xl mb-4">Invitations</h1>
        {invitations.length > 0 && (
          <>
            <hr className="mb-4" />
            {invitations.map((invitation: InvitationType) => (
              <Invitation key={invitation.id} invitation={invitation} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Invitations
