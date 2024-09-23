"use client"

import React, { useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle2, Plus, MoreVertical, Users, FileText, Paperclip, Edit, Save, Settings, Trash2, BarChart2, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  status: 'todo' | 'in-progress' | 'done'
  report?: string
  attachments?: string[]
  dueDate?: string
}

interface Stage {
  id: string
  title: string
  tasks: Task[]
}

interface TeamMember {
  id: string
  name: string
  role: string
}

const initialData: { stages: { [key: string]: Stage }, stageOrder: string[] } = {
  stages: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { 
          id: 'task-1', 
          title: 'Design UI', 
          description: 'Create wireframes for the new feature', 
          assignee: 'Alice',
          status: 'todo',
          dueDate: '2023-09-30'
        },
        { 
          id: 'task-2', 
          title: 'Write documentation', 
          description: 'Document the API endpoints', 
          assignee: 'Bob',
          status: 'todo',
          dueDate: '2023-10-15'
        },
      ],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        { 
          id: 'task-3', 
          title: 'Implement API', 
          description: 'Develop backend API endpoints', 
          assignee: 'Charlie',
          status: 'in-progress',
          dueDate: '2023-10-31'
        },
      ],
    },
    'done': {
      id: 'done',
      title: 'Done',
      tasks: [
        { 
          id: 'task-4', 
          title: 'Set up CI/CD', 
          description: 'Configure Jenkins for continuous integration', 
          assignee: 'David',
          status: 'done',
          dueDate: '2023-09-15'
        },
      ],
    },
  },
  stageOrder: ['todo', 'in-progress', 'done'],
}

const initialTeamMembers: TeamMember[] = [
  { id: 'member-1', name: 'Alice', role: 'UI/UX Designer' },
  { id: 'member-2', name: 'Bob', role: 'Technical Writer' },
  { id: 'member-3', name: 'Charlie', role: 'Backend Developer' },
  { id: 'member-4', name: 'David', role: 'DevOps Engineer' },
]

