'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Hash, Plus, ChevronDown, Settings, Bell, Search } from "lucide-react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { pusherClient } from "@/lib/pusher"
import { sendMessage, Message } from "@/actions/message.action"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { OrgMembersParams } from "@/utils/organizations"

type Conversation = {
  id: string
  name: string
  type: 'channel' | 'direct'
  messages: Message[]
  unreadCount: number
}

export default function ImprovedChatUI() {
  const [conversations, setConversations] = useState<{ [key: string]: Conversation }>({
    general: { id: 'general', name: 'general', type: 'channel', messages: [], unreadCount: 0 },
    random: { id: 'random', name: 'random', type: 'channel', messages: [], unreadCount: 0 },
  })
  const [inputMessage, setInputMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>('general')
  const [onlineMembers, setOnlineMembers] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatScrollAreaRef = useRef<HTMLDivElement>(null)

  const { user } = useUser()
  const { isLoaded, memberships } = useOrganization(OrgMembersParams)

  const scrollToBottom = () => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight
    }
  }

  useEffect(scrollToBottom, [selectedConversation, conversations])

  useEffect(() => {
    if (!user) return;

    const channel = pusherClient.subscribe('chat');

    channel.bind("new-message", (message: Message) => {
      setConversations((prevConversations) => {
        const updatedConversations = { ...prevConversations };
        const conversationId = message.recipientId;
        
        const conversation = updatedConversations[conversationId] || { 
          id: conversationId, 
          name: conversationId, 
          type: conversationId.startsWith('#') ? 'channel' : 'direct',
          messages: [], 
          unreadCount: 0 
        };
        
        if (!conversation.messages.some(msg => msg.id === message.id)) {
          conversation.messages.push(message);
          if (conversationId !== selectedConversation) {
            conversation.unreadCount++;
          }
        }
        
        updatedConversations[conversationId] = conversation;
        return updatedConversations;
      });
    });

    // Simulate online status changes
    const onlineStatusInterval = setInterval(() => {
      setOnlineMembers(prev => {
        const newSet = new Set(prev);
        memberships?.data?.forEach(mem => {
          if (Math.random() > 0.5) {
            newSet.add(mem.publicUserData.userId!);
          } else {
            newSet.delete(mem.publicUserData.userId!);
          }
        });
        return newSet;
      });
    }, 5000);

    return () => {
      pusherClient.unsubscribe('chat');
      clearInterval(onlineStatusInterval);
    }
  }, [user, selectedConversation, memberships])

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && user && selectedConversation) {
      const newMessage: Message = {
        id: eval(Date.now().toString()),
        senderId: user.id,
        recipientId: selectedConversation,
        content: inputMessage,
        timestamp: new Date().toISOString()
      };

      setConversations((prevConversations) => {
        const updatedConversations = { ...prevConversations };
        const conversation = updatedConversations[selectedConversation] || { 
          id: selectedConversation, 
          name: selectedConversation, 
          type: selectedConversation.startsWith('#') ? 'channel' : 'direct',
          messages: [], 
          unreadCount: 0 
        };
        conversation.messages.push(newMessage);
        updatedConversations[selectedConversation] = conversation;
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

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setConversations((prevConversations) => {
      const updatedConversations = { ...prevConversations };
      if (updatedConversations[conversationId]) {
        updatedConversations[conversationId].unreadCount = 0;
      }
      return updatedConversations;
    });
  }

  const filteredConversations = Object.values(conversations).filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardContent className="p-0">
        <div className="grid grid-cols-[280px_1fr] h-[700px]">
          {/* Sidebar */}
          <div className="border-r border-gray-200">
            <div className="p-6">
              
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">{user.firstName}</span>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-200px)]">
              <div className="px-4 py-2">
                <h3 className="font-semibold text-sm mb-3 px-2">Channels</h3>
                {filteredConversations.filter(conv => conv.type === 'channel').map((conv) => (
                  <Button
                  
                    key={conv.id}
                    variant={selectedConversation === conv.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1 px-2"
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    <span>{conv.name}</span>
                    {conv.unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">{conv.unreadCount}</Badge>
                    )}
                  </Button>
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start mt-2 px-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Channel
                </Button>
              </div>
              <Separator className="my-4" />
              <div className="px-4 py-2">
                <h3 className="font-semibold text-sm mb-3 px-2">Direct Messages</h3>
                {memberships?.data?.map((mem) => (
                  <Button
                  
                    key={mem.publicUserData.userId!}
                    variant={selectedConversation === mem.publicUserData.userId! ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1 px-2"
                    onClick={() => handleSelectConversation(mem.publicUserData.userId!)}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${onlineMembers.has(mem.publicUserData.userId!) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>{mem.publicUserData?.identifier}</span>
                    {conversations[mem.publicUserData.userId!]?.unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">{conversations[mem.publicUserData.userId!].unreadCount}</Badge>
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="flex flex-col bg-white">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    {conversations[selectedConversation]?.type === 'channel' ? (
                      <Hash className="h-5 w-5" />
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${onlineMembers.has(selectedConversation) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    )}
                    <h2 className="font-semibold">{conversations[selectedConversation]?.name || selectedConversation}</h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Notifications</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-6 py-4" ref={chatScrollAreaRef}>
                  {conversations[selectedConversation]?.messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user?.id;
                    const showAvatar = index === 0 || conversations[selectedConversation].messages[index - 1].senderId !== message.senderId;

                    return (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 mb-6 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && showAvatar && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={memberships?.data?.find(mem => mem.publicUserData.userId! === message.senderId)?.publicUserData.imageUrl || '/placeholder.svg?height=32&width=32'} 
                                         alt={memberships?.data?.find(mem => mem.publicUserData.userId! === message.senderId)?.publicUserData.identifier || 'Unknown'} />
                            <AvatarFallback>{memberships?.data?.find(mem => mem.publicUserData.userId! === message.senderId)?.publicUserData.firstName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] p-3 rounded-lg ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                          {showAvatar && (
                            <p className="font-semibold text-xs mb-1">
                              {isCurrentUser ? 'You' : memberships?.data?.find(mem => mem.publicUserData.userId! === message.senderId)?.publicUserData.identifier}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Message Input */}
                <div className="flex items-center px-6 py-4 border-t border-gray-200">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${conversations[selectedConversation]?.type === 'channel' ? '#' : ''}${conversations[selectedConversation]?.name || selectedConversation}`}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} className="ml-4">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a channel or direct message to start chatting!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}