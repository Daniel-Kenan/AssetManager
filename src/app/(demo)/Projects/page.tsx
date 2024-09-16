import React from 'react'
import { BarChart, Search, Filter, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for projects
const projects = [
  { id: 1, name: 'Website Redesign', status: 'In Progress', completion: 65, dueDate: '2023-12-31' },
  { id: 2, name: 'Mobile App Development', status: 'Planning', completion: 20, dueDate: '2024-03-15' },
  { id: 3, name: 'Database Migration', status: 'Completed', completion: 100, dueDate: '2023-11-30' },
  { id: 4, name: 'AI Integration', status: 'In Progress', completion: 40, dueDate: '2024-02-28' },
  { id: 5, name: 'Security Audit', status: 'Not Started', completion: 0, dueDate: '2024-01-31' },
]

export default function ProjectOverview() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Project Overview</h1>
          <nav>
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Projects</Button>
            <Button variant="ghost">Teams</Button>
            <Button variant="ghost">Reports</Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'In Progress').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'Completed').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(projects.reduce((acc, p) => acc + p.completion, 0) / projects.length)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 mr-4">
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="w-full"
                  startDecorator={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-2">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Projects</DropdownMenuItem>
                  <DropdownMenuItem>In Progress</DropdownMenuItem>
                  <DropdownMenuItem>Completed</DropdownMenuItem>
                  <DropdownMenuItem>Not Started</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="ml-2">
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li key={project.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {project.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {project.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Completion: {project.completion}%
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Due on {new Date(project.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}