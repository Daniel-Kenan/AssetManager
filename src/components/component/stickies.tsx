"use client"

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, ArchiveIcon, TrashIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState<NewNote>({
    title: "",
    content: "",
    color: "bg-yellow-300",
  })

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/notes")
        const data = await response.json()
        setNotes(data)
      } catch (error) {
        console.error("Failed to fetch notes", error)
      }
    }

    fetchNotes()
  }, [])

  const createNote = async () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        })

        const savedNote = await response.json()

        setNotes([
          ...notes,
          {
            id: savedNote.id,
            ...newNote,
          },
        ])

        setNewNote({
          title: "",
          content: "",
          color: "bg-yellow-300",
        })
      } catch (error) {
        console.error("Failed to save note", error)
      }
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })
      setNotes(notes.filter((note) => note.id !== id))
    } catch (error) {
      console.error("Failed to delete note", error)
    }
  }

  const archiveNote = async (id: string) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: "PUT",
      })
      setNotes(notes.map((note) => (note.id === id ? { ...note, color: "bg-gray-300" } : note)))
    } catch (error) {
      console.error("Failed to archive note", error)
    }
  }

  const changeColor = async (id: string, color: string) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color }),
      })
      setNotes(notes.map((note) => (note.id === id ? { ...note, color } : note)))
    } catch (error) {
      console.error("Failed to change note color", error)
    }
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
          &quotBy failing to prepare, you are preparing to fail.&quot
            <span className="font-normal"> — Benjamin Franklin</span>
          </h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Sticky
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Sticky Note</AlertDialogTitle>
                <AlertDialogDescription>Create a new sticky note here. Fill in the details below.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Color</Label>
                  <RadioGroup
                    defaultValue={newNote.color}
                    onValueChange={(value) => setNewNote({ ...newNote, color: value })}
                    className="flex col-span-3 space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bg-yellow-300" id="yellow" className="bg-yellow-300" />
                      <Label htmlFor="yellow">Yellow</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bg-green-300" id="green" className="bg-green-300" />
                      <Label htmlFor="green">Green</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bg-blue-300" id="blue" className="bg-blue-300" />
                      <Label htmlFor="blue">Blue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bg-red-300" id="red" className="bg-red-300" />
                      <Label htmlFor="red">Red</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={createNote}>Create</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
      </main>
    </div>
  )
}