import React from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import client from '../../api/client'
import { InvitationType } from '../../types/types'
import { formatServerErrors } from '../../utils/utils'
import Button from '../Common/Button'

type InvitationProps = {
  invitation: InvitationType
}

const Invitation = ({ invitation }: InvitationProps) => {
  const history = useHistory()

  const acceptInvitation = async () => {
    try {
      await client.get(`/invitations/${invitation.token}`)
      history.push(`/boards/${invitation.board_id}`)
    } catch (e) {
      toast.error(formatServerErrors(e))
      console.log('e', e)
    }
  }
  return (
    <div className="flex rounded-lg shadow-lg p-4 justify-between items-center">
      <div className="flex h-auto items-center">
        <img
          className="w-20 rounded h-20 object-cover mr-4"
          src={invitation.board_cover}
          alt="cover"
        />
        <div>
          <h3 className="font-semibold">{invitation.board_name}</h3>
          <span className="text-gray3">{invitation.owner_name}</span>
        </div>
      </div>
      <Button
        text="Accept"
        variant="primary"
        alignment="left"
        onClick={acceptInvitation}
      />
    </div>
  )
}

export default Invitation
