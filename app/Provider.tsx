'use client';
import React from 'react';

import { LiveblocksProvider, ClientSideSuspense } from '@liveblocks/react/suspense';
import Loader from '@/components/Loader';
import { getClerkUsers, getDocUsers } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clearkUser } = useUser();
  return (
    <LiveblocksProvider
      authEndpoint={'/api/liveblocks-auth'}
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocUsers({
          roomId,
          currentUser: clearkUser?.emailAddresses[0].emailAddress!,
          text,
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
