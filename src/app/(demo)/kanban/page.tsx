import Link from "next/link";

import KanbanBoard from "@/components/kanban-board";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function PersonalNotes() {
  return (
    <ContentLayout title="Personal Sticky Notes">
      
      <KanbanBoard/>
    </ContentLayout>
  );
}
