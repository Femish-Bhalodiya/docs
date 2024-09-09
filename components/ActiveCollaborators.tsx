import { useOthers } from '@liveblocks/react/suspense';
import Image from 'next/image';
import React from 'react';

const ActiveCollaborators = () => {
  const others = useOthers();
  const collaborators = others.map((other) => other.info);
  return (
    <ul className="collaborates-list">
      {collaborators.map((collaborator) => (
        <li key={collaborator.id}>
          <Image
            className="inline-block size-8 rounded-full ring-2 ring-drak-100"
            style={{ border: `3px solid ${collaborator.color}` }}
            src={collaborator.avatar}
            alt={collaborator.name}
            width={100}
            height={100}
          />
        </li>
      ))}
    </ul>
  );
};

export default ActiveCollaborators;
