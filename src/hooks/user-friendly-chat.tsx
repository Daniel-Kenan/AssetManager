'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Send, Users, Search, MessageSquare } from 'lucide-react'

// Mock user data - replace with your actual user data
const users = [
  { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40', status: 'online' },
  { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40', status: 'offline' },
  { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg?height=40&width=40', status: 'away' },
  { id: 4, name: 'Diana Prince', avatar: '/placeholder.svg?height=40&width=40', status: 'online' },
  { id: 5, name: 'Ethan Hunt', avatar: '/placeholder.svg?height=40&width=40', status: 'offline' },
]

// Mock message data - replace with your actual message data or API calls
const initialMessages = [
  { id: 1, senderId: 1, text: 'Hey there!', timestamp: '2023-04-01T12:00:00Z' },
  { id: 2, senderId: 0, text: 'Hi Alice, how are you?', timestamp: '2023-04-01T12:01:00Z' },
  { id: 3, senderId: 1, text: 'Im doing great, thanks for asking!', timestamp: '2023-04-01T12:02:00Z' },
  { id: 4, senderId: 0, text: 'Thats wonderful to hear. Any plans for the weekend?', timestamp: '2023-04-02T10:00:00Z' },
  { id: 5, senderId: 1, text: 'Im thinking of going hiking. How about you?', timestamp: '2023-04-02T10:05:00Z' },
]

const formatDate = (date: string) => {
  const today = new Date()
  const messageDate = new Date(date)
  
  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (messageDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
    return 'Yesterday'
  } else {
    return messageDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }
}

export default function Component() {
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null)
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [showUserList, setShowUserList] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const newMsg = {
        id: messages.length + 1,
        senderId: 0, // Assuming 0 is the current user's ID
        text: newMessage,
        timestamp: new Date().toISOString(),
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
      // Simulate received message
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            senderId: selectedUser.id,
            text: "Thanks for your message! I'll get back to you soon.",
            timestamp: new Date().toISOString(),
          }])
        }, 2000)
      }, 1000)
    }
  }

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowUserList(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      <div className="flex-1 flex flex-col w-full max-w-8xl mx-auto bg-white shadow-xl">
        <div className="flex-1 flex">
          {/* User list panel */}
          <div className={`w-80 border-r ${showUserList ? 'block' : 'hidden'} md:block`}>
            <div className="p-4">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      selectedUser?.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedUser(user)
                      setShowUserList(false)
                    }}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className={`text-xs ${
                        user.status === 'online' ? 'text-green-500' :
                        user.status === 'away' ? 'text-yellow-500' : 'text-gray-500'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>
          </div>

          {/* Chat interface */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                <div className="border-b p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">{selectedUser.name}</span>
                      <span className={`text-xs ${
                        selectedUser.status === 'online' ? 'text-green-500' :
                        selectedUser.status === 'away' ? 'text-yellow-500' : 'text-gray-500'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setShowUserList(!showUserList)}>
                      <Users className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <UserPlus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  {messages.reduce((acc: JSX.Element[], message, index, array) => {
                    if (index === 0 || formatDate(message.timestamp) !== formatDate(array[index - 1].timestamp)) {
                      acc.push(
                        <div key={`date-${message.id}`} className="text-center my-4">
                          <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )
                    }
                    acc.push(
                      <div
                        key={message.id}
                        className={`mb-4 ${message.senderId === 0 ? 'text-right' : 'text-left'}`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            message.senderId === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          {message.text}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    )
                    return acc
                  }, [])}
                  {isTyping && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="typing-indicator"></div>
                      <span className="ml-2">{selectedUser.name} is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <div className="border-t p-4 flex items-center">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 mr-2"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 flex-col p-4">
                <MessageSquare className="h-16 w-16 mb-4 text-blue-500" />
                <h2 className="text-2xl font-semibold mb-2">Welcome to Your Chat App</h2>
                <p className="text-center mb-4">Select a user from the list to start a conversation.</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowUserList(true)}>
                  <Users className="h-5 w-5 mr-2" />
                  Show Users
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}