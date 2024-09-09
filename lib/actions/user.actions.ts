'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { liveblocks } from '../liveblocks';

const handleError = (error: any) => console.error(error);

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient.users.getUserList({ emailAddress: userIds });
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));
    const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));
    return JSON.parse(JSON.stringify(sortedUsers));
  } catch (error) {
    handleError(error);
  }
};

export const getDocUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);
    const filteredUsers = text.length
      ? users.filter((email) => email.toLowerCase().includes(text.toLowerCase()))
      : users;
    return JSON.parse(JSON.stringify(filteredUsers));
  } catch (error) {
    handleError(error);
  }
};
