import {
  Tag,
  Users,
  Settings,
  Bookmark,
  NotebookPen,
  LayoutGrid,
  LucideIcon,SquareParking,
  SquareKanban,Inbox,FolderClosed,
  Building2 ,
  ListTodo 
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/messages",
          label: "Messages",
          active: pathname.includes("/messages"),
          icon: Inbox,
          submenus: []
        },
        {
          href: "/kanban",
          label: "Sales Funnel",
          active: pathname.includes("/kanban"),
          icon: SquareKanban,
          submenus: []
        },
        // {
        //   href: "/personalnotes",
        //   label: "My Tasks",
        //   active: pathname.includes("/personalnotes"),
        //   icon: ListTodo ,
        //   submenus: []
        // },
        {
          href: "/personalnotes",
          label: "Personal Notes",
          active: pathname.includes("/personalnotes"),
          icon: NotebookPen,
          submenus: []
        },
        {
          href: "/file-explorer",
          label: "Files Explorer",
          active: pathname.includes("/file-explorer"),
          icon: FolderClosed,
          submenus: []
        }
        ,
        {
          href: "",
          label: "Projects",
          active: pathname.includes("/posts"),
          icon: SquareParking,
          submenus: [
            {
              href: "/Projects",
              label: "- Projects Summary -",
              active: pathname === "/posts"
            },
            {
              href: "/posts/new",
              label: "New Post",
              active: pathname === "/posts/new"
            },
            {
              href: "/posts",
              label: "All Posts",
              active: pathname === "/posts"
            },
            {
              href: "/posts/new",
              label: "New Post",
              active: pathname === "/posts/new"
            }
          ]
        }
      ]
    },
    {
      groupLabel: "Clients",
      menus: [
        {
          href: "/companies",
          label: "Companies",
          active: pathname.includes("/companies"),
          icon:  Building2 ,
          submenus: []
        }
      ]
    }
    ,
    
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Collaborators",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        }
      ]
    }
  ];
}
