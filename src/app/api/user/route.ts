import {NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import  prisma from '@/lib/prisma'; // adjust the import based on your Prisma setup

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0].emailAddress;
    const name = clerkUser.firstName || clerkUser.username;

    // Check if the user already exists in Prisma
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }, // Assuming you have a clerkId field in your User model
    });

    // If the user does not exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId, // Save the Clerk ID
          email,
          name,
        },
      });
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
    // return NextResponse.json({
    //   id: user.id,
    //   email: user.email,
    //   name: user.name,
    // });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
