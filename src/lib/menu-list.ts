import {
  Tag,
  Users,
  Settings,
  Bookmark,
  NotebookPen,
  LayoutGrid,
  LucideIcon,SquareParking,
  SquareKanban,Inbox,FolderClosed
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
          href: "/categories",
          label: "Messages",
          active: pathname.includes("/categories"),
          icon: Inbox,
          submenus: []
        },
        {
          href: "/categories",
          label: "Kanban",
          active: pathname.includes("/categories"),
          icon: SquareKanban,
          submenus: []
        },
        {
          href: "/tags",
          label: "Personal Notes",
          active: pathname.includes("/tags"),
          icon: NotebookPen,
          submenus: []
        },
        {
          href: "/tags",
          label: "Files Explorer",
          active: pathname.includes("/tags"),
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
              href: "/posts",
              label: "All Posts",
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
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
