'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { FolderIcon, FileIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react'

interface FileItem {
  name: string
  type: 'file' | 'folder'
}

interface TreeNode {
  name: string
  type: 'file' | 'folder'
  children?: TreeNode[]
}

export default function FileExplorer() {
  const [fileTree, setFileTree] = useState<TreeNode[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [currentNodes, setCurrentNodes] = useState<TreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    navigateToCurrentPath()
  }, [currentPath, fileTree])

  const fetchFiles = () => {
    setIsLoading(true)
    fetch('https://media.nextgensell.com/files')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data) // Debugging line
        const tree = buildFileTree(data)
        setFileTree(tree)
        setCurrentNodes(tree) // Initially show the root
      })
      .catch(error => console.error('Error fetching files:', error))
      .finally(() => setIsLoading(false))
  }

  const buildFileTree = (entries: FileItem[]): TreeNode[] => {
    const root: TreeNode[] = []

    entries.forEach((item) => {
      console.log('Processing item:', item) // Debugging line
      const pathParts = item.name.split('/').filter(Boolean)
      addToTree(root, pathParts, item)
    })

    console.log('Built file tree:', root) // Debugging line
    return root
  }

  const addToTree = (tree: TreeNode[], pathParts: string[], item: FileItem) => {
    const [first, ...rest] = pathParts

    let node = tree.find(n => n.name === first)

    if (!node) {
      node = {
        name: first,
        type: rest.length === 0 ? item.type : 'folder',
        children: rest.length > 0 ? [] : [] // Ensure children property exists
      }
      tree.push(node)
    }

    if (rest.length > 0) {
      if (!node.children) {
        node.children = []
      }
      addToTree(node.children, rest, item)
    }
  }

  const navigateToCurrentPath = () => {
    console.log('Navigating to:', currentPath) // Debugging line
    let currentNode = fileTree
    for (const folder of currentPath) {
      const nextNode = currentNode.find(n => n.name === folder && n.type === 'folder')
      if (nextNode && nextNode.children) {
        currentNode = nextNode.children
      } else {
        console.log('Folder not found:', folder) // Debugging line
        currentNode = [] // Reset to an empty array if folder is not found
        break
      }
    }
    console.log('Current nodes:', currentNode) // Debugging line
    setCurrentNodes(currentNode)
  }

  const handleFolderClick = (folderName: string) => {
    console.log('Folder clicked:', folderName) // Debugging line
    setCurrentPath([...currentPath, folderName])
  }

  const handleFileClick = (fileName: string) => {
    const filePath = [...currentPath, fileName].join('/')
    location.href = "https://media.nextgensell.com/files/"+filePath;
    console.log('File clicked:', filePath) // Logs the full path of the file
  }

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  const sortedNodes = [...currentNodes].sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1
    if (a.type === 'file' && b.type === 'folder') return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b bg-gray-100 px-6 dark:border-gray-800 dark:bg-gray-900">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={() => setCurrentPath([])}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              {currentPath.map((folder, index) => (
                <BreadcrumbItem key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbLink href="#" onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}>
                    {folder}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center space-x-2">
            {currentPath.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleBackClick}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            )}
            {currentPath.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setCurrentPath([])}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : sortedNodes.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">This folder is empty.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sortedNodes.map((item, index) => (
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
    </div>
  )
}
