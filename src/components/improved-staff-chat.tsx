'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react"

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

type Staff = {
  id: number
  name: string
  avatar: string
  lastMessage: string
  online: boolean
}

const initialMessages: Message[] = [
  { id: 1, sender: 'John Doe', content: 'Hey, how\'s the project going?', timestamp: '10:30 AM' },
  { id: 2, sender: 'You', content: 'It\'s going well! We\'re on track to finish by Friday.', timestamp: '10:32 AM' },
  { id: 3, sender: 'John Doe', content: 'Great to hear! Let me know if you need any help.', timestamp: '10:33 AM' },
]

const staffList: Staff[] = [
  { id: 1, name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Great to hear! Let me know if you need any help.', online: true },
  { id: 2, name: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Can we schedule a meeting tomorrow?', online: false },
  { id: 3, name: 'Mike Johnson', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'I\'ve updated the design files.', online: true },
]

export function ImprovedStaffChatComponent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<Staff>(staffList[0])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'You',
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
    }
  }

  return (
    <Card className="w-full  mx-auto ">
      <CardContent className="p-0">
        <div className="grid grid-cols-[300px_1fr] h-[700px]">
          {/* Staff List */}
          <div className="bg-secondary/30">
            <div className="p-4">
             
              <Input placeholder="Search... " className="mb-4" />
            </div>
            <ScrollArea className="h-[calc(100%-5rem)]">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className={`flex items-center space-x-4 p-4 cursor-pointer transition-colors duration-200 ${
                    selectedStaff.id === staff.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <Avatar className="relative">
                    <AvatarImage src={staff.avatar} alt={staff.name} />
                    <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    {staff.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium">{staff.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{staff.lastMessage}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="flex flex-col bg-background">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                  <AvatarFallback>{selectedStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedStaff.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedStaff.online ? 'Online' : 'Offline'}
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
            <ScrollArea className="flex-1 p-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex flex-col mb-4 ${
                    message.sender === 'You' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'You'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {message.timestamp}
                  </span>
                  {index === messages.length - 1 && <div ref={messagesEndRef} />}
                </div>
              ))}
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-2 bg-secondary rounded-lg p-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Smile className="h-5 w-5" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}