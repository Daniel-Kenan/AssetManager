'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { MenuIcon, UploadIcon, PlusIcon, DownloadIcon, FolderIcon, FileIcon, ChevronLeftIcon, Loader2Icon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from 'next/image'

interface FileItem {
  name: string
  type: 'file' | 'folder'
}

export default function FileExplorer() {
  const [allFiles, setAllFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [currentFiles, setCurrentFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [fileType, setFileType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFileLoading, setIsFileLoading] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    updateCurrentFiles()
  }, [currentPath, allFiles])

  const fetchFiles = () => {
    setIsLoading(true)
    fetch('http://localhost:5000/files')
      .then(response => response.json())
      .then(data => {
        setAllFiles(data)
        updateCurrentFiles()
      })
      .catch(error => console.error('Error fetching files:', error))
      .finally(() => setIsLoading(false))
  }

  const updateCurrentFiles = () => {
    const currentPathStr = currentPath.join('/')
    const filesInCurrentPath = allFiles.filter(item => {
      const itemPathParts = item.name.split('/')
      const itemPath = itemPathParts.slice(0, -1).join('/')
      return itemPath === currentPathStr
    })

    const uniqueFolders = new Set<string>()
    const currentItems: FileItem[] = []

    filesInCurrentPath.forEach(item => {
      const itemName = item.name.split('/').pop() || item.name
      if (item.type === 'folder') {
        if (!uniqueFolders.has(itemName)) {
          uniqueFolders.add(itemName)
          currentItems.push({ name: itemName, type: 'folder' })
        }
      } else {
        currentItems.push({ name: itemName, type: 'file' })
      }
    })

    // Add subfolders
    allFiles.forEach(item => {
      const itemPathParts = item.name.split('/')
      if (itemPathParts.length > currentPath.length + 1) {
        const subfolderName = itemPathParts[currentPath.length]
        if (!uniqueFolders.has(subfolderName)) {
          uniqueFolders.add(subfolderName)
          currentItems.push({ name: subfolderName, type: 'folder' })
        }
      }
    })

    setCurrentFiles(currentItems)
  }

  const handleFolderClick = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  const handleFileClick = (fileName: string) => {
    const filePath = [...currentPath, fileName].join('/')
    setSelectedFile(filePath)
    const fileExtension = fileName.split('.').pop()?.toLowerCase()
    setFileType(fileExtension || null)
    setIsFileLoading(true)

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension || '')) {
      // Image preview
      setFileContent(`http://localhost:5000/files/${filePath}`)
      setIsFileDialogOpen(true)
      setIsFileLoading(false)
    } else if (['txt', 'md', 'js', 'ts', 'html', 'css', 'json'].includes(fileExtension || '')) {
      // Text file preview
      fetch(`http://localhost:5000/files/${filePath}`)
        .then(response => response.text())
        .then(content => {
          setFileContent(content)
          setIsFileDialogOpen(true)
        })
        .catch(error => {
          console.error('Error fetching file content:', error)
          downloadFile(filePath)
        })
        .finally(() => setIsFileLoading(false))
    } else {
      // Download other file types
      downloadFile(filePath)
      setIsFileLoading(false)
    }
  }

  const downloadFile = (filePath: string) => {
    const link = document.createElement('a')
    link.href = `http://localhost:5000/files/${filePath}`
    link.download = filePath.split('/').pop() || ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b bg-gray-100 px-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={() => setCurrentPath([])}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                {currentPath.map((folder, index) => (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbLink href="#" onClick={() => handleBreadcrumbClick(index)}>
                      {folder}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {currentPath.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleBackClick} className="mb-4">
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : currentFiles.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">This folder is empty.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {currentFiles.map((item, index) => (
                <div 
                  key={index} 
                  className="group relative rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 cursor-pointer"
                  onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : handleFileClick(item.name)}
                >
                  <div className="flex h-20 w-full items-center justify-center">
                    {item.type === 'folder' ? (
                      <FolderIcon className="h-12 w-12 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                    ) : (
                      <FileIcon className="h-12 w-12 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFile}</DialogTitle>
            <DialogDescription>
              {isFileLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                  <span className="sr-only">Loading file content...</span>
                </div>
              ) : fileType && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType) ? (
                <div className="mt-2 w-full max-h-96 overflow-auto">
                  <Image src={fileContent || ''} alt={selectedFile || ''} width={800} height={600} className="object-contain" />
                </div>
              ) : (
                <pre className="mt-2 w-full max-h-96 overflow-auto bg-gray-100 p-4 rounded-md">
                  {fileContent}
                </pre>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button onClick={() => setIsFileDialogOpen(false)}>Close</Button>
            <Button onClick={() => selectedFile && downloadFile(selectedFile)}>Download</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}