'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Users, Briefcase, TrendingUp, Calendar, BarChart2, PlusCircle, LayoutGrid, LayoutList } from "lucide-react"
import { useOrganization } from '@clerk/nextjs';
interface TeamMember {
  name: string
  avatar: string
}

interface Project {
  id: number
  name: string
  description: string
  teamLeader: TeamMember
  team: TeamMember[]
  stake: string
  progress: number
  worth: number
  budget: number
  startDate: string
  endDate: string | null
  completed?: boolean
}

// Mock data for projects
const initialProjects: Project[] = [
  {
    id: 1,
    name: "Project Alpha",
    description: "Developing a new AI-powered analytics platform for enterprise clients.",
    teamLeader: { name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    team: [
      { name: "Alice", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Bob", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Charlie", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    stake: "High",
    progress: 75,
    worth: 500000,
    budget: 400000,
    startDate: "2023-01-15",
    endDate: "2023-12-31",
  },
  {
    id: 2,
    name: "Project Beta",
    description: "Redesigning the user interface for our flagship mobile application.",
    teamLeader: { name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
    team: [
      { name: "David", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Eva", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    stake: "Medium",
    progress: 50,
    worth: 300000,
    budget: 250000,
    startDate: "2023-03-01",
    endDate: "2023-09-30",
  },
  {
    id: 3,
    name: "Project Gamma",
    description: "Implementing a new cybersecurity infrastructure for government agencies.",
    teamLeader: { name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    team: [
      { name: "Frank", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Grace", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Henry", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Ivy", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    stake: "Low",
    progress: 25,
    worth: 200000,
    budget: 180000,
    startDate: "2023-06-01",
    endDate: null,
  },
  {
    id: 4,
    name: "Project Delta",
    description: "Completed project: Launched a successful marketing campaign for a Fortune 500 company.",
    teamLeader: { name: "Sarah Lee", avatar: "/placeholder.svg?height=40&width=40" },
    team: [
      { name: "Tom", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Umar", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    stake: "High",
    progress: 100,
    worth: 750000,
    budget: 600000,
    startDate: "2022-09-01",
    endDate: "2023-03-31",
    completed: true,
  },
]

export default function CompanyProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'team' | 'progress'>>({
    name: '',
    description: '',
    teamLeader: { name: '', avatar: '/placeholder.svg?height=40&width=40' },
    stake: 'Medium',
    worth: 0,
    budget: 0,
    startDate: '',
    endDate: '',
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const { organization } = useOrganization();

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    // In a real application, you would navigate to the project details page here
    console.log("Navigating to project:", project.name)
  }

  const getStakeColor = (stake: string) => {
    switch (stake.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Ongoing'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleStakeChange = (value: string) => {
    setNewProject(prev => ({ ...prev, stake: value }))
  }

  const handleAddProject = () => {
    const project: Project = {
      ...newProject,
      id: projects.length + 1,
      team: [],
      progress: 0,
    }
    setProjects(prev => [...prev, project])
    setNewProject({
      name: '',
      description: '',
      teamLeader: { name: '', avatar: '/placeholder.svg?height=40&width=40' },
      stake: 'Medium',
      worth: 0,
      budget: 0,
      startDate: '',
      endDate: '',
    })
    setIsDialogOpen(false)
  }

  const ongoingProjects = projects.filter(project => !project.completed)
  const completedProjects = projects.filter(project => project.completed)

  const renderProjectCards = (projectList: Project[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectList.map((project) => (
        <Card 
          key={project.id} 
          className="flex flex-col transition-all duration-300 ease-in-out cursor-pointer border-2 border-transparent hover:border-black hover:shadow-lg"
          onClick={() => handleProjectClick(project)}
        >
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex justify-between items-center text-lg">
              <span>{project.name}</span>
              <Badge className={`${getStakeColor(project.stake)}`}>
                {project.stake} Stake
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pt-4">
            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
            <div className="flex items-center mb-3">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
            <div className="flex items-center mb-3">
              <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
              <span className="font-semibold mr-2 text-sm">Team Leader:</span>
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={project.teamLeader.avatar} alt={project.teamLeader.name} />
                <AvatarFallback>{project.teamLeader.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{project.teamLeader.name}</span>
            </div>
            <div className="flex items-center mb-3">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              <span className="font-semibold mr-2 text-sm">Team:</span>
              <div className="flex -space-x-2">
                {project.team.map((member, index) => (
                  <Avatar key={index} className="border-2 border-background h-6 w-6">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({project.team.length} members)
              </span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-semibold">Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="w-full h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center text-muted-foreground mb-1">
                  <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="font-semibold">Worth:</span>
                </div>
                <span className="text-base font-medium">ZAR {project.worth.toLocaleString()}</span>
              </div>
              <div>
                <div className="flex items-center text-muted-foreground mb-1">
                  <DollarSign className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="font-semibold">Budget:</span>
                </div>
                <span className="text-base font-medium">ZAR {project.budget.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderProjectTable = (projectList: Project[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Team Leader</TableHead>
          <TableHead>Stake</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Worth</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectList.map((project) => (
          <TableRow key={project.id} onClick={() => handleProjectClick(project)} className="cursor-pointer hover:bg-gray-100">
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.teamLeader.name}</TableCell>
            <TableCell>
              <Badge className={`${getStakeColor(project.stake)}`}>
                {project.stake}
              </Badge>
            </TableCell>
            <TableCell>{project.progress}%</TableCell>
            <TableCell>ZAR {project.worth.toLocaleString()}</TableCell>
            <TableCell>ZAR {project.budget.toLocaleString()}</TableCell>
            <TableCell>{formatDate(project.startDate)}</TableCell>
            <TableCell>{formatDate(project.endDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#003366] to-[#B87333] text-white">
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{organization?.name} Projects </h1>
              <p className="text-blue-100">Track and manage all ongoing projects</p>
            </div>
            <BarChart2 className="h-16 w-16 opacity-50" />
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">Ongoing Projects</h2>
          <div className="flex gap-4">
            <Button onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
              {viewMode === 'grid' ? <LayoutList className="mr-2 h-4 w-4" /> : <LayoutGrid className="mr-2 h-4 w-4" />}
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProject.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={newProject.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teamLeader" className="text-right">
                      Team Leader
                    </Label>
                    <Input
                      id="teamLeader"
                      name="teamLeader"
                      value={newProject.teamLeader.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, teamLeader: { ...prev.teamLeader, name: e.target.value } }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stake" className="text-right">
                      Stake
                    </Label>
                    <Select
                      onValueChange={handleStakeChange}
                      defaultValue={newProject.stake}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select stake" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="worth" className="text-right">
                      Worth
                    </Label>
                    <Input
                      id="worth"
                      name="worth"
                      type="number"
                      value={newProject.worth}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget" className="text-right">
                      Budget
                    </Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      value={newProject.budget}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newProject.endDate || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleAddProject}>Add Project</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-240px)]">
          {viewMode === 'grid' ? renderProjectCards(ongoingProjects) : renderProjectTable(ongoingProjects)}
        </ScrollArea>
        
        <h2 className="text-2xl mt-12 mb-6">Completed Projects</h2>
        <ScrollArea className="h-[calc(100vh-240px)]">
          {viewMode === 'grid' ? renderProjectCards(completedProjects) : renderProjectTable(completedProjects)}
        </ScrollArea>
      </div>
    </div>
  )
}