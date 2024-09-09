import Image from 'next/image';
import React, { useState } from 'react';
import UserTypeSelector from './UserTypeSelector';
import { Button } from './ui/button';
import { removeCollaborator, updateDocAccess } from '@/lib/actions/room.actions';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

const Collaborator = ({ roomId, email, collaborator, creatorId, user }: CollaboratorProps) => {
  const [userType, setUserType] = useState(collaborator.userType || 'viewer');
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);
    try {
      await updateDocAccess({ roomId, email, userType, updatedBy: user });
      toast.success('Useraccess Updated Successfully!');
    } catch (error) {
      toast.error('Failed to Update Useraccess');
      console.log(error);
    }
    setLoading(false);
  };
  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);
    try {
      await removeCollaborator({ roomId, email });
      toast.success('Collaborator Removed Successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to Remove Collaborator');
    }
    setLoading(false);
  };
  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-none rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4">{collaborator.name}</p>
          <p className="text-sm font-light text-[#333333]">{collaborator.email}</p>
        </div>
      </div>
      {creatorId === collaborator.id ? (
        <p className="text-sm text-[#333333]">Owner</p>
      ) : (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType}
            setUserType={setUserType || 'viewer'}
            onClickHandler={shareDocumentHandler}
          />
          <Button type="button" onClick={() => removeCollaboratorHandler(collaborator.email)}>
            {loading ? (
              <Spinner circleColor="#E5E7EB" pathColor="rgb(100 116 139 / 1)" />
            ) : (
              'Remove'
            )}
          </Button>
        </div>
      )}
    </li>
  );
};

export default Collaborator;
