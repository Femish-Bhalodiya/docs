'use server';

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType } from '../utils';
import { redirect } from 'next/navigation';

const handleError = (error: any) => console.error(error);

export const createDoc = async ({ userId, email }: CreateDocumentParams) => {
  const roomId = nanoid();
  try {
    const metadata = { creatorId: userId, email, title: 'untitled' };
    const usersAccesses: RoomAccesses = { [email]: ['room:write'] };
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });
    revalidatePath('/');
    return JSON.parse(JSON.stringify(room));
  } catch (error) {
    handleError(error);
  }
};

export const getDoc = async ({ roomId, userId }: { roomId: string; userId: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    if (!Object.keys(room.usersAccesses).includes(userId))
      throw new Error('You do not have access to this document');
    return JSON.parse(JSON.stringify(room));
  } catch (error) {
    handleError(error);
  }
};

export const updateDoc = async (roomId: string, title: string) => {
  try {
    const room = await liveblocks.updateRoom(roomId, { metadata: { title } });
    revalidatePath(`/docs/${roomId}`);
    return JSON.parse(JSON.stringify(room));
  } catch (error) {
    handleError(error);
  }
};

export const getDocs = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });
    return JSON.parse(JSON.stringify(rooms));
  } catch (error) {
    handleError(error);
  }
};

export const deleteDoc = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath('/');
    redirect('/');
  } catch (error) {
    handleError(error);
  }
};

export const updateDocAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = { [email]: getAccessType(userType) as AccessType };
    const room = await liveblocks.updateRoom(roomId, { usersAccesses });
    if (room) {
      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: '$documentAccess',
        subjectId: nanoid(),
        activityData: {
          userType,
          title: 'you have been granted access to a document',
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      });
    }
    revalidatePath(`/docs/${roomId}`);
    return JSON.parse(JSON.stringify(room));
  } catch (error) {
    handleError(error);
  }
};

export const removeCollaborator = async ({ roomId, email }: { roomId: string; email: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    if (room.metadata.email === email) throw new Error('Cannot remove the owner of the document');
    const updatedRoom = await liveblocks.updateRoom(roomId, { usersAccesses: { [email]: null } });
    revalidatePath(`/docs/${roomId}`);
    return JSON.parse(JSON.stringify(updatedRoom));
  } catch (error) {
    handleError(error);
  }
};
