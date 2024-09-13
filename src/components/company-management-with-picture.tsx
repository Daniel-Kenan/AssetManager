'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Trash2, Building2, User, Mail, Phone, Image as ImageIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Contact = {
  id: number
  name: string
  email: string
  phone: string
  avatarUrl: string
}

type Company = {
  id: number
  name: string
  logoUrl: string
  contacts: Contact[]
}

export default function CompanyManagementWithPicture() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: "Acme Corp",
      logoUrl: "https://api.dicebear.com/6.x/initials/svg?seed=AC&backgroundColor=00897b&width=200&height=200",
      contacts: [
        { id: 1, name: "John Doe", email: "john@acme.com", phone: "123-456-7890", avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=John" },
        { id: 2, name: "Jane Smith", email: "jane@acme.com", phone: "098-765-4321", avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Jane" },
      ]
    },
    {
      id: 2,
      name: "TechCo",
      logoUrl: "https://api.dicebear.com/6.x/initials/svg?seed=TC&backgroundColor=1e88e5&width=200&height=200",
      contacts: [
        { id: 3, name: "Bob Johnson", email: "bob@techco.com", phone: "555-123-4567", avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Bob" },
      ]
    }
  ])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'avatarUrl'>>({ name: '', email: '', phone: '' })

  const addCompany = () => {
    if (newCompanyName.trim() !== '') {
      const newCompany: Company = {
        id: Date.now(),
        name: newCompanyName.trim(),
        logoUrl: `https://api.dicebear.com/6.x/initials/svg?seed=${newCompanyName.trim()}&backgroundColor=${Math.floor(Math.random()*16777215).toString(16)}&width=200&height=200`,
        contacts: []
      }
      setCompanies([...companies, newCompany])
      setNewCompanyName('')
    }
  }

  const deleteCompany = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id))
    if (selectedCompany?.id === id) {
      setSelectedCompany(null)
    }
  }

  const addContact = () => {
    if (selectedCompany && newContact.name.trim() !== '') {
      const updatedCompany = {
        ...selectedCompany,
        contacts: [...selectedCompany.contacts, {
          ...newContact,
          id: Date.now(),
          avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=${newContact.name.trim()}`
        }]
      }
      setCompanies(companies.map(company => 
        company.id === selectedCompany.id ? updatedCompany : company
      ))
      setSelectedCompany(updatedCompany)
      setNewContact({ name: '', email: '', phone: '' })
    }
  }

  const deleteContact = (contactId: number) => {
    if (selectedCompany) {
      const updatedContacts = selectedCompany.contacts.filter(contact => contact.id !== contactId)
      const updatedCompany = { ...selectedCompany, contacts: updatedContacts }
      setCompanies(companies.map(company => 
        company.id === selectedCompany.id ? updatedCompany : company
      ))
      setSelectedCompany(updatedCompany)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Company Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <Select onValueChange={(value) => setSelectedCompany(companies.find(c => c.id.toString() === value) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={company.logoUrl} alt={company.name} />
                          <AvatarFallback>{company.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {company.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="New company name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
              <Button onClick={addCompany}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCompany ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <div className="w-20 h-20 mr-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img src={selectedCompany.logoUrl} alt={selectedCompany.name} className="w-full h-full object-cover" />
              </div>
              <div>
                {selectedCompany.name}
                <p className="text-sm text-gray-500 mt-1">
                  {selectedCompany.contacts.length} contact{selectedCompany.contacts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteCompany(selectedCompany.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Company
            </Button>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-4">Contacts</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {selectedCompany.contacts.map(contact => (
                  <Card key={contact.id}>
                    <CardContent className="flex items-start space-x-4 pt-6">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                        <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" /> {contact.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" /> {contact.phone}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            <Card>
              <CardHeader>
                <CardTitle>Add New Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="Contact email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Input
                      type="tel"
                      placeholder="Contact phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    />
                  </div>
                  <Button onClick={addContact} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[400px]">
            <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600">Select a company to view details</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}