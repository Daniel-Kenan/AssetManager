'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle2, Plus, Image as ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Task {
  id: string
  content: string
  priority: 'low' | 'medium' | 'high'
  image?: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialData: { [key: string]: Column } = {
  todo: {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 'task-1', content: 'Create login page', priority: 'high', image: '/placeholder.svg?height=100&width=200' },
      { id: 'task-2', content: 'Design database schema', priority: 'medium' },
    ],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [
      { id: 'task-3', content: 'Implement user authentication', priority: 'high' },
    ],
  },
  done: {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 'task-4', content: 'Project setup', priority: 'low', image: '/placeholder.svg?height=100&width=200' },
    ],
  },
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

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData)
  const [newSectionName, setNewSectionName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')
  const [newTaskImage, setNewTaskImage] = useState('')
  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(null)

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = columns[source.droppableId]
    const finish = columns[destination.droppableId]

    if (start === finish) {
      const newTasks = Array.from(start.tasks)
      const [reorderedItem] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, reorderedItem)

      const newColumn = {
        ...start,
        tasks: newTasks,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
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

      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      })
    }
  }

  const addNewSection = () => {
    if (newSectionName.trim() !== '') {
      const newSectionId = newSectionName.toLowerCase().replace(/\s+/g, '-')
      setColumns({
        ...columns,
        [newSectionId]: {
          id: newSectionId,
          title: newSectionName,
          tasks: [],
        },
      })
      setNewSectionName('')
    }
  }

  const addNewTask = (columnId: string) => {
    if (newTaskName.trim() !== '') {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        content: newTaskName,
        priority: newTaskPriority,
        image: newTaskImage.trim() !== '' ? newTaskImage : undefined,
      }
      setColumns({
        ...columns,
        [columnId]: {
          ...columns[columnId],
          tasks: [...columns[columnId].tasks, newTask],
        },
      })
      setNewTaskName('')
      setNewTaskPriority('medium')
      setNewTaskImage('')
      setAddingTaskToColumn(null)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
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
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="w-64 flex-shrink-0">
              <h2 className="font-semibold mb-2">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-2 rounded min-h-[500px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 bg-white"
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
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}