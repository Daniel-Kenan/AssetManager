'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle2, Plus, Image as ImageIcon, Calendar, MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from 'date-fns'

interface Task {
  id: string
  content: string
  priority: 'low' | 'medium' | 'high'
  image?: string
  startDate: Date
  dueDate: Date
  description: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialData: { columns: { [key: string]: Column }, columnOrder: string[] } = {
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 'task-1', content: 'Create login page', priority: 'high', image: '/placeholder.svg?height=100&width=200', startDate: new Date(2023, 5, 1), dueDate: new Date(2023, 5, 7), description: 'Implement a secure login page with email and password fields.' },
        { id: 'task-2', content: 'Design database schema', priority: 'medium', startDate: new Date(2023, 5, 3), dueDate: new Date(2023, 5, 10), description: 'Create an efficient and scalable database schema for the application.' },
      ],
    },
    'inProgress': {
      id: 'inProgress',
      title: 'In Progress',
      tasks: [
        { id: 'task-3', content: 'Implement user authentication', priority: 'high', startDate: new Date(2023, 5, 5), dueDate: new Date(2023, 5, 12), description: 'Set up user authentication system using JWT tokens.' },
      ],
    },
    'done': {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: 'task-4', content: 'Project setup', priority: 'low', image: '/placeholder.svg?height=100&width=200', startDate: new Date(2023, 4, 28), dueDate: new Date(2023, 5, 2), description: 'Initialize the project repository and set up the development environment.' },
      ],
    },
  },
  columnOrder: ['todo', 'inProgress', 'done'],
}

const PriorityIcon = ({ priority }: { priority: Task['priority'] }) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="text-red-500" />
    case 'medium':
      return <AlertTriangle className="text-yellow-500" />
    case 'low':
      return <CheckCircle2 className="text-green-500" />
  }
}

export default function MovableKanbanBoardWithConfirmDelete() {
  const [data, setData] = useState(initialData)
  const [newSectionName, setNewSectionName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')
  const [newTaskImage, setNewTaskImage] = useState('')
  const [newTaskStartDate, setNewTaskStartDate] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(null)
  const [deletingSection, setDeletingSection] = useState<string | null>(null)

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

    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      setData({
        ...data,
        columnOrder: newColumnOrder,
      })
      return
    }

    const start = data.columns[source.droppableId]
    const finish = data.columns[destination.droppableId]

    if (start === finish) {
      const newTasks = Array.from(start.tasks)
      const [reorderedItem] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, reorderedItem)

      const newColumn = {
        ...start,
        tasks: newTasks,
      }

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
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
      finishTasks.splice(destination.index, 0, movedItem)
      const newFinish = {
        ...finish,
        tasks: finishTasks,
      }

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      })
    }
  }

  const addNewSection = () => {
    if (newSectionName.trim() !== '') {
      const newSectionId = newSectionName.toLowerCase().replace(/\s+/g, '-')
      setData({
        columns: {
          ...data.columns,
          [newSectionId]: {
            id: newSectionId,
            title: newSectionName,
            tasks: [],
          },
        },
        columnOrder: [...data.columnOrder, newSectionId],
      })
      setNewSectionName('')
    }
  }

  const deleteSection = (columnId: string) => {
    const newColumns = { ...data.columns }
    delete newColumns[columnId]
    const newColumnOrder = data.columnOrder.filter(id => id !== columnId)
    setData({
      columns: newColumns,
      columnOrder: newColumnOrder,
    })
    setDeletingSection(null)
  }

  const addNewTask = (columnId: string) => {
    if (newTaskName.trim() !== '') {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        content: newTaskName,
        priority: newTaskPriority,
        image: newTaskImage.trim() !== '' ? newTaskImage : undefined,
        startDate: new Date(newTaskStartDate),
        dueDate: new Date(newTaskDueDate),
        description: newTaskDescription,
      }
      setData({
        ...data,
        columns: {
          ...data.columns,
          [columnId]: {
            ...data.columns[columnId],
            tasks: [...data.columns[columnId].tasks, newTask],
          },
        },
      })
      setNewTaskName('')
      setNewTaskPriority('medium')
      setNewTaskImage('')
      setNewTaskStartDate('')
      setNewTaskDueDate('')
      setNewTaskDescription('')
      setAddingTaskToColumn(null)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Movable Kanban Board with Confirm Delete</h1>
      <div className="mb-4 flex space-x-2">
        <Input
          type="text"
          placeholder="New section name"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={addNewSection}>Add Section</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="flex space-x-4 overflow-x-auto pb-4"
            >
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId]
                return (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
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
                            {column.title}
                          </h2>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => setDeletingSection(column.id)}>
                                Delete Section
                              </DropdownMenuItem>
                              {/* Add more options here as needed */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <Droppable droppableId={column.id} type="task">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="bg-gray-100 p-2 rounded min-h-[500px]"
                            >
                              {column.tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided) => (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Card
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="mb-2 bg-white cursor-pointer"
                                        >
                                          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
                                            <CardTitle className="text-sm font-medium">
                                              {task.content}
                                            </CardTitle>
                                            <PriorityIcon priority={task.priority} />
                                          </CardHeader>
                                          <CardContent className="p-3 pt-0">
                                            {task.image && (
                                              <img
                                                src={task.image}
                                                alt="Task image"
                                                className="w-full h-auto rounded mb-2"
                                              />
                                            )}
                                            <Badge 
                                              variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                                              className="mt-2"
                                            >
                                              {task.priority}
                                            </Badge>
                                          </CardContent>
                                        </Card>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>{task.content}</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                          <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span>Start: {format(task.startDate, 'MMM d, yyyy')}</span>
                                          </div>
                                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Due: {format(task.dueDate, 'MMM d, yyyy')}</span>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {addingTaskToColumn === column.id ? (
                                <div className="mt-2 space-y-2">
                                  <Input
                                    type="text"
                                    placeholder="New task name"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                  />
                                  <Select
                                    value={newTaskPriority}
                                    onValueChange={(value: Task['priority']) => setNewTaskPriority(value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
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
                                        value={newTaskImage}
                                        onChange={(e) => setNewTaskImage(e.target.value)}
                                        className="flex-grow"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => setNewTaskImage('/placeholder.svg?height=100&width=200')}
                                      >
                                        <ImageIcon className="h-4 w-4" />
                                        <span className="sr-only">Use placeholder image</span>
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="start-date" className="text-sm font-medium">
                                      Start Date
                                    </Label>
                                    <Input
                                      id="start-date"
                                      type="date"
                                      value={newTaskStartDate}
                                      onChange={(e) => setNewTaskStartDate(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="due-date" className="text-sm font-medium">
                                      Due Date
                                    </Label>
                                    <Input
                                      id="due-date"
                                      type="date"
                                      value={newTaskDueDate}
                                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="description" className="text-sm font-medium">
                                      Description
                                    </Label>
                                    <Input
                                      id="description"
                                      type="text"
                                      placeholder="Task description"
                                      value={newTaskDescription}
                                      onChange={(e) => setNewTaskDescription(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button onClick={() => addNewTask(column.id)} className="flex-1">
                                      Add
                                    </Button>
                                    <Button variant="outline" onClick={() => setAddingTaskToColumn(null)} className="flex-1">
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  className="w-full mt-2"
                                  onClick={() => setAddingTaskToColumn(column.id)}
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
      <Dialog open={deletingSection !== null} onOpenChange={() => setDeletingSection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this section? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSection(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteSection(deletingSection!)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}