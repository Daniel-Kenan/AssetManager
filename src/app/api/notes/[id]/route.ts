// app/api/notes/[id]/route.ts
import {NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const noteId = params.id;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const deletedNote = await prisma.note.deleteMany({
    where: {
      id: noteId,
      userId: user.id, // Ensure the note belongs to the user
    },
  });

  if (!deletedNote.count) {
    return NextResponse.json({ error: 'Note not found or does not belong to you' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Note deleted' });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const noteId = params.id;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Update the note to indicate it's archived (you can add a field in your schema for archiving)
  const updatedNote = await prisma.note.updateMany({
    where: {
      id: noteId,
      userId: user.id, // Ensure the note belongs to the user
    },
    data: {
      color: 'bg-gray-300', // Change the color to indicate it's archived
    },
  });

  if (!updatedNote.count) {
    return NextResponse.json({ error: 'Note not found or does not belong to you' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Note archived' });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const noteId = params.id;
  const { color } = await req.json(); // Get the new color from the request body

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updatedNote = await prisma.note.updateMany({
    where: {
      id: noteId,
      userId: user.id, // Ensure the note belongs to the user
    },
    data: { color }, // Update the color
  });

  if (!updatedNote.count) {
    return NextResponse.json({ error: 'Note not found or does not belong to you' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Note color updated' });
}
