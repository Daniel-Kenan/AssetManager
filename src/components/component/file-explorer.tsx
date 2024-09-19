'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { FolderIcon, FileIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon, LayoutGridIcon, LayoutListIcon, UploadIcon, FolderPlusIcon, SearchIcon } from 'lucide-react'

interface FileItem {
  name: string
  type: 'file' | 'folder'
}

interface TreeNode {
  name: string
  type: 'file' | 'folder'
  children?: TreeNode[],
  fullPath?: string[]
}

export default function FileExplorer() {
  const [fileTree, setFileTree] = useState<TreeNode[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [currentNodes, setCurrentNodes] = useState<TreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGridView, setIsGridView] = useState(true)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [itemToRename, setItemToRename] = useState<TreeNode | null>(null)
  const [newName, setNewName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TreeNode[]>([])

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
        console.log('Fetched data:', data)
        const tree = buildFileTree(data)
        setFileTree(tree)
        setCurrentNodes(tree)
      })
      .catch(error => console.error('Error fetching files:', error))
      .finally(() => setIsLoading(false))
  }

  const buildFileTree = (entries: FileItem[]): TreeNode[] => {
    const root: TreeNode[] = []

    entries.forEach((item) => {
      console.log('Processing item:', item)
      const pathParts = item.name.split('/').filter(Boolean)
      addToTree(root, pathParts, item)
    })

    console.log('Built file tree:', root)
    return root
  }

  const addToTree = (tree: TreeNode[], pathParts: string[], item: FileItem) => {
    const [first, ...rest] = pathParts

    let node = tree.find(n => n.name === first)

    if (!node) {
      node = {
        name: first,
        type: rest.length === 0 ? item.type : 'folder',
        children: rest.length > 0 ? [] : []
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
    console.log('Navigating to:', currentPath)
    let currentNode = fileTree
    for (const folder of currentPath) {
      const nextNode = currentNode.find(n => n.name === folder && n.type === 'folder')
      if (nextNode && nextNode.children) {
        currentNode = nextNode.children
      } else {
        console.log('Folder not found:', folder)
        currentNode = []
        break
      }
    }
    console.log('Current nodes:', currentNode)
    setCurrentNodes(currentNode)
  }

  const handleFolderClick = (folderName: string) => {
    console.log('Folder clicked:', folderName)
    setCurrentPath([...currentPath, folderName])
  }

  const handleFileClick = (fileName: string) => {
    const filePath = [...currentPath, fileName].join('/')
    location.href = "https://media.nextgensell.com/files/"+filePath;
    console.log('File clicked:', filePath)
  }

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  const sortedNodes = [...currentNodes].sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1
    if (a.type === 'file' && b.type === 'folder') return 1
    return a.name.localeCompare(b.name)
  })

  const toggleView = () => {
    setIsGridView(!isGridView)
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Uploading file:', file.name);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', currentPath.join('/')); // Upload to the current directory
  
        try {
          const response = await fetch('https://media.nextgensell.com/files/upload', {
            method: 'POST',
            body: formData
          });
  
          const result = await response.json();
  
          if (response.ok) {
            console.log(`File uploaded successfully: ${result.file_path}`);
            if (result.access_url) {
              console.log('File is publicly accessible at:', result.access_url);
            }
          } else {
            console.error('Upload failed:', result.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
      // Refresh the file list after all uploads are complete
      fetchFiles();
    }
  }

  const handleCreateFolder = () => {
    if (newFolderName) {
      const folderPath = currentPath.join('/') 
      console.log('Creating folder:', newFolderName, 'in path:', folderPath);
  
      // Clear input and close dialog
      setNewFolderName('');
      setIsCreateFolderDialogOpen(false);
  
      // Send a request to create the folder on the server
      fetch('https://media.nextgensell.com/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folder: folderPath ? `${folderPath}/${newFolderName}`:newFolderName
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to create folder');
          }
          return response.json();
        })
        .then(data => {
          console.log('Folder created successfully:', data);
          // Refresh the file list after folder creation
          fetchFiles();
        })
        .catch(error => {
          console.error('Error creating folder:', error);
        });
    }
  };

 const handleRename = () => {
  if (itemToRename && newName) {
    const folderPath = currentPath.join('/');
    const currentItemPath = folderPath ? `${folderPath}/${itemToRename.name}` : itemToRename.name;
    const newItemPath = folderPath ? `${folderPath}/${newName}` : newName;

    console.log('Renaming', currentItemPath, 'to', newItemPath);

    // Clear input and close dialog
    setNewName('');
    setIsRenameDialogOpen(false);
    setItemToRename(null);

    // Send a request to rename the file or folder on the server
    fetch('http:localhost:5000/file/rename', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldName: currentItemPath,
        newName: newItemPath,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to rename item');
        }
        return response.json();
      })
      .then(data => {
        console.log('Item renamed successfully:', data);
        // Refresh the file list after renaming
        fetchFiles();
      })
      .catch(error => {
        console.error('Error renaming item:', error);
      });
  }
};


  const handleMove = (item: TreeNode) => {
    console.log('Moving', item.name, 'to a new location')
    // Here you would typically open a dialog to select the new location
    // and then send a request to your server to move the item
    // After moving, you might want to refresh the file list
    // fetchFiles()
  }

  const handleDelete = (item: TreeNode) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${item.type === 'folder' ? 'this folder and all its contents?' : 'this file?'}`);
    const folderPath = currentPath.join('/');
    let toDel = folderPath ? `${folderPath}/${item.name}` : item.name;
    if (confirmDelete) {
      const url = item.type === 'folder'
        ? 'https://media.nextgensell.com/folders'
        : `https://media.nextgensell.com/files/${encodeURIComponent(toDel)}`;
  
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: item.type === 'folder'
          ? JSON.stringify({ folder: `${toDel}` })
          : null,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Deletion successful:', data);
          fetchFiles();  // Refresh the file list after deletion
        })
        .catch(error => console.error('Error deleting item:', error));
    }
  }

  const searchAttachment = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      return
    }

    const results: TreeNode[] = []
    const searchInTree = (nodes: TreeNode[], path: string[] = []) => {
      nodes.forEach(node => {
        const fullPath = [...path, node.name]
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({ ...node, fullPath })
        }
        if (node.children) {
          searchInTree(node.children, fullPath)
        }
      })
    }

    searchInTree(fileTree)
    setSearchResults(results)
  }

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
            <Button variant="outline" size="sm" onClick={toggleView}>
              {isGridView ? <LayoutListIcon className="h-4 w-4" /> : <LayoutGridIcon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
              multiple
            />
            <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlusIcon className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                />
                <Button onClick={handleCreateFolder}>Create</Button>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => searchAttachment(e.target.value)}
                className="pl-8"
              />
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : searchQuery ? (
            searchResults.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No results found.</div>
            ) : (
              <div className={isGridView ? 
                "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : 
                "flex flex-col space-y-2"
              }>
                {searchResults.map((item, index) => (
                  <ContextMenu key={index}>
                    <ContextMenuTrigger>
                      <div 
                        className={`group relative rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 cursor-pointer ${
                          isGridView ? '' : 'flex items-center space-x-4'
                        }`}
                        onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : handleFileClick(item.name)}
                      >
                        <div className={`flex ${isGridView ? 'h-20 w-full' : 'h-10 w-10'} items-center justify-center`}>
                          {item.type === 'folder' ? (
                            <FolderIcon className={`${isGridView ? 'h-12 w-12' : 'h-6 w-6'} text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300`} />
                          ) : (
                            <FileIcon className={`${isGridView ? 'h-12 w-12' : 'h-6 w-6'} text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300`} />
                          )}
                        </div>
                        <div className={isGridView ? "mt-4 text-center" : "flex-grow"}>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{item.name}</h3>
                          {isGridView && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.type}</p>}
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{(item as any).fullPath?.join('/')}</p>
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onSelect={() => {
                        setItemToRename(item)
                        setNewName(item.name)
                        setIsRenameDialogOpen(true)
                      }}>
                        Rename
                      </ContextMenuItem>
                     
                      <ContextMenuItem onSelect={() => handleDelete(item)}>
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            )
          ) : sortedNodes.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">This folder is empty.</div>
          ) : (
            <div className={isGridView ? 
              "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : 
              "flex flex-col space-y-2"
            }>
              {sortedNodes.map((item, index) => (
                <ContextMenu key={index}>
                  <ContextMenuTrigger>
                    <div 
                      className={`group relative rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 cursor-pointer ${
                        isGridView ? '' : 'flex items-center space-x-4'
                      }`}
                      onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : handleFileClick(item.name)}
                    >
                      <div className={`flex ${isGridView ? 'h-20 w-full' : 'h-10 w-10'} items-center justify-center`}>
                        {item.type === 'folder' ? (
                          <FolderIcon className={`${isGridView ? 'h-12 w-12' : 'h-6 w-6'} text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300`} />
                        ) : (
                          <FileIcon className={`${isGridView ? 'h-12 w-12' : 'h-6 w-6'} text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300`} />
                        )}
                      </div>
                      <div className={isGridView ? "mt-4 text-center" : "flex-grow"}>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{item.name}</h3>
                        {isGridView && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.type}</p>}
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onSelect={() => {
                      setItemToRename(item)
                      setNewName(item.name)
                      setIsRenameDialogOpen(true)
                    }}>
                      Rename
                    </ContextMenuItem>
                   
                    <ContextMenuItem onSelect={() => handleDelete(item)}>
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          )}
        </div>
      </div>
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {itemToRename?.type}</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
          />
          <Button onClick={handleRename}>Rename</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}