import prisma from '@/lib/prisma';

type User = {
  id: number;
  email: string;
};

export default async function TestPage() {
  const users: User[] = await prisma.user.findMany();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
