"use server";

import { pusherServer } from "@/lib/pusher";

export type Message = {
  id: number;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

export const sendMessage = async (message: Message) => {
  try {
    // Optionally store the message inside your database

    // Trigger the event for a single channel
    await pusherServer.trigger("chat", "new-message", message);

    return { success: true, message };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }
};