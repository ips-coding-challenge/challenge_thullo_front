import React from 'react'
import { MdAdd, MdSend } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import * as yup from 'yup'
import client from '../../api/client'
import { boardState } from '../../state/boardState'
import { Board } from '../../types/types'
import { formatServerErrors } from '../../utils/utils'
import BaseDropdown from '../Common/BaseDropdown'
import BaseInput from '../Common/BaseInput'
import SquareButton from '../Common/SquareButton'

const schema = yup.object().shape({
  email: yup.string().email().required(),
})

const InvitationDropdown = () => {
  const currentBoard = useRecoilValue<Board | null>(boardState)

  const sendInvitation = async (email: string) => {
    try {
      await schema.validate({ email })
      await client.post('/invitations', {
        board_id: currentBoard!.id,
        email,
      })
      toast.success('Invitation sent!')
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        toast.error(e.message)
      } else {
        toast.error(formatServerErrors(e))
      }
      console.log('e', e)
    }
  }
  return (
    <BaseDropdown mobile={true}>
      {(onTrigger, show) => (
        <>
          <SquareButton
            icon={<MdAdd className="text-white" />}
            onClick={() => onTrigger()}
          />
          {show && (
            <div className="absolute w-auto top-0 left-0 md:left-auto bg-white rounded-card shadow-lg mt-10 py-3 px-4 z-10 border border-gray-border">
              <h3 className="font-semibold mb-6">Invite to board</h3>

              <BaseInput
                placeholder="Enter user's email"
                icon={<MdSend />}
                onClick={(email) => {
                  sendInvitation(email)
                  onTrigger()
                }}
              />
            </div>
          )}
        </>
      )}
    </BaseDropdown>
  )
}

export default InvitationDropdown
