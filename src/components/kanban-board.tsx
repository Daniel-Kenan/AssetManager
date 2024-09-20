'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle2, Plus, DollarSign, MoreVertical, Image as ImageIcon, Users, Phone, Mail, X, Edit, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Contact {
  name: string
  email: string
  phone: string
}

interface Deal {
  id: string
  company: string
  value: number
  probability: 'low' | 'medium' | 'high'
  image?: string
  description: string
  contacts: Contact[]
  assignedTeam: string[]
}

interface Stage {
  id: string
  title: string
  deals: Deal[]
}

const initialData: { stages: { [key: string]: Stage }, stageOrder: string[] } = {
  stages: {
    'lead': {
      id: 'lead',
      title: 'Lead',
      deals: [
        { 
          id: 'deal-1', 
          company: 'TechCorp', 
          value: 10000, 
          probability: 'medium', 
          description: 'Interested in our premium package.', 
          image: '/placeholder.svg?height=100&width=200',
          contacts: [{ name: 'John Doe', email: 'john@techcorp.com', phone: '123-456-7890' }],
          assignedTeam: ['Alice', 'Bob']
        },
        { 
          id: 'deal-2', 
          company: 'InnoSoft', 
          value: 5000, 
          probability: 'low', 
          description: 'Requested a demo next week.', 
          image: '/placeholder.svg?height=100&width=200',
          contacts: [{ name: 'Jane Smith', email: 'jane@innosoft.com', phone: '987-654-3210' }],
          assignedTeam: ['Charlie']
        },
      ],
    },
    'qualified': {
      id: 'qualified',
      title: 'Qualified',
      deals: [
        { 
          id: 'deal-3', 
          company: 'DataDrive', 
          value: 15000, 
          probability: 'high', 
          description: 'Very positive after the initial meeting.', 
          image: '/placeholder.svg?height=100&width=200',
          contacts: [{ name: 'Mike Johnson', email: 'mike@datadrive.com', phone: '456-789-0123' }],
          assignedTeam: ['David', 'Eve']
        },
      ],
    },
    'proposal': {
      id: 'proposal',
      title: 'Proposal',
      deals: [
        { 
          id: 'deal-4', 
          company: 'CloudNine', 
          value: 20000, 
          probability: 'medium', 
          description: 'Proposal sent, awaiting feedback.', 
          image: '/placeholder.svg?height=100&width=200',
          contacts: [{ name: 'Sarah Brown', email: 'sarah@cloudnine.com', phone: '789-012-3456' }],
          assignedTeam: ['Frank']
        },
      ],
    },
    'closed': {
      id: 'closed',
      title: 'Closed',
      deals: [],
    },
  },
  stageOrder: ['lead', 'qualified', 'proposal', 'closed'],
}

const ProbabilityIcon = ({ probability }: { probability: Deal['probability'] }) => {
  switch (probability) {
    case 'high':
      return <CheckCircle2 className="text-green-500" />
    case 'medium':
      return <AlertTriangle className="text-yellow-500" />
    case 'low':
      return <AlertCircle className="text-red-500" />
  }
}

