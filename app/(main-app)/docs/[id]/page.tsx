import Room from '@/components/Room';
import { getDoc } from '@/lib/actions/room.actions';
import { getClerkUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const page = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');
  const room = await getDoc({ roomId: id, userId: clerkUser.emailAddresses[0].emailAddress });
  if (!room) redirect('/');
  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });
  console.log({ users });
  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer',
  }));
  const currUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes(
    'room:write'
  )
    ? 'editor'
    : 'viewer';
  return (
    <main className="flex w-full">
      <Room
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currUserType}
      />
    </main>
  );
};

export default page;
