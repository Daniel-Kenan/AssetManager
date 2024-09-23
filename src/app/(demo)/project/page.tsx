import Link from "next/link";

import KanbanBoard from "@/components/kanban-boardProject";
import { ContentLayout } from "@/components/admin-panel/content-layout";


export default function PersonalNotes() {
  return (
    <ContentLayout title="Manage Project">
      
      <KanbanBoard/>
    </ContentLayout>
  );
}
