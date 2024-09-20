import Link from "next/link";

import KanbanBoard from "@/components/kanban-board";
import { ContentLayout } from "@/components/admin-panel/content-layout";


export default function PersonalNotes() {
  return (
    <ContentLayout title="Sales Funnel Board">
      
      <KanbanBoard/>
    </ContentLayout>
  );
}