export default function Component() {
  const [data, setData] = useState(initialData)
  const [newStageName, setNewStageName] = useState('')
  const [newDealCompany, setNewDealCompany] = useState('')
  const [newDealValue, setNewDealValue] = useState('')
  const [newDealProbability, setNewDealProbability] = useState<Deal['probability']>('medium')
  const [newDealImage, setNewDealImage] = useState('')
  const [newDealDescription, setNewDealDescription] = useState('')
  const [newDealContacts, setNewDealContacts] = useState<Contact[]>([])
  const [newDealAssignedTeam, setNewDealAssignedTeam] = useState<string[]>([])
  const [addingDealToStage, setAddingDealToStage] = useState<string | null>(null)
  const [deletingStage, setDeletingStage] = useState<string | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDeal, setEditedDeal] = useState<Deal | null>(null)

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'stage') {
      const newStageOrder = Array.from(data.stageOrder)
      newStageOrder.splice(source.index, 1)
      newStageOrder.splice(destination.index, 0, draggableId)

      setData({
        ...data,
        stageOrder: newStageOrder,
      })
      return
    }

    const start = data.stages[source.droppableId]
    const finish = data.stages[destination.droppableId]

    if (start === finish) {
      const newDeals = Array.from(start.deals)
      const [reorderedItem] = newDeals.splice(source.index, 1)
      newDeals.splice(destination.index, 0, reorderedItem)

      const newStage = {
        ...start,
        deals: newDeals,
      }

      setData({
        ...data,
        stages: {
          ...data.stages,
          [newStage.id]: newStage,
        },
      })
    } else {
      const startDeals = Array.from(start.deals)
      const [movedItem] = startDeals.splice(source.index, 1)
      const newStart = {
        ...start,
        deals: startDeals,
      }

      const finishDeals = Array.from(finish.deals)
      finishDeals.splice(destination.index, 0, movedItem)
      const newFinish = {
        ...finish,
        deals: finishDeals,
      }

      setData({
        ...data,
        stages: {
          ...data.stages,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      })
    }
  }

  const addNewStage = () => {
    if (newStageName.trim() !== '') {
      const newStageId = newStageName.toLowerCase().replace(/\s+/g, '-')
      setData({
        stages: {
          ...data.stages,
          [newStageId]: {
            id: newStageId,
            title: newStageName,
            deals: [],
          },
        },
        stageOrder: [...data.stageOrder, newStageId],
      })
      setNewStageName('')
    }
  }

  const deleteStage = (stageId: string) => {
    const newStages = { ...data.stages }
    delete newStages[stageId]
    const newStageOrder = data.stageOrder.filter(id => id !== stageId)
    setData({
      stages: newStages,
      stageOrder: newStageOrder,
    })
    setDeletingStage(null)
  }

  const addNewDeal = (stageId: string) => {
    if (newDealCompany.trim() !== '') {
      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        company: newDealCompany,
        value: parseFloat(newDealValue) || 0,
        probability: newDealProbability,
        image: newDealImage || '/placeholder.svg?height=100&width=200',
        description: newDealDescription,
        contacts: newDealContacts,
        assignedTeam: newDealAssignedTeam,
      }
      setData({
        ...data,
        stages: {
          ...data.stages,
          [stageId]: {
            ...data.stages[stageId],
            deals: [...data.stages[stageId].deals, newDeal],
          },
        },
      })
      resetNewDealForm()
    }
  }

  const resetNewDealForm = () => {
    setNewDealCompany('')
    setNewDealValue('')
    setNewDealProbability('medium')
    setNewDealImage('')
    setNewDealDescription('')
    setNewDealContacts([])
    setNewDealAssignedTeam([])
    setAddingDealToStage(null)
  }

  const addContact = () => {
    if (isEditing) {
      setEditedDeal(prev => ({
        ...prev!,
        contacts: [...prev!.contacts, { name: '', email: '', phone: '' }]
      }))
    } else {
      setNewDealContacts([...newDealContacts, { name: '', email: '', phone: '' }])
    }
  }

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    if (isEditing) {
      const updatedContacts = [...editedDeal!.contacts]
      updatedContacts[index] = { ...updatedContacts[index], [field]: value }
      setEditedDeal(prev => ({ ...prev!, contacts: updatedContacts }))
    } else {
      const updatedContacts = [...newDealContacts]
      updatedContacts[index][field] = value
      setNewDealContacts(updatedContacts)
    }
  }

  const removeContact = (index: number) => {
    if (isEditing) {
      setEditedDeal(prev => ({
        ...prev!,
        contacts: prev!.contacts.filter((_, i) => i !== index)
      }))
    } else {
      setNewDealContacts(newDealContacts.filter((_, i) => i !== index))
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedDeal({ ...selectedDeal! })
  }

  const handleSave = () => {
    setIsEditing(false)
    setSelectedDeal(editedDeal)
    // Update the deal in the data state
    const updatedStages = { ...data.stages }
    for (const stageId in updatedStages) {
      const dealIndex = updatedStages[stageId].deals.findIndex(deal => deal.id === editedDeal!.id)
      if (dealIndex !== -1) {
        updatedStages[stageId].deals[dealIndex] = editedDeal!
        break
      }
    }
    setData({ ...data, stages: updatedStages })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedDeal(null)
  }

  return (
    <div className="p-4">

      <div className="mb-4 flex space-x-2">
        <Input
          type="text"
          placeholder="New stage name"
          value={newStageName}
          onChange={(e) => setNewStageName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={addNewStage}>Add Stage</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-stages" direction="horizontal" type="stage">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="flex space-x-4 overflow-x-auto pb-4"
            >
              {data.stageOrder.map((stageId, index) => {
                const stage = data.stages[stageId]
                return (
                  <Draggable key={stage.id} draggableId={stage.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="w-64 flex-shrink-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h2 
                            className="font-semibold cursor-move" 
                            {...provided.dragHandleProps}
                          >
                            {stage.title}
                          </h2>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => setDeletingStage(stage.id)}>
                                Delete Stage
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <Droppable droppableId={stage.id} type="deal">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="bg-gray-100 p-2 rounded min-h-[500px]"
                            >
                              {stage.deals.map((deal, index) => (
                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                  {(provided) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="mb-2 bg-white cursor-pointer"
                                      onClick={() => {
                                        setSelectedDeal(deal)
                                        setIsDetailsPanelOpen(true)
                                        setIsEditing(false)
                                      }}
                                    >
                                      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm font-medium">
                                          {deal.company}
                                        </CardTitle>
                                        <ProbabilityIcon probability={deal.probability} />
                                      </CardHeader>
                                      <CardContent className="p-3 pt-0">
                                        {deal.image && (
                                          <img
                                            src={deal.image}
                                            alt={`${deal.company} deal`}
                                            className="w-full h-auto rounded mb-2"
                                          />
                                        )}
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                          {/* <DollarSign className="h-4 w-4" /> */}
                                          <span>{deal.value.toLocaleString('en-US', { style: 'currency', currency: 'ZAR' })}</span>
                                        </div>
                                        <Badge 
                                          variant={deal.probability === 'high' ? 'default' : deal.probability === 'medium' ? 'secondary' : 'destructive'}
                                          className="mt-2"
                                        >
                                          {deal.probability}
                                        </Badge>
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{deal.description}</p>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                                          <Users className="h-4 w-4" />
                                          <span>{deal.assignedTeam.join(', ')}</span>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                          {deal.contacts.map((contact, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-500">
                                              <Phone className="h-3 w-3" />
                                              <span>{contact.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {addingDealToStage === stage.id ? (
                                <div className="mt-2 space-y-2">
                                  <Input
                                    type="text"
                                    placeholder="Company name"
                                    value={newDealCompany}
                                    onChange={(e) => setNewDealCompany(e.target.value)}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Deal value"
                                    value={newDealValue}
                                    onChange={(e) => setNewDealValue(e.target.value)}
                                  />
                                  <Select
                                    value={newDealProbability}
                                    onValueChange={(value: Deal['probability']) => setNewDealProbability(value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select probability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div>
                                    <Label htmlFor="image-url" className="text-sm font-medium">
                                      Image URL (optional)
                                    </Label>
                                    <div className="flex mt-1">
                                      <Input
                                        id="image-url"
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        value={newDealImage}
                                        onChange={(e) => setNewDealImage(e.target.value)}
                                        className="flex-grow"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => setNewDealImage('/placeholder.svg?height=100&width=200')}
                                      >
                                        <ImageIcon className="h-4 w-4" />
                                        <span className="sr-only">Use placeholder image</span>
                                      </Button>
                                    </div>
                                  </div>
                                  <Textarea
                                    placeholder="Deal description"
                                    value={newDealDescription}
                                    onChange={(e) => setNewDealDescription(e.target.value)}
                                  />
                                  <div>
                                    <Label htmlFor="assigned-team" className="text-sm font-medium">
                                      Assigned Team
                                    </Label>
                                    <Input
                                      id="assigned-team"
                                      placeholder="Enter team members (comma-separated)"
                                      value={newDealAssignedTeam.join(', ')}
                                      onChange={(e) => setNewDealAssignedTeam(e.target.value.split(',').map(s => s.trim()))}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Contacts</Label>
                                    {newDealContacts.map((contact, index) => (
                                      <div key={index} className="space-y-2 mb-2">
                                        <Input
                                          placeholder="Name"
                                          value={contact.name}
                                          onChange={(e) => updateContact(index, 'name', e.target.value)}
                                        />
                                        <Input
                                          placeholder="Email"
                                          value={contact.email}
                                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                                        />
                                        <Input
                                          placeholder="Phone"
                                          value={contact.phone}
                                          onChange={(e) => updateContact(index, 'phone', e.target.value)}
                                        />
                                        <Button variant="outline" onClick={() => removeContact(index)}>Remove Contact</Button>
                                      </div>
                                    ))}
                                    <Button variant="outline" onClick={addContact} className="w-full mt-2">
                                      <Plus className="mr-2 h-4 w-4" /> Add Contact
                                    </Button>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button onClick={() => addNewDeal(stage.id)} className="flex-1">
                                      Add Deal
                                    </Button>
                                    <Button variant="outline" onClick={() => setAddingDealToStage(null)} className="flex-1">
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  className="w-full mt-2"
                                  onClick={() => setAddingDealToStage(stage.id)}
                                >
                                  <Plus className="mr-2 h-4 w-4" /> Add Deal
                                </Button>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog open={deletingStage !== null} onOpenChange={() => setDeletingStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this stage? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingStage(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteStage(deletingStage!)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <ScrollArea className="h-[calc(100vh-2rem)] pr-4">
            {selectedDeal && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle>{isEditing ? 'Edit Deal' : selectedDeal.company}</SheetTitle>
                  {!isEditing && (
                    <Button onClick={handleEdit} className="mt-2">
                      <Edit className="mr-2 h-4 w-4" /> Edit Deal
                    </Button>
                  )}
                </SheetHeader>
                <div className="space-y-6">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={editedDeal?.company}
                          onChange={(e) => setEditedDeal(prev => ({ ...prev!, company: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          type="number"
                          value={editedDeal?.value}
                          onChange={(e) => setEditedDeal(prev => ({ ...prev!, value: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="probability">Probability</Label>
                        <Select
                          value={editedDeal?.probability}
                          onValueChange={(value: Deal['probability']) => setEditedDeal(prev => ({ ...prev!, probability: value }))}
                        >
                          <SelectTrigger id="probability">
                            <SelectValue placeholder="Select probability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={editedDeal?.image}
                          onChange={(e) => setEditedDeal(prev => ({ ...prev!, image: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editedDeal?.description}
                          onChange={(e) => setEditedDeal(prev => ({ ...prev!, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="assigned-team">Assigned Team</Label>
                        <Input
                          id="assigned-team"
                          value={editedDeal?.assignedTeam.join(', ')}
                          onChange={(e) => setEditedDeal(prev => ({ ...prev!, assignedTeam: e.target.value.split(',').map(s => s.trim()) }))}
                        />
                      </div>
                      <div>
                        <Label>Contacts</Label>
                        {editedDeal?.contacts.map((contact, index) => (
                          <div key={index} className="space-y-2 mb-4">
                            <Input
                              placeholder="Name"
                              value={contact.name}
                              onChange={(e) => updateContact(index, 'name', e.target.value)}
                            />
                            <Input
                              placeholder="Email"
                              value={contact.email}
                              onChange={(e) => updateContact(index, 'email', e.target.value)}
                            />
                            <Input
                              placeholder="Phone"
                              value={contact.phone}
                              onChange={(e) => updateContact(index, 'phone', e.target.value)}
                            />
                            <Button variant="outline" onClick={() => removeContact(index)}>Remove Contact</Button>
                          </div>
                        ))}
                        <Button variant="outline" onClick={addContact} className="w-full mt-2">
                          <Plus className="mr-2 h-4 w-4" /> Add Contact
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} className="flex-1">
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {selectedDeal.image && (
                        <img
                          src={selectedDeal.image}
                          alt={`${selectedDeal.company} deal`}
                          className="w-full h-auto rounded"
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {/* <DollarSign className="h-5 w-5" /> */}
                          <span className="text-lg font-semibold">
                            {selectedDeal.value.toLocaleString('en-US', { style: 'currency', currency: 'ZAR' })}
                          </span>
                        </div>
                        <Badge 
                          variant={selectedDeal.probability === 'high' ? 'default' : selectedDeal.probability === 'medium' ? 'secondary' : 'destructive'}
                        >
                          {selectedDeal.probability} probability
                        </Badge>
                      </div>
                      <p className="text-gray-700">{selectedDeal.description}</p>
                      <div>
                        <h3 className="font-semibold mb-2">Contacts:</h3>
                        {selectedDeal.contacts.map((contact, index) => (
                          <div key={index} className="mb-2">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-4 w-4 mr-1" /> {contact.email}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-4 w-4 mr-1" /> {contact.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Assigned Team:</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedDeal.assignedTeam.map((member, index) => (
                            <Badge key={index} variant="outline">{member}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}