import React, { useState } from 'react'
import { MdLock, MdLockOpen, MdPublic } from 'react-icons/md'
import BaseDropdown from '../BaseDropdown'
import Button from '../Button'
import VisibilityItem from './VisibilityItem'

const VisibilityDropdown = () => {
  const [visibility, setVisibility] = useState<string>('Private')

  return (
    <BaseDropdown>
      {(onTrigger, show) => (
        <div>
          <Button
            className="w-full"
            text={visibility}
            icon={visibility === 'private' ? <MdLock /> : <MdLockOpen />}
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
                onClick={() => setVisibility('public')}
              />
              <VisibilityItem
                title="Private"
                subtitle="Only board members can see this"
                icon={<MdPublic />}
                onClick={() => setVisibility('private')}
              />
              {/* <div className="dropdown-item">
                <div className="flex items-center mb-2">
                  <MdPublic className="mr-4" />
                  <p className="text-sm">Public</p>
                </div>
                <p className="text-gray3 text-xs">
                  Anyone on the internet can see this.
                </p>
              </div> */}
              {/* <div className="dropdown-item">
                <div className="flex items-center mb-2">
                  <MdLock className="mr-4" />
                  <p className="text-sm">Private</p>
                </div>
                <p className="text-gray3 text-xs">
                  Only board members can see this
                </p>
              </div> */}
            </div>
          )}
        </div>
      )}
    </BaseDropdown>
  )
}

export default VisibilityDropdown
