import { PrismaClient, User as PrismaUser } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Type for response
type ResponseData = PrismaUser[] | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // Fetch users including their posts
    const users = await prisma.user.findMany({
      include: {
        posts: true, // Include posts for each user
      },
    });

    // Send the users as JSON response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
