"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, ArchiveIcon, TrashIcon } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  color: string
}

interface NewNote {
  title: string
  content: string
  color: string
}

export function Stickies() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Grocery List",
      content: "Milk, eggs, bread, apples",
      color: "bg-yellow-300",
    },
    {
      id: "2",
      title: "Meeting Notes",
      content: "Discuss new product roadmap",
      color: "bg-green-300",
    },
    {
      id: "3",
      title: "Reminder",
      content: "Pick up dry cleaning",
      color: "bg-blue-300",
    },
  ])
  const [newNote, setNewNote] = useState<NewNote>({
    title: "",
    content: "",
    color: "bg-yellow-300",
  })

  const createNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      setNotes([
        ...notes,
        {
          id: String(notes.length + 1),
          ...newNote,
        },
      ])
      setNewNote({
        title: "",
        content: "",
        color: "bg-yellow-300",
      })
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const archiveNote = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, color: "bg-gray-300" } : note)))
  }

  const changeColor = (id: string, color: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, color } : note)))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const newNotes = Array.from(notes)
    const [reorderedItem] = newNotes.splice(result.source.index, 1)
    newNotes.splice(result.destination.index, 0, reorderedItem)

    setNotes(newNotes)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-1xl font-bold">
          "By failing to prepare, you are preparing to fail."
            <span className="font-normal"> — Benjamin Franklin</span>
          </h2>
          <Button onClick={createNote}>
            <PlusIcon className="w-5 h-5 mr-2" />
            New Note
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 overflow-y-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="notes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {notes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 rounded-md shadow-md ${note.color} transform rotate-[2deg] hover:rotate-0 transition-transform duration-300 w-64 h-64 flex flex-col`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-bold truncate">{note.title}</h2>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => archiveNote(note.id)}>
                              <ArchiveIcon className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                              <TrashIcon className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 flex-grow overflow-y-auto">{note.content}</p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="ghost" size="icon" onClick={() => changeColor(note.id, "bg-yellow-300")}>
                            <div className="w-5 h-5 bg-yellow-300 rounded-full" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => changeColor(note.id, "bg-green-300")}>
                            <div className="w-5 h-5 bg-green-300 rounded-full" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => changeColor(note.id, "bg-blue-300")}>
                            <div className="w-5 h-5 bg-blue-300 rounded-full" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => changeColor(note.id, "bg-red-300")}>
                            <div className="w-5 h-5 bg-red-300 rounded-full" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="p-4 rounded-md shadow-md bg-white transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300 mt-6 w-64 h-64 flex flex-col">
          <div className="mb-2">
            <Input
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
          </div>
          <div className="mb-4 flex-grow">
            <Textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="h-full resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setNewNote({ ...newNote, color: "bg-yellow-300" })}>
              <div className="w-5 h-5 bg-yellow-300 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setNewNote({ ...newNote, color: "bg-green-300" })}>
              <div className="w-5 h-5 bg-green-300 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setNewNote({ ...newNote, color: "bg-blue-300" })}>
              <div className="w-5 h-5 bg-blue-300 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setNewNote({ ...newNote, color: "bg-red-300" })}>
              <div className="w-5 h-5 bg-red-300 rounded-full" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}