export default function Component() {
  const [data, setData] = useState(initialData)
  const [newStageName, setNewStageName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [addingTaskToStage, setAddingTaskToStage] = useState<string | null>(null)
  const [deletingStage, setDeletingStage] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [teamMembers] = useState(initialTeamMembers)
  const [isTeamMembersOpen, setIsTeamMembersOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false)
  const [projectDescription, setProjectDescription] = useState("This project management application helps teams organize tasks and collaborate effectively.")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const newTasks = Array.from(start.tasks)
      const [reorderedItem] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, reorderedItem)

      const newStage = {
        ...start,
        tasks: newTasks,
      }

      setData({
        ...data,
        stages: {
          ...data.stages,
          [newStage.id]: newStage,
        },
      })
    } else {
      const startTasks = Array.from(start.tasks)
      const [movedItem] = startTasks.splice(source.index, 1)
      const newStart = {
        ...start,
        tasks: startTasks,
      }

      const finishTasks = Array.from(finish.tasks)
      finishTasks.splice(destination.index, 0, { ...movedItem, status: finish.id as Task['status'] })
      const newFinish = {
        ...finish,
        tasks: finishTasks,
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
            tasks: [],
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

  const addNewTask = (stageId: string) => {
    if (newTaskTitle.trim() !== '') {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        description: newTaskDescription,
        assignee: newTaskAssignee,
        status: stageId as Task['status'],
        dueDate: newTaskDueDate,
      }
      setData({
        ...data,
        stages: {
          ...data.stages,
          [stageId]: {
            ...data.stages[stageId],
            tasks: [...data.stages[stageId].tasks, newTask],
          },
        },
      })
      resetNewTaskForm()
    }
  }

  const resetNewTaskForm = () => {
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskAssignee('')
    setNewTaskDueDate('')
    setAddingTaskToStage(null)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedTask({ ...selectedTask! })
  }

  const handleSave = () => {
    setIsEditing(false)
    setSelectedTask(editedTask)
    const updatedStages = { ...data.stages }
    for (const stageId in updatedStages) {
      const taskIndex = updatedStages[stageId].tasks.findIndex(task => task.id === editedTask!.id)
      if (taskIndex !== -1) {
        updatedStages[stageId].tasks[taskIndex] = editedTask!
        break
      }
    }
    setData({ ...data, stages: updatedStages })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTask(null)
  }

  const deleteProject = () => {
    setIsDeleteProjectDialogOpen(false)
    setData(initialData)
    setProjectDescription("This project management application helps teams organize tasks and collaborate effectively.")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newAttachments = Array.from(files).map(file => URL.createObjectURL(file))
      if (isEditing) {
        setEditedTask(prev => ({
          ...prev!,
          attachments: [...(prev?.attachments || []), ...newAttachments]
        }))
      } else {
        setSelectedTask(prev => ({
          ...prev!,
          attachments: [...(prev?.attachments || []), ...newAttachments]
        }))
      }
    }
  }

  const StatusIcon = ({ status }: { status: Task['status'] }) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="text-green-500" />
      case 'in-progress':
        return <AlertTriangle className="text-yellow-500" />
      case 'todo':
        return <AlertCircle className="text-red-500" />
    }
  }

  const allTasks = Object.values(data.stages).flatMap(stage => stage.tasks)

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Project Management</h1>
          <p className="text-gray-600 mt-1">{projectDescription}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsTeamMembersOpen(true)}>
            <Users className="mr-2 h-4 w-4" /> Team Members
          </Button>
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
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
                                style={{paddingLeft:"10px"}}
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
                            <Droppable droppableId={stage.id} type="task">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="p-2 rounded min-h-[500px]"
                                >
                                  {stage.tasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                      {(provided) => (
                                        <Card
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="mb-2 bg-white cursor-pointer"
                                          onClick={() => {
                                            setSelectedTask(task)
                                            setIsDetailsPanelOpen(true)
                                            setIsEditing(false)
                                          }}
                                        >
                                          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
                                            <CardTitle className="text-sm font-medium">
                                              {task.title}
                                            </CardTitle>
                                            <StatusIcon status={task.status} />
                                          </CardHeader>
                                          <CardContent className="p-3 pt-0">
                                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{task.description}</p>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                                              <Users className="h-4 w-4" />
                                              <span>{task.assignee}</span>
                                            </div>
                                            {task.dueDate && (
                                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Due: {task.dueDate}</span>
                                              </div>
                                            )}
                                            {task.attachments && task.attachments.length > 0 && (
                                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                                                <Paperclip className="h-4 w-4" />
                                                <span>{task.attachments.length} attachment(s)</span>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                  {addingTaskToStage === stage.id ? (
                                    <div className="mt-2 space-y-2">
                                      <Input
                                        type="text"
                                        placeholder="Task title"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                      />
                                      <Textarea
                                        placeholder="Task description"
                                        value={newTaskDescription}
                                        onChange={(e) => setNewTaskDescription(e.target.value)}
                                      />
                                      <Select
                                        value={newTaskAssignee}
                                        onValueChange={setNewTaskAssignee}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {teamMembers.map(member => (
                                            <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <Input
                                        type="date"
                                        value={newTaskDueDate}
                                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                                      />
                                      <div className="flex space-x-2">
                                        <Button onClick={() => addNewTask(stage.id)} className="flex-1">
                                          Add Task
                                        </Button>
                                        <Button variant="outline" onClick={() => setAddingTaskToStage(null)} className="flex-1">
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      className="w-full mt-2"
                                      onClick={() => setAddingTaskToStage(stage.id)}
                                    >
                                      <Plus className="mr-2 h-4 w-4" /> Add Task
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
        </TabsContent>
        <TabsContent value="checklist">
          <div className="space-y-4">
            {allTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <Checkbox id={task.id} />
                <div>
                  <Label htmlFor={task.id} className="font-medium">
                    {task.title}
                  </Label>
                  <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="gantt">
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <BarChart2 className="h-16 w-16 text-gray-400" />
            <p className="ml-4 text-lg text-gray-500">Gantt Chart Placeholder</p>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={isTeamMembersOpen} onOpenChange={setIsTeamMembersOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Team Members</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Project Settings</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="project-description">Project Description</Label>
              <Textarea
                id="project-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
              />
            </div>
            <Button variant="destructive" onClick={() => setIsDeleteProjectDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Project
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteProjectDialogOpen} onOpenChange={setIsDeleteProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteProjectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteProject}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <ScrollArea className="h-[calc(100vh-2rem)] pr-4">
            {selectedTask && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle>{isEditing ? 'Edit Task' : selectedTask.title}</SheetTitle>
                  {!isEditing && (
                    <Button onClick={handleEdit} className="mt-2">
                      <Edit className="mr-2 h-4 w-4" /> Edit Task
                    </Button>
                  )}
                </SheetHeader>
                <div className="space-y-6">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editedTask?.title}
                          onChange={(e) => setEditedTask(prev => ({ ...prev!, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editedTask?.description}
                          onChange={(e) => setEditedTask(prev => ({ ...prev!, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select
                          value={editedTask?.assignee}
                          onValueChange={(value) => setEditedTask(prev => ({ ...prev!, assignee: value }))}
                        >
                          <SelectTrigger id="assignee">
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map(member => (
                              <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={editedTask?.status}
                          onValueChange={(value: Task['status']) => setEditedTask(prev => ({ ...prev!, status: value }))}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={editedTask?.dueDate}
                          onChange={(e) => setEditedTask(prev => ({ ...prev!, dueDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="report">Report</Label>
                        <Textarea
                          id="report"
                          value={editedTask?.report || ''}
                          onChange={(e) => setEditedTask(prev => ({ ...prev!, report: e.target.value }))}
                          placeholder="Write your report here..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="attachments">Attachments</Label>
                        <Input
                          id="attachments"
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="mr-2 h-4 w-4" /> Attach Files
                        </Button>
                        {editedTask?.attachments && editedTask.attachments.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {editedTask.attachments.map((attachment, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                Attachment {index + 1}
                              </li>
                            ))}
                          </ul>
                        )}
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
                      <div>
                        <h3 className="font-semibold mb-2">Description:</h3>
                        <p className="text-gray-700">{selectedTask.description}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Assignee:</h3>
                        <p className="text-gray-700">{selectedTask.assignee}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Status:</h3>
                        <Badge 
                          variant={selectedTask.status === 'done' ? 'default' : selectedTask.status === 'in-progress' ? 'secondary' : 'destructive'}
                        >
                          {selectedTask.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Due Date:</h3>
                        <p className="text-gray-700">{selectedTask.dueDate}</p>
                      </div>
                      {selectedTask.report && (
                        <div>
                          <h3 className="font-semibold mb-2">Report:</h3>
                          <p className="text-gray-700">{selectedTask.report}</p>
                        </div>
                      )}
                      {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Attachments:</h3>
                          <ul className="space-y-1">
                            {selectedTask.attachments.map((attachment, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                Attachment {index + 1}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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