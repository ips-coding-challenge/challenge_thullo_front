import React, { useState } from 'react'
import { MdLock, MdLockOpen, MdPublic } from 'react-icons/md'
import { toCamelCase } from '../../../utils/utils'
import BaseDropdown from '../BaseDropdown'
import Button from '../Button'
import VisibilityItem from './VisibilityItem'

type VisibilityDropdownProps = {
  visibility: string
  setVisibility: (visibility: string) => void
}
const VisibilityDropdown = ({
  visibility,
  setVisibility,
}: VisibilityDropdownProps) => {
  return (
    <BaseDropdown>
      {(onTrigger, show) => (
        <div>
          <Button
            className="w-full"
            text={toCamelCase(visibility)}
            icon={visibility === 'private' ? <MdLock /> : <MdPublic />}
            variant="default"
            alignment="left"
            onClick={(e) => onTrigger(e)}
          />
          {show && (
            <div className="absolute w-list top-0 bg-white rounded-card shadow-lg mt-10 py-3 px-4 z-10 border border-gray-border">
              <h3 className="font-semibold">Visibility</h3>
              <p className="text-gray3 text-sm mb-4">
                Choose who can see this board
              </p>
              <VisibilityItem
                title="Public"
                subtitle="Anyone on the internet can see this."
                icon={<MdPublic />}
                onClick={(e) => {
                  setVisibility('public')
                  onTrigger(e)
                }}
                selected={visibility === 'public'}
              />
              <VisibilityItem
                title="Private"
                subtitle="Only board members can see this"
                icon={<MdLock />}
                onClick={(e) => {
                  setVisibility('private')
                  onTrigger(e)
                }}
                selected={visibility === 'private'}
              />
            </div>
          )}
        </div>
      )}
    </BaseDropdown>
  )
}

export default VisibilityDropdown
