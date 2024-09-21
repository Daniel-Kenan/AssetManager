'use client'

import { OrgMembersParams } from "@/utils/organizations"
import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { pusherClient } from "@/lib/pusher"
import { sendMessage, Message } from "@/actions/message.action"
import { Badge } from "@/components/ui/badge"

type Conversation = {
  memberId: string
  messages: Message[]
  unreadCount: number
}

export default function ImprovedStaffChatComponent() {
  const [conversations, setConversations] = useState<{ [key: string]: Conversation }>({})
  const [inputMessage, setInputMessage] = useState('')
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [onlineMembers, setOnlineMembers] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatScrollAreaRef = useRef<HTMLDivElement>(null)

  const { user } = useUser()
  const { isLoaded, memberships } = useOrganization(OrgMembersParams)

  const scrollToBottom = () => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight
    }
  }

  useEffect(scrollToBottom, [selectedMember, conversations])

  useEffect(() => {
    if (!user) return;

    const channel = pusherClient.subscribe('chat');

    channel.bind("new-message", (message: Message) => {
      console.log("Incoming message:", message); 
      setConversations((prevConversations) => {
        const updatedConversations = { ...prevConversations };
        const conversationId = message.senderId != user.id ? message.recipientId : message.senderId;
        
        const conversation = updatedConversations[conversationId] || { memberId: conversationId, messages: [], unreadCount: 0 };
        
        if (!conversation.messages.some(msg => msg.id === message.id)) {
          conversation.messages.push(message);
          if (conversationId !== selectedMember) {
            conversation.unreadCount++;
          }
        }
        
        updatedConversations[conversationId] = conversation;
        return updatedConversations;
      });
    });

    return () => {
      pusherClient.unsubscribe('chat');
    }
  }, [user, selectedMember])

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && user && selectedMember) {
      const newMessage: Message = {
        id: Date.now(),
        senderId: user.id,
        recipientId: selectedMember,
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Add message locally to the conversation
      setConversations((prevConversations) => {
        const updatedConversations = { ...prevConversations };
        const conversationId = selectedMember;

        const conversation = updatedConversations[conversationId] || { memberId: conversationId, messages: [], unreadCount: 0 };
        conversation.messages.push(newMessage);
        updatedConversations[conversationId] = conversation;

        return updatedConversations;
      });

      setInputMessage('');

      try {
        const result = await sendMessage(newMessage);
        if (result.success) {
          console.log("Message sent successfully");
        } else {
          console.error("Failed to send message:", result.error);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }

  const handleSelectMember = (memberId: string) => {
    setSelectedMember(memberId);
    setConversations((prevConversations) => {
      const updatedConversations = { ...prevConversations };
      if (updatedConversations[memberId]) {
        updatedConversations[memberId].unreadCount = 0;
      }
      return updatedConversations;
    });
  }

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-0">
        <div className="grid grid-cols-[300px_1fr] h-[700px]">
          {/* Member List */}
          <div className="bg-secondary/30">
            <div className="p-4">
              <Input placeholder="Search members..." className="mb-4" />
            </div>
            <ScrollArea className="h-[calc(100%-5rem)]">
              {memberships?.data?.map((mem) => (
                <div
                  key={mem.id}
                  className={`flex items-center space-x-4 p-4 cursor-pointer transition-colors duration-200 ${selectedMember === mem.id ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                  onClick={() => handleSelectMember(mem.id)}
                >
                  <Avatar className="relative">
                    <AvatarImage src={mem.publicUserData?.imageUrl || '/placeholder.svg?height=40&width=40'} alt={mem.publicUserData?.identifier || 'Unknown'} />
                    <AvatarFallback>{(mem.publicUserData?.firstName?.[0] || 'U') + (mem.publicUserData?.lastName?.[0] || '')}</AvatarFallback>
                    {onlineMembers.has(mem.id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium">{mem.publicUserData?.identifier}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {mem.role} {mem.publicUserData?.userId === user?.id && "(You)"}
                    </p>
                  </div>
                  {conversations[mem.id]?.unreadCount > 0 && (
                    <Badge variant="destructive">{conversations[mem.id].unreadCount}</Badge>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="flex flex-col bg-background">
            {selectedMember ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={memberships?.data?.find(mem => mem.id === selectedMember)?.publicUserData.imageUrl || '/placeholder.svg?height=40&width=40'} 
                                   alt={memberships?.data?.find(mem => mem.id === selectedMember)?.publicUserData.identifier || 'Unknown'} />
                      <AvatarFallback>{memberships?.data?.find(mem => mem.id === selectedMember)?.publicUserData.firstName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{memberships?.data?.find(mem => mem.id === selectedMember)?.publicUserData.identifier}</h2>
                      <p className="text-sm text-muted-foreground">
                        {memberships?.data?.find(mem => mem.id === selectedMember)?.role}
                        {onlineMembers.has(selectedMember) && " • Online"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                      <span className="sr-only">Call</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                      <span className="sr-only">Video call</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={chatScrollAreaRef}>
                  {conversations[selectedMember]?.messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user?.id;
                    const showAvatar = index === 0 || conversations[selectedMember].messages[index - 1].senderId !== message.senderId;

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end space-x-2 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && showAvatar && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={memberships?.data?.find(mem => mem.id === message.senderId)?.publicUserData.imageUrl || '/placeholder.svg?height=24&width=24'} 
                                         alt={memberships?.data?.find(mem => mem.id === message.senderId)?.publicUserData.identifier || 'Unknown'} />
                            <AvatarFallback>{memberships?.data?.find(mem => mem.id === message.senderId)?.publicUserData.firstName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                        </div>
                        {isCurrentUser && showAvatar && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={user?.imageUrl || '/placeholder.svg?height=24&width=24'} alt={user?.username || 'You'} />
                            <AvatarFallback>{user?.firstName?.[0] || 'Y'}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Message Input */}
                <div className="flex items-center p-4 border-t">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} className="ml-2">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Select a member to start chatting!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